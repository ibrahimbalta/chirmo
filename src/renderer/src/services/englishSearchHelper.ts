import { CEFRLevel } from '../types';

export type SearchLearningMode = 'all' | 'easy_english' | 'how_to_say' | 'vocab';

export interface LearningCardResult {
  query: string;
  detectedLang: 'tr' | 'en';
  english: string;
  turkish: string;
  phonetic: string;
  level: CEFRLevel;
  partOfSpeech: string;
  exampleSentenceEn: string;
  exampleSentenceTr: string;
  tip?: string;
}

export interface SearchInspirationPrompt {
  id: string;
  title: string;
  text: string;
  mode: SearchLearningMode;
  icon: string;
  category: string;
}

// Zengin İki Dilli Öğrenme & Arama Sözlük Havuzu
const BILINGUAL_DICTIONARY: Array<{
  en: string;
  tr: string;
  phonetic: string;
  level: CEFRLevel;
  pos: string;
  exEn: string;
  exTr: string;
  keywords: string[];
  tip?: string;
}> = [
  // Günlük İhtiyaç & Sipariş
  {
    en: 'Order',
    tr: 'Sipariş vermek, sipariş',
    phonetic: '/ˈɔːdə/',
    level: 'A1',
    pos: 'Verb / Noun',
    exEn: 'Are you ready to order, or do you need a few more minutes?',
    exTr: 'Sipariş vermeye hazır mısınız, yoksa birkaç dakikaya daha mı ihtiyacınız var?',
    keywords: ['sipariş', 'sipariş vermek', 'order', 'sipariş et']
  },
  {
    en: 'Can I get an iced latte to go?',
    tr: 'Buzlu latte alabilir miyim, paket olsun?',
    phonetic: '/kæn aɪ ɡet ən aɪst ˈlɑːteɪ tə ɡəʊ/',
    level: 'A2',
    pos: 'Spoken Phrase',
    exEn: 'Can I get an iced latte to go with oat milk, please?',
    exTr: 'Yulaf sütlü buzlu latte alabilir miyim lütfen, paket olsun?',
    keywords: ['sipariş', 'kahve', 'latte', 'paket', 'iced latte', 'order', 'takeaway'],
    tip: 'İngiltere\'de "takeaway", Amerika\'da "to go" denir.'
  },
  {
    en: 'Could we have the bill, please?',
    tr: 'Hesabı alabilir miyiz lütfen?',
    phonetic: '/kʊd wi hæv ðə bɪl pliːz/',
    level: 'A2',
    pos: 'Spoken Phrase',
    exEn: 'We are ready to leave. Could we have the bill, please?',
    exTr: 'Kalkmaya hazırız. Hesabı alabilir miyiz lütfen?',
    keywords: ['hesap', 'hesabı alabilir miyim', 'fatura', 'bill', 'check', 'ödeme'],
    tip: 'ABD\'de "the check", İngiltere\'de "the bill" kullanılır.'
  },
  {
    en: 'Where is the nearest subway station?',
    tr: 'En yakın metro istasyonu nerede?',
    phonetic: '/weər ɪz ðə ˈnɪərɪst ˈsʌbweɪ ˈsteɪʃn/',
    level: 'A1',
    pos: 'Travel Question',
    exEn: 'Excuse me, where is the nearest subway station around here?',
    exTr: 'Afedersiniz, buralarda en yakın metro istasyonu nerede?',
    keywords: ['nerede', 'metro', 'istasyon', 'nerede bulabilirim', 'subway', 'station', 'metro nerede'],
    tip: 'Londra\'da "Underground / Tube", New York\'ta "Subway" denir.'
  },
  {
    en: 'I would like to make a reservation.',
    tr: 'Rezervasyon yaptırmak istiyorum.',
    phonetic: '/aɪ wʊd laɪk tə meɪk ə ˌrezəˈveɪʃn/',
    level: 'A2',
    pos: 'Booking Phrase',
    exEn: 'I would like to make a reservation for two tonight at 8 PM.',
    exTr: 'Bu akşam saat 8 için iki kişilik rezervasyon yaptırmak istiyorum.',
    keywords: ['rezervasyon', 'yer ayırtmak', 'otel', 'restoran', 'reservation', 'book a table', 'oda ayırtma'],
    tip: '"I want" yerine "I would like" demek her zaman çok daha kibardır.'
  },
  {
    en: 'Improve',
    tr: 'Geliştirmek, iyileştirmek, ilerletmek',
    phonetic: '/ɪmˈpruːv/',
    level: 'B1',
    pos: 'Verb',
    exEn: 'Practicing every day is the best way to improve your English.',
    exTr: 'Her gün pratik yapmak, İngilizceni geliştirmenin en iyi yoludur.',
    keywords: ['geliştir', 'geliştirmek', 'iyileştirmek', 'ilerletmek', 'improve', 'development']
  },
  {
    en: 'Develop',
    tr: 'Geliştirmek, tasarlamak, oluşturmak',
    phonetic: '/dɪˈveləp/',
    level: 'B1',
    pos: 'Verb',
    exEn: 'Our team is developing modern AI applications.',
    exTr: 'Ekibimiz modern yapay zekâ uygulamaları geliştiriyor.',
    keywords: ['geliştirmek', 'yazılım', 'oluşturmak', 'tasarlamak', 'develop', 'developer']
  },
  {
    en: 'Sustainable',
    tr: 'Sürdürülebilir, çevreye duyarlı',
    phonetic: '/səˈsteɪnəbl/',
    level: 'B2',
    pos: 'Adjective',
    exEn: 'Sustainable energy solutions are vital for our planet.',
    exTr: 'Sürdürülebilir enerji çözümleri gezegenimiz için hayati öneme sahiptir.',
    keywords: ['sürdürülebilir', 'çevre', 'yeşil enerji', 'sustainable', 'sustainability']
  },
  {
    en: 'Schedule a meeting',
    tr: 'Toplantı planlamak / ayarlamak',
    phonetic: '/ˈʃedjuːl ə ˈmiːtɪŋ/',
    level: 'B1',
    pos: 'Business Expression',
    exEn: 'Can we schedule a meeting for tomorrow morning?',
    exTr: 'Yarın sabah için bir toplantı planlayabilir miyiz?',
    keywords: ['toplantı', 'planlamak', 'randevu', 'toplantı ayarla', 'schedule', 'meeting']
  },
  {
    en: 'Artificial Intelligence',
    tr: 'Yapay Zekâ (YZ)',
    phonetic: '/ˌɑːtɪˈfɪʃl ɪnˈtelɪdʒəns/',
    level: 'B1',
    pos: 'Noun',
    exEn: 'Artificial intelligence is changing the way we learn languages.',
    exTr: 'Yapay zekâ dil öğrenme şeklimizi değiştiriyor.',
    keywords: ['yapay zeka', 'ai', 'teknoloji', 'artificial intelligence', 'makine öğrenimi']
  },
  {
    en: 'How much does this cost?',
    tr: 'Bunun fiyatı ne kadar?',
    phonetic: '/haʊ mʌtʃ dʌz ðɪs kɒst/',
    level: 'A1',
    pos: 'Shopping Phrase',
    exEn: 'Excuse me, how much does this jacket cost?',
    exTr: 'Afedersiniz, bu ceketin fiyatı ne kadar?',
    keywords: ['ne kadar', 'fiyat', 'kaç para', 'ücret', 'cost', 'how much', 'price']
  },
  {
    en: 'Could you please repeat that?',
    tr: 'Bunu tekrar edebilir misiniz lütfen?',
    phonetic: '/kʊd ju pliːz rɪˈpiːt ðæt/',
    level: 'A1',
    pos: 'Polite Request',
    exEn: 'I didn\'t quite catch that. Could you please repeat that?',
    exTr: 'Tam anlayamadım. Bunu tekrar edebilir misiniz lütfen?',
    keywords: ['tekrar et', 'anlamadım', 'anlamadım tekrar', 'ne dedin', 'repeat', 'pardon']
  },
  {
    en: 'Opportunity',
    tr: 'Fırsat, olanak',
    phonetic: '/ˌɒpəˈtjuːnəti/',
    level: 'B1',
    pos: 'Noun',
    exEn: 'Learning English opens up great global opportunities.',
    exTr: 'İngilizce öğrenmek harika küresel fırsatlar yaratır.',
    keywords: ['fırsat', 'olanak', 'şans', 'opportunity', 'career']
  },
  {
    en: 'Confidence',
    tr: 'Özgüven, güven',
    phonetic: '/ˈkɒnfɪdəns/',
    level: 'B1',
    pos: 'Noun',
    exEn: 'Speaking out loud will boost your speaking confidence.',
    exTr: 'Sesli konuşmak, konuşma özgüvenini katlayacaktır.',
    keywords: ['özgüven', 'güven', 'cesaret', 'confidence']
  },
  {
    en: 'What do you recommend?',
    tr: 'Ne tavsiye edersiniz / önerirsiniz?',
    phonetic: '/wɒt dʊ ju ˌrekəˈmend/',
    level: 'A2',
    pos: 'Spoken Phrase',
    exEn: 'This is my first time here. What do you recommend?',
    exTr: 'Buraya ilk gelişim. Ne tavsiye edersiniz?',
    keywords: ['tavsiye', 'öneri', 'ne önerirsiniz', 'recommend', 'suggestion']
  }
];

