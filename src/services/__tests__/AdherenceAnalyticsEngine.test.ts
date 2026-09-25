import { AdherenceAnalyticsEngine } from '../AdherenceAnalyticsEngine';
import { MedicationEvent } from '../../types/events';

export function runAdherenceAnalyticsEngineTests(): { total: number; passed: number; failed: number } {
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

  console.log('--- Running AdherenceAnalyticsEngine Unit Tests ---');

  const sampleEvents: MedicationEvent[] = [
    {
      id: 'e1',
      patientId: 'p1',
      medicationId: 'm1',
      scheduledTime: '2026-09-10T08:00:00',
      state: 'COMPLETED',
      source: 'manual',
      evidence: ['schedule', 'patient confirmation'],
      confidence: 'HIGH',
    },
    {
      id: 'e2',
      patientId: 'p1',
      medicationId: 'm1',
      scheduledTime: '2026-09-10T20:00:00',
      state: 'MISSED',
      source: 'simulated',
      evidence: ['schedule'],
      confidence: 'MEDIUM',
    },
    {
      id: 'e3',
      patientId: 'p1',
      medicationId: 'm2',
      scheduledTime: '2026-09-11T08:00:00',
      state: 'FAILED',
      source: 'hardware',
      evidence: ['device failure', 'sensor'],
      confidence: 'LOW',
    },
    {
      id: 'e4',
      patientId: 'p1',
      medicationId: 'm2',
      scheduledTime: '2026-09-11T20:00:00',
      state: 'UNCERTAIN',
      source: 'simulated',
      evidence: ['unknown'],
      confidence: 'LOW',
    },
  ];

  const metrics = AdherenceAnalyticsEngine.analyzeAdherenceHistory(sampleEvents);

  // Test 1: Total scheduled doses count
  assert(metrics.totalScheduledDoses === 4, 'Total scheduled doses counted as 4');

  // Test 2: Device failure count
  assert(metrics.deviceFailureCount === 1, 'Device failure count is 1');

  // Test 3: Uncertain event count
  assert(metrics.uncertainEventsCount === 1, 'Uncertain event count is 1');

  // Test 4: Device Failure & Uncertain Excluded from Evaluated Denominator
  assert(metrics.evaluatedDosesCount === 2, 'Evaluated doses count is 2 (4 total - 1 device failure - 1 uncertain)');

  // Test 5: Overall Adherence Percentage calculation (1 completed / 2 evaluated = 50%)
  assert(metrics.overallAdherencePercentage === 50, 'Overall adherence % calculated as 50% (NOT penalized by device failure)');

  // Test 6: Time-of-Day Pattern
  const morningPattern = metrics.timeOfDayPattern.find((t) => t.windowName === 'Morning');
  const eveningPattern = metrics.timeOfDayPattern.find((t) => t.windowName === 'Evening');
  assert(morningPattern?.adherencePercentage === 100, 'Morning window adherence % is 100%');
  assert(eveningPattern?.adherencePercentage === 0, 'Evening window adherence % is 0%');

  console.log(`--- Unit Tests Finished: ${passed} Passed, ${failed} Failed ---`);
  return { total: passed + failed, passed, failed };
}
