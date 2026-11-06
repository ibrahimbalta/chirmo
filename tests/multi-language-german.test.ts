import { describe, it, expect, beforeEach } from 'vitest';
import { TargetLanguageService, SUPPORTED_LANGUAGES } from '../src/renderer/src/services/targetLanguageService';

describe('TargetLanguageService (Multi-Language English & German)', () => {
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

  it('defaults to English (en) when no preference is saved', () => {
    expect(TargetLanguageService.getTargetLanguage()).toBe('en');
    const meta = TargetLanguageService.getLanguageMeta();
    expect(meta.name).toBe('İngilizce');
    expect(meta.flag).toBe('🇬🇧');
    expect(meta.speechLang).toBe('en-US');
  });

  it('can set and retrieve German (de) target language', () => {
    TargetLanguageService.setTargetLanguage('de');
    expect(TargetLanguageService.getTargetLanguage()).toBe('de');
    const meta = TargetLanguageService.getLanguageMeta();
    expect(meta.name).toBe('Almanca');
    expect(meta.nativeName).toBe('Deutsch');
    expect(meta.flag).toBe('🇩🇪');
    expect(meta.speechLang).toBe('de-DE');
  });

  it('supports toggle between English and German', () => {
    TargetLanguageService.setTargetLanguage('en');
    const next1 = TargetLanguageService.toggleLanguage();
    expect(next1).toBe('de');
    expect(TargetLanguageService.getTargetLanguage()).toBe('de');

    const next2 = TargetLanguageService.toggleLanguage();
    expect(next2).toBe('en');
    expect(TargetLanguageService.getTargetLanguage()).toBe('en');
  });

  it('notifies subscribers upon language change', () => {
    let notified: string | null = null;
    const unsub = TargetLanguageService.subscribe((lang) => {
      notified = lang;
    });

    TargetLanguageService.setTargetLanguage('de');
    expect(notified).toBe('de');

    unsub();
    TargetLanguageService.setTargetLanguage('en');
    expect(notified).toBe('de'); // Not updated because unsubscribed
  });

  it('provides German scenarios and 30-day missions via CurriculumService', async () => {
    const { CurriculumService } = await import('../src/renderer/src/services/curriculumData');
    const deScenarios = CurriculumService.getScenarios('de');
    expect(deScenarios.length).toBeGreaterThan(0);
    expect(deScenarios[0].id).toContain('scenario-de');

    const enScenarios = CurriculumService.getScenarios('en');
    expect(enScenarios.length).toBeGreaterThan(0);
    expect(enScenarios[0].id).toBe('scenario-coffee');

    const deMissions = CurriculumService.getDayMissions('de');
    expect(deMissions.length).toBeGreaterThan(0);
    expect(deMissions[0].speakingGoal).toContain('heiße');
  });

  it('translates Turkish thought to German when target language is German', async () => {
    const { GeminiAiTeacherService } = await import('../src/renderer/src/services/geminiAiTeacherService');
    const germanAnswer = await GeminiAiTeacherService.translateTurkishThoughtToTargetLanguage(
      'En sevdiğim hobi hafta sonları bisiklete binmek',
      '',
      'de'
    );
    expect(germanAnswer.toLowerCase()).toMatch(/hobby|radfahren|fahrrad/);
  });

  it('provides German everyday sentences, dialogues and puzzles via DailyLanguageData', async () => {
    const { DailyLanguageData } = await import('../src/renderer/src/services/dailyEnglishData');
    const deSentences = DailyLanguageData.getEverydaySentences('de');
    expect(deSentences.length).toBeGreaterThan(0);
    expect(deSentences[0].en).toBe('Wie geht es dir?');

    const deDialogues = DailyLanguageData.getDialogues('de');
    expect(deDialogues.length).toBeGreaterThan(0);
    expect(deDialogues[0].id).toBe('de-cafe-order');

    const dePuzzles = DailyLanguageData.getSentencePuzzles('de');
    expect(dePuzzles.length).toBeGreaterThan(0);
    expect(dePuzzles[0].en).toContain('Ich hätte gerne');
  });
});
