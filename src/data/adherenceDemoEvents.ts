import { MedicationEvent } from '../types/events';

export const RICH_ADHERENCE_EVENTS: MedicationEvent[] = [
  // Sept 3
  { id: 'evt_01', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-03T08:00:00', actualEventTime: '2026-09-03T08:05:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor', 'patient confirmation'], confidence: 'HIGH' },
  { id: 'evt_02', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-03T20:00:00', actualEventTime: '2026-09-03T20:10:00', state: 'COMPLETED', source: 'manual', evidence: ['schedule', 'patient confirmation'], confidence: 'HIGH' },

  // Sept 4
  { id: 'evt_03', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-04T08:00:00', actualEventTime: '2026-09-04T08:02:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_04', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-04T20:00:00', actualEventTime: '2026-09-04T20:40:00', state: 'DELAYED', source: 'manual', evidence: ['schedule'], confidence: 'MEDIUM' },

  // Sept 5 (Weekend - Sat)
  { id: 'evt_05', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-05T08:00:00', actualEventTime: '2026-09-05T08:15:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_06', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-05T20:00:00', actualEventTime: null, state: 'MISSED', source: 'simulated', evidence: ['schedule'], confidence: 'MEDIUM', notes: 'Weekend dinner disruption' },

  // Sept 6 (Weekend - Sun)
  { id: 'evt_07', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-06T08:00:00', actualEventTime: '2026-09-06T08:10:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_08', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-06T20:00:00', actualEventTime: null, state: 'MISSED', source: 'simulated', evidence: ['schedule'], confidence: 'MEDIUM', notes: 'Weekend dinner disruption' },

  // Sept 7
  { id: 'evt_09', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-07T08:00:00', actualEventTime: '2026-09-07T08:04:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_10', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-07T20:00:00', actualEventTime: '2026-09-07T20:05:00', state: 'COMPLETED', source: 'manual', evidence: ['schedule', 'patient confirmation'], confidence: 'HIGH' },

  // Sept 8
  { id: 'evt_11', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-08T08:00:00', actualEventTime: '2026-09-08T08:00:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_12', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-08T20:00:00', actualEventTime: '2026-09-08T20:12:00', state: 'COMPLETED', source: 'manual', evidence: ['schedule', 'patient confirmation'], confidence: 'HIGH' },

  // Sept 9 (Device Dispensing Malfunction Event)
  { id: 'evt_13', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-09T08:00:00', actualEventTime: null, state: 'FAILED', source: 'hardware', evidence: ['device failure', 'sensor'], confidence: 'LOW', notes: 'Hardware dispensing error: Servo pulse failed' },
  { id: 'evt_14', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-09T20:00:00', actualEventTime: '2026-09-09T20:08:00', state: 'COMPLETED', source: 'manual', evidence: ['schedule', 'patient confirmation'], confidence: 'HIGH' },

  // Sept 10
  { id: 'evt_15', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-10T08:00:00', actualEventTime: '2026-09-10T08:03:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_16', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-10T20:00:00', actualEventTime: null, state: 'MISSED', source: 'simulated', evidence: ['schedule'], confidence: 'MEDIUM' },

  // Sept 11
  { id: 'evt_17', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-11T08:00:00', actualEventTime: '2026-09-11T08:01:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_18', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-11T20:00:00', actualEventTime: null, state: 'UNCERTAIN', source: 'simulated', evidence: ['unknown'], confidence: 'LOW', notes: 'Sensor state inconclusive' },

  // Sept 12 (Weekend - Sat)
  { id: 'evt_19', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-12T08:00:00', actualEventTime: '2026-09-12T08:12:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_20', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-12T20:00:00', actualEventTime: null, state: 'MISSED', source: 'simulated', evidence: ['schedule'], confidence: 'MEDIUM' },

  // Sept 13 (Weekend - Sun)
  { id: 'evt_21', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-13T08:00:00', actualEventTime: '2026-09-13T08:05:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_22', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-13T20:00:00', actualEventTime: null, state: 'MISSED', source: 'simulated', evidence: ['schedule'], confidence: 'MEDIUM' },

  // Sept 14
  { id: 'evt_23', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-14T08:00:00', actualEventTime: '2026-09-14T08:02:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_24', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-14T20:00:00', actualEventTime: '2026-09-14T20:30:00', state: 'COMPLETED', source: 'manual', evidence: ['schedule', 'patient confirmation'], confidence: 'HIGH' },

  // Sept 15
  { id: 'evt_25', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-15T08:00:00', actualEventTime: '2026-09-15T08:06:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_26', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-15T20:00:00', actualEventTime: '2026-09-15T20:04:00', state: 'COMPLETED', source: 'manual', evidence: ['schedule', 'patient confirmation'], confidence: 'HIGH' },

  // Sept 16
  { id: 'evt_27', patientId: 'pat_001', medicationId: 'med_002', scheduledTime: '2026-09-16T08:00:00', actualEventTime: '2026-09-16T08:05:00', state: 'COMPLETED', source: 'hardware', evidence: ['schedule', 'sensor'], confidence: 'HIGH' },
  { id: 'evt_28', patientId: 'pat_001', medicationId: 'med_001', scheduledTime: '2026-09-16T20:00:00', actualEventTime: null, state: 'MISSED', source: 'simulated', evidence: ['schedule'], confidence: 'MEDIUM' },
];
