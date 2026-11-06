import {
  CEFRLevel,
  LearningMode,
  VocabularyWord,
  DailyGoalProgress,
  ExploredArticle,
  WritingAnalysisResult,
  WritingSuggestion
} from '../types';
import { TargetLanguageService } from './targetLanguageService';

const STORAGE_KEYS = {
  VOCABULARY: 'chirmo_vocabulary_v1',
  PROGRESS: 'chirmo_learning_progress_v1',
  MODE: 'chirmo_active_learning_mode_v1',
  RECENT_SELECTIONS: 'chirmo_recent_selections_v1',
  VOICE_ACCENT: 'chirmo_voice_accent',
  VOICE_RATE: 'chirmo_voice_rate'
};

export type VoiceAccentId = 'us' | 'uk' | 'au' | 'robot';

export interface VoiceAccentConfig {
  id: VoiceAccentId;
  label: string;
  country: string;
  flag: string;
  personaName: string;
  lang: string;
  pitch: number;
  rate: number;
  description: string;
  sampleText: string;
}

export const BUILTIN_VOICE_ACCENTS: VoiceAccentConfig[] = [
  {
    id: 'us',
    label: 'Amerikan İngilizcesi',
    country: 'United States',
    flag: '🇺🇸',
    personaName: 'Alex (US)',
    lang: 'en-US',
    pitch: 1.0,
    rate: 0.95,
    description: 'Modern, akıcı ve uluslararası en yaygın kullanılan Amerikan aksanı.',
    sampleText: 'Hi there! I am Chirmo. I am here to help you practice English naturally.'
  },
  {
    id: 'uk',
    label: 'İngiliz İngilizcesi (BBC)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    personaName: 'Oliver (UK)',
    lang: 'en-GB',
    pitch: 1.05,
    rate: 0.9,
    description: 'Net, prestijli ve akademik ortamlarda tercih edilen Received Pronunciation.',
    sampleText: 'Good day! Splendid to meet you. Shall we polish your English pronunciation?'
  },
  {
    id: 'au',
    label: 'Avustralya İngilizcesi',
    country: 'Australia',
    flag: '🇦🇺',
    personaName: 'Liam (AU)',
    lang: 'en-AU',
    pitch: 0.95,
    rate: 0.95,
    description: 'Samimi, sıcak ve dinamik Okyanusya aksanı.',
    sampleText: "G'day mate! Awesome to have you here. Let us practice English together today!"
  },
  {
    id: 'robot',
    label: 'Chirmo Robot Klasik',
    country: 'Chirmo AI',
    flag: '🤖',
    personaName: 'Chirmo Bot',
    lang: 'en-US',
    pitch: 1.25,
    rate: 0.85,
    description: 'Net, heceleri ayrıştırılmış ve robotik sevimli öğrenme tonu.',
    sampleText: 'Beep boop! Chirmo online. Let us build your confidence step by step!'
  }
];

