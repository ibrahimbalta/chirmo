import { describe, it, expect, beforeEach } from 'vitest';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../src/renderer/src/services/learningStorage';

describe('LearningStorageService (Chirmo English Learning Engine)', () => {
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

  it('initializes default learning progress with CEFR level', () => {
    const progress = LearningStorageService.getProgress();
    expect(progress).toBeDefined();
    expect(progress.currentLevel).toBe('B1');
    expect(progress.targetWords).toBeGreaterThan(0);
    expect(progress.streakDays).toBeGreaterThan(0);
  });

  it('updates user CEFR level and persists it', () => {
    const updated = LearningStorageService.setUserLevel('B2');
    expect(updated.currentLevel).toBe('B2');

    const fresh = LearningStorageService.getProgress();
    expect(fresh.currentLevel).toBe('B2');
  });

  it('looks up foundational CEFR words from built-in dictionary', () => {
    const result = LearningStorageService.lookup('improve');
    expect(result.found).toBe(true);
    expect(result.translation).toContain('Geliştirmek');
    expect(result.level).toBe('B1');
    expect(result.phonetic).toBe('/ɪmˈpruːv/');
  });

  it('handles unknown words gracefully with dynamic fallback', () => {
    const result = LearningStorageService.lookup('serendipity');
    expect(result.found).toBe(false);
    expect(result.word).toBe('serendipity');
    expect(result.explanation).toBeDefined();
  });

  it('adds words to vocabulary vault and increments daily word count', () => {
    const initialProgress = LearningStorageService.getProgress();
    const initialCount = initialProgress.wordsLearnedToday;

    const added = LearningStorageService.addWord({
      word: 'collaborate',
      translation: 'İş birliği yapmak',
      partOfSpeech: 'Fiil (Verb)',
      level: 'B2',
      exampleSentence: 'They decided to collaborate on the project.',
      exampleTranslation: 'Proje üzerinde iş birliği yapmaya karar verdiler.'
    });

    expect(added.id).toBeDefined();
    expect(added.word).toBe('collaborate');

    const words = LearningStorageService.getSavedWords();
    expect(words.some((w) => w.word === 'collaborate')).toBe(true);

    const newProgress = LearningStorageService.getProgress();
    expect(newProgress.wordsLearnedToday).toBe(initialCount + 1);
  });

  it('updates word mastery using spaced repetition intervals', () => {
    const words = LearningStorageService.getSavedWords();
    const firstWord = words[0];

    const initialMastery = firstWord.mastery;
    LearningStorageService.updateMastery(firstWord.id, true);

    const updatedWords = LearningStorageService.getSavedWords();
    const updatedWord = updatedWords.find((w) => w.id === firstWord.id);
    expect(updatedWord?.mastery).toBe(Math.min(100, initialMastery + 20));
    expect(updatedWord?.reviewCount).toBe(firstWord.reviewCount + 1);
  });
});
