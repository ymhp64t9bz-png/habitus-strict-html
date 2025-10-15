import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LiquidFillCard } from "@/components/habits/LiquidFillCard";
import { initialHabits, achievements } from "@/data/habits";
import { Edit2 } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [habits] = useState(initialHabits);

  return (
    <div className="min-h-screen pb-24">
      <Header title="Perfil" showBack showSettings onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="flex flex-col items-center py-5">
          <div className="relative w-[100px] h-[100px] rounded-full bg-primary flex items-center justify-center text-white text-3xl mb-4">
            LS
            <button
              onClick={() => navigate("/edit-profile")}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-1">Lucas Silva</h2>
          <p className="text-muted-foreground mb-2">lucas.silva@email.com</p>
          <p className="text-muted-foreground italic text-center">Desenvolvedor de software</p>
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

        <section className="mt-6">
          <h2 className="text-sm text-primary font-medium mb-4">Conquistas Recentes</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {achievements
              .filter(a => !a.locked && a.progress === 100)
              .slice(0, 3)
              .map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl shadow-sm"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="text-xs font-medium truncate">{achievement.name}</p>
                </div>
              ))}
          </div>
        </section>

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
