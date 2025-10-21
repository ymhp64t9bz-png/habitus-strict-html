import { supabase } from "@/integrations/supabase/client";

interface AchievementCheck {
  id: string;
  check: (data: {
    streak: number;
    totalHabitsCompleted: number;
    habitsCount: number;
  }) => boolean;
  progress?: (data: {
    streak: number;
    totalHabitsCompleted: number;
    habitsCount: number;
  }) => number;
}

const achievementChecks: AchievementCheck[] = [
  {
    id: "first-habit",
    check: ({ habitsCount }) => habitsCount >= 1,
  },
  {
    id: "first-check",
    check: ({ totalHabitsCompleted }) => totalHabitsCompleted >= 1,
  },
  {
    id: "mode-on",
    check: ({ streak }) => streak >= 2,
  },
  {
    id: "no-pause",
    check: ({ streak }) => streak >= 5,
  },
  {
    id: "discipline",
    check: ({ totalHabitsCompleted }) => totalHabitsCompleted >= 10,
    progress: ({ totalHabitsCompleted }) => Math.min((totalHabitsCompleted / 10) * 100, 100),
  },
  {
    id: "right-rhythm",
    check: ({ streak }) => streak >= 10,
    progress: ({ streak }) => Math.min((streak / 10) * 100, 100),
  },
  {
    id: "unbreakable-focus",
    check: ({ streak }) => streak >= 15,
    progress: ({ streak }) => Math.min((streak / 15) * 100, 100),
  },
  {
    id: "unstoppable",
    check: ({ streak }) => streak >= 21,
    progress: ({ streak }) => Math.min((streak / 21) * 100, 100),
  },
  {
    id: "new-identity",
    check: ({ streak }) => streak >= 30,
    progress: ({ streak }) => Math.min((streak / 30) * 100, 100),
  },
  {
    id: "legend",
    check: ({ streak }) => streak >= 100,
    progress: ({ streak }) => Math.min((streak / 100) * 100, 100),
  },
];

export async function checkAndUnlockAchievements(userId: string, data: {
  streak: number;
  totalHabitsCompleted: number;
  habitsCount: number;
}) {
  try {
    console.log('🏆 Verificando conquistas:', data);
    
    // Buscar conquistas já desbloqueadas
    const { data: existing, error: fetchError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Erro ao buscar conquistas:', fetchError);
      throw fetchError;
    }

    const unlockedIds = new Set((existing || []).map(a => a.achievement_id));
    console.log('🔓 Conquistas já desbloqueadas:', Array.from(unlockedIds));

    // Primeiro, remover conquistas que não deveriam estar desbloqueadas
    for (const userAchievement of (existing || [])) {
      const achievementCheck = achievementChecks.find(a => a.id === userAchievement.achievement_id);
      if (achievementCheck) {
        const shouldBeUnlocked = achievementCheck.check(data);
        if (!shouldBeUnlocked) {
          console.log('🗑️ Removendo conquista inválida:', userAchievement.achievement_id);
          await supabase
            .from('user_achievements')
            .delete()
            .eq('id', userAchievement.id);
          unlockedIds.delete(userAchievement.achievement_id);
        }
      }
    }

    // Verificar cada conquista - só desbloquear quando 100% completa
    for (const achievement of achievementChecks) {
      const shouldUnlock = achievement.check(data);

      if (shouldUnlock && !unlockedIds.has(achievement.id)) {
        console.log('✨ Desbloqueando conquista:', achievement.id);
        
        const { error: insertError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            progress: 100,
          });

        if (insertError) {
          console.error('❌ Erro ao desbloquear conquista:', achievement.id, insertError);
        } else {
          console.log('✅ Conquista desbloqueada com sucesso:', achievement.id);
        }
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}
