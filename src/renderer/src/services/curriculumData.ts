// Chirmo 30 Günde Sıfırdan Konuşma Metodu (Chirmo Fluent Reflex Method)
// 20 Yıllık Öğretmenlik Tecrübesiyle: Gramer Ezberi Yok, Konuşma ve Refleks Var!

import { TargetLanguageService, SupportedLanguage } from './targetLanguageService';
import { GERMAN_REAL_LIFE_SCENARIOS, GERMAN_DAY_MISSIONS } from './germanCurriculumData';

export interface RealLifeScenario {
  id: string;
  category: string;
  title: string;
  badge: string;
  description: string;
  keyChunks: Array<{
    en: string;
    tr: string;
    phonetic: string;
    example: string;
    exampleTr: string;
  }>;
  interactiveChallenge: {
    situation: string;
    situationTr: string;
    aiQuestion: string;
    aiQuestionTr: string;
    suggestedAnswer: string;
    suggestedAnswerTr: string;
    coachTip: string;
  };
}

export interface DayMission {
  day: number;
  week: number;
  title: string;
  theme: string;
  speakingGoal: string;
  speakingGoalTr: string;
  aiPrompt: string;
  aiPromptTr: string;
  suggestedAnswer: string;
  suggestedAnswerTr: string;
  xpReward: number;
  keyVocabulary: string[];
  nativeCoachTip: string;
}

