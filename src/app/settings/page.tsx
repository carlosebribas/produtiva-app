"use client";

import { useState } from "react";
import { Sidebar } from "@/components/custom/sidebar";
import { DashboardCard } from "@/components/custom/dashboard-card";
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Lock,
  Mail,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SettingsTab = "profile" | "notifications" | "security" | "appearance";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [settings, setSettings] = useState({
    profile: {
      name: "João Silva",
      email: "joao.silva@empresa.com",
      role: "Gestor",
      team: "Desenvolvimento",
      phone: "+55 11 99999-9999"
    },
    notifications: {
      emailNotifications: true,
      taskReminders: true,
      weeklyReports: true,
      evaluationAlerts: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      passwordLastChanged: "2024-01-15"
    },
    appearance: {
      theme: "dark",
      language: "pt-BR",
      dateFormat: "DD/MM/YYYY"
    }
  });

  const tabs = [
    { id: "profile" as SettingsTab, label: "Perfil", icon: User },
    { id: "notifications" as SettingsTab, label: "Notificações", icon: Bell },
    { id: "security" as SettingsTab, label: "Segurança", icon: Shield },
    { id: "appearance" as SettingsTab, label: "Aparência", icon: Palette },
  ];

  const saveSettings = () => {
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Configurações</h1>
              <p className="text-sm text-gray-400 mt-1">Gerencie suas preferências e configurações</p>
            </div>
            <Button 
              onClick={saveSettings}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#4CAF50] text-white"
                    : "bg-[#1A1A1A] text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteúdo das Tabs */}
          <div className="space-y-6">
            {/* Perfil */}
            {activeTab === "profile" && (
              <DashboardCard title="Informações do Perfil">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#45a049] flex items-center justify-center text-white text-2xl font-bold">
                      JS
                    </div>
                    <Button variant="outline" className="bg-[#1A1A1A] border-gray-800 text-white hover:bg-[#2A2A2A]">
                      Alterar Foto
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400">Nome Completo</Label>
                      <Input
                        value={settings.profile.name}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, name: e.target.value }
                        })}
                        className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400">Email</Label>
                      <Input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, email: e.target.value }
                        })}
                        className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400">Cargo</Label>
                      <Input
                        value={settings.profile.role}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, role: e.target.value }
                        })}
                        className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400">Equipe</Label>
                      <Input
                        value={settings.profile.team}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, team: e.target.value }
                        })}
                        className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400">Telefone</Label>
                      <Input
                        value={settings.profile.phone}
                        onChange={(e) => setSettings({
                          ...settings,
                          profile: { ...settings.profile, phone: e.target.value }
                        })}
                        className="bg-[#0A0A0A] border-gray-800 text-white mt-1"
                      />
                    </div>
                  </div>
                </div>
              </DashboardCard>
            )}

            {/* Notificações */}
            {activeTab === "notifications" && (
              <DashboardCard title="Preferências de Notificações">
                <div className="space-y-4">
                  {[
                    { key: "emailNotifications", label: "Notificações por Email", icon: Mail },
                    { key: "taskReminders", label: "Lembretes de Tarefas", icon: Bell },
                    { key: "weeklyReports", label: "Relatórios Semanais", icon: Mail },
                    { key: "evaluationAlerts", label: "Alertas de Avaliações", icon: Bell },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-gray-400" />
                        <span className="text-white">{item.label}</span>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            [item.key]: !settings.notifications[item.key as keyof typeof settings.notifications]
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settings.notifications[item.key as keyof typeof settings.notifications]
                            ? "bg-[#4CAF50]"
                            : "bg-gray-700"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                          settings.notifications[item.key as keyof typeof settings.notifications]
                            ? "ml-6"
                            : "ml-0.5"
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            )}

            {/* Segurança */}
            {activeTab === "security" && (
              <div className="space-y-4">
                <DashboardCard title="Segurança da Conta">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-white block">Autenticação de Dois Fatores</span>
                          <span className="text-xs text-gray-400">Adicione uma camada extra de segurança</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            twoFactorAuth: !settings.security.twoFactorAuth
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settings.security.twoFactorAuth ? "bg-[#4CAF50]" : "bg-gray-700"
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                          settings.security.twoFactorAuth ? "ml-6" : "ml-0.5"
                        }`} />
                      </button>
                    </div>

                    <div className="p-4 bg-[#0A0A0A] rounded-lg">
                      <Label className="text-gray-400">Tempo de Sessão (minutos)</Label>
                      <Input
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => setSettings({
                          ...settings,
                          security: { ...settings.security, sessionTimeout: e.target.value }
                        })}
                        className="bg-[#1A1A1A] border-gray-800 text-white mt-2"
                      />
                    </div>

                    <div className="p-4 bg-[#0A0A0A] rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white block">Alterar Senha</span>
                          <span className="text-xs text-gray-400">
                            Última alteração: {settings.security.passwordLastChanged}
                          </span>
                        </div>
                        <Button variant="outline" className="bg-[#1A1A1A] border-gray-800 text-white hover:bg-[#2A2A2A]">
                          Alterar
                        </Button>
                      </div>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard title="Controle de Acesso">
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm">
                      Gerencie permissões e níveis de acesso para diferentes usuários e equipes.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-4 bg-[#0A0A0A] rounded-lg border border-gray-800">
                        <h4 className="text-white font-medium mb-1">Admin</h4>
                        <p className="text-xs text-gray-400">Acesso total ao sistema</p>
                      </div>
                      <div className="p-4 bg-[#0A0A0A] rounded-lg border border-gray-800">
                        <h4 className="text-white font-medium mb-1">Gestor</h4>
                        <p className="text-xs text-gray-400">Gerenciar equipe e tarefas</p>
                      </div>
                      <div className="p-4 bg-[#0A0A0A] rounded-lg border border-gray-800">
                        <h4 className="text-white font-medium mb-1">Membro</h4>
                        <p className="text-xs text-gray-400">Visualizar e executar tarefas</p>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            )}

            {/* Aparência */}
            {activeTab === "appearance" && (
              <DashboardCard title="Preferências de Aparência">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-400 mb-2 block">Tema</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-4 bg-[#0A0A0A] border-2 border-[#4CAF50] rounded-lg">
                        <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-black rounded mb-2" />
                        <span className="text-white text-sm">Escuro</span>
                      </button>
                      <button className="p-4 bg-[#0A0A0A] border border-gray-800 rounded-lg hover:border-gray-700">
                        <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-white rounded mb-2" />
                        <span className="text-white text-sm">Claro</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-400">Idioma</Label>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, language: e.target.value }
                      })}
                      className="w-full bg-[#0A0A0A] border border-gray-800 text-white rounded-lg p-2 mt-1"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-gray-400">Formato de Data</Label>
                    <select
                      value={settings.appearance.dateFormat}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, dateFormat: e.target.value }
                      })}
                      className="w-full bg-[#0A0A0A] border border-gray-800 text-white rounded-lg p-2 mt-1"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </DashboardCard>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
