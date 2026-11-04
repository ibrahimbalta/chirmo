/**
 * sentencePatternEngine.ts
 * CHIRMO — Kalıptan Cümle Üretme Motoru (Pattern-Based Sentence Generator)
 * 
 * "Kullanıcıya İngilizce cümleleri ezberletmek yerine, kendi cümlelerini nasıl kuracağını öğretir."
 * 
 * Türk öğrencilerin en büyük engeli: Türkçe kelime sırasıyla (Özne + Nesne + Yüklem) düşünmek.
 * İngilizce konuşma refleksi: Özne + Fiil/Kalıp + Nesne (SVO) mantığını ezbersiz oturtmak.
 */

export interface SentencePattern {
  id: string;
  category: 'want' | 'need' | 'like' | 'have' | 'can' | 'question' | 'tense' | 'survival';
  categoryTitle: string;
  pattern: string;
  patternTr: string;
  explanation: string;
  pedagogicalTip: string;
  compatibleWords: Array<{
    id: string;
    en: string;
    tr: string;
    type: 'noun' | 'verb' | 'adjective' | 'place';
    phonetic: string;
  }>;
  permutations?: Array<{
    template: string;
    templateTr: string;
    badge: string;
  }>;
}

export interface PracticeExercise {
  id: string;
  patternId: string;
  type: 'builder' | 'scramble' | 'fill_blank' | 'tr_to_en' | 'qa_dialogue';
  questionPrompt: string;
  questionPromptTr: string;
  correctSentence: string;
  tokens: string[];
  explanation: string;
  whyExplanation: string;
}

