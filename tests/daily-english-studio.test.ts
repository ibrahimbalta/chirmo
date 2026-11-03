import { describe, it, expect } from 'vitest';
import {
  DAILY_WORDS,
  EVERYDAY_SENTENCES,
  DAILY_DIALOGUES,
  DAILY_PATTERNS,
  SENTENCE_PUZZLES,
  GRAMMAR_BLUEPRINTS
} from '../src/renderer/src/services/dailyEnglishData';

describe('Daily English Studio Data & Modules', () => {
  it('provides 120+ everyday categorized vocabulary words', () => {
    expect(DAILY_WORDS.length).toBeGreaterThanOrEqual(100);
    const categories = new Set(DAILY_WORDS.map((w) => w.category));
    expect(categories.has('Temel')).toBe(true);
    expect(categories.has('Yemek')).toBe(true);
    expect(categories.has('Şehir')).toBe(true);
    expect(categories.has('Fiiller')).toBe(true);
    expect(categories.has('Sağlık')).toBe(true);

    for (const word of DAILY_WORDS) {
      expect(word.en).toBeTruthy();
      expect(word.tr).toBeTruthy();
    }
  });

  it('provides 38 everyday practical sentences', () => {
    expect(EVERYDAY_SENTENCES.length).toBeGreaterThanOrEqual(35);
    for (const item of EVERYDAY_SENTENCES) {
      expect(item.en).toBeTruthy();
      expect(item.tr).toBeTruthy();
    }
  });

  it('provides rich real-world dialogues with speaker roles', () => {
    expect(DAILY_DIALOGUES.length).toBeGreaterThanOrEqual(12);

    for (const d of DAILY_DIALOGUES) {
      expect(d.title).toBeTruthy();
      expect(d.category).toBeTruthy();
      expect(d.lines.length).toBeGreaterThanOrEqual(4);

      // Verify each dialogue has alternating speakers A and B
      const speakers = d.lines.map((l) => l.speaker);
      expect(speakers.includes('A')).toBe(true);
      expect(speakers.includes('B')).toBe(true);
    }
  });

  it('contains speaking patterns with practical everyday examples', () => {
    expect(DAILY_PATTERNS.length).toBeGreaterThanOrEqual(8);
    for (const p of DAILY_PATTERNS) {
      expect(p.title).toBeTruthy();
      expect(p.desc).toBeTruthy();
      expect(p.examples.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('contains sentence construction puzzles', () => {
    expect(SENTENCE_PUZZLES.length).toBeGreaterThanOrEqual(10);
    for (const pz of SENTENCE_PUZZLES) {
      expect(pz.en).toBeTruthy();
      expect(pz.tr).toBeTruthy();
      expect(pz.en.split(' ').length).toBeGreaterThanOrEqual(3);
    }
  });

  it('contains the 7 core sentence structure blueprints', () => {
    expect(GRAMMAR_BLUEPRINTS.length).toBe(7);
    for (const g of GRAMMAR_BLUEPRINTS) {
      expect(g.title).toBeTruthy();
      expect(g.desc).toBeTruthy();
      expect(g.examples.length).toBeGreaterThan(0);
    }
  });
});