// Built-in foundational CEFR dictionary with Turkish definitions and contextual sentences
export const BUILTIN_DICTIONARY: Record<string, {
  translation: string;
  phonetic: string;
  partOfSpeech: string;
  level: CEFRLevel;
  exampleSentence: string;
  exampleTranslation: string;
  synonyms: string[];
  explanation: string;
}> = {
  improve: {
    translation: 'Geliştirmek, iyileştirmek',
    phonetic: '/ɪmˈpruːv/',
    partOfSpeech: 'Fiil (Verb)',
    level: 'B1',
    exampleSentence: 'Artificial intelligence is helping businesses improve their services and reduce costs.',
    exampleTranslation: 'Yapay zekâ işletmelerin hizmetlerini geliştirmelerine ve maliyetleri düşürmelerine yardımcı oluyor.',
    synonyms: ['enhance', 'upgrade', 'better', 'boost'],
    explanation: 'Bir durumun, yeteneğin veya nesnenin kalitesini artırmak için kullanılır. Hem kişisel gelişimde hem de iş dünyasında sıklıkla karşımıza çıkar.'
  },
  reduce: {
    translation: 'Azaltmak, düşürmek',
    phonetic: '/rɪˈdjuːs/',
    partOfSpeech: 'Fiil (Verb)',
    level: 'B1',
    exampleSentence: 'The new policy aims to reduce energy consumption across the city.',
    exampleTranslation: 'Yeni politika şehir genelinde enerji tüketimini azaltmayı amaçlıyor.',
    synonyms: ['decrease', 'diminish', 'lower', 'curb'],
    explanation: 'Miktar, fiyat, boyut veya yoğunluk açısından bir şeyi daha az hâle getirmek.'
  },
  crucial: {
    translation: 'Çok önemli, hayati, kritik',
    phonetic: '/ˈkruːʃəl/',
    partOfSpeech: 'Sıfat (Adjective)',
    level: 'B2',
    exampleSentence: 'Getting enough sleep is crucial for cognitive performance and memory.',
    exampleTranslation: 'Yeterli uyku almak bilişsel performans ve hafıza için hayati önem taşır.',
    synonyms: ['vital', 'essential', 'critical', 'imperative'],
    explanation: 'Herhangi bir sonucun başarısı veya başarısızlığı için belirleyici derecede kritik olan şeyler için kullanılır.'
  },
  sustainable: {
    translation: 'Sürdürülebilir',
    phonetic: '/səˈsteɪnəbl/',
    partOfSpeech: 'Sıfat (Adjective)',
    level: 'B2',
    exampleSentence: 'The company is shifting towards more sustainable manufacturing practices.',
    exampleTranslation: 'Şirket daha sürdürülebilir üretim uygulamalarına yöneliyor.',
    synonyms: ['viable', 'renewable', 'maintainable'],
    explanation: 'Doğal dengeleri bozmadan veya kaynakları tüketmeden uzun vadede devam ettirilebilen durumlar için kullanılır.'
  },
  implement: {
    translation: 'Uygulamak, yürürlüğe koymak',
    phonetic: '/ˈɪmplɪment/',
    partOfSpeech: 'Fiil (Verb)',
    level: 'B2',
    exampleSentence: 'We need to implement these changes before the end of this quarter.',
    exampleTranslation: 'Bu değişiklikleri bu çeyreğin sonundan önce hayata geçirmeliyiz.',
    synonyms: ['apply', 'execute', 'enforce', 'enact'],
    explanation: 'Bir planı, kararı veya sistemi fiilen yürürlüğe sokmak, pratiğe dökmek.'
  },
  inevitable: {
    translation: 'Kaçınılmaz, önlenemez',
    phonetic: '/ɪnˈevɪtəbl/',
    partOfSpeech: 'Sıfat (Adjective)',
    level: 'C1',
    exampleSentence: 'With rapid technological progress, automation has become inevitable in many industries.',
    exampleTranslation: 'Hızlı teknolojik ilerlemeyle birlikte birçok sektörde otomasyon kaçınılmaz hâle geldi.',
    synonyms: ['unavoidable', 'inescapable', 'fated'],
    explanation: 'Ne yapılırsa yapılsın gerçekleşmesi kesin olan durumları ifade eder.'
  },
  enhance: {
    translation: 'Geliştirmek, değerini/gücünü artırmak',
    phonetic: '/ɪnˈhɑːns/',
    partOfSpeech: 'Fiil (Verb)',
    level: 'B2',
    exampleSentence: 'Reading English news daily will significantly enhance your vocabulary.',
    exampleTranslation: 'Her gün İngilizce haber okumak kelime dağarcığınızı belirgin şekilde geliştirecektir.',
    synonyms: ['boost', 'augment', 'intensify', 'elevate'],
    explanation: 'Var olan bir kalitenin, çekiciliğin veya etkinliğin derecesini bir üst basamağa taşımak.'
  },
  collaborate: {
    translation: 'İş birliği yapmak, birlikte çalışmak',
    phonetic: '/kəˈlæbəreɪt/',
    partOfSpeech: 'Fiil (Verb)',
    level: 'B2',
    exampleSentence: 'Researchers across five universities collaborated on the climate study.',
    exampleTranslation: 'Beş farklı üniversitedeki araştırmacılar iklim araştırmasında iş birliği yaptı.',
    synonyms: ['cooperate', 'team up', 'work together'],
    explanation: 'Ortak bir hedefe ulaşmak amacıyla iki veya daha fazla kişinin/kurumun ortak emek harcaması.'
  },
  opportunity: {
    translation: 'Fırsat, olanak',
    phonetic: '/ˌɒpəˈtjuːnəti/',
    partOfSpeech: 'İsim (Noun)',
    level: 'A2',
    exampleSentence: 'Studying abroad is a great opportunity to practice speaking English.',
    exampleTranslation: 'Yurt dışında okumak İngilizce konuşma pratiği yapmak için harika bir fırsattır.',
    synonyms: ['chance', 'occasion', 'opening'],
    explanation: 'Kişinin lehine olabilecek, değerlendirilebilecek uygun durum veya zaman dilimi.'
  },
  challenge: {
    translation: 'Zorluk, meydan okuma',
    phonetic: '/ˈtʃælɪndʒ/',
    partOfSpeech: 'İsim / Fiil',
    level: 'B1',
    exampleSentence: 'Learning a new language is a challenge, but daily practice makes it enjoyable.',
    exampleTranslation: 'Yeni bir dil öğrenmek bir zorluktur, fakat günlük pratik onu keyifli kılar.',
    synonyms: ['obstacle', 'difficulty', 'test'],
    explanation: 'Çaba ve kararlılık gerektiren meşakkatli ama geliştirici durumlar.'
  },
  comprehend: {
    translation: 'Kavramak, tam olarak anlamak',
    phonetic: '/ˌkɒmprɪˈhend/',
    partOfSpeech: 'Fiil (Verb)',
    level: 'C1',
    exampleSentence: 'It took me a while to comprehend the full complexity of the algorithm.',
    exampleTranslation: 'Algoritmanın tüm karmaşıklığını tam olarak kavramam biraz zaman aldı.',
    synonyms: ['grasp', 'understand', 'fathom'],
    explanation: 'Sadece duymak veya görmek değil; derinlemesine zihinde çözüp manasını sindirmek.'
  },
  eloquent: {
    translation: 'Dili güzel kullanan, etkileyici konuşan / yazan',
    phonetic: '/ˈeləkwənt/',
    partOfSpeech: 'Sıfat (Adjective)',
    level: 'C2',
    exampleSentence: 'She gave an eloquent speech that moved the entire audience.',
    exampleTranslation: 'Tüm izleyicileri duygulandıran son derece etkileyici ve akıcı bir konuşma yaptı.',
    synonyms: ['articulate', 'expressive', 'persuasive'],
    explanation: 'Duygu ve fikirleri incelikli, akıcı ve ikna edici sözcüklerle aktarma becerisi.'
  }
};

