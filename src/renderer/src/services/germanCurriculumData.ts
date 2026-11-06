// Chirmo Almanca Müfredat & Gerçek Yaşam Konuşma Senaryoları (Deutsch)
// 30 Günde Sıfırdan Almanca Konuşma & Doğal Refleks Metodu

import { RealLifeScenario, DayMission } from './curriculumData';

export const GERMAN_REAL_LIFE_SCENARIOS: RealLifeScenario[] = [
  {
    id: 'scenario-de-coffee',
    category: 'Kafe & Fırın',
    title: 'Kahve & Pasta Siparişi (Im Café & Bäckerei)',
    badge: '☕ Kafe & Fırın',
    description: 'Bir Alman kafesinde veya fırınında (Bäckerei) doğal ve kibar bir şekilde sipariş verin.',
    keyChunks: [
      {
        en: 'Ich hätte gerne einen Cappuccino, bitte.',
        tr: 'Bir kapuçino rica ediyorum, lütfen.',
        phonetic: '/ɪç ˈhɛtə ˈɡɛʁnə ˈaɪ̯nən kapʊˈtʃiːnoː/',
        example: 'Guten Tag! Ich hätte gerne einen Cappuccino mit Hafermilch.',
        exampleTr: 'İyi günler! Yulaf sütlü bir kapuçino rica ediyorum.'
      },
      {
        en: 'Haben Sie auch etwas Veganes?',
        tr: 'Vegan bir seçeneğiniz de var mı?',
        phonetic: '/ˈhaːbn̩ ziː aʊ̯x ˈɛtvas veˈɡaːnəs/',
        example: 'Entschuldigung, haben Sie auch etwas Veganes zum Frühstück?',
        exampleTr: 'Afedersiniz, kahvaltı için vegan bir seçeneğiniz var mı?'
      },
      {
        en: 'Könnte ich bitte die Rechnung haben?',
        tr: 'Hesabı alabilir miyim lütfen?',
        phonetic: '/ˈkœntə ɪç ˈbɪtə diː ˈʁɛçnʊŋ ˈhaːbn̩/',
        example: 'Wir möchten bezahlen. Könnte ich bitte die Rechnung haben?',
        exampleTr: 'Ödemek istiyoruz. Hesabı alabilir miyim lütfen?'
      },
      {
        en: 'Zusammen oder getrennt?',
        tr: 'Birlikte mi ayrı ayrı mı?',
        phonetic: '/tsuˈzamən ˈoːdɐ ɡəˈtʁɛnt/',
        example: 'Möchten Sie zusammen oder getrennt zahlen? - Getrennt, bitte!',
        exampleTr: 'Birlikte mi ayrı mı ödemek istersiniz? - Ayrı lütfen!'
      }
    ],
    interactiveChallenge: {
      situation: 'Kafede garson masanıza geldi ve ne arzu ettiğinizi sordu.',
      situationTr: 'Kafedesiniz ve garson ne içmek istediğinizi sordu.',
      aiQuestion: 'Guten Morgen! Was darf ich Ihnen heute Schönes bringen? Ein Kaffee vielleicht?',
      aiQuestionTr: 'Günaydın! Bugün size ne ikram edebilirim? Belki bir kahve?',
      suggestedAnswer: 'Guten Morgen! Ja gerne, ich hätte bitte einen großen Kaffee mit Milch.',
      suggestedAnswerTr: 'Günaydın! Evet lütfen, sütlü büyük bir kahve rica ediyorum.',
      coachTip: 'Almanya\'da sipariş verirken "Ich möchte" yerine "Ich hätte gerne..." demek her zaman çok daha kibar ve yereldir.'
    }
  },
  {
    id: 'scenario-de-travel',
    category: 'Ulaşım & Seyahat',
    title: 'Tren Garı & Bilet (Am Bahnhof)',
    badge: '🚆 Tren & Seyahat',
    description: 'Tren istasyonunda peron bulma, bilet alma ve aktarma sorma pratiği.',
    keyChunks: [
      {
        en: 'Von welchem Gleis fährt der Zug ab?',
        tr: 'Tren hangi perondan kalkıyor?',
        phonetic: '/fɔn ˈvɛlçəm ɡlaɪ̯s fɛːɐ̯t deːɐ̯ tsuːk ap/',
        example: 'Entschuldigung, von welchem Gleis fährt der ICE nach Berlin ab?',
        exampleTr: 'Afedersiniz, Berlin hızlı treni hangi perondan kalkıyor?'
      },
      {
        en: 'Hat der Zug Verspätung?',
        tr: 'Trenin rötarı var mı?',
        phonetic: '/hat deːɐ̯ tsuːk fɛɐ̯ˈʃpɛːtʊŋ/',
        example: 'Wissen Sie, ob der Zug nach München Verspätung hat?',
        exampleTr: 'Münih treninin rötarı olup olmadığını biliyor musunuz?'
      },
      {
        en: 'Muss ich umsteigen?',
        tr: 'Aktarma yapmam gerekiyor mu?',
        phonetic: '/mʊs ɪç ˈʊmˌʃtaɪ̯ɡn̩/',
        example: 'Fährt dieser Zug direkt oder muss ich in Frankfurt umsteigen?',
        exampleTr: 'Bu tren direkt mi gidiyor yoksa Frankfurt\'ta aktarma yapmam gerekir mi?'
      }
    ],
    interactiveChallenge: {
      situation: 'Garda danışma görevlisine treninizin saatini ve peronunu soruyorsunuz.',
      situationTr: 'Görevliye Berlin treninizin peronunu soruyorsunuz.',
      aiQuestion: 'Hallo! Kann ich Ihnen bei der Verbindung behilflich sein?',
      aiQuestionTr: 'Merhaba! Seferinizle ilgili yardımcı olabilir miyim?',
      suggestedAnswer: 'Hallo! Ja, von welchem Gleis fährt der Zug nach Berlin ab?',
      suggestedAnswerTr: 'Merhaba! Evet, Berlin treni hangi perondan kalkıyor?',
      coachTip: '"Gleis" peron / hat anlamına gelir. Almanya\'da peron anonslarını dinlerken Gleis numarasını takip edin.'
    }
  },
  {
    id: 'scenario-de-icebreaker',
    category: 'Tanışma & Sosyal',
    title: 'Yeni Biriyle Tanışma (Kennenlernen)',
    badge: '🤝 Tanışma & Sohbet',
    description: 'Almanca ilk teması kurma, nereli olduğunu söyleme ve mesleğinden bahsetme.',
    keyChunks: [
      {
        en: 'Freut mich sehr, dich kennenzulernen!',
        tr: 'Tanıştığımıza çok memnun oldum!',
        phonetic: '/fʁɔɪ̯t mɪç zeːɐ̯ dɪç ˈkɛnəntsuˌlɛʁnən/',
        example: 'Hallo, ich bin Mehmet. Freut mich sehr, dich kennenzulernen!',
        exampleTr: 'Merhaba, ben Mehmet. Seninle tanıştığıma çok memnun oldum!'
      },
      {
        en: 'Woher kommst du?',
        tr: 'Nerelisin?',
        phonetic: '/voːˈheːɐ̯ kɔmst duː/',
        example: 'Ich komme aus der Türkei, aus Istanbul. Und du?',
        exampleTr: 'Ben Türkiye\'den, İstanbul\'dan geliyorum. Ya sen?'
      },
      {
        en: 'Was machst du beruflich?',
        tr: 'Mesleğin nedir / ne işle meşgulsün?',
        phonetic: '/vas maxst duː bəˈʁuːflɪç/',
        example: 'Ich arbeite als Softwareentwickler. Was machst du beruflich?',
        exampleTr: 'Yazılım geliştirici olarak çalışıyorum. Sen ne işle meşgulsün?'
      }
    ],
    interactiveChallenge: {
      situation: 'Yeni bir arkadaş ortamında Chirmo ile tanışıyorsunuz.',
      situationTr: 'Yeni bir ortamda Chirmo kendisini tanıtıyor.',
      aiQuestion: 'Hallo! Ich bin Chirmo. Wie heißt du und woher kommst du?',
      aiQuestionTr: 'Merhaba! Ben Chirmo. Adın ne ve nerelisin?',
      suggestedAnswer: 'Hallo Chirmo! Ich heiße Can und ich komme aus der Türkei. Freut mich sehr!',
      suggestedAnswerTr: 'Merhaba Chirmo! Adım Can ve Türkiye\'den geliyorum. Çok memnun oldum!',
      coachTip: '"Ich komme aus der Türkei" (Türkiye\'den geliyorum) derken "der" artikeli kullanmayı unutmayın.'
    }
  },
  {
    id: 'scenario-de-shopping',
    category: 'Alışveriş',
    title: 'Mağazada & Süpermarkette (Im Geschäft)',
    badge: '🛍️ Alışveriş',
    description: 'Beden sorma, fiyat öğrenme ve deneme kabini bulma.',
    keyChunks: [
      {
        en: 'Wie viel kostet das?',
        tr: 'Bunun fiyatı ne kadar?',
        phonetic: '/viː fiːl ˈkɔstət das/',
        example: 'Entschuldigung, wie viel kostet dieses T-Shirt?',
        exampleTr: 'Afedersiniz, bu tişörtün fiyatı ne kadar?'
      },
      {
        en: 'Haben Sie das in Größe M?',
        tr: 'Bunun M bedeni var mı?',
        phonetic: '/ˈhaːbn̩ ziː das ɪn ˈɡʁøːsə ɛm/',
        example: 'Die Jacke gefällt mir. Haben Sie das auch in Größe M?',
        exampleTr: 'Ceket hoşuma gitti. Bunun M bedeni de var mı?'
      },
      {
        en: 'Wo sind die Umkleidekabinen?',
        tr: 'Soyunma kabinleri nerede?',
        phonetic: '/voː zɪnt diː ˈʊmˌklaɪ̯dəkaˈbiːnən/',
        example: 'Ich möchte das anprobieren. Wo sind die Umkleidekabinen?',
        exampleTr: 'Bunu denemek istiyorum. Soyunma kabinleri nerede?'
      }
    ],
    interactiveChallenge: {
      situation: 'Giyim mağazasında çalışan size yardımcı olmak istiyor.',
      situationTr: 'Satış danışmanı yardım gerekip gerekmediğini soruyor.',
      aiQuestion: 'Hallo! Kann ich Ihnen bei der Auswahl behilflich sein?',
      aiQuestionTr: 'Merhaba! Seçiminizde yardımcı olabilir miyim?',
      suggestedAnswer: 'Ja bitte, ich suche einen warmen Pullover in Größe M.',
      suggestedAnswerTr: 'Evet lütfen, M beden sıcak bir kazak arıyorum.',
      coachTip: '"Ich suche..." (Arıyorum...) kalıbı alışverişte ihtiyacınızı doğrudan belirtmek için en pratik cümledir.'
    }
  },
  {
    id: 'scenario-de-emergency',
    category: 'Sağlık & Eczane',
    title: 'Eczanede Şikayet Belirtme (In der Apotheke)',
    badge: '💊 Sağlık & Eczane',
    description: 'Ağrı, soğuk algınlığı ve ilaç isteme diyaloğu.',
    keyChunks: [
      {
        en: 'Ich habe starke Kopfschmerzen.',
        tr: 'Şiddetli baş ağrım var.',
        phonetic: '/ɪç ˈhaːbə ˈʃtaʁkə ˈkɔp͡fˌʃmɛʁtsn̩/',
        example: 'Seit heute Morgen habe ich starke Kopfschmerzen und Halsschmerzen.',
        exampleTr: 'Sabahtan beri şiddetli baş ağrım ve boğaz ağrım var.'
      },
      {
        en: 'Haben Sie etwas gegen Erkältung?',
        tr: 'Soğuk algınlığına karşı bir şeyiniz var mı?',
        phonetic: '/ˈhaːbn̩ ziː ˈɛtvas ˈɡeːɡn̩ ɛɐ̯ˈkɛltʊŋ/',
        example: 'Guten Tag, haben Sie etwas Wirksames gegen Erkältung?',
        exampleTr: 'İyi günler, soğuk algınlığına karşı etkili bir ilacınız var mı?'
      },
      {
        en: 'Wie oft soll ich das einnehmen?',
        tr: 'Bunu ne sıklıkla almalıyım?',
        phonetic: '/viː ɔft zɔl ɪç das ˈaɪ̯nˌneːmən/',
        example: 'Wie oft am Tag soll ich diese Tabletten einnehmen?',
        exampleTr: 'Günde kaç kez bu tabletleri almalıyım?'
      }
    ],
    interactiveChallenge: {
      situation: 'Eczanede eczacı ne şikayetiniz olduğunu soruyor.',
      situationTr: 'Eczacı size nasıl yardımcı olabileceğini soruyor.',
      aiQuestion: 'Guten Tag! Was fehlt Ihnen denn? Wie kann ich Ihnen helfen?',
      aiQuestionTr: 'İyi günler! Neyiniz var? Size nasıl yardımcı olabilirim?',
      suggestedAnswer: 'Guten Tag! Ich habe Halsschmerzen und Husten. Haben Sie Halstabletten?',
      suggestedAnswerTr: 'İyi günler! Boğaz ağrım ve öksürüğüm var. Boğaz pastiliniz var mı?',
      coachTip: '"Was fehlt Ihnen?" doktor veya eczacılardan en sık duyacağınız "Neyiniz var / Şikayetiniz nedir?" sorusudur.'
    }
  },
  {
    id: 'scenario-de-work',
    category: 'İş & Toplantı',
    title: 'İş Görüşmesi & Randevu (Im Beruf)',
    badge: '💼 İş & Kariyer',
    description: 'Almanca iş e-postası, randevu saatini netleştirme ve toplantı erteleme.',
    keyChunks: [
      {
        en: 'Können wir den Termin verschieben?',
        tr: 'Randevuyu başka zamana erteleyebilir miyiz?',
        phonetic: '/ˈkœnən viːɐ̯ deːn tɛʁˈmiːn fɛɐ̯ˈʃiːbn̩/',
        example: 'Es tut mir leid, können wir den Termin auf Donnerstag verschieben?',
        exampleTr: 'Kusura bakmayın, randevuyu perşembeye erteleyebilir miyiz?'
      },
      {
        en: 'Ich gebe Ihnen Bescheid.',
        tr: 'Size haber vereceğim / bilgilendireceğim.',
        phonetic: '/ɪç ˈɡeːbə ˈiːnən bəˈʃaɪ̯t/',
        example: 'Sobald ich das Dokument fertig habe, gebe ich Ihnen sofort Bescheid.',
        exampleTr: 'Belgeyi bitirir bitirmez size hemen haber vereceğim.'
      },
      {
        en: 'Vielen Dank für Ihre Unterstützung.',
        tr: 'Desteğiniz için çok teşekkür ederim.',
        phonetic: '/ˈfiːlən daŋk fyːɐ̯ ˈiːʁə ʊntɐˈʃtʏtsʊŋ/',
        example: 'Ich bedanke mich herzlich für Ihre freundliche Unterstützung.',
        exampleTr: 'Nazik desteğiniz için içtenlikle teşekkür ederim.'
      }
    ],
    interactiveChallenge: {
      situation: 'İş arkadaşınız yarınki toplantının saatini soruyor.',
      situationTr: 'İş arkadaşınız toplantı saatiyle ilgili konuşuyor.',
      aiQuestion: 'Passt dir das morgige Meeting um 10 Uhr oder ist der Nachmittag besser?',
      aiQuestionTr: 'Yarınki toplantı saat 10 uygun mu yoksa öğleden sonra daha mı iyi?',
      suggestedAnswer: 'Um 10 Uhr passt es mir ausgezeichnet. Vielen Dank!',
      suggestedAnswerTr: 'Saat 10 bana harika uyuyor. Çok teşekkürler!',
      coachTip: '"Passt es dir/Ihnen?" (Sana/Size uyar mı?) iş hayatında zaman planlamasında çok kullanılır.'
    }
  }
];

