import { runEventStateMachineTests } from './services/__tests__/EventStateMachine.test';
import { runAdherenceAnalyticsEngineTests } from './services/__tests__/AdherenceAnalyticsEngine.test';
import { runBarrierIdentificationEngineTests } from './services/__tests__/BarrierIdentificationEngine.test';
import { runPersonalizedInterventionEngineTests } from './services/__tests__/PersonalizedInterventionEngine.test';
import { runInterventionLearningEngineTests } from './services/__tests__/InterventionLearningEngine.test';
import { runCaregiverNotificationTests } from './services/__tests__/CaregiverNotification.test';
import { runHardwareEventAdapterTests } from './services/__tests__/HardwareEventAdapter.test';
import { runScenarioPipelineRunnerTests } from './services/__tests__/ScenarioPipelineRunner.test';

console.log('==============================================');
console.log('  MedMatrix Engine Unit Test Runner');
console.log('==============================================');

const eventResults = runEventStateMachineTests();
const analyticsResults = runAdherenceAnalyticsEngineTests();
const barrierResults = runBarrierIdentificationEngineTests();
const interventionResults = runPersonalizedInterventionEngineTests();
const learningResults = runInterventionLearningEngineTests();
const caregiverResults = runCaregiverNotificationTests();
const hardwareResults = runHardwareEventAdapterTests();
const scenarioResults = runScenarioPipelineRunnerTests();

const totalPassed =
  eventResults.passed +
  analyticsResults.passed +
  barrierResults.passed +
  interventionResults.passed +
  learningResults.passed +
  caregiverResults.passed +
  hardwareResults.passed +
  scenarioResults.passed;

const totalFailed =
  eventResults.failed +
  analyticsResults.failed +
  barrierResults.failed +
  interventionResults.failed +
  learningResults.failed +
  caregiverResults.failed +
  hardwareResults.failed +
  scenarioResults.failed;

console.log('\n==============================================');
if (totalFailed > 0) {
  console.error(`❌ Unit Tests Failed! Passed: ${totalPassed}, Failed: ${totalFailed}`);
  process.exit(1);
} else {
  console.log(`✅ All ${totalPassed} MedMatrix Engine Unit Tests Passed Successfully!`);
  process.exit(0);
}



