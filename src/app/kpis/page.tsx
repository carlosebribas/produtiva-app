"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/custom/sidebar";
import { DashboardCard } from "@/components/custom/dashboard-card";
import { KPICard } from "@/components/custom/kpi-card";
import { NotificationCenter } from "@/components/custom/notification-center";
import { supabase, type KPI } from "@/lib/supabase";
import { Plus, Target, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KPIsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadKPIs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("kpis")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setKpis(data || []);
    } catch (error) {
      console.error("Erro ao carregar KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKPIs();
  }, []);

  const totalKPIs = kpis.length;
  const onTrackKPIs = kpis.filter(kpi => (kpi.current_value / kpi.target_value) >= 0.7).length;
  const exceededKPIs = kpis.filter(kpi => (kpi.current_value / kpi.target_value) >= 1).length;
  const avgProgress = kpis.length > 0 
    ? kpis.reduce((acc, kpi) => acc + (kpi.current_value / kpi.target_value), 0) / kpis.length * 100
    : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar 
        open={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Indicadores de Performance (KPIs)</h1>
              <p className="text-sm text-gray-400 mt-1">Acompanhe as metas e resultados da equipe</p>
            </div>
            <div className="flex gap-2">
              <NotificationCenter />
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#4CAF50]/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo KPI
              </Button>
            </div>
          </div>

          {/* Métricas Resumidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-[#4CAF50] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total de KPIs</p>
                  <p className="text-3xl font-bold text-white mt-2">{totalKPIs}</p>
                </div>
                <Target className="w-8 h-8 text-[#4CAF50]" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-[#4CAF50] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">No Caminho Certo</p>
                  <p className="text-3xl font-bold text-white mt-2">{onTrackKPIs}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-[#4CAF50] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Metas Superadas</p>
                  <p className="text-3xl font-bold text-white mt-2">{exceededKPIs}</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-[#4CAF50] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Progresso Médio</p>
                  <p className="text-3xl font-bold text-white mt-2">{avgProgress.toFixed(0)}%</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Lista de KPIs */}
          <DashboardCard title="Todos os KPIs">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Carregando KPIs...</div>
            ) : kpis.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Nenhum KPI cadastrado ainda</p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-[#4CAF50] hover:bg-[#45a049] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro KPI
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((kpi) => (
                  <KPICard key={kpi.id} kpi={kpi} />
                ))}
              </div>
            )}
          </DashboardCard>
        </div>
      </main>

      {/* Modal de Formulário KPI */}
      {showForm && (
        <KPIFormModal 
          onClose={() => setShowForm(false)}
          onKPICreated={loadKPIs}
        />
      )}
    </div>
  );
}

function KPIFormModal({ onClose, onKPICreated }: { onClose: () => void; onKPICreated: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    target_value: "",
    current_value: "",
    unit: "number",
    category: "general",
    assignee: "",
    period: "monthly",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.target_value) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from("kpis").insert({
        name: formData.name,
        description: formData.description,
        target_value: parseFloat(formData.target_value),
        current_value: parseFloat(formData.current_value) || 0,
        unit: formData.unit,
        category: formData.category,
        assignee: formData.assignee,
        period: formData.period,
      });

      if (error) throw error;

      alert("KPI criado com sucesso!");
      onKPICreated();
      onClose();
    } catch (error) {
      console.error("Erro ao criar KPI:", error);
      alert("Erro ao criar KPI. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1A1A1A] border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Novo KPI</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome do KPI *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none"
              placeholder="Ex: Taxa de Conversão"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none min-h-[80px]"
              placeholder="Descrição do indicador..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Valor Meta *</label>
              <input
                type="number"
                step="0.01"
                value={formData.target_value}
                onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none"
                placeholder="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Valor Atual</label>
              <input
                type="number"
                step="0.01"
                value={formData.current_value}
                onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Unidade</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none"
              >
                <option value="number">Número</option>
                <option value="%">Porcentagem</option>
                <option value="R$">Reais</option>
                <option value="h">Horas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none"
              >
                <option value="general">Geral</option>
                <option value="sales">Vendas</option>
                <option value="marketing">Marketing</option>
                <option value="support">Suporte</option>
                <option value="development">Desenvolvimento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none"
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Responsável</label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none"
              placeholder="Nome do responsável"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent border-gray-800 text-white hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white"
            >
              {loading ? "Criando..." : "Criar KPI"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
