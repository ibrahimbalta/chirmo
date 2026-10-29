import { BrowserWindow } from 'electron';
import { WorkspaceDatabase, Task } from '../database';
import { SettingsStore } from '../store';
import { AIProvider, LocalHeuristicProvider, GeminiProvider } from './provider';
import { ToolExecutor } from './tool-executor';
import { AgentPlan, AgentStep } from './types';

interface RunningAgentContext {
  taskId: string;
  plan: AgentPlan;
  currentStepIndex: number;
  abortController: AbortController;
  isPausedForApproval: boolean;
  approvalResolver?: (approved: boolean) => void;
}

export class AgentRunner {
  private win: BrowserWindow;
  private db: WorkspaceDatabase;
  private settingsStore: SettingsStore;
  private runningAgents: Map<string, RunningAgentContext> = new Map();

  constructor(win: BrowserWindow, db: WorkspaceDatabase, settingsStore: SettingsStore) {
    this.win = win;
    this.db = db;
    this.settingsStore = settingsStore;
  }

  private getProvider(): AIProvider {
    const settings: any = this.settingsStore.get();
    if (settings.aiApiKey) {
      return new GeminiProvider(settings.aiApiKey);
    }
    return new LocalHeuristicProvider();
  }

  public async startAgent(options: {
    projectId: string;
    prompt: string;
    currentUrl?: string;
  }): Promise<{ task: Task; plan: AgentPlan }> {
    const provider = this.getProvider();

    // 1. Create a task in database
    const task = this.db.createTask({
      projectId: options.projectId,
      title: options.prompt.slice(0, 60),
      description: options.prompt,
      status: 'planning',
      targetUrl: options.currentUrl,
    });

    this.db.addTaskLog(task.id, 'Yapay zekâ araştırma ajanı başlatıldı.', 'info');

    // 2. Generate Plan
    const plan = await provider.createPlan(options.prompt, options.currentUrl);
    task.targetUrl = plan.targetUrl;
    this.db.updateTask(task.id, { targetUrl: plan.targetUrl });

    const context: RunningAgentContext = {
      taskId: task.id,
      plan,
      currentStepIndex: 0,
      abortController: new AbortController(),
      isPausedForApproval: false,
    };

    this.runningAgents.set(task.id, context);
    this.notifyPlan(task.id, plan);

    // 3. Start execution asynchronously
    this.executeNextSteps(context).catch((err) => {
      console.error(`[AgentRunner] Error in agent ${task.id}:`, err);
      this.db.updateTask(task.id, { status: 'error', error: err.message });
      this.db.addTaskLog(task.id, `Hata: ${err.message}`, 'error');
    });

    return { task, plan };
  }

  private async executeNextSteps(ctx: RunningAgentContext): Promise<void> {
    const { taskId, plan } = ctx;

    this.db.updateTask(taskId, { status: 'running' });

    for (let i = ctx.currentStepIndex; i < plan.steps.length; i++) {
      if (ctx.abortController.signal.aborted) {
        this.db.updateTask(taskId, { status: 'cancelled' });
        this.db.addTaskLog(taskId, 'Kullanıcı tarafından görev iptal edildi.', 'warn');
        this.runningAgents.delete(taskId);
        return;
      }

      const step = plan.steps[i];
      ctx.currentStepIndex = i;

      // Handle user approval gate if required
      if (step.requiresApproval) {
        step.status = 'awaiting_approval';
        this.notifyStep(taskId, step);
        this.db.updateTask(taskId, { status: 'awaiting_approval' });
        this.db.addTaskLog(
          taskId,
          `"${step.title}" adımı kullanıcı onayı bekliyor.`,
          'warn'
        );

        ctx.isPausedForApproval = true;
        const approved = await new Promise<boolean>((resolve) => {
          ctx.approvalResolver = resolve;
        });
        ctx.isPausedForApproval = false;

        if (!approved) {
          step.status = 'error';
          step.error = 'Kullanıcı işlemi reddetti.';
          this.notifyStep(taskId, step);
          this.db.updateTask(taskId, { status: 'cancelled', error: 'Kullanıcı işlemi reddetti.' });
          this.db.addTaskLog(taskId, 'İşlem kullanıcı tarafından reddedildi.', 'error');
          this.runningAgents.delete(taskId);
          return;
        }

        this.db.updateTask(taskId, { status: 'running' });
      }

      // Step execution
      step.status = 'running';
      this.notifyStep(taskId, step);
      this.db.addTaskLog(taskId, `Adım başlatıldı: ${step.title}`, 'info');

      try {
        if (i === 0) {
          // Step 1: Resolve target URL
          step.status = 'completed';
          step.result = `Hedef URL belirlendi: ${plan.targetUrl}`;
          this.notifyStep(taskId, step);
        } else if (i === 1) {
          // Step 2: Scrape web page
          if (!plan.targetUrl) {
            throw new Error('İncelenecek geçerli bir web adresi bulunamadı.');
          }

          const scraped = await ToolExecutor.scrapeWebPage(plan.targetUrl, 15000);
          (ctx as any).scrapedData = scraped;

          step.status = 'completed';
          step.result = `Sayfa incelendi: "${scraped.title}" (${scraped.wordCount} kelime, ${scraped.headings.length} başlık).`;
          this.notifyStep(taskId, step);
          this.db.addTaskLog(
            taskId,
            `Sayfa başarıyla okundu: "${scraped.title}" (${scraped.wordCount} kelime).`,
            'success'
          );
        } else if (i === 2) {
          // Step 3: Synthesize and generate research report
          const provider = this.getProvider();
          const scraped = (ctx as any).scrapedData;

          if (!scraped) {
            throw new Error('Önceki adımdan sayfa verisi alınamadı.');
          }

          const report = await provider.generateResearchReport(plan.goal, scraped);

          step.status = 'completed';
          step.result = 'Araştırma raporu ve temel bulgular başarıyla üretildi.';
          this.notifyStep(taskId, step);

          // Update task with final result
          this.db.updateTask(taskId, {
            status: 'completed',
            result: report.summary,
          });
          this.db.addTaskLog(
            taskId,
            'Araştırma ajanı görevi başarıyla tamamladı.',
            'success'
          );
        }
      } catch (err: any) {
        step.status = 'error';
        step.error = err.message;
        this.notifyStep(taskId, step);
        this.db.updateTask(taskId, { status: 'error', error: err.message });
        this.db.addTaskLog(taskId, `Adım hatası: ${err.message}`, 'error');
        this.runningAgents.delete(taskId);
        return;
      }
    }

    this.runningAgents.delete(taskId);
  }

  public approveStep(taskId: string, approved: boolean): void {
    const ctx = this.runningAgents.get(taskId);
    if (ctx && ctx.approvalResolver) {
      ctx.approvalResolver(approved);
      ctx.approvalResolver = undefined;
    }
  }

  public cancelAgent(taskId: string): void {
    const ctx = this.runningAgents.get(taskId);
    if (ctx) {
      ctx.abortController.abort();
      if (ctx.approvalResolver) {
        ctx.approvalResolver(false);
      }
      this.runningAgents.delete(taskId);
    }
  }

  private notifyPlan(taskId: string, plan: AgentPlan): void {
    if (!this.win.isDestroyed()) {
      this.win.webContents.send('chirmo:agent-plan', taskId, plan);
    }
  }

  private notifyStep(taskId: string, step: AgentStep): void {
    if (!this.win.isDestroyed()) {
      this.win.webContents.send('chirmo:agent-step', taskId, step);
    }
  }
}
