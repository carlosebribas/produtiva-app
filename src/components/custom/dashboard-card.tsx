import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className = "" }: DashboardCardProps) {
  return (
    <div className={`bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}
