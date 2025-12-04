"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface WeeklyChartProps {
  data: Array<{
    day: string;
    completed: number;
    pending: number;
  }>;
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
        <XAxis 
          dataKey="day" 
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A1A1A',
            border: '1px solid #2A2A2A',
            borderRadius: '8px',
            color: '#FFFFFF',
          }}
          cursor={{ fill: '#2A2A2A' }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
        />
        <Bar 
          dataKey="completed" 
          fill="#4CAF50" 
          radius={[8, 8, 0, 0]}
          name="Concluídas"
        />
        <Bar 
          dataKey="pending" 
          fill="#6B7280" 
          radius={[8, 8, 0, 0]}
          name="Pendentes"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
