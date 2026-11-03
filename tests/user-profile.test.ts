import { describe, it, expect, beforeEach } from 'vitest';
import { UserProfileService } from '../src/renderer/src/services/userProfileService';

describe('Chirmo Localized User Profile Service', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    (global as any).localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
      length: 0,
      key: () => null
    };
  });

  it('provides a safe default profile for any new browser session without leaking names', () => {
    const profile = UserProfileService.getProfile();
    expect(profile.name).toBe('Öğrenci');
    expect(profile.hasCustomName).toBe(false);
    expect(profile.level).toBe('A1');
    expect(profile.avatarEmoji).toBe('🎓');
    expect(profile.dailyGoal).toBe(20);
  });

  it('saves and isolates custom user name in the current browser only', () => {
    const updated = UserProfileService.saveProfile({
      name: 'İbrahim',
      level: 'A2',
      avatarEmoji: '🦁',
      dailyGoal: 25
    });

    expect(updated.name).toBe('İbrahim');
    expect(updated.hasCustomName).toBe(true);
    expect(updated.level).toBe('A2');
    expect(updated.avatarEmoji).toBe('🦁');
    expect(updated.dailyGoal).toBe(25);

    const reloaded = UserProfileService.getProfile();
    expect(reloaded.name).toBe('İbrahim');
    expect(reloaded.hasCustomName).toBe(true);
  });

  it('allows user to change name to another user anytime', () => {
    UserProfileService.saveProfile({ name: 'Zeynep', level: 'B1' });
    const p1 = UserProfileService.getProfile();
    expect(p1.name).toBe('Zeynep');
    expect(p1.level).toBe('B1');

    UserProfileService.saveProfile({ name: 'Ahmet', level: 'B2' });
    const p2 = UserProfileService.getProfile();
    expect(p2.name).toBe('Ahmet');
    expect(p2.level).toBe('B2');
  });
});
