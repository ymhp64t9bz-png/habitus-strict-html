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
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 shadow-lg z-50">
      <div className="max-w-[414px] mx-auto flex justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "p-3 rounded-xl transition-all",
                location.pathname === item.path 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
