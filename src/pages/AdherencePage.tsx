import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { Language } from '../types';
import { getProgressTrendDescription } from '../services/adapters/patientLanguageAdapter';
import { AdherenceTrendChart } from '../components/charts/AdherenceTrendChart';
import { TimeOfDayChart } from '../components/charts/TimeOfDayChart';
import { DayOfWeekChart } from '../components/charts/DayOfWeekChart';
import { MedicationBreakdownChart } from '../components/charts/MedicationBreakdownChart';
import { AdherenceAnalyticsEngine } from '../services/AdherenceAnalyticsEngine';
import { RICH_ADHERENCE_EVENTS } from '../data/adherenceDemoEvents';
import { INITIAL_MEDICATIONS } from '../data/demoData';
import { BarChart3, TrendingUp, Sparkles, Award, CheckCircle2, Calendar } from 'lucide-react';

interface AdherencePageProps {
  currentLanguage?: Language;
}

export const AdherencePage: React.FC<AdherencePageProps> = ({ currentLanguage = 'en' }) => {
  const { patient } = useMedication();
  const isHindi = currentLanguage === 'hi';
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'patterns' | 'comparison'>('overview');

  const adherenceScore = patient?.adherenceScore || 87;
  const trendText = getProgressTrendDescription(adherenceScore, currentLanguage);

  const metrics = AdherenceAnalyticsEngine.analyzeAdherenceHistory(
    RICH_ADHERENCE_EVENTS,
    INITIAL_MEDICATIONS
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">
          {isHindi ? 'मेरी प्रगति (My Adherence)' : 'My Adherence'}
        </h1>
        <p className="text-base text-slate-500 mt-1">
          {isHindi
            ? 'आपकी नियमितता और दवा समय की साप्ताहिक रिपोर्ट'
            : 'Detailed analytics and longitudinal trends for your medication routine'}
        </p>
      </div>

      {/* Main Metric Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-wider font-outfit">
              <TrendingUp className="w-3.5 h-3.5" />
              {isHindi ? 'कुल स्कोर' : 'Overall Adherence Score'}
            </span>
            <div className="text-4xl sm:text-5xl font-black font-outfit text-slate-900">
              {adherenceScore}%
            </div>
            <p className="text-sm font-semibold text-emerald-700">
              ↑ 5% {isHindi ? 'पिछले सप्ताह की तुलना में' : 'compared with last week'}
            </p>
          </div>

          <div className="w-28 h-28 rounded-full bg-teal-700 p-1 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-outfit text-slate-900">{adherenceScore}%</span>
              <span className="text-[10px] font-extrabold text-teal-800 uppercase">{isHindi ? 'उत्कृष्ट' : 'Great'}</span>
            </div>
          </div>
        </div>

        {/* Natural Language Trend Explanation */}
        <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-teal-900 font-semibold leading-relaxed">
            &quot;{trendText}&quot;
          </p>
        </div>
      </div>

      {/* Horizontal Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-2xl">
        {(['overview', 'trends', 'patterns', 'comparison'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? 'border-teal-700 text-teal-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Completed Doses</span>
            <div className="text-2xl font-black text-slate-900 font-outfit">{metrics.completedEventsCount}</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Delayed Doses</span>
            <div className="text-2xl font-black text-amber-700 font-outfit">1</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Uncertain Events</span>
            <div className="text-2xl font-black text-slate-600 font-outfit">{metrics.uncertainEventsCount}</div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Device Safeguard</span>
            <div className="text-2xl font-black text-blue-700 font-outfit">{metrics.deviceFailureCount}</div>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-outfit font-bold text-base text-slate-900">7-Day Adherence Trend (%)</h3>
          <AdherenceTrendChart data={metrics.recentTrend} />
          <p className="text-xs text-slate-500 italic">
            &quot;Your medication routine is becoming more consistent over recent days.&quot;
          </p>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-outfit font-bold text-base text-slate-900">Time-of-Day Pattern</h3>
            <TimeOfDayChart data={metrics.timeOfDayPattern} />
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-outfit font-bold text-base text-slate-900">Weekday vs Weekend</h3>
            <DayOfWeekChart data={metrics.dayOfWeekPattern} />
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-outfit font-bold text-base text-slate-900">Adherence by Medication</h3>
          <MedicationBreakdownChart data={metrics.medicationSummaries} />
        </div>
      )}
    </div>
  );
};
