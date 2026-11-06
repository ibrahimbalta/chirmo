import { SupportedLanguage, TargetLanguageService } from './targetLanguageService';

export interface ReflexDrillPrompt {
  id: string;
  category: 'Kafe' | 'İş & Toplantı' | 'Acil Durum' | 'Sosyal & Tanışma' | 'Alışveriş' | 'Seyahat';
  titleTr: string;
  scenarioTr: string;
  situationPrompt: string; // The trigger audio/context
  situationPromptTr: string;
  expectedKeywords: string[];
  suggestedAnswer: string;
  suggestedAnswerTr: string;
  coachExplanation: string;
  language: SupportedLanguage;
}

export const REFLEX_DRILLS: ReflexDrillPrompt[] = [
  // ==================== ALMANCA REFLEKS ANTRENMANLARI (DEUTSCH) ====================
  {
    id: 'de-drill-1',
    category: 'Kafe',
    titleTr: 'Garson Yanlış Kahve Getirdi',
    scenarioTr: 'Garson sana sade kahve getirdi ama sen sütlü istemiştin. Kibarca uyar!',
    situationPrompt: 'Hier ist Ihr schwarzer Kaffee. Lassen Sie es sich schmecken!',
    situationPromptTr: 'İşte sade kahveniz. Afiyet olsun!',
    expectedKeywords: ['entschuldigung', 'milch', 'mit milch', 'bestellt', 'hätte'],
    suggestedAnswer: 'Entschuldigung, aber ich hatte einen Kaffee mit Milch bestellt.',
    suggestedAnswerTr: 'Afedersiniz, ama ben sütlü kahve sipariş etmiştim.',
    coachExplanation: 'Gramer hesabı yapmadan "Entschuldigung, aber ich hatte..." kalıbıyla lafa gir!',
    language: 'de'
  },
  {
    id: 'de-drill-2',
    category: 'İş & Toplantı',
    titleTr: 'Toplantı Saatini Onayla',
    scenarioTr: 'İş arkadaşın yarın saat 14:00 uygun mu diye sordu. Uygun olduğunu ve orada olacağını söyle!',
    situationPrompt: 'Passt dir das Treffen morgen um 14 Uhr?',
    situationPromptTr: 'Yarın saat 14:00\'teki toplantı sana uyar mı?',
    expectedKeywords: ['passt', 'uhr', 'morgen', 'gerne', 'danke', 'pünktlich'],
    suggestedAnswer: 'Ja, um 14 Uhr passt es mir perfekt. Ich bin pünktlich da!',
    suggestedAnswerTr: 'Evet, saat 14 bana mükemmel uyuyor. Tam vaktinde orada olacağım!',
    coachExplanation: 'Zaman sorularında en hızlı refleks: "Ja, das passt mir perfekt!"',
    language: 'de'
  },
  {
    id: 'de-drill-3',
    category: 'Seyahat',
    titleTr: 'Tren Peronunu Acil Sor',
    scenarioTr: 'Trenin kalkmasına 3 dakika var. Berlin treninin hangi perondan kalktığını sor!',
    situationPrompt: 'Sie suchen Ihren Zug am Hauptbahnhof...',
    situationPromptTr: 'Tren garında treninizi arıyorsunuz...',
    expectedKeywords: ['gleis', 'berlin', 'zug', 'abfahren', 'welchem'],
    suggestedAnswer: 'Entschuldigung! Von welchem Gleis fährt der Zug nach Berlin ab?',
    suggestedAnswerTr: 'Afedersiniz! Berlin treni hangi perondan kalkıyor?',
    coachExplanation: 'Almanya garlarında peron kelimesi "Gleis"tır. "Von welchem Gleis...?" en hızlı kurtarıcıdır.',
    language: 'de'
  },
  {
    id: 'de-drill-4',
    category: 'Sosyal & Tanışma',
    titleTr: 'İltifata Doğal Teşekkür',
    scenarioTr: 'Biri Almancanın çok iyi olduğunu söyledi. Teşekkür et ve yeni başladığını söyle!',
    situationPrompt: 'Wow, dein Deutsch klingt wirklich super fließend!',
    situationPromptTr: 'Vay canına, Almancan gerçekten çok akıcı geliyor!',
    expectedKeywords: ['danke', 'vielen dank', 'nett', 'lerne', 'übe'],
    suggestedAnswer: 'Vielen Dank, das ist sehr nett! Ich gebe mein Bestes.',
    suggestedAnswerTr: 'Çok teşekkürler, çok naziksiniz! Elimden gelenin en iyisini yapıyorum.',
    coachExplanation: '"Das ist sehr nett von dir!" iltifatlara en sempatik Alman refleksidir.',
    language: 'de'
  },
  {
    id: 'de-drill-5',
    category: 'Alışveriş',
    titleTr: 'Fiyat & Kartla Ödeme',
    scenarioTr: 'Kasadasın. Kredi kartıyla ödeyip ödeyemeyeceğini sor!',
    situationPrompt: 'Das macht zusammen 24 Euro und 50 Cent, bitte.',
    situationPromptTr: 'Toplam 24 Euro 50 Cent lütfen.',
    expectedKeywords: ['karte', 'kreditkarte', 'zahlen', 'bezahlen', 'kann ich'],
    suggestedAnswer: 'Kann ich bitte mit Karte bezahlen?',
    suggestedAnswerTr: 'Kartla ödeyebilir miyim lütfen?',
    coachExplanation: '"Mit Karte zahlen" Almanya\'da en çok sorulan ve bilinen pratik kalıptır.',
    language: 'de'
  },
  {
    id: 'de-drill-6',
    category: 'Acil Durum',
    titleTr: 'Yavaş Konuşmasını İste',
    scenarioTr: 'Karşındaki Alman çok hızlı konuştu ve hiçbir şey anlamadın. Kibarca yavaşlat!',
    situationPrompt: 'Schnelle deutsche Ansage am Schalter...',
    situationPromptTr: 'Gişede çok hızlı bir Almanca konuşma yapıldı...',
    expectedKeywords: ['langsamer', 'wiederholen', 'bitte', 'verstanden', 'entschuldigung'],
    suggestedAnswer: 'Entschuldigung, könnten Sie bitte etwas langsamer sprechen?',
    suggestedAnswerTr: 'Afedersiniz, lütfen biraz daha yavaş konuşabilir misiniz?',
    coachExplanation: 'Korkup susmak yerine "Etwas langsamer bitte!" de, rahatla.',
    language: 'de'
  },

  // ==================== İNGİLİZCE REFLEKS ANTRENMANLARI (ENGLISH) ====================
  {
    id: 'en-drill-1',
    category: 'Kafe',
    titleTr: 'Yanlış Siparişi Hızlıca Düzelt',
    scenarioTr: 'Garson sana sıcak kahve getirdi ama sen soğuk (buzlu) istemiştin. Anında söyle!',
    situationPrompt: 'Here is your hot Americano! Enjoy!',
    situationPromptTr: 'İşte sıcak Americano\'nuz! Afiyet olsun!',
    expectedKeywords: ['iced', 'ordered', 'cold', 'excuse me', 'sorry'],
    suggestedAnswer: 'Excuse me, I actually ordered an iced coffee.',
    suggestedAnswerTr: 'Afedersiniz, ben aslında buzlu kahve sipariş etmiştim.',
    coachExplanation: '"I actually ordered..." kalıbı durumu en kibar ve net şekilde çözer.',
    language: 'en'
  },
  {
    id: 'en-drill-2',
    category: 'İş & Toplantı',
    titleTr: 'Görüşmede Sesinin Geldiğini Bildir',
    scenarioTr: 'Online toplantıda "Beni duyabiliyor musunuz?" dediler. Net ve gür sesle yanıtla!',
    situationPrompt: 'Can everyone hear me clearly?',
    situationPromptTr: 'Herkes beni net duyabiliyor mu?',
    expectedKeywords: ['loud', 'clear', 'hear', 'yes', 'perfect'],
    suggestedAnswer: 'Yes, loud and clear! We can hear you perfectly.',
    suggestedAnswerTr: 'Evet, net ve açık! Sizi kusursuz duyabiliyoruz.',
    coachExplanation: '"Loud and clear" iş dünyasının en doğal online toplantı refleksidir.',
    language: 'en'
  },
  {
    id: 'en-drill-3',
    category: 'Seyahat',
    titleTr: 'Yürüme Mesafesi Sorma',
    scenarioTr: 'Müzeye gitmek istiyorsun. Yürüyerek gidilip gidilemeyeceğini sor!',
    situationPrompt: 'You are asking for directions on the street...',
    situationPromptTr: 'Sokakta yol tarifi soruyorsunuz...',
    expectedKeywords: ['walking distance', 'walk', 'far', 'get there', 'foot'],
    suggestedAnswer: 'Is it within walking distance from here?',
    suggestedAnswerTr: 'Burası buradan yürüme mesafesinde mi?',
    coachExplanation: '"Within walking distance" seyahat ederken hayat kurtarır.',
    language: 'en'
  },
  {
    id: 'en-drill-4',
    category: 'Sosyal & Tanışma',
    titleTr: 'Beklenmedik Habere Şaşırma',
    scenarioTr: 'Arkadaşın şirket kurduğunu söyledi. Doğal bir Amerikalı gibi şaşır ve tebrik et!',
    situationPrompt: 'Guess what? I just started my own software startup!',
    situationPromptTr: 'Bil bakalım ne oldu? Kendi yazılım şirketimi kurdum!',
    expectedKeywords: ['way', 'serious', 'congrats', 'amazing', 'kidding'],
    suggestedAnswer: 'No way! Are you serious? That is amazing, congratulations!',
    suggestedAnswerTr: 'Yok artık! Ciddi misin? Bu harika, tebrik ederim!',
    coachExplanation: '"No way! Are you serious?" samimi şaşırmanın 1 numaralı refleksidir.',
    language: 'en'
  },
  {
    id: 'en-drill-5',
    category: 'Alışveriş',
    titleTr: 'İndirim / Kampanya Sorma',
    scenarioTr: 'Beğendiğin ayakkabıyı alırken öğrenci veya sezon indirimi olup olmadığını sor!',
    situationPrompt: 'The cashier is scanning your items...',
    situationPromptTr: 'Kasiyer ürünlerinizi okutuyor...',
    expectedKeywords: ['discount', 'student', 'sale', 'offer', 'any discount'],
    suggestedAnswer: 'Excuse me, do you have any student discount on this?',
    suggestedAnswerTr: 'Afedersiniz, bunda herhangi bir öğrenci indirimi var mı?',
    coachExplanation: '"Do you have any discount...?" en pratik kalıptır.',
    language: 'en'
  },
  {
    id: 'en-drill-6',
    category: 'Acil Durum',
    titleTr: 'Pardon, Anlamadım! Tekrarla',
    scenarioTr: 'Biri sana çok hızlı bir şey söyledi. Hiç çekinmeden tekrar etmesini iste!',
    situationPrompt: 'Fast native speech blurting out...',
    situationPromptTr: 'Çok hızlı bir İngilizce cümle söylendi...',
    expectedKeywords: ['catch', 'repeat', 'again', 'sorry', 'pardon'],
    suggestedAnswer: 'Sorry, I didn\'t catch that. Could you say it again, please?',
    suggestedAnswerTr: 'Pardon, yakalayamadım. Tekrar söyleyebilir misiniz lütfen?',
    coachExplanation: '"I didn\'t catch that" yerlilerin en çok kullandığı zarif cümledir.',
    language: 'en'
  }
];