// ==================== 1. TEMEL KONUŞMA KALIPLARI KÜTÜPHANESİ ====================
export const CORE_SENTENCE_PATTERNS: SentencePattern[] = [
  // A. İSTEK BİLDİRME
  {
    id: 'pattern-want',
    category: 'want',
    categoryTitle: 'İstek Bildirme (I want...)',
    pattern: 'I want...',
    patternTr: 'Ben ... istiyorum',
    explanation: 'İngilizcede bir şeyi veya bir eylemi istemenin en temel ve doğrudan yoludur. İsimden önce doğrudan gelir ("I want water"), fiilden önce ise "to" alır ("I want to sleep").',
    pedagogicalTip: 'Türkçede fiil cümlenin en sonuna giderken ("Su istiyorum"), İngilizcede istek hemen özneden sonra gelir ("I want..."). Bu refleksi kazanmak Türkçe düşünmeyi kırar.',
    compatibleWords: [
      { id: 'w1', en: 'water', tr: 'su', type: 'noun', phonetic: '/ˈwɔːtər/' },
      { id: 'w2', en: 'coffee', tr: 'kahve', type: 'noun', phonetic: '/ˈkɒfi/' },
      { id: 'w3', en: 'tea', tr: 'çay', type: 'noun', phonetic: '/tiː/' },
      { id: 'w4', en: 'food', tr: 'yemek', type: 'noun', phonetic: '/fuːd/' },
      { id: 'w5', en: 'to sleep', tr: 'uyumak', type: 'verb', phonetic: '/tə sliːp/' },
      { id: 'w6', en: 'to go home', tr: 'eve gitmek', type: 'verb', phonetic: '/tə ɡəʊ həʊm/' },
      { id: 'w7', en: 'to learn English', tr: 'İngilizce öğrenmek', type: 'verb', phonetic: '/tə lɜːn ˈɪŋɡlɪʃ/' }
    ],
    permutations: [
      { template: 'I want {word}.', templateTr: 'Ben {word} istiyorum.', badge: 'Olumlu İstek' },
      { template: "I don't want {word}.", templateTr: 'Ben {word} istemiyorum.', badge: 'Olumsuz İstek' },
      { template: 'Do you want {word}?', templateTr: 'Sen {word} istiyor musun?', badge: 'Soru' },
      { template: 'Can I have {word}?', templateTr: '{word} alabilir miyim?', badge: 'Kibar İstek' }
    ]
  },

  // B. İHTİYAÇ BİLDİRME
  {
    id: 'pattern-need',
    category: 'need',
    categoryTitle: 'İhtiyaç Bildirme (I need...)',
    pattern: 'I need...',
    patternTr: 'Benim ... ihtiyacım var',
    explanation: 'Zorunluluk ve aciliyet belirten en kritik kurtarıcı kalıptır. Seyahatte, otelde veya sokakta kaybolduğunuzda derdinizi anında anlatır.',
    pedagogicalTip: '"I want" keyfidir ("I want coffee"), "I need" ise zaruridir ("I need help"). Bu ayrımı bilmek doğru duygu tonunu verir.',
    compatibleWords: [
      { id: 'w8', en: 'help', tr: 'yardım', type: 'noun', phonetic: '/help/' },
      { id: 'w9', en: 'water', tr: 'su', type: 'noun', phonetic: '/ˈwɔːtər/' },
      { id: 'w10', en: 'a taxi', tr: 'taksi', type: 'noun', phonetic: '/ə ˈtæksi/' },
      { id: 'w11', en: 'more time', tr: 'daha fazla zaman', type: 'noun', phonetic: '/mɔːr taɪm/' },
      { id: 'w12', en: 'a doctor', tr: 'doktor', type: 'noun', phonetic: '/ə ˈdɒktər/' },
      { id: 'w13', en: 'information', tr: 'bilgi', type: 'noun', phonetic: '/ˌɪnfəˈmeɪʃn/' }
    ],
    permutations: [
      { template: 'I need {word}.', templateTr: 'Benim {word} ihtiyacım var.', badge: 'İhtiyaç' },
      { template: "I don't need {word}.", templateTr: 'Benim {word} ihtiyacım yok.', badge: 'İhtiyaçsızlık' },
      { template: 'Do you need {word}?', templateTr: 'Senin {word} ihtiyacın var mı?', badge: 'Soru' }
    ]
  },

  // C. SEVME VE BEĞENME
  {
    id: 'pattern-like',
    category: 'like',
    categoryTitle: 'Beğenme & İlgi (I like / I don\'t like)',
    pattern: 'I like... / I don\'t like...',
    patternTr: 'Ben ... severim / sevmem',
    explanation: 'İnsanlarla sohbet başlatmanın, fikir paylaşmanın ve ortak nokta bulmanın en kolay başlangıç noktasıdır.',
    pedagogicalTip: 'Olumsuz yaparken "I no like" değil, geniş zaman yardımcı fiili olan "don\'t" kullanılır: "I don\'t like...".',
    compatibleWords: [
      { id: 'w14', en: 'music', tr: 'müzik', type: 'noun', phonetic: '/ˈmjuːzɪk/' },
      { id: 'w15', en: 'coffee', tr: 'kahve', type: 'noun', phonetic: '/ˈkɒfi/' },
      { id: 'w16', en: 'this place', tr: 'bu mekan / yer', type: 'place', phonetic: '/ðɪs pleɪs/' },
      { id: 'w17', en: 'your idea', tr: 'senin fikrin', type: 'noun', phonetic: '/jɔːr aɪˈdɪə/' },
      { id: 'w18', en: 'traveling', tr: 'seyahat etmek', type: 'noun', phonetic: '/ˈtrævəlɪŋ/' }
    ],
    permutations: [
      { template: 'I like {word}.', templateTr: 'Ben {word} severim.', badge: 'Beğeni' },
      { template: "I don't like {word}.", templateTr: 'Ben {word} sevmem.', badge: 'Hoşlanmama' },
      { template: 'Do you like {word}?', templateTr: 'Sen {word} sever misin?', badge: 'Soru' }
    ]
  },

  // D. SAHİP OLMA
  {
    id: 'pattern-have',
    category: 'have',
    categoryTitle: 'Sahip Olma (I have... / I don\'t have...)',
    pattern: 'I have... / I don\'t have...',
    patternTr: 'Benim ... var / yok',
    explanation: 'Hem somut eşyaları ("a car") hem de soyut durumları ("a question", "time") anlatmak için kullanılır.',
    pedagogicalTip: 'Türkçedeki "Arabam var" cümlesi İngilizcede "Ben bir arabaya sahibim" (I have a car) şeklinde özneyle başlar.',
    compatibleWords: [
      { id: 'w19', en: 'a car', tr: 'araba', type: 'noun', phonetic: '/ə kɑːr/' },
      { id: 'w20', en: 'a question', tr: 'soru', type: 'noun', phonetic: '/ə ˈkwestʃən/' },
      { id: 'w21', en: 'a problem', tr: 'sorun / problem', type: 'noun', phonetic: '/ə ˈprɒbləm/' },
      { id: 'w22', en: 'time', tr: 'vakit / zaman', type: 'noun', phonetic: '/taɪm/' },
      { id: 'w23', en: 'a reservation', tr: 'rezervasyon', type: 'noun', phonetic: '/ə ˌrezəˈveɪʃn/' }
    ],
    permutations: [
      { template: 'I have {word}.', templateTr: 'Benim {word} var.', badge: 'Var' },
      { template: "I don't have {word}.", templateTr: 'Benim {word} yok.', badge: 'Yok' },
      { template: 'Do you have {word}?', templateTr: 'Senin {word} var mı?', badge: 'Soru' }
    ]
  },

  // E. YAPABİLME
  {
    id: 'pattern-can',
    category: 'can',
    categoryTitle: 'Yetenek & İzin (I can... / Can I...?)',
    pattern: 'I can... / Can I...?',
    patternTr: 'Ben ... yapabilirim / Yapabilir miyim?',
    explanation: 'Yetenek ("I can swim"), rica ("Can you help?") ve izin isteme ("Can I come in?") için sihirli kalıptır.',
    pedagogicalTip: '"Can" sonrasında fiil hiçbir ek almaz: "I can help", "I can swim". En pratik ve zahmetsiz kalıptır.',
    compatibleWords: [
      { id: 'w24', en: 'swim', tr: 'yüzmek', type: 'verb', phonetic: '/swɪm/' },
      { id: 'w25', en: 'help you', tr: 'sana yardım etmek', type: 'verb', phonetic: '/help juː/' },
      { id: 'w26', en: 'speak a little English', tr: 'biraz İngilizce konuşmak', type: 'verb', phonetic: '/spiːk ə ˈlɪtl ˈɪŋɡlɪʃ/' },
      { id: 'w27', en: 'do it', tr: 'bunu yapmak', type: 'verb', phonetic: '/duː ɪt/' },
      { id: 'w28', en: 'come in', tr: 'içeri girmek', type: 'verb', phonetic: '/kʌm ɪn/' }
    ],
    permutations: [
      { template: 'I can {word}.', templateTr: 'Ben {word} yapabilirim.', badge: 'Yetenek' },
      { template: "I can't {word}.", templateTr: 'Ben {word} yapamam.', badge: 'Yetersizlik' },
      { template: 'Can I {word}?', templateTr: 'Ben {word} yapabilir miyim?', badge: 'İzin İsteme' },
      { template: 'Can you {word}?', templateTr: 'Sen {word} yapabilir misin?', badge: 'Rica' }
    ]
  },

  // F. SORU SORMA
  {
    id: 'pattern-question',
    category: 'question',
    categoryTitle: 'Soru Kalıpları (Where is...? / What is...? / How much is...?)',
    pattern: 'Where / What / How much is...?',
    patternTr: 'Nerede / Nedir / Ne kadar?',
    explanation: 'Yurtdışında veya bir yabancıyla konuşurken en çok ihtiyaç duyacağınız 3 temel soru köküdür.',
    pedagogicalTip: 'Soru kelimesi (Where/What) her zaman cümlenin en başına gelir, ardından "is/are" gelir.',
    compatibleWords: [
      { id: 'w29', en: 'the hotel', tr: 'otel', type: 'place', phonetic: '/ðə həʊˈtel/' },
      { id: 'w30', en: 'the toilet', tr: 'tuvalet / lavabo', type: 'place', phonetic: '/ðə ˈtɔɪlət/' },
      { id: 'w31', en: 'the bus station', tr: 'otobüs durağı / otogar', type: 'place', phonetic: '/ðə bʌs ˈsteɪʃn/' },
      { id: 'w32', en: 'your name', tr: 'adın', type: 'noun', phonetic: '/jɔːr neɪm/' },
      { id: 'w33', en: 'this coffee', tr: 'bu kahve', type: 'noun', phonetic: '/ðɪs ˈkɒfi/' }
    ],
    permutations: [
      { template: 'Where is {word}?', templateTr: '{word} nerede?', badge: 'Konum Sorusu' },
      { template: 'What is {word}?', templateTr: '{word} nedir?', badge: 'Tanım Sorusu' },
      { template: 'How much is {word}?', templateTr: '{word} ne kadar?', badge: 'Fiyat Sorusu' }
    ]
  },

  // G. ZAMAN MANTIĞI
  {
    id: 'pattern-tense',
    category: 'tense',
    categoryTitle: 'Zaman Mantığı (Gramer Ezberi Yok)',
    pattern: 'I work / I am working / I worked / I will work',
    patternTr: 'Çalışırım / Çalışıyorum / Çalıştım / Çalışacağım',
    explanation: 'Zamanları gramer formülleriyle değil, günlük hayatın anlarıyla öğrenin: Geniş zaman, şu an, geçmiş ve gelecek.',
    pedagogicalTip: 'Gelecek için her zaman "will" ekleyin ("I will go"), geçmiş için genelde "-ed" ekleyin ("I worked"). İşte bu kadar basit!',
    compatibleWords: [
      { id: 'w34', en: 'work', tr: 'çalışmak', type: 'verb', phonetic: '/wɜːk/' },
      { id: 'w35', en: 'call you', tr: 'seni aramak', type: 'verb', phonetic: '/kɔːl juː/' },
      { id: 'w36', en: 'study', tr: 'ders çalışmak', type: 'verb', phonetic: '/ˈstʌdi/' },
      { id: 'w37', en: 'wait', tr: 'beklemek', type: 'verb', phonetic: '/weɪt/' }
    ],
    permutations: [
      { template: 'I {word}.', templateTr: 'Ben {word} yaparım.', badge: 'Genel Alışkanlık' },
      { template: 'I am {word}ing.', templateTr: 'Şu an {word} yapıyorum.', badge: 'Şu An' },
      { template: 'I will {word}.', templateTr: 'Ben {word} yapacağım.', badge: 'Gelecek Planı' }
    ]
  },

  // H. KURTARICI VE YARDIMCI KALIPLAR
  {
    id: 'pattern-survival',
    category: 'survival',
    categoryTitle: 'Kurtarıcı & Nezaket Kalıpları',
    pattern: 'Survival Phrases',
    patternTr: 'Diyaloğu Kurtaran İfadeler',
    explanation: 'Karşı taraf hızlı konuştuğunda, anlamadığınızda veya zaman kazanmak istediğinizde hayatınızı kurtaran kalıplar.',
    pedagogicalTip: 'Bir şeyi anlamadığınızda susup donup kalmayın! "Please speak slowly" veya "Could you repeat?" deyin; yabancılar bunu nezaketle karşılar.',
    compatibleWords: [
      { id: 'w38', en: "I don't understand", tr: 'Anlamıyorum', type: 'noun', phonetic: '/aɪ dəʊnt ˌʌndəˈstænd/' },
      { id: 'w39', en: 'Please repeat', tr: 'Lütfen tekrar edin', type: 'verb', phonetic: '/pliːz rɪˈpiːt/' },
      { id: 'w40', en: 'Speak slowly, please', tr: 'Lütfen yavaş konuşun', type: 'verb', phonetic: '/spiːk ˈsləʊli pliːz/' },
      { id: 'w41', en: 'What do you mean?', tr: 'Ne demek istiyorsun?', type: 'noun', phonetic: '/wɒt də juː miːn/' },
      { id: 'w42', en: 'No problem', tr: 'Sorun değil / Rica ederim', type: 'noun', phonetic: '/nəʊ ˈprɒbləm/' },
      { id: 'w43', en: 'Excuse me', tr: 'Affedersiniz', type: 'noun', phonetic: '/ɪkˈskjuːs miː/' }
    ]
  }
];

