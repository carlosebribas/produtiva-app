"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/custom/sidebar";
import { DashboardCard } from "@/components/custom/dashboard-card";
import { TaskForm } from "@/components/custom/task-form";
import { TrashView } from "@/components/custom/trash-view";
import { supabase, type Task } from "@/lib/supabase";
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "list" | "calendar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Carregar tarefas do Supabase
  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mover tarefa para lixeira (soft delete)
  const handleMoveToTrash = async (task: Task) => {
    if (!window.confirm("Deseja mover esta tarefa para a lixeira? Ela será excluída permanentemente após 10 dias.")) return;

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 10);

      const { error: trashError } = await supabase.from("trash").insert({
        task_id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        due_date: task.due_date,
        assignee: task.assignee,
        removed_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        original_created_at: task.created_at,
        original_updated_at: task.updated_at
      });

      if (trashError) throw trashError;

      const { error: deleteError } = await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id);

      if (deleteError) throw deleteError;
      
      setTasks(tasks.filter(t => t.id !== task.id));
      
      alert("Tarefa movida para a lixeira! Será excluída permanentemente em 10 dias.");
    } catch (error) {
      console.error("Erro ao mover tarefa para lixeira:", error);
      alert("Erro ao mover tarefa para lixeira. Tente novamente.");
    }
  };

  // Alternar status da tarefa
  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", task.id);

      if (error) throw error;
      
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Erro ao atualizar tarefa. Tente novamente.");
    }
  };

  // Navegar para visualização de tarefas
  const handleNavigateToTasks = () => {
    setViewMode("list");
    setShowTrash(false);
    setSelectedDate(null);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Calcular métricas
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const highPriorityTasks = tasks.filter(t => t.priority === "high" && t.status !== "completed").length;

  const metrics = [
    {
      title: "Tarefas Concluídas",
      value: completedTasks.toString(),
      change: "+12%",
      trend: "up" as const,
      icon: CheckCircle2,
    },
    {
      title: "Em Andamento",
      value: inProgressTasks.toString(),
      change: "-3%",
      trend: "down" as const,
      icon: Clock,
    },
    {
      title: "Pendentes",
      value: pendingTasks.toString(),
      change: "+5%",
      trend: "up" as const,
      icon: TrendingUp,
    },
    {
      title: "Alta Prioridade",
      value: highPriorityTasks.toString(),
      change: "0%",
      trend: "neutral" as const,
      icon: AlertCircle,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500";
      case "in_progress": return "text-yellow-500";
      case "pending": return "text-gray-400";
      default: return "text-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Concluída";
      case "in_progress": return "Em Andamento";
      case "pending": return "Pendente";
      default: return status;
    }
  };

  // Funções do calendário
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const changeMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Adicionar dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-[#0A0A0A] border border-gray-800 rounded-lg" />);
    }

    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayTasks = getTasksForDate(date);
      const isCurrentDay = isToday(date);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 bg-[#1A1A1A] border rounded-lg p-2 cursor-pointer transition-all hover:border-[#4CAF50] ${
            isCurrentDay ? 'border-[#4CAF50] ring-2 ring-[#4CAF50]/20' : 'border-gray-800'
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isCurrentDay ? 'text-[#4CAF50]' : 'text-white'}`}>
              {day}
            </span>
            {dayTasks.length > 0 && (
              <span className="text-xs bg-[#4CAF50] text-white px-1.5 py-0.5 rounded-full">
                {dayTasks.length}
              </span>
            )}
          </div>
          <div className="space-y-1">
            {dayTasks.slice(0, 2).map((task) => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded truncate ${
                  task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-xs text-gray-500">+{dayTasks.length - 2} mais</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Cabeçalho do calendário */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={() => changeMonth(-1)}
              variant="outline"
              size="sm"
              className="bg-[#1A1A1A] border-gray-800 text-white hover:bg-[#2A2A2A]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setCurrentDate(new Date())}
              variant="outline"
              size="sm"
              className="bg-[#1A1A1A] border-gray-800 text-white hover:bg-[#2A2A2A]"
            >
              Hoje
            </Button>
            <Button
              onClick={() => changeMonth(1)}
              variant="outline"
              size="sm"
              className="bg-[#1A1A1A] border-gray-800 text-white hover:bg-[#2A2A2A]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Grade do calendário */}
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>
    );
  };

  const renderSelectedDateTasks = () => {
    if (!selectedDate) return null;

    const dayTasks = getTasksForDate(selectedDate);

    return (
      <DashboardCard title={`Tarefas - ${selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`}>
        {dayTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Nenhuma tarefa agendada para este dia
          </div>
        ) : (
          <div className="space-y-3">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className="bg-[#0A0A0A] border border-gray-800 rounded-lg p-4 hover:border-[#4CAF50] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                      <h3 className={`text-white font-medium ${task.status === "completed" ? "line-through opacity-60" : ""}`}>
                        {task.title}
                      </h3>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className={getStatusColor(task.status)}>
                        {getStatusLabel(task.status)}
                      </span>
                      {task.assignee && (
                        <span>👤 {task.assignee}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`p-2 rounded-lg transition-all hover:scale-110 ${
                        task.status === "completed" 
                          ? "bg-green-500/20 text-green-500" 
                          : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                      title={task.status === "completed" ? "Marcar como pendente" : "Marcar como concluída"}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMoveToTrash(task);
                      }}
                      className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-500/20 transition-all hover:scale-110"
                      title="Mover para lixeira (10 dias)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar 
        open={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onTrashClick={() => setShowTrash(true)}
        onTasksClick={handleNavigateToTasks}
      />
      
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Gerenciador de Tarefas</h1>
              <p className="text-sm text-gray-400 mt-1">Organize e acompanhe suas tarefas</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
                variant="outline"
                className="bg-[#1A1A1A] border-gray-800 text-white hover:bg-[#2A2A2A]"
              >
                {viewMode === "list" ? (
                  <>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Calendário
                  </>
                ) : (
                  <>
                    <List className="w-4 h-4 mr-2" />
                    Lista
                  </>
                )}
              </Button>
              <Button 
                onClick={() => setShowTaskForm(true)}
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#4CAF50]/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </Button>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-[#4CAF50] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{metric.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
                  </div>
                  <metric.icon className="w-8 h-8 text-[#4CAF50]" />
                </div>
              </div>
            ))}
          </div>

          {/* Visualização Condicional */}
          {loading ? (
            <div className="text-center py-8 text-gray-400">Carregando tarefas...</div>
          ) : viewMode === "calendar" ? (
            <div className="space-y-6">
              <DashboardCard title="Calendário de Tarefas">
                {renderCalendar()}
              </DashboardCard>
              {selectedDate && renderSelectedDateTasks()}
            </div>
          ) : (
            <DashboardCard title="Todas as Tarefas">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">Nenhuma tarefa criada ainda</p>
                  <Button 
                    onClick={() => setShowTaskForm(true)}
                    className="bg-[#4CAF50] hover:bg-[#45a049] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Tarefa
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-[#0A0A0A] border border-gray-800 rounded-lg p-4 hover:border-[#4CAF50] transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                            <h3 className={`text-white font-medium ${task.status === "completed" ? "line-through opacity-60" : ""}`}>
                              {task.title}
                            </h3>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className={getStatusColor(task.status)}>
                              {getStatusLabel(task.status)}
                            </span>
                            {task.assignee && (
                              <span>👤 {task.assignee}</span>
                            )}
                            {task.due_date && (
                              <span>📅 {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(task)}
                            className={`p-2 rounded-lg transition-all hover:scale-110 ${
                              task.status === "completed" 
                                ? "bg-green-500/20 text-green-500" 
                                : "bg-gray-800 text-gray-400 hover:text-white"
                            }`}
                            title={task.status === "completed" ? "Marcar como pendente" : "Marcar como concluída"}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Botão de lixeira clicado para tarefa:", task.id);
                              handleMoveToTrash(task);
                            }}
                            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-500/20 transition-all hover:scale-110"
                            title="Mover para lixeira (10 dias)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>
          )}
        </div>
      </main>

      {/* Modal de Formulário */}
      {showTaskForm && (
        <TaskForm 
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={loadTasks}
        />
      )}

      {/* Modal de Lixeira */}
      {showTrash && (
        <TrashView 
          onClose={() => setShowTrash(false)}
          onTaskRestored={loadTasks}
        />
      )}
    </div>
  );
}