export const CURATED_LEARNING_ARTICLES: ExploredArticle[] = [
  {
    id: 'art-1',
    title: 'BBC: How Artificial Intelligence is Reshaping Daily Life',
    category: 'Teknoloji',
    level: 'B1',
    readTime: '4 dk',
    url: 'https://www.bbc.com/news/technology',
    summary: 'Yapay zekanın iş dünyasında maliyetleri düşürmesi ve üretkenliği artırması üzerine güncel bir BBC analizi.',
    keywords: ['improve', 'reduce', 'sustainable', 'automation']
  },
  {
    id: 'art-2',
    title: 'MIT Tech Review: The Next Decade of Green Energy',
    category: 'Bilim & Enerji',
    level: 'B2',
    readTime: '6 dk',
    url: 'https://www.technologyreview.com',
    summary: 'Yenilenebilir enerji teknolojilerinin yaygınlaşması ve sürdürülebilir altyapı adımları.',
    keywords: ['sustainable', 'crucial', 'implement', 'efficiency']
  },
  {
    id: 'art-3',
    title: 'Simple English Wikipedia: History of The Internet',
    category: 'Tarih & Kültür',
    level: 'A2',
    readTime: '3 dk',
    url: 'https://simple.wikipedia.org/wiki/Internet',
    summary: 'A1-A2 seviyesinde sade İngilizceyle yazılmış, internetin doğuşu ve dünya çapındaki gelişimi.',
    keywords: ['opportunity', 'connect', 'network', 'information']
  },
  {
    id: 'art-4',
    title: 'The Economist: Global Economic Shifts and Emerging Markets',
    category: 'Ekonomi',
    level: 'C1',
    readTime: '8 dk',
    url: 'https://www.economist.com',
    summary: 'Gelişmiş analitik kelime dağarcığı içeren uluslararası piyasalar ve ticaret dinamikleri.',
    keywords: ['inevitable', 'comprehend', 'collaborate', 'forecast']
  }
];

