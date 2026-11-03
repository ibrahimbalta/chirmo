export type GradeLevel = '5' | '6' | '7' | '8';

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  title: string;
  grade: GradeLevel;
  theme: string;
  badge: string;
  keyWords: Array<{
    en: string;
    tr: string;
    phonetic: string;
    example: string;
    exampleTr: string;
  }>;
  dailySpeakingPrompt: {
    question: string;
    questionTr: string;
    expectedAnswerExample: string;
    expectedAnswerTr: string;
    audioTip: string;
  };
}

export interface DayMission {
  day: number;
  week: number;
  title: string;
  targetSkill: string;
  speakingGoal: string;
  speakingGoalTr: string;
  aiPrompt: string;
  aiPromptTr: string;
  suggestedAnswer: string;
  suggestedAnswerTr: string;
  xpReward: number;
  keyVocabulary: string[];
}

export const GRADE_UNITS: Record<GradeLevel, CurriculumUnit[]> = {
  '5': [
    {
      id: 'g5-u1',
      unitNumber: 1,
      grade: '5',
      title: 'Hello & Getting to Know',
      theme: 'Tanışma, Selamlaşma, Ülkeler & Diller',
      badge: '👋 Tanışma',
      keyWords: [
        { en: 'country', tr: 'Ülke', phonetic: '/ˈkʌntri/', example: 'I live in Turkey.', exampleTr: "Türkiye'de yaşıyorum." },
        { en: 'nationality', tr: 'Milliyet', phonetic: '/ˌnæʃəˈnæləti/', example: 'I am Turkish.', exampleTr: 'Ben Türküm.' },
        { en: 'language', tr: 'Dil / Lisan', phonetic: '/ˈlæŋɡwɪdʒ/', example: 'I speak Turkish and English.', exampleTr: 'Türkçe ve İngilizce konuşurum.' },
        { en: 'favorite', tr: 'En sevilen / Favori', phonetic: '/ˈfeɪvərɪt/', example: 'English is my favorite subject.', exampleTr: 'İngilizce en sevdiğim derstir.' }
      ],
      dailySpeakingPrompt: {
        question: 'Hello! What is your name and which country are you from?',
        questionTr: 'Merhaba! Adın ne ve hangi ülkedensin?',
        expectedAnswerExample: 'Hello! My name is Ali and I am from Turkey.',
        expectedAnswerTr: 'Merhaba! Benim adım Ali ve ben Türkiyeliyim.',
        audioTip: '"from" kelimesini net telaffuz etmeye özen göster!'
      }
    },
    {
      id: 'g5-u2',
      unitNumber: 2,
      grade: '5',
      title: 'My Town & Directions',
      theme: 'Şehrim, Yerler ve Yol Tarifi',
      badge: '🗺️ Şehir & Yol',
      keyWords: [
        { en: 'library', tr: 'Kütüphane', phonetic: '/ˈlaɪbrəri/', example: 'The library is next to the school.', exampleTr: 'Kütüphane okulun yanındadır.' },
        { en: 'hospital', tr: 'Hastane', phonetic: '/ˈhɒspɪtl/', example: 'Where is the hospital?', exampleTr: 'Hastane nerede?' },
        { en: 'bakery', tr: 'Fırın / Pastane', phonetic: '/ˈbeɪkəri/', example: 'I buy bread from the bakery.', exampleTr: 'Fırından ekmek alırım.' },
        { en: 'straight', tr: 'Düz / Dosdoğru', phonetic: '/streɪt/', example: 'Go straight ahead and turn left.', exampleTr: 'Dosdoğru git ve sola dön.' }
      ],
      dailySpeakingPrompt: {
        question: 'Excuse me, where is your school library?',
        questionTr: 'Affedersiniz, okulunuzun kütüphanesi nerede?',
        expectedAnswerExample: 'Go straight ahead. It is next to the cafe.',
        expectedAnswerTr: 'Dosdoğru gidin. Kafenin yanındadır.',
        audioTip: '"straight" derken gh harflerini okuma, streyt olarak söyle!'
      }
    },
    {
      id: 'g5-u3',
      unitNumber: 3,
      grade: '5',
      title: 'Games and Hobbies',
      theme: 'Oyunlar, Hobiler ve Yetenekler',
      badge: '🎮 Hobiler',
      keyWords: [
        { en: 'chess', tr: 'Satranç', phonetic: '/tʃes/', example: 'I like playing chess with my dad.', exampleTr: 'Babamla satranç oynamayı severim.' },
        { en: 'dodgeball', tr: 'Yakar top', phonetic: '/ˈdɒdʒbɔːl/', example: 'We play dodgeball in P.E. class.', exampleTr: 'Beden dersinde yakar top oynuyoruz.' },
        { en: 'origami', tr: 'Kağıt katlama sanatı', phonetic: '/ˌɒrɪˈɡɑːmi/', example: 'She can fold nice origami animals.', exampleTr: 'Güzel origami hayvanları katlayabilir.' },
        { en: 'hiking', tr: 'Doğa yürüyüşü', phonetic: '/ˈhaɪkɪŋ/', example: 'We go hiking on Sundays.', exampleTr: 'Pazar günleri doğa yürüyüşüne çıkarız.' }
      ],
      dailySpeakingPrompt: {
        question: 'What is your favorite hobby in your free time?',
        questionTr: 'Boş zamanında en sevdiğin hobi nedir?',
        expectedAnswerExample: 'I enjoy playing chess and riding a bike.',
        expectedAnswerTr: 'Satranç oynamaktan ve bisiklete binmekten keyif alırım.',
        audioTip: '"enjoy" dedikten sonra fiile -ing eklemeyi unutma!'
      }
    }
  ],
  '6': [
    {
      id: 'g6-u1',
      unitNumber: 1,
      grade: '6',
      title: 'Life & Daily Routine',
      theme: 'Günlük Yaşam, Saatler ve Alışkanlıklar',
      badge: '⏰ Günlük Yaşam',
      keyWords: [
        { en: 'wake up', tr: 'Uyanmak', phonetic: '/weɪk ʌp/', example: 'I wake up at seven o\'clock.', exampleTr: 'Saat yedide uyanırım.' },
        { en: 'have breakfast', tr: 'Kahvaltı yapmak', phonetic: '/hæv ˈbrekfəst/', example: 'I have breakfast with my family.', exampleTr: 'Ailemle kahvaltı yaparım.' },
        { en: 'attend', tr: 'Katılmak (derse/kursa)', phonetic: '/əˈtend/', example: 'I attend an English course on Saturday.', exampleTr: 'Cumartesi günü İngilizce kursuna katılırım.' },
        { en: 'take a nap', tr: 'Şekerleme yapmak', phonetic: '/teɪk ə næp/', example: 'I take a nap after school.', exampleTr: 'Okuldan sonra kestiririm.' }
      ],
      dailySpeakingPrompt: {
        question: 'What time do you wake up on weekdays?',
        questionTr: 'Hafta içi saat kaçta uyanırsın?',
        expectedAnswerExample: 'I usually wake up at seven o\'clock in the morning.',
        expectedAnswerTr: 'Sabahları genellikle saat yedide uyanırım.',
        audioTip: '"usually" kelimesinde \'j\' sesine dikkat et!'
      }
    },
    {
      id: 'g6-u2',
      unitNumber: 2,
      grade: '6',
      title: 'Yummy Breakfast',
      theme: 'Yiyecekler, İçecekler ve Tercihler',
      badge: '🥞 Kahvaltı',
      keyWords: [
        { en: 'nutritious', tr: 'Besleyici / Yararlı', phonetic: '/njuːˈtrɪʃəs/', example: 'Eggs and milk are very nutritious.', exampleTr: 'Yumurta ve süt çok besleyicidir.' },
        { en: 'junk food', tr: 'Abur cubur / Zararlı yiyecek', phonetic: '/dʒʌŋk fuːd/', example: 'Do not eat too much junk food.', exampleTr: 'Çok fazla abur cubur yeme.' },
        { en: 'croissant', tr: 'Kruvasan', phonetic: '/ˈkwæsɒ̃/', example: 'I like eating croissants with honey.', exampleTr: 'Kruvasanı balla yemeyi severim.' },
        { en: 'pancake', tr: 'Krep / Pankek', phonetic: '/ˈpænkeɪk/', example: 'My mom makes delicious pancakes.', exampleTr: 'Annem leziz pankekler yapar.' }
      ],
      dailySpeakingPrompt: {
        question: 'What do you usually have for breakfast?',
        questionTr: 'Kahvaltıda genellikle ne yersin?',
        expectedAnswerExample: 'I usually have eggs, cheese, olives and a glass of milk.',
        expectedAnswerTr: 'Genellikle yumurta, peynir, zeytin ve bir bardak süt tüketirim.',
        audioTip: '"usually" ve "have" akıcı şekilde bağlayarak söyle!'
      }
    }
  ],
  '7': [
    {
      id: 'g7-u1',
      unitNumber: 1,
      grade: '7',
      title: 'Appearance and Personality',
      theme: 'Fiziksel Özellikler ve Karakter',
      badge: '✨ Karakter',
      keyWords: [
        { en: 'generous', tr: 'Cömert', phonetic: '/ˈdʒenərəs/', example: 'My best friend is very generous.', exampleTr: 'En yakın arkadaşım çok cömerttir.' },
        { en: 'punctual', tr: 'Dakik / Zamanında gelen', phonetic: '/ˈpʌŋktʃuəl/', example: 'She is always punctual for class.', exampleTr: 'Derse her zaman vaktinde gelir.' },
        { en: 'outgoing', tr: 'Cana yakın / Dışa dönük', phonetic: '/ˌaʊtˈɡəʊɪŋ/', example: 'He is friendly and outgoing.', exampleTr: 'O arkadaş canlısı ve dışa dönüktür.' },
        { en: 'honest', tr: 'Dürüst', phonetic: '/ˈɒnɪst/', example: 'An honest person never tells lies.', exampleTr: 'Dürüst bir insan asla yalan söylemez.' }
      ],
      dailySpeakingPrompt: {
        question: 'How would you describe your best friend\'s personality?',
        questionTr: 'En iyi arkadaşının karakterini nasıl tarif edersin?',
        expectedAnswerExample: 'My best friend is very generous, honest and cheerful.',
        expectedAnswerTr: 'En iyi arkadaşım çok cömert, dürüst ve neşelidir.',
        audioTip: '"honest" kelimesinde \'h\' harfi okunmaz, sessizdir!'
      }
    },
    {
      id: 'g7-u2',
      unitNumber: 2,
      grade: '7',
      title: 'Sports & Training',
      theme: 'Spor Dalları, Ekipmanlar ve Başarı',
      badge: '🏅 Spor & Başarı',
      keyWords: [
        { en: 'spectator', tr: 'Seyirci', phonetic: '/spekˈteɪtər/', example: 'Thousands of spectators watched the match.', exampleTr: 'Binlerce seyirci maçı izledi.' },
        { en: 'equipment', tr: 'Ekipman / Malzeme', phonetic: '/ɪˈkwɪpmənt/', example: 'You need protective equipment for skating.', exampleTr: 'Paten için koruyucu ekipmana ihtiyacın var.' },
        { en: 'achieve', tr: 'Başarmak / Elde etmek', phonetic: '/əˈtʃiːv/', example: 'Practice every day to achieve your goals.', exampleTr: 'Hedeflerine ulaşmak için her gün pratik yap.' },
        { en: 'beat', tr: 'Yenmek (rakibi)', phonetic: '/biːt/', example: 'Our school team beat the rivals.', exampleTr: 'Okul takımımız rakipleri yendi.' }
      ],
      dailySpeakingPrompt: {
        question: 'How often do you do sports or exercise?',
        questionTr: 'Ne sıklıkla spor veya egzersiz yaparsın?',
        expectedAnswerExample: 'I play basketball twice a week and ride my bike every day.',
        expectedAnswerTr: 'Haftada iki kez basketbol oynarım ve her gün bisiklete binerim.',
        audioTip: '"twice a week" (haftada iki kez) kalıbını unutma!'
      }
    }
  ],
  '8': [
    {
      id: 'g8-u1',
      unitNumber: 1,
      grade: '8',
      title: 'Friendship (LGS 1. Ünite)',
      theme: 'Arkadaşlık, Davetler ve LGS Soru Kalıpları',
      badge: '🎯 LGS 1. Ünite',
      keyWords: [
        { en: 'count on', tr: 'Güvenmek / Sırtını dayamak', phonetic: '/kaʊnt ɒn/', example: 'True friends always count on each other.', exampleTr: 'Gerçek dostlar daima birbirine güvenir.' },
        { en: 'back up', tr: 'Desteklemek / Arka çıkmak', phonetic: '/bæk ʌp/', example: 'He always backs me up when I need help.', exampleTr: 'Yardıma ihtiyacım olduğunda hep beni destekler.' },
        { en: 'get on well', tr: 'İyi geçinmek', phonetic: '/ɡet ɒn wel/', example: 'We get on well with my classmates.', exampleTr: 'Sınıf arkadaşlarımla çok iyi geçiniriz.' },
        { en: 'apologize', tr: 'Özür dilemek', phonetic: '/əˈpɒlədʒaɪz/', example: 'You should apologize for being late.', exampleTr: 'Geç kaldığın için özür dilemelisin.' }
      ],
      dailySpeakingPrompt: {
        question: 'LGS Practice: Would you like to come to my birthday party on Sunday?',
        questionTr: 'Pazar günü doğum günü partime gelmek ister misin?',
        expectedAnswerExample: 'I would love to, but I have to study for the LGS exam.',
        expectedAnswerTr: 'Çok isterdim ama LGS sınavına çalışmak zorundayım.',
        audioTip: 'LGS\'de daveti kibarca reddetme kalıbı (I would love to, but...) çok sık sorulur!'
      }
    },
    {
      id: 'g8-u2',
      unitNumber: 2,
      grade: '8',
      title: 'Teen Life & Preferences',
      theme: 'Gençlerin Hayatı, Müzik ve Spor Tercihleri',
      badge: '🎧 LGS 2. Ünite',
      keyWords: [
        { en: 'fond of', tr: 'Düşkün olmak / Çok sevmek', phonetic: '/fɒnd ɒv/', example: 'I am fond of listening to rock music.', exampleTr: 'Rock müzik dinlemeye bayılırım.' },
        { en: 'unbearable', tr: 'Katlanılmaz / Çekilmez', phonetic: '/ʌnˈbeərəbl/', example: 'I think heavy metal is unbearable.', exampleTr: 'Bence heavy metal katlanılmaz.' },
        { en: 'prefer', tr: 'Tercih etmek', phonetic: '/prɪˈfɜː/', example: 'I prefer playing football to basketball.', exampleTr: 'Futbol oynamayı basketbola tercih ederim.' },
        { en: 'snob', tr: 'Kibirli / Züppe', phonetic: '/snɒb/', example: 'He is not a snob, he is very modest.', exampleTr: 'O kibirli biri değil, çok alçakgönüllüdür.' }
      ],
      dailySpeakingPrompt: {
        question: 'Which music type do you prefer listening to?',
        questionTr: 'Hangi tür müzik dinlemeyi tercih edersin?',
        expectedAnswerExample: 'I prefer pop music because it is energetic and fun.',
        expectedAnswerTr: 'Pop müziği tercih ederim çünkü enerjik ve eğlencelidir.',
        audioTip: '"prefer A to B" yapısına dikkat et!'
      }
    },
    {
      id: 'g8-u3',
      unitNumber: 3,
      grade: '8',
      title: 'In the Kitchen (LGS 3. Ünite)',
      theme: 'Mutfak, Yemek Tarifleri ve Sıralama Zarfları',
      badge: '🍳 LGS 3. Ünite',
      keyWords: [
        { en: 'chop', tr: 'İnce ince doğramak', phonetic: '/tʃɒp/', example: 'First, chop the tomatoes.', exampleTr: 'Önce domatesleri doğrayın.' },
        { en: 'stir', tr: 'Karıştırmak', phonetic: '/stɜː/', example: 'Stir the soup continuously.', exampleTr: 'Çorbayı sürekli karıştırın.' },
        { en: 'recipe', tr: 'Yemek tarifi', phonetic: '/ˈresəpi/', example: 'This is my grandmother\'s secret recipe.', exampleTr: 'Bu anneannemin gizli tarifidir.' },
        { en: 'ingredient', tr: 'Malzeme / İçerik', phonetic: '/ɪnˈɡriːdiənt/', example: 'We have all the ingredients for the cake.', exampleTr: 'Kek için tüm malzemelerimiz var.' }
      ],
      dailySpeakingPrompt: {
        question: 'How do you make an omelette?',
        questionTr: 'Omleti nasıl yaparsın?',
        expectedAnswerExample: 'First crack two eggs. Then whisk them and fry in a pan.',
        expectedAnswerTr: 'Önce iki yumurta kırın. Sonra çırpın ve tavada kızartın.',
        audioTip: 'LGS\'de First, Second, Then, After that, Finally sıralaması kesin çıkar!'
      }
    }
  ]
};

