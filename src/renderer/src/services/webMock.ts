/**
 * Web fallback mock for Chirmo when running in a standard web browser (e.g. GitHub Pages).
 * Enables the complete UI, Omnisearch Hub, AI synthesis, and projects to work interactively.
 */

export function setupWebMock(): void {
  if (typeof window === 'undefined' || window.chirmo) return;

  const defaultProjects = [
    {
      id: 'proj_demo_1',
      name: 'Yapay Zekâ & Web Araştırması',
      description: 'Chirmo ile web sayfalarını tarama ve AI özetleri çıkarma projesi',
      color: '#6652C9',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'proj_demo_2',
      name: 'E-Ticaret Rakip Analizi',
      description: 'Piyasa fiyatları ve SEO performans takibi',
      color: '#10B981',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const defaultTasks = [
    {
      id: 'task_demo_1',
      projectId: 'proj_demo_1',
      title: 'En popüler AI arama motorlarını analiz et',
      description: 'Perplexity, Google ve Genspark özelliklerini karşılaştır',
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logs: []
    },
    {
      id: 'task_demo_2',
      projectId: 'proj_demo_1',
      title: 'TypeScript 5.5 yeniliklerini raporla',
      description: 'Tip kontrolü ve derleme hızı optimizasyonları',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logs: []
    }
  ];

  let tabs = [
    {
      id: 'tab_web_1',
      url: 'https://www.google.com',
      title: 'Google Arama',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isSecure: true
    }
  ];

  let activeTabId: string | null = 'tab_web_1';

  // @ts-ignore
  window.chirmo = {
    createTab: async (url?: string) => {
      const newTab = {
        id: `tab_web_${Date.now()}`,
        url: url || 'https://www.google.com',
        title: url ? new URL(url).hostname : 'Yeni Sekme',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isSecure: true
      };
      tabs.push(newTab);
      activeTabId = newTab.id;
      return newTab;
    },
    closeTab: async (tabId: string) => {
      tabs = tabs.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) {
        activeTabId = tabs.length > 0 ? tabs[0].id : null;
      }
    },
    switchTab: async (tabId: string) => {
      activeTabId = tabId;
    },
    getTabs: async () => [...tabs],
    getActiveTabId: async () => activeTabId,
    navigate: async (tabId: string, url: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab) {
        tab.url = url;
        try {
          tab.title = new URL(url).hostname;
        } catch {
          tab.title = url;
        }
      }
      // In web browser, allow user to open the URL directly in a new tab if desired
      if (url.startsWith('http')) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    goBack: async () => {},
    goForward: async () => {},
    reload: async () => {},
    stopLoading: async () => {},
    updateBounds: async () => {},
    setWebContentsVisible: async () => {},

    getSettings: async () => ({
      defaultSearchEngine: 'google',
      homePage: 'https://www.google.com',
      theme: 'light',
      clearCookiesOnExit: false,
      enableAdBlocker: true,
      telemetry: false,
      aiProvider: 'local'
    }),
    saveSettings: async (s: any) => s,

    minimizeWindow: () => {},
    maximizeWindow: () => {},
    closeWindow: () => {},

    getProjects: async () => defaultProjects,
    createProject: async (name: string, description: string, color?: string) => {
      const p = {
        id: `proj_${Date.now()}`,
        name,
        description,
        color: color || '#6652C9',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      defaultProjects.push(p);
      return p;
    },
    updateProject: async (id: string, updates: any) => {
      const p = defaultProjects.find((x) => x.id === id);
      if (p) Object.assign(p, updates);
      return p || null;
    },
    deleteProject: async (id: string) => {
      const idx = defaultProjects.findIndex((x) => x.id === id);
      if (idx !== -1) defaultProjects.splice(idx, 1);
      return true;
    },
    getActiveProjectId: async () => defaultProjects[0]?.id || null,
    setActiveProjectId: async () => {},

    getTasks: async () => defaultTasks,
    createTask: async (data: any) => {
      const t = {
        id: `task_${Date.now()}`,
        projectId: data.projectId,
        title: data.title,
        description: data.description || '',
        targetUrl: data.targetUrl,
        status: data.status || 'pending',
        logs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      defaultTasks.push(t);
      return t;
    },
    updateTask: async (id: string, updates: any) => {
      const t = defaultTasks.find((x) => x.id === id);
      if (t) Object.assign(t, updates);
      return t || null;
    },
    deleteTask: async (id: string) => {
      const idx = defaultTasks.findIndex((x) => x.id === id);
      if (idx !== -1) defaultTasks.splice(idx, 1);
      return true;
    },
    cancelTask: async (id: string) => {
      const t = defaultTasks.find((x) => x.id === id);
      if (t) t.status = 'cancelled';
      return t || null;
    },
    addTaskLog: async () => null,

    getHistory: async () => [
      {
        id: 'hist_1',
        action: 'Web Önizleme Oturumu Başlatıldı',
        details: 'Chirmo Web GitHub Pages üzerinde çalışıyor',
        timestamp: new Date().toISOString(),
        type: 'system' as const
      }
    ],

    startAgent: async (opts: any) => ({
      taskId: 'agent_web_task',
      goal: opts.prompt,
      steps: [
        { id: '1', title: 'Hedef Analizi', description: opts.prompt, status: 'completed' as const },
        { id: '2', title: 'Web Araması & Sentez', description: 'İçerikler sentezleniyor', status: 'completed' as const }
      ]
    }),
    approveAgentStep: async () => {},
    cancelAgent: async () => {},

    analyzePage: async (url: string) => ({
      url,
      title: 'Web Önizleme',
      wordCount: 450,
      readingTimeMinutes: 2,
      headings: ['Giriş', 'Özellikler', 'Sonuç'],
      metaDescription: 'Chirmo Masaüstü ve Web Analiz Raporu',
      status: 200,
      timestamp: new Date().toISOString()
    }),
    getWorkflowTemplates: async () => [],
    runBatchWorkflow: async () => ({
      workflowId: 'wf_demo',
      status: 'completed' as const,
      results: []
    }),

    onTabsUpdated: (cb: any) => {
      return () => {};
    },
    onTabStateChanged: (cb: any) => {
      return () => {};
    },
    onAgentPlanUpdated: (cb: any) => {
      return () => {};
    },
    onAgentApprovalRequired: (cb: any) => {
      return () => {};
    }
  };
}
