import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Habit } from "@/types/habit";
import { initialHabits, initialTasks } from "@/data/habits";

interface HabitsContextType {
  habits: Habit[];
  tasks: Habit[];
  updateHabit: (id: number, updates: Partial<Habit>) => void;
  deleteHabit: (id: number) => void;
  addHabit: (habit: Habit) => void;
  toggleComplete: (id: number) => void;
  updateProgress: (id: number, value: number) => void;
  clearAllData: () => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem("habitus_habits");
    return stored ? JSON.parse(stored) : initialHabits;
  });

  const [tasks, setTasks] = useState<Habit[]>(() => {
    const stored = localStorage.getItem("habitus_tasks");
    return stored ? JSON.parse(stored) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem("habitus_habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("habitus_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const updateHabit = (id: number, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteHabit = (id: number) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addHabit = (habit: Habit) => {
    if (habit.type === "habit") {
      setHabits(prev => [...prev, habit]);
    } else {
      setTasks(prev => [...prev, habit]);
    }
  };

  const toggleComplete = (id: number) => {
    setHabits(prev => prev.map(h =>
      h.id === id ? { ...h, progress: h.progress === 100 ? 0 : 100 } : h
    ));
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, progress: t.progress === 100 ? 0 : 100 } : t
    ));
  };

  const updateProgress = (id: number, value: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id && h.target) {
        const progress = Math.round((value / h.target) * 100);
        return { ...h, currentValue: value, progress };
      }
      return h;
    }));
  };

  const clearAllData = () => {
    setHabits([]);
    setTasks([]);
    localStorage.removeItem("habitus_habits");
    localStorage.removeItem("habitus_tasks");
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        tasks,
        updateHabit,
        deleteHabit,
        addHabit,
        toggleComplete,
        updateProgress,
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
