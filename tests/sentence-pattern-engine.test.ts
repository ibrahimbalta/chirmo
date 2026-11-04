import { describe, it, expect } from 'vitest';
import { SentencePatternEngine, CORE_SENTENCE_PATTERNS } from '../src/renderer/src/services/sentencePatternEngine';

describe('SentencePatternEngine (Kalıptan Cümle Üretme Motoru)', () => {
  it('loads all core patterns for everyday speaking', () => {
    const patterns = SentencePatternEngine.getAllPatterns();
    expect(patterns.length).toBeGreaterThanOrEqual(8);

    const wantPattern = patterns.find((p) => p.category === 'want');
    expect(wantPattern).toBeDefined();
    expect(wantPattern?.pattern).toBe('I want...');
    expect(wantPattern?.compatibleWords.length).toBeGreaterThan(0);

    const needPattern = patterns.find((p) => p.category === 'need');
    expect(needPattern).toBeDefined();

    const canPattern = patterns.find((p) => p.category === 'can');
    expect(canPattern).toBeDefined();

    const questionPattern = patterns.find((p) => p.category === 'question');
    expect(questionPattern).toBeDefined();
  });

  it('generates 6 natural permutations for a single word', () => {
    const permutations = SentencePatternEngine.generateWordPermutations('coffee', 'kahve');
    expect(permutations).toHaveLength(6);

    const wantCase = permutations.find((p) => p.patternBadge.includes('Want'));
    expect(wantCase?.sentenceEn).toBe('I want coffee.');
    expect(wantCase?.sentenceTr).toBe('Ben kahve istiyorum.');

    const needCase = permutations.find((p) => p.patternBadge.includes('Need'));
    expect(needCase?.sentenceEn).toBe('I need coffee.');

    const canHaveCase = permutations.find((p) => p.patternBadge.includes('Can I have'));
    expect(canHaveCase?.sentenceEn).toBe('Can I have coffee?');

    const doYouWantCase = permutations.find((p) => p.patternBadge.includes('Do you want'));
    expect(doYouWantCase?.sentenceEn).toBe('Do you want coffee?');
  });

  it('provides structured interactive exercises with pedagogical explanations', () => {
    const exercises = SentencePatternEngine.getExercises();
    expect(exercises.length).toBeGreaterThanOrEqual(5);

    const ex1 = exercises[0];
    expect(ex1.correctSentence).toBeDefined();
    expect(ex1.tokens).toContain('want');
    expect(ex1.whyExplanation).toBeTruthy();
  });
});
