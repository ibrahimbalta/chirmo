import { describe, it, expect } from 'vitest';
import { EnglishSearchHelper, SearchLearningMode } from '../src/renderer/src/services/englishSearchHelper';

describe('EnglishSearchHelper Service', () => {
  it('detects language correctly for Turkish and English queries', () => {
    expect(EnglishSearchHelper.detectLanguage('hesabı alabilir miyim')).toBe('tr');
    expect(EnglishSearchHelper.detectLanguage('geliştirmek')).toBe('tr');
    expect(EnglishSearchHelper.detectLanguage('how are you today')).toBe('en');
    expect(EnglishSearchHelper.detectLanguage('sustainable development')).toBe('en');
    expect(EnglishSearchHelper.detectLanguage('https://bbc.com')).toBe('url');
  });

  it('provides matching learning card result for known terms and phrases', () => {
    const resTr = EnglishSearchHelper.getLearningCard('sipariş');
    expect(resTr).not.toBeNull();
    expect(resTr?.english.toLowerCase()).toContain('order');
    expect(resTr?.turkish).toContain('sipariş');
    expect(resTr?.level).toBeDefined();
    expect(resTr?.exampleSentenceEn).toBeDefined();

    const resEn = EnglishSearchHelper.getLearningCard('improve');
    expect(resEn).not.toBeNull();
    expect(resEn?.english.toLowerCase()).toContain('improve');
    expect(resEn?.turkish.toLowerCase()).toContain('geliştir');
    expect(resEn?.phonetic).toBeDefined();
  });

  it('builds appropriate search queries based on active learning mode', () => {
    // Web modu: doğrudan arama
    const web = EnglishSearchHelper.buildSearchTarget('weather today', 'all');
    expect(web).toContain('weather%20today');

    // Kolay İngilizce modu: Simple English / BBC Learning ekler
    const easy = EnglishSearchHelper.buildSearchTarget('climate change', 'easy_english');
    expect(easy).toContain('simple%20english');

    // Nasıl Söylenir modu: how to say ekler
    const howTo = EnglishSearchHelper.buildSearchTarget('hesabı alabilir miyim', 'how_to_say');
    expect(howTo).toContain('how%20to%20say');

    // Kelime / Sözlük modu: meaning definition ekler
    const vocab = EnglishSearchHelper.buildSearchTarget('sustainable', 'vocab');
    expect(vocab).toContain('meaning');
  });

  it('returns quick inspiration prompts for English learners', () => {
    const prompts = EnglishSearchHelper.getInspirationPrompts();
    expect(prompts.length).toBeGreaterThan(3);
    expect(prompts[0]).toHaveProperty('text');
    expect(prompts[0]).toHaveProperty('mode');
  });
});
