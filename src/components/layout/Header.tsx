import React from 'react';
import { Globe, User, Search, Bell } from 'lucide-react';
import { INITIAL_PATIENT } from '../../data/demoData';
import { Language } from '../../types';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageToggle: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageToggle,
  onOpenSearch,
}) => {
  const isHindi = currentLanguage === 'hi';

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-xl shadow-md shadow-teal-700/20">
          M
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-outfit font-black text-lg text-slate-900 tracking-tight">MedMatrix</span>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Health
            </span>
          </div>
        </div>
      </div>

      {/* Center Global Search Trigger */}
      <div className="hidden sm:flex items-center flex-1 max-w-xs mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 text-xs border border-slate-200 transition-colors text-left"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{isHindi ? 'दवाइयां या समयसारणी खोजें...' : 'Search medicines, schedules...'}</span>
          <kbd className="hidden lg:inline-block ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-400 border border-slate-200">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="sm:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => alert(isHindi ? 'अधिसूचना: शाम की दवा का समय निकट है।' : 'Notification: Evening Metformin due at 8:00 PM.')}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-teal-600 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        {/* Language Toggle */}
        <button
          onClick={onLanguageToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
          title="Toggle Language (English / हिंदी)"
        >
          <Globe className="w-3.5 h-3.5 text-teal-700" />
          <span>{isHindi ? 'हिंदी' : 'English'}</span>
        </button>

        {/* Patient Profile Card Header Item */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs border border-teal-200">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-bold text-slate-800">{INITIAL_PATIENT.name}</div>
            <div className="text-[10px] text-slate-500">
              {(INITIAL_PATIENT.city || 'New Delhi').split(',')[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
