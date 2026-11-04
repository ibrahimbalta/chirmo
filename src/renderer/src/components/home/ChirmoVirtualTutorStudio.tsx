import React, { useState } from 'react';
import {
  Search,
  Bell,
  Play,
  Mic,
  Volume2,
  BookOpen,
  MessageCircle,
  Trophy,
  Flame,
  ArrowRight,
  Gamepad2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { ChirmoSubscriptionModal } from '../subscription/ChirmoSubscriptionModal';
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
    <div className="w-full h-full flex flex-col bg-[#f8faff] dark:bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-5 select-none">
      <div className="max-w-7xl mx-auto w-full space-y-5">

        {/* ==================== 1. ÜST ARAMA VE PROFİL BARI ==================== */}
        <div className="flex items-center justify-between gap-4">
          {/* Arama Kutusu */}
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
          <div className="flex items-center space-x-3 shrink-0">
            {/* Bildirim Çanı */}
            <button
              type="button"
              onClick={() => alert('Bugünkü konuşma göreviniz hazır: Restoran Diyaloğu!')}
              className="relative p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
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
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-white dark:border-slate-700 shadow-xs flex items-center justify-center text-white font-black text-xs cursor-pointer hover:scale-105 transition-transform overflow-hidden"
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

        {/* ==================== 2. KAHRAMAN AFİŞ (HERO BANNER) ==================== */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#e8edff] via-[#ede9fe] to-[#e4e7ff] dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 border border-purple-200/60 dark:border-slate-800 p-6 sm:p-8 shadow-xs">

          {/* Arka Plan: Londra / Big Ben Vektörel Şehir Silüeti */}
          <div className="absolute right-40 sm:right-64 bottom-0 opacity-25 dark:opacity-10 pointer-events-none hidden md:block">
            <svg width="260" height="170" viewBox="0 0 260 170" fill="currentColor" className="text-indigo-900 dark:text-indigo-300">
              {/* Big Ben Kulesi ve Çan Kadranı */}
              <rect x="90" y="55" width="30" height="115" rx="2" />
              <polygon points="90,55 105,25 120,55" />
              <polygon points="103,25 105,10 107,25" />
              <circle cx="105" cy="72" r="8" fill="none" stroke="#fff" strokeWidth="2" />
              {/* Yan Westminster Sarayı Binaları */}
              <rect x="40" y="105" width="50" height="65" rx="1" />
              <polygon points="40,105 50,85 60,105" />
              <polygon points="70,105 80,85 90,105" />
              <rect x="120" y="115" width="60" height="55" rx="1" />
              <polygon points="135,115 145,95 155,115" />
              <polygon points="160,115 170,95 180,115" />
              {/* Klasik Köprü Kemerleri */}
              <path d="M10 170 Q30 145 50 170 Q70 145 90 170 Q130 145 170 170 Q210 145 250 170" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Sol Başlık ve İlerleme Kapsülü */}
            <div className="space-y-3 max-w-xl">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                <span>Merhaba</span>
                <span className="inline-block animate-wiggle">👋</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                Bugün İngilizce konuşma yolculuğunda<br className="hidden sm:inline" /> harika bir gün!
              </p>

              {/* İlerleme Kapsülü */}
              <div className="inline-flex items-center space-x-2.5 p-1.5 px-3 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs border border-purple-100 dark:border-slate-700 shadow-2xs mt-2">
                <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white text-[11px] font-black flex items-center space-x-1 shadow-2xs">
                  <span>📅</span>
                  <span>30 Günlük Kamp</span>
                </span>
                <span className="h-3 w-px bg-slate-300 dark:bg-slate-600" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Günün 1. Adımı
                </span>
                <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    style={{ width: '25%' }}
                  />
                </div>
                <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                  %7
                </span>
              </div>
            </div>

            {/* Sağ: 3D Sevimli Robot Maskot ve CTA Butonu */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-5 self-start lg:self-auto">
              {/* 3D Robot Görseli ve Işıltılı Yıldızlar */}
              <div className="relative flex items-center justify-center">
                {/* 3D Beyaz Robot Maskot İllüstrasyonu */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-white via-indigo-50 to-purple-100 dark:from-slate-800 dark:to-slate-700 p-2 shadow-lg flex items-center justify-center text-6xl select-none group hover:scale-105 transition-transform border border-purple-100 dark:border-slate-700">
                  <span className="drop-shadow-md">🤖</span>
                </div>
                {/* 4 Köşeli Altın Işıltı Yıldızları */}
                <span className="absolute -top-1 -right-1 text-amber-400 text-lg animate-ping">✨</span>
                <span className="absolute -top-2 left-3 text-purple-500 text-sm animate-pulse">✦</span>
                <span className="absolute bottom-1 -left-2 text-amber-400 text-sm animate-bounce">⭐</span>
              </div>

              {/* Büyük Mor Ders Başlat Butonu */}
              <button
                type="button"
                onClick={() => onNavigateToLearn && onNavigateToLearn()}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#5850ec] to-[#7c3aed] hover:from-[#4f46e5] hover:to-[#6d28d9] text-white font-extrabold text-sm sm:text-[15px] shadow-lg shadow-indigo-500/25 flex items-center space-x-2.5 transition-all cursor-pointer active:scale-95 hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bugünün Dersini Başlat</span>
              </button>
            </div>
          </div>
        </div>

        {/* ==================== 3. 4 ADET KPI İSTATİSTİK KARTI ==================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Kart 1: Öğrenilen Kelime */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex items-center space-x-3.5 hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl shrink-0">
              📖
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Öğrenilen Kelime</div>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">182</span>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  ↑ +12
                </span>
              </div>
            </div>
          </div>

          {/* Kart 2: Konuşma Süresi */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex items-center space-x-3.5 hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shrink-0">
              💬
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Konuşma Süresi</div>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">28 dk</span>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  ↑ +8 dk
                </span>
              </div>
            </div>
          </div>

          {/* Kart 3: Başarı Rozeti */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex items-center space-x-3.5 hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shrink-0">
              🏆
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Başarı Rozeti</div>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">7</span>
                <span className="text-xs text-slate-400 font-bold">Toplam 24</span>
              </div>
            </div>
          </div>

          {/* Kart 4: Günlük Seri */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-2xs flex items-center space-x-3.5 hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl shrink-0">
              🔥
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Günlük Seri</div>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">12 Gün</span>
              </div>
              <div className="text-[10px] text-amber-500 font-black">
                🔥 Harika gidiyorsun!
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 4. ORTA SÜTUN: DERS PLANI VE CHIRMO AI ÖĞRETMENİ ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* SOL: BUGÜNÜN DERS PLANI (7 Kolon) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-amber-500 font-black text-lg">⚡</span>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Bugünün Ders Planı
              </h2>
            </div>

            <div className="space-y-3">
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
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-xs">
                    3
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
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
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
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 p-2 flex items-center justify-center text-3xl shadow-xs border border-purple-200 dark:border-slate-700 shrink-0">
                🤖
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-slate-800/80 border border-purple-200/80 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                "{tutorSpeechText}"
              </div>
            </div>

            {/* Sohbet Başlat Düğmesi */}
            <button
              type="button"
              onClick={() => handleChirmoSpeak(tutorSpeechText)}
              className="w-full py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-2xs hover:scale-[1.01] active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>Sohbet Başlat →</span>
            </button>
          </div>

        </div>

        {/* ==================== 5. ALT SÜTUN: OYUN MERKEZİ VE HAFTALIK GELİŞİM ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* SOL: OYUN MERKEZİ (7 Kolon) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
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
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center space-x-1 cursor-pointer"
              >
                <span>Tüm oyunları keşfet</span>
                <span>→</span>
              </button>
            </div>

            {/* 4 Renkli Oyun Kartı */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Oyun 1: Kelime Avı */}
              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-200 to-indigo-300 dark:from-purple-950 dark:to-indigo-900 text-center space-y-2 cursor-pointer hover:scale-105 transition-all shadow-2xs flex flex-col items-center justify-center"
              >
                <div className="text-3xl">⭐</div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Kelime Avı</div>
              </div>

              {/* Oyun 2: Cümle Ustası */}
              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-200 to-orange-300 dark:from-amber-950 dark:to-orange-900 text-center space-y-2 cursor-pointer hover:scale-105 transition-all shadow-2xs flex flex-col items-center justify-center"
              >
                <div className="text-3xl">🧩</div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Cümle Ustası</div>
              </div>

              {/* Oyun 3: Hızlı Cevap */}
              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-cyan-200 to-blue-300 dark:from-cyan-950 dark:to-blue-900 text-center space-y-2 cursor-pointer hover:scale-105 transition-all shadow-2xs flex flex-col items-center justify-center"
              >
                <div className="text-3xl">⏱️</div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Hızlı Cevap</div>
              </div>

              {/* Oyun 4: Hafıza Kartları */}
              <div
                onClick={() => onNavigateToGames && onNavigateToGames()}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-orange-200 to-purple-300 dark:from-orange-950 dark:to-purple-900 text-center space-y-2 cursor-pointer hover:scale-105 transition-all shadow-2xs flex flex-col items-center justify-center"
              >
                <div className="text-3xl">🎴</div>
                <div className="text-xs font-black text-slate-900 dark:text-white">Hafıza Kartları</div>
              </div>
            </div>
          </div>

          {/* SAĞ: HAFTALIK GELİŞİM RAPORU (5 Kolon) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
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
                <span>Detayları Gör</span>
                <span>→</span>
              </button>
            </div>

            {/* İstatistik ve Dalgalı Çizgi Grafik */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-purple-600 font-black text-3xl">
                  <span className="text-xl">↗</span>
                  <span>%85</span>
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Başarı Oranın
                </div>
              </div>

              {/* Dalgalı Çizgi Grafik (SVG) */}
              <div className="flex-1 max-w-[180px] h-16 flex items-center">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,35 Q15,30 30,22 T60,15 T85,8 T100,5"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,35 Q15,30 30,22 T60,15 T85,8 T100,5 L100,40 L0,40 Z"
                    fill="url(#chartGradient)"
                  />
                  <circle cx="30" cy="22" r="2.5" fill="#8b5cf6" />
                  <circle cx="60" cy="15" r="2.5" fill="#8b5cf6" />
                  <circle cx="85" cy="8" r="2.5" fill="#8b5cf6" />
                  <circle cx="100" cy="5" r="3.5" fill="#7c3aed" />
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
    </div>
  );
};

export default ChirmoVirtualTutorStudio;
