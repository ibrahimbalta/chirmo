import { CEFRLevel } from '../types';

export interface DetectedObjectResult {
  id: string;
  emoji: string;
  objectName: string;
  turkishName: string;
  phonetic: string;
  cefrLevel: CEFRLevel;
  vocabularyKeywords: string[];
  contextualSentences: Array<{
    en: string;
    tr: string;
    level: CEFRLevel;
  }>;
  chirmoQuestion: string;
  chirmoQuestionTr: string;
  suggestedAnswers: string[];
}

export interface ObjectSpeakingEvaluation {
  isRelevant: boolean;
  score: number;
  wordCount: number;
  feedback: string;
  feedbackTr: string;
}

export const PRESET_OBJECT_SCENES: DetectedObjectResult[] = [
  {
    id: 'coffee_mug',
    emoji: '☕',
    objectName: 'Coffee Mug',
    turkishName: 'Kahve Fincanı / Kupa',
    phonetic: '/ˈkɒf.i mʌɡ/',
    cefrLevel: 'A2',
    vocabularyKeywords: ['ceramic', 'beverage', 'caffeine', 'sip', 'warm', 'steam'],
    contextualSentences: [
      {
        en: 'I drink a warm cup of coffee every morning to start my day.',
        tr: 'Günüme başlamak için her sabah bir fincan ılık kahve içerim.',
        level: 'A2'
      },
      {
        en: 'This ceramic mug keeps my freshly brewed tea hot for hours.',
        tr: 'Bu seramik kupa taze demlenmiş çayımı saatlerce sıcak tutuyor.',
        level: 'B1'
      },
      {
        en: 'Sipping a beverage while brainstorming fosters deep creative focus.',
        tr: 'Fikir üretirken bir içecek yudumlamak derin bir yaratıcı odaklanmayı destekler.',
        level: 'B2'
      }
    ],
    chirmoQuestion: 'How often do you drink coffee or tea, and what is your favorite morning routine?',
    chirmoQuestionTr: 'Ne sıklıkla kahve veya çay içersin ve en sevdiğin sabah rutini nedir?',
    suggestedAnswers: [
      'I usually drink one cup of coffee in the morning before starting work.',
      'I prefer green tea because it helps me feel calm and energized.',
      'Drinking coffee while reading news is my absolute favorite morning habit.'
    ]
  },
  {
    id: 'laptop',
    emoji: '💻',
    objectName: 'Laptop Computer',
    turkishName: 'Dizüstü Bilgisayar & Çalışma Masası',
    phonetic: '/ˈlæp.tɒp kəmˈpjuː.tər/',
    cefrLevel: 'B1',
    vocabularyKeywords: ['display', 'keyboard', 'software', 'productivity', 'remote work'],
    contextualSentences: [
      {
        en: 'I use my laptop daily for coding, writing, and online meetings.',
        tr: 'Dizüstü bilgisayarımı her gün kodlama, yazma ve çevrim içi toplantılar için kullanırım.',
        level: 'A2'
      },
      {
        en: 'Having a portable device allows me to work productively from anywhere.',
        tr: 'Taşınabilir bir cihaza sahip olmak her yerden verimli bir şekilde çalışmamı sağlıyor.',
        level: 'B1'
      },
      {
        en: 'High-performance hardware facilitates seamless multitasking across complex workflows.',
        tr: 'Yüksek performanslı donanım karmaşık iş akışlarında kesintisiz çoklu görev yürütmeyi kolaylaştırır.',
        level: 'B2'
      }
    ],
    chirmoQuestion: 'What kind of work or projects do you usually work on using your computer?',
    chirmoQuestionTr: 'Bilgisayarını kullanarak genellikle ne tür işler veya projeler üzerinde çalışırsın?',
    suggestedAnswers: [
      'I primarily use my computer for software development and learning English.',
      'I work remotely on design and communication tasks throughout the day.',
      'Most of my projects involve research and writing digital documentation.'
    ]
  },
  {
    id: 'backpack',
    emoji: '🎒',
    objectName: 'Travel Backpack',
    turkishName: 'Sırt Çantası & Seyahat Çantası',
    phonetic: '/ˈtræv.əl ˈbæk.pæk/',
    cefrLevel: 'A2',
    vocabularyKeywords: ['compartment', 'zipper', 'portable', 'adventure', 'essentials'],
    contextualSentences: [
      {
        en: 'My backpack carries all my daily essentials including books and keys.',
        tr: 'Sırt çantam kitaplar ve anahtarlar dahil tüm günlük ihtiyaçlarımı taşır.',
        level: 'A2'
      },
      {
        en: 'A durable travel backpack makes weekend trips convenient and lightweight.',
        tr: 'Dayanıklı bir seyahat sırt çantası hafta sonu gezilerini pratik ve hafif kılar.',
        level: 'B1'
      },
      {
        en: 'Packing ergonomically prevents shoulder fatigue during prolonged journeys.',
        tr: 'Ergonomik paketleme uzun yolculuklarda omuz yorgunluğunu önler.',
        level: 'B2'
      }
    ],
    chirmoQuestion: 'Where did you take your last trip, and what are 3 things you always pack in your bag?',
    chirmoQuestionTr: 'Son seyahatini nereye yaptın ve çantana mutlaka koyduğun 3 şey nedir?',
    suggestedAnswers: [
      'I always pack my phone charger, headphones, and a notebook.',
      'My last trip was to the mountains and having a sturdy bag was essential.',
      'I travel light, carrying only my passport, camera, and a water bottle.'
    ]
  },
  {
    id: 'headphones',
    emoji: '🎧',
    objectName: 'Wireless Headphones',
    turkishName: 'Kablosuz Kulaklık',
    phonetic: '/ˈwaɪə.ləs ˈhed.fəʊnz/',
    cefrLevel: 'B1',
    vocabularyKeywords: ['noise-cancelling', 'acoustics', 'podcast', 'audio', 'immersive'],
    contextualSentences: [
      {
        en: 'I listen to English podcasts on my headphones during my commute.',
        tr: 'İşe giderken kulaklığımla İngilizce podcastler dinlerim.',
        level: 'A2'
      },
      {
        en: 'Active noise cancellation helps me concentrate in bustling environments.',
        tr: 'Aktif gürültü engelleme kalabalık ortamlarda konsantre olmama yardımcı olur.',
        level: 'B1'
      },
      {
        en: 'Immersive audio fidelity dramatically enhances language listening comprehension.',
        tr: 'Kapsayıcı ses kalitesi dil dinleme anlama becerisini çarpıcı şekilde artırır.',
        level: 'B2'
      }
    ],
    chirmoQuestion: 'What kind of music or podcasts do you enjoy listening to when you are studying?',
    chirmoQuestionTr: 'Ders çalışırken ne tür müzikler veya podcastler dinlemekten hoşlanırsın?',
    suggestedAnswers: [
      'I enjoy ambient instrumental tracks because they help me maintain deep focus.',
      'I listen to educational English podcasts to train my listening skills.',
      'Upbeat tunes keep me motivated whenever I am exercising or walking.'
    ]
  },
  {
    id: 'window_view',
    emoji: '🪟',
    objectName: 'Window & Weather',
    turkishName: 'Pencere Manzarası & Hava Durumu',
    phonetic: '/ˈwɪn.dəʊ ænd ˈweð.ər/',
    cefrLevel: 'A2',
    vocabularyKeywords: ['daylight', 'breeze', 'cloudy', 'sunny', 'landscape', 'horizon'],
    contextualSentences: [
      {
        en: 'Looking outside the window gives my eyes a relaxing break from the screen.',
        tr: 'Pencereden dışarı bakmak gözlerime ekrandan dinlendirici bir mola verir.',
        level: 'A2'
      },
      {
        en: 'The weather today is pleasantly cool with gentle sunshine.',
        tr: 'Bugün hava tatlı bir serinlikte ve hafif güneşli.',
        level: 'B1'
      },
      {
        en: 'Natural daylight profoundly influences mood, alertness, and circadian rhythm.',
        tr: 'Doğal gün ışığı ruh halini, uyanıklığı ve sirkadiyen ritmi derinden etkiler.',
        level: 'B2'
      }
    ],
    chirmoQuestion: 'How is the weather outside your window right now, and what season do you love most?',
    chirmoQuestionTr: 'Şu anda pencerenden dışarıda hava nasıl ve en çok hangi mevsimi seversin?',
    suggestedAnswers: [
      'It is bright and sunny outside, which makes me feel optimistic.',
      'I adore autumn because of the crisp breeze and colorful falling leaves.',
      'It looks a bit overcast today, but the ambient atmosphere is peaceful.'
    ]
  },
  {
    id: 'water_bottle',
    emoji: '💧',
    objectName: 'Reusable Water Bottle',
    turkishName: 'Yeniden Kullanılabilir Su Matarası',
    phonetic: '/riːˈjuː.zə.bəl ˈwɔː.tər ˌbɒt.əl/',
    cefrLevel: 'A2',
    vocabularyKeywords: ['hydration', 'stainless steel', 'eco-friendly', 'refreshing'],
    contextualSentences: [
      {
        en: 'Drinking enough water every day keeps me energetic and healthy.',
        tr: 'Her gün yeterince su içmek beni enerjik ve sağlıklı tutar.',
        level: 'A2'
      },
      {
        en: 'Carrying a reusable bottle reduces single-use plastic waste significantly.',
        tr: 'Yeniden kullanılabilir bir şişe taşımak tek kullanımlık plastik atıkları belirgin biçimde azaltır.',
        level: 'B1'
      },
      {
        en: 'Optimal cellular hydration promotes endurance, metabolism, and mental sharpness.',
        tr: 'Optimum hücresel hidrasyon dayanıklılığı, metabolizmayı ve zihinsel berraklığı artırır.',
        level: 'B2'
      }
    ],
    chirmoQuestion: 'How many liters of water do you try to drink each day, and do you keep it near your desk?',
    chirmoQuestionTr: 'Günde kaç litre su içmeye çalışırsın ve masanın yanında bulundurur musun?',
    suggestedAnswers: [
      'I keep this bottle on my desk and try to finish two liters every day.',
      'Staying hydrated helps me avoid headaches during long study sessions.',
      'I aim for at least eight glasses of clean water throughout the day.'
    ]
  }
];

