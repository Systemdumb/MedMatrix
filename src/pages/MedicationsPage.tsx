import React, { useState } from 'react';
import { useMedication } from '../context/MedicationContext';
import { MedicationFormModal } from '../components/medications/MedicationFormModal';
import { Medication, Language } from '../types';
import { DetailDrawer, DetailDrawerData } from '../components/common/DetailDrawer';
import { Plus, Clock, Utensils, AlertCircle, CheckCircle2, Edit3, ShoppingCart, Eye, ChevronRight } from 'lucide-react';

interface MedicationsPageProps {
  currentLanguage?: Language;
}

export const MedicationsPage: React.FC<MedicationsPageProps> = ({ currentLanguage = 'en' }) => {
  const { medications, addMedication, updateMedication } = useMedication();
  const isHindi = currentLanguage === 'hi';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  // Detail Modal / Tabs State
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'history' | 'insights'>('overview');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailMed, setDetailMed] = useState<Medication | null>(null);

  // Level 3 Drawer
  const [drawerData, setDrawerData] = useState<DetailDrawerData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenAdd = () => {
    setSelectedMedication(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (med: Medication) => {
    setSelectedMedication(med);
    setIsFormOpen(true);
  };

  const handleOpenDetailModal = (med: Medication) => {
    setDetailMed(med);
    setActiveTab('overview');
    setIsDetailModalOpen(true);
  };

  const handleFormSubmit = (medData: Omit<Medication, 'id'> | Medication) => {
    if ('id' in medData && medData.id) {
      updateMedication(medData.id, medData);
    } else {
      addMedication(medData as Omit<Medication, 'id'>);
    }
  };

  const getFoodInstruction = (rel: string) => {
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

  const activeMedications = medications.filter((m) => m.active);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">
            {isHindi ? 'मेरी दवाइयां (My Medications)' : 'My Medications'}
          </h1>
          <p className="text-base text-slate-500 mt-1">
            {isHindi ? 'अपनी सभी दवाइयों, खुराक और समयसारणी को प्रबंधित करें' : 'View and manage all your prescribed medications'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>{isHindi ? '+ नई दवा जोड़ें' : '+ Add Medicine'}</span>
        </button>
      </div>

      {/* Medication Cards List (Light Theme Cards) */}
      <div className="space-y-4">
        {activeMedications.map((med) => {
          const isLowStock = med.remainingQuantity <= med.refillThreshold;

          return (
            <div
              key={med.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-teal-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center text-2xl font-bold border border-teal-200 shrink-0">
                    💊
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-outfit text-slate-900">{med.name}</h2>
                    <p className="text-sm font-semibold text-teal-800">
                      {med.dosage} {med.dosageUnit || ''} • {med.frequency}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Adherence: 91%
                  </span>
                  {isLowStock ? (
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                      {isHindi ? 'दवा समाप्त होने वाली है' : 'Refill Soon'}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      {isHindi ? 'सक्रिय' : 'Active'}
                    </span>
                  )}
                </div>
              </div>

              {/* Time & Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <span>
                    <strong>{isHindi ? 'समय:' : 'Schedule:'}</strong> {med.scheduledTimes.join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>
                    <strong>{isHindi ? 'निर्देश:' : 'Instruction:'}</strong> {getFoodInstruction(med.relationToFood)}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500 font-medium">
                  {isHindi ? `स्टॉक: ${med.remainingQuantity} खुराक बची हैं` : `Stock: ${med.remainingQuantity} doses remaining`}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDetailModal(med)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isHindi ? 'विस्तृत जानकारी (View details)' : 'View details'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(med)}
                    className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {isLowStock && (
                    <button
                      onClick={() => alert(`Refill requested for ${med.name}`)}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Refill</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Medication Detail Dialog with Tabs */}
      {isDetailModalOpen && detailMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-outfit">
                  {isHindi ? 'दवा विवरण' : 'Medication Detail'}
                </span>
                <h2 className="text-2xl font-bold font-outfit text-slate-900 mt-0.5">{detailMed.name}</h2>
                <p className="text-xs text-slate-500">{detailMed.dosage} • {detailMed.frequency}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400"
              >
                ✕
              </button>
            </div>

            {/* Tabs Header */}
            <div className="flex items-center gap-2 px-6 border-b border-slate-200 bg-white">
              {(['overview', 'schedule', 'history', 'insights'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
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
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {activeTab === 'overview' && (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500">Current Adherence</div>
                      <div className="text-2xl font-black text-slate-900 font-outfit">91%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500">Stock Remaining</div>
                      <div className="text-2xl font-black text-teal-800 font-outfit">
                        {detailMed.remainingQuantity} doses
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-800">Food Instruction:</div>
                    <div className="text-slate-600">{getFoodInstruction(detailMed.relationToFood)}</div>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                    <span className="font-bold">Scheduled Times:</span>
                    <span>{detailMed.scheduledTimes.join(', ')}</span>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between">
                    <span>Yesterday 8:00 PM</span>
                    <span className="font-bold text-emerald-800">Completed ✓</span>
                  </div>
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold">Pattern Insight:</div>
                  <p>Intake time is most consistent during the morning 8:00 AM window.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <MedicationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMedication}
      />

      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={drawerData}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};
