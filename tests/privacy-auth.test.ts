import { describe, it, expect, beforeEach } from 'vitest';
import {
  PrivacyAuthService,
  PRESET_SECURITY_QUESTIONS
} from '../src/renderer/src/services/privacyAuthService';

describe('Zero-PII Privacy SaaS Authentication & Database Service', () => {
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

    PrivacyAuthService.logout();
  });

  it('provides a curated list of at least 4 security questions for password recovery', () => {
    expect(PRESET_SECURITY_QUESTIONS.length).toBeGreaterThanOrEqual(4);
    expect(PRESET_SECURITY_QUESTIONS.some(q => q.toLowerCase().includes('öğretmen'))).toBe(true);
    expect(PRESET_SECURITY_QUESTIONS.some(q => q.toLowerCase().includes('arkadaş'))).toBe(true);
  });

  it('registers a new user with username, password, and security question without collecting PII', async () => {
    const user = await PrivacyAuthService.register(
      'alex99',
      'SecurePass123',
      PRESET_SECURITY_QUESTIONS[0],
      'Ahmet Hoca'
    );

    expect(user).toBeDefined();
    expect(user.username).toBe('alex99');
    expect((user as any).password).toBeUndefined(); // Never expose raw password
    expect(PrivacyAuthService.getCurrentUser()?.username).toBe('alex99');
  });

  it('prevents registering duplicate usernames', async () => {
    await PrivacyAuthService.register(
      'unique_user',
      'Pass1234',
      PRESET_SECURITY_QUESTIONS[0],
      'Mehmet'
    );

    await expect(
      PrivacyAuthService.register(
        'unique_user',
        'Pass5678',
        PRESET_SECURITY_QUESTIONS[1],
        'Pamuk'
      )
    ).rejects.toThrow(/kullanılmaktadır/i);
  });

  it('authenticates user with correct password and rejects invalid credentials', async () => {
    await PrivacyAuthService.register(
      'deniz',
      'MySecret789',
      PRESET_SECURITY_QUESTIONS[0],
      'Ayşe Öğretmen'
    );
    PrivacyAuthService.logout();
    expect(PrivacyAuthService.getCurrentUser()).toBeNull();

    // Wrong password
    await expect(PrivacyAuthService.login('deniz', 'WrongPass')).rejects.toThrow(/hatalı/i);

    // Correct password
    const session = await PrivacyAuthService.login('deniz', 'MySecret789');
    expect(session.username).toBe('deniz');
    expect(PrivacyAuthService.getCurrentUser()?.username).toBe('deniz');
  });

  it('allows password reset strictly via security question without needing email', async () => {
    await PrivacyAuthService.register(
      'murat',
      'OldPassword1',
      PRESET_SECURITY_QUESTIONS[0],
      'Hasan Öğretmen'
    );
    PrivacyAuthService.logout();

    // 1. Retrieve the registered question for the user
    const question = PrivacyAuthService.getSecurityQuestion('murat');
    expect(question).toBe(PRESET_SECURITY_QUESTIONS[0]);

    // 2. Reject reset if security answer is incorrect
    await expect(
      PrivacyAuthService.resetPasswordWithSecurityAnswer('murat', 'Yanlış Cevap', 'NewPassword99')
    ).rejects.toThrow(/yanıt hatalı/i);

    // 3. Succeed reset with normalized answer (case-insensitive & trimmed)
    const success = await PrivacyAuthService.resetPasswordWithSecurityAnswer(
      'murat',
      'hasan öğretmen ',
      'NewPassword99'
    );
    expect(success).toBe(true);

    // 4. Verify login with the new password
    const user = await PrivacyAuthService.login('murat', 'NewPassword99');
    expect(user.username).toBe('murat');
  });
});
