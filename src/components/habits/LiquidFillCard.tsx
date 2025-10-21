import { Habit } from "@/types/habit";
import { CheckCircle2, Edit2, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "@/contexts/HabitsContext";

// Mapeamento de classes de gradiente para cores CSS
const gradientColors: Record<string, string> = {
  'gradient-book': 'linear-gradient(135deg, hsl(203, 99%, 66%), hsl(182, 100%, 50%))',
  'gradient-walk': 'linear-gradient(135deg, hsl(147, 80%, 63%), hsl(170, 90%, 60%))',
  'gradient-meditate': 'linear-gradient(135deg, hsl(341, 93%, 65%), hsl(48, 99%, 63%))',
  'gradient-exercise': 'linear-gradient(135deg, hsl(0, 100%, 81%), hsl(330, 100%, 91%))',
  'gradient-journal': 'linear-gradient(135deg, hsl(175, 69%, 87%), hsl(344, 76%, 89%))',
  'gradient-water': 'linear-gradient(135deg, hsl(186, 98%, 77%), hsl(215, 100%, 70%))',
  'gradient-sleep': 'linear-gradient(135deg, hsl(268, 71%, 76%), hsl(270, 100%, 97%))',
  'gradient-food': 'linear-gradient(135deg, hsl(32, 100%, 90%), hsl(14, 96%, 72%))',
  'gradient-phone': 'linear-gradient(135deg, hsl(269, 89%, 58%), hsl(289, 89%, 68%))',
  'gradient-gift': 'linear-gradient(135deg, hsl(340, 82%, 62%), hsl(320, 85%, 72%))',
  'gradient-blue': 'linear-gradient(135deg, hsl(201, 96%, 62%), hsl(211, 96%, 72%))',
  'gradient-green': 'linear-gradient(135deg, hsl(142, 71%, 58%), hsl(152, 71%, 68%))',
  'gradient-purple': 'linear-gradient(135deg, hsl(271, 76%, 63%), hsl(281, 76%, 73%))',
  'gradient-orange': 'linear-gradient(135deg, hsl(24, 95%, 63%), hsl(34, 95%, 73%))',
  'gradient-pink': 'linear-gradient(135deg, hsl(328, 86%, 70%), hsl(338, 86%, 80%))',
  'gradient-red': 'linear-gradient(135deg, hsl(0, 84%, 63%), hsl(10, 84%, 73%))',
  'gradient-yellow': 'linear-gradient(135deg, hsl(45, 93%, 63%), hsl(55, 93%, 73%))',
  'gradient-teal': 'linear-gradient(135deg, hsl(173, 80%, 50%), hsl(183, 80%, 60%))',
  'gradient-indigo': 'linear-gradient(135deg, hsl(231, 48%, 58%), hsl(241, 48%, 68%))',
  'gradient-cyan': 'linear-gradient(135deg, hsl(188, 94%, 63%), hsl(198, 94%, 73%))',
  'gradient-slate': 'linear-gradient(135deg, hsl(215, 16%, 57%), hsl(215, 16%, 67%))',
  'gradient-rose': 'linear-gradient(135deg, hsl(350, 89%, 65%), hsl(360, 89%, 75%))',
  'gradient-amber': 'linear-gradient(135deg, hsl(38, 92%, 58%), hsl(48, 92%, 68%))',
  'gradient-lime': 'linear-gradient(135deg, hsl(84, 81%, 58%), hsl(94, 81%, 68%))',
  'gradient-emerald': 'linear-gradient(135deg, hsl(158, 64%, 52%), hsl(168, 64%, 62%))',
  'gradient-sky': 'linear-gradient(135deg, hsl(199, 89%, 58%), hsl(209, 89%, 68%))',
  'gradient-violet': 'linear-gradient(135deg, hsl(258, 90%, 66%), hsl(268, 90%, 76%))',
  'gradient-fuchsia': 'linear-gradient(135deg, hsl(292, 84%, 61%), hsl(302, 84%, 71%))',
  'gradient-primary': 'linear-gradient(135deg, hsl(269, 89%, 48%), hsl(269, 89%, 63%))',
};

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
        className="absolute inset-y-0 left-0 transition-all duration-[600ms] ease-out rounded-2xl overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        <div
          className={cn(
            "h-full w-full transition-all duration-500",
            isComplete && isAnimating && "animate-glow"
          )}
          style={{
            background: gradientColors[habit.color] || habit.color,
            opacity: 0.25,
          }}
        />
      </div>

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
