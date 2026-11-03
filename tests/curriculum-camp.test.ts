import { describe, it, expect, beforeEach } from 'vitest';
import {
  GRADE_UNITS,
  THIRTY_DAY_MISSIONS,
  CampStorageService,
  GradeLevel
} from '../src/renderer/src/services/curriculumData';

describe('MEB Middle School Curriculum & 30-Day Speaking Camp', () => {
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

  it('provides complete MEB curriculum units for 5th, 6th, 7th, and 8th (LGS) grades', () => {
    const grades: GradeLevel[] = ['5', '6', '7', '8'];
    for (const g of grades) {
      const units = GRADE_UNITS[g];
      expect(units).toBeDefined();
      expect(units.length).toBeGreaterThan(0);

      // Check unit structure
      for (const u of units) {
        expect(u.title).toBeTruthy();
        expect(u.badge).toBeTruthy();
        expect(u.keyWords.length).toBeGreaterThan(0);
        expect(u.dailySpeakingPrompt.question).toBeTruthy();
        expect(u.dailySpeakingPrompt.questionTr).toBeTruthy();
        expect(u.dailySpeakingPrompt.expectedAnswerExample).toBeTruthy();
      }
    }
  });

  it('specifically includes LGS Friendship and Teen Life units for 8th grade', () => {
    const lgsUnits = GRADE_UNITS['8'];
    const friendship = lgsUnits.find((u) => u.title.includes('Friendship'));
    expect(friendship).toBeDefined();

    const countOnWord = friendship?.keyWords.find((w) => w.en === 'count on');
    expect(countOnWord).toBeDefined();
    expect(countOnWord?.tr).toContain('Güvenmek');
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
      expect(mission?.keyVocabulary.length).toBeGreaterThan(0);
    }
  });

  it('CampStorageService manages progression, XP awards, and grade selection', () => {
    const initial = CampStorageService.getProgress();
    expect(initial.currentDay).toBe(1);
    expect(initial.selectedGrade).toBe('8');

    // Complete Day 1
    const updated = CampStorageService.completeDayMission(1, 50);
    expect(updated.completedDays).toContain(1);
    expect(updated.totalXp).toBeGreaterThan(initial.totalXp);
    expect(updated.currentDay).toBe(2);

    // Change Grade to 5th grade
    const gradeUpdated = CampStorageService.setSelectedGrade('5');
    expect(gradeUpdated.selectedGrade).toBe('5');

    const loaded = CampStorageService.getProgress();
    expect(loaded.selectedGrade).toBe('5');
    expect(loaded.completedDays).toContain(1);
  });
});
