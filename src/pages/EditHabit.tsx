import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconPickerModal } from "@/components/habits/IconPickerModal";
import { ColorPickerModal } from "@/components/habits/ColorPickerModal";
import { Smile, Palette, ChevronRight, Trash2, Plus } from "lucide-react";
import { HabitType, HabitUnit } from "@/types/habit";

export default function EditHabit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("Ler 10 páginas");
  const [description, setDescription] = useState("Ler 10 páginas por dia para desenvolver o hábito da leitura");
  const [type, setType] = useState<HabitType>("habit");
  const [unit, setUnit] = useState<HabitUnit>("pages");
  const [target, setTarget] = useState("10");
  const [durationDays, setDurationDays] = useState<string>("30");
  const [icon, setIcon] = useState("📚");
  const [iconClass, setIconClass] = useState("book");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [targetValue, setTargetValue] = useState("10");

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
          <Label className="mb-2 block">Tipo</Label>
          <Select value={type} onValueChange={(v) => setType(v as HabitType)}>
            <SelectTrigger className="h-[60px] text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="habit">Hábito</SelectItem>
              <SelectItem value="task">Tarefa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === "habit" && (
          <>
            <div className="mb-6">
              <Label className="mb-2 block">Unidade de Medida</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as HabitUnit)}>
                <SelectTrigger className="h-[60px] text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Dias</SelectItem>
                  <SelectItem value="hours">Horas</SelectItem>
                  <SelectItem value="liters">Litros (L)</SelectItem>
                  <SelectItem value="pages">Páginas</SelectItem>
                  <SelectItem value="numeric">Numérico</SelectItem>
                  <SelectItem value="km">Quilômetros (km)</SelectItem>
                  <SelectItem value="unidade">Unidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {unit === "days" ? (
              <div className="mb-6">
                <Label className="mb-2 block">Duração (Dias)</Label>
                <Select value={durationDays} onValueChange={setDurationDays}>
                  <SelectTrigger className="h-[60px] text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                    <SelectItem value="365">365 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <Label className="mb-2 block">Quantidade Alvo</Label>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="Ex.: 4"
                      className="h-[60px] text-base flex-1"
                    />
                    <div className="w-32">
                      <Select value={unit} onValueChange={(v) => setUnit(v as HabitUnit)}>
                        <SelectTrigger className="h-[60px] text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="liters">L</SelectItem>
                          <SelectItem value="km">km</SelectItem>
                          <SelectItem value="pages">pág</SelectItem>
                          <SelectItem value="hours">h</SelectItem>
                          <SelectItem value="unidade">un</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="mb-2 block">Meta Diária</Label>
                  <Input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="h-[60px] text-base"
                  />
                </div>
              </>
            )}
          </>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Personalizar</h2>
          <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setShowIconPicker(true)}
              className="w-full flex items-center gap-3 p-4 border-b border-border/50 hover:bg-primary/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                {icon}
              </div>
              <span className="flex-grow text-left">Ícone</span>
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={() => setShowColorPicker(true)}
              className="w-full flex items-center gap-3 p-4 hover:bg-primary/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Palette className="w-5 h-5" />
              </div>
              <span className="flex-grow text-left">Cor</span>
              <div className={`w-8 h-8 rounded-lg mr-2 gradient-${iconClass}`} />
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
          <span>Excluir {type === 'habit' ? 'Hábito' : 'Tarefa'}</span>
        </Button>
      </div>

      <IconPickerModal
        open={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelect={setIcon}
        currentIcon={icon}
      />

      <ColorPickerModal
        open={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelect={setIconClass}
        currentColor={iconClass}
      />
    </div>
  );
}
