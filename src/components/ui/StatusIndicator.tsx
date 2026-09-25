import React from 'react';
import { clsx } from 'clsx';
import { EventStatus } from '../../types';

export interface StatusIndicatorProps {
  status: EventStatus | string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className }) => {
  const getColors = (st: string) => {
    switch (st.toUpperCase()) {
      case 'COLLECTED':
      case 'COMPLETED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'SCHEDULED':
      case 'READY':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'DISPENSING':
      case 'DISPENSED':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'DELAYED':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'MISSED':
      case 'FAILED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border font-mono uppercase tracking-wider',
        getColors(status),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  );
};
