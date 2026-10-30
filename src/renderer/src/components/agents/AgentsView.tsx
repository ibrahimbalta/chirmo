import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  HelpCircle, 
  XCircle, 
  ExternalLink, 
  ArrowRight,
  ShieldAlert,
  FileText,
  StopCircle
} from 'lucide-react';
import { Project, Task, AgentPlan, AgentStep } from '../../types';

interface AgentsViewProps {
  initialPrompt?: string;
}

export const AgentsView: React.FC<AgentsViewProps> = ({ initialPrompt }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [isRunning, setIsRunning] = useState(false);

  // Active agent execution state
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<AgentPlan | null>(null);
  const [latestTask, setLatestTask] = useState<Task | null>(null);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    loadProjects();

    if (window.chirmo) {
      const unsubPlan =
        typeof window.chirmo.onAgentPlan === 'function'
          ? window.chirmo.onAgentPlan((taskId, plan) => {
              if (taskId === currentTaskId || !currentTaskId) {
                setCurrentTaskId(taskId);
                setCurrentPlan(plan);
              }
            })
          : () => {};

      const unsubStep =
        typeof window.chirmo.onAgentStep === 'function'
          ? window.chirmo.onAgentStep((taskId, step) => {
              if (taskId === currentTaskId) {
                setCurrentPlan((prev) => {
                  if (!prev) return null;
                  const updatedSteps = prev.steps.map((s) =>
                    s.id === step.id ? { ...s, ...step } : s
                  );
                  return { ...prev, steps: updatedSteps };
                });

                // Refresh task data to get logs and results
                window.chirmo.getTasks().then((allTasks) => {
                  const found = allTasks.find((t) => t.id === taskId);
                  if (found) {
                    setLatestTask(found);
                    if (
                      found.status === 'completed' ||
                      found.status === 'error' ||
                      found.status === 'cancelled'
                    ) {
                      setIsRunning(false);
                    }
                  }
                });
              }
            })
          : () => {};

      return () => {
        if (typeof unsubPlan === 'function') unsubPlan();
        if (typeof unsubStep === 'function') unsubStep();
      };
    }
  }, [currentTaskId]);

  const loadProjects = async () => {
    if (window.chirmo) {
      const projs = await window.chirmo.getProjects();
      setProjects(projs);
      if (projs.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projs[0].id);
      }
    }
  };

  const handleStartAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !selectedProjectId || !window.chirmo) return;

    setIsRunning(true);
    setCurrentPlan(null);
    setLatestTask(null);

    try {
      const { task, plan } = await window.chirmo.startAgent({
        projectId: selectedProjectId,
        prompt: prompt.trim(),
      });
      setCurrentTaskId(task.id);
      setCurrentPlan(plan);
      setLatestTask(task);
    } catch (err: any) {
      console.error(err);
      setIsRunning(false);
    }
  };

  const handleApproveStep = async (approved: boolean) => {
    if (!currentTaskId || !window.chirmo) return;
    await window.chirmo.approveAgentStep(currentTaskId, approved);
  };

  const handleCancel = async () => {
    if (!currentTaskId || !window.chirmo) return;
    await window.chirmo.cancelAgent(currentTaskId);
    setIsRunning(false);
  };

  const handleOpenUrl = (url: string) => {
    if (window.chirmo) {
      window.chirmo.createTab(url);
    }
  };

  const awaitingStep = currentPlan?.steps.find((s) => s.status === 'awaiting_approval');

  const suggestions = [
    'mynet.com git spor haberlerini listele',
    'https://news.ycombinator.com sayfasını incele ve günün öne çıkan haberlerini özetle',
    'https://github.com/trending adresine giderek günün trend projelerini derle',
  ];

  return (
    <div className="flex-1 bg-chirmo-secondary overflow-y-auto p-4 sm:p-8 pb-20 md:pb-8 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chirmo-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-chirmo-brand text-white shadow-sm shadow-chirmo-brand/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-chirmo-text flex items-center gap-2">
                <span>AI Araştırma ve Planlama Ajanı</span>
                <span className="text-[10px] bg-chirmo-success/10 text-chirmo-success px-2 py-0.5 rounded-full font-semibold">
                  Aşama 3 Aktif
                </span>
              </h1>
              <p className="text-xs text-chirmo-text-secondary">
                Doğal dilde görev verin; ajan hedef sayfaları incelesin, verileri toplasın ve raporlasın.
              </p>
            </div>
          </div>
        </div>

        {/* Input Console */}
        <div className="bg-chirmo-bg rounded-2xl border border-chirmo-border p-6 shadow-xs space-y-4">
          <form onSubmit={handleStartAgent} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-chirmo-text">Bağlı Proje:</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={isRunning}
                  className="text-xs bg-chirmo-secondary border border-chirmo-border rounded-lg px-2.5 py-1 text-chirmo-text focus:outline-none focus:border-chirmo-brand"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {isRunning && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-medium rounded-lg transition-all"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  <span>Ajanı Durdur</span>
                </button>
              )}
            </div>

            <div>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isRunning}
                  rows={3}
                  placeholder="Yapay zekâya bir araştırma görevi verin (örn: 'https://news.ycombinator.com sayfasını ziyaret et ve öne çıkan başlıkları özetle')..."
                  className="w-full p-3 pr-24 bg-chirmo-secondary border border-chirmo-border rounded-xl text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand resize-none placeholder:text-chirmo-text-muted"
                />

                <button
                  type="submit"
                  disabled={isRunning || !prompt.trim()}
                  className="absolute right-3 bottom-4 flex items-center gap-1.5 px-4 py-2 bg-chirmo-brand hover:bg-chirmo-brand-hover disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isRunning ? 'Çalışıyor' : 'Görevi Başlat'}</span>
                </button>
              </div>
            </div>

            {/* Prompt Suggestions */}
            {!isRunning && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted">
                  Örnek Görev Şablonları:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setPrompt(s)}
                      className="text-[11px] text-left bg-chirmo-secondary hover:bg-chirmo-brand-light hover:text-chirmo-brand border border-chirmo-border px-2.5 py-1 rounded-lg transition-colors truncate max-w-full"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* User Approval Gate Banner */}
        {awaitingStep && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm animate-pulse flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-amber-900">Kullanıcı Onayı Bekleniyor</h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Bu görev hassas parametreler içermektedir ({awaitingStep.title}). İlerlemek istiyor musunuz?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleApproveStep(false)}
                className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-medium rounded-lg transition-all"
              >
                Reddet
              </button>
              <button
                onClick={() => handleApproveStep(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg shadow-xs transition-all"
              >
                İşlemi Onayla
              </button>
            </div>
          </div>
        )}

        {/* Live Plan & Execution Status */}
        {currentPlan && (
          <div className="bg-chirmo-bg rounded-2xl border border-chirmo-border p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-chirmo-border/60 pb-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted">
                  Ajan Planı
                </span>
                <h3 className="text-xs font-bold text-chirmo-text">{currentPlan.goal}</h3>
              </div>

              {currentPlan.targetUrl && (
                <button
                  onClick={() => handleOpenUrl(currentPlan.targetUrl!)}
                  className="flex items-center gap-1 text-[11px] text-chirmo-brand hover:underline font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="truncate max-w-xs">{currentPlan.targetUrl}</span>
                </button>
              )}
            </div>

            {/* Stepper */}
            <div className="space-y-3">
              {currentPlan.steps.map((step, idx) => {
                const isStepRunning = step.status === 'running';
                const isStepCompleted = step.status === 'completed';
                const isStepError = step.status === 'error';
                const isStepAwaiting = step.status === 'awaiting_approval';

                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isStepRunning
                        ? 'border-chirmo-brand bg-chirmo-brand-light/30 shadow-xs'
                        : isStepCompleted
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : isStepError
                        ? 'border-rose-200 bg-rose-50/40'
                        : isStepAwaiting
                        ? 'border-amber-300 bg-amber-50/50'
                        : 'border-chirmo-border bg-chirmo-secondary/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {isStepRunning && (
                          <Loader2 className="w-4 h-4 text-chirmo-brand animate-spin" />
                        )}
                        {isStepCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-chirmo-success" />
                        )}
                        {isStepError && (
                          <AlertCircle className="w-4 h-4 text-chirmo-error" />
                        )}
                        {isStepAwaiting && (
                          <HelpCircle className="w-4 h-4 text-amber-600" />
                        )}
                        {step.status === 'pending' && (
                          <div className="w-4 h-4 rounded-full border border-chirmo-border flex items-center justify-center text-[10px] text-chirmo-text-muted">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-chirmo-text">
                            {step.title}
                          </h4>
                          <span className="text-[10px] uppercase font-bold text-chirmo-text-muted">
                            {step.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-chirmo-text-secondary mt-0.5">
                          {step.description}
                        </p>

                        {step.result && (
                          <p className="text-[11px] text-emerald-800 font-medium mt-1 bg-white/60 p-2 rounded-lg border border-emerald-100">
                            ✓ {step.result}
                          </p>
                        )}

                        {step.error && (
                          <p className="text-[11px] text-rose-800 font-medium mt-1 bg-white/60 p-2 rounded-lg border border-rose-100">
                            ✕ {step.error}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Final Synthesized Research Report */}
        {latestTask?.result && (
          <div className="bg-chirmo-bg rounded-2xl border border-chirmo-border p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-chirmo-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-chirmo-brand" />
                <h3 className="text-sm font-bold text-chirmo-text">Üretilen Araştırma Raporu</h3>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full">
                Tamamlandı ✓
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-xs text-chirmo-text leading-relaxed whitespace-pre-wrap bg-chirmo-secondary/30 p-5 rounded-xl border border-chirmo-border font-sans">
              {latestTask.result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
