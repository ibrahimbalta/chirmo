import { SupportedLanguage, TargetLanguageService } from './targetLanguageService';
import { FirestoreService } from './firestoreService';
import { PrivacyAuthService, UserAccount } from './privacyAuthService';
import { LearningStorageService } from './learningStorage';

export type LeagueTierId = 'bronze' | 'silver' | 'gold' | 'diamond' | 'champions';

export interface LeagueTier {
  id: LeagueTierId;
  name: string;
  icon: string;
  minXP: number;
  maxXP: number;
  badgeColor: string;
  promotionThreshold: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  countryFlag: string;
  xp: number;
  isUser: boolean;
  isRealUser?: boolean;
  level?: string;
  status: 'promote' | 'stay' | 'demote';
}

export interface DuelOpponent {
  id: string;
  name: string;
  city: string;
  countryFlag: string;
  avatar: string;
  skillRating: number;
  badge: string;
  specialtyTr: string;
  isRealUser?: boolean;
  xp?: number;
  level?: string;
}

export interface QuickDuelReply {
  level: string;
  text: string;
  tr: string;
}

export interface DuelRound {
  roundNumber: number;
  topic: string;
  prompt: string;
  promptTr: string;
  timeLimitSeconds: number;
  suggestedKeyword: string;
  opponentSampleAnswer: string;
  opponentSampleAnswerTr: string;
  quickReplies: QuickDuelReply[];
}

export interface DuelRoundResult {
  roundNumber: number;
  userScore: number;
  opponentScore: number;
  fluencyScore: number;
  vocabScore: number;
  speedBonus: number;
  winner: 'user' | 'opponent' | 'tie';
  feedback: string;
  feedbackTr: string;
}

export const LEAGUE_TIERS: LeagueTier[] = [
  {
    id: 'bronze',
    name: 'Bronz Lig',
    icon: '🥉',
    minXP: 0,
    maxXP: 249,
    badgeColor: 'from-amber-700 to-amber-900',
    promotionThreshold: 250
  },
  {
    id: 'silver',
    name: 'Gümüş Lig',
    icon: '🥈',
    minXP: 250,
    maxXP: 599,
    badgeColor: 'from-slate-400 to-slate-600',
    promotionThreshold: 600
  },
  {
    id: 'gold',
    name: 'Altın Lig',
    icon: '🥇',
    minXP: 600,
    maxXP: 1199,
    badgeColor: 'from-yellow-400 to-amber-600',
    promotionThreshold: 1200
  },
  {
    id: 'diamond',
    name: 'Elmas Lig',
    icon: '💎',
    minXP: 1200,
    maxXP: 2499,
    badgeColor: 'from-cyan-400 to-blue-600',
    promotionThreshold: 2500
  },
  {
    id: 'champions',
    name: 'Şampiyonlar Ligi',
    icon: '👑',
    minXP: 2500,
    maxXP: Infinity,
    badgeColor: 'from-purple-500 via-pink-500 to-amber-400',
    promotionThreshold: Infinity
  }
];

