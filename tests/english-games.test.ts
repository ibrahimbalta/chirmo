import { describe, it, expect, beforeEach } from 'vitest';
import {
  KIDS_GAME_VOCAB,
  ADULT_GAME_VOCAB,
  GAME_SENTENCE_PUZZLES,
  GAME_VOICE_CHALLENGES,
  GameStatsService
} from '../src/renderer/src/services/englishGamesData';

describe('English Game Arcade Data & Game Engine', () => {
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

  it('provides rich vocabulary for kids with visual emojis', () => {
    expect(KIDS_GAME_VOCAB.length).toBeGreaterThanOrEqual(25);
    const categories = new Set(KIDS_GAME_VOCAB.map((w) => w.category));
    expect(categories.has('Hayvanlar')).toBe(true);
    expect(categories.has('Renkler')).toBe(true);
    expect(categories.has('Yiyecekler')).toBe(true);

    for (const w of KIDS_GAME_VOCAB) {
      expect(w.en).toBeTruthy();
      expect(w.tr).toBeTruthy();
      expect(w.emoji).toBeTruthy();
    }
  });

  it('provides practical everyday and business vocabulary for adults', () => {
    expect(ADULT_GAME_VOCAB.length).toBeGreaterThanOrEqual(20);
    const categories = new Set(ADULT_GAME_VOCAB.map((w) => w.category));
    expect(categories.has('Seyahat')).toBe(true);
    expect(categories.has('Restoran')).toBe(true);
    expect(categories.has('İş & Kariyer')).toBe(true);

    for (const w of ADULT_GAME_VOCAB) {
      expect(w.en).toBeTruthy();
      expect(w.tr).toBeTruthy();
      expect(w.emoji).toBeTruthy();
    }
  });

  it('contains sentence rocket puzzles separated by audience', () => {
    expect(GAME_SENTENCE_PUZZLES.length).toBeGreaterThanOrEqual(8);
    const kidsPuzzles = GAME_SENTENCE_PUZZLES.filter((p) => p.audience === 'kids');
    const adultPuzzles = GAME_SENTENCE_PUZZLES.filter((p) => p.audience === 'adults');

    expect(kidsPuzzles.length).toBeGreaterThanOrEqual(4);
    expect(adultPuzzles.length).toBeGreaterThanOrEqual(4);

    for (const p of GAME_SENTENCE_PUZZLES) {
      expect(p.en).toBeTruthy();
      expect(p.tr).toBeTruthy();
      expect(p.scrambledWords.length).toBeGreaterThanOrEqual(3);
      // All scrambled words should match the sentence words when joined
      const joinedScrambled = [...p.scrambledWords].sort().join(' ');
      const joinedOriginal = p.en.split(' ').sort().join(' ');
      expect(joinedScrambled.toLowerCase()).toBe(joinedOriginal.toLowerCase());
    }
  });

  it('provides voice pronunciation challenges with tips for both kids and adults', () => {
    expect(GAME_VOICE_CHALLENGES.length).toBeGreaterThanOrEqual(6);
    for (const vc of GAME_VOICE_CHALLENGES) {
      expect(vc.en).toBeTruthy();
      expect(vc.tr).toBeTruthy();
      expect(vc.pronounceTip).toBeTruthy();
      expect(vc.emoji).toBeTruthy();
    }
  });

  it('records score, levels up, and unlocks badges', () => {
    const initial = GameStatsService.getStats();
    expect(initial.totalScore).toBe(0);
    expect(initial.level).toBe(1);

    const s1 = GameStatsService.addScore(100);
    expect(s1.totalScore).toBe(100);

    const s2 = GameStatsService.addScore(250); // Total 350
    expect(s2.totalScore).toBe(350);
    expect(s2.level).toBeGreaterThanOrEqual(2);
    expect(s2.badges).toContain('⭐ Yıldız Avcısı');
  });
});
