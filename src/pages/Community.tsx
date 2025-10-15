import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Share2, ChevronRight, Heart, Swords } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const communityPosts = [
  {
    id: 1,
    avatar: "AC",
    username: "Alexandra Cruz",
    handle: "@alexandracruz",
    title: "Meditação diária",
    description: "Praticar meditação por 15 minutos todas as manhãs para começar o dia com calma e foco.",
    time: "há 2 horas",
    streak: 15,
  },
  {
    id: 2,
    avatar: "LR",
    username: "Lucas Rodrigues",
    handle: "@lucasrodrigues",
    title: "Leitura noturna",
    description: "Ler 20 páginas antes de dormir para relaxar e promover um sono melhor.",
    time: "há 5 horas",
    streak: 7,
  },
  {
    id: 3,
    avatar: "MF",
    username: "Maria Fernandes",
    handle: "@mariafernandes",
    title: "Caminhada matinal",
    description: "30 minutos de caminhada todas as manhãs.",
    time: "há 1 dia",
    streak: 3,
  },
];

export default function Community() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({
    1: 247,
    2: 189,
    3: 312,
  });

  const handleChallenge = (postId: number, streak: number) => {
    if (streak < 7) {
      alert("Este usuário ainda não tem 7 dias consecutivos para criar desafios.");
      return;
    }
    setSelectedPostId(postId);
    setShowDialog(true);
  };

  const confirmChallenge = () => {
    alert(`Desafio criado para o post ${selectedPostId}!`);
    setShowDialog(false);
  };

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        setLikeCounts(counts => ({ ...counts, [postId]: counts[postId] - 1 }));
      } else {
        newSet.add(postId);
        setLikeCounts(counts => ({ ...counts, [postId]: counts[postId] + 1 }));
      }
      return newSet;
    });
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <div className="min-h-screen pb-24">
      <Header title="Comunidade" showBack showSettings onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        {communityPosts.map((post) => (
          <div key={post.id} className="bg-card rounded-2xl mb-4 overflow-hidden shadow-sm">
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
              <p className="text-xs text-primary font-medium mt-1">
                {post.streak} dias consecutivos 🔥
              </p>
            </div>
            <div className="flex gap-2 items-center p-4 bg-primary/5">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                <span className="text-sm font-medium">
                  {formatCount(likeCounts[post.id] || 0)}
                </span>
              </button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => handleChallenge(post.id, post.streak)}
                disabled={post.streak < 7}
              >
                <Swords className="w-4 h-4 mr-1" />
                Desafio
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Criar Desafio?</AlertDialogTitle>
            <AlertDialogDescription>
              Você vai desafiar o autor deste post. Os hábitos dele serão usados no desafio.
              Você precisará completar todos para vencer!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChallenge}>
              Confirmar Desafio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
}
