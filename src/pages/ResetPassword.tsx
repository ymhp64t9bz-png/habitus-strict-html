import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sanitizeAuthError, logError } from "@/lib/errorHandler";
import { z } from "zod";

const resetSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
});

export default function ResetPassword() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const validated = resetSchema.parse({ email });
      
      const { error } = await supabase.auth.resetPasswordForEmail(validated.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        logError('Reset Password', error);
        toast({
          title: "Erro ao enviar email",
          description: sanitizeAuthError(error),
          variant: "destructive",
        });
        return;
      }

      setSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col justify-center min-h-screen p-5">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-5 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Email enviado!</h1>
          <p className="text-muted-foreground mb-6">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
          <Link to="/login">
            <Button variant="outline" className="h-[60px] px-8">
              <ArrowLeft className="mr-2 w-5 h-5" />
              Voltar para Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center min-h-screen p-5">
      <div className="text-center mb-10">
        <div className="w-20 h-20 mx-auto mb-5 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Habitus</h1>
        <p className="text-muted-foreground">Construindo hábitos com propósito</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Redefinir senha</h2>
        <p className="text-muted-foreground mb-6">
          Digite seu email e enviaremos instruções para redefinir sua senha.
        </p>
        
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="h-[60px] text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>

          <Button type="submit" className="w-full h-[60px] text-base font-bold" disabled={loading}>
            {loading ? "Enviando..." : "Enviar email de redefinição"}
          </Button>
        </form>
      </div>

      <div className="text-center text-muted-foreground">
        <Link to="/login" className="text-primary font-medium">
          <ArrowLeft className="inline mr-1 w-4 h-4" />
          Voltar para Login
        </Link>
      </div>
    </div>
  );
}
