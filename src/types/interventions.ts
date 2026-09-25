export type InterventionType =
  | 'standard_reminder'
  | 'voice_reminder'
  | 'local_language_reminder'
  | 'schedule_aware_reminder'
  | 'education_prompt'
  | 'side_effect_check_in'
  | 'refill_reminder'
  | 'caregiver_notification'
  | 'caregiver_escalation'
  | 'device_troubleshooting'
  | 'follow_up_prompt'
  | 'no_immediate_intervention';

export type InterventionPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface InterventionRecommendation {
  id: string;
  patientId: string;
  medicationId?: string | null;
  medicationName?: string;
  barrierId: string;
  barrierCategory: string;
  evidence: string[];
  interventionType: InterventionType;
  title: string;
  reason: string; // Explains WHY this intervention was selected
  priority: InterventionPriority;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  message: {
    en: string;
    hi: string;
  };
  status: 'RECOMMENDED' | 'DELIVERED' | 'ACTIONED' | 'DISMISSED';
}
