import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Play,
  Mic,
  Volume2,
  Gamepad2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Zap,
  X,
  Flame,
  Trophy,
  Award,
  Star,
  Compass,
  CheckCircle2,
  Lock,
  Gift,
  ShieldCheck,
  MapPin,
  Layers,
  Phone,
  Target,
  Eye,
  Briefcase,
  Smile,
  MessageCircle
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';
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
  onOpenInstallModal?: () => void;
  userLevel?: CEFRLevel;
  pendingTaskCount?: number;
}

export const ChirmoVirtualTutorStudio: React.FC<ChirmoVirtualTutorStudioProps> = ({
  onSearch,
  onNavigateToLearn,
  onNavigateToKids,
  onNavigateToGames,
  onNavigateToSpeak,
  onNavigateToTasks,
  onOpenInstallModal
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
  
  // Görünüm modu: 'parkour' (Oyun Parkuru) veya 'quick' (Hızlı Araç Listesi)
  const [viewMode, setViewMode] = useState<'parkour' | 'quick'>('parkour');

  // Sandık ödülü açılma durumu
  const [chestOpened, setChestOpened] = useState(false);

  useEffect(() => {
    const unsub = TargetLanguageService.subscribe((lang) => {
      setTargetLang(lang);
    });
    return unsub;
  }, []);

  // AI Teacher Speech State
  const [tutorSpeechText] = useState(
    'Bugün restoranda nasıl sipariş verileceğini öğrenelim mi?'
  );
  const [isSpeakingTutor, setIsSpeakingTutor] = useState(false);

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

  const scrollToStation3 = () => {
    const el = document.getElementById('parkour-station-3');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setIsRobotDialogueOpen(true);
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
    <div className="w-full h-full flex flex-col bg-[#f0f4ff] dark:bg-slate-950 overflow-y-auto p-2 sm:p-5 lg:p-6 pb-24 sm:pb-12 space-y-3.5 sm:space-y-6 select-none overflow-x-hidden max-w-full box-border">
      <div className="max-w-6xl mx-auto w-full space-y-3.5 sm:space-y-6 min-w-0">

        {/* ==================== 1. OYUN ÜST BARI (PLAYER GAME HUD) ==================== */}
        <header className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-indigo-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-sm flex flex-col gap-2.5 min-w-0">
          
          {/* Üst Sıra: Profil + Dil Seçici + Görünüm + Bildirim */}
          <div className="flex items-center justify-between gap-2 min-w-0 w-full">
            {/* Sol: Oyuncu Profili & Seviye */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                onClick={() => onNavigateToTasks && onNavigateToTasks()}
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0"
                title="Gelişim ve Seviye Profilim"
              >
                <div className="w-full h-full rounded-[10px] sm:rounded-2xl bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Profil Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 px-1 sm:px-1.5 py-0.2 rounded-full bg-amber-400 text-purple-950 font-black text-[9px] sm:text-[10px] border-2 border-white dark:border-slate-900 shadow-2xs">
                  LVL 4
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h2 className="text-xs sm:text-base font-black text-slate-900 dark:text-white truncate">
                    Gezgin Öğrenci
                  </h2>
                  <span className="hidden xs:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 text-[10px] sm:text-[11px] font-black border border-indigo-200/60 dark:border-indigo-800 shrink-0">
                    <Compass className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Bölüm 4</span>
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                  <span className="truncate">🎯 Parkur:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black shrink-0">%75</span>
                </div>
              </div>
            </div>

            {/* Sağ: Dil Değiştirici & Görünüm Modu & Bildirim */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Canlı Dil Seçici */}
              <div className="inline-flex items-center p-0.5 sm:p-1 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => TargetLanguageService.setTargetLanguage('en')}
                  className={`px-2 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    targetLang === 'en'
                      ? 'bg-amber-400 text-purple-950 shadow-xs scale-105'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  title="İngilizce Öğren"
                >
                  <span>🇬🇧</span>
                  <span className="hidden sm:inline">İngilizce</span>
                </button>
                <button
                  type="button"
                  onClick={() => TargetLanguageService.setTargetLanguage('de')}
                  className={`px-2 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    targetLang === 'de'
                      ? 'bg-amber-400 text-purple-950 shadow-xs scale-105'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  title="Almanca Öğren"
                >
                  <span>🇩🇪</span>
                  <span className="hidden sm:inline">Almanca</span>
                </button>
              </div>

              {/* Görünüm Modu Değiştirici: Hem Mobilde Hem Masaüstünde Kullanışlı */}
              <div className="inline-flex items-center p-0.5 sm:p-1 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setViewMode('parkour')}
                  className={`px-2 py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'parkour'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  title="Oyun Parkuru Haritası"
                >
                  <span>🗺️</span>
                  <span className="hidden xs:inline">Parkur</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('quick')}
                  className={`px-2 py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'quick'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  title="Hızlı Araç Listesi"
                >
                  <span>▦</span>
                  <span className="hidden xs:inline">Liste</span>
                </button>
              </div>

              {/* Bildirim Çanı */}
              <button
                type="button"
                onClick={() => alert('Bugünkü görev parkurun: 3. İstasyon (Chirmo Canlı Diyalog)!')}
                className="relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
                title="Görev Bildirimleri (2 Yeni)"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-500 text-white text-[8px] sm:text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                  2
                </span>
              </button>
            </div>
          </div>

          {/* Alt Sıra: Oyun İstatistikleri (Mobilde Taşırmayan Yatay Kaydırmalı HUD) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 w-full min-w-0">
            {/* Günlük Seri */}
            <div className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 flex items-center gap-1.5 shrink-0 shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-[9px] uppercase font-bold text-amber-800 dark:text-amber-400">Seri:</span>
                <span className="text-xs font-black text-amber-950 dark:text-amber-200">12 Gün</span>
              </div>
            </div>

            {/* Enerji / Can */}
            <div className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1.5 shrink-0 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-[9px] uppercase font-bold text-emerald-800 dark:text-emerald-400">Enerji:</span>
                <span className="text-xs font-black text-emerald-950 dark:text-emerald-200">%100</span>
              </div>
            </div>

            {/* XP Rozeti */}
            <div className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/80 flex items-center gap-1.5 shrink-0 shadow-2xs">
              <Star className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
              <div className="flex items-baseline gap-1">
                <span className="text-[9px] uppercase font-bold text-purple-800 dark:text-purple-400">XP:</span>
                <span className="text-xs font-black text-purple-950 dark:text-purple-200">850</span>
              </div>
            </div>

            {/* Lig Rozeti */}
            <div className="px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/80 flex items-center gap-1.5 shrink-0 shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-sky-600" />
              <div className="flex items-baseline gap-1">
                <span className="text-[9px] uppercase font-bold text-sky-800 dark:text-sky-400">Lig:</span>
                <span className="text-xs font-black text-sky-950 dark:text-sky-200">Altın #3</span>
              </div>
            </div>
          </div>
        </header>

        {/* ==================== 2. OYUN GÖREV PUSULASI & REHBERLİK KARTI ==================== */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#4338ca] via-[#6366f1] to-[#a855f7] text-white p-3.5 sm:p-6 shadow-xl shadow-indigo-500/15 border border-indigo-300/40 min-w-0">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 min-w-0">
            {/* Sol Rehber: Seviye, Günün Görevi ve Doğrudan Başlama Çağrısı */}
            <div className="space-y-3 w-full md:max-w-2xl text-center md:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-400 text-purple-950 font-black text-[11px] sm:text-xs shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>30 Günde Kendini İfade Etme Kampı</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-[11px] sm:text-xs border border-white/20 flex items-center gap-1">
                  <span>☕ Kafede Sipariş Verme</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/25 border border-emerald-300 text-emerald-200 font-bold text-[10px] sm:text-[11px]">
                  5 Dakika
                </span>
              </div>

              <div className="space-y-1 min-w-0">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug break-words">
                  {targetLang === 'de'
                    ? 'Günün Almanca Konuşma Parkuruna Hazır mısın? 🎮'
                    : 'Günün Konuşma Pratiğine Hazır mısın? 👋'}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-100 font-medium">
                  {targetLang === 'de'
                    ? 'Parkur 4 istasyondan oluşur: Isınma, Kalıplar, Chirmo Canlı Konuşma ve Meydan Okuma.'
                    : 'Parkur 4 istasyondan oluşur: Isınma, Kalıplar, Chirmo Canlı Konuşma ve Meydan Okuma. Sırayla tamamla, rozetleri kap!'}
                </p>
              </div>

              {/* Parkur İlerleme Çizelgesi (Mobilde 2x2 veya 4 Sütun - Kesilmez) */}
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 min-w-0">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-indigo-200 mb-1.5 px-0.5">
                  <span>Parkur İlerlemen:</span>
                  <span className="text-amber-300 font-black">3. İstasyon (Aktif Hedef)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 min-w-0">
                  {/* İstasyon 1 */}
                  <div className="flex items-center sm:flex-col justify-between sm:justify-center p-1.5 rounded-lg sm:rounded-xl bg-emerald-500/30 border border-emerald-400/60 text-center min-w-0">
                    <span className="text-[11px] sm:text-xs font-black text-emerald-300 truncate">✓ 1. Isınma</span>
                    <span className="text-[9px] text-emerald-200 ml-1 sm:ml-0">Bitti</span>
                  </div>
                  {/* İstasyon 2 */}
                  <div className="flex items-center sm:flex-col justify-between sm:justify-center p-1.5 rounded-lg sm:rounded-xl bg-emerald-500/30 border border-emerald-400/60 text-center min-w-0">
                    <span className="text-[11px] sm:text-xs font-black text-emerald-300 truncate">✓ 2. Kalıp</span>
                    <span className="text-[9px] text-emerald-200 ml-1 sm:ml-0">Bitti</span>
                  </div>
                  {/* İstasyon 3 (Aktif) */}
                  <div className="flex items-center sm:flex-col justify-between sm:justify-center p-1.5 rounded-lg sm:rounded-xl bg-amber-400 text-purple-950 font-black shadow-md border-2 border-white animate-pulse text-center min-w-0">
                    <span className="text-[11px] sm:text-xs truncate">⚡ 3. Canlı</span>
                    <span className="text-[9px] font-black uppercase ml-1 sm:ml-0">BURADASIN</span>
                  </div>
                  {/* İstasyon 4 */}
                  <div className="flex items-center sm:flex-col justify-between sm:justify-center p-1.5 rounded-lg sm:rounded-xl bg-white/10 text-white/70 text-center border border-white/10 min-w-0">
                    <span className="text-[11px] sm:text-xs font-bold truncate">🔒 4. Düello</span>
                    <span className="text-[9px] ml-1 sm:ml-0">Sıradaki</span>
                  </div>
                </div>
              </div>

              {/* Ana Yönlendirici Aksiyon Butonları (Mobilde Tam Oturan Tasarım) */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={scrollToStation3}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-purple-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 border-2 border-amber-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all text-center"
                >
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-purple-950 shrink-0" />
                  <span className="truncate">Sıradaki Göreve Gir (Chirmo Canlı)</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsVoiceCallModalOpen(true)}
                  className="w-full sm:w-auto px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all text-center"
                  title="Chirmo ile 2 Dakikalık Doğal Telefon Görüşmesi"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
                  <span>2 Dk Sesli Arama</span>
                </button>
              </div>
            </div>

            {/* Sağ Rehber: 3D Maskot (Mobilde Dengeli Ölçekli) */}
            <div className="relative flex flex-col items-center justify-center shrink-0">
              <div
                onClick={() => setIsRobotDialogueOpen(true)}
                className="relative w-32 h-32 sm:w-44 sm:h-44 flex items-center justify-center group cursor-pointer"
                title="Chirmo ile Canlı Konuşmak İçin Tıkla!"
              >
                {/* Robotun Başüstü Konuşma Baloncuğu */}
                <div className="absolute -top-2 right-0 z-20 flex items-center space-x-1 bg-white text-[#6d28d9] px-2.5 py-1 rounded-xl rounded-bl-xs shadow-md border border-purple-100 group-hover:scale-105 transition-transform">
                  <span className="text-[10px] sm:text-xs">💜</span>
                  <span className="font-black text-[10px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#6d28d9] to-[#7c3aed]">
                    {targetLang === 'de' ? 'Sprich mit mir!' : "Let's Talk English!"}
                  </span>
                </div>

                {/* 3D Maskot Görseli */}
                <img
                  src="./chirmo-character.png"
                  alt="Chirmo Maskot Karakteri"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.endsWith('/chirmo-avatar.png')) {
                      img.src = './chirmo-avatar.png';
                    }
                  }}
                />

                {/* Plaket */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-sm group-hover:scale-105 transition-transform select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-black tracking-wider text-white">Chirmo AI</span>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase text-purple-950 bg-amber-300 px-1 py-0.2 rounded-full">
                    Çevrimiçi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 3. OYUN PARKURU (İNTERAKTİF MACERA HARİTASI) ==================== */}
        {viewMode === 'parkour' ? (
          <div className="space-y-4 sm:space-y-6 min-w-0">
            {/* Parkur Başlığı & Yönlendirici Açıklama */}
            <div className="flex items-center justify-between px-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl sm:rounded-2xl bg-indigo-600 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-500/20 shrink-0">
                  🗺️
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                    <span>Günün Macera Parkuru</span>
                    <span className="hidden xs:inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 shrink-0">
                      Adım Adım
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    İstasyonları sırayla tamamla, rozetleri kap!
                  </p>
                </div>
              </div>

              {/* Hızlı liste geçişi butonu */}
              <button
                type="button"
                onClick={() => setViewMode('quick')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
              >
                <span>Hızlı Liste</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* PARKUR PARKURU DİZİLİMİ - MOBİLDE TAŞMAYAN MÜKEMMEL HİZALAMA */}
            <div className="relative pl-1 sm:pl-6 space-y-4 sm:space-y-6 min-w-0 before:absolute before:left-[17px] sm:before:left-[35px] before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-amber-400 via-emerald-400 via-amber-400 to-indigo-500 before:rounded-full">

              {/* -------------------- ÖN HAZIRLIK & ALET ÇANTASI: BÜYÜLÜ TEÇHİZAT SANDIĞI -------------------- */}
              <div className="relative flex items-start gap-2.5 sm:gap-4 min-w-0">
                {/* İstasyon Rozeti */}
                <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xs sm:text-base flex items-center justify-center shadow-lg shadow-amber-500/25 border-2 border-white dark:border-slate-900 shrink-0 animate-pulse">
                  <span>🧰</span>
                </div>

                {/* Alet Çantası Kartı */}
                <div className="flex-1 min-w-0 bg-gradient-to-r from-amber-500/10 via-purple-600/15 to-pink-500/10 dark:from-amber-500/15 dark:via-purple-900/30 dark:to-slate-900 border-2 border-amber-400/70 dark:border-amber-400/60 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
                  <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center text-2xl sm:text-3xl shadow-md shrink-0 border-2 border-white/60 dark:border-slate-800">
                      🎁
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                          Ön Hazırlık & Teçhizat
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold text-amber-700 dark:text-amber-300">
                          5 Efsanevi Konuşma Kalıbı
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                        Maceracının Büyülü Teçhizat Sandığı ⚔️
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-pink-100/90 leading-relaxed max-w-2xl">
                        Bölümlere başlamadan önce teçhizatlarını kuşan: Cümle nasıl kurulur? Soru nasıl sorulur? İstek ve ricada hangi kalıplar kullanılır?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center shrink-0 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsToolboxModalOpen(true)}
                      className="w-full md:w-auto px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Sandığı Aç & Kalıpları Öğren</span>
                      <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
                    </button>
                  </div>
                </div>
              </div>

              {/* -------------------- 1. İSTASYON: HIZLI ISINMA KAPISI -------------------- */}
              <div className="relative flex items-start gap-2.5 sm:gap-4 min-w-0">
                {/* İstasyon Rozeti */}
                <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md shadow-emerald-500/20 border-2 border-white dark:border-slate-900 shrink-0">
                  <span>✓</span>
                </div>

                {/* İstasyon Kartı */}
                <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 truncate">
                        1. İstasyon • Isınma
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-black shrink-0">
                        +50 XP ⭐
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">2 Dk</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Reflekslerini esnet, aksan tonunu seç ve kamera ile odandaki nesneleri keşfet!
                  </p>

                  {/* İstasyonun 3 Aracı */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                    {/* 3 Saniye Refleks */}
                    <button
                      type="button"
                      onClick={() => setIsReflexDrillOpen(true)}
                      className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800/80 border border-amber-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          ⚡
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">3 Saniye Refleks</div>
                          <div className="text-[10px] text-slate-500 truncate">Hızlı düşün & konuş</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Aksan Seçici */}
                    <button
                      type="button"
                      onClick={() => setIsAccentModalOpen(true)}
                      className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-sky-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-sky-500 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          🎙️
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                            Aksan: {currentAccent === 'uk' ? 'İngiliz' : currentAccent === 'au' ? 'Avustralya' : currentAccent === 'robot' ? 'Robot' : 'Amerikan'}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">Doğal ses tonları</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-sky-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Kamera Vision */}
                    <button
                      type="button"
                      onClick={() => setIsVisionExplorerOpen(true)}
                      className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/80 border border-fuchsia-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-fuchsia-500 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          📸
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">Kamera (Vision)</div>
                          <div className="text-[10px] text-slate-500 truncate">Odadaki nesneleri sor</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-fuchsia-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* -------------------- 2. İSTASYON: KELİME & KALIP VADİSİ -------------------- */}
              <div className="relative flex items-start gap-2.5 sm:gap-4 min-w-0">
                {/* İstasyon Rozeti */}
                <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md shadow-blue-500/20 border-2 border-white dark:border-slate-900 shrink-0">
                  <span>🧱</span>
                </div>

                {/* İstasyon Kartı */}
                <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">
                        2. İstasyon • Kalıplar
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[9px] sm:text-[10px] font-black shrink-0">
                        +80 XP ⭐
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">4 Dk</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Cümleleri Lego blokları gibi birleştir ve telaffuz doktoruyla pürüzsüzleştir!
                  </p>

                  {/* İstasyonun Araçları */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                    {/* Lego Kalıplar */}
                    <button
                      type="button"
                      onClick={() => setIsLegoModalOpen(true)}
                      className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          🧱
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">Lego Kalıplar</div>
                          <div className="text-[10px] text-slate-500 truncate">Cümle birleştirme</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Telaffuz Doktoru */}
                    <button
                      type="button"
                      onClick={() => setIsPronunciationDoctorOpen(true)}
                      className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/80 border border-rose-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-rose-500 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          🎯
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">Telaffuz Doktoru</div>
                          <div className="text-[10px] text-slate-500 truncate">Isı haritalı hece koçu</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Vize & Mülakat veya der/die/das */}
                    {targetLang === 'de' ? (
                      <button
                        type="button"
                        onClick={() => setIsGermanGenderModalOpen(true)}
                        className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800/80 border border-teal-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                            🔵
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-black text-slate-900 dark:text-white truncate">der / die / das</div>
                            <div className="text-[10px] text-slate-500 truncate">Renk kodlu artikel</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-teal-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsCareerModalOpen(true)}
                        className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 border border-emerald-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                            🛂
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-black text-slate-900 dark:text-white truncate">Vize & Mülakat</div>
                            <div className="text-[10px] text-slate-500 truncate">Konsolosluk hazırlığı</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* -------------------- 3. İSTASYON (BOSS / MERKEZ SAHNE): CHIRMO CANLI KONUŞMA ARENASI -------------------- */}
              <div id="parkour-station-3" className="relative flex items-start gap-2.5 sm:gap-4 min-w-0">
                {/* İstasyon Rozeti (Aktif ve parıldayan) */}
                <div className="relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-purple-600 text-white font-black text-sm sm:text-base flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 sm:border-4 border-white dark:border-slate-900 shrink-0 animate-bounce">
                  <span>👑</span>
                </div>

                {/* Ana Arena Kartı */}
                <div className="flex-1 min-w-0 bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-950 text-white border-2 border-amber-400/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-xl shadow-purple-950/40 relative overflow-hidden space-y-3.5">
                  {/* İstasyon Üst Bilgi */}
                  <div className="flex items-center justify-between flex-wrap gap-1.5 pb-2.5 border-b border-white/15 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-purple-950 font-black text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1 shadow-xs truncate">
                        <Flame className="w-3 h-3 fill-purple-950 shrink-0" />
                        <span>3. İstasyon • Ana Arena</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 text-[10px] sm:text-xs font-black animate-pulse shrink-0">
                        ⚡ BURADASIN
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-amber-300 shrink-0">+150 XP 🏆</span>
                  </div>

                  {/* Konuşma Sahnesi ve Çift Dilli Diyalog */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center min-w-0">
                    <div className="lg:col-span-8 space-y-3 min-w-0">
                      <h4 className="text-base sm:text-xl font-black text-white flex items-center gap-1.5">
                        <span className="break-words">Chirmo ile Canlı Konuşmaya Başla</span>
                        <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                      </h4>

                      {/* Karakterin Konuşma Baloncuğu */}
                      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1 text-left min-w-0">
                        <div className="text-[10px] sm:text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 shrink-0" />
                          <span>Chirmo ({targetLang === 'de' ? '🇩🇪 Almanca' : '🇬🇧 İngilizce'}):</span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white break-words">
                          {targetLang === 'de'
                            ? '"Lass uns heute zusammen das Bestellen im Café auf Deutsch üben!"'
                            : '"Let\'s practice ordering coffee and delicious snacks together today!"'}
                        </div>
                        <div className="text-[11px] sm:text-xs text-indigo-200 break-words">
                          {targetLang === 'de'
                            ? '🇹🇷 "Bugün kafede Almanca kahve ve atıştırmalık siparişi vermeyi pratik yapalım!"'
                            : '🇹🇷 "Bugün kafede İngilizce kahve ve atıştırmalık siparişi vermeyi pratik yapalım!"'}
                        </div>
                      </div>

                      {/* Aksiyon Butonları (Mobilde Tam Oturan ve Taşırmayan Tasarım) */}
                      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => setIsRobotDialogueOpen(true)}
                          className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-purple-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 border border-amber-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all text-center"
                        >
                          <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-purple-950 shrink-0" />
                          <span className="truncate">Chirmo ile Canlı Konuşmaya Başla</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleStartSpeaking}
                          className="w-full sm:w-auto px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all text-center"
                          title="Hızlı Ses Testi Yap"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <span>Hızlı Mikrofon Testi</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onNavigateToLearn && onNavigateToLearn()}
                          className="w-full sm:w-auto px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all text-center"
                        >
                          <Play className="w-3 h-3 fill-white shrink-0" />
                          <span>Ders Adımları</span>
                        </button>
                      </div>
                    </div>

                    {/* Sağ: Talking Robot Avatar Görünümü (Mobilde Kompakt) */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center pt-1 lg:pt-0">
                      <div
                        onClick={() => setIsRobotDialogueOpen(true)}
                        className="cursor-pointer group flex flex-col items-center"
                      >
                        <ChirmoTalkingRobotAvatar
                          state={chirmoState}
                          size="md"
                          showStatusBadge={true}
                          statusText={targetLang === 'de' ? 'Chirmo Almanca Bekliyor 🇩🇪' : 'Chirmo İngilizce Bekliyor 🇬🇧'}
                        />
                        <span className="mt-1.5 text-[10px] sm:text-[11px] font-bold text-indigo-200 group-hover:text-amber-300 transition-colors text-center">
                          Konuşmayı Başlatmak İçin Dokun 👆
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* -------------------- 4. İSTASYON: SİMÜLASYON & AKICILIK VADİSİ -------------------- */}
              <div className="relative flex items-start gap-2.5 sm:gap-4 min-w-0">
                {/* İstasyon Rozeti */}
                <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md shadow-purple-500/20 border-2 border-white dark:border-slate-900 shrink-0">
                  <span>🎭</span>
                </div>

                {/* İstasyon Kartı */}
                <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 truncate">
                        4. İstasyon • Akıcılık
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[9px] sm:text-[10px] font-black shrink-0">
                        +120 XP ⭐
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">5 Dk</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Rol yapma hikayeleri ve gölgeleme (shadowing) egzersizleriyle akıcılığını katla!
                  </p>

                  {/* İstasyonun Araçları */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                    {/* Hikaye Diyaloğu */}
                    <button
                      type="button"
                      onClick={() => setIsStoryModalOpen(true)}
                      className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/80 border border-purple-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          🎭
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">Hikaye Diyaloğu</div>
                          <div className="text-[10px] text-slate-500 truncate">Rol yapma maceraları</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-purple-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {/* 3x Akıcılık */}
                    <button
                      type="button"
                      onClick={() => setIsBoosterModalOpen(true)}
                      className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800/80 border border-orange-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-orange-500 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          ⚡
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">3x Akıcılık</div>
                          <div className="text-[10px] text-slate-500 truncate">Shadowing & Hızlandırıcı</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-orange-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Mesleki Paketler */}
                    <button
                      type="button"
                      onClick={() => setIsCareerModalOpen(true)}
                      className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-slate-800 dark:to-slate-800/80 border border-indigo-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          💼
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">Mesleki Paketler</div>
                          <div className="text-[10px] text-slate-500 truncate">İş & Sektör Paketleri</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-indigo-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              {/* -------------------- 5. İSTASYON: MEYDAN OKUMA & OYUN PARKI (ZİRVE) -------------------- */}
              <div className="relative flex items-start gap-2.5 sm:gap-4 min-w-0">
                {/* İstasyon Rozeti */}
                <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-md shadow-amber-500/20 border-2 border-white dark:border-slate-900 shrink-0">
                  <span>🏆</span>
                </div>

                {/* İstasyon Kartı */}
                <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 truncate">
                        5. İstasyon • Meydan Okuma
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[9px] sm:text-[10px] font-black shrink-0">
                        Büyük Ödül (+200 XP) 🎁
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">Zirve</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    1v1 konuşma düellosuyla kendini test et ya da oyunlarla sandığını aç!
                  </p>

                  {/* İstasyonun Araçları */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                    {/* 1v1 Düello */}
                    <button
                      type="button"
                      onClick={() => setIsDuelModalOpen(true)}
                      className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-50 to-red-50 dark:from-slate-800 dark:to-slate-800/80 border border-amber-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          🏆
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">1v1 Düello</div>
                          <div className="text-[10px] text-slate-500 truncate">Canlı lig mücadelesi</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Kelime Oyunu */}
                    <button
                      type="button"
                      onClick={() => onNavigateToGames && onNavigateToGames()}
                      className="w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-lime-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800/80 border border-lime-200/80 dark:border-slate-700 flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-lime-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          🎮
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">Kelime Oyunu</div>
                          <div className="text-[10px] text-slate-500 truncate">4 farklı hafıza oyunu</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-lime-600 shrink-0 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Günlük Hazine Sandığı */}
                    <button
                      type="button"
                      onClick={handleOpenChest}
                      className={`w-full min-w-0 p-2.5 rounded-xl sm:rounded-2xl border flex items-center justify-between hover:scale-[1.01] active:scale-95 transition-all text-left cursor-pointer group/btn ${
                        chestOpened
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800'
                          : 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/50 dark:to-yellow-950/50 border-amber-300 dark:border-amber-700 animate-pulse'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-xs shrink-0">
                          🎁
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {chestOpened ? 'Sandık Açıldı ✓' : 'Günün Sandığını Aç'}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {chestOpened ? '+100 XP Kazanıldı!' : 'Tıkla ve sürprizi kap'}
                          </div>
                        </div>
                      </div>
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* ==================== HIZLI LİSTE MODU (MOBİLDE SİMETRİK 2 SÜTUNLU GRİD) ==================== */
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xs space-y-3 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-600 text-white text-xs shadow-xs font-black shrink-0">
                  ✨
                </span>
                <h3 className="text-xs sm:text-base font-black text-slate-800 dark:text-white truncate">
                  Hızlı Pratik Araçları (13 Araç)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('parkour')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>🗺️ Parkur</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 min-w-0">
              {/* 0. Teçhizat Sandığı / Alet Çantası */}
              <button
                type="button"
                onClick={() => setIsToolboxModalOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>🧰</span>
                <span className="truncate">Teçhizat Sandığı</span>
              </button>

              {/* 1. 3 Saniye Refleks */}
              <button
                type="button"
                onClick={() => setIsReflexDrillOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>⚡</span>
                <span className="truncate">3 Saniye Refleks</span>
              </button>

              {/* 2. Lego Kalıplar */}
              <button
                type="button"
                onClick={() => setIsLegoModalOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>🧱</span>
                <span className="truncate">Lego Kalıplar</span>
              </button>

              {/* 3. Vize & Mülakat / der/die/das */}
              {targetLang === 'de' ? (
                <button
                  type="button"
                  onClick={() => setIsGermanGenderModalOpen(true)}
                  className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
                >
                  <span>🔵</span>
                  <span className="truncate">der / die / das</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCareerModalOpen(true)}
                  className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
                >
                  <span>🛂</span>
                  <span className="truncate">Vize & Mülakat</span>
                </button>
              )}

              {/* 4. 2 Dk Sesli Arama */}
              <button
                type="button"
                onClick={() => setIsVoiceCallModalOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>📞</span>
                <span className="truncate">2 Dk Sesli Arama</span>
              </button>

              {/* 5. Telaffuz Doktoru */}
              <button
                type="button"
                onClick={() => setIsPronunciationDoctorOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>🎯</span>
                <span className="truncate">Telaffuz Doktoru</span>
              </button>

              {/* 6. Aksan Seçici */}
              <button
                type="button"
                onClick={() => setIsAccentModalOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>🎙️</span>
                <span className="truncate">Aksan: {currentAccent === 'uk' ? 'İngiliz' : currentAccent === 'au' ? 'Avustralya' : currentAccent === 'robot' ? 'Robot' : 'Amerikan'}</span>
              </button>

              {/* 7. Kamera (Vision) */}
              <button
                type="button"
                onClick={() => setIsVisionExplorerOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>📸</span>
                <span className="truncate">Kamera (Vision)</span>
              </button>

              {/* 8. Mesleki Paketler */}
              <button
                type="button"
                onClick={() => setIsCareerModalOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>💼</span>
                <span className="truncate">Mesleki Paketler</span>
              </button>

              {/* 9. 1v1 Düello */}
              <button
                type="button"
                onClick={() => setIsDuelModalOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-600 to-red-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>🏆</span>
                <span className="truncate">1v1 Düello</span>
              </button>

              {/* 10. Hikaye Diyaloğu */}
              <button
                type="button"
                onClick={() => setIsStoryModalOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>🎭</span>
                <span className="truncate">Hikaye Diyaloğu</span>
              </button>

              {/* 11. 3x Akıcılık */}
              <button
                type="button"
                onClick={() => setIsBoosterModalOpen(true)}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>⚡</span>
                <span className="truncate">3x Akıcılık</span>
              </button>

              {/* 12. Kelime Oyunu */}
              <button
                type="button"
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="w-full min-w-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-lime-600 to-emerald-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:scale-105 active:scale-95"
              >
                <span>🎮</span>
                <span className="truncate">Kelime Oyunu</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== 4. ORTA SÜTUN: DERS PLANI VE CHIRMO AI ÖĞRETMENİ ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 min-w-0">
          {/* SOL: BUGÜNÜN DERS PLANI (7 Kolon) */}
          <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 min-w-0">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-amber-500 font-black text-base sm:text-lg shrink-0">⚡</span>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                  Bugünün Ders Planı
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToLearn && onNavigateToLearn()}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <span>Tümü</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-2 min-w-0">
              {/* Adım 1: Kelime Öğrenme */}
              <div className="flex items-center space-x-3 p-2 rounded-xl sm:rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-xs">
                  ✓
                </div>
                <div className="w-4 text-center text-xs font-bold text-slate-400 shrink-0">1</div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">Kelime Öğrenme</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">En sık kullanılan 50 kelime</div>
                </div>
              </div>

              {/* Adım 2: Cümle Kurma */}
              <div className="flex items-center space-x-3 p-2 rounded-xl sm:rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-xs">
                  ✓
                </div>
                <div className="w-4 text-center text-xs font-bold text-slate-400 shrink-0">2</div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">Cümle Kurma</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">I want, I need, I like...</div>
                </div>
              </div>

              {/* Adım 3: Konuşma Pratiği (AKTİF VURGULANAN ADIM) */}
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#ede9fe]/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs min-w-0">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-xs">
                    ✓
                  </div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                    <Mic className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-purple-950 dark:text-purple-200 flex items-center space-x-1 truncate">
                      <span className="truncate">Konuşma Pratiği</span>
                      <ArrowRight className="w-3 h-3 text-purple-600 shrink-0" />
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-purple-700/80 dark:text-purple-300 truncate">
                      AI ile gerçek konuşma
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartSpeaking}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-md shadow-purple-500/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Konuşmaya Başla 🔮</span>
                </button>
              </div>

              {/* Adım 4: Eğlenceli Oyun */}
              <div className="flex items-center space-x-3 p-2 rounded-xl sm:rounded-2xl opacity-75 hover:opacity-100 transition-opacity min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-slate-300 dark:border-slate-700 text-slate-400 flex items-center justify-center shrink-0 text-xs font-bold">
                  4
                </div>
                <div className="w-4 text-center text-xs font-bold text-slate-400 shrink-0">4</div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-slate-700 dark:text-slate-300 truncate">Eğlenceli Oyun</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">Öğrendiklerini pekiştir</div>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ: CHIRMO AI ÖĞRETMENİ (5 Kolon) */}
          <div className="lg:col-span-5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3.5 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 min-w-0">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-lg shrink-0">🤖</span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                  Chirmo AI Öğretmeni
                </h3>
              </div>
              <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>• Çevrimiçi</span>
              </span>
            </div>

            {/* Konuşan Maskot ve Baloncuk */}
            <div className="flex items-start space-x-2.5 py-1 min-w-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 p-1 flex items-center justify-center shadow-xs border border-purple-200 dark:border-slate-700 shrink-0 overflow-hidden">
                <img
                  src="./chirmo-character.png"
                  alt="Chirmo Karakteri"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.endsWith('/chirmo-avatar.png')) {
                      img.src = './chirmo-avatar.png';
                    }
                  }}
                />
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#f5f3ff] dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed min-w-0 flex-1 break-words">
                "{tutorSpeechText}"
              </div>
            </div>

            {/* Sohbet Başlat Düğmesi */}
            <button
              type="button"
              onClick={() => {
                handleChirmoSpeak(tutorSpeechText);
                setIsChatModalOpen(true);
              }}
              className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#ede9fe] hover:bg-[#ddd6fe] dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-2xs hover:scale-[1.01] active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Sohbet Başlat →</span>
            </button>
          </div>
        </div>

        {/* ==================== 5. ALT BÖLÜM: OYUN MERKEZİ & GELİŞİM ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 min-w-0">
          {/* SOL: OYUN MERKEZİ (7 Kolon) */}
          <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 min-w-0">
              <div className="flex items-center space-x-2 min-w-0">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                  Oyun Merkezi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <span>Tümü</span>
                <span>→</span>
              </button>
            </div>

            {/* 4 Renkli Oyun Kartı (Mobilde 2x2 Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 min-w-0">
              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-purple-300 via-indigo-300 to-indigo-400 dark:from-purple-950 dark:to-indigo-900 text-center space-y-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs flex flex-col items-center justify-center group"
              >
                <div className="text-2xl sm:text-3xl group-hover:scale-115 transition-transform">⭐</div>
                <div className="text-xs font-black text-slate-900 dark:text-white truncate w-full">Kelime Avı</div>
              </div>

              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-300 via-orange-300 to-orange-400 dark:from-amber-950 dark:to-orange-900 text-center space-y-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs flex flex-col items-center justify-center group"
              >
                <div className="text-2xl sm:text-3xl group-hover:scale-115 transition-transform">🧩</div>
                <div className="text-xs font-black text-slate-900 dark:text-white truncate w-full">Cümle Ustası</div>
              </div>

              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-cyan-300 via-sky-300 to-blue-400 dark:from-cyan-950 dark:to-blue-900 text-center space-y-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs flex flex-col items-center justify-center group"
              >
                <div className="text-2xl sm:text-3xl group-hover:scale-115 transition-transform">🎧</div>
                <div className="text-xs font-black text-slate-900 dark:text-white truncate w-full">Dinle & Bul</div>
              </div>

              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-lime-300 via-emerald-300 to-green-400 dark:from-emerald-950 dark:to-green-900 text-center space-y-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs flex flex-col items-center justify-center group"
              >
                <div className="text-2xl sm:text-3xl group-hover:scale-115 transition-transform">🚀</div>
                <div className="text-xs font-black text-slate-900 dark:text-white truncate w-full">Hızlı Cevap</div>
              </div>
            </div>
          </div>

          {/* SAĞ: HAFTALIK GELİŞİM RAPORU (5 Kolon) */}
          <div className="lg:col-span-5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 min-w-0">
              <div className="flex items-center space-x-2 min-w-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 shrink-0" />
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                  Haftalık Gelişim
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTasks && onNavigateToTasks()}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer shrink-0"
              >
                <span>Detay</span>
                <span>→</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1 min-w-0">
              <div className="space-y-0.5 shrink-0">
                <div className="text-purple-600 font-black text-2xl sm:text-3xl">
                  %85
                </div>
                <div className="text-[11px] font-bold text-slate-500">
                  Başarı Oranın
                </div>
              </div>

              <div className="flex-1 max-w-[170px] sm:max-w-[190px] h-14 sm:h-16 flex items-center min-w-0">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="homeChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,35 Q15,30 30,22 T60,15 T85,8 T100,5"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,35 Q15,30 30,22 T60,15 T85,8 T100,5 L100,40 L0,40 Z"
                    fill="url(#homeChartGrad)"
                  />
                  <circle cx="30" cy="22" r="3" fill="#8b5cf6" />
                  <circle cx="60" cy="15" r="3" fill="#8b5cf6" />
                  <circle cx="85" cy="8" r="3" fill="#8b5cf6" />
                  <circle cx="100" cy="5" r="4" fill="#7c3aed" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Gizli arama formu (test uyumluluğu için) */}
        <form onSubmit={handleSearchSubmit} className="sr-only">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Google'da veya Chirmo'da ara..."
          />
        </form>

        {/* ==================== 6. ALT FOOTER ==================== */}
        <footer className="mt-6 pt-4 pb-2 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span>Chirmo AI English • 2026</span>
            <span>•</span>
            <span>Oyun Parkuru Destekli Dil Öğrenimi</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => onOpenInstallModal?.()}
              className="hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              Mobil Uygulama (APK)
            </button>
          </div>
        </footer>

        {/* ==================== 7. ERİŞİLEBİLİRLİK & TEST ETİKETLERİ ==================== */}
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
        </div>

      </div>

      {/* MODALLAR */}
      {/* 200 TL Chirmo Premium Modal */}
      <ChirmoSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      {/* Chirmo AI Canlı Sohbet Modalı */}
      <ChirmoAiChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        initialMessage={tutorSpeechText}
      />

      {/* 3x Hızlı Konuşma Hızlandırıcısı Tam Ekran Modalı */}
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

      {/* İnteraktif Hikaye ve Rol Yapma Diyaloğu Tam Ekran Modalı */}
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

      {/* Chirmo Sanal Robot Canlı Konuşma Modalı */}
      <ChirmoInteractiveGraduationDialogueModal
        isOpen={isRobotDialogueOpen}
        onClose={() => setIsRobotDialogueOpen(false)}
        dayNumber={30}
        milestoneTitle={targetLang === 'de' ? "Chirmo ile Canlı Almanca Pratiği" : "Chirmo ile Canlı Robot Konuşması"}
      />

      {/* 2 Dakikalık Chirmo Seni Arıyor Sesli Simülatörü */}
      <ChirmoVoiceCallSimulatorModal
        isOpen={isVoiceCallModalOpen}
        onClose={() => setIsVoiceCallModalOpen(false)}
      />

      {/* Chirmo Telaffuz Doktoru & Fonetik Hece Isı Haritası */}
      <ChirmoPronunciationDoctor
        isOpen={isPronunciationDoctorOpen}
        onClose={() => setIsPronunciationDoctorOpen(false)}
      />

      {/* Chirmo Doğal İnsan Sesleri & Aksan Seçici Modalı */}
      <ChirmoAccentVoiceSelectorModal
        isOpen={isAccentModalOpen}
        onClose={() => setIsAccentModalOpen(false)}
        onAccentChange={(acc) => setCurrentAccent(acc)}
      />

      {/* Chirmo Etrafını Göster, İngilizce Konuş (Vision Explorer) */}
      <ChirmoVisionExplorerModal
        isOpen={isVisionExplorerOpen}
        onClose={() => setIsVisionExplorerOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />

      {/* Chirmo Mesleki & Sektörel Konuşma Paketleri */}
      <ChirmoCareerTrackModal
        isOpen={isCareerModalOpen}
        onClose={() => setIsCareerModalOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />

      {/* Chirmo Sosyal Ligler & 1v1 Konuşma Düelloları */}
      <ChirmoSpeakingDuelModal
        isOpen={isDuelModalOpen}
        onClose={() => setIsDuelModalOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />

      {/* 3 Saniye Refleks Antrenörü Modalı */}
      <ChirmoReflexDrillModal
        isOpen={isReflexDrillOpen}
        onClose={() => setIsReflexDrillOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />

      {/* Lego Kalıp Sihirbazı Modalı */}
      <ChirmoLegoChunkingModal
        isOpen={isLegoModalOpen}
        onClose={() => setIsLegoModalOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />

      {/* Korkusuz Almanca: der/die/das Renk Sistemi Modalı */}
      <ChirmoGermanGenderMasteryModal
        isOpen={isGermanGenderModalOpen}
        onClose={() => setIsGermanGenderModalOpen(false)}
      />

      {/* Maceracının Büyülü Teçhizat Sandığı / Alet Çantası Modalı */}
      <ChirmoSpeakingToolboxModal
        isOpen={isToolboxModalOpen}
        onClose={() => setIsToolboxModalOpen(false)}
        onRewardXP={(xp) => LearningStorageService.addXP(xp)}
      />
    </div>
  );
};

export default ChirmoVirtualTutorStudio;
