import React, { useState } from 'react';
import {
  GraduationCap,
  Home,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Brain,
  BarChart2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Target,
  Trophy,
  Crown,
  ArrowRight,
  Edit2
} from 'lucide-react';
import { UserProfileService, UserProfile } from '../../services/userProfileService';
import { ProfileEditModal } from '../common/ProfileEditModal';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState(activeItem);
  const [profile, setProfile] = useState<UserProfile>(() => UserProfileService.getProfile());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    <aside className="w-64 shrink-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between overflow-y-auto select-none p-3.5 z-20">
      <div className="space-y-4">
        {/* ==================== BAŞLIK (ÖĞRENME MERKEZİ) ==================== */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-black text-sm">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span>Öğrenme Merkezi</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              title="İçeriği Daralt / Genişlet"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                title="Sola Kaydır ve Gizle (Sayfayı Genişlet)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <>
            {/* ==================== KULLANICI PROFİL KARTI (KİŞİYE ÖZEL) ==================== */}
            <div
              onClick={() => setIsEditModalOpen(true)}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center space-x-3 cursor-pointer hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
              title="Profilini ve ismini değiştirmek için tıkla"
            >
              {/* Avatar Simgesi / Emojisi */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white dark:border-slate-700 shadow-xs shrink-0 flex items-center justify-center text-white text-xl">
                {profile.avatarEmoji || '🎓'}
              </div>

              {/* Kullanıcı Bilgileri & Seviye */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-black text-xs text-slate-900 dark:text-white truncate">
                    Merhaba {profile.hasCustomName ? profile.name : 'Öğrenci'}!
                  </div>
                  <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="text-[11px] text-slate-500 font-medium">Seviyen: {profile.level}</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-purple-600 text-white text-[9px] font-black">
                    {profile.level}
                  </span>
                </div>
                {/* Seviye İlerleme Çubuğu */}
                <div className="flex items-center space-x-2 mt-1.5">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 shrink-0">
                    %65
                  </span>
                </div>
              </div>
            </div>

            {/* ==================== MENÜ LİSTESİ ==================== */}
            <nav className="space-y-1 text-xs font-bold">
              <button
                onClick={() => handleItemClick('home')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  selected === 'home'
                    ? 'bg-purple-100/80 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <Home className="w-4 h-4 text-purple-600" />
                <span>Ana Sayfa</span>
              </button>

              <button
                onClick={() => handleItemClick('vault')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  selected === 'vault'
                    ? 'bg-purple-100/80 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>Kelime Defterim</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black">
                  124
                </span>
              </button>

              <button
                onClick={() => handleItemClick('lessons')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  selected === 'lessons'
                    ? 'bg-purple-100/80 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span>İngilizce Derslerim</span>
              </button>

              <button
                onClick={() => handleItemClick('listening')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  selected === 'listening'
                    ? 'bg-purple-100/80 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <Headphones className="w-4 h-4 text-sky-500" />
                <span>Dinleme Pratiği</span>
              </button>

              <button
                onClick={() => handleItemClick('speaking')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  selected === 'speaking'
                    ? 'bg-purple-100/80 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <Mic className="w-4 h-4 text-rose-500" />
                <span>Konuşma Pratiği</span>
              </button>

              <button
                onClick={() => handleItemClick('writing')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  selected === 'writing'
                    ? 'bg-purple-100/80 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-4 h-4 text-amber-500" />
                <span>Yazma Pratiği</span>
              </button>

              <button
                onClick={() => handleItemClick('memory')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  selected === 'memory'
                    ? 'bg-purple-100/80 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <Brain className="w-4 h-4 text-purple-500" />
                <span>Hafıza Testleri</span>
              </button>

              <button
                onClick={() => handleItemClick('report')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  selected === 'report'
                    ? 'bg-purple-100/80 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-4 h-4 text-emerald-500" />
                <span>Gelişim Raporum</span>
              </button>
            </nav>
          </>
        )}
      </div>

      {!isCollapsed && (
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* ==================== GÜNLÜK HEDEFİM KARTI ==================== */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-black text-slate-800 dark:text-slate-100">
                <Target className="w-3.5 h-3.5 text-rose-500" />
                <span>Günlük Hedefim</span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Değiştir
              </button>
            </div>

            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {profile.completedWordsToday}
              </span>
              <span className="text-sm font-black text-slate-400">/ {profile.dailyGoal}</span>
            </div>

            {/* Hedef İlerleme Çubuğu */}
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((profile.completedWordsToday / profile.dailyGoal) * 100))}%`
                }}
              ></div>
            </div>

            <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{profile.completedWordsToday} yeni kelime öğrendin!</span>
            </div>
          </div>

          {/* ==================== PRO REKLAM / YÜKSELTME KARTI ==================== */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md relative overflow-hidden group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5 font-black text-xs">
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Chirmo Pro'ya Geç</span>
                </div>
                <p className="text-[10px] text-purple-100">
                  Daha fazla özellik, daha hızlı öğrenme!
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profil Düzenleme Modalı */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </aside>
  );
};
