"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/custom/sidebar";
import { DashboardCard } from "@/components/custom/dashboard-card";
import { EvaluationForm } from "@/components/custom/evaluation-form";
import { NotificationCenter } from "@/components/custom/notification-center";
import { supabase, type Evaluation } from "@/lib/supabase";
import { Plus, Star, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EvaluationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("evaluations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEvaluations(data || []);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluations();
  }, []);

  const totalEvaluations = evaluations.length;
  const avgRating = evaluations.length > 0 
    ? evaluations.reduce((acc, ev) => acc + ev.rating, 0) / evaluations.length
    : 0;
  const highRatings = evaluations.filter(ev => ev.rating >= 4).length;
  const uniqueEvaluated = new Set(evaluations.map(ev => ev.evaluated)).size;

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
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Avaliações e Feedback</h1>
              <p className="text-sm text-gray-400 mt-1">Sistema de avaliação de desempenho da equipe</p>
            </div>
            <div className="flex gap-2">
              <NotificationCenter />
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#4CAF50]/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Avaliação
              </Button>
            </div>
          </div>

          {/* Métricas Resumidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-[#4CAF50] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total de Avaliações</p>
                  <p className="text-3xl font-bold text-white mt-2">{totalEvaluations}</p>
                </div>
                <Star className="w-8 h-8 text-[#4CAF50]" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-[#4CAF50] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Média Geral</p>
                  <p className="text-3xl font-bold text-white mt-2">{avgRating.toFixed(1)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-[#4CAF50] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avaliações Altas</p>
                  <p className="text-3xl font-bold text-white mt-2">{highRatings}</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-[#4CAF50] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pessoas Avaliadas</p>
                  <p className="text-3xl font-bold text-white mt-2">{uniqueEvaluated}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Lista de Avaliações */}
          <DashboardCard title="Todas as Avaliações">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Carregando avaliações...</div>
            ) : evaluations.length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Nenhuma avaliação registrada ainda</p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-[#4CAF50] hover:bg-[#45a049] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Avaliação
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {evaluations.map((evaluation) => (
                  <div
                    key={evaluation.id}
                    className="bg-[#0A0A0A] border border-gray-800 rounded-lg p-6 hover:border-[#4CAF50] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-semibold">{evaluation.evaluator}</span>
                          <span className="text-gray-500">→</span>
                          <span className="text-white font-semibold">{evaluation.evaluated}</span>
                        </div>
                        <span className="inline-block px-3 py-1 bg-[#4CAF50]/20 text-[#4CAF50] text-xs rounded-full">
                          {evaluation.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= evaluation.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {evaluation.feedback && (
                      <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-4 mb-3">
                        <p className="text-sm text-gray-300">{evaluation.feedback}</p>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      {new Date(evaluation.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>
      </main>

      {/* Modal de Formulário */}
      {showForm && (
        <EvaluationForm 
          onClose={() => setShowForm(false)}
          onEvaluationCreated={loadEvaluations}
        />
      )}
    </div>
  );
}
