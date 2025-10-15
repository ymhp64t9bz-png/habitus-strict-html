import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header title="Política de Privacidade" showBack onBack={() => navigate(-1)} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="prose prose-sm max-w-none">
          <h2 className="text-xl font-bold mb-4">Política de Privacidade do Habitus</h2>
          <p className="text-muted-foreground mb-4">
            O Habitus está comprometido em proteger sua privacidade. Esta política explica como coletamos, usamos e protegemos suas informações.
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-6">Informações Coletadas</h3>
          <p className="text-muted-foreground mb-4">
            Coletamos informações que você nos fornece diretamente, como nome, email e dados de hábitos.
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-6">Uso das Informações</h3>
          <p className="text-muted-foreground mb-4">
            Utilizamos suas informações para fornecer e melhorar nossos serviços, personalizar sua experiência e manter a segurança da plataforma.
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-6">Proteção de Dados</h3>
          <p className="text-muted-foreground mb-4">
            Implementamos medidas de segurança adequadas para proteger suas informações contra acesso não autorizado.
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-6">Seus Direitos</h3>
          <p className="text-muted-foreground mb-4">
            Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Última atualização: 2025
          </p>
        </div>
      </div>
    </div>
  );
}
