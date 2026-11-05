import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LearningStorageService, VoiceAccentId } from '../src/renderer/src/services/learningStorage';

describe('Chirmo Accent & Voice Selector Service', () => {
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

    (global as any).window = (global as any).window || {};
    (global as any).SpeechSynthesisUtterance = class {
      text: string;
      lang = '';
      pitch = 1;
      rate = 1;
      voice: any = null;
      constructor(text: string) {
        this.text = text;
      }
    };

    vi.restoreAllMocks();
  });

  it('provides the 4 core accent configurations (US, UK, AU, Robot)', () => {
    const accents = LearningStorageService.getAvailableAccents();
    expect(accents).toHaveLength(4);
    
    const ids = accents.map(a => a.id);
    expect(ids).toContain('us');
    expect(ids).toContain('uk');
    expect(ids).toContain('au');
    expect(ids).toContain('robot');

    const ukAccent = accents.find(a => a.id === 'uk');
    expect(ukAccent).toBeDefined();
    expect(ukAccent?.lang).toBe('en-GB');
    expect(ukAccent?.flag).toBe('🇬🇧');
  });

  it('defaults to US accent and allows changing accent preference', () => {
    expect(LearningStorageService.getSelectedAccent()).toBe('us');

    LearningStorageService.setSelectedAccent('uk');
    expect(LearningStorageService.getSelectedAccent()).toBe('uk');
    expect(localStorage.getItem('chirmo_voice_accent')).toBe('uk');

    LearningStorageService.setSelectedAccent('au');
    expect(LearningStorageService.getSelectedAccent()).toBe('au');
  });

  it('manages speech rate preference with safe clamping', () => {
    expect(LearningStorageService.getSpeechRate()).toBe(0.9);

    LearningStorageService.setSpeechRate(1.1);
    expect(LearningStorageService.getSpeechRate()).toBe(1.1);

    // Clamping checks
    LearningStorageService.setSpeechRate(2.5);
    expect(LearningStorageService.getSpeechRate()).toBe(1.5);

    LearningStorageService.setSpeechRate(0.2);
    expect(LearningStorageService.getSpeechRate()).toBe(0.6);
  });

  it('correctly configures SpeechSynthesisUtterance with selected accent settings', () => {
    const mockSpeak = vi.fn();
    const mockCancel = vi.fn();
    
    (window as any).speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
      getVoices: vi.fn(() => [
        { name: 'Google UK English Female', lang: 'en-GB' },
        { name: 'Google US English', lang: 'en-US' }
      ])
    };

    LearningStorageService.setSelectedAccent('uk');
    LearningStorageService.setSpeechRate(0.85);

    LearningStorageService.speak('Cheerio! How are you doing today?');

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();

    const utterance = mockSpeak.mock.calls[0][0] as any;
    expect(utterance.text).toBe('Cheerio! How are you doing today?');
    expect(utterance.lang).toBe('en-GB');
    expect(utterance.rate).toBe(0.85);
  });
});
