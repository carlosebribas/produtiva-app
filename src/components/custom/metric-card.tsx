import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
}

export function MetricCard({ title, value, change, trend, icon: Icon }: MetricCardProps) {
  const trendColors = {
    up: "text-[#4CAF50]",
    down: "text-red-500",
    neutral: "text-gray-400",
  };

  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-gray-700 hover:scale-105">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          <p className={`text-sm font-medium ${trendColors[trend]}`}>{change}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#4CAF50]/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#4CAF50]" />
        </div>
      </div>
    </div>
  );
}
