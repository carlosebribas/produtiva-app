import { Clock, User } from "lucide-react";

interface TaskCardProps {
  title: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  assignee: string;
}

export function TaskCard({ title, priority, dueDate, assignee }: TaskCardProps) {
  const priorityColors = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const priorityLabels = {
    high: "Alta",
    medium: "Média",
    low: "Baixa",
  };

  const handleTaskClick = () => {
    alert(`Tarefa: ${title}\nPrioridade: ${priorityLabels[priority]}\nPrazo: ${dueDate}\nResponsável: ${assignee}`);
  };

  return (
    <button 
      onClick={handleTaskClick}
      className="w-full bg-[#151515] border border-gray-800 rounded-xl p-4 transition-all duration-300 hover:border-[#4CAF50] hover:shadow-lg hover:shadow-[#4CAF50]/10 cursor-pointer text-left"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-medium text-white flex-1">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-lg border ${priorityColors[priority]}`}>
          {priorityLabels[priority]}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{dueDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{assignee}</span>
        </div>
      </div>
    </button>
  );
}
