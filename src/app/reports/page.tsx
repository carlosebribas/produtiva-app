"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/custom/sidebar";
import { DashboardCard } from "@/components/custom/dashboard-card";
import { supabase } from "@/lib/supabase";
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Calendar,
  Users,
  Target,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ReportType = "tasks" | "kpis" | "evaluations" | "team";

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportType>("tasks");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const generateReport = async (type: ReportType) => {
    setLoading(true);
    try {
      switch (type) {
        case "tasks":
          const { data: tasks } = await supabase.from("tasks").select("*");
          const completed = tasks?.filter(t => t.status === "completed").length || 0;
          const pending = tasks?.filter(t => t.status === "pending").length || 0;
          const inProgress = tasks?.filter(t => t.status === "in_progress").length || 0;
          
          setReportData({
            total: tasks?.length || 0,
            completed,
            pending,
            inProgress,
            completionRate: tasks?.length ? ((completed / tasks.length) * 100).toFixed(1) : 0,
            byPriority: {
              high: tasks?.filter(t => t.priority === "high").length || 0,
              medium: tasks?.filter(t => t.priority === "medium").length || 0,
              low: tasks?.filter(t => t.priority === "low").length || 0,
            }
          });
          break;

        case "kpis":
          const { data: kpis } = await supabase.from("kpis").select("*");
          const achieved = kpis?.filter(k => k.current_value >= k.target_value).length || 0;
          
          setReportData({
            total: kpis?.length || 0,
            achieved,
            pending: (kpis?.length || 0) - achieved,
            achievementRate: kpis?.length ? ((achieved / kpis.length) * 100).toFixed(1) : 0,
            byCategory: kpis?.reduce((acc: any, kpi: any) => {
              acc[kpi.category] = (acc[kpi.category] || 0) + 1;
              return acc;
            }, {})
          });
          break;

        case "evaluations":
          const { data: evaluations } = await supabase.from("evaluations").select("*");
          const avgRating = evaluations?.length 
            ? (evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length).toFixed(1)
            : 0;
          
          setReportData({
            total: evaluations?.length || 0,
            averageRating: avgRating,
            byCategory: evaluations?.reduce((acc: any, eval: any) => {
              acc[eval.category] = (acc[eval.category] || 0) + 1;
              return acc;
            }, {}),
            ratingDistribution: {
              excellent: evaluations?.filter(e => e.rating >= 4.5).length || 0,
              good: evaluations?.filter(e => e.rating >= 3.5 && e.rating < 4.5).length || 0,
              average: evaluations?.filter(e => e.rating >= 2.5 && e.rating < 3.5).length || 0,
              poor: evaluations?.filter(e => e.rating < 2.5).length || 0,
            }
          });
          break;

        case "team":
          const { data: allTasks } = await supabase.from("tasks").select("*");
          const teamPerformance = allTasks?.reduce((acc: any, task: any) => {
            if (task.assignee) {
              if (!acc[task.assignee]) {
                acc[task.assignee] = { total: 0, completed: 0 };
              }
              acc[task.assignee].total++;
              if (task.status === "completed") {
                acc[task.assignee].completed++;
              }
            }
            return acc;
          }, {});

          setReportData({
            members: Object.keys(teamPerformance || {}).length,
            performance: teamPerformance,
            topPerformers: Object.entries(teamPerformance || {})
              .map(([name, data]: [string, any]) => ({
                name,
                completionRate: ((data.completed / data.total) * 100).toFixed(1)
              }))
              .sort((a, b) => parseFloat(b.completionRate) - parseFloat(a.completionRate))
              .slice(0, 5)
          });
          break;
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport(selectedReport);
  }, [selectedReport]);

  const exportReport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-${selectedReport}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const reportTypes = [
    { id: "tasks" as ReportType, label: "Tarefas", icon: Activity },
    { id: "kpis" as ReportType, label: "KPIs", icon: Target },
    { id: "evaluations" as ReportType, label: "Avaliações", icon: BarChart3 },
    { id: "team" as ReportType, label: "Equipe", icon: Users },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Relatórios e Análises</h1>
              <p className="text-sm text-gray-400 mt-1">Visualize métricas e insights detalhados</p>
            </div>
            <Button 
              onClick={exportReport}
              disabled={!reportData}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>

          {/* Seletor de Tipo de Relatório */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  selectedReport === type.id
                    ? "bg-[#4CAF50] border-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/20"
                    : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-[#4CAF50]"
                }`}
              >
                <type.icon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Conteúdo do Relatório */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Gerando relatório...</div>
          ) : reportData ? (
            <div className="space-y-6">
              {/* Relatório de Tarefas */}
              {selectedReport === "tasks" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DashboardCard title="Total de Tarefas">
                      <div className="text-4xl font-bold text-white">{reportData.total}</div>
                    </DashboardCard>
                    <DashboardCard title="Concluídas">
                      <div className="text-4xl font-bold text-green-500">{reportData.completed}</div>
                    </DashboardCard>
                    <DashboardCard title="Em Andamento">
                      <div className="text-4xl font-bold text-yellow-500">{reportData.inProgress}</div>
                    </DashboardCard>
                    <DashboardCard title="Taxa de Conclusão">
                      <div className="text-4xl font-bold text-[#4CAF50]">{reportData.completionRate}%</div>
                    </DashboardCard>
                  </div>

                  <DashboardCard title="Distribuição por Prioridade">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Alta Prioridade</span>
                        <span className="text-red-500 font-bold">{reportData.byPriority.high}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Média Prioridade</span>
                        <span className="text-yellow-500 font-bold">{reportData.byPriority.medium}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Baixa Prioridade</span>
                        <span className="text-blue-500 font-bold">{reportData.byPriority.low}</span>
                      </div>
                    </div>
                  </DashboardCard>
                </>
              )}

              {/* Relatório de KPIs */}
              {selectedReport === "kpis" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DashboardCard title="Total de KPIs">
                      <div className="text-4xl font-bold text-white">{reportData.total}</div>
                    </DashboardCard>
                    <DashboardCard title="Alcançados">
                      <div className="text-4xl font-bold text-green-500">{reportData.achieved}</div>
                    </DashboardCard>
                    <DashboardCard title="Taxa de Sucesso">
                      <div className="text-4xl font-bold text-[#4CAF50]">{reportData.achievementRate}%</div>
                    </DashboardCard>
                  </div>

                  <DashboardCard title="KPIs por Categoria">
                    <div className="space-y-3">
                      {Object.entries(reportData.byCategory || {}).map(([category, count]: [string, any]) => (
                        <div key={category} className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                          <span className="text-gray-300 capitalize">{category}</span>
                          <span className="text-[#4CAF50] font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </DashboardCard>
                </>
              )}

              {/* Relatório de Avaliações */}
              {selectedReport === "evaluations" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DashboardCard title="Total de Avaliações">
                      <div className="text-4xl font-bold text-white">{reportData.total}</div>
                    </DashboardCard>
                    <DashboardCard title="Nota Média">
                      <div className="text-4xl font-bold text-[#4CAF50]">{reportData.averageRating}</div>
                    </DashboardCard>
                    <DashboardCard title="Excelentes (≥4.5)">
                      <div className="text-4xl font-bold text-green-500">{reportData.ratingDistribution.excellent}</div>
                    </DashboardCard>
                  </div>

                  <DashboardCard title="Distribuição de Notas">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Excelente (≥4.5)</span>
                        <span className="text-green-500 font-bold">{reportData.ratingDistribution.excellent}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Bom (3.5-4.4)</span>
                        <span className="text-blue-500 font-bold">{reportData.ratingDistribution.good}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Regular (2.5-3.4)</span>
                        <span className="text-yellow-500 font-bold">{reportData.ratingDistribution.average}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Ruim (&lt;2.5)</span>
                        <span className="text-red-500 font-bold">{reportData.ratingDistribution.poor}</span>
                      </div>
                    </div>
                  </DashboardCard>
                </>
              )}

              {/* Relatório de Equipe */}
              {selectedReport === "team" && (
                <>
                  <DashboardCard title="Visão Geral da Equipe">
                    <div className="text-4xl font-bold text-white mb-2">{reportData.members}</div>
                    <p className="text-gray-400">Membros ativos</p>
                  </DashboardCard>

                  <DashboardCard title="Top 5 Performers">
                    <div className="space-y-3">
                      {reportData.topPerformers.map((performer: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <span className="text-gray-300">{performer.name}</span>
                          </div>
                          <span className="text-[#4CAF50] font-bold">{performer.completionRate}%</span>
                        </div>
                      ))}
                    </div>
                  </DashboardCard>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Selecione um tipo de relatório para visualizar
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
