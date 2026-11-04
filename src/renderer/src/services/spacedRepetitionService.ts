// Chirmo Akıllı Aralıklı Tekrar (SRS - Spaced Repetition System) Motoru
// Ebbinghaus Unutma Eğrisi ve SuperMemo SM-2 Prensipleri Temel Alınmıştır.
// Amaç: Kullanıcının öğrendiği İngilizce kelimeleri 3 günde unutmasını engellemek,
// zorlandığı kelimeleri sık, ustalaştığı kelimeleri aralıklı periyotlarla hatırlatmak.

import { VocabularyWord } from '../types';

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
}

const SRS_STORAGE_KEY = 'chirmo_srs_vocabulary_v2';
const EVENT_NAME = 'chirmo_srs_updated';

export const SpacedRepetitionService = {
  getAllWords(): SrsWordData[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(SRS_STORAGE_KEY);
      if (!raw) return this.getInitialWords();
      const parsed: SrsWordData[] = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : this.getInitialWords();
    } catch {
      return this.getInitialWords();
    }
  },

  getInitialWords(): SrsWordData[] {
    const today = new Date().toISOString();
    const defaults: SrsWordData[] = [
      {
        id: 'srs-1',
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
        correctReviews: 2
      },
      {
        id: 'srs-2',
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
        correctReviews: 0
      },
      {
        id: 'srs-3',
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
        correctReviews: 3
      },
      {
        id: 'srs-4',
        word: 'Fluently',
        translation: 'Akıcı bir şekilde',
        phonetic: '/ˈfluːəntli/',
        partOfSpeech: 'Zarf',
        level: 'B1',
        exampleSentence: 'She speaks English very fluently.',
        exampleTranslation: 'O çok akıcı bir şekilde İngilizce konuşuyor.',
        repetitionCount: 0,
        intervalDays: 1,
        easeFactor: 2.5,
        lastReviewedAt: today,
        nextReviewDate: today,
        masteryLevel: 'learning',
        totalReviews: 0,
        correctReviews: 0
      },
      {
        id: 'srs-5',
        word: 'Opportunity',
        translation: 'Fırsat, imkân',
        phonetic: '/ˌɒpəˈtjuːnəti/',
        partOfSpeech: 'İsim',
        level: 'B1',
        exampleSentence: 'Learning English gives you better career opportunities.',
        exampleTranslation: 'İngilizce öğrenmek size daha iyi kariyer fırsatları sunar.',
        repetitionCount: 3,
        intervalDays: 7,
        easeFactor: 2.7,
        lastReviewedAt: today,
        nextReviewDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        masteryLevel: 'mastered',
        totalReviews: 4,
        correctReviews: 4
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

  /**
   * Bugün tekrar edilmesi gereken kelimeler (Due for review)
   */
  getDueWords(): SrsWordData[] {
    const all = this.getAllWords();
    const now = new Date();
    return all.filter((w) => {
      const nextDate = new Date(w.nextReviewDate);
      return nextDate <= now || isSameDay(nextDate, now);
    });
  },

  /**
   * Yeni kelime ekle
   */
  addWord(word: {
    word: string;
    translation: string;
    phonetic?: string;
    partOfSpeech?: string;
    level?: string;
    exampleSentence?: string;
    exampleTranslation?: string;
  }): SrsWordData {
    const all = this.getAllWords();
    const existing = all.find((w) => w.word.toLowerCase() === word.word.toLowerCase().trim());
    if (existing) return existing;

    const today = new Date().toISOString();
    const newWord: SrsWordData = {
      id: `srs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      word: word.word.trim(),
      translation: word.translation.trim(),
      phonetic: word.phonetic || '/.../',
      partOfSpeech: word.partOfSpeech || 'Kelime',
      level: word.level || 'A1',
      exampleSentence: word.exampleSentence || `${word.word} is a useful English word.`,
      exampleTranslation: word.exampleTranslation || `${word.word} faydalı bir İngilizce kelimedir.`,
      repetitionCount: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      lastReviewedAt: today,
      nextReviewDate: today, // Hemen pratik için uygun
      masteryLevel: 'learning',
      totalReviews: 0,
      correctReviews: 0
    };

    all.unshift(newWord);
    this.saveWords(all);
    return newWord;
  },

  /**
   * SM-2 Tekrar Yanıtını Kaydet (isCorrect: true | false, rating: 1 (Zor), 3 (İyi), 5 (Kolay))
   */
  recordReview(id: string, isCorrect: boolean, rating: 1 | 3 | 5 = isCorrect ? 3 : 1): SrsWordData | null {
    const all = this.getAllWords();
    const index = all.findIndex((w) => w.id === id);
    if (index === -1) return null;

    const item = { ...all[index] };
    item.totalReviews += 1;
    const now = new Date();
    item.lastReviewedAt = now.toISOString();

    if (isCorrect) {
      item.correctReviews += 1;
      if (item.repetitionCount === 0) {
        item.intervalDays = 1;
      } else if (item.repetitionCount === 1) {
        item.intervalDays = 3;
      } else {
        item.intervalDays = Math.round(item.intervalDays * item.easeFactor);
      }
      item.repetitionCount += 1;

      // Ease factor güncelleme
      item.easeFactor = Math.max(
        1.3,
        item.easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
      );

      // Mastery derecesi
      if (item.repetitionCount >= 4) {
        item.masteryLevel = 'mastered';
      } else {
        item.masteryLevel = 'reviewing';
      }
    } else {
      // Yanlış cevapta sıfırlama (Ebbinghaus kuralı)
      item.repetitionCount = 0;
      item.intervalDays = 1;
      item.easeFactor = Math.max(1.3, item.easeFactor - 0.2);
      item.masteryLevel = 'learning';
    }

    // Gelecek tekrar tarihi
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
   * İstatistikler (Hafıza Kalıcılık Oranı ve Durum)
   */
  getStats() {
    const all = this.getAllWords();
    const due = this.getDueWords();
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
