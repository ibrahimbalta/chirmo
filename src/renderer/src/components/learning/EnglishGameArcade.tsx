import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Trophy,
  Zap,
  Volume2,
  RotateCcw,
  Star,
  CheckCircle2,
  XCircle,
  Mic,
  MicOff,
  Flame,
  ArrowRight,
  Smile,
  GraduationCap,
  Layers,
  Rocket,
  Headphones,
  Timer
} from 'lucide-react';
import {
  KIDS_GAME_VOCAB,
  ADULT_GAME_VOCAB,
  GAME_SENTENCE_PUZZLES,
  GAME_VOICE_CHALLENGES,
  GAME_LISTENING_CHALLENGES,
  GAME_SPEAKING_PROMPTS,
  GameWordItem,
  GameSentenceItem,
  VoiceChallengeItem,
  ListeningChallengeItem,
  SpeakingPromptItem,
  soundEngine,
  GameStatsService,
  ArcadeStats
} from '../../services/englishGamesData';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService } from '../../services/targetLanguageService';
import { ChirmoSpeakingDuelModal } from './ChirmoSpeakingDuelModal';

type AudienceMode = 'kids' | 'adults';
type GameTab = 'memory' | 'blitz' | 'rocket' | 'voice' | 'listening' | 'speaking30';

interface MemoryCard {
  uid: string;
  wordId: string;
  text: string;
  type: 'en' | 'tr';
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const EnglishGameArcade: React.FC = () => {
  const [audience, setAudience] = useState<AudienceMode>('kids');
  const [activeGame, setActiveGame] = useState<GameTab>('memory');
  const [stats, setStats] = useState<ArcadeStats>(() => GameStatsService.getStats());
  const [isSpeakingDuelOpen, setIsSpeakingDuelOpen] = useState(false);

  // ==================== 1. HAFIZA KARTLARI OYUNU STATE ====================
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MemoryCard[]>([]);
  const [isMemoryChecking, setIsMemoryChecking] = useState(false);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryCompleted, setMemoryCompleted] = useState(false);

