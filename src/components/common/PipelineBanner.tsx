import React from 'react';
import { Search, Brain, Target, RefreshCw } from 'lucide-react';
import { PipelineStepId } from '../../types';

interface PipelineBannerProps {
  activeStep?: PipelineStepId;
  onStepSelect?: (step: PipelineStepId) => void;
}

const STEPS = [
  {
    id: 'detect' as PipelineStepId,
    name: '1. DETECT',
    icon: Search,
    description: 'Monitor adherence events & sensor evidence',
    color: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
  },
  {
    id: 'understand' as PipelineStepId,
    name: '2. UNDERSTAND',
    icon: Brain,
    description: 'Pattern analysis & probable barrier inference',
    color: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
  },
  {
    id: 'intervene' as PipelineStepId,
    name: '3. INTERVENE',
    icon: Target,
    description: 'Select personalized patient intervention',
    color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
  },
  {
    id: 'learn' as PipelineStepId,
    name: '4. LEARN',
    icon: RefreshCw,
    description: 'Track intervention response & adapt model',
    color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
  },
];

export const PipelineBanner: React.FC<PipelineBannerProps> = ({
  activeStep = 'understand',
  onStepSelect,
}) => {
  return (
    <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-outfit flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          Central Product Intelligence Loop
        </span>
        <span className="text-[11px] text-slate-400">Click any step to inspect pipeline logic</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          return (
            <div
              key={step.id}
              onClick={() => onStepSelect && onStepSelect(step.id)}
              className={`p-3 rounded-lg border bg-gradient-to-r ${step.color} cursor-pointer transition-all duration-200 ${
                isActive ? 'ring-2 ring-teal-500 shadow-lg shadow-teal-500/10' : 'hover:opacity-90'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" />
                <span className="font-outfit font-extrabold text-xs tracking-wider uppercase text-white">
                  {step.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight line-clamp-1">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