export const DUEL_ROUNDS_EN: DuelRound[] = [
  {
    roundNumber: 1,
    topic: '1. Raund • Hızlı Fikir (Quick Opinion)',
    prompt: 'Do you prefer working remotely from home or at an office, and what is your top reason?',
    promptTr: 'Evden uzaktan çalışmayı mı yoksa ofiste çalışmayı mı tercih edersin, en önemli sebebin nedir?',
    timeLimitSeconds: 25,
    suggestedKeyword: 'flexibility',
    opponentSampleAnswer: 'I prefer working from home because it saves commuting time and gives me flexibility.',
    opponentSampleAnswerTr: 'Evden çalışmayı tercih ederim çünkü yol süresinden tasarruf sağlıyor ve bana esneklik veriyor.',
    quickReplies: [
      {
        level: 'Kolay (A1-A2)',
        text: 'I prefer working from home because it is very comfortable and quiet.',
        tr: 'Evden çalışmayı tercih ederim çünkü çok rahat ve sessiz.'
      },
      {
        level: 'Orta (B1)',
        text: 'I prefer remote work because flexibility helps me focus better every day.',
        tr: 'Uzaktan çalışmayı tercih ederim çünkü esneklik her gün daha iyi odaklanmama yardımcı oluyor.'
      },
      {
        level: 'İleri (B2-C1)',
        text: 'Ideally, I prefer a hybrid model that combines home flexibility with office collaboration.',
        tr: 'İdeal olarak, ev esnekliğini ofis iş birliğiyle birleştiren hibrit bir modeli tercih ederim.'
      }
    ]
  },
  {
    roundNumber: 2,
    topic: '2. Raund • Seyahat & Hayal Gücü (Travel & Vision)',
    prompt: 'If you could travel anywhere in the world tomorrow for free, where would you go and why?',
    promptTr: 'Yarın dünyanın herhangi bir yerine ücretsiz seyahat edebilseydin nereye giderdin ve neden?',
    timeLimitSeconds: 25,
    suggestedKeyword: 'explore',
    opponentSampleAnswer: 'I would fly to Tokyo tomorrow to explore the culture and try authentic sushi.',
    opponentSampleAnswerTr: 'Kültürü keşfetmek ve gerçek suşi denemek için yarın Tokyo’ya uçardım.',
    quickReplies: [
      {
        level: 'Kolay (A1-A2)',
        text: 'I would go to Italy to see Rome and eat delicious pizza.',
        tr: 'Roma’yı görmek ve lezzetli pizza yemek için İtalya’ya giderdim.'
      },
      {
        level: 'Orta (B1)',
        text: 'I would travel to London to explore historical places and practice my English.',
        tr: 'Tarihi yerleri keşfetmek ve İngilizcemi pratik yapmak için Londra’ya seyahat ederdim.'
      },
      {
        level: 'İleri (B2-C1)',
        text: 'I would definitely choose Japan to explore how ancient traditions blend with modern technology.',
        tr: 'Kadim geleneklerin modern teknolojiyle nasıl harmanlandığını keşfetmek için kesinlikle Japonya’yı seçerdim.'
      }
    ]
  },
  {
    roundNumber: 3,
    topic: '3. Raund • Hızlı İkna (Fast Persuasion)',
    prompt: 'How would you convince your best friend to practice speaking a new language for 15 minutes every day?',
    promptTr: 'En yakın arkadaşını her gün 15 dakika yabancı dil konuşma pratiği yapmaya nasıl ikna edersin?',
    timeLimitSeconds: 25,
    suggestedKeyword: 'practice',
    opponentSampleAnswer: 'Just 15 minutes of daily practice builds real confidence and opens global career doors!',
    opponentSampleAnswerTr: 'Günde sadece 15 dakikalık pratik gerçek özgüven inşa eder ve küresel kariyer kapılarını açar!',
    quickReplies: [
      {
        level: 'Kolay (A1-A2)',
        text: 'Fifteen minutes a day is very easy and we can practice speaking together!',
        tr: 'Günde on beş dakika çok kolay ve birlikte konuşma pratiği yapabiliriz!'
      },
      {
        level: 'Orta (B1)',
        text: 'Daily practice for just 15 minutes removes speaking fear and makes you fluent.',
        tr: 'Günde sadece 15 dakika pratik yapmak konuşma korkusunu yok eder ve seni akıcı yapar.'
      },
      {
        level: 'İleri (B2-C1)',
        text: 'Consistent 15-minute daily practice rewires your brain for natural fluency without exhausting you.',
        tr: 'Düzenli 15 dakikalık günlük pratik, seni yormadan beynini doğal akıcılık için yeniden programlar.'
      }
    ]
  }
];

