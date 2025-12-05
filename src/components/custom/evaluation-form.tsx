"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface EvaluationFormProps {
  onClose: () => void;
  onEvaluationCreated: () => void;
}

export function EvaluationForm({ onClose, onEvaluationCreated }: EvaluationFormProps) {
  const [formData, setFormData] = useState({
    evaluator: "",
    evaluated: "",
    rating: 0,
    category: "performance",
    feedback: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.evaluator || !formData.evaluated || formData.rating === 0) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from("evaluations").insert({
        evaluator: formData.evaluator,
        evaluated: formData.evaluated,
        rating: formData.rating,
        category: formData.category,
        feedback: formData.feedback,
      });

      if (error) throw error;

      // Criar notificação para o avaliado
      await supabase.from("notifications").insert({
        user_id: formData.evaluated,
        title: "Nova Avaliação Recebida",
        message: `${formData.evaluator} avaliou você com ${formData.rating} estrelas na categoria ${formData.category}`,
        type: "info",
      });

      alert("Avaliação enviada com sucesso!");
      onEvaluationCreated();
      onClose();
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
      alert("Erro ao criar avaliação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1A1A1A] border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Nova Avaliação</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Avaliador *
              </label>
              <input
                type="text"
                value={formData.evaluator}
                onChange={(e) => setFormData({ ...formData, evaluator: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Avaliado *
              </label>
              <input
                type="text"
                value={formData.evaluated}
                onChange={(e) => setFormData({ ...formData, evaluated: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none"
                placeholder="Nome do avaliado"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none"
            >
              <option value="performance">Performance</option>
              <option value="communication">Comunicação</option>
              <option value="leadership">Liderança</option>
              <option value="teamwork">Trabalho em Equipe</option>
              <option value="technical">Habilidades Técnicas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Avaliação * ({formData.rating}/5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-all hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= formData.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Feedback
            </label>
            <textarea
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-[#4CAF50] focus:outline-none min-h-[120px]"
              placeholder="Comentários e sugestões..."
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
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
