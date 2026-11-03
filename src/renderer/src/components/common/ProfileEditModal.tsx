import React, { useState } from 'react';
import { X, User, Sparkles, Check, Target, GraduationCap } from 'lucide-react';
import { UserProfileService, UserProfile, CEFRLevelSimple } from '../../services/userProfileService';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: UserProfile) => void;
  isFirstTime?: boolean;
}

const AVATAR_OPTIONS = ['🎓', '🚀', '🌟', '🦁', '🐱', '🎧', '☕', '💼', '⚽', '🎨'];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
  isFirstTime = false
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => UserProfileService.getProfile());
  const [nameInput, setNameInput] = useState(profile.hasCustomName ? profile.name : '');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevelSimple>(profile.level);
  const [selectedEmoji, setSelectedEmoji] = useState(profile.avatarEmoji);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim().length > 0 ? nameInput.trim() : 'Öğrenci';
    const updated = UserProfileService.saveProfile({
      name: finalName,
      level: selectedLevel,
      avatarEmoji: selectedEmoji,
      dailyGoal: dailyGoal
    });

    if (onProfileUpdated) {
      onProfileUpdated(updated);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Üst Başlık */}
        <div className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative">
          {!isFirstTime && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kişiye Özel Profil</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            {isFirstTime ? 'Chirmo\'ya Hoş Geldin! 👋' : 'Profilini Özelleştir'}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            {isFirstTime
              ? 'Sana nasıl hitap edelim? Bilgilerin yalnızca senin bu cihazında saklanır, kimseyle paylaşılmaz.'
              : 'İsmini, seviyeni ve hedeflerini istediğin an güncelleyebilirsin.'}
          </p>
        </div>

        {/* Form Alanı */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* İsim Girişi */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>İsmin veya Takma Adın</span>
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Örn: İbrahim, Ayşe, Can..."
              maxLength={25}
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Avatar Emojisi Seçimi */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">
              Avatar Simgesi
            </label>
            <div className="flex items-center flex-wrap gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                    selectedEmoji === emoji
                      ? 'bg-purple-100 dark:bg-purple-900/60 border-2 border-purple-600 scale-110 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Seviye Seçimi */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              <span>İngilizce Seviyen</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['A1', 'A2', 'B1', 'B2'] as CEFRLevelSimple[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
                    selectedLevel === lvl
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                  <div className="text-[9px] font-normal opacity-80">
                    {lvl === 'A1' ? 'Sıfır' : lvl === 'A2' ? 'Temel' : lvl === 'B1' ? 'Orta' : 'İleri'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Günlük Kelime Hedefi */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-rose-500" />
              <span>Günlük Kelime Hedefin</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map((goal) => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => setDailyGoal(goal)}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    dailyGoal === goal
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {goal} Kelime
                </button>
              ))}
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>{isFirstTime ? 'Başla ve Kaydet' : 'Değişiklikleri Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
