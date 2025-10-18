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
  { name: "blue", class: "gradient-blue", label: "Azul" },
  { name: "green", class: "gradient-green", label: "Verde" },
  { name: "purple", class: "gradient-purple", label: "Roxo" },
  { name: "orange", class: "gradient-orange", label: "Laranja" },
  { name: "pink", class: "gradient-pink", label: "Rosa" },
  { name: "red", class: "gradient-red", label: "Vermelho" },
  { name: "yellow", class: "gradient-yellow", label: "Amarelo" },
  { name: "teal", class: "gradient-teal", label: "Verde-água" },
  { name: "indigo", class: "gradient-indigo", label: "Índigo" },
  { name: "cyan", class: "gradient-cyan", label: "Ciano" },
  { name: "slate", class: "gradient-slate", label: "Cinza" },
  { name: "rose", class: "gradient-rose", label: "Rosa Escuro" },
  { name: "amber", class: "gradient-amber", label: "Âmbar" },
  { name: "lime", class: "gradient-lime", label: "Lima" },
  { name: "emerald", class: "gradient-emerald", label: "Esmeralda" },
  { name: "sky", class: "gradient-sky", label: "Céu" },
  { name: "violet", class: "gradient-violet", label: "Violeta" },
  { name: "fuchsia", class: "gradient-fuchsia", label: "Fúcsia" },
];

export function ColorPickerModal({ open, onClose, onSelect, currentColor }: ColorPickerModalProps) {
  const handleSelect = (colorClass: string) => {
    onSelect(colorClass);
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
              onClick={() => handleSelect(color.class)}
              className={cn(
                "relative h-16 rounded-xl transition-all hover:scale-110",
                color.class,
                currentColor === color.class && "ring-4 ring-primary ring-offset-2"
              )}
              title={color.label}
            >
              {currentColor === color.class && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl text-white drop-shadow-lg">✓</span>
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
