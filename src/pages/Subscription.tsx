import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { toast } from "sonner";

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast.error("Erro ao processar assinatura. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      toast.error("Erro ao abrir portal de assinatura. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const plans: Array<{
    name: string;
    price: string;
    period: string;
    originalPrice?: string;
    features: string[];
    savings: string | null;
    highlight?: boolean;
  }> = [
    {
      name: "Mensal",
      price: "R$ 14,90",
      period: "/mês",
      features: [
        "3 dias grátis para testar",
        "Acesso a todos os recursos premium",
        "Relatórios de progresso avançados",
        "Suporte por email",
      ],
      savings: null,
    },
    {
      name: "Trimestral",
      price: "R$ 40,17",
      period: "/trimestre",
      originalPrice: "R$ 44,70",
      features: [
        "3 dias grátis para testar",
        "Acesso a todos os recursos premium",
        "Relatórios de progresso avançados",
        "Suporte prioritário",
        "Economize R$ 4,53",
      ],
      savings: "Economize 10%",
      highlight: true,
    },
    {
      name: "Anual",
      price: "R$ 125,16",
      period: "/ano",
      originalPrice: "R$ 178,80",
      features: [
        "3 dias grátis para testar",
        "Acesso a todos os recursos premium",
        "Relatórios de progresso avançados",
        "Suporte prioritário",
        "Acesso antecipado a novidades",
        "Economize R$ 53,64",
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
          <p className="text-lg mb-4">Desbloqueie seu potencial máximo</p>
          <p className="text-sm opacity-90">
            Comece seus <strong>3 dias grátis</strong>. Cancele a qualquer momento antes dos 3 dias.
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
                  {plan.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through mr-1">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
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
                onClick={handleSubscribe}
                disabled={loading || user?.premium}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : user?.premium ? (
                  "Plano Ativo"
                ) : (
                  "Começar meus 3 dias grátis"
                )}
              </Button>
            </Card>
          ))}
        </div>

        {user?.premium && (
          <div className="text-center space-y-2 mb-4">
            <Button 
              variant="outline" 
              className="text-sm"
              onClick={handleManageSubscription}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                "Gerenciar Assinatura"
              )}
            </Button>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            O pagamento é processado pelo Stripe. Você pode gerenciar sua assinatura a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
}
