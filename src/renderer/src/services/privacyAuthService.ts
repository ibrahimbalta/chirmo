import { FirestoreService } from './firestoreService';

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

export type SafeUserSession = Omit<UserAccount, 'passwordHash' | 'salt' | 'securityAnswerHash'>;

export const PRESET_SECURITY_QUESTIONS: string[] = [
  'En sevdiğiniz öğretmeninizin adı nedir?',
  'İlk evcil hayvanınızın adı nedir?',
  'En sevdiğiniz çocukluk arkadaşınız kimdir?',
  'Büyüdüğünüz mahallenin veya sokağın adı nedir?',
  'İlk okuduğunuz ve unutamadığınız kitabın adı nedir?'
];

const STORAGE_KEYS = {
  ACCOUNTS: 'chirmo_saas_accounts_v1',
  SESSION: 'chirmo_saas_session_v1'
};

// Universal SHA-256 hashing supporting Web Crypto API and fallback
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

  // Fallback hash implementation
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return 'fallback_' + (hash >>> 0).toString(16);
}

function generateSalt(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function normalizeUsername(raw: string): string {
  return (raw || '').trim().toLowerCase();
}

function normalizeAnswer(raw: string): string {
  return (raw || '').trim().toLowerCase();
}

export class PrivacyAuthService {
  private static listeners: Array<(user: SafeUserSession | null) => void> = [];

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
      if (raw) return JSON.parse(raw);
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

    if (!username || username.length < 3) {
      throw new Error('Kullanıcı adı en az 3 karakter olmalıdır.');
    }
    if (!password || password.length < 4) {
      throw new Error('Şifre en az 4 karakter olmalıdır.');
    }
    if (!securityQuestion || !securityQuestion.trim()) {
      throw new Error('Lütfen geçerli bir güvenlik sorusu seçin.');
    }
    if (!answer || answer.length < 2) {
      throw new Error('Güvenlik sorusu cevabı en az 2 karakter olmalıdır.');
    }

    const accounts = this.getAccounts();
    if (accounts[username]) {
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
    const passwordHash = await sha256Hex(password + salt);
    const securityAnswerHash = await sha256Hex(answer + salt);

    const newAccount: UserAccount = {
      id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
      username,
      passwordHash,
      salt,
      securityQuestion,
      securityAnswerHash,
      plan: 'free',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    accounts[username] = newAccount;
    this.saveAccounts(accounts);
    FirestoreService.saveUser(newAccount).catch((err) => console.warn('Cloud save user warning:', err));

    const safeSession: SafeUserSession = {
      id: newAccount.id,
      username: newAccount.username,
      securityQuestion: newAccount.securityQuestion,
      plan: newAccount.plan,
      createdAt: newAccount.createdAt,
      lastLogin: newAccount.lastLogin,
      syncedData: newAccount.syncedData
    };

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(safeSession));
    } catch {}

    this.notifyListeners(safeSession);
    return safeSession;
  }

  public static async login(usernameRaw: string, passwordRaw: string): Promise<SafeUserSession> {
    const username = normalizeUsername(usernameRaw);
    const password = (passwordRaw || '').trim();

    const accounts = this.getAccounts();
    let account = accounts[username];
    if (!account) {
      try {
        const cloudUser = await FirestoreService.getUser(username);
        if (cloudUser) {
          account = cloudUser;
          accounts[username] = account;
          this.saveAccounts(accounts);
        }
      } catch {}
    }

    if (!account) {
      throw new Error('Kullanıcı adı veya şifre hatalı.');
    }

    const candidateHash = await sha256Hex(password + account.salt);
    if (candidateHash !== account.passwordHash) {
      throw new Error('Kullanıcı adı veya şifre hatalı.');
    }

    account.lastLogin = new Date().toISOString();
    accounts[username] = account;
    this.saveAccounts(accounts);
    FirestoreService.saveUser(account).catch(() => {});

    const safeSession: SafeUserSession = {
      id: account.id,
      username: account.username,
      securityQuestion: account.securityQuestion,
      plan: account.plan,
      createdAt: account.createdAt,
      lastLogin: account.lastLogin,
      syncedData: account.syncedData
    };

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
    if (!account) {
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

    if (!newPassword || newPassword.length < 4) {
      throw new Error('Yeni şifre en az 4 karakter olmalıdır.');
    }

    const accounts = this.getAccounts();
    const account = accounts[username];
    if (!account) {
      throw new Error(`"${username}" kullanıcı adına ait kayıt bulunamadı.`);
    }

    const candidateAnswerHash = await sha256Hex(answer + account.salt);
    if (candidateAnswerHash !== account.securityAnswerHash) {
      throw new Error('Güvenlik sorusuna verilen yanıt hatalı. Lütfen kontrol edin.');
    }

    // Generate fresh salt and new password hash
    const newSalt = generateSalt();
    account.salt = newSalt;
    account.passwordHash = await sha256Hex(newPassword + newSalt);
    account.securityAnswerHash = await sha256Hex(answer + newSalt);

    accounts[username] = account;
    this.saveAccounts(accounts);
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

    if (!username || username.length < 3) {
      throw new Error('Kullanıcı adı en az 3 karakter olmalıdır.');
    }
    if (!password || password.length < 4) {
      throw new Error('Şifre en az 4 karakter olmalıdır.');
    }

    const accounts = this.getAccounts();
    if (accounts[username]) {
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
    const passwordHash = await sha256Hex(password + salt);
    const securityAnswerHash = await sha256Hex(answer + salt);

    const newAccount: UserAccount = {
      id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
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
    return newAccount;
  }

  // ==================== ADMIN YÖNETİM METODLARI ====================
  public static async getAllAccounts(): Promise<UserAccount[]> {
    try {
      const cloudUsers = await FirestoreService.getAllUsers();
      if (cloudUsers) {
        const accounts: Record<string, UserAccount> = {};
        cloudUsers.forEach((u) => {
          accounts[u.username] = u;
        });
        this.saveAccounts(accounts);
        return cloudUsers;
      }
    } catch (e) {
      console.warn('Could not fetch cloud accounts, falling back to local storage:', e);
    }

    const accounts = this.getAccounts();
    return Object.values(accounts);
  }

  public static updateAccountPlan(usernameRaw: string, newPlan: 'free' | 'pro' | 'lifetime'): boolean {
    const username = normalizeUsername(usernameRaw);
    const accounts = this.getAccounts();
    const account = accounts[username];
    if (!account) return false;

    account.plan = newPlan;
    accounts[username] = account;
    this.saveAccounts(accounts);
    FirestoreService.saveUser(account).catch(() => {});

    // If this is current user, update session as well
    const session = this.getCurrentUser();
    if (session && session.username === username) {
      session.plan = newPlan;
      try {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      } catch {}
      this.notifyListeners(session);
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
    const account = accounts[username];
    if (!account) return false;

    const newSalt = generateSalt();
    account.salt = newSalt;
    account.passwordHash = await sha256Hex(newPassword + newSalt);
    accounts[username] = account;
    this.saveAccounts(accounts);
    FirestoreService.saveUser(account).catch(() => {});
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
    // Cloud Firestore canlı veritabanı aktif olduğu için sahte demo hesap oluşturulmaz.
    return;
  }
}
