import { Habit } from "@/types/habit";
import { Share2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  onEdit?: (id: number) => void;
  onShare?: (id: number) => void;
  showActions?: boolean;
}

export function HabitCard({ habit, onEdit, onShare, showActions = false }: HabitCardProps) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:translate-y-[-3px] transition-all">
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
        <p className="text-sm text-muted-foreground">Streak: {habit.streak} dias</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-[60px] h-[6px] bg-primary/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${habit.progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-primary min-w-[35px]">{habit.progress}%</span>
      </div>
      {showActions && (
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onShare?.(habit.id)}
            className="text-foreground hover:text-primary transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEdit?.(habit.id)}
            className="text-foreground hover:text-primary transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
