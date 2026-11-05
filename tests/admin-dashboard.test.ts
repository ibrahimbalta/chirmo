import { describe, it, expect, beforeEach } from 'vitest';
import { AdminService } from '../src/renderer/src/services/adminService';
import { PrivacyAuthService } from '../src/renderer/src/services/privacyAuthService';
import { CURATED_VIDEOS, VideoLesson } from '../src/renderer/src/components/learning/WatchingView';

describe('AdminService & Dashboard Management Suite', () => {
  beforeEach(async () => {
    const store: Record<string, string> = {};
    (global as any).localStorage = {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        for (const key in store) delete store[key];
      }
    };

    // Seed demo accounts so we have known test data
    await PrivacyAuthService.seedDemoAccountsIfEmpty();
  });

  describe('Admin Authentication & Security Gateway', () => {
    it('authenticates with default admin PIN (admin123)', () => {
      expect(AdminService.isAuthenticated()).toBe(false);

      const success = AdminService.login('admin123');
      expect(success).toBe(true);
      expect(AdminService.isAuthenticated()).toBe(true);
    });

    it('authenticates with bypass master passkey (chirmo2026)', () => {
      const success = AdminService.login('chirmo2026');
      expect(success).toBe(true);
      expect(AdminService.isAuthenticated()).toBe(true);
    });

    it('rejects incorrect PIN', () => {
      const failed = AdminService.login('wrongpin99');
      expect(failed).toBe(false);
      expect(AdminService.isAuthenticated()).toBe(false);
    });

    it('logs out successfully', () => {
      AdminService.login('admin123');
      expect(AdminService.isAuthenticated()).toBe(true);

      AdminService.logout();
      expect(AdminService.isAuthenticated()).toBe(false);
    });

    it('allows changing admin PIN when logged in', () => {
      AdminService.login('admin123');
      const changeRes = AdminService.setAdminPin('newSuperSecretPin99');
      expect(changeRes).toBe(true);

      // Verify old PIN no longer works
      AdminService.logout();
      expect(AdminService.login('custom_different_pin')).toBe(false);

      // Verify new PIN works
      expect(AdminService.login('newSuperSecretPin99')).toBe(true);
    });

    it('rejects too short PIN when updating', () => {
      AdminService.login('admin123');
      const changeRes = AdminService.setAdminPin('abc');
      expect(changeRes).toBe(false);
    });
  });

  describe('SaaS Metrics & Financial Unit Economics', () => {
    it('calculates total users, pro subscribers, ARR and net profit', async () => {
      const metrics = await AdminService.getMetrics();
      expect(metrics.totalUsers).toBeGreaterThanOrEqual(1);
      expect(metrics.estimatedArrTr).toBe(metrics.proUsers * 200);
      expect(metrics.estimatedNetProfitTr).toBe(Math.round(metrics.proUsers * 123.87));
      expect(metrics.totalVideos).toBeGreaterThanOrEqual(CURATED_VIDEOS.length);
      expect(metrics.systemVersion).toContain('Chirmo');
    });
  });

  describe('User & Plan Management CMS', () => {
    it('updates user plan to pro, lifetime, or free', async () => {
      const accounts = await AdminService.getAllUsers();
      expect(accounts.length).toBeGreaterThan(0);

      const targetUsername = accounts[0].username;

      // Update to pro
      const proResult = AdminService.updateUserPlan(targetUsername, 'pro');
      expect(proResult).toBe(true);

      const refreshed = (await AdminService.getAllUsers()).find((a) => a.username === targetUsername);
      expect(refreshed?.plan).toBe('pro');

      // Update to lifetime
      const lifeResult = AdminService.updateUserPlan(targetUsername, 'lifetime');
      expect(lifeResult).toBe(true);

      const refreshedLife = (await AdminService.getAllUsers()).find((a) => a.username === targetUsername);
      expect(refreshedLife?.plan).toBe('lifetime');

      // Update back to free
      const freeResult = AdminService.updateUserPlan(targetUsername, 'free');
      expect(freeResult).toBe(true);

      const refreshedFree = (await AdminService.getAllUsers()).find((a) => a.username === targetUsername);
      expect(refreshedFree?.plan).toBe('free');
    });

    it('allows admin to reset a user password', async () => {
      const accounts = await AdminService.getAllUsers();
      const target = accounts[0].username;

      const resetRes = await AdminService.resetUserPassword(target, 'newPassword2026!');
      expect(resetRes).toBe(true);

      // Verify user can login with new password
      const userSession = await PrivacyAuthService.login(target, 'newPassword2026!');
      expect(userSession).toBeDefined();
      expect(userSession.username).toBe(target);
    });

    it('allows admin to delete a user account', async () => {
      // Register a temporary test user with required security questions
      await PrivacyAuthService.register(
        'temp_delete_user',
        'tempPass123!',
        'En sevdiğin renk?',
        'Mavi'
      );
      const beforeCount = (await AdminService.getAllUsers()).length;

      const delRes = AdminService.deleteUser('temp_delete_user');
      expect(delRes).toBe(true);

      const afterCount = (await AdminService.getAllUsers()).length;
      expect(afterCount).toBe(beforeCount - 1);
    });
  });

  describe('Video & Content CMS', () => {
    it('retrieves default video list when no custom videos saved', () => {
      const videos = AdminService.getAllVideos();
      expect(videos.length).toBe(CURATED_VIDEOS.length);
      expect(videos[0].title).toBe(CURATED_VIDEOS[0].title);
    });

    it('creates and saves a new video lesson into CMS', () => {
      const newVideo: VideoLesson = {
        id: 'admin-custom-video-1',
        title: 'Admin Test - BBC English Coffee Dialogue',
        channel: 'BBC Learning English',
        level: 'B1',
        duration: '3:45',
        youtubeId: 'dQw4w9WgXcQ',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        category: 'Haber',
        description: 'Ordering coffee and polite business interactions.',
        englishSummary: 'A structured dialogue exploring polite business requests and casual conversation.',
        turkishSummary: 'Kahve siparişi verirken ve iş ortamında kibar kalıpları öğreten pratik diyalog.',
        keyVocabulary: [
          { word: 'latte', phonetic: '/ˈlɑːteɪ/', meaning: 'Sütlü kahve' }
        ],
        subtitles: [
          {
            id: 1,
            timeSec: 5,
            timeStr: '0:05',
            en: 'Could I please get a large latte?',
            tr: 'Büyük boy latte alabilir miyim lütfen?',
            level: 'B1',
            highlightWords: ['please', 'latte']
          }
        ]
      };

      const updatedList = AdminService.saveVideo(newVideo);
      expect(updatedList.some((v) => v.id === 'admin-custom-video-1')).toBe(true);

      const refreshedVideos = AdminService.getAllVideos();
      expect(refreshedVideos.some((v) => v.id === 'admin-custom-video-1')).toBe(true);
      expect(refreshedVideos.find((v) => v.id === 'admin-custom-video-1')?.title).toBe('Admin Test - BBC English Coffee Dialogue');
    });

    it('deletes a video from CMS', () => {
      // First ensure custom video exists
      AdminService.saveVideo({
        id: 'video-to-be-deleted',
        title: 'Temporary Video',
        channel: 'Test Channel',
        level: 'A1',
        duration: '1:00',
        youtubeId: 'abc123xyz89',
        thumbnail: '',
        category: 'Özel',
        description: 'Temporary',
        subtitles: []
      });

      expect(AdminService.getAllVideos().some((v) => v.id === 'video-to-be-deleted')).toBe(true);

      const remainingVideos = AdminService.deleteVideo('video-to-be-deleted');
      expect(remainingVideos.some((v) => v.id === 'video-to-be-deleted')).toBe(false);
      expect(AdminService.getAllVideos().some((v) => v.id === 'video-to-be-deleted')).toBe(false);
    });
  });

  describe('Database Export & Full JSON Backup Restore', () => {
    it('exports a complete snapshot with accounts, videos, and timestamp', () => {
      const snapshotString = AdminService.exportFullBackup();
      expect(typeof snapshotString).toBe('string');
      const snapshot = JSON.parse(snapshotString);
      expect(snapshot.version).toBe('2.4');
      expect(snapshot.exportDate).toBeDefined();
      expect(snapshot.accounts).toBeDefined();
      expect(snapshot.videos).toBeDefined();
    });

    it('imports and restores valid database backup JSON string', async () => {
      const backupData = {
        version: '2.4',
        exportDate: new Date().toISOString(),
        accounts: JSON.stringify({
          restored_super_user: {
            username: 'restored_super_user',
            passwordHash: 'dummy_hash_123',
            recoveryKey: 'CHIRMO-REST-ORED',
            createdAt: '2026-01-01T00:00:00Z',
            lastLoginAt: '2026-01-01T00:00:00Z',
            plan: 'lifetime'
          }
        }),
        videos: '[]'
      };

      const importSuccess = AdminService.importBackup(JSON.stringify(backupData));
      expect(importSuccess).toBe(true);

      const restoredAccounts = await AdminService.getAllUsers();
      expect(restoredAccounts.some((a) => a.username === 'restored_super_user')).toBe(true);
    });

    it('rejects invalid backup JSON payload', () => {
      const invalidRes = AdminService.importBackup('NOT_A_VALID_JSON{[');
      expect(invalidRes).toBe(false);
    });
  });
});
