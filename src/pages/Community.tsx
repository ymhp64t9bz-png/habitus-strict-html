import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
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

const communityPosts = [
  {
    avatar: "AC",
    username: "Alexandra Cruz",
    handle: "@alexandracruz",
    title: "Meditação diária",
    description: "Praticar meditação por 15 minutos todas as manhãs para começar o dia com calma e foco.",
    time: "há 2 horas",
  },
  {
    avatar: "LR",
    username: "Lucas Rodrigues",
    handle: "@lucasrodrigues",
    title: "Leitura noturna",
    description: "Ler 20 páginas antes de dormir para relaxar e promover um sono melhor.",
    time: "há 5 horas",
  },
];

export default function Community() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      <Header title="Comunidade" showBack showSettings onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        {communityPosts.map((post, index) => (
          <div key={index} className="bg-card rounded-2xl mb-4 overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                {post.avatar}
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-bold text-foreground truncate">{post.username}</p>
                <p className="text-sm text-muted-foreground truncate">{post.handle}</p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <h3 className="font-bold mb-1">{post.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{post.description}</p>
              <p className="text-sm text-muted-foreground">Publicado {post.time}</p>
            </div>
            <div className="flex justify-end gap-2 p-4 bg-primary/5">
              <Button variant="ghost" className="text-primary">
                Salvar hábito
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-primary text-white">Usar hábito</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar substituição</AlertDialogTitle>
                    <AlertDialogDescription>
                      Ao usar este hábito, todos os hábitos criados hoje serão substituídos pelos hábitos do usuário selecionado. Deseja continuar?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
