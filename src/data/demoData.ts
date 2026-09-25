import { PatientProfile, Medication, Schedule, AdherenceEvent, BarrierInference, InterventionRecord, LearningRecord, DemoScenario } from '../types';
import { INITIAL_PATIENT as PAT, INITIAL_MEDICATIONS as MEDS, INITIAL_SCHEDULES as SCHS } from './initialData';

export const INITIAL_PATIENT: PatientProfile = PAT;

export const INITIAL_MEDICATIONS: Medication[] = MEDS;

export const INITIAL_SCHEDULES: Schedule[] = SCHS;

const TODAY = new Date().toISOString().split('T')[0];

export const INITIAL_EVENTS: AdherenceEvent[] = [
  {
    id: 'evt_101',
    scheduleId: 'sch_002',
    medicationId: 'med_002',
    timestamp: `${TODAY}T08:05:00`,
    expectedTime: '08:00',
    actualTime: '08:05',
    status: 'COLLECTED',
    source: 'ESP32_HARDWARE',
    notes: 'Optical sensor verified pill release'
  },
  {
    id: 'evt_102',
    scheduleId: 'sch_004',
    medicationId: 'med_001',
    timestamp: `${TODAY}T20:45:00`,
    expectedTime: '20:00',
    actualTime: null,
    status: 'MISSED',
    source: 'APP_MANUAL',
    notes: 'Unconfirmed after 45m. Voice intervention sent.'
  },
  {
    id: 'evt_103',
    scheduleId: 'sch_005',
    medicationId: 'med_004',
    timestamp: `${TODAY}T21:30:00`,
    expectedTime: '21:30',
    actualTime: '21:32',
    status: 'COLLECTED',
    source: 'APP_MANUAL',
    notes: 'Patient confirmed dose'
  }
];

export const INITIAL_BARRIERS: BarrierInference[] = [
  {
    id: 'bar_01',
    patientId: 'pat_001',
    barrierCategory: 'Forgetfulness',
    confidence: 'HIGH',
    source: 'SYSTEM_INFERRED',
    explanation: '3 consecutive missed or delayed evening doses detected between 20:00 and 21:00.',
    supportingEvidence: [
      'Evening dose missed on Sept 14 (20:00)',
      'Evening dose delayed 55m on Sept 15 (20:55)',
      'Evening dose missed on Sept 16 (20:00)'
    ]
  },
  {
    id: 'bar_02',
    patientId: 'pat_001',
    barrierCategory: 'Medication Availability / Refill',
    confidence: 'MEDIUM',
    source: 'SYSTEM_INFERRED',
    explanation: 'Metformin 500mg inventory (4 tablets) is below refill threshold (5 tablets).',
    supportingEvidence: [
      'Current stock: 4 tablets',
      'Refill safety threshold: 5 tablets',
      'Estimated supply remaining: 4 days'
    ]
  }
];

export const INITIAL_INTERVENTIONS: InterventionRecord[] = [
  {
    id: 'int_01',
    eventId: 'evt_102',
    barrierId: 'bar_01',
    type: 'VOICE_REMINDER_HI',
    title: 'Multilingual Voice Prompt (Hindi)',
    message: {
      en: 'Rajesh ji, it is time for your Metformin dose after dinner. Please confirm your dose.',
      hi: 'राजेश जी, रात के खाने के बाद मेटफॉर्मिन की दवा लेने का समय हो गया है। कृपया दवा लें।'
    },
    status: 'DELIVERED',
    timestamp: `${TODAY}T20:30:00`
  },
  {
    id: 'int_02',
    eventId: 'evt_102',
    barrierId: 'bar_02',
    type: 'CAREGIVER_ACTION_ALERT',
    title: 'Actionable Caregiver Refill Alert',
    message: {
      en: 'Caregiver Notification: Metformin stock is low (4 remaining). Recommended action: Order refill.',
      hi: 'केयरगिवर सूचना: मेटफॉर्मिन की दवा कम है (4 बची हैं)। कृपया नई दवा मंगवाएं।'
    },
    status: 'DELIVERED',
    timestamp: `${TODAY}T20:35:00`
  }
];

