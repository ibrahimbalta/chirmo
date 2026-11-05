import { describe, it, expect } from 'vitest';
import {
  VisionExplorerService,
  PRESET_OBJECT_SCENES
} from '../src/renderer/src/services/visionExplorerService';

describe('Chirmo Vision & Object Recognition Speaking Explorer Service', () => {
  it('contains at least 6 real-world preset scenes with complete pedagogical metadata', () => {
    expect(PRESET_OBJECT_SCENES.length).toBeGreaterThanOrEqual(6);

    const coffeeScene = PRESET_OBJECT_SCENES.find(s => s.id === 'coffee_mug');
    expect(coffeeScene).toBeDefined();
    expect(coffeeScene?.objectName).toBe('Coffee Mug');
    expect(coffeeScene?.turkishName).toBe('Kahve Fincanı / Kupa');
    expect(coffeeScene?.phonetic).toBe('/ˈkɒf.i mʌɡ/');
    expect(coffeeScene?.contextualSentences).toHaveLength(3);
    expect(coffeeScene?.chirmoQuestion).toBeTruthy();
    expect(coffeeScene?.suggestedAnswers.length).toBeGreaterThan(0);
  });

  it('detects and analyzes objects by preset ID or keywords', () => {
    const result = VisionExplorerService.analyzeObject('laptop');
    expect(result).toBeDefined();
    expect(result.objectName.toLowerCase()).toContain('laptop');
    expect(result.contextualSentences.length).toBe(3);
    expect(result.cefrLevel).toBe('B1');
  });

  it('falls back gracefully to a generic smart object analysis when given unknown input', () => {
    const result = VisionExplorerService.analyzeObject('telescope');
    expect(result).toBeDefined();
    expect(result.objectName).toBe('Telescope');
    expect(result.contextualSentences.length).toBeGreaterThan(0);
    expect(result.chirmoQuestion).toContain('telescope');
  });

  it('evaluates user spoken sentence about the detected object', () => {
    const target = PRESET_OBJECT_SCENES[0];
    const userGoodSpeech = 'I love drinking a warm cup of coffee every morning while studying.';
    const evaluation = VisionExplorerService.evaluateUserResponse(target, userGoodSpeech);

    expect(evaluation.isRelevant).toBe(true);
    expect(evaluation.score).toBeGreaterThanOrEqual(80);
    expect(evaluation.feedback).toBeTruthy();
  });
});
