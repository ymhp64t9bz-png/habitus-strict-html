import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "./UserContext";
import { updateStreakOnCompletion, checkStreakIntegrity } from "@/lib/streakManager";
import { checkAndUnlockAchievements } from "@/lib/achievementsManager";

interface Habit {
  id: string;
  title: string;
  frequency: string;
  color: string;
  icon: string;
  goal_value: number;
  current_value: number;
  is_complete: boolean;
  is_task: boolean;
  user_id: string;
  unit?: string;
  last_completed_date?: string;
  broken?: boolean;
}

interface HabitsContextType {
  habits: Habit[];
  tasks: Habit[];
  loading: boolean;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'user_id'>) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  updateProgress: (id: string, value: number) => Promise<void>;
  refreshHabits: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user?.user_id) {
      loadHabits();
      checkStreakIntegrity(user.user_id);
      checkBrokenHabits();
    }
  }, [user?.user_id]);

  const checkBrokenHabits = async () => {
    if (!user?.user_id) return;

    try {
      const { data: habitsData, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.user_id)
        .eq('is_task', false)
        .eq('broken', false);

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      for (const habit of habitsData || []) {
        if (habit.current_value > 0 && habit.last_completed_date) {
          const lastDate = habit.last_completed_date;
          if (lastDate < yesterdayStr && lastDate !== today) {
            await supabase
              .from('habits')
              .update({ broken: true })
              .eq('id', habit.id);
          }
        }
      }

      await loadHabits();
    } catch (error) {
      console.error('Error checking broken habits:', error);
    }
  };

  const loadHabits = async () => {
    if (!user?.user_id) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const allHabits = data || [];
      setHabits(allHabits.filter(h => !h.is_task));
      setTasks(allHabits.filter(h => h.is_task));
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    if (!user?.user_id) return;

    try {
      const { error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.user_id);

      if (error) throw error;
      await loadHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user?.user_id) return;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.user_id);

      if (error) throw error;
      await loadHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const addHabit = async (habit: Omit<Habit, 'id' | 'user_id'>) => {
    if (!user?.user_id) return;

    try {
      const { error } = await supabase
        .from('habits')
        .insert({
          ...habit,
          user_id: user.user_id,
        });

      if (error) throw error;
      await loadHabits();

      const { data: habitsCount } = await supabase
        .from('habits')
        .select('id', { count: 'exact' })
        .eq('user_id', user.user_id)
        .eq('is_task', false);

      if (habitsCount && habitsCount.length === 1) {
        await checkAndUnlockAchievements(user.user_id, {
          streak: user.streak,
          totalHabitsCompleted: user.totalHabitsCompleted,
          habitsCount: 1,
        });
      }
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const toggleComplete = async (id: string) => {
    if (!user?.user_id) return;

    try {
      const habit = [...habits, ...tasks].find(h => h.id === id);
      if (!habit) return;

      const newCompleteStatus = !habit.is_complete;

      const { error } = await supabase
        .from('habits')
        .update({ is_complete: newCompleteStatus })
        .eq('id', id)
        .eq('user_id', user.user_id);

      if (error) throw error;

      if (newCompleteStatus && !habit.is_task) {
        await supabase
          .from('habit_completions')
          .insert({
            habit_id: id,
            user_id: user.user_id,
            value: 1,
          });

        await updateStreakOnCompletion(user.user_id);
      }

      await loadHabits();
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  const updateProgress = async (id: string, value: number) => {
    if (!user?.user_id) return;

    try {
      const habit = [...habits, ...tasks].find(h => h.id === id);
      if (!habit) return;

      const today = new Date().toISOString().split('T')[0];
      
      // Para hábitos (não tarefas)
      if (!habit.is_task) {
        // Se já completou hoje, não fazer nada (evita múltiplos cliques no mesmo dia)
        if (habit.last_completed_date === today) {
          return;
        }

        // Incrementar dias cumpridos
        const newValue = habit.current_value + 1;
        const isComplete = newValue >= habit.goal_value;

        const { error } = await supabase
          .from('habits')
          .update({
            current_value: newValue,
            is_complete: isComplete,
            last_completed_date: today,
          })
          .eq('id', id)
          .eq('user_id', user.user_id);

        if (error) throw error;

        // Atualizar streak sempre que completa um dia
        const { data: profile } = await supabase
          .from('profiles')
          .select('streak')
          .eq('user_id', user.user_id)
          .single();

        await supabase
          .from('profiles')
          .update({ streak: (profile?.streak || 0) + 1 })
          .eq('user_id', user.user_id);

        if (isComplete) {
          await supabase
            .from('habit_completions')
            .insert({
              habit_id: id,
              user_id: user.user_id,
              value: newValue,
            });

          await checkAndUnlockAchievements(user.user_id, {
            streak: (profile?.streak || 0) + 1,
            totalHabitsCompleted: newValue,
            habitsCount: habits.length,
          });
        }
      } else {
        // Para tarefas, incrementar normalmente
        const isComplete = value >= habit.goal_value;

        const { error } = await supabase
          .from('habits')
          .update({
            current_value: value,
            is_complete: isComplete,
          })
          .eq('id', id)
          .eq('user_id', user.user_id);

        if (error) throw error;

        if (isComplete) {
          await supabase
            .from('habit_completions')
            .insert({
              habit_id: id,
              user_id: user.user_id,
              value: value,
            });
        }
      }

      await loadHabits();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const refreshHabits = async () => {
    await loadHabits();
  };

  const clearAllData = async () => {
    if (!user?.user_id) return;
    
    try {
      await supabase
        .from('habits')
        .delete()
        .eq('user_id', user.user_id);
      
      await loadHabits();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        tasks,
        loading,
        updateHabit,
        deleteHabit,
        addHabit,
        toggleComplete,
        updateProgress,
        refreshHabits,
        clearAllData,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error("useHabits must be used within HabitsProvider");
  }
  return context;
}
