import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface IconPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (icon: string) => void;
  currentIcon: string;
}

const iconCategories = {
  saude: ["💪", "🏃", "🧘", "🏋️", "🚴", "⚽", "🏊", "🧗", "🥗", "🥑"],
  mente: ["🧠", "📚", "✍️", "🎓", "🎨", "🎵", "🎮", "🧩", "🎭", "📖"],
  habitos: ["💧", "☕", "🛏️", "🌅", "🌙", "⏰", "📱", "💻", "📝", "✅"],
  social: ["👥", "💬", "📞", "🤝", "❤️", "👨‍👩‍👧", "🎉", "🎊", "🎁", "🌟"],
  trabalho: ["💼", "📊", "📈", "💰", "🎯", "📋", "✉️", "📁", "🖊️", "⚙️"],
  natureza: ["🌱", "🌳", "🌸", "🌺", "🌻", "🌿", "🍃", "🌾", "🌲", "🌴"],
  comida: ["🍎", "🥕", "🥦", "🍇", "🍌", "🍓", "🥤", "🍵", "🥛", "🍽️"],
  outros: ["⭐", "✨", "🔥", "💎", "🏆", "🎪", "🎨", "🎬", "📷", "🎸"],
};

export function IconPickerModal({ open, onClose, onSelect, currentIcon }: IconPickerModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(currentIcon);

  const allIcons = Object.values(iconCategories).flat();
  const filteredIcons = search
    ? allIcons.filter((icon) => icon.includes(search))
    : allIcons;

  const handleConfirm = () => {
    onSelect(selectedIcon);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Escolher Ícone</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ícone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {Object.entries(iconCategories).map(([category, icons]) => {
            const categoryIcons = search
              ? icons.filter((icon) => filteredIcons.includes(icon))
              : icons;

            if (categoryIcons.length === 0) return null;

            return (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3 capitalize">
                  {category}
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {categoryIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-full aspect-square rounded-lg flex items-center justify-center text-2xl hover:bg-primary/10 transition-colors ${
                        selectedIcon === icon ? "bg-primary/20 ring-2 ring-primary" : "bg-muted"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </ScrollArea>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
