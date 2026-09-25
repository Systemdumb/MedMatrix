import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, Medication, MedicationSchedule, ScheduleStatus } from '../types';
import { INITIAL_PATIENT, INITIAL_MEDICATIONS, INITIAL_SCHEDULES } from '../data/initialData';
import { apiClient } from '../services/api/apiClient';

interface MedicationContextType {
  patient: Patient;
  medications: Medication[];
  schedules: MedicationSchedule[];
  isOnline: boolean;
  addMedication: (med: Omit<Medication, 'id'>) => Medication;
  updateMedication: (id: string, updated: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  updateScheduleStatus: (scheduleId: string, status: ScheduleStatus, notes?: string) => void;
  resetToDemoData: () => void;
}

const STORAGE_KEYS = {
  PATIENT: 'medmatrix_patient',
  MEDICATIONS: 'medmatrix_medications',
  SCHEDULES: 'medmatrix_schedules',
};

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(false);

  const [patient, setPatient] = useState<Patient>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENT);
    return saved ? JSON.parse(saved) : INITIAL_PATIENT;
  });

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
  });

  const [schedules, setSchedules] = useState<MedicationSchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  // Check backend server connection and fetch database data if online
  useEffect(() => {
    let isMounted = true;
    const syncWithBackend = async () => {
      const healthy = await apiClient.checkHealth();
      if (isMounted) setIsOnline(healthy);

      if (healthy) {
        try {
          const apiMeds = await apiClient.getMedications('p1');
          if (apiMeds && apiMeds.length > 0 && isMounted) {
            setMedications(apiMeds);
          }

          const apiSchedules = await apiClient.getSchedules('p1');
          if (apiSchedules && apiSchedules.length > 0 && isMounted) {
            setSchedules(apiSchedules);
          }

          const apiPatients = await apiClient.getPatients();
          if (apiPatients && apiPatients.length > 0 && isMounted) {
            const currentPatient = apiPatients.find((p) => p.id === 'p1' || (p as any).patientId === 'p1') || apiPatients[0];
            setPatient(currentPatient);
          }
        } catch (err) {
          console.warn('Backend API sync fallback to local storage:', err);
        }
      }
    };

    syncWithBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(patient));
  }, [patient]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  const addMedication = (newMedData: Omit<Medication, 'id'>): Medication => {
    const newId = `med_${Date.now()}`;
    const newMedication: Medication = {
      ...newMedData,
      id: newId,
    };

    const updatedMeds = [newMedication, ...medications];
    setMedications(updatedMeds);

    // Create today's schedules for this new medication
    const TODAY = new Date().toISOString().split('T')[0];
    const newSchedules: MedicationSchedule[] = newMedication.scheduledTimes.map((time, idx) => ({
      id: `sch_${Date.now()}_${idx}`,
      medicationId: newId,
      scheduledDate: TODAY,
      scheduledTime: time,
      status: 'SCHEDULED',
    }));

    setSchedules((prev) => [...prev, ...newSchedules]);

    // Async sync with API if online
    apiClient.saveMedication(newMedication).catch(() => {});
    newSchedules.forEach((sch) => apiClient.saveSchedule(sch).catch(() => {}));

    return newMedication;
  };

  const updateMedication = (id: string, updatedFields: Partial<Medication>) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === id || (med as any).medicationId === id) {
          const updated = { ...med, ...updatedFields };
          apiClient.saveMedication(updated).catch(() => {});
          return updated;
        }
        return med;
      })
    );
  };

  const deleteMedication = (id: string) => {
    updateMedication(id, { active: false });
    apiClient.deleteMedication(id).catch(() => {});
  };

  const updateScheduleStatus = (scheduleId: string, status: ScheduleStatus, notes?: string) => {
    const nowTime = new Date().toTimeString().slice(0, 5);

    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.id === scheduleId || (sch as any).scheduleId === scheduleId) {
          const isTaking = status === 'COLLECTED' || status === 'DISPENSED';
          if (isTaking && sch.status !== 'COLLECTED') {
            const targetMed = medications.find((m) => m.id === sch.medicationId || (m as any).medicationId === sch.medicationId);
            if (targetMed && targetMed.remainingQuantity > 0) {
              updateMedication(targetMed.id || (targetMed as any).medicationId, {
                remainingQuantity: Math.max(0, targetMed.remainingQuantity - 1),
              });
            }
          }
          const updatedSchedule = {
            ...sch,
            status,
            actualTime: isTaking ? nowTime : sch.actualTime,
            notes: notes || sch.notes,
          };
          apiClient.saveSchedule(updatedSchedule).catch(() => {});
          return updatedSchedule;
        }
        return sch;
      })
    );
  };

  const resetToDemoData = () => {
    setPatient(INITIAL_PATIENT);
    setMedications(INITIAL_MEDICATIONS);
    setSchedules(INITIAL_SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.PATIENT);
    localStorage.removeItem(STORAGE_KEYS.MEDICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
  };

  return (
    <MedicationContext.Provider
      value={{
        patient,
        medications,
        schedules,
        isOnline,
        addMedication,
        updateMedication,
        deleteMedication,
        updateScheduleStatus,
        resetToDemoData,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = (): MedicationContextType => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};