// ==================== 2. KALIP ALIŞTIRMALARI (SENTENCE BUILDER EXERCISES) ====================
export const INTERACTIVE_BUILDER_EXERCISES: PracticeExercise[] = [
  {
    id: 'ex-1',
    patternId: 'pattern-want',
    type: 'builder',
    questionPrompt: '"Ben kahve istiyorum." cümlesini kurun.',
    questionPromptTr: 'İstek bildiren "I want" kalıbını kahve ile birleştirin.',
    correctSentence: 'I want coffee.',
    tokens: ['I', 'want', 'coffee', 'need', 'water'],
    explanation: '"I want" doğrudan istenen nesneden önce gelir.',
    whyExplanation: 'Türkçede nesne ("kahve") ortada, fiil ("istiyorum") sonda yer alır. İngilizcede ise özne ("I") ve eylem ("want") hemen yan yanadır.'
  },
  {
    id: 'ex-2',
    patternId: 'pattern-want',
    type: 'builder',
    questionPrompt: '"Ben uyumak istiyorum." cümlesini kurun.',
    questionPromptTr: 'Bir eylemi isterken "want" ve "sleep" arasına ne gelir?',
    correctSentence: 'I want to sleep.',
    tokens: ['I', 'want', 'to', 'sleep', 'sleeping', 'coffee'],
    explanation: '"want" sonrasında başka bir fiil gelirse araya "to" bağı girer.',
    whyExplanation: 'İki fiil (istemek ve uyumak) yan yana geldiğinde ikinci fiil mastar eki olan "to" ile bağlanır: "I want to sleep".'
  },
  {
    id: 'ex-3',
    patternId: 'pattern-need',
    type: 'scramble',
    questionPrompt: 'Kelimeleri doğru sıraya dizin: "Yardıma ihtiyacım var."',
    questionPromptTr: 'Acil durumlarda hayat kurtaran cümle.',
    correctSentence: 'I need help.',
    tokens: ['help', 'I', 'need'],
    explanation: 'Özne (I) + İhtiyaç Fiili (need) + İhtiyaç Duyulan Şey (help).',
    whyExplanation: '"Need" fiili Türkçedeki "...e ihtiyacım var" ifadesinin tam karşılığıdır ve doğrudan nesneyle birleşir.'
  },
  {
    id: 'ex-4',
    patternId: 'pattern-question',
    type: 'fill_blank',
    questionPrompt: 'Otel nerede diye soracaksınız: "______ is the hotel?"',
    questionPromptTr: 'Boşluğa doğru soru kelimesini yerleştirin.',
    correctSentence: 'Where is the hotel?',
    tokens: ['Where', 'What', 'How', 'Who'],
    explanation: 'Konum ve yer sormak için "Where" (Nerede) kullanılır.',
    whyExplanation: 'Türkçede "Otel nerede?" derken nerede kelimesi sondadır. İngilizcede ise bütün soru kökleri en başa geçer: "Where is..."'
  },
  {
    id: 'ex-5',
    patternId: 'pattern-can',
    type: 'builder',
    questionPrompt: '"Biraz İngilizce konuşabilirim." cümlesini kurun.',
    questionPromptTr: 'Özgüvenle kendinizi ifade edin.',
    correctSentence: 'I can speak a little English.',
    tokens: ['I', 'can', 'speak', 'a little', 'English', 'to'],
    explanation: '"can" sonrası fiil asla "to" almaz, yalın kalır.',
    whyExplanation: 'Modal fiillerden (can, should, must) sonra fiil ek almadan en saf haliyle kullanılır.'
  },
  {
    id: 'ex-6',
    patternId: 'pattern-question',
    type: 'builder',
    questionPrompt: '"Bu kahve ne kadar?" fiyat sorusunu kurun.',
    questionPromptTr: 'Alışverişte fiyat sorarken hangi kalıp kullanılır?',
    correctSentence: 'How much is this coffee?',
    tokens: ['How much', 'is', 'this', 'coffee', 'Where', 'are'],
    explanation: 'Fiyat sorarken sayılamayan ürünler için "How much is...?" kullanılır.',
    whyExplanation: '"How much" (ne kadar) soru öbeği nesnenin fiyatını doğrudan sormanın en doğal ve yaygın yoludur.'
  },
  {
    id: 'ex-7',
    patternId: 'pattern-like',
    type: 'builder',
    questionPrompt: '"Ben bu mekanı seviyorum." cümlesini kurun.',
    questionPromptTr: 'Bir yeri beğendiğinizi ifade ederken "I like" kalıbı kullanılır.',
    correctSentence: 'I like this place.',
    tokens: ['I', 'like', 'this', 'place', 'want', 'am'],
    explanation: '"I like" kalıbı doğrudan beğenilen yer ile birleşir.',
    whyExplanation: 'İngilizcede beğeni bildirmek için en doğal ve dolaysız fiil "like"tır.'
  },
  {
    id: 'ex-8',
    patternId: 'pattern-have',
    type: 'builder',
    questionPrompt: '"Benim bir sorum var." cümlesini kurun.',
    questionPromptTr: 'Derste veya toplantıda söz alırken kullanılır.',
    correctSentence: 'I have a question.',
    tokens: ['I', 'have', 'a', 'question', 'has', 'do'],
    explanation: 'Sahip olma durumunda "I have" kalıbı kullanılır.',
    whyExplanation: 'Türkçedeki "Sorum var" ifadesi İngilizcede özneyle başlar: "I have a question".'
  },
  {
    id: 'ex-9',
    patternId: 'pattern-survival',
    type: 'scramble',
    questionPrompt: 'Kelimeleri sıraya dizin: "Lütfen tekrar edin."',
    questionPromptTr: 'Karşı tarafı anlamadığınızda kullanılan kurtarıcı kalıp.',
    correctSentence: 'Please repeat.',
    tokens: ['repeat', 'Please'],
    explanation: 'Nezaketle rica ederken "Please" ile başlanır veya bitirilir.',
    whyExplanation: '"Please repeat" kısa, net ve evrensel bir rica ifadesidir.'
  },
  {
    id: 'ex-10',
    patternId: 'pattern-can',
    type: 'fill_blank',
    questionPrompt: 'İçeri girebilir miyim diye soracaksınız: "______ I come in?"',
    questionPromptTr: 'İzin istemek için hangi yardımcı fiil başa gelir?',
    correctSentence: 'Can I come in?',
    tokens: ['Can', 'Do', 'Am', 'Have'],
    explanation: 'İzin isterken cümle "Can I..." ile başlar.',
    whyExplanation: '"Can I" izin ve yetki sormada en pratik başlangıçtır.'
  },
  {
    id: 'ex-11',
    patternId: 'pattern-need',
    type: 'builder',
    questionPrompt: '"Benim bir taksiye ihtiyacım var." cümlesini kurun.',
    questionPromptTr: 'Acil ulaşım ihtiyacınızı bildirin.',
    correctSentence: 'I need a taxi.',
    tokens: ['I', 'need', 'a', 'taxi', 'want', 'car'],
    explanation: 'Zorunlu ihtiyaçlarda "need" kullanılır.',
    whyExplanation: '"a taxi" tekil bir araç olduğu için "a" artikeliyle kullanılır.'
  },
  {
    id: 'ex-12',
    patternId: 'pattern-tense',
    type: 'builder',
    questionPrompt: '"Ben çalışacağım." gelecek zaman cümlesini kurun.',
    questionPromptTr: 'Gelecek zaman için hangi yardımcı kelime kullanılır?',
    correctSentence: 'I will work.',
    tokens: ['I', 'will', 'work', 'am', 'worked'],
    explanation: 'Gelecek planları ve niyetler için "will" kullanılır.',
    whyExplanation: '"will" fiilin önüne gelerek ona -ecek/-acak anlamı katar.'
  }
];

