import React, { useState, useEffect, useRef } from 'react';
import {
  SpeakingDuelService,
  OPPONENT_POOL,
  LeagueTier,
  LeaderboardEntry,
  DuelOpponent,
  DuelRound,
  DuelRoundResult
} from '../../services/speakingDuelService';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

interface ChirmoSpeakingDuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
  initialTab?: 'duel' | 'league';
}

export const ChirmoSpeakingDuelModal: React.FC<ChirmoSpeakingDuelModalProps> = ({
  isOpen,
  onClose,
  onRewardXP,
  initialTab = 'duel'
}) => {
  const [activeTab, setActiveTab] = useState<'league' | 'duel'>(initialTab);
  const [opponentCategory, setOpponentCategory] = useState<'real' | 'ai'>('real');
  const [realOpponents, setRealOpponents] = useState<DuelOpponent[]>([]);
  const [isLoadingRealUsers, setIsLoadingRealUsers] = useState<boolean>(false);

  const [targetLang, setTargetLang] = useState<SupportedLanguage>(() =>
    TargetLanguageService.getTargetLanguage()
  );
  const [userXP, setUserXP] = useState<number>(450);
  const [leagueTier, setLeagueTier] = useState<LeagueTier>(SpeakingDuelService.getLeagueTier(450));
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>(OPPONENT_POOL[0].id);

  // Duel State
  const [duelPhase, setDuelPhase] = useState<'idle' | 'matchmaking' | 'in_round' | 'match_summary'>('idle');
  const [opponent, setOpponent] = useState<DuelOpponent | null>(null);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [rounds, setRounds] = useState<DuelRound[]>([]);
  const [roundResults, setRoundResults] = useState<DuelRoundResult[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(25);

  // User Speech in Round
  const [isListening, setIsListening] = useState<boolean>(false);
  const [userSpeechText, setUserSpeechText] = useState<string>('');
  const [currentRoundEvaluation, setCurrentRoundEvaluation] = useState<DuelRoundResult | null>(null);

  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  const loadCloudPlayersAndLeaderboard = async (currentXpVal: number) => {
    setIsLoadingRealUsers(true);
    try {
      const cloudPlayers = await SpeakingDuelService.fetchRealOpponents();
      setRealOpponents(cloudPlayers);
      setLeaderboard(SpeakingDuelService.getWeeklyLeaderboard(currentXpVal, cloudPlayers));
      if (cloudPlayers.length > 0) {
        setOpponentCategory('real');
        setSelectedOpponentId(cloudPlayers[0].id);
      } else {
        setOpponentCategory('ai');
        setSelectedOpponentId(OPPONENT_POOL[0].id);
      }
    } catch {
      setLeaderboard(SpeakingDuelService.getWeeklyLeaderboard(currentXpVal, []));
    } finally {
      setIsLoadingRealUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      const currentLang = TargetLanguageService.getTargetLanguage();
      setTargetLang(currentLang);
      const progress = LearningStorageService.getProgress();
      const xp = progress?.xp ?? 450;
      setUserXP(xp);
      const tier = SpeakingDuelService.getLeagueTier(xp);
      setLeagueTier(tier);
      setRounds(SpeakingDuelService.getDuelRounds(currentLang));
      loadCloudPlayersAndLeaderboard(xp);
    } else {
      resetDuel();
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (duelPhase === 'in_round' && secondsLeft > 0 && !currentRoundEvaluation) {
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
  }, [duelPhase, secondsLeft, currentRoundEvaluation]);

  const handleLanguageSwitch = (lang: SupportedLanguage) => {
    setTargetLang(lang);
    TargetLanguageService.setTargetLanguage(lang);
    const updatedRounds = SpeakingDuelService.getDuelRounds(lang);
    setRounds(updatedRounds);
    setUserSpeechText('');
    setCurrentRoundEvaluation(null);
  };

  const resetDuel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
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

  const startMatchmaking = (preferredOpponentId?: string) => {
    setActiveTab('duel');
    setDuelPhase('matchmaking');
    setUserSpeechText('');
    setCurrentRoundEvaluation(null);
    setRoundResults([]);
    const activeRounds = SpeakingDuelService.getDuelRounds(targetLang);
    setRounds(activeRounds);

    setTimeout(() => {
      const matched = SpeakingDuelService.generateOpponent(
        preferredOpponentId || selectedOpponentId,
        realOpponents
      );
      setOpponent(matched);
      setDuelPhase('in_round');
      setCurrentRoundIndex(0);
      setSecondsLeft(25);
      const firstRound = activeRounds[0];
      if (firstRound) {
        LearningStorageService.speak(firstRound.prompt);
      }
    }, 1000);
  };

  const handleTimeExpired = () => {
    if (!currentRoundEvaluation) {
      const activeRound = rounds[currentRoundIndex] || SpeakingDuelService.getDuelRounds(targetLang)[0];
      const fallbackText =
        userSpeechText.trim() ||
        activeRound?.quickReplies?.[1]?.text ||
        'I prefer flexibility and practicing every day.';
      setUserSpeechText(fallbackText);
      submitRoundAnswer(fallbackText);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const activeRound = rounds[currentRoundIndex] || SpeakingDuelService.getDuelRounds(targetLang)[0];

    if (!SpeechRecognition) {
      const fallback =
        activeRound?.quickReplies?.[1]?.text ||
        'I prefer working flexibly and learning new skills every day.';
      setUserSpeechText(fallback);
      LearningStorageService.speak(fallback);
      submitRoundAnswer(fallback);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = targetLang === 'de' ? 'de-DE' : 'en-US';
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
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const submitRoundAnswer = (textToEvaluate?: string) => {
    stopListening();
    if (timerRef.current) clearInterval(timerRef.current);

    const activeRound = rounds[currentRoundIndex] || SpeakingDuelService.getDuelRounds(targetLang)[0];
    const activeOpponent =
      opponent || SpeakingDuelService.generateOpponent(selectedOpponentId, realOpponents);
    const finalAnswer =
      (textToEvaluate !== undefined ? textToEvaluate : userSpeechText).trim() ||
      activeRound?.quickReplies?.[0]?.text ||
      'I am ready!';

    setUserSpeechText(finalAnswer);

    const evalResult = SpeakingDuelService.evaluateDuelRound(
      activeRound,
      finalAnswer,
      activeOpponent,
      secondsLeft
    );
    setCurrentRoundEvaluation(evalResult);
    setRoundResults((prev) => [...prev, evalResult]);
  };

  const handleSelectQuickReply = (replyText: string, submitImmediately: boolean = false) => {
    setUserSpeechText(replyText);
    LearningStorageService.speak(replyText);
    if (submitImmediately) {
      submitRoundAnswer(replyText);
    }
  };

  const handleNextRound = async () => {
    setUserSpeechText('');
    setCurrentRoundEvaluation(null);

    if (currentRoundIndex + 1 < rounds.length) {
      const nextIdx = currentRoundIndex + 1;
      setCurrentRoundIndex(nextIdx);
      setSecondsLeft(25);
      const nextRound = rounds[nextIdx];
      if (nextRound) {
        LearningStorageService.speak(nextRound.prompt);
      }
    } else {
      // Duel finished! Sync +60 XP to local & Firebase Firestore cloud
      setDuelPhase('match_summary');
      if (onRewardXP) onRewardXP(60);
      const updatedXP = await SpeakingDuelService.syncDuelVictoryToCloud(60);
      setUserXP(updatedXP);
      setLeagueTier(SpeakingDuelService.getLeagueTier(updatedXP));
      setLeaderboard(SpeakingDuelService.getWeeklyLeaderboard(updatedXP, realOpponents));
    }
  };

  // Compute final duel score
  const totalUserScore = roundResults.reduce((acc, r) => acc + r.userScore, 0);
  const totalOpponentScore = roundResults.reduce((acc, r) => acc + r.opponentScore, 0);
  const isMatchWinner = totalUserScore >= totalOpponentScore;

  if (!isOpen) return null;

  const currentRound = rounds[currentRoundIndex];
  const allAvailableOpponents = [...realOpponents, ...OPPONENT_POOL];
  const displayedOpponents = opponentCategory === 'real' ? realOpponents : OPPONENT_POOL;
  const currentlySelectedOpponent =
    allAvailableOpponents.find((o) => o.id === selectedOpponentId) || OPPONENT_POOL[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        {/* Glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-4 sm:p-5 border-b border-gray-800 bg-gray-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500/30 via-amber-500/30 to-yellow-600/30 border border-amber-400/50 flex items-center justify-center text-2xl shadow-inner">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-white">
                  1v1 Canlı Konuşma Düellosu & Sosyal Lig
                </h2>
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  🟢 Canlı Bulut & AI Arena
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Kayıtlı gerçek Chirmo oyuncularıyla veya uluslararası AI partnerlerle 3 raundluk konuşma maçı yap!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-950 p-1 rounded-xl border border-gray-800">
              <button
                type="button"
                onClick={() => handleLanguageSwitch('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                  targetLang === 'en'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSwitch('de')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                  targetLang === 'de'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🇩🇪 DE
              </button>
            </div>

            <button
              onClick={() => {
                resetDuel();
                onClose();
              }}
              className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition cursor-pointer"
              aria-label="Kapat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-3 sm:px-6 bg-gray-950/90 border-b border-gray-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('duel')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'duel'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md shadow-amber-950/40 font-black'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800 border border-gray-700/60'
            }`}
          >
            <span>⚔️</span>
            <span>1v1 Hızlı Konuşma Arenası</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('league')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'league'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md shadow-amber-950/40 font-black'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800 border border-gray-700/60'
            }`}
          >
            <span>🏆</span>
            <span>Haftalık Canlı Lig Sıralaması ({leagueTier.name})</span>
          </button>
        </div>

        {/* Tab 1: 1v1 Hızlı Konuşma Düellosu */}
        {activeTab === 'duel' && (
          <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 text-sm custom-scrollbar flex flex-col justify-between">
            {/* Phase 1: Idle Screen (Nasıl Çalışır + Gerçek/AI Rakip Seçimi) */}
            {duelPhase === 'idle' && (
              <div className="space-y-5 max-w-3xl mx-auto w-full">
                {/* Nasıl Çalışır? 4 Adım Rehberi */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-sm sm:text-base font-black text-amber-400 flex items-center gap-2">
                      <span>🎯</span>
                      <span>1v1 Canlı Konuşma Düellosu Nasıl Çalışır?</span>
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      3 Raund • +60 XP Canlı Bulut Puanı
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-gray-900/90 border border-gray-800">
                      <div className="font-black text-amber-300 mb-1">1️⃣ Rakibini Seç</div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        İster <b>👥 Gerçek Kayıtlı Oyuncuları</b>, ister <b>🤖 AI Konuşma Partnerlerini</b> seç.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-900/90 border border-gray-800">
                      <div className="font-black text-cyan-300 mb-1">2️⃣ Soruyu & Rakibi Dinle</div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        Her raundda gerçek hayattan bir soru sorulur ve rakibinin yanıtı gösterilir.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-900/90 border border-gray-800">
                      <div className="font-black text-emerald-300 mb-1">3️⃣ Konuş veya Kalıp Seç</div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        İster <b>🎙️ Mikrofona konuş</b>, ister <b>⚡ Hazır Cevap Kalıplarına</b> tıkla!
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-900/90 border border-gray-800">
                      <div className="font-black text-pink-300 mb-1">4️⃣ Bulut Ligde Yüksel</div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">
                        Kazandığın +60 XP doğrudan Firebase bulut liderlik tablosuna işlenir!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rakip Kategorisi Seçimi: Gerçek Kayıtlı Oyuncular vs AI Partnerler */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setOpponentCategory('real');
                          if (realOpponents.length > 0) {
                            setSelectedOpponentId(realOpponents[0].id);
                          }
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                          opponentCategory === 'real'
                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                            : 'bg-gray-900 text-gray-300 border border-gray-800 hover:bg-gray-800'
                        }`}
                      >
                        <span>👥</span>
                        <span>Gerçek Kayıtlı Oyuncular ({realOpponents.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOpponentCategory('ai');
                          setSelectedOpponentId(OPPONENT_POOL[0].id);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                          opponentCategory === 'ai'
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                            : 'bg-gray-900 text-gray-300 border border-gray-800 hover:bg-gray-800'
                        }`}
                      >
                        <span>🤖</span>
                        <span>Uluslararası AI Partnerler ({OPPONENT_POOL.length})</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => loadCloudPlayersAndLeaderboard(userXP)}
                      disabled={isLoadingRealUsers}
                      className="text-xs font-bold text-cyan-300 hover:text-white bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-xl cursor-pointer transition"
                    >
                      {isLoadingRealUsers ? '⏳ Buluttan Yükleniyor...' : '🔄 Oyuncuları Yenile'}
                    </button>
                  </div>

                  {/* Gerçek Kullanıcı Listesi Boşsa Bilgilendirme */}
                  {opponentCategory === 'real' && realOpponents.length === 0 && !isLoadingRealUsers && (
                    <div className="p-4 rounded-2xl bg-gray-900/90 border border-emerald-500/30 text-center space-y-2">
                      <div className="text-2xl">👥</div>
                      <div className="text-xs font-bold text-white">
                        Henüz başka kayıtlı oyuncu bulunamadı veya tek kayıtlı hesap sizsiniz.
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Yeni öğrenciler kayıt oldukça burada <b>🟢 Gerçek Oyuncu</b> olarak otomatik listelenir. Hemen pratik yapmak için <b>🤖 Uluslararası AI Partnerler</b> sekmesinden bir rakip seçebilirsiniz!
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setOpponentCategory('ai');
                          setSelectedOpponentId(OPPONENT_POOL[0].id);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-black font-black text-xs cursor-pointer"
                      >
                        🤖 AI Partnerleri Göster
                      </button>
                    </div>
                  )}

                  {/* Rakip Kartları */}
                  {displayedOpponents.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {displayedOpponents.map((opp) => {
                        const isSelected = selectedOpponentId === opp.id;
                        return (
                          <button
                            key={opp.id}
                            type="button"
                            onClick={() => setSelectedOpponentId(opp.id)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? opp.isRealUser
                                  ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                                  : 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.02]'
                                : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-2xl">{opp.avatar}</span>
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-black/50 text-amber-300">
                                ⚡ {opp.skillRating}
                              </span>
                            </div>
                            <div>
                              <div className="font-black text-white text-xs flex items-center gap-1">
                                <span className="truncate">{opp.name}</span>
                                <span>{opp.countryFlag}</span>
                              </div>
                              <div
                                className={`text-[10px] font-semibold mt-0.5 ${
                                  opp.isRealUser ? 'text-emerald-300' : 'text-amber-300/90'
                                }`}
                              >
                                {opp.city} • {opp.badge}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                                {opp.specialtyTr}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Başlat Butonları */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => startMatchmaking(currentlySelectedOpponent.id)}
                    className="flex-1 py-3.5 px-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>⚔️</span>
                    <span>
                      Seçili Rakiple Düelloya Başla ({currentlySelectedOpponent.name}{' '}
                      {currentlySelectedOpponent.isRealUser ? '• Gerçek Oyuncu' : '• AI Partner'})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const pool = displayedOpponents.length > 0 ? displayedOpponents : OPPONENT_POOL;
                      const randomOpp = pool[Math.floor(Math.random() * pool.length)];
                      setSelectedOpponentId(randomOpp.id);
                      startMatchmaking(randomOpp.id);
                    }}
                    className="py-3.5 px-5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs sm:text-sm rounded-2xl border border-gray-700 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>🎲</span>
                    <span>Rastgele Rakip Bul</span>
                  </button>
                </div>
              </div>
            )}

            {/* Phase 2: Matchmaking Radar */}
            {duelPhase === 'matchmaking' && (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-white">Arena Hazırlanıyor & Rakip Bağlanıyor...</h3>
                <p className="text-xs text-gray-400">
                  3 raundluk canlı konuşma soruları ve sesli hakem sistemi yükleniyor...
                </p>
              </div>
            )}

            {/* Phase 3: Active Duel Round */}
            {duelPhase === 'in_round' && opponent && currentRound && (
              <div className="space-y-4">
                {/* Opponents Matchup Bar */}
                <div className="grid grid-cols-12 gap-2 p-3.5 rounded-2xl bg-gray-950/90 border border-amber-500/30 items-center">
                  {/* User (Left) */}
                  <div className="col-span-5 flex items-center gap-2.5">
                    <span className="text-3xl">🌟</span>
                    <div>
                      <div className="font-black text-white text-xs sm:text-sm">Sen (Oyuncu)</div>
                      <div className="text-[10px] text-emerald-400 font-bold">
                        Toplam: {totalUserScore} Puan
                      </div>
                    </div>
                  </div>

                  {/* VS & Timer (Center) */}
                  <div className="col-span-2 text-center">
                    <span className="text-[10px] font-black text-amber-400 block uppercase">
                      Raund {currentRoundIndex + 1}/{rounds.length}
                    </span>
                    <span
                      className={`text-lg sm:text-xl font-mono font-black ${
                        secondsLeft <= 5 && !currentRoundEvaluation
                          ? 'text-rose-500 animate-ping'
                          : 'text-white'
                      }`}
                    >
                      {secondsLeft}s
                    </span>
                  </div>

                  {/* Opponent (Right) */}
                  <div className="col-span-5 flex items-center justify-end gap-2.5 text-right">
                    <div>
                      <div className="font-black text-white text-xs sm:text-sm flex items-center justify-end gap-1">
                        <span>{opponent.name}</span>
                        <span>{opponent.countryFlag}</span>
                      </div>
                      <div className="text-[10px] text-amber-300 font-semibold">
                        Toplam: {totalOpponentScore} Puan •{' '}
                        {opponent.isRealUser ? 'Gerçek Oyuncu' : opponent.city}
                      </div>
                    </div>
                    <span className="text-3xl">{opponent.avatar}</span>
                  </div>
                </div>

                {/* 1. Raund Sorusu + Rakibin Yanıtı */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Soru Kartı */}
                  <div className="md:col-span-7 p-4 rounded-2xl bg-gray-900 border border-amber-500/40 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-amber-400 uppercase">
                          🎤 {currentRound.topic}
                        </span>
                        <button
                          type="button"
                          onClick={() => LearningStorageService.speak(currentRound.prompt)}
                          className="text-xs font-bold text-amber-300 hover:text-white bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg cursor-pointer transition"
                        >
                          🔊 Soruyu Dinle
                        </button>
                      </div>
                      <p className="text-sm sm:text-base font-black text-white leading-relaxed">
                        "{currentRound.prompt}"
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        🇹🇷 {currentRound.promptTr}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">
                        💡 İpucu Kelime (+Puan):{' '}
                        <b className="text-emerald-400">"{currentRound.suggestedKeyword}"</b>
                      </span>
                    </div>
                  </div>

                  {/* Rakibin Canlı Cevabı */}
                  <div className="md:col-span-5 p-4 rounded-2xl bg-gray-950/90 border border-purple-500/30 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                          <span>{opponent.avatar}</span>
                          <span>{opponent.name} Yanıtı:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => LearningStorageService.speak(currentRound.opponentSampleAnswer)}
                          className="text-[11px] font-bold text-purple-300 hover:text-white bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-lg cursor-pointer"
                        >
                          🔊 Dinle
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-purple-100 leading-relaxed italic">
                        "{currentRound.opponentSampleAnswer}"
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        🇹🇷 {currentRound.opponentSampleAnswerTr}
                      </p>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      ✨ Şimdi sıra sende! Mikrofona konuş veya aşağıdan hazır kalıp seç.
                    </div>
                  </div>
                </div>

                {/* 2. Kullanıcının Cevap Alanı (Mikrofon + Klavye + Gönder Butonu) */}
                <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                      disabled={!!currentRoundEvaluation}
                      className={`h-14 px-5 rounded-2xl flex items-center justify-center gap-2 font-black text-xs sm:text-sm transition-all shadow-xl shrink-0 cursor-pointer ${
                        isListening
                          ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/50'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black shadow-amber-500/20'
                      }`}
                    >
                      <span className="text-xl">{isListening ? '🛑' : '🎙️'}</span>
                      <span>{isListening ? 'Dinleniyor (Durdur)' : 'Mikrofonla Konuş'}</span>
                    </button>

                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={userSpeechText}
                        onChange={(e) => setUserSpeechText(e.target.value)}
                        disabled={!!currentRoundEvaluation}
                        placeholder={
                          targetLang === 'de'
                            ? 'Mikrofonla konuş, aşağıdan hazır kalıp seç veya Almanca cevabını buraya yaz...'
                            : 'Mikrofonla konuş, aşağıdan hazır kalıp seç veya İngilizce cevabını buraya yaz...'
                        }
                        className="w-full h-14 px-4 rounded-2xl bg-gray-900 border border-gray-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                      />

                      {!currentRoundEvaluation && (
                        <button
                          type="button"
                          onClick={() => submitRoundAnswer(userSpeechText)}
                          className="h-14 px-4 sm:px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm shrink-0 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                          🚀 Gönder & Puanla
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 3. Tek Tıkla Hazır Cevap Kalıpları */}
                  {!currentRoundEvaluation && currentRound.quickReplies && (
                    <div className="pt-2 border-t border-gray-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300">
                          ⚡ Tek Tıkla Hazır Cevap Kalıpları (Tıkla, Sesli Dinle & Hemen Gönder):
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {currentRound.quickReplies.map((qr, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectQuickReply(qr.text, false)}
                            className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                              userSpeechText === qr.text
                                ? 'bg-amber-500/20 border-amber-400 text-white'
                                : 'bg-gray-900/90 border-gray-800 hover:border-amber-500/50 text-gray-200'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black text-amber-400 uppercase">
                                  {qr.level}
                                </span>
                                <span className="text-[10px] text-cyan-300 font-bold">🔊 Dinle & Seç</span>
                              </div>
                              <div className="text-xs font-bold text-white leading-snug">
                                "{qr.text}"
                              </div>
                              <div className="text-[10px] text-gray-400 mt-1">{qr.tr}</div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectQuickReply(qr.text, true);
                              }}
                              className="mt-2 w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 font-black text-[10px] transition cursor-pointer"
                            >
                              ✅ Bu Cevapla Raundu Kazan
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Evaluation of Round */}
                {currentRoundEvaluation && (
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3 animate-fadeIn ${
                      currentRoundEvaluation.winner === 'user'
                        ? 'bg-emerald-950/50 border-emerald-500/60'
                        : 'bg-gray-900 border-amber-500/40'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-black text-sm text-white flex items-center gap-2">
                        <span className="text-xl">
                          {currentRoundEvaluation.winner === 'user' ? '🎉' : '⚡'}
                        </span>
                        <span>
                          {currentRoundEvaluation.winner === 'user'
                            ? 'Raundu Sen Kazandın!'
                            : 'Başabaş Mücadele! Raund Tamamlandı'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-black/50 text-amber-300 text-xs font-mono">
                          Sen: {currentRoundEvaluation.userScore} Puan vs {opponent.name}:{' '}
                          {currentRoundEvaluation.opponentScore} Puan
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleNextRound}
                        className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs sm:text-sm rounded-xl transition shadow-lg cursor-pointer"
                      >
                        {currentRoundIndex + 1 < rounds.length
                          ? 'Sonraki Raunda Geç ➔'
                          : 'Düello Sonucunu Gör 🏆'}
                      </button>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-center">
                        <div className="text-[10px] text-gray-400">Akıcılık</div>
                        <div className="text-sm font-black text-emerald-400">
                          %{currentRoundEvaluation.fluencyScore}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-center">
                        <div className="text-[10px] text-gray-400">Kelime Kalitesi</div>
                        <div className="text-sm font-black text-cyan-400">
                          %{currentRoundEvaluation.vocabScore}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-center">
                        <div className="text-[10px] text-gray-400">Hız Bonusu</div>
                        <div className="text-sm font-black text-amber-400">
                          +{currentRoundEvaluation.speedBonus} Puan
                        </div>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-white">
                      {currentRoundEvaluation.feedbackTr}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Phase 4: Match Summary */}
            {duelPhase === 'match_summary' && opponent && (
              <div className="text-center py-6 space-y-5 max-w-md mx-auto">
                <div className="text-6xl animate-bounce">{isMatchWinner ? '🏆' : '🤝'}</div>
                <h3 className="text-2xl font-black text-white">
                  {isMatchWinner ? 'Tebrikler, Düello Şampiyonusun!' : 'Harika Bir Mücadeleydi!'}
                </h3>
                <p className="text-xs text-gray-300">
                  {opponent.name} ({opponent.isRealUser ? '🟢 Gerçek Oyuncu' : opponent.countryFlag}) ile 3 raundluk canlı konuşma düellosunu tamamladın.
                </p>

                {/* Score Comparison */}
                <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-around">
                  <div>
                    <div className="text-xs text-gray-400">Senin Toplam Puanın</div>
                    <div className="text-3xl font-black text-amber-400">{totalUserScore}</div>
                  </div>
                  <div className="text-lg font-bold text-gray-600">VS</div>
                  <div>
                    <div className="text-xs text-gray-400">{opponent.name}</div>
                    <div className="text-3xl font-black text-gray-300">{totalOpponentScore}</div>
                  </div>
                </div>

                {/* Rewards Badge */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-3">
                  <span>✨ +60 XP Buluta Kaydedildi</span>
                  <span>&bull;</span>
                  <span>🏅 Canlı Lig Puanın Güncellendi</span>
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('league')}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    🏆 Canlı Lider Tablosunu Gör
                  </button>
                  <button
                    type="button"
                    onClick={() => resetDuel()}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs rounded-xl transition shadow cursor-pointer"
                  >
                    ⚔️ Yeni Düello Başlat
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Haftalık Lig Sıralaması */}
        {activeTab === 'league' && (
          <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 text-sm custom-scrollbar">
            {/* Current League Status Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="text-4xl">{leagueTier.icon}</span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-white">{leagueTier.name}</h3>
                    <span className="text-[11px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                      {userXP} XP
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      🟢 Firebase Bulut Senkronize
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Kayıtlı gerçek Chirmo öğrencileri ve küresel lig adayları birlikte sıralanır. İlk 3 sıra üst lige terfi eder!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => loadCloudPlayersAndLeaderboard(userXP)}
                  className="px-3.5 py-2.5 bg-gray-800 hover:bg-gray-700 text-cyan-300 font-bold text-xs rounded-xl border border-gray-700 cursor-pointer"
                >
                  🔄 Yenile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('duel');
                    if (duelPhase === 'idle') {
                      startMatchmaking(currentlySelectedOpponent.id);
                    }
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>⚔️</span>
                  <span>Hemen Düello Başlat (+60 XP)</span>
                </button>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="rounded-2xl border border-gray-800 bg-gray-950/80 overflow-hidden">
              <div className="px-4 py-3 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between text-xs font-bold text-gray-400">
                <span>OYUNCU & DURUM</span>
                <span>HAFTALIK BULUT PUANI</span>
              </div>
              <div className="divide-y divide-gray-800/80">
                {leaderboard.map((entry) => (
                  <div
                    key={`${entry.rank}_${entry.name}`}
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white">{entry.name}</span>
                        <span>{entry.countryFlag}</span>
                        {entry.isRealUser && !entry.isUser && (
                          <span className="text-[10px] text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40">
                            🟢 Gerçek Oyuncu
                          </span>
                        )}
                        {entry.status === 'promote' && (
                          <span className="text-[10px] text-amber-300 font-bold px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-500/30">
                            ⬆️ Terfi Potası
                          </span>
                        )}
                        {entry.status === 'demote' && (
                          <span className="text-[10px] text-rose-400 font-bold px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-500/30">
                            ⬇️ Düşme Hattı
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

        {/* Footer */}
        <div className="p-3.5 sm:px-6 border-t border-gray-800 flex items-center justify-between bg-gray-900/80 shrink-0">
          <div className="text-xs text-gray-400">
            🏆 Düzenli 1v1 konuşma düelloları dil refleksinizi 3 kat hızlandırır.
          </div>
          <button
            onClick={() => {
              resetDuel();
              onClose();
            }}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
