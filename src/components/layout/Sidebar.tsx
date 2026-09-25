import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Pill,
  Calendar,
  BarChart3,
  Brain,
  Sparkles,
  User,
  Users,
  Smartphone,
  PlayCircle,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Language } from '../../types';

interface SidebarProps {
  currentLanguage?: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentLanguage = 'en' }) => {
  const isHindi = currentLanguage === 'hi';

  const NAV_ITEMS = [
    {
      path: '/dashboard',
      label: isHindi ? 'होम (Home)' : 'Home',
      icon: Home,
    },
    {
      path: '/medications',
      label: isHindi ? 'दवाइयां (Medications)' : 'Medications',
      icon: Pill,
    },
    {
      path: '/schedule',
      label: isHindi ? 'समयसारणी (Schedule)' : 'Schedule',
      icon: Calendar,
    },
    {
      path: '/adherence',
      label: isHindi ? 'प्रगति (Adherence)' : 'Adherence',
      icon: BarChart3,
    },
    {
      path: '/barriers',
      label: isHindi ? 'खुराक क्यों छूटती है?' : "Why I'm Missing Doses",
      icon: Brain,
    },
    {
      path: '/interventions',
      label: isHindi ? 'व्यक्तिगत सहायता' : 'Personalized Support',
      icon: Sparkles,
    },
    {
      path: '/patient',
      label: isHindi ? 'मेरी प्रोफ़ाइल (Profile)' : 'My Profile',
      icon: User,
    },
    {
      path: '/caregiver',
      label: isHindi ? 'परिवार / देखभालकर्ता' : 'Family / Caregiver',
      icon: Users,
    },
    {
      path: '/device',
      label: isHindi ? 'मेरा उपकरण (Device)' : 'My Device',
      icon: Smartphone,
    },
    {
      path: '/demo',
      label: isHindi ? 'डेमो (Demo Runner)' : 'Demo Scenarios',
      icon: PlayCircle,
      badge: 'SIH',
    },
    {
      path: '/settings',
      label: isHindi ? 'सेटिंग्स (Settings)' : 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] shadow-sm hidden md:flex">
      {/* Sidebar Navigation */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-outfit">
          {isHindi ? 'मुख्य नेविगेशन' : 'Main Menu'}
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-teal-50/90 text-teal-800 font-bold border-l-4 border-teal-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                )
              }
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className="w-4 h-4 text-slate-500 group-hover:text-teal-700 transition-colors shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-200 shrink-0">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1 shadow-sm">
          <span className="font-bold text-teal-800 block">MedMatrix Healthcare</span>
          <p className="text-[11px] text-slate-500 leading-tight">
            {isHindi ? 'सतत निगरानी एवं व्यवहार संबंधी बुद्धिमत्ता' : 'Adaptive Medication Adherence Intelligence'}
          </p>
        </div>
      </div>
    </aside>
  );
};
