import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { sanitizeAuthError, logError } from "@/lib/errorHandler";

const updatePasswordSchema = z.object({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export default function UpdatePassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Verifica se o usuário chegou através do link de recuperação
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // Usuário está no fluxo de recuperação de senha
        console.log("Password recovery flow detected");
      } else if (event === "SIGNED_IN" && !session) {
        // Redireciona para login se não houver sessão
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validated = updatePasswordSchema.parse(formData);
      
      const { error } = await supabase.auth.updateUser({
        password: validated.password,
      });

      if (error) {
        logError('Update Password', error);
        toast({
          title: "Erro ao atualizar senha",
          description: sanitizeAuthError(error),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Senha atualizada!",
        description: "Sua senha foi atualizada com sucesso. Faça login com a nova senha.",
      });

      // Desloga o usuário para forçar novo login
      await supabase.auth.signOut();
      
      // Redireciona para login após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-2xl font-bold mb-2">Nova senha</h2>
        <p className="text-muted-foreground mb-6">
          Digite sua nova senha abaixo.
        </p>
        
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <Label htmlFor="password">Nova Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="h-[60px] text-base"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
            />
            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              className="h-[60px] text-base"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={loading}
            />
            {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" className="w-full h-[60px] text-base font-bold" disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar senha"}
          </Button>
        </form>
      </div>
    </div>
  );
}
