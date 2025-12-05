"use client";

import { useState } from "react";
import { X, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface TaskFormProps {
  onClose: () => void;
  onTaskCreated: () => void;
}

export function TaskForm({ onClose, onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("tasks").insert([
        {
          title,
          description: description || null,
          priority,
          status: "pending",
          due_date: dueDate || null,
          assignee: assignee || null,
        },
      ]);

      if (error) throw error;

      // Limpar formulário
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setAssignee("");
      
      onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Erro ao criar tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Nova Tarefa</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Revisar proposta de projeto"
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50] transition-colors"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes sobre a tarefa..."
              rows={3}
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50] transition-colors resize-none"
            />
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prioridade
            </label>
            <div className="flex gap-2">
              {[
                { value: "low", label: "Baixa", color: "bg-blue-500" },
                { value: "medium", label: "Média", color: "bg-yellow-500" },
                { value: "high", label: "Alta", color: "bg-red-500" },
              ].map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value as "low" | "medium" | "high")}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                    priority === p.value
                      ? `${p.color} border-transparent text-white`
                      : "bg-[#0A0A0A] border-gray-800 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Data de Vencimento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#4CAF50] transition-colors"
            />
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Responsável
            </label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Nome do responsável"
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50] transition-colors"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent border-gray-800 text-gray-300 hover:bg-[#0A0A0A] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !title}
              className="flex-1 bg-[#4CAF50] hover:bg-[#45a049] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Criando..." : "Criar Tarefa"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
