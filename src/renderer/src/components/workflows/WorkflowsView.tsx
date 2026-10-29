import React, { useState, useEffect } from 'react';
import { 
  Workflow, 
  Play, 
  CheckCircle2, 
  Loader2, 
  FolderKanban, 
  ExternalLink,
  Plus,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { Project, WorkflowDefinition } from '../../types';

export const WorkflowsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [templates, setTemplates] = useState<WorkflowDefinition[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowDefinition | null>(null);

  const [customUrls, setCustomUrls] = useState<string>(
    'https://news.ycombinator.com\nhttps://github.com/trending'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [runReport, setRunReport] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (window.chirmo) {
      const projs = await window.chirmo.getProjects();
      setProjects(projs);
      if (projs.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projs[0].id);
      }

      const tpls = await window.chirmo.getWorkflowTemplates();
      setTemplates(tpls);
      if (tpls.length > 0) {
        setSelectedTemplate(tpls[0]);
      }
    }
  };

  const handleRunWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedTemplate || !window.chirmo) return;

    const urls = customUrls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) return;

    setIsRunning(true);
    setRunReport(null);

    try {
      const report = await window.chirmo.runBatchWorkflow(
        selectedProjectId,
        urls,
        selectedTemplate.title
      );
      setRunReport(report);
    } catch (err: any) {
      console.error(err);
      setRunReport(`İş akışı sırasında hata: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex-1 bg-chirmo-secondary overflow-y-auto p-8 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chirmo-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-chirmo-brand text-white shadow-sm shadow-chirmo-brand/30">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-chirmo-text flex items-center gap-2">
                <span>Görsel İş Akışları ve Otomasyon</span>
                <span className="text-[10px] bg-chirmo-brand-light text-chirmo-brand px-2 py-0.5 rounded-full font-bold">
                  Aşama 5 Aktif
                </span>
              </h1>
              <p className="text-xs text-chirmo-text-secondary">
                Birden fazla web sitesini sıralı inceleyen, sonuçları derleyen ve projeye kaydeden araştırma akışları
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Templates Carousel/Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-chirmo-text">
            İş Akışı Şablonu Seçin:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate?.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-chirmo-bg border-chirmo-brand ring-2 ring-chirmo-brand/10 shadow-xs'
                      : 'bg-chirmo-bg/70 hover:bg-chirmo-bg border-chirmo-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-chirmo-brand bg-chirmo-brand-light px-2 py-0.5 rounded-md">
                      {tpl.category}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-chirmo-brand" />}
                  </div>

                  <h3 className="text-xs font-bold text-chirmo-text">{tpl.title}</h3>
                  <p className="text-[11px] text-chirmo-text-secondary mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Workflow Interactive Setup & Stepper */}
        {selectedTemplate && (
          <div className="bg-chirmo-bg rounded-2xl border border-chirmo-border p-6 shadow-xs space-y-5">
            <div className="border-b border-chirmo-border/60 pb-3">
              <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted">
                İş Akışı Adım Planı
              </span>
              <div className="flex items-center gap-2 mt-2">
                {selectedTemplate.steps.map((st, i) => (
                  <React.Fragment key={st.id}>
                    <div className="flex items-center gap-1.5 bg-chirmo-secondary border border-chirmo-border px-3 py-1.5 rounded-lg text-xs font-medium text-chirmo-text">
                      <span className="w-4 h-4 rounded-full bg-chirmo-brand text-white flex items-center justify-center text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <span>{st.name}</span>
                    </div>
                    {i < selectedTemplate.steps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-chirmo-text-muted" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Run Parameters Form */}
            <form onSubmit={handleRunWorkflow} className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-chirmo-text">
                  Sonuçların Kaydedileceği Proje:
                </label>
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

              <div>
                <label className="block text-xs font-semibold text-chirmo-text mb-1">
                  Sırayla Taranacak Web Sayfaları (Her satıra bir URL):
                </label>
                <textarea
                  value={customUrls}
                  onChange={(e) => setCustomUrls(e.target.value)}
                  disabled={isRunning}
                  rows={4}
                  placeholder="https://example.com/page1&#10;https://example.com/page2"
                  className="w-full p-3 bg-chirmo-secondary border border-chirmo-border rounded-xl text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isRunning || !customUrls.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-chirmo-brand hover:bg-chirmo-brand-hover disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  <span>{isRunning ? 'İş Akışı Çalışıyor...' : 'İş Akışını Başlat'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Consolidated Report Output */}
        {runReport && (
          <div className="bg-chirmo-bg rounded-2xl border border-chirmo-border p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-chirmo-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-chirmo-brand" />
                <h3 className="text-sm font-bold text-chirmo-text">
                  İş Akışı Sonuç Raporu (Projeye Kaydedildi ✓)
                </h3>
              </div>
            </div>

            <div className="text-xs text-chirmo-text leading-relaxed whitespace-pre-wrap bg-chirmo-secondary/40 p-5 rounded-xl border border-chirmo-border font-sans">
              {runReport}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
