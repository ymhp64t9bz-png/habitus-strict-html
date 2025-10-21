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
    // Buscar conquistas já desbloqueadas
    const { data: existing, error: fetchError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    const unlockedIds = new Set((existing || []).map(a => a.achievement_id));

    // Verificar cada conquista - só desbloquear quando 100% completa
    for (const achievement of achievementChecks) {
      const shouldUnlock = achievement.check(data);

      if (shouldUnlock && !unlockedIds.has(achievement.id)) {
        // Desbloquear conquista SOMENTE quando criterio for 100% atendido
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
            progress: 100,
          });
      }
      // Não armazenar progresso parcial - conquista só aparece quando 100% completa
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}
