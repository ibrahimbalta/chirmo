import React, { useState, useEffect } from 'react';
import {
  Bot,
  Volume2,
  Globe,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { UserProfileService, UserProfile } from '../../services/userProfileService';

interface ChirmoAiTeacherSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userLevel?: string;
}

export const ChirmoAiTeacherSidebar: React.FC<ChirmoAiTeacherSidebarProps> = ({
  isOpen,
  onClose,
  userLevel
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => UserProfileService.getProfile());
  const [showWordDetails, setShowWordDetails] = useState(false);
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);

  useEffect(() => {
    return UserProfileService.subscribe((updated) => {
      setProfile(updated);
    });
  }, []);

  if (!isOpen) return null;

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  return (
    <aside className="w-72 shrink-0 h-full bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 flex flex-col justify-between overflow-y-auto select-none p-3.5 z-20">
      <div className="space-y-4">
        {/* ==================== BAŞLIK & DURUM (ÇEVRİMİÇİ) ==================== */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-800 dark:text-slate-100">
                Chirmo AI Öğretmeni
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Çevrimiçi
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            title="Paneli Kapat"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* ==================== KARŞILAMA VE SOHBET BALONU (KİŞİYE ÖZEL) ==================== */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium relative">
          Merhaba {profile.hasCustomName ? profile.name : 'Arkadaşım'}! 👋 İngilizceni geliştirmek için buradayım. Bugün sana nasıl yardımcı olabilirim?
        </div>

        {/* ==================== BUGÜNÜN KELİMESİ KARTI ==================== */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => handleSpeak('Improve')}
                className="hover:scale-110 transition-transform cursor-pointer"
                title="Kelimeyi Dinle"
              >
                <Volume2 className="w-4 h-4 text-blue-600" />
              </button>
              <span className="text-[10px] font-black uppercase tracking-wider">
                Bugünün Kelimesi
              </span>
            </div>
          </div>

          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-between">
              <span>Improve</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-bold">
                B1
              </span>
            </div>
            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              Geliştirmek
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
            "I want to <strong>improve</strong> my English."
          </p>

          <button
            onClick={() => setShowWordDetails(!showWordDetails)}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1 hover:underline cursor-pointer pt-1"
          >
            <span>{showWordDetails ? 'Detayları Gizle' : 'Detayları Göster'}</span>
            {showWordDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showWordDetails && (
            <div className="text-[11px] text-slate-600 dark:text-slate-300 pt-2 border-t border-blue-200/50 space-y-1">
              <div><strong>Okunuş:</strong> /ɪmˈpruːv/</div>
              <div><strong>Eş Anlamlılar:</strong> better, enhance, boost</div>
              <div><strong>İpucu:</strong> Günlük hayatta ve işte bir şeyi daha iyi hale getirmek için kullanılır.</div>
            </div>
          )}
        </div>

        {/* ==================== 4 HIZLI EYLEM BUTONU (2x2) ==================== */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveActionModal('Çeviri')}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Çevir</span>
          </button>

          <button
            onClick={() => setActiveActionModal('Gramer')}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span>Grameri Açıkla</span>
          </button>

          <button
            onClick={() => handleSpeak('I want to improve my English and speak fluently.')}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-indigo-500" />
            <span>Dinle</span>
          </button>

          <button
            onClick={() => setActiveActionModal('Soru')}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Soru Sor</span>
          </button>
        </div>

        {/* ==================== BUGÜNKÜ ÖĞRENME DURUMUM ==================== */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-black text-slate-800 dark:text-slate-100">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Bugünkü Öğrenme Durumum</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <span>✨</span>
                <span>Yeni Kelimeler</span>
              </span>
              <span className="font-black text-slate-800 dark:text-slate-100">12</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <span>🎯</span>
                <span>Doğru Cevaplar</span>
              </span>
              <span className="font-black text-slate-800 dark:text-slate-100">18 / 20</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center space-x-1">
                <span>🎙️</span>
                <span>Konuşma Süresi</span>
              </span>
              <span className="font-black text-slate-800 dark:text-slate-100">14 dk</span>
            </div>
          </div>
        </div>

        {/* ==================== CHIRMO ÖNERİSİ KARTI (SARI TAVSİYE) ==================== */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 space-y-1 text-xs">
          <div className="flex items-center space-x-1.5 font-black text-amber-800 dark:text-amber-300">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Chirmo Önerisi</span>
          </div>
          <p className="text-amber-900/80 dark:text-amber-200 leading-relaxed font-medium">
            Bugün geçmiş zaman konusuna odaklanmanı öneriyorum.
          </p>
        </div>
      </div>
    </aside>
  );
};
