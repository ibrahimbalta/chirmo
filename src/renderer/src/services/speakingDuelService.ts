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
}

export interface DuelRound {
  roundNumber: number;
  topic: string;
  prompt: string;
  promptTr: string;
  timeLimitSeconds: number;
  suggestedKeyword: string;
}

export interface DuelRoundResult {
  roundNumber: number;
  userScore: number;
  opponentScore: number;
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

export const DUEL_ROUNDS: DuelRound[] = [
  {
    roundNumber: 1,
    topic: 'Quick Opinion (Hızlı Fikir)',
    prompt: 'Do you prefer working remotely from home or at an office, and what is your top reason?',
    promptTr: 'Evden uzaktan çalışmayı mı yoksa ofiste çalışmayı mı tercih edersin, en önemli sebebin nedir?',
    timeLimitSeconds: 20,
    suggestedKeyword: 'flexibility'
  },
  {
    roundNumber: 2,
    topic: 'Speed Imagination (Hızlı Hayal Gücü)',
    prompt: 'If you could travel anywhere in the world tomorrow for free, where would you go and why?',
    promptTr: 'Yarın dünyanın herhangi bir yerine ücretsiz seyahat edebilseydin nereye giderdin ve neden?',
    timeLimitSeconds: 20,
    suggestedKeyword: 'explore'
  },
  {
    roundNumber: 3,
    topic: 'Fast Persuasion (Hızlı İkna)',
    prompt: 'Convince your best friend to spend 15 minutes a day speaking English!',
    promptTr: 'En yakın arkadaşını günde 15 dakika İngilizce konuşmaya ikna et!',
    timeLimitSeconds: 20,
    suggestedKeyword: 'practice'
  }
];

export const OPPONENT_POOL: DuelOpponent[] = [
  {
    id: 'opp_1',
    name: 'Liam Smith',
    city: 'London',
    countryFlag: '🇬🇧',
    avatar: '👨‍💼',
    skillRating: 84,
    badge: 'Fluency Master'
  },
  {
    id: 'opp_2',
    name: 'Sarah Miller',
    city: 'New York',
    countryFlag: '🇺🇸',
    avatar: '👩‍💻',
    skillRating: 86,
    badge: 'Streak Hero'
  },
  {
    id: 'opp_3',
    name: 'Marco Rossi',
    city: 'Milan',
    countryFlag: '🇮🇹',
    avatar: '🧑‍🎨',
    skillRating: 78,
    badge: 'Vocab Champ'
  },
  {
    id: 'opp_4',
    name: 'Kenji Tanaka',
    city: 'Tokyo',
    countryFlag: '🇯🇵',
    avatar: '👨‍🔬',
    skillRating: 80,
    badge: 'Polyglot'
  },
  {
    id: 'opp_5',
    name: 'Elena Petrov',
    city: 'Prague',
    countryFlag: '🇨🇿',
    avatar: '👩‍🏫',
    skillRating: 82,
    badge: 'Grammar Pro'
  }
];

export class SpeakingDuelService {
  public static getLeagueTier(xp: number): LeagueTier {
    for (const tier of LEAGUE_TIERS) {
      if (xp >= tier.minXP && (xp <= tier.maxXP || tier.maxXP === Infinity)) {
        return tier;
      }
    }
    return LEAGUE_TIERS[0];
  }

  public static getWeeklyLeaderboard(userXP: number): LeaderboardEntry[] {
    const tier = SpeakingDuelService.getLeagueTier(userXP);
    const base = tier.minXP;
    const diff = tier.maxXP === Infinity ? 1000 : tier.maxXP - tier.minXP;

    const botProfiles = [
      { name: 'Sarah Miller', flag: '🇺🇸', avatar: '👩‍💻' },
      { name: 'Kenji Tanaka', flag: '🇯🇵', avatar: '👨‍🔬' },
      { name: 'Marco Rossi', flag: '🇮🇹', avatar: '🧑‍🎨' },
      { name: 'Elena Petrov', flag: '🇨🇿', avatar: '👩‍🏫' },
      { name: 'Liam Smith', flag: '🇬🇧', avatar: '👨‍💼' },
      { name: 'Aylin Kaya', flag: '🇹🇷', avatar: '👩‍🎓' },
      { name: 'David Kim', flag: '🇰🇷', avatar: '🧑‍🚀' },
      { name: 'Sofia Rodriguez', flag: '🇪🇸', avatar: '👩‍⚕️' },
      { name: 'Lucas Dubois', flag: '🇫🇷', avatar: '👨‍🍳' }
    ];

    // Seed XP offsets around user
    const entries: Array<{
      name: string;
      avatar: string;
      countryFlag: string;
      xp: number;
      isUser: boolean;
    }> = botProfiles.map((bot, index) => {
      // Predictable varied values
      const factor = (9 - index) / 10;
      const botXP = Math.round(base + diff * factor * 0.95);
      return {
        name: bot.name,
        avatar: bot.avatar,
        countryFlag: bot.flag,
        xp: botXP,
        isUser: false
      };
    });

    // Add current user
    entries.push({
      name: 'Sen (Kullanıcı)',
      avatar: '🌟',
      countryFlag: '🇹🇷',
      xp: userXP,
      isUser: true
    });

    // Sort descending
    entries.sort((a, b) => b.xp - a.xp);

    // Format with rank and promotion status
    return entries.slice(0, 10).map((entry, idx) => {
      const rank = idx + 1;
      let status: 'promote' | 'stay' | 'demote' = 'stay';
      if (rank <= 3) status = 'promote';
      else if (rank >= 8) status = 'demote';

      return {
        rank,
        ...entry,
        status
      };
    });
  }

  public static generateOpponent(): DuelOpponent {
    const randomIndex = Math.floor(Math.random() * OPPONENT_POOL.length);
    return OPPONENT_POOL[randomIndex];
  }

  public static getDuelRounds(): DuelRound[] {
    return DUEL_ROUNDS;
  }

  public static evaluateDuelRound(
    round: DuelRound,
    speechText: string,
    opponent: DuelOpponent
  ): DuelRoundResult {
    const text = (speechText || '').trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    let userScore = 60;
    if (wordCount >= 4) userScore += 10;
    if (wordCount >= 8) userScore += 12;
    if (wordCount >= 14) userScore += 10;
    if (text.toLowerCase().includes(round.suggestedKeyword.toLowerCase())) {
      userScore += 8;
    }
    userScore = Math.min(98, Math.max(40, userScore));

    // Opponent score based on skill rating +/- 4 jitter
    const jitter = Math.floor(Math.random() * 9) - 4;
    const opponentScore = Math.min(95, Math.max(60, opponent.skillRating + jitter));

    let winner: 'user' | 'opponent' | 'tie' = 'tie';
    if (userScore > opponentScore) winner = 'user';
    else if (userScore < opponentScore) winner = 'opponent';

    const feedback =
      winner === 'user'
        ? `Impressive agility! You outscored ${opponent.name} with fluent, prompt speaking.`
        : `Close round! ${opponent.name} was slightly faster, but your sentence structure was solid.`;

    const feedbackTr =
      winner === 'user'
        ? `Müthiş refleks! Akıcı ve hızlı konuşmanla ${opponent.name} karşısında bu raundu kazandın.`
        : `Başa baş bir mücadele! ${opponent.name} biraz daha hızlı yanıt verdi, ancak cümle yapın gayet güçlüydü.`;

    return {
      roundNumber: round.roundNumber,
      userScore,
      opponentScore,
      winner,
      feedback,
      feedbackTr
    };
  }
}
