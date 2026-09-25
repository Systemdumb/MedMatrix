import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AdherenceTrendPoint } from '../../services/AdherenceAnalyticsEngine';

interface AdherenceTrendChartProps {
  data: AdherenceTrendPoint[];
}

export const AdherenceTrendChart: React.FC<AdherenceTrendChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" domain={[0, 100]} fontSize={12} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
            formatter={(val: any) => [`${val}%`, 'Adherence']}
          />
          <Area
            type="monotone"
            dataKey="adherencePercentage"
            stroke="#14b8a6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#adherenceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
