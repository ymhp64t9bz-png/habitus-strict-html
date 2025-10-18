import { supabase } from "@/integrations/supabase/client";
import { checkAndUnlockAchievements } from "./achievementsManager";

export async function updateStreakOnCompletion(userId: string) {
  try {
    // Buscar perfil atual
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('streak, last_completion_date, total_habits_completed')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;

    const today = new Date().toISOString().split('T')[0];
    const lastDate = profile?.last_completion_date;
    
    let newStreak = profile?.streak || 0;
    
    // Se já completou hoje, não fazer nada
    if (lastDate === today) {
      return;
    }

    // Verificar se todos os hábitos de hoje foram completados
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('id, is_complete, is_task')
      .eq('user_id', userId)
      .eq('is_task', false);

    if (habitsError) throw habitsError;

    const allCompleted = habits?.every(h => h.is_complete) || false;

    if (!allCompleted) {
      return; // Não atualizar streak se nem todos os hábitos foram completados
    }

    // Calcular diferença de dias
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr) {
      // Continua o streak
      newStreak += 1;
    } else if (!lastDate || lastDate < yesterdayStr) {
      // Quebrou o streak ou primeiro dia
      newStreak = 1;
    }

    // Atualizar perfil
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        last_completion_date: today,
        total_habits_completed: (profile?.total_habits_completed || 0) + 1,
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Verificar conquistas
    const { data: habitsCount } = await supabase
      .from('habits')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_task', false);

    await checkAndUnlockAchievements(userId, {
      streak: newStreak,
      totalHabitsCompleted: (profile?.total_habits_completed || 0) + 1,
      habitsCount: habitsCount?.length || 0,
    });

  } catch (error) {
    console.error('Error updating streak:', error);
  }
}

export async function checkStreakIntegrity(userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('last_completion_date, streak')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const lastDate = profile?.last_completion_date;

    // Se não completou ontem nem hoje, zerar streak
    if (lastDate && lastDate < yesterdayStr) {
      await supabase
        .from('profiles')
        .update({ streak: 0 })
        .eq('user_id', userId);
    }
  } catch (error) {
    console.error('Error checking streak integrity:', error);
  }
}
