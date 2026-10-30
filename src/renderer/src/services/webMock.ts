/**
 * Web fallback mock for Chirmo when running in a standard web browser (e.g. GitHub Pages).
 * Powered by LiveWebScraper so AI Research Agent, Page Analyzer Tools, and Batch Workflows
 * fetch and parse REAL live websites (e.g. mynet.com, spor.mynet.com, bbc.com, etc.).
 */

import { AgentPlan, AgentStep, Task, WorkflowDefinition, PageAnalysisResult } from '../types';
import { LiveWebScraper } from './liveWebScraper';

export function setupWebMock(): void {
  if (typeof window === 'undefined' || window.chirmo) return;

  const defaultProjects = [
    {
      id: 'proj_demo_1',
      name: 'Küresel Pazar & Teknoloji Araştırması',
      description: 'Chirmo ile web kaynaklarını tarama, doğrulama ve sentez projesi',
      color: '#2563EB',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'proj_demo_2',
      name: 'Rakip & Sektör Analizi',
      description: 'Piyasa verileri, SEO metrikleri ve performans takibi',
      color: '#10B981',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const defaultTasks: Task[] = [
    {
      id: 'task_demo_1',
      projectId: 'proj_demo_1',
      title: 'Yeni nesil arama motoru mimarilerini analiz et',
      description: 'Gerçek zamanlı veri füzyonu ve karar matrisi modellerini karşılaştır',
      status: 'completed',
      result: 'Rapor tamamlandı: Çok kaynaklı doğrulama ve yerel hız önbelleklemesi %40 verim artışı sağlıyor.',
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

  const planListeners: Array<(taskId: string, plan: AgentPlan) => void> = [];
  const stepListeners: Array<(taskId: string, step: AgentStep) => void> = [];
  const tabsListeners: Array<(tabs: any[], activeId: string) => void> = [];

  const workflowTemplates: WorkflowDefinition[] = [
    {
      id: 'wf_competitor_seo',
      title: 'Çoklu Kaynak & Rakip SEO Analizi',
      description: 'Belirtilen web sitelerinin başlık, kelime yoğunluğu, bağlantı ve meta yapılarını sırayla tarayıp karşılaştırmalı rapor üretir.',
      category: 'Araştırma',
      steps: [
        { id: 's1', name: 'Sayfa Bağlantısı & SSL Kontrolü', action: 'fetch' },
        { id: 's2', name: 'Meta, Başlık & Anahtar Kelime Çıkarımı', action: 'extract' },
        { id: 's3', name: 'Karşılaştırmalı Sentez Raporu', action: 'summarize' }
      ]
    },
    {
      id: 'wf_tech_digest',
      title: 'Küresel Gündem & Haber Özeti Akışı',
      description: 'Haber ve teknoloji sitelerindeki güncel başlıkları canlı tarayarak tek raporda birleştirir.',
      category: 'Özetleme',
      steps: [
        { id: 's1', name: 'Kaynakları Ziyaret Et', action: 'fetch' },
        { id: 's2', name: 'Öne Çıkan Başlıkları Ayıkla', action: 'extract' },
        { id: 's3', name: 'Yönetici Özeti Oluştur', action: 'summarize' }
      ]
    },
    {
      id: 'wf_security_audit',
      title: 'Web Güvenlik & Okunabilirlik Denetimi',
      description: 'Hedef adreslerin HTTPS güvenliğini, içerik kalitesini ve yapısal bütünlüğünü denetler.',
      category: 'Denetim',
      steps: [
        { id: 's1', name: 'HTTPS & Protokol Denetimi', action: 'fetch' },
        { id: 's2', name: 'İçerik Yoğunluğu Hesaplama', action: 'extract' },
        { id: 's3', name: 'Denetim Raporu Kaydı', action: 'summarize' }
      ]
    }
  ];

  // @ts-ignore
  window.chirmo = {
    createTab: async (url?: string) => {
      let host = 'Yeni Sekme';
      if (url) {
        try {
          host = new URL(url).hostname;
        } catch {
          host = url;
        }
      }
      const newTab = {
        id: `tab_web_${Date.now()}`,
        url: url || 'https://www.google.com',
        title: host,
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isSecure: true
      };
      tabs.push(newTab);
      activeTabId = newTab.id;
      tabsListeners.forEach((cb) => cb([...tabs], activeTabId!));
      if (url && url.startsWith('http')) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return newTab;
    },
    closeTab: async (tabId: string) => {
      tabs = tabs.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) {
        activeTabId = tabs.length > 0 ? tabs[0].id : null;
      }
      if (activeTabId) {
        tabsListeners.forEach((cb) => cb([...tabs], activeTabId!));
      }
    },
    switchTab: async (tabId: string) => {
      activeTabId = tabId;
      tabsListeners.forEach((cb) => cb([...tabs], activeTabId!));
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

    getProjects: async () => [...defaultProjects],
    createProject: async (name: string, description: string, color?: string) => {
      const p = {
        id: `proj_${Date.now()}`,
        name,
        description,
        color: color || '#2563EB',
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

    getTasks: async (projectId?: string) => {
      if (projectId) return defaultTasks.filter((t) => t.projectId === projectId);
      return [...defaultTasks];
    },
    createTask: async (data: any) => {
      const t: Task = {
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
      defaultTasks.unshift(t);
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
        action: 'Chirmo Küresel Arama Motoru Başlatıldı',
        details: 'Canlı web kazıma ve çoklu kaynak doğrulama aktif',
        timestamp: new Date().toISOString(),
        type: 'system' as const
      }
    ],

    startAgent: async (opts: { projectId: string; prompt: string; currentUrl?: string }) => {
      const taskId = `agent_task_${Date.now()}`;
      const targetUrl = LiveWebScraper.resolveTargetUrlFromPrompt(opts.prompt);

      const steps: AgentStep[] = [
        {
          id: 'step_1',
          title: 'Hedef & Adres Çözümleme',
          description: `"${opts.prompt}" komutu çözümlendi ➔ Hedef: ${targetUrl}`,
          status: 'completed',
          result: `Hedef kaynak belirlendi: ${targetUrl}`
        },
        {
          id: 'step_2',
          title: 'Canlı Web Sayfası Kazıma & Başlık Çıkarımı',
          description: `${targetUrl} adresine bağlanılarak güncel başlıklar okunuyor...`,
          status: 'running'
        },
        {
          id: 'step_3',
          title: 'Başlıkları Listeleme ve Rapor Sentezi',
          description: 'Çekilen gerçek başlıklar ve bağlantılar raporlanıyor',
          status: 'pending'
        }
      ];

      const plan: AgentPlan = {
        goal: opts.prompt,
        targetUrl,
        steps
      };

      const task: Task = {
        id: taskId,
        projectId: opts.projectId || defaultProjects[0].id,
        title: opts.prompt.slice(0, 70),
        description: `Canlı Hedef: ${targetUrl}`,
        targetUrl,
        status: 'running',
        logs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      defaultTasks.unshift(task);

      // Run REAL live scraping asynchronously!
      (async () => {
        try {
          const scraped = await LiveWebScraper.scrapeLiveWebsite(targetUrl);

          const s2Done: AgentStep = {
            ...steps[1],
            status: 'completed',
            result: `"${scraped.pageTitle}" sayfasından ${scraped.headlines.length} adet canlı başlık çekildi.`
          };
          const s3Run: AgentStep = {
            ...steps[2],
            status: 'running'
          };
          stepListeners.forEach((cb) => cb(taskId, s2Done));
          stepListeners.forEach((cb) => cb(taskId, s3Run));

          const fullReport = LiveWebScraper.formatLiveAgentReport(opts.prompt, scraped);
          task.status = 'completed';
          task.result = fullReport;

          const s3Done: AgentStep = {
            ...steps[2],
            status: 'completed',
            result: `${scraped.headlines.length} güncel başlık başarıyla listelendi ve raporlandı.`
          };
          stepListeners.forEach((cb) => cb(taskId, s3Done));
        } catch (err: any) {
          task.status = 'error';
          const sErr: AgentStep = {
            ...steps[1],
            status: 'error',
            error: err.message || 'Sayfa verisi çekilemedi.'
          };
          stepListeners.forEach((cb) => cb(taskId, sErr));
        }
      })();

      return { task, plan };
    },

    approveAgentStep: async () => {},
    cancelAgent: async (taskId: string) => {
      const t = defaultTasks.find((x) => x.id === taskId);
      if (t) t.status = 'cancelled';
    },

    analyzePage: async (url: string): Promise<PageAnalysisResult> => {
      const scraped = await LiveWebScraper.scrapeLiveWebsite(url);
      return {
        url: scraped.targetUrl,
        title: scraped.pageTitle,
        metaDescription: scraped.description,
        wordCount: scraped.wordCount,
        linksCount: scraped.linksCount,
        isHttps: scraped.isHttps,
        readabilityScore: `Yüksek (${scraped.headlines.length} Başlık Tespit Edildi)`,
        topKeywords:
          scraped.topKeywords.length > 0
            ? scraped.topKeywords
            : [{ word: 'gündem', count: 10 }],
        headings: scraped.headlines.map((h) => h.title).slice(0, 12)
      };
    },

    getWorkflowTemplates: async () => workflowTemplates,

    runBatchWorkflow: async (projectId: string, urls: string[], title?: string) => {
      const scrapedList = await Promise.all(
        urls.map((u) => LiveWebScraper.scrapeLiveWebsite(u))
      );

      const report = `===================================================================
CHIRMO CANLI TOPLU İŞ AKIŞI RAPORU: ${(title || 'Çoklu Kaynak Taraması').toUpperCase()}
Taranan Kaynak Sayısı: ${scrapedList.length}
Tarih: ${new Date().toLocaleString('tr-TR')}
===================================================================

${scrapedList
  .map(
    (s, idx) => `${idx + 1}. KAYNAK: ${s.pageTitle} (${s.targetUrl})
   • Çekilen Canlı Başlık Sayısı: ${s.headlines.length} | Kelime Hacmi: ~${s.wordCount}
   • Öne Çıkan İlk 5 Başlık:
${s.headlines
  .slice(0, 5)
  .map((h, i) => `     ${i + 1}) ${h.title}`)
  .join('\n')}`
  )
  .join('\n\n')}
===================================================================`;

      defaultTasks.unshift({
        id: `wf_task_${Date.now()}`,
        projectId: projectId || defaultProjects[0].id,
        title: `${title || 'İş Akışı'}: ${urls.length} URL Tarandı`,
        description: urls.join(', '),
        status: 'completed',
        result: report,
        logs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return report;
    },

    onTabsUpdated: (cb: any) => {
      tabsListeners.push(cb);
      return () => {
        const i = tabsListeners.indexOf(cb);
        if (i !== -1) tabsListeners.splice(i, 1);
      };
    },
    onTabStateChanged: () => {
      return () => {};
    },
    onAgentPlan: (cb: (taskId: string, plan: AgentPlan) => void) => {
      planListeners.push(cb);
      return () => {
        const i = planListeners.indexOf(cb);
        if (i !== -1) planListeners.splice(i, 1);
      };
    },
    onAgentStep: (cb: (taskId: string, step: AgentStep) => void) => {
      stepListeners.push(cb);
      return () => {
        const i = stepListeners.indexOf(cb);
        if (i !== -1) stepListeners.splice(i, 1);
      };
    }
  };
}
