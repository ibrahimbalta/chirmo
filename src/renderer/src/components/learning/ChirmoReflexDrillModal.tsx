import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Mic,
  MicOff,
  Volume2,
  X,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  ReflexDrillService,
  ReflexDrillPrompt
} from '../../services/reflexDrillService';
import { TargetLanguageService } from '../../services/targetLanguageService';
import { LearningStorageService } from '../../services/learningStorage';
import { InteractiveSentence } from './InteractiveSentence';

interface ChirmoReflexDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
}

export const ChirmoReflexDrillModal: React.FC<ChirmoReflexDrillModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const [targetLang, setTargetLang] = useState(() => TargetLanguageService.getTargetLanguage());
  const [drills, setDrills] = useState<ReflexDrillPrompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Drill states: 'idle' | 'countdown' | 'listening' | 'evaluated'
  const [drillState, setDrillState] = useState<'idle' | 'countdown' | 'listening' | 'evaluated'>('idle');
  const [countdown, setCountdown] = useState<number>(3);
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [evaluation, setEvaluation] = useState<ReturnType<typeof ReflexDrillService.evaluateResponse> | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const countdownTimerRef = useRef<any>(null);

  useEffect(() => {
    return TargetLanguageService.subscribe((lang) => setTargetLang(lang));
  }, []);

  useEffect(() => {
    if (isOpen) {
      const activeDrills = ReflexDrillService.getDrills(targetLang);
      setDrills(activeDrills);
      setCurrentIndex(0);
      resetDrill();
    } else {
      stopAll();
    }
  }, [isOpen, targetLang]);

  const currentDrill = drills[currentIndex] || drills[0];

  const resetDrill = () => {
    stopAll();
    setDrillState('idle');
    setCountdown(3);
    setUserTranscript('');
    setEvaluation(null);
  };

  const stopAll = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
  };

  const handleStartReflex = () => {
    resetDrill();
    setDrillState('countdown');
    setCountdown(3);

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownTimerRef.current);
        startListeningPhase();
      }
    }, 1000);
  };

  const startListeningPhase = () => {
    setDrillState('listening');
    setUserTranscript('');
    const start = Date.now();
    setStartTime(start);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback simulation
      setTimeout(() => {
        const simulated = currentDrill.suggestedAnswer;
        finishDrillWithText(simulated, (Date.now() - start) / 1000);
      }, 2000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = targetLang === 'de' ? 'de-DE' : targetLang === 'fr' ? 'fr-FR' : 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setUserTranscript(text);
        if (event.results[0].isFinal || text.length > 5) {
          const duration = Math.max(0.6, (Date.now() - start) / 1000);
          recognition.stop();
          finishDrillWithText(text, duration);
        }
      };

      recognition.onerror = () => {
        const simulated = currentDrill.suggestedAnswer;
        finishDrillWithText(simulated, 1.9);
      };

      recognition.onend = () => {
        // Handled in onresult
      };

      recognition.start();

      // Max 5 seconds timeout before auto-evaluate
      setTimeout(() => {
        if (drillState === 'listening') {
          recognition.stop();
          const fallback = currentDrill.suggestedAnswer;
          finishDrillWithText(fallback, 3.2);
        }
      }, 5000);
    } catch {
      const simulated = currentDrill.suggestedAnswer;
      finishDrillWithText(simulated, 2.1);
    }
  };

  const finishDrillWithText = (text: string, timeSec: number) => {
    setUserTranscript(text);
    setResponseTime(timeSec);
    const result = ReflexDrillService.evaluateResponse(text, currentDrill, timeSec);
    setEvaluation(result);
    setDrillState('evaluated');

    setStreakCount((prev) => prev + 1);
    LearningStorageService.addXP(result.xpEarned);
    onRewardXP?.(result.xpEarned);

    LearningStorageService.speak(
      targetLang === 'de'
        ? 'Ausgezeichneter Reflex!'
        : targetLang === 'fr'
          ? 'Excellent réflexe !'
          : 'Brilliant reaction speed!'
    );
  };

  const handleNextDrill = () => {
    if (drills.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % drills.length);
    resetDrill();
  };

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  if (!isOpen || !currentDrill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-300 dark:border-amber-700/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Üst Başlık Barı */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Zap className="w-6 h-6 text-white fill-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base sm:text-lg">
                  3 Saniye Refleks Antrenörü ⚡
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-black uppercase">
                  {targetLang === 'de' ? '🇩🇪 Almanca' : targetLang === 'fr' ? '🇫🇷 Fransızca' : '🇬🇧 İngilizce'}
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium">
                Gramer düşünmeyi bırak! Spontane konuşma refleksini ateşle.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/20 text-xs font-black">
              <Flame className="w-4 h-4 text-yellow-300" />
              <span>{streakCount} Seri 🔥</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gövde */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Durum & Senaryo Kartı */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-black">
                {currentDrill.category}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                {currentIndex + 1} / {drills.length} Görev
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {currentDrill.titleTr}
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              👉 {currentDrill.scenarioTr}
            </p>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black text-amber-600">
                  Karşı Tarafın Sözü (Tetikleyici):
                </span>
                <button
                  type="button"
                  onClick={() => handleSpeak(currentDrill.situationPrompt)}
                  className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-slate-800 text-amber-800 dark:text-amber-300 transition cursor-pointer"
                  title="Sesli Dinle"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <InteractiveSentence
                sentence={currentDrill.situationPrompt}
                translation={currentDrill.situationPromptTr}
                language={currentDrill.language}
                showDictionaryBreakdown={false}
              />
            </div>
          </div>

          {/* Merkezi Aksiyon Alanı: Geri Sayım / Konuşma */}
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-amber-300 dark:border-amber-700/50 space-y-4">
            {drillState === 'idle' && (
              <div className="text-center space-y-4">
                <button
                  type="button"
                  onClick={handleStartReflex}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-purple-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/30 flex items-center space-x-3 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Zap className="w-5 h-5 fill-purple-950" />
                  <span>⚡ 3 Saniyede Refleksle Yanıtla</span>
                </button>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Butona bastığında 3'ten geriye sayılacak. Sayım bittiği an mikrofon açılır; hiç düşünmeden konuş!
                </p>
              </div>
            )}

            {drillState === 'countdown' && (
              <div className="text-center space-y-2">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-purple-950 flex items-center justify-center font-black text-4xl sm:text-5xl shadow-2xl animate-bounce">
                  {countdown}
                </div>
                <div className="text-sm font-black text-amber-600 dark:text-amber-400 animate-pulse">
                  Nefesini al, cevabını hazırla!
                </div>
              </div>
            )}

            {drillState === 'listening' && (
              <div className="text-center space-y-3">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl animate-pulse ring-8 ring-rose-400/40">
                    <Mic className="w-10 h-10 animate-bounce" />
                  </div>
                </div>
                <div className="text-base font-black text-rose-600 dark:text-rose-400">
                  ŞİMDİ KONUŞ! 🎙️
                </div>
                <div className="text-xs text-slate-400">
                  {userTranscript ? `"${userTranscript}"` : 'Seni dinliyorum, cümleyi sesli söyle...'}
                </div>
              </div>
            )}

            {drillState === 'evaluated' && evaluation && (
              <div className="w-full space-y-4 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">⏱️</span>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Tepki Süresi</div>
                      <div className="text-sm font-black text-purple-600 dark:text-purple-400">
                        {responseTime.toFixed(1)} saniye
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-black text-xs">
                    {evaluation.speedRating}
                  </div>

                  <div className="flex items-center space-x-1 text-emerald-600 font-black text-xs">
                    <Trophy className="w-4 h-4" />
                    <span>+{evaluation.xpEarned} XP</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 block">
                    Chirmo Refleks Analizi:
                  </span>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200">
                    {evaluation.feedbackTr}
                  </p>
                </div>

                {/* Önerilen Doğal Yanıt — İnteraktif Kelime Çevirisi & Cümle Sözlüğü */}
                <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-800 dark:text-blue-300">
                      Doğal Yerel Kalıp:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(currentDrill.suggestedAnswer)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer transition-transform active:scale-95"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Sesli Tekrar</span>
                    </button>
                  </div>
                  <InteractiveSentence
                    sentence={currentDrill.suggestedAnswer}
                    translation={currentDrill.suggestedAnswerTr}
                    language={currentDrill.language}
                    showDictionaryBreakdown={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alt Buton Barı */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={resetDrill}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla & Tekrar</span>
          </button>

          <button
            type="button"
            onClick={handleNextDrill}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-purple-950 font-black text-xs flex items-center space-x-1.5 shadow-md cursor-pointer active:scale-95 transition"
          >
            <span>Sonraki Refleks Görevi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
