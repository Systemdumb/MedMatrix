import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { PipelineBanner } from './components/common/PipelineBanner';
import { AppRoutes } from './routes';
import { MedicationProvider } from './context/MedicationContext';
import { Language, PipelineStepId } from './types';

export const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('medmatrix_lang');
    return (saved as Language) || 'en';
  });

  const [isDevMode, setIsDevMode] = useState<boolean>(() => {
    return localStorage.getItem('medmatrix_dev_mode') === 'true';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<PipelineStepId>('understand');

  useEffect(() => {
    localStorage.setItem('medmatrix_lang', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('medmatrix_dev_mode', isDevMode ? 'true' : 'false');
  }, [isDevMode]);

  const handleLanguageToggle = () => {
    setCurrentLanguage((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const handleDevModeToggle = () => {
    setIsDevMode((prev) => !prev);
  };

  return (
    <MedicationProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
          {/* Top Header */}
          <Header
            currentLanguage={currentLanguage}
            onLanguageToggle={handleLanguageToggle}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          <div className="flex flex-1 overflow-hidden">
            {/* Desktop Persistent Left Sidebar (All 11 Main Items) */}
            <Sidebar currentLanguage={currentLanguage} />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
              {/* Optional Developer Pipeline Status Banner */}
              {isDevMode && (
                <PipelineBanner
                  activeStep={activePipelineStep}
                  onStepSelect={(step) => setActivePipelineStep(step)}
                />
              )}

              {/* View Router Outlet */}
              <div className="flex-1 px-4 sm:px-6 py-6 pb-24 md:pb-12">
                <AppRoutes
                  currentLanguage={currentLanguage}
                  onLanguageToggle={handleLanguageToggle}
                  isDevMode={isDevMode}
                  onDevModeToggle={handleDevModeToggle}
                />
              </div>
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileNav currentLanguage={currentLanguage} />

          {/* Global Search Dialog */}
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            currentLanguage={currentLanguage}
          />
        </div>
      </BrowserRouter>
    </MedicationProvider>
  );
};

export default App;