export const DUEL_ROUNDS_DE: DuelRound[] = [
  {
    roundNumber: 1,
    topic: '1. Raund • Hızlı Fikir (Schnelle Meinung)',
    prompt: 'Arbeitest du lieber von zu Hause aus oder im Büro, und was ist dein wichtigster Grund?',
    promptTr: 'Evden çalışmayı mı yoksa ofiste çalışmayı mı tercih edersin, en önemli sebebin nedir?',
    timeLimitSeconds: 25,
    suggestedKeyword: 'Flexibilität',
    opponentSampleAnswer: 'Ich arbeite lieber im Homeoffice, weil mir die Flexibilität viel Zeit spart.',
    opponentSampleAnswerTr: 'Homeoffice çalışmayı tercih ederim çünkü esneklik bana çok zaman kazandırıyor.',
    quickReplies: [
      {
        level: 'Kolay (A1-A2)',
        text: 'Ich arbeite lieber zu Hause, weil es sehr ruhig und bequem ist.',
        tr: 'Evde çalışmayı tercih ederim çünkü çok sakin ve rahat.'
      },
      {
        level: 'Orta (B1)',
        text: 'Ich bevorzuge das Homeoffice, weil mir die Flexibilität hilft, mich besser zu konzentrieren.',
        tr: 'Evden çalışmayı tercih ederim çünkü esneklik daha iyi odaklanmama yardımcı oluyor.'
      },
      {
        level: 'İleri (B2-C1)',
        text: 'Idealerweise bevorzuge ich ein hybrides Modell, das Flexibilität und Teamarbeit verbindet.',
        tr: 'İdeal olarak esneklik ile ekip çalışmasını birleştiren hibrit bir modeli tercih ederim.'
      }
    ]
  },
  {
    roundNumber: 2,
    topic: '2. Raund • Seyahat & Hayal Gücü (Reise & Fantasie)',
    prompt: 'Wenn du morgen kostenlos irgendwohin auf der Welt reisen könntest, wohin würdest du fliegen?',
    promptTr: 'Yarın dünyanın herhangi bir yerine ücretsiz seyahat edebilseydin nereye uçardın?',
    timeLimitSeconds: 25,
    suggestedKeyword: 'entdecken',
    opponentSampleAnswer: 'Ich würde morgen nach Berlin fliegen, um die Geschichte und Kultur zu entdecken.',
    opponentSampleAnswerTr: 'Tarihi ve kültürü keşfetmek için yarın Berlin’e uçardım.',
    quickReplies: [
      {
        level: 'Kolay (A1-A2)',
        text: 'Ich würde nach Wien reisen, um schöne Museen zu sehen und Kaffee zu trinken.',
        tr: 'Güzel müzeleri görmek ve kahve içmek için Viyana’ya seyahat ederdim.'
      },
      {
        level: 'Orta (B1)',
        text: 'Ich würde nach München fliegen, um neue Orte zu entdecken und mein Deutsch zu üben.',
        tr: 'Yeni yerler keşfetmek ve Almancamı pratik yapmak için Münih’e uçardım.'
      },
      {
        level: 'İleri (B2-C1)',
        text: 'Ich würde definitiv die Schweiz wählen, um die beeindruckende Natur in den Alpen zu entdecken.',
        tr: 'Alplerdeki etkileyici doğayı keşfetmek için kesinlikle İsviçre’yi seçerdim.'
      }
    ]
  },
  {
    roundNumber: 3,
    topic: '3. Raund • Hızlı İkna (Schnelle Überzeugung)',
    prompt: 'Wie würdest du deinen besten Freund überzeugen, jeden Tag 15 Minuten Deutsch zu sprechen?',
    promptTr: 'En yakın arkadaşını her gün 15 dakika Almanca konuşmaya nasıl ikna edersin?',
    timeLimitSeconds: 25,
    suggestedKeyword: 'Übung',
    opponentSampleAnswer: 'Nur 15 Minuten tägliche Übung reichen aus, um ohne Angst flüssig zu sprechen!',
    opponentSampleAnswerTr: 'Korkmadan akıcı konuşmak için günde sadece 15 dakika pratik yeterlidir!',
    quickReplies: [
      {
        level: 'Kolay (A1-A2)',
        text: 'Fünfzehn Minuten pro Tag sind einfach und wir können zusammen üben!',
        tr: 'Günde on beş dakika çok kolay ve birlikte pratik yapabiliriz!'
      },
      {
        level: 'Orta (B1)',
        text: 'Tägliche Übung für 15 Minuten nimmt die Angst und macht dich schnell sicher.',
        tr: 'Günde 15 dakika pratik korkuyu alır ve seni hızla özgüvenli yapar.'
      },
      {
        level: 'İleri (B2-C1)',
        text: 'Durch regelmäßige Übung von nur 15 Minuten entwickelt man natürliche Sprachreflexe.',
        tr: 'Sadece 15 dakikalık düzenli pratikle doğal konuşma refleksleri gelişir.'
      }
    ]
  }
];

