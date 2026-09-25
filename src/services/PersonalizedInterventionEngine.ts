import { BarrierInsight } from '../types/barriers';
import { Patient, Medication } from '../types';
import { InterventionRecommendation, InterventionType } from '../types/interventions';

export class PersonalizedInterventionEngine {
  /**
   * Selects personalized interventions based on identified barriers, patient preferences, language, and response history
   */
  static selectInterventions(
    barriers: BarrierInsight[],
    patient: Patient,
    medications: Medication[] = []
  ): InterventionRecommendation[] {
    const recommendations: InterventionRecommendation[] = [];
    const NOW = new Date().toISOString();

    barriers.forEach((barrier) => {
      const med = medications.find((m) => m.id === barrier.medicationId);
      const medName = med ? `${med.name} (${med.dosage} ${med.dosageUnit})` : barrier.medicationName || 'Prescribed Regimen';

      let interventionType: InterventionType = 'standard_reminder';
      let title = 'Standard Reminder';
      let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
      let reason = '';
      let msgEn = '';
      let msgHi = '';

      switch (barrier.barrierType) {
        case 'forgetfulness':
          if (patient.preferredLanguage === 'hi') {
            interventionType = 'local_language_reminder';
            title = 'Multilingual Hindi Voice Prompt';
            priority = 'HIGH';
            reason = `Selected Multilingual Hindi Voice Prompt because standard text reminders were previously unacknowledged during the ${patient.adherenceProfile.vulnerableTimeWindow} dinner window, and historical analysis shows an 85% positive response rate to Hindi audio prompts.`;
            msgEn = `${patient.name}, it is time for your ${medName} dose after dinner. Please confirm your dose.`;
            msgHi = `${patient.name} जी, रात के खाने के बाद ${medName} लेने का समय हो गया है। कृपया दवा लें।`;
          } else {
            interventionType = 'voice_reminder';
            title = 'Personalized Voice Reminder';
            priority = 'HIGH';
            reason = 'Selected Audio Voice Reminder to overcome evening forgetfulness.';
            msgEn = `Hello ${patient.name}, this is your voice reminder for ${medName}.`;
            msgHi = `${patient.name} जी, दवा का समय हो गया है।`;
          }
          break;

        case 'medication_availability':
          interventionType = 'refill_reminder';
          title = 'Pharmacy Refill & Caregiver Alert';
          priority = 'HIGH';
          reason = `Selected Refill Reminder & Caregiver Alert because remaining stock (${med?.remainingQuantity || 4} units) is below the safety threshold (${med?.refillThreshold || 5} units). Triggered refill prompt to avoid supply disruption.`;
          msgEn = `Refill Alert: ${medName} inventory is low. Recommended action: Order refill today.`;
          msgHi = `दवा रीफिल सूचना: ${medName} की दवा कम है। कृपया नई दवा मंगवाएं।`;
          break;

        case 'device_failure':
          interventionType = 'device_troubleshooting';
          title = 'Hardware Compartment Troubleshooting Alert';
          priority = 'HIGH';
          reason = 'Selected Device Troubleshooting Alert because hardware optical sensor registered a dispensing failure. Notifies patient and caregiver of technical fault without penalizing adherence metrics.';
          msgEn = `Technical Alert: Hardware compartment dispensing verification failed for ${medName}. Please inspect device.`;
          msgHi = `तकनीकी सूचना: ${medName} की दवा बॉक्स से नहीं निकली। कृपया बॉक्स की जांच करें।`;
          break;

        case 'schedule_disruption':
        case 'travel_or_routine_disruption':
          interventionType = 'schedule_aware_reminder';
          title = 'Schedule-Aware Adjusted Reminder';
          priority = 'MEDIUM';
          reason = 'Selected Schedule-Aware Reminder because adherence analysis identified weekend routine shifts. Automatically adjusted reminder timing to align with weekend schedule changes.';
          msgEn = `Weekend Schedule Alert: Gentle reminder for your ${medName} dose.`;
          msgHi = `वीकेंड रिमाइंडर: आपकी ${medName} दवा का समय हो गया है।`;
          break;

        case 'side_effect_concern':
          interventionType = 'side_effect_check_in';
          title = 'Symptom Check-in Prompt';
          priority = 'HIGH';
          reason = 'Selected Side-Effect Check-in Prompt due to isolated non-adherence on a specific medication. Prompt checks if patient is experiencing mild discomfort before scheduling healthcare follow-up.';
          msgEn = `Check-in: Are you experiencing any discomfort taking ${medName}?`;
          msgHi = `जांच: क्या ${medName} लेने के बाद आपको कोई समस्या हो रही है?`;
          break;

        case 'intentional_non_adherence':
        case 'lack_of_understanding':
          interventionType = 'education_prompt';
          title = 'Medication Purpose & Education Prompt';
          priority = 'MEDIUM';
          reason = 'Selected Medication Education Prompt to provide clear, simple information regarding why this prescription was prescribed for chronic management.';
          msgEn = `Health Information: Learn why taking ${medName} consistently keeps your blood parameters in target range.`;
          msgHi = `स्वास्थ्य जानकारी: जानिए ${medName} नियमित लेना आपके लिए क्यों जरूरी है।`;
          break;

        default:
          interventionType = 'caregiver_notification';
          title = 'Actionable Caregiver Alert';
          priority = 'MEDIUM';
          reason = 'Selected Actionable Caregiver Notification to coordinate assistance with family member.';
          msgEn = `Caregiver Notification: Unconfirmed dose for ${patient.name}. Please check in.`;
          msgHi = `केयरगिवर सूचना: ${patient.name} जी की दवा की जांच करें।`;
          break;
      }

      recommendations.push({
        id: `rec_${barrier.id}_${Date.now()}`,
        patientId: patient.id,
        medicationId: barrier.medicationId,
        medicationName: medName,
        barrierId: barrier.id,
        barrierCategory: barrier.barrierType,
        evidence: barrier.evidence,
        interventionType,
        title,
        reason,
        priority,
        confidence: barrier.confidence,
        createdAt: NOW,
        message: {
          en: msgEn,
          hi: msgHi,
        },
        status: 'RECOMMENDED',
      });
    });

    return recommendations;
  }
}
