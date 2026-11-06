import { describe, it, expect, beforeEach } from 'vitest';
import { ReflexDrillService } from '../src/renderer/src/services/reflexDrillService';
import { LegoChunkService } from '../src/renderer/src/services/legoChunkService';
import { CareerTrackService } from '../src/renderer/src/services/careerTrackService';

describe('20-Year Teacher Pedagogical Innovations (Chirmo Master System)', () => {
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

  describe('3-Second Reflex Drill Service', () => {
    it('provides fast-response spoken drills for both German and English', () => {
      const deDrills = ReflexDrillService.getDrills('de');
      expect(deDrills.length).toBeGreaterThanOrEqual(6);
      expect(deDrills[0].language).toBe('de');
      expect(deDrills[0].suggestedAnswer).toBeTruthy();

      const enDrills = ReflexDrillService.getDrills('en');
      expect(enDrills.length).toBeGreaterThanOrEqual(6);
      expect(enDrills[0].language).toBe('en');
      expect(enDrills[0].suggestedAnswer).toBeTruthy();
    });

    it('awards speed rating and bonus XP for fast response times under 2 seconds', () => {
      const deDrill = ReflexDrillService.getDrills('de')[0];
      const resultFast = ReflexDrillService.evaluateResponse(
        'Entschuldigung, ich hatte einen Kaffee mit Milch bestellt',
        deDrill,
        1.2
      );
      expect(resultFast.speedRating).toBe('Işık Hızı ⚡');
      expect(resultFast.xpEarned).toBeGreaterThanOrEqual(50);
      expect(resultFast.score).toBeGreaterThanOrEqual(80);

      const resultNormal = ReflexDrillService.evaluateResponse(
        'Entschuldigung, ich hatte einen Kaffee mit Milch bestellt',
        deDrill,
        3.5
      );
      expect(resultNormal.speedRating).toBe('İyi Refleks 👍');
      expect(resultNormal.xpEarned).toBe(40);
    });
  });

  describe('Lego Chunking Service (1 Root Pattern -> Unlimited Variations)', () => {
    it('provides Lego chunk patterns with root templates and modular bricks for German', () => {
      const dePatterns = LegoChunkService.getPatterns('de');
      expect(dePatterns.length).toBeGreaterThanOrEqual(3);

      const root1 = dePatterns.find((p) => p.pattern.includes('Ich hätte gerne'));
      expect(root1).toBeDefined();
      expect(root1?.bricks.length).toBeGreaterThanOrEqual(3);
      expect(root1?.bricks[0].fullSentence).toContain('Ich hätte gerne');
      expect(root1?.pedagogicalTip).toBeTruthy();
    });

    it('provides Lego chunk patterns with root templates and modular bricks for English', () => {
      const enPatterns = LegoChunkService.getPatterns('en');
      expect(enPatterns.length).toBeGreaterThanOrEqual(3);

      const root1 = enPatterns.find((p) => p.pattern.includes('I would like to'));
      expect(root1).toBeDefined();
      expect(root1?.bricks.length).toBeGreaterThanOrEqual(3);
      expect(root1?.bricks[0].fullSentence).toContain('I would like to');
    });
  });

  describe('Visa & High-Stakes Career Tracks', () => {
    it('provides German visa and medical tracks for Turkish immigrants/expats', () => {
      const tracks = CareerTrackService.getTracks('de');
      expect(tracks.length).toBeGreaterThanOrEqual(5);

      const germanVisa = tracks.find((t) => t.id === 'german_visa');
      expect(germanVisa).toBeDefined();
      expect(germanVisa?.scenarios.length).toBeGreaterThanOrEqual(2);
      expect(germanVisa?.powerJargon.length).toBeGreaterThanOrEqual(3);

      const germanMed = tracks.find((t) => t.id === 'german_health');
      expect(germanMed).toBeDefined();
      expect(germanMed?.turkishTitle).toContain('Doktor & Hemşirelik');
    });

    it('evaluates German visa responses accurately', () => {
      const tracks = CareerTrackService.getTracks('de');
      const germanVisa = tracks.find((t) => t.id === 'german_visa');
      const scenario = germanVisa?.scenarios[0]!;

      const evalResult = CareerTrackService.evaluateCareerSpeech(
        scenario,
        'Guten Tag! Ich habe einen unbefristeten Arbeitsvertrag als Ingenieur in Frankfurt und reise für meine berufliche Tätigkeit ein.'
      );
      expect(evalResult.score).toBeGreaterThanOrEqual(80);
      expect(evalResult.matchedKeywords.length).toBeGreaterThan(0);
      expect(evalResult.feedbackTr).toBeTruthy();
    });
  });
});
