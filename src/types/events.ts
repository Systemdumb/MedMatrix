export type EventState = 
  | 'SCHEDULED'
  | 'READY'
  | 'DISPENSING'
  | 'DISPENSED'
  | 'COLLECTED'
  | 'COMPLETED'
  | 'DELAYED'
  | 'MISSED'
  | 'FAILED'
  | 'UNCERTAIN';

export type EventSource = 'manual' | 'simulated' | 'hardware';

export type EventEvidence = 
  | 'schedule'
  | 'dispensing'
  | 'collection'
  | 'patient confirmation'
  | 'sensor'
  | 'device failure'
  | 'unknown';

export type EventConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface MedicationEvent {
  id: string;
  patientId: string;
  medicationId: string;
  scheduledTime: string; // ISO format or HH:mm
  actualEventTime?: string | null;
  state: EventState;
  source: EventSource;
  evidence: EventEvidence[];
  confidence: EventConfidence;
  notes?: string;
}
