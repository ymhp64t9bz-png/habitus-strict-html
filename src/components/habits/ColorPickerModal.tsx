import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColorPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
  currentColor: string;
}

const colors = [
  { name: "book", class: "gradient-book", label: "Livro" },
  { name: "walk", class: "gradient-walk", label: "Caminhada" },
  { name: "meditate", class: "gradient-meditate", label: "Meditação" },
  { name: "phone", class: "gradient-phone", label: "Telefone" },
  { name: "gift", class: "gradient-gift", label: "Presente" },
  { name: "primary", class: "gradient-primary", label: "Primária" },
  { name: "blue", class: "bg-gradient-to-br from-blue-400 to-blue-600", label: "Azul" },
  { name: "green", class: "bg-gradient-to-br from-green-400 to-green-600", label: "Verde" },
  { name: "purple", class: "bg-gradient-to-br from-purple-400 to-purple-600", label: "Roxo" },
  { name: "orange", class: "bg-gradient-to-br from-orange-400 to-orange-600", label: "Laranja" },
  { name: "pink", class: "bg-gradient-to-br from-pink-400 to-pink-600", label: "Rosa" },
  { name: "red", class: "bg-gradient-to-br from-red-400 to-red-600", label: "Vermelho" },
  { name: "yellow", class: "bg-gradient-to-br from-yellow-400 to-yellow-600", label: "Amarelo" },
  { name: "teal", class: "bg-gradient-to-br from-teal-400 to-teal-600", label: "Verde-água" },
  { name: "indigo", class: "bg-gradient-to-br from-indigo-400 to-indigo-600", label: "Índigo" },
  { name: "cyan", class: "bg-gradient-to-br from-cyan-400 to-cyan-600", label: "Ciano" },
];

export function ColorPickerModal({ open, onClose, onSelect, currentColor }: ColorPickerModalProps) {
  const handleSelect = (colorName: string) => {
    onSelect(colorName);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Escolha uma Cor</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-3 py-4">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleSelect(color.name)}
              className={cn(
                "relative h-16 rounded-xl transition-all hover:scale-110",
                color.class,
                currentColor === color.name && "ring-4 ring-primary ring-offset-2"
              )}
              title={color.label}
            >
              {currentColor === color.name && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <Button onClick={onClose} variant="outline" className="w-full">
          Cancelar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
