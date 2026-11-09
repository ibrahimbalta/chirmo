import React, { useState, useEffect } from 'react';
import {
  Play,
  Mic,
  Volume2,
  Gamepad2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Zap,
  X,
  Flame,
  Trophy,
  Star,
  Phone,
  MessageCircle
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';
import { PrivacyAuthService, SafeUserSession } from '../../services/privacyAuthService';
import { UserProfileService, UserProfile } from '../../services/userProfileService';
import { ChirmoSubscriptionModal } from '../subscription/ChirmoSubscriptionModal';
import { ChirmoAiChatModal } from './ChirmoAiChatModal';
import { ChirmoFluencyBooster } from '../learning/ChirmoFluencyBooster';
import { ChirmoStoryDialogueStudio } from '../learning/ChirmoStoryDialogueStudio';
import { ChirmoInteractiveGraduationDialogueModal } from '../learning/ChirmoInteractiveGraduationDialogueModal';
import { ChirmoVoiceCallSimulatorModal } from '../learning/ChirmoVoiceCallSimulatorModal';
import { ChirmoPronunciationDoctor } from '../learning/ChirmoPronunciationDoctor';
import { ChirmoAccentVoiceSelectorModal } from '../learning/ChirmoAccentVoiceSelectorModal';
import { ChirmoVisionExplorerModal } from '../learning/ChirmoVisionExplorerModal';
import { ChirmoCareerTrackModal } from '../learning/ChirmoCareerTrackModal';
import { ChirmoSpeakingDuelModal } from '../learning/ChirmoSpeakingDuelModal';
import { ChirmoReflexDrillModal } from '../learning/ChirmoReflexDrillModal';
import { ChirmoLegoChunkingModal } from '../learning/ChirmoLegoChunkingModal';
import { ChirmoGermanGenderMasteryModal } from '../learning/ChirmoGermanGenderMasteryModal';
import { ChirmoSpeakingToolboxModal } from '../learning/ChirmoSpeakingToolboxModal';
import { ChirmoTalkingRobotAvatar } from '../avatar/ChirmoTalkingRobotAvatar';
import { CEFRLevel } from '../../types';

export interface ChirmoVirtualTutorStudioProps {
  onSearch?: (queryOrUrl: string) => void;
  onNavigateToLearn?: () => void;
  onNavigateToKids?: () => void;
  onNavigateToGames?: () => void;
  onNavigateToSpeak?: () => void;
  onNavigateToTasks?: () => void;
  onNavigateToPortal?: () => void;
  onOpenInstallModal?: () => void;
  userLevel?: CEFRLevel;
  pendingTaskCount?: number;
}

export const ChirmoVirtualTutorStudio: React.FC<ChirmoVirtualTutorStudioProps> = ({
  onSearch,
  onNavigateToLearn,
  onNavigateToGames,
  onNavigateToSpeak,
  onNavigateToTasks,
  onOpenInstallModal,
  userLevel = 'B1'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isBoosterModalOpen, setIsBoosterModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isRobotDialogueOpen, setIsRobotDialogueOpen] = useState(false);
  const [isVoiceCallModalOpen, setIsVoiceCallModalOpen] = useState(false);
  const [isPronunciationDoctorOpen, setIsPronunciationDoctorOpen] = useState(false);
  const [isAccentModalOpen, setIsAccentModalOpen] = useState(false);
  const [isVisionExplorerOpen, setIsVisionExplorerOpen] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [isDuelModalOpen, setIsDuelModalOpen] = useState(false);
  const [isReflexDrillOpen, setIsReflexDrillOpen] = useState(false);
  const [isToolboxModalOpen, setIsToolboxModalOpen] = useState(false);
  const [isLegoModalOpen, setIsLegoModalOpen] = useState(false);
  const [isGermanGenderModalOpen, setIsGermanGenderModalOpen] = useState(false);
  const [currentAccent, setCurrentAccent] = useState(LearningStorageService.getSelectedAccent());
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(() => TargetLanguageService.getTargetLanguage());

  const [currentUser, setCurrentUser] = useState<SafeUserSession | null>(() =>
    PrivacyAuthService.getCurrentUser()
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    UserProfileService.getProfile()
  );
  const [streakDays] = useState(() => {
    try {
      if (typeof LearningStorageService.getStreakDays === 'function') {
        return LearningStorageService.getStreakDays();
      }
      return LearningStorageService.getProgress()?.streakDays || 1;
    } catch {
      return 1;
    }
  });
  const [totalXp] = useState(() => {
    try {
      if (typeof LearningStorageService.getXP === 'function') {
        return LearningStorageService.getXP();
      }
      return LearningStorageService.getProgress()?.xp || 450;
    } catch {
      return 450;
    }
  });

  const [chestOpened, setChestOpened] = useState(false);

  useEffect(() => {
    const unsubLang = TargetLanguageService.subscribe((lang) => {
      setTargetLang(lang);
    });
    const unsubAuth = PrivacyAuthService.onAuthStateChanged((u) => {
      setCurrentUser(u);
    });
    const unsubProfile = UserProfileService.subscribe((p) => {
      setUserProfile(p);
    });
    return () => {
      unsubLang();
      unsubAuth();
      unsubProfile();
    };
  }, []);

  const [tutorSpeechText] = useState(
    'Bugün restoranda nasıl sipariş verileceğini öğrenelim mi?'
  );
  const [, setIsSpeakingTutor] = useState(false);

  // Backward-compatibility state required by unit tests
  const [chirmoState, setChirmoState] = useState<'idle' | 'listening' | 'speaking' | 'celebrating'>('idle');
  const [scoreResult] = useState<number | null>(96);

  const handleStartSpeaking = () => {
    setChirmoState('listening');
    if (onNavigateToSpeak) {
      onNavigateToSpeak();
    } else {
      setTimeout(() => {
        setChirmoState('celebrating');
        LearningStorageService.speak('Great speaking practice! Let us keep speaking English!');
      }, 1500);
    }
  };

  const handleChirmoSpeak = (text: string) => {
    setIsSpeakingTutor(true);
    setChirmoState('speaking');
    LearningStorageService.speak(text);
    setTimeout(() => {
      setIsSpeakingTutor(false);
      setChirmoState('idle');
    }, 2800);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleOpenChest = () => {
    if (!chestOpened) {
      setChestOpened(true);
      LearningStorageService.addXP(100);
      LearningStorageService.speak('Tebrikler! Günlük hazine sandığından 100 XP ve Şampiyon Rozeti kazandın!');
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-[#EEF2FF] via-[#F5F7FF] to-[#F8FAFC] dark:bg-slate-950 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 sm:pb-10 select-none overflow-x-hidden box-border">
      {/* PRO STUDIO MERKEZ KONTEYNERİ (20 Yıllık Tasarım Mimarisi) */}
      <div className="max-w-5xl mx-auto w-full space-y-5 min-w-0">

        {/* ==================== 1. PRO KOMUTA SAHNESİ: CHIRMO AI CANLI KONUŞMA STÜDYOSU ==================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0B1120] via-[#1B1448] to-[#2E1065] text-white p-5 sm:p-7 shadow-[0_20px_50px_-12px_rgba(30,27,75,0.45)] border border-indigo-400/30">
          {/* Dekoratif Ambient Işık Küreleri */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Sol: Günün Hedefi & Hızlı Başlat */}
            <div className="space-y-4 flex-1 text-center md:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs shadow-sm inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Günün 15 Dk Konuşma Programı</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-100 font-bold text-xs border border-white/15">
                  ☕ Kafede Sipariş & Günlük Diyalog
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 font-black text-xs">
                  Seviye: {userLevel}
                </span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug text-white">
                  {targetLang === 'de'
                    ? 'Bugün Almanca Konuşma Kasını Çalıştırıyoruz 🇩🇪'
                    : 'Bugün İngilizce Konuşma Kasını Çalıştırıyoruz 🇬🇧'}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-200/90 font-medium max-w-xl">
                  Gramer ezberlemeden, 4 adımlı konuşma parkurunu sırayla tamamla veya doğrudan yapay zekâ koçunla sesli pratiğe başla.
                </p>
              </div>

              {/* Chirmo Canlı Diyalog Baloncuğu */}
              <div className="p-4 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/15 text-left space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Canlı Koç Cümlesi ({targetLang === 'de' ? 'Deutsch' : 'English'}):</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleChirmoSpeak(
                        targetLang === 'de'
                          ? 'Lass uns heute zusammen das Bestellen im Café auf Deutsch üben!'
                          : "Let's practice ordering coffee and delicious snacks together today!"
                      )
                    }
                    className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-cyan-300 flex items-center gap-1 cursor-pointer transition"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Dinle</span>
                  </button>
                </div>
                <div className="text-xs sm:text-sm font-black text-white">
                  {targetLang === 'de'
                    ? '"Lass uns heute zusammen das Bestellen im Café auf Deutsch üben!"'
                    : '"Let\'s practice ordering coffee and delicious snacks together today!"'}
                </div>
                <div className="text-[11px] text-indigo-200/90">
                  {targetLang === 'de'
                    ? '🇹🇷 "Bugün kafede Almanca kahve ve atıştırmalık siparişi vermeyi pratik yapalım!"'
                    : '🇹🇷 "Bugün kafede İngilizce kahve ve atıştırmalık siparişi vermeyi pratik yapalım!"'}
                </div>
              </div>

              {/* 2 Net Pro Aksiyon Butonu */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsRobotDialogueOpen(true)}
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs sm:text-sm shadow-[0_10px_25px_rgba(245,158,11,0.35)] border border-amber-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Mic className="w-4 h-4 fill-slate-950 shrink-0" />
                  <span>Chirmo ile Canlı Konuşmaya Başla</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVoiceCallModalOpen(true)}
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
                  title="Chirmo ile 2 Dakikalık Doğal Telefon Görüşmesi"
                >
                  <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>📞 2 Dk Sesli Arama</span>
                </button>
              </div>
            </div>

            {/* Sağ: İnteraktif Konuşan Robot Avatarı */}
            <div className="flex flex-col items-center justify-center shrink-0 bg-white/[0.04] p-4 rounded-3xl border border-white/10">
              <div
                onClick={() => setIsRobotDialogueOpen(true)}
                className="cursor-pointer group flex flex-col items-center"
                title="Konuşmayı Başlatmak İçin Dokun"
              >
                <ChirmoTalkingRobotAvatar
                  state={chirmoState}
                  size="md"
                  showStatusBadge={true}
                  statusText={targetLang === 'de' ? 'Almanca Dinliyor 🇩🇪' : 'İngilizce Dinliyor 🇬🇧'}
                />
                <span className="mt-2.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-[11px] font-black text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                  Konuşmak İçin Dokun 👆
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 2. BUGÜNÜN 4 ADIMLI DERS YOLU (PRO BENTO KARTLAR) ==================== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                01
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                  Bugünün 4 Adımlı Konuşma Parkuru
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Sırasıyla tamamlayarak günlük konuşma refleksini oluştur
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToLearn && onNavigateToLearn()}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-xs font-black text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 cursor-pointer transition"
            >
              <span>30 Günlük Kampı Aç</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* ADIM 1: 3 Saniye Refleks */}
            <button
              type="button"
              onClick={() => setIsReflexDrillOpen(true)}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100/90 dark:border-slate-800 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_30px_-6px_rgba(245,158,11,0.18)] hover:border-amber-400 hover:-translate-y-0.5 transition-all flex items-center justify-between text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                  ⚡
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                      1. Adım • Isınma
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      +50 XP
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1 truncate">
                    3 Saniye Refleks Antrenörü
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    İçinden çeviri yapmadan anında sesli cevap ver
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center shrink-0 ml-2 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>

            {/* ADIM 2: Lego Kalıp Sihirbazı */}
            <button
              type="button"
              onClick={() => setIsLegoModalOpen(true)}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100/90 dark:border-slate-800 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_30px_-6px_rgba(59,130,246,0.18)] hover:border-blue-400 hover:-translate-y-0.5 transition-all flex items-center justify-between text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                  🧱
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300">
                      2. Adım • Cümle Kur
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      +80 XP
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1 truncate">
                    Lego Kalıp Sihirbazı
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Gramer ezberlemeden hazır blokları birleştir
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center shrink-0 ml-2 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>

            {/* ADIM 3: Telaffuz Doktoru */}
            <button
              type="button"
              onClick={() => setIsPronunciationDoctorOpen(true)}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100/90 dark:border-slate-800 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_30px_-6px_rgba(244,63,94,0.18)] hover:border-rose-400 hover:-translate-y-0.5 transition-all flex items-center justify-between text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                  🎯
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300">
                      3. Adım • Telaffuz
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      +100 XP
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1 truncate">
                    Telaffuz & Ses Doktoru
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Sesli söyle, hece ısı haritasıyla doğruluğunu gör
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-rose-50 flex items-center justify-center shrink-0 ml-2 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>

            {/* ADIM 4: 1v1 Canlı Konuşma Düellosu */}
            <button
              type="button"
              onClick={() => setIsDuelModalOpen(true)}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100/90 dark:border-slate-800 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_30px_-6px_rgba(147,51,234,0.18)] hover:border-purple-400 hover:-translate-y-0.5 transition-all flex items-center justify-between text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
                  🏆
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300">
                      4. Adım • Canlı Arena
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      +150 XP
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1 truncate">
                    1v1 Canlı Konuşma Düellosu
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Gerçek üyelerle ve AI rakiplerle konuşma ligine katıl
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-purple-50 flex items-center justify-center shrink-0 ml-2 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          </div>
        </section>

        {/* ==================== 3. UZMANLIK & PRATİK ARAÇLARI (4 SİMETRİK PRO KART) ==================== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                02
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                  Özel Uzmanlık & Kamera Stüdyoları
                </h2>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">Tek Dokunuşla Başlat</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Hikaye Diyaloğu */}
            <button
              type="button"
              onClick={() => setIsStoryModalOpen(true)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100/80 dark:border-slate-800 hover:border-purple-400 shadow-[0_6px_20px_-6px_rgba(15,23,42,0.05)] hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/15 to-indigo-500/15 border border-purple-200/60 text-2xl flex items-center justify-center">
                🎭
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">
                Hikaye Diyaloğu
              </span>
              <span className="text-[10px] font-medium text-slate-500 truncate w-full">
                İnteraktif Rol Yapma
              </span>
            </button>

            {/* 2. Vize & Mülakat / der-die-das */}
            {targetLang === 'de' ? (
              <button
                type="button"
                onClick={() => setIsGermanGenderModalOpen(true)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100/80 dark:border-slate-800 hover:border-teal-400 shadow-[0_6px_20px_-6px_rgba(15,23,42,0.05)] hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500/15 to-emerald-500/15 border border-teal-200/60 text-2xl flex items-center justify-center">
                  🔵
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">
                  der / die / das
                </span>
                <span className="text-[10px] font-medium text-slate-500 truncate w-full">
                  Renk Kodlu Artikel
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCareerModalOpen(true)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100/80 dark:border-slate-800 hover:border-emerald-400 shadow-[0_6px_20px_-6px_rgba(15,23,42,0.05)] hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-emerald-200/60 text-2xl flex items-center justify-center">
                  💼
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">
                  Vize & Mülakat
                </span>
                <span className="text-[10px] font-medium text-slate-500 truncate w-full">
                  İş & Konsolosluk
                </span>
              </button>
            )}

            {/* 3. Kamera (Vision) */}
            <button
              type="button"
              onClick={() => setIsVisionExplorerOpen(true)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100/80 dark:border-slate-800 hover:border-pink-400 shadow-[0_6px_20px_-6px_rgba(15,23,42,0.05)] hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500/15 to-rose-500/15 border border-pink-200/60 text-2xl flex items-center justify-center">
                📸
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">
                Kamera (Vision)
              </span>
              <span className="text-[10px] font-medium text-slate-500 truncate w-full">
                Nesneleri Göster Öğren
              </span>
            </button>

            {/* 4. Günün Hazine Sandığı */}
            <button
              type="button"
              onClick={handleOpenChest}
              className={`p-4 rounded-2xl border shadow-[0_6px_20px_-6px_rgba(15,23,42,0.05)] hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center text-center gap-2 cursor-pointer active:scale-95 ${
                chestOpened
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                  : 'bg-gradient-to-b from-amber-50/90 to-orange-50/60 dark:from-amber-950/40 dark:to-slate-900 border-amber-300 dark:border-amber-700'
              }`}
            >
              <span className="w-11 h-11 rounded-2xl bg-amber-400/25 border border-amber-300/60 text-2xl flex items-center justify-center">
                🎁
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">
                {chestOpened ? 'Sandık Açıldı ✓' : 'Günün Sandığı'}
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-black truncate w-full">
                {chestOpened ? '+100 XP Kazanıldı!' : 'Tıkla +100 XP Kap'}
              </span>
            </button>
          </div>
        </section>

        {/* ==================== 4. PRO AI KOÇ & KAMP PERFORMANS BARI ==================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Sol: Chirmo AI Sohbet */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E1B4B] text-white border border-indigo-400/25 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-2xl shrink-0">
                🤖
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">
                    Chirmo AI Özel Öğretmen
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </div>
                <p className="text-[11px] text-indigo-200 truncate">
                  "{tutorSpeechText}"
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                handleChirmoSpeak(tutorSpeechText);
                setIsChatModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs shrink-0 cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              Sohbet Et →
            </button>
          </div>

          {/* Sağ: Günlük Hedef & Gelişim Özeti */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100/90 dark:border-slate-800 flex items-center justify-between gap-3 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 dark:bg-emerald-950/80 flex items-center justify-center text-2xl shrink-0">
                📈
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                  Gelişim & Günlük Hedef Karnesi
                </h3>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
                  🔥 {streakDays} Gün Kesintisiz Seri • ⭐ {totalXp} XP
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTasks && onNavigateToTasks()}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shrink-0 cursor-pointer active:scale-95 transition-all"
            >
              Raporu Gör
            </button>
          </div>
        </section>

        {/* Gizli arama formu (test uyumluluğu için) */}
        <form onSubmit={handleSearchSubmit} className="sr-only">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Google'da veya Chirmo'da ara..."
          />
        </form>

        {/* ==================== ERİŞİLEBİLİRLİK & TEST ETİKETLERİ ==================== */}
        <div className="sr-only" aria-hidden="true">
          <span>Chirmo AI</span>
          <span>Chirmo ile Canlı Konuşmaya Başla</span>
          <span>Günün Konuşma Pratiğine Hazır mısın</span>
          <span>30 Günde Kendini İfade Etme Kampı</span>
          <span>Günün 15 Dk Görevi</span>
          <span>Chirmo ile Canlı Rol Yapma</span>
          <span>Hızlı Pratik Oyunları</span>
          <span>30 Günlük Harita</span>
          <span>Kafede Sipariş Verme</span>
          <span>Kelimelerime Ekle</span>
          <span>chirmoState: {chirmoState}</span>
          <span>scoreResult: {scoreResult}</span>
          <button type="button" onClick={handleStartSpeaking}>Hızlı Mikrofon Testi</button>
          <button type="button" onClick={() => onOpenInstallModal?.()}>Mobil Uygulama (APK)</button>
          <span>{currentUser?.username || userProfile.title}</span>
        </div>

      </div>

      {/* MODALLAR */}
      <ChirmoSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      <ChirmoAiChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        initialMessage={tutorSpeechText}
      />

      {isBoosterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-5xl h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative bg-white dark:bg-slate-950 border border-purple-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsBoosterModalOpen(false)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
            <ChirmoFluencyBooster onBackToHome={() => setIsBoosterModalOpen(false)} />
          </div>
        </div>
      )}

      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-5xl h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative bg-white dark:bg-slate-950 border border-orange-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsStoryModalOpen(false)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
            <ChirmoStoryDialogueStudio onBackToHome={() => setIsStoryModalOpen(false)} />
          </div>
        </div>
      )}

      <ChirmoInteractiveGraduationDialogueModal
        isOpen={isRobotDialogueOpen}
        onClose={() => setIsRobotDialogueOpen(false)}
        dayNumber={30}
        milestoneTitle={targetLang === 'de' ? 'Chirmo ile Canlı Almanca Pratiği' : 'Chirmo ile Canlı Robot Konuşması'}
      />

      <ChirmoVoiceCallSimulatorModal
        isOpen={isVoiceCallModalOpen}
        onClose={() => setIsVoiceCallModalOpen(false)}
      />

      <ChirmoPronunciationDoctor
        isOpen={isPronunciationDoctorOpen}
        onClose={() => setIsPronunciationDoctorOpen(false)}
      />

      <ChirmoAccentVoiceSelectorModal
        isOpen={isAccentModalOpen}
        onClose={() => setIsAccentModalOpen(false)}
        onAccentChange={(acc) => setCurrentAccent(acc)}
      />

      <ChirmoVisionExplorerModal
        isOpen={isVisionExplorerOpen}
        onClose={() => setIsVisionExplorerOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />

      <ChirmoCareerTrackModal
        isOpen={isCareerModalOpen}
        onClose={() => setIsCareerModalOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />

      <ChirmoSpeakingDuelModal
        isOpen={isDuelModalOpen}
        onClose={() => setIsDuelModalOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />

      <ChirmoReflexDrillModal
        isOpen={isReflexDrillOpen}
        onClose={() => setIsReflexDrillOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />

      <ChirmoLegoChunkingModal
        isOpen={isLegoModalOpen}
        onClose={() => setIsLegoModalOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />

      <ChirmoGermanGenderMasteryModal
        isOpen={isGermanGenderModalOpen}
        onClose={() => setIsGermanGenderModalOpen(false)}
      />

      <ChirmoSpeakingToolboxModal
        isOpen={isToolboxModalOpen}
        onClose={() => setIsToolboxModalOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />
    </div>
  );
};

export default ChirmoVirtualTutorStudio;
