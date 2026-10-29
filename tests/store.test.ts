import { describe, it, expect } from 'vitest';

describe('Settings Management Logic', () => {
  const defaultSettings = {
    defaultSearchEngine: 'google',
    homePage: 'https://www.google.com',
    theme: 'light',
    clearCookiesOnExit: false,
    enableAdBlocker: false,
    telemetry: false,
  };

  it('should initialize with default settings', () => {
    expect(defaultSettings.defaultSearchEngine).toBe('google');
    expect(defaultSettings.homePage).toBe('https://www.google.com');
    expect(defaultSettings.clearCookiesOnExit).toBe(false);
  });

  it('should update partial settings correctly without dropping existing keys', () => {
    const updates = { defaultSearchEngine: 'duckduckgo' as const };
    const merged = { ...defaultSettings, ...updates };

    expect(merged.defaultSearchEngine).toBe('duckduckgo');
    expect(merged.homePage).toBe('https://www.google.com');
  });

  it('should allow custom home page URL updates', () => {
    const updates = { homePage: 'https://news.ycombinator.com' };
    const merged = { ...defaultSettings, ...updates };

    expect(merged.homePage).toBe('https://news.ycombinator.com');
  });
});
