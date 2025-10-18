import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LiquidFillCard } from "@/components/habits/LiquidFillCard";
import { FuelTank } from "@/components/progress/FuelTank";
import { useHabits } from "@/contexts/HabitsContext";

export default function Progress() {
  const navigate = useNavigate();
  const { habits: allHabits } = useHabits();
  const habits = allHabits.filter(h => !h.is_task);
  
  // Calcular progresso geral baseado em dias totais cumpridos
  const totalDaysCompleted = habits.reduce((sum, h) => sum + (h.current_value || 0), 0);
  const totalDaysGoal = habits.reduce((sum, h) => sum + h.goal_value, 0);
  const totalProgress = totalDaysGoal > 0 ? Math.round((totalDaysCompleted / totalDaysGoal) * 100) : 0;

  return (
    <div className="min-h-screen pb-24">
      <Header title="Progresso" showBack showSettings onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        <section className="mb-10">
          <h2 className="text-sm text-primary font-medium mb-4">Progresso Geral</h2>
          <FuelTank percentage={totalProgress} />
        </section>

        <section>
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
