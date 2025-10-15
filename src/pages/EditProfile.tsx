import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("João Silva");
  const [email] = useState("joao@exemplo.com");
  const [bio, setBio] = useState("Transformando hábitos em resultados");
  const [avatarUrl, setAvatarUrl] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=joao");

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

  const handleSave = () => {
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
    navigate("/profile");
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
            value={email}
            disabled
            readOnly
            className="h-[60px] text-base bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">
            O email não pode ser alterado
          </p>
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

        <Button onClick={handleSave} className="w-full h-[60px] text-base font-bold">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