export const DUEL_ROUNDS = DUEL_ROUNDS_EN;

export const OPPONENT_POOL: DuelOpponent[] = [
  {
    id: 'opp_4',
    name: 'Marco Rossi',
    city: 'Milano',
    countryFlag: '🇮🇹',
    avatar: '🧑‍🎨',
    skillRating: 74,
    badge: 'AI Partner • Başlangıç',
    specialtyTr: 'Kültür & Sosyal Sohbet',
    isRealUser: false
  },
  {
    id: 'opp_1',
    name: 'Liam Smith',
    city: 'Londra',
    countryFlag: '🇬🇧',
    avatar: '👨‍💼',
    skillRating: 78,
    badge: 'AI Partner • Orta',
    specialtyTr: 'Günlük & İş Diyalogları',
    isRealUser: false
  },
  {
    id: 'opp_3',
    name: 'Lukas Weber',
    city: 'Berlin',
    countryFlag: '🇩🇪',
    avatar: '🧑‍🏫',
    skillRating: 79,
    badge: 'AI Partner • Kalıp',
    specialtyTr: 'Almanca & İngilizce Pratik',
    isRealUser: false
  },
  {
    id: 'opp_5',
    name: 'Kenji Tanaka',
    city: 'Tokyo',
    countryFlag: '🇯🇵',
    avatar: '👨‍🔬',
    skillRating: 80,
    badge: 'AI Partner • İleri',
    specialtyTr: 'Hızlı Cevap & Telaffuz',
    isRealUser: false
  },
  {
    id: 'opp_2',
    name: 'Sarah Miller',
    city: 'New York',
    countryFlag: '🇺🇸',
    avatar: '👩‍💻',
    skillRating: 82,
    badge: 'AI Partner • Uzman',
    specialtyTr: 'Teknoloji & Seyahat',
    isRealUser: false
  }
];

function mapUserAccountToOpponent(acc: UserAccount): DuelOpponent {
  const synced = acc.syncedData || {};
  const profile = synced.profile || {};
  const progress = synced.learningProgress || {};
  const level: string = profile.level || progress.currentLevel || 'B1';
  const xp: number = typeof progress.xp === 'number' ? progress.xp : 480;
  const avatar = profile.avatarEmoji || (acc.plan === 'lifetime' ? '👑' : acc.plan === 'pro' ? '🚀' : '🎓');

  const levelToSkill: Record<string, number> = {
    A1: 72,
    A2: 75,
    B1: 79,
    B2: 83,
    C1: 87
  };

  return {
    id: `real_${acc.username}`,
    name: acc.username,
    city: `Seviye ${level}`,
    countryFlag: '🟢',
    avatar,
    skillRating: levelToSkill[level] || 78,
    badge: acc.plan === 'lifetime' ? 'VIP Oyuncu' : acc.plan === 'pro' ? 'Pro Oyuncu' : 'Kayıtlı Öğrenci',
    specialtyTr: `${xp} XP • Gerçek Chirmo Kullanıcısı`,
    isRealUser: true,
    xp,
    level
  };
}

export class SpeakingDuelService {
  public static getLeagueTier(xp: number): LeagueTier {
    for (const tier of LEAGUE_TIERS) {
      if (xp >= tier.minXP && (xp <= tier.maxXP || tier.maxXP === Infinity)) {
        return tier;
      }
    }
    return LEAGUE_TIERS[0];
  }

