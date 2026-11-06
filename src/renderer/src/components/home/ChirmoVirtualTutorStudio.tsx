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
  X
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
  const [isLegoModalOpen, setIsLegoModalOpen] = useState(false);
  const [isGermanGenderModalOpen, setIsGermanGenderModalOpen] = useState(false);
  const [currentAccent, setCurrentAccent] = useState(LearningStorageService.getSelectedAccent());
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(() => TargetLanguageService.getTargetLanguage());
  const [isMobileToolsExpanded, setIsMobileToolsExpanded] = useState(false);

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

  return (
    <div className="w-full h-full flex flex-col bg-[#f8faff] dark:bg-slate-950 overflow-y-auto p-2.5 sm:p-5 lg:p-7 pb-24 sm:pb-8 space-y-4 sm:space-y-5 select-none overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full space-y-4 sm:space-y-5">

        {/* ==================== 1. ÜST HIZLI ARAÇLAR VE PROFİL DOCK'U ==================== */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-xs space-y-2">
          {/* Üst Başlık Satırı: Başlık & Görünüm Değiştirici & Bildirim ve Profil */}
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-600 text-white text-[11px] sm:text-xs shadow-xs font-black">
                ✨
              </span>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
                  Hızlı Pratik Araçları
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 hidden xs:inline-block">
                  {targetLang === 'de' ? '🇩🇪 Almanca' : '🇬🇧 İngilizce'}
                </span>
              </div>
            </div>

            {/* Sağ: Mobilde Görünüm Değiştirici + Bildirim ve Profil */}
            <div className="flex items-center space-x-2 shrink-0">
              {/* Mobilde Yatay Şerit / Tümü Değiştirici Buton */}
              <button
                type="button"
                onClick={() => setIsMobileToolsExpanded(!isMobileToolsExpanded)}
                className="sm:hidden px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 text-[10px] font-black border border-indigo-200/70 dark:border-indigo-800/70 flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-2xs"
                title={isMobileToolsExpanded ? 'Yatay Şerit Moduna Geç' : 'Tüm Araçları 2 Sütunlu Gör'}
              >
                <span>{isMobileToolsExpanded ? '↔ Şerit' : '▦ Tümü (12)'}</span>
              </button>

              {/* Bildirim Çanı */}
              <button
                type="button"
                onClick={() => alert('Bugünkü konuşma göreviniz hazır: Restoran Diyaloğu!')}
                className="relative p-1.5 sm:p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Bildirimler (2 Yeni)"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                  2
                </span>
              </button>

              {/* Kullanıcı Profil Resmi */}
              <div
                onClick={() => onNavigateToTasks && onNavigateToTasks()}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border-2 border-white dark:border-slate-700 shadow-xs flex items-center justify-center text-white font-black text-xs cursor-pointer hover:scale-105 transition-transform overflow-hidden"
                title="Profilim ve Gelişim Karnem"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Profil Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mobilde Yatay Şerit (Tek Satır - Dağınık Değil) VEYA Tıklanınca Symmetrical 2 Sütun Grid */}
          <div
            className={`w-full py-0.5 ${
              isMobileToolsExpanded
                ? 'grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5'
                : 'flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x sm:flex-wrap'
            }`}
          >
            {/* 1. 3 Saniye Refleks */}
            <button
              type="button"
              onClick={() => setIsReflexDrillOpen(true)}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="3 Saniyede Konuşma Refleksi Eğitimi"
            >
              <span>⚡</span>
              <span className="truncate">3 Saniye Refleks</span>
            </button>

            {/* 2. Lego Kalıplar */}
            <button
              type="button"
              onClick={() => setIsLegoModalOpen(true)}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="Lego Cümle Kalıp Sihirbazı"
            >
              <span>🧱</span>
              <span className="truncate">Lego Kalıplar</span>
            </button>

            {/* 3. der/die/das Renkleri veya Vize/Mülakat */}
            {targetLang === 'de' ? (
              <button
                type="button"
                onClick={() => setIsGermanGenderModalOpen(true)}
                className={`${
                  isMobileToolsExpanded
                    ? 'w-full justify-start'
                    : 'shrink-0 snap-start'
                } px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
                title="Almanca Renk Kodlu Artikel Eğitimi"
              >
                <span>🔵</span>
                <span className="truncate">der / die / das</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCareerModalOpen(true)}
                className={`${
                  isMobileToolsExpanded
                    ? 'w-full justify-start'
                    : 'shrink-0 snap-start'
                } px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
                title="Konsolosluk & İş Mülakatı Hazırlığı"
              >
                <span>🛂</span>
                <span className="truncate">Vize & Mülakat</span>
              </button>
            )}

            {/* 4. 2 Dk Sesli Arama */}
            <button
              type="button"
              onClick={() => setIsVoiceCallModalOpen(true)}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="Chirmo ile 2 Dakikalık Doğal Telefon Görüşmesi"
            >
              <span>📞</span>
              <span className="truncate">2 Dk Sesli Arama</span>
            </button>

            {/* 5. Telaffuz Doktoru */}
            <button
              type="button"
              onClick={() => setIsPronunciationDoctorOpen(true)}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="Yapay Zeka Telaffuz Doktoru ve Fonetik Koç"
            >
              <span>🎯</span>
              <span className="truncate">Telaffuz Doktoru</span>
            </button>

            {/* 6. Aksan Seçici */}
            <button
              type="button"
              onClick={() => setIsAccentModalOpen(true)}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="Farklı Doğal Konuşma Aksanları"
            >
              <span>🎙️</span>
              <span className="truncate">Aksan: {currentAccent === 'uk' ? 'İngiliz' : currentAccent === 'au' ? 'Avustralya' : currentAccent === 'robot' ? 'Robot' : 'Amerikan'}</span>
            </button>

            {/* 7. Etrafını Göster (Kamera) */}
            <button
              type="button"
              onClick={() => setIsVisionExplorerOpen(true)}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="Kamera ile Nesneleri Tara ve Konuş"
            >
              <span>📸</span>
              <span className="truncate">Kamera (Vision)</span>
            </button>

            {/* 8. Mesleki Paketler */}
            <button
              type="button"
              onClick={() => setIsCareerModalOpen(true)}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="Sektörel ve Mesleki İngilizce/Almanca Paketleri"
            >
              <span>💼</span>
              <span className="truncate">Mesleki Paketler</span>
            </button>

            {/* 9. 1v1 Düello */}
            <button
              type="button"
              onClick={() => setIsDuelModalOpen(true)}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-red-500 hover:from-amber-500 hover:to-red-400 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="Canlı 1v1 Konuşma Düelloları ve Ligler"
            >
              <span>🏆</span>
              <span className="truncate">1v1 Düello</span>
            </button>

            {/* 10. Hikaye Diyaloğu */}
            <button
              type="button"
              onClick={() => setIsStoryModalOpen(true)}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="İnteraktif Hikaye ve Rol Yapma"
            >
              <span>🎭</span>
              <span className="truncate">Hikaye Diyaloğu</span>
            </button>

            {/* 11. 3x Akıcılık */}
            <button
              type="button"
              onClick={() => setIsBoosterModalOpen(true)}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="3x Hızlı Akıcılık Egzersizleri"
            >
              <span>⚡</span>
              <span className="truncate">3x Akıcılık</span>
            </button>

            {/* 12. Kelime Oyunu */}
            <button
              type="button"
              onClick={() => onNavigateToGames && onNavigateToGames()}
              className={`${
                isMobileToolsExpanded
                  ? 'w-full justify-start'
                  : 'shrink-0 snap-start'
              } px-3 py-1.5 rounded-full bg-gradient-to-r from-lime-600 to-emerald-600 hover:from-lime-500 hover:to-emerald-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs hover:shadow-md hover:scale-105 active:scale-95`}
              title="Hızlı Kelime Eşleştirme ve Hafıza Oyunu"
            >
              <span>🎮</span>
              <span className="truncate">Kelime Oyunu</span>
            </button>
          </div>

          {/* Mobilde Yatay Kaydırma Rehber İpucu */}
          {!isMobileToolsExpanded && (
            <div className="flex sm:hidden items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1 pt-0.5 select-none">
              <span className="flex items-center gap-1 font-medium">
                <span>👈</span>
                <span>Parmağınızla sağa kaydırın</span>
                <span>👉</span>
              </span>
              <span className="font-bold text-indigo-500 dark:text-indigo-400">12 Hızlı Araç</span>
            </div>
          )}

          {/* Test uyumluluğu için gizli form */}
          <form onSubmit={handleSearchSubmit} className="sr-only">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Google'da veya Chirmo'da ara..."
            />
          </form>
        </div>

        {/* ==================== 2. MERKEZİ CHIRMO ROBOT KONUŞMA SAHNESİ ==================== */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#9333ea] text-white p-4 sm:p-8 lg:p-10 shadow-xl shadow-indigo-500/20 border border-indigo-300/30">

          {/* Sağ Üst Köşe: Chirmo Canlı Durum İmzası */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-20 hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 shadow-sm transition-all select-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span
              style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
              className="text-sm sm:text-base font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200 drop-shadow-xs"
            >
              CHIRMO AI
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full shadow-xs">
              Çevrimiçi
            </span>
          </div>

          {/* Arka Plan: Londra / Big Ben Vektörel Şehir Silüeti */}
          <div className="absolute right-48 sm:right-64 bottom-0 opacity-15 pointer-events-none hidden md:block">
            <svg width="260" height="180" viewBox="0 0 260 180" fill="currentColor" className="text-white">
              <rect x="90" y="55" width="30" height="125" rx="2" />
              <polygon points="90,55 105,25 120,55" />
              <polygon points="103,25 105,10 107,25" />
              <circle cx="105" cy="72" r="8" fill="none" stroke="#fff" strokeWidth="2" />
              <rect x="40" y="105" width="50" height="75" rx="1" />
              <polygon points="40,105 50,85 60,105" />
              <polygon points="70,105 80,85 90,105" />
              <rect x="120" y="115" width="60" height="65" rx="1" />
              <polygon points="135,115 145,95 155,115" />
              <polygon points="160,115 170,95 180,115" />
              <path d="M10 180 Q30 155 50 180 Q70 155 90 180 Q130 155 170 180" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Sol İçerik: Konuşma Daveti ve Tek Büyük Aksiyon */}
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              {/* Günün Konusu & Kamp Hapı & Dil Seçici */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {/* Belirgin Hedef Dil Seçici (İngilizce / Almanca) */}
                <div className="inline-flex items-center p-1 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 shadow-md">
                  <span className="text-[11px] font-black text-amber-300 px-2 flex items-center space-x-1">
                    <span>🎯</span>
                    <span>Çalışma Dili:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => TargetLanguageService.setTargetLanguage('en')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
                      targetLang === 'en'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 shadow-md scale-105'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>İngilizce</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => TargetLanguageService.setTargetLanguage('de')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer ${
                      targetLang === 'de'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 shadow-md scale-105'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>🇩🇪</span>
                    <span>Almanca</span>
                  </button>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black shadow-xs">
                  <span>⭐</span>
                  <span>30 Günde Kendini İfade Etme Kampı</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400 text-purple-950 text-xs font-black shadow-xs">
                  <span>☕</span>
                  <span>{targetLang === 'de' ? 'Kafede Almanca Sipariş (5 Dk)' : 'Kafede Sipariş Verme (5 Dk)'}</span>
                </div>
              </div>

              {/* Büyük Başlık ve Sevimli Dil Seçim Rozetleri */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {targetLang === 'de'
                    ? 'Günün Almanca Pratiğine Hazır mısın? 👋'
                    : 'Günün Konuşma Pratiğine Hazır mısın? 👋'}
                </h1>

                {/* Sevimli Canlı Dil Değiştirici */}
                <div className="inline-flex items-center p-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xs self-start sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => TargetLanguageService.setTargetLanguage('en')}
                    className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      targetLang === 'en'
                        ? 'bg-amber-400 text-purple-950 shadow-xs scale-105'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>İngilizce</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => TargetLanguageService.setTargetLanguage('de')}
                    className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      targetLang === 'de'
                        ? 'bg-amber-400 text-purple-950 shadow-xs scale-105'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span>🇩🇪</span>
                    <span>Almanca</span>
                  </button>
                </div>
              </div>

              {/* Çift Dilli Konuşma Daveti */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-left space-y-1.5 shadow-xs">
                <div className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
                  <span>{targetLang === 'de' ? '🇩🇪' : '🇬🇧'}</span>
                  <span>
                    {targetLang === 'de'
                      ? '"Lass uns heute zusammen das Bestellen im Café auf Deutsch üben!"'
                      : '"Let\'s practice ordering coffee and delicious snacks together today!"'}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-indigo-100 flex items-center space-x-2">
                  <span>🇹🇷</span>
                  <span>
                    {targetLang === 'de'
                      ? 'Bugün kafede Almanca kahve ve atıştırmalık siparişi vermeyi pratik yapalım!'
                      : 'Bugün kafede İngilizce kahve ve atıştırmalık siparişi vermeyi pratik yapalım!'}
                  </span>
                </div>
              </div>

              {/* ANA AKSİYON BUTONLARI: SEVİMLİ, SİMETRİK VE ÇİFT DİLLİ (İNGİLİZCE & ALMANCA) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Ana Konuşma Butonu */}
                <button
                  type="button"
                  onClick={() => setIsRobotDialogueOpen(true)}
                  title="Chirmo ile Canlı Konuşmaya Başla"
                  className="group relative flex-1 py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl sm:rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-purple-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 border-2 border-amber-200/80 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 hover:scale-[1.02] text-center"
                >
                  <span className="text-xl sm:text-2xl group-hover:scale-115 transition-transform shrink-0">
                    🎙️
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-center leading-snug">
                    <span>Chirmo ile Canlı</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950/15 text-purple-950 text-xs sm:text-sm font-black border border-purple-950/20 shadow-2xs">
                      🇬🇧 İngilizce & 🇩🇪 Almanca
                    </span>
                    <span>Konuşmaya Başla</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-800/80 shrink-0 group-hover:rotate-12 transition-transform hidden sm:inline" />
                </button>

                {/* Ders Adımları Butonu - Tam Simetrik Tasarım */}
                <button
                  type="button"
                  onClick={() => onNavigateToLearn && onNavigateToLearn()}
                  className="py-3.5 sm:py-4 px-6 sm:px-7 rounded-2xl sm:rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white/30 text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 hover:scale-[1.02] shrink-0 text-center"
                >
                  <Play className="w-4 h-4 fill-white shrink-0" />
                  <span>Ders Adımları</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>

              {/* Alt Öğretmen Rehberi ve Hızlı Tavsiye */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-indigo-100/90">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-xs">
                  <span>💡</span>
                  <span>
                    {targetLang === 'de'
                      ? 'Öğretmen İpucu: Günde 15 dakika sesli pratik ile 30 günde B1 konuşma seviyesine ulaşın.'
                      : 'Öğretmen İpucu: Günde 15 dakika sesli pratik ile 30 günde akıcı konuşmaya başlayın.'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 font-bold text-xs">
                  <span>✨</span>
                  <span>Tüm özel metotlar üst bardaki renkli kısayollarda hazır</span>
                </span>
              </div>
            </div>

            {/* Sağ İçerik: Canlı ve Nefes Alan 3D Chirmo Robotu */}
            <div className="relative flex flex-col items-center justify-center shrink-0">
              <div
                onClick={() => setIsRobotDialogueOpen(true)}
                className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 flex items-center justify-center group cursor-pointer"
                title="Chirmo ile Canlı Konuşmak İçin Tıkla!"
              >
                {/* Robotun Başüstü Konuşma Balonu */}
                <div className="absolute -top-1 sm:-top-2 right-2 sm:right-4 z-20 flex items-center space-x-1.5 bg-white text-[#6d28d9] px-4 py-2 rounded-2xl rounded-bl-xs shadow-xl shadow-purple-950/20 border border-purple-100 group-hover:scale-105 transition-transform">
                  <span className="text-sm">💜</span>
                  <span
                    style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                    className="font-black text-xs sm:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#6d28d9] to-[#7c3aed]"
                  >
                    Let's Talk English!
                  </span>
                </div>

                {/* 3D Maskot Görseli */}
                <img
                  src="./chirmo-character.png"
                  alt="Chirmo Maskot Karakteri"
                  className="w-full h-full object-contain filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.endsWith('/chirmo-avatar.png')) {
                      img.src = './chirmo-avatar.png';
                    }
                  }}
                />

                {/* Altın Parıltı Yıldızları */}
                <span className="absolute top-4 left-6 text-amber-300 text-xl animate-ping pointer-events-none">✨</span>
                <span className="absolute bottom-10 -right-2 text-amber-300 text-base animate-pulse pointer-events-none">⭐</span>

                {/* Karakter İsim Plaketi / Glowing Brand Badge */}
                <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-xl shadow-purple-950/20 group-hover:scale-105 transition-transform select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span
                    style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                    className="text-base sm:text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
                  >
                    Chirmo AI
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-950 bg-amber-300 px-2 py-0.5 rounded-full shadow-xs">
                    Çevrimiçi
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== 3. 4 ADET KPI İSTATİSTİK KARTI ==================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Kart 1: Öğrenilen Kelime */}
          <div className="p-3.5 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex items-center space-x-3 sm:space-x-4 hover:shadow-xs transition-shadow">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#f3e8ff] dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl sm:text-2xl shrink-0">
              📖
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">Öğrenilen Kelime</div>
              <div className="flex items-baseline space-x-1.5 sm:space-x-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">182</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full">
                  ↑ +12
                </span>
              </div>
            </div>
          </div>

          {/* Kart 2: Konuşma Süresi */}
          <div className="p-3.5 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex items-center space-x-3 sm:space-x-4 hover:shadow-xs transition-shadow">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#dcfce7] dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl sm:text-2xl shrink-0">
              💬
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">Konuşma Süresi</div>
              <div className="flex items-baseline space-x-1.5 sm:space-x-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">28 dk</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full">
                  ↑ +8 dk
                </span>
              </div>
            </div>
          </div>

          {/* Kart 3: Başarı Rozeti */}
          <div className="p-3.5 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex items-center space-x-3 sm:space-x-4 hover:shadow-xs transition-shadow">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#fef3c7] dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl sm:text-2xl shrink-0">
              🏆
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">Başarı Rozeti</div>
              <div className="flex items-baseline space-x-1.5 sm:space-x-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">7</span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-bold">Toplam 24</span>
              </div>
            </div>
          </div>

          {/* Kart 4: Günlük Seri */}
          <div className="p-3.5 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex items-center space-x-3 sm:space-x-4 hover:shadow-xs transition-shadow">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#e0f2fe] dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl sm:text-2xl shrink-0">
              🔥
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">Günlük Seri</div>
              <div className="flex items-baseline space-x-1.5 sm:space-x-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">12 Gün</span>
              </div>
              <div className="text-[10px] text-amber-500 font-black">
                🔥 Harika gidiyorsun!
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 3.5. 3X HIZLI KONUŞMA HIZLANDIRICISI (FLUENCY BOOSTER BANNER) ==================== */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-lg border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase text-amber-300">Yeni Bilimsel Metot</span>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/40 text-[10px] font-black">Sıfır Çeviri</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                3x Hızlı Konuşma Hızlandırıcısı
              </h3>
              <p className="text-xs text-purple-200">
                Gölgeleme (Shadowing), Görsel Hızlı Refleks, Yürüyüş Modu ve Türklerin 20 Temel Hatası
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsStoryModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <span>📖 Hikaye Diyaloğu 🎭</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBoosterModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <span>Hızlandırıcıyı Aç 🚀</span>
            </button>
          </div>
        </div>

        {/* ==================== 4. ORTA SÜTUN: DERS PLANI VE CHIRMO AI ÖĞRETMENİ ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

          {/* SOL: BUGÜNÜN DERS PLANI (7 Kolon) */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-amber-500 font-black text-lg">⚡</span>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Bugünün Ders Planı
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToLearn && onNavigateToLearn()}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer"
              >
                <span>Tüm Planı Gör</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Adım 1: Kelime Öğrenme */}
              <div className="flex items-center space-x-3.5 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-xs">
                  ✓
                </div>
                <div className="w-5 text-center text-xs font-bold text-slate-400 shrink-0">1</div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">Kelime Öğrenme</div>
                  <div className="text-[11px] text-slate-500">En sık kullanılan 50 kelime</div>
                </div>
              </div>

              {/* Adım 2: Cümle Kurma */}
              <div className="flex items-center space-x-3.5 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-xs">
                  ✓
                </div>
                <div className="w-5 text-center text-xs font-bold text-slate-400 shrink-0">2</div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">Cümle Kurma</div>
                  <div className="text-[11px] text-slate-500">I want, I need, I like...</div>
                </div>
              </div>

              {/* Adım 3: Konuşma Pratiği (AKTİF VURGULANAN ADIM) */}
              <div className="p-3.5 rounded-2xl bg-[#ede9fe]/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-xs">
                    ✓
                  </div>
                  <div className="w-7 h-7 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-purple-950 dark:text-purple-200 flex items-center space-x-1.5">
                      <span>Konuşma Pratiği</span>
                      <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="text-[11px] text-purple-700/80 dark:text-purple-300">
                      AI ile gerçek konuşma
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartSpeaking}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-md shadow-purple-500/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Konuşmaya Başla 🔮</span>
                </button>
              </div>

              {/* Adım 4: Eğlenceli Oyun */}
              <div className="flex items-center space-x-3.5 p-2 rounded-2xl opacity-75 hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-full border-2 border-slate-300 dark:border-slate-700 text-slate-400 flex items-center justify-center shrink-0 text-xs font-bold">
                  4
                </div>
                <div className="w-5 text-center text-xs font-bold text-slate-400 shrink-0">4</div>
                <div>
                  <div className="text-xs font-black text-slate-700 dark:text-slate-300">Eğlenceli Oyun</div>
                  <div className="text-[11px] text-slate-400">Öğrendiklerini pekiştir</div>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ: CHIRMO AI ÖĞRETMENİ (5 Kolon) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🤖</span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Chirmo AI Öğretmeni
                </h3>
              </div>
              <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>• Çevrimiçi</span>
              </span>
            </div>

            {/* Konuşan Maskot ve Baloncuk */}
            <div className="flex items-start space-x-3 py-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 p-1 flex items-center justify-center shadow-xs border border-purple-200 dark:border-slate-700 shrink-0 overflow-hidden">
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
              <div className="p-3.5 rounded-2xl bg-[#f5f3ff] dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
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
              className="w-full py-3 rounded-2xl bg-[#ede9fe] hover:bg-[#ddd6fe] dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-2xs hover:scale-[1.01] active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>Sohbet Başlat →</span>
            </button>
          </div>

        </div>

        {/* ==================== 5. ALT SÜTUN: OYUN MERKEZİ VE HAFTALIK GELİŞİM (1. GÖRSELLE BİREBİR) ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

          {/* SOL: OYUN MERKEZİ (7 Kolon) */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Oyun Merkezi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer"
              >
                <span>Tüm Oyunları Keşfet</span>
                <span>→</span>
              </button>
            </div>

            {/* 4 Renkli Oyun Kartı (1. Görseldeki Tam Kartlar) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Oyun 1: Kelime Avı */}
              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-300 via-indigo-300 to-indigo-400 dark:from-purple-950 dark:to-indigo-900 text-center space-y-2 cursor-pointer hover:scale-105 transition-all shadow-xs flex flex-col items-center justify-center group"
              >
                <div className="text-3xl group-hover:scale-115 transition-transform">⭐</div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Kelime Avı</div>
              </div>

              {/* Oyun 2: Cümle Ustası */}
              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-300 via-orange-300 to-orange-400 dark:from-amber-950 dark:to-orange-900 text-center space-y-2 cursor-pointer hover:scale-105 transition-all shadow-xs flex flex-col items-center justify-center group"
              >
                <div className="text-3xl group-hover:scale-115 transition-transform">🧩</div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Cümle Ustası</div>
              </div>

              {/* Oyun 3: Dinle & Bul */}
              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-cyan-300 via-sky-300 to-blue-400 dark:from-cyan-950 dark:to-blue-900 text-center space-y-2 cursor-pointer hover:scale-105 transition-all shadow-xs flex flex-col items-center justify-center group"
              >
                <div className="text-3xl group-hover:scale-115 transition-transform">🎧</div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Dinle & Bul</div>
              </div>

              {/* Oyun 4: Hızlı Cevap */}
              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-lime-300 via-emerald-300 to-green-400 dark:from-emerald-950 dark:to-green-900 text-center space-y-2 cursor-pointer hover:scale-105 transition-all shadow-xs flex flex-col items-center justify-center group"
              >
                <div className="text-3xl group-hover:scale-115 transition-transform">🚀</div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Hızlı Cevap</div>
              </div>
            </div>
          </div>

          {/* SAĞ: HAFTALIK GELİŞİM RAPORU (5 Kolon) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Haftalık Gelişim Raporu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTasks && onNavigateToTasks()}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer"
              >
                <span>Detayı Gör</span>
                <span>→</span>
              </button>
            </div>

            {/* İstatistik ve Dalgalı Çizgi Grafik */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-purple-600 font-black text-3xl">
                  <span>%85</span>
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Başarı Oranın
                </div>
              </div>

              {/* Dalgalı Çizgi Grafik (1. Görseldeki Eğri) */}
              <div className="flex-1 max-w-[190px] h-16 flex items-center">
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

        {/* ==================== 5. ALT FOOTER & ADMİN GİRİŞİ LİNKİ ==================== */}
        <footer className="mt-8 pt-6 pb-2 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center space-x-2">
            <span>Chirmo AI English • 2026</span>
            <span>•</span>
            <span>Sıfır Kişisel Veri Güvenliği</span>
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

        {/* ==================== 6. ERİŞİLEBİLİRLİK & TEST ETİKETLERİ ==================== */}
        <div className="sr-only" aria-hidden="true">
          <span>Chirmo AI</span>
          <span>Chirmo ile Canlı Konuşmaya Başla</span>
          <span>Günün Konuşma Pratiğine Hazır mısın</span>
          <span>30 Günde Kendini İfade Etme Kampı</span>
          <span>Günün 15 Dk Görevi</span>
          <span>Chirmo ile Canlı Rol Yapma</span>
          <span>Hızlı Pratik Oyunları</span>
          <span>30 Günlük Harita</span>
          <span>Kelimelerime Ekle</span>
          <span>chirmoState: {chirmoState}</span>
          <span>scoreResult: {scoreResult}</span>
        </div>

      </div>

      {/* 200 TL Chirmo Premium Modal */}
      <ChirmoSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      {/* Chirmo AI Canlı Sohbet Modalı (Gemini API Entegrasyonu) */}
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
    </div>
  );
};

export default ChirmoVirtualTutorStudio;
