import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedication } from '../../context/MedicationContext';
import { Language } from '../../types';
import { Search, X, Pill, Calendar, TrendingUp, Sparkles, Brain } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: Language;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  currentLanguage = 'en',
}) => {
  const { medications, schedules } = useMedication();
  const navigate = useNavigate();
  const isHindi = currentLanguage === 'hi';
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isOpen ? onClose() : setSearchOpen();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const setSearchOpen = () => {
    // Parent handles state
  };

  if (!isOpen) return null;

  const filteredMeds = query
    ? medications.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          (m.category && m.category.toLowerCase().includes(query.toLowerCase()))
      )
    : medications.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl border border-slate-200 shadow-2xl overflow-hidden space-y-0">
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isHindi
                ? 'दवा का नाम, समयसारणी या रिकॉर्ड खोजें (Search Metformin, Schedule...)'
                : 'Search medications, schedules, adherence records...'
            }
            className="w-full text-base font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent"
          />
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-outfit">
              {isHindi ? 'दवाइयां' : 'Medications'}
            </div>
            <div className="space-y-1.5">
              {filteredMeds.map((med) => (
                <div
                  key={med.id}
                  onClick={() => {
                    onClose();
                    navigate('/medications');
                  }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200/80 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{med.name}</div>
                      <div className="text-xs text-slate-500">
                        {med.dosage} • {med.scheduledTimes.join(', ')}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-teal-700">{med.remainingQuantity} left</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Page Links */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-outfit">
              {isHindi ? 'त्वरित लिंक' : 'Quick Views'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  onClose();
                  navigate('/adherence');
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left font-semibold text-slate-700 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>{isHindi ? 'प्रगति रिपोर्ट' : 'Adherence Analytics'}</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/barriers');
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left font-semibold text-slate-700 flex items-center gap-2"
              >
                <Brain className="w-4 h-4 text-purple-600" />
                <span>{isHindi ? 'खुराक क्यों छूटती है?' : "Why Doses Missed"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
