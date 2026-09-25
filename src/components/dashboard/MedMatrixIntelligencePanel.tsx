import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Search, Brain, Target, RefreshCw, ArrowRight, ShieldCheck, Volume2, CheckCircle2 } from 'lucide-react';

export interface IntelligencePanelData {
  whatHappened: string;
  pattern: string;
  probableBarrier: string;
  barrierConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedIntervention: string;
  interventionReason: string;
  previousResponse: string;
  nextAction: string;
}

interface MedMatrixIntelligencePanelProps {
  data?: IntelligencePanelData;
  onExecuteAction?: () => void;
}

export const MedMatrixIntelligencePanel: React.FC<MedMatrixIntelligencePanelProps> = ({
  data = {
    whatHappened: '4 evening doses delayed/missed over the last 7 days.',
    pattern: 'Most unconfirmed events occurred on working days during the 20:00 dinner window.',
    probableBarrier: 'Schedule disruption — Working day routine shift',
    barrierConfidence: 'MEDIUM',
    recommendedIntervention: 'Multilingual Hindi Voice Prompt (Schedule-Aware)',
    interventionReason: 'Selected audio voice reminder in Hindi to align with patient evening dinner routine and language preference.',
    previousResponse: 'Multilingual Hindi Voice Prompt successfully produced a completed medication event 3 of 4 times (75% effectiveness).',
    nextAction: 'Deliver schedule-aware Hindi audio voice prompt at 20:00.',
  },
  onExecuteAction,
}) => {
  return (
    <Card
      variant="highlight"
      className="space-y-6 border-2 border-teal-500/40 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 shadow-xl shadow-teal-950/20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-teal-500/30">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-outfit font-black text-xl text-white tracking-tight">
                MedMatrix Core Intelligence Panel
              </h2>
              <Badge variant="success" className="px-2.5 py-0.5 font-mono text-[10px] uppercase">
                Active Intelligence Loop
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Explainable adherence loop: DETECT → UNDERSTAND → INTERVENE → LEARN
            </p>
          </div>
        </div>

        {onExecuteAction && (
          <Button variant="primary" size="sm" onClick={onExecuteAction} className="shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>Execute Next Action</span>
          </Button>
        )}
      </div>

      {/* 4 Core Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* 1. WHAT HAPPENED? */}
        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-outfit font-extrabold text-[11px] text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                1. WHAT HAPPENED?
              </span>
              <Badge variant="info">DETECT</Badge>
            </div>
            <div className="font-bold text-white text-sm leading-snug">{data.whatHappened}</div>
          </div>
          <div className="p-2 rounded bg-slate-950/80 text-slate-300 text-[11px] border border-slate-800 font-medium">
            Empirical intake events compiled from hardware & log telemetry.
          </div>
        </div>

        {/* 2. WHY MIGHT IT BE HAPPENING? */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-outfit font-extrabold text-[11px] text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                2. WHY MIGHT IT BE HAPPENING?
              </span>
              <Badge variant="info" className="bg-purple-500/20 text-purple-300 border-purple-500/30">UNDERSTAND</Badge>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Observed Pattern:
              </span>
              <div className="text-slate-200 text-xs font-medium">{data.pattern}</div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Probable Barrier:
              </span>
              <div className="font-bold text-amber-300 text-xs flex items-center justify-between">
                <span>{data.probableBarrier}</span>
                <Badge variant={data.barrierConfidence === 'HIGH' ? 'danger' : 'warning'}>
                  {data.barrierConfidence}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 3. WHAT SHOULD WE DO? */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-outfit font-extrabold text-[11px] text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                3. WHAT SHOULD WE DO?
              </span>
              <Badge variant="warning">INTERVENE</Badge>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Recommended Intervention:
              </span>
              <div className="font-bold text-white text-xs">{data.recommendedIntervention}</div>
            </div>

            <p className="text-amber-200/90 text-[11px] leading-relaxed font-medium">
              {data.interventionReason}
            </p>
          </div>
        </div>

        {/* 4. DID IT WORK? */}
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-outfit font-extrabold text-[11px] text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                4. DID IT WORK?
              </span>
              <Badge variant="success">LEARN</Badge>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Previous Response:
              </span>
              <div className="text-slate-200 text-xs font-medium">{data.previousResponse}</div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Next Evaluated Action:
              </span>
              <div className="font-bold text-teal-300 text-xs">{data.nextAction}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
