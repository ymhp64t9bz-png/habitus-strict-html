import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, TrendingUp, Users, Award, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/progress", icon: TrendingUp, label: "Progresso" },
  { path: "/community", icon: Users, label: "Comunidade" },
  { path: "/achievements", icon: Award, label: "Conquistas" },
  { path: "/profile", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-lg z-50 safe-area-inset-bottom">
      <div className="max-w-[414px] mx-auto flex justify-around py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-all active:scale-95",
                location.pathname === item.path 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground active:bg-muted/50"
              )}
              aria-label={item.label}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
