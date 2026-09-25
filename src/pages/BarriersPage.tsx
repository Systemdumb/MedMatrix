import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { BarrierIdentificationEngine } from '../services/BarrierIdentificationEngine';
import { RICH_ADHERENCE_EVENTS } from '../data/adherenceDemoEvents';
import { BarrierInsight } from '../types/barriers';
import { DetailDrawer, DetailDrawerData } from '../components/common/DetailDrawer';
import { Language } from '../types';
import { Brain, CheckCircle2, ChevronRight, Sparkles, Filter, AlertCircle } from 'lucide-react';

interface BarriersPageProps {
  currentLanguage?: Language;
}

export const BarriersPage: React.FC<BarriersPageProps> = ({ currentLanguage = 'en' }) => {
  const { patient, medications } = useMedication();
  const isHindi = currentLanguage === 'hi';

  const [inferredBarriers, setInferredBarriers] = useState<BarrierInsight[]>(() =>
    BarrierIdentificationEngine.inferBarriers(RICH_ADHERENCE_EVENTS, medications, patient.id)
  );

  const [drawerData, setDrawerData] = useState<DetailDrawerData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenEvidence = (insight: BarrierInsight) => {
    const title = BarrierIdentificationEngine.getBarrierTitle(insight.barrierType);
    setDrawerData({
      title: isHindi ? `प्रमाण विवरण: ${title}` : `Evidence Detail: ${title}`,
      subtitle: `Affected: ${insight.medicationName || 'All prescribed medicines'}`,
      friendlyExplanation: isHindi
        ? `पैटर्न इंजन ने पाया कि पिछली ${insight.frequency} घटनाओं में दवा लेने का समय भिन्न था। यह जानकारी आपकी सुविधा सुधारने के लिए है।`
        : `Our pattern engine observed ${insight.frequency} instances where medication timing varied. This insight helps adapt support to your daily routine.`,
      date: insight.lastObserved,
      statusText: isHindi ? 'संभावित पैटर्न' : 'Probable Behavioral Pattern',
      statusType: 'warning',
      technicalDetails: {
        eventState: 'BARRIER_INFERRED',
        evidenceSource: insight.source,
        confidenceScore: insight.confidence,
        rawPayload: JSON.stringify(insight.evidence),
      },
    });
    setIsDrawerOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">
          {isHindi ? 'खुराक क्यों छूट सकती है? (Why Doses May Be Missed)' : 'Why Doses May Be Missed'}
        </h1>
        <p className="text-base text-slate-500 mt-1">
          {isHindi
            ? 'मेडमैट्रिक्स आपकी दिनचर्या के उन पैटर्न को समझता है जिनसे दवा लेने में आसानी हो सके।'
            : 'MedMatrix identifies routine patterns to make following your prescription schedule easier.'}
        </p>
      </div>

      {/* Safety Boundary Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-4">
        <div>
          💡 <strong>{isHindi ? 'सुरक्षा नियम:' : 'Safety Principle:'}</strong>{' '}
          {isHindi
            ? 'सभी निष्कर्ष केवल संभावित पैटर्न हैं, कोई चिकित्सीय निदान नहीं।'
            : 'All detected insights represent possible patterns, not psychological certainty or medical diagnoses.'}
        </div>
      </div>

      {/* Barrier Cards */}
      <div className="space-y-4">
        {inferredBarriers.map((insight) => {
          const title = BarrierIdentificationEngine.getBarrierTitle(insight.barrierType);

          return (
            <div
              key={insight.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-teal-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center text-xl font-bold border border-purple-200 shrink-0">
                    🧠
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 font-outfit">
                      {isHindi ? 'संभावित कारण' : 'Possible Reason'}
                    </span>
                    <h2 className="text-xl font-bold font-outfit text-slate-900 mt-0.5">{title}</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {isHindi
                        ? `यह पैटर्न ${insight.frequency} बार देखा गया है।`
                        : `Observed pattern: ${insight.frequency} missed/delayed doses recently.`}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
                  {insight.confidence} Confidence
                </span>
              </div>

              {/* Evidence Bullet Points */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <span className="font-bold text-slate-700 block mb-1">
                  {isHindi ? 'देखे गए साक्ष्य:' : 'Observed Evidence:'}
                </span>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {insight.evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleOpenEvidence(insight)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isHindi ? 'प्रमाण देखें (See evidence)' : 'See evidence'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={drawerData}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};
