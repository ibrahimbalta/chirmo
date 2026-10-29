export interface Tab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isSecure: boolean;
}

export interface BrowserBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AppSettings {
  defaultSearchEngine: 'google' | 'bing' | 'duckduckgo';
  homePage: string;
  theme: 'light';
  clearCookiesOnExit: boolean;
  enableAdBlocker: boolean;
  telemetry: boolean;
}

export type ActiveNavMenu = 
  | 'home'
  | 'browser'
  | 'projects'
  | 'agents'
  | 'tools'
  | 'workflows'
  | 'history'
  | 'settings';

export interface ChirmoAPI {
  // Tabs management
  createTab: (url?: string) => Promise<Tab>;
  closeTab: (tabId: string) => Promise<void>;
  switchTab: (tabId: string) => Promise<void>;
  getTabs: () => Promise<Tab[]>;
  getActiveTabId: () => Promise<string | null>;

  // Navigation
  navigate: (tabId: string, input: string) => Promise<void>;
  goBack: (tabId: string) => Promise<void>;
  goForward: (tabId: string) => Promise<void>;
  reload: (tabId: string) => Promise<void>;
  stopLoading: (tabId: string) => Promise<void>;

  // View bounds & visibility
  updateBounds: (bounds: BrowserBounds) => Promise<void>;
  setWebContentsVisible: (visible: boolean) => Promise<void>;

  // Settings
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;

  // Window controls
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;

  // Listeners
  onTabsUpdated: (callback: (tabs: Tab[], activeTabId: string) => void) => () => void;
  onTabStateChanged: (callback: (tab: Tab) => void) => () => void;
}

declare global {
  interface Window {
    chirmo: ChirmoAPI;
  }
}
