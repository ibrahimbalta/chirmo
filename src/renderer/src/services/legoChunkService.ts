import { SupportedLanguage, TargetLanguageService } from './targetLanguageService';

export interface LegoBrick {
  id: string;
  label: string; // The brick text
  labelTr: string; // Meaning in Turkish
  fullSentence: string;
  fullSentenceTr: string;
}

export interface LegoPatternRoot {
  id: string;
  pattern: string; // e.g. "I would like to..." or "Ich hätte gerne..."
  patternTr: string;
  pedagogicalTip: string;
  language: SupportedLanguage;
  bricks: LegoBrick[];
}

export const LEGO_PATTERNS: LegoPatternRoot[] = [
  // ==================== ALMANCA LEGO KALIPLARI ====================
  {
    id: 'de-pattern-1',
    pattern: 'Ich hätte gerne...',
    patternTr: '... rica ediyorum / istiyorum (Kibar İstek)',
    pedagogicalTip: 'Almanya\'da her türlü sipariş ve istekte "Ich will" yerine bu kalıbı kullanın, kapılar sonuna kadar açılsın.',
    language: 'de',
    bricks: [
      {
        id: 'de-b1-1',
        label: 'einen Cappuccino mit Hafermilch',
        labelTr: 'yulaf sütlü bir kapuçino',
        fullSentence: 'Ich hätte gerne einen Cappuccino mit Hafermilch, bitte.',
        fullSentenceTr: 'Yulaf sütlü bir kapuçino rica ediyorum lütfen.'
      },
      {
        id: 'de-b1-2',
        label: 'zwei frische Brötchen',
        labelTr: 'iki taze ekmekçik',
        fullSentence: 'Ich hätte gerne zwei frische Brötchen zum Mitnehmen.',
        fullSentenceTr: 'Paket olarak iki taze ekmekçik rica ediyorum.'
      },
      {
        id: 'de-b1-3',
        label: 'ein Ticket nach Berlin',
        labelTr: 'Berlin\'e bir tren bileti',
        fullSentence: 'Ich hätte gerne ein Ticket nach Berlin für heute Nachmittag.',
        fullSentenceTr: 'Bugün öğleden sonra için Berlin\'e bir bilet rica ediyorum.'
      },
      {
        id: 'de-b1-4',
        label: 'die Rechnung',
        labelTr: 'hesabı (restoranda)',
        fullSentence: 'Ich hätte gerne die Rechnung, bitte getrennt zahlen.',
        fullSentenceTr: 'Hesabı rica ediyorum, lütfen ayrı ödeyelim.'
      }
    ]
  },
  {
    id: 'de-pattern-2',
    pattern: 'Könnten Sie bitte...',
    patternTr: 'Lütfen ... yapabilir misiniz? (Nezaket İstemi)',
    pedagogicalTip: 'Karşı taraftan bir şey rica ederken "Könnten Sie..." en saygın ve diplomatik yoldur.',
    language: 'de',
    bricks: [
      {
        id: 'de-b2-1',
        label: 'etwas langsamer sprechen',
        labelTr: 'biraz daha yavaş konuşmak',
        fullSentence: 'Könnten Sie bitte etwas langsamer sprechen?',
        fullSentenceTr: 'Lütfen biraz daha yavaş konuşabilir misiniz?'
      },
      {
        id: 'de-b2-2',
        label: 'mir den Weg zeigen',
        labelTr: 'bana yolu göstermek',
        fullSentence: 'Könnten Sie bitte mir den Weg zum Bahnhof zeigen?',
        fullSentenceTr: 'Lütfen bana tren garına giden yolu gösterebilir misiniz?'
      },
      {
        id: 'de-b2-3',
        label: 'das kurz wiederholen',
        labelTr: 'bunu kısaca tekrarlamak',
        fullSentence: 'Könnten Sie bitte das noch einmal kurz wiederholen?',
        fullSentenceTr: 'Lütfen bunu bir kez daha kısaca tekrar edebilir misiniz?'
      },
      {
        id: 'de-b2-4',
        label: 'mir helfen',
        labelTr: 'bana yardım etmek',
        fullSentence: 'Könnten Sie mir bitte bei diesem Koffer helfen?',
        fullSentenceTr: 'Lütfen şu bavulda bana yardımcı olabilir misiniz?'
      }
    ]
  },
  {
    id: 'de-pattern-3',
    pattern: 'Meiner Meinung nach...',
    patternTr: 'Benim fikrime göre / Bence...',
    pedagogicalTip: 'Toplantıda, arkadaş sohbetinde fikrini savunurken zihne doğrudan özgüven aşılar.',
    language: 'de',
    bricks: [
      {
        id: 'de-b3-1',
        label: 'ist das eine hervorragende Idee',
        labelTr: 'bu mükemmel bir fikir',
        fullSentence: 'Meiner Meinung nach ist das eine hervorragende Idee.',
        fullSentenceTr: 'Bana göre bu gerçekten mükemmel bir fikir.'
      },
      {
        id: 'de-b3-2',
        label: 'brauchen wir mehr Zeit',
        labelTr: 'daha fazla zamana ihtiyacımız var',
        fullSentence: 'Meiner Meinung nach brauchen wir mehr Zeit für dieses Projekt.',
        fullSentenceTr: 'Bence bu proje için daha fazla zamana ihtiyacımız var.'
      },
      {
        id: 'de-b3-3',
        label: 'ist Deutsch sehr logisch',
        labelTr: 'Almanca çok mantıklı bir dildir',
        fullSentence: 'Meiner Meinung nach ist Deutsch eine sehr logische und schöne Sprache.',
        fullSentenceTr: 'Bana göre Almanca son derece mantıklı ve güzel bir dildir.'
      }
    ]
  },

  // ==================== İNGİLİZCE LEGO KALIPLARI ====================
  {
    id: 'en-pattern-1',
    pattern: 'I would like to...',
    patternTr: '... yapmak / almak istiyorum (Kibar İstek)',
    pedagogicalTip: '"I want" kaba duyulabilir; "I would like to" her kapıyı açan sihirli anahtardır.',
    language: 'en',
    bricks: [
      {
        id: 'en-b1-1',
        label: 'order a large coffee',
        labelTr: 'büyük boy kahve sipariş etmek',
        fullSentence: 'I would like to order a large coffee with almond milk, please.',
        fullSentenceTr: 'Badem sütlü büyük boy bir kahve sipariş etmek istiyorum lütfen.'
      },
      {
        id: 'en-b1-2',
        label: 'book a table for two',
        labelTr: 'iki kişilik masa ayırtmak',
        fullSentence: 'I would like to book a table for two at 7 PM tonight.',
        fullSentenceTr: 'Bu akşam saat 19:00 için iki kişilik bir masa ayırtmak istiyorum.'
      },
      {
        id: 'en-b1-3',
        label: 'ask a quick question',
        labelTr: 'hızlı bir soru sormak',
        fullSentence: 'I would like to ask a quick question about this topic.',
        fullSentenceTr: 'Bu konu hakkında hızlıca bir soru sormak istiyorum.'
      },
      {
        id: 'en-b1-4',
        label: 'check out of my room',
        labelTr: 'otel odasından çıkış yapmak',
        fullSentence: 'I would like to check out of room 402, please.',
        fullSentenceTr: '402 numaralı odanın çıkış işlemlerini yapmak istiyorum lütfen.'
      }
    ]
  },
  {
    id: 'en-pattern-2',
    pattern: 'Could you please...',
    patternTr: 'Lütfen ... yapabilir misiniz? (Zarif İstek)',
    pedagogicalTip: 'Emir kipi kullanmak yerine cümlenin başına "Could you please..." koyun.',
    language: 'en',
    bricks: [
      {
        id: 'en-b2-1',
        label: 'speak a little slower',
        labelTr: 'biraz daha yavaş konuşmak',
        fullSentence: 'Could you please speak a little slower for me?',
        fullSentenceTr: 'Benim için biraz daha yavaş konuşabilir misiniz lütfen?'
      },
      {
        id: 'en-b2-2',
        label: 'give me a hand',
        labelTr: 'bana bir el vermek / yardım etmek',
        fullSentence: 'Could you please give me a hand with this heavy luggage?',
        fullSentenceTr: 'Şu ağır bavulda bana bir el atabilir misiniz lütfen?'
      },
      {
        id: 'en-b2-3',
        label: 'send me the invoice',
        labelTr: 'faturayı bana göndermek',
        fullSentence: 'Could you please send me the invoice via email?',
        fullSentenceTr: 'Lütfen faturayı bana e-posta ile gönderebilir misiniz?'
      }
    ]
  },
  {
    id: 'en-pattern-3',
    pattern: 'In my experience...',
    patternTr: 'Benim deneyimime göre...',
    pedagogicalTip: 'İş mülakatlarında ve toplantılarda tecrübeni öne çıkarmanın en etkili kalıbıdır.',
    language: 'en',
    bricks: [
      {
        id: 'en-b3-1',
        label: 'communication is key',
        labelTr: 'iletişim her şeyin anahtarıdır',
        fullSentence: 'In my experience, open communication is key to project success.',
        fullSentenceTr: 'Benim tecrübeme göre açık iletişim proje başarısının anahtarıdır.'
      },
      {
        id: 'en-b3-2',
        label: 'practice makes perfect',
        labelTr: 'pratik insanı mükemmelleştirir',
        fullSentence: 'In my experience, speaking every day is the best way to master a language.',
        fullSentenceTr: 'Deneyimlerime göre her gün konuşmak bir dilde ustalaşmanın en iyi yoludur.'
      }
    ]
  }
];

export const LegoChunkService = {
  getPatterns(lang?: SupportedLanguage): LegoPatternRoot[] {
    const target = lang || TargetLanguageService.getTargetLanguage();
    return LEGO_PATTERNS.filter((p) => p.language === target);
  }
};
