import { InterventionLearningEngine } from '../InterventionLearningEngine';
import { DEMO_INTERVENTION_RESPONSES } from '../../data/learningDemoData';

export function runInterventionLearningEngineTests(): { total: number; passed: number; failed: number } {
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

  console.log('--- Running InterventionLearningEngine Unit Tests ---');

  // Test 1: Evaluate outcome for responded + COMPLETED -> successful (100%)
  const out1 = InterventionLearningEngine.evaluateOutcome('responded', 'COMPLETED');
  assert(out1.outcome === 'successful' && out1.effectiveness === 100, 'Evaluates responded + COMPLETED as successful (100%)');

  // Test 2: Evaluate outcome for no_response + MISSED -> unsuccessful (0%)
  const out2 = InterventionLearningEngine.evaluateOutcome('no_response', 'MISSED');
  assert(out2.outcome === 'unsuccessful' && out2.effectiveness === 0, 'Evaluates no_response + MISSED as unsuccessful (0%)');

  // Test 3: Compute preference profile for patient p1
  const profile = InterventionLearningEngine.computePreferenceProfile('p1', 'Rajesh Sharma', DEMO_INTERVENTION_RESPONSES);

  // Test 4: Verify Hindi voice prompt is listed under effectiveInterventions
  const effectiveHindi = profile.effectiveInterventions.find((e) => e.type === 'local_language_reminder');
  assert(effectiveHindi !== undefined && effectiveHindi.successRate === 100, 'Multilingual Hindi Voice Prompt identified as highly effective (100%)');

  // Test 5: Verify Standard Reminder is listed under lowResponseInterventions
  const lowStd = profile.lowResponseInterventions.find((l) => l.type === 'standard_reminder');
  assert(lowStd !== undefined && lowStd.failureRate === 100, 'Standard Mobile Text Reminder identified as low response (100% failure rate)');

  // Test 6: Verify contextual preference for Evening window selected Hindi Voice Prompt
  const eveningContext = profile.contextualPreferences.find((c) => c.contextWindow.includes('Evening'));
  assert(eveningContext?.topIntervention === 'local_language_reminder', 'Evening context correctly selected Multilingual Hindi Voice Prompt');

  console.log(`--- Unit Tests Finished: ${passed} Passed, ${failed} Failed ---`);
  return { total: passed + failed, passed, failed };
}