export class SentencePatternEngine {
  /**
   * Tüm kalıpları listeler
   */
  static getAllPatterns(): SentencePattern[] {
    return CORE_SENTENCE_PATTERNS;
  }

  /**
   * Kategoriye göre kalıp getirir
   */
  static getPatternByCategory(category: string): SentencePattern | undefined {
    return CORE_SENTENCE_PATTERNS.find((p) => p.category === category);
  }

  /**
   * Bir kelime için permutasyon cümleleri üretir.
   * Örn: "coffee" kelimesi için 6 farklı kalıp varyasyonu türetir.
   */
  static generateWordPermutations(wordEn: string, wordTr: string): Array<{
    patternBadge: string;
    sentenceEn: string;
    sentenceTr: string;
    audioText: string;
    pedagogicalTip: string;
  }> {
    return [
      {
        patternBadge: 'İstek (Want)',
        sentenceEn: `I want ${wordEn}.`,
        sentenceTr: `Ben ${wordTr} istiyorum.`,
        audioText: `I want ${wordEn}`,
        pedagogicalTip: 'Doğrudan isteğinizi belirtirken kullanılır.'
      },
      {
        patternBadge: 'İhtiyaç (Need)',
        sentenceEn: `I need ${wordEn}.`,
        sentenceTr: `Benim ${wordTr} ihtiyacım var.`,
        audioText: `I need ${wordEn}`,
        pedagogicalTip: 'Daha acil ve zorunlu durumlarda kullanılır.'
      },
      {
        patternBadge: 'Beğenme (Like)',
        sentenceEn: `I like ${wordEn}.`,
        sentenceTr: `Ben ${wordTr} severim.`,
        audioText: `I like ${wordEn}`,
        pedagogicalTip: 'Zevk ve tercihlerinizi anlatırken kullanılır.'
      },
      {
        patternBadge: 'Kibar İstek (Can I have)',
        sentenceEn: `Can I have ${wordEn}?`,
        sentenceTr: `${wordTr} alabilir miyim?`,
        audioText: `Can I have ${wordEn}`,
        pedagogicalTip: 'Kafe veya restoranda sipariş verirken en kibar kalıptır.'
      },
      {
        patternBadge: 'Soru Sorma (Do you want)',
        sentenceEn: `Do you want ${wordEn}?`,
        sentenceTr: `Sen ${wordTr} ister misin?`,
        audioText: `Do you want ${wordEn}`,
        pedagogicalTip: 'Karşı tarafa bir şey ikram ederken veya sorarken kullanılır.'
      },
      {
        patternBadge: 'Olumsuz İstek (Don\'t want)',
        sentenceEn: `I don't want ${wordEn}.`,
        sentenceTr: `Ben ${wordTr} istemiyorum.`,
        audioText: `I don't want ${wordEn}`,
        pedagogicalTip: 'İstenmeyen şeyleri kibarca reddederken kullanılır.'
      }
    ];
  }

  /**
   * Kalıp egzersizlerini getirir
   */
  static getExercises(): PracticeExercise[] {
    return INTERACTIVE_BUILDER_EXERCISES;
  }
}
