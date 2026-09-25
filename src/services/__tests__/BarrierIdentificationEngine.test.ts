import { BarrierIdentificationEngine } from '../BarrierIdentificationEngine';
import { MedicationEvent } from '../../types/events';
import { Medication } from '../../types';

export function runBarrierIdentificationEngineTests(): { total: number; passed: number; failed: number } {
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

  console.log('--- Running BarrierIdentificationEngine Unit Tests ---');

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
      remainingQuantity: 3, // Low stock -> should trigger refill barrier
      refillThreshold: 5,
      active: true,
    },
  ];

  const testEvents: MedicationEvent[] = [
    {
      id: 'e1',
      patientId: 'p1',
      medicationId: 'm1',
      scheduledTime: '2026-09-14T20:00:00',
      state: 'MISSED',
      source: 'simulated',
      evidence: ['schedule'],
      confidence: 'MEDIUM',
    },
    {
      id: 'e2',
      patientId: 'p1',
      medicationId: 'm1',
      scheduledTime: '2026-09-15T20:00:00',
      state: 'MISSED',
      source: 'simulated',
      evidence: ['schedule'],
      confidence: 'MEDIUM',
    },
    {
      id: 'e3',
      patientId: 'p1',
      medicationId: 'm1',
      scheduledTime: '2026-09-16T08:00:00',
      state: 'FAILED',
      source: 'hardware',
      evidence: ['device failure', 'sensor'],
      confidence: 'LOW',
    },
  ];

  const barriers = BarrierIdentificationEngine.inferBarriers(testEvents, testMedications, 'p1');

  // Test 1: Refill / Availability Barrier Inferred
  const availBarrier = barriers.find((b) => b.barrierType === 'medication_availability');
  assert(availBarrier !== undefined, 'Refill barrier inferred when stock <= threshold');
  assert(availBarrier?.confidence === 'HIGH', 'Refill barrier confidence is HIGH');

  // Test 2: Hardware Dispensing Failure Inferred
  const devBarrier = barriers.find((b) => b.barrierType === 'device_failure');
  assert(devBarrier !== undefined, 'Device failure barrier inferred when hardware dispense fails');
  assert(devBarrier?.source === 'HARDWARE_SENSOR', 'Device failure source is HARDWARE_SENSOR');

  // Test 3: Evening Forgetfulness Inferred
  const forgetBarrier = barriers.find((b) => b.barrierType === 'forgetfulness');
  assert(forgetBarrier !== undefined, 'Evening forgetfulness barrier inferred for repeated evening misses');
  assert(forgetBarrier?.patientConfirmed === false, 'System-inferred barrier is NOT patient confirmed by default');

  // Test 4: Terminology Wording
  const title = BarrierIdentificationEngine.getBarrierTitle('forgetfulness');
  assert(title.startsWith('Probable'), 'Barrier title uses safety prefix "Probable"');

  console.log(`--- Unit Tests Finished: ${passed} Passed, ${failed} Failed ---`);
  return { total: passed + failed, passed, failed };
}
