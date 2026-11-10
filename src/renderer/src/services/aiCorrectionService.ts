// Chirmo AI Anlık Düzeltme & Akıllı Hata Kasası (Personal Error Vault)
// Kullanıcının İngilizce, Almanca ve Fransızca konuşmalarındaki/yazılarındaki
// gramer, edat, kelime ve akıcılık hatalarını tespit eder, Türkçe açıklar ve
// yerel hata kasasına kaydederek aralıklı tekrar için saklar.

import { GeminiAiTeacherService } from './geminiAiTeacherService';

export type ErrorCategory =
  | 'grammar'
  | 'vocabulary'
  | 'word_order'
  | 'preposition'
  | 'article'
  | 'spelling'
  | 'fluency';

export interface SentenceCorrectionAnalysis {
  originalText: string;
  isPerfect: boolean;
  correctedText: string;
  nativeAlternative: string;
  explanationTr: string;
  errorCategory?: ErrorCategory;
  detectedMistakeWord?: string;
  targetLang: 'en' | 'de' | 'fr';
  analyzedAt: string;
}

export interface UserMistakeRecord extends SentenceCorrectionAnalysis {
  id: string;
  reviewCount: number;
  mastered: boolean;
  lastReviewedAt?: string;
}

const VAULT_STORAGE_KEY = 'chirmo_error_vault_v1';
const VAULT_EVENT_NAME = 'chirmo_error_vault_updated';

// Türk öğrencilerin en sık düştüğü hedef dil tuzakları için hızlı pedagojik kurallar
interface PedagogicalRule {
  lang: 'en' | 'de' | 'fr';
  regex: RegExp;
  category: ErrorCategory;
  correction: (text: string, match: RegExpMatchArray) => string;
  nativeAlternative: string | ((match: RegExpMatchArray) => string);
  explanationTr: string;
  mistakeWord: string;
}

