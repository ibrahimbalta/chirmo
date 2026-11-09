/**
 * firestoreService.ts
 * CHIRMO — Cloud Firestore Entegrasyonu (REST API)
 *
 * Harici büyük SDK bağımlılıklarına gerek duymadan doğrudan Google Cloud Firestore
 * REST API üzerinden çalışır. Web, mobil ve masaüstünde yüksek performansla
 * kullanıcıların kalıcı olarak buluta kaydedilmesini ve Admin panelinde anlık
 * listelenmesini sağlar.
 */

import { UserAccount } from './privacyAuthService';

const PROJECT_ID = 'chirmo-f95a0';
const API_KEY = 'AIzaSyA8N3QdashpzisFEOh3hFDCsSGNJyfhLDE';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function toFirestoreFields(account: UserAccount): Record<string, any> {
  return {
    id: { stringValue: account.id || '' },
    username: { stringValue: account.username || '' },
    passwordHash: { stringValue: account.passwordHash || '' },
    salt: { stringValue: account.salt || '' },
    securityQuestion: { stringValue: account.securityQuestion || '' },
    securityAnswerHash: { stringValue: account.securityAnswerHash || '' },
    plan: { stringValue: account.plan || 'free' },
    createdAt: { stringValue: account.createdAt || new Date().toISOString() },
    lastLogin: { stringValue: account.lastLogin || new Date().toISOString() },
    syncedData: { stringValue: JSON.stringify(account.syncedData || {}) }
  };
}

function fromFirestoreDoc(doc: any): UserAccount | null {
  try {
    const f = doc.fields;
    if (!f || !f.username?.stringValue) return null;
    return {
      id: f.id?.stringValue || '',
      username: f.username.stringValue,
      passwordHash: f.passwordHash?.stringValue || '',
      salt: f.salt?.stringValue || '',
      securityQuestion: f.securityQuestion?.stringValue || '',
      securityAnswerHash: f.securityAnswerHash?.stringValue || '',
      plan: (f.plan?.stringValue as any) || 'free',
      createdAt: f.createdAt?.stringValue || new Date().toISOString(),
      lastLogin: f.lastLogin?.stringValue || new Date().toISOString(),
      syncedData: f.syncedData?.stringValue ? JSON.parse(f.syncedData.stringValue) : undefined
    };
  } catch {
    return null;
  }
}

export class FirestoreService {
  /**
   * Kullanıcıyı Firestore bulut veritabanına kaydeder veya günceller
   */
  public static async saveUser(account: UserAccount): Promise<boolean> {
    try {
      const url = `${BASE_URL}/users/${encodeURIComponent(account.username)}?key=${API_KEY}`;
      const payload = {
        fields: toFirestoreFields(account)
      };

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn('Firestore saveUser error:', err);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Firestore network error (saveUser):', e);
      return false;
    }
  }

  /**
   * Belirli bir kullanıcıyı buluttan çeker
   */
  public static async getUser(username: string): Promise<UserAccount | null> {
    try {
      const url = `${BASE_URL}/users/${encodeURIComponent(username)}?key=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      return fromFirestoreDoc(data);
    } catch (e) {
      console.warn('Firestore network error (getUser):', e);
      return null;
    }
  }

  /**
   * Tüm kayıtlı SaaS kullanıcılarını buluttan çeker
   */
  public static async getAllUsers(): Promise<UserAccount[]> {
    try {
      const url = `${BASE_URL}/users?key=${API_KEY}&pageSize=100`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.documents || !Array.isArray(data.documents)) return [];

      const list: UserAccount[] = [];
      for (const doc of data.documents) {
        const u = fromFirestoreDoc(doc);
        if (u) list.push(u);
      }
      return list;
    } catch (e) {
      console.warn('Firestore network error (getAllUsers):', e);
      return [];
    }
  }

  /**
   * Kullanıcıyı buluttan siler
   */
  public static async deleteUser(username: string): Promise<boolean> {
    try {
      const url = `${BASE_URL}/users/${encodeURIComponent(username)}?key=${API_KEY}`;
      const res = await fetch(url, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.warn('Firestore network error (deleteUser):', e);
      return false;
    }
  }

  /**
   * Giriş sayfasındaki Canlı Ziyaretçi ve Kayıtlı Üye sayacını Firestore'dan çeker ve ziyareti kaydeder
   */
  public static async recordVisitAndGetStats(incrementVisit: boolean = true): Promise<{
    totalVisitors: number;
    registeredMembers: number;
    todayVisitors: number;
  }> {
    const todayStr = new Date().toISOString().slice(0, 10);
    const localStatsKey = 'chirmo_site_stats_cache_v1';

    let cached = {
      totalVisitors: 12,
      registeredMembers: 3,
      todayVisitors: 4
    };

    try {
      const raw = localStorage.getItem(localStatsKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.totalVisitors === 'number') cached = parsed;
      }
    } catch {
      // ignore
    }

    try {
      const statsUrl = `${BASE_URL}/site_stats/global?key=${API_KEY}`;
      const [statsRes, usersList] = await Promise.all([
        fetch(statsUrl).catch(() => null),
        this.getAllUsers().catch(() => [])
      ]);

      const realMemberCount = Array.isArray(usersList) ? usersList.length : cached.registeredMembers;

      let totalVisitors = Math.max(cached.totalVisitors, realMemberCount * 3 + 1);
      let todayVisitors = 1;
      let savedDate = todayStr;

      if (statsRes && statsRes.ok) {
        const statsData = await statsRes.json();
        const f = statsData.fields || {};
        const cloudTotal = parseInt(f.totalVisitors?.integerValue || '0', 10);
        const cloudToday = parseInt(f.todayVisitors?.integerValue || '0', 10);
        savedDate = f.lastDate?.stringValue || todayStr;

        if (cloudTotal > 0) {
          totalVisitors = Math.max(cloudTotal, realMemberCount);
        }
        if (savedDate === todayStr && cloudToday > 0) {
          todayVisitors = cloudToday;
        } else {
          todayVisitors = 1;
        }
      }

      if (incrementVisit) {
        totalVisitors += 1;
        todayVisitors = savedDate === todayStr ? todayVisitors + 1 : 1;

        await fetch(statsUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              totalVisitors: { integerValue: String(totalVisitors) },
              todayVisitors: { integerValue: String(todayVisitors) },
              registeredMembers: { integerValue: String(realMemberCount) },
              lastDate: { stringValue: todayStr },
              updatedAt: { stringValue: new Date().toISOString() }
            }
          })
        }).catch(() => {});
      }

      const result = {
        totalVisitors,
        registeredMembers: Math.max(realMemberCount, 1),
        todayVisitors
      };

      try {
        localStorage.setItem(localStatsKey, JSON.stringify(result));
      } catch {
        // ignore
      }

      return result;
    } catch {
      return cached;
    }
  }
}
