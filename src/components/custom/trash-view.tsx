"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, RotateCcw, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "./dashboard-card";

interface TrashItem {
  id: string;
  task_id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  assignee: string | null;
  removed_at: string;
  expires_at: string;
  original_created_at: string | null;
  original_updated_at: string | null;
}

interface TrashViewProps {
  onClose: () => void;
  onTaskRestored: () => void;
}

export function TrashView({ onClose, onTaskRestored }: TrashViewProps) {
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrashItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("trash")
        .select("*")
        .order("removed_at", { ascending: false });

      if (error) throw error;
      setTrashItems(data || []);
    } catch (error) {
      console.error("Erro ao carregar lixeira:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item: TrashItem) => {
    if (!window.confirm("Deseja restaurar esta tarefa?")) return;

    try {
      // Restaurar tarefa na tabela tasks
      const { error: insertError } = await supabase.from("tasks").insert({
        id: item.task_id,
        title: item.title,
        description: item.description,
        priority: item.priority,
        status: item.status,
        due_date: item.due_date,
        assignee: item.assignee,
        created_at: item.original_created_at,
        updated_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      // Remover da lixeira
      const { error: deleteError } = await supabase
        .from("trash")
        .delete()
        .eq("id", item.id);

      if (deleteError) throw deleteError;

      setTrashItems(trashItems.filter((t) => t.id !== item.id));
      onTaskRestored();
      alert("Tarefa restaurada com sucesso!");
    } catch (error) {
      console.error("Erro ao restaurar tarefa:", error);
      alert("Erro ao restaurar tarefa. Tente novamente.");
    }
  };

  const handlePermanentDelete = async (item: TrashItem) => {
    if (
      !window.confirm(
        "Deseja excluir permanentemente esta tarefa? Esta ação não pode ser desfeita!"
      )
    )
      return;

    try {
      const { error } = await supabase.from("trash").delete().eq("id", item.id);

      if (error) throw error;

      setTrashItems(trashItems.filter((t) => t.id !== item.id));
      alert("Tarefa excluída permanentemente!");
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Erro ao excluir tarefa. Tente novamente.");
    }
  };

  const handleEmptyTrash = async () => {
    if (
      !window.confirm(
        "Deseja esvaziar toda a lixeira? Todas as tarefas serão excluídas permanentemente!"
      )
    )
      return;

    try {
      const { error } = await supabase.from("trash").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      setTrashItems([]);
      alert("Lixeira esvaziada com sucesso!");
    } catch (error) {
      console.error("Erro ao esvaziar lixeira:", error);
      alert("Erro ao esvaziar lixeira. Tente novamente.");
    }
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffTime = expires.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    loadTrashItems();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Lixeira</h2>
              <p className="text-sm text-gray-400">
                Tarefas excluídas são mantidas por 10 dias
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {trashItems.length > 0 && (
              <Button
                onClick={handleEmptyTrash}
                variant="outline"
                className="bg-red-500/20 border-red-500/50 text-red-500 hover:bg-red-500/30"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Esvaziar Lixeira
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              Carregando lixeira...
            </div>
          ) : trashItems.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">A lixeira está vazia</p>
              <p className="text-gray-500 text-sm mt-2">
                Tarefas excluídas aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trashItems.map((item) => {
                const daysRemaining = getDaysRemaining(item.expires_at);
                const isExpiringSoon = daysRemaining <= 3;

                return (
                  <div
                    key={item.id}
                    className="bg-[#0A0A0A] border border-gray-800 rounded-lg p-4 hover:border-red-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`w-2 h-2 rounded-full ${getPriorityColor(
                              item.priority
                            )}`}
                          />
                          <h3 className="text-white font-medium line-through opacity-60">
                            {item.title}
                          </h3>
                        </div>

                        {item.description && (
                          <p className="text-sm text-gray-400 mb-2 line-through opacity-60">
                            {item.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span>
                            🗑️ Removida em{" "}
                            {new Date(item.removed_at).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                          {item.assignee && <span>👤 {item.assignee}</span>}
                          {item.due_date && (
                            <span>
                              📅{" "}
                              {new Date(item.due_date).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          )}
                        </div>

                        <div
                          className={`mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                            isExpiringSoon
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          <AlertCircle className="w-3 h-3" />
                          {daysRemaining > 0
                            ? `Expira em ${daysRemaining} dia${
                                daysRemaining > 1 ? "s" : ""
                              }`
                            : "Expira hoje"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestore(item)}
                          className="p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-all hover:scale-110"
                          title="Restaurar tarefa"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(item)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all hover:scale-110"
                          title="Excluir permanentemente"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
