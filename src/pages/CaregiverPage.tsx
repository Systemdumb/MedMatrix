import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { Language } from '../types';
import { Users, PhoneCall, AlertCircle, ShoppingCart, Send, ShieldCheck, HeartHandshake } from 'lucide-react';

interface CaregiverPageProps {
  currentLanguage?: Language;
}

export const CaregiverPage: React.FC<CaregiverPageProps> = ({ currentLanguage = 'en' }) => {
  const { patient, schedules, medications } = useMedication();
  const isHindi = currentLanguage === 'hi';
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const caregiver = patient.caregiver || {
    name: 'Sunita Sharma',
    phone: '+91 98765 43210',
    relation: 'Daughter / Family Member',
  };

  const totalToday = schedules.length || 3;
  const completedToday = schedules.filter(
    (s) => s.status === 'COLLECTED' || s.status === 'COMPLETED' || s.status === 'DISPENSED'
  ).length;

  const lowStockMeds = medications.filter((m) => m.active && m.remainingQuantity <= m.refillThreshold);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">
          {isHindi ? 'परिवार एवं सहायता (Family Support)' : 'Family Support'}
        </h1>
        <p className="text-base text-slate-500 mt-1">
          {isHindi
            ? 'पारिवारिक देखभालकर्ता की स्थिति और महत्वपूर्ण अलर्ट'
            : 'Family contact details and active health notifications for caregivers'}
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-800 flex items-center justify-between shadow-xs">
          <span>✓ {toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-xs text-slate-500 hover:text-slate-800 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Caregiver Profile Light Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center text-3xl font-bold border border-teal-200 shrink-0">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 font-outfit">
                {isHindi ? 'पंजीकृत पारिवारिक सदस्य' : 'Registered Caregiver'}
              </span>
              <h2 className="text-2xl font-bold font-outfit text-slate-900 mt-0.5">
                {caregiver.name}
              </h2>
              <p className="text-sm font-semibold text-slate-600">
                {caregiver.relation} • <span className="text-teal-800 font-bold">{caregiver.phone}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setToastMessage(isHindi ? `${caregiver.name} को कॉल किया जा रहा है...` : `Calling ${caregiver.name}...`)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{isHindi ? 'परिवार से संपर्क करें' : 'Call Caregiver'}</span>
          </button>
        </div>
      </div>

      {/* Today's Status Summary */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold font-outfit text-slate-900">
            {isHindi ? "आज की दवा स्थिति" : "Today's Adherence Summary"}
          </h3>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            {isHindi ? 'सामान्य स्थिति' : 'All Good'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Doses Taken Today</span>
            <div className="text-2xl font-black text-slate-900 font-outfit">{completedToday} of {totalToday}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Routine Status</span>
            <div className="text-2xl font-black text-emerald-800 font-outfit">On Track</div>
          </div>
        </div>
      </div>
    </div>
  );
};
