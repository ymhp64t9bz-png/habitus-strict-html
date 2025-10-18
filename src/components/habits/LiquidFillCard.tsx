import { Habit } from "@/types/habit";
import { CheckCircle2, Edit2, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "@/contexts/HabitsContext";

interface LiquidFillCardProps {
  habit: Habit;
  onToggleComplete?: (id: string) => void;
  onUpdateProgress?: (id: string, value: number) => void;
  showEditButton?: boolean;
}

export function LiquidFillCard({ 
  habit, 
  onToggleComplete, 
  onUpdateProgress,
  showEditButton = false
}: LiquidFillCardProps) {
  const navigate = useNavigate();
  const { deleteHabit } = useHabits();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    onToggleComplete?.(habit.id);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleCardClick = () => {
    if (habit.broken) return; // Não permitir clique em hábitos quebrados
    
    if (habit.goal_value && habit.current_value !== undefined) {
      const newValue = Math.min((habit.current_value || 0) + 1, habit.goal_value);
      onUpdateProgress?.(habit.id, newValue);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-habit/${habit.id}`);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteHabit(habit.id);
  };

  const today = new Date().toISOString().split('T')[0];
  const completedToday = habit.last_completed_date === today;
  
  // Para hábitos: mostrar 100% se completou hoje, senão 0%
  // Para tasks: mostrar progresso normal
  const progress = habit.is_task
    ? habit.goal_value > 0 
      ? Math.round((habit.current_value / habit.goal_value) * 100) 
      : 0
    : completedToday ? 100 : 0;
    
  const isComplete = habit.is_complete;

  return (
    <div
      className={cn(
        "relative bg-card rounded-2xl p-4 shadow-sm overflow-hidden transition-all",
        habit.broken ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:translate-y-[-3px] active:scale-[0.98]"
      )}
      onClick={handleCardClick}
    >
      {/* Liquid fill background - left to right */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 transition-all duration-[600ms] ease-out",
          isComplete && isAnimating && "animate-glow"
        )}
        style={{
          width: `${progress}%`,
          opacity: 0.15,
          backgroundColor: habit.color,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        <div
          className={cn(
            "w-[50px] h-[50px] rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
            habit.color
          )}
        >
          {habit.broken ? "💔" : habit.icon}
        </div>

        <div className="flex-grow min-w-0">
          <p className={cn("font-semibold truncate", habit.broken ? "text-destructive" : "text-foreground")}>
            {habit.broken ? "Hábito Quebrado" : habit.title}
          </p>
          <p className="text-sm text-muted-foreground">
            {habit.current_value || 0}/{habit.goal_value} {habit.unit || 'unidade'}
          </p>
        </div>

        {showEditButton && (
          habit.broken ? (
            <button
              onClick={handleDeleteClick}
              className="min-w-[44px] min-h-[44px] w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center active:bg-destructive/20 active:scale-95 transition-all flex-shrink-0"
              aria-label="Excluir hábito"
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </button>
          ) : (
            <button
              onClick={handleEditClick}
              className="min-w-[44px] min-h-[44px] w-7 h-7 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center active:bg-background active:scale-95 transition-all flex-shrink-0"
              aria-label="Editar hábito"
            >
              <Edit2 className="w-3 h-3 text-muted-foreground" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