export class EnglishSearchHelper {
  /**
   * Kullanıcının girdiği metnin dilini ve türünü analiz eder.
   */
  public static detectLanguage(query: string): 'tr' | 'en' | 'url' {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return 'en';

    // URL Kontrolü
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('www.') ||
      (trimmed.includes('.') && !trimmed.includes(' ') && (trimmed.endsWith('.com') || trimmed.endsWith('.org') || trimmed.endsWith('.net') || trimmed.endsWith('.io') || trimmed.endsWith('.edu')))
    ) {
      return 'url';
    }

    // Türkçe karakterler (ğ, ü, ş, ı, ö, ç)
    const turkishCharRegex = /[çğıöşüÇĞİÖŞÜ]/;
    if (turkishCharRegex.test(query)) {
      return 'tr';
    }

    // Yaygın Türkçe soru ve fiil kalıpları
    const turkishWords = [
      'nasıl', 'nerede', 'ne', 'kadar', 'nedir', 'alabilir', 'miyim', 'istiyorum', 'yapmak', 'etmek',
      'fiyat', 'fiyatı', 'hesap', 'sipariş', 'rezervasyon', 'otelde', 'geliştir', 'geliştirmek', 'öğrenmek'
    ];

    const words = trimmed.split(/\s+/);
    for (const w of words) {
      if (turkishWords.includes(w)) {
        return 'tr';
      }
    }

