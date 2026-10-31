import { BrowserWindow, WebContentsView } from 'electron';
import { secureWebContents } from './security';
import { resolveUrlOrSearch, isSecureUrl } from './url-helper';
import { SettingsStore } from './store';
import { SessionRecovery } from './session-recovery';
import { generateErrorPage } from './error-page';

export interface TabData {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isSecure: boolean;
  groupId?: string;
  groupTitle?: string;
  groupColor?: string;
  isPinned?: boolean;
  isSuspended?: boolean;
}

export interface BrowserBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TabItem {
  data: TabData;
  view: WebContentsView;
}

export class BrowserManager {
  private win: BrowserWindow;
  private settingsStore: SettingsStore;
  private sessionRecovery: SessionRecovery;
  private tabs: Map<string, TabItem> = new Map();
  private activeTabId: string | null = null;
  private bounds: BrowserBounds = { x: 260, y: 76, width: 800, height: 600 };
  private isVisible: boolean = true;

  constructor(
    win: BrowserWindow,
    settingsStore: SettingsStore,
    sessionRecovery: SessionRecovery
  ) {
    this.win = win;
    this.settingsStore = settingsStore;
    this.sessionRecovery = sessionRecovery;
  }

  public async restoreOrInitSession(): Promise<void> {
    const saved = this.sessionRecovery.load();
    if (saved && saved.tabs && saved.tabs.length > 0) {
      for (const t of saved.tabs) {
        await this.createTab(t.url);
      }
    } else {
      await this.createTab();
    }
  }

  public getTabs(): TabData[] {
    return Array.from(this.tabs.values()).map((t) => ({ ...t.data }));
  }

  public getActiveTabId(): string | null {
    return this.activeTabId;
  }

  public async createTab(initialInput?: string): Promise<TabData> {
    const id = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const settings = this.settingsStore.get();
    const rawUrl = initialInput || settings.homePage || 'https://www.google.com';
    const resolvedUrl = resolveUrlOrSearch(rawUrl, settings.defaultSearchEngine);

    const view = new WebContentsView({
      webPreferences: {
        sandbox: true,
        contextIsolation: true,
        nodeIntegration: false,
        spellcheck: true,
      },
    });

    const tabData: TabData = {
      id,
      url: resolvedUrl,
      title: 'Yeni Sekme',
      isLoading: true,
      canGoBack: false,
      canGoForward: false,
      isSecure: isSecureUrl(resolvedUrl),
    };

    const tabItem: TabItem = {
      data: tabData,
      view,
    };

    this.tabs.set(id, tabItem);

    // Apply strict security policies
    secureWebContents(view.webContents, (newUrl) => {
      this.createTab(newUrl);
    });

    // Setup event listeners
    const contents = view.webContents;

    contents.on('did-start-loading', () => {
      tabItem.data.isLoading = true;
      this.notifyTabUpdated(tabItem.data);
    });

    contents.on('did-stop-loading', () => {
      tabItem.data.isLoading = false;
      tabItem.data.canGoBack = contents.canGoBack();
      tabItem.data.canGoForward = contents.canGoForward();
      const currentUrl = contents.getURL();
      if (currentUrl && !currentUrl.startsWith('data:')) {
        tabItem.data.url = currentUrl;
      }
      tabItem.data.isSecure = isSecureUrl(tabItem.data.url);
      this.notifyTabUpdated(tabItem.data);
      this.persistSession();
    });

    contents.on('page-title-updated', (_, title) => {
      tabItem.data.title = title || 'Sekme';
      this.notifyTabUpdated(tabItem.data);
      this.persistSession();
    });

    contents.on('page-favicon-updated', (_, favicons) => {
      if (favicons && favicons.length > 0) {
        tabItem.data.favicon = favicons[0];
        this.notifyTabUpdated(tabItem.data);
      }
    });

    contents.on('did-navigate', (_, url) => {
      if (!url.startsWith('data:')) {
        tabItem.data.url = url;
      }
      tabItem.data.canGoBack = contents.canGoBack();
      tabItem.data.canGoForward = contents.canGoForward();
      tabItem.data.isSecure = isSecureUrl(url);
      this.notifyTabUpdated(tabItem.data);
      this.persistSession();
    });

    contents.on('did-navigate-in-page', (_, url) => {
      if (!url.startsWith('data:')) {
        tabItem.data.url = url;
      }
      tabItem.data.canGoBack = contents.canGoBack();
      tabItem.data.canGoForward = contents.canGoForward();
      this.notifyTabUpdated(tabItem.data);
      this.persistSession();
    });

    // Handle network / loading errors with custom friendly error page
    contents.on('did-fail-load', (_, errorCode, errorDescription, validatedUrl) => {
      // Ignore ERR_ABORTED (-3) as it happens during normal redirect or user stop
      if (errorCode === -3) return;

      console.warn(`[BrowserManager] Failed to load ${validatedUrl}: ${errorDescription} (${errorCode})`);
      tabItem.data.isLoading = false;
      tabItem.data.title = 'Sayfaya Ulaşılamıyor';
      const errorPageDataUrl = generateErrorPage(validatedUrl, errorCode, errorDescription);
      view.webContents.loadURL(errorPageDataUrl).catch(() => {});
      this.notifyTabUpdated(tabItem.data);
    });

    // Load initial URL
    view.webContents.loadURL(resolvedUrl).catch((err) => {
      console.warn(`[BrowserManager] Failed to load ${resolvedUrl}:`, err);
    });

    // Switch to new tab
    await this.switchTab(id);

    return tabData;
  }

  public async switchTab(tabId: string): Promise<void> {
    const nextTab = this.tabs.get(tabId);
    if (!nextTab) return;

    if (this.activeTabId && this.activeTabId !== tabId) {
      const currentTab = this.tabs.get(this.activeTabId);
      if (currentTab) {
        try {
          this.win.contentView.removeChildView(currentTab.view);
        } catch {
          // ignore if already removed
        }
      }
    }

    this.activeTabId = tabId;

    if (this.isVisible) {
      try {
        this.win.contentView.addChildView(nextTab.view);
        nextTab.view.setBounds(this.bounds);
      } catch (err) {
        console.warn('[BrowserManager] Error adding child view:', err);
      }
    }

    this.notifyTabsList();
    this.persistSession();
  }

  public async closeTab(tabId: string): Promise<void> {
    const tabToClose = this.tabs.get(tabId);
    if (!tabToClose) return;

    try {
      this.win.contentView.removeChildView(tabToClose.view);
    } catch {
      // ignore
    }

    this.tabs.delete(tabId);

    if (this.activeTabId === tabId) {
      const remainingTabIds = Array.from(this.tabs.keys());
      if (remainingTabIds.length > 0) {
        await this.switchTab(remainingTabIds[remainingTabIds.length - 1]);
      } else {
        this.activeTabId = null;
        await this.createTab();
      }
    } else {
      this.notifyTabsList();
    }

    this.persistSession();
  }

  public updateBounds(bounds: BrowserBounds): void {
    this.bounds = bounds;
    if (this.activeTabId && this.isVisible) {
      const activeTab = this.tabs.get(this.activeTabId);
      if (activeTab) {
        activeTab.view.setBounds(bounds);
      }
    }
  }

  public setVisible(visible: boolean): void {
    if (this.isVisible === visible) return;
    this.isVisible = visible;

    if (!this.activeTabId) return;
    const activeTab = this.tabs.get(this.activeTabId);
    if (!activeTab) return;

    if (visible) {
      try {
        this.win.contentView.addChildView(activeTab.view);
        activeTab.view.setBounds(this.bounds);
      } catch {
        // ignore
      }
    } else {
      try {
        this.win.contentView.removeChildView(activeTab.view);
      } catch {
        // ignore
      }
    }
  }

  public navigate(tabId: string, input: string): void {
    const tab = this.tabs.get(tabId);
    if (!tab) return;
    const settings = this.settingsStore.get();
    const resolved = resolveUrlOrSearch(input, settings.defaultSearchEngine);
    tab.data.url = resolved;
    tab.data.isLoading = true;
    this.notifyTabUpdated(tab.data);
    tab.view.webContents.loadURL(resolved).catch((err) => {
      console.warn(`[BrowserManager] Failed to navigate to ${resolved}:`, err);
    });
  }

  public goBack(tabId: string): void {
    const tab = this.tabs.get(tabId);
    if (tab && tab.view.webContents.canGoBack()) {
      tab.view.webContents.goBack();
    }
  }

  public goForward(tabId: string): void {
    const tab = this.tabs.get(tabId);
    if (tab && tab.view.webContents.canGoForward()) {
      tab.view.webContents.goForward();
    }
  }

  public reload(tabId: string): void {
    const tab = this.tabs.get(tabId);
    if (tab) {
      tab.view.webContents.reload();
    }
  }

  public stopLoading(tabId: string): void {
    const tab = this.tabs.get(tabId);
    if (tab) {
      tab.view.webContents.stop();
    }
  }

  private persistSession(): void {
    const savedTabs = Array.from(this.tabs.values()).map((t) => ({
      id: t.data.id,
      url: t.data.url,
      title: t.data.title,
    }));
    this.sessionRecovery.save(savedTabs, this.activeTabId);
  }

  private notifyTabUpdated(tab: TabData): void {
    if (!this.win.isDestroyed()) {
      this.win.webContents.send('chirmo:tab-state-changed', tab);
    }
  }

  private notifyTabsList(): void {
    if (!this.win.isDestroyed()) {
      this.win.webContents.send(
        'chirmo:tabs-updated',
        this.getTabs(),
        this.activeTabId
      );
    }
  }
}
