import { SimulatedHardwareAdapter, RawHardwareSignal } from './hardware/HardwareEventAdapter';
import { EventStateMachine } from './EventStateMachine';
import { MedicationEvent } from '../types/events';
import { AdherenceAnalyticsEngine } from './AdherenceAnalyticsEngine';
import { BarrierIdentificationEngine } from './BarrierIdentificationEngine';
import { PersonalizedInterventionEngine } from './PersonalizedInterventionEngine';
import { BarrierInsight } from '../types/barriers';
import { InterventionRecommendation } from '../types/interventions';
import { Patient, Medication } from '../types';

export interface ScenarioPipelineExecutionResult {
  scenarioId: number;
  title: string;
  subtitle: string;
  stepDetect: {
    event: MedicationEvent;
    hardwareSignal?: RawHardwareSignal;
    description: string;
  };
  stepUnderstand: {
    adherenceScore: number;
    barriers: BarrierInsight[];
    description: string;
  };
  stepIntervene: {
    recommendations: InterventionRecommendation[];
    description: string;
  };
  stepLearn: {
    learningOutcome: string;
    description: string;
  };
}

export class ScenarioPipelineRunner {
  private static adapter = new SimulatedHardwareAdapter('ESP32_DEMO_RUNNER');

  /**
   * Executes a deterministic hackathon demo scenario through all 5 MedMatrix engines
   */
  static runScenario(
    scenarioId: number,
    patient: Patient,
    medications: Medication[]
  ): ScenarioPipelineExecutionResult {
    const med = medications[0] || {
      id: 'm1',
      name: 'Metformin 500mg',
      dosage: '500',
      dosageUnit: 'mg',
      remainingQuantity: 4,
      refillThreshold: 5,
    };

    let title = '';
    let subtitle = '';

    // Step 1: Detect
    let rawSignal: RawHardwareSignal | undefined;
    let event: MedicationEvent;
    let detectDesc = '';

    // Step 2: Understand
    let evaluatedEvents: MedicationEvent[] = [];
    let understandDesc = '';

    // Step 3: Intervene
    let interveneDesc = '';

    // Step 4: Learn
    let learnOutcome = '';
    let learnDesc = '';

    switch (scenarioId) {
      case 1: // SUCCESSFUL DOSE
        title = 'Normal Adherence & Hardware Dispensing';
        subtitle = 'SUCCESSFUL DOSE';
        rawSignal = this.adapter.simulateSignal('COLLECTION_SUCCESS', med.id);
        event = EventStateMachine.createCompletedDoseEvent(patient.id, med.id, '08:00');
        detectDesc = 'Hardware capacitive sensor registered dose drawer opening and cup removal at 08:02.';

        evaluatedEvents = [event];
        understandDesc = 'Adherence score is 100%. No behavioral or hardware barriers detected.';
        interveneDesc = 'Standard Intake Confirmation logged.';
        learnOutcome = 'Intake Pattern On Track';
        learnDesc = 'Morning intake consistency maintained in target window.';
        break;

      case 2: // EVENING FORGETFULNESS
        title = 'Evening Forgetfulness + Multilingual Voice Prompt';
        subtitle = 'FORGETFULNESS';
        event = EventStateMachine.createMissedDoseEvent(patient.id, med.id, '20:00');
        detectDesc = '3 consecutive evening doses unconfirmed during the 20:00 dinner window.';

        evaluatedEvents = [
          event,
          { ...event, id: 'ev_f2', actualEventTime: '2026-09-14T20:30:00+05:30' },
          { ...event, id: 'ev_f3', actualEventTime: '2026-09-15T20:30:00+05:30' },
        ];
        understandDesc = 'Inferred Probable Barrier: "Evening Forgetfulness" (HIGH confidence) during 20:00 dinner window.';
        interveneDesc = 'Selected Multilingual Hindi Voice Prompt based on 85% historical audio prompt responsiveness.';
        learnOutcome = 'Local Language Prompt Effective';
        learnDesc = 'Rajesh Sharma acknowledged Hindi prompt within 45s of audio playback.';
        break;

      case 3: // SUPPLY DEPLETION
        title = 'Supply Depletion / Availability Barrier';
        subtitle = 'REFILL ISSUE';
        event = {
          id: `ev_stock_${Date.now()}`,
          patientId: patient.id,
          medicationId: med.id,
          scheduledTime: '08:00',
          actualEventTime: new Date().toISOString(),
          state: 'READY',
          source: 'manual',
          evidence: ['schedule'],
          confidence: 'HIGH',
          notes: 'Medication inventory stock (4 units) below safety threshold (5 units).',
        };
        detectDesc = 'Inventory counter registered stock drop to 4 units (threshold: 5 units).';

        evaluatedEvents = [event];
        understandDesc = 'Inferred Probable Barrier: "Low Inventory Stock / Refill Needed" (HIGH confidence).';
        interveneDesc = 'Selected Pharmacy Refill Alert & Actionable Caregiver Notification.';
        learnOutcome = 'Caregiver Refill Actioned';
        learnDesc = 'Refill order dispatched to local pharmacy to prevent supply disruption.';
        break;

      case 4: // DEVICE DISPENSING FAILURE
        title = 'Device Dispensing Failure Safeguard';
        subtitle = 'DEVICE FAILURE';
        rawSignal = this.adapter.simulateSignal('DISPENSE_FAILURE', med.id);
        event = EventStateMachine.createFailedDispensingEvent(patient.id, med.id, '20:00');
        detectDesc = 'ESP32 motor rotated but optical sensor registered zero pill drop.';

        evaluatedEvents = [event];
        understandDesc = 'Safeguard Activated: Excluded hardware fault from patient adherence score. Inferred "Hardware Dispensing Failure".';
        interveneDesc = 'Selected Technical Hardware Device Troubleshooting Alert for caregiver.';
        learnOutcome = 'Non-Penalized Fault';
        learnDesc = 'Caregiver notified to inspect dispenser compartment without penalizing patient metrics.';
        break;

      case 5: // INTERVENTION ADAPTATION
        title = 'Intervention Failure & Adaptive Learning';
        subtitle = 'INTERVENTION FAILURE';
        event = EventStateMachine.createMissedDoseEvent(patient.id, med.id, '20:00');
        detectDesc = 'Standard mobile text reminder delivered 3 times with zero patient response.';

        evaluatedEvents = [event];
        understandDesc = 'Inferred Low-Response Strategy: Standard text reminders failure rate reached 100%.';
        interveneDesc = 'Adaptive Learning Engine de-prioritized text reminders and elevated Hindi Voice Prompts.';
        learnOutcome = 'Adaptive Strategy Switched';
        learnDesc = 'Voice prompt strategy assigned +20 weight for future evening windows.';
        break;

      case 6: // OFFLINE QUEUEING & RECONNECT SYNC
      default:
        title = 'Offline Queueing & Reconnect Sync';
        subtitle = 'OFFLINE MODE';
        this.adapter.simulateSignal('DEVICE_OFFLINE', med.id);
        this.adapter.simulateSignal('COLLECTION_SUCCESS', med.id);
        rawSignal = this.adapter.simulateSignal('DEVICE_RECONNECTED', med.id);

        event = EventStateMachine.createCompletedDoseEvent(patient.id, med.id, '20:00');
        detectDesc = 'ESP32 dropped Wi-Fi connection, buffered 1 intake event, and synced batch upon reconnection.';

        evaluatedEvents = [event];
        understandDesc = 'Reconnection Engine verified offline telemetry timestamp integrity.';
        interveneDesc = 'Suppressed duplicate reminders since intake occurred offline.';
        learnOutcome = 'Offline Buffer Synced';
        learnDesc = 'Event state updated to COMPLETED without data loss.';
        break;
    }

    // Pass data through actual engines
    const adherence = AdherenceAnalyticsEngine.analyzeAdherenceHistory(evaluatedEvents, medications);
    const barriers = BarrierIdentificationEngine.inferBarriers(evaluatedEvents, medications, patient.id);
    const recommendations = PersonalizedInterventionEngine.selectInterventions(barriers, patient, medications);

    return {
      scenarioId,
      title,
      subtitle,
      stepDetect: {
        event,
        hardwareSignal: rawSignal,
        description: detectDesc,
      },
      stepUnderstand: {
        adherenceScore: adherence.overallAdherencePercentage,
        barriers,
        description: understandDesc,
      },
      stepIntervene: {
        recommendations,
        description: interveneDesc,
      },
      stepLearn: {
        learningOutcome: learnOutcome,
        description: learnDesc,
      },
    };
  }
}
