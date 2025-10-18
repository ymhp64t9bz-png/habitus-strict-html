import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Habit } from "@/types/habit";
import { useState } from "react";

interface LiquidFillCardProps {
  habit: Habit;
  onToggleComplete?: (id: string) => void;
  onUpdateProgress?: (id: string, value: number) => void;
  showEditButton?: boolean;
}

export function LiquidFillCard({ habit, onToggleComplete, onUpdateProgress, showEditButton }: LiquidFillCardProps) {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardClick = () => {
    if (habit.broken) return; // Não permite clique em hábitos quebrados
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    
    if (!habit.is_task) {
      // Para hábitos: incrementa dias
      onUpdateProgress?.(habit.id, habit.current_value + 1);
    } else {
      // Para tarefas: incrementa valor
      const newValue = habit.current_value + 1;
      onUpdateProgress?.(habit.id, newValue);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-habit/${habit.id}`);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir "${habit.title}"?`)) {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from('habits').delete().eq('id', habit.id);
      window.location.reload();
    }
  };

  // Para hábitos: mostrar 100% se completou hoje, senão mostrar progresso real
  const today = new Date().toISOString().split('T')[0];
  const completedToday = habit.last_completed_date === today;
  
  let visualProgress = 0;
  if (!habit.is_task) {
    // Para hábitos: 100% se completou hoje, senão 0%
    visualProgress = completedToday ? 100 : 0;
  } else {
    // Para tarefas: progresso normal
    visualProgress = Math.min((habit.current_value / habit.goal_value) * 100, 100);
  }
  
  const realProgress = Math.min((habit.current_value / habit.goal_value) * 100, 100);
  const isComplete = habit.is_complete;

  return (
    <Card
      onClick={handleCardClick}
      className={`relative overflow-hidden transition-all duration-300 ${
        habit.broken ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
      } ${isAnimating ? "scale-105" : ""}`}
      style={{
        background: `linear-gradient(to top, hsl(var(--${habit.color})) ${visualProgress}%, transparent ${visualProgress}%)`,
      }}
    >
      <CardContent className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{habit.broken ? '💔' : habit.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {habit.title}
                {habit.broken && <span className="text-destructive text-sm ml-2">(Quebrado)</span>}
              </h3>
              {!habit.is_task ? (
                <p className="text-sm text-muted-foreground">
                  {habit.current_value}/{habit.goal_value} dias
                </p>
              ) : (
                habit.goal_value > 1 && (
                  <p className="text-sm text-muted-foreground">
                    {habit.current_value}/{habit.goal_value} {habit.unit}
                  </p>
                )
              )}
            </div>
          </div>
          {showEditButton && (
            habit.broken ? (
              <button
                onClick={handleDeleteClick}
                className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-full transition-colors"
                aria-label="Excluir hábito quebrado"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleEditClick}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Editar hábito"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
