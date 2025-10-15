import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Subscription() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Mensal",
      price: "R$ 14,90",
      period: "/mês",
      features: [
        "Acesso a todos os recursos premium",
        "Relatórios de progresso avançados",
      ],
      savings: null,
    },
    {
      name: "Trimestral",
      price: "R$ 36,90",
      period: "/trimestre",
      features: [
        "Acesso a todos os recursos premium",
        "Relatórios de progresso avançados",
        "Suporte prioritário",
      ],
      savings: "Economize 17%",
      highlight: true,
    },
    {
      name: "Anual",
      price: "R$ 124,90",
      period: "/ano",
      features: [
        "Acesso a todos os recursos premium",
        "Relatórios de progresso avançados",
        "Suporte prioritário",
        "Acesso antecipado a novidades",
      ],
      savings: "Economize 30%",
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      <Header title="Assinar Premium" showBack onBack={() => navigate("/settings")} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="gradient-primary text-white rounded-2xl p-8 mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Habitus Premium</h1>
          <p className="text-lg mb-4">Desbloqueie seu potencial máximo com o Habitus Premium</p>
          <p className="text-sm opacity-90">
            Comece seu teste gratuito de 7 dias. O pagamento será cobrado apenas após o término do período de avaliação através da sua conta App Store/Play Store.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-6 relative ${
                plan.highlight
                  ? "border-2 border-primary shadow-lg"
                  : ""
              }`}
            >
              {plan.savings && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  {plan.savings}
                </Badge>
              )}
              
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.highlight
                    ? "bg-primary hover:bg-primary/90"
                    : ""
                }`}
                variant={plan.highlight ? "default" : "outline"}
              >
                Assinar
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-2">
          <Button variant="ghost" className="text-sm">
            Restaurar Compra
          </Button>
          <p className="text-xs text-muted-foreground">
            O pagamento é processado pela App Store/Play Store. Você pode gerenciar sua assinatura nas configurações da sua conta.
          </p>
        </div>
      </div>
    </div>
  );
}
