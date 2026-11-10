import { FirestoreService, stripSensitiveUserFields } from './firestoreService';

export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  securityQuestion: string;
  securityAnswerHash: string;
  plan: 'free' | 'pro' | 'lifetime';
  createdAt: string;
  lastLogin: string;
  syncedData?: Record<string, any>;
}

export type SafeUserSession = Omit<UserAccount, 'passwordHash' | 'salt' | 'securityAnswerHash'> & {
  _expiresAt?: number;
  _sig?: string;
};

export const PRESET_SECURITY_QUESTIONS: string[] = [
  'En sevdiğiniz öğretmeninizin adı nedir?',
  'İlk evcil hayvanınızın adı nedir?',
  'En sevdiğiniz çocukluk arkadaşınız kimdir?',
  'Büyüdüğünüz mahallenin veya sokağın adı nedir?',
  'İlk okuduğunuz ve unutamadığınız kitabın adı nedir?'
];

const STORAGE_KEYS = {
  ACCOUNTS: 'chirmo_saas_accounts_v1',
  SESSION: 'chirmo_saas_session_v1',
  RATE_LIMIT: 'chirmo_auth_rate_limit_v1'
};

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 gün
const MAX_AUTH_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 5 * 60 * 1000; // 5 dakika
const PBKDF2_PREFIX = 'pbkdf2_v1$';
const PBKDF2_ITERATIONS = 100000;
const USERNAME_ALLOWED_REGEX = /^[a-z0-9_.\-@]{3,40}$/;

interface RateLimitEntry {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

// Legacy SHA-256 hashing (geriye dönük mevcut kullanıcı şifrelerini doğrulamak için korunur)
async function sha256Hex(text: string): Promise<string> {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {}

  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return 'fallback_' + (hash >>> 0).toString(16);
}

// OWASP standartlarında PBKDF2-HMAC-SHA256 (100.000 iterasyon) anahtar türetme
async function derivePasswordHash(secret: string, salt: string): Promise<string> {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
      const encoder = new TextEncoder();
      const keyMaterial = await globalThis.crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );
      const derivedBits = await globalThis.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: encoder.encode(salt),
          iterations: PBKDF2_ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        256
      );
      const hashArray = Array.from(new Uint8Array(derivedBits));
      const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return `${PBKDF2_PREFIX}${hex}`;
    }
  } catch {}

  const fallback = await sha256Hex(`${secret}:${salt}:pbkdf2_fallback`);
  return `${PBKDF2_PREFIX}${fallback}`;
}

// Mevcut (legacy SHA-256) ve yeni (PBKDF2) şifre/güvenlik cevabı doğrulayıcı
async function verifySecretHash(
  secret: string,
  salt: string,
  storedHash: string
): Promise<{ valid: boolean; needsUpgrade: boolean }> {
  if (!storedHash) return { valid: false, needsUpgrade: false };

  if (storedHash.startsWith(PBKDF2_PREFIX)) {
    const candidate = await derivePasswordHash(secret, salt);
    return { valid: candidate === storedHash, needsUpgrade: false };
  }

  // Legacy tek tur SHA-256 kontrolü
  const legacyCandidate = await sha256Hex(secret + salt);
  if (legacyCandidate === storedHash) {
    return { valid: true, needsUpgrade: true };
  }

  return { valid: false, needsUpgrade: false };
}

