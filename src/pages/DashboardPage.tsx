import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { Language } from '../types';
import {
  getGreeting,
  getBarrierPatientDescription,
  getInterventionPatientAction,
} from '../services/adapters/patientLanguageAdapter';
import { DetailDrawer, DetailDrawerData } from '../components/common/DetailDrawer';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Pill,
  ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  currentLanguage?: Language;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ currentLanguage = 'en' }) => {
  const { patient, medications, schedules, updateScheduleStatus } = useMedication();
  const navigate = useNavigate();
  const isHindi = currentLanguage === 'hi';

  const [drawerData, setDrawerData] = useState<DetailDrawerData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Today's medication calculations
  const totalToday = schedules.length || 3;
  const completedToday = schedules.filter(
    (s) => s.status === 'COLLECTED' || s.status === 'COMPLETED' || s.status === 'DISPENSED'
  ).length;

  const pendingSchedules = schedules.filter(
    (s) => s.status === 'SCHEDULED' || s.status === 'READY' || s.status === 'DELAYED'
  );
  const nextSchedule = pendingSchedules[0] || schedules[0];
  const nextMedication = medications.find((m) => m.id === nextSchedule?.medicationId) || medications[0];

  const handleTakeMedication = () => {
    if (nextSchedule) {
      updateScheduleStatus(nextSchedule.id, 'COLLECTED');
    }
  };

  const handleOpenInsightDetails = () => {
    setDrawerData({
      title: isHindi ? 'बुद्धिमत्तापूर्ण पैटर्न विश्लेषण' : 'Evening Routine Pattern Analysis',
      subtitle: isHindi ? 'पैटर्न इंजन द्वारा पाई गई जानकारी' : 'Inferred by MedMatrix Adherence Pattern Engine',
      friendlyExplanation: isHindi
        ? 'हमने देखा है कि शाम 7 से 9 बजे के बीच आपकी खुराक छूटने की संभावना अधिक होती है। आज हम आपको 30 मिनट पहले एक बोलकर याद दिलाने वाला रिमाइंडर देंगे।'
        : 'Our pattern engine identified that evening doses between 7 PM and 9 PM are missed more frequently. Today we will deliver a localized voice prompt 30 minutes prior.',
      date: new Date().toLocaleDateString(),
      time: '20:00',
      statusText: isHindi ? 'सुझाव सक्रिय है' : 'Adaptive Reminder Active',
      statusType: 'info',
      technicalDetails: {
        eventState: 'PATTERN_DETECTED',
        evidenceSource: 'LONGITUDINAL_SLIDING_WINDOW_7D',
        confidenceScore: 'HIGH (87%)',
        deviceHardwareId: 'ESP32_DISPENSER_DEV_01',
        interventionDelivered: 'VOICE_REMINDER_HI',
      },
    });
    setIsDrawerOpen(true);
  };

  const barrierText = getBarrierPatientDescription(
    patient?.adherenceProfile?.primaryBarrier || 'FORGETFULNESS',
    currentLanguage
  );
  const interventionText = getInterventionPatientAction(
    patient?.adherenceProfile?.effectiveIntervention || 'SCHEDULE_AWARE_REMINDER',
    currentLanguage
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* 1. Warm Patient Greeting */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-black font-outfit text-slate-900 tracking-tight">
          {getGreeting(patient.name, currentLanguage)}
        </h1>
        <p className="text-base text-slate-500 font-medium">
          {isHindi
            ? 'यहाँ आपकी आज की दवाइयों की दिनचर्या की पूरी जानकारी है।'
            : "Here's how your medication routine is going today."}
        </p>
      </div>

      {/* 2. Today's Overview (4 Small Soft Metric Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{isHindi ? "आज का रिकॉर्ड" : "Today's Progress"}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">
            {completedToday} / {totalToday}
          </div>
          <p className="text-xs text-emerald-700 font-medium">
            {isHindi ? 'खुराक पूरी हुई' : 'doses completed'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{isHindi ? 'अगली दवा' : 'Next Dose'}</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-outfit text-slate-900 truncate">
            {nextSchedule?.scheduledTime || '20:00'}
          </div>
          <p className="text-xs text-slate-600 font-medium truncate">
            {nextMedication?.name || 'Metformin'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{isHindi ? 'छूटी खुराक' : 'Missed Doses'}</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">0</div>
          <p className="text-xs text-slate-500 font-medium">
            {isHindi ? 'कोई नई चूक नहीं' : 'All clear this week'}
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{isHindi ? 'साप्ताहिक रुझान' : 'Weekly Trend'}</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-outfit text-teal-800">87%</div>
          <p className="text-xs text-teal-700 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {isHindi ? 'सुधार हो रहा है' : 'Improving'}
          </p>
        </div>
      </div>

      {/* 3. Next Medication Card (Large Light Soft Card) */}
      {nextMedication && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                {isHindi ? 'अगली दवा' : 'Next Medicine'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-outfit text-slate-900 pt-2">
                {nextMedication.name}
              </h2>
              <p className="text-base text-slate-600 font-medium">
                {nextMedication.dosage} {nextMedication.dosageUnit || ''} •{' '}
                <span className="text-teal-700 font-bold">{nextSchedule?.scheduledTime || '20:00'}</span>
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center text-2xl font-bold border border-teal-200 shrink-0">
              💊
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleTakeMedication}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-base shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isHindi ? 'दवा ले ली (Mark as taken)' : 'Mark as Taken'}</span>
            </button>

            <button
              onClick={() => navigate('/medications')}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-base transition-colors border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isHindi ? 'विवरण देखें' : 'View Medicine'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Intelligence Insight Card */}
      <div className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider font-outfit">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{isHindi ? 'मेडमैट्रिक्स ने ध्यान दिया' : 'MedMatrix Noticed Something'}</span>
          </div>
          <button
            onClick={handleOpenInsightDetails}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isHindi ? 'कारण जानें' : 'Why am I seeing this?'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed">
          &quot;{barrierText} {interventionText}&quot;
        </p>
      </div>

      {/* 5. Today's Compact Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-outfit font-bold text-lg text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-700" />
            <span>{isHindi ? 'आज की समयसारणी' : "Today's Timeline"}</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {schedules.map((sch) => {
            const med = medications.find((m) => m.id === sch.medicationId);
            const isTaken = sch.status === 'COLLECTED' || sch.status === 'COMPLETED' || sch.status === 'DISPENSED';

            return (
              <div
                key={sch.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isTaken ? '✓' : '○'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      {med?.name || 'Medication'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {med?.dosage} • Scheduled {sch.scheduledTime}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isTaken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {isTaken
                    ? isHindi
                      ? 'पूर्ण (Taken)'
                      : 'Taken'
                    : isHindi
                    ? 'आगामी (Upcoming)'
                    : 'Upcoming'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progressive Disclosure Level 2 & 3 Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={drawerData}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};
