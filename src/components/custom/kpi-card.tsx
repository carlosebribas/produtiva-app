"use client";

import { TrendingUp, TrendingDown, Target } from "lucide-react";
import type { KPI } from "@/lib/types";

interface KPICardProps {
  kpi: KPI;
  onUpdate?: (kpi: KPI) => void;
}

export function KPICard({ kpi, onUpdate }: KPICardProps) {
  const progress = (kpi.current_value / kpi.target_value) * 100;
  const isOnTrack = progress >= 70;
  const isExceeded = progress >= 100;

  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 hover:border-[#4CAF50] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">{kpi.name}</h3>
          {kpi.description && (
            <p className="text-sm text-gray-400">{kpi.description}</p>
          )}
        </div>
        <Target className={`w-6 h-6 ${isExceeded ? 'text-green-500' : isOnTrack ? 'text-yellow-500' : 'text-red-500'}`} />
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-white">
              {kpi.current_value}
              <span className="text-lg text-gray-400 ml-1">{kpi.unit}</span>
            </p>
            <p className="text-sm text-gray-500">
              Meta: {kpi.target_value} {kpi.unit}
            </p>
          </div>
          <div className={`flex items-center gap-1 ${isExceeded ? 'text-green-500' : isOnTrack ? 'text-yellow-500' : 'text-red-500'}`}>
            {progress >= 100 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span className="font-semibold">{progress.toFixed(0)}%</span>
          </div>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isExceeded ? 'bg-green-500' : isOnTrack ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Período: {kpi.period}</span>
          {kpi.assignee && <span>👤 {kpi.assignee}</span>}
        </div>
      </div>
    </div>
  );
}
