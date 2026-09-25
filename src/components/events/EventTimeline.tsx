import React from 'react';
import { MedicationEvent } from '../../types/events';
import { StatusIndicator } from '../ui/StatusIndicator';
import { Badge } from '../ui/Badge';
import { Clock, Cpu, User, AlertCircle, HelpCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface EventTimelineProps {
  events: MedicationEvent[];
  medicationNames?: Record<string, string>;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, medicationNames = {} }) => {
  if (events.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 rounded-xl border border-dashed border-slate-800">
        No medication events recorded yet. Use the event simulator to trigger test scenarios.
      </div>
    );
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'hardware':
        return <Cpu className="w-3.5 h-3.5 text-teal-400" />;
      case 'manual':
        return <User className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getStateDescription = (state: string) => {
    switch (state) {
      case 'DISPENSED':
        return 'Dose dispensed by compartment';
      case 'COLLECTED':
        return 'Dose collected by patient';
      case 'COMPLETED':
        return 'Medication event completed';
      case 'DELAYED':
        return 'Dose uncollected past window (Delayed)';
      case 'MISSED':
        return 'Adherence evidence logged as Missed';
      case 'FAILED':
        return 'Device dispensing failure detected';
      case 'UNCERTAIN':
        return 'Uncertain event requiring verification';
      default:
        return 'Dose scheduled';
    }
  };

  return (
    <div className="space-y-4">
      {events.map((evt) => {
        const medName = medicationNames[evt.medicationId] || `Medication (${evt.medicationId})`;
        const isFailed = evt.state === 'FAILED';
        const isUncertain = evt.state === 'UNCERTAIN';

        return (
          <div
            key={evt.id}
            className={`p-4 rounded-xl border transition-all ${
              isFailed
                ? 'bg-rose-950/20 border-rose-500/30 border-l-4 border-l-rose-500'
                : isUncertain
                ? 'bg-amber-950/20 border-amber-500/30 border-l-4 border-l-amber-500'
                : 'bg-slate-950/80 border-slate-800 border-l-4 border-l-teal-500'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Event Header & Time */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                  {getSourceIcon(evt.source)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm font-outfit">{medName}</h4>
                    <StatusIndicator status={evt.state} />
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{getStateDescription(evt.state)}</p>
                </div>
              </div>

              {/* Confidence Rating & Timestamps */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono">
                  Scheduled: <strong>{evt.scheduledTime}</strong>
                </span>
                <Badge
                  variant={
                    evt.confidence === 'HIGH'
                      ? 'success'
                      : evt.confidence === 'MEDIUM'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  Confidence: {evt.confidence}
                </Badge>
              </div>
            </div>

            {/* Evidence Tags & Notes */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400 font-medium">Adherence Evidence:</span>
                {evt.evidence.map((evItem, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[11px] text-teal-300 font-mono"
                  >
                    {evItem}
                  </span>
                ))}
              </div>

              {evt.notes && <span className="text-slate-400 italic text-[11px]">{evt.notes}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
