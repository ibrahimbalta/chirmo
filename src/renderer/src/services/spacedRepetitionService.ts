// Chirmo Akıllı Aralıklı Tekrar (SRS - Spaced Repetition System) Motoru
// Ebbinghaus Unutma Eğrisi ve SuperMemo SM-2 Prensipleri Temel Alınmıştır.
// Amaç: Kullanıcının öğrendiği İngilizce, Almanca ve Fransızca kelimeleri ve
// hata kasasındaki düzeltmeleri kalıcı hafızaya aktarmak; unutulmak üzere olanları
// 1, 3, 7, 14, 30 günlük aralıklarla kullanıcıya hatırlatmak.

import { AiCorrectionService } from './aiCorrectionService';
import { LearningStorageService } from './learningStorage';
import { SupportedLanguage } from './targetLanguageService';

export interface SrsWordData {
  id: string;
  word: string;
  translation: string;
  phonetic: string;
  partOfSpeech: string;
  level: string;
  exampleSentence: string;
  exampleTranslation: string;
  repetitionCount: number; // Kaç kez doğru hatırlandı
  intervalDays: number; // Bir sonraki tekrara kadar gün sayısı (1, 3, 7, 14, 30...)
  easeFactor: number; // Kolaylık katsayısı (varsayılan 2.5)
  lastReviewedAt: string; // ISO Tarih
  nextReviewDate: string; // ISO Tarih
  masteryLevel: 'learning' | 'reviewing' | 'mastered';
  totalReviews: number;
  correctReviews: number;
  targetLang?: 'en' | 'de' | 'fr';
}

export type SrsRating = 1 | 2 | 3 | 4 | 5; // 1: Unuttum, 3: Zor, 4: İyi, 5: Çok Kolay

export interface SrsReviewItem {
  id: string;
  sourceType: 'vocabulary' | 'mistake' | 'sentence_chunk';
  targetLang: 'en' | 'de' | 'fr';
  frontPrompt: string; // Kartın ön yüzü (Türkçe ipucu veya eksik cümle)
  frontSubPrompt?: string; // Kontekst ipucu
  backText: string; // Doğru hedef dildeki ifade/kelime
  backExplanationTr?: string; // Detaylı açıklama / kural
  audioText: string; // Dinleme metni
  repetition: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: string;
  rawItem?: any;
}

const SRS_STORAGE_KEY = 'chirmo_srs_vocabulary_v3';
const EVENT_NAME = 'chirmo_srs_updated';

