import { MedicationEvent, EventState } from '../types/events';
import { Medication } from '../types';

export interface TimeWindowAdherence {
  windowName: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  timeRange: string;
  totalScheduled: number;
  completed: number;
  missed: number;
  adherencePercentage: number;
}

export interface DayOfWeekAdherence {
  dayName: string; // Mon, Tue, etc.
  dayIndex: number; // 0-6
  totalScheduled: number;
  completed: number;
  missed: number;
  adherencePercentage: number;
  isWeekend: boolean;
}

export interface MedicationAdherenceSummary {
  medicationId: string;
  medicationName: string;
  totalScheduled: number;
  completedCount: number;
  delayedCount: number;
  missedCount: number;
  deviceFailureCount: number;
  uncertainCount: number;
  adherencePercentage: number;
}

export interface AdherenceTrendPoint {
  date: string; // YYYY-MM-DD or Mon, Tue
  completed: number;
  missed: number;
  delayed: number;
  adherencePercentage: number;
}

export interface ComprehensiveAdherenceMetrics {
  totalScheduledDoses: number;
  completedEventsCount: number;
  delayedEventsCount: number;
  missedEventsCount: number;
  deviceFailureCount: number;
  uncertainEventsCount: number;
  evaluatedDosesCount: number; // Excludes device failures & uncertain events
  overallAdherencePercentage: number;
  weekdayAdherencePercentage: number;
  weekendAdherencePercentage: number;
  timingConsistencyMinutes: number; // Avg delay in minutes
  medicationSummaries: MedicationAdherenceSummary[];
  timeOfDayPattern: TimeWindowAdherence[];
  dayOfWeekPattern: DayOfWeekAdherence[];
  recentTrend: AdherenceTrendPoint[];
}

export class AdherenceAnalyticsEngine {
  /**
   * Analyzes a list of MedicationEvents and returns comprehensive adherence analytics
   */
  static analyzeAdherenceHistory(
    events: MedicationEvent[],
    medications: Medication[] = []
  ): ComprehensiveAdherenceMetrics {
    const totalScheduledDoses = events.length;

    let completedEventsCount = 0;
    let delayedEventsCount = 0;
    let missedEventsCount = 0;
    let deviceFailureCount = 0;
    let uncertainEventsCount = 0;

    events.forEach((evt) => {
      if (evt.state === 'FAILED' || evt.evidence.includes('device failure')) {
        deviceFailureCount++;
      } else if (evt.state === 'UNCERTAIN' || evt.evidence.includes('unknown')) {
        uncertainEventsCount++;
      } else if (evt.state === 'COMPLETED' || evt.state === 'COLLECTED') {
        completedEventsCount++;
      } else if (evt.state === 'DELAYED') {
        delayedEventsCount++;
      } else if (evt.state === 'MISSED') {
        missedEventsCount++;
      }
    });

    // CRITICAL REQUIREMENT: Device failures & Uncertain events do not penalize patient adherence score
    const evaluatedDosesCount = Math.max(
      1,
      totalScheduledDoses - deviceFailureCount - uncertainEventsCount
    );

    const overallAdherencePercentage = Math.round(
      (completedEventsCount / evaluatedDosesCount) * 100
    );

    // 1. Medication-Specific Adherence
    const medicationSummaries = this.calculateMedicationSummaries(events, medications);

    // 2. Time-of-Day Pattern
    const timeOfDayPattern = this.calculateTimeOfDayPattern(events);

    // 3. Day-of-Week Pattern (Weekday vs Weekend)
    const dayOfWeekPattern = this.calculateDayOfWeekPattern(events);

    const weekdays = dayOfWeekPattern.filter((d) => !d.isWeekend);
    const weekends = dayOfWeekPattern.filter((d) => d.isWeekend);

    const weekdayCompleted = weekdays.reduce((sum, d) => sum + d.completed, 0);
    const weekdayTotal = Math.max(1, weekdays.reduce((sum, d) => sum + d.totalScheduled, 0));
    const weekdayAdherencePercentage = Math.round((weekdayCompleted / weekdayTotal) * 100);

    const weekendCompleted = weekends.reduce((sum, d) => sum + d.completed, 0);
    const weekendTotal = Math.max(1, weekends.reduce((sum, d) => sum + d.totalScheduled, 0));
    const weekendAdherencePercentage = Math.round((weekendCompleted / weekendTotal) * 100);

    // 4. Recent Trend (7-Day Trend)
    const recentTrend = this.calculateRecentTrend(events);

    // 5. Timing Consistency (Average Delay in Minutes for completed/delayed events)
    const timingConsistencyMinutes = this.calculateTimingConsistency(events);

    return {
      totalScheduledDoses,
      completedEventsCount,
      delayedEventsCount,
      missedEventsCount,
      deviceFailureCount,
      uncertainEventsCount,
      evaluatedDosesCount,
      overallAdherencePercentage,
      weekdayAdherencePercentage,
      weekendAdherencePercentage,
      timingConsistencyMinutes,
      medicationSummaries,
      timeOfDayPattern,
      dayOfWeekPattern,
      recentTrend,
    };
  }

