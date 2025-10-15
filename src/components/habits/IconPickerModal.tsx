import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const habitIcons = {
  saúde: ["🏃", "🚴", "🏊", "🧘", "💪", "🥗", "💊", "🩺", "❤️"],
  mente: ["📚", "🧠", "🎓", "✍️", "🎨", "🎵", "🎬", "📖", "🧩"],
  trabalho: ["💼", "💻", "📊", "📈", "✅", "📝", "⏰", "🎯", "🔨"],
  vida: ["🏠", "🌱", "♻️", "🧹", "🛁", "😴", "☕", "🍽️", "🚗"],
  social: ["👥", "💬", "📱", "👨‍👩‍👧", "🎉", "🤝", "💌", "📞", "🎁"],
  lazer: ["🎮", "🎲", "🎪", "🎭", "🎸", "⚽", "🎿", "🏕️", "✈️"],
};

interface IconPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (icon: string) => void;
  currentIcon?: string;
}

export function IconPickerModal({ open, onClose, onSelect, currentIcon }: IconPickerModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(currentIcon || "");

  const allIcons = Object.values(habitIcons).flat();
  const filteredIcons = search
    ? allIcons.filter(icon => icon.includes(search))
    : allIcons;

  const handleConfirm = () => {
    if (selectedIcon) {
      onSelect(selectedIcon);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Escolher Ícone</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Buscar ícone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <ScrollArea className="h-[400px] pr-4">
          {Object.entries(habitIcons).map(([category, icons]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                {category}
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {icons
                  .filter(icon => !search || filteredIcons.includes(icon))
                  .map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`
                        w-12 h-12 rounded-lg text-2xl
                        flex items-center justify-center
                        transition-all hover:scale-110
                        ${selectedIcon === icon
                          ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                          : 'bg-muted hover:bg-muted/70'
                        }
                      `}
                    >
                      {icon}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="flex-1" disabled={!selectedIcon}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
