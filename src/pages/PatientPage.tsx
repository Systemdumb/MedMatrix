import React from 'react';
import { useMedication } from '../context/MedicationContext';
import { Language } from '../types';
import { User, HeartPulse, ShieldCheck, Globe, Activity, Brain } from 'lucide-react';

interface PatientPageProps {
  currentLanguage?: Language;
}

export const PatientPage: React.FC<PatientPageProps> = ({ currentLanguage = 'en' }) => {
  const { patient } = useMedication();
  const isHindi = currentLanguage === 'hi';
  const ap = patient.adherenceProfile;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">
          {isHindi ? 'मेरी प्रोफ़ाइल (My Profile)' : 'My Profile'}
        </h1>
        <p className="text-base text-slate-500 mt-1">
          {isHindi ? 'व्यक्तिगत जानकारी, स्वास्थ्य स्थिति और प्राथमिकताएं' : 'Manage your personal profile, health overview, and contact details'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal & Caregiver Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-teal-700" />
            <h2 className="font-outfit font-bold text-lg text-slate-900">
              {isHindi ? 'व्यक्तिगत जानकारी' : 'Personal Details'}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Full Name</span>
              <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Age & Gender</span>
              <span className="font-bold text-slate-900 text-sm">{patient.age} yrs • Male</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Location</span>
              <span className="font-semibold text-slate-800">{patient.city || 'New Delhi'}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Preferred Language</span>
              <span className="font-bold text-teal-800 uppercase">{patient.preferredLanguage} (हिंदी)</span>
            </div>
          </div>
        </div>

        {/* Chronic Conditions & Adherence Profile */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <h2 className="font-outfit font-bold text-lg text-slate-900">
              {isHindi ? 'स्वास्थ्य स्थिति एवं प्रोफाइल' : 'Health Overview'}
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 block font-medium mb-1">Diagnosed Conditions</span>
              <div className="flex flex-wrap gap-2">
                {patient.chronicConditions.map((c, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold">
                    🩺 {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Vulnerable Time Window:</span>
                <span className="font-bold text-amber-700">{ap.vulnerableTimeWindow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Barrier:</span>
                <span className="font-bold text-teal-800">{ap.primaryBarrier}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