export class VisionExplorerService {
  public static getPresetScenes(): DetectedObjectResult[] {
    return PRESET_OBJECT_SCENES;
  }

  public static analyzeObject(queryOrId: string): DetectedObjectResult {
    const clean = (queryOrId || '').trim().toLowerCase();
    
    // Check preset ID match
    const exactMatch = PRESET_OBJECT_SCENES.find(
      s => s.id === clean || s.objectName.toLowerCase() === clean
    );
    if (exactMatch) return exactMatch;

    // Check keyword partial match
    const keywordMatch = PRESET_OBJECT_SCENES.find(
      s => clean.includes(s.id) ||
           s.objectName.toLowerCase().includes(clean) ||
           s.turkishName.toLowerCase().includes(clean) ||
           s.vocabularyKeywords.some(k => clean.includes(k))
    );
    if (keywordMatch) return keywordMatch;

    // Graceful fallback for custom / camera-identified items
    const titleCase = clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'Object';
    return {
      id: 'custom_' + clean.replace(/\s+/g, '_'),
      emoji: '🔍',
      objectName: titleCase,
      turkishName: `${titleCase} (Tespit Edilen Nesne)`,
      phonetic: `/${clean}/`,
      cefrLevel: 'B1',
      vocabularyKeywords: [clean, 'feature', 'practical', 'everyday'],
      contextualSentences: [
        {
          en: `I frequently observe this ${clean} in my surrounding environment.`,
          tr: `Çevremdeki ortamda bu ${clean} nesnesini sıklıkla gözlemlerim.`,
          level: 'A2'
        },
        {
          en: `Understanding how to describe a ${clean} in English broadens practical vocabulary.`,
          tr: `Bir ${clean} nesnesini İngilizce tarif etmeyi anlamak pratik kelime hazinesini genişletir.`,
          level: 'B1'
        },
        {
          en: `Observing real-life objects anchors language acquisition in immediate context.`,
          tr: `Gerçek hayat nesnelerini gözlemlemek dil edinimini anlık bağlama çıpalar.`,
          level: 'B2'
        }
      ],
      chirmoQuestion: `Could you tell me how you interact with or make use of this ${clean} in your daily life?`,
      chirmoQuestionTr: `Günlük hayatında bu ${clean} ile nasıl etkileşime geçtiğini ya da onu nasıl kullandığını anlatır mısın?`,
      suggestedAnswers: [
        `I find this ${clean} very practical and essential for my routine.`,
        `Having this ${clean} nearby makes my daily activities much smoother.`,
        `I use it regularly whenever I want to get things done effectively.`
      ]
    };
  }

