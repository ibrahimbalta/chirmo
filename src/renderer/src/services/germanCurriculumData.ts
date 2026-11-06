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
  {
    day: 1,
    week: 1,
    title: 'İlk Adım: Selamlaşma & İsim',
    theme: 'Tanışma Refleksi',
    speakingGoal: 'Hallo, ich heiße Mehmet und freue mich!',
    speakingGoalTr: 'Merhaba, adım Mehmet ve çok memnunum!',
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
    title: 'Mesleğin & Ne Yapıyorsun?',
    theme: 'İş & Uğraş',
    speakingGoal: 'Ich arbeite als Ingenieur und lerne Deutsch.',
    speakingGoalTr: 'Mühendis olarak çalışıyorum ve Almanca öğreniyorum.',
    aiPrompt: 'Was machst du beruflich? Welcher Beruf gefällt dir?',
    aiPromptTr: 'Mesleğin nedir? Hangi meslek hoşuna gidiyor?',
    suggestedAnswer: 'Ich bin Student und lerne sehr gerne Deutsch.',
    suggestedAnswerTr: 'Ben öğrenciyim ve çok severek Almanca öğreniyorum.',
    xpReward: 60,
    keyVocabulary: ['Beruf', 'Arbeiten als', 'Student', 'Deutsch lernen'],
    nativeCoachTip: 'Meslek söylerken Türkçe gibi doğrudan "Ich bin Arzt" (Doktorum) diyebilirsiniz.'
  },
  {
    day: 7,
    week: 1,
    title: '1. Hafta Kamp Sonu: Kafe Siparişi',
    theme: 'Haftalık Konuşma Zaferi',
    speakingGoal: 'Ich hätte gerne einen Tee und ein Stück Kuchen.',
    speakingGoalTr: 'Bir çay ve bir dilim pasta rica ediyorum.',
    aiPrompt: 'Willkommen in unserem Café! Was darf ich dir bringen?',
    aiPromptTr: 'Kafemize hoş geldin! Sana ne getirebilirim?',
    suggestedAnswer: 'Guten Tag! Ich hätte gerne einen schwarzen Tee und ein Wasser.',
    suggestedAnswerTr: 'İyi günler! Bir siyah çay ve bir su rica ediyorum.',
    xpReward: 100,
    keyVocabulary: ['Ich hätte gerne', 'Tee', 'Wasser', 'Kuchen'],
    nativeCoachTip: 'Kafede "bitte" kelimesini unutmayın; Almanca nezaketin temel anahtarıdır.'
  },
  {
    day: 14,
    week: 2,
    title: '2. Hafta Kampı: Hobiler ve Zaman',
    theme: 'Serbest Zaman Refleksi',
    speakingGoal: 'In meiner Freizeit lese ich Bücher und treibe Sport.',
    speakingGoalTr: 'Boş zamanlarımda kitap okur ve spor yaparım.',
    aiPrompt: 'Was machst du gerne am Wochenende?',
    aiPromptTr: 'Hafta sonları ne yapmayı seversin?',
    suggestedAnswer: 'Am Wochenende fahre ich gerne Fahrrad und höre Musik.',
    suggestedAnswerTr: 'Hafta sonları severek bisiklete binerim ve müzik dinlerim.',
    xpReward: 120,
    keyVocabulary: ['Freizeit', 'Fahrrad fahren', 'Musik hören', 'Am Wochenende'],
    nativeCoachTip: 'Almanca\'da "gerne" (severek) eylemin arkasına gelerek o şeyi yapmayı sevdiğinizi belirtir.'
  },
  {
    day: 30,
    week: 4,
    title: '30 Günlük Büyük Mezuniyet Konuşması',
    theme: 'Büyük Başarı & Akıcı Konuşma',
    speakingGoal: 'Ich kann jetzt fließend und selbstbewusst Deutsch sprechen!',
    speakingGoalTr: 'Artık akıcı ve özgüvenle Almanca konuşabiliyorum!',
    aiPrompt: 'Herzlichen Glückwunsch! Du hast die 30 Tage geschafft! Wie fühlst du dich heute mit deinem Deutsch?',
    aiPromptTr: 'Tebrik ederim! 30 günü başardın! Bugün Almancanla kendini nasıl hissediyorsun?',
    suggestedAnswer: 'Danke Chirmo! Ich fühle mich jetzt viel sicherer und bereit für echte Gespräche!',
    suggestedAnswerTr: 'Teşekkürler Chirmo! Artık kendimi çok daha güvende ve gerçek sohbetlere hazır hissediyorum!',
    xpReward: 300,
    keyVocabulary: ['Herzlichen Glückwunsch', 'Fließend', 'Selbstbewusst', 'Bereit'],
    nativeCoachTip: 'Düzenli 30 gün boyunca her gün birkaç cümle konuşmak dil öğrenmenin en garantili sırrıdır.'
  }
];
