import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { TimeWindowAdherence } from '../../services/AdherenceAnalyticsEngine';

interface TimeOfDayChartProps {
  data: TimeWindowAdherence[];
}

export const TimeOfDayChart: React.FC<TimeOfDayChartProps> = ({ data }) => {
  const getColor = (pct: number) => {
    if (pct >= 85) return '#10b981'; // emerald
    if (pct >= 65) return '#3b82f6'; // blue
    return '#f43f5e'; // rose
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="windowName" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" domain={[0, 100]} fontSize={12} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
            formatter={(val: any) => [`${val}%`, 'Adherence Rate']}
          />
          <Bar dataKey="adherencePercentage" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.adherencePercentage)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
