import { contextBridge, ipcRenderer } from 'electron';

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

const api = {
  createTab: (url?: string): Promise<Tab> => ipcRenderer.invoke('chirmo:create-tab', url),
  closeTab: (tabId: string): Promise<void> => ipcRenderer.invoke('chirmo:close-tab', tabId),
  switchTab: (tabId: string): Promise<void> => ipcRenderer.invoke('chirmo:switch-tab', tabId),
  getTabs: (): Promise<Tab[]> => ipcRenderer.invoke('chirmo:get-tabs'),
  getActiveTabId: (): Promise<string | null> => ipcRenderer.invoke('chirmo:get-active-tab-id'),

  navigate: (tabId: string, input: string): Promise<void> =>
    ipcRenderer.invoke('chirmo:navigate', tabId, input),
  goBack: (tabId: string): Promise<void> => ipcRenderer.invoke('chirmo:go-back', tabId),
  goForward: (tabId: string): Promise<void> => ipcRenderer.invoke('chirmo:go-forward', tabId),
  reload: (tabId: string): Promise<void> => ipcRenderer.invoke('chirmo:reload', tabId),
  stopLoading: (tabId: string): Promise<void> => ipcRenderer.invoke('chirmo:stop-loading', tabId),

  updateBounds: (bounds: BrowserBounds): Promise<void> =>
    ipcRenderer.invoke('chirmo:update-bounds', bounds),
  setWebContentsVisible: (visible: boolean): Promise<void> =>
    ipcRenderer.invoke('chirmo:set-visibility', visible),

  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('chirmo:get-settings'),
  saveSettings: (settings: Partial<AppSettings>): Promise<AppSettings> =>
    ipcRenderer.invoke('chirmo:save-settings', settings),

  minimizeWindow: (): void => ipcRenderer.send('chirmo:window-minimize'),
  maximizeWindow: (): void => ipcRenderer.send('chirmo:window-maximize'),
  closeWindow: (): void => ipcRenderer.send('chirmo:window-close'),

  onTabsUpdated: (callback: (tabs: Tab[], activeTabId: string) => void) => {
    const listener = (_: any, tabs: Tab[], activeTabId: string) => callback(tabs, activeTabId);
    ipcRenderer.on('chirmo:tabs-updated', listener);
    return () => {
      ipcRenderer.removeListener('chirmo:tabs-updated', listener);
    };
  },

  onTabStateChanged: (callback: (tab: Tab) => void) => {
    const listener = (_: any, tab: Tab) => callback(tab);
    ipcRenderer.on('chirmo:tab-state-changed', listener);
    return () => {
      ipcRenderer.removeListener('chirmo:tab-state-changed', listener);
    };
  },
};

contextBridge.exposeInMainWorld('chirmo', api);