  public static getWeeklyLeaderboard(userXP: number, realUsers: DuelOpponent[] = []): LeaderboardEntry[] {
    const tier = SpeakingDuelService.getLeagueTier(userXP);
    const base = tier.minXP;
    const diff = tier.maxXP === Infinity ? 1000 : tier.maxXP - tier.minXP;
    const currentSession = PrivacyAuthService.getCurrentUser();
    const currentUsername = currentSession?.username || 'Sen (Oyuncu)';

    const botProfiles = [
      { name: 'Sarah Miller', flag: '🇺🇸', avatar: '👩‍💻' },
      { name: 'Kenji Tanaka', flag: '🇯🇵', avatar: '👨‍🔬' },
      { name: 'Lukas Weber', flag: '🇩🇪', avatar: '🧑‍🏫' },
      { name: 'Elena Petrov', flag: '🇨🇿', avatar: '👩‍🏫' },
      { name: 'Liam Smith', flag: '🇬🇧', avatar: '👨‍💼' },
      { name: 'Marco Rossi', flag: '🇮🇹', avatar: '🧑‍🎨' },
      { name: 'Sofia Garcia', flag: '🇪🇸', avatar: '👩‍🎨' },
      { name: 'Lucas Martin', flag: '🇫🇷', avatar: '👨‍🍳' },
      { name: 'Hanna Müller', flag: '🇦🇹', avatar: '👩‍⚕️' }
    ];

    const entries: Array<{
      name: string;
      avatar: string;
      countryFlag: string;
      xp: number;
      isUser: boolean;
      isRealUser?: boolean;
      level?: string;
    }> = botProfiles.map((bot, index) => {
      const factor = (9 - index) / 10;
      const botXP = Math.round(base + diff * factor * 0.92);
      return {
        name: bot.name,
        avatar: bot.avatar,
        countryFlag: bot.flag,
        xp: botXP,
        isUser: false,
        isRealUser: false
      };
    });

    // Gerçek kayıtlı kullanıcıları liderlik tablosuna ekle
    for (const ru of realUsers) {
      if (currentSession && ru.name.toLowerCase() === currentSession.username.toLowerCase()) {
        continue;
      }
      entries.push({
        name: ru.name,
        avatar: ru.avatar,
        countryFlag: '🟢',
        xp: ru.xp ?? 480,
        isUser: false,
        isRealUser: true,
        level: ru.level || 'B1'
      });
    }

    // Mevcut kullanıcıyı ekle
    entries.push({
      name: currentSession ? `${currentUsername} (Sen)` : 'Sen (Oyuncu)',
      avatar: '🌟',
      countryFlag: '🏆',
      xp: userXP,
      isUser: true,
      isRealUser: true
    });

    entries.sort((a, b) => b.xp - a.xp);

    return entries.slice(0, 10).map((entry, idx) => {
      const rank = idx + 1;
      let status: 'promote' | 'stay' | 'demote' = 'stay';
      if (rank <= 3) status = 'promote';
      else if (rank >= 9) status = 'demote';

      return {
        rank,
        ...entry,
        status
      };
    });
  }

  /**
   * Firebase Firestore ve yerel kayıtlı hesaplardan gerçek Chirmo kullanıcılarını çeker
   */
  public static async fetchRealOpponents(): Promise<DuelOpponent[]> {
    const currentSession = PrivacyAuthService.getCurrentUser();
    const map = new Map<string, DuelOpponent>();

    try {
      const cloudUsers = await FirestoreService.getPublicUsers();
      for (const acc of cloudUsers) {
        if (!acc.username) continue;
        if (currentSession && acc.username.toLowerCase() === currentSession.username.toLowerCase()) {
          continue;
        }
        map.set(acc.username.toLowerCase(), mapUserAccountToOpponent(acc));
      }
    } catch {}

    // Yerel tarayıcıdaki kayıtlı hesapları da dahil et
    try {
      const raw = localStorage.getItem('chirmo_saas_accounts_v1');
      if (raw) {
        const localAccounts: Record<string, UserAccount> = JSON.parse(raw);
        for (const acc of Object.values(localAccounts)) {
          if (!acc.username) continue;
          if (currentSession && acc.username.toLowerCase() === currentSession.username.toLowerCase()) {
            continue;
          }
          if (!map.has(acc.username.toLowerCase())) {
            map.set(acc.username.toLowerCase(), mapUserAccountToOpponent(acc));
          }
        }
      }
    } catch {}

    return Array.from(map.values()).sort((a, b) => (b.xp || 0) - (a.xp || 0));
  }

