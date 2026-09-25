import React, { useState } from 'react';
import { Language } from '../types';
import { Smartphone, Wifi, BatteryCharging, CheckCircle2, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';

interface DevicePageProps {
  currentLanguage?: Language;
}

export const DevicePage: React.FC<DevicePageProps> = ({ currentLanguage = 'en' }) => {
  const isHindi = currentLanguage === 'hi';
  const [isConnected, setIsConnected] = useState(true);
  const [batteryLevel] = useState(82);
  const [lastSync] = useState('2 minutes ago');

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">
            {isHindi ? 'मेरा उपकरण (My Device)' : 'My Device'}
          </h1>
          <p className="text-base text-slate-500 mt-1">
            {isHindi
              ? 'स्मार्ट पिल बॉक्स कनेक्शन, बैटरी और सेंसर स्थिति'
              : 'Smart pill dispenser connectivity, battery, and sensor status'}
          </p>
        </div>

        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${
            isConnected
              ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              : 'bg-teal-700 text-white border-teal-700'
          }`}
        >
          {isConnected ? (isHindi ? 'कनेक्शन सिमुलेट करें (Disconnect)' : 'Simulate Offline Mode') : (isHindi ? 'पुनः कनेक्ट करें' : 'Reconnect Device')}
        </button>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold border shrink-0 ${
              isConnected ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              <Smartphone className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-outfit">
                {isHindi ? 'उपकरण स्थिति' : 'Device Status'}
              </span>
              <h2 className="text-2xl font-bold font-outfit text-slate-900 mt-0.5">
                {isConnected
                  ? isHindi
                    ? 'स्मार्ट डिस्पेंसर कनेक्टेड'
                    : 'Smart Dispenser Connected'
                  : isHindi
                  ? 'उपकरण ऑफ़लाइन है'
                  : 'Device Offline'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isConnected
                  ? `ESP32 Smart Compartment v1.2 • Wi-Fi Active`
                  : `Offline Queue Active — Events saved locally`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-600" />
              <span>{batteryLevel}% Battery</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-teal-700" />
              <span>{lastSync}</span>
            </div>
          </div>
        </div>

        {/* Offline Warning Notice */}
        {!isConnected && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
            💡 <strong>{isHindi ? 'ऑफ़लाइन सूचना:' : 'Offline Notice:'}</strong>{' '}
            {isHindi
              ? 'आपका उपकरण वर्तमान में ऑफ़लाइन है। आपकी दवा की खुराक की जानकारी स्थानीय रूप से सुरक्षित है और कनेक्शन वापस आने पर सिंक हो जाएगी।'
              : 'Your device is currently offline. Medication events will be stored locally and synced when the connection returns.'}
          </div>
        )}
      </div>

      {/* Sensor Verification Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-outfit font-bold text-lg text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-700" />
          <span>{isHindi ? 'सेंसर एवं हार्डवेयर जाँच' : 'Sensors & Hardware Health'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dispensing Sensor
            </span>
            <p className="text-slate-500">Optical drop detection active.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Door Access Sensor
            </span>
            <p className="text-slate-500">Reed switch closed & secure.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Schedule Synchronization
            </span>
            <p className="text-slate-500">Synced with MedMatrix cloud engine.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
