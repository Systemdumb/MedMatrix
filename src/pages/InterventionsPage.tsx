import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { BarrierIdentificationEngine } from '../services/BarrierIdentificationEngine';
import { PersonalizedInterventionEngine } from '../services/PersonalizedInterventionEngine';
import { RICH_ADHERENCE_EVENTS } from '../data/adherenceDemoEvents';
import { InterventionRecommendation } from '../types/interventions';
import { Language } from '../types';
import { Sparkles, CheckCircle2, Volume2, ArrowRight, ThumbsUp, HelpCircle } from 'lucide-react';

interface InterventionsPageProps {
  currentLanguage?: Language;
}

export const InterventionsPage: React.FC<InterventionsPageProps> = ({ currentLanguage = 'en' }) => {
  const { patient, medications } = useMedication();
  const isHindi = currentLanguage === 'hi';

  const barriers = BarrierIdentificationEngine.inferBarriers(RICH_ADHERENCE_EVENTS, medications, patient.id);
  const [recommendations] = useState<InterventionRecommendation[]>(() =>
    PersonalizedInterventionEngine.selectInterventions(barriers, patient, medications)
  );

  const handlePlayAudio = (msg: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Playing simulated voice prompt: "${msg}"`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">
          {isHindi ? 'व्यक्तिगत सहायता (Personalized Support)' : 'Personalized Support'}
        </h1>
        <p className="text-base text-slate-500 mt-1">
          {isHindi
            ? 'देखें कि मेडमैट्रिक्स आपके लिए रिमाइंडर और सहायता को कैसे अनुकूलित करता है।'
            : 'See how MedMatrix adapts reminders and support to your medication routine.'}
        </p>
      </div>

      {/* Current Active Support Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider font-outfit">
          <Sparkles className="w-4 h-4 text-teal-700" />
          <span>{isHindi ? 'वर्तमान सक्रिय सहायता' : 'Current Support Strategy'}</span>
        </div>

        {recommendations.slice(0, 1).map((rec) => (
          <div key={rec.id} className="space-y-4">
            <h2 className="text-2xl font-bold font-outfit text-slate-900">{rec.title}</h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed bg-teal-50/60 p-4 rounded-2xl border border-teal-200">
              <strong>{isHindi ? 'कारण:' : 'Why?'}</strong> {rec.reason}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {isHindi ? 'आवाज संदेश (Voice Payload):' : 'Voice Payload:'}
                </span>
                <p className="text-sm font-bold text-teal-900">
                  &quot;{patient.preferredLanguage === 'hi' ? rec.message.hi : rec.message.en}&quot;
                </p>
              </div>

              <button
                onClick={() => handlePlayAudio(rec.message.hi)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isHindi ? 'आवाज सुनें (Play Audio)' : 'Play Voice Prompt'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* What Works For Me Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-outfit font-bold text-lg text-slate-900 flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-emerald-600" />
          <span>{isHindi ? 'मेरे लिए क्या कारगर रहा (What Works For Me)' : 'What Works For Me'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-800 text-sm block">✓ Hindi Voice Reminders</span>
            <p className="text-emerald-700 font-medium">100% effective for evening dinner doses.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="font-bold text-amber-800 text-sm block">○ Standard Mobile Text Push</span>
            <p className="text-amber-700 font-medium">Less effective during busy dinner hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
