import { Habit } from "@/types/habit";
import { CheckCircle2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LiquidFillCardProps {
  habit: Habit;
  onToggleComplete?: (id: number) => void;
  onUpdateProgress?: (id: number, value: number) => void;
}

export function LiquidFillCard({ habit, onToggleComplete, onUpdateProgress }: LiquidFillCardProps) {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    onToggleComplete?.(habit.id);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleCardClick = () => {
    if (habit.type === 'habit' && habit.target && habit.currentValue !== undefined) {
      const newValue = Math.min((habit.currentValue || 0) + 1, habit.target);
      onUpdateProgress?.(habit.id, newValue);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-habit/${habit.id}`);
  };

  const isComplete = habit.progress === 100;

  return (
    <div
      className="relative bg-card rounded-2xl p-4 shadow-sm overflow-hidden cursor-pointer hover:translate-y-[-3px] transition-all"
      onClick={handleCardClick}
    >
      {/* Liquid fill background - left to right */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 transition-all duration-[600ms] ease-out",
          isComplete && isAnimating && "animate-glow",
          `gradient-${habit.iconClass}`
        )}
        style={{
          width: `${habit.progress}%`,
          opacity: 0.15,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-4">
        <button
          onClick={handleCheckClick}
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
            isComplete
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/40 hover:border-primary"
          )}
        >
          {isComplete && <CheckCircle2 className="w-4 h-4" />}
        </button>

        <button
          onClick={handleEditClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Editar"
        >
          <Edit2 className="w-4 h-4 text-muted-foreground" />
        </button>

        <div
          className={cn(
            "w-[50px] h-[50px] rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
            `gradient-${habit.iconClass}`
          )}
        >
          {habit.icon}
        </div>

        <div className="flex-grow min-w-0">
          <p className="font-semibold text-foreground truncate">{habit.name}</p>
          {habit.type === 'habit' && habit.unit && (
            <p className="text-sm text-muted-foreground">
              {habit.currentValue || 0}/{habit.target} {getUnitLabel(habit.unit)}
            </p>
          )}
          {habit.type === 'task' && (
            <p className="text-xs text-muted-foreground">Tarefa do dia</p>
          )}
        </div>
      </div>
    </div>
  );
}

function getUnitLabel(unit: string): string {
  const labels: Record<string, string> = {
    days: 'dias',
    hours: 'h',
    liters: 'L',
    pages: 'pág',
    numeric: '',
    km: 'km',
    unidade: '',
  };
  return labels[unit] || '';
}