  private static calculateMedicationSummaries(
    events: MedicationEvent[],
    medications: Medication[]
  ): MedicationAdherenceSummary[] {
    const medMap = new Map<string, MedicationEvent[]>();

    events.forEach((evt) => {
      const list = medMap.get(evt.medicationId) || [];
      list.push(evt);
      medMap.set(evt.medicationId, list);
    });

    // Also include medications with 0 events
    medications.forEach((m) => {
      if (!medMap.has(m.id)) {
        medMap.set(m.id, []);
      }
    });

    const summaries: MedicationAdherenceSummary[] = [];

    medMap.forEach((medEvents, medId) => {
      const medObj = medications.find((m) => m.id === medId);
      const name = medObj ? `${medObj.name} (${medObj.dosage} ${medObj.dosageUnit})` : `Medication (${medId})`;

      let completed = 0;
      let delayed = 0;
      let missed = 0;
      let deviceFailures = 0;
      let uncertain = 0;

      medEvents.forEach((e) => {
        if (e.state === 'FAILED' || e.evidence.includes('device failure')) deviceFailures++;
        else if (e.state === 'UNCERTAIN') uncertain++;
        else if (e.state === 'COMPLETED' || e.state === 'COLLECTED') completed++;
        else if (e.state === 'DELAYED') delayed++;
        else if (e.state === 'MISSED') missed++;
      });

      const total = medEvents.length;
      const evaluated = Math.max(1, total - deviceFailures - uncertain);
      const pct = total === 0 ? 100 : Math.round((completed / evaluated) * 100);

      summaries.push({
        medicationId: medId,
        medicationName: name,
        totalScheduled: total,
        completedCount: completed,
        delayedCount: delayed,
        missedCount: missed,
        deviceFailureCount: deviceFailures,
        uncertainCount: uncertain,
        adherencePercentage: pct,
      });
    });

    return summaries;
  }

  private static calculateTimeOfDayPattern(events: MedicationEvent[]): TimeWindowAdherence[] {
    const windows: Record<'Morning' | 'Afternoon' | 'Evening' | 'Night', TimeWindowAdherence> = {
      Morning: { windowName: 'Morning', timeRange: '06:00 - 12:00', totalScheduled: 0, completed: 0, missed: 0, adherencePercentage: 0 },
      Afternoon: { windowName: 'Afternoon', timeRange: '12:00 - 17:00', totalScheduled: 0, completed: 0, missed: 0, adherencePercentage: 0 },
      Evening: { windowName: 'Evening', timeRange: '17:00 - 21:00', totalScheduled: 0, completed: 0, missed: 0, adherencePercentage: 0 },
      Night: { windowName: 'Night', timeRange: '21:00 - 06:00', totalScheduled: 0, completed: 0, missed: 0, adherencePercentage: 0 },
    };

    events.forEach((evt) => {
      // Extract hour from scheduledTime (HH:mm or ISO)
      let timeStr = evt.scheduledTime;
      if (timeStr.includes('T')) {
        timeStr = timeStr.split('T')[1].substring(0, 5);
      } else if (timeStr.includes(' ')) {
        timeStr = timeStr.split(' ')[1].substring(0, 5);
      }

      const hour = parseInt(timeStr.substring(0, 2), 10) || 8;

      let win: 'Morning' | 'Afternoon' | 'Evening' | 'Night' = 'Morning';
      if (hour >= 6 && hour < 12) win = 'Morning';
      else if (hour >= 12 && hour < 17) win = 'Afternoon';
      else if (hour >= 17 && hour < 21) win = 'Evening';
      else win = 'Night';

      const target = windows[win];
      // Exclude device failures and uncertain from denominator
      if (evt.state !== 'FAILED' && evt.state !== 'UNCERTAIN') {
        target.totalScheduled++;
        if (evt.state === 'COMPLETED' || evt.state === 'COLLECTED') {
          target.completed++;
        } else if (evt.state === 'MISSED') {
          target.missed++;
        }
      }
    });

    Object.values(windows).forEach((w) => {
      w.adherencePercentage = w.totalScheduled === 0 ? 100 : Math.round((w.completed / w.totalScheduled) * 100);
    });

    return Object.values(windows);
  }

