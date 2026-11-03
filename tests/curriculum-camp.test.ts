import { describe, it, expect, beforeEach } from 'vitest';
import {
  REAL_LIFE_SCENARIOS,
  THIRTY_DAY_MISSIONS,
  CampStorageService
} from '../src/renderer/src/services/curriculumData';

describe('Chirmo 30-Day Fluent Reflex Method & Real Life Scenarios', () => {
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

  it('provides comprehensive Real Life Scenarios for practical survival English', () => {
    expect(REAL_LIFE_SCENARIOS.length).toBeGreaterThanOrEqual(8);

    for (const scenario of REAL_LIFE_SCENARIOS) {
      expect(scenario.title).toBeTruthy();
      expect(scenario.category).toBeTruthy();
      expect(scenario.badge).toBeTruthy();
      expect(scenario.keyChunks.length).toBeGreaterThan(0);
      expect(scenario.interactiveChallenge.aiQuestion).toBeTruthy();
      expect(scenario.interactiveChallenge.suggestedAnswer).toBeTruthy();
      expect(scenario.interactiveChallenge.coachTip).toBeTruthy();
    }
  });

  it('specifically includes coffee ordering, travel/airport, and natural reaction chunks', () => {
    const coffee = REAL_LIFE_SCENARIOS.find((s) => s.category.includes('Kafe'));
    expect(coffee).toBeDefined();

    const icedLatte = coffee?.keyChunks.find((c) => c.en.includes('iced latte'));
    expect(icedLatte).toBeDefined();

    const travel = REAL_LIFE_SCENARIOS.find((s) => s.category.includes('Seyahat'));
    expect(travel).toBeDefined();

    const reactions = REAL_LIFE_SCENARIOS.find((s) => s.category.includes('Doğal Tepkiler'));
    expect(reactions).toBeDefined();
  });

  it('contains all 30 days of consecutive speaking missions for the 1-month camp', () => {
    expect(THIRTY_DAY_MISSIONS.length).toBe(30);

    for (let day = 1; day <= 30; day++) {
      const mission = THIRTY_DAY_MISSIONS.find((m) => m.day === day);
      expect(mission).toBeDefined();
      expect(mission?.week).toBeGreaterThanOrEqual(1);
      expect(mission?.week).toBeLessThanOrEqual(4);
      expect(mission?.aiPrompt).toBeTruthy();
      expect(mission?.suggestedAnswer).toBeTruthy();
      expect(mission?.suggestedAnswerTr).toBeTruthy();
      expect(mission?.xpReward).toBeGreaterThan(0);
      expect(mission?.nativeCoachTip).toBeTruthy();
    }
  });

  it('CampStorageService manages progression, XP awards, and category selection', () => {
    const initial = CampStorageService.getProgress();
    expect(initial.currentDay).toBe(1);

    // Complete Day 1
    const updated = CampStorageService.completeDayMission(1, 50);
    expect(updated.completedDays).toContain(1);
    expect(updated.totalXp).toBeGreaterThan(initial.totalXp);
    expect(updated.currentDay).toBe(2);

    // Change category
    const catUpdated = CampStorageService.setSelectedCategory('Havalimanı & Seyahat');
    expect(catUpdated.selectedCategory).toBe('Havalimanı & Seyahat');

    const loaded = CampStorageService.getProgress();
    expect(loaded.selectedCategory).toBe('Havalimanı & Seyahat');
    expect(loaded.completedDays).toContain(1);
  });
});
