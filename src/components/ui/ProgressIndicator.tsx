import React from 'react';
import { clsx } from 'clsx';

export interface ProgressIndicatorProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  variant?: 'teal' | 'emerald' | 'amber' | 'rose' | 'indigo';
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  label,
  sublabel,
  variant = 'teal',
  className,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variants = {
    teal: 'bg-teal-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div className={clsx('w-full space-y-1.5', className)}>
      {(label || sublabel) && (
        <div className="flex justify-between text-xs font-medium">
          {label && <span className="text-slate-300">{label}</span>}
          {sublabel && <span className="text-slate-400">{sublabel}</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={clsx('h-full transition-all duration-500 ease-out rounded-full', variants[variant])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