// 30 GÜNLÜK HIZLI KONUŞMA KAMPI (1-30 GÜN EKSİKSİZ)
export const THIRTY_DAY_MISSIONS: DayMission[] = [
  // ==================== HAFTA 1: KENDİNİ VE ÇEVRENİ TANIT (1-7) ====================
  {
    day: 1,
    week: 1,
    title: 'Kendini Tanıtma (İlk Adım)',
    targetSkill: 'Adını, yaşını ve nereden olduğunu söyleme',
    speakingGoal: 'Say: Hello, my name is... and I am... years old.',
    speakingGoalTr: 'Adını ve yaşını sesli olarak söyle.',
    aiPrompt: 'Hello! I am Chirmo, your AI English buddy. What is your name and how old are you?',
    aiPromptTr: 'Merhaba! Ben senin yapay zekâ İngilizce arkadaşınım. Adın ne ve kaç yaşındasın?',
    suggestedAnswer: 'Hello! My name is Eren and I am twelve years old.',
    suggestedAnswerTr: 'Merhaba! Benim adım Eren ve ben 12 yaşındayım.',
    xpReward: 50,
    keyVocabulary: ['name', 'years old', 'hello', 'student']
  },
  {
    day: 2,
    week: 1,
    title: 'Nerede Yaşıyorsun?',
    targetSkill: 'Şehrini ve ülkene ait bilgiyi söyleme',
    speakingGoal: 'Say: I live in Turkey / I am from...',
    speakingGoalTr: 'Hangi şehirde yaşadığını söyle.',
    aiPrompt: 'Nice to meet you! Which city do you live in?',
    aiPromptTr: 'Tanıştığımıza sevindim! Hangi şehirde yaşıyorsun?',
    suggestedAnswer: 'I live in Istanbul. It is a big and beautiful city.',
    suggestedAnswerTr: "İstanbul'da yaşıyorum. Büyük ve güzel bir şehir.",
    xpReward: 50,
    keyVocabulary: ['live', 'city', 'beautiful', 'big']
  },
  {
    day: 3,
    week: 1,
    title: 'En Sevdiğin Ders ve Renk',
    targetSkill: 'Favori şeylerini ifade etme ("My favorite...")',
    speakingGoal: 'Say: My favorite school subject is English.',
    speakingGoalTr: 'En sevdiğin dersi söyle.',
    aiPrompt: 'What is your favorite subject at school?',
    aiPromptTr: 'Okulda en sevdiğin ders hangisi?',
    suggestedAnswer: 'My favorite subject is English because it is very exciting.',
    suggestedAnswerTr: 'En sevdiğim ders İngilizce çünkü çok heyecan verici.',
    xpReward: 50,
    keyVocabulary: ['favorite', 'subject', 'school', 'exciting']
  },
  {
    day: 4,
    week: 1,
    title: 'Hobilerin ve Boş Zamanın',
    targetSkill: 'Ne yapmaktan hoşlandığını anlatma ("I like / I enjoy")',
    speakingGoal: 'Say: In my free time, I like playing games and reading.',
    speakingGoalTr: 'Boş zamanlarında ne yapmayı sevdiğini söyle.',
    aiPrompt: 'What do you like doing in your free time?',
    aiPromptTr: 'Boş zamanlarında ne yapmayı seversin?',
    suggestedAnswer: 'I like reading books and playing basketball with my friends.',
    suggestedAnswerTr: 'Kitap okumayı ve arkadaşlarımla basketbol oynamayı severim.',
    xpReward: 60,
    keyVocabulary: ['free time', 'reading', 'playing', 'enjoy']
  },
  {
    day: 5,
    week: 1,
    title: 'Aileni Anlat',
    targetSkill: 'Aile üyelerinden bahsetme',
    speakingGoal: 'Say: I have a brother/sister. We are a family of four.',
    speakingGoalTr: 'Kaç kardeş olduğunuzu veya aileni söyle.',
    aiPrompt: 'Do you have any brothers or sisters?',
    aiPromptTr: 'Hiç erkek veya kız kardeşin var mı?',
    suggestedAnswer: 'Yes, I have one sister. She is very funny and cute.',
    suggestedAnswerTr: 'Evet, bir kız kardeşim var. Çok komik ve tatlıdır.',
    xpReward: 60,
    keyVocabulary: ['brother', 'sister', 'family', 'parents']
  },
  {
    day: 6,
    week: 1,
    title: 'Saat Kaçta Uyanırsın?',
    targetSkill: 'Günlük saatleri ve rutinleri söyleme',
    speakingGoal: 'Say: I wake up at 7 o\'clock and go to school.',
    speakingGoalTr: 'Sabah saat kaçta uyandığını söyle.',
    aiPrompt: 'What time do you usually wake up on school days?',
    aiPromptTr: 'Okul günlerinde genellikle saat kaçta uyanırsın?',
    suggestedAnswer: 'I wake up at seven o\'clock and have breakfast.',
    suggestedAnswerTr: 'Saat yedide uyanırım ve kahvaltı yaparım.',
    xpReward: 60,
    keyVocabulary: ['wake up', 'breakfast', 'o\'clock', 'morning']
  },
  {
    day: 7,
    week: 1,
    title: 'Hafta 1 Konuşma Mezuniyeti! 🎓',
    targetSkill: '1. Haftanın tüm kelimeleriyle 3 cümlelik tam konuşma',
    speakingGoal: 'Kendini, aileni ve sevdiğin şeyleri tek nefeste tanıt!',
    speakingGoalTr: 'Kendini baştan sona İngilizce tanıt.',
    aiPrompt: 'Awesome! Can you introduce yourself completely in three sentences?',
    aiPromptTr: 'Harikasın! Bana kendini 3 cümleyle baştan sona tanıtır mısın?',
    suggestedAnswer: 'Hello, my name is Deniz. I am twelve years old and I live in Ankara. My favorite hobby is drawing.',
    suggestedAnswerTr: "Merhaba, adım Deniz. 12 yaşındayım ve Ankara'da yaşıyorum. En sevdiğim hobim resim çizmektir.",
    xpReward: 100,
    keyVocabulary: ['introduce', 'hobby', 'student', 'champion']
  },

  // ==================== HAFTA 2: OKUL, ŞEHİR VE ÇEVRE (8-14) ====================
  {
    day: 8,
    week: 2,
    title: 'Okulunda Neler Var?',
    targetSkill: 'Okul bölümlerini tarif etme (library, canteen, sports hall)',
    speakingGoal: 'Say: There is a big library in my school.',
    speakingGoalTr: 'Okulundaki kütüphane veya kantini söyle.',
    aiPrompt: 'Tell me about your school! Is there a canteen or a library?',
    aiPromptTr: 'Bana okulunu anlat! Kantin veya kütüphane var mı?',
    suggestedAnswer: 'Yes, our school has a large library and a nice sports hall.',
    suggestedAnswerTr: 'Evet, okulumuzun büyük bir kütüphanesi ve güzel bir spor salonu var.',
    xpReward: 70,
    keyVocabulary: ['library', 'canteen', 'sports hall', 'classroom']
  },
  {
    day: 9,
    week: 2,
    title: 'Yol Tarifi İsteme & Verme',
    targetSkill: 'Yol tarif etme (Turn left, turn right, go straight)',
    speakingGoal: 'Say: Go straight and turn right.',
    speakingGoalTr: 'Birine dosdoğru gitmesini söyle.',
    aiPrompt: 'Excuse me! How can I go to the science lab?',
    aiPromptTr: 'Affedersiniz! Fen laboratuvarına nasıl gidebilirim?',
    suggestedAnswer: 'Go straight ahead and turn left. It is on the second floor.',
    suggestedAnswerTr: 'Dosdoğru gidin ve sola dönün. İkinci kattadır.',
    xpReward: 70,
    keyVocabulary: ['straight', 'turn left', 'turn right', 'floor']
  },
  {
    day: 10,
    week: 2,
    title: 'Sevdiğin ve Sevmediğin Yemekler',
    targetSkill: 'Yemek tercihleri (I like / I dislike / yummy / nutritious)',
    speakingGoal: 'Say: I like pizza, but I dislike broccoli.',
    speakingGoalTr: 'Hangi yiyeceği sevip hangisini sevmediğini söyle.',
    aiPrompt: 'What is your favorite food and what do you dislike eating?',
    aiPromptTr: 'En sevdiğin yemek ne ve neyi yemekten hoşlanmazsın?',
    suggestedAnswer: 'I love pasta and grilled meatballs, but I dislike fast food.',
    suggestedAnswerTr: 'Makarna ve ızgara köfteye bayılırım ama fast food sevmem.',
    xpReward: 70,
    keyVocabulary: ['pasta', 'meatballs', 'dislike', 'nutritious']
  },
  {
    day: 11,
    week: 2,
    title: 'Bugün Hava Nasıl?',
    targetSkill: 'Hava durumunu tarif etme (sunny, rainy, snowy, cold)',
    speakingGoal: 'Say: Today the weather is sunny and warm.',
    speakingGoalTr: 'Bugünkü hava durumunu İngilizce anlat.',
    aiPrompt: 'How is the weather in your city today?',
    aiPromptTr: 'Bugün senin şehrinde hava nasıl?',
    suggestedAnswer: 'The weather is sunny and warm today. Perfect for playing outside!',
    suggestedAnswerTr: 'Bugün hava güneşli ve ılık. Dışarıda oynamak için mükemmel!',
    xpReward: 70,
    keyVocabulary: ['sunny', 'warm', 'rainy', 'weather']
  },
  {
    day: 12,
    week: 2,
    title: 'Sevimli Hayvanlar',
    targetSkill: 'Hayvanları tanıtma ve sevdiğin hayvanı anlatma',
    speakingGoal: 'Say: My favorite animal is a dog because it is loyal.',
    speakingGoalTr: 'En sevdiğin hayvanı ve nedenini söyle.',
    aiPrompt: 'Do you have a pet or what is your favorite animal?',
    aiPromptTr: 'Evcil hayvanın var mı veya en sevdiğin hayvan hangisi?',
    suggestedAnswer: 'My favorite animal is a cat. They are very playful and soft.',
    suggestedAnswerTr: 'En sevdiğim hayvan kedi. Çok oyuncu ve yumuşacıklar.',
    xpReward: 70,
    keyVocabulary: ['cat', 'dog', 'playful', 'pet']
  },
  {
    day: 13,
    week: 2,
    title: 'Spor ve Yeteneklerin',
    targetSkill: 'Neler yapabildiğini söyleme ("I can play...", "I can swim")',
    speakingGoal: 'Say: I can swim and play football very well.',
    speakingGoalTr: 'Hangi sporda iyi olduğunu söyle.',
    aiPrompt: 'Which sports can you play well?',
    aiPromptTr: 'Hangi sporları iyi oynayabilirsin?',
    suggestedAnswer: 'I can play volleyball and table tennis very well.',
    suggestedAnswerTr: 'Voleybol ve masa tenisini çok iyi oynayabilirim.',
    xpReward: 75,
    keyVocabulary: ['can', 'volleyball', 'table tennis', 'well']
  },
  {
    day: 14,
    week: 2,
    title: '2. Hafta Mezuniyet Röportajı! 🌟',
    targetSkill: 'Haftalık kazanımları birleştirip okulunu ve gününü anlatma',
    speakingGoal: 'Okulunu, sevdiğin dersi ve sporu akıcı bir şekilde anlat!',
    speakingGoalTr: 'Okulun ve hobilerin hakkında kısa bir konuşma yap.',
    aiPrompt: 'You are halfway there! Tell me about your school and your favorite sport!',
    aiPromptTr: 'Yolun yarısına geldin! Bana okulunu ve en sevdiğin sporu anlat!',
    suggestedAnswer: 'My school is very modern. I have great friends and I love playing football after school.',
    suggestedAnswerTr: 'Okulum çok modern. Harika arkadaşlarım var ve okuldan sonra futbol oynamayı çok severim.',
    xpReward: 120,
    keyVocabulary: ['modern', 'friends', 'after school', 'superstar']
  },

  // ==================== HAFTA 3: SOSYAL HAYAT & İLETİŞİM (15-21) ====================
  {
    day: 15,
    week: 3,
    title: 'Kafede / Markette Sipariş Verme',
    targetSkill: 'Kibarca bir şey isteme ("Can I have...?")',
    speakingGoal: 'Say: Can I have a glass of apple juice, please?',
    speakingGoalTr: 'Kafede kibarca elma suyu iste.',
    aiPrompt: 'Welcome to the school cafe! What would you like to drink?',
    aiPromptTr: 'Okul kafesine hoş geldin! Ne içmek istersin?',
    suggestedAnswer: 'Can I have an orange juice and a sandwich, please?',
    suggestedAnswerTr: 'Bir portakal suyu ve bir sandviç alabilir miyim lütfen?',
    xpReward: 80,
    keyVocabulary: ['can I have', 'please', 'orange juice', 'sandwich']
  },
  {
    day: 16,
    week: 3,
    title: 'Sağlık ve Doktorda İfade',
    targetSkill: 'Şikayetleri dile getirme (headache, cough, cold)',
    speakingGoal: 'Say: I have a headache and I need to rest.',
    speakingGoalTr: 'Başının ağrıdığını ve dinlenmen gerektiğini söyle.',
    aiPrompt: 'Are you feeling okay today? What is the matter?',
    aiPromptTr: 'Bugün iyi hissediyor musun? Neyin var?',
    suggestedAnswer: 'I have a sore throat and a slight fever, so I need to rest.',
    suggestedAnswerTr: 'Boğazım ağrıyor ve hafif ateşim var, bu yüzden dinlenmeliyim.',
    xpReward: 80,
    keyVocabulary: ['headache', 'sore throat', 'fever', 'rest']
  },
  {
    day: 17,
    week: 3,
    title: 'Dün Ne Yaptın? (Geçmiş Zaman)',
    targetSkill: 'Geçmişte yapılanları anlatma (went, studied, played)',
    speakingGoal: 'Say: Yesterday I studied English and watched TV.',
    speakingGoalTr: 'Dün neler yaptığını İngilizce söyle.',
    aiPrompt: 'What did you do yesterday afternoon?',
    aiPromptTr: 'Dün öğleden sonra ne yaptın?',
    suggestedAnswer: 'Yesterday I finished my homework and played online games with my friends.',
    suggestedAnswerTr: 'Dün ödevlerimi bitirdim ve arkadaşlarımla internetten oyun oynadım.',
    xpReward: 85,
    keyVocabulary: ['yesterday', 'finished', 'homework', 'played']
  },
  {
    day: 18,
    week: 3,
    title: 'Hafta Sonu Planları (Gelecek Zaman)',
    targetSkill: 'Planları anlatma ("I am going to...")',
    speakingGoal: 'Say: This weekend, I am going to visit my grandparents.',
    speakingGoalTr: 'Hafta sonu ne yapacağını söyle.',
    aiPrompt: 'What are you going to do this weekend?',
    aiPromptTr: 'Bu hafta sonu ne yapacaksın?',
    suggestedAnswer: 'I am going to ride my bicycle in the park and read a new book.',
    suggestedAnswerTr: 'Parkta bisiklete bineceğim ve yeni bir kitap okuyacağım.',
    xpReward: 85,
    keyVocabulary: ['going to', 'weekend', 'park', 'bicycle']
  },
  {
    day: 19,
    week: 3,
    title: 'Müzik ve Sinema Zevkin',
    targetSkill: 'Tercih belirtme (prefer, exciting, comedy)',
    speakingGoal: 'Say: I prefer watching comedies to action movies.',
    speakingGoalTr: 'Komedi filmlerini aksiyona tercih ettiğini söyle.',
    aiPrompt: 'What kind of movies do you enjoy watching?',
    aiPromptTr: 'Ne tür filmler izlemekten keyif alırsın?',
    suggestedAnswer: 'I love animation and adventure movies because they are very creative.',
    suggestedAnswerTr: 'Animasyon ve macera filmlerini severim çünkü çok yaratıcılar.',
    xpReward: 85,
    keyVocabulary: ['prefer', 'animation', 'adventure', 'creative']
  },
  {
    day: 20,
    week: 3,
    title: 'Güvenli İnternet ve Teknoloji',
    targetSkill: 'İnternet kullanımını anlatma (social media, search, online)',
    speakingGoal: 'Say: I use Chirmo to search the web and learn English.',
    speakingGoalTr: 'Chirmo ile internette arama yapıp İngilizce öğrendiğini söyle.',
    aiPrompt: 'How does the internet help you in your daily life?',
    aiPromptTr: 'İnternet günlük hayatında sana nasıl yardımcı oluyor?',
    suggestedAnswer: 'I use the internet to do research for my projects and practice English.',
    suggestedAnswerTr: 'İnterneti projelerim için araştırma yapmak ve İngilizce pratik yapmak için kullanırım.',
    xpReward: 85,
    keyVocabulary: ['research', 'practice', 'projects', 'safe']
  },
  {
    day: 21,
    week: 3,
    title: '3. Hafta Sosyal Sohbet Mezuniyeti! 🚀',
    targetSkill: 'Kendini ve planlarını akıcı şekilde tartışabilme',
    speakingGoal: 'Haftalık öğrendiklerinle Chirmo\'ya bir soru sor!',
    speakingGoalTr: 'Yapay zekâ arkadaşına kendin hakkında soru sorarak sohbet et.',
    aiPrompt: 'You speak English so naturally now! Tell me your biggest dream for the future!',
    aiPromptTr: 'Artık çok doğal İngilizce konuşuyorsun! Bana gelecekle ilgili en büyük hayalini anlat!',
    suggestedAnswer: 'My dream is to travel the world, visit London and speak fluent English with everyone.',
    suggestedAnswerTr: 'Hayalim dünyayı gezmek, Londra\'yı ziyaret etmek ve herkesle akıcı İngilizce konuşmaktır.',
    xpReward: 140,
    keyVocabulary: ['dream', 'travel', 'fluent', 'world']
  },

  // ==================== HAFTA 4: LGS ŞAMPİYONLUĞU & AKICI KONUŞMA (22-30) ====================
  {
    day: 22,
    week: 4,
    title: 'LGS Şampiyonu: Davet Etme & Kabul Etme',
    targetSkill: 'LGS Friendship ünitesi davet kalıbı (Would you like to...?)',
    speakingGoal: 'Say: Would you like to join our study group?',
    speakingGoalTr: 'Arkadaşını çalışma grubuna davet et.',
    aiPrompt: 'Would you like to come over to my house after school?',
    aiPromptTr: 'Okuldan sonra bize gelmek ister misin?',
    suggestedAnswer: 'That sounds great, I would love to! Thank you for inviting me.',
    suggestedAnswerTr: 'Kulağa harika geliyor, çok isterim! Beni davet ettiğin için teşekkürler.',
    xpReward: 90,
    keyVocabulary: ['would you like', 'sounds great', 'accept', 'invitation']
  },
  {
    day: 23,
    week: 4,
    title: 'LGS Şampiyonu: Kibarca Reddetme & Bahane',
    targetSkill: 'LGS sınavında en çok çıkan: Bahane bildirerek reddetme',
    speakingGoal: 'Say: I would love to, but I have to study for the exam.',
    speakingGoalTr: 'Daveti kibarca reddedip LGS sınavına çalışacağını söyle.',
    aiPrompt: 'Hey! We are going to the cinema this evening. Can you come?',
    aiPromptTr: 'Selam! Bu akşam sinemaya gidiyoruz. Gelebilir misin?',
    suggestedAnswer: 'I would love to, but I have an important test tomorrow. Maybe next time!',
    suggestedAnswerTr: 'Çok isterdim ama yarın önemli bir sınavım var. Belki bir dahaki sefere!',
    xpReward: 95,
    keyVocabulary: ['would love to but', 'important', 'test', 'next time']
  },
  {
    day: 24,
    week: 4,
    title: 'LGS 2. Ünite: Teen Life & Müzik Zevki',
    targetSkill: 'Kişisel zevkleri ve sıfatları kullanma (unbearable, fond of)',
    speakingGoal: 'Say: I am fond of pop music, but rap is unbearable for me.',
    speakingGoalTr: 'Hangi müziğe düşkün olduğunu, hangisine katlanamadığını söyle.',
    aiPrompt: 'What kind of music are you fond of listening to?',
    aiPromptTr: 'Hangi tür müzik dinlemeye düşkünsün?',
    suggestedAnswer: 'I am fond of acoustic guitar melodies. Heavy metal is unbearable for me.',
    suggestedAnswerTr: 'Akustik gitar melodilerine bayılırım. Heavy metal benim için katlanılmaz.',
    xpReward: 95,
    keyVocabulary: ['fond of', 'unbearable', 'melodies', 'prefer']
  },
  {
    day: 25,
    week: 4,
    title: 'LGS 3. Ünite: In The Kitchen - Tarif Verme',
    targetSkill: 'Süreç bildiren bağlaçlar (First, then, next, after that, finally)',
    speakingGoal: 'Say: First chop the tomatoes, then fry them.',
    speakingGoalTr: 'Sıralama zarflarını kullanarak tarif ver.',
    aiPrompt: 'Can you teach me how to prepare a healthy salad?',
    aiPromptTr: 'Bana sağlıklı bir salatanın nasıl hazırlanacağını öğretir misin?',
    suggestedAnswer: 'First wash the greens. Next chop them into a bowl. Finally add lemon juice and olive oil.',
    suggestedAnswerTr: 'Önce yeşillikleri yıkayın. Sonra bir kaseye doğrayın. Son olarak limon suyu ve zeytinyağı ekleyin.',
    xpReward: 100,
    keyVocabulary: ['first', 'next', 'finally', 'chop', 'olive oil']
  },
  {
    day: 26,
    week: 4,
    title: 'LGS 4. Ünite: On The Phone - Telefon Görüşmesi',
    targetSkill: 'Telefonda resmi ve kibar kalıplar (Hang on, hold on, speak to)',
    speakingGoal: 'Say: Hold on a minute, please. I will put you through.',
    speakingGoalTr: 'Hatta beklemesini ve bağlayacağını söyle.',
    aiPrompt: 'Hello! This is Mrs. Brown. May I speak to your teacher, please?',
    aiPromptTr: 'Merhaba! Ben Bayan Brown. Öğretmeninizle görüşebilir miyim lütfen?',
    suggestedAnswer: 'Hello Mrs. Brown! Hang on a minute, please. I will get him right now.',
    suggestedAnswerTr: 'Merhaba Bayan Brown! Bir dakika hatta kalın lütfen. Hemen kendisini çağırıyorum.',
    xpReward: 100,
    keyVocabulary: ['hang on', 'hold on', 'put through', 'minute']
  },
  {
    day: 27,
    week: 4,
    title: 'LGS 5. Ünite: The Internet - Siber Güvenlik',
    targetSkill: 'İnternet kuralları ve tavsiyeler (Never share, password, safe)',
    speakingGoal: 'Say: Never share your passwords with strangers online.',
    speakingGoalTr: 'Şifrelerin yabancılarla paylaşılmaması gerektiğini söyle.',
    aiPrompt: 'What should we do to stay safe on the internet?',
    aiPromptTr: 'İnternette güvende kalmak için ne yapmalıyız?',
    suggestedAnswer: 'We should create strong passwords and never share personal information with strangers.',
    suggestedAnswerTr: 'Güçlü şifreler oluşturmalı ve kişisel bilgileri yabancılarla asla paylaşmamalıyız.',
    xpReward: 105,
    keyVocabulary: ['password', 'strangers', 'safe', 'personal']
  },
  {
    day: 28,
    week: 4,
    title: 'LGS 6. Ünite: Adventures - Macera & Heyecan',
    targetSkill: 'Karşılaştırma (more thrilling than, fascinating, extreme)',
    speakingGoal: 'Say: Rafting is more exciting than cycling.',
    speakingGoalTr: 'Macera sporlarını karşılaştır.',
    aiPrompt: 'Which extreme sport would you dare to try?',
    aiPromptTr: 'Hangi ekstrem sporu denemeye cesaret ederdin?',
    suggestedAnswer: 'I would like to try paragliding because flying over the mountains looks fascinating.',
    suggestedAnswerTr: 'Yamaç paraşütünü denemek isterim çünkü dağların üzerinde uçmak büyüleyici görünüyor.',
    xpReward: 110,
    keyVocabulary: ['paragliding', 'fascinating', 'extreme', 'thrilling']
  },
  {
    day: 29,
    week: 4,
    title: 'LGS 7. & 8. Ünite: Sorumluluklarım & Turizm',
    targetSkill: 'Ev işleri ve turistik yerler (responsible for, tidying, ancient)',
    speakingGoal: 'Say: I am responsible for tidying my room every morning.',
    speakingGoalTr: 'Evdeki sorumluluğunu ve odanı topladığını söyle.',
    aiPrompt: 'What are your daily responsibilities at home?',
    aiPromptTr: 'Evdeki günlük sorumlulukların nelerdir?',
    suggestedAnswer: 'I am responsible for making my bed, feeding my pet, and keeping my desk clean.',
    suggestedAnswerTr: 'Yatağımı toplamak, evcil hayvanımı beslemek ve çalışma masamı temiz tutmaktan sorumluyum.',
    xpReward: 115,
    keyVocabulary: ['responsible', 'tidying', 'desk', 'clean']
  },
  {
    day: 30,
    week: 4,
    title: 'Büyük Final: 1 Aylık Konuşma Şampiyonluğu! 🏆',
    targetSkill: 'İngilizceyi korkusuzca, akıcı konuşabilme!',
    speakingGoal: 'Artık İngilizce konuşabiliyorsun! Hayallerini anlat.',
    speakingGoalTr: 'Gelecekte ne olmak istediğini ve İngilizce başarını kutla!',
    aiPrompt: 'Congratulations! You completed the 30-day challenge! How do you feel about speaking English now?',
    aiPromptTr: 'Tebrikler! 30 günlük kampı tamamladın! Artık İngilizce konuşurken nasıl hissediyorsun?',
    suggestedAnswer: 'I feel very confident and proud! I can speak English easily now.',
    suggestedAnswerTr: 'Çok özgüvenli ve gururlu hissediyorum! Artık İngilizceyi kolayca konuşabiliyorum.',
    xpReward: 200,
    keyVocabulary: ['confident', 'proud', 'easily', 'champion']
  }
];

export interface StudentCampProgress {
  currentDay: number;
  completedDays: number[];
  totalXp: number;
  streakDays: number;
  selectedGrade: GradeLevel;
  lastCompletedDate?: string;
}

const STORAGE_KEY = 'chirmo_student_camp_v1';

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
      totalXp: 120,
      streakDays: 3,
      selectedGrade: '8' // Varsayılan 8. Sınıf LGS hazırlığı
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
      totalXp: current.totalXp + (wasAlreadyCompleted ? 15 : earnedXp),
      streakDays: streak,
      currentDay: Math.min(30, Math.max(current.currentDay, day + 1)),
      lastCompletedDate: todayStr
    };

    this.saveProgress(updated);
    return updated;
  },

  setSelectedGrade(grade: GradeLevel): StudentCampProgress {
    const current = this.getProgress();
    const updated = { ...current, selectedGrade: grade };
    this.saveProgress(updated);
    return updated;
  }
};
