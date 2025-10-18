import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Edit2, Trophy, Lock } from "lucide-react";
import { LiquidFillCard } from "@/components/habits/LiquidFillCard";
import { useHabits } from "@/contexts/HabitsContext";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { achievements } from "@/data/achievements";

export default function Profile() {
  const navigate = useNavigate();
  const { habits: allHabits } = useHabits();
  const { user, loading } = useUser();
  const [unlockedAchievements, setUnlockedAchievements] = useState<any[]>([]);
  
  const habits = allHabits.filter(h => !h.is_task);
  const activeHabitsCount = habits.length;

  useEffect(() => {
    if (user?.user_id) {
      loadUnlockedAchievements();
    }
  }, [user?.user_id]);

  const loadUnlockedAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user?.user_id)
        .order('unlocked_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setUnlockedAchievements(data || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  // Pegar as 3 melhores conquistas ou preencher com cadeados
  const featuredAchievements = Array.from({ length: 3 }, (_, index) => {
    if (index < unlockedAchievements.length) {
      const achievementId = unlockedAchievements[index].achievement_id;
      const achievement = achievements.find(a => a.id === achievementId);
      return achievement ? { ...achievement, locked: false } : null;
    }
    return { locked: true };
  }).filter(Boolean);

  if (loading || !user) {
    return null;
  }

  const unlockedCount = unlockedAchievements.length;

  return (
    <div className="min-h-screen pb-24">
      <Header title="Perfil" showBack showSettings onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/edit-profile")}
            className="min-w-[44px] min-h-[44px]"
          >
            <Edit2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          
          <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
          <p className="text-muted-foreground text-sm mb-1">{user.email}</p>
          <p className="text-sm font-medium text-primary mb-1">{user.profession}</p>
          <p className="text-sm text-center px-4">{user.bio}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 my-5">
          <div className="bg-card rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold mb-1">{unlockedCount}</p>
            <p className="text-sm text-muted-foreground">Conquistas</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold mb-1">{activeHabitsCount}</p>
            <p className="text-sm text-muted-foreground">Hábitos</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold mb-1">{user.streak}</p>
            <p className="text-sm text-muted-foreground">Dias</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Conquistas em Destaque
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {featuredAchievements.map((achievement: any, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm min-h-[100px]"
              >
                {achievement.locked ? (
                  <>
                    <Lock className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Nenhuma conquista desbloqueada</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl mb-2">{achievement.icon}</span>
                    <span className="text-xs font-medium">{achievement.name}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <section className="mt-6">
          <h2 className="text-sm text-primary font-medium mb-4">Meus Hábitos</h2>
          <div className="space-y-3">
            {habits.map((habit) => (
              <LiquidFillCard key={habit.id} habit={habit} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
