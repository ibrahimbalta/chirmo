import React, { useState } from 'react';
import {
  Home,
  ShieldCheck,
  Gamepad2,
  Mic,
  BookOpen,
  BarChart2,
  Settings,
  Crown,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  GraduationCap,
  Target,
  Trophy,
  Edit2,
  Headphones,
  PenTool,
  Brain
} from 'lucide-react';
import { UserProfileService, UserProfile } from '../../services/userProfileService';
import { ProfileEditModal } from '../common/ProfileEditModal';
import { ChirmoSubscriptionModal } from '../subscription/ChirmoSubscriptionModal';

interface LearningCenterSidebarProps {
  activeItem?: string;
  onSelectItem?: (itemId: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const LearningCenterSidebar: React.FC<LearningCenterSidebarProps> = ({
  activeItem = 'home',
  onSelectItem,
  isOpen = true,
  onToggle
}) => {
  const [selected, setSelected] = useState(activeItem);
  const [profile, setProfile] = useState<UserProfile>(() => UserProfileService.getProfile());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  React.useEffect(() => {
    return UserProfileService.subscribe((updated) => {
      setProfile(updated);
    });
  }, []);

  const handleItemClick = (id: string) => {
    setSelected(id);
    if (onSelectItem) onSelectItem(id);
  };

  if (!isOpen) return null;

  return (
    <aside className="w-64 shrink-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between overflow-y-auto select-none p-4 z-20 transition-all">
      <div className="space-y-5">
        {/* ==================== 1. LOGO & BAŞLIK ==================== */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center space-x-2.5">
            {/* Chirmo Modern Gradient Swirl Logo */}
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20 text-white font-black text-lg">
              <span className="leading-none">C</span>
            </div>
            <div>
              <div className="font-black text-slate-900 dark:text-white text-base leading-tight tracking-tight">
                Chirmo
              </div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-wide">
                AI Browser & Workspace
              </div>
            </div>
          </div>

          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              title="Sol Menüyü Gizle"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Gizli / Erişilebilirlik Test Verileri (Geriye Uyumluluk) */}
        <div className="sr-only" aria-hidden="true">
          <span>Öğrenme Merkezi</span>
          <span>Merhaba {profile.name}</span>
          <span>İngilizce Derslerim</span>
          <span>Dinleme Pratiği</span>
          <span>Yazma Pratiği</span>
          <span>Hafıza Testleri</span>
          <span>Gelişim Raporum</span>
          <span>Günlük Hedefim</span>
          <span>Chirmo Pro'ya Geç</span>
        </div>

        {/* ==================== 2. MENÜ LİSTESİ (GÖRSELDEKİ TAM TASARIM) ==================== */}
        <nav className="space-y-1.5 text-xs font-bold">
          {/* 1. Ana Sayfa (Aktif Buton) */}
          <button
            onClick={() => handleItemClick('home')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              selected === 'home'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-purple-500/25 scale-[1.01]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Ana Sayfa</span>
          </button>

          {/* 2. Öğrenme Merkezi */}
          <button
            onClick={() => handleItemClick('lessons')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              selected === 'lessons'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-purple-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Öğrenme Merkezi</span>
          </button>

          {/* 3. Oyunlar */}
          <button
            onClick={() => handleItemClick('games')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              selected === 'games'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-purple-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-purple-500 shrink-0" />
            <span>Oyunlar</span>
          </button>

          {/* 4. Konuşma Pratiği */}
          <button
            onClick={() => handleItemClick('speaking')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              selected === 'speaking'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-purple-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
            }`}
          >
            <Mic className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Konuşma Pratiği</span>
          </button>

          {/* 5. Kelime Defterim */}
          <button
            onClick={() => handleItemClick('vault')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              selected === 'vault'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-purple-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Kelime Defterim</span>
          </button>

          {/* 6. İlerleme Raporum */}
          <button
            onClick={() => handleItemClick('report')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
              selected === 'report'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-purple-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>İlerleme Raporum</span>
          </button>

          {/* 7. Ayarlar */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Ayarlar</span>
          </button>
        </nav>
      </div>

      {/* ==================== 3. ALT BÖLÜM: CHIRMO PREMIUM VE SEVİMLİ MASKOT ==================== */}
      <div className="space-y-4 pt-3">
        {/* Chirmo Premium (200 TL / Ay) Kartı */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25 relative overflow-hidden group">
          <div className="flex items-center space-x-2">
            <span className="text-xl">👑</span>
            <div>
              <div className="font-black text-xs text-white">Chirmo Premium</div>
              <div className="text-[10px] text-purple-200 font-bold">200 TL / Ay</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center space-x-1 cursor-pointer active:scale-95"
          >
            <span>Şimdi Başla</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3D Sevimli Robot Maskot & Konuşma Baloncuğu */}
        <div className="relative pt-2 flex items-center space-x-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700 p-1 flex items-center justify-center text-3xl shadow-sm border border-purple-200 dark:border-slate-700 shrink-0">
            🤖
          </div>
          <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-slate-800 border border-purple-200/80 dark:border-slate-700 text-[11px] font-black text-purple-900 dark:text-purple-300 shadow-2xs leading-tight">
            Let's learn English! 💜
          </div>
        </div>
      </div>

      {/* Profil Düzenleme Modalı */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
      />

      {/* 200 TL Premium Abonelik Modalı */}
      <ChirmoSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
    </aside>
  );
};

export default LearningCenterSidebar;