    return 'en';
  }

  /**
   * Sorguya göre interaktif öğrenme kartı bilgilerini üretir.
   */
  public static getLearningCard(query: string): LearningCardResult | null {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) return null;

    // URL ise kart üretme
    if (this.detectLanguage(query) === 'url') return null;

    // 1. Sözlükte anahtar kelime eşleşmesi ara
    const matched = BILINGUAL_DICTIONARY.find((item) => {
      if (item.en.toLowerCase().includes(trimmed)) return true;
      if (item.tr.toLowerCase().includes(trimmed)) return true;
      return item.keywords.some((k) => trimmed.includes(k) || k.includes(trimmed));
    });

    if (matched) {
      const detectedLang = this.detectLanguage(query) === 'tr' ? 'tr' : 'en';
      return {
        query,
        detectedLang,
        english: matched.en,
        turkish: matched.tr,
        phonetic: matched.phonetic,
        level: matched.level,
        partOfSpeech: matched.pos,
        exampleSentenceEn: matched.exEn,
        exampleSentenceTr: matched.exTr,
        tip: matched.tip
      };
    }

    // 2. Sözlükte tam bulunamadıysa dinamik akıllı sentezleyici çalıştır
    const detected = this.detectLanguage(query);
    if (detected === 'tr') {
      // Türkçe ifade için İngilizce konuşma ve arama kalıbı oluştur
      const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
      return {
        query,
        detectedLang: 'tr',
        english: `How to say "${capitalized}" in English`,
        turkish: `"${capitalized}" ifadesinin İngilizce doğal konuşma karşılığı`,
        phonetic: '/haʊ tə seɪ/',
        level: 'A2',
        partOfSpeech: 'İfade & Kalıp',
        exampleSentenceEn: `Here is how native speakers say "${query}" in daily conversation.`,
        exampleSentenceTr: `Ana dili İngilizce olanların "${query}" için günlük konuşmada kullandığı en doğal kalıplar.`,
        tip: 'Bu ifadeyi İngilizce kaynaklarda ve telaffuz antrenöründe anında inceleyebilirsin.'
      };
    } else {
      // İngilizce ifade için
      const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
      return {
        query,
        detectedLang: 'en',
        english: capitalized,
        turkish: `"${capitalized}" kelimesinin Türkçe anlamı ve telaffuzu`,
        phonetic: `/${trimmed.replace(/[^a-z]/g, '')}/`,
        level: 'B1',
        partOfSpeech: 'Vocab / Term',
        exampleSentenceEn: `You can use "${capitalized}" in academic and everyday contexts.`,
        exampleSentenceTr: `"${capitalized}" kelimesini akademik ve günlük diyaloglarda kullanabilirsin.`,
        tip: 'Tek tıkla Kelime Defterine kaydedip hafıza kartlarıyla pekiştirebilirsin.'
      };
    }
  }

  /**
   * Aktif arama moduna göre hedef arama adresini oluşturur.
   */
  public static buildSearchTarget(query: string, mode: SearchLearningMode): string {
    const trimmed = query.trim();
    if (!trimmed) return 'https://www.google.com';

    // URL ise doğrudan git
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (trimmed.includes('.') && !trimmed.includes(' ') && !trimmed.includes('?')) {
      return `https://${trimmed}`;
    }

    switch (mode) {
      case 'easy_english':
        // Kolay İngilizce modunda: Simple Wikipedia ve BBC Learning English ile zenginleştir
        return `https://www.google.com/search?q=${encodeURIComponent(trimmed + ' simple english bbc learning')}`;

      case 'how_to_say':
        // Nasıl Söylenir modunda: Doğrudan konuşma kalıplarını bul
        return `https://www.google.com/search?q=${encodeURIComponent('how to say ' + trimmed + ' in natural English')}`;

      case 'vocab':
        // Kelime ve sözlük modunda: Telaffuz ve anlam
        return `https://www.google.com/search?q=${encodeURIComponent(trimmed + ' meaning pronunciation english')}`;

      case 'all':
      default:
        return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    }
  }

  /**
   * İngilizce öğrenenler için hızlı arama ilhamları (Search Sparks)
   */
  public static getInspirationPrompts(): SearchInspirationPrompt[] {
    return [
      {
        id: 'coffee',
        title: 'Sipariş Kalıbı',
        text: 'Can I get an iced latte to go?',
        mode: 'how_to_say',
        icon: '☕',
        category: 'Günlük Yaşam'
      },
      {
        id: 'bill',
        title: 'Restoranda Hesap',
        text: 'Could we have the bill, please?',
        mode: 'how_to_say',
        icon: '🧾',
        category: 'Yeme & İçme'
      },
      {
        id: 'subway',
        title: 'Yol Tarifi',
        text: 'Where is the nearest subway station?',
        mode: 'how_to_say',
        icon: '🚇',
        category: 'Seyahat'
      },
      {
        id: 'improve',
        title: 'Günün Kelimesi',
        text: 'Improve',
        mode: 'vocab',
        icon: '💡',
        category: 'Kelime Dağarcığı'
      },
      {
        id: 'bbc_news',
        title: 'Kolay İngilizce',
        text: 'Climate change and renewable energy',
        mode: 'easy_english',
        icon: '🌍',
        category: 'Genel Kültür'
      }
    ];
  }
}