export const SpacedRepetitionService = {
  getAllWords(targetLang?: 'en' | 'de' | 'fr'): SrsWordData[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(SRS_STORAGE_KEY);
      let list: SrsWordData[] = [];
      if (!raw) {
        list = this.getInitialWords();
      } else {
        const parsed = JSON.parse(raw);
        list = Array.isArray(parsed) && parsed.length > 0 ? parsed : this.getInitialWords();
      }
      if (targetLang) {
        return list.filter((w) => (w.targetLang || 'en') === targetLang);
      }
      return list;
    } catch {
      return this.getInitialWords();
    }
  },

  getInitialWords(): SrsWordData[] {
    const today = new Date().toISOString();
    const defaults: SrsWordData[] = [
      // English
      {
        id: 'srs-en-1',
        word: 'Improve',
        translation: 'Geliştirmek, ilerletmek',
        phonetic: '/ɪmˈpruːv/',
        partOfSpeech: 'Fiil',
        level: 'A2',
        exampleSentence: 'I want to improve my English speaking skills.',
        exampleTranslation: 'İngilizce konuşma becerilerimi geliştirmek istiyorum.',
        repetitionCount: 1,
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedAt: today,
        nextReviewDate: today,
        masteryLevel: 'reviewing',
        totalReviews: 2,
        correctReviews: 2,
        targetLang: 'en'
      },
      {
        id: 'srs-en-2',
        word: 'Confident',
        translation: 'Özgüvenli, kendinden emin',
        phonetic: '/ˈkɒnfɪdənt/',
        partOfSpeech: 'Sıfat',
        level: 'B1',
        exampleSentence: 'Chirmo helps me feel confident when speaking English.',
        exampleTranslation: 'Chirmo İngilizce konuşurken kendime güvenmeme yardımcı oluyor.',
        repetitionCount: 0,
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedAt: today,
        nextReviewDate: today,
        masteryLevel: 'learning',
        totalReviews: 1,
        correctReviews: 0,
        targetLang: 'en'
      },
      {
        id: 'srs-en-3',
        word: 'Recommend',
        translation: 'Tavsiye etmek, önermek',
        phonetic: '/ˌrekəˈmend/',
        partOfSpeech: 'Fiil',
        level: 'A2',
        exampleSentence: 'What do you recommend for dinner?',
        exampleTranslation: 'Akşam yemeği için ne tavsiye edersiniz?',
        repetitionCount: 2,
        intervalDays: 3,
        easeFactor: 2.6,
        lastReviewedAt: today,
        nextReviewDate: today,
        masteryLevel: 'reviewing',
        totalReviews: 3,
        correctReviews: 3,
        targetLang: 'en'
      },
      // German
      {
        id: 'srs-de-1',
        word: 'Verbessern',
        translation: 'Geliştirmek, iyileştirmek',
        phonetic: '/fɛɐ̯ˈbɛsɐn/',
        partOfSpeech: 'Verb',
        level: 'A2',
        exampleSentence: 'Ich möchte mein Deutsch verbessern.',
        exampleTranslation: 'Almancamı geliştirmek istiyorum.',
        repetitionCount: 1,
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedAt: today,
        nextReviewDate: today,
        masteryLevel: 'reviewing',
        totalReviews: 1,
        correctReviews: 1,
        targetLang: 'de'
      },
      {
        id: 'srs-de-2',
        word: 'Empfehlen',
        translation: 'Tavsiye etmek, önermek',
        phonetic: '/ɛmˈpfeːlən/',
        partOfSpeech: 'Verb',
        level: 'B1',
        exampleSentence: 'Was können Sie mir empfehlen?',
        exampleTranslation: 'Bana ne tavsiye edebilirsiniz?',
        repetitionCount: 0,
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedAt: today,
        nextReviewDate: today,
        masteryLevel: 'learning',
        totalReviews: 0,
        correctReviews: 0,
        targetLang: 'de'
      },
      // French
      {
        id: 'srs-fr-1',
        word: 'Améliorer',
        translation: 'Geliştirmek, iyileştirmek',
        phonetic: '/a.me.ljɔ.ʁe/',
        partOfSpeech: 'Verbe',
        level: 'A2',
        exampleSentence: 'Je veux améliorer mon français.',
        exampleTranslation: 'Fransızcamı geliştirmek istiyorum.',
        repetitionCount: 1,
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedAt: today,
        nextReviewDate: today,
        masteryLevel: 'reviewing',
        totalReviews: 1,
        correctReviews: 1,
        targetLang: 'fr'
      },
      {
        id: 'srs-fr-2',
        word: 'Recommander',
        translation: 'Tavsiye etmek, önermek',
        phonetic: '/ʁə.kɔ.mɑ̃.de/',
        partOfSpeech: 'Verbe',
        level: 'B1',
        exampleSentence: 'Que me recommandez-vous pour le dîner ?',
        exampleTranslation: 'Akşam yemeği için bana ne tavsiye edersiniz?',
        repetitionCount: 0,
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedAt: today,
        nextReviewDate: today,
        masteryLevel: 'learning',
        totalReviews: 0,
        correctReviews: 0,
        targetLang: 'fr'
      }
    ];
    this.saveWords(defaults);
    return defaults;
  },

  saveWords(words: SrsWordData[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(words));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: words }));
      }
    } catch {
      // ignore
    }
  },

  getDueWords(targetLang?: 'en' | 'de' | 'fr'): SrsWordData[] {
    const all = this.getAllWords(targetLang);
    const now = new Date();
    return all.filter((w) => {
      const nextDate = new Date(w.nextReviewDate);
      return nextDate <= now || isSameDay(nextDate, now);
    });
  },

  addWord(word: {
    word: string;
    translation: string;
    phonetic?: string;
    partOfSpeech?: string;
    level?: string;
    exampleSentence?: string;
    exampleTranslation?: string;
    targetLang?: 'en' | 'de' | 'fr';
  }): SrsWordData {
    const all = this.getAllWords();
    const lang = word.targetLang || 'en';
    const existing = all.find(
      (w) => w.word.toLowerCase() === word.word.toLowerCase().trim() && (w.targetLang || 'en') === lang
    );
    if (existing) return existing;

    const today = new Date().toISOString();
    const newWord: SrsWordData = {
      id: `srs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      word: word.word.trim(),
      translation: word.translation.trim(),
      phonetic: word.phonetic || '/.../',
      partOfSpeech: word.partOfSpeech || 'Kelime',
      level: word.level || 'A1',
      exampleSentence: word.exampleSentence || `${word.word} is a useful word.`,
      exampleTranslation: word.exampleTranslation || `${word.word} faydalı bir ifadedir.`,
      repetitionCount: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      lastReviewedAt: today,
      nextReviewDate: today,
      masteryLevel: 'learning',
      totalReviews: 0,
      correctReviews: 0,
      targetLang: lang
    };

    all.unshift(newWord);
    this.saveWords(all);
    return newWord;
  },

  /**
   * SuperMemo SM-2 Tekrar Yanıtını Kaydet
   */
  recordReview(id: string, isCorrect: boolean, rating: 1 | 2 | 3 | 4 | 5 = isCorrect ? 4 : 1): SrsWordData | null {
    const all = this.getAllWords();
    const index = all.findIndex((w) => w.id === id);
    if (index === -1) return null;

    const item = { ...all[index] };
    item.totalReviews += 1;
    const now = new Date();
    item.lastReviewedAt = now.toISOString();

    if (isCorrect && rating >= 3) {
      item.correctReviews += 1;
      if (item.repetitionCount === 0) {
        item.intervalDays = 1;
      } else if (item.repetitionCount === 1) {
        item.intervalDays = 3;
      } else {
        item.intervalDays = Math.round(item.intervalDays * item.easeFactor);
      }
      item.repetitionCount += 1;

      // SuperMemo SM-2 Ease Factor hesaplama
      item.easeFactor = Math.max(
        1.3,
        item.easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
      );

      if (item.repetitionCount >= 4) {
        item.masteryLevel = 'mastered';
      } else {
        item.masteryLevel = 'reviewing';
      }
    } else {
      // Unutulduğunda sıfırlama (Ebbinghaus kuralı)
      item.repetitionCount = 0;
      item.intervalDays = 1;
      item.easeFactor = Math.max(1.3, item.easeFactor - 0.2);
      item.masteryLevel = 'learning';
    }

    const nextDate = new Date(now.getTime() + item.intervalDays * 86400000);
    item.nextReviewDate = nextDate.toISOString();

    all[index] = item;
    this.saveWords(all);
    return item;
  },

  deleteWord(id: string): void {
    const all = this.getAllWords().filter((w) => w.id !== id);
    this.saveWords(all);
  },

  /**
   * Birleşik Aralıklı Tekrar Kuyruğu (Unified Review Queue):
   * 1) Bugün tekrarı gelen kelimeler
   * 2) Error Vault'taki çözülmemiş kullanıcı hataları
   */
  getUnifiedReviewQueue(targetLang: 'en' | 'de' | 'fr' = 'en'): SrsReviewItem[] {
    const queue: SrsReviewItem[] = [];

    // 1. Due kelimeler
    const dueWords = this.getDueWords(targetLang);
    for (const w of dueWords) {
      queue.push({
        id: `word-${w.id}`,
        sourceType: 'vocabulary',
        targetLang: w.targetLang || 'en',
        frontPrompt: w.translation,
        frontSubPrompt: w.exampleTranslation,
        backText: w.word,
        backExplanationTr: `${w.partOfSpeech} • ${w.phonetic} • Örn: "${w.exampleSentence}"`,
        audioText: w.word,
        repetition: w.repetitionCount,
        intervalDays: w.intervalDays,
        easeFactor: w.easeFactor,
        nextReviewDate: w.nextReviewDate,
        rawItem: w
      });
    }

    // 2. Unresolved hatalar
    const unresolvedMistakes = AiCorrectionService.getUnresolvedMistakes(targetLang);
    for (const m of unresolvedMistakes) {
      queue.push({
        id: `mistake-${m.id}`,
        sourceType: 'mistake',
        targetLang: m.targetLang,
        frontPrompt: `Hatanı Düzelt: "${m.originalText}"`,
        frontSubPrompt: m.explanationTr,
        backText: m.correctedText,
        backExplanationTr: m.nativeAlternative
          ? `Doğal İfade: "${m.nativeAlternative}" • ${m.explanationTr}`
          : m.explanationTr,
        audioText: m.correctedText,
        repetition: m.reviewCount || 0,
        intervalDays: 1,
        easeFactor: 2.5,
        nextReviewDate: m.lastReviewedAt || new Date().toISOString(),
        rawItem: m
      });
    }

    return queue;
  },

  /**
   * Birleşik kuyruktaki öğeyi puanlayıp kaydet
   */
  recordUnifiedReview(item: SrsReviewItem, rating: SrsRating): void {
    if (item.sourceType === 'vocabulary' && item.rawItem?.id) {
      this.recordReview(item.rawItem.id, rating >= 3, rating);
    } else if (item.sourceType === 'mistake' && item.rawItem?.id) {
      if (rating >= 4) {
        AiCorrectionService.markMistakeAsMastered(item.rawItem.id);
      }
    }
  },

  getStats(targetLang?: 'en' | 'de' | 'fr') {
    const all = this.getAllWords(targetLang);
    const due = this.getDueWords(targetLang);
    const mastered = all.filter((w) => w.masteryLevel === 'mastered');
    const reviewing = all.filter((w) => w.masteryLevel === 'reviewing');
    const learning = all.filter((w) => w.masteryLevel === 'learning');

    const totalReviews = all.reduce((acc, w) => acc + w.totalReviews, 0);
    const totalCorrect = all.reduce((acc, w) => acc + w.correctReviews, 0);
    const retentionRate = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 100;

    return {
      totalWords: all.length,
      dueCount: due.length,
      masteredCount: mastered.length,
      reviewingCount: reviewing.length,
      learningCount: learning.length,
      retentionRate
    };
  },

  subscribe(callback: (words: SrsWordData[]) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => {
      callback(SpacedRepetitionService.getAllWords());
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }
};

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
