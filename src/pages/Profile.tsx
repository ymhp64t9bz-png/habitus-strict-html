import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Edit2, Trophy, Target, Calendar } from "lucide-react";
import { LiquidFillCard } from "@/components/habits/LiquidFillCard";
import { useHabits } from "@/contexts/HabitsContext";
import { useUser } from "@/contexts/UserContext";

const achievementData: Record<string, { name: string; icon: string }> = {
  first_habit: { name: "Primeiro Hábito", icon: "🎯" },
  week_streak: { name: "7 Dias Seguidos", icon: "🔥" },
  water_champion: { name: "Campeão da Água", icon: "💧" },
  early_bird: { name: "Madrugador", icon: "🌅" },
  book_lover: { name: "Amante dos Livros", icon: "📚" },
  fitness_master: { name: "Mestre Fitness", icon: "💪" },
};

export default function Profile() {
  const navigate = useNavigate();
  const { habits } = useHabits();
  const { user } = useUser();

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
            <p className="text-2xl font-bold mb-1">15</p>
            <p className="text-sm text-muted-foreground">Conquistas</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold mb-1">5</p>
            <p className="text-sm text-muted-foreground">Hábitos</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold mb-1">120</p>
            <p className="text-sm text-muted-foreground">Dias</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Conquistas em Destaque
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {user.selectedAchievements.map((achievementId) => {
              const achievement = achievementData[achievementId];
              if (!achievement) return null;
              return (
                <div
                  key={achievementId}
                  className="bg-card rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm"
                >
                  <span className="text-3xl mb-2">{achievement.icon}</span>
                  <span className="text-xs font-medium">{achievement.name}</span>
                </div>
              );
            })}
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
