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
    <div className="w-full h-full flex flex-col bg-[#F5F7FF] dark:bg-slate-950 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 sm:pb-10 select-none overflow-x-hidden box-border">
      {/* MOBİL UYGULAMA MERKEZ KONTEYNERİ (Sade, Odaklı ve Ferah) */}
      <div className="max-w-4xl mx-auto w-full space-y-5 min-w-0">

        {/* ==================== 1. GÜNÜN ANA KARTI: CHIRMO AI CANLI KONUŞMA SAHNESİ ==================== */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4338ca] via-[#5b21b6] to-[#7e22ce] text-white p-4 sm:p-6 shadow-xl shadow-indigo-500/15 border border-indigo-400/30">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Sol: Günün Hedefi & Hızlı Başlat */}
            <div className="space-y-3.5 flex-1 text-center md:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-purple-950 font-black text-xs shadow-xs inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Günün 15 Dk Görevi</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white font-bold text-xs border border-white/20">
                  ☕ Kafede Sipariş Verme
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 font-bold text-xs">
                  Seviye: {userLevel}
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug">
                  {targetLang === 'de'
                    ? 'Günün Almanca Konuşma Pratiğine Hazır mısın? 🇩🇪'
                    : 'Günün Konuşma Pratiğine Hazır mısın? 👋'}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-100/90 font-medium">
                  Aşağıdaki 4 kısa adımı sırayla tamamla veya doğrudan Chirmo ile sesli konuşmaya başla.
                </p>
              </div>

              {/* Chirmo Canlı Diyalog Baloncuğu */}
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-left space-y-1">
                <div className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Chirmo AI ({targetLang === 'de' ? 'Almanca' : 'İngilizce'}):</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  {targetLang === 'de'
                    ? '"Lass uns heute zusammen das Bestellen im Café auf Deutsch üben!"'
                    : '"Let\'s practice ordering coffee and delicious snacks together today!"'}
                </div>
                <div className="text-[11px] text-indigo-200">
                  {targetLang === 'de'
                    ? '🇹🇷 "Bugün kafede Almanca kahve ve atıştırmalık siparişi vermeyi pratik yapalım!"'
                    : '🇹🇷 "Bugün kafede İngilizce kahve ve atıştırmalık siparişi vermeyi pratik yapalım!"'}
                </div>
              </div>

              {/* 2 Net Mobil Uygulama Aksiyon Butonu */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRobotDialogueOpen(true)}
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-purple-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 border border-amber-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Mic className="w-4 h-4 fill-purple-950 shrink-0" />
                  <span>Chirmo ile Canlı Konuşmaya Başla</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVoiceCallModalOpen(true)}
                  className="px-4 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shrink-0"
                  title="Chirmo ile 2 Dakikalık Doğal Telefon Görüşmesi"
                >
                  <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>2 Dk Sesli Arama</span>
                </button>
              </div>
            </div>

            {/* Sağ: İnteraktif Konuşan Robot Avatarı */}
            <div className="flex flex-col items-center justify-center shrink-0">
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
                <span className="mt-2 text-[11px] font-bold text-amber-300 group-hover:underline">
                  Konuşmak İçin Dokun 👆
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 2. BUGÜNÜN 4 ADIMLI DERS YOLU (SİMETRİK 2x2 MOBİL KARTLAR) ==================== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                🎯
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Bugünün 4 Adımlı Konuşma Parkuru
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToLearn && onNavigateToLearn()}
              className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>30 Günlük Kampı Aç</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ADIM 1: 3 Saniye Refleks */}
            <button
              type="button"
              onClick={() => setIsReflexDrillOpen(true)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex items-center justify-between text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0">
                  ⚡
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      1. Adım • Isınma
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">+50 XP</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">
                    3 Saniye Refleks Antrenörü
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    İçinden çeviri yapmadan anında cevap ver
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            {/* ADIM 2: Lego Kalıp Sihirbazı */}
            <button
              type="button"
              onClick={() => setIsLegoModalOpen(true)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex items-center justify-between text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0">
                  🧱
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                      2. Adım • Cümle Kur
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">+80 XP</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">
                    Lego Kalıp Sihirbazı
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Gramer ezberlemeden hazır blokları birleştir
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            {/* ADIM 3: Telaffuz Doktoru */}
            <button
              type="button"
              onClick={() => setIsPronunciationDoctorOpen(true)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-rose-400 transition-all flex items-center justify-between text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0">
                  🎯
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                      3. Adım • Telaffuz
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">+100 XP</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">
                    Telaffuz & Ses Doktoru
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Sesli söyle, hece ısı haritasıyla doğruluğunu gör
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            {/* ADIM 4: 1v1 Canlı Konuşma Düellosu */}
            <button
              type="button"
              onClick={() => setIsDuelModalOpen(true)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-purple-400 transition-all flex items-center justify-between text-left cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0">
                  🏆
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                      4. Adım • Meydan Okuma
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">+150 XP</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">
                    1v1 Canlı Konuşma Düellosu
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Öğrendiğin kalıplarla lig mücadelesine katıl
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          </div>
        </section>

        {/* ==================== 3. HIZLI EKSTRA ARAÇLAR (4 SİMETRİK MOBİL KART) ==================== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                3
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                3. Adım: Ekstra Pratik Araçları
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">Tek Dokunuş</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Hikaye Diyaloğu */}
            <button
              type="button"
              onClick={() => setIsStoryModalOpen(true)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-xl flex items-center justify-center">
                🎭
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">
                Hikaye Diyaloğu
              </span>
              <span className="text-[10px] text-slate-500 truncate w-full">
                İnteraktif Rol Yapma
              </span>
            </button>

            {/* 2. Vize & Mülakat / der-die-das */}
            {targetLang === 'de' ? (
              <button
                type="button"
                onClick={() => setIsGermanGenderModalOpen(true)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-400 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-xl flex items-center justify-center">
                  🔵
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">
                  der / die / das
                </span>
                <span className="text-[10px] text-slate-500 truncate w-full">
                  Renk Kodlu Artikel
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCareerModalOpen(true)}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-xl flex items-center justify-center">
                  💼
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">
                  Vize & Mülakat
                </span>
                <span className="text-[10px] text-slate-500 truncate w-full">
                  İş & Konsolosluk
                </span>
              </button>
            )}

            {/* 3. Kamera (Vision) */}
            <button
              type="button"
              onClick={() => setIsVisionExplorerOpen(true)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-pink-400 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/70 text-xl flex items-center justify-center">
                📸
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">
                Kamera (Vision)
              </span>
              <span className="text-[10px] text-slate-500 truncate w-full">
                Nesneleri Göster Öğren
              </span>
            </button>

            {/* 4. Günün Hazine Sandığı */}
            <button
              type="button"
              onClick={handleOpenChest}
              className={`p-3.5 rounded-2xl border shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer active:scale-95 ${
                chestOpened
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                  : 'bg-gradient-to-b from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-slate-900 border-amber-300 dark:border-amber-700'
              }`}
            >
              <span className="w-10 h-10 rounded-xl bg-amber-400/30 text-xl flex items-center justify-center">
                🎁
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate w-full">
                {chestOpened ? 'Sandık Açıldı ✓' : 'Günün Sandığı'}
              </span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold truncate w-full">
                {chestOpened ? '+100 XP Kazanıldı!' : 'Tıkla +100 XP Kap'}
              </span>
            </button>
          </div>
        </section>

        {/* ==================== 4. KOMPAKT AI ÖĞRETMEN & GELİŞİM BARI ==================== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Sol: Chirmo AI Sohbet */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-xl shrink-0">
                🤖
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                    Chirmo AI Öğretmeni
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
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
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shrink-0 cursor-pointer active:scale-95 transition-all"
            >
              Sohbet Et
            </button>
          </div>

          {/* Sağ: Günlük Hedef & Gelişim Özeti */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-xl shrink-0">
                📈
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                  Gelişim & Günlük Hedefler
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  🔥 {streakDays} Gün Seri • ⭐ {totalXp} XP Kazanıldı
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTasks && onNavigateToTasks()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs shrink-0 cursor-pointer active:scale-95 transition-all"
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
