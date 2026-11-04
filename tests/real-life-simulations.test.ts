import { describe, it, expect } from 'vitest';
import { REAL_LIFE_SCENARIOS } from '../src/renderer/src/services/curriculumData';
import { GAME_LISTENING_CHALLENGES, GAME_SPEAKING_PROMPTS } from '../src/renderer/src/services/englishGamesData';

describe('Real-Life Simulations & Game Arcade Extensions', () => {
  it('contains comprehensive real-life scenarios with key chunks and interactive challenges', () => {
    expect(REAL_LIFE_SCENARIOS.length).toBeGreaterThanOrEqual(4);

    REAL_LIFE_SCENARIOS.forEach((scenario) => {
      expect(scenario.id).toBeDefined();
      expect(scenario.title).toBeDefined();
      expect(scenario.category).toBeDefined();
      expect(scenario.keyChunks.length).toBeGreaterThanOrEqual(3);
      expect(scenario.interactiveChallenge.aiQuestion).toBeDefined();
      expect(scenario.interactiveChallenge.suggestedAnswer).toBeDefined();
      expect(scenario.interactiveChallenge.coachTip).toBeDefined();
    });
  });

  it('contains listening challenge questions for both kids and adults', () => {
    expect(GAME_LISTENING_CHALLENGES.length).toBeGreaterThanOrEqual(4);
    const kids = GAME_LISTENING_CHALLENGES.filter((c) => c.audience === 'kids');
    const adults = GAME_LISTENING_CHALLENGES.filter((c) => c.audience === 'adults');

    expect(kids.length).toBeGreaterThanOrEqual(2);
    expect(adults.length).toBeGreaterThanOrEqual(2);

    GAME_LISTENING_CHALLENGES.forEach((c) => {
      expect(c.options.length).toBe(4);
      const correctCount = c.options.filter((o) => o.isCorrect).length;
      expect(correctCount).toBe(1);
    });
  });

  it('contains 30-second speaking prompts with helper hints and sample answers', () => {
    expect(GAME_SPEAKING_PROMPTS.length).toBeGreaterThanOrEqual(3);
    GAME_SPEAKING_PROMPTS.forEach((p) => {
      expect(p.helperHints.length).toBeGreaterThanOrEqual(2);
      expect(p.sampleAnswerEn.length).toBeGreaterThan(10);
      expect(p.sampleAnswerTr.length).toBeGreaterThan(5);
    });
  });
});
