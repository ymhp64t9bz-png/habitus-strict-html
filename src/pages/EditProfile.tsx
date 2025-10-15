import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";

export default function EditProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState("Lucas Silva");
  const [bio, setBio] = useState("Desenvolvedor de software");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Arquivo muito grande! Máximo 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    alert("Perfil atualizado com sucesso!");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen">
      <Header title="Editar Perfil" showBack onBack={() => navigate("/profile")} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-[120px] h-[120px] rounded-full bg-primary flex items-center justify-center text-white text-4xl mb-4 overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              "LS"
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
            >
              <Camera className="w-8 h-8 text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <Button variant="outline" size="sm" asChild>
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Escolher foto
            </label>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            JPG, PNG ou WEBP. Máximo 5MB
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
            value="lucas.silva@email.com"
            disabled
            className="h-[60px] text-base bg-muted"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Email não pode ser alterado
          </p>
        </div>

        <div className="mb-6">
          <Label className="mb-2 block">Bio</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="text-base resize-none"
            placeholder="Conte um pouco sobre você..."
          />
        </div>

        <Button onClick={handleSave} className="w-full h-[60px] text-base font-bold">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
