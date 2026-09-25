import { EventStateMachine } from '../EventStateMachine';
import { MedicationEvent } from '../../types/events';

export function runEventStateMachineTests(): { total: number; passed: number; failed: number } {
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

  console.log('--- Running EventStateMachine Unit Tests ---');

  // Test 1: Valid Transition SCHEDULED -> DISPENSING
  try {
    const initEvent: MedicationEvent = {
      id: 'test_1',
      patientId: 'pat_01',
      medicationId: 'med_01',
      scheduledTime: '08:00',
      state: 'SCHEDULED',
      source: 'manual',
      evidence: ['schedule'],
      confidence: 'MEDIUM',
    };

    const nextEvent = EventStateMachine.transitionEvent(initEvent, 'DISPENSING', {
      source: 'hardware',
      evidence: ['dispensing'],
      notes: 'Dispensing started',
    });

    assert(nextEvent.state === 'DISPENSING', 'Transition SCHEDULED -> DISPENSING');
    assert(nextEvent.evidence.includes('dispensing'), 'Evidence included dispensing');
  } catch (e) {
    assert(false, 'Transition SCHEDULED -> DISPENSING threw exception');
  }

  // Test 2: Invalid Transition SCHEDULED -> COMPLETED (Bypassing DISPENSED/COLLECTED)
  try {
    const initEvent: MedicationEvent = {
      id: 'test_2',
      patientId: 'pat_01',
      medicationId: 'med_01',
      scheduledTime: '08:00',
      state: 'SCHEDULED',
      source: 'manual',
      evidence: ['schedule'],
      confidence: 'MEDIUM',
    };

    EventStateMachine.transitionEvent(initEvent, 'COMPLETED', {
      source: 'manual',
      evidence: ['patient confirmation'],
    });

    assert(false, 'Invalid Transition SCHEDULED -> COMPLETED should throw error');
  } catch (e) {
    assert(true, 'Invalid Transition SCHEDULED -> COMPLETED correctly caught');
  }

  // Test 3: Simulation Creator - Completed Dose Event
  try {
    const event = EventStateMachine.createCompletedDoseEvent('pat_01', 'med_01', '08:00');
    assert(event.state === 'COMPLETED', 'Simulated Completed Dose reaches COMPLETED state');
    assert(event.confidence === 'HIGH', 'Simulated Completed Dose has HIGH confidence rating');
    assert(event.evidence.includes('patient confirmation'), 'Includes patient confirmation evidence');
  } catch (e) {
    assert(false, 'createCompletedDoseEvent threw exception');
  }

  // Test 4: Simulation Creator - Failed Dispensing Event
  try {
    const event = EventStateMachine.createFailedDispensingEvent('pat_01', 'med_01', '08:00');
    assert(event.state === 'FAILED', 'Simulated Failed Dispensing reaches FAILED state');
    assert(event.evidence.includes('device failure'), 'Includes device failure evidence');
  } catch (e) {
    assert(false, 'createFailedDispensingEvent threw exception');
  }

  // Test 5: Simulation Creator - Uncertain Event
  try {
    const event = EventStateMachine.createUncertainEvent('pat_01', 'med_01', '08:00');
    assert(event.state === 'UNCERTAIN', 'Simulated Uncertain Event reaches UNCERTAIN state');
    assert(event.confidence === 'LOW', 'Uncertain event has LOW confidence rating');
  } catch (e) {
    assert(false, 'createUncertainEvent threw exception');
  }

  console.log(`--- Unit Tests Finished: ${passed} Passed, ${failed} Failed ---`);
  return { total: passed + failed, passed, failed };
}

// Auto-run if executed via Node directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.endsWith('EventStateMachine.test.ts')) {
  runEventStateMachineTests();
}
