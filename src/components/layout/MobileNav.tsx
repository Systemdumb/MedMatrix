import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Pill,
  Calendar,
  BarChart3,
  MoreHorizontal,
  Brain,
  Sparkles,
  User,
  Users,
  Smartphone,
  PlayCircle,
  Settings,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Language } from '../../types';

interface MobileNavProps {
  currentLanguage?: Language;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentLanguage = 'en' }) => {
  const isHindi = currentLanguage === 'hi';
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const PRIMARY_MOBILE_NAV = [
    { path: '/dashboard', label: isHindi ? 'होम' : 'Home', icon: Home },
    { path: '/medications', label: isHindi ? 'दवाइयां' : 'Medicines', icon: Pill },
    { path: '/schedule', label: isHindi ? 'समय' : 'Schedule', icon: Calendar },
    { path: '/adherence', label: isHindi ? 'प्रगति' : 'Progress', icon: BarChart3 },
  ];

  const SECONDARY_MOBILE_NAV = [
    { path: '/barriers', label: isHindi ? 'खुराक क्यों छूटती है?' : "Why I'm Missing Doses", icon: Brain },
    { path: '/interventions', label: isHindi ? 'व्यक्तिगत सहायता' : 'Personalized Support', icon: Sparkles },
    { path: '/patient', label: isHindi ? 'मेरी प्रोफ़ाइल' : 'My Profile', icon: User },
    { path: '/caregiver', label: isHindi ? 'परिवार / देखभालकर्ता' : 'Family / Caregiver', icon: Users },
    { path: '/device', label: isHindi ? 'मेरा उपकरण' : 'My Device', icon: Smartphone },
    { path: '/demo', label: isHindi ? 'डेमो' : 'Demo Scenarios', icon: PlayCircle },
    { path: '/settings', label: isHindi ? 'सेटिंग्स' : 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 px-2 flex items-center justify-around z-40 shadow-lg">
        {PRIMARY_MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center w-16 py-1 text-xs font-semibold transition-colors',
                  isActive ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                )
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] truncate max-w-full">{item.label}</span>
            </NavLink>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className="flex flex-col items-center justify-center w-16 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{isHindi ? 'और अधिक' : 'More'}</span>
        </button>
      </nav>

      {/* Expandable More Menu Overlay */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 border-t border-slate-200 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-outfit font-bold text-lg text-slate-900">
                {isHindi ? 'सभी सुविधाएँ' : 'All Features'}
              </h3>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SECONDARY_MOBILE_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 p-3 rounded-2xl text-xs font-semibold border transition-all',
                        isActive
                          ? 'bg-teal-50 text-teal-800 border-teal-200 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                      )
                    }
                  >
                    <Icon className="w-4 h-4 text-teal-700 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
