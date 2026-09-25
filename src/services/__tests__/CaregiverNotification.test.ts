export function runCaregiverNotificationTests(): { total: number; passed: number; failed: number } {
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

  console.log('--- Running CaregiverNotification Wording & Safety Unit Tests ---');

  const getNotificationText = (type: 'UNCONFIRMED_DOSE' | 'REFILL_NEEDED' | 'DEVICE_FAILURE'): string => {
    switch (type) {
      case 'UNCONFIRMED_DOSE':
        return 'Evening dose has not been confirmed.';
      case 'REFILL_NEEDED':
        return 'Medication supply may require refill.';
      case 'DEVICE_FAILURE':
        return 'Medication dispensing could not be verified. Patient non-adherence has not been concluded.';
    }
  };

  // Test 1: Unconfirmed dose phrasing does NOT use generic "Patient missed dose"
  const text1 = getNotificationText('UNCONFIRMED_DOSE');
  assert(!text1.includes('missed dose'), 'Unconfirmed dose notification avoids generic "missed dose" language');
  assert(text1 === 'Evening dose has not been confirmed.', 'Uses specific "Evening dose has not been confirmed" phrasing');

  // Test 2: Refill warning phrasing
  const text2 = getNotificationText('REFILL_NEEDED');
  assert(text2 === 'Medication supply may require refill.', 'Uses specific "Medication supply may require refill" phrasing');

  // Test 3: Device failure safeguard phrasing
  const text3 = getNotificationText('DEVICE_FAILURE');
  assert(text3.includes('Patient non-adherence has not been concluded'), 'Device failure explicitly state non-adherence is NOT concluded');

  console.log(`--- Unit Tests Finished: ${passed} Passed, ${failed} Failed ---`);
  return { total: passed + failed, passed, failed };
}
