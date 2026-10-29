import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export interface AppSettings {
  defaultSearchEngine: 'google' | 'bing' | 'duckduckgo';
  homePage: string;
  theme: 'light';
  clearCookiesOnExit: boolean;
  enableAdBlocker: boolean;
  telemetry: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  defaultSearchEngine: 'google',
  homePage: 'https://www.google.com',
  theme: 'light',
  clearCookiesOnExit: false,
  enableAdBlocker: false,
  telemetry: false,
};

export class SettingsStore {
  private filePath: string;
  private settings: AppSettings;

  constructor() {
    const userData = app.getPath('userData');
    this.filePath = path.join(userData, 'chirmo-settings.json');
    this.settings = this.load();
  }

  private load(): AppSettings {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      }
    } catch (err) {
      console.warn('[SettingsStore] Failed to read settings, using defaults', err);
    }
    return { ...DEFAULT_SETTINGS };
  }

  public get(): AppSettings {
    return { ...this.settings };
  }

  public save(updates: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...updates };
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.settings, null, 2), 'utf-8');
    } catch (err) {
      console.error('[SettingsStore] Failed to write settings', err);
    }
    return { ...this.settings };
  }
}
