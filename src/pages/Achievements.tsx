import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { achievements } from "@/data/habits";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

export default function Achievements() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [userAchievements, setUserAchievements] = useState<Record<string, any>>({});

  useEffect(() => {
    if (user?.user_id) {
      loadUserAchievements();
    }
  }, [user?.user_id]);

  const loadUserAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user?.user_id);

      if (error) throw error;

      const achievementsMap = (data || []).reduce((acc, curr) => {
        acc[curr.achievement_id] = curr;
        return acc;
      }, {} as Record<string, any>);

      setUserAchievements(achievementsMap);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const enrichedAchievements = achievements.map(achievement => {
    const userAchievement = userAchievements[achievement.id];
    return {
      ...achievement,
      locked: !userAchievement,
      progress: userAchievement?.progress || 0,
    };
  });

  const bronzeAchievements = enrichedAchievements.filter((a) => a.level === "bronze");
  const silverAchievements = enrichedAchievements.filter((a) => a.level === "silver");
  const goldAchievements = enrichedAchievements.filter((a) => a.level === "gold");

  const AchievementCard = ({ achievement }: { achievement: typeof achievements[0] }) => (
    <div className={cn("bg-card rounded-2xl p-4 mb-4 shadow-sm flex gap-4", achievement.locked && "opacity-60")}>
      <div
        className={cn(
          "w-[50px] h-[50px] rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
          achievement.level === "bronze" && "bg-[#cd7f32]/10 text-[#cd7f32]",
          achievement.level === "silver" && "bg-[#c0c0c0]/10 text-[#c0c0c0]",
          achievement.level === "gold" && "bg-[#ffd700]/10 text-[#ffd700]",
          achievement.locked && "bg-muted/10 text-muted"
        )}
      >
        {achievement.icon}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold mb-1">{achievement.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{achievement.description}</p>
        <p className="text-xs text-muted-foreground italic">{achievement.criteria}</p>
        {!achievement.locked && achievement.progress < 100 && (
          <div className="w-full h-1 bg-primary/20 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${achievement.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24">
      <Header title="Conquistas" showBack showSettings onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🥉</span>
            Nível Iniciante — Primeiros Passos
          </h2>
          {bronzeAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🥈</span>
            Nível Intermediário — Rumo à Constância
          </h2>
          {silverAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🥇</span>
            Nível Avançado — Maestria Absoluta
          </h2>
          {goldAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