const PEDAGOGICAL_RULES: PedagogicalRule[] = [
  // --- ENGLİSH ---
  {
    lang: 'en',
    regex: /\bi\s+(?:am\s+|'m\s+)?agree(?:\s+with\s+(.+?))?(?:\.|\?|!|$)/i,
    category: 'grammar',
    correction: (_text, match) => `I agree${match[1] ? ` with ${match[1]}` : ''}.`,
    nativeAlternative: 'I totally agree with you on that / I share your view.',
    explanationTr: "İngilizce'de 'agree' bir sıfat değil, doğrudan fiildir. Bu yüzden 'I am agree' denmez; 'I agree' denir.",
    mistakeWord: 'am agree'
  },
  {
    lang: 'en',
    regex: /\bi\s+have\s+(\d+)\s+years\s+old\b/i,
    category: 'grammar',
    correction: (_text, match) => `I am ${match[1]} years old.`,
    nativeAlternative: (match) => `I'm ${match[1]} / I'm currently ${match[1]} years old.`,
    explanationTr: "İngilizce'de yaş belirtilirken Türkçe'deki gibi 'sahip olmak (have)' değil, 'be (am/is/are)' fiili kullanılır: 'I am 25 years old'.",
    mistakeWord: 'have ... years old'
  },
  {
    lang: 'en',
    regex: /\b(he|she|it)\s+don'?t\b/i,
    category: 'grammar',
    correction: (text) => text.replace(/\b(he|she|it)\s+don'?t\b/gi, (_m, p1) => `${p1} doesn't`),
    nativeAlternative: "He doesn't think so / She doesn't mind.",
    explanationTr: "Geniş zamanda (Simple Present) 3. tekil şahıslar (He / She / It) ile olumsuzluk eki 'don't' değil 'doesn't' olmalıdır.",
    mistakeWord: "don't"
  },
  {
    lang: 'en',
    regex: /\b(he|she|it)\s+do\s+not\b/i,
    category: 'grammar',
    correction: (text) => text.replace(/\b(he|she|it)\s+do\s+not\b/gi, (_m, p1) => `${p1} does not`),
    nativeAlternative: 'He does not know the details yet.',
    explanationTr: "He/She/It özneleriyle 'do not' yerine 'does not' kullanılır.",
    mistakeWord: 'do not'
  },
  {
    lang: 'en',
    regex: /\blook(?:ing)?\s+forward\s+to\s+see\b/i,
    category: 'grammar',
    correction: (text) => text.replace(/look(?:ing)?\s+forward\s+to\s+see\b/gi, 'looking forward to seeing'),
    nativeAlternative: "I'm really looking forward to meeting you.",
    explanationTr: "'look forward to' kalıbındaki 'to' bir edattır (preposition); bu yüzden ardından gelen fiil daima '-ing' alır (seeing).",
    mistakeWord: 'to see'
  },
  {
    lang: 'en',
    regex: /\bdepend\s+of\b/i,
    category: 'preposition',
    correction: (text) => text.replace(/\bdepend\s+of\b/gi, 'depend on'),
    nativeAlternative: 'It really depends on the situation.',
    explanationTr: "'depend' fiili 'of' ile değil, daima 'on' edatıyla kullanılır (depend on).",
    mistakeWord: 'depend of'
  },
  {
    lang: 'en',
    regex: /\blisten\s+(me|him|her|them|us)\b/i,
    category: 'preposition',
    correction: (text) => text.replace(/\blisten\s+(me|him|her|them|us)\b/gi, 'listen to $1'),
    nativeAlternative: 'Please hear me out / Listen to what I have to say.',
    explanationTr: "'listen' fiili bir nesneyi dinlerken araya 'to' edatı alır: 'listen to me'.",
    mistakeWord: 'listen me'
  },
  {
    lang: 'en',
    regex: /\bmake\s+a\s+party\b/i,
    category: 'fluency',
    correction: (text) => text.replace(/\bmake\s+a\s+party\b/gi, 'throw a party'),
    nativeAlternative: "We're throwing a celebration party this weekend.",
    explanationTr: "İngilizce'de parti vermek için 'make a party' yerine 'throw a party' veya 'have a party' doğal kullanımdır.",
    mistakeWord: 'make a party'
  },

  // --- GERMAN ---
  {
    lang: 'de',
    regex: /\b(?:will|möchte)\s+arzt\s+bekommen\b/i,
    category: 'vocabulary',
    correction: () => 'Ich will Arzt werden.',
    nativeAlternative: 'Ich möchte gerne Arzt werden / Ich strebe den Arztberuf an.',
    explanationTr: "Almanca'da 'bekommen' almak/edinmek anlamına gelir (false friend). Bir meslek sahibi olmak için 'werden' (olmak) fiili kullanılır.",
    mistakeWord: 'bekommen'
  },
  {
    lang: 'de',
    regex: /\bich\s+bin\s+hunger\b/i,
    category: 'grammar',
    correction: () => 'Ich habe Hunger.',
    nativeAlternative: 'Ich habe großen Hunger / Ich verhungere fast!',
    explanationTr: "Almanca'da açlık bir durum sıfatı değil, 'sahip olunan bir his' olarak 'haben' fiiliyle söylenir: 'Ich habe Hunger'.",
    mistakeWord: 'bin Hunger'
  },
  {
    lang: 'de',
    regex: /\bich\s+bin\s+(\d+)\s+jahre\b(?! alt)/i,
    category: 'grammar',
    correction: (_text, match) => `Ich bin ${match[1]} Jahre alt.`,
    nativeAlternative: (match) => `Ich bin ${match[1]} Jahre alt.`,
    explanationTr: "Almanca'da yaş belirtirken 'Jahre' kelimesinden sonra mutlaka 'alt' eklenir: 'Ich bin ... Jahre alt'.",
    mistakeWord: 'Jahre'
  },
  {
    lang: 'de',
    regex: /\bwarte\s+für\s+dich\b/i,
    category: 'preposition',
    correction: (text) => text.replace(/\bwarte\s+für\s+dich\b/gi, 'warte auf dich'),
    nativeAlternative: 'Ich freue mich darauf, dich zu sehen.',
    explanationTr: "Almanca'da birini beklemek anlamındaki 'warten' fiili 'für' değil, 'auf (+Akkusativ)' edatıyla kullanılır: 'Ich warte auf dich'.",
    mistakeWord: 'für dich'
  },
  {
    lang: 'de',
    regex: /\bweil\s+ich\s+bin\s+(.+?)(?:\.|$)/i,
    category: 'word_order',
    correction: (_text, match) => `weil ich ${match[1].trim()} bin.`,
    nativeAlternative: (match) => `da ich ${match[1].trim()} bin.`,
    explanationTr: "Almanca'da 'weil' bir yan cümle (Nebensatz) bağlacıdır ve çekimli fiili daima cümlenin en sonuna atar.",
    mistakeWord: 'weil ich bin'
  },

  // --- FRENCH ---
  {
    lang: 'fr',
    regex: /\bje\s+suis\s+faim\b/i,
    category: 'grammar',
    correction: () => "J'ai faim.",
    nativeAlternative: "J'ai une faim de loup !",
    explanationTr: "Fransızca'da açlık 'être' (olmak) ile değil, 'avoir' (sahip olmak) fiiliyle ifade edilir: 'J'ai faim'.",
    mistakeWord: 'suis faim'
  },
  {
    lang: 'fr',
    regex: /\bje\s+suis\s+(\d+)\s+ans\b/i,
    category: 'grammar',
    correction: (_text, match) => `J'ai ${match[1]} ans.`,
    nativeAlternative: (match) => `J'ai actuellement ${match[1]} ans.`,
    explanationTr: "Fransızca'da yaş belirtirken 'être' değil 'avoir' kullanılır: 'J'ai ... ans'.",
    mistakeWord: 'suis ... ans'
  },
  {
    lang: 'fr',
    regex: /\battendre\s+pour\b/i,
    category: 'preposition',
    correction: (text) => text.replace(/\battendre\s+pour\b/gi, 'attendre'),
    nativeAlternative: "Je t'attends / J'attends le bus.",
    explanationTr: "Fransızca'da 'attendre' fiili nesnesini doğrudan alır, araya İngilizce 'wait for' gibi 'pour' koyulmaz.",
    mistakeWord: 'attendre pour'
  },
  {
    lang: 'fr',
    regex: /\bvisiter\s+(?:à\s+)?(mes\s+parents|mon\s+ami|ma\s+mère|mon\s+père)\b/i,
    category: 'vocabulary',
    correction: (_text, match) => `rendre visite à ${match[1]}`,
    nativeAlternative: (match) => `Je vais rendre visite à ${match[1]}.`,
    explanationTr: "Fransızca'da insanlar ziyaret edilirken 'visiter' yerine 'rendre visite à' kullanılır ('visiter' yalnızca mekan ve şehirler içindir).",
    mistakeWord: 'visiter'
  }
];

export class AiCorrectionService {
  /**
   * Cümleyi analiz eder. Hata varsa düzeltmeyi, Türkçe açıklamayı ve yerli alternatifini döner.
   */
  public static async analyzeSentence(
    text: string,
    targetLang: 'en' | 'de' | 'fr' = 'en'
  ): Promise<SentenceCorrectionAnalysis> {
    const trimmed = (text || '').trim();
    const now = new Date().toISOString();

    if (!trimmed) {
      return {
        originalText: '',
        isPerfect: true,
        correctedText: '',
        nativeAlternative: '',
        explanationTr: '',
        targetLang,
        analyzedAt: now
      };
    }

    // 1. Öncelikli Hızlı Pedagojik Kural Denetimi
    for (const rule of PEDAGOGICAL_RULES) {
      if (rule.lang === targetLang) {
        const match = trimmed.match(rule.regex);
        if (match) {
          const corrected = rule.correction(trimmed, match);
          const alt = typeof rule.nativeAlternative === 'function'
            ? rule.nativeAlternative(match)
            : rule.nativeAlternative;
          return {
            originalText: trimmed,
            isPerfect: false,
            correctedText: corrected,
            nativeAlternative: alt,
            explanationTr: rule.explanationTr,
            errorCategory: rule.category,
            detectedMistakeWord: rule.mistakeWord,
            targetLang,
            analyzedAt: now
          };
        }
      }
    }

    // 2. Eğer Gemini API anahtarı varsa ve cümle yeterince uzunsa LLM ile derinlemesine analiz et
    const apiKey = GeminiAiTeacherService.getApiKey();
    if (apiKey && trimmed.split(/\s+/).length >= 3) {
      try {
        const llmResult = await this.queryGeminiCorrection(trimmed, targetLang, apiKey);
        if (llmResult) return llmResult;
      } catch {
        // Fallback to heuristic
      }
    }

    // 3. Basit dil bilgisi doğruluk heuristiği
    // Özel bariz hatalar yakalanmadıysa ve cümle makul görünüyorsa kusursuz kabul et
    const isLikelyPerfect = this.checkBasicPunctuationAndStructure(trimmed);

    return {
      originalText: trimmed,
      isPerfect: isLikelyPerfect,
      correctedText: trimmed,
      nativeAlternative: this.generateNativeAlternative(trimmed, targetLang),
      explanationTr: isLikelyPerfect
        ? 'Tebrikler! Cümleniz dilbilgisi ve akıcılık açısından gayet doğal ve doğru.'
        : 'Cümleniz anlaşılır, ancak daha akıcı bir yapı tercih edilebilir.',
      targetLang,
      analyzedAt: now
    };
  }

  private static checkBasicPunctuationAndStructure(text: string): boolean {
    if (text.length < 3) return true;
    // En yaygın tuhaf yazımlar
    if (/(\b[a-z]{1,4}\b)\s+\1/i.test(text)) return false; // arka arkaya tekrarlanan kelime
    return true;
  }

  private static generateNativeAlternative(text: string, lang: 'en' | 'de' | 'fr'): string {
    if (lang === 'de') {
      return text.endsWith('.') ? text : `${text}.`;
    }
    if (lang === 'fr') {
      return text.endsWith('.') ? text : `${text}.`;
    }
    return text.endsWith('.') ? text : `${text}.`;
  }

  /**
   * Gemini Flash API'si ile yapılandırılmış JSON gramer ve akıcılık analizi
   */
  private static async queryGeminiCorrection(
    text: string,
    targetLang: 'en' | 'de' | 'fr',
    apiKey: string
  ): Promise<SentenceCorrectionAnalysis | null> {
    const langNames = { en: 'English', de: 'German', fr: 'French' };
    const prompt = `You are Chirmo's expert AI Language Evaluator for Turkish speakers learning ${langNames[targetLang]}.
Analyze the following learner sentence: "${text}".
Return ONLY a valid JSON object matching this schema:
{
  "isPerfect": boolean,
  "correctedText": string,
  "nativeAlternative": string,
  "explanationTr": string (clear pedagogical explanation in Turkish of why this correction was made, or praise if perfect),
  "errorCategory": "grammar" | "vocabulary" | "word_order" | "preposition" | "article" | "spelling" | "fluency",
  "detectedMistakeWord": string
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
      })
    });

    if (!resp.ok) return null;
    const data = await resp.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) return null;

    const parsed = JSON.parse(candidate);
    return {
      originalText: text,
      isPerfect: Boolean(parsed.isPerfect),
      correctedText: parsed.correctedText || text,
      nativeAlternative: parsed.nativeAlternative || text,
      explanationTr: parsed.explanationTr || 'Başarılı telaffuz ve ifade.',
      errorCategory: parsed.errorCategory,
      detectedMistakeWord: parsed.detectedMistakeWord,
      targetLang,
      analyzedAt: new Date().toISOString()
    };
  }

  // ==================== PERSONAL ERROR VAULT STORAGE ====================

  public static getAllMistakes(): UserMistakeRecord[] {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(VAULT_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public static getUnresolvedMistakes(targetLang?: 'en' | 'de' | 'fr'): UserMistakeRecord[] {
    const all = this.getAllMistakes();
    return all.filter((m) => !m.mastered && (!targetLang || m.targetLang === targetLang));
  }

  public static saveMistake(analysis: SentenceCorrectionAnalysis): UserMistakeRecord {
    const all = this.getAllMistakes();
    const existingIndex = all.findIndex(
      (m) =>
        m.originalText.toLowerCase().trim() === analysis.originalText.toLowerCase().trim() &&
        m.targetLang === analysis.targetLang
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      all[existingIndex].reviewCount = (all[existingIndex].reviewCount || 0) + 1;
      all[existingIndex].lastReviewedAt = now;
      all[existingIndex].mastered = false; // Tekrar hata yapıldığı için aktif edildi
      this.persistVault(all);
      return all[existingIndex];
    }

    const newRecord: UserMistakeRecord = {
      ...analysis,
      id: `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      reviewCount: 1,
      mastered: false,
      lastReviewedAt: now
    };

    all.unshift(newRecord);
    this.persistVault(all);
    return newRecord;
  }

  public static markMistakeAsMastered(id: string): boolean {
    const all = this.getAllMistakes();
    const item = all.find((m) => m.id === id);
    if (!item) return false;

    item.mastered = true;
    item.lastReviewedAt = new Date().toISOString();
    this.persistVault(all);
    return true;
  }

  public static deleteMistake(id: string): void {
    const all = this.getAllMistakes().filter((m) => m.id !== id);
    this.persistVault(all);
  }

  private static persistVault(records: UserMistakeRecord[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(records));
        window.dispatchEvent(new CustomEvent(VAULT_EVENT_NAME, { detail: records }));
      }
    } catch {}
  }

  public static subscribe(callback: (records: UserMistakeRecord[]) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => {
      callback(AiCorrectionService.getAllMistakes());
    };
    window.addEventListener(VAULT_EVENT_NAME, handler);
    return () => window.removeEventListener(VAULT_EVENT_NAME, handler);
  }
}
