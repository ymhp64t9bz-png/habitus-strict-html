import { cn } from "@/lib/utils";

interface FuelTankProps {
  percentage: number;
}

export function FuelTank({ percentage }: FuelTankProps) {
  const isComplete = percentage >= 100;

  return (
    <div 
      className="relative w-full h-[200px] rounded-2xl border-2 border-primary/30 overflow-hidden bg-card"
      role="img"
      aria-label={`tanque de progresso: ${percentage}%`}
    >
      {/* Liquid fill */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isComplete ? "bg-primary animate-glow" : "bg-primary/60"
        )}
        style={{
          height: `${percentage}%`,
        }}
      >
        {/* Wave effect */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute w-full h-8 -top-4" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,40 Q300,80 600,40 T1200,40 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-primary-foreground"
            >
              <animate
                attributeName="d"
                dur="3s"
                repeatCount="indefinite"
                values="
                  M0,40 Q300,80 600,40 T1200,40 L1200,120 L0,120 Z;
                  M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z;
                  M0,40 Q300,80 600,40 T1200,40 L1200,120 L0,120 Z
                "
              />
            </path>
          </svg>
        </div>
      </div>

      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-6xl font-bold text-foreground drop-shadow-lg">
            {percentage}%
          </div>
          <div className="text-sm text-muted-foreground mt-2">Progresso Geral</div>
        </div>
      </div>

      {/* Tank markers */}
      <div className="absolute inset-y-0 left-4 flex flex-col justify-between py-4 text-xs text-muted-foreground">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>
    </div>
  );
}
