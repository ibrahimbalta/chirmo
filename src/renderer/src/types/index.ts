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
  aiApiKey?: string;
  aiProvider?: 'local' | 'gemini';
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

export interface AgentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'awaiting_approval';
  requiresApproval?: boolean;
  result?: string;
  error?: string;
}

export interface AgentPlan {
  goal: string;
  targetUrl?: string;
  steps: AgentStep[];
}

export interface PageAnalysisResult {
  url: string;
  title: string;
  metaDescription: string;
  wordCount: number;
  headings: string[];
  linksCount: number;
  isHttps: boolean;
  readabilityScore: string;
  topKeywords: { word: string; count: number }[];
  analyzedAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'scrape' | 'analyze' | 'summarize';
  targetUrl?: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: string;
}

export interface WorkflowDefinition {
  id: string;
  title: string;
  description: string;
  category: 'research' | 'seo' | 'news';
  icon: string;
  steps: WorkflowStep[];
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

  // AI Agent
  startAgent: (options: { projectId: string; prompt: string; currentUrl?: string }) => Promise<{ task: Task; plan: AgentPlan }>;
  approveAgentStep: (taskId: string, approved: boolean) => Promise<void>;
  cancelAgent: (taskId: string) => Promise<void>;

  // Tools & Workflows
  analyzePage: (url: string) => Promise<PageAnalysisResult>;
  getWorkflowTemplates: () => Promise<WorkflowDefinition[]>;
  runBatchWorkflow: (projectId: string, urls: string[], title?: string) => Promise<string>;

  // Listeners
  onTabsUpdated: (callback: (tabs: Tab[], activeTabId: string) => void) => () => void;
  onTabStateChanged: (callback: (tab: Tab) => void) => () => void;
  onAgentPlan: (callback: (taskId: string, plan: AgentPlan) => void) => () => void;
  onAgentStep: (callback: (taskId: string, step: AgentStep) => void) => () => void;
}

declare global {
  interface Window {
    chirmo: ChirmoAPI;
  }
}
