import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LiquidFillCard } from "@/components/habits/LiquidFillCard";
import { initialHabits, initialTasks } from "@/data/habits";
import { Flame, Swords } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState(initialHabits);
  const [tasks, setTasks] = useState(initialTasks);

  const completedHabits = habits.filter(h => h.progress === 100).length;
  const progressPercentage = Math.round((completedHabits / habits.length) * 100);

  const handleToggleComplete = (id: number) => {
    setHabits(prev => prev.map(h =>
      h.id === id ? { ...h, progress: h.progress === 100 ? 0 : 100 } : h
    ));
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, progress: t.progress === 100 ? 0 : 100 } : t
    ));
  };

  const handleUpdateProgress = (id: number, value: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id && h.target) {
        const progress = Math.round((value / h.target) * 100);
        return { ...h, currentValue: value, progress };
      }
      return h;
    }));
  };

  return (
    <div className="min-h-screen pb-24">
      <Header title="Início" showSettings showThemeToggle />

      <div className="max-w-[414px] mx-auto p-5">
        <section className="gradient-primary text-white rounded-2xl p-5 my-5 text-center shadow-lg shadow-primary/20 relative">
          <button
            onClick={() => navigate("/challenges")}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Ver desafios"
          >
            <Swords className="w-5 h-5" />
          </button>
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
              <LiquidFillCard
                key={habit.id}
                habit={habit}
                onToggleComplete={handleToggleComplete}
                onUpdateProgress={handleUpdateProgress}
              />
            ))}
          </div>
        </section>

        {tasks.length > 0 && (
          <section className="my-6">
            <h2 className="text-xl font-bold mb-4">Tarefas de Hoje</h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <LiquidFillCard
                  key={task.id}
                  habit={task}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