// ==================== 1. HAYAT KURTARAN 8 GERÇEK YAŞAM SENARYOSU ====================
export const REAL_LIFE_SCENARIOS: RealLifeScenario[] = [
  {
    id: 'scenario-coffee',
    category: 'Kafe & Restoran',
    title: 'Kahve & Yemek Siparişi (Yerli Gibi İste)',
    badge: '☕ Kafe & Bar',
    description: 'Yurtdışında veya Starbucks\'ta paniklemeden, en doğal Amerikan/İngiliz kalıbıyla sipariş ver.',
    keyChunks: [
      {
        en: 'Can I get an iced latte to go?',
        tr: 'Buzlu latte alabilir miyim, paket olsun?',
        phonetic: '/kæn aɪ ɡet ən aɪst ˈlɑːteɪ tə ɡəʊ/',
        example: 'Can I get an iced latte to go, please?',
        exampleTr: 'Buzlu latte alabilir miyim lütfen, paket olsun?'
      },
      {
        en: 'What do you recommend?',
        tr: 'Neyi tavsiye edersiniz? / Ne önerirsiniz?',
        phonetic: '/wɒt duː juː ˌrekəˈmend/',
        example: 'It\'s my first time here, what do you recommend?',
        exampleTr: 'Buraya ilk gelişim, siz ne önerirsiniz?'
      },
      {
        en: 'Could we have the bill, please?',
        tr: 'Hesabı alabilir miyiz lütfen?',
        phonetic: '/kʊd wiː hæv ðə bɪl pliːz/',
        example: 'Could we have the bill, please? We are in a hurry.',
        exampleTr: 'Hesabı alabilir miyiz lütfen? Biraz acelemiz var.'
      },
      {
        en: 'Keep the change',
        tr: 'Üstü kalsın',
        phonetic: '/kiːp ðə tʃeɪndʒ/',
        example: 'Here is twenty dollars, keep the change.',
        exampleTr: 'Buyrun yirmi dolar, üstü kalsın.'
      }
    ],
    interactiveChallenge: {
      situation: 'Garson masanıza geldi ve siparişinizi sordu.',
      situationTr: 'Kahve dükkanında paket bir filtre kahve ve kruvasan isteyeceksin.',
      aiQuestion: 'Hi there! What can I get started for you today?',
      aiQuestionTr: 'Merhaba! Bugün sizin için ne hazırlayabilirim?',
      suggestedAnswer: 'Can I get a black coffee and a croissant to go, please?',
      suggestedAnswerTr: 'Bir sade kahve ve bir kruvasan alabilir miyim lütfen, paket olsun?',
      coachTip: '"Can I get..." kalıbı İngilizcede bir şey isterken en sihirli ve en doğal anahtardır! "I want" kaba duyulabilir.'
    }
  },
  {
    id: 'scenario-travel',
    category: 'Havalimanı & Seyahat',
    title: 'Havalimanı, Pasaport & Otel',
    badge: '✈️ Seyahat',
    description: 'Uçakta koltuk sormaktan bagaj bulmaya ve otele giriş yapmaya kadar tüm seyahat refleksleri.',
    keyChunks: [
      {
        en: 'Where is the baggage claim?',
        tr: 'Bagaj alım yeri nerede?',
        phonetic: '/weər ɪz ðə ˈbæɡɪdʒ kleɪm/',
        example: 'Excuse me, where is the baggage claim for flight TK18?',
        exampleTr: 'Affedersiniz, TK18 uçuşunun bagaj teslimi nerede?'
      },
      {
        en: 'I have a reservation under the name...',
        tr: '... adına bir rezervasyonum var',
        phonetic: '/aɪ hæv ə ˌrezəˈveɪʃn ˈʌndər ðə neɪm/',
        example: 'I have a reservation under the name John Smith.',
        exampleTr: 'John Smith adına yapılmış bir rezervasyonum var.'
      },
      {
        en: 'Window or aisle seat?',
        tr: 'Cam kenarı mı koridor mu?',
        phonetic: '/ˈwɪndəʊ ɔːr aɪl siːt/',
        example: 'I would prefer a window seat, please.',
        exampleTr: 'Cam kenarı bir koltuk tercih ederim lütfen.'
      },
      {
        en: 'Is breakfast included?',
        tr: 'Kahvaltı dahil mi?',
        phonetic: '/ɪz ˈbrekfəst ɪnˈkluːdɪd/',
        example: 'Quick question: Is breakfast included in the room rate?',
        exampleTr: 'Kısa bir soru: Oda fiyatına kahvaltı dahil mi?'
      }
    ],
    interactiveChallenge: {
      situation: 'Otel resepsiyonundasın, check-in yapıyorsun.',
      situationTr: 'Otele vardın ve rezervasyonun olduğunu belirtip anahtarını isteyeceksin.',
      aiQuestion: 'Good evening! Welcome to the Grand Central Hotel. How may I help you?',
      aiQuestionTr: 'İyi akşamlar! Otele hoş geldiniz. Size nasıl yardımcı olabilirim?',
      suggestedAnswer: 'Hello! I have a reservation under the name Ali. I would like to check in.',
      suggestedAnswerTr: 'Merhaba! Ali adına bir rezervasyonum var. Giriş (check-in) yapmak istiyorum.',
      coachTip: '"aisle" derken \'s\' harfini kesinlikle okuma, "ayıl" şeklinde telaffuz edilir!'
    }
  },
  {
    id: 'scenario-icebreaker',
    category: 'Sosyal Tanışma',
    title: 'İlk Tanışma & Havadan Sudan Konuşma',
    badge: '👋 Tanışma & Muhabbet',
    description: 'Biriyle ilk karşılaştığında sessizlik anını kıracak samimi ve havalı başlangıçlar.',
    keyChunks: [
      {
        en: 'Nice to finally meet you!',
        tr: 'Sonunda seninle tanıştığıma çok memnun oldum!',
        phonetic: '/naɪs tə ˈfaɪnəli miːt juː/',
        example: 'Nice to finally meet you in person!',
        exampleTr: 'Sonunda seninle yüz yüze tanıştığıma çok memnun oldum!'
      },
      {
        en: 'What do you do for a living?',
        tr: 'Ne iş yapıyorsunuz? / Mesleğiniz ne?',
        phonetic: '/wɒt duː juː duː fər ə ˈlɪvɪŋ/',
        example: 'So, what do you do for a living in Berlin?',
        exampleTr: 'Peki, Berlin\'de ne işle meşgulsünüz?'
      },
      {
        en: 'How do you know each other?',
        tr: 'Birbirinizi nereden tanıyorsunuz?',
        phonetic: '/haʊ duː juː nəʊ iːtʃ ˈʌðər/',
        example: 'You two look like old friends, how do you know each other?',
        exampleTr: 'Eski dost gibisiniz, birbirinizi nereden tanıyorsunuz?'
      },
      {
        en: 'Long time no see!',
        tr: 'Görüşmeyeli uzun zaman oldu! / Nerelerdesin!',
        phonetic: '/lɒŋ taɪm nəʊ siː/',
        example: 'Hey Mark! Long time no see! How have you been?',
        exampleTr: 'Selam Mark! Nerelerdesin ya! Nasıl gidiyor?'
      }
    ],
    interactiveChallenge: {
      situation: 'Bir partide veya etkinlikte yanındaki yabancı sana selam verdi.',
      situationTr: 'Kendini kısaca tanıt ve ne iş yaptığını samimi bir dille söyle.',
      aiQuestion: 'Hey there! Nice party, isn\'t it? I\'m Alex. Where are you from?',
      aiQuestionTr: 'Selam! Harika bir parti değil mi? Ben Alex. Nerelisin?',
      suggestedAnswer: 'Hi Alex! Nice to meet you. I am from Turkey and I work in software.',
      suggestedAnswerTr: 'Selam Alex! Tanıştığıma sevindim. Türkiyeliyim ve yazılım sektöründe çalışıyorum.',
      coachTip: '"What is your job?" yerine her zaman "What do you do for a living?" kalıbını kullan. Çok daha samimidir.'
    }
  },
  {
    id: 'scenario-reactions',
    category: 'Doğal Tepkiler',
    title: 'Amerikalı / İngiliz Gibi Tepki Verme',
    badge: '⚡ Doğal Tepkiler',
    description: 'Robot gibi "Yes/No" demek yerine sohbete canlılık katan refleks cümleleri.',
    keyChunks: [
      {
        en: 'No way! Are you serious?',
        tr: 'Yok artık! Ciddi misin?',
        phonetic: '/nəʊ weɪ ɑːr juː ˈsɪəriəs/',
        example: 'No way! Are you serious? That is incredible!',
        exampleTr: 'Yok artık! Ciddi misin sen? Bu inanılmaz!'
      },
      {
        en: 'That makes total sense.',
        tr: 'Bu çok mantıklı / Haklısın.',
        phonetic: '/ðæt meɪks ˈtəʊtl sens/',
        example: 'Thanks for explaining, that makes total sense.',
        exampleTr: 'Açıkladığın için sağ ol, kafama çok iyi yattı.'
      },
      {
        en: 'Never mind, it doesn\'t matter.',
        tr: 'Boşver, hiç önemli değil.',
        phonetic: '/ˈnevər maɪnd ɪt ˈdʌznt ˈmætər/',
        example: 'Oh, never mind, it doesn\'t matter at all.',
        exampleTr: 'Aman boşver, zerre kadar önemli değil.'
      },
      {
        en: 'I couldn\'t agree more!',
        tr: 'Kesinlikle tamamen katılıyorum!',
        phonetic: '/aɪ ˈkʊdnt əˈɡriː mɔː/',
        example: 'You are so right, I couldn\'t agree more!',
        exampleTr: 'Çok haklısın, sana daha fazla katılamazdım!'
      }
    ],
    interactiveChallenge: {
      situation: 'Arkadaşın sana çılgın bir haber verdi: Piyangodan para kazanmış!',
      situationTr: 'Şaşkınlığını ve tebriğini samimi bir şekilde dile getir.',
      aiQuestion: 'Guess what! I just won two free tickets to London!',
      aiQuestionTr: 'Tahmin et ne oldu! Londra\'ya iki ücretsiz uçak bileti kazandım!',
      suggestedAnswer: 'No way! Are you serious? That is amazing news, congratulations!',
      suggestedAnswerTr: 'Yok artık! Ciddi misin? Bu harika bir haber, tebrik ederim!',
      coachTip: '"No way!" derken ses tonunu şaşırmış gibi yükselt. Dilde duygu konuşmayı 10 kat hızlandırır!'
    }
  },
  {
    id: 'scenario-directions',
    category: 'Yol Tarifi & Şehir',
    title: 'Şehirde Kaybolunca Yol Bulma',
    badge: '🗺️ Yol & Şehir',
    description: 'Yurtdışında kaybolduğunda metro, taksi ve sokakta insanlara sorma rehberi.',
    keyChunks: [
      {
        en: 'Is it within walking distance?',
        tr: 'Yürüme mesafesinde mi?',
        phonetic: '/ɪz ɪt wɪðˈɪn ˈwɔːkɪŋ ˈdɪstəns/',
        example: 'Excuse me, is the museum within walking distance?',
        exampleTr: 'Affedersiniz, müze yürüme mesafesinde mi?'
      },
      {
        en: 'How can I get to the nearest subway?',
        tr: 'En yakın metroya nasıl gidebilirim?',
        phonetic: '/haʊ kæn aɪ ɡet tə ðə ˈnɪərɪst ˈsʌbweɪ/',
        example: 'How can I get to the nearest subway station from here?',
        exampleTr: 'Buradan en yakın metro istasyonuna nasıl gidebilirim?'
      },
      {
        en: 'You can\'t miss it.',
        tr: 'Gözünden kaçması imkansız / Hemen görürsün.',
        phonetic: '/juː kɑːnt mɪs ɪt/',
        example: 'It\'s right on the corner, you can\'t miss it.',
        exampleTr: 'Hemen köşede, görmemen imkansız.'
      }
    ],
    interactiveChallenge: {
      situation: 'Yabancı bir şehirde taksiye bindin ve gitmek istediğin yeri söylüyorsun.',
      situationTr: 'Havalimanına gitmek istediğini ve ne kadar süreceğini sor.',
      aiQuestion: 'Hello there! Where can I take you today?',
      aiQuestionTr: 'Merhaba! Sizi bugün nereye götüreyim?',
      suggestedAnswer: 'To the airport please. How long does it usually take from here?',
      suggestedAnswerTr: 'Havalimanına lütfen. Buradan oraya gitmek genellikle ne kadar sürer?',
      coachTip: '"Within walking distance" kalıbı turistlerin en çok kullandığı ve sevdikleri kalıptır.'
    }
  },
  {
    id: 'scenario-work-web',
    category: 'İş & İnternet',
    title: 'Online Görüşmeler & E-posta Dili',
    badge: '💻 İş & Dijital',
    description: 'Zoom toplantılarında ses gitmeyince ne denir? E-posta ve iş görüşmesi refleksleri.',
    keyChunks: [
      {
        en: 'You are on mute!',
        tr: 'Mikrofonun kapalı / Sessizdesin!',
        phonetic: '/juː ɑːr ɒn mjuːt/',
        example: 'Hey David, you are on mute, we can\'t hear you.',
        exampleTr: 'Hey David, sessizdesin, seni duyamıyoruz.'
      },
      {
        en: 'Could you speak a bit slower, please?',
        tr: 'Biraz daha yavaş konuşabilir misiniz lütfen?',
        phonetic: '/kʊd juː spiːk ə bɪt ˈsləʊər pliːz/',
        example: 'My connection was laggy, could you speak a bit slower?',
        exampleTr: 'Bağlantım takıldı, biraz daha yavaş konuşabilir misiniz?'
      },
      {
        en: 'I\'ll shoot you an email.',
        tr: 'Sana e-posta atacağım.',
        phonetic: '/aɪl ʃuːt juː ən ˈiːmeɪl/',
        example: 'Let\'s talk tomorrow, I\'ll shoot you an email with the details.',
        exampleTr: 'Yarın konuşalım, detayları sana e-posta ile gönderirim.'
      }
    ],
    interactiveChallenge: {
      situation: 'Online toplantıdasın ve karşı taraf çok hızlı konuştu.',
      situationTr: 'Kibarca tekrar etmesini ve yavaş konuşmasını iste.',
      aiQuestion: 'Did everyone understand the project roadmap for the next quarter?',
      aiQuestionTr: 'Gelecek çeyrek için proje yol haritasını herkes anladı mı?',
      suggestedAnswer: 'Sorry, could you repeat the last point a bit slower, please?',
      suggestedAnswerTr: 'Affedersiniz, son maddeyi biraz daha yavaş tekrar edebilir misiniz lütfen?',
      coachTip: 'Anlamadığın zaman susup kalma! "Could you speak a bit slower?" demek profesyonel bir özgüvendir.'
    }
  },
  {
    id: 'scenario-emergency',
    category: 'Acil Durumlar',
    title: 'Doktor, Eczane & Acil Yardım',
    badge: '🚨 Acil Durum',
    description: 'Yurtdışında rahatsızlandığında derdini anlatabilme ve ilaç isteyebilme güvencesi.',
    keyChunks: [
      {
        en: 'I have a terrible headache.',
        tr: 'Korkunç bir baş ağrım var.',
        phonetic: '/aɪ hæv ə ˈterəbl ˈhedeɪk/',
        example: 'I have a terrible headache and fever.',
        exampleTr: 'Korkunç bir baş ağrım ve ateşim var.'
      },
      {
        en: 'Do you have something for a sore throat?',
        tr: 'Boğaz ağrısı için bir şeyiniz var mı?',
        phonetic: '/duː juː hæv ˈsʌmθɪŋ fər ə sɔːr θrəʊt/',
        example: 'Excuse me, do you have something for a sore throat?',
        exampleTr: 'Affedersiniz, boğaz ağrısı için bir ilacınız var mı?'
      },
      {
        en: 'I lost my passport, where is the embassy?',
        tr: 'Pasaportumu kaybettim, elçilik nerede?',
        phonetic: '/aɪ lɒst maɪ ˈpɑːspɔːt weər ɪz ðə ˈembəsi/',
        example: 'Help me please, I lost my passport.',
        exampleTr: 'Bana yardım edin lütfen, pasaportumu kaybettim.'
      }
    ],
    interactiveChallenge: {
      situation: 'Eczaneye girdin, boğazın ağrıyor ve pastil istiyorsun.',
      situationTr: 'Eczacıya şikayetini anlat ve boğaz pastili iste.',
      aiQuestion: 'Hello, how can I help you today?',
      aiQuestionTr: 'Merhaba, bugün size nasıl yardımcı olabilirim?',
      suggestedAnswer: 'Hello, I have a sore throat. Do you have throat lozenges?',
      suggestedAnswerTr: 'Merhaba, boğazım ağrıyor. Boğaz pastiliniz var mı?',
      coachTip: '"I have a sore throat" kalıbında \'th\' sesini dilinin ucunu dişlerinin arasına hafifçe değdirerek çıkar.'
    }
  },
  {
    id: 'scenario-shopping',
    category: 'Alışveriş & Mağaza',
    title: 'Mağazada Beden & İndirim Sorma',
    badge: '🛍️ Alışveriş',
    description: 'Yurtdışında kıyafet denerken kabin, beden ve indirim sorma pratikleri.',
    keyChunks: [
      {
        en: 'Do you have this in a medium?',
        tr: 'Bunun M (medium) bedeni var mı?',
        phonetic: '/duː juː hæv ðɪs ɪn ə ˈmiːdiəm/',
        example: 'I love this jacket, do you have this in a medium?',
        exampleTr: 'Bu cekete bayıldım, bunun M bedeni var mı?'
      },
      {
        en: 'Where are the fitting rooms?',
        tr: 'Deneme kabinleri nerede?',
        phonetic: '/weər ɑːr ðə ˈfɪtɪŋ ruːmz/',
        example: 'Excuse me, where are the fitting rooms located?',
        exampleTr: 'Affedersiniz, deneme kabinleri nerede kalıyor?'
      },
      {
        en: 'I\'m just browsing, thank you.',
        tr: 'Sadece bakınıyorum, teşekkürler.',
        phonetic: '/aɪm dʒʌst ˈbraʊzɪŋ θæŋk juː/',
        example: 'No help needed, I\'m just browsing, thank you!',
        exampleTr: 'Yardıma gerek yok, sadece bakınıyorum, sağ olun!'
      }
    ],
    interactiveChallenge: {
      situation: 'Mağaza görevlisi yanına gelip yardım isteyip istemediğini sordu.',
      situationTr: 'Sadece bakındığını söyle veya başka bir beden sor.',
      aiQuestion: 'Hi! Can I help you find anything specific today?',
      aiQuestionTr: 'Selam! Özel olarak aradığınız bir şeyde yardımcı olabilir miyim?',
      suggestedAnswer: 'I\'m just browsing for now, thank you so much!',
      suggestedAnswerTr: 'Şimdilik sadece bakınıyorum, çok teşekkür ederim!',
      coachTip: 'Yurtdışındaki mağazalarda yapışkan personelden kurtulmanın en zarif yolu: "I\'m just browsing, thanks!"'
    }
  }
];

