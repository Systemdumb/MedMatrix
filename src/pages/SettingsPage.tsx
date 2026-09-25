import React from 'react';
import { useMedication } from '../context/MedicationContext';
import { Language } from '../types';
import { Globe, Bell, Volume2, Smartphone, Shield, RotateCcw, Info, Users } from 'lucide-react';

interface SettingsPageProps {
  currentLanguage?: Language;
  onLanguageToggle?: () => void;
  isDevMode?: boolean;
  onDevModeToggle?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentLanguage = 'en',
  onLanguageToggle,
}) => {
  const { resetToDemoData } = useMedication();
  const isHindi = currentLanguage === 'hi';

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">
          {isHindi ? 'सेटिंग्स (Settings)' : 'Settings'}
        </h1>
        <p className="text-base text-slate-500 mt-1">
          {isHindi
            ? 'भाषा, रिमाइंडर और ऐप प्राथमिकताएं प्रबंधित करें'
            : 'Manage account, notifications, preferences, and privacy'}
        </p>
      </div>

      <div className="space-y-4">
        {/* Language Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-200">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-900">
                {isHindi ? 'भाषा (Language)' : 'Language'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi ? 'हिंदी और अंग्रेजी के बीच बदलें' : 'Toggle between English and Hindi'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-sm font-semibold text-slate-800">
              {currentLanguage === 'hi' ? 'हिंदी (Hindi)' : 'English'}
            </span>
            <button
              onClick={onLanguageToggle}
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              {isHindi ? 'English में बदलें' : 'हिंदी में बदलें'}
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 border border-blue-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-900">
                {isHindi ? 'रिमाइंडर सूचनाएं' : 'Notifications'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi ? 'ध्वनि और संदेश अलर्ट की प्राथमिकताएं' : 'Manage sound and voice reminder settings'}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Voice Reminders (Hindi/English)</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-teal-700 rounded cursor-pointer" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Pre-Reminder 15 Minutes Prior</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-teal-700 rounded cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Privacy & Account Reset */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-outfit text-slate-900">
                {isHindi ? 'डेमो डेटा रीसेट करें' : 'Reset Demo Data'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi ? 'मूल स्थिति पर लौटें' : 'Reset local storage state back to demo defaults'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetToDemoData();
              alert(isHindi ? 'डेमो डेटा रीसेट किया गया।' : 'Demo state reset to initial parameters.');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            {isHindi ? 'रीसेट' : 'Reset'}
          </button>
        </div>
      </div>
    </div>
  );
};
