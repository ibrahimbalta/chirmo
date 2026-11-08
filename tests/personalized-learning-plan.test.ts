import { describe, it, expect, beforeEach } from 'vitest';
import { PersonalizedLearningPlanService } from '../src/renderer/src/services/personalizedLearningPlanService';

describe('PersonalizedLearningPlanService', () => {
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
    (global as any).window = {
      dispatchEvent: () => true,
      addEventListener: () => {},
      removeEventListener: () => {}
    };
  });

  it('generates age-appropriate plan for kids (5-11 years)', () => {
    const plan = PersonalizedLearningPlanService.generateAndSavePlan({
      ageGroup: 'kids',
      ageNumber: 8,
      level: 'A1',
      targetLang: 'en',
      targetFocus: 'games'
    });

    expect(plan.ageGroup).toBe('kids');
    expect(plan.levelTitle).toContain('Minik');
    expect(plan.steps.length).toBeGreaterThanOrEqual(4);

    // Verify Kids-specific components are selected
    const hasKidsHub = plan.steps.some((s) => s.targetTab === 'kids');
    expect(hasKidsHub).toBe(true);

    const hasArcade = plan.steps.some((s) => s.targetTab === 'games');
    expect(hasArcade).toBe(true);
  });

  it('generates practical survival and speaking plan for beginner adults (A1)', () => {
    const plan = PersonalizedLearningPlanService.generateAndSavePlan({
      ageGroup: 'adults',
      ageNumber: 28,
      level: 'A1',
      targetLang: 'en',
      targetFocus: 'daily'
    });

    expect(plan.ageGroup).toBe('adults');
    expect(plan.level).toBe('A1');
    expect(plan.steps.length).toBeGreaterThanOrEqual(5);

    // Verify Cafe Simulator / Real Life simulation is included
    const hasSimulator = plan.steps.some((s) => s.targetTab === 'speak' || s.title.includes('Kafede'));
    expect(hasSimulator).toBe(true);

    // Verify 30 Day Camp is included
    const hasCamp = plan.steps.some((s) => s.title.includes('30 Günlük'));
    expect(hasCamp).toBe(true);
  });

  it('generates advanced professional & interview plan for B2/C1 users', () => {
    const plan = PersonalizedLearningPlanService.generateAndSavePlan({
      ageGroup: 'adults',
      ageNumber: 32,
      level: 'B2',
      targetLang: 'en',
      targetFocus: 'career'
    });

    expect(plan.level).toBe('B2');
    const hasInterviewOrTed = plan.steps.some(
      (s) => s.title.includes('Mülakat') || s.title.includes('TED')
    );
    expect(hasInterviewOrTed).toBe(true);
  });

  it('generates German-specific modules when target language is German', () => {
    const plan = PersonalizedLearningPlanService.generateAndSavePlan({
      ageGroup: 'adults',
      ageNumber: 25,
      level: 'A1',
      targetLang: 'de',
      targetFocus: 'daily'
    });

    expect(plan.targetLang).toBe('de');
    const hasGermanModule = plan.steps.some(
      (s) => s.title.includes('Almanca') || s.title.includes('der / die / das')
    );
    expect(hasGermanModule).toBe(true);
  });

  it('marks steps as completed, recalculates progress and earns XP', () => {
    const plan = PersonalizedLearningPlanService.generateAndSavePlan({
      ageGroup: 'adults',
      level: 'A1',
      targetLang: 'en'
    });

    const firstStep = plan.steps[0];
    expect(firstStep.completed).toBe(false);
    expect(plan.progressPercent).toBe(0);

    const { plan: updated, xpGained } = PersonalizedLearningPlanService.completeStep(firstStep.id);
    expect(xpGained).toBe(firstStep.xpReward);
    expect(updated.completedCount).toBe(1);
    expect(updated.progressPercent).toBeGreaterThan(0);
    expect(updated.steps[0].completed).toBe(true);
  });
});
