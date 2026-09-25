import { PersonalizedInterventionEngine } from '../PersonalizedInterventionEngine';
import { BarrierInsight } from '../../types/barriers';
import { Patient, Medication } from '../../types';

export function runPersonalizedInterventionEngineTests(): { total: number; passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      passed++;
      console.log(`✓ [PASS] ${testName}`);
    } else {
      failed++;
      console.error(`✗ [FAIL] ${testName}`);
    }
  };

  console.log('--- Running PersonalizedInterventionEngine Unit Tests ---');

  const testPatient: Patient = {
    id: 'p1',
    name: 'Rajesh Sharma',
    age: 62,
    preferredLanguage: 'hi',
    caregiver: { name: 'Ananya Sharma', phone: '+91 98765 43210', relation: 'Daughter' },
    chronicConditions: ['Type 2 Diabetes'],
    adherenceProfile: {
      score: 74,
      vulnerableTimeWindow: 'Evening (20:00)',
      primaryBarrier: 'Evening Forgetfulness',
      effectiveIntervention: 'Multilingual Hindi Voice Prompt',
    },
  };

  const testMedications: Medication[] = [
    {
      id: 'm1',
      name: 'Metformin',
      dosage: '500',
      dosageUnit: 'mg',
      frequency: 'Twice Daily',
      scheduledTimes: ['08:00', '20:00'],
      relationToFood: 'AFTER_FOOD',
      startDate: '2026-01-01',
      prescribedQuantity: 60,
      remainingQuantity: 4,
      refillThreshold: 5,
      active: true,
    },
  ];

  const testBarriers: BarrierInsight[] = [
    {
      id: 'b1',
      patientId: 'p1',
      medicationId: 'm1',
      medicationName: 'Metformin 500mg',
      barrierType: 'forgetfulness',
      confidence: 'HIGH',
      evidence: ['3 consecutive missed evening doses'],
      frequency: 3,
      firstObserved: '2026-09-14',
      lastObserved: '2026-09-16',
      patientConfirmed: false,
      source: 'SYSTEM_INFERRED',
    },
    {
      id: 'b2',
      patientId: 'p1',
      medicationId: 'm1',
      medicationName: 'Metformin 500mg',
      barrierType: 'medication_availability',
      confidence: 'HIGH',
      evidence: ['Stock counter (4 units) below safety threshold'],
      frequency: 1,
      firstObserved: '2026-09-16',
      lastObserved: '2026-09-16',
      patientConfirmed: false,
      source: 'SYSTEM_INFERRED',
    },
    {
      id: 'b3',
      patientId: 'p1',
      barrierType: 'device_failure',
      confidence: 'HIGH',
      evidence: ['Hardware optical sensor registered 1 dispense failure'],
      frequency: 1,
      firstObserved: '2026-09-16',
      lastObserved: '2026-09-16',
      patientConfirmed: false,
      source: 'HARDWARE_SENSOR',
    },
  ];

  const recs = PersonalizedInterventionEngine.selectInterventions(testBarriers, testPatient, testMedications);

  // Test 1: Count of generated recommendations matches barriers count
  assert(recs.length === 3, 'Generated 3 personalized intervention recommendations');

  // Test 2: Forgetfulness Barrier -> Hindi Local Language Voice Reminder
  const forgetRec = recs.find((r) => r.barrierCategory === 'forgetfulness');
  assert(forgetRec?.interventionType === 'local_language_reminder', 'Forgetfulness barrier selected local_language_reminder');
  assert(forgetRec?.reason.includes('Hindi') === true, 'Reason explains WHY Hindi Voice Prompt was selected');

  // Test 3: Refill Barrier -> Refill Reminder
  const refillRec = recs.find((r) => r.barrierCategory === 'medication_availability');
  assert(refillRec?.interventionType === 'refill_reminder', 'Refill barrier selected refill_reminder');

  // Test 4: Device Failure Barrier -> Device Troubleshooting
  const devRec = recs.find((r) => r.barrierCategory === 'device_failure');
  assert(devRec?.interventionType === 'device_troubleshooting', 'Device failure selected device_troubleshooting');

  // Test 5: Explanatory Reason String Check
  assert(recs.every((r) => r.reason.length > 20), 'Every recommendation contains an explainable reason string');

  console.log(`--- Unit Tests Finished: ${passed} Passed, ${failed} Failed ---`);
  return { total: passed + failed, passed, failed };
}
