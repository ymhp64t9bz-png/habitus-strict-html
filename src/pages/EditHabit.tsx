import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconPickerModal } from "@/components/habits/IconPickerModal";
import { ColorPickerModal } from "@/components/habits/ColorPickerModal";
import { Palette, Trash2 } from "lucide-react";
import { useHabits } from "@/contexts/HabitsContext";
import { toast } from "sonner";

export default function EditHabit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { habits, tasks, updateHabit, deleteHabit, addHabit } = useHabits();
  
  const isNew = id === "new";
  const existingHabit = isNew ? null : [...habits, ...tasks].find(h => h.id === id);

  const [title, setTitle] = useState("");
  const [goalValue, setGoalValue] = useState("21");
  const [unit, setUnit] = useState("unidade");
  const [icon, setIcon] = useState("📚");
  const [color, setColor] = useState("gradient-book");
  const [isTask, setIsTask] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (existingHabit) {
      setTitle(existingHabit.title);
      setGoalValue(existingHabit.goal_value?.toString() || "10");
      setUnit(existingHabit.unit || "unidade");
      setIcon(existingHabit.icon);
      setColor(existingHabit.color);
      setIsTask(existingHabit.is_task);
    }
  }, [existingHabit]);

  const handleSave = async () => {
    // Validação para hábitos: mínimo 21 dias
    if (!isTask && parseInt(goalValue) < 21) {
      toast.error("Hábitos precisam ter meta mínima de 21 dias");
      return;
    }

    const habitData = {
      title,
      frequency: 'daily',
      color,
      icon,
      goal_value: parseInt(goalValue) || (isTask ? 1 : 21),
      unit: isTask ? (unit || "unidade") : "dias",
      current_value: existingHabit?.current_value || 0,
      is_complete: existingHabit?.is_complete || false,
      is_task: isTask,
    };

    if (isNew) {
      await addHabit(habitData);
      toast.success(isTask ? "Tarefa criada com sucesso!" : "Hábito criado com sucesso!");
    } else if (id) {
      await updateHabit(id, habitData);
      toast.success(isTask ? "Tarefa atualizada com sucesso!" : "Hábito atualizado com sucesso!");
    }
    navigate("/");
  };

  const handleDelete = async () => {
    if (!isNew && id) {
      await deleteHabit(id);
      toast.success(isTask ? "Tarefa excluída com sucesso!" : "Hábito excluído com sucesso!");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        title={isNew ? "Novo Hábito" : "Editar Hábito"} 
        showBack 
        onBack={() => navigate("/")} 
      />

      <div className="max-w-[414px] mx-auto p-5 space-y-6">
        <div>
          <Label htmlFor="title">Nome do {isTask ? "Tarefa" : "Hábito"}</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isTask ? "Ex: Beber água" : "Ex: Meditar"}
            className="mt-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isTask"
            checked={isTask}
            onChange={(e) => setIsTask(e.target.checked)}
            className="w-4 h-4"
          />
          <Label htmlFor="isTask">É uma tarefa (com quantidade específica)</Label>
        </div>

        {isTask ? (
          <>
            <div>
              <Label htmlFor="goalValue">Meta (Quantidade)</Label>
              <Input
                id="goalValue"
                type="number"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                placeholder="4"
                className="mt-2"
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="unit">Unidade de Medida</Label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="páginas">Páginas</option>
                <option value="litros">Litros</option>
                <option value="quilômetros">Quilômetros</option>
                <option value="repetições">Repetições</option>
                <option value="minutos">Minutos</option>
                <option value="unidade">Unidades</option>
              </select>
            </div>
          </>
        ) : (
          <div>
            <Label htmlFor="goalValue">Meta (Dias consecutivos - mínimo 21)</Label>
            <Input
              id="goalValue"
              type="number"
              value={goalValue}
              onChange={(e) => setGoalValue(e.target.value)}
              placeholder="21"
              className="mt-2"
              min="21"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Hábitos exigem constância mínima de 21 dias
            </p>
          </div>
        )}

        <div>
          <Label>Ícone</Label>
          <button
            onClick={() => setShowIconPicker(true)}
            className="mt-2 w-full h-12 bg-card rounded-lg flex items-center justify-between px-4 hover:bg-accent transition-colors"
          >
            <span className="text-2xl">{icon}</span>
            <Palette className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div>
          <Label>Cor</Label>
          <button
            onClick={() => setShowColorPicker(true)}
            className="mt-2 w-full h-12 bg-card rounded-lg flex items-center justify-between px-4 hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div 
                className={`w-8 h-8 rounded-lg ${color}`}
              />
              <span className="text-sm font-medium capitalize">{color.replace('gradient-', '')}</span>
            </div>
            <Palette className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-3 pt-4">
          <Button onClick={handleSave} className="w-full" size="lg">
            {isNew ? "Criar" : "Salvar Alterações"}
          </Button>

          {!isNew && (
            <Button 
              onClick={handleDelete} 
              variant="destructive" 
              className="w-full"
              size="lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir {isTask ? "Tarefa" : "Hábito"}
            </Button>
          )}
        </div>
      </div>

      <IconPickerModal
        open={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelect={(selectedIcon) => {
          setIcon(selectedIcon);
          setShowIconPicker(false);
        }}
        currentIcon={icon}
      />

      <ColorPickerModal
        open={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelect={(selectedColor) => {
          setColor(selectedColor);
          setShowColorPicker(false);
        }}
        currentColor={color}
      />
    </div>
  );
}
