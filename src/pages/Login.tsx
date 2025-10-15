import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
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
        <h2 className="text-2xl font-bold mb-6">Bem-vindo de volta</h2>
        <div className="space-y-4">
          <Input type="email" placeholder="Email" className="h-[60px] text-base" />
          <Input type="password" placeholder="Senha" className="h-[60px] text-base" />
        </div>
        <Button onClick={handleLogin} className="w-full mt-4 h-[60px] text-base font-bold">
          Entrar com email
        </Button>
        <a href="#" className="block text-center text-primary mt-4">
          Esqueceu sua senha?
        </a>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-border" />
          <span className="text-muted-foreground text-sm">Ou continue com</span>
          <div className="flex-1 h-[1px] bg-border" />
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full h-[60px] text-base">
            Continuar com Google
          </Button>
          <Button variant="outline" className="w-full h-[60px] text-base">
            Continuar com Apple
          </Button>
        </div>
      </div>

      <div className="text-center text-muted-foreground">
        Não tem uma conta?{" "}
        <a href="#" className="text-primary font-medium">
          Cadastre-se
        </a>
      </div>
    </div>
  );
}
