import { app, BrowserWindow } from 'electron';
import path from 'path';
import { setupSecurityPolicies } from './security';
import { SettingsStore } from './store';
import { WorkspaceDatabase } from './database';
import { SessionRecovery } from './session-recovery';
import { BrowserManager } from './browser-manager';
import { AgentRunner } from './ai/agent-runner';
import { WorkflowEngine } from './ai/workflow-engine';
import { registerIpcHandlers } from './ipc-handlers';

let mainWindow: BrowserWindow | null = null;
let browserManager: BrowserManager | null = null;
let settingsStore: SettingsStore | null = null;
let database: WorkspaceDatabase | null = null;
let sessionRecovery: SessionRecovery | null = null;
let agentRunner: AgentRunner | null = null;
let workflowEngine: WorkflowEngine | null = null;

async function createWindow(): Promise<void> {
  setupSecurityPolicies();

  settingsStore = new SettingsStore();
  database = new WorkspaceDatabase();
  sessionRecovery = new SessionRecovery();
  workflowEngine = new WorkflowEngine(database);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'Chirmo',
    backgroundColor: '#FFFFFF',
    frame: false, // Custom sleek titlebar matching Chirmo brand
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  browserManager = new BrowserManager(mainWindow, settingsStore, sessionRecovery);
  agentRunner = new AgentRunner(mainWindow, database, settingsStore);

  registerIpcHandlers(
    mainWindow,
    browserManager,
    settingsStore,
    database,
    agentRunner,
    workflowEngine
  );

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    await mainWindow.loadURL(devServerUrl);
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Restore previous tabs or init fresh session
  await browserManager.restoreOrInitSession();

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    browserManager = null;
    database = null;
    sessionRecovery = null;
    agentRunner = null;
    workflowEngine = null;
  });
}

app.whenReady().then(async () => {
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
