import { describe, it, expect, beforeEach } from 'vitest';
import {
  SpeakingDuelService,
  LeagueTier,
  DuelOpponent
} from '../src/renderer/src/services/speakingDuelService';

describe('Speaking Duel & Social League Service', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    (global as any).localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
      length: 0,
      key: () => null
    };
  });

  it('determines appropriate league tier based on XP', () => {
    expect(SpeakingDuelService.getLeagueTier(150).name).toBe('Bronz Lig');
    expect(SpeakingDuelService.getLeagueTier(350).name).toBe('Gümüş Lig');
    expect(SpeakingDuelService.getLeagueTier(800).name).toBe('Altın Lig');
    expect(SpeakingDuelService.getLeagueTier(1500).name).toBe('Elmas Lig');
    expect(SpeakingDuelService.getLeagueTier(3000).name).toBe('Şampiyonlar Ligi');
  });

  it('generates a competitive 10-player leaderboard including the current user', () => {
    const userXP = 450;
    const leaderboard = SpeakingDuelService.getWeeklyLeaderboard(userXP);

    expect(leaderboard.length).toBe(10);
    const userEntry = leaderboard.find(entry => entry.isUser);
    expect(userEntry).toBeDefined();
    expect(userEntry?.xp).toBe(userXP);

    // Leaderboard must be sorted in descending order of XP
    for (let i = 0; i < leaderboard.length - 1; i++) {
      expect(leaderboard[i].xp).toBeGreaterThanOrEqual(leaderboard[i + 1].xp);
    }
  });

  it('provides matching opponents with randomized speaking traits', () => {
    const opponent = SpeakingDuelService.generateOpponent();
    expect(opponent).toBeDefined();
    expect(opponent.name).toBeTruthy();
    expect(opponent.avatar).toBeTruthy();
    expect(opponent.countryFlag).toBeTruthy();
    expect(opponent.skillRating).toBeGreaterThanOrEqual(70);
  });

  it('provides 3-round rapid speaking duel prompts with complete metadata', () => {
    const rounds = SpeakingDuelService.getDuelRounds();
    expect(rounds).toHaveLength(3);

    rounds.forEach(round => {
      expect(round.roundNumber).toBeGreaterThanOrEqual(1);
      expect(round.prompt).toBeTruthy();
      expect(round.promptTr).toBeTruthy();
      expect(round.timeLimitSeconds).toBeGreaterThanOrEqual(15);
    });
  });

  it('evaluates round score between user and opponent correctly', () => {
    const round = SpeakingDuelService.getDuelRounds()[0];
    const opponent = SpeakingDuelService.generateOpponent();

    const userGoodSpeech = 'I definitely prefer working from home because it saves travel time and boosts my productivity.';
    const result = SpeakingDuelService.evaluateDuelRound(round, userGoodSpeech, opponent);

    expect(result.userScore).toBeGreaterThanOrEqual(75);
    expect(result.opponentScore).toBeGreaterThanOrEqual(60);
    expect(result.winner).toBeDefined();
    expect(result.feedback).toBeTruthy();
  });
});
