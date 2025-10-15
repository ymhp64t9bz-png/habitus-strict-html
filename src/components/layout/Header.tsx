import { ArrowLeft, Settings } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showSettings?: boolean;
  showThemeToggle?: boolean;
  onBack?: () => void;
}

export function Header({ title, showBack, showSettings, showThemeToggle, onBack }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="max-w-[414px] mx-auto flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <button onClick={onBack} className="text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {showSettings && (
            <button
              onClick={() => navigate("/settings")}
              className="text-foreground hover:text-primary transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          )}
          {showThemeToggle && (
            <label className="relative inline-block w-[50px] h-[26px] cursor-pointer">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
                className="opacity-0 w-0 h-0 peer"
              />
              <span className={`absolute inset-0 rounded-full transition-all before:absolute before:left-1 before:bottom-1 before:w-[18px] before:h-[18px] before:bg-background before:rounded-full before:flex before:items-center before:justify-center before:text-[10px] before:transition-all ${theme === "dark" ? "bg-primary before:translate-x-6 before:content-['☀️']" : "bg-muted before:content-['🌙']"}`}></span>
            </label>
          )}
        </div>
      </div>
    </header>
  );
}
