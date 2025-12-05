"use client";

import { useState } from "react";
import { Sidebar } from "@/components/custom/sidebar";
import { DashboardCard } from "@/components/custom/dashboard-card";
import { 
  Webhook, 
  Mail, 
  MessageSquare, 
  Calendar,
  Check,
  X,
  Settings,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  config?: any;
};

export default function IntegrationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "slack",
      name: "Slack",
      description: "Receba notificações de tarefas e atualizações no Slack",
      icon: MessageSquare,
      enabled: false,
      config: { webhookUrl: "" }
    },
    {
      id: "email",
      name: "Email",
      description: "Envie relatórios e notificações por email",
      icon: Mail,
      enabled: false,
      config: { smtpServer: "", port: "", email: "" }
    },
    {
      id: "calendar",
      name: "Google Calendar",
      description: "Sincronize tarefas com seu calendário",
      icon: Calendar,
      enabled: false,
      config: { apiKey: "" }
    },
    {
      id: "webhook",
      name: "Webhooks",
      description: "Configure webhooks personalizados para eventos",
      icon: Webhook,
      enabled: false,
      config: { url: "", events: [] }
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(int => 
      int.id === id ? { ...int, enabled: !int.enabled } : int
    ));
  };

  const saveConfig = (id: string, config: any) => {
    setIntegrations(integrations.map(int => 
      int.id === id ? { ...int, config } : int
    ));
    setSelectedIntegration(null);
    alert("Configuração salva com sucesso!");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Integrações</h1>
            <p className="text-sm text-gray-400 mt-1">Conecte suas ferramentas favoritas</p>
          </div>

          {/* Lista de Integrações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <DashboardCard key={integration.id} title="">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      integration.enabled ? "bg-[#4CAF50]" : "bg-gray-800"
                    }`}>
                      <integration.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{integration.name}</h3>
                      <p className="text-sm text-gray-400">{integration.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => toggleIntegration(integration.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            integration.enabled
                              ? "bg-green-500/20 text-green-500"
                              : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {integration.enabled ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-3 h-3" /> Ativo
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <X className="w-3 h-3" /> Inativo
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedIntegration(integration)}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 hover:text-white transition-all"
                        >
                          <Settings className="w-3 h-3 inline mr-1" />
                          Configurar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>

          {/* Documentação */}
          <DashboardCard title="Documentação da API">
            <div className="space-y-4">
              <p className="text-gray-400">
                Integre seu sistema com nossa API RESTful completa. Acesse a documentação para mais detalhes.
              </p>
              <div className="flex gap-3">
                <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Documentação
                </Button>
                <Button variant="outline" className="bg-[#1A1A1A] border-gray-800 text-white hover:bg-[#2A2A2A]">
                  Gerar API Key
                </Button>
              </div>
            </div>
          </DashboardCard>
        </div>
      </main>

      {/* Modal de Configuração */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              Configurar {selectedIntegration.name}
            </h2>
            
            <div className="space-y-4">
              {selectedIntegration.id === "slack" && (
                <div>
                  <Label className="text-gray-400">Webhook URL</Label>
                  <Input
                    placeholder="https://hooks.slack.com/services/..."
                    className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                    defaultValue={selectedIntegration.config?.webhookUrl}
                  />
                </div>
              )}

              {selectedIntegration.id === "email" && (
                <>
                  <div>
                    <Label className="text-gray-400">Servidor SMTP</Label>
                    <Input
                      placeholder="smtp.gmail.com"
                      className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                      defaultValue={selectedIntegration.config?.smtpServer}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400">Porta</Label>
                    <Input
                      placeholder="587"
                      className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                      defaultValue={selectedIntegration.config?.port}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400">Email</Label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                      defaultValue={selectedIntegration.config?.email}
                    />
                  </div>
                </>
              )}

              {selectedIntegration.id === "calendar" && (
                <div>
                  <Label className="text-gray-400">API Key</Label>
                  <Input
                    placeholder="Sua API Key do Google Calendar"
                    className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                    defaultValue={selectedIntegration.config?.apiKey}
                  />
                </div>
              )}

              {selectedIntegration.id === "webhook" && (
                <div>
                  <Label className="text-gray-400">URL do Webhook</Label>
                  <Input
                    placeholder="https://seu-servidor.com/webhook"
                    className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                    defaultValue={selectedIntegration.config?.url}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => saveConfig(selectedIntegration.id, selectedIntegration.config)}
                className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white"
              >
                Salvar
              </Button>
              <Button
                onClick={() => setSelectedIntegration(null)}
                variant="outline"
                className="flex-1 bg-transparent border-gray-800 text-white hover:bg-gray-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
