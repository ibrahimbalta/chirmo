import { describe, it, expect, beforeEach } from 'vitest';
import { SpacedRepetitionService } from '../src/renderer/src/services/spacedRepetitionService';
import { AiCorrectionService } from '../src/renderer/src/services/aiCorrectionService';

describe('SpacedRepetitionService (SM-2 Ebbinghaus Memory Engine)', () => {
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

  it('loads initial foundational vocabulary words with default SRS metrics across languages', () => {
    const words = SpacedRepetitionService.getAllWords();
    expect(words.length).toBeGreaterThanOrEqual(5);
    expect(words[0]).toHaveProperty('easeFactor');
    expect(words[0]).toHaveProperty('intervalDays');
    expect(words[0]).toHaveProperty('nextReviewDate');

    const deWords = SpacedRepetitionService.getAllWords('de');
    expect(deWords.length).toBeGreaterThanOrEqual(1);

    const frWords = SpacedRepetitionService.getAllWords('fr');
    expect(frWords.length).toBeGreaterThanOrEqual(1);
  });

  it('adds a new word and sets repetition count to 0 and interval to 1 day', () => {
    const newWord = SpacedRepetitionService.addWord({
      word: 'Resilience',
      translation: 'Direnç, zorluklara karşı dayanıklılık',
      level: 'B2',
      partOfSpeech: 'İsim'
    });

    expect(newWord.word).toBe('Resilience');
    expect(newWord.repetitionCount).toBe(0);
    expect(newWord.intervalDays).toBe(1);
    expect(newWord.masteryLevel).toBe('learning');
  });

  it('advances intervals on correct review according to SM-2 formula', () => {
    const newWord = SpacedRepetitionService.addWord({
      word: 'Perseverance',
      translation: 'Azim, kararlılık'
    });

    // 1st correct review: interval becomes 1
    const r1 = SpacedRepetitionService.recordReview(newWord.id, true, 5);
    expect(r1?.repetitionCount).toBe(1);
    expect(r1?.intervalDays).toBe(1);

    // 2nd correct review: interval becomes 3
    const r2 = SpacedRepetitionService.recordReview(newWord.id, true, 5);
    expect(r2?.repetitionCount).toBe(2);
    expect(r2?.intervalDays).toBe(3);

    // 3rd correct review: interval multiplied by ease factor
    const r3 = SpacedRepetitionService.recordReview(newWord.id, true, 5);
    expect(r3?.repetitionCount).toBe(3);
    expect(r3!.intervalDays).toBeGreaterThan(3);
  });

  it('resets repetition count to 0 and interval to 1 day on wrong review (forgetting curve)', () => {
    const newWord = SpacedRepetitionService.addWord({
      word: 'Elaborate',
      translation: 'Ayrıntılı açıklamak'
    });

    SpacedRepetitionService.recordReview(newWord.id, true, 5);
    SpacedRepetitionService.recordReview(newWord.id, true, 5);

    // Wrong review
    const failed = SpacedRepetitionService.recordReview(newWord.id, false, 1);
    expect(failed?.repetitionCount).toBe(0);
    expect(failed?.intervalDays).toBe(1);
    expect(failed?.masteryLevel).toBe('learning');
  });

  it('calculates retention rate and review counts accurately', () => {
    const stats = SpacedRepetitionService.getStats();
    expect(stats.totalWords).toBeGreaterThan(0);
    expect(stats.retentionRate).toBeGreaterThanOrEqual(0);
    expect(stats.retentionRate).toBeLessThanOrEqual(100);
  });

  it('generates a unified review queue including vocabulary and unresolved mistakes from Error Vault', async () => {
    // Add a mistake via AiCorrectionService
    const analysis = await AiCorrectionService.analyzeSentence('I am agree with you', 'en');
    AiCorrectionService.saveMistake(analysis);

    const queue = SpacedRepetitionService.getUnifiedReviewQueue('en');
    expect(queue.length).toBeGreaterThanOrEqual(1);

    const mistakeItem = queue.find((q) => q.sourceType === 'mistake');
    expect(mistakeItem).toBeDefined();
    expect(mistakeItem?.backText.toLowerCase()).toContain('agree');
  });
});
