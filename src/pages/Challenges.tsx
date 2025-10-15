import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Challenge } from "@/types/habit";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function Challenges() {
  const navigate = useNavigate();
  
  const [receivedChallenges] = useState<Challenge[]>([
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

  const [sentChallenges] = useState<Challenge[]>([
    {
      id: 2,
      challengerId: 1,
      challengerName: "João Silva",
      challengedId: 3,
      habitSet: [],
      status: 'accepted',
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleAccept = (id: number) => {
    console.log("Aceitar desafio", id);
  };

  const handleDecline = (id: number) => {
    console.log("Recusar desafio", id);
  };

  return (
    <div className="min-h-screen pb-24">
      <Header title="Desafios" showBack onBack={() => navigate("/")} />

      <div className="max-w-[414px] mx-auto p-5">
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Recebidos</TabsTrigger>
            <TabsTrigger value="sent">Enviados</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-6 space-y-4">
            {receivedChallenges.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum desafio recebido</p>
              </Card>
            ) : (
              receivedChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold">{challenge.challengerName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Te desafiou!
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10">
                      <Clock className="w-3 h-3 mr-1" />
                      Novo
                    </Badge>
                  </div>

                  <p className="text-sm mb-4">
                    Substitua seus hábitos pelos de {challenge.challengerName} e complete todos para vencer!
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDecline(challenge.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Recusar
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAccept(challenge.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Aceitar
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-6 space-y-4">
            {sentChallenges.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum desafio enviado</p>
              </Card>
            ) : (
              sentChallenges.map((challenge) => (
                <Card key={challenge.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold">Desafio enviado</h3>
                      <p className="text-sm text-muted-foreground">
                        Para: {challenge.challengerName}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        challenge.status === 'accepted'
                          ? 'bg-green-500/10 text-green-600'
                          : challenge.status === 'declined'
                          ? 'bg-red-500/10 text-red-600'
                          : 'bg-yellow-500/10 text-yellow-600'
                      }
                    >
                      {challenge.status === 'accepted' && 'Aceito'}
                      {challenge.status === 'declined' && 'Recusado'}
                      {challenge.status === 'open' && 'Aguardando'}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {new Date(challenge.createdAt).toLocaleDateString('pt-BR')}
                  </p>
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
