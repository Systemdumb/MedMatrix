import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { ScenarioPipelineRunner, ScenarioPipelineExecutionResult } from '../services/ScenarioPipelineRunner';
import { BarrierIdentificationEngine } from '../services/BarrierIdentificationEngine';
import { MedMatrixIntelligencePanel, IntelligencePanelData } from '../components/dashboard/MedMatrixIntelligencePanel';
import { Play, CheckCircle2, Search, Brain, Target, RefreshCw, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { Language } from '../types';

interface DemoPageProps {
  currentLanguage?: Language;
}

export const DemoPage: React.FC<DemoPageProps> = ({ currentLanguage = 'en' }) => {
  const { patient, medications } = useMedication();
  const isHindi = currentLanguage === 'hi';
  const [selectedScenarioId, setSelectedScenarioId] = useState<number>(1);
  const [executionResult, setExecutionResult] = useState<ScenarioPipelineExecutionResult>(() =>
    ScenarioPipelineRunner.runScenario(1, patient, medications)
  );

  const handleRunScenario = (id: number) => {
    setSelectedScenarioId(id);
    const result = ScenarioPipelineRunner.runScenario(id, patient, medications);
    setExecutionResult(result);
  };

  const scenarioButtons = [
    { id: 1, label: 'Successful Dose', subtitle: 'NORMAL ADHERENCE' },
    { id: 2, label: 'Forgetfulness', subtitle: 'EVENING MISS' },
    { id: 3, label: 'Refill Issue', subtitle: 'STOCK DEPLETION' },
    { id: 4, label: 'Device Failure', subtitle: 'HARDWARE FAULT' },
    { id: 5, label: 'Intervention Failure', subtitle: 'ADAPTIVE STRATEGY' },
    { id: 6, label: 'Offline Mode', subtitle: 'RECONNECT SYNC' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">
          {isHindi ? 'डेमो परिदृश्य (Demo Scenario Runner)' : 'Demo Scenario Runner'}
        </h1>
        <p className="text-base text-slate-500 mt-1">
          {isHindi
            ? 'एसआईएच प्रदर्शन के लिए 6 मुख्य परिदृश्यों को 1-क्लिक में चलाएं'
            : 'Interactive 1-click scenario player running live data through all 5 MedMatrix Intelligence Engines'}
        </p>
      </div>

      {/* Scenario Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {scenarioButtons.map((btn) => {
          const isSelected = selectedScenarioId === btn.id;

          return (
            <button
              key={btn.id}
              onClick={() => handleRunScenario(btn.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                isSelected
                  ? 'bg-teal-700 text-white border-teal-700 shadow-md scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] font-extrabold uppercase ${isSelected ? 'text-teal-200' : 'text-teal-700'}`}>
                Scenario 0{btn.id}
              </span>
              <div>
                <div className="font-bold text-xs leading-tight font-outfit">{btn.label}</div>
                <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                  {btn.subtitle}
                </div>
              </div>
              <div className={`text-[10px] font-bold flex items-center gap-1 ${isSelected ? 'text-white' : 'text-teal-700'}`}>
                <Play className="w-3 h-3 fill-current" />
                <span>Run</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Pipeline Result Display */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-outfit">
              Active Scenario Output
            </span>
            <h2 className="text-2xl font-bold font-outfit text-slate-900 mt-0.5">{executionResult.title}</h2>
          </div>
          <button
            onClick={() => handleRunScenario(selectedScenarioId)}
            className="px-4 py-2 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Re-Run Pipeline</span>
          </button>
        </div>

        {/* 4 Steps Loop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <span className="font-bold text-blue-800 uppercase block">1. DETECT</span>
            <p className="text-slate-700 font-medium">{executionResult.stepDetect.description}</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
            <span className="font-bold text-purple-800 uppercase block">2. UNDERSTAND</span>
            <p className="text-slate-700 font-medium">{executionResult.stepUnderstand.description}</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <span className="font-bold text-amber-800 uppercase block">3. INTERVENE</span>
            <p className="text-slate-700 font-medium">{executionResult.stepIntervene.description}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-800 uppercase block">4. LEARN</span>
            <p className="text-slate-700 font-medium">{executionResult.stepLearn.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