  /**
   * Kullanıcının kazandığı düello puanını hem yerel ilerlemeye hem de Firebase Firestore bulutuna yazar
   */
  public static async syncDuelVictoryToCloud(addedXP: number): Promise<number> {
    const progress = LearningStorageService.addXP(addedXP);
    const updatedXP = progress.xp;

    try {
      const currentSession = PrivacyAuthService.getCurrentUser();
      if (currentSession?.username) {
        const cloudUser = await FirestoreService.getUser(currentSession.username);
        if (cloudUser) {
          const syncedData = cloudUser.syncedData || {};
          syncedData.learningProgress = {
            ...(syncedData.learningProgress || {}),
            xp: updatedXP,
            lastDuelAt: new Date().toISOString()
          };
          cloudUser.syncedData = syncedData;
          await FirestoreService.saveUser(cloudUser);
        }
      }
    } catch {}

    return updatedXP;
  }

  public static generateOpponent(preferredId?: string, extraPool: DuelOpponent[] = []): DuelOpponent {
    const combined = [...extraPool, ...OPPONENT_POOL];
    if (preferredId) {
      const found = combined.find((o) => o.id === preferredId);
      if (found) return found;
    }
    const randomIndex = Math.floor(Math.random() * combined.length);
    return combined[randomIndex];
  }

  public static getDuelRounds(lang?: SupportedLanguage): DuelRound[] {
    const activeLang = lang || TargetLanguageService.getTargetLanguage();
    return activeLang === 'de' ? DUEL_ROUNDS_DE : DUEL_ROUNDS_EN;
  }

  public static evaluateDuelRound(
    round: DuelRound,
    speechText: string,
    opponent: DuelOpponent,
    secondsRemaining: number = 10
  ): DuelRoundResult {
    const text = (speechText || '').trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    let fluencyScore = 68;
    if (wordCount >= 4) fluencyScore += 10;
    if (wordCount >= 8) fluencyScore += 10;
    if (wordCount >= 12) fluencyScore += 8;
    fluencyScore = Math.min(98, fluencyScore);

    let vocabScore = 70;
    if (text.toLowerCase().includes(round.suggestedKeyword.toLowerCase())) {
      vocabScore += 18;
    } else if (wordCount >= 7) {
      vocabScore += 12;
    }
    vocabScore = Math.min(98, vocabScore);

    const speedBonus = Math.min(12, Math.max(4, Math.round(secondsRemaining / 2)));

    let userScore = Math.round(fluencyScore * 0.55 + vocabScore * 0.35 + speedBonus);
    userScore = Math.min(99, Math.max(55, userScore));

    // Opponent score based on skill rating +/- 3 jitter
    const jitter = Math.floor(Math.random() * 7) - 3;
    const opponentScore = Math.min(92, Math.max(62, opponent.skillRating + jitter));

    let winner: 'user' | 'opponent' | 'tie' = 'tie';
    if (userScore > opponentScore) winner = 'user';
    else if (userScore < opponentScore) winner = 'opponent';

    const feedback =
      winner === 'user'
        ? `Impressive agility! You outscored ${opponent.name} (${userScore} vs ${opponentScore}).`
        : `Close round! ${opponent.name} scored ${opponentScore} vs your ${userScore}, great sentence structure!`;

    const feedbackTr =
      winner === 'user'
        ? `Harika refleks! Akıcı ve net cümlenle ${opponent.name} karşısında bu raundu kazandın (${userScore} - ${opponentScore}).`
        : `Başa baş bir mücadele! ${opponent.name} çok az farkla önde (${opponentScore} - ${userScore}), ancak kurduğun cümle gayet güçlüydü.`;

    return {
      roundNumber: round.roundNumber,
      userScore,
      opponentScore,
      fluencyScore,
      vocabScore,
      speedBonus,
      winner,
      feedback,
      feedbackTr
    };
  }
}