export class LearningStorageService {
  // --- Progress & Goals ---
  public static getProgress(): DailyGoalProgress {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      const today = new Date().toISOString().split('T')[0];
      if (raw) {
        const parsed: DailyGoalProgress = JSON.parse(raw);
        // Reset daily stats if it is a new day
        if (parsed.lastActiveDate !== today) {
          const isNextDay = new Date(today).getTime() - new Date(parsed.lastActiveDate).getTime() <= 86400000 * 2;
          parsed.streakDays = isNextDay ? parsed.streakDays + 1 : 1;
          parsed.wordsLearnedToday = 0;
          parsed.readingMinutesToday = 0;
          parsed.lastActiveDate = today;
          this.saveProgress(parsed);
        }
        return parsed;
      }
    } catch {
      // Fallback
    }

    const initial: DailyGoalProgress = {
      targetWords: 10,
      wordsLearnedToday: 3,
      readingMinutesToday: 18,
      streakDays: 4,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalWordsLearned: 42,
      currentLevel: 'B1'
    };
    this.saveProgress(initial);
    return initial;
  }

  public static saveProgress(progress: DailyGoalProgress): void {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }

  public static setUserLevel(level: CEFRLevel): DailyGoalProgress {
    const p = this.getProgress();
    p.currentLevel = level;
    this.saveProgress(p);
    return p;
  }

  public static incrementDailyWordCount(count: number = 1): DailyGoalProgress {
    const p = this.getProgress();
    p.wordsLearnedToday += count;
    p.totalWordsLearned += count;
    this.saveProgress(p);
    return p;
  }

  public static addXP(amount: number): DailyGoalProgress {
    const p = this.getProgress();
    p.xp = (p.xp || 450) + amount;
    this.saveProgress(p);
    return p;
  }

  // --- Learning Mode ---
  public static getLearningMode(): LearningMode {
    return (localStorage.getItem(STORAGE_KEYS.MODE) as LearningMode) || 'reading';
  }

  public static setLearningMode(mode: LearningMode): void {
    localStorage.setItem(STORAGE_KEYS.MODE, mode);
  }

  // --- Vocabulary Vault ---
  public static getSavedWords(): VocabularyWord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }

    // Default starter pack for new users
    const starterWords: VocabularyWord[] = [
      {
        id: 'starter-1',
        word: 'improve',
        translation: 'Geliştirmek, iyileştirmek',
        phonetic: '/ɪmˈpruːv/',
        partOfSpeech: 'Fiil (Verb)',
        level: 'B1',
        exampleSentence: 'I want to improve my English speaking skills this month.',
        exampleTranslation: 'Bu ay İngilizce konuşma becerilerimi geliştirmek istiyorum.',
        learnedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
        reviewCount: 3,
        mastery: 75
      },
      {
        id: 'starter-2',
        word: 'reduce',
        translation: 'Azaltmak, düşürmek',
        phonetic: '/rɪˈdjuːs/',
        partOfSpeech: 'Fiil (Verb)',
        level: 'B1',
        exampleSentence: 'Artificial intelligence helps reduce business operational costs.',
        exampleTranslation: 'Yapay zekâ işletmelerin operasyonel maliyetlerini azaltmaya yardımcı olur.',
        learnedAt: new Date(Date.now() - 86400000).toISOString(),
        nextReviewAt: new Date(Date.now() + 86400000 * 2).toISOString(),
        reviewCount: 2,
        mastery: 60
      },
      {
        id: 'starter-3',
        word: 'sustainable',
        translation: 'Sürdürülebilir',
        phonetic: '/səˈsteɪnəbl/',
        partOfSpeech: 'Sıfat (Adjective)',
        level: 'B2',
        exampleSentence: 'Solar and wind are sustainable energy sources.',
        exampleTranslation: 'Güneş ve rüzgâr sürdürülebilir enerji kaynaklarıdır.',
        learnedAt: new Date().toISOString(),
        nextReviewAt: new Date(Date.now() + 86400000 * 3).toISOString(),
        reviewCount: 1,
        mastery: 40
      }
    ];
    this.saveWords(starterWords);
    return starterWords;
  }

  public static saveWords(words: VocabularyWord[]): void {
    localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(words));
  }

  public static addWord(item: {
    word: string;
    translation: string;
    phonetic?: string;
    partOfSpeech: string;
    level: CEFRLevel;
    exampleSentence: string;
    exampleTranslation: string;
    sourceUrl?: string;
    sourceContext?: string;
  }): VocabularyWord {
    const words = this.getSavedWords();
    const cleanWord = item.word.trim().toLowerCase();
    
    // Check if already exists
    const existing = words.find((w) => w.word.toLowerCase() === cleanWord);
    if (existing) {
      return existing;
    }

    const newWord: VocabularyWord = {
      id: 'vw-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      word: item.word.trim(),
      translation: item.translation,
      phonetic: item.phonetic,
      partOfSpeech: item.partOfSpeech,
      level: item.level,
      exampleSentence: item.exampleSentence,
      exampleTranslation: item.exampleTranslation,
      sourceUrl: item.sourceUrl,
      sourceContext: item.sourceContext,
      learnedAt: new Date().toISOString(),
      nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
      reviewCount: 0,
      mastery: 20
    };

    const updated = [newWord, ...words];
    this.saveWords(updated);
    this.incrementDailyWordCount(1);
    return newWord;
  }

  public static removeWord(id: string): void {
    const words = this.getSavedWords().filter((w) => w.id !== id);
    this.saveWords(words);
  }

  public static updateMastery(id: string, isCorrect: boolean): void {
    const words = this.getSavedWords().map((w) => {
      if (w.id === id) {
        const newCount = w.reviewCount + 1;
        const newMastery = isCorrect ? Math.min(100, w.mastery + 20) : Math.max(10, w.mastery - 15);
        // Spaced repetition interval (days = 2^(count-1))
        const intervalDays = isCorrect ? Math.min(30, Math.pow(2, newCount)) : 1;
        return {
          ...w,
          reviewCount: newCount,
          mastery: newMastery,
          nextReviewAt: new Date(Date.now() + 86400000 * intervalDays).toISOString()
        };
      }
      return w;
    });
    this.saveWords(words);
  }

  // --- Dictionary Lookup ---
  public static lookup(rawWord: string): {
    found: boolean;
    word: string;
    translation: string;
    phonetic: string;
    partOfSpeech: string;
    level: CEFRLevel;
    exampleSentence: string;
    exampleTranslation: string;
    synonyms: string[];
    explanation: string;
  } {
    const key = rawWord.trim().toLowerCase().replace(/[^a-z]/g, '');
    const entry = BUILTIN_DICTIONARY[key];
    if (entry) {
      return {
        found: true,
        word: rawWord,
        ...entry
      };
    }

    // Dynamic heuristic lookup for words not yet in local cache
    return {
      found: false,
      word: rawWord,
      translation: `[Çeviri aranıyor: ${rawWord}]`,
      phonetic: `/${rawWord.toLowerCase()}/`,
      partOfSpeech: 'Kelime',
      level: 'B1',
      exampleSentence: `Could you please explain what "${rawWord}" means in this context?`,
      exampleTranslation: `Bu bağlamda "${rawWord}" ifadesinin ne anlama geldiğini açıklayabilir misiniz?`,
      synonyms: [],
      explanation: 'Bu kelimeyi Chirmo AI Öğretmen paneline sorarak detaylı gramer analizini ve bağlamsal kullanımını görebilirsiniz.'
    };
  }

  // --- Accent & Voice Persona Preferences ---
  public static getAvailableAccents(): VoiceAccentConfig[] {
    return BUILTIN_VOICE_ACCENTS;
  }

  public static getSelectedAccent(): VoiceAccentId {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VOICE_ACCENT);
      if (stored === 'us' || stored === 'uk' || stored === 'au' || stored === 'robot') {
        return stored;
      }
    } catch {}
    return 'us';
  }

  public static setSelectedAccent(accent: VoiceAccentId): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE_ACCENT, accent);
    } catch {}
  }

  public static getSpeechRate(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VOICE_RATE);
      if (stored) {
        const val = parseFloat(stored);
        if (!isNaN(val) && val >= 0.6 && val <= 1.5) return val;
      }
    } catch {}
    return 0.9;
  }

  public static setSpeechRate(rate: number): void {
    const clamped = Math.min(1.5, Math.max(0.6, Math.round(rate * 100) / 100));
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE_RATE, clamped.toString());
    } catch {}
  }

  // --- Audio Pronunciation (Web Speech API) ---
  public static speak(text: string, customAccentId?: VoiceAccentId, customRate?: number): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const accentId = customAccentId || LearningStorageService.getSelectedAccent();
      const config = BUILTIN_VOICE_ACCENTS.find(a => a.id === accentId) || BUILTIN_VOICE_ACCENTS[0];

      const activeLang = TargetLanguageService.getTargetLanguage();
      const targetSpeechLang = activeLang === 'de' ? 'de-DE' : config.lang;

      utterance.lang = targetSpeechLang;
      utterance.pitch = config.pitch;
      utterance.rate = customRate ?? LearningStorageService.getSpeechRate();

      // Find best available browser voice matching the target lang
      if ('getVoices' in window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(
          v => v.lang === targetSpeechLang || v.lang.startsWith(targetSpeechLang.split('-')[0])
        );
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // --- Writing Assistant & Proofreader ---
  public static analyzeWriting(
    text: string,
    tone: 'formal' | 'casual' | 'academic' | 'friendly' = 'formal'
  ): WritingAnalysisResult {
    const suggestions: WritingSuggestion[] = [];
    let improved = text;

    const rules = [
      {
        regex: /\bI am agree\b/gi,
        rep: 'I agree',
        type: 'grammar' as const,
        expl: '"agree" bir fiildir; İngilizcede "am" yardımcı fiili ile birlikte kullanılmaz.'
      },
      {
        regex: /\bexplain me\b/gi,
        rep: 'explain to me',
        type: 'grammar' as const,
        expl: '"explain" fiili dolaylı nesne aldığında "to" edatına ihtiyaç duyar.'
      },
      {
        regex: /\blook forward to hear\b/gi,
        rep: 'look forward to hearing',
        type: 'grammar' as const,
        expl: '"look forward to" kalıbından sonra gelen fiil daima -ing takısı alır.'
      },
      {
        regex: /\binterested about\b/gi,
        rep: 'interested in',
        type: 'grammar' as const,
        expl: '"interested" sıfatı İngilizcede "about" yerine "in" edatıyla eşleşir.'
      },
      {
        regex: /\bvery good\b/gi,
        rep: tone === 'formal' || tone === 'academic' ? 'exceptional' : 'terrific',
        type: 'vocabulary' as const,
        expl: '"very good" yerine daha nitelikli bir CEFR B2/C1 sıfatı metninizin profesyonelliğini artırır.'
      },
      {
        regex: /\ba lot of\b/gi,
        rep: tone === 'formal' || tone === 'academic' ? 'a substantial number of' : 'plenty of',
        type: 'vocabulary' as const,
        expl: 'Resmi yazılarda "a lot of" yerine daha kurumsal ve akademik ifadeler tercih edilir.'
      },
      {
        regex: /\bneed to\b/gi,
        rep: tone === 'formal' ? 'are required to' : 'should',
        type: 'tone' as const,
        expl: 'Ton ayarına bağlı olarak daha nazik ve kurumsal bir zorunluluk ifadesi seçildi.'
      }
    ];

    rules.forEach((rule, idx) => {
      if (rule.regex.test(improved)) {
        const match = text.match(rule.regex);
        suggestions.push({
          id: 'sug-' + idx,
          original: match ? match[0] : '',
          replacement: rule.rep,
          type: rule.type,
          explanation: rule.expl
        });
        improved = improved.replace(rule.regex, rule.rep);
      }
    });

    const words = text.trim().split(/\s+/).filter(Boolean);
    const avgLen = words.reduce((acc, w) => acc + w.length, 0) / (words.length || 1);
    let detectedLevel: CEFRLevel = 'B1';
    if (avgLen > 6.5) detectedLevel = 'C1';
    else if (avgLen > 5.5) detectedLevel = 'B2';
    else if (avgLen < 4.2) detectedLevel = 'A2';

    return {
      originalText: text,
      improvedText: improved,
      readabilityScore: Math.min(100, Math.max(60, 95 - suggestions.length * 6)),
      detectedLevel,
      suggestions
    };
  }
}