  public static evaluateUserResponse(
    target: DetectedObjectResult,
    speechText: string
  ): ObjectSpeakingEvaluation {
    const text = (speechText || '').trim();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount < 3) {
      return {
        isRelevant: false,
        score: 45,
        wordCount,
        feedback: 'A bit too short. Try to speak at least one complete sentence with a subject and verb!',
        feedbackTr: 'Biraz fazla kısa oldu. Öznesi ve yüklemi olan tam bir cümle kurmayı dene!'
      };
    }

    // Check vocabulary relevance
    const targetKeywords = [
      target.objectName.toLowerCase(),
      ...target.vocabularyKeywords.map(k => k.toLowerCase())
    ];

    const hasTargetRef = targetKeywords.some(kw => text.toLowerCase().includes(kw)) ||
      text.toLowerCase().includes('it') ||
      text.toLowerCase().includes('my') ||
      text.toLowerCase().includes('this');

    let score = 75;
    if (wordCount >= 6) score += 10;
    if (wordCount >= 10) score += 10;
    if (hasTargetRef) score += 5;

    score = Math.min(100, score);

    return {
      isRelevant: true,
      score,
      wordCount,
      feedback: score >= 90
        ? 'Outstanding response! Your sentence was natural, fluent, and well structured.'
        : 'Very good job! You expressed your thought clearly in natural English.',
      feedbackTr: score >= 90
        ? 'Harika bir yanıt! Cümlen çok doğal, akıcı ve dil bilgisi açısından kusursuz.'
        : 'Tebrikler! Düşünceni İngilizce olarak net ve anlaşılır bir şekilde ifade ettin.'
    };
  }
}
