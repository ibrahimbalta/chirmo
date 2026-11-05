import React, { useState, useEffect, useRef } from 'react';
import {
  SpeakingDuelService,
  LeagueTier,
  LeaderboardEntry,
  DuelOpponent,
  DuelRound,
  DuelRoundResult
} from '../../services/speakingDuelService';
import { LearningStorageService } from '../../services/learningStorage';

interface ChirmoSpeakingDuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
}

export const ChirmoSpeakingDuelModal: React.FC<ChirmoSpeakingDuelModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const [activeTab, setActiveTab] = useState<'league' | 'duel'>('league');
  const [userXP, setUserXP] = useState<number>(450);
  const [leagueTier, setLeagueTier] = useState<LeagueTier>(SpeakingDuelService.getLeagueTier(450));
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Duel State
  const [duelPhase, setDuelPhase] = useState<'idle' | 'matchmaking' | 'in_round' | 'match_summary'>('idle');
  const [opponent, setOpponent] = useState<DuelOpponent | null>(null);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [rounds, setRounds] = useState<DuelRound[]>([]);
  const [roundResults, setRoundResults] = useState<DuelRoundResult[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(20);

  // User Speech in Round
  const [isListening, setIsListening] = useState<boolean>(false);
  const [userSpeechText, setUserSpeechText] = useState<string>('');
  const [currentRoundEvaluation, setCurrentRoundEvaluation] = useState<DuelRoundResult | null>(null);

  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      const progress = LearningStorageService.getProgress();
      const xp = progress?.xp ?? 450;
      setUserXP(xp);
      const tier = SpeakingDuelService.getLeagueTier(xp);
      setLeagueTier(tier);
      setLeaderboard(SpeakingDuelService.getWeeklyLeaderboard(xp));
      setRounds(SpeakingDuelService.getDuelRounds());
    } else {
      resetDuel();
    }
  }, [isOpen]);

  useEffect(() => {
    if (duelPhase === 'in_round' && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [duelPhase, secondsLeft]);

  if (!isOpen) return null;

  const resetDuel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setDuelPhase('idle');
    setOpponent(null);
    setCurrentRoundIndex(0);
    setRoundResults([]);
    setUserSpeechText('');
    setCurrentRoundEvaluation(null);
  };

  const startMatchmaking = () => {
    setActiveTab('duel');
    setDuelPhase('matchmaking');
    setUserSpeechText('');
    setCurrentRoundEvaluation(null);
    setRoundResults([]);

    setTimeout(() => {
      const matched = SpeakingDuelService.generateOpponent();
      setOpponent(matched);
      setDuelPhase('in_round');
      setCurrentRoundIndex(0);
      setSecondsLeft(20);
      const firstRound = rounds[0] || SpeakingDuelService.getDuelRounds()[0];
      LearningStorageService.speak(`Duel begins! ${firstRound.prompt}`);
    }, 1800);
  };

  const handleTimeExpired = () => {
    if (!currentRoundEvaluation) {
      submitRoundAnswer(userSpeechText || 'I am ready for the challenge!');
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const fallback = 'I prefer working flexibly and learning new skills every day.';
      setUserSpeechText(fallback);
      submitRoundAnswer(fallback);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserSpeechText(transcript);
        if (event.results[0].isFinal) {
          submitRoundAnswer(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const submitRoundAnswer = (text: string) => {
    stopListening();
    if (timerRef.current) clearInterval(timerRef.current);

    const activeRound = rounds[currentRoundIndex] || SpeakingDuelService.getDuelRounds()[0];
    const activeOpponent = opponent || SpeakingDuelService.generateOpponent();

    const evalResult = SpeakingDuelService.evaluateDuelRound(activeRound, text, activeOpponent);
    setCurrentRoundEvaluation(evalResult);
    setRoundResults((prev) => [...prev, evalResult]);

    LearningStorageService.speak(
      evalResult.winner === 'user' ? 'Round won!' : 'Round completed!'
    );
  };

  const handleNextRound = () => {
    setUserSpeechText('');
    setCurrentRoundEvaluation(null);

    if (currentRoundIndex + 1 < rounds.length) {
      setCurrentRoundIndex((prev) => prev + 1);
      setSecondsLeft(20);
      const nextRound = rounds[currentRoundIndex + 1];
      LearningStorageService.speak(nextRound.prompt);
    } else {
      // Duel finished!
      setDuelPhase('match_summary');
      if (onRewardXP) onRewardXP(60);
      setUserXP((prev) => prev + 60);
      setLeaderboard(SpeakingDuelService.getWeeklyLeaderboard(userXP + 60));
    }
  };

  // Compute final duel score
  const totalUserScore = roundResults.reduce((acc, r) => acc + r.userScore, 0);
  const totalOpponentScore = roundResults.reduce((acc, r) => acc + r.opponentScore, 0);
  const isMatchWinner = totalUserScore >= totalOpponentScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800 bg-gray-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-yellow-600/30 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Sosyal Ligler & 1v1 Konuşma Düelloları
                </h2>
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Global Arena
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Haftalık küme yarışında yüksel, dünya çapındaki konuşma partnerleriyle 60 saniyelik düellolar yap!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetDuel();
              onClose();
            }}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-3 sm:px-6 bg-gray-950/80 border-b border-gray-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('league')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'league'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md shadow-amber-950/40 font-black'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800 border border-gray-700/60'
            }`}
          >
            <span>🏆</span>
            <span>Haftalık Lig Sıralaması ({leagueTier.name})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('duel')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'duel'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md shadow-amber-950/40 font-black'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800 border border-gray-700/60'
            }`}
          >
            <span>⚔️</span>
            <span>1v1 Hızlı Konuşma Düellosu</span>
          </button>
        </div>

        {/* Tab 1: Haftalık Lig Sıralaması */}
        {activeTab === 'league' && (
          <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 text-sm custom-scrollbar">
            {/* Current League Status Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="text-4xl">{leagueTier.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">{leagueTier.name}</h3>
                    <span className="text-[11px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                      {userXP} XP
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">
                    İlk 3 sıra bir üst lige terfi eder. Sıfırlanmaya:{' '}
                    <span className="text-amber-400 font-bold">2 Gün 14 Saat</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={startMatchmaking}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 shrink-0"
              >
                <span>⚔️</span>
                <span>Düello Başlat (+60 XP)</span>
              </button>
            </div>

            {/* Leaderboard Table */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950/80 overflow-hidden">
              <div className="px-4 py-3 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between text-xs font-bold text-gray-400">
                <span>KULLANICI & ÜLKE</span>
                <span>HAFTALIK PUAN</span>
              </div>
              <div className="divide-y divide-gray-800/80">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`px-4 py-3 flex items-center justify-between text-xs transition ${
                      entry.isUser
                        ? 'bg-amber-950/40 border-l-4 border-amber-400 text-white font-bold'
                        : 'text-gray-300 hover:bg-gray-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 text-center font-mono font-bold ${
                          entry.rank === 1
                            ? 'text-yellow-400 text-base'
                            : entry.rank === 2
                            ? 'text-slate-300 text-sm'
                            : entry.rank === 3
                            ? 'text-amber-600 text-sm'
                            : 'text-gray-500'
                        }`}
                      >
                        {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                      </span>
                      <span className="text-base">{entry.avatar}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{entry.name}</span>
                        <span>{entry.countryFlag}</span>
                        {entry.status === 'promote' && (
                          <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30">
                            ⬆️ Terfi
                          </span>
                        )}
                        {entry.status === 'demote' && (
                          <span className="text-[10px] text-rose-400 font-bold px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-500/30">
                            ⬇️ Tehlike
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-amber-400">{entry.xp} XP</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 1v1 Hızlı Konuşma Düellosu */}
        {activeTab === 'duel' && (
          <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 text-sm custom-scrollbar flex flex-col justify-between">
            {/* Phase 1: Idle Screen */}
            {duelPhase === 'idle' && (
              <div className="text-center py-10 space-y-4 max-w-md mx-auto">
                <div className="text-6xl animate-pulse">⚔️</div>
                <h3 className="text-xl font-black text-white">1v1 Hızlı Konuşma Arenası</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  3 raund sürecek hızlı refleks konuşma düellosuna katıl. Chirmo seni dünyanın dört bir yanından bir öğreniciyle eşleştirir.
                </p>
                <div className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-300 text-left space-y-1.5">
                  <div className="font-bold text-amber-400">Kurallar:</div>
                  <div>&bull; Her raundda 20 saniye süreniz vardır.</div>
                  <div>&bull; Mikrofona konuşarak fikrinizi net ve akıcı şekilde ifade edin.</div>
                  <div>&bull; Kazanan oyuncu <span className="text-amber-400 font-bold">+60 XP</span> ve Lig Terfi Puanı kazanır!</div>
                </div>
                <button
                  type="button"
                  onClick={startMatchmaking}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm rounded-xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>🚀</span>
                  <span>Rakip Bul & Düelloya Başla</span>
                </button>
              </div>
            )}

            {/* Phase 2: Matchmaking Radar */}
            {duelPhase === 'matchmaking' && (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-white">Konuşma Partneri Eşleştiriliyor...</h3>
                <p className="text-xs text-gray-400">
                  Seviyene en uygun uluslararası aday taranıyor...
                </p>
              </div>
            )}

            {/* Phase 3: Active Duel Round */}
            {duelPhase === 'in_round' && opponent && (
              <div className="space-y-4">
                {/* Opponents Matchup Bar */}
                <div className="grid grid-cols-12 gap-2 p-3.5 rounded-2xl bg-gray-950/80 border border-amber-500/30 items-center">
                  {/* User (Left) */}
                  <div className="col-span-5 flex items-center gap-2.5">
                    <span className="text-3xl">🌟</span>
                    <div>
                      <div className="font-bold text-white text-xs">Sen (Kullanıcı)</div>
                      <div className="text-[10px] text-emerald-400 font-bold">Hazır 🟢</div>
                    </div>
                  </div>

                  {/* VS & Timer (Center) */}
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-black text-amber-400 block">VS</span>
                    <span
                      className={`text-lg font-mono font-black ${
                        secondsLeft <= 5 ? 'text-rose-500 animate-ping' : 'text-white'
                      }`}
                    >
                      {secondsLeft}s
                    </span>
                  </div>

                  {/* Opponent (Right) */}
                  <div className="col-span-5 flex items-center justify-end gap-2.5 text-right">
                    <div>
                      <div className="font-bold text-white text-xs flex items-center justify-end gap-1">
                        <span>{opponent.name}</span>
                        <span>{opponent.countryFlag}</span>
                      </div>
                      <div className="text-[10px] text-gray-400">{opponent.city} &bull; {opponent.badge}</div>
                    </div>
                    <span className="text-3xl">{opponent.avatar}</span>
                  </div>
                </div>

                {/* Active Round Prompt */}
                {rounds[currentRoundIndex] && (
                  <div className="p-4 rounded-xl bg-gray-900 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">
                        {rounds[currentRoundIndex].topic} &bull; Raund {currentRoundIndex + 1}/3
                      </span>
                      <button
                        type="button"
                        onClick={() => LearningStorageService.speak(rounds[currentRoundIndex].prompt)}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        🔊 Dinle
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      "{rounds[currentRoundIndex].prompt}"
                    </p>
                    <p className="text-xs text-gray-400 italic">
                      {rounds[currentRoundIndex].promptTr}
                    </p>
                  </div>
                )}

                {/* Speech Recording Bar */}
                <div className="p-4 rounded-xl bg-gray-950/90 border border-gray-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                      disabled={!!currentRoundEvaluation}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all shadow-xl shrink-0 ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black shadow-amber-500/30'
                      }`}
                    >
                      {isListening ? '🛑' : '🎙️'}
                    </button>
                    <div className="flex-1">
                      <div className="text-[11px] text-gray-400 font-semibold mb-1">
                        {isListening ? '🎤 Konuşuyorsun...' : 'Yanıtın:'}
                      </div>
                      <div className="text-xs font-medium text-white min-h-[28px] p-2 rounded-lg bg-gray-900 border border-gray-800">
                        {userSpeechText ? (
                          <span>"{userSpeechText}"</span>
                        ) : (
                          <span className="text-gray-500 italic">
                            Mikrofona tıklayıp süren bitmeden hızlıca cevap ver!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evaluation of Round */}
                {currentRoundEvaluation && (
                  <div
                    className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                      currentRoundEvaluation.winner === 'user'
                        ? 'bg-emerald-950/40 border-emerald-500/50'
                        : 'bg-gray-900 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        <span>{currentRoundEvaluation.winner === 'user' ? '🎉 Raundu Kazandın!' : '👍 Raund Tamamlandı!'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px]">
                          Sen: {currentRoundEvaluation.userScore} vs {opponent.name}: {currentRoundEvaluation.opponentScore}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleNextRound}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition"
                      >
                        {currentRoundIndex + 1 < rounds.length ? 'Sonraki Raund ➔' : 'Düelloyu Bitir 🏆'}
                      </button>
                    </div>
                    <p className="text-xs text-white">{currentRoundEvaluation.feedback}</p>
                    <p className="text-[11px] text-gray-400 italic">{currentRoundEvaluation.feedbackTr}</p>
                  </div>
                )}
              </div>
            )}

            {/* Phase 4: Match Summary */}
            {duelPhase === 'match_summary' && opponent && (
              <div className="text-center py-8 space-y-5 max-w-md mx-auto">
                <div className="text-6xl animate-bounce">
                  {isMatchWinner ? '🏆' : '🤝'}
                </div>
                <h3 className="text-2xl font-black text-white">
                  {isMatchWinner ? 'Tebrikler, Zafer Senin!' : 'Harika Bir Mücadele!'}
                </h3>
                <p className="text-xs text-gray-300">
                  {opponent.name} ile 3 raundluk konuşma düellosunu tamamladın.
                </p>

                {/* Score Comparison */}
                <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-around">
                  <div>
                    <div className="text-xs text-gray-400">Senin Puanın</div>
                    <div className="text-2xl font-black text-amber-400">{totalUserScore}</div>
                  </div>
                  <div className="text-lg font-bold text-gray-600">VS</div>
                  <div>
                    <div className="text-xs text-gray-400">{opponent.name}</div>
                    <div className="text-2xl font-black text-gray-300">{totalOpponentScore}</div>
                  </div>
                </div>

                {/* Rewards Badge */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-3">
                  <span>✨ +60 XP Kazanıldı</span>
                  <span>&bull;</span>
                  <span>🏅 +15 Lig Sıralama Puanı</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('league')}
                    className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs rounded-xl transition"
                  >
                    Lider Tablosuna Git
                  </button>
                  <button
                    type="button"
                    onClick={startMatchmaking}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs rounded-xl transition shadow"
                  >
                    Tekrar Düello Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-900/60 shrink-0">
          <div className="text-xs text-gray-400">
            🏆 Düzenli konuşma düelloları dil refleksinizi 3 kat hızlandırır.
          </div>
          <button
            onClick={() => {
              resetDuel();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black text-xs font-bold rounded-lg transition shadow"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
