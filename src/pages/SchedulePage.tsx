import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { EventSimulator } from '../components/events/EventSimulator';
import { EventStateMachine } from '../services/EventStateMachine';
import { MedicationEvent } from '../types/events';
import { Language } from '../types';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Utensils, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

interface SchedulePageProps {
  currentLanguage?: Language;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ currentLanguage = 'en' }) => {
  const { patient, medications, schedules, updateScheduleStatus } = useMedication();
  const isHindi = currentLanguage === 'hi';
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');

  const TODAY = new Date().toISOString().split('T')[0];

  const [eventStream, setEventStream] = useState<MedicationEvent[]>(() => [
    {
      id: 'evt_001',
      patientId: patient.id,
      medicationId: medications[0]?.id || 'med_001',
      scheduledTime: `${TODAY} 08:00`,
      actualEventTime: `${TODAY} 08:05`,
      state: 'COMPLETED',
      source: 'hardware',
      evidence: ['schedule', 'dispensing', 'sensor', 'patient confirmation'],
      confidence: 'HIGH',
      notes: 'Medication event completed.',
    },
  ]);

  const handleSimulateEvent = (newEvent: MedicationEvent) => {
    setEventStream((prev) => [newEvent, ...prev]);
    const matchingSchedule = schedules.find((s) => s.medicationId === newEvent.medicationId);
    if (matchingSchedule) {
      let targetStatus: any = 'SCHEDULED';
      if (newEvent.state === 'COMPLETED' || newEvent.state === 'COLLECTED') targetStatus = 'COLLECTED';
      else if (newEvent.state === 'MISSED') targetStatus = 'MISSED';
      else if (newEvent.state === 'DELAYED') targetStatus = 'DELAYED';

      updateScheduleStatus(matchingSchedule.id, targetStatus, newEvent.notes);
    }
  };

  const getFoodLabel = (rel: string) => {
    switch (rel) {
      case 'AFTER_FOOD':
        return isHindi ? 'खाने के बाद (After Food)' : 'After Food';
      case 'BEFORE_FOOD':
        return isHindi ? 'खाने से पहले (Before Food)' : 'Before Food';
      case 'WITH_FOOD':
        return isHindi ? 'खाने के साथ (With Food)' : 'With Food';
      default:
        return isHindi ? 'भोजन का कोई नियम नहीं' : 'No food restriction';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">
            {isHindi ? 'दवा समयसारणी (Medication Schedule)' : 'Medication Schedule'}
          </h1>
          <p className="text-base text-slate-500 mt-1">
            {isHindi ? 'अपनी दैनिक और साप्ताहिक खुराक की योजना देखें' : 'View and track your daily & weekly medication calendar'}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {(['today', 'week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                viewMode === mode
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Quick Action */}
      <EventSimulator
        patientId={patient.id}
        medicationId={medications[0]?.id || 'med_001'}
        medicationName={medications[0]?.name || 'Metformin'}
        onEventSimulated={handleSimulateEvent}
      />

      {/* Today's Schedule Timeline List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-outfit font-bold text-lg text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-700" />
            <span>{isHindi ? 'आज की दवा समयसारणी' : "Today's Schedule"}</span>
          </h2>
          <span className="text-xs font-bold text-slate-500 font-mono">{TODAY}</span>
        </div>

        <div className="space-y-3">
          {schedules.map((sch) => {
            const med = medications.find((m) => m.id === sch.medicationId);
            const isTaken = sch.status === 'COLLECTED' || sch.status === 'COMPLETED' || sch.status === 'DISPENSED';

            return (
              <div
                key={sch.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isTaken
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : sch.status === 'MISSED'
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sch.scheduledTime}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base font-outfit">
                      {med ? `${med.name} (${med.dosage} ${med.dosageUnit})` : 'Medication'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-amber-600" />
                      {med ? getFoodLabel(med.relationToFood) : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isTaken
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isTaken ? (isHindi ? 'पूर्ण ✓' : 'Taken ✓') : isHindi ? 'बाकी' : 'Scheduled'}
                  </span>

                  {!isTaken && (
                    <button
                      onClick={() => {
                        const evt = EventStateMachine.createCompletedDoseEvent(
                          patient.id,
                          sch.medicationId,
                          sch.scheduledTime
                        );
                        handleSimulateEvent(evt);
                      }}
                      className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isHindi ? 'पुष्टि करें (Take)' : 'Mark Taken'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
