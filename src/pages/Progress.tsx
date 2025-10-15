import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LiquidFillCard } from "@/components/habits/LiquidFillCard";
import { FuelTank } from "@/components/progress/FuelTank";
import { initialHabits } from "@/data/habits";

export default function Progress() {
  const navigate = useNavigate();
  const [habits] = useState(initialHabits.filter(h => h.type === 'habit'));
  
  const completedHabits = habits.filter(h => h.progress === 100).length;
  const totalProgress = Math.round((completedHabits / habits.length) * 100);

  return (
    <div className="min-h-screen pb-24">
      <Header title="Progresso" showBack showSettings onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        <section>
          <h2 className="text-sm text-primary font-medium mb-4">Progresso Geral</h2>
          <div className="bg-card rounded-2xl p-5 text-center shadow-sm">
            <FuelTank percentage={totalProgress} />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm text-primary font-medium mb-4">Todos os Hábitos</h2>
          <div className="space-y-4">
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
