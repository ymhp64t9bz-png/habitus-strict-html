import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscriptionModalProps {
  open: boolean;
  onSubscriptionComplete: () => void;
}

export function SubscriptionModal({ open, onSubscriptionComplete }: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "monthly",
      name: "Mensal",
      price: "R$ 14,90",
      period: "/mês",
      priceId: "price_monthly_1490",
      features: [
        "3 dias grátis para testar",
        "Acesso a todos os recursos premium",
        "Relatórios de progresso avançados",
        "Suporte por email",
      ],
      savings: null,
    },
    {
      id: "quarterly",
      name: "Trimestral",
      price: "R$ 40,17",
      period: "/trimestre",
      priceId: "price_quarterly_4017",
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
      id: "yearly",
      name: "Anual",
      price: "R$ 125,16",
      period: "/ano",
      priceId: "price_yearly_12516",
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

  const handleSubscribe = async (priceId: string, planId: string) => {
    if (loading) return;
    
    setLoading(true);
    setSelectedPlan(planId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        // Abre o checkout em uma nova aba
        window.open(data.url, '_blank');
        
        // Aguarda um momento e então verifica o status
        toast.info("Complete o checkout na nova aba para ativar sua assinatura");
        
        // Adiciona listener para quando a aba for fechada
        const checkInterval = setInterval(async () => {
          const { data: subscriptionData } = await supabase.functions.invoke('check-subscription');
          
          if (subscriptionData?.subscribed || subscriptionData?.in_trial) {
            clearInterval(checkInterval);
            onSubscriptionComplete();
            toast.success("Assinatura ativada com sucesso! Bem-vindo ao Habitus Premium 🎉");
          }
        }, 3000);
        
        // Para de verificar após 5 minutos
        setTimeout(() => clearInterval(checkInterval), 300000);
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast.error("Erro ao processar assinatura. Tente novamente.");
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent 
        className="max-w-md max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Bem-vindo ao Habitus! 🎉</h2>
          <p className="text-muted-foreground">
            Escolha seu plano e comece seus <strong>3 dias grátis</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Cancele a qualquer momento antes dos 3 dias. Sem compromisso!
          </p>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-5 relative cursor-pointer transition-all hover:shadow-md ${
                plan.highlight ? "border-2 border-primary shadow-lg" : ""
              }`}
              onClick={() => handleSubscribe(plan.priceId, plan.id)}
            >
              {plan.savings && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  {plan.savings}
                </Badge>
              )}
              
              <div className="mb-3">
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  {plan.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-primary">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.highlight ? "default" : "outline"}
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe(plan.priceId, plan.id);
                }}
              >
                {loading && selectedPlan === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Começar meus 3 dias grátis"
                )}
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade. 
          O pagamento será cobrado apenas após o período de teste de 3 dias.
        </p>
      </DialogContent>
    </Dialog>
  );
}
