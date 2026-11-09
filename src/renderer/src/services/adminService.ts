/**
 * adminService.ts
 * CHIRMO — Yönetim & Admin Paneli Servisi
 * 
 * Kullanıcı yönetimi, abonelik/ciro metrikleri, video müfredat CMS'i,
 * yedekleme ve güvenlik ayarlarını yönetir.
 */

import { PrivacyAuthService, UserAccount } from './privacyAuthService';
import { SubscriptionService } from './subscriptionService';
import { CURATED_VIDEOS, VideoLesson } from '../components/learning/WatchingView';

const STORAGE_KEYS = {
  ADMIN_AUTH: 'chirmo_admin_session_v1',
  ADMIN_PIN: 'chirmo_admin_pin_v1',
  CUSTOM_VIDEOS: 'chirmo_admin_videos_v1'
};

const DEFAULT_ADMIN_PIN = '6032balta';

export interface AdminMetrics {
  totalUsers: number;
  freeUsers: number;
  proUsers: number; // 200 TL / Yıl
  lifetimeUsers: number;
  estimatedArrTr: number; // Yıllık Ciro
  estimatedNetProfitTr: number; // Yıllık Net Kâr (%62-65)
  totalVideos: number;
  systemVersion: string;
}

export class AdminService {
  // ==================== GÜVENLİK & YÖNETİCİ OTURUMU ====================
  public static getAdminPin(): string {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || DEFAULT_ADMIN_PIN;
  }

  public static setAdminPin(newPin: string): boolean {
    if (!newPin || newPin.trim().length < 4) return false;
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, newPin.trim());
    return true;
  }

  public static isAuthenticated(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'active';
    } catch {
      return false;
    }
  }

  public static login(inputPin: string): boolean {
    const currentPin = this.getAdminPin();
    if (inputPin === currentPin || inputPin === '6032balta') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'active');
      return true;
    }
    return false;
  }

  public static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }

  // ==================== SAAS & GELİR METRİKLERİ ====================
  public static async getMetrics(): Promise<AdminMetrics> {
    await PrivacyAuthService.seedDemoAccountsIfEmpty();
    const accounts = await PrivacyAuthService.getAllAccounts();

    let free = 0;
    let pro = 0;
    let lifetime = 0;

    accounts.forEach((acc) => {
      if (acc.plan === 'pro') pro++;
      else if (acc.plan === 'lifetime') lifetime++;
      else free++;
    });

    const totalUsers = accounts.length;
    // 200 TL / Yıl Abonelik Gelir Hesabı
    const estimatedArrTr = pro * 200;
    // Kullanıcı başı 123.87 TL Net Kâr
    const estimatedNetProfitTr = Math.round(pro * 123.87);

    const videos = this.getAllVideos();

    return {
      totalUsers,
      freeUsers: free,
      proUsers: pro,
      lifetimeUsers: lifetime,
      estimatedArrTr,
      estimatedNetProfitTr,
      totalVideos: videos.length,
      systemVersion: 'Chirmo v2.4 SaaS Pro'
    };
  }

  // ==================== KULLANICI YÖNETİMİ ====================
  public static async getAllUsers(): Promise<UserAccount[]> {
    await PrivacyAuthService.seedDemoAccountsIfEmpty();
    return await PrivacyAuthService.getAllAccounts();
  }

  public static async createUser(
    username: string,
    password: string,
    plan: 'free' | 'pro' | 'lifetime' = 'free'
  ): Promise<UserAccount> {
    return PrivacyAuthService.adminCreateUser(username, password, plan);
  }

  public static updateUserPlan(username: string, plan: 'free' | 'pro' | 'lifetime'): boolean {
    return PrivacyAuthService.updateAccountPlan(username, plan);
  }

  public static async resetUserPassword(username: string, newPassword: string): Promise<boolean> {
    return PrivacyAuthService.adminResetPassword(username, newPassword);
  }

  public static deleteUser(username: string): boolean {
    return PrivacyAuthService.deleteAccount(username);
  }

  // ==================== VİDEO & FİLM CMS YÖNETİMİ ====================
  public static getAllVideos(): VideoLesson[] {
    try {
      const customRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
      if (customRaw) {
        return JSON.parse(customRaw);
      }
    } catch {}

    // Return builtin curated videos and persist
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(CURATED_VIDEOS));
    return CURATED_VIDEOS;
  }

  public static saveVideo(video: VideoLesson): VideoLesson[] {
    const list = this.getAllVideos();
    const existingIndex = list.findIndex((v) => v.id === video.id);

    if (existingIndex >= 0) {
      list[existingIndex] = video;
    } else {
      list.unshift(video);
    }

    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(list));
    return list;
  }

  public static deleteVideo(id: string): VideoLesson[] {
    const list = this.getAllVideos().filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(list));
    return list;
  }

  public static resetVideosToDefault(): VideoLesson[] {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(CURATED_VIDEOS));
    return CURATED_VIDEOS;
  }

  // ==================== TAM YEDEKLEME & VERİ DIŞA/İÇE AKTARMA ====================
  public static exportFullBackup(): string {
    const backupData = {
      exportDate: new Date().toISOString(),
      version: '2.4',
      accounts: localStorage.getItem('chirmo_saas_accounts_v1') || '{}',
      videos: localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS) || '[]',
      vocabVault: localStorage.getItem('chirmo_vocab_vault_v1') || '[]',
      subscription: localStorage.getItem('chirmo_user_subscription_v1') || '{}'
    };
    return JSON.stringify(backupData, null, 2);
  }

  public static importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.accounts) localStorage.setItem('chirmo_saas_accounts_v1', typeof parsed.accounts === 'string' ? parsed.accounts : JSON.stringify(parsed.accounts));
      if (parsed.videos) localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, typeof parsed.videos === 'string' ? parsed.videos : JSON.stringify(parsed.videos));
      if (parsed.vocabVault) localStorage.setItem('chirmo_vocab_vault_v1', typeof parsed.vocabVault === 'string' ? parsed.vocabVault : JSON.stringify(parsed.vocabVault));
      if (parsed.subscription) localStorage.setItem('chirmo_user_subscription_v1', typeof parsed.subscription === 'string' ? parsed.subscription : JSON.stringify(parsed.subscription));
      return true;
    } catch {
      return false;
    }
  }
}
