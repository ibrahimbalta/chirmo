/**
 * adminService.ts
 * CHIRMO — Yönetim & Admin Paneli Servisi
 *
 * Kullanıcı yönetimi, abonelik/ciro metrikleri, video müfredat CMS'i,
 * yedekleme ve güvenlik ayarlarını yönetir.
 */

import { PrivacyAuthService, UserAccount, constantTimeEqual } from './privacyAuthService';
import { CURATED_VIDEOS, VideoLesson } from '../components/learning/WatchingView';

const STORAGE_KEYS = {
  ADMIN_AUTH: 'chirmo_admin_session_v2',
  LEGACY_ADMIN_AUTH: 'chirmo_admin_session_v1',
  ADMIN_PIN_HASH: 'chirmo_admin_pin_hash_v2',
  LEGACY_ADMIN_PIN: 'chirmo_admin_pin_v1',
  ADMIN_RATE_LIMIT: 'chirmo_admin_rate_limit_v1',
  CUSTOM_VIDEOS: 'chirmo_admin_videos_v1'
};

// 10.000 turlu tuzlanmış (salted) yönetici PIN özeti (kaynak kodda düz metin PIN tutulmaz)
const DEFAULT_ADMIN_PIN_DIGEST = '3da09f45feec8c69';
const ADMIN_SESSION_TTL_MS = 30 * 60 * 1000; // 30 dakika
const MAX_ADMIN_LOGIN_ATTEMPTS = 5;
const ADMIN_LOCKOUT_MS = 5 * 60 * 1000; // 5 dakika

function computeAdminPinDigest(pin: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  const s = 'chirmo_admin_salt_v2:' + (pin || '').trim();
  for (let r = 0; r < 10000; r++) {
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 16777619);
      h2 = Math.imul(h2 ^ (c + r), 2246822507);
    }
  }
  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}

