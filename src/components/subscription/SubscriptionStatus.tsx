import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Calendar, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SubscriptionStatusProps {
  subscriptionStatus?: {
    subscribed: boolean;
    inTrial: boolean;
    trialEnd?: string;
    subscriptionEnd?: string;
  };
}

export function SubscriptionStatus({ subscriptionStatus }: SubscriptionStatusProps) {
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      toast.error("Erro ao acessar gerenciamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!subscriptionStatus?.subscribed && !subscriptionStatus?.inTrial) {
    return null;
  }

  const { inTrial, trialEnd, subscriptionEnd, subscribed } = subscriptionStatus;

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Habitus Premium</h3>
            {inTrial && (
              <Badge variant="secondary" className="mt-1">
                Período de Teste
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {inTrial && trialEnd && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Teste gratuito até{" "}
              <strong className="text-foreground">
                {format(new Date(trialEnd), "dd 'de' MMMM", { locale: ptBR })}
              </strong>
            </span>
          </div>
        )}
        
        {subscribed && subscriptionEnd && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Renovação em{" "}
              <strong className="text-foreground">
                {format(new Date(subscriptionEnd), "dd 'de' MMMM", { locale: ptBR })}
              </strong>
            </span>
          </div>
        )}
      </div>

      <Button
        onClick={handleManageSubscription}
        disabled={loading}
        variant="outline"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Carregando...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Gerenciar Assinatura
          </>
        )}
      </Button>

      {inTrial && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Cancele a qualquer momento antes do fim do período de teste
        </p>
      )}
    </Card>
  );
}
