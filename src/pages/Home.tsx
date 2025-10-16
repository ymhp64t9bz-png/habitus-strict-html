import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LiquidFillCard } from "@/components/habits/LiquidFillCard";
import { useHabits } from "@/contexts/HabitsContext";
import { useUser } from "@/contexts/UserContext";
import { Flame, Swords, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Bom dia";
  } else if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  } else {
    return "Boa noite";
  }
};

export default function Home() {
  const navigate = useNavigate();
  const { habits, tasks, toggleComplete, updateProgress } = useHabits();
  const { user, loading } = useUser();
  const greeting = getGreeting();

  if (loading || !user) {
    return null;
  }

  const completedHabits = habits.filter(h => h.progress === 100).length;
  const progressPercentage = Math.round((completedHabits / habits.length) * 100);

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
          <h1 className="text-2xl font-bold mb-2">{greeting}, {user.name}! 👋</h1>
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
                onToggleComplete={toggleComplete}
                onUpdateProgress={updateProgress}
                showEditButton
                showCheckButton
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
                  onToggleComplete={toggleComplete}
                  showEditButton
                  showCheckButton
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <Button
        onClick={() => navigate("/edit-habit/new")}
        className="fixed bottom-24 right-5 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full shadow-lg active:scale-95 transition-transform"
        size="icon"
        aria-label="Adicionar novo hábito"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <BottomNav />
    </div>
  );
}