export const ReflexDrillService = {
  getDrills(lang?: SupportedLanguage): ReflexDrillPrompt[] {
    const target = lang || TargetLanguageService.getTargetLanguage();
    return REFLEX_DRILLS.filter((d) => d.language === target);
  },

  evaluateResponse(
    userText: string,
    drill: ReflexDrillPrompt,
    responseTimeSeconds: number
  ): {
    score: number;
    speedRating: 'Işık Hızı ⚡' | 'Çok Hızlı 🚀' | 'İyi Refleks 👍';
    feedbackTr: string;
    xpEarned: number;
  } {
    const lower = userText.toLowerCase().trim();
    let matches = 0;
    drill.expectedKeywords.forEach((kw) => {
      if (lower.includes(kw.toLowerCase())) matches++;
    });

    const accuracy = drill.expectedKeywords.length > 0 ? matches / drill.expectedKeywords.length : 0.8;
    const baseScore = Math.round(75 + accuracy * 25);

    let speedRating: 'Işık Hızı ⚡' | 'Çok Hızlı 🚀' | 'İyi Refleks 👍' = 'İyi Refleks 👍';
    let speedBonus = 10;
    if (responseTimeSeconds <= 1.8) {
      speedRating = 'Işık Hızı ⚡';
      speedBonus = 25;
    } else if (responseTimeSeconds <= 3.0) {
      speedRating = 'Çok Hızlı 🚀';
      speedBonus = 15;
    }

    const finalScore = Math.min(100, baseScore);
    const xpEarned = 30 + speedBonus;

    const feedbackTr =
      finalScore >= 85
        ? `Mükemmel refleks! Gramer hesaplamadan ${responseTimeSeconds.toFixed(1)} saniyede doğrudan ağzından döküldü.`
        : `Tebrikler! Düşünmeden konuşma refleksini çalıştırdın. Doğal kalıbı tekrar ederek kas hafızanı güçlendir.`;

    return {
      score: finalScore,
      speedRating,
      feedbackTr,
      xpEarned
    };
  }
};