  private static calculateDayOfWeekPattern(events: MedicationEvent[]): DayOfWeekAdherence[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result: DayOfWeekAdherence[] = days.map((dayName, idx) => ({
      dayName,
      dayIndex: idx,
      totalScheduled: 0,
      completed: 0,
      missed: 0,
      adherencePercentage: 0,
      isWeekend: idx === 0 || idx === 6,
    }));

    events.forEach((evt) => {
      let dateObj: Date;
      if (evt.scheduledTime.includes('-')) {
        dateObj = new Date(evt.scheduledTime);
      } else {
        dateObj = new Date();
      }

      const dayIdx = isNaN(dateObj.getDay()) ? 3 : dateObj.getDay();
      const target = result[dayIdx];

      if (evt.state !== 'FAILED' && evt.state !== 'UNCERTAIN') {
        target.totalScheduled++;
        if (evt.state === 'COMPLETED' || evt.state === 'COLLECTED') {
          target.completed++;
        } else if (evt.state === 'MISSED') {
          target.missed++;
        }
      }
    });

    result.forEach((d) => {
      d.adherencePercentage = d.totalScheduled === 0 ? 100 : Math.round((d.completed / d.totalScheduled) * 100);
    });

    return result;
  }

  private static calculateRecentTrend(events: MedicationEvent[]): AdherenceTrendPoint[] {
    const dateMap = new Map<string, { completed: number; missed: number; delayed: number; total: number }>();

    events.forEach((evt) => {
      let dateStr = evt.scheduledTime.split('T')[0].split(' ')[0];
      if (!dateStr.includes('-')) {
        dateStr = new Date().toISOString().split('T')[0];
      }

      const current = dateMap.get(dateStr) || { completed: 0, missed: 0, delayed: 0, total: 0 };

      if (evt.state !== 'FAILED' && evt.state !== 'UNCERTAIN') {
        current.total++;
        if (evt.state === 'COMPLETED' || evt.state === 'COLLECTED') current.completed++;
        else if (evt.state === 'DELAYED') current.delayed++;
        else if (evt.state === 'MISSED') current.missed++;
      }

      dateMap.set(dateStr, current);
    });

    const trendPoints: AdherenceTrendPoint[] = [];
    Array.from(dateMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7) // Last 7 days
      .forEach(([date, data]) => {
        const pct = data.total === 0 ? 100 : Math.round((data.completed / data.total) * 100);
        trendPoints.push({
          date: date.substring(5), // MM-DD
          completed: data.completed,
          missed: data.missed,
          delayed: data.delayed,
          adherencePercentage: pct,
        });
      });

    return trendPoints;
  }

  private static calculateTimingConsistency(events: MedicationEvent[]): number {
    let totalDelayMinutes = 0;
    let evaluatedCount = 0;

    events.forEach((evt) => {
      if ((evt.state === 'COMPLETED' || evt.state === 'COLLECTED' || evt.state === 'DELAYED') && evt.actualEventTime) {
        try {
          const schedDate = new Date(evt.scheduledTime).getTime();
          const actualDate = new Date(evt.actualEventTime).getTime();
          if (!isNaN(schedDate) && !isNaN(actualDate)) {
            const diffMin = Math.max(0, Math.round((actualDate - schedDate) / (1000 * 60)));
            totalDelayMinutes += diffMin;
            evaluatedCount++;
          }
        } catch (e) {
          // ignore date parse errors
        }
      }
    });

    return evaluatedCount === 0 ? 5 : Math.round(totalDelayMinutes / evaluatedCount);
  }
}
