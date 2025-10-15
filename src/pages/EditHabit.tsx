import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Smile, Palette, ChevronRight, Trash2 } from "lucide-react";

export default function EditHabit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("Ler 10 páginas");
  const [description, setDescription] = useState("Ler 10 páginas por dia para desenvolver o hábito da leitura");

  const handleSave = () => {
    alert("Hábito atualizado com sucesso!");
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <Header title="Editar Hábito" showBack onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="mb-6">
          <Label className="mb-2 block">Nome do Hábito</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[60px] text-base"
          />
        </div>

        <div className="mb-6">
          <Label className="mb-2 block">Descrição</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="text-base resize-none"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Personalizar</h2>
          <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
            <button className="w-full flex items-center gap-3 p-4 border-b border-border/50 hover:bg-primary/5 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Smile className="w-5 h-5" />
              </div>
              <span className="flex-grow text-left">Ícone</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-3 p-4 hover:bg-primary/5 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Palette className="w-5 h-5" />
              </div>
              <span className="flex-grow text-left">Cor</span>
              <div className="w-5 h-5 rounded-full bg-primary mr-2" />
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full h-[60px] text-base font-bold mb-3">
          Salvar Alterações
        </Button>

        <Button
          variant="destructive"
          className="w-full h-[60px] text-base font-bold flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          <span>Excluir Hábito</span>
        </Button>
      </div>
    </div>
  );
}
