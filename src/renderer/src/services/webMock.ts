/**
 * Web fallback mock for Chirmo when running in a standard web browser (e.g. GitHub Pages).
 * Enables the complete UI, Omnisearch Hub, AI Research Agent, Tools, Workflows, History, and Projects to work 100% interactively.
 */

import { AgentPlan, AgentStep, Task, WorkflowDefinition, PageAnalysisResult } from '../types';

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
    },
    {
      id: 'task_demo_2',
      projectId: 'proj_demo_1',
      title: 'Açık kaynak ekosistem trendlerini raporla',
      description: 'GitHub ve akademik literatür taraması',
      status: 'pending',
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
      description: 'Teknoloji ve bilim sitelerindeki güncel başlıkları tarayarak yönetici özeti formatında tek raporda birleştirir.',
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
        details: 'Çoklu kaynak doğrulama ve canlı indeksleme aktif',
        timestamp: new Date().toISOString(),
        type: 'system' as const
      },
      {
        id: 'hist_2',
        action: 'Wikipedia & OpenAlex Akademik Bağlantısı Kuruldu',
        details: 'Gerçek zamanlı ansiklopedi ve bilimsel makale taraması hazır',
        timestamp: new Date().toISOString(),
        type: 'agent' as const
      }
    ],

    startAgent: async (opts: { projectId: string; prompt: string; currentUrl?: string }) => {
      const taskId = `agent_task_${Date.now()}`;
      const urlMatch = opts.prompt.match(/https?:\/\/[^\s]+/);
      const targetUrl = urlMatch ? urlMatch[0] : 'https://tr.wikipedia.org';

      const steps: AgentStep[] = [
        {
          id: 'step_1',
          title: 'Hedef & Niyet Analizi',
          description: `"${opts.prompt}" görevi alt adımlara ayrıştırılıyor`,
          type: 'navigate',
          status: 'running',
          result: 'Hedef kaynaklar ve anahtar kavramlar belirlendi.'
        },
        {
          id: 'step_2',
          title: 'Canlı Kaynak & Veri Çıkarımı',
          description: `${targetUrl} ve küresel indekslerden veri toplanıyor`,
          type: 'extract',
          status: 'pending'
        },
        {
          id: 'step_3',
          title: 'Yapılandırılmış Rapor Sentezi',
          description: 'Toplanan bulgular doğrulanarak nihai rapor oluşturuluyor',
          type: 'summarize',
          status: 'pending'
        }
      ];

      const plan: AgentPlan = {
        taskId,
        goal: opts.prompt,
        targetUrl,
        steps
      };

      const task: Task = {
        id: taskId,
        projectId: opts.projectId || defaultProjects[0].id,
        title: opts.prompt.slice(0, 70),
        description: 'AI Araştırma Ajanı Görevi',
        targetUrl,
        status: 'running',
        logs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      defaultTasks.unshift(task);

      // Simulate real asynchronous step progression
      setTimeout(() => {
        const s1: AgentStep = {
          ...steps[0],
          status: 'completed',
          result: 'Hedef parametreler doğrulandı ve bağlantı kuruldu.'
        };
        const s2: AgentStep = {
          ...steps[1],
          status: 'running'
        };
        stepListeners.forEach((cb) => cb(taskId, s1));
        stepListeners.forEach((cb) => cb(taskId, s2));
      }, 600);

      setTimeout(() => {
        const s2Done: AgentStep = {
          ...steps[1],
          status: 'completed',
          result: 'Sayfa başlıkları, özet veriler ve anahtar metrikler başarıyla çıkarıldı.'
        };
        const s3Run: AgentStep = {
          ...steps[2],
          status: 'running'
        };
        stepListeners.forEach((cb) => cb(taskId, s2Done));
        stepListeners.forEach((cb) => cb(taskId, s3Run));
      }, 1300);

      setTimeout(() => {
        task.status = 'completed';
        task.result = `===================================================================
CHIRMO AI AJAN ARAŞTIRMA RAPORU
Görev: ${opts.prompt}
Hedef Kaynak: ${targetUrl}
Tarih: ${new Date().toLocaleString('tr-TR')}
===================================================================

1. YÖNETİCİ ÖZETİ
Verilen görev doğrultusunda hedef kaynaklar ve küresel bilgi indeksleri taranmıştır. Konuyla ilgili temel bulgular, doğruluk kontrolünden geçirilerek aşağıda maddelenmiştir.

2. ÖNE ÇIKAN BULGULAR VE VERİLER
• Kaynak erişilebilirliği ve SSL güvenlik doğrulaması: Başarılı (HTTPS Aktif).
• İncelenen içerikte yüksek bilgi yoğunluğu ve güncel referanslar tespit edilmiştir.
• Konunun uygulanabilirlik skoru %94 olarak hesaplanmıştır.

3. ÖNERİLEN AKSİYON ADIMLARI
1) Elde edilen bu raporu ilgili projenin görev listesinde referans olarak kullanın.
2) Alternatif kaynaklarla kıyaslama yapmak için Ana Sayfa Karar Matrisi aracını çalıştırın.`;

        const s3Done: AgentStep = {
          ...steps[2],
          status: 'completed',
          result: 'Araştırma raporu başarıyla oluşturuldu ve projeye kaydedildi.'
        };
        stepListeners.forEach((cb) => cb(taskId, s3Done));
      }, 2000);

      return { task, plan };
    },

    approveAgentStep: async () => {},
    cancelAgent: async (taskId: string) => {
      const t = defaultTasks.find((x) => x.id === taskId);
      if (t) t.status = 'cancelled';
    },

    analyzePage: async (url: string): Promise<PageAnalysisResult> => {
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      let host = cleanUrl;
      try {
        host = new URL(cleanUrl).hostname;
      } catch {
        // ignore
      }
      return {
        url: cleanUrl,
        title: `${host.toUpperCase()} — Küresel Web & SEO Analiz Raporu`,
        metaDescription: `${host} web sayfasının başlık yapısı, anahtar kelime yoğunluğu, bağlantı sayısı ve SSL güvenlik sertifikası Chirmo Analizörü tarafından incelenmiştir.`,
        wordCount: 840,
        linksCount: 42,
        isHttps: cleanUrl.startsWith('https'),
        readabilityScore: 'Yüksek (Akıcı & Yapılandırılmış)',
        topKeywords: [
          { word: host.split('.')[0] || 'platform', count: 18 },
          { word: 'teknoloji', count: 14 },
          { word: 'veri', count: 11 },
          { word: 'analiz', count: 9 },
          { word: 'güvenlik', count: 7 },
          { word: 'performans', count: 6 }
        ],
        headings: [
          `H1: ${host} Ana Başlık ve Değer Önerisi`,
          'H2: Temel Özellikler ve Servis Mimarisi',
          'H2: Kullanıcı Deneyimi ve Güvenlik Standartları',
          'H3: Sıkça Sorulan Sorular ve Dokümantasyon'
        ]
      };
    },

    getWorkflowTemplates: async () => workflowTemplates,

    runBatchWorkflow: async (projectId: string, urls: string[], title?: string) => {
      const report = `===================================================================
CHIRMO TOPLU İŞ AKIŞI RAPORU: ${(title || 'Çoklu Kaynak Taraması').toUpperCase()}
Taranan Kaynak Sayısı: ${urls.length}
Tarih: ${new Date().toLocaleString('tr-TR')}
===================================================================

${urls
  .map(
    (u, idx) => `${idx + 1}. KAYNAK: ${u}
   • Durum: 200 OK (HTTPS Güvenli)
   • Kelime Hacmi: ~${650 + idx * 120} kelime | Bağlantı Sayısı: ${28 + idx * 7}
   • Özet Bulgu: Sayfa yapısı modern standartlara uygun, meta açıklamaları ve başlık hiyerarşisi doğrulandı.`
  )
  .join('\n\n')}

GENEL SONUÇ:
Tüm kaynaklar başarıyla tarandı ve sonuçlar aktif projeye görev kaydı olarak eklendi.`;

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
