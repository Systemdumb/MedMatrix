import { InterventionType } from './interventions';

export type ResponseType = 'responded' | 'delayed_response' | 'no_response' | 'not_applicable';

export type OutcomeType = 'successful' | 'partially_successful' | 'unsuccessful' | 'unknown';

export interface InterventionResponse {
  id: string;
  patientId: string;
  medicationId?: string | null;
  medicationName?: string;
  interventionId: string;
  interventionType: InterventionType;
  timestamp: string;
  response: ResponseType;
  responseTime?: number; // In seconds
  subsequentMedicationEvent: string; // e.g. 'COMPLETED', 'MISSED', 'DELAYED'
  outcome: OutcomeType;
  effectiveness: number; // 0 to 100 percentage score
  contextWindow?: string; // e.g. 'Evening (20:00)', 'Morning (08:00)'
  notes?: string;
}

export interface ContextualPreference {
  contextWindow: string;
  medicationId?: string | null;
  medicationName?: string;
  topIntervention: InterventionType;
  topInterventionTitle: string;
  effectivenessScore: number;
  sampleSize: number;
  reasoning: string;
}

export interface InterventionPreferenceProfile {
  patientId: string;
  patientName: string;
  effectiveInterventions: {
    type: InterventionType;
    title: string;
    successRate: number;
    totalDelivered: number;
    explanation: string;
  }[];
  lowResponseInterventions: {
    type: InterventionType;
    title: string;
    failureRate: number;
    totalDelivered: number;
    explanation: string;
  }[];
  contextualPreferences: ContextualPreference[];
  lastUpdated: string;
}
