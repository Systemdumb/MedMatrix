import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { MedicationsPage } from './pages/MedicationsPage';
import { SchedulePage } from './pages/SchedulePage';
import { AdherencePage } from './pages/AdherencePage';
import { BarriersPage } from './pages/BarriersPage';
import { InterventionsPage } from './pages/InterventionsPage';
import { PatientPage } from './pages/PatientPage';
import { CaregiverPage } from './pages/CaregiverPage';
import { DevicePage } from './pages/DevicePage';
import { DemoPage } from './pages/DemoPage';
import { SettingsPage } from './pages/SettingsPage';
import { Language } from './types';

interface AppRoutesProps {
  currentLanguage: Language;
  onLanguageToggle: () => void;
  isDevMode?: boolean;
  onDevModeToggle?: () => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  currentLanguage,
  onLanguageToggle,
  isDevMode = false,
  onDevModeToggle,
}) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage currentLanguage={currentLanguage} />} />
      <Route path="/medications" element={<MedicationsPage currentLanguage={currentLanguage} />} />
      <Route path="/schedule" element={<SchedulePage currentLanguage={currentLanguage} />} />
      <Route path="/adherence" element={<AdherencePage currentLanguage={currentLanguage} />} />
      <Route path="/barriers" element={<BarriersPage currentLanguage={currentLanguage} />} />
      <Route path="/interventions" element={<InterventionsPage currentLanguage={currentLanguage} />} />
      <Route path="/patient" element={<PatientPage currentLanguage={currentLanguage} />} />
      <Route path="/caregiver" element={<CaregiverPage currentLanguage={currentLanguage} />} />
      <Route path="/device" element={<DevicePage currentLanguage={currentLanguage} />} />
      <Route path="/demo" element={<DemoPage currentLanguage={currentLanguage} />} />
      <Route
        path="/settings"
        element={
          <SettingsPage
            currentLanguage={currentLanguage}
            onLanguageToggle={onLanguageToggle}
            isDevMode={isDevMode}
            onDevModeToggle={onDevModeToggle}
          />
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};


