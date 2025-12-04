"use client";

import { useState } from "react";
import { Sidebar } from "@/components/custom/sidebar";
import { DashboardCard } from "@/components/custom/dashboard-card";
import { MetricCard } from "@/components/custom/metric-card";
import { TaskCard } from "@/components/custom/task-card";
import { WeeklyChart } from "@/components/custom/weekly-chart";
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [clickCount, setClickCount] = useState(0);

  // Dados mockados para o dashboard
  const metrics = [
    {
      title: "Tarefas Concluídas",
      value: "24",
      change: "+12%",
      trend: "up" as const,
      icon: CheckCircle2,
    },
    {
      title: "Em Andamento",
      value: "8",
      change: "-3%",
      trend: "down" as const,
      icon: Clock,
    },
    {
      title: "Produtividade",
      value: "87%",
      change: "+5%",
      trend: "up" as const,
      icon: TrendingUp,
    },
    {
      title: "Tarefas Críticas",
      value: "3",
      change: "0%",
      trend: "neutral" as const,
      icon: AlertCircle,
    },
  ];

  const criticalTasks = [
    {
      id: 1,
      title: "Revisar proposta de projeto Q1",
      priority: "high" as const,
      dueDate: "Hoje, 18:00",
      assignee: "João Silva",
    },
    {
      id: 2,
      title: "Preparar apresentação para cliente",
      priority: "high" as const,
      dueDate: "Amanhã, 10:00",
      assignee: "Maria Santos",
    },
    {
      id: 3,
      title: "Finalizar relatório mensal",
      priority: "medium" as const,
      dueDate: "Amanhã, 17:00",
      assignee: "Pedro Costa",
    },
  ];

  const weeklyData = [
    { day: "Seg", completed: 12, pending: 5 },
    { day: "Ter", completed: 15, pending: 3 },
    { day: "Qua", completed: 8, pending: 7 },
    { day: "Qui", completed: 18, pending: 2 },
    { day: "Sex", completed: 14, pending: 4 },
    { day: "Sáb", completed: 6, pending: 1 },
    { day: "Dom", completed: 4, pending: 2 },
  ];

  const handleNewTask = () => {
    setClickCount(prev => prev + 1);
    console.log("Botão Nova Tarefa clicado!");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">Visão geral da semana</p>
              {clickCount > 0 && (
                <p className="text-xs text-[#4CAF50] mt-2">
                  ✓ Interatividade funcionando! Cliques: {clickCount}
                </p>
              )}
            </div>
            <Button 
              onClick={handleNewTask}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#4CAF50]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Gráfico Semanal e Tarefas Críticas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DashboardCard title="Produtividade Semanal" className="lg:col-span-2">
              <WeeklyChart data={weeklyData} />
            </DashboardCard>

            <DashboardCard title="Tarefas Críticas" className="lg:col-span-1">
              <div className="space-y-3">
                {criticalTasks.map((task) => (
                  <TaskCard key={task.id} {...task} />
                ))}
              </div>
            </DashboardCard>
          </div>

          {/* Badges de Gamificação */}
          <DashboardCard title="Conquistas Recentes">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Semana Produtiva", icon: "🏆", unlocked: true },
                { name: "Streak 7 dias", icon: "🔥", unlocked: true },
                { name: "100 Tarefas", icon: "⭐", unlocked: false },
                { name: "Meta Mensal", icon: "🎯", unlocked: false },
              ].map((badge, index) => (
                <button
                  key={index}
                  onClick={() => setClickCount(prev => prev + 1)}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                    badge.unlocked
                      ? "bg-[#1A1A1A] border-[#4CAF50] shadow-lg shadow-[#4CAF50]/10"
                      : "bg-[#151515] border-gray-800 opacity-50"
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="text-xs text-gray-400">{badge.name}</p>
                </button>
              ))}
            </div>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
}
