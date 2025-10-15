import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Subscription() {
  const navigate = useNavigate();

  const features = [
    "Hábitos e tarefas ilimitados",
    "Sistema de desafios completo",
    "Todas as conquistas desbloqueadas",
    "Estatísticas detalhadas",
    "Backup automático na nuvem",
    "Suporte prioritário",
  ];

  return (
    <div className="min-h-screen pb-24">
      <Header title="Assinar Premium" showBack onBack={() => navigate("/settings")} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="gradient-primary text-white rounded-2xl p-8 mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Habitus Premium</h1>
          <p className="text-lg mb-4">7 dias grátis, depois:</p>
          <div className="text-5xl font-bold mb-2">R$ 9,90</div>
          <p className="text-sm opacity-90">por mês</p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">O que você ganha:</h2>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-3">
          <Button className="w-full h-14 text-base font-bold">
            🍎 Pagar com Apple Pay
          </Button>
          <Button className="w-full h-14 text-base font-bold" variant="outline">
            📱 Pagar com Google Pay
          </Button>
          <Button className="w-full h-14 text-base font-bold" variant="outline">
            💳 Pagar com Pix
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Cancele quando quiser. Sem taxas ocultas.
        </p>
      </div>
    </div>
  );
}
