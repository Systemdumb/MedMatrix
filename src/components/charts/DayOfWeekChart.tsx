import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { DayOfWeekAdherence } from '../../services/AdherenceAnalyticsEngine';

interface DayOfWeekChartProps {
  data: DayOfWeekAdherence[];
}

export const DayOfWeekChart: React.FC<DayOfWeekChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" domain={[0, 100]} fontSize={12} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
            formatter={(val: any) => [`${val}%`, 'Adherence Rate']}
          />
          <Bar dataKey="adherencePercentage" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isWeekend ? '#f59e0b' : '#0d9488'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
