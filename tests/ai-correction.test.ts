import { describe, it, expect, beforeEach } from 'vitest';
import { AiCorrectionService } from '../src/renderer/src/services/aiCorrectionService';

describe('AiCorrectionService & Personal Error Vault', () => {
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

  describe('Pedagogical Rule-Based Sentence Analysis', () => {
    it('detects typical Turkish learner error in English ("I am agree with you")', async () => {
      const res = await AiCorrectionService.analyzeSentence('I am agree with you', 'en');
      expect(res.isPerfect).toBe(false);
      expect(res.correctedText.toLowerCase()).toContain('i agree with you');
      expect(res.errorCategory).toBe('grammar');
      expect(res.explanationTr).toContain('agree');
      expect(res.nativeAlternative).toBeTruthy();
    });

    it('detects typical false friend in German ("Ich will Arzt bekommen")', async () => {
      const res = await AiCorrectionService.analyzeSentence('Ich will Arzt bekommen', 'de');
      expect(res.isPerfect).toBe(false);
      expect(res.correctedText.toLowerCase()).toContain('werden');
      expect(res.errorCategory).toBe('vocabulary');
      expect(res.explanationTr.toLowerCase()).toContain('werden');
    });

    it('detects typical auxiliary error in French ("Je suis faim")', async () => {
      const res = await AiCorrectionService.analyzeSentence('Je suis faim', 'fr');
      expect(res.isPerfect).toBe(false);
      expect(res.correctedText.toLowerCase()).toContain("j'ai faim");
      expect(res.explanationTr).toContain('avoir');
    });

    it('recognizes naturally correct sentences as isPerfect: true', async () => {
      const resEn = await AiCorrectionService.analyzeSentence('I would like a coffee, please.', 'en');
      expect(resEn.isPerfect).toBe(true);
      expect(resEn.correctedText).toBe('I would like a coffee, please.');

      const resDe = await AiCorrectionService.analyzeSentence('Guten Morgen, wie geht es dir?', 'de');
      expect(resDe.isPerfect).toBe(true);

      const resFr = await AiCorrectionService.analyzeSentence("Bonjour, je voudrais de l'eau s'il vous plaît.", 'fr');
      expect(resFr.isPerfect).toBe(true);
    });
  });

  describe('Personal Error Vault (Hata Defteri) Persistence', () => {
    it('saves a mistake record to vault and retrieves it', async () => {
      const analysis = await AiCorrectionService.analyzeSentence('I have 25 years old', 'en');
      const saved = AiCorrectionService.saveMistake(analysis);

      expect(saved.id).toBeTruthy();
      expect(saved.mastered).toBe(false);
      expect(saved.originalText).toBe('I have 25 years old');

      const all = AiCorrectionService.getAllMistakes();
      expect(all.length).toBe(1);
      expect(all[0].id).toBe(saved.id);

      const unresolved = AiCorrectionService.getUnresolvedMistakes('en');
      expect(unresolved.length).toBe(1);
    });

    it('marks a mistake as mastered and moves it out of unresolved list', async () => {
      const analysis = await AiCorrectionService.analyzeSentence('He do not know', 'en');
      const record = AiCorrectionService.saveMistake(analysis);

      expect(AiCorrectionService.getUnresolvedMistakes('en').length).toBe(1);

      const updated = AiCorrectionService.markMistakeAsMastered(record.id);
      expect(updated).toBe(true);

      expect(AiCorrectionService.getUnresolvedMistakes('en').length).toBe(0);
      const all = AiCorrectionService.getAllMistakes();
      expect(all[0].mastered).toBe(true);
    });
  });
});
