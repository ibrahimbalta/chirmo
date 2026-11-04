import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsService } from '../src/renderer/src/services/analyticsService';

describe('AnalyticsService (Real Learning Progress & Weekly Report)', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    (global as any).localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
      length: 0,
      key: () => null
    };
  });

  it('provides default analytics when empty', () => {
    const data = AnalyticsService.getAnalytics();
    expect(data).toHaveProperty('totalSpeakingMinutes');
    expect(data).toHaveProperty('weeklyLogs');
    expect(data.initialLevel).toBe('A1');
  });

  it('logs speaking session seconds and converts to speaking minutes', () => {
    AnalyticsService.logSpeakingSession(120); // 2 minutes
    const data = AnalyticsService.getAnalytics();
    expect(data.totalSpeakingMinutes).toBeGreaterThanOrEqual(2);
    expect(data.speakingConfidenceScore).toBeGreaterThan(65);
  });

  it('logs completed lessons and xp', () => {
    AnalyticsService.logLessonCompleted(50);
    const data = AnalyticsService.getAnalytics();
    expect(data.totalCompletedLessons).toBeGreaterThanOrEqual(1);
  });

  it('generates an actionable weekly report with pedagogic advice', () => {
    AnalyticsService.logSpeakingSession(180);
    AnalyticsService.logLessonCompleted(50);

    const report = AnalyticsService.generateWeeklyReport();
    expect(report).toHaveProperty('feedbackMessage');
    expect(report).toHaveProperty('focusSuggestion');
    expect(report.speakingMins).toBeGreaterThanOrEqual(3);
    expect(report.feedbackMessage.length).toBeGreaterThan(10);
  });
});
