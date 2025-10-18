import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Trophy, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { achievements as allAchievements } from "@/data/achievements";
import { cn } from "@/lib/utils";

export default function EditProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser } = useUser();
  
  if (!user) {
    navigate("/login");
    return null;
  }

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [profession, setProfession] = useState(user.profession);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>(user.selectedAchievements);
  const [saving, setSaving] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  useEffect(() => {
    loadUnlockedAchievements();
  }, [user]);

  const loadUnlockedAchievements = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', authUser.id);

      if (data) {
        setUnlockedAchievements(data.map(a => a.achievement_id));
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Use apenas JPG, PNG ou WEBP",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleAchievement = (id: string) => {
    // Só permite selecionar conquistas desbloqueadas
    if (!unlockedAchievements.includes(id)) {
      toast({
        title: "Conquista bloqueada",
        description: "Você só pode destacar conquistas que já desbloqueou",
        variant: "destructive",
      });
      return;
    }

    setSelectedAchievements(prev => {
      if (prev.includes(id)) {
        return prev.filter(a => a !== id);
      }
      if (prev.length >= 3) {
        toast({
          title: "Limite atingido",
          description: "Você pode selecionar no máximo 3 conquistas",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({
        name,
        bio,
        profession,
        avatarUrl,
        selectedAchievements,
      });
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      navigate("/profile");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <Header title="Editar Perfil" showBack onBack={() => navigate("/profile")} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera className="w-4 h-4 text-primary-foreground" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Clique para alterar foto (máx. 5MB)
          </p>
        </div>

        <div className="mb-6">
          <Label className="mb-2 block">Nome</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[60px] text-base"
          />
        </div>

        <div className="mb-6">
          <Label className="mb-2 block">Email</Label>
          <Input
            value={user.email}
            disabled
            readOnly
            className="h-[60px] text-base bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">
            O email não pode ser alterado
          </p>
        </div>

        <div className="mb-6">
          <Label className="mb-2 block">Profissão / Ocupação</Label>
          <Input
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="h-[60px] text-base"
            placeholder="Ex: Desenvolvedor, Atleta, Designer..."
          />
        </div>

        <div className="mb-6">
          <Label className="mb-2 block">Bio</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="text-base resize-none"
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {bio.length}/200
          </p>
        </div>

        <div className="mb-6">
          <Label className="mb-2 block flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Conquistas em Destaque (selecione até 3 desbloqueadas)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {allAchievements.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);
              const isSelected = selectedAchievements.includes(achievement.id);
              
              return (
                <button
                  key={achievement.id}
                  onClick={() => toggleAchievement(achievement.id)}
                  disabled={!isUnlocked}
                  className={cn(
                    "min-h-[44px] p-3 rounded-xl border-2 transition-all relative",
                    isUnlocked && "active:scale-95",
                    isSelected && isUnlocked
                      ? "border-primary bg-primary/10"
                      : isUnlocked
                      ? "border-muted bg-card"
                      : "border-muted bg-muted/50 cursor-not-allowed opacity-60"
                  )}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className="text-xs font-medium">{achievement.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full h-[60px] text-base font-bold" disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}
