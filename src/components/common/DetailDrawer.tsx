import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Cpu, ShieldCheck, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Language } from '../../types';

export interface DetailDrawerData {
  title: string;
  subtitle?: string;
  friendlyExplanation: string;
  date?: string;
  time?: string;
  statusText?: string;
  statusType?: 'success' | 'warning' | 'danger' | 'info';
  technicalDetails?: {
    eventState?: string;
    evidenceSource?: string;
    confidenceScore?: string;
    deviceHardwareId?: string;
    interventionDelivered?: string;
    rawPayload?: string;
  };
}

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: DetailDrawerData | null;
  currentLanguage?: Language;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  data,
  currentLanguage = 'en',
}) => {
  const [showTechnical, setShowTechnical] = useState(false);
  const isHindi = currentLanguage === 'hi';

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-outfit">
              {isHindi ? 'विस्तृत जानकारी' : 'Event & Insight Detail'}
            </span>
            <h2 className="text-xl font-bold font-outfit text-slate-900 mt-0.5">{data.title}</h2>
            {data.subtitle && <p className="text-xs text-slate-500 mt-1">{data.subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Banner */}
          {data.statusText && (
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold ${
                data.statusType === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : data.statusType === 'warning'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : data.statusType === 'danger'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{data.statusText}</span>
            </div>
          )}

          {/* Level 1 & 2: Patient Friendly Interpretation */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-outfit">
              {isHindi ? 'विवरण' : 'Interpretation & Summary'}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              &quot;{data.friendlyExplanation}&quot;
            </p>
          </div>

          {/* Date & Timing */}
          {(data.date || data.time) && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-teal-700" />
                {isHindi ? 'समय:' : 'Logged Time:'}
              </span>
              <span className="font-bold text-slate-900">
                {data.date || ''} {data.time || ''}
              </span>
            </div>
          )}

          {/* Level 3: Progressive Technical Details Disclosure */}
          {data.technicalDetails && (
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowTechnical(!showTechnical)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-500" />
                  {isHindi ? 'तकनीकी विवरण देखें (Technical Details)' : 'View Technical Details'}
                </span>
                {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTechnical && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-teal-400 border-b border-slate-800 pb-1 mb-2">
                    Raw Telemetry & Engine State
                  </div>
                  {data.technicalDetails.eventState && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Event State:</span>
                      <span className="text-teal-300 font-bold">{data.technicalDetails.eventState}</span>
                    </div>
                  )}
                  {data.technicalDetails.evidenceSource && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Evidence Source:</span>
                      <span className="text-purple-300">{data.technicalDetails.evidenceSource}</span>
                    </div>
                  )}
                  {data.technicalDetails.confidenceScore && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Confidence Rating:</span>
                      <span className="text-amber-300">{data.technicalDetails.confidenceScore}</span>
                    </div>
                  )}
                  {data.technicalDetails.deviceHardwareId && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hardware ID:</span>
                      <span className="text-slate-300">{data.technicalDetails.deviceHardwareId}</span>
                    </div>
                  )}
                  {data.technicalDetails.interventionDelivered && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Intervention Type:</span>
                      <span className="text-emerald-300">{data.technicalDetails.interventionDelivered}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
