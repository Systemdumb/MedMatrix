import { MedicationEvent } from '../types/events';
import { Medication } from '../types';
import { BarrierInsight, BarrierCategory } from '../types/barriers';

export class BarrierIdentificationEngine {
  /**
   * Analyzes medication events and inventory data to infer probable adherence barriers
   */
  static inferBarriers(
    events: MedicationEvent[],
    medications: Medication[],
    patientId: string
  ): BarrierInsight[] {
    const insights: BarrierInsight[] = [];
    const TODAY = new Date().toISOString().split('T')[0];

    // 1. RULE: Medication Availability / Refill Barrier
    medications.forEach((med) => {
      if (med.remainingQuantity <= med.refillThreshold) {
        insights.push({
          id: `bar_avail_${med.id}`,
          patientId,
          medicationId: med.id,
          medicationName: `${med.name} (${med.dosage} ${med.dosageUnit})`,
          barrierType: 'medication_availability',
          confidence: 'HIGH',
          evidence: [
            `Current stock counter (${med.remainingQuantity} units) is below safety refill threshold (${med.refillThreshold} units)`,
            `Estimated remaining supply: approx ${med.remainingQuantity} days`,
          ],
          frequency: 1,
          firstObserved: TODAY,
          lastObserved: TODAY,
          patientConfirmed: false,
          source: 'SYSTEM_INFERRED',
        });
      }
    });

    // 2. RULE: Hardware Dispensing Failure (device_failure)
    const deviceFailures = events.filter(
      (e) => e.state === 'FAILED' || e.evidence.includes('device failure')
    );
    if (deviceFailures.length > 0) {
      const dates = deviceFailures.map((e) => e.scheduledTime.split('T')[0]).sort();
      insights.push({
        id: `bar_dev_fail`,
        patientId,
        barrierType: 'device_failure',
        confidence: 'HIGH',
        evidence: [
          `Optical sensor / servo motor recorded ${deviceFailures.length} dispensing failure event(s)`,
          `Hardware alert logged on ${dates[dates.length - 1]}`,
        ],
        frequency: deviceFailures.length,
        firstObserved: dates[0] || TODAY,
        lastObserved: dates[dates.length - 1] || TODAY,
        patientConfirmed: false,
        source: 'HARDWARE_SENSOR',
      });
    }

    // 3. RULE: Evening Forgetfulness (forgetfulness)
    const eveningMisses = events.filter((e) => {
      if (e.state !== 'MISSED' && e.state !== 'DELAYED') return false;
      let hour = 20;
      if (e.scheduledTime.includes('T')) {
        hour = parseInt(e.scheduledTime.split('T')[1].substring(0, 2), 10);
      } else if (e.scheduledTime.includes(' ')) {
        hour = parseInt(e.scheduledTime.split(' ')[1].substring(0, 2), 10);
      }
      return hour >= 17 && hour <= 22;
    });

    if (eveningMisses.length >= 2) {
      const dates = eveningMisses.map((e) => e.scheduledTime.split('T')[0]).sort();
      insights.push({
        id: `bar_evg_forget`,
        patientId,
        barrierType: 'forgetfulness',
        confidence: eveningMisses.length >= 3 ? 'HIGH' : 'MEDIUM',
        evidence: [
          `${eveningMisses.length} unconfirmed or delayed evening doses detected between 17:00 and 22:00`,
          `Pattern observed across ${dates.length} separate dinner windows`,
        ],
        frequency: eveningMisses.length,
        firstObserved: dates[0] || TODAY,
        lastObserved: dates[dates.length - 1] || TODAY,
        patientConfirmed: false,
        source: 'SYSTEM_INFERRED',
      });
    }

    // 4. RULE: Weekend Schedule Disruption (schedule_disruption)
    const weekendMisses = events.filter((e) => {
      if (e.state !== 'MISSED' && e.state !== 'DELAYED') return false;
      const d = new Date(e.scheduledTime);
      const day = d.getDay();
      return day === 0 || day === 6; // Sun or Sat
    });

    if (weekendMisses.length >= 2) {
      const dates = weekendMisses.map((e) => e.scheduledTime.split('T')[0]).sort();
      insights.push({
        id: `bar_wknd_disrupt`,
        patientId,
        barrierType: 'schedule_disruption',
        confidence: 'MEDIUM',
        evidence: [
          `${weekendMisses.length} missed or delayed doses occurred on weekends (Saturday / Sunday)`,
          `Weekday intake routine remains consistent`,
        ],
        frequency: weekendMisses.length,
        firstObserved: dates[0] || TODAY,
        lastObserved: dates[dates.length - 1] || TODAY,
        patientConfirmed: false,
        source: 'SYSTEM_INFERRED',
      });
    }

    // 5. RULE: Medication-Specific Barrier (medication_complexity)
    const medMissCounts = new Map<string, number>();
    events.forEach((e) => {
      if (e.state === 'MISSED') {
        medMissCounts.set(e.medicationId, (medMissCounts.get(e.medicationId) || 0) + 1);
      }
    });

    medMissCounts.forEach((count, medId) => {
      if (count >= 3) {
        const med = medications.find((m) => m.id === medId);
        const name = med ? `${med.name} (${med.dosage} ${med.dosageUnit})` : medId;
        // Check if other meds are taken
        const otherMedEvents = events.filter((e) => e.medicationId !== medId);
        const otherCompleted = otherMedEvents.filter(
          (e) => e.state === 'COMPLETED' || e.state === 'COLLECTED'
        ).length;

        if (otherMedEvents.length > 0 && otherCompleted / otherMedEvents.length >= 0.7) {
          insights.push({
            id: `bar_med_spec_${medId}`,
            patientId,
            medicationId: medId,
            medicationName: name,
            barrierType: 'medication_complexity',
            confidence: 'MEDIUM',
            evidence: [
              `Isolated missed events (${count}) specific to ${name}`,
              `Other prescribed medications maintain >70% completion rate`,
            ],
            frequency: count,
            firstObserved: TODAY,
            lastObserved: TODAY,
            patientConfirmed: false,
            source: 'SYSTEM_INFERRED',
          });
        }
      }
    });

    return insights;
  }

  /**
   * Helper to format raw barrier types into human readable Probable Barrier labels
   */
  static getBarrierTitle(category: BarrierCategory): string {
    switch (category) {
      case 'forgetfulness':
        return 'Probable Evening Forgetfulness';
      case 'schedule_disruption':
        return 'Probable Schedule & Routine Disruption';
      case 'medication_availability':
        return 'Probable Medication Refill / Availability Issue';
      case 'device_failure':
        return 'Hardware Dispensing Verification Failure';
      case 'medication_complexity':
        return 'Probable Medication-Specific Regimen Barrier';
      case 'side_effect_concern':
        return 'Possible Side-Effect Concern';
      case 'intentional_non_adherence':
        return 'Possible Intentional Non-Adherence';
      case 'affordability':
        return 'Possible Affordability Barrier';
      case 'lack_of_understanding':
        return 'Possible Regimen Understanding Issue';
      case 'travel_or_routine_disruption':
        return 'Probable Travel or Routine Disruption';
      case 'caregiver_support':
        return 'Possible Caregiver Support Need';
      default:
        return 'Unspecified Detected Adherence Pattern';
    }
  }
}
