// Chirmo Gemini AI Teacher Service
// Google Gemini API Entegrasyonu & Pedagojik Konuşma Asistanı (İngilizce & Almanca)

import { TargetLanguageService, SupportedLanguage } from './targetLanguageService';
import { PrivacyAuthService } from './privacyAuthService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'chirmo';
  text: string;
  timestamp: string;
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 dakika
const MAX_REQUESTS_PER_MINUTE = 12;
const DAILY_QUOTA_FREE = 150;
const DAILY_QUOTA_PRO = 1000;
const MAX_USER_INPUT_LENGTH = 500;

function sanitizeUserPrompt(raw: string, maxLen: number = MAX_USER_INPUT_LENGTH): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .replace(/ignore\s+(all\s+)?(previous|prior)\s+instructions/gi, '')
    .replace(/system\s*prompt\s*:/gi, '')
    .trim()
    .slice(0, maxLen);
}

function encodeStoredKey(plain: string): string {
  try {
    return 'enc_v2_' + btoa(unescape(encodeURIComponent(plain.trim())));
  } catch {
    return plain.trim();
  }
}

function decodeStoredKey(stored: string): string {
  try {
    if (stored.startsWith('enc_v2_')) {
      return decodeURIComponent(escape(atob(stored.slice(7))));
    }
    return stored;
  } catch {
    return '';
  }
}

export class GeminiAiTeacherService {
  private static STORAGE_KEY = 'chirmo_gemini_api_key_v2';
  private static LEGACY_STORAGE_KEY = 'chirmo_gemini_api_key';
  private static QUOTA_STORAGE_KEY = 'chirmo_ai_daily_quota_v1';
  private static requestTimestamps: number[] = [];

  private static DEFAULT_KEY =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || '';