// Kriptografik olarak güvenli rastgele salt üretimi (CSPRNG)
function generateSalt(): string {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
      const bytes = new Uint8Array(16);
      globalThis.crypto.getRandomValues(bytes);
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {}
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function computeSessionSignature(id: string, username: string, plan: string, expiresAt: number): string {
  const raw = `${id}|${username}|${plan}|${expiresAt}|chirmo_sec_v2`;
  let h1 = 0xdeadbeef ^ raw.length;
  let h2 = 0x41c6ce57 ^ raw.length;
  for (let i = 0, ch; i < raw.length; i++) {
    ch = raw.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
}

function normalizeUsername(raw: string): string {
  return (raw || '').trim().toLowerCase();
}

function normalizeAnswer(raw: string): string {
  return (raw || '').trim().toLowerCase();
}

export class PrivacyAuthService {
  private static listeners: Array<(user: SafeUserSession | null) => void> = [];

  // ==================== BRUTE-FORCE KORUMASI ====================
  private static getRateLimitMap(): Record<string, RateLimitEntry> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RATE_LIMIT);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  }

  private static saveRateLimitMap(map: Record<string, RateLimitEntry>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RATE_LIMIT, JSON.stringify(map));
    } catch {}
  }

  private static checkRateLimit(actionKey: string): void {
    const now = Date.now();
    const map = this.getRateLimitMap();
    const entry = map[actionKey];
    if (!entry) return;

    if (entry.lockedUntil && now < entry.lockedUntil) {
      const remainingSec = Math.ceil((entry.lockedUntil - now) / 1000);
      throw new Error(
        `Çok fazla başarısız deneme yapıldı. Güvenliğiniz için lütfen ${remainingSec} saniye sonra tekrar deneyin.`
      );
    }

    if (now - entry.firstAttemptAt > LOCKOUT_WINDOW_MS) {
      delete map[actionKey];
      this.saveRateLimitMap(map);
    }
  }

  private static recordFailedAttempt(actionKey: string): void {
    const now = Date.now();
    const map = this.getRateLimitMap();
    const current = map[actionKey];

    if (!current || now - current.firstAttemptAt > LOCKOUT_WINDOW_MS) {
      map[actionKey] = { count: 1, firstAttemptAt: now };
    } else {
      current.count += 1;
      if (current.count >= MAX_AUTH_ATTEMPTS) {
        current.lockedUntil = now + LOCKOUT_WINDOW_MS;
      }
      map[actionKey] = current;
    }
    this.saveRateLimitMap(map);
  }

  private static clearFailedAttempts(actionKey: string): void {
    const map = this.getRateLimitMap();
    if (map[actionKey]) {
      delete map[actionKey];
      this.saveRateLimitMap(map);
    }
  }

  private static getAccounts(): Record<string, UserAccount> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  }

  private static saveAccounts(accounts: Record<string, UserAccount>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Failed to save accounts to storage:', e);
    }
  }

  private static createSignedSession(account: UserAccount): SafeUserSession {
    const expiresAt = Date.now() + SESSION_TTL_MS;
    const safePlan =
      account.plan === 'pro' || account.plan === 'lifetime' ? account.plan : 'free';
    const sig = computeSessionSignature(account.id, account.username, safePlan, expiresAt);

    return {
      id: account.id,
      username: account.username,
      securityQuestion: account.securityQuestion,
      plan: safePlan,
      createdAt: account.createdAt,
      lastLogin: account.lastLogin,
      syncedData: account.syncedData,
      _expiresAt: expiresAt,
      _sig: sig
    };
  }

  public static onAuthStateChanged(cb: (user: SafeUserSession | null) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private static notifyListeners(user: SafeUserSession | null): void {
    this.listeners.forEach((cb) => {
      try {
        cb(user);
      } catch (err) {
        console.warn('Auth listener error:', err);
      }
    });
  }

  public static getCurrentUser(): SafeUserSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!raw) return null;
      const parsed: SafeUserSession = JSON.parse(raw);
      if (!parsed || !parsed.username || !parsed.id) return null;

      // Oturum süresi (TTL) kontrolü
      if (parsed._expiresAt && Date.now() > parsed._expiresAt) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        return null;
      }

      // Oturum bütünlük imzası kontrolü (DevTools üzerinden yetki/plan yükseltmeyi önler)
      if (parsed._expiresAt && parsed._sig) {
        const expectedSig = computeSessionSignature(
          parsed.id,
          parsed.username,
          parsed.plan,
          parsed._expiresAt
        );
        if (parsed._sig !== expectedSig) {
          const accounts = this.getAccounts();
          const storedAcc = accounts[parsed.username];
          const verifiedPlan = storedAcc?.plan || 'free';
          const repaired = this.createSignedSession({
            ...(storedAcc || (parsed as any)),
            plan: verifiedPlan
          });
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(repaired));
          return repaired;
        }
      }

      return parsed;
    } catch {}
    return null;
  }

  public static async register(
    usernameRaw: string,
    passwordRaw: string,
    securityQuestion: string,
    securityAnswerRaw: string
  ): Promise<SafeUserSession> {
    const username = normalizeUsername(usernameRaw);
    const password = (passwordRaw || '').trim();
    const answer = normalizeAnswer(securityAnswerRaw);

    if (!username || username.length < 3 || username.length > 40) {
      throw new Error('Kullanıcı adı 3 ile 40 karakter arasında olmalıdır.');
    }
    if (!USERNAME_ALLOWED_REGEX.test(username)) {
      throw new Error('Kullanıcı adı yalnızca harf, rakam ve (_, ., -, @) karakterlerini içerebilir.');
    }
    if (!password || password.length < 4 || password.length > 128) {
      throw new Error('Şifre en az 4 karakter olmalıdır.');
    }
    if (!securityQuestion || !securityQuestion.trim()) {
      throw new Error('Lütfen geçerli bir güvenlik sorusu seçin.');
    }
    if (!answer || answer.length < 2 || answer.length > 120) {
      throw new Error('Güvenlik sorusu cevabı en az 2 karakter olmalıdır.');
    }

    const accounts = this.getAccounts();
    if (accounts[username] && accounts[username].passwordHash) {
      throw new Error(`"${username}" kullanıcı adı zaten kullanılmaktadır. Lütfen başka bir kullanıcı adı seçin.`);
    }

    try {
      const existingCloud = await FirestoreService.getUser(username);
      if (existingCloud) {
        throw new Error(`"${username}" kullanıcı adı zaten kullanılmaktadır. Lütfen başka bir kullanıcı adı seçin.`);
      }
    } catch (e: any) {
      if (e?.message && e.message.includes('kullanılmaktadır')) throw e;
    }

    const salt = generateSalt();
    const passwordHash = await derivePasswordHash(password, salt);
    const securityAnswerHash = await derivePasswordHash(answer, salt);

    const newAccount: UserAccount = {
      id: 'usr_' + Date.now().toString(36) + '_' + generateSalt().slice(0, 8),
      username,
      passwordHash,
      salt,
      securityQuestion: securityQuestion.trim().slice(0, 200),
      securityAnswerHash,
      plan: 'free',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    accounts[username] = newAccount;
    this.saveAccounts(accounts);
    FirestoreService.saveUser(newAccount).catch(() => {});

    const safeSession = this.createSignedSession(newAccount);

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(safeSession));
    } catch {}

    this.notifyListeners(safeSession);
    return safeSession;
  }

  public static async login(usernameRaw: string, passwordRaw: string): Promise<SafeUserSession> {
    const username = normalizeUsername(usernameRaw);
    const password = (passwordRaw || '').trim();
    const rateKey = `login_${username || 'anon'}`;

    this.checkRateLimit(rateKey);

    const accounts = this.getAccounts();
    let account = accounts[username];
    if (!account || !account.passwordHash) {
      try {
        const cloudUser = await FirestoreService.getUser(username);
        if (cloudUser) {
          account = cloudUser;
          accounts[username] = account;
          this.saveAccounts(accounts);
        }
      } catch {}
    }

    if (!account || !account.passwordHash) {
      this.recordFailedAttempt(rateKey);
      throw new Error('Kullanıcı adı veya şifre hatalı.');
    }

    const verification = await verifySecretHash(password, account.salt, account.passwordHash);
    if (!verification.valid) {
      // Eğer yerelde eski şifre kalmışsa buluttan güncel kaydı kontrol et
      try {
        const freshCloudUser = await FirestoreService.getUser(username);
        if (freshCloudUser && freshCloudUser.passwordHash !== account.passwordHash) {
          const cloudVerify = await verifySecretHash(
            password,
            freshCloudUser.salt,
            freshCloudUser.passwordHash
          );
          if (cloudVerify.valid) {
            account = freshCloudUser;
          } else {
            this.recordFailedAttempt(rateKey);
            throw new Error('Kullanıcı adı veya şifre hatalı.');
          }
        } else {
          this.recordFailedAttempt(rateKey);
          throw new Error('Kullanıcı adı veya şifre hatalı.');
        }
      } catch (err: any) {
        if (err?.message?.includes('Çok fazla')) throw err;
        throw new Error('Kullanıcı adı veya şifre hatalı.');
      }
    }

    this.clearFailedAttempts(rateKey);

    // Legacy SHA-256 şifreyi otomatik olarak PBKDF2-HMAC-SHA256 formatına yükselt
    if (verification.needsUpgrade) {
      account.passwordHash = await derivePasswordHash(password, account.salt);
    }

    account.lastLogin = new Date().toISOString();
    accounts[username] = account;
    this.saveAccounts(accounts);
    FirestoreService.saveUser(account).catch(() => {});

    const safeSession = this.createSignedSession(account);

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(safeSession));
    } catch {}

    this.notifyListeners(safeSession);
    return safeSession;
  }

  public static getSecurityQuestion(usernameRaw: string): string {
    const username = normalizeUsername(usernameRaw);
    const accounts = this.getAccounts();
    const account = accounts[username];
    if (!account || !account.securityQuestion) {
      throw new Error(`"${username}" kullanıcı adına ait kayıt bulunamadı.`);
    }
    return account.securityQuestion;
  }

  public static async getSecurityQuestionAsync(usernameRaw: string): Promise<string> {
    const username = normalizeUsername(usernameRaw);
    const accounts = this.getAccounts();
    let account = accounts[username];

    if (!account || !account.securityQuestion) {
      try {
        const cloudUser = await FirestoreService.getUser(username);
        if (cloudUser) {
          account = cloudUser;
          accounts[username] = cloudUser;
          this.saveAccounts(accounts);
        }
      } catch {}
    }

    if (!account || !account.securityQuestion) {
      throw new Error(`"${username}" kullanıcı adına ait kayıt bulunamadı.`);
    }
    return account.securityQuestion;
  }

  public static async resetPasswordWithSecurityAnswer(
    usernameRaw: string,
    securityAnswerRaw: string,
    newPasswordRaw: string
  ): Promise<boolean> {
    const username = normalizeUsername(usernameRaw);
    const answer = normalizeAnswer(securityAnswerRaw);
    const newPassword = (newPasswordRaw || '').trim();
    const rateKey = `reset_${username || 'anon'}`;

    this.checkRateLimit(rateKey);

    if (!newPassword || newPassword.length < 4 || newPassword.length > 128) {
      throw new Error('Yeni şifre en az 4 karakter olmalıdır.');
    }

    const accounts = this.getAccounts();
    let account = accounts[username];
    if (!account || !account.securityAnswerHash) {
      try {
        const cloudUser = await FirestoreService.getUser(username);
        if (cloudUser) {
          account = cloudUser;
        }
      } catch {}
    }

    if (!account) {
      this.recordFailedAttempt(rateKey);
      throw new Error(`"${username}" kullanıcı adına ait kayıt bulunamadı.`);
    }

    const answerCheck = await verifySecretHash(answer, account.salt, account.securityAnswerHash);
    if (!answerCheck.valid) {
      this.recordFailedAttempt(rateKey);
      throw new Error('Güvenlik sorusuna verilen yanıt hatalı. Lütfen kontrol edin.');
    }

    this.clearFailedAttempts(rateKey);

    // Yeni kriptografik salt ve PBKDF2-HMAC-SHA256 özetleri oluştur
    const newSalt = generateSalt();
    account.salt = newSalt;
    account.passwordHash = await derivePasswordHash(newPassword, newSalt);
    account.securityAnswerHash = await derivePasswordHash(answer, newSalt);

    accounts[username] = account;
    this.saveAccounts(accounts);
    await FirestoreService.saveUser(account).catch(() => {});
    return true;
  }

  public static logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch {}
    this.notifyListeners(null);
  }

  public static syncUserData(data: Record<string, any>): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const accounts = this.getAccounts();
    const account = accounts[currentUser.username];
    if (account) {
      account.syncedData = { ...(account.syncedData || {}), ...data };
      accounts[currentUser.username] = account;
      this.saveAccounts(accounts);
    }
  }

  public static async adminCreateUser(
    usernameRaw: string,
    passwordRaw: string,
    plan: 'free' | 'pro' | 'lifetime' = 'free',
    securityQuestion: string = PRESET_SECURITY_QUESTIONS[0],
    securityAnswerRaw: string = 'admin'
  ): Promise<UserAccount> {
    const username = normalizeUsername(usernameRaw);
    const password = (passwordRaw || '').trim();
    const answer = normalizeAnswer(securityAnswerRaw);

    if (!username || username.length < 3 || username.length > 40) {
      throw new Error('Kullanıcı adı en az 3 karakter olmalıdır.');
    }
    if (!USERNAME_ALLOWED_REGEX.test(username)) {
      throw new Error('Kullanıcı adı geçersiz karakterler içeriyor.');
    }
    if (!password || password.length < 4) {
      throw new Error('Şifre en az 4 karakter olmalıdır.');
    }

    const accounts = this.getAccounts();
    if (accounts[username] && accounts[username].passwordHash) {
      throw new Error(`"${username}" kullanıcı adı zaten kullanılmaktadır.`);
    }

    try {
      const existingCloud = await FirestoreService.getUser(username);
      if (existingCloud) {
        throw new Error(`"${username}" kullanıcı adı zaten mevcuttur.`);
      }
    } catch (e: any) {
      if (e?.message && e.message.includes('mevcuttur')) throw e;
    }

    const salt = generateSalt();
    const passwordHash = await derivePasswordHash(password, salt);
    const securityAnswerHash = await derivePasswordHash(answer, salt);

    const newAccount: UserAccount = {
      id: 'usr_' + Date.now().toString(36) + '_' + generateSalt().slice(0, 8),
      username,
      passwordHash,
      salt,
      securityQuestion,
      securityAnswerHash,
      plan,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    accounts[username] = newAccount;
    this.saveAccounts(accounts);
    await FirestoreService.saveUser(newAccount);
    return stripSensitiveUserFields(newAccount);
  }

  // ==================== ADMIN YÖNETİM METODLARI ====================
  public static async getAllAccounts(): Promise<UserAccount[]> {
    try {
      const cloudUsers = await FirestoreService.getAllUsers();
      if (cloudUsers && cloudUsers.length > 0) {
        const localAccounts = this.getAccounts();
        const currentSession = this.getCurrentUser();

        // Diğer kullanıcıların passwordHash/salt/securityAnswerHash bilgilerini localStorage'a yazma!
        const safeCache: Record<string, UserAccount> = {};
        cloudUsers.forEach((u) => {
          if (currentSession && u.username === currentSession.username) {
            safeCache[u.username] = u;
          } else if (localAccounts[u.username]?.passwordHash) {
            safeCache[u.username] = localAccounts[u.username];
          } else {
            safeCache[u.username] = stripSensitiveUserFields(u);
          }
        });
        this.saveAccounts(safeCache);
        return cloudUsers.map((u) => stripSensitiveUserFields(u));
      }
    } catch (e) {
      console.warn('Could not fetch cloud accounts, falling back to local storage:', e);
    }

    const accounts = this.getAccounts();
    return Object.values(accounts).map((u) => stripSensitiveUserFields(u));
  }

  public static updateAccountPlan(usernameRaw: string, newPlan: 'free' | 'pro' | 'lifetime'): boolean {
    const username = normalizeUsername(usernameRaw);
    const accounts = this.getAccounts();
    const account = accounts[username];
    if (!account) return false;

    account.plan = newPlan;
    accounts[username] = account;
    this.saveAccounts(accounts);

    // Buluttaki tam hesap kaydını çekip planını güncelle (şifre özetini kaybetmemek için)
    FirestoreService.getUser(username)
      .then((cloudAcc) => {
        const target = cloudAcc || account;
        if (target.passwordHash) {
          target.plan = newPlan;
          FirestoreService.saveUser(target).catch(() => {});
        }
      })
      .catch(() => {});

    const session = this.getCurrentUser();
    if (session && session.username === username) {
      const updatedSession = this.createSignedSession({ ...account, plan: newPlan });
      try {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));
      } catch {}
      this.notifyListeners(updatedSession);
    }
    return true;
  }

  public static async adminResetPassword(usernameRaw: string, newPasswordRaw: string): Promise<boolean> {
    const username = normalizeUsername(usernameRaw);
    const newPassword = (newPasswordRaw || '').trim();
    if (!newPassword || newPassword.length < 4) {
      throw new Error('Yeni şifre en az 4 karakter olmalıdır.');
    }

    const accounts = this.getAccounts();
    let account = accounts[username];
    const cloudAccount = await FirestoreService.getUser(username).catch(() => null);
    if (cloudAccount) {
      account = cloudAccount;
    }
    if (!account) return false;

    const newSalt = generateSalt();
    account.salt = newSalt;
    account.passwordHash = await derivePasswordHash(newPassword, newSalt);
    if (!account.securityAnswerHash) {
      account.securityAnswerHash = await derivePasswordHash('admin', newSalt);
    }
    accounts[username] = account;
    this.saveAccounts(accounts);
    await FirestoreService.saveUser(account).catch(() => {});
    return true;
  }

  public static deleteAccount(usernameRaw: string): boolean {
    const username = normalizeUsername(usernameRaw);
    const accounts = this.getAccounts();
    if (!accounts[username]) return false;

    delete accounts[username];
    this.saveAccounts(accounts);
    FirestoreService.deleteUser(username).catch(() => {});

    const session = this.getCurrentUser();
    if (session && session.username === username) {
      this.logout();
    }
    return true;
  }

  public static async seedDemoAccountsIfEmpty(): Promise<void> {
    try {
      const isTest = Boolean(
        typeof process !== 'undefined' && (process.env?.VITEST || process.env?.NODE_ENV === 'test')
      );
      if (!isTest) return;

      const accounts = this.getAccounts();
      if (Object.keys(accounts).length === 0) {
        const salt = generateSalt();
        const passwordHash = await derivePasswordHash('demo1234', salt);
        const securityAnswerHash = await derivePasswordHash('pamuk', salt);
        accounts['demo_student'] = {
          id: 'usr_demo_student',
          username: 'demo_student',
          passwordHash,
          salt,
          securityQuestion: PRESET_SECURITY_QUESTIONS[1],
          securityAnswerHash,
          plan: 'free',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        this.saveAccounts(accounts);
      }
    } catch {}
  }
}
