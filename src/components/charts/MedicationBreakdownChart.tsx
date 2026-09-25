import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { MedicationAdherenceSummary } from '../../services/AdherenceAnalyticsEngine';

interface MedicationBreakdownChartProps {
  data: MedicationAdherenceSummary[];
}

export const MedicationBreakdownChart: React.FC<MedicationBreakdownChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} fontSize={12} unit="%" />
          <YAxis dataKey="medicationName" type="category" stroke="#94a3b8" fontSize={11} width={130} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
            formatter={(val: any) => [`${val}%`, 'Adherence']}
          />
          <Bar dataKey="adherencePercentage" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.adherencePercentage >= 80 ? '#10b981' : entry.adherencePercentage >= 60 ? '#f59e0b' : '#f43f5e'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
