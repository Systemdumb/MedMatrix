import { MedicationEvent, EventState, EventSource, EventEvidence, EventConfidence } from '../types/events';

/**
 * Valid State Transition Matrix
 */
const VALID_TRANSITIONS: Record<EventState, EventState[]> = {
  SCHEDULED: ['READY', 'DISPENSING', 'DELAYED', 'MISSED', 'UNCERTAIN'],
  READY: ['DISPENSING', 'COLLECTED', 'FAILED', 'UNCERTAIN'],
  DISPENSING: ['DISPENSED', 'FAILED', 'UNCERTAIN'],
  DISPENSED: ['COLLECTED', 'COMPLETED', 'UNCERTAIN'],
  COLLECTED: ['COMPLETED'],
  COMPLETED: [], // Terminal successful state
  DELAYED: ['READY', 'DISPENSING', 'COLLECTED', 'MISSED', 'UNCERTAIN'],
  MISSED: ['UNCERTAIN', 'COLLECTED'], // Late collection possible
  FAILED: ['UNCERTAIN', 'READY'], // Device retry possible
  UNCERTAIN: ['COLLECTED', 'FAILED', 'MISSED', 'COMPLETED', 'DISPENSED'],
};

export class EventStateMachine {
  /**
   * Checks if a transition from currentState to targetState is valid
   */
  static canTransition(currentState: EventState, targetState: EventState): boolean {
    if (currentState === targetState) return true;
    const allowed = VALID_TRANSITIONS[currentState] || [];
    return allowed.includes(targetState);
  }

  /**
   * Transitions a medication event to a target state with evidence and confidence rating
   */
  static transitionEvent(
    event: MedicationEvent,
    targetState: EventState,
    payload: {
      source: EventSource;
      evidence: EventEvidence[];
      notes?: string;
      confidence?: EventConfidence;
    }
  ): MedicationEvent {
    if (!this.canTransition(event.state, targetState)) {
      throw new Error(
        `Invalid Event State Transition: Cannot transition from ${event.state} to ${targetState}`
      );
    }

    const now = new Date().toISOString();
    const combinedEvidence = Array.from(new Set([...event.evidence, ...payload.evidence]));

    // Auto-calculate confidence based on cumulative combined evidence
    let confidence: EventConfidence = payload.confidence || 'MEDIUM';
    if (combinedEvidence.includes('sensor') && combinedEvidence.includes('patient confirmation')) {
      confidence = 'HIGH';
    } else if (combinedEvidence.includes('device failure') || combinedEvidence.includes('unknown')) {
      confidence = 'LOW';
    } else if (payload.confidence) {
      confidence = payload.confidence;
    }

    return {
      ...event,
      state: targetState,
      source: payload.source,
      evidence: combinedEvidence,
      confidence,
      actualEventTime: targetState !== 'SCHEDULED' ? now : event.actualEventTime,
      notes: payload.notes || event.notes,
    };
  }

  // --- DETERMINISTIC DEMO SIMULATION CREATORS ---

  /**
   * 1. Simulates Completed Dose (Dose Dispensed + Dose Collected)
   */
  static createCompletedDoseEvent(patientId: string, medicationId: string, scheduledTime: string): MedicationEvent {
    const base: MedicationEvent = {
      id: `evt_sim_${Date.now()}_1`,
      patientId,
      medicationId,
      scheduledTime,
      state: 'SCHEDULED',
      source: 'simulated',
      evidence: ['schedule'],
      confidence: 'HIGH',
      notes: 'Initial schedule created',
    };

    const step1 = this.transitionEvent(base, 'DISPENSING', {
      source: 'hardware',
      evidence: ['dispensing', 'sensor'],
      notes: 'Dose dispensed by hardware compartment',
    });

    const step2 = this.transitionEvent(step1, 'DISPENSED', {
      source: 'hardware',
      evidence: ['sensor'],
      notes: 'Dose dispensed verified by optical sensor',
    });

    const step3 = this.transitionEvent(step2, 'COLLECTED', {
      source: 'manual',
      evidence: ['patient confirmation', 'collection'],
      notes: 'Dose collected by patient',
    });

    return this.transitionEvent(step3, 'COMPLETED', {
      source: 'simulated',
      evidence: ['patient confirmation'],
      notes: 'Medication event completed successfully',
    });
  }

  /**
   * 2. Simulates Delayed Dose
   */
  static createDelayedDoseEvent(patientId: string, medicationId: string, scheduledTime: string): MedicationEvent {
    const base: MedicationEvent = {
      id: `evt_sim_${Date.now()}_2`,
      patientId,
      medicationId,
      scheduledTime,
      state: 'SCHEDULED',
      source: 'simulated',
      evidence: ['schedule'],
      confidence: 'MEDIUM',
    };

    return this.transitionEvent(base, 'DELAYED', {
      source: 'simulated',
      evidence: ['schedule'],
      notes: 'Dose uncollected after 30 minutes. Status set to DELAYED.',
    });
  }

  /**
   * 3. Simulates Missed Dose
   */
  static createMissedDoseEvent(patientId: string, medicationId: string, scheduledTime: string): MedicationEvent {
    const base: MedicationEvent = {
      id: `evt_sim_${Date.now()}_3`,
      patientId,
      medicationId,
      scheduledTime,
      state: 'SCHEDULED',
      source: 'simulated',
      evidence: ['schedule'],
      confidence: 'MEDIUM',
    };

    return this.transitionEvent(base, 'MISSED', {
      source: 'simulated',
      evidence: ['schedule'],
      notes: 'Dose uncollected after 60 minutes. Adherence evidence logged as MISSED.',
    });
  }

  /**
   * 4. Simulates Failed Dispensing (Device Malfunction)
   */
  static createFailedDispensingEvent(patientId: string, medicationId: string, scheduledTime: string): MedicationEvent {
    const base: MedicationEvent = {
      id: `evt_sim_${Date.now()}_4`,
      patientId,
      medicationId,
      scheduledTime,
      state: 'SCHEDULED',
      source: 'hardware',
      evidence: ['schedule'],
      confidence: 'LOW',
    };

    const step1 = this.transitionEvent(base, 'DISPENSING', {
      source: 'hardware',
      evidence: ['dispensing'],
      notes: 'Dispense signal sent to servo motor',
    });

    return this.transitionEvent(step1, 'FAILED', {
      source: 'hardware',
      evidence: ['device failure', 'sensor'],
      notes: 'Optical sensor registered no pill release. Hardware dispensing failure flagged.',
    });
  }

  /**
   * 5. Simulates Uncertain Event
   */
  static createUncertainEvent(patientId: string, medicationId: string, scheduledTime: string): MedicationEvent {
    const base: MedicationEvent = {
      id: `evt_sim_${Date.now()}_5`,
      patientId,
      medicationId,
      scheduledTime,
      state: 'SCHEDULED',
      source: 'simulated',
      evidence: ['schedule'],
      confidence: 'LOW',
    };

    return this.transitionEvent(base, 'UNCERTAIN', {
      source: 'simulated',
      evidence: ['unknown'],
      notes: 'Inconclusive sensor signal detected. Flagged as Uncertain Event for follow-up.',
    });
  }
}
