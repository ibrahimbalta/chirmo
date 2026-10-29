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

export type TaskStatus = 
  | 'pending'
  | 'planning'
  | 'awaiting_approval'
  | 'running'
  | 'completed'
  | 'error'
  | 'cancelled';

export interface TaskLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  targetUrl?: string;
  result?: string;
  error?: string;
  logs: TaskLog[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  taskId?: string;
  projectId?: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'project' | 'task' | 'navigation' | 'system';
}

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

  // Projects
  getProjects: () => Promise<Project[]>;
  createProject: (name: string, description: string, color?: string) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'color'>>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  getActiveProjectId: () => Promise<string | null>;
  setActiveProjectId: (id: string | null) => Promise<void>;

  // Tasks
  getTasks: (projectId?: string) => Promise<Task[]>;
  createTask: (data: {
    projectId: string;
    title: string;
    description?: string;
    targetUrl?: string;
    status?: TaskStatus;
  }) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'logs'>>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  cancelTask: (id: string) => Promise<Task | null>;
  addTaskLog: (taskId: string, message: string, type?: 'info' | 'warn' | 'error' | 'success') => Promise<TaskLog | null>;

  // History
  getHistory: () => Promise<HistoryEntry[]>;

  // Listeners
  onTabsUpdated: (callback: (tabs: Tab[], activeTabId: string) => void) => () => void;
  onTabStateChanged: (callback: (tab: Tab) => void) => () => void;
}

declare global {
  interface Window {
    chirmo: ChirmoAPI;
  }
}
