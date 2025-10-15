import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: "🏠", label: "Início" },
  { path: "/progress", icon: "📈", label: "Progresso" },
  { path: "/community", icon: "🌐", label: "Comunidade" },
  { path: "/achievements", icon: "🏅", label: "Conquistas" },
  { path: "/profile", icon: "👤", label: "Perfil" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="max-w-[414px] mx-auto flex justify-around py-4">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              location.pathname === item.path ? "text-primary" : "text-muted-foreground"
            )}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
