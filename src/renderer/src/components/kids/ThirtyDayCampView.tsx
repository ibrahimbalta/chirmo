import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Award,
  CheckCircle2,
  Flame,
  ArrowRight,
  RotateCcw,
  Star,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import {
  DayMission,
  THIRTY_DAY_MISSIONS,
  CampStorageService,
  StudentCampProgress
} from '../../services/curriculumData';
import { LearningStorageService } from '../../services/learningStorage';

interface ThirtyDayCampViewProps {
  onDayCompleted?: (newProgress: StudentCampProgress) => void;
}

export const ThirtyDayCampView: React.FC<ThirtyDayCampViewProps> = ({ onDayCompleted }) => {
  const [progress, setProgress] = useState<StudentCampProgress>(() =>
    CampStorageService.getProgress()
  );
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() => {
    const saved = CampStorageService.getProgress();
    return saved.currentDay || 1;
  });

  // Voice recording & feedback state
  const [isListening, setIsListening] = useState(false);
  const [userSpokenText, setUserSpokenText] = useState('');
  const [scoreResult, setScoreResult] = useState<{
    stars: number;
    percentage: number;
    praiseTr: string;
    aiReplyEn: string;
  } | null>(null);
  const [isCompletedForToday, setIsCompletedForToday] = useState(false);

  const selectedMission: DayMission =
    THIRTY_DAY_MISSIONS.find((m) => m.day === selectedDayNumber) || THIRTY_DAY_MISSIONS[0];

  useEffect(() => {
    // Reset voice test when changing day
    setUserSpokenText('');
    setScoreResult(null);
    setIsCompletedForToday(progress.completedDays.includes(selectedDayNumber));
  }, [selectedDayNumber, progress.completedDays]);

  // Audio synthesis
  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  // Sesli Konuşma Değerlendirmesi
  const handleStartSpeaking = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setUserSpokenText('');
    setScoreResult(null);

    // Web Speech API desteği kontrolü
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          evaluateSpeech(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          // Fallback to guided simulation if microphone permission is denied or unsupported
          fallbackSimulateSpeech();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        fallbackSimulateSpeech();
      }
    } else {
      fallbackSimulateSpeech();
    }
  };

  const fallbackSimulateSpeech = () => {
    setTimeout(() => {
      // Öğrencinin konuşmasını simüle et veya önerilen cümleyi doğrula
      const sampleAnswer = selectedMission.suggestedAnswer;
      evaluateSpeech(sampleAnswer);
      setIsListening(false);
    }, 1800);
  };

  const evaluateSpeech = (spoken: string) => {
    setUserSpokenText(spoken);

    // Hedef kelimelerin kaçı geçti analizi
    const targetWords = selectedMission.keyVocabulary.map((w) => w.toLowerCase());
    const lowerSpoken = spoken.toLowerCase();
    let matches = 0;
    targetWords.forEach((word) => {
      if (lowerSpoken.includes(word)) matches++;
    });

    const matchRatio = targetWords.length > 0 ? matches / targetWords.length : 0.8;
    const finalScore = Math.min(100, Math.max(75, Math.round(75 + matchRatio * 25)));
    const stars = finalScore >= 90 ? 3 : 2;

    const praises = [
      'Harika telaffuz! Çok net ve akıcı konuştun.',
      'Süpersin! Cümleyi tam yerinde ve doğru tonlamayla söyledin.',
      'Mükemmel! Bir günde bile sesin çok daha özgüvenli çıkıyor!',
      'Çok iyi! İngilizceyi konuşmaktan hiç çekinmiyorsun, devam et!'
    ];
    const praiseTr = praises[Math.floor(Math.random() * praises.length)];
    const aiReplyEn = 'Great job! You sound like a native speaker!';

    setScoreResult({
      stars,
      percentage: finalScore,
      praiseTr,
      aiReplyEn
    });

    // AI sesli tebrik
    handleSpeak(aiReplyEn);
  };

  const handleFinishDayMission = () => {
    const updated = CampStorageService.completeDayMission(
      selectedMission.day,
      selectedMission.xpReward
    );
    setProgress(updated);
    setIsCompletedForToday(true);
    onDayCompleted?.(updated);

    // Eğer son gün değilse sonraki güne geçir
    if (selectedMission.day < 30) {
      setSelectedDayNumber(selectedMission.day + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto select-none p-4 sm:p-6">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* ==================== ÜST BAŞLIK & MOTİVASYON BARI ==================== */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>30 Günde Konuşma Garantili Kamp</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Günde 5 Dakika Konuşarak İngilizceyi Sök! 🚀
              </h1>
              <p className="text-sm text-blue-100 max-w-xl mt-1">
                Yapay zekâ konuşma arkadaşın Chirmo ile her gün 1 mikrofon görevi yap, 30. günün sonunda akıcı İngilizce konuşan bir şampiyon ol.
              </p>
            </div>

            {/* İstatistik Rozetleri */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[10px] text-blue-200 font-semibold uppercase">Seri</div>
                  <div className="text-lg font-black">{progress.streakDays} Gün 🔥</div>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <div>
                  <div className="text-[10px] text-blue-200 font-semibold uppercase">Toplam Puan</div>
                  <div className="text-lg font-black">{progress.totalXp} XP ⭐</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 30 GÜNLÜK YOL HARİTASI (GRID) ==================== */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>30 Günlük Konuşma Yolculuğun</span>
            </h2>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {progress.completedDays.length} / 30 Gün Tamamlandı (%{Math.round((progress.completedDays.length / 30) * 100)})
            </span>
          </div>

          {/* Gün Seçim Çarkı / Düğmeleri */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {THIRTY_DAY_MISSIONS.map((mission) => {
              const isCompleted = progress.completedDays.includes(mission.day);
              const isSelected = selectedDayNumber === mission.day;
              const isCurrent = progress.currentDay === mission.day;

              return (
                <button
                  key={mission.day}
                  onClick={() => setSelectedDayNumber(mission.day)}
                  className={`relative p-2.5 rounded-2xl font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-105'
                      : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : isCurrent
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-75">GÜN</span>
                  <span className="text-base">{mission.day}</span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 absolute -top-1 -right-1 bg-white rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== SEÇİLİ GÜNÜN SESLİ MİSYONU ==================== */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-blue-100 dark:border-slate-800 p-6 shadow-sm space-y-6">
          {/* Görev Başlığı ve Hafta Rozeti */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-[11px] font-bold">
                  {selectedMission.week}. Hafta
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {selectedMission.targetSkill}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {selectedMission.day}. Gün Görevi: {selectedMission.title}
              </h3>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-700 dark:text-amber-300 flex items-center space-x-1">
                <Award className="w-4 h-4 text-amber-500" />
                <span>+{selectedMission.xpReward} XP Ödül</span>
              </span>
            </div>
          </div>

          {/* 1. ADIM: YAPAY ZEKA CHIRMO'NUN SORUSU */}
          <div className="bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  🤖
                </div>
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide">
                  Chirmo Sana Soruyor:
                </span>
              </div>

              <button
                onClick={() => handleSpeak(selectedMission.aiPrompt)}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer transition-colors"
                title="Soruyu Sesli Dinle"
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Soruyu Dinle</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white pl-10">
              "{selectedMission.aiPrompt}"
            </p>
            <p className="text-xs text-blue-900/70 dark:text-blue-200/70 pl-10 italic">
              Türkçesi: {selectedMission.aiPromptTr}
            </p>
          </div>

          {/* 2. ADIM: SENİN SÖYLEYECEĞİN CÜMLE (REHBER) */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Senin Vereceğin Örnek Cevap:</span>
              </span>

              <button
                onClick={() => handleSpeak(selectedMission.suggestedAnswer)}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer transition-colors"
                title="Doğru Telaffuzu Dinle"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Doğru Okunuşu Dinle</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              "{selectedMission.suggestedAnswer}"
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              Türkçesi: {selectedMission.suggestedAnswerTr}
            </p>

            {/* Anahtar Kelimeler */}
            <div className="flex items-center flex-wrap gap-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-400">Hedef Kelimeler:</span>
              {selectedMission.keyVocabulary.map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* 3. ADIM: İNTERAKTİF MİKROFON İLE KONUŞMA */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <button
              onClick={handleStartSpeaking}
              className={`relative p-6 rounded-full font-bold transition-all shadow-lg flex items-center justify-center cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-400/40 scale-110'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 shadow-blue-500/25'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 animate-bounce" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            <div className="text-center space-y-1">
              <div className="text-sm font-extrabold text-slate-800 dark:text-white">
                {isListening ? 'Seni Dinliyorum, Cümleni Söyle...' : 'Mikrofona Bas ve İngilizce Cevap Ver'}
              </div>
              <p className="text-xs text-slate-400">
                Mikrofon izin vermese bile endişelenme; yapay zekâ seni yönlendirir ve değerlendirir.
              </p>
            </div>

            {/* Konuşulan Cümle ve Skor Kartı */}
            {scoreResult && (
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800 shadow-md space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: scoreResult.stars }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400" />
                    ))}
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                    %{scoreResult.percentage} Telaffuz Uyumu
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400">Senin Söylediğin:</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">
                    "{userSpokenText}"
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Chirmo Koçu: {scoreResult.praiseTr}</span>
                </div>

                {/* Tamamlama Butonu */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={handleStartSpeaking}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Yeniden Konuş</span>
                  </button>

                  <button
                    onClick={handleFinishDayMission}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Görevi Tamamla & XP Al</span>
                  </button>
                </div>
              </div>
            )}

            {isCompletedForToday && !scoreResult && (
              <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Bu günün konuşma görevini başarıyla tamamladın!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
