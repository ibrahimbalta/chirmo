import { describe, it, expect, beforeEach } from 'vitest';
import { LifePhraseBankService } from '../src/renderer/src/services/lifePhraseBankService';

describe('LifePhraseBankService (Daily Life Phrases & Vocabulary Repository)', () => {
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

  it('provides 12 core daily life categories with emojis and titles', () => {
    const categories = LifePhraseBankService.getCategories();
    expect(categories.length).toBe(12);

    const ids = categories.map((c) => c.id);
    expect(ids).toContain('cafe_dining');
    expect(ids).toContain('travel_transit');
    expect(ids).toContain('shopping_bargain');
    expect(ids).toContain('health_emergency');
    expect(ids).toContain('social_making_friends');
    expect(ids).toContain('quick_fillers');
  });

  it('contains comprehensive English and German daily life phrases', () => {
    const enPhrases = LifePhraseBankService.getPhrases({ targetLang: 'en' });
    const dePhrases = LifePhraseBankService.getPhrases({ targetLang: 'de' });

    expect(enPhrases.length).toBeGreaterThanOrEqual(15);
    expect(dePhrases.length).toBeGreaterThanOrEqual(12);

    // Her kalıpta fonetik okunuş ve zihinsel çeviri tuzağı tüyosu olmalı
    enPhrases.forEach((p) => {
      expect(p.phrase.length).toBeGreaterThan(0);
      expect(p.tr.length).toBeGreaterThan(0);
      expect(p.phonetic.length).toBeGreaterThan(0);
      expect(p.logicTip.length).toBeGreaterThan(0);
      expect(['starter', 'daily', 'fluent']).toContain(p.difficulty);
    });
  });

  it('filters phrases accurately by category and difficulty', () => {
    const cafePhrases = LifePhraseBankService.getPhrases({
      category: 'cafe_dining',
      targetLang: 'en'
    });
    expect(cafePhrases.length).toBeGreaterThan(0);
    cafePhrases.forEach((p) => {
      expect(p.category).toBe('cafe_dining');
      expect(p.targetLang).toBe('en');
    });

    const starterPhrases = LifePhraseBankService.getPhrases({
      difficulty: 'starter'
    });
    expect(starterPhrases.length).toBeGreaterThan(0);
    starterPhrases.forEach((p) => {
      expect(p.difficulty).toBe('starter');
    });
  });

  it('searches phrases across target text, Turkish translation and phonetic', () => {
    const resultsEn = LifePhraseBankService.searchPhrases('latte', 'en');
    expect(resultsEn.length).toBeGreaterThan(0);

    const resultsTr = LifePhraseBankService.searchPhrases('hesap', 'en');
    expect(resultsTr.length).toBeGreaterThan(0);

    const resultsDe = LifePhraseBankService.searchPhrases('Rechnung', 'de');
    expect(resultsDe.length).toBeGreaterThan(0);
  });

  it('toggles mastery status, saves to storage, and tracks mastered count', () => {
    const allEn = LifePhraseBankService.getPhrases({ targetLang: 'en' });
    const testId = allEn[0].id;

    expect(LifePhraseBankService.isMastered(testId)).toBe(false);
    expect(LifePhraseBankService.getMasteredCount()).toBe(0);

    // 1. Tıkla -> Ustalaşıldı
    const state1 = LifePhraseBankService.toggleMastered(testId);
    expect(state1).toBe(true);
    expect(LifePhraseBankService.isMastered(testId)).toBe(true);
    expect(LifePhraseBankService.getMasteredCount()).toBe(1);

    // 2. Tekrar tıkla -> Kaldırıldı
    const state2 = LifePhraseBankService.toggleMastered(testId);
    expect(state2).toBe(false);
    expect(LifePhraseBankService.isMastered(testId)).toBe(false);
    expect(LifePhraseBankService.getMasteredCount()).toBe(0);
  });
});
