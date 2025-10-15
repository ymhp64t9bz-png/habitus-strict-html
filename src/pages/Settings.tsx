import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { ChevronRight, Trash2, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header title="Configurações" showBack onBack={() => navigate(-1)} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm my-5">
          <button
            onClick={() => navigate("/subscription")}
            className="w-full flex items-center gap-3 p-4 border-b border-border/50 hover:bg-primary/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="text-xl">👑</span>
            </div>
            <span className="flex-grow text-left">Assinar Premium</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate("/achievements")}
            className="w-full flex items-center justify-between p-4 border-b border-border/50 hover:bg-primary/5 transition-colors"
          >
            <span>Conquistas</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => navigate("/privacy")}
            className="w-full flex items-center justify-between p-4 border-b border-border/50 hover:bg-primary/5 transition-colors"
          >
            <span>Política de Privacidade</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 p-4 hover:bg-primary/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="flex-grow text-left">Sair</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="border-t-2 border-destructive/20 pt-5 mt-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/5 text-destructive rounded-2xl font-bold mb-3">
                <Trash2 className="w-5 h-5" />
                <span>Limpar Todos os Dados</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar todos os dados?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação é irreversível. Todos os seus hábitos e progresso serão permanentemente excluídos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive">Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p className="text-center text-sm text-muted-foreground mb-5">
            Esta ação é irreversível. Todos os seus hábitos e progresso serão permanentemente excluídos.
          </p>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>Habitus v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
