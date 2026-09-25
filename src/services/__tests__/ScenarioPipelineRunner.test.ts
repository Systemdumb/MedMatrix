import { ScenarioPipelineRunner } from '../ScenarioPipelineRunner';
import { Patient, Medication } from '../../types';

export function runScenarioPipelineRunnerTests(): { total: number; passed: number; failed: number } {
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

  console.log('--- Running ScenarioPipelineRunner Unit Tests ---');

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

  const testMeds: Medication[] = [
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

  // Test 1: Scenario 1 (Successful Dose)
  const res1 = ScenarioPipelineRunner.runScenario(1, testPatient, testMeds);
  assert(res1.stepDetect.event.state === 'COMPLETED', 'Scenario 1 produces COMPLETED event state');
  assert(res1.stepUnderstand.adherenceScore === 100, 'Scenario 1 adherence score is 100%');

  // Test 2: Scenario 2 (Forgetfulness)
  const res2 = ScenarioPipelineRunner.runScenario(2, testPatient, testMeds);
  assert(res2.stepUnderstand.barriers.some((b) => b.barrierType === 'forgetfulness'), 'Scenario 2 infers forgetfulness barrier');

  // Test 3: Scenario 3 (Refill Issue)
  const res3 = ScenarioPipelineRunner.runScenario(3, testPatient, testMeds);
  assert(res3.stepUnderstand.barriers.some((b) => b.barrierType === 'medication_availability'), 'Scenario 3 infers medication availability barrier');

  // Test 4: Scenario 4 (Device Failure)
  const res4 = ScenarioPipelineRunner.runScenario(4, testPatient, testMeds);
  assert(res4.stepDetect.event.state === 'FAILED', 'Scenario 4 produces FAILED event state');
  assert(res4.stepUnderstand.barriers.some((b) => b.barrierType === 'device_failure'), 'Scenario 4 infers device failure barrier');

  // Test 5: Scenario 5 (Intervention Failure)
  const res5 = ScenarioPipelineRunner.runScenario(5, testPatient, testMeds);
  assert(res5.stepLearn.learningOutcome.includes('Adaptive'), 'Scenario 5 triggers adaptive learning outcome');

  // Test 6: Scenario 6 (Offline Mode)
  const res6 = ScenarioPipelineRunner.runScenario(6, testPatient, testMeds);
  assert(res6.stepDetect.event.state === 'COMPLETED', 'Scenario 6 batch-syncs offline event to COMPLETED state');

  console.log(`--- Unit Tests Finished: ${passed} Passed, ${failed} Failed ---`);
  return { total: passed + failed, passed, failed };
}
