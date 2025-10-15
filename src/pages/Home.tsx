import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HabitCard } from "@/components/habits/HabitCard";
import { initialHabits } from "@/data/habits";
import { Flame } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [habits] = useState(initialHabits);

  const completedHabits = habits.filter(h => h.progress === 100).length;
  const progressPercentage = Math.round((completedHabits / habits.length) * 100);

  const handleEdit = (id: number) => {
    navigate(`/edit-habit/${id}`);
  };

  const handleShare = (id: number) => {
    alert(`Compartilhando hábito ${id}`);
  };

  return (
    <div className="min-h-screen pb-24">
      <Header title="Início" showSettings showThemeToggle />

      <div className="max-w-[414px] mx-auto p-5">
        <section className="gradient-primary text-white rounded-2xl p-5 my-5 text-center shadow-lg shadow-primary/20">
          <h1 className="text-2xl font-bold mb-2">Bom dia, Lucas!</h1>
          <p>Continue sua jornada de hábitos. Você está indo muito bem!</p>
        </section>

        <section className="bg-card rounded-2xl p-4 my-5 shadow-sm">
          <p className="text-sm text-primary font-medium mb-1">Progresso Hoje</p>
          <p className="text-lg mb-2">{completedHabits}/{habits.length} hábitos concluídos</p>
          <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </section>

        <section className="bg-card rounded-2xl p-4 my-5 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm text-primary font-medium mb-1">Streak</h3>
            <p className="text-xl font-bold">3 dias 🔥</p>
          </div>
          <Flame className="w-8 h-8 text-red-500" />
        </section>

        <section className="my-6">
          <h2 className="text-xl font-bold mb-4">Hábitos</h2>
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={handleEdit}
                onShare={handleShare}
                showActions
              />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
