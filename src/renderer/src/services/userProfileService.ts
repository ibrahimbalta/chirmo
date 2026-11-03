// Chirmo Kişiye Özel Tarayıcı Profil Servisi
// Her kullanıcının kendi tarayıcısında (localStorage) bağımsız, gizli ve kişisel profilini saklar.

export type CEFRLevelSimple = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface UserProfile {
  name: string;
  hasCustomName: boolean;
  level: CEFRLevelSimple;
  avatarEmoji: string;
  avatarUrl?: string;
  dailyGoal: number;
  completedWordsToday: number;
  streakDays: number;
  createdAt: string;
}

const PROFILE_STORAGE_KEY = 'chirmo_user_profile_v2';
const EVENT_NAME = 'chirmo_profile_updated';

export const UserProfileService = {
  getProfile(): UserProfile {
    try {
      if (typeof localStorage === 'undefined') {
        return this.getDefaultProfile();
      }
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) {
        return this.getDefaultProfile();
      }
      return JSON.parse(raw);
    } catch {
      return this.getDefaultProfile();
    }
  },

  getDefaultProfile(): UserProfile {
    return {
      name: 'Öğrenci',
      hasCustomName: false,
      level: 'A1',
      avatarEmoji: '🎓',
      avatarUrl: '',
      dailyGoal: 20,
      completedWordsToday: 12,
      streakDays: 1,
      createdAt: new Date().toISOString()
    };
  },

  saveProfile(updated: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const next: UserProfile = {
      ...current,
      ...updated,
      hasCustomName: updated.name ? updated.name.trim().length > 0 && updated.name !== 'Öğrenci' : current.hasCustomName
    };

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
      }
    } catch {
      // ignore
    }

    return next;
  },

  subscribe(callback: (profile: UserProfile) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: any) => {
      if (e.detail) {
        callback(e.detail);
      } else {
        callback(UserProfileService.getProfile());
      }
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
    };
  }
};
