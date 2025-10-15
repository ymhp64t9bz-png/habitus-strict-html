import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HabitCard } from "@/components/habits/HabitCard";
import { initialHabits } from "@/data/habits";

export default function Progress() {
  const navigate = useNavigate();
  const [habits] = useState(initialHabits);

  return (
    <div className="min-h-screen pb-24">
      <Header title="Progresso" showBack showSettings onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        <section>
          <h2 className="text-sm text-primary font-medium mb-4">Progresso Geral</h2>
          <div className="bg-card rounded-2xl p-5 text-center shadow-sm">
            <div className="relative w-[150px] h-[150px] mx-auto">
              {/* Trophy */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-[100px] bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[40px_40px_10px_10px] relative overflow-hidden shadow-lg shadow-yellow-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent rounded-[40px_40px_10px_10px] animate-glow" />
                </div>
                {/* Handles */}
                <div className="absolute w-5 h-[60px] bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg left-4 top-8 rotate-[-30deg]" />
                <div className="absolute w-5 h-[60px] bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg right-4 top-8 rotate-[30deg]" />
                {/* Base */}
                <div className="absolute bottom-0 w-[100px] h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md" />
                {/* Sparkles */}
                <div className="absolute w-2 h-2 bg-white rounded-full top-5 left-6 animate-sparkle" />
                <div className="absolute w-2 h-2 bg-white rounded-full top-4 right-7 animate-sparkle-delay-1" />
                <div className="absolute w-2 h-2 bg-white rounded-full bottom-10 left-8 animate-sparkle-delay-2" />
                <div className="absolute w-2 h-2 bg-white rounded-full bottom-9 right-10 animate-sparkle-delay-3" />
              </div>
              <div className="absolute bottom-[-30px] left-0 right-0 text-center text-xl font-bold">
                75%
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm text-primary font-medium mb-4">Todos os Hábitos</h2>
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
