import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'warning' | 'danger';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl',
    highlight: 'bg-slate-900/90 border-teal-500/40 shadow-xl shadow-teal-500/5',
    warning: 'bg-amber-950/20 border-amber-500/30 text-slate-100 shadow-xl',
    danger: 'bg-rose-950/20 border-rose-500/30 text-slate-100 shadow-xl',
  };

  return (
    <div
      className={clsx(
        'rounded-xl border p-6 transition-all duration-200 backdrop-blur-sm',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
