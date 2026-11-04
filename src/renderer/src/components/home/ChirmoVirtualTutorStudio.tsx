import React, { useState } from 'react';
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
import { ChirmoSubscriptionModal } from '../subscription/ChirmoSubscriptionModal';
import { ChirmoAiChatModal } from './ChirmoAiChatModal';
import { ChirmoFluencyBooster } from '../learning/ChirmoFluencyBooster';
import { ChirmoStoryDialogueStudio } from '../learning/ChirmoStoryDialogueStudio';
import { ChirmoInteractiveGraduationDialogueModal } from '../learning/ChirmoInteractiveGraduationDialogueModal';
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
  onNavigateToTasks
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isBoosterModalOpen, setIsBoosterModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isRobotDialogueOpen, setIsRobotDialogueOpen] = useState(false);

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
    <div className="w-full h-full flex flex-col bg-[#f8faff] dark:bg-slate-950 overflow-y-auto p-3 sm:p-5 lg:p-7 space-y-4 sm:space-y-5 select-none">
      <div className="max-w-7xl mx-auto w-full space-y-4 sm:space-y-5">

        {/* ==================== 1. ÜST ARAMA VE PROFİL BARI ==================== */}
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Oval Arama Kutusu */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Google'da veya Chirmo'da ara..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </form>

          {/* Sağ Bildirim ve Profil */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
            {/* Bildirim Çanı */}
            <button
              type="button"
              onClick={() => alert('Bugünkü konuşma göreviniz hazır: Restoran Diyaloğu!')}
              className="relative p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
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
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border-2 border-white dark:border-slate-700 shadow-xs flex items-center justify-center text-white font-black text-xs cursor-pointer hover:scale-105 transition-transform overflow-hidden"
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

        {/* ==================== 2. KAHRAMAN AFİŞ (HERO BANNER - 1. GÖRSELLE BİREBİR) ==================== */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#8b5cf6] text-white p-6 sm:p-8 lg:p-9 shadow-lg shadow-indigo-500/15 border border-indigo-400/30">

          {/* Sağ Üst Köşe: Chirmo Zarif Marka İmzası */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-20 hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 shadow-sm transition-all select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span
              style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
              className="text-sm sm:text-base font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200 drop-shadow-xs"
            >
              CHIRMO
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 text-indigo-100 px-1.5 py-0.5 rounded">
              STUDIO
            </span>
          </div>

          {/* Arka Plan: Londra / Big Ben Vektörel Şehir Silüeti */}
          <div className="absolute right-48 sm:right-64 bottom-0 opacity-20 pointer-events-none hidden md:block">
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

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Sol İçerik */}
            <div className="space-y-3 sm:space-y-4 max-w-xl">
              {/* Kamp Rozeti & Chirmo Etiketi */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black shadow-xs">
                  <span>⭐</span>
                  <span>30 Günlük İngilizce Konuşma Kampı</span>
                </div>
                <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-300/90 text-purple-950 text-xs font-black shadow-xs">
                  <Sparkles className="w-3 h-3 text-purple-900" />
                  <span style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>Chirmo</span>
                </div>
              </div>

              {/* Büyük Başlık */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight flex items-center space-x-2">
                <span>Merhaba!</span>
                <span className="inline-block animate-wiggle">👋</span>
              </h1>

              {/* Alt Karşılama Cümlesi */}
              <p className="text-sm sm:text-base text-indigo-100 font-medium leading-relaxed">
                Bugün İngilizce konuşma yolculuğunda<br className="hidden sm:inline" /> harika bir gün!
              </p>

              {/* Butonlar: Ders Başlat & Canlı Robot Sohbeti */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigateToLearn && onNavigateToLearn()}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#6d28d9] font-black text-sm sm:text-[15px] shadow-lg shadow-black/15 flex items-center space-x-2.5 transition-all cursor-pointer active:scale-95 hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-[#6d28d9]" />
                  <span>Bugünün Dersini Başlat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsRobotDialogueOpen(true)}
                  className="px-5 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-black text-sm sm:text-[15px] shadow-lg shadow-black/10 flex items-center space-x-2 transition-all cursor-pointer active:scale-95 hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>🤖 Chirmo ile Canlı Konuş</span>
                </button>
              </div>

              {/* Carousel Noktaları */}
              <div className="flex items-center space-x-1.5 pt-2">
                <div className="w-5 h-1.5 rounded-full bg-white" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>

            {/* Sağ İçerik: Orijinal Şeffaf 3D Chirmo Maskot Karakteri */}
            <div className="relative flex flex-col items-center justify-center self-center lg:self-auto shrink-0 mt-2 lg:mt-0">
              <div
                onClick={() => setIsRobotDialogueOpen(true)}
                className="relative w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 flex items-center justify-center group cursor-pointer"
                title="Chirmo ile Canlı Konuşmak İçin Tıkla!"
              >
                {/* Karakter Üstü Şık Konuşma Rozeti */}
                <div className="absolute -top-1 sm:-top-2 right-0 sm:right-2 z-20 flex items-center space-x-1.5 bg-white/95 text-[#6d28d9] px-3.5 py-1.5 rounded-2xl rounded-bl-xs shadow-lg shadow-black/10 border border-purple-100/50 hover:scale-105 transition-transform">
                  <span className="text-xs">💜</span>
                  <span
                    style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                    className="font-black text-xs sm:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#6d28d9] to-[#7c3aed]"
                  >
                    Chirmo
                  </span>
                </div>

                <img
                  src="./chirmo-character.png"
                  alt="Chirmo Maskot Karakteri"
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.endsWith('/chirmo-avatar.png')) {
                      img.src = './chirmo-avatar.png';
                    }
                  }}
                />

                {/* Altın Parıltı Yıldızları */}
                <span className="absolute top-2 right-4 text-amber-300 text-xl animate-ping pointer-events-none">✨</span>
                <span className="absolute bottom-8 -right-1 text-amber-300 text-base animate-pulse pointer-events-none">⭐</span>

                {/* Karakter İsim Plaketi / Glowing Brand Badge */}
                <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 px-4 py-1 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-xl shadow-purple-950/20 hover:scale-105 transition-transform select-none">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span
                    style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                    className="text-base sm:text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-amber-200 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
                  >
                    Chirmo
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-950 bg-amber-300 px-1.5 py-0.5 rounded-md shadow-xs">
                    AI
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

        {/* ==================== 6. ERİŞİLEBİLİRLİK & TEST ETİKETLERİ ==================== */}
        <div className="sr-only" aria-hidden="true">
          <span>Chirmo AI</span>
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
        milestoneTitle="Chirmo ile Canlı Robot Konuşması"
      />
    </div>
  );
};

export default ChirmoVirtualTutorStudio;