// ==================== 2. 30 GÜNLÜK SIFIRDAN ZİRVEYE KONUŞMA KAMPI (1-30 GÜN EKSİKSİZ) ====================
export const THIRTY_DAY_MISSIONS: DayMission[] = [
  // ---------- HAFTA 1: DİL KASINI AÇ & KORKUYU KIR (1-7. GÜN) ----------
  {
    day: 1,
    week: 1,
    title: 'Buzları Kır: Adın, Nereli Olduğun ve Merhaba!',
    theme: 'Sesini duymaya alış ve korkuyu çöpe at',
    speakingGoal: 'Say: Hello, my name is... and I am from Turkey.',
    speakingGoalTr: 'Adını ve Türkiyeli olduğunu sesli ve net bir şekilde söyle.',
    aiPrompt: 'Hello! I am Chirmo, your English speaking buddy. What is your name?',
    aiPromptTr: 'Merhaba! Ben senin İngilizce konuşma arkadaşın Chirmo. Adın ne?',
    suggestedAnswer: 'Hello Chirmo! My name is Can and I am from Turkey. Nice to meet you!',
    suggestedAnswerTr: 'Merhaba Chirmo! Benim adım Can ve Türkiyeliyim. Tanıştığımıza sevindim!',
    xpReward: 50,
    keyVocabulary: ['hello', 'name', 'from', 'nice to meet you'],
    nativeCoachTip: 'Gramer hatasından hiç korkma! Dilin kas hafızası var; sesli söylemek beyninde yeni sinir yolları açar.'
  },
  {
    day: 2,
    week: 1,
    title: 'Ne İle Meşgulsün? (İşini / Hayatını Anlat)',
    theme: 'Mesleğini veya günlük hayatını tek cümlede söyle',
    speakingGoal: 'Say: I work as a... / I am a student.',
    speakingGoalTr: 'Ne işle uğraştığını veya öğrenci olduğunu söyle.',
    aiPrompt: 'So tell me, what do you do for a living?',
    aiPromptTr: 'Peki söyle bakalım, ne işle meşgulsün?',
    suggestedAnswer: 'I work in marketing, and I really enjoy learning new things.',
    suggestedAnswerTr: 'Pazarlama alanında çalışıyorum ve yeni şeyler öğrenmekten çok keyif alıyorum.',
    xpReward: 50,
    keyVocabulary: ['work as', 'enjoy', 'learning', 'living'],
    nativeCoachTip: '"I am working in..." yerine sade geniş zamanla "I work in..." demek kulağa çok daha profesyonel gelir.'
  },
  {
    day: 3,
    week: 1,
    title: 'Nelerden Hoşlanırsın? (Kendi Tutkunu Anlat)',
    theme: 'İlgi alanlarını ve boş zamanlarını ifade etme',
    speakingGoal: 'Say: In my free time, I love...',
    speakingGoalTr: 'Boş zamanlarında ne yapmaktan keyif aldığını söyle.',
    aiPrompt: 'What do you like doing when you have free time?',
    aiPromptTr: 'Boş vaktin olduğunda ne yapmaktan hoşlanırsın?',
    suggestedAnswer: 'In my free time, I love listening to podcasts, cooking and traveling.',
    suggestedAnswerTr: 'Boş zamanlarımda podcast dinlemeyi, yemek yapmayı ve gezmeyi severim.',
    xpReward: 55,
    keyVocabulary: ['free time', 'love', 'cooking', 'traveling'],
    nativeCoachTip: '"love" veya "like" dedikten sonra fiile -ing takısı ekle (cooking, listening).'
  },
  {
    day: 4,
    week: 1,
    title: 'Bir Şey İsterken Sihirli Kalıp: "Can I have...?"',
    theme: 'Kibarca isteme sanatı',
    speakingGoal: 'Say: Can I have a glass of water, please?',
    speakingGoalTr: 'Bir bardak su rica et.',
    aiPrompt: 'Welcome! Can I get you something to drink?',
    aiPromptTr: 'Hoş geldiniz! Size içecek bir şey getirebilir miyim?',
    suggestedAnswer: 'Can I have a cup of coffee with milk, please?',
    suggestedAnswerTr: 'Sütlü bir fincan kahve alabilir miyim lütfen?',
    xpReward: 60,
    keyVocabulary: ['can I have', 'please', 'coffee', 'milk'],
    nativeCoachTip: 'Günlük konuşmada sipariş verirken doğrudan "I want" yerine daha kibar olan "Can I have...?" kalıbını tercih edin.'
  },
  {
    day: 5,
    week: 1,
    title: 'Hızlı Fikir Belirtme: "Bence..." (In my opinion)',
    theme: 'Kendi fikrini rahatça masaya koyma',
    speakingGoal: 'Say: I think learning English is great fun.',
    speakingGoalTr: 'İngilizce öğrenmenin çok eğlenceli olduğunu düşündüğünü söyle.',
    aiPrompt: 'Do you think learning English is difficult?',
    aiPromptTr: 'Sence İngilizce öğrenmek zor mu?',
    suggestedAnswer: 'I think it is easy and fun when you practice speaking every day.',
    suggestedAnswerTr: 'Bence her gün konuşma pratiği yaptığında çok kolay ve eğlenceli.',
    xpReward: 60,
    keyVocabulary: ['I think', 'easy', 'fun', 'practice'],
    nativeCoachTip: '"I think..." konuşmaya başlarken sana 2 saniye düşünme zamanı kazandıran cankurtaran bir kalıptır.'
  },
  {
    day: 6,
    week: 1,
    title: 'Anlamadığın Anda Ne Yapacaksın? (Kurtarma Simidi)',
    theme: 'Paniklemek yerine durumu profesyonelce kontrol etme',
    speakingGoal: 'Say: Could you repeat that more slowly, please?',
    speakingGoalTr: 'Karşıdakinden daha yavaş tekrar etmesini iste.',
    aiPrompt: 'Thequarterlygrowthprojectionsexceededourinitialbenchmarks.',
    aiPromptTr: '(Hızlı konuşulduğunda)',
    suggestedAnswer: 'Sorry, I didn\'t catch that. Could you speak a bit slower, please?',
    suggestedAnswerTr: 'Kusura bakmayın tam yakalayamadım. Biraz daha yavaş konuşabilir misiniz lütfen?',
    xpReward: 65,
    keyVocabulary: ['catch that', 'repeat', 'slower', 'sorry'],
    nativeCoachTip: 'Asla "I don\'t understand" deyip susma! "Could you speak a bit slower?" de; ana dili İngilizce olanlar sana hayran kalır.'
  },
  {
    day: 7,
    week: 1,
    title: '1. Hafta Mezuniyeti: 1 Dakikalık Kendini Tanıtma Röportajı! 🎓',
    theme: 'İlk haftanın tüm kalıplarını tek bir akıcı konuşmada birleştir',
    speakingGoal: 'Kendini, işini, zevklerini 3 akıcı cümlede Chirmo\'ya anlat!',
    speakingGoalTr: 'Tek nefeste kendini baştan sona tanıt.',
    aiPrompt: 'You finished week one! Introduce yourself completely to the world!',
    aiPromptTr: 'İlk haftayı bitirdin! Kendini tüm dünyaya baştan sona tanıt!',
    suggestedAnswer: 'Hello, my name is Deniz. I live in Istanbul and I work in design. In my free time, I love photography and learning languages!',
    suggestedAnswerTr: 'Merhaba, adım Deniz. İstanbul\'da yaşıyorum ve tasarım alanında çalışıyorum. Boş zamanlarımda fotoğrafçılığı ve dil öğrenmeyi çok seviyorum!',
    xpReward: 120,
    keyVocabulary: ['introduce', 'fluent', 'confident', 'champion'],
    nativeCoachTip: 'Tebrikler! 1. haftayı bitirdin ve beynindeki "konuşamam" bariyerini yıktın. Artık sesin çıkıyor!'
  },

  // ---------- HAFTA 2: DÜNYAYA AÇIL & HAYATTA KAL (8-14. GÜN) ----------
  {
    day: 8,
    week: 2,
    title: 'Starbucks / Kafe Testi: Yerli Biri Gibi Sipariş Ver',
    theme: 'Sipariş verirken paket isteme ve süt seçimi',
    speakingGoal: 'Say: Can I get an iced Americano to go, please?',
    speakingGoalTr: 'Buzlu Americano iste, paket olsun de.',
    aiPrompt: 'Hi there! What can I get started for you today?',
    aiPromptTr: 'Selam! Bugün size ne hazırlayabilirim?',
    suggestedAnswer: 'Can I get a large iced Americano with oat milk to go, please?',
    suggestedAnswerTr: 'Yulaf sütlü büyük boy buzlu Americano alabilir miyim lütfen, paket olsun?',
    xpReward: 70,
    keyVocabulary: ['iced Americano', 'oat milk', 'to go', 'large'],
    nativeCoachTip: '"To go" (paket) ve "for here" (burada içeceğim) ayrımını asla unutma.'
  },
  {
    day: 9,
    week: 2,
    title: 'Şehirde Yol Bulma: "Burası Yürüme Mesafesinde mi?"',
    theme: 'Turist gibi kaybolmadan yön sorma',
    speakingGoal: 'Say: Excuse me, is the central station within walking distance?',
    speakingGoalTr: 'Merkez istasyonun yürüme mesafesinde olup olmadığını sor.',
    aiPrompt: 'You look lost! Can I help you find something?',
    aiPromptTr: 'Kaybolmuş görünüyorsunuz! Bir şey bulmanıza yardımcı olayım mı?',
    suggestedAnswer: 'Excuse me, could you tell me how to get to the museum? Is it within walking distance?',
    suggestedAnswerTr: 'Affedersiniz, müzeye nasıl gidebileceğimi söyler misiniz? Yürüme mesafesinde mi?',
    xpReward: 70,
    keyVocabulary: ['walking distance', 'museum', 'excuse me', 'how to get'],
    nativeCoachTip: '"Within walking distance" kalıbını ezberle, tüm seyahatlerinde hayatını kurtaracak.'
  },
  {
    day: 10,
    week: 2,
    title: 'Hesabı İsteme & Bahşiş Bırakma',
    theme: 'Restoranda hesabı isteme ve üstünü bırakma',
    speakingGoal: 'Say: Could we have the bill, please? Keep the change.',
    speakingGoalTr: 'Hesabı iste ve para üstünün kalabileceğini söyle.',
    aiPrompt: 'Was everything alright with your dinner tonight?',
    aiPromptTr: 'Bu akşamki yemeğiniz her şeyiyle yolunda mıydı?',
    suggestedAnswer: 'Everything was delicious, thank you! Could we get the bill, please?',
    suggestedAnswerTr: 'Her şey çok lezzetliydi, teşekkürler! Hesabı alabilir miyiz lütfen?',
    xpReward: 70,
    keyVocabulary: ['delicious', 'bill', 'check', 'keep the change'],
    nativeCoachTip: 'İngiltere\'de "bill", Amerika\'da genelde "check" denir. İkisi de anlaşılır.'
  },
  {
    day: 11,
    week: 2,
    title: 'Otelde Check-in: Odanı ve Anahtarını Al',
    theme: 'Otel resepsiyonuyla doğal diyalog',
    speakingGoal: 'Say: I have a reservation under the name...',
    speakingGoalTr: 'Kendi adına rezervasyon olduğunu söyle.',
    aiPrompt: 'Good afternoon! Welcome to London. Do you have a booking?',
    aiPromptTr: 'İyi günler! Londra\'ya hoş geldiniz. Rezervasyonunuz var mıydı?',
    suggestedAnswer: 'Good afternoon! Yes, I have a reservation under the name Sarah. Here is my passport.',
    suggestedAnswerTr: 'İyi günler! Evet, Sarah adına bir rezervasyonum var. Buyrun pasaportum.',
    xpReward: 75,
    keyVocabulary: ['reservation', 'booking', 'passport', 'under the name'],
    nativeCoachTip: '"under the name..." (Şu isim adına) demek İngilizcede en yaygın kalıptır.'
  },
  {
    day: 12,
    week: 2,
    title: 'Taksi / Uber Çağırma & Adres Verme',
    theme: 'Taksi şoförüyle nereye gideceğini konuşma',
    speakingGoal: 'Say: Could you take me to the airport, please?',
    speakingGoalTr: 'Beni havalimanına götürür müsünüz lütfen de.',
    aiPrompt: 'Where are you heading today?',
    aiPromptTr: 'Bugün nereye gidiyorsunuz?',
    suggestedAnswer: 'Could you take me to the city center, please? How long will it take?',
    suggestedAnswerTr: 'Beni şehir merkezine götürür müsünüz lütfen? Ne kadar sürer?',
    xpReward: 75,
    keyVocabulary: ['heading', 'take me to', 'how long', 'city center'],
    nativeCoachTip: '"Where are you heading?" = "Nereye gidiyorsun?" demektir. Günlük hayatta "Where are you going?" yerine çok duyarsın.'
  },
  {
    day: 13,
    week: 2,
    title: 'Mağazada Alışveriş: "Bunun Başka Rengi Var mı?"',
    theme: 'Kıyafet denerken beden ve renk sorma',
    speakingGoal: 'Say: Do you have this in black and medium size?',
    speakingGoalTr: 'Bunun siyahı ve M bedeni var mı diye sor.',
    aiPrompt: 'Can I help you find your size in that shirt?',
    aiPromptTr: 'O gömlekte bedeninizi bulmanıza yardımcı olabilir miyim?',
    suggestedAnswer: 'Yes, please! Do you have this jacket in medium, and where are the fitting rooms?',
    suggestedAnswerTr: 'Evet lütfen! Bu ceketin M bedeni var mı ve deneme kabinleri nerede?',
    xpReward: 80,
    keyVocabulary: ['fitting rooms', 'medium', 'jacket', 'size'],
    nativeCoachTip: '"Fitting room" deneme kabini demektir.'
  },
  {
    day: 14,
    week: 2,
    title: '2. Hafta Mezuniyeti: Canlı Londra Turisti Rolü! 🌟',
    theme: 'Sokakta, kafede ve otelde sorunsuz hayatta kalma testi',
    speakingGoal: 'Londra\'da oteline yerleşip akşam yemeği için tavsiye iste!',
    speakingGoalTr: 'Otel görevlisine yakınlarda iyi bir İtalyan restoranı olup olmadığını sor.',
    aiPrompt: 'Welcome to our hotel! Is there anything else I can help you with tonight?',
    aiPromptTr: 'Otelimize hoş geldiniz! Bu akşam size yardımcı olabileceğim başka bir konu var mı?',
    suggestedAnswer: 'Yes, could you recommend a nice Italian restaurant within walking distance?',
    suggestedAnswerTr: 'Evet, yürüme mesafesinde güzel bir İtalyan restoranı tavsiye edebilir misiniz?',
    xpReward: 140,
    keyVocabulary: ['recommend', 'italian restaurant', 'walking distance', 'superstar'],
    nativeCoachTip: 'Artık yurtdışına tek başına gitsen bile kaybolmaz, aç kalmaz, her derdini anlatırsın!'
  },

  // ---------- HAFTA 3: DOĞAL TEPKİLER & HİKAYE ANLATIMI (15-21. GÜN) ----------
  {
    day: 15,
    week: 3,
    title: 'Doğal Tepkiler: "Yok Artık! Ciddi misin?"',
    theme: 'Amerikalı gibi şaşırma ve onaylama refleksleri',
    speakingGoal: 'Say: No way! Are you kidding me?',
    speakingGoalTr: 'Yok artık! Benimle dalga mı geçiyorsun de.',
    aiPrompt: 'Did you hear that? Our flight is delayed by four hours!',
    aiPromptTr: 'Duydun mu? Uçuşumuz 4 saat rötar yapmış!',
    suggestedAnswer: 'No way! Are you kidding me? That is unbelievable!',
    suggestedAnswerTr: 'Yok artık! Dalga mı geçiyorsun? Bu inanılmaz bir şey!',
    xpReward: 85,
    keyVocabulary: ['no way', 'are you kidding me', 'unbelievable', 'delayed'],
    nativeCoachTip: '"No way!" derken ses tonunla enerjini hissettir. Vurgu her şeydir.'
  },
  {
    day: 16,
    week: 3,
    title: 'Dün Ne Oldu Biliyor musun? (Basit Geçmiş Zaman)',
    theme: 'Dün yaptığın bir olayı hikaye gibi anlatma',
    speakingGoal: 'Say: Guess what happened yesterday! I met an old friend.',
    speakingGoalTr: 'Dün eski bir arkadaşımla karşılaştım de.',
    aiPrompt: 'How was your weekend? Did you do anything special?',
    aiPromptTr: 'Hafta sonun nasıldı? Özel bir şeyler yaptın mı?',
    suggestedAnswer: 'It was fantastic! I went to a concert and met an old friend from university.',
    suggestedAnswerTr: 'Harikaydı! Bir konsere gittim ve üniversiteden eski bir arkadaşımla karşılaştım.',
    xpReward: 85,
    keyVocabulary: ['guess what', 'fantastic', 'concert', 'met'],
    nativeCoachTip: 'Geçmiş zamanı anlatırken tüm fiil çekimlerini düşünme. En çok kullandığın 5 fiili bil yeter: went, met, ate, saw, had.'
  },
  {
    day: 17,
    week: 3,
    title: 'Katılma ve Onaylama: "Kesinlikle Katılıyorum!"',
    theme: 'Sohbette karşındakini destekleme kalıpları',
    speakingGoal: 'Say: I couldn\'t agree more. That makes total sense.',
    speakingGoalTr: 'Tamamen katılıyorum, çok mantıklı de.',
    aiPrompt: 'I think drinking enough water every day improves your energy so much.',
    aiPromptTr: 'Bence her gün yeterince su içmek enerjini çok artırıyor.',
    suggestedAnswer: 'I couldn\'t agree more! That makes total sense, I feel much better when I hydrate.',
    suggestedAnswerTr: 'Kesinlikle tamamen katılıyorum! Çok mantıklı, su içtiğimde kendimi çok daha iyi hissediyorum.',
    xpReward: 90,
    keyVocabulary: ['couldn\'t agree more', 'total sense', 'energy', 'hydrate'],
    nativeCoachTip: '"I agree with you" yerine "I couldn\'t agree more" (Sana daha fazla katılamazdım) de; seviyen anında C1 gibi duyulsun!'
  },
  {
    day: 18,
    week: 3,
    title: 'Zevkler ve Karşılaştırma: "Kahveyi Çaya Tercih Ederim"',
    theme: '"Prefer" kalıbıyla tercih yapma',
    speakingGoal: 'Say: I prefer drinking coffee to tea in the morning.',
    speakingGoalTr: 'Sabahları kahveyi çaya tercih ettiğini söyle.',
    aiPrompt: 'Do you prefer working from home or working in an office?',
    aiPromptTr: 'Evden çalışmayı mı yoksa ofiste çalışmayı mı tercih edersin?',
    suggestedAnswer: 'I prefer working from home because it saves a lot of time on commuting.',
    suggestedAnswerTr: 'Evden çalışmayı tercih ederim çünkü yolda geçen zamandan çok tasarruf ettiriyor.',
    xpReward: 90,
    keyVocabulary: ['prefer', 'working from home', 'commuting', 'saves time'],
    nativeCoachTip: '"Prefer A to B" yapısına dikkat et. "than" değil "to" kullanılır.'
  },
  {
    day: 19,
    week: 3,
    title: 'Gelecek Planları: "Bu Hafta Sonu Ne Yapacaksın?"',
    theme: '"I am planning to..." ve "I am gonna..." kalıpları',
    speakingGoal: 'Say: This weekend, I am gonna relax and watch a movie.',
    speakingGoalTr: 'Bu hafta sonu dinlenip film izleyeceğim de.',
    aiPrompt: 'Any exciting plans for the upcoming holiday?',
    aiPromptTr: 'Yaklaşan tatil için heyecan verici bir planın var mı?',
    suggestedAnswer: 'I am planning to go to the seaside with my family and just unplug for a few days.',
    suggestedAnswerTr: 'Ailemle deniz kenarına gitmeyi ve birkaç gün kafamı dinlemeyi planlıyorum.',
    xpReward: 95,
    keyVocabulary: ['planning to', 'unplug', 'seaside', 'holiday'],
    nativeCoachTip: '"Going to" yerine günlük konuşmada rahatça "gonna" diyebilirsin.'
  },
  {
    day: 20,
    week: 3,
    title: 'Tavsiye İsteme ve Verme: "Sen Olsan Ne Yapardın?"',
    theme: '"If I were you..." ve "What would you do?" kalıpları',
    speakingGoal: 'Say: If I were you, I would take that opportunity.',
    speakingGoalTr: 'Senin yerinde olsam o fırsatı kaçırmazdım de.',
    aiPrompt: 'I got two different job offers, and I cannot decide which one to pick!',
    aiPromptTr: 'İki farklı iş teklifi aldım ve hangisini seçeceğime karar veremiyorum!',
    suggestedAnswer: 'If I were you, I would choose the one that gives you more freedom to grow.',
    suggestedAnswerTr: 'Senin yerinde olsaydım, sana gelişim için daha fazla özgürlük tanıyanı seçerdim.',
    xpReward: 95,
    keyVocabulary: ['if I were you', 'opportunity', 'freedom', 'grow'],
    nativeCoachTip: '"If I were you..." kalıbı dostça tavsiye vermenin en şık yoludur.'
  },
  {
    day: 21,
    week: 3,
    title: '3. Hafta Mezuniyeti: Doğal Sosyal Sohbet Ustası! 🚀',
    theme: 'Arkadaş ortamında akıcı fikir alışverişi ve esprilere katılma',
    speakingGoal: 'En sevdiğin filmi ve neden herkese tavsiye ettiğini anlat!',
    speakingGoalTr: 'En sevdiğin filmi ve seni neden büyülediğini anlat.',
    aiPrompt: 'What is the best movie or TV show you have seen recently?',
    aiPromptTr: 'Son zamanlarda izlediğin en iyi film veya dizi hangisiydi?',
    suggestedAnswer: 'I recently watched Inception again. The concept of dreams inside dreams is mind-blowing!',
    suggestedAnswerTr: 'Geçenlerde Başlangıç (Inception) filmini tekrar izledim. Rüya içinde rüya konsepti gerçekten akıllara durgunluk verici!',
    xpReward: 150,
    keyVocabulary: ['mind-blowing', 'recently', 'concept', 'master'],
    nativeCoachTip: '"Mind-blowing" (akıl almaz / büyüleyici) kelimesini bir şeyi çok övmek istediğinde kullan.'
  },

  // ---------- HAFTA 4: ÖZGÜVEN PATLAMASI & AKICI İNGİLİZCE (22-30. GÜN) ----------
  {
    day: 22,
    week: 4,
    title: 'Diplomatik Kibarlık: "Kusura Bakmayın Ama..."',
    theme: 'Kırmadan hayır diyebilme ve bahane sunma',
    speakingGoal: 'Say: I would love to, but I have a prior commitment.',
    speakingGoalTr: 'Çok isterdim ama önceden verilmiş bir sözüm var de.',
    aiPrompt: 'Are you free to join our team dinner this Friday evening?',
    aiPromptTr: 'Bu cuma akşamı takım yemeğimize katılmak için müsait misin?',
    suggestedAnswer: 'I would love to join, but I already have plans with my family. Thank you for inviting me!',
    suggestedAnswerTr: 'Katılmayı çok isterdim ama ailemle önceden yapılmış planım var. Beni davet ettiğin için teşekkürler!',
    xpReward: 100,
    keyVocabulary: ['prior commitment', 'would love to', 'already have plans', 'inviting'],
    nativeCoachTip: 'İngilizcede "No" demek serttir. Her zaman "I would love to, but..." ile başla.'
  },
  {
    day: 23,
    week: 4,
    title: 'Telefon / Zoom Görüşmesi: "Bağlantım Koptu"',
    theme: 'Dijital dünyada iletişim kazalarını yönetme',
    speakingGoal: 'Say: Sorry, you broke up for a second. Can you hear me now?',
    speakingGoalTr: 'Sesin bir saniye kesildi, şu an beni duyabiliyor musun de.',
    aiPrompt: 'Hello? Can you hear me? Your video just froze.',
    aiPromptTr: 'Alo? Beni duyabiliyor musun? Görüntün az önce dondu.',
    suggestedAnswer: 'Yes, you broke up for a second, but I can hear and see you clearly now!',
    suggestedAnswerTr: 'Evet, sesiniz bir an kesildi ama şu an sizi çok net duyabiliyor ve görebiliyorum!',
    xpReward: 100,
    keyVocabulary: ['broke up', 'froze', 'clearly', 'connection'],
    nativeCoachTip: 'Ses kesildiğinde "Your voice is cutting" değil, "You are breaking up" denir.'
  },
  {
    day: 24,
    week: 4,
    title: 'Pazarlık & İndirim İsteme: "Daha İyisini Yapabilir misiniz?"',
    theme: 'Yurtdışında kibarca indirim sorma sanatı',
    speakingGoal: 'Say: Is that your best price? Can you do any better?',
    speakingGoalTr: 'Son fiyatınız bu mu? Biraz daha indirim yapabilir misiniz de.',
    aiPrompt: 'This handmade leather bag is two hundred dollars.',
    aiPromptTr: 'Bu el yapımı deri çanta 200 dolar.',
    suggestedAnswer: 'It looks beautiful! Is that your best price, or can you give a small discount if I pay cash?',
    suggestedAnswerTr: 'Çok güzel görünüyor! Son fiyatınız bu mu, yoksa nakit ödersem küçük bir indirim yapabilir misiniz?',
    xpReward: 105,
    keyVocabulary: ['best price', 'discount', 'pay cash', 'handmade'],
    nativeCoachTip: '"Can you do any better?" esnafa kibarca indirim sormanın en tatlı yoludur.'
  },
  {
    day: 25,
    week: 4,
    title: 'Görüş ve Argüman Savunma: "Artıları ve Eksileri Var"',
    theme: 'Bir konuyu iki yönüyle değerlendirme',
    speakingGoal: 'Say: There are both pros and cons to this situation.',
    speakingGoalTr: 'Bu durumun hem artıları hem de eksileri var de.',
    aiPrompt: 'Do you think Artificial Intelligence will replace human jobs?',
    aiPromptTr: 'Sence Yapay Zekâ insanların işlerini tamamen ellerinden alacak mı?',
    suggestedAnswer: 'There are definitely pros and cons. It automates repetitive tasks, but creativity is still unique to humans.',
    suggestedAnswerTr: 'Kesinlikle hem artıları hem eksileri var. Tekrarlayan işleri otomatikleştiriyor ama yaratıcılık hâlâ insana özgü.',
    xpReward: 110,
    keyVocabulary: ['pros and cons', 'automates', 'creativity', 'unique'],
    nativeCoachTip: '"Pros and cons" (Artılar ve eksiler) her tartışmada seni bilge gösterir.'
  },
  {
    day: 26,
    week: 4,
    title: 'Özür Dileme ve Telafi Etme: "Tamamen Benim Hatam"',
    theme: 'Bir hatayı dürüstçe kabullenip çözme',
    speakingGoal: 'Say: That was totally my fault, let me make it up to you.',
    speakingGoalTr: 'Tamamen benim hatamdı, kendimi affettirmeme izin ver de.',
    aiPrompt: 'Hey, you forgot to send the report this morning!',
    aiPromptTr: 'Hey, bu sabah raporu göndermeyi unuttun!',
    suggestedAnswer: 'Oh, I am so sorry! That was completely my mistake. I am sending it right away.',
    suggestedAnswerTr: 'Çok özür dilerim! Tamamen benim hatam. Hemen şimdi gönderiyorum.',
    xpReward: 110,
    keyVocabulary: ['my fault', 'completely', 'make it up to you', 'right away'],
    nativeCoachTip: '"Make it up to you" = "Kendimi affettirmek, telafi etmek" demektir.'
  },
  {
    day: 27,
    week: 4,
    title: 'Espriyi Anlama ve Kahkaha Atma',
    theme: 'İngilizce mizah ve samimi takılma',
    speakingGoal: 'Say: That was hilarious! You made my day.',
    speakingGoalTr: 'Bu çok komikti! Günümü neşelendirdin de.',
    aiPrompt: 'Why do we tell actors to "break a leg"? Because every play has a cast!',
    aiPromptTr: 'Aktörlere neden "bacağını kır" derler? Çünkü her oyunun bir alçısı (veya kadrosu) vardır!',
    suggestedAnswer: 'Haha, that was a good one! You really made my day with that pun!',
    suggestedAnswerTr: 'Haha, bu iyiydi! Bu kelime oyunuyla gerçekten günümü neşelendirdin!',
    xpReward: 115,
    keyVocabulary: ['hilarious', 'made my day', 'pun', 'good one'],
    nativeCoachTip: '"You made my day" (Günümü güzelleştirdin / Beni çok mutlu ettin) harika bir iltifattır.'
  },
  {
    day: 28,
    week: 4,
    title: 'Gelecek Hayalin: 5 Yıl Sonra Neredesin?',
    theme: 'Büyük hedeflerini İngilizce seslendirme',
    speakingGoal: 'Say: In five years, I see myself speaking fluent English and living my dream.',
    speakingGoalTr: 'Beş yıl sonra kendimi akıcı İngilizce konuşurken görüyorum de.',
    aiPrompt: 'Where do you see yourself five years from now?',
    aiPromptTr: 'Bundan beş yıl sonra kendini nerede görüyorsun?',
    suggestedAnswer: 'In five years, I see myself running my own projects, traveling globally, and inspiring people around me.',
    suggestedAnswerTr: 'Beş yıl sonra kendimi kendi projelerimi yönetirken, dünyayı gezerken ve etrafımdaki insanlara ilham verirken görüyorum.',
    xpReward: 120,
    keyVocabulary: ['five years', 'inspiring', 'globally', 'vision'],
    nativeCoachTip: 'İngilizce hayal kurabildiğin an, o dili gerçekten öğrenmişsin demektir.'
  },
  {
    day: 29,
    week: 4,
    title: 'Büyük Sınav Öncesi Son Genel Pratik',
    theme: 'Bütün korkuları geride bırakıp özgüvenini hissetme',
    speakingGoal: 'Say: I am proud of how much progress I have made in just one month.',
    speakingGoalTr: 'Sadece bir ayda kat ettiğim ilerlemeden gurur duyuyorum de.',
    aiPrompt: 'Look back to Day 1 when you were hesitant. How do you feel right now?',
    aiPromptTr: 'Çekingen olduğun 1. Güne geri bak. Şu an nasıl hissediyorsun?',
    suggestedAnswer: 'I feel incredibly proud! I used to be afraid of making mistakes, but now I speak freely and naturally.',
    suggestedAnswerTr: 'İnanılmaz gururlu hissediyorum! Eskiden hata yapmaktan korkardım ama artık özgürce ve doğal konuşuyorum.',
    xpReward: 130,
    keyVocabulary: ['proud', 'progress', 'hesitant', 'naturally'],
    nativeCoachTip: 'Hata yapmaktan korkmayan insan dili en hızlı konuşan insandır!'
  },
  {
    day: 30,
    week: 4,
    title: 'BÜYÜK FİNAL: 30 Günlük Konuşma Şampiyonluğu & Podcast! 🏆',
    theme: '1 Aylık Dönüşümünü Kutla ve Chirmo ile Canlı Sohbet Et',
    speakingGoal: 'Chirmo ile tam bir İngilizce podcast sohbeti yap ve mezun ol!',
    speakingGoalTr: '30 günlük başarı hikayeni ve İngilizce konuşmanın sana kattığı özgüveni anlat.',
    aiPrompt: 'CONGRATULATIONS! You have completed the 30-Day Speaking Challenge! Tell the world how you feel!',
    aiPromptTr: 'TEBRİKLER! 30 Günlük Konuşma Kampını tamamladın! Tüm dünyaya nasıl hissettiğini anlat!',
    suggestedAnswer: 'I am officially an English speaker now! Thank you Chirmo for this amazing journey. I can talk to anyone in the world with total confidence!',
    suggestedAnswerTr: 'Artık resmen İngilizce konuşuyorum! Bu harika yolculuk için teşekkürler Chirmo. Artık dünyadaki herkesle tam bir özgüvenle konuşabilirim!',
    xpReward: 300,
    keyVocabulary: ['officially', 'confidence', 'journey', 'champion', 'fluent'],
    nativeCoachTip: 'Sen bir şampiyonsun! Unutma: Konuşmak bir yetenek değil, her gün yapılan bir spordur. Bu sporu bırakma!'
  }
];

