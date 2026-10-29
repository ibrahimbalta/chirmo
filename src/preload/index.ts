import { contextBridge, ipcRenderer } from 'electron';
import { Tab, BrowserBounds, AppSettings, Project, Task, TaskLog, HistoryEntry, TaskStatus, AgentPlan, AgentStep } from '../renderer/src/types';

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

  // Projects
  getProjects: (): Promise<Project[]> => ipcRenderer.invoke('chirmo:get-projects'),
  createProject: (name: string, description: string, color?: string): Promise<Project> =>
    ipcRenderer.invoke('chirmo:create-project', name, description, color),
  updateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'color'>>): Promise<Project | null> =>
    ipcRenderer.invoke('chirmo:update-project', id, updates),
  deleteProject: (id: string): Promise<boolean> =>
    ipcRenderer.invoke('chirmo:delete-project', id),
  getActiveProjectId: (): Promise<string | null> =>
    ipcRenderer.invoke('chirmo:get-active-project-id'),
  setActiveProjectId: (id: string | null): Promise<void> =>
    ipcRenderer.invoke('chirmo:set-active-project-id', id),

  // Tasks
  getTasks: (projectId?: string): Promise<Task[]> =>
    ipcRenderer.invoke('chirmo:get-tasks', projectId),
  createTask: (data: {
    projectId: string;
    title: string;
    description?: string;
    targetUrl?: string;
    status?: TaskStatus;
  }): Promise<Task> => ipcRenderer.invoke('chirmo:create-task', data),
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'logs'>>): Promise<Task | null> =>
    ipcRenderer.invoke('chirmo:update-task', id, updates),
  deleteTask: (id: string): Promise<boolean> =>
    ipcRenderer.invoke('chirmo:delete-task', id),
  cancelTask: (id: string): Promise<Task | null> =>
    ipcRenderer.invoke('chirmo:cancel-task', id),
  addTaskLog: (taskId: string, message: string, type?: 'info' | 'warn' | 'error' | 'success'): Promise<TaskLog | null> =>
    ipcRenderer.invoke('chirmo:add-task-log', taskId, message, type),

  // History
  getHistory: (): Promise<HistoryEntry[]> =>
    ipcRenderer.invoke('chirmo:get-history'),

  // AI Agent
  startAgent: (options: { projectId: string; prompt: string; currentUrl?: string }): Promise<{ task: Task; plan: AgentPlan }> =>
    ipcRenderer.invoke('chirmo:start-agent', options),
  approveAgentStep: (taskId: string, approved: boolean): Promise<void> =>
    ipcRenderer.invoke('chirmo:approve-agent-step', taskId, approved),
  cancelAgent: (taskId: string): Promise<void> =>
    ipcRenderer.invoke('chirmo:cancel-agent', taskId),

  // Listeners
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

  onAgentPlan: (callback: (taskId: string, plan: AgentPlan) => void) => {
    const listener = (_: any, taskId: string, plan: AgentPlan) => callback(taskId, plan);
    ipcRenderer.on('chirmo:agent-plan', listener);
    return () => {
      ipcRenderer.removeListener('chirmo:agent-plan', listener);
    };
  },

  onAgentStep: (callback: (taskId: string, step: AgentStep) => void) => {
    const listener = (_: any, taskId: string, step: AgentStep) => callback(taskId, step);
    ipcRenderer.on('chirmo:agent-step', listener);
    return () => {
      ipcRenderer.removeListener('chirmo:agent-step', listener);
    };
  },
};

contextBridge.exposeInMainWorld('chirmo', api);
