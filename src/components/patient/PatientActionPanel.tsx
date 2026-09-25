import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useMedication } from '../../context/MedicationContext';
import { CheckCircle2, Clock, PackageX, AlertTriangle, PhoneCall, HeartHandshake } from 'lucide-react';

interface PatientActionPanelProps {
  currentLanguage: 'en' | 'hi';
}

export const PatientActionPanel: React.FC<PatientActionPanelProps> = ({ currentLanguage }) => {
  const { patient, medications } = useMedication();
  const isHindi = currentLanguage === 'hi' || patient.preferredLanguage === 'hi';
  const [lastActionResult, setLastActionResult] = useState<string | null>(null);

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'TAKEN':
        setLastActionResult(
          isHindi
            ? '✅ धन्यवाद! आपकी दवा लेने की पुष्टि दर्ज कर ली गई है।'
            : '✅ Thank you! Your dose confirmation has been recorded.'
        );
        break;
      case 'DELAY':
        setLastActionResult(
          isHindi
            ? '⏰ ठीक है! MedMatrix आपको 30 मिनट बाद दोबारा याद दिलाएगा।'
            : '⏰ Got it! MedMatrix will remind you in 30 minutes.'
        );
        break;
      case 'NO_STOCK':
        setLastActionResult(
          isHindi
            ? '📦 रीफिल सूचना: आपकी दवा खत्म हो रही है। केयरगिवर को संदेश भेज दिया गया है।'
            : '📦 Refill Alert: Refill notification sent to your caregiver and pharmacy.'
        );
        break;
      case 'PROBLEM':
        setLastActionResult(
          isHindi
            ? '🩺 ध्यान रखें: आपका लक्षण जांच फॉर्म दर्ज कर लिया गया है।'
            : '🩺 Care Check: Your side-effect check-in request has been logged.'
        );
        break;
      case 'HELP':
        setLastActionResult(
          isHindi
            ? '🚨 आपातकालीन अलर्ट: आपके केयरगिवर को तुरंत SMS / कॉल अलर्ट भेजा गया है!'
            : '🚨 Emergency Alert: Immediate caregiver escalation notification sent!'
        );
        break;
    }
  };

  return (
    <Card variant="highlight" className="space-y-4 border-2 border-teal-500/40 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-teal-400" />
          <div>
            <h3 className="font-outfit font-extrabold text-lg text-white">
              {isHindi ? 'मरीज़ त्वरित क्रियाएँ (Simple Patient Actions)' : 'Simple Patient Actions'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHindi
                ? 'आसान भाषा और बड़े बटन — एक क्लिक में अपनी दवा का स्टेटस बताएं'
                : 'Large touch targets with simple language for accessible intake confirmation'}
            </p>
          </div>
        </div>

        <Badge variant="info" className="self-start sm:self-auto font-mono text-xs">
          {isHindi ? 'भाषा: हिंदी (Hindi)' : 'Language: English'}
        </Badge>
      </div>

      {/* Action Notification Box */}
      {lastActionResult && (
        <div className="p-3.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-sm font-semibold text-teal-200 animate-fadeIn">
          {lastActionResult}
        </div>
      )}

      {/* Large Patient Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* 1. Medicine Taken */}
        <button
          onClick={() => handleAction('TAKEN')}
          className="p-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-outfit font-bold text-base shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 border border-emerald-400/30"
        >
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <span>{isHindi ? 'दवा ले ली (Medicine taken)' : 'Medicine taken'}</span>
        </button>

        {/* 2. Remind me later */}
        <button
          onClick={() => handleAction('DELAY')}
          className="p-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-outfit font-bold text-base shadow-lg shadow-amber-900/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 border border-amber-400/30"
        >
          <Clock className="w-6 h-6 shrink-0" />
          <span>{isHindi ? 'मुझे बाद में याद दिलाएं (Remind me later)' : 'Remind me later'}</span>
        </button>

        {/* 3. I don't have this medicine */}
        <button
          onClick={() => handleAction('NO_STOCK')}
          className="p-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-outfit font-bold text-base shadow-lg shadow-orange-900/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 border border-orange-400/30"
        >
          <PackageX className="w-6 h-6 shrink-0" />
          <span>{isHindi ? 'दवा खत्म हो गई (I don\'t have this medicine)' : 'I don\'t have this medicine'}</span>
        </button>

        {/* 4. I'm having a problem */}
        <button
          onClick={() => handleAction('PROBLEM')}
          className="p-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-outfit font-bold text-base shadow-lg shadow-purple-900/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 border border-purple-400/30"
        >
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <span>{isHindi ? 'मुझे कोई समस्या है (I\'m having a problem)' : 'I\'m having a problem'}</span>
        </button>

        {/* 5. I need help */}
        <button
          onClick={() => handleAction('HELP')}
          className="p-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-outfit font-bold text-base shadow-lg shadow-rose-900/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 border border-rose-400/30 col-span-1 sm:col-span-2 lg:col-span-1"
        >
          <PhoneCall className="w-6 h-6 shrink-0" />
          <span>{isHindi ? 'मुझे सहायता चाहिए (I need help)' : 'I need help'}</span>
        </button>
      </div>
    </Card>
  );
};