// ==================== 3. İLERLEME VE VERİ SERVİSİ ====================
export interface StudentCampProgress {
  currentDay: number;
  completedDays: number[];
  totalXp: number;
  streakDays: number;
  selectedCategory?: string;
  lastCompletedDate?: string;
}

const STORAGE_KEY = 'chirmo_fluent_camp_v2';

export const CampStorageService = {
  getProgress(): StudentCampProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return {
      currentDay: 1,
      completedDays: [],
      totalXp: 150,
      streakDays: 3,
      selectedCategory: 'Kafe & Restoran'
    };
  },

  saveProgress(progress: StudentCampProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save camp progress', e);
    }
  },

  completeDayMission(day: number, earnedXp: number): StudentCampProgress {
    const current = this.getProgress();
    const completedSet = new Set(current.completedDays);
    const wasAlreadyCompleted = completedSet.has(day);
    completedSet.add(day);

    const todayStr = new Date().toISOString().slice(0, 10);
    let streak = current.streakDays;
    if (current.lastCompletedDate !== todayStr) {
      streak += 1;
    }

    const updated: StudentCampProgress = {
      ...current,
      completedDays: Array.from(completedSet),
      totalXp: current.totalXp + (wasAlreadyCompleted ? 20 : earnedXp),
      streakDays: streak,
      currentDay: Math.min(30, Math.max(current.currentDay, day + 1)),
      lastCompletedDate: todayStr
    };

    this.saveProgress(updated);
    return updated;
  },

  setSelectedCategory(cat: string): StudentCampProgress {
    const current = this.getProgress();
    const updated = { ...current, selectedCategory: cat };
    this.saveProgress(updated);
    return updated;
  },

  getScenarios(lang?: SupportedLanguage): RealLifeScenario[] {
    const code = lang || TargetLanguageService.getTargetLanguage();
    return code === 'de' ? GERMAN_REAL_LIFE_SCENARIOS : REAL_LIFE_SCENARIOS;
  },

  getDayMissions(lang?: SupportedLanguage): DayMission[] {
    const code = lang || TargetLanguageService.getTargetLanguage();
    return code === 'de' ? GERMAN_DAY_MISSIONS : DAY_MISSIONS;
  }
};

export const CurriculumService = CampStorageService;
