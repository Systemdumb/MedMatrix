export type Language = 'en' | 'hi';

export type RelationToFood = 'BEFORE_FOOD' | 'AFTER_FOOD' | 'WITH_FOOD' | 'NONE';

export type ScheduleStatus = 'SCHEDULED' | 'READY' | 'COLLECTED' | 'MISSED' | 'DELAYED' | 'DISPENSED' | 'COMPLETED';

export type EventStatus = ScheduleStatus;

export interface CaregiverInfo {
  name: string;
  phone: string;
  relation: string;
}

export interface AdherenceProfile {
  score: number;
  vulnerableTimeWindow: string;
  primaryBarrier: string;
  effectiveIntervention: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender?: string;
  city?: string;
  preferredLanguage: Language | string;
  caregiver: CaregiverInfo;
  caregiverName?: string;
  caregiverPhone?: string;
  caregiverRelation?: string;
  chronicConditions: string[];
  adherenceScore?: number;
  adherenceProfile: AdherenceProfile;
  adherenceFingerprint?: {
    vulnerableTime: string;
    vulnerableDays: string;
    topProbableBarrier: string;
    secondaryBarrier: string;
    mostEffectiveIntervention: string;
    caregiverResponsiveness: 'High' | 'Medium' | 'Low';
  };
}

export type PatientProfile = Patient;

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  dosageUnit: string;
  frequency: string;
  scheduledTimes: string[]; // HH:mm format, e.g. ["08:00", "20:00"]
  relationToFood: RelationToFood;
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  prescribedQuantity: number;
  remainingQuantity: number;
  currentStock?: number; // Alias for remainingQuantity
  refillThreshold: number;
  active: boolean;
  category?: string; // e.g. "Diabetes", "Hypertension"
  instructions?: string;
  unit?: string;
}

export interface MedicationSchedule {
  id: string;
  medicationId: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: ScheduleStatus;
  actualTime?: string | null;
  notes?: string;
  daysOfWeek?: number[];
  doseQuantity?: number;
}

export type Schedule = MedicationSchedule;

export interface AdherenceEvent {
  id: string;
  scheduleId: string;
  medicationId: string;
  timestamp: string;
  expectedTime: string;
  actualTime?: string | null;
  status: ScheduleStatus;
  source: string;
  notes?: string;
}

export interface BarrierInference {
  id: string;
  patientId: string;
  barrierCategory: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;
  explanation: string;
  supportingEvidence: string[];
}

export interface InterventionRecord {
  id: string;
  eventId: string;
  barrierId: string;
  type: string;
  title: string;
  message: {
    en: string;
    hi: string;
  };
  status: string;
  timestamp: string;
}

export interface LearningRecord {
  id: string;
  barrierCategory: string;
  interventionType: string;
  successRate: string;
  assessment: string;
}

export interface DemoScenario {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  stepHighlights: {
    detect: string;
    understand: string;
    intervene: string;
    learn: string;
  };
}

export type PipelineStepId = 'detect' | 'understand' | 'intervene' | 'learn';