function sanitizeText(input: string, maxLength: number = 500): string {
  return String(input || '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

function sanitizeYoutubeId(rawInput: string): string {
  const raw = String(rawInput || '').trim();
  // Eğer tam YouTube URL'si yapıştırıldıysa video ID'sini ayıkla
  const urlMatch = raw.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{6,20})/);
  const candidate = urlMatch ? urlMatch[1] : raw;
  const clean = candidate.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20);
  return clean || 'dQw4w9WgXcQ';
}

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
  private static migrateLegacyPinIfNeeded(): void {
    try {
      const legacyPlain = localStorage.getItem(STORAGE_KEYS.LEGACY_ADMIN_PIN);
      if (legacyPlain) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_PIN_HASH, computeAdminPinDigest(legacyPlain));
        localStorage.removeItem(STORAGE_KEYS.LEGACY_ADMIN_PIN);
      }
      localStorage.removeItem(STORAGE_KEYS.LEGACY_ADMIN_AUTH);
    } catch {}
  }

  public static getAdminPin(): string {
    // Güvenlik gereği düz metin PIN döndürülmez; yalnızca maskelenmiş durum bilgisi döner
    return '********';
  }

  public static setAdminPin(newPin: string): boolean {
    if (!newPin || newPin.trim().length < 4 || newPin.trim().length > 64) return false;
    try {
      this.migrateLegacyPinIfNeeded();
      const digest = computeAdminPinDigest(newPin.trim());
      localStorage.setItem(STORAGE_KEYS.ADMIN_PIN_HASH, digest);
      return true;
    } catch {
      return false;
    }
  }

  public static isAuthenticated(): boolean {
    try {
      this.migrateLegacyPinIfNeeded();
      const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.expiresAt !== 'number' || typeof parsed.sig !== 'string') {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
        return false;
      }
      if (Date.now() > parsed.expiresAt) {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
        return false;
      }
      const expectedSig = computeAdminPinDigest(`session:${parsed.expiresAt}`);
      if (!constantTimeEqual(parsed.sig, expectedSig)) {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  public static login(inputPin: string): boolean {
    if (!inputPin || typeof inputPin !== 'string') return false;
    this.migrateLegacyPinIfNeeded();

    const now = Date.now();
    try {
      const rawLimit = localStorage.getItem(STORAGE_KEYS.ADMIN_RATE_LIMIT);
      if (rawLimit) {
        const limit = JSON.parse(rawLimit);
        if (limit.lockedUntil && now < limit.lockedUntil) {
          return false;
        }
      }
    } catch {}

    const inputDigest = computeAdminPinDigest(inputPin.trim());
    const storedCustomDigest = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN_HASH);
    const isValid =
      constantTimeEqual(inputDigest, DEFAULT_ADMIN_PIN_DIGEST) ||
      (Boolean(storedCustomDigest) && constantTimeEqual(inputDigest, storedCustomDigest!));

    if (isValid) {
      const expiresAt = now + ADMIN_SESSION_TTL_MS;
      const sig = computeAdminPinDigest(`session:${expiresAt}`);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify({ expiresAt, sig }));
        localStorage.removeItem(STORAGE_KEYS.ADMIN_RATE_LIMIT);
      } catch {}
      return true;
    }

    // Başarısız giriş denemesini kaydet (Brute-Force Koruması)
    try {
      const rawLimit = localStorage.getItem(STORAGE_KEYS.ADMIN_RATE_LIMIT);
      const limit = rawLimit ? JSON.parse(rawLimit) : { count: 0, firstAttemptAt: now };
      if (now - limit.firstAttemptAt > ADMIN_LOCKOUT_MS) {
        limit.count = 1;
        limit.firstAttemptAt = now;
        delete limit.lockedUntil;
      } else {
        limit.count = (limit.count || 0) + 1;
        if (limit.count >= MAX_ADMIN_LOGIN_ATTEMPTS) {
          limit.lockedUntil = now + ADMIN_LOCKOUT_MS;
        }
      }
      localStorage.setItem(STORAGE_KEYS.ADMIN_RATE_LIMIT, JSON.stringify(limit));
    } catch {}

    return false;
  }

  public static logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_ADMIN_AUTH);
    } catch {}
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
    const estimatedArrTr = pro * 200;
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
      systemVersion: 'Chirmo v2.5 SaaS Pro (Hardened)'
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
        const parsed = JSON.parse(customRaw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}

    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(CURATED_VIDEOS));
    return CURATED_VIDEOS;
  }

  public static saveVideo(video: VideoLesson): VideoLesson[] {
    const cleanYoutubeId = sanitizeYoutubeId(video.youtubeId);
    const sanitizedVideo: VideoLesson = {
      ...video,
      id: sanitizeText(video.id || `vid_${Date.now()}`, 60),
      title: sanitizeText(video.title, 160),
      channel: sanitizeText(video.channel || 'Chirmo Stüdyo', 100),
      youtubeId: cleanYoutubeId,
      thumbnail: `https://img.youtube.com/vi/${cleanYoutubeId}/hqdefault.jpg`,
      duration: sanitizeText(video.duration || '3:00', 20),
      englishSummary: sanitizeText(video.englishSummary || '', 600),
      turkishSummary: sanitizeText(video.turkishSummary || '', 600),
      subtitles: Array.isArray(video.subtitles) ? video.subtitles : []
    };

    const list = this.getAllVideos();
    const existingIndex = list.findIndex((v) => v.id === sanitizedVideo.id);

    if (existingIndex >= 0) {
      list[existingIndex] = sanitizedVideo;
    } else {
      list.unshift(sanitizedVideo);
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
      if (!jsonString || jsonString.length > 5 * 1024 * 1024) return false;
      const safeParse = (raw: string) =>
        JSON.parse(raw, (k, v) =>
          k === '__proto__' || k === 'constructor' || k === 'prototype' ? undefined : v
        );
      const parsed = safeParse(jsonString);
      if (!parsed || typeof parsed !== 'object') return false;

      if (parsed.accounts) {
        const accObj =
          typeof parsed.accounts === 'string' ? safeParse(parsed.accounts) : parsed.accounts;
        if (accObj && typeof accObj === 'object' && !Array.isArray(accObj)) {
          localStorage.setItem('chirmo_saas_accounts_v1', JSON.stringify(accObj));
        }
      }
      if (parsed.videos) {
        const vidArr =
          typeof parsed.videos === 'string' ? safeParse(parsed.videos) : parsed.videos;
        if (Array.isArray(vidArr)) {
          localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(vidArr));
        }
      }
      if (parsed.vocabVault) {
        const vocabArr =
          typeof parsed.vocabVault === 'string' ? safeParse(parsed.vocabVault) : parsed.vocabVault;
        if (Array.isArray(vocabArr)) {
          localStorage.setItem('chirmo_vocab_vault_v1', JSON.stringify(vocabArr));
        }
      }
      if (parsed.subscription) {
        const subObj =
          typeof parsed.subscription === 'string'
            ? safeParse(parsed.subscription)
            : parsed.subscription;
        if (subObj && typeof subObj === 'object') {
          localStorage.setItem('chirmo_user_subscription_v1', JSON.stringify(subObj));
        }
      }
      return true;
    } catch {
      return false;
    }
  }
}
