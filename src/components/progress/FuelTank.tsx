interface FuelTankProps {
  percentage: number;
}

export function FuelTank({ percentage }: FuelTankProps) {
  const fillHeight = Math.min(percentage, 100);
  const isFull = percentage >= 100;

  return (
    <div className="relative w-[150px] h-[200px] mx-auto">
      {/* Tank container */}
      <svg
        viewBox="0 0 100 140"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Tank body - transparent glass */}
        <rect
          x="20"
          y="20"
          width="60"
          height="100"
          rx="8"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary/40"
        />
        
        {/* Liquid fill */}
        <defs>
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={isFull ? "hsl(142, 76%, 60%)" : "hsl(142, 76%, 50%)"}
              stopOpacity={isFull ? "1" : "0.8"}
            />
            <stop
              offset="100%"
              stopColor={isFull ? "hsl(142, 76%, 50%)" : "hsl(142, 76%, 36%)"}
              stopOpacity="0.9"
            />
          </linearGradient>
          
          {/* Glow filter for full tank */}
          {isFull && (
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
        </defs>
        
        <rect
          x="22"
          y={120 - fillHeight * 0.98}
          width="56"
          height={fillHeight * 0.98}
          rx="6"
          fill="url(#liquidGradient)"
          className="transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            filter: isFull ? 'url(#glow)' : 'none',
          }}
        />
        
        {/* Tank cap */}
        <rect
          x="35"
          y="12"
          width="30"
          height="10"
          rx="4"
          fill="currentColor"
          className="text-primary"
        />
      </svg>
      
      {/* Percentage display */}
      <div
        className="absolute inset-0 flex items-center justify-center text-2xl font-semibold"
        style={{ 
          color: fillHeight > 50 ? 'white' : 'hsl(var(--foreground))',
          textShadow: fillHeight > 50 ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
        }}
        aria-label={`Progresso total ${percentage} por cento`}
      >
        {percentage}%
      </div>
    </div>
  );
}