export const GERMAN_DAY_MISSIONS: DayMission[] = [
  // ---------- 1. HAFTA: TEMEL TANIŞMA & İLK REFLEKSLER (1-7. GÜN) ----------
  {
    day: 1,
    week: 1,
    title: 'İlk Adım: Selamlaşma & İsim',
    theme: 'Tanışma Refleksi',
    speakingGoal: 'Hallo, ich heiße Can und freue mich sehr!',
    speakingGoalTr: 'Merhaba, adım Can ve çok memnunum!',
    aiPrompt: 'Hallo! Schön dich zu sehen. Wie heißt du?',
    aiPromptTr: 'Merhaba! Seni gördüğüme sevindim. Adın ne?',
    suggestedAnswer: 'Hallo Chirmo! Ich heiße Can. Wie geht es dir?',
    suggestedAnswerTr: 'Merhaba Chirmo! Benim adım Can. Nasılsın?',
    xpReward: 50,
    keyVocabulary: ['Hallo', 'Ich heiße', 'Wie geht es dir?', 'Danke, gut'],
    nativeCoachTip: '"Wie geht es dir?" samimi ortamlarda, "Wie geht es Ihnen?" ise resmi durumlarda kullanılır.'
  },
  {
    day: 2,
    week: 1,
    title: 'Nerelisin & Yaşadığın Şehir',
    theme: 'Köken & Yaşam',
    speakingGoal: 'Ich komme aus der Türkei und wohne in Istanbul.',
    speakingGoalTr: 'Türkiye\'den geliyorum ve İstanbul\'da yaşıyorum.',
    aiPrompt: 'Woher kommst du und wo wohnst du zurzeit?',
    aiPromptTr: 'Nerelisin ve şu an nerede yaşıyorsun?',
    suggestedAnswer: 'Ich komme aus der Türkei und ich wohne in Ankara.',
    suggestedAnswerTr: 'Türkiye\'den geliyorum ve Ankara\'da yaşıyorum.',
    xpReward: 50,
    keyVocabulary: ['Ich komme aus', 'Ich wohne in', 'Woher', 'Zurzeit'],
    nativeCoachTip: '"wohnen" ikamet etmek, "kommen aus" ise kökeni belirtir.'
  },
  {
    day: 3,
    week: 1,
    title: 'Ne İle Meşgulsün? (İşini Anlat)',
    theme: 'İş & Uğraş',
    speakingGoal: 'Ich arbeite als Ingenieur und lerne fleißig Deutsch.',
    speakingGoalTr: 'Mühendis olarak çalışıyorum ve gayretle Almanca öğreniyorum.',
    aiPrompt: 'Was machst du beruflich? Welcher Beruf gefällt dir?',
    aiPromptTr: 'Mesleğin nedir? Hangi meslek hoşuna gidiyor?',
    suggestedAnswer: 'Ich bin Student und lerne sehr gerne Deutsch.',
    suggestedAnswerTr: 'Ben öğrenciyim ve çok severek Almanca öğreniyorum.',
    xpReward: 55,
    keyVocabulary: ['Beruf', 'Arbeiten als', 'Student', 'Deutsch lernen'],
    nativeCoachTip: 'Meslek söylerken Türkçe gibi doğrudan "Ich bin Arzt" (Doktorum) diyebilirsiniz.'
  },
  {
    day: 4,
    week: 1,
    title: 'Kibarca İsteme: "Ich hätte gerne..."',
    theme: 'Nezaket ve İstek',
    speakingGoal: 'Ich hätte gerne ein Glas Wasser, bitte.',
    speakingGoalTr: 'Bir bardak su rica ediyorum, lütfen.',
    aiPrompt: 'Guten Tag! Kann ich dir etwas zu trinken bringen?',
    aiPromptTr: 'İyi günler! Sana içecek bir şey getirebilir miyim?',
    suggestedAnswer: 'Ja gerne, ich hätte bitte eine Tasse Kaffee mit Milch.',
    suggestedAnswerTr: 'Evet lütfen, sütlü bir fincan kahve rica ediyorum.',
    xpReward: 60,
    keyVocabulary: ['Ich hätte gerne', 'Ein Glas Wasser', 'Bitte', 'Mit Milch'],
    nativeCoachTip: 'Almanya\'da sipariş verirken "Ich will" yerine "Ich hätte gerne..." demek her zaman en kibar formüldür.'
  },
  {
    day: 5,
    week: 1,
    title: 'Hızlı Fikir Belirtme: "Meiner Meinung nach..."',
    theme: 'Görüş Paylaşma',
    speakingGoal: 'Meiner Meinung nach ist Deutsch eine sehr logische Sprache.',
    speakingGoalTr: 'Bana göre Almanca son derece mantıklı bir dil.',
    aiPrompt: 'Wie findest du eigentlich die deutsche Sprache bisher?',
    aiPromptTr: 'Almancayı şu ana kadar nasıl buluyorsun?',
    suggestedAnswer: 'Ich finde, dass Deutsch eine wunderschöne und interessante Sprache ist.',
    suggestedAnswerTr: 'Bence Almanca çok güzel ve ilgi çekici bir dil.',
    xpReward: 65,
    keyVocabulary: ['Meiner Meinung nach', 'Ich finde', 'Interessant', 'Sprache'],
    nativeCoachTip: '"Ich finde..." dedikten sonra fikrinizi doğrudan belirtebilirsiniz.'
  },
  {
    day: 6,
    week: 1,
    title: 'Anlamadığın Anda: Kurtarma Cümlesi',
    theme: 'Kurtarıcı Refleks',
    speakingGoal: 'Könnten Sie das bitte noch einmal wiederholen?',
    speakingGoalTr: 'Bunu lütfen bir kez daha tekrar edebilir misiniz?',
    aiPrompt: 'Entschuldigung, hast du meine letzte Frage gut verstanden?',
    aiPromptTr: 'Afedersiniz, son sorumu iyi anladınız mı?',
    suggestedAnswer: 'Entschuldigung, könnten Sie bitte ein bisschen langsamer sprechen?',
    suggestedAnswerTr: 'Afedersiniz, lütfen biraz daha yavaş konuşabilir misiniz?',
    xpReward: 70,
    keyVocabulary: ['Wiederholen', 'Langsamer sprechen', 'Entschuldigung', 'Noch einmal'],
    nativeCoachTip: 'Yurtdışında "Könnten Sie bitte langsamer sprechen?" demek hayat kurtarır.'
  },
  {
    day: 7,
    week: 1,
    title: '1. Hafta Mezuniyeti: Kendini Tanıtma Röportajı! 🚀',
    theme: '1. Hafta Zaferi',
    speakingGoal: 'Hallo! Ich heiße Can, komme aus der Türkei und lerne Deutsch.',
    speakingGoalTr: 'Merhaba! Adım Can, Türkiye\'den geliyorum ve Almanca öğreniyorum.',
    aiPrompt: 'Herzlich willkommen zum Wochen-Interview! Erzähl mal kurz über dich!',
    aiPromptTr: 'Haftalık röportaja hoş geldin! Bize kısaca kendinden bahset!',
    suggestedAnswer: 'Hallo! Ich bin Can, wohne in Istanbul und lerne jeden Tag 15 Minuten Deutsch mit Chirmo.',
    suggestedAnswerTr: 'Merhaba! Ben Can, İstanbul\'da yaşıyorum ve her gün Chirmo ile 15 dakika Almanca çalışıyorum.',
    xpReward: 100,
    keyVocabulary: ['Interview', 'Jeden Tag', 'Wohnen', 'Sprechen'],
    nativeCoachTip: 'Tebrikler! 1. haftayı bitirdin. Artık kendini rahatça tanıtabiliyorsun.'
  },

  // ---------- 2. HAFTA: GÜNLÜK YAŞAM & ŞEHİRDE GEZME (8-14. GÜN) ----------
  {
    day: 8,
    week: 2,
    title: 'Fırında Kahvaltı: "Zwei Brötchen, bitte!"',
    theme: 'Fırın & Kafe',
    speakingGoal: 'Ich hätte gerne zwei frische Brötchen und ein Croissant.',
    speakingGoalTr: 'İki taze ekmekçik ve bir kruvasan rica ediyorum.',
    aiPrompt: 'Guten Morgen in der Bäckerei! Was darf es heute sein?',
    aiPromptTr: 'Fırınımıza günaydın! Ne arzu edersiniz?',
    suggestedAnswer: 'Guten Morgen! Zwei Brötchen und einen Cappuccino zum Mitnehmen, bitte.',
    suggestedAnswerTr: 'Günaydın! İki ekmekçik ve bir al-götür kapuçino lütfen.',
    xpReward: 80,
    keyVocabulary: ['Brötchen', 'Zum Mitnehmen', 'Frisch', 'Bäckerei'],
    nativeCoachTip: '"Zum Mitnehmen" paket yaptırmak (al-götür), "Hier essen" ise burada yemek demektir.'
  },
  {
    day: 9,
    week: 2,
    title: 'Yol Bulma: "Ist das zu Fuß erreichbar?"',
    theme: 'Şehir & Yönler',
    speakingGoal: 'Entschuldigung, wie komme ich zum Hauptbahnhof?',
    speakingGoalTr: 'Afedersiniz, tren garına nasıl gidebilirim?',
    aiPrompt: 'Kann ich dir den Weg zeigen? Wo möchtest du hin?',
    aiPromptTr: 'Sana yolu gösterebilir miyim? Nereye gitmek istiyorsun?',
    suggestedAnswer: 'Entschuldigung, ist das Museum zu Fuß erreichbar oder brauche ich den Bus?',
    suggestedAnswerTr: 'Afedersiniz, müze yürüme mesafesinde mi yoksa otobüse mi ihtiyacım var?',
    xpReward: 80,
    keyVocabulary: ['Hauptbahnhof', 'Zu Fuß erreichbar', 'Geradeaus', 'Links / Rechts'],
    nativeCoachTip: '"Zu Fuß erreichbar" yürüyerek ulaşılabilir anlamına gelen en popüler seyahat kalıbıdır.'
  },
  {
    day: 10,
    week: 2,
    title: 'Restoranda Hesap & Bahşiş: "Stimmt so!"',
    theme: 'Restoran & Ödeme',
    speakingGoal: 'Wir möchten bitte bezahlen. Zusammen oder getrennt?',
    speakingGoalTr: 'Ödemek istiyoruz lütfen. Birlikte mi ayrı mı?',
    aiPrompt: 'Hat es Ihnen geschmeckt? Möchten Sie die Rechnung?',
    aiPromptTr: 'Yemeği beğendiniz mi? Hesabı arzu eder misiniz?',
    suggestedAnswer: 'Es war sehr lecker! Die Rechnung bitte, getrennt zahlen.',
    suggestedAnswerTr: 'Çok lezzetliydi! Hesap lütfen, ayrı ayrı ödeyeceğiz.',
    xpReward: 85,
    keyVocabulary: ['Die Rechnung bitte', 'Getrennt zahlen', 'Stimmt so', 'Trinkgeld'],
    nativeCoachTip: 'Garsona para üstü kalsın demek için "Stimmt so!" deyin.'
  },
  {
    day: 11,
    week: 2,
    title: 'Otelde Check-in: "Ich habe eine Reservierung"',
    theme: 'Otel & Konaklama',
    speakingGoal: 'Guten Tag, ich habe ein Zimmer auf den Namen Can reserviert.',
    speakingGoalTr: 'İyi günler, Can adına bir oda ayırtmıştım.',
    aiPrompt: 'Herzlich willkommen im Hotel! Wie lautet Ihr Name?',
    aiPromptTr: 'Otelimize hoş geldiniz! Adınız nedir?',
    suggestedAnswer: 'Guten Tag, mein Name ist Can. Gibt es hier kostenloses WLAN?',
    suggestedAnswerTr: 'İyi günler, benim adım Can. Burada ücretsiz Wi-Fi var mı?',
    xpReward: 90,
    keyVocabulary: ['Reservierung', 'Zimmerschlüssel', 'Frühstück', 'Kostenloses WLAN'],
    nativeCoachTip: 'Otelde anahtar isterken "der Schlüssel" (anahtar) kelimesini sıkça duyarsınız.'
  },
  {
    day: 12,
    week: 2,
    title: 'Ulaşım & Tren: "Von welchem Gleis fährt der Zug?"',
    theme: 'Tren & Bilet',
    speakingGoal: 'Eine einfache Fahrt nach München, bitte.',
    speakingGoalTr: 'Münih\'e tek gidiş bir bilet lütfen.',
    aiPrompt: 'Am Schalter der Deutschen Bahn: Wohin möchten Sie reisen?',
    aiPromptTr: 'Tren gişesinde: Nereye seyahat etmek istiyorsunuz?',
    suggestedAnswer: 'Nach Berlin bitte. Wann fährt der nächste Zug ab?',
    suggestedAnswerTr: 'Berlin\'e lütfen. Bir sonraki tren ne zaman kalkıyor?',
    xpReward: 90,
    keyVocabulary: ['Gleis', 'Abfahren', 'Einfache Fahrt', 'Hin und zurück'],
    nativeCoachTip: 'Tren peronuna Almanca\'da "Gleis" denir (Gleis 4 = 4. Peron).'
  },
  {
    day: 13,
    week: 2,
    title: 'Mağazada Alışveriş: "Haben Sie das in Größe M?"',
    theme: 'Alışveriş & Beden',
    speakingGoal: 'Kann ich diese Jacke bitte anprobieren?',
    speakingGoalTr: 'Bu ceketi deneyebilir miyim lütfen?',
    aiPrompt: 'Guten Tag! Suchen Sie nach einer bestimmten Größe?',
    aiPromptTr: 'İyi günler! Belirli bir beden mi arıyorsunuz?',
    suggestedAnswer: 'Ja, haben Sie diesen Pullover auch in Schwarz und Größe M?',
    suggestedAnswerTr: 'Evet, bu kazağın siyahı ve M bedeni var mı?',
    xpReward: 95,
    keyVocabulary: ['Größe', 'Anprobieren', 'Umkleidekabine', 'Im Angebot'],
    nativeCoachTip: '"Anprobieren" kıyafeti üzerine denemek anlamındadır.'
  },
  {
    day: 14,
    week: 2,
    title: '2. Hafta Mezuniyeti: Canlı Turist Rolü! 🎭',
    theme: '2. Hafta Zaferi',
    speakingGoal: 'Ich verbringe eine wunderschöne Woche in Berlin!',
    speakingGoalTr: 'Berlin\'de harika bir hafta geçiriyorum!',
    aiPrompt: 'Wie gefällt dir deine Städtereise bisher in Deutschland?',
    aiPromptTr: 'Şu ana kadar Almanya\'daki şehir gezin nasıl geçiyor?',
    suggestedAnswer: 'Es ist fantastisch! Die Leute sind sehr hilfsbereit und das Essen schmeckt super.',
    suggestedAnswerTr: 'Harika! İnsanlar çok yardımsever ve yemekler çok lezzetli.',
    xpReward: 120,
    keyVocabulary: ['Städtereise', 'Fantastisch', 'Hilfsbereit', 'Besuchen'],
    nativeCoachTip: 'Harika gidiyorsun! 2. haftayı tamamladın, günlük hayatı rahatlıkla yönetiyorsun.'
  },

  // ---------- 3. HAFTA: AKICILIK & SOSYAL BAĞLAR (15-21. GÜN) ----------
  {
    day: 15,
    week: 3,
    title: 'Doğal Tepkiler: "Echt jetzt? Das ist ja Wahnsinn!"',
    theme: 'Duygusal Tepkiler',
    speakingGoal: 'Echt jetzt? Das wusste ich noch gar nicht!',
    speakingGoalTr: 'Gerçekten mi? Bunu hiç bilmiyordum!',
    aiPrompt: 'Ich habe heute im Lotto gewonnen! Kannst du das glauben?',
    aiPromptTr: 'Bugün lotoyu kazandım! İnanabiliyor musun?',
    suggestedAnswer: 'Wahnsinn! Herzlichen Glückwunsch, das freut mich wirklich sehr!',
    suggestedAnswerTr: 'İnanılmaz! Tebrik ederim, senin adına gerçekten çok sevindim!',
    xpReward: 100,
    keyVocabulary: ['Wahnsinn', 'Echt jetzt?', 'Das freut mich', 'Unglaublich'],
    nativeCoachTip: '"Wahnsinn!" Almanca\'da şaşkınlık ve hayranlık belirten en popüler ifadedir.'
  },
  {
    day: 16,
    week: 3,
    title: 'Dün Ne Yaptın? (Almanca Perfekt Zamanı)',
    theme: 'Geçmiş Zaman',
    speakingGoal: 'Gestern habe ich gearbeitet und ein gutes Buch gelesen.',
    speakingGoalTr: 'Dün çalıştım ve güzel bir kitap okudum.',
    aiPrompt: 'Was hast du gestern Schönes gemacht?',
    aiPromptTr: 'Dün ne güzel şeyler yaptın?',
    suggestedAnswer: 'Ich habe gestern Freunde getroffen und wir haben Pizza gegessen.',
    suggestedAnswerTr: 'Dün arkadaşlarımla buluştum ve pizza yedik.',
    xpReward: 105,
    keyVocabulary: ['Gestern', 'Habe gemacht', 'Getroffen', 'Gegessen'],
    nativeCoachTip: 'Almanca günlük konuşmada geçmiş zaman neredeyse daima Perfekt (haben/sein + Partizip II) ile kurulur.'
  },
  {
    day: 17,
    week: 3,
    title: 'Katılma ve Onay: "Da stimme ich dir vollkommen zu!"',
    theme: 'Fikirdaşlık',
    speakingGoal: 'Da hast du absolut recht, genau so sehe ich das auch.',
    speakingGoalTr: 'Kesinlikle çok haklısın, ben de tam olarak öyle görüyorum.',
    aiPrompt: 'Findest du nicht auch, dass Spaziergänge an der frischen Luft gut tun?',
    aiPromptTr: 'Temiz havada yürüyüş yapmanın çok iyi geldiğini düşünmüyor musun?',
    suggestedAnswer: 'Absolut! Da stimme ich dir vollkommen zu, das entspannt total.',
    suggestedAnswerTr: 'Kesinlikle! Sana tamamen katılıyorum, insanı tamamen rahatlatıyor.',
    xpReward: 110,
    keyVocabulary: ['Zustimmen', 'Absolut recht', 'Genau', 'Genauso'],
    nativeCoachTip: '"Da stimme ich dir zu" (Sana katılıyorum) diyerek sohbette sıcak bağ kurabilirsiniz.'
  },
  {
    day: 18,
    week: 3,
    title: 'Zevkler & Tercihler: "Ich trinke lieber Tee als Kaffee"',
    theme: 'Tercihler',
    speakingGoal: 'Ich mag lieber italienisches Essen als Fast Food.',
    speakingGoalTr: 'İtalyan yemeklerini fast food\'a tercih ederim.',
    aiPrompt: 'Was magst du lieber: Urlaub am Meer oder in den Bergen?',
    aiPromptTr: 'Hangisini daha çok seversin: Deniz tatili mi dağlar mı?',
    suggestedAnswer: 'Ich fahre viel lieber ans Meer, weil ich schwimmen liebe.',
    suggestedAnswerTr: 'Denize gitmeyi çok daha fazla tercih ederim çünkü yüzmeyi seviyorum.',
    xpReward: 115,
    keyVocabulary: ['Lieber als', 'Am liebsten', 'Urlaub', 'Weil'],
    nativeCoachTip: 'Almanca\'da "daha çok tercih etmek" için sıfat yerine "lieber" kullanılır.'
  },
  {
    day: 19,
    week: 3,
    title: 'Hafta Sonu Planları: "Am Samstag treffe ich Freunde"',
    theme: 'Gelecek Planı',
    speakingGoal: 'Am Wochenende habe ich vor, ins Kino zu gehen.',
    speakingGoalTr: 'Hafta sonu sinemaya gitmeyi planlıyorum.',
    aiPrompt: 'Hast du schon Pläne für das kommende Wochenende?',
    aiPromptTr: 'Önümüzdeki hafta sonu için planların var mı?',
    suggestedAnswer: 'Ja, am Samstag mache ich einen Ausflug und am Sonntag ruhe ich mich aus.',
    suggestedAnswerTr: 'Evet, cumartesi bir gezi yapacağım ve pazar günü dinleneceğim.',
    xpReward: 120,
    keyVocabulary: ['Ausflug', 'Ausruhen', 'Am Wochenende', 'Vorhaben'],
    nativeCoachTip: '"Ich habe vor..." bir şeyi yapmaya niyetlenmek veya planlamak demektir.'
  },
  {
    day: 20,
    week: 3,
    title: 'Tavsiye İsteme: "Was würdest du tun?"',
    theme: 'Öneri ve Fikir',
    speakingGoal: 'An deiner Stelle würde ich einen Sprachkurs machen.',
    speakingGoalTr: 'Senin yerinde olsaydım bir dil kursuna giderdim.',
    aiPrompt: 'Ich möchte fit bleiben. Was kannst du mir empfehlen?',
    aiPromptTr: 'Formda kalmak istiyorum. Bana ne tavsiye edebilirsin?',
    suggestedAnswer: 'Ich empfehle dir, regelmäßig schwimmen zu gehen oder joggen.',
    suggestedAnswerTr: 'Sana düzenli olarak yüzmeye gitmeni veya koşmanı öneririm.',
    xpReward: 125,
    keyVocabulary: ['Empfehlen', 'An deiner Stelle', 'Ratschlag', 'Regelmäßig'],
    nativeCoachTip: '"An deiner Stelle würde ich..." (Senin yerinde olsaydım...) en şık tavsiye başlangıcıdır.'
  },
  {
    day: 21,
    week: 3,
    title: '3. Hafta Mezuniyeti: Sosyal Sohbet Ustalığı! 🌟',
    theme: '3. Hafta Zaferi',
    speakingGoal: 'Ich kann mich jetzt wunderbar auf Deutsch unterhalten!',
    speakingGoalTr: 'Artık Almanca harika bir şekilde sohbet edebiliyorum!',
    aiPrompt: 'Erzähl mir von deinem besten Erlebnis in den letzten Wochen!',
    aiPromptTr: 'Bana son haftalardaki en güzel deneyiminden bahset!',
    suggestedAnswer: 'Ich habe mich mit einem Muttersprachler auf Deutsch unterhalten und alles verstanden!',
    suggestedAnswerTr: 'Ana dili Almanca olan biriyle konuştum ve her şeyi anladım!',
    xpReward: 150,
    keyVocabulary: ['Unterhalten', 'Muttersprachler', 'Verstanden', 'Erlebnis'],
    nativeCoachTip: 'Muhteşem! 3. hafta geride kaldı. Artık sosyal bağlar kurabiliyorsun.'
  },

  // ---------- 4. HAFTA: AKICILIK, İŞ & BÜYÜK MEZUNİYET (22-30. GÜN) ----------
  {
    day: 22,
    week: 4,
    title: 'Diplomatik Kibarlık: "Es tut mir leid, aber..."',
    theme: 'Zarif İtiraz',
    speakingGoal: 'Ich verstehe deinen Punkt, aber ich sehe das etwas anders.',
    speakingGoalTr: 'Noktanı anlıyorum ancak ben bunu biraz farklı görüyorum.',
    aiPrompt: 'Wir sollten das Projekt komplett von vorne beginnen, oder?',
    aiPromptTr: 'Projeye tamamen baştan başlamalıyız, değil mi?',
    suggestedAnswer: 'Es tut mir leid, aber ich glaube, wir können den aktuellen Plan verbessern.',
    suggestedAnswerTr: 'Kusura bakmayın ama bence mevcut planı geliştirebiliriz.',
    xpReward: 130,
    keyVocabulary: ['Es tut mir leid', 'Anderer Meinung', 'Verbessern', 'Vorschlag'],
    nativeCoachTip: 'İş ortamında kırıcı olmadan itiraz etmek için "Ich verstehe, aber..." kalıbını kullanın.'
  },
  {
    day: 23,
    week: 4,
    title: 'Telefon & Online Toplantı: "Die Verbindung ist schlecht"',
    theme: 'İletişim & Teknoloji',
    speakingGoal: 'Können Sie mich gut hören? Die Verbindung bricht ab.',
    speakingGoalTr: 'Beni iyi duyabiliyor musunuz? Bağlantı kesiliyor.',
    aiPrompt: 'Hallo Can! Bist du noch in der Leitung?',
    aiPromptTr: 'Alo Can! Hâlâ hatta mısın?',
    suggestedAnswer: 'Ja, ich bin da! Mein Mikrofon war kurz stummgeschaltet.',
    suggestedAnswerTr: 'Evet, buradayım! Mikrofonum kısa bir süre sessizdeydi.',
    xpReward: 135,
    keyVocabulary: ['In der Leitung', 'Stummgeschaltet', 'Verbindung', 'Hören'],
    nativeCoachTip: '"Stummgeschaltet" mikrofonun sessize alınmış olması demektir.'
  },
  {
    day: 24,
    week: 4,
    title: 'Eczane & Sağlık: "Ich brauche etwas gegen Kopfschmerzen"',
    theme: 'Sağlık & Eczane',
    speakingGoal: 'Haben Sie etwas gegen Halsschmerzen und Erkältung?',
    speakingGoalTr: 'Boğaz ağrısı ve soğuk algınlığına karşı bir şeyiniz var mı?',
    aiPrompt: 'Guten Tag in der Apotheke! Was fehlt Ihnen denn?',
    aiPromptTr: 'Eczaneye iyi günler! Neyiniz var?',
    suggestedAnswer: 'Ich fühle mich nicht wohl und habe Fieber. Was empfehlen Sie mir?',
    suggestedAnswerTr: 'Kendimi iyi hissetmiyorum ve ateşim var. Bana ne önerirsiniz?',
    xpReward: 140,
    keyVocabulary: ['Apotheke', 'Fieber', 'Kopfschmerzen', 'Besserung'],
    nativeCoachTip: 'Almanya\'da eczacıdan ayrılırken "Gute Besserung!" (Geçmiş olsun) denir.'
  },
  {
    day: 25,
    week: 4,
    title: 'Argüman Savunma: "Es hat Vor- und Nachteile"',
    theme: 'Düşünce Tartışması',
    speakingGoal: 'Einerseits ist es praktisch, andererseits kostet es viel Zeit.',
    speakingGoalTr: 'Bir taraftan pratik, diğer taraftan çok zaman alıyor.',
    aiPrompt: 'Ist es besser im Homeoffice oder im Büro zu arbeiten?',
    aiPromptTr: 'Evden mi yoksa ofisten mi çalışmak daha iyi?',
    suggestedAnswer: 'Beides hat Vor- und Nachteile. Im Homeoffice spart man viel Zeit beim Pendeln.',
    suggestedAnswerTr: 'İkisinin de artıları ve eksileri var. Evden çalışırken yolda çok zaman kazanıyorsunuz.',
    xpReward: 145,
    keyVocabulary: ['Vor- und Nachteile', 'Einerseits', 'Andererseits', 'Zeit sparen'],
    nativeCoachTip: '"Einerseits..., andererseits..." (Bir yandan..., diğer yandan...) en akademik kalıptır.'
  },
  {
    day: 26,
    week: 4,
    title: 'Özür Dileme & Telafi: "Das war mein Fehler"',
    theme: 'Profesyonel Çözüm',
    speakingGoal: 'Bitte entschuldigen Sie die Verspätung, der Zug ist ausgefallen.',
    speakingGoalTr: 'Gecikme için lütfen bağışlayın, tren iptal oldu.',
    aiPrompt: 'Wir haben schon 15 Minuten auf dich gewartet!',
    aiPromptTr: 'Seni 15 dakikadır bekliyoruz!',
    suggestedAnswer: 'Es tut mir aufrichtig leid! Ich kümmere mich sofort darum.',
    suggestedAnswerTr: 'Gerçekten çok özür dilerim! Hemen ilgileniyorum.',
    xpReward: 150,
    keyVocabulary: ['Aufrichtig leid', 'Verspätung', 'Kümmern', 'Entschuldigung'],
    nativeCoachTip: '"Ich kümmere mich darum" (Ben ilgilenirim / hallederim) güven veren sihirli bir sözdür.'
  },
  {
    day: 27,
    week: 4,
    title: 'Samimi Sohbet & Mizah: Günün Yorgunluğunu Atma',
    theme: 'Arkadaş Sohbeti',
    speakingGoal: 'Heute war ein langer Tag, aber jetzt können wir entspannen!',
    speakingGoalTr: 'Bugün uzun bir gündü ama artık rahatlayabiliriz!',
    aiPrompt: 'Wie war dein Tag heute insgesamt?',
    aiPromptTr: 'Bugün günün genel olarak nasıldı?',
    suggestedAnswer: 'Ziemlich anstrengend, aber sehr produktiv. Und wie war deiner?',
    suggestedAnswerTr: 'Oldukça yorucu ama çok üretkendi. Ya seninki nasıldı?',
    xpReward: 155,
    keyVocabulary: ['Anstrengend', 'Produktiv', 'Entspannen', 'Feierabend'],
    nativeCoachTip: 'İş bitişi saatine Almanya\'da "Feierabend" denir ("Schönen Feierabend!").'
  },
  {
    day: 28,
    week: 4,
    title: 'Gelecek Hayali: "In fünf Jahren möchte ich..."',
    theme: 'Vizyon & Hedef',
    speakingGoal: 'Mein Traum ist es, internationale Projekte auf Deutsch zu leiten.',
    speakingGoalTr: 'Hayalim Almanca uluslararası projeler yönetmek.',
    aiPrompt: 'Wo siehst du dich beruflich in den nächsten fünf Jahren?',
    aiPromptTr: 'Önümüzdeki beş yıl içinde kendini mesleki olarak nerede görüyorsun?',
    suggestedAnswer: 'Ich möchte fließend sprechen und in einem internationalen Team arbeiten.',
    suggestedAnswerTr: 'Akıcı konuşmak ve uluslararası bir ekipte çalışmak istiyorum.',
    xpReward: 160,
    keyVocabulary: ['Zukunft', 'Traum', 'Erreichen', 'Fließend'],
    nativeCoachTip: 'Hedef belirtirken "Mein Ziel ist es, ... zu + Fiil" formülü kullanılır.'
  },
  {
    day: 29,
    week: 4,
    title: 'Büyük Final Öncesi: Akıcı Konuşma Provası',
    theme: 'Son Hazırlık',
    speakingGoal: 'Ich habe 29 Tage durchgehalten und fühle mich selbstsicher!',
    speakingGoalTr: '29 gün boyunca azimle devam ettim ve kendime güveniyorum!',
    aiPrompt: 'Morgen ist der große Abschlusstag! Bist du bereit für das Finale?',
    aiPromptTr: 'Yarın büyük mezuniyet günü! Final için hazır mısın?',
    suggestedAnswer: 'Ja, absolut bereit! Mein Deutsch hat sich enorm verbessert.',
    suggestedAnswerTr: 'Evet, kesinlikle hazırım! Almancam inanılmaz derecede gelişti.',
    xpReward: 180,
    keyVocabulary: ['Durchgehalten', 'Bereit', 'Verbessert', 'Selbstsicher'],
    nativeCoachTip: 'Son güne bir adım kaldı! Dil kasların artık refleks haline geldi.'
  },
  {
    day: 30,
    week: 4,
    title: 'BÜYÜK FİNAL: 30 Günlük Mezuniyet & Konuşma Şampiyonluğu! 🏆',
    theme: 'Büyük Zafer & Mezuniyet',
    speakingGoal: 'Ich kann jetzt fließend, frei und selbstbewusst Deutsch sprechen!',
    speakingGoalTr: 'Artık akıcı, özgürce ve özgüvenle Almanca konuşabiliyorum!',
    aiPrompt: 'Herzlichen Glückwunsch! Du hast die 30 Tage geschafft! Wie fühlst du dich heute mit deinem Deutsch?',
    aiPromptTr: 'Tebrik ederim! 30 günü başardın! Bugün Almancanla kendini nasıl hissediyorsun?',
    suggestedAnswer: 'Danke Chirmo! Ich fühle mich jetzt viel sicherer und bereit für echte Gespräche in Deutschland!',
    suggestedAnswerTr: 'Teşekkürler Chirmo! Artık kendimi çok daha güvende ve gerçek Almanca sohbetlere hazır hissediyorum!',
    xpReward: 300,
    keyVocabulary: ['Herzlichen Glückwunsch', 'Fließend', 'Selbstbewusst', 'Bereit'],
    nativeCoachTip: '30 günlük maratonu başarıyla tamamladın! Tebrikler, sen artık bir Almanca konuşmacısısın! 🎓'
  }
];