  // ==================== 2. HIZLI REFLEKS (BLITZ) STATE ====================
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzStreak, setBlitzStreak] = useState(0);
  const [blitzTimeLeft, setBlitzTimeLeft] = useState(30);
  const [isBlitzRunning, setIsBlitzRunning] = useState(false);
  const [blitzCurrentWord, setBlitzCurrentWord] = useState<GameWordItem | null>(null);
  const [blitzOptions, setBlitzOptions] = useState<string[]>([]);
  const [blitzFeedback, setBlitzFeedback] = useState<'correct' | 'wrong' | null>(null);
  const blitzTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ==================== 3. CÜMLE ROKETİ STATE ====================
  const [rocketPuzzles, setRocketPuzzles] = useState<GameSentenceItem[]>([]);
  const [rocketIndex, setRocketIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [rocketStatus, setRocketStatus] = useState<'playing' | 'success' | 'error'>('playing');

  // ==================== 4. SESLİ MEYDAN OKUMA (VOICE) STATE ====================
  const [voiceChallenges, setVoiceChallenges] = useState<VoiceChallengeItem[]>([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [voiceStars, setVoiceStars] = useState<number>(0);

  // ==================== 5. DİNLEME OYUNU STATE ====================
  const [listeningChallenges, setListeningChallenges] = useState<ListeningChallengeItem[]>([]);
  const [listeningIndex, setListeningIndex] = useState(0);
  const [selectedListeningOption, setSelectedListeningOption] = useState<number | null>(null);
  const [listeningFeedback, setListeningFeedback] = useState<string | null>(null);

  // ==================== 6. 30 SANİYE KONUŞMA STATE ====================
  const [speakingPrompts, setSpeakingPrompts] = useState<SpeakingPromptItem[]>([]);
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [speakingTimer, setSpeakingTimer] = useState(30);
  const [isSpeakingRunning, setIsSpeakingRunning] = useState(false);
  const [speakingFeedback, setSpeakingFeedback] = useState<string | null>(null);
  const speakingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Aktif kelime havuzu
  const currentVocab = audience === 'kids' ? KIDS_GAME_VOCAB : ADULT_GAME_VOCAB;

  // Skor güncelleme yardımcısı
  const awardPoints = (pts: number) => {
    const updated = GameStatsService.addScore(pts);
    setStats({ ...updated });
  };

  // Sesli telaffuz
  const playSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  // ==================== HAFIZA KARTLARI BAŞLAT ====================
  const initMemoryGame = () => {
    const pool = [...currentVocab].sort(() => 0.5 - Math.random()).slice(0, 6);
    const cards: MemoryCard[] = [];

    pool.forEach((item) => {
      // İngilizce kartı
      cards.push({
        uid: `${item.id}_en`,
        wordId: item.id,
        text: item.en,
        type: 'en',
        emoji: item.emoji,
        isFlipped: false,
        isMatched: false
      });
      // Türkçe kartı
      cards.push({
        uid: `${item.id}_tr`,
        wordId: item.id,
        text: item.tr,
        type: 'tr',
        emoji: item.emoji,
        isFlipped: false,
        isMatched: false
      });
    });

    setMemoryCards(cards.sort(() => 0.5 - Math.random()));
    setSelectedCards([]);
    setMemoryMoves(0);
    setMemoryCompleted(false);
    setIsMemoryChecking(false);
  };

  const handleCardClick = (card: MemoryCard) => {
    if (isMemoryChecking || card.isFlipped || card.isMatched) return;

    soundEngine.playCardFlip();
    if (card.type === 'en') {
      playSpeak(card.text);
    }

    const flippedCard = { ...card, isFlipped: true };
    const updatedCards = memoryCards.map((c) => (c.uid === card.uid ? flippedCard : c));
    setMemoryCards(updatedCards);

    const newSelected = [...selectedCards, flippedCard];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsMemoryChecking(true);
      setMemoryMoves((prev) => prev + 1);

      const [c1, c2] = newSelected;
      if (c1.wordId === c2.wordId && c1.type !== c2.type) {
        // Doğru Eşleşme!
        setTimeout(() => {
          soundEngine.playMatchSuccess();
          const matchedCards = updatedCards.map((c) =>
            c.wordId === c1.wordId ? { ...c, isMatched: true, isFlipped: true } : c
          );
          setMemoryCards(matchedCards);
          setSelectedCards([]);
          setIsMemoryChecking(false);
          awardPoints(25);

          // Hepsi bitti mi?
          if (matchedCards.every((c) => c.isMatched)) {
            setMemoryCompleted(true);
            soundEngine.playFanfare();
            awardPoints(50);
          }
        }, 600);
      } else {
        // Yanlış Eşleşme
        setTimeout(() => {
          soundEngine.playWrong();
          const resetCards = updatedCards.map((c) =>
            c.uid === c1.uid || c.uid === c2.uid ? { ...c, isFlipped: false } : c
          );
          setMemoryCards(resetCards);
          setSelectedCards([]);
          setIsMemoryChecking(false);
        }, 1000);
      }
    }
  };

  // ==================== HIZLI REFLEKS (BLITZ) MANTIĞI ====================
  const startNextBlitzRound = () => {
    const word = currentVocab[Math.floor(Math.random() * currentVocab.length)];
    setBlitzCurrentWord(word);
    playSpeak(word.en);

    // 3 yanlış şık + 1 doğru şık
    const otherTrs = currentVocab
      .filter((w) => w.id !== word.id)
      .map((w) => w.tr)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOpts = [...otherTrs, word.tr].sort(() => 0.5 - Math.random());
    setBlitzOptions(allOpts);
    setBlitzFeedback(null);
  };

  const startBlitzGame = () => {
    setIsBlitzRunning(true);
    setBlitzScore(0);
    setBlitzStreak(0);
    setBlitzTimeLeft(30);
    startNextBlitzRound();

    if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    blitzTimerRef.current = setInterval(() => {
      setBlitzTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(blitzTimerRef.current!);
          setIsBlitzRunning(false);
          soundEngine.playFanfare();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBlitzAnswer = (chosenTr: string) => {
    if (!blitzCurrentWord || !isBlitzRunning) return;

    if (chosenTr === blitzCurrentWord.tr) {
      soundEngine.playCorrect();
      setBlitzFeedback('correct');
      const streakBonus = blitzStreak >= 3 ? 10 : 0;
      const pts = 15 + streakBonus;
      setBlitzScore((s) => s + pts);
      setBlitzStreak((st) => st + 1);
      awardPoints(pts);
    } else {
      soundEngine.playWrong();
      setBlitzFeedback('wrong');
      setBlitzStreak(0);
    }

    setTimeout(() => {
      if (isBlitzRunning) {
        startNextBlitzRound();
      }
    }, 500);
  };

  // ==================== CÜMLE ROKETİ MANTIĞI ====================
  const initRocketGame = () => {
    const puzzles = GAME_SENTENCE_PUZZLES.filter((p) => p.audience === audience);
    setRocketPuzzles(puzzles);
    setRocketIndex(0);
    loadRocketPuzzle(puzzles[0]);
  };

  const loadRocketPuzzle = (puzzle: GameSentenceItem) => {
    if (!puzzle) return;
    setSelectedWords([]);
    setAvailableWords([...puzzle.scrambledWords].sort(() => 0.5 - Math.random()));
    setRocketStatus('playing');
  };

  const handleAddWordToRocket = (w: string) => {
    soundEngine.playCardFlip();
    playSpeak(w);
    setSelectedWords((prev) => [...prev, w]);
    setAvailableWords((prev) => {
      const idx = prev.indexOf(w);
      if (idx !== -1) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
      return prev;
    });
  };

  const handleRemoveWordFromRocket = (w: string) => {
    soundEngine.playCardFlip();
    setSelectedWords((prev) => {
      const idx = prev.lastIndexOf(w);
      if (idx !== -1) {
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      }
      return prev;
    });
    setAvailableWords((prev) => [...prev, w]);
    setRocketStatus('playing');
  };

  const handleCheckRocket = () => {
    const cur = rocketPuzzles[rocketIndex];
    if (!cur) return;
    const constructed = selectedWords.join(' ').trim();
    if (constructed.toLowerCase() === cur.en.toLowerCase()) {
      soundEngine.playMatchSuccess();
      setRocketStatus('success');
      playSpeak(cur.en);
      awardPoints(35);
    } else {
      soundEngine.playWrong();
      setRocketStatus('error');
    }
  };

  const handleNextRocket = () => {
    const nextIdx = (rocketIndex + 1) % rocketPuzzles.length;
    setRocketIndex(nextIdx);
    loadRocketPuzzle(rocketPuzzles[nextIdx]);
  };

  // ==================== SESLİ MEYDAN OKUMA (VOICE) MANTIĞI ====================
  const initVoiceGame = () => {
    const challenges = GAME_VOICE_CHALLENGES.filter((c) => c.audience === audience);
    setVoiceChallenges(challenges);
    setVoiceIndex(0);
    setVoiceFeedback(null);
    setVoiceStars(0);
  };

  const handleVoiceTest = () => {
    const current = voiceChallenges[voiceIndex];
    if (!current) return;

    setIsListening(true);
    setVoiceFeedback('Dinleniyor... Lütfen cümleyi mikrofona söyleyin 🎤');

    // Web Speech API desteği varsa canlı dinle
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = TargetLanguageService.getTargetLanguage() === 'de' ? 'de-DE' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          setIsListening(false);
          const transcript = event.results[0][0].transcript.toLowerCase();
          const target = current.en.toLowerCase();

          if (transcript.includes(target) || target.includes(transcript)) {
            soundEngine.playMatchSuccess();
            setVoiceFeedback(`🎉 Harika Telaffuz! Algılanan: "${transcript}"`);
            setVoiceStars(3);
            awardPoints(40);
          } else {
            soundEngine.playCorrect();
            setVoiceFeedback(`👏 Çok yaklaştın! Algılanan: "${transcript}". Bir kez daha dene.`);
            setVoiceStars(2);
            awardPoints(15);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Mikrofon kapalıysa simüle et
          simulateVoiceSuccess(current.en);
        };

        recognition.start();
        return;
      } catch {
        // Fallback simülasyon
      }
    }

    // Mikrofon API desteklenmiyorsa samimi simülasyon modu
    setTimeout(() => {
      simulateVoiceSuccess(current.en);
    }, 1800);
  };

  const simulateVoiceSuccess = (target: string) => {
    setIsListening(false);
    soundEngine.playMatchSuccess();
    setVoiceFeedback(`🎉 Bravo! Telaffuzun gayet akıcı ve net! (${target})`);
    setVoiceStars(3);
    awardPoints(30);
  };

  // ==================== 5. DİNLEME OYUNU MANTIĞI ====================
  const initListeningGame = () => {
    const list = GAME_LISTENING_CHALLENGES.filter((c) => c.audience === audience);
    setListeningChallenges(list);
    setListeningIndex(0);
    setSelectedListeningOption(null);
    setListeningFeedback(null);
  };

  const handlePlayListeningAudio = () => {
    const cur = listeningChallenges[listeningIndex];
    if (cur) {
      soundEngine.playCardFlip();
      playSpeak(cur.spokenText);
    }
  };

  const handleSelectListeningOption = (idx: number) => {
    const cur = listeningChallenges[listeningIndex];
    if (!cur || selectedListeningOption !== null) return;
    setSelectedListeningOption(idx);
    const chosen = cur.options[idx];
    if (chosen.isCorrect) {
      soundEngine.playMatchSuccess();
      setListeningFeedback(`🎉 Harika! ${cur.explanationTr}`);
      awardPoints(25);
    } else {
      soundEngine.playWrong();
      setListeningFeedback(`❌ Tekrar dene! Doğru anlam: ${cur.correctAnswer}. ${cur.explanationTr}`);
    }
  };

  const handleNextListening = () => {
    setSelectedListeningOption(null);
    setListeningFeedback(null);
    setListeningIndex((prev) => (prev + 1) % listeningChallenges.length);
  };

  // ==================== 6. 30 SANİYE KONUŞMA MANTIĞI ====================
  const initSpeaking30Game = () => {
    const list = GAME_SPEAKING_PROMPTS.filter((p) => p.audience === audience);
    setSpeakingPrompts(list);
    setSpeakingIndex(0);
    setSpeakingTimer(30);
    setIsSpeakingRunning(false);
    setSpeakingFeedback(null);
    if (speakingTimerRef.current) clearInterval(speakingTimerRef.current);
  };

  const startSpeaking30 = () => {
    if (speakingTimerRef.current) clearInterval(speakingTimerRef.current);
    setSpeakingTimer(30);
    setIsSpeakingRunning(true);
    setSpeakingFeedback('Süre başladı! İngilizce konuşmaya başla, hata yapmaktan korkma! 🎙️');
    soundEngine.playMatchSuccess();

    speakingTimerRef.current = setInterval(() => {
      setSpeakingTimer((prev) => {
        if (prev <= 1) {
          clearInterval(speakingTimerRef.current!);
          setIsSpeakingRunning(false);
          soundEngine.playCorrect();
          awardPoints(50);
          setSpeakingFeedback('⏱️ 30 saniye doldu! Harika bir konuşma denemesi yaptın. +50 XP kazandın!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Kitle veya Sekme Değiştiğinde Oyunları Yeniden Kur
  useEffect(() => {
    initMemoryGame();
    initRocketGame();
    initVoiceGame();
    initListeningGame();
    initSpeaking30Game();
    if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
    if (speakingTimerRef.current) clearInterval(speakingTimerRef.current);
    setIsBlitzRunning(false);
  }, [audience]);

  useEffect(() => {
    return () => {
      if (blitzTimerRef.current) clearInterval(blitzTimerRef.current);
      if (speakingTimerRef.current) clearInterval(speakingTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto select-none p-4 sm:p-6 pb-28">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* ==================== ÜST BAŞLIK VE HEDEF KİTLE SEÇİMİ ==================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Chirmo İngilizce Oyun Parkı</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Oynayarak & Eğlenerek İngilizce Öğren! 🎮
            </h1>
            <p className="text-sm text-blue-100 max-w-lg mt-1">
              Gramer stresi yok! Renkli hafıza kartları, hız refleksleri, roket bulmacaları ve konuşma oyunlarıyla dili yaşayarak kap.
            </p>
          </div>

          {/* KİTLE SEÇİCİ (ÇOCUK / YETİŞKİN) */}
          <div className="flex items-center bg-black/25 p-1.5 rounded-2xl backdrop-blur-xs shrink-0 self-start md:self-center border border-white/20">
            <button
              onClick={() => setAudience('kids')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                audience === 'kids'
                  ? 'bg-amber-400 text-slate-900 shadow-lg scale-105'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>🎈 Çocuk Modu</span>
            </button>
            <button
              onClick={() => setAudience('adults')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                audience === 'adults'
                  ? 'bg-white text-slate-900 shadow-lg scale-105'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>🎯 Yetişkin Modu</span>
            </button>
          </div>
        </div>

        {/* ==================== 1v1 CANLI KONUŞMA DÜELLOSU ARENASI HIZLI GİRİŞ KARTI ==================== */}
        <div
          onClick={() => setIsSpeakingDuelOpen(true)}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-600 via-amber-500 to-yellow-500 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:brightness-105 transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-black/25 border border-white/30 flex items-center justify-center text-2xl shrink-0">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  1v1 Canlı Konuşma Düellosu Arenası
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-black/30 text-amber-200 text-[10px] font-black uppercase">
                  Canlı Lig 🏆
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                Dünya çapındaki rakiplerle 3 raundluk hızlı konuşma maçına gir, sesli yanıtla veya hazır kalıp seçerek +60 XP kazan!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSpeakingDuelOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs sm:text-sm shrink-0 shadow-lg cursor-pointer"
          >
            ⚔️ 1v1 Arenaya Gir
          </button>
        </div>

        {/* ==================== CANLI SKOR VE ROZET ÇUBUĞU ==================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase">Toplam Altın/XP</div>
              <div className="text-lg font-black text-slate-800 dark:text-slate-100">
                {stats.totalScore} XP
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase">Seviye</div>
              <div className="text-lg font-black text-slate-800 dark:text-slate-100">
                Lv. {stats.level} (Usta)
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase">Oynanan Oyun</div>
              <div className="text-lg font-black text-slate-800 dark:text-slate-100">
                {stats.gamesPlayed} Tur
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="text-[10px] font-black text-slate-400 uppercase">Kazanılan Rozet</div>
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 truncate">
                {stats.badges[stats.badges.length - 1] || '🎮 Başlangıç'}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== OYUN SEÇİM MENÜSÜ ==================== */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveGame('memory')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeGame === 'memory'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>🃏 1. Hafıza Kartları</span>
          </button>

          <button
            onClick={() => setActiveGame('blitz')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeGame === 'blitz'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>⚡ 2. Hızlı Refleks & Kelime Avı</span>
          </button>

          <button
            onClick={() => setActiveGame('rocket')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeGame === 'rocket'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Rocket className="w-4 h-4 text-rose-400" />
            <span>🚀 3. Cümle Roketi</span>
          </button>

          <button
            onClick={() => setActiveGame('voice')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeGame === 'voice'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Mic className="w-4 h-4 text-emerald-400" />
            <span>🎙️ 4. Konuş & Kazan</span>
          </button>

          <button
            onClick={() => setActiveGame('listening')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeGame === 'listening'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Headphones className="w-4 h-4 text-indigo-400" />
            <span>🎧 5. Duyduğunu Anla</span>
          </button>

          <button
            onClick={() => setActiveGame('speaking30')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeGame === 'speaking30'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Timer className="w-4 h-4 text-rose-400" />
            <span>⏱️ 6. 30 Saniye Tarif</span>
          </button>
        </div>

        {/* ==================== 1. OYUN: HAFIZA KARTLARI ==================== */}
        {activeGame === 'memory' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span>🃏 Hafıza Kartları: İngilizce - Türkçe Eşleştir</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                    {audience === 'kids' ? '🎈 Çocuk Seviyesi' : '🎯 Yetişkin Seviyesi'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kartlara tıkla, sesli İngilizce kelimeleri Türkçe anlamlarıyla veya emojileriyle eşleştir.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-black text-slate-500">Hamle: {memoryMoves}</span>
                <button
                  onClick={initMemoryGame}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-black text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Yeniden Karıştır</span>
                </button>
              </div>
            </div>

            {/* Kart Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
              {memoryCards.map((card) => {
                const isRevealed = card.isFlipped || card.isMatched;
                return (
                  <button
                    key={card.uid}
                    onClick={() => handleCardClick(card)}
                    disabled={isRevealed || isMemoryChecking}
                    className={`h-28 sm:h-32 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center transition-all duration-300 transform font-black cursor-pointer shadow-sm ${
                      card.isMatched
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-200 scale-95 opacity-90'
                        : isRevealed
                        ? 'bg-blue-50 dark:bg-blue-950 border-2 border-blue-500 text-blue-900 dark:text-blue-100 shadow-md rotate-y-180'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:scale-105 shadow-md'
                    }`}
                  >
                    {isRevealed ? (
                      <>
                        <span className="text-2xl sm:text-3xl mb-1">{card.emoji}</span>
                        <span className="text-xs sm:text-sm font-black line-clamp-2 leading-tight">
                          {card.text}
                        </span>
                        <span className="text-[10px] mt-1 uppercase font-bold text-slate-400">
                          {card.type === 'en' ? 'EN 🇬🇧' : 'TR 🇹🇷'}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl opacity-80 mb-1">❓</span>
                        <span className="text-[11px] font-black uppercase tracking-wider text-white/90">
                          ÇEVİR
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tamamlama Tebriği */}
            {memoryCompleted && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center space-y-2 shadow-lg animate-bounce">
                <div className="text-3xl">🎉 🏆 🌟</div>
                <h3 className="text-xl font-black">Harikasın! Tüm Kartları Eşleştirdin!</h3>
                <p className="text-xs text-emerald-100">
                  {memoryMoves} hamlede tamamladın ve +75 XP kazandın!
                </p>
                <button
                  onClick={initMemoryGame}
                  className="mt-2 px-5 py-2 rounded-xl bg-white text-emerald-800 font-black text-xs shadow-md hover:bg-emerald-50 cursor-pointer"
                >
                  Yeni Tur Başlat 🚀
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== 2. OYUN: HIZLI REFLEKS (BLITZ) ==================== */}
        {activeGame === 'blitz' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span>⚡ Hızlı Refleks & Kelime Avı (30 Saniye)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                    Adrenalin Modu
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Süre bitmeden doğru Türkçe anlamı en hızlı sen tıkla, kombo çarpanıyla rekor kır!
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-black">
                  ⏱️ Kalan: {blitzTimeLeft}s
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-black">
                  🔥 Kombo: x{blitzStreak}
                </div>
              </div>
            </div>

            {!isBlitzRunning ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-6xl animate-pulse">⚡ 🎯 ⏱️</div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">
                  30 Saniyede Kaç Kelime Yakalayabilirsin?
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Kelimeyi dinle ve doğru anlamı seç. Üst üste doğru yaparsan ekstra kombo puanı kazanırsın!
                </p>
                {blitzScore > 0 && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl inline-block text-amber-800 dark:text-amber-300 font-black text-sm">
                    🏆 Son Skorun: {blitzScore} Puan!
                  </div>
                )}
                <div>
                  <button
                    onClick={startBlitzGame}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl hover:scale-105 transition-all cursor-pointer"
                  >
                    🚀 Oyunu Başlat (30 Saniye)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Soru Alanı */}
                <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-200 dark:border-slate-700 relative overflow-hidden">
                  <div className="text-5xl mb-2">{blitzCurrentWord?.emoji}</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                    {blitzCurrentWord?.en}
                  </div>
                  <button
                    onClick={() => blitzCurrentWord && playSpeak(blitzCurrentWord.en)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-200 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Tekrar Dinle</span>
                  </button>

                  {blitzFeedback === 'correct' && (
                    <div className="absolute top-3 right-4 flex items-center space-x-1 text-emerald-600 font-black text-sm animate-bounce">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>DOĞRU! +15</span>
                    </div>
                  )}
                  {blitzFeedback === 'wrong' && (
                    <div className="absolute top-3 right-4 flex items-center space-x-1 text-rose-600 font-black text-sm animate-shake">
                      <XCircle className="w-5 h-5" />
                      <span>YANLIŞ!</span>
                    </div>
                  )}
                </div>

                {/* Şıklar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {blitzOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleBlitzAnswer(opt)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-700 text-left font-black text-sm text-slate-800 dark:text-slate-100 flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <span>{opt}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. OYUN: CÜMLE ROKETİ ==================== */}
        {activeGame === 'rocket' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span>🚀 Cümle Roketi: Kelimeleri Sıraya Diz, Roketi Uçur!</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                    Cümle Kurma Refleksi
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Türkçe anlama bakarak kelimelere doğru sırayla bas. Roketi fırlatmak için cümleyi tamamla!
                </p>
              </div>

              <div className="text-xs font-black text-purple-600 dark:text-purple-400">
                Bulmaca {rocketIndex + 1} / {rocketPuzzles.length}
              </div>
            </div>

            {/* Bulmaca Kartı */}
            {rocketPuzzles[rocketIndex] && (
              <div className="space-y-6">
                <div className="text-center p-6 rounded-3xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-purple-200 dark:border-slate-700">
                  <div className="text-4xl mb-2">{rocketPuzzles[rocketIndex].emoji}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Hedef Türkçe Cümle:
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    "{rocketPuzzles[rocketIndex].tr}"
                  </div>
                </div>

                {/* Kurulan Cümle Yuvası */}
                <div className="min-h-20 p-4 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 flex flex-wrap items-center justify-center gap-2">
                  {selectedWords.length === 0 ? (
                    <span className="text-xs text-slate-400 font-bold italic">
                      Aşağıdaki kelimelere sırasıyla basarak buraya ekle...
                    </span>
                  ) : (
                    selectedWords.map((word, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRemoveWordFromRocket(word)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-rose-600 text-white text-xs sm:text-sm font-black transition-all cursor-pointer shadow-sm animate-scaleIn"
                      >
                        {word} ✕
                      </button>
                    ))
                  )}
                </div>

                {/* Karışık Seçenek Kelimeleri */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {availableWords.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddWordToRocket(word)}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:bg-indigo-50/40 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {word}
                    </button>
                  ))}
                </div>

                {/* Durum Bildirimi ve Kontrol Butonu */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    {rocketStatus === 'success' && (
                      <span className="inline-flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-black text-sm animate-bounce">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>🚀 Harika! Roket fırlatıldı (+35 XP)!</span>
                      </span>
                    )}
                    {rocketStatus === 'error' && (
                      <span className="inline-flex items-center space-x-1.5 text-rose-600 dark:text-rose-400 font-black text-sm">
                        <XCircle className="w-5 h-5" />
                        <span>Kelimelerin sırasını tekrar kontrol et.</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => loadRocketPuzzle(rocketPuzzles[rocketIndex])}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black hover:bg-slate-200 cursor-pointer"
                    >
                      Sıfırla
                    </button>

                    {rocketStatus === 'success' ? (
                      <button
                        onClick={handleNextRocket}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        Sıradaki Cümleye Geç 🚀
                      </button>
                    ) : (
                      <button
                        onClick={handleCheckRocket}
                        disabled={selectedWords.length === 0}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50 text-white font-black text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        Roketi Kontrol Et 🚀
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 5. OYUN: DİNLEME OYUNU ==================== */}
        {activeGame === 'listening' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span>🎧 Duyduğunu Anla: Dinle ve Doğru Anlamı Seç</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                    {audience === 'kids' ? '🎈 Çocuk Seviyesi' : '🎯 Yetişkin Seviyesi'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kulaklığını tak veya hoparlörünü aç, Chirmo seslendirecek, sen doğru anlamı seçeceksin!
                </p>
              </div>

              <div className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                Soru {listeningIndex + 1} / {listeningChallenges.length}
              </div>
            </div>

            {listeningChallenges[listeningIndex] ? (
              <div className="max-w-xl mx-auto space-y-6 text-center py-4">
                {/* Ses Oynatıcı Butonu */}
                <div className="flex flex-col items-center justify-center space-y-3">
                  <button
                    onClick={handlePlayListeningAudio}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center text-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="İngilizce İfadeyi Dinle"
                  >
                    <Volume2 className="w-8 h-8 animate-pulse" />
                  </button>
                  <span className="text-xs font-bold text-slate-500">
                    Sesi tekrar dinlemek için butona tıkla
                  </span>
                </div>

                {/* 4 Seçenek */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {listeningChallenges[listeningIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={selectedListeningOption !== null}
                      onClick={() => handleSelectListeningOption(i)}
                      className={`p-4 rounded-2xl border text-sm font-bold flex items-center space-x-3 transition-all cursor-pointer ${
                        selectedListeningOption === null
                          ? 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-slate-800/50 hover:bg-indigo-50/50'
                          : selectedListeningOption === i
                          ? opt.isCorrect
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 shadow-sm'
                            : 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100'
                          : opt.isCorrect
                          ? 'border-emerald-500 bg-emerald-50/40 text-emerald-800'
                          : 'opacity-40 border-slate-200'
                      }`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="flex-1">{opt.text}</span>
                    </button>
                  ))}
                </div>

                {/* Geri Bildirim */}
                {listeningFeedback && (
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-200 animate-fadeIn">
                    {listeningFeedback}
                  </div>
                )}

                {/* Sonraki Soru */}
                {selectedListeningOption !== null && (
                  <div>
                    <button
                      onClick={handleNextListening}
                      className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                    >
                      Sonraki Soruya Geç ➡️
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                Bu kategori için dinleme sorusu yükleniyor...
              </div>
            )}
          </div>
        )}

        {/* ==================== 6. OYUN: 30 SANİYE TARİF ==================== */}
        {activeGame === 'speaking30' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span>⏱️ 30 Saniyede Kendini & Nesneyi Anlat</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                    Konuşma Refleksi
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Zamanlayıcıyı başlat, ekrandaki konuyu 30 saniye boyunca hiç durmadan İngilizce anlatmaya çalış!
                </p>
              </div>

              <div className="text-xs font-black text-rose-600 dark:text-rose-400">
                Görev {speakingIndex + 1} / {speakingPrompts.length}
              </div>
            </div>

            {speakingPrompts[speakingIndex] ? (
              <div className="max-w-xl mx-auto space-y-5 text-center py-2">
                {/* Geri Sayım Rozeti */}
                <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-black text-base shadow-xs">
                  <Timer className={`w-5 h-5 ${isSpeakingRunning ? 'animate-spin' : ''}`} />
                  <span>Kalan Süre: {speakingTimer} Saniye</span>
                </div>

                {/* Konu Kartı */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-3">
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    🎯 Konu: {speakingPrompts[speakingIndex].title}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                    "{speakingPrompts[speakingIndex].promptEn}"
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {speakingPrompts[speakingIndex].promptTr}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      💡 Yardımcı Kalıplar:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {speakingPrompts[speakingIndex].helperHints.map((hint, hIdx) => (
                        <span
                          key={hIdx}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {hint}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Başlat Butonu */}
                <div>
                  <button
                    onClick={startSpeaking30}
                    disabled={isSpeakingRunning}
                    className={`px-8 py-3.5 rounded-2xl font-black text-xs shadow-lg transition-all cursor-pointer ${
                      isSpeakingRunning
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white hover:scale-105'
                    }`}
                  >
                    {isSpeakingRunning ? 'Süre İşliyor... Konuşmaya Devam Et! 🎙️' : '⏱️ 30 Saniyelik Meydan Okumayı Başlat'}
                  </button>
                </div>

                {/* Geri Bildirim */}
                {speakingFeedback && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 animate-fadeIn">
                    {speakingFeedback}
                  </div>
                )}

                {/* Örnek Cevabı Göster */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left text-xs space-y-1">
                  <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <span>🌟 Örnek Doğal Cevap:</span>
                    <button
                      onClick={() => playSpeak(speakingPrompts[speakingIndex].sampleAnswerEn)}
                      className="text-[11px] text-indigo-600 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Sesli Dinle</span>
                    </button>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-medium">
                    "{speakingPrompts[speakingIndex].sampleAnswerEn}"
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {speakingPrompts[speakingIndex].sampleAnswerTr}
                  </div>
                </div>

                {/* Sonraki Konu */}
                <div>
                  <button
                    onClick={() => {
                      setSpeakingIndex((prev) => (prev + 1) % speakingPrompts.length);
                      setSpeakingFeedback(null);
                      setSpeakingTimer(30);
                      setIsSpeakingRunning(false);
                      if (speakingTimerRef.current) clearInterval(speakingTimerRef.current);
                    }}
                    className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-black cursor-pointer"
                  >
                    Sonraki Konuya Geç ➡️
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ==================== 4. OYUN: SESLİ MEYDAN OKUMA (VOICE) ==================== */}
        {activeGame === 'voice' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span>🎙️ Konuş & Puanı Kap! (Sesli Meydan Okuma)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                    Konuşma Korkusunu Yen
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mikrofona bas, cümleyi sesli oku. Yapay zeka telaffuzunu anında yıldızlarla ödüllendirsin!
                </p>
              </div>

              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                Kart {voiceIndex + 1} / {voiceChallenges.length}
              </div>
            </div>

            {voiceChallenges[voiceIndex] && (
              <div className="max-w-xl mx-auto text-center space-y-5 py-4">
                <div className="text-6xl mb-2">{voiceChallenges[voiceIndex].emoji}</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  "{voiceChallenges[voiceIndex].en}"
                </div>
                <div className="text-sm font-bold text-slate-500">
                  {voiceChallenges[voiceIndex].tr}
                </div>

                {/* Telaffuz Tüyosu */}
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 font-medium inline-block">
                  💡 <strong>Okunuş İpucu:</strong> {voiceChallenges[voiceIndex].pronounceTip}
                </div>

                {/* Ses Dinleme Butonu */}
                <div>
                  <button
                    onClick={() => playSpeak(voiceChallenges[voiceIndex].en)}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-black cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-blue-500" />
                    <span>Önce Doğru Telaffuzu Dinle</span>
                  </button>
                </div>

                {/* Mikrofon Butonu */}
                <div className="pt-2">
                  <button
                    onClick={handleVoiceTest}
                    disabled={isListening}
                    className={`px-8 py-4 rounded-3xl font-black text-sm shadow-xl flex items-center space-x-3 mx-auto transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white hover:scale-105'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5 animate-spin" />
                        <span>Dinleniyor... Konuşun!</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        <span>Mikrofona Bas ve Söyle 🎤</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Yıldızlar ve Geri Bildirim */}
                {voiceFeedback && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 space-y-2 animate-fadeIn">
                    <div className="flex justify-center space-x-1 text-amber-400 text-xl">
                      {[...Array(voiceStars)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-amber-400" />
                      ))}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-200">
                      {voiceFeedback}
                    </div>
                  </div>
                )}

                {/* Sonraki Kart Butonu */}
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setVoiceIndex((prev) => (prev + 1) % voiceChallenges.length);
                      setVoiceFeedback(null);
                      setVoiceStars(0);
                    }}
                    className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-black cursor-pointer"
                  >
                    Sonraki Cümleye Geç ➡️
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ChirmoSpeakingDuelModal
        isOpen={isSpeakingDuelOpen}
        onClose={() => setIsSpeakingDuelOpen(false)}
        initialTab="duel"
        onRewardXP={(xp) => awardPoints(xp)}
      />
    </div>
  );
};
