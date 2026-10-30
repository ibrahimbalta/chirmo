import React, { useState, useEffect } from 'react'
import {
  Bot,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  FileText,
  StopCircle,
  Bookmark,
  Check,
  Download
} from 'lucide-react'
import { Project, Task, AgentPlan } from '../../types'
import { WorkspaceStorage } from '../../services/workspaceStorage'

interface AgentsViewProps {
  initialPrompt?: string
}

export const AgentsView: React.FC<AgentsViewProps> = ({ initialPrompt }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [prompt, setPrompt] = useState(initialPrompt || '')
  const [isRunning, setIsRunning] = useState(false)
  const [reportSaved, setReportSaved] = useState(false)

  // Active agent execution state
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState<AgentPlan | null>(null)
  const [latestTask, setLatestTask] = useState<Task | null>(null)

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt)
    }
  }, [initialPrompt])

  useEffect(() => {
    loadProjects()

    if (window.chirmo) {
      const unsubPlan =
        typeof window.chirmo.onAgentPlan === 'function'
          ? window.chirmo.onAgentPlan((taskId, plan) => {
              if (taskId === currentTaskId || !currentTaskId) {
                setCurrentTaskId(taskId)
                setCurrentPlan(plan)
              }
            })
          : () => {}

      const unsubStep =
        typeof window.chirmo.onAgentStep === 'function'
          ? window.chirmo.onAgentStep((taskId, step) => {
              if (taskId === currentTaskId) {
                setCurrentPlan((prev) => {
                  if (!prev) return null
                  const updatedSteps = prev.steps.map((s) =>
                    s.id === step.id ? { ...s, ...step } : s
                  )
                  return { ...prev, steps: updatedSteps }
                })

                window.chirmo.getTasks().then((allTasks) => {
                  const found = allTasks.find((t) => t.id === taskId)
                  if (found) {
                    setLatestTask(found)
                    if (
                      found.status === 'completed' ||
                      found.status === 'error' ||
                      found.status === 'cancelled'
                    ) {
                      setIsRunning(false)
                    }
                  }
                })
              }
            })
          : () => {}

      return () => {
        if (typeof unsubPlan === 'function') unsubPlan()
        if (typeof unsubStep === 'function') unsubStep()
      }
    }
  }, [currentTaskId])

  const loadProjects = async (): Promise<void> => {
    if (window.chirmo) {
      const projs = await window.chirmo.getProjects()
      setProjects(projs)
      if (projs.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projs[0].id)
      }
    }
  }

  const handleStartAgent = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!prompt.trim() || !selectedProjectId || !window.chirmo) return

    setIsRunning(true)
    setReportSaved(false)
    setCurrentPlan(null)
    setLatestTask(null)

    try {
      const { task, plan } = await window.chirmo.startAgent({
        projectId: selectedProjectId,
        prompt: prompt.trim()
      })
      setCurrentTaskId(task.id)
      setCurrentPlan(plan)
      setLatestTask(task)
    } catch (err: any) {
      console.error(err)
      setIsRunning(false)
    }
  }

  const handleApproveStep = async (approved: boolean): Promise<void> => {
    if (!currentTaskId || !window.chirmo) return
    await window.chirmo.approveAgentStep(currentTaskId, approved)
  }

  const handleCancel = async (): Promise<void> => {
    if (!currentTaskId || !window.chirmo) return
    await window.chirmo.cancelAgent(currentTaskId)
    setIsRunning(false)
    setLatestTask((prev) =>
      prev ? { ...prev, status: 'cancelled', result: 'Araştırma görevi kullanıcı tarafından iptal edildi.' } : null
    )
  }

  const handleOpenUrl = (url: string): void => {
    if (window.chirmo) {
      window.chirmo.createTab(url)
    }
  }

  const handleSaveReportToWorkspace = (): void => {
    if (!latestTask?.result || !currentPlan) return
    WorkspaceStorage.saveResearchReport({
      goal: currentPlan.goal,
      summary: latestTask.result.slice(0, 220),
      markdownReport: latestTask.result,
      sources: currentPlan.targetUrl
        ? [{ title: currentPlan.goal, url: currentPlan.targetUrl }]
        : [],
      stepsCount: currentPlan.steps.length
    })
    setReportSaved(true)
  }

  const handleDownloadReport = (): void => {
    if (!latestTask?.result) return
    const blob = new Blob([latestTask.result], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chirmo-arastirma-raporu-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const awaitingStep = currentPlan?.steps.find((s) => s.status === 'awaiting_approval')

  const completedStepsCount =
    currentPlan?.steps.filter((s) => s.status === 'completed').length || 0
  const totalStepsCount = currentPlan?.steps.length || 1
  const progressPercent = Math.round((completedStepsCount / totalStepsCount) * 100)

  const suggestions = [
    'Elektrikli araçların 2026 yılındaki fiyatlarını, menzillerini ve avantajlarını karşılaştır.',
    'mynet.com git spor haberlerini listele',
    'Kuantum bilgisayarların siber güvenlik üzerindeki etkilerini akademik kaynaklarla araştır.',
    'https://news.ycombinator.com sayfasını incele ve günün öne çıkan haberlerini özetle'
  ]

  return (
    <div className="flex-1 bg-white overflow-y-auto p-4 sm:p-8 pb-20 md:pb-8 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chirmo-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-chirmo-brand text-white shadow-sm shadow-chirmo-brand/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-chirmo-text flex items-center gap-2">
                <span>Research — Derin Araştırma ve Planlama Motoru</span>
                <span className="text-[10px] bg-chirmo-brand-light text-chirmo-brand px-2.5 py-0.5 rounded-full font-semibold">
                  Çoklu Kaynak Doğrulama
                </span>
              </h1>
              <p className="text-xs text-chirmo-text-secondary">
                Bir araştırma hedefi veya web adresi girin; Chirmo araştırma planı hazırlasın,
                kaynakları incelesin, verileri karşılaştırsın ve raporlasın.
              </p>
            </div>
          </div>
        </div>

        {/* Input Console */}
        <div className="bg-chirmo-secondary/50 rounded-2xl border border-chirmo-border p-6 shadow-xs space-y-4">
          <form onSubmit={handleStartAgent} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-chirmo-text">Bağlı Proje:</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={isRunning}
                  className="text-xs bg-white border border-chirmo-border rounded-lg px-2.5 py-1.5 text-chirmo-text focus:outline-none focus:border-chirmo-brand"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold rounded-lg transition-all"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  <span>Araştırmayı İptal Et</span>
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
                  placeholder="Araştırma hedefini girin (Örn: 'Elektrikli araçların 2026 yılındaki fiyatlarını, menzillerini ve avantajlarını karşılaştır.')"
                  className="w-full p-3.5 pr-32 bg-white border border-chirmo-border rounded-xl text-xs sm:text-sm text-chirmo-text focus:outline-none focus:border-chirmo-brand resize-none placeholder:text-chirmo-text-muted"
                />

                <button
                  type="submit"
                  disabled={isRunning || !prompt.trim()}
                  className="absolute right-3 bottom-3.5 flex items-center gap-1.5 px-4 py-2 bg-chirmo-brand hover:bg-chirmo-brand-hover disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isRunning ? 'Araştırılıyor...' : 'Araştırmayı Başlat'}</span>
                </button>
              </div>
            </div>

            {/* Prompt Suggestions */}
            {!isRunning && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted">
                  Örnek Derin Araştırma Hedefleri:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setPrompt(s)}
                      className="text-[11px] text-left bg-white hover:bg-chirmo-brand-light hover:text-chirmo-brand border border-chirmo-border px-2.5 py-1.5 rounded-lg transition-colors truncate max-w-full"
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
                  Bu görev hassas parametreler içermektedir ({awaitingStep.title}). İlerlemek
                  istiyor musunuz?
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
          <div className="bg-white rounded-2xl border border-chirmo-border p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-chirmo-border/60 pb-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-chirmo-brand">
                  Araştırma Planı & Süreç Takibi (%{progressPercent})
                </span>
                <h3 className="text-sm font-bold text-chirmo-text mt-0.5">{currentPlan.goal}</h3>
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

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-chirmo-brand transition-all duration-300"
                style={{ width: `${Math.max(10, progressPercent)}%` }}
              />
            </div>

            {/* Stepper */}
            <div className="space-y-3">
              {currentPlan.steps.map((step, idx) => {
                const isStepRunning = step.status === 'running'
                const isStepCompleted = step.status === 'completed'
                const isStepError = step.status === 'error'
                const isStepAwaiting = step.status === 'awaiting_approval'

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
                        {isStepError && <AlertCircle className="w-4 h-4 text-chirmo-error" />}
                        {isStepAwaiting && <HelpCircle className="w-4 h-4 text-amber-600" />}
                        {step.status === 'pending' && (
                          <div className="w-4 h-4 rounded-full border border-chirmo-border flex items-center justify-center text-[10px] text-chirmo-text-muted">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-chirmo-text">{step.title}</h4>
                          <span className="text-[10px] uppercase font-bold text-chirmo-text-muted">
                            {step.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-chirmo-text-secondary mt-0.5">
                          {step.description}
                        </p>

                        {step.result && (
                          <p className="text-[11px] text-emerald-800 font-medium mt-1 bg-white/80 p-2 rounded-lg border border-emerald-100">
                            ✓ {step.result}
                          </p>
                        )}

                        {step.error && (
                          <p className="text-[11px] text-rose-800 font-medium mt-1 bg-white/80 p-2 rounded-lg border border-rose-100">
                            ✕ {step.error}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Final Synthesized Research Report */}
        {latestTask?.result && (
          <div className="bg-white rounded-2xl border border-chirmo-border p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-chirmo-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-chirmo-brand" />
                <h3 className="text-sm font-bold text-chirmo-text">
                  Üretilen Araştırma Raporu ve Kaynakça
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveReportToWorkspace}
                  disabled={reportSaved}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    reportSaved
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-chirmo-brand text-white border-chirmo-brand hover:bg-chirmo-brand-hover'
                  }`}
                >
                  {reportSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Çalışma Alanına Kaydedildi
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" /> Araştırmayı Kaydet
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-chirmo-brand text-xs font-semibold text-slate-700 hover:text-chirmo-brand transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Raporu İndir (.md)
                </button>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-xs text-chirmo-text leading-relaxed whitespace-pre-wrap bg-chirmo-secondary/30 p-5 rounded-xl border border-chirmo-border font-sans">
              {latestTask.result}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
