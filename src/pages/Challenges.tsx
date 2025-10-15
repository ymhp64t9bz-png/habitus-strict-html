import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Challenge } from "@/types/habit";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Challenges() {
  const navigate = useNavigate();
  const [challenges] = useState<Challenge[]>([
    {
      id: 1,
      challengerId: 2,
      challengerName: "Maria Santos",
      challengedId: 1,
      habitSet: [],
      status: 'open',
      createdAt: new Date().toISOString(),
    },
  ]);

  const receivedChallenges = challenges.filter(c => c.status === 'open');
  const activeChallenges = challenges.filter(c => c.status === 'accepted');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  const handleAccept = (id: number) => {
    alert(`Desafio ${id} aceito!`);
  };

  const handleDecline = (id: number) => {
    alert(`Desafio ${id} recusado!`);
  };

  return (
    <div className="min-h-screen pb-24">
      <Header title="Desafios" showBack showSettings onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        <div className="bg-gradient-primary text-white rounded-2xl p-5 mb-6 text-center">
          <h2 className="text-xl font-bold mb-2">Arena de Desafios</h2>
          <p className="text-sm opacity-90">
            Desafie amigos ou aceite desafios para testar sua disciplina!
          </p>
        </div>

        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="received">
              Recebidos ({receivedChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Ativos ({activeChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Concluídos ({completedChallenges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4">
            {receivedChallenges.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum desafio recebido
              </p>
            ) : (
              receivedChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                      🥊
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">
                        {challenge.challengerName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Te desafiou para {challenge.habitSet.length} hábitos
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1"
                      onClick={() => handleAccept(challenge.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Aceitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDecline(challenge.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Recusar
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeChallenges.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum desafio ativo
              </p>
            ) : (
              activeChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-4">
                  <p>Desafio ativo com {challenge.challengerName}</p>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedChallenges.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum desafio concluído ainda
              </p>
            ) : (
              completedChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-4">
                  <p>Desafio concluído</p>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
