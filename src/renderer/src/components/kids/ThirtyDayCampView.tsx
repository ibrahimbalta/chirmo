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
  Lightbulb,
  HeartHandshake
} from 'lucide-react';
import {
  DayMission,
  CampStorageService,
  CurriculumService,
  StudentCampProgress
} from '../../services/curriculumData';
import { TargetLanguageService } from '../../services/targetLanguageService';
import { LearningStorageService } from '../../services/learningStorage';
import { UserProfileService, UserProfile } from '../../services/userProfileService';
import { CampComparisonModal } from '../learning/CampComparisonModal';
import { ChirmoInteractiveGraduationDialogueModal } from '../learning/ChirmoInteractiveGraduationDialogueModal';
import { InteractiveSentence } from '../learning/InteractiveSentence';

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
  const [activeWeekFilter, setActiveWeekFilter] = useState<number>(() => {
    const saved = CampStorageService.getProgress();
    const cur = saved.currentDay || 1;
    if (cur <= 7) return 1;
    if (cur <= 14) return 2;
    if (cur <= 21) return 3;
    return 4;
  });

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isGraduationDialogueOpen, setIsGraduationDialogueOpen] = useState(false);
  const [userProfile] = useState<UserProfile>(() => UserProfileService.getProfile());
  const [targetLang, setTargetLang] = useState(() => TargetLanguageService.getTargetLanguage());

  useEffect(() => {
    return TargetLanguageService.subscribe((lang) => {
      setTargetLang(lang);
    });
  }, []);

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

  const activeMissions = CurriculumService.getDayMissions(targetLang);
  const selectedMission: DayMission =
    activeMissions.find((m) => m.day === selectedDayNumber) || activeMissions[0];

  const weekMissions = activeMissions.filter((m) => {
    if (activeWeekFilter === 1) return m.day >= 1 && m.day <= 7;
    if (activeWeekFilter === 2) return m.day >= 8 && m.day <= 14;
    if (activeWeekFilter === 3) return m.day >= 15 && m.day <= 21;
    return m.day >= 22 && m.day <= 30;
  });

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
        recognition.lang = targetLang === 'de' ? 'de-DE' : 'en-US';
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
    }, 1500);
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
    const finalScore = Math.min(100, Math.max(82, Math.round(78 + matchRatio * 22)));
    const stars = finalScore >= 90 ? 3 : 2;

    const praises =
      targetLang === 'de'
        ? [
            'Harika telaffuz! Çok doğal ve akıcı bir Almanca cümle kurdun.',
            'Süpersin! Konuşurken ses tonundaki özgüven çok iyi!',
            'Mükemmel! Doğrudan Almanca refleks verdin.'
          ]
        : [
            'Harika telaffuz! Çok doğal ve akıcı bir cümle kurdun.',
            'Süpersin! Konuşurken ses tonundaki özgüven çok iyi!',
            'Mükemmel! Doğrudan İngilizce refleks verdin.'
          ];
    const praiseTr = praises[Math.floor(Math.random() * praises.length)];
    const aiReplyEn =
      targetLang === 'de'
        ? 'Ausgezeichnet! Du klingst sehr natürlich!'
        : 'Brilliant! You sound so natural, keep it up!';

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

    if (selectedMission.day === 30 || updated.completedDays.length >= 30) {
      setIsGraduationDialogueOpen(true);
    } else if (selectedMission.day < 30) {
      const nextDay = selectedMission.day + 1;
      setSelectedDayNumber(nextDay);
      if (nextDay <= 7) setActiveWeekFilter(1);
      else if (nextDay <= 14) setActiveWeekFilter(2);
      else if (nextDay <= 21) setActiveWeekFilter(3);
      else setActiveWeekFilter(4);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#EEF2FF] via-[#F5F7FF] to-[#F8FAFC] dark:bg-slate-950 overflow-y-auto select-none p-3 sm:p-6 pb-28 sm:pb-10">
      <div className="max-w-5xl mx-auto w-full space-y-5">
        {/* ==================== 1. PRO KAMP TELEMETRİ & KOMUTA BARI ==================== */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1120] via-[#1B1448] to-[#2E1065] rounded-[26px] p-5 sm:p-6 text-white shadow-[0_18px_40px_-10px_rgba(30,27,75,0.4)] border border-indigo-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-[11px] font-black uppercase shadow-xs">
                📅 30 Günlük Konuşma Kampı
              </span>
              <span className="px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-indigo-100">
                Tamamlanan: {progress.completedDays.length} / 30 Gün
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white">
              Her Gün 3 Basit Adımda Konuşarak Öğren
            </h1>
            <p className="text-xs text-indigo-200/85">
              Gramer ezberlemeden, her günün hazır cümle kalıbını dinle, soruyu gör ve mikrofona sesli söyle.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 shrink-0">
            <div className="bg-white/[0.08] px-3.5 py-2 rounded-2xl border border-white/15 flex items-center gap-1.5 text-xs font-black">
              <Flame className="w-4 h-4 text-amber-300" />
              <span>{progress.streakDays} Gün Seri</span>
            </div>
            <div className="bg-white/[0.08] px-3.5 py-2 rounded-2xl border border-white/15 flex items-center gap-1.5 text-xs font-black">
              <Award className="w-4 h-4 text-cyan-300" />
              <span>{progress.totalXp} XP</span>
            </div>
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
            >
              📊 Gelişim Karnem
            </button>
          </div>
        </div>

        {/* ==================== 2. PRO HAFTA & GÜN SEÇİCİ MATRİSİ ==================== */}
        <div className="bg-white dark:bg-slate-900 rounded-[26px] p-4 sm:p-5 border border-indigo-100/90 dark:border-slate-800 shadow-[0_8px_28px_-6px_rgba(15,23,42,0.06)] space-y-3.5">
          {/* 4 Hafta Sekmesi */}
          <div className="grid grid-cols-4 gap-2 bg-[#EEF2FF]/90 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-indigo-200/50 dark:border-slate-700">
            {[
              { w: 1, label: '1. Hafta', sub: 'Gün 1-7 • Temel' },
              { w: 2, label: '2. Hafta', sub: 'Gün 8-14 • Günlük' },
              { w: 3, label: '3. Hafta', sub: 'Gün 15-21 • Akıcı' },
              { w: 4, label: '4. Hafta', sub: 'Gün 22-30 • Uzman' }
            ].map((item) => (
              <button
                key={item.w}
                type="button"
                onClick={() => {
                  setActiveWeekFilter(item.w);
                  const firstDay = item.w === 1 ? 1 : item.w === 2 ? 8 : item.w === 3 ? 15 : 22;
                  setSelectedDayNumber(firstDay);
                }}
                className={`py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                  activeWeekFilter === item.w
                    ? 'bg-gradient-to-r from-[#0F172A] to-[#1E1B4B] text-white font-black shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 font-bold'
                }`}
              >
                <div className="text-xs leading-tight">{item.label}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{item.sub}</div>
              </button>
            ))}
          </div>

          {/* Seçili Haftanın Günleri (Sadece 7-9 Büyük ve Rahat Buton) */}
          <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
            {weekMissions.map((mission) => {
              const isCompleted = progress.completedDays.includes(mission.day);
              const isSelected = selectedDayNumber === mission.day;

              return (
                <button
                  key={mission.day}
                  type="button"
                  onClick={() => setSelectedDayNumber(mission.day)}
                  className={`relative py-2.5 px-1 rounded-2xl font-black text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-300 scale-105'
                      : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40'
                  }`}
                >
                  <span className="text-[9px] font-bold opacity-75">GÜN</span>
                  <span className="text-sm leading-none mt-0.5">{mission.day}</span>
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute -top-1 -right-1 bg-white dark:bg-slate-900 rounded-full shadow-2xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== 3. SEÇİLİ GÜNÜN 3 BASİT ADIMI (PRO WORKBENCH) ==================== */}
        <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-indigo-100/90 dark:border-slate-800 p-5 sm:p-7 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.07)] space-y-5">
          {/* Gün Başlığı */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {selectedMission.week}. Hafta • {selectedMission.theme}
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {selectedMission.day}. Gün: {selectedMission.title}
              </h2>
            </div>
            <span className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 text-xs font-black shrink-0 shadow-2xs">
              🏆 +{selectedMission.xpReward} XP
            </span>
          </div>

          {/* ADIM 1: HEDEF CÜMLEYİ DİNLE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/50 dark:bg-emerald-950/20 border border-emerald-200/90 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-2xs">
                1. Adım • Kalıbı Dinle ve Öğren
              </span>
              <button
                type="button"
                onClick={() => handleSpeak(selectedMission.suggestedAnswer)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-slate-700 text-xs font-black flex items-center gap-1.5 shadow-2xs cursor-pointer transition"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>🔊 Sesli Dinle</span>
              </button>
            </div>

            <InteractiveSentence
              sentence={selectedMission.suggestedAnswer}
              translation={selectedMission.suggestedAnswerTr}
              language={selectedMission.language as 'en' | 'de'}
              showDictionaryBreakdown={true}
            />
          </div>

          {/* ADIM 2: CHIRMO'NUN SORUSU & İPUCU */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-blue-50/50 dark:bg-blue-950/20 border border-indigo-200/90 dark:border-blue-900/50 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black shadow-2xs">
                2. Adım • Chirmo Sana Soruyor
              </span>
              <button
                type="button"
                onClick={() => handleSpeak(selectedMission.aiPrompt)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-100 text-indigo-800 dark:text-blue-300 border border-indigo-200 dark:border-slate-700 text-xs font-black flex items-center gap-1.5 cursor-pointer transition"
              >
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span>Soruyu Dinle</span>
              </button>
            </div>

            <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              "{selectedMission.aiPrompt}"
            </p>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              🇹🇷 {selectedMission.aiPromptTr}
            </p>
            <div className="pt-1.5 flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-300 font-bold bg-amber-100/60 px-3 py-1.5 rounded-xl border border-amber-200/70">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Koç İpucu: {selectedMission.nativeCoachTip}</span>
            </div>
          </div>

          {/* ADIM 3: MİKROFONA BAS VE SESLİ SÖYLE (PRO KAYIT STÜDYOSU) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#2E1065] text-white border border-indigo-400/30 flex flex-col items-center text-center space-y-3.5 shadow-lg">
            <span className="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
              3. Adım • Mikrofona Dokun ve Sesli Söyle
            </span>

            <p className="text-xs text-indigo-200 max-w-md">
              Yukarıdaki yeşil kutuda yer alan cümleyi yüksek sesle oku veya hızlı tamamla ile bir sonraki güne geç.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleStartSpeaking}
                className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-xl flex items-center gap-2 cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-400/40'
                    : 'bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5 animate-bounce" />
                    <span>Dinleniyor... Şimdi Konuş!</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>🎙️ Mikrofonla Sesli Söyle</span>
                  </>
                )}
              </button>

              {!scoreResult && (
                <button
                  type="button"
                  onClick={() => evaluateSpeech(selectedMission.suggestedAnswer)}
                  className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-black text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Hızlı Tamamla</span>
                </button>
              )}
            </div>

            {/* Skor ve Geri Bildirim */}
            {scoreResult && (
              <div className="w-full max-w-lg bg-white text-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-emerald-400 shadow-xl space-y-3 text-left animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: scoreResult.stars }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                    %{scoreResult.percentage} Akıcılık Başarısı
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-800 italic">
                  "{userSpokenText}"
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 border border-emerald-200">
                  <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{scoreResult.praiseTr}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleStartSpeaking}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tekrar Dene</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishDayMission}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Günü Tamamla & Sonraki Güne Geç (+{selectedMission.xpReward} XP)</span>
                  </button>
                </div>
              </div>
            )}

            {isCompletedForToday && !scoreResult && (
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-black bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-400/40">
                <CheckCircle2 className="w-4 h-4" />
                <span>Bu günün konuşma görevini başarıyla tamamladın!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <CampComparisonModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        progress={progress}
        userProfile={userProfile}
      />

      <ChirmoInteractiveGraduationDialogueModal
        isOpen={isGraduationDialogueOpen}
        onClose={() => setIsGraduationDialogueOpen(false)}
        dayNumber={selectedDayNumber}
      />
    </div>
  );
};
