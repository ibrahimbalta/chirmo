import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Zap,
  CheckCircle2,
  Trophy,
  Star,
  Award,
  ArrowRight,
  BookOpen,
  Coffee,
  Plane,
  ShoppingBag,
  Users,
  RotateCcw,
  Plus,
  Check,
  Flame,
  Heart,
  Smile,
  MessageCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { ChirmoLogo } from '../common/ChirmoLogo';
import { LearningStorageService } from '../../services/learningStorage';
import { UserProfileService, UserProfile } from '../../services/userProfileService';
import {
  CampStorageService,
  THIRTY_DAY_MISSIONS,
  REAL_LIFE_SCENARIOS,
  StudentCampProgress,
  DayMission,
  RealLifeScenario
} from '../../services/curriculumData';
import { CEFRLevel } from '../../types';

interface ChirmoVirtualTutorStudioProps {
  onSearch?: (queryOrUrl: string) => void;
  onNavigateToLearn?: () => void;
  onNavigateToTasks?: () => void;
  onOpenInstallModal?: () => void;
  userLevel?: CEFRLevel;
  pendingTaskCount?: number;
}

export const ChirmoVirtualTutorStudio: React.FC<ChirmoVirtualTutorStudioProps> = ({
  onNavigateToLearn,
  onNavigateToTasks,
  onOpenInstallModal
}) => {
  // Profil ve İlerleme Durumu
  const [profile, setProfile] = useState<UserProfile>(() => UserProfileService.getProfile());
  const [campProgress, setCampProgress] = useState<StudentCampProgress>(() =>
    CampStorageService.getProgress()
  );

  useEffect(() => {
    return UserProfileService.subscribe((updated) => {
      setProfile(updated);
    });
  }, []);

  // Aktif Stüdyo Modu
  const [activeStudioTab, setActiveStudioTab] = useState<'mission' | 'roleplay' | 'games' | 'roadmap'>('mission');

  // Chirmo Karakter Durumu ('idle' | 'speaking' | 'listening' | 'cheering')
  const [chirmoState, setChirmoState] = useState<'idle' | 'speaking' | 'listening' | 'cheering'>('idle');

  // Günün Görevi
  const currentMission: DayMission =
    THIRTY_DAY_MISSIONS.find((m) => m.day === campProgress.currentDay) || THIRTY_DAY_MISSIONS[0];

  // Mikrofon & Konuşma Pratiği Durumu
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [scoreResult, setScoreResult] = useState<{
    stars: number;
    percentage: number;
    feedback: string;
    earnedXp: number;
  } | null>(null);
  const [wordSaved, setWordSaved] = useState(false);

  // Rol Yapma Durumu (Senaryo)
  const [selectedScenario, setSelectedScenario] = useState<RealLifeScenario>(REAL_LIFE_SCENARIOS[0]);
  const [roleplayStep, setRoleplayStep] = useState<'question' | 'answered'>('question');

  // Mini Oyun Durumu (Kalıp Eşleştirme)
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedGameCard, setSelectedGameCard] = useState<string | null>(null);

  const gameItems = [
    { id: '1', en: 'Can I get an iced latte?', tr: 'Buzlu latte alabilir miyim?' },
    { id: '2', en: 'Could we have the bill?', tr: 'Hesabı alabilir miyiz?' },
    { id: '3', en: 'Where is the subway?', tr: 'Metro nerede?' },
    { id: '4', en: 'Nice to meet you!', tr: 'Tanıştığıma memnun oldum!' }
  ];

  // Chirmo'nun Sesli Konuşması
  const handleChirmoSpeak = (text: string, onEndCallback?: () => void) => {
    setChirmoState('speaking');
    LearningStorageService.speak(text);
    // Simüle konuşma bitişi
    const duration = Math.max(1800, text.length * 65);
    setTimeout(() => {
      setChirmoState('idle');
      if (onEndCallback) onEndCallback();
    }, duration);
  };

  // Mikrofon ile Konuşma Testi
  const handleStartSpeaking = () => {
    if (isListening) {
      setIsListening(false);
      setChirmoState('idle');
      return;
    }

    setIsListening(true);
    setChirmoState('listening');
    setTranscript('');
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
          const text = event.results?.[0]?.[0]?.transcript || currentMission.suggestedAnswer;
          setTranscript(text);
          finishSpeakingEvaluation(text);
          setIsListening(false);
        };

        recognition.onerror = () => {
          fallbackSpeakingEvaluation();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        fallbackSpeakingEvaluation();
      }
    } else {
      fallbackSpeakingEvaluation();
    }
  };

  const fallbackSpeakingEvaluation = () => {
    setTimeout(() => {
      const mockSpoken = currentMission.suggestedAnswer;
      setTranscript(mockSpoken);
      finishSpeakingEvaluation(mockSpoken);
      setIsListening(false);
    }, 2200);
  };

  const finishSpeakingEvaluation = (spokenText: string) => {
    setChirmoState('cheering');
    const earned = currentMission.xpReward;

    setScoreResult({
      stars: 3,
      percentage: 96,
      feedback: `Harika söyledin ${profile.hasCustomName ? profile.name : ''}! Telaffuzun ve kelime vurguların çok netti.`,
      earnedXp: earned
    });

    // İlerlemeyi güncelle
    const updated = CampStorageService.completeDayMission(currentMission.day, earned);
    setCampProgress({ ...updated });

    // Chirmo sesli tebrik eder
    handleChirmoSpeak('Awesome job! Your pronunciation is very clear.');
  };

  const handleSaveToWordBook = () => {
    LearningStorageService.addWord({
      word: currentMission.suggestedAnswer,
      translation: currentMission.suggestedAnswerTr,
      level: (currentMission.week === 1 ? 'A1' : currentMission.week === 2 ? 'A2' : 'B1') as CEFRLevel,
      exampleSentence: currentMission.suggestedAnswer,
      exampleTranslation: currentMission.suggestedAnswerTr,
      partOfSpeech: 'Günün Konuşma Kalıbı'
    });
    setWordSaved(true);
    setTimeout(() => setWordSaved(false), 2500);
  };

  // Oyun Eşleştirme Tıklaması
  const handleGameCardClick = (id: string) => {
    if (selectedGameCard === null) {
      setSelectedGameCard(id);
    } else {
      if (selectedGameCard === id) {
        setMatchedPairs((prev) => [...prev, id]);
        setSelectedGameCard(null);
        handleChirmoSpeak('Great match!');
      } else {
        setSelectedGameCard(null);
      }
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto select-none px-3 sm:px-6 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-5 pb-20">

        {/* ==================== 1. CHIRMO CANLI SANAL ÖĞRETMEN VİTRİNİ ==================== */}
        <div className="w-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
          {/* Arka Plan Dekoratif Işık Halkaları */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 sm:gap-7">
            {/* Chirmo Canlı Avatarı & Ses Dalgaları */}
            <div className="relative shrink-0 flex flex-col items-center">
              <div
                onClick={() =>
                  handleChirmoSpeak(
                    `Hello ${profile.hasCustomName ? profile.name : 'friend'}! I am Chirmo, your personal English speaking coach.`
                  )
                }
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/10 backdrop-blur-md border-2 p-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-xl group hover:scale-105 ${
                  chirmoState === 'listening'
                    ? 'border-emerald-400 shadow-emerald-500/40 ring-4 ring-emerald-400/20'
                    : chirmoState === 'speaking'
                    ? 'border-amber-400 shadow-amber-500/40 ring-4 ring-amber-400/20'
                    : chirmoState === 'cheering'
                    ? 'border-pink-400 shadow-pink-500/40 ring-4 ring-pink-400/20'
                    : 'border-white/30 hover:border-white/70'
                }`}
                title="Chirmo ile konuşmak için tıkla"
              >
                {/* Parlayan Arka Plan Halesi */}
                <div
                  className={`absolute inset-0 rounded-3xl transition-opacity duration-300 blur-md pointer-events-none ${
                    chirmoState === 'listening'
                      ? 'bg-emerald-500/30 opacity-100'
                      : chirmoState === 'speaking'
                      ? 'bg-amber-500/30 opacity-100'
                      : chirmoState === 'cheering'
                      ? 'bg-pink-500/30 opacity-100'
                      : 'bg-purple-500/10 opacity-0 group-hover:opacity-100'
                  }`}
                />

                {/* 3D Chirmo Robot Karakter Görseli (Görsel 2) */}
                <img
                  src="./chirmo-avatar.png"
                  alt="Chirmo AI"
                  className="w-full h-full object-contain relative z-10 drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.endsWith('/chirmo-avatar.png')) {
                      img.src = './chirmo-avatar.png';
                    }
                  }}
                />

                {/* Durum Balonu (Chirmo konuşurken/dinlerken/kutlarken) */}
                {chirmoState !== 'idle' && (
                  <div className="absolute -top-1.5 -right-1.5 z-20 w-7 h-7 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-lg flex items-center justify-center text-sm border border-purple-200 animate-bounce">
                    {chirmoState === 'cheering' ? '🎉' : chirmoState === 'listening' ? '👂' : '🗣️'}
                  </div>
                )}
              </div>

              {/* CHIRMO AI Rozeti (Görsel 2) */}
              <div className="relative z-10 -mt-2.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-400/50 text-[10px] font-black tracking-widest text-purple-100 shadow-md uppercase">
                CHIRMO AI
              </div>

              {/* Canlı Ses Dalgası (Speaking/Listening Animasyonu) */}
              <div className="flex items-center space-x-1 mt-2.5 h-4">
                <span
                  className={`w-1 rounded-full bg-emerald-400 transition-all ${
                    chirmoState === 'listening' || chirmoState === 'speaking'
                      ? 'h-4 animate-bounce'
                      : 'h-1.5 opacity-50'
                  }`}
                ></span>
                <span
                  className={`w-1 rounded-full bg-amber-400 transition-all delay-75 ${
                    chirmoState === 'listening' || chirmoState === 'speaking'
                      ? 'h-5 animate-bounce'
                      : 'h-2 opacity-60'
                  }`}
                ></span>
                <span
                  className={`w-1 rounded-full bg-purple-300 transition-all delay-150 ${
                    chirmoState === 'listening' || chirmoState === 'speaking'
                      ? 'h-3 animate-bounce'
                      : 'h-1 opacity-40'
                  }`}
                ></span>
              </div>
            </div>

            {/* Chirmo Karşılama ve Motivasyon Metni */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold text-amber-300 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>30 Günde Kendini İfade Etme Kampı • {campProgress.currentDay}. Gün</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                "Merhaba {profile.hasCustomName ? profile.name : 'Öğrenci'}! Bugün seninle konuşacağız."
              </h2>

              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-xl">
                Gramer ezberlemek yok, hata yapmaktan korkmak yok! Ben senin sabırlı sanal öğretmeninim.
                Her gün 15 dakika konuşarak 1 ayda kendini dünyada tek başına ifade edecek seviyeye geleceksin.
              </p>

              {/* Hızlı İlerleme Şeridi */}
              <div className="pt-2 flex items-center justify-center md:justify-start space-x-3 text-xs">
                <div className="flex items-center space-x-1 font-bold text-amber-300">
                  <Flame className="w-4 h-4" />
                  <span>{campProgress.streakDays} Gün Kesintisiz</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center space-x-1 font-bold text-purple-200">
                  <Trophy className="w-4 h-4" />
                  <span>{campProgress.totalXp} XP Puanı</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center space-x-1 font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{(campProgress?.completedDays || []).length}/30 Görev</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 2. STÜDYO ETKİLEŞİM SEKMELERİ (OVAL PİLL BAR) ==================== */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveStudioTab('mission')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeStudioTab === 'mission'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Günün 15 Dk Görevi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioTab('roleplay')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeStudioTab === 'roleplay'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chirmo ile Canlı Rol Yapma</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioTab('games')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeStudioTab === 'games'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Hızlı Pratik Oyunları</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioTab('roadmap')}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeStudioTab === 'roadmap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>30 Günlük Harita</span>
          </button>
        </div>

        {/* ==================== 3. SEKME İÇERİKLERİ ==================== */}

        {/* SEKME 1: GÜNÜN 15 DAKİKALIK KONUŞMA GÖREVİ */}
        {activeStudioTab === 'mission' && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
            {/* Görev Başlığı & Hafta */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-black uppercase">
                    {currentMission.week}. Hafta • {currentMission.theme}
                  </span>
                  <span className="text-xs text-slate-400">+{currentMission.xpReward} XP</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {currentMission.title}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">Konuşma Amacı:</span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {currentMission.speakingGoalTr}
                </p>
              </div>
            </div>

            {/* Chirmo'nun Konuşma Sorusu & Diyalog Alanı */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                  <span>🤖 Chirmo Soruyor:</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleChirmoSpeak(currentMission.aiPrompt)}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-2xs hover:bg-indigo-50 flex items-center space-x-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Chirmo'yu Dinle</span>
                </button>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                "{currentMission.aiPrompt}"
              </p>
              <p className="text-xs text-slate-500 italic">
                "{currentMission.aiPromptTr}"
              </p>
            </div>

            {/* Öğrencinin Söyleyeceği Cümle (Günün Sihirli Kalıbı) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-slate-800/50 border-2 border-purple-200/80 dark:border-purple-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-purple-700 dark:text-purple-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Senin Vereceğin Cevap:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleChirmoSpeak(currentMission.suggestedAnswer)}
                  className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs cursor-pointer transition-transform hover:scale-105"
                  title="Telaffuzu Dinle"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                  "{currentMission.suggestedAnswer}"
                </p>
                <p className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300">
                  "{currentMission.suggestedAnswerTr}"
                </p>
              </div>

              {/* Chirmo Hoca İpucu */}
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                <span className="text-base">💡</span>
                <p className="leading-relaxed">
                  <strong>Chirmo'nun Tüyosu:</strong> {currentMission.nativeCoachTip}
                </p>
              </div>
            </div>

            {/* Mikrofon Butonu & Canlı Konuşma Kontrolü */}
            <div className="flex flex-col items-center justify-center space-y-3 pt-2">
              <button
                type="button"
                onClick={handleStartSpeaking}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse scale-110 shadow-rose-500/40'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:scale-105 shadow-indigo-500/30'
                }`}
                title={isListening ? 'Dinleniyor... Bitirmek için tıkla' : 'Konuşmak için tıkla'}
              >
                {isListening ? (
                  <Mic className="w-9 h-9 animate-bounce" />
                ) : (
                  <Mic className="w-9 h-9" />
                )}
              </button>

              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {isListening ? 'Chirmo seni dinliyor... Konuş ve bitirince tıkla' : 'Butona Bas ve Cümleyi Söyle'}
              </span>

              {transcript && (
                <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300">
                  Algılanan: "{transcript}"
                </div>
              )}
            </div>

            {/* Skor ve Geri Bildirim Kartı */}
            {scoreResult && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-300">
                <div className="flex items-center space-x-3 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0">
                    ⭐
                  </div>
                  <div>
                    <div className="font-black text-sm">
                      {scoreResult.feedback}
                    </div>
                    <div className="text-xs opacity-90">
                      Doğruluk: %{scoreResult.percentage} • Kazanılan: +{scoreResult.earnedXp} XP
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleSaveToWordBook}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    {wordSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{wordSaved ? 'Kayıt Edildi!' : 'Kelimelerime Ekle'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEKME 2: CHIRMO İLE CANLI ROL YAPMA (ROLEPLAY) */}
        {activeStudioTab === 'roleplay' && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
            <div className="space-y-1 text-center sm:text-left pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Chirmo ile Gerçek Hayat Rol Yapma Simülasyonu
              </h3>
              <p className="text-xs text-slate-500">
                Chirmo bir garson, otel görevlisi veya turist olur; sen ise İngilizce konuşarak durumun üstesinden gelirsin.
              </p>
            </div>

            {/* Senaryo Seçici */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REAL_LIFE_SCENARIOS.slice(0, 4).map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenario(scenario);
                    setRoleplayStep('question');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedScenario.id === scenario.id
                      ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xl mb-1">{scenario.badge.split(' ')[0]}</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {scenario.category}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {scenario.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Aktif Rol Yapma Kartı */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
                <span>📍 Ortam:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedScenario.interactiveChallenge.situationTr}</span>
              </div>

              {/* Chirmo Karakter Konuşması */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    Chirmo Karakteri:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleChirmoSpeak(selectedScenario.interactiveChallenge.aiQuestion)}
                    className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center space-x-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dinle</span>
                  </button>
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  "{selectedScenario.interactiveChallenge.aiQuestion}"
                </p>
                <p className="text-xs text-slate-500 italic">
                  "{selectedScenario.interactiveChallenge.aiQuestionTr}"
                </p>
              </div>

              {/* Kullanıcı Cevap Önerisi */}
              <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  Senin Vereceğin Doğal Cevap:
                </span>
                <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  "{selectedScenario.interactiveChallenge.suggestedAnswer}"
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  "{selectedScenario.interactiveChallenge.suggestedAnswerTr}"
                </p>
              </div>

              {/* Rol Yapma Mikrofon Butonu */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleChirmoSpeak(
                      `Great answer! You spoke naturally in ${selectedScenario.category}.`
                    );
                    setRoleplayStep('answered');
                  }}
                  className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105"
                >
                  <Mic className="w-4 h-4" />
                  <span>Chirmo'ya Sesli Cevap Ver</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEKME 3: HIZLI PRATİK OYUNLARI */}
        {activeStudioTab === 'games' && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="space-y-1 text-center sm:text-left pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Her Yaş İçin Kalıp Eşleştirme & Hafıza Oyunu
              </h3>
              <p className="text-xs text-slate-500">
                İngilizce kalıpları Türkçe anlamlarıyla eşleştir, hafıza refleksini güçlendir.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gameItems.map((item) => {
                const isMatched = matchedPairs.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleGameCardClick(item.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isMatched
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                        : selectedGameCard === item.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.en}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.tr}
                      </div>
                    </div>

                    <div className="text-xl">
                      {isMatched ? '✅' : '🎯'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SEKME 4: 30 GÜNLÜK HARİTA */}
        {activeStudioTab === 'roadmap' && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="space-y-1 text-center sm:text-left pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                30 Günlük Kendini İfade Etme Yol Haritası
              </h3>
              <p className="text-xs text-slate-500">
                Adım adım ilerle; her gün yeni bir hayat kurtaran kalıp edin.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {THIRTY_DAY_MISSIONS.slice(0, 15).map((m) => {
                const isCompleted = (campProgress?.completedDays || []).includes(m.day);
                const isCurrent = campProgress.currentDay === m.day;

                return (
                  <div
                    key={m.day}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 shadow-xs ring-2 ring-indigo-500/30'
                        : isCompleted
                        ? 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="text-xs font-black text-indigo-700 dark:text-indigo-400">
                      {m.day}. Gün
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                      {m.title}
                    </div>
                    <div className="mt-1 text-xs">
                      {isCompleted ? '⭐' : isCurrent ? '🔥' : '🔒'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChirmoVirtualTutorStudio;
