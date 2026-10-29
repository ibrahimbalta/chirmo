import { ipcMain, BrowserWindow } from 'electron';
import { BrowserManager, BrowserBounds } from './browser-manager';
import { SettingsStore, AppSettings } from './store';

export function registerIpcHandlers(
  win: BrowserWindow,
  browserManager: BrowserManager,
  settingsStore: SettingsStore
): void {
  // Tabs
  ipcMain.handle('chirmo:create-tab', async (_, url?: string) => {
    return browserManager.createTab(url);
  });

  ipcMain.handle('chirmo:close-tab', async (_, tabId: string) => {
    await browserManager.closeTab(tabId);
  });

  ipcMain.handle('chirmo:switch-tab', async (_, tabId: string) => {
    await browserManager.switchTab(tabId);
  });

  ipcMain.handle('chirmo:get-tabs', async () => {
    return browserManager.getTabs();
  });

  ipcMain.handle('chirmo:get-active-tab-id', async () => {
    return browserManager.getActiveTabId();
  });

  // Navigation
  ipcMain.handle('chirmo:navigate', async (_, tabId: string, input: string) => {
    browserManager.navigate(tabId, input);
  });

  ipcMain.handle('chirmo:go-back', async (_, tabId: string) => {
    browserManager.goBack(tabId);
  });

  ipcMain.handle('chirmo:go-forward', async (_, tabId: string) => {
    browserManager.goForward(tabId);
  });

  ipcMain.handle('chirmo:reload', async (_, tabId: string) => {
    browserManager.reload(tabId);
  });

  ipcMain.handle('chirmo:stop-loading', async (_, tabId: string) => {
    browserManager.stopLoading(tabId);
  });

  // View bounds & visibility
  ipcMain.handle('chirmo:update-bounds', async (_, bounds: BrowserBounds) => {
    browserManager.updateBounds(bounds);
  });

  ipcMain.handle('chirmo:set-visibility', async (_, visible: boolean) => {
    browserManager.setVisible(visible);
  });

  // Settings
  ipcMain.handle('chirmo:get-settings', async () => {
    return settingsStore.get();
  });

  ipcMain.handle('chirmo:save-settings', async (_, updates: Partial<AppSettings>) => {
    return settingsStore.save(updates);
  });

  // Window controls
  ipcMain.on('chirmo:window-minimize', () => {
    win.minimize();
  });

  ipcMain.on('chirmo:window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('chirmo:window-close', () => {
    win.close();
  });
}
