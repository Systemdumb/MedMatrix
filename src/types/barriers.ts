export type BarrierCategory =
  | 'forgetfulness'
  | 'schedule_disruption'
  | 'medication_complexity'
  | 'intentional_non_adherence'
  | 'side_effect_concern'
  | 'medication_availability'
  | 'affordability'
  | 'lack_of_understanding'
  | 'travel_or_routine_disruption'
  | 'caregiver_support'
  | 'device_failure'
  | 'unknown';

export type BarrierSource = 'SYSTEM_INFERRED' | 'PATIENT_REPORTED' | 'HARDWARE_SENSOR';

export interface BarrierInsight {
  id: string;
  patientId: string;
  medicationId?: string | null;
  medicationName?: string;
  barrierType: BarrierCategory;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string[];
  frequency: number;
  firstObserved: string; // YYYY-MM-DD
  lastObserved: string;  // YYYY-MM-DD
  patientConfirmed: boolean;
  source: BarrierSource;
}
