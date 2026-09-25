import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EventStateMachine } from '../../services/EventStateMachine';
import { MedicationEvent } from '../../types/events';
import { CheckCircle2, Clock, AlertTriangle, Cpu, HelpCircle } from 'lucide-react';

interface EventSimulatorProps {
  patientId: string;
  medicationId: string;
  medicationName: string;
  onEventSimulated: (event: MedicationEvent) => void;
}

export const EventSimulator: React.FC<EventSimulatorProps> = ({
  patientId,
  medicationId,
  medicationName,
  onEventSimulated,
}) => {
  const handleSimulateCompleted = () => {
    const event = EventStateMachine.createCompletedDoseEvent(patientId, medicationId, '20:00');
    onEventSimulated(event);
  };

  const handleSimulateDelayed = () => {
    const event = EventStateMachine.createDelayedDoseEvent(patientId, medicationId, '20:00');
    onEventSimulated(event);
  };

  const handleSimulateMissed = () => {
    const event = EventStateMachine.createMissedDoseEvent(patientId, medicationId, '20:00');
    onEventSimulated(event);
  };

  const handleSimulateFailedDispensing = () => {
    const event = EventStateMachine.createFailedDispensingEvent(patientId, medicationId, '20:00');
    onEventSimulated(event);
  };

  const handleSimulateUncertain = () => {
    const event = EventStateMachine.createUncertainEvent(patientId, medicationId, '20:00');
    onEventSimulated(event);
  };

  return (
    <Card variant="highlight" className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-outfit font-bold text-base text-white">⚡ Interactive Demo Event Simulator</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate real-time medication event states for <strong>{medicationName}</strong>
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2.5 py-1 rounded-full">
          Event Engine Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSimulateCompleted}
          className="justify-center py-2.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed Dose</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleSimulateDelayed}
          className="justify-center py-2.5 border-amber-500/30 text-amber-400"
        >
          <Clock className="w-4 h-4" />
          <span>Delayed Dose</span>
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={handleSimulateMissed}
          className="justify-center py-2.5"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Missed Dose</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSimulateFailedDispensing}
          className="justify-center py-2.5 border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
        >
          <Cpu className="w-4 h-4" />
          <span>Failed Dispensing</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSimulateUncertain}
          className="justify-center py-2.5 bg-slate-800/80 text-amber-300 hover:bg-slate-700"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Uncertain Event</span>
        </Button>
      </div>

      <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Terminology Safety Guardrail Enforcement: Active</span>
        <span className="text-teal-400 font-mono">Dose Dispensed • Dose Collected • Event Completed</span>
      </div>
    </Card>
  );
};