export const INITIAL_LEARNING_RECORDS: LearningRecord[] = [
  {
    id: 'lrn_01',
    barrierCategory: 'Forgetfulness',
    interventionType: 'Standard Push Notification',
    successRate: '30%',
    assessment: 'Low Effectiveness (Ignored)'
  },
  {
    id: 'lrn_02',
    barrierCategory: 'Forgetfulness',
    interventionType: 'Multilingual Hindi Voice Prompt',
    successRate: '85%',
    assessment: 'High Effectiveness (Prioritized)'
  }
];

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 1,
    title: 'Scenario 1 — Normal Adherence',
    subtitle: 'Standard Intake & Instant Verification',
    description: 'Scheduled dose at 08:00 is collected on time. High adherence evidence recorded. No escalation needed.',
    stepHighlights: {
      detect: '08:00 Dose scheduled -> Hardware / App registers dose release at 08:05',
      understand: 'Adherence evidence score: 100%. No barrier detected.',
      intervene: 'No intervention required. Positive streak updated.',
      learn: 'Routine confirmed effective for morning window.'
    }
  },
  {
    id: 2,
    title: 'Scenario 2 — Evening Forgetfulness',
    subtitle: 'Multilingual Voice Intervention',
    description: 'Repeated evening misses trigger system-inferred Forgetfulness barrier. Hindi voice prompt delivered. Patient responds.',
    stepHighlights: {
      detect: '20:00 Evening dose unconfirmed after 45 minutes.',
      understand: 'Pattern Engine detects 3rd evening delay. Inferred Barrier: Forgetfulness (High Confidence).',
      intervene: 'Selected Intervention: Hindi Voice Prompt ("राजेश जी, दवा लेने का समय हो गया है").',
      learn: 'Patient confirms dose within 4 mins. Hindi Voice model weight increased.'
    }
  },
  {
    id: 3,
    title: 'Scenario 3 — Supply Depletion / Availability',
    subtitle: 'Refill Barrier & Actionable Caregiver Alert',
    description: 'Inventory drops below threshold. System identifies Medication Availability barrier instead of forgetfulness.',
    stepHighlights: {
      detect: 'Inventory counter reaches 4 tablets (below 5-tablet safety threshold).',
      understand: 'Inferred Barrier: Medication Availability / Refill Issue.',
      intervene: 'Triggers Refill Prompt & Actionable Caregiver Alert to Ananya Sharma.',
      learn: 'Caregiver acknowledges refill request. Non-adherence risk prevented.'
    }
  },
  {
    id: 4,
    title: 'Scenario 4 — Device Dispensing Failure Safeguard',
    subtitle: 'Hardware Verification Safeguard',
    description: 'Hardware dispense command sent, but optical sensor registers no pill drop. Patient adherence score is protected.',
    stepHighlights: {
      detect: 'Dispense pulse sent to ESP32 -> Optical sensor reports 0 pill drop.',
      understand: 'Inferred Issue: Device / Dispensing Failure (NOT Patient Non-Adherence).',
      intervene: 'Triggers Technical Troubleshooting alert for device compartment.',
      learn: 'Patient adherence score metric protected from hardware fault penalty.'
    }
  },
  {
    id: 5,
    title: 'Scenario 5 — Intervention Escalation & Adaptation',
    subtitle: 'Adaptive Secondary Intervention',
    description: 'Standard text notification ignored. System adapts by escalating to caregiver voice prompt.',
    stepHighlights: {
      detect: 'Standard text reminder unacknowledged after 20 minutes.',
      understand: 'Standard reminder evaluated as Ineffective for this context.',
      intervene: 'System adapts: Escalates to Caregiver Voice Prompt.',
      learn: 'Updates intervention ranking for future evening events.'
    }
  },
  {
    id: 6,
    title: 'Scenario 6 — Offline Operation & Sync',
    subtitle: 'Local Queueing & Network Reconnect Sync',
    description: 'Network drops during intake. Event logged in local IndexedDB store and synced upon reconnection.',
    stepHighlights: {
      detect: 'Network offline. Event logged in browser local store.',
      understand: 'Local pattern processing active during network outage.',
      intervene: 'Local audio prompt played via browser speech synthesis.',
      learn: 'Reconnected: Synchronized 2 local events to central record.'
    }
  }
];
