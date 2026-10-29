import { WorkspaceDatabase } from '../database';
import { ToolExecutor } from './tool-executor';
import { ToolsService } from './tools-service';

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

export class WorkflowEngine {
  private db: WorkspaceDatabase;

  constructor(db: WorkspaceDatabase) {
    this.db = db;
  }

  public getTemplates(): WorkflowDefinition[] {
    return [
      {
        id: 'wf_competitor',
        title: 'Çoklu Sayfa & Rakip Analizi',
        description: 'Birden fazla rakip veya ürün sayfasını sırayla tarayarak kapsamlı bir karşılaştırma raporu üretir.',
        category: 'research',
        icon: 'FolderKanban',
        steps: [
          { id: 'step_1', name: '1. Hedef Sayfayı İncele', type: 'scrape', status: 'pending' },
          { id: 'step_2', name: '2. Hedef Sayfayı İncele', type: 'scrape', status: 'pending' },
          { id: 'step_3', name: 'Karşılaştırmalı Rapor Derle', type: 'summarize', status: 'pending' },
        ],
      },
      {
        id: 'wf_seo_audit',
        title: 'Derinlemesine SEO ve İçerik Denetimi',
        description: 'Sayfanın meta etiketlerini, kelime sıklığını, başlık yapısını ve okunabilirlik skorunu analiz eder.',
        category: 'seo',
        icon: 'Search',
        steps: [
          { id: 'step_1', name: 'DOM ve Meta Verilerini Ayıkla', type: 'scrape', status: 'pending' },
          { id: 'step_2', name: 'Anahtar Kelime ve Yoğunluk Analizi', type: 'analyze', status: 'pending' },
          { id: 'step_3', name: 'SEO Skoru ve Eksiklik Raporu Üret', type: 'summarize', status: 'pending' },
        ],
      },
      {
        id: 'wf_news_digest',
        title: 'Günlük Teknoloji & Trend Bülteni',
        description: 'Trend kaynaklarını (Hacker News, GitHub Trending) tarayıp tek sayfalık yönetici özeti çıkarır.',
        category: 'news',
        icon: 'Sparkles',
        steps: [
          { id: 'step_1', name: 'Haber Kaynaklarını Tara', type: 'scrape', status: 'pending' },
          { id: 'step_2', name: 'Öne Çıkan Başlıkları Filtrele', type: 'analyze', status: 'pending' },
          { id: 'step_3', name: 'Günlük Bülten Raporunu Kaydet', type: 'summarize', status: 'pending' },
        ],
      },
    ];
  }

  public async runBatchScrape(
    projectId: string,
    urls: string[],
    workflowTitle = 'Toplu Web Araştırması'
  ): Promise<string> {
    const task = this.db.createTask({
      projectId,
      title: workflowTitle,
      description: `${urls.length} adet web sayfası inceleniyor...`,
      status: 'running',
    });

    const results: string[] = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        this.db.addTaskLog(task.id, `[${i + 1}/${urls.length}] Taranıyor: ${url}`, 'info');
        const scraped = await ToolExecutor.scrapeWebPage(url, 15000);
        results.push(`### ${i + 1}. ${scraped.title}\n- **URL:** ${scraped.url}\n- **Açıklama:** ${scraped.description || 'Yok'}\n- **Kelime:** ~${scraped.wordCount}\n- **Başlıklar:** ${scraped.headings.slice(0, 3).join(', ') || 'Yok'}\n`);
      } catch (err: any) {
        results.push(`### ${i + 1}. Hata: ${url}\n- **Sebep:** ${err.message}\n`);
      }
    }

    const consolidatedReport = `# ${workflowTitle} — Konsolide Rapor\n\n**İncelenen Toplam Kaynak:** ${urls.length}\n**Tarih:** ${new Date().toLocaleString('tr-TR')}\n\n---\n\n${results.join('\n')}`;

    this.db.updateTask(task.id, {
      status: 'completed',
      result: consolidatedReport,
    });

    this.db.addTaskLog(task.id, 'Toplu iş akışı başarıyla tamamlandı.', 'success');

    return consolidatedReport;
  }
}
