import { SimulatedHardwareAdapter } from '../hardware/HardwareEventAdapter';

export function runHardwareEventAdapterTests(): { total: number; passed: number; failed: number } {
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

  console.log('--- Running HardwareEventAdapter Unit Tests ---');

  const adapter = new SimulatedHardwareAdapter('ESP32_TEST');

  // Test 1: Adapter connection status
  assert(adapter.isConnected() === true, 'SimulatedHardwareAdapter initializes connected');

  // Test 2: DISPENSE_SUCCESS conversion to MedicationEvent
  const sig1 = adapter.simulateSignal('DISPENSE_SUCCESS', 'm1');
  const event1 = SimulatedHardwareAdapter.convertSignalToMedicationEvent(sig1, 'p1', '08:00');
  assert(event1.state === 'DISPENSED', 'DISPENSE_SUCCESS converts to DISPENSED state');
  assert(event1.source === 'hardware', 'Signal source is hardware');

  // Test 3: DISPENSE_FAILURE conversion to FAILED state
  const sig2 = adapter.simulateSignal('DISPENSE_FAILURE', 'm1');
  const event2 = SimulatedHardwareAdapter.convertSignalToMedicationEvent(sig2, 'p1', '20:00');
  assert(event2.state === 'FAILED', 'DISPENSE_FAILURE converts to FAILED state');
  assert(event2.evidence?.includes('device failure') === true, 'Includes device failure evidence');

  // Test 4: Offline queueing
  adapter.simulateSignal('DEVICE_OFFLINE');
  assert(adapter.isConnected() === false, 'Adapter enters offline state');

  adapter.simulateSignal('COLLECTION_SUCCESS', 'm1');
  assert(adapter.getQueuedSignalsCount() === 1, 'Offline signal queued in adapter buffer');

  // Test 5: Reconnection flushes queue
  adapter.simulateSignal('DEVICE_RECONNECTED');
  assert(adapter.isConnected() === true, 'Adapter reconnects');
  assert(adapter.getQueuedSignalsCount() === 0, 'Offline queue flushed upon reconnection');

  console.log(`--- Unit Tests Finished: ${passed} Passed, ${failed} Failed ---`);
  return { total: passed + failed, passed, failed };
}