  public static getApiKey(): string {
    try {
      const legacy = localStorage.getItem(this.LEGACY_STORAGE_KEY);
      if (legacy && legacy.trim()) {
        this.setApiKey(legacy.trim());
        localStorage.removeItem(this.LEGACY_STORAGE_KEY);
      }
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved && saved.trim()) {
        const decoded = decodeStoredKey(saved.trim());
        if (decoded) return decoded;
      }
    } catch {}
    return this.DEFAULT_KEY;
  }

  public static setApiKey(key: string): void {
    try {
      const clean = sanitizeUserPrompt(key, 200);
      if (!clean) {
        localStorage.removeItem(this.STORAGE_KEY);
        return;
      }
      localStorage.setItem(this.STORAGE_KEY, encodeStoredKey(clean));
      localStorage.removeItem(this.LEGACY_STORAGE_KEY);
    } catch {}
  }

  /**
   * İstek Sınırlandırma (Rate Limiting - 12 istek/dk) ve Kullanıcı Başına Günlük Kota Kontrolü
   */
  public static checkRateAndQuotaAllowance(): { allowed: boolean; reason?: string } {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );

    if (this.requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
      return {
        allowed: false,
        reason: 'Dakikalık maksimum AI istek sınırına ulaşıldı. Yerel pedagoji motoru yanıtlıyor.'
      };
    }

    const user = PrivacyAuthService.getCurrentUser();
    const username = user?.username || 'guest';
    const maxDaily =
      user?.plan === 'pro' || user?.plan === 'lifetime' ? DAILY_QUOTA_PRO : DAILY_QUOTA_FREE;
    const today = new Date().toISOString().slice(0, 10);

    try {
      const raw = localStorage.getItem(this.QUOTA_STORAGE_KEY);
      const map: Record<string, { date: string; count: number }> = raw ? JSON.parse(raw) : {};
      const entry = map[username];

      if (entry && entry.date === today) {
        if (entry.count >= maxDaily) {
          return {
            allowed: false,
            reason: 'Günlük AI kullanım kotası doldu. Yerel pedagoji motoru devrede.'
          };
        }
        entry.count += 1;
        map[username] = entry;
      } else {
        map[username] = { date: today, count: 1 };
      }

      localStorage.setItem(this.QUOTA_STORAGE_KEY, JSON.stringify(map));
    } catch {}

    this.requestTimestamps.push(now);
    return { allowed: true };
  }

  /**
   * Kullanıcının Türkçe düşündüğü cevabı hedef dilde (İngilizce veya Almanca) doğal bir cümleye çevirir.
   */
  public static async translateTurkishThoughtToTargetLanguage(
    turkishText: string,
    contextQuestion: string = '',
    targetLang?: SupportedLanguage
  ): Promise<string> {
    const trimmed = sanitizeUserPrompt(turkishText, MAX_USER_INPUT_LENGTH);
    const safeContext = sanitizeUserPrompt(contextQuestion, 300);
    if (!trimmed) return '';

    const lang: SupportedLanguage = targetLang || TargetLanguageService.getTargetLanguage();
    const tlCode = lang === 'de' ? 'de' : lang === 'fr' ? 'fr' : 'en';

    const quotaCheck = this.checkRateAndQuotaAllowance();

    // 1. Anında ve Yüksek Doğruluklu Canlı Çeviri (Google Translate Endpoint)
    if (quotaCheck.allowed) {
      try {
        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${tlCode}&dt=t&q=${encodeURIComponent(trimmed)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data[0]) {
            const translated = data[0].map((x: any) => x[0]).join('').trim();
            if (translated) {
              return sanitizeUserPrompt(translated, MAX_USER_INPUT_LENGTH);
            }
          }
        }
      } catch {
        // Ağ veya bağlantı hatasında sonraki adıma geç
      }
    }

    // 2. Google Gemini API ile Doğal Konuşma Çevirisi (Key ve kota uygun ise)
    const apiKey = this.getApiKey();
    if (apiKey && quotaCheck.allowed) {
      try {
        const targetLangName =
          lang === 'de'
            ? 'Almancasına (Deutsch)'
            : lang === 'fr'
            ? 'Fransızcasına (Français)'
            : 'İngilizcesine (English)';
        const prompt = `Sen Türkçe düşünceyi akıcı, doğal günlük konuşma ${targetLangName} çeviren bir asistansın.
Chirmo'nun sorduğu soru: "${safeContext}".
Kullanıcının Türkçe vermek istediği yanıt: "${trimmed}".

Görev: Bu cevabı A1-B1 seviyesinde, günlük konuşma dilinde son derece doğal ve samimi tek bir konuşma cümlesine çevir. Asla açıklama veya Türkçe ekleme, yalnızca tek bir hedef dilde cümle döndür.`;

        const models = ['gemini-2.5-flash', 'gemini-3.8-flash'];
        for (const m of models) {
          try {
            const resp = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(apiKey)}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ role: 'user', parts: [{ text: prompt }] }]
                })
              }
            );
            if (resp.ok) {
              const d = await resp.json();
              const reply = d.candidates?.[0]?.content?.parts?.[0]?.text;
              if (reply && reply.trim()) {
                let clean = reply.split('\n')[0].trim().replace(/^["']/, '').replace(/["']$/, '');
                if (clean.includes('(')) clean = clean.split('(')[0].trim();
                return sanitizeUserPrompt(clean, MAX_USER_INPUT_LENGTH);
              }
            }
          } catch {
            // Gizli anahtar veya dahili hata detayları dışarı sızdırılmaz
          }
        }
      } catch {
        // Fallback'e devam et
      }
    }

    // 3. Akıllı Çevrimdışı / Yerel Kalıp Eşleştirici
    const lower = trimmed.toLowerCase();
    if (lang === 'fr') {
      if (lower.includes('hobi') || lower.includes('bisiklet') || lower.includes('müzik')) {
        return 'Mon passe-temps préféré est de faire du vélo et d\'écouter de la musique.';
      }
      if (lower.includes('kahve') || lower.includes('çay') || lower.includes('içmek') || lower.includes('kruvasan')) {
        return 'Je voudrais une tasse de café avec du lait, s\'il vous plaît.';
      }
      if (lower.includes('merhaba') || lower.includes('nasılsın') || lower.includes('iyiyim')) {
        return 'Bonjour ! Je vais très bien, merci. Et vous, comment allez-vous ?';
      }
      if (lower.includes('evet') || lower.includes('katılıyorum')) {
        return 'Oui, je suis tout à fait d\'accord avec vous.';
      }
      if (lower.includes('hayır') || lower.includes('istemiyorum')) {
        return 'Non, merci beaucoup. Je préfère autre chose.';
      }
      if (lower.includes('yemek') || lower.includes('pizza') || lower.includes('lezzetli')) {
        return 'J\'adore la bonne cuisine française, surtout les plats frais !';
      }
      if (lower.includes('iş') || lower.includes('çalış') || lower.includes('okul')) {
        return 'Je travaille beaucoup aujourd\'hui, mais je prends le temps pour le français.';
      }
      return `Je voudrais dire que ${trimmed}, ce qui est très important pour moi.`;
    }

    if (lang === 'de') {
      if (lower.includes('hobi') || lower.includes('bisiklet') || lower.includes('müzik')) {
        return 'Mein liebstes Hobby ist Radfahren und Musik hören.';
      }
      if (lower.includes('kahve') || lower.includes('çay') || lower.includes('içmek')) {
        return 'Ich hätte gerne eine Tasse Kaffee mit Milch, bitte.';
      }
      if (lower.includes('merhaba') || lower.includes('nasılsın') || lower.includes('iyiyim')) {
        return 'Hallo! Mir geht es sehr gut, danke. Und wie geht es dir?';
      }
      if (lower.includes('evet') || lower.includes('katılıyorum')) {
        return 'Ja, da stimme ich dir vollkommen zu.';
      }
      if (lower.includes('hayır') || lower.includes('istemiyorum')) {
        return 'Nein, vielen Dank. Ich bevorzuge etwas anderes.';
      }
      if (lower.includes('yemek') || lower.includes('pizza') || lower.includes('lezzetli')) {
        return 'Ich liebe leckeres Essen, besonders frische Gerichte!';
      }
      if (lower.includes('iş') || lower.includes('çalış') || lower.includes('okul')) {
        return 'Ich arbeite heute viel, aber ich nehme mir Zeit für Deutsch.';
      }
      return `Ich möchte sagen, dass ${trimmed}, was mir sehr wichtig ist.`;
    }

    // İngilizce Fallback
    if (lower.includes('hobi') || lower.includes('bisiklet') || lower.includes('müzik')) {
      return 'My favorite hobby is cycling and listening to music.';
    }
    if (lower.includes('kahve') || lower.includes('çay') || lower.includes('içmek')) {
      return 'I would like to have a cup of coffee, please.';
    }
    if (lower.includes('merhaba') || lower.includes('nasılsın') || lower.includes('iyiyim')) {
      return 'Hello! I am doing great, thank you. How about you?';
    }
    if (lower.includes('evet') || lower.includes('katılıyorum')) {
      return 'Yes, I totally agree with you on that.';
    }
    if (lower.includes('hayır') || lower.includes('istemiyorum')) {
      return 'No, thank you. I prefer something else.';
    }
    if (lower.includes('yemek') || lower.includes('pizza') || lower.includes('makarna')) {
      return 'I love delicious food, especially Italian cuisine!';
    }
    if (lower.includes('iş') || lower.includes('çalış') || lower.includes('okul')) {
      return 'I am busy working today, but I always make time to practice English.';
    }

    return `I would like to say that ${trimmed}, which is very important to me.`;
  }

  /**
   * Geriye dönük uyumluluk (İngilizce düşünce çevirisi)
   */
  public static async translateTurkishThoughtToEnglish(
    turkishText: string,
    contextQuestion: string = ''
  ): Promise<string> {
    return this.translateTurkishThoughtToTargetLanguage(turkishText, contextQuestion, 'en');
  }

  /**
   * Gemini API ile canlı konuşma yanıtı üretir.
   * Hata veya kota durumunda kesintisiz akıllı yerel pedagoji motoruna geçer.
   */
  public static async generateTutorResponse(
    userMessage: string,
    history: ChatMessage[] = [],
    scenario: string = 'Günlük Sohbet & Restoran'
  ): Promise<{ text: string; source: 'gemini' | 'pedagogy_fallback'; info?: string }> {
    const safeUserMessage = sanitizeUserPrompt(userMessage, MAX_USER_INPUT_LENGTH);
    const safeScenario = sanitizeUserPrompt(scenario, 120);
    const apiKey = this.getApiKey();
    const activeLang = TargetLanguageService.getTargetLanguage();
    const langLabel =
      activeLang === 'de' ? 'Almanca' : activeLang === 'fr' ? 'Fransızca' : 'İngilizce';

    const quotaCheck = this.checkRateAndQuotaAllowance();

    const systemPrompt = `Sen "Chirmo", kullanıcıların ${langLabel} konuşma korkusunu yenmelerini sağlayan, arkadaş canlısı, neşeli ve cesaretlendirici bir yapay zekâ ${langLabel} öğretmenisin.
Şu anki Senaryo / Odak: "${safeScenario}".
Kullanıcının Mesajı: "${safeUserMessage}".

Kurallar:
1. Cevabın kısa, samimi ve motive edici olsun (en fazla 2-3 cümle).
2. Kullanıcının seviyesine uygun ${langLabel} bir cümle kur, hemen ardından parantez içinde veya altında Türkçe açıklamasını yaz.
3. Kullanıcıya konuşmaya devam etmesi için basit bir ${langLabel} soru yönelt.
4. Asla kullanıcıyı azarlama; hata yaptıysa nazikçe doğrusunu göster ve övgüde bulun.`;

    // 1. Canlı Google Gemini API Çağrısı Denemesi
    if (apiKey && quotaCheck.allowed && safeUserMessage) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];

      for (const model of modelsToTry) {
        try {
          const contents = [
            ...history.slice(-4).map((m) => ({
              role: m.sender === 'user' ? 'user' : 'model',
              parts: [{ text: sanitizeUserPrompt(m.text, MAX_USER_INPUT_LENGTH) }]
            })),
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nKullanıcı: ${safeUserMessage}` }]
            }
          ];

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents })
            }
          );

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply && reply.trim()) {
              return { text: sanitizeUserPrompt(reply.trim(), 1200), source: 'gemini' };
            }
          }
        } catch {
          // Gizli anahtar veya sunucu hatası sızdırılmaz; güvenli yerel motora geçilir
        }
      }
    }

    // 2. Akıllı Pedagojik Yanıt Motoru (Kesintisiz Kullanıcı Deneyimi Fallback)
    const lower = safeUserMessage.toLowerCase();
    let fallbackText = '';

    if (activeLang === 'de') {
      if (lower.includes('sipariş') || lower.includes('bestell') || lower.includes('restoran') || lower.includes('menü')) {
        fallbackText = `Willkommen in unserem gemütlichen Restaurant! 🍽️ Was darf ich Ihnen heute Schönes bringen? (Hoş geldiniz! Bugün size ne ikram edebilirim?)\n\nÖrnek cevap: *"Ich hätte gerne einen Kaffee und ein Wasser, bitte."*`;
      } else if (lower.includes('merhaba') || lower.includes('hallo') || lower.includes('guten tag') || lower.includes('hi')) {
        fallbackText = `Hallo mein lieber Freund! 👋 Es ist ein wunderbarer Tag, um Deutsch zu sprechen! Wie geht es dir heute? (Merhaba değerli dostum! Bugün Almanca konuşmak için harika bir gün! Kendini nasıl hissediyorsun?)`;
      } else if (lower.includes('kahve') || lower.includes('kaffee') || lower.includes('çay') || lower.includes('tee') || lower.includes('su')) {
        fallbackText = `Ausgezeichnete Wahl! *"Hier ist dein frischer Kaffee, lass es dir schmecken!"* ☕ (Harika bir seçim! İşte taze kahveniz, afiyet olsun!) Trinkst du deinen Kaffee mit Milch oder Zucker?`;
      } else if (lower.includes('yardım') || lower.includes('hilfe') || lower.includes('nasıl') || lower.includes('wie')) {
        fallbackText = `Ich bin immer für dich da! 🌟 Hab keine Angst vor Fehlern; regelmäßiges Sprechen ist der Schlüssel zum Erfolg. Welches Wort möchtest du lernen? (Her zaman yanındayım! Hata yapmaktan çekinme; konuşmak başarının anahtarıdır.)`;
      } else {
        fallbackText = `Das ist wirklich sehr interessant! 👏 Du hast dich klar ausgedrückt. Lass uns noch einen Satz üben: Was ist dein liebstes Hobby? (Çok ilginç! Kendini çok net ifade ettin. Bir cümle daha pratik yapalım: En sevdiğin hobi nedir?)`;
      }
    } else {
      if (lower.includes('sipariş') || lower.includes('order') || lower.includes('restoran') || lower.includes('menu')) {
        fallbackText = `Welcome to our cozy restaurant! 🍽️ What would you like to have today? (Hoş geldiniz! Bugün ne sipariş etmek istersiniz?)\n\nÖrnek cevap: *"I would like to have a coffee, please."*`;
      } else if (lower.includes('merhaba') || lower.includes('hello') || lower.includes('hi')) {
        fallbackText = `Hello my friend! 👋 It is a wonderful day to speak English! How are you feeling today? (Merhaba dostum! Bugün İngilizce konuşmak için harika bir gün! Kendini nasıl hissediyorsun?)`;
      } else if (lower.includes('kahve') || lower.includes('coffee') || lower.includes('su') || lower.includes('water')) {
        fallbackText = `Great choice! *"Here is your fresh coffee, enjoy!"* ☕ (Harika bir seçim! İşte taze kahveniz, afiyet olsun!) Do you like your coffee with milk or sugar?`;
      } else if (lower.includes('yardım') || lower.includes('help') || lower.includes('nasıl')) {
        fallbackText = `I am always here to help you! 🌟 Don't be afraid to make mistakes; practicing is the secret. What word would you like to learn now? (Her zaman yanındayım! Hata yapmaktan asla çekinme; pratik yapmak başarının anahtarıdır.)`;
      } else {
        fallbackText = `That is very interesting! 👏 You expressed yourself clearly. Let's practice one more sentence: Can you tell me what your favorite hobby is? (Çok ilginç! Kendini çok net ifade ettin. Bir cümle daha pratik yapalım: Bana en sevdiğin hobini söyleyebilir misin?)`;
      }
    }

    return {
      text: fallbackText,
      source: 'pedagogy_fallback',
      info: quotaCheck.reason || 'Pedagojik yanıt motoru aktif.'
    };
  }
}
