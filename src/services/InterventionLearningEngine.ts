import {
  InterventionResponse,
  InterventionPreferenceProfile,
  ResponseType,
  OutcomeType,
  ContextualPreference,
} from '../types/learning';
import { InterventionType } from '../types/interventions';

export class InterventionLearningEngine {
  /**
   * Deterministically evaluates the outcome and effectiveness score for an intervention response event
   */
  static evaluateOutcome(
    response: ResponseType,
    subsequentEventState: string
  ): { outcome: OutcomeType; effectiveness: number } {
    if (response === 'responded' && subsequentEventState === 'COMPLETED') {
      return { outcome: 'successful', effectiveness: 100 };
    }
    if (response === 'delayed_response' && (subsequentEventState === 'COMPLETED' || subsequentEventState === 'COLLECTED')) {
      return { outcome: 'partially_successful', effectiveness: 75 };
    }
    if (response === 'responded' && subsequentEventState === 'DELAYED') {
      return { outcome: 'partially_successful', effectiveness: 60 };
    }
    if (response === 'no_response' || subsequentEventState === 'MISSED') {
      return { outcome: 'unsuccessful', effectiveness: 0 };
    }
    return { outcome: 'unknown', effectiveness: 50 };
  }

  /**
   * Generates a patient's Intervention Preference Profile deterministically from history
   */
  static computePreferenceProfile(
    patientId: string,
    patientName: string,
    history: InterventionResponse[]
  ): InterventionPreferenceProfile {
    const patientHistory = history.filter((h) => h.patientId === patientId);

    // Group by intervention type
    const typeStats: Record<
      string,
      { total: number; successful: number; unsuccessful: number; totalScore: number }
    > = {};

    // Group by context (time window / medication)
    const contextStats: Record<
      string,
      Record<string, { total: number; successful: number; totalScore: number }>
    > = {};

    patientHistory.forEach((item) => {
      // Type stats
      if (!typeStats[item.interventionType]) {
        typeStats[item.interventionType] = { total: 0, successful: 0, unsuccessful: 0, totalScore: 0 };
      }
      const ts = typeStats[item.interventionType];
      ts.total++;
      ts.totalScore += item.effectiveness;
      if (item.outcome === 'successful' || item.outcome === 'partially_successful') {
        ts.successful++;
      } else if (item.outcome === 'unsuccessful') {
        ts.unsuccessful++;
      }

      // Context stats
      const contextKey = item.contextWindow || 'General';
      if (!contextStats[contextKey]) {
        contextStats[contextKey] = {};
      }
      if (!contextStats[contextKey][item.interventionType]) {
        contextStats[contextKey][item.interventionType] = { total: 0, successful: 0, totalScore: 0 };
      }
      const cs = contextStats[contextKey][item.interventionType];
      cs.total++;
      cs.totalScore += item.effectiveness;
      if (item.outcome === 'successful' || item.outcome === 'partially_successful') {
        cs.successful++;
      }
    });

    const effectiveInterventions: InterventionPreferenceProfile['effectiveInterventions'] = [];
    const lowResponseInterventions: InterventionPreferenceProfile['lowResponseInterventions'] = [];

    Object.entries(typeStats).forEach(([type, stat]) => {
      const avgScore = Math.round(stat.totalScore / stat.total);
      const title = this.getInterventionTitle(type as InterventionType);

      if (avgScore >= 70 && stat.total >= 2) {
        effectiveInterventions.push({
          type: type as InterventionType,
          title,
          successRate: avgScore,
          totalDelivered: stat.total,
          explanation: `Adaptive learning detected ${avgScore}% high response rate across ${stat.total} delivered prompts. Recommended as primary intervention strategy.`,
        });
      } else if (avgScore < 50 && stat.total >= 2) {
        lowResponseInterventions.push({
          type: type as InterventionType,
          title,
          failureRate: 100 - avgScore,
          totalDelivered: stat.total,
          explanation: `Adaptive learning detected repeated unresponsiveness (${100 - avgScore}% failure rate across ${stat.total} delivered prompts). De-prioritized in decision engine.`,
        });
      }
    });

    // Contextual preferences
    const contextualPreferences: ContextualPreference[] = [];

    Object.entries(contextStats).forEach(([contextWindow, intMap]) => {
      let bestType: InterventionType | null = null;
      let bestScore = -1;
      let bestTotal = 0;

      Object.entries(intMap).forEach(([t, s]) => {
        const score = Math.round(s.totalScore / s.total);
        if (score > bestScore) {
          bestScore = score;
          bestType = t as InterventionType;
          bestTotal = s.total;
        }
      });

      if (bestType) {
        const title = this.getInterventionTitle(bestType);
        contextualPreferences.push({
          contextWindow,
          topIntervention: bestType,
          topInterventionTitle: title,
          effectivenessScore: bestScore,
          sampleSize: bestTotal,
          reasoning: `In the ${contextWindow} window, ${title} achieved the highest behavioral completion rate (${bestScore}%) over ${bestTotal} trials.`,
        });
      }
    });

    return {
      patientId,
      patientName,
      effectiveInterventions,
      lowResponseInterventions,
      contextualPreferences,
      lastUpdated: new Date().toISOString(),
    };
  }

  static getInterventionTitle(type: InterventionType): string {
    switch (type) {
      case 'local_language_reminder':
        return 'Multilingual Hindi Voice Prompt';
      case 'voice_reminder':
        return 'Personalized Audio Voice Reminder';
      case 'standard_reminder':
        return 'Standard Mobile Text Reminder';
      case 'schedule_aware_reminder':
        return 'Schedule-Aware Adjusted Reminder';
      case 'refill_reminder':
        return 'Pharmacy Refill & Caregiver Alert';
      case 'device_troubleshooting':
        return 'Hardware Device Troubleshooting Alert';
      case 'side_effect_check_in':
        return 'Symptom Check-in Prompt';
      case 'education_prompt':
        return 'Medication Purpose & Education Prompt';
      case 'caregiver_notification':
        return 'Actionable Caregiver Alert';
      case 'caregiver_escalation':
        return 'Caregiver Phone Escalation';
      case 'follow_up_prompt':
        return 'Follow-up Status Check';
      case 'no_immediate_intervention':
        return 'No Immediate Intervention';
      default:
        return 'Standard Reminder';
    }
  }
}
