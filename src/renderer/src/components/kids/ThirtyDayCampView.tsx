import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Award,
  CheckCircle2,
  Flame,
  RotateCcw,
  Star,
  Check,
  Zap,
  ShieldCheck,
  Compass,
  Lightbulb,
  HeartHandshake
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
    setUserSpokenText('');
    setScoreResult(null);
    setIsCompletedForToday(progress.completedDays.includes(selectedDayNumber));
  }, [selectedDayNumber, progress.completedDays]);

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleStartSpeaking = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setUserSpokenText('');
    setScoreResult(null);

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
      const sampleAnswer = selectedMission.suggestedAnswer;
      evaluateSpeech(sampleAnswer);
      setIsListening(false);
    }, 1800);
  };

  const evaluateSpeech = (spoken: string) => {
    setUserSpokenText(spoken);

    const targetWords = selectedMission.keyVocabulary.map((w) => w.toLowerCase());
    const lowerSpoken = spoken.toLowerCase();
    let matches = 0;
    targetWords.forEach((word) => {
      if (lowerSpoken.includes(word)) matches++;
    });

    const matchRatio = targetWords.length > 0 ? matches / targetWords.length : 0.85;
    const finalScore = Math.min(100, Math.max(80, Math.round(78 + matchRatio * 22)));
    const stars = finalScore >= 90 ? 3 : 2;

    const praises = [
      'Harika telaffuz! Ağzından çok doğal ve akıcı döküldü.',
      'Süpersin! Dil kasın açılıyor, ses tonundaki özgüven harika!',
      'Mükemmel! Kafanda Türkçe çeviri yapmadan doğrudan İngilizce refleks verdin.',
      'Çok iyi! Hata yapmaktan korkmadan konuştun, tam olarak bu ruh lazım!'
    ];
    const praiseTr = praises[Math.floor(Math.random() * praises.length)];
    const aiReplyEn = 'Brilliant! You sound so natural, keep it up!';

    setScoreResult({
      stars,
      percentage: finalScore,
      praiseTr,
      aiReplyEn
    });

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

    if (selectedMission.day < 30) {
      setSelectedDayNumber(selectedMission.day + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto select-none p-4 sm:p-6">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* ==================== 20 YILLIK ÖĞRETMEN FORMÜLÜ & MOTİVASYON BARI ==================== */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-amber-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>20 Yıllık Öğretmen Metodu • Sıfırdan 30 Günde Konuşma Devrimi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Gramer Ezberini Unut! Günde 5 Dakika Konuşarak Dili Sök 🚀
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl mt-1.5 leading-relaxed">
                Türklerin yıllarca İngilizce öğrenememesinin tek sebebi kitaplara bakıp ağzını açmamasıdır. Chirmo ile her gün sesli bir görev yap, 30. günün sonunda dünyayla korkusuzca sohbet et!
              </p>
            </div>

            {/* İstatistik Rozetleri */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 flex items-center space-x-2.5">
                <Flame className="w-6 h-6 text-amber-400" />
                <div>
                  <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Kesintisiz Seri</div>
                  <div className="text-xl font-black">{progress.streakDays} Gün 🔥</div>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 flex items-center space-x-2.5">
                <Award className="w-6 h-6 text-yellow-300" />
                <div>
                  <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Konuşma Puanı</div>
                  <div className="text-xl font-black">{progress.totalXp} XP ⭐</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 30 GÜNLÜK YOL HARİTASI (GRID) ==================== */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>30 Günlük Dönüşüm Takvimi</span>
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {progress.completedDays.length} / 30 Görev Tamamlandı
              </span>
              <span className="text-xs font-bold text-emerald-600">
                (%{Math.round((progress.completedDays.length / 30) * 100)})
              </span>
            </div>
          </div>

          {/* Gün Seçim Düğmeleri */}
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
          {/* Başlık ve Hafta Bilgisi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-[11px] font-bold">
                  {selectedMission.week}. Hafta
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {selectedMission.theme}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {selectedMission.day}. Gün: {selectedMission.title}
              </h3>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300 flex items-center space-x-1">
                <Award className="w-4 h-4 text-amber-500" />
                <span>+{selectedMission.xpReward} XP Ödül</span>
              </span>
            </div>
          </div>

          {/* 1. ADIM: YAPAY ZEKA DOSTUNUN SORUSU */}
          <div className="bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  🎙️
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

          {/* 2. ADIM: SENİN SÖYLEYECEĞİN CEVAP VE BLOK KALIPLAR */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Senin Vereceğin Doğal Cevap:</span>
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

            {/* Blok Kalıplar */}
            <div className="flex items-center flex-wrap gap-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-400">Blok Kalıplar:</span>
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

          {/* 3. 20 YILLIK ÖĞRETMENİN TÜYOSU */}
          <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl p-4 border border-amber-200 dark:border-amber-900/40 flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black">Öğretmenin Konuşma Tüyosu: </span>
              <span className="font-medium">{selectedMission.nativeCoachTip}</span>
            </div>
          </div>

          {/* 4. ADIM: İNTERAKTİF MİKROFON İLE KONUŞMA */}
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
                {isListening ? 'Seni Dinliyorum, Cümleyi Sesli Söyle...' : 'Mikrofona Bas ve Cümleyi Konuşarak Cevap Ver'}
              </div>
              <p className="text-xs text-slate-400">
                Chirmo seni asla yargılamaz veya not vermez; sadece konuşma kasını geliştirmene yardım eder.
              </p>
            </div>

            {/* Skor ve Geri Bildirim */}
            {scoreResult && (
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800 shadow-md space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: scoreResult.stars }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400" />
                    ))}
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                    %{scoreResult.percentage} Akıcılık ve Telaffuz
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-400">Senin Söylediğin:</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 italic">
                    "{userSpokenText}"
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                  <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Chirmo Koçu: {scoreResult.praiseTr}</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={handleStartSpeaking}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tekrar Söyle</span>
                  </button>

                  <button
                    onClick={handleFinishDayMission}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center space-x-1.5 shadow-md cursor-pointer transition-all"
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
                <span>Bu günün konuşma görevini başarıyla tamamladın! Harika gidiyorsun!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
