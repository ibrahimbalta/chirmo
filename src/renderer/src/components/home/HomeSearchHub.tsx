import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Globe,
  Calculator,
  Coins,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Zap,
  FolderKanban,
  ShieldCheck,
  TrendingUp,
  X,
  Plus,
  Compass,
  Cpu,
  Bot,
  Layers,
  Lock,
  Download,
  ChevronRight,
  Activity,
  Terminal
} from 'lucide-react';
import {
  SearchEngineService,
  SearchMode,
  SearchResponse
} from '../../services/searchEngine';
import { Project, Task, HistoryEntry } from '../../types';
import { ChirmoLogo } from '../common/ChirmoLogo';

interface HomeSearchHubProps {
  onNavigateToBrowser: (url: string) => void;
  onNavigateToAgents: (prompt: string) => void;
  onNavigateToProjects: () => void;
  onNavigateToTools: () => void;
}

export const HomeSearchHub: React.FC<HomeSearchHubProps> = ({
  onNavigateToBrowser,
  onNavigateToAgents,
  onNavigateToProjects,
  onNavigateToTools
}) => {
  const [query, setQuery] = useState('');
  const [activeMode, setActiveMode] = useState<SearchMode>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'web' | 'local'>('overview');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Workspace context
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [showQuickTaskModal, setShowQuickTaskModal] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load local projects, tasks and history for offline search indexing
  useEffect(() => {
    if (window.chirmo) {
      window.chirmo.getProjects().then(setProjects).catch(() => {});
      window.chirmo.getTasks().then(setTasks).catch(() => {});
      window.chirmo.getHistory().then(setHistory).catch(() => {});
    }
  }, []);

  // Keyboard shortcut Ctrl+K to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time instant answer preview while typing!
  const liveInstantPreview = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return undefined;
    return SearchEngineService.detectInstantAnswer(query.trim());
  }, [query]);

  const handleExecuteSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsSearching(true);
    try {
      const response = await SearchEngineService.search(trimmed, activeMode, {
        projects,
        tasks,
        history
      });
      setSearchResponse(response);
      setActiveTab('overview');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(query);
  };

  const handleCopySummary = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateQuickTask = async () => {
    if (!quickTaskTitle.trim() || !window.chirmo) return;
    const targetProject = projects[0];
    if (!targetProject) return;

    await window.chirmo.createTask({
      projectId: targetProject.id,
      title: quickTaskTitle.trim(),
      description: searchResponse ? `Arama sonucu: ${searchResponse.query}` : 'Hızlı Görev'
    });

    const updatedTasks = await window.chirmo.getTasks();
    setTasks(updatedTasks);
    setQuickTaskTitle('');
    setShowQuickTaskModal(false);
  };

  // Speed dial portals with rich visual accents
  const speedDialShortcuts = [
    { title: 'Google Arama', url: 'https://www.google.com', domain: 'google.com', icon: '🔍', accent: 'from-blue-500/15 to-indigo-500/5 border-blue-200/60' },
    { title: 'GitHub', url: 'https://github.com', domain: 'github.com', icon: '🐙', accent: 'from-slate-500/15 to-gray-500/5 border-slate-200/60' },
    { title: 'YouTube', url: 'https://www.youtube.com', domain: 'youtube.com', icon: '▶️', accent: 'from-red-500/15 to-rose-500/5 border-red-200/60' },
    { title: 'Wikipedia', url: 'https://tr.wikipedia.org', domain: 'wikipedia.org', icon: '📚', accent: 'from-amber-500/15 to-orange-500/5 border-amber-200/60' },
    { title: 'Stack Overflow', url: 'https://stackoverflow.com', domain: 'stackoverflow.com', icon: '💡', accent: 'from-orange-500/15 to-amber-500/5 border-orange-200/60' },
    { title: 'ChatGPT', url: 'https://chatgpt.com', domain: 'chatgpt.com', icon: '🤖', accent: 'from-emerald-500/15 to-teal-500/5 border-emerald-200/60' },
    { title: 'Reddit', url: 'https://reddit.com', domain: 'reddit.com', icon: '🔥', accent: 'from-rose-500/15 to-orange-500/5 border-rose-200/60' },
    { title: 'X / Twitter', url: 'https://x.com', domain: 'x.com', icon: '✖️', accent: 'from-indigo-500/15 to-purple-500/5 border-indigo-200/60' }
  ];

  // Executive AI Research Prompts
  const promptSuggestions = [
    { tag: 'MİMARİ', text: '2026 Otonom Yapay Zeka Ajanları Mimarisi', query: '2026 Otonom Yapay Zeka Ajanları Mimarisi' },
    { tag: 'KIYASLAMA', text: 'React vs Svelte performans ve mimari karşılaştırması', query: 'React vs Svelte karşılaştırması' },
    { tag: 'TEKNOLOJİ', text: 'Electron.js nedir ve WebContentsView nasıl çalışır?', query: 'Electron nedir' },
    { tag: 'BÜYÜME & SEO', text: 'E-Ticaret SEO ve dönüşüm optimizasyonu adımları', query: 'SEO nedir' }
  ];

  // Live Interactive Quick Tickers
  const quickTickers = [
    { label: '💵 100 USD ➔ TRY', query: '100 usd to try' },
    { label: '💶 50 EUR ➔ TRY', query: '50 eur to try' },
    { label: '🧮 1500 * 1.18 (KDV)', query: '1500 * 1.18' },
    { label: '📏 100 KM ➔ Mil', query: '100 km to miles' },
    { label: '⚛️ React Mimarisi', query: 'React nedir' },
    { label: '🐳 Docker Konteyner', query: 'Docker nedir' }
  ];

  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F8F7FC] text-chirmo-text select-none flex flex-col relative">
      {/* 1. ARCHITECTURAL GRID & AURORA MESH BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(#4338CA_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-[950px] h-[420px] bg-gradient-to-tr from-[#6652C9]/20 via-[#8B5CF6]/12 to-[#06B6D4]/15 blur-3xl rounded-full pointer-events-none" />

      {/* 2. TOP EXECUTIVE TELEMETRY & QUICK CTA STRIP */}
      <div className="relative z-10 border-b border-chirmo-border/60 bg-white/70 backdrop-blur-md px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-bold tracking-wide shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>NÖRAL MOTOR ÇEVRİMİÇİ</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-chirmo-text-secondary font-medium shrink-0">
            <Cpu className="w-3 h-3 text-chirmo-brand" />
            <span>0.4ms Yerel Gecikme</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-chirmo-text-secondary font-medium shrink-0">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Prompt Injection Kalkanı Aktif</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onNavigateToTools}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-chirmo-secondary hover:bg-chirmo-border/60 text-chirmo-text text-[11px] font-semibold transition-colors"
          >
            <Activity className="w-3 h-3 text-chirmo-brand" />
            <span>SEO Analizörü</span>
          </button>
          <button
            onClick={() => onNavigateToBrowser('https://github.com/ibrahimbalta/chirmo')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#1E1B4B] via-[#4338CA] to-[#6652C9] hover:opacity-95 text-white text-[11px] font-bold shadow-xs transition-all"
          >
            <Download className="w-3 h-3 text-cyan-300" />
            <span>Windows Sürümü</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-5 sm:pt-8 pb-24 md:pb-14 flex flex-col flex-1">
        {/* HERO BRAND HEADER */}
        <div className="text-center mb-5 sm:mb-7 flex flex-col items-center">
          {/* Custom 3D Vector Brand Logo */}
          <div
            onClick={() => {
              setQuery('');
              setSearchResponse(null);
            }}
            className="mb-3 sm:mb-4 cursor-pointer transform hover:scale-105 transition-transform duration-300"
          >
            <ChirmoLogo size="xl" animated={true} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-chirmo-brand/20 text-chirmo-brand text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-chirmo-brand" />
            <span>Yapay Zekâ Destekli Süper Tarayıcı & İş İstasyonu</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-chirmo-text leading-[1.12] mb-2">
            Aramayı Bırakın.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4338CA] via-[#6652C9] to-[#06B6D4]">
              Sonuca Ulaşın.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-chirmo-text-secondary max-w-2xl mx-auto leading-relaxed px-2">
            Google arama indeksini, Perplexity tarzı derin yapay zekâ sentezini,{' '}
            <span className="font-semibold text-chirmo-text">%100 çevrimdışı çalışan yerel zekâyı</span> ve kurumsal proje yönetimini tek merkezde deneyimleyin.
          </p>
        </div>

        {/* 4. FLAGSHIP OMNISEARCH & COMMAND CONSOLE */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-4">
          <div className="relative group">
            {/* Multi-Stop Photonic Halo Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4338CA] via-[#8B5CF6] to-[#06B6D4] rounded-3xl blur-md opacity-30 group-hover:opacity-55 group-focus-within:opacity-65 transition duration-500" />

            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-chirmo-brand/25 shadow-xl p-2 sm:p-2.5 flex flex-col gap-2">
              {/* Top Mode Selector Pills */}
              <div className="flex items-center justify-between px-1.5 sm:px-2 pt-0.5 border-b border-chirmo-border/50 pb-2 text-xs overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  {[
                    { id: 'all', label: '🌐 Web & Sentez', desc: 'Google + AI' },
                    { id: 'ai', label: '⚡ Derin AI Analiz', desc: 'Perplexity Modu' },
                    { id: 'local', label: '🗄️ Yerel Bellek', desc: 'Çevrimdışı' },
                    { id: 'tools', label: '🧮 Hesap & Döviz', desc: 'Anında Çözüm' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveMode(m.id as SearchMode)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                        activeMode === m.id
                          ? 'bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white shadow-sm shadow-chirmo-brand/25'
                          : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-chirmo-secondary/80'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="hidden md:flex items-center gap-1 text-[10px] font-semibold text-chirmo-text-muted ml-2 shrink-0">
                  <kbd className="px-1.5 py-0.5 rounded-md bg-chirmo-secondary border border-chirmo-border text-chirmo-text-secondary">
                    Ctrl + K
                  </kbd>
                </div>
              </div>

              {/* Main Search Input Row */}
              <div className="flex items-center px-2 sm:px-3 py-1 gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-xl bg-chirmo-brand/10 flex items-center justify-center text-chirmo-brand shrink-0">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Google'da arayın, '1500 * 1.18' hesaplayın, '100 usd to try' çevirin veya 'React nedir' yazın..."
                  className="w-full text-xs sm:text-base font-medium bg-transparent border-none outline-none text-chirmo-text placeholder:text-chirmo-text-muted select-text min-w-0"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSearchResponse(null);
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    title="Temizle"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSearching || !query.trim()}
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4338CA] via-[#6652C9] to-[#7C3AED] hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-md shadow-chirmo-brand/30 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isSearching ? (
                    <span>İşleniyor...</span>
                  ) : (
                    <>
                      <span>Keşfet</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* LIVE INSTANT PREVIEW BAR (Shows while typing before hitting enter!) */}
              {liveInstantPreview && (
                <div
                  onClick={() => handleExecuteSearch(query)}
                  className="mx-1 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-cyan-50/90 border border-indigo-200/70 flex items-center justify-between gap-2 cursor-pointer hover:border-chirmo-brand transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-md bg-chirmo-brand text-white text-[10px] font-extrabold uppercase shrink-0">
                      Canlı Yanıt
                    </span>
                    <span className="text-xs font-semibold text-chirmo-text truncate">
                      {liveInstantPreview.title}:
                    </span>
                    <span className="text-xs sm:text-sm font-black text-chirmo-brand-dark truncate">
                      {liveInstantPreview.result}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-chirmo-brand shrink-0 flex items-center gap-1">
                    Detaylar <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* LIVE INTERACTIVE QUICK TICKER BAR */}
        <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-8 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-chirmo-text-muted mr-1 shrink-0 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-chirmo-brand" /> Hızlı Dene:
          </span>
          {quickTickers.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(t.query);
                handleExecuteSearch(t.query);
              }}
              className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-chirmo-brand hover:text-white border border-chirmo-border/80 hover:border-chirmo-brand text-[11px] font-semibold text-chirmo-text-secondary transition-all shadow-2xs shrink-0"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* -------------------- SEARCH RESULTS SECTION -------------------- */}
        {searchResponse ? (
          <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fadeIn">
            {/* Results Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-chirmo-border pb-2.5 gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-white'
                  }`}
                >
                  🌟 Genel Bakış
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'ai'
                      ? 'bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-white'
                  }`}
                >
                  ⚡ AI Sentezi
                </button>
                <button
                  onClick={() => setActiveTab('web')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'web'
                      ? 'bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-white'
                  }`}
                >
                  🌐 Web Sonuçları ({searchResponse.webResults.length})
                </button>
                <button
                  onClick={() => setActiveTab('local')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'local'
                      ? 'bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-white'
                  }`}
                >
                  🗄️ Yerel Bellek ({searchResponse.localResults.length})
                </button>
              </div>

              {/* Direct Open in Google Button */}
              <button
                onClick={() =>
                  onNavigateToBrowser(`https://www.google.com/search?q=${encodeURIComponent(searchResponse.query)}`)
                }
                className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-chirmo-border hover:border-chirmo-brand text-chirmo-text text-xs font-bold transition-all shadow-2xs shrink-0"
              >
                <span>Google'da Canlı Aç</span>
                <ExternalLink className="w-3.5 h-3.5 text-chirmo-brand" />
              </button>
            </div>

            {/* A. INSTANT ANSWER CARD (Calculator / Converter / Tech Knowledge) */}
            {searchResponse.instantAnswer && (activeTab === 'overview' || activeTab === 'ai') && (
              <div className="bg-gradient-to-br from-white via-white to-indigo-50/60 rounded-2xl border-2 border-chirmo-brand/30 p-4 sm:p-6 shadow-md">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4338CA] to-[#6652C9] flex items-center justify-center text-white shadow-sm shrink-0">
                      {searchResponse.instantAnswer.type === 'calculator' && <Calculator className="w-5 h-5" />}
                      {searchResponse.instantAnswer.type === 'converter' && <Coins className="w-5 h-5" />}
                      {searchResponse.instantAnswer.type === 'tech' && <BookOpen className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-chirmo-text">
                        {searchResponse.instantAnswer.title}
                      </h3>
                      {searchResponse.instantAnswer.subtitle && (
                        <p className="text-xs text-chirmo-text-secondary">{searchResponse.instantAnswer.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-chirmo-brand/10 text-chirmo-brand border border-chirmo-brand/20 shrink-0">
                    {searchResponse.instantAnswer.badge || 'Anında Yanıt'}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1E1B4B] via-[#4338CA] to-[#6652C9] tracking-tight break-words">
                    {searchResponse.instantAnswer.result}
                  </div>
                  {searchResponse.instantAnswer.details && (
                    <p className="text-xs sm:text-sm text-chirmo-text-secondary mt-1.5 leading-relaxed">
                      {searchResponse.instantAnswer.details}
                    </p>
                  )}
                </div>

                {/* Key Facts Bullet points */}
                {searchResponse.instantAnswer.keyFacts && (
                  <div className="space-y-2 my-3.5 bg-white/90 rounded-xl p-3.5 border border-chirmo-border/70">
                    <span className="text-xs font-extrabold text-chirmo-text block mb-1">
                      Mimari Özellikler & Önemli Noktalar:
                    </span>
                    {searchResponse.instantAnswer.keyFacts.map((fact, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-chirmo-text-secondary">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Code Snippet if present */}
                {searchResponse.instantAnswer.codeSnippet && (
                  <div className="mt-3 bg-[#0F172A] rounded-xl p-4 text-xs font-mono text-indigo-100 overflow-x-auto select-text border border-slate-800 shadow-inner">
                    <pre>{searchResponse.instantAnswer.codeSnippet}</pre>
                  </div>
                )}
              </div>
            )}

            {/* B. AI SYNTHESIS (PERPLEXITY-STYLE DEEP INSIGHT) */}
            {(activeTab === 'overview' || activeTab === 'ai') && (
              <div className="bg-white rounded-2xl border border-chirmo-border p-4 sm:p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-chirmo-border mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-chirmo-text">
                      Chirmo Nöral Sentez Raporu
                    </span>
                    <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      %{searchResponse.aiSynthesis.confidenceScore} Doğruluk
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopySummary(searchResponse.aiSynthesis.summary)}
                    className="px-2.5 py-1 rounded-lg bg-chirmo-secondary hover:bg-gray-200 text-chirmo-text text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopyalandı' : 'Raporu Kopyala'}</span>
                  </button>
                </div>

                {/* AI Executive Summary */}
                <p className="text-xs sm:text-sm text-chirmo-text leading-relaxed mb-4 select-text">
                  {searchResponse.aiSynthesis.summary}
                </p>

                {/* Key Takeaways */}
                <div className="bg-[#F8F7FC] rounded-xl p-3.5 sm:p-4 border border-chirmo-border/80 mb-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-chirmo-text mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-chirmo-brand" />
                    <span>Önemli Çıkarımlar & Bulgular</span>
                  </h4>
                  <div className="space-y-2">
                    {searchResponse.aiSynthesis.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-chirmo-text-secondary select-text">
                        <div className="w-4 h-4 rounded-full bg-chirmo-brand text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                          {idx + 1}
                        </div>
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sources & Citations */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-chirmo-text-secondary block mb-2">
                    Doğrulanmış Kaynaklar:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {searchResponse.aiSynthesis.sources.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => onNavigateToBrowser(src.url)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-chirmo-secondary/70 hover:bg-chirmo-brand hover:text-white border border-chirmo-border text-xs text-chirmo-text transition-all max-w-full group"
                      >
                        <Globe className="w-3.5 h-3.5 text-chirmo-brand group-hover:text-white shrink-0" />
                        <span className="font-semibold truncate max-w-[180px] sm:max-w-[240px]">{src.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-chirmo-border flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onNavigateToAgents(`"${searchResponse.query}" hakkında derin araştırma raporu hazırla.`)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white text-xs font-bold hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Otonom AI Ajanına Devret</span>
                    </button>
                    <button
                      onClick={() => setShowQuickTaskModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-chirmo-border hover:bg-chirmo-secondary text-chirmo-text text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4 text-chirmo-brand" />
                      <span>Projeye Görev Olarak Kaydet</span>
                    </button>
                  </div>

                  <span className="text-[10px] sm:text-[11px] font-medium text-chirmo-text-muted">
                    {new Date(searchResponse.timestamp).toLocaleTimeString('tr-TR')}
                  </span>
                </div>
              </div>
            )}

            {/* C. LOCAL WORKSPACE RESULTS */}
            {(activeTab === 'overview' || activeTab === 'local') && searchResponse.localResults.length > 0 && (
              <div className="bg-white rounded-2xl border border-chirmo-border p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-chirmo-border">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-chirmo-brand" />
                    <h3 className="text-xs sm:text-sm font-bold text-chirmo-text">Yerel Çalışma Alanı Eşleşmeleri</h3>
                  </div>
                  <button
                    onClick={onNavigateToProjects}
                    className="text-xs text-chirmo-brand hover:underline font-bold"
                  >
                    Tüm Projeleri Aç
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchResponse.localResults.map((lr) => (
                    <div
                      key={lr.id}
                      onClick={onNavigateToProjects}
                      className="p-3.5 rounded-xl border border-chirmo-border hover:border-chirmo-brand bg-chirmo-secondary/30 hover:bg-chirmo-brand-light/30 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-chirmo-text truncate">{lr.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-chirmo-brand/10 text-chirmo-brand font-bold">
                            {lr.type}
                          </span>
                        </div>
                        <p className="text-xs text-chirmo-text-secondary line-clamp-2 mb-2">{lr.description}</p>
                      </div>
                      <span className="text-[10px] text-chirmo-text-muted">{lr.meta}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* D. WEB SEARCH RESULTS */}
            {(activeTab === 'overview' || activeTab === 'web') && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-chirmo-text-secondary px-1">
                  🌐 Küresel Web & Google İndeks Sonuçları
                </h3>

                {searchResponse.webResults.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-chirmo-border p-4 shadow-2xs hover:shadow-md hover:border-chirmo-brand/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-chirmo-brand">{item.domain}</span>
                          {item.badge && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <h4
                          onClick={() => onNavigateToBrowser(item.url)}
                          className="text-sm font-bold text-indigo-700 hover:text-indigo-900 hover:underline cursor-pointer mb-1 break-words"
                        >
                          {item.title}
                        </h4>

                        <p className="text-xs text-chirmo-text-secondary leading-relaxed select-text">
                          {item.snippet}
                        </p>
                      </div>

                      <div className="flex flex-row sm:flex-col gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-chirmo-border/50">
                        <button
                          onClick={() => onNavigateToBrowser(item.url)}
                          className="flex-1 sm:flex-initial justify-center px-3 py-1.5 rounded-xl bg-chirmo-brand text-white text-xs font-bold hover:bg-chirmo-brand-hover transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>Tarayıcıda Aç</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() =>
                            onNavigateToAgents(`Şu sayfayı analiz et ve özetle: ${item.url}`)
                          }
                          className="flex-1 sm:flex-initial justify-center px-3 py-1.5 rounded-xl bg-chirmo-secondary border border-chirmo-border hover:bg-gray-200 text-chirmo-text text-[11px] font-bold transition-colors"
                        >
                          AI ile Özetle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* E. RELATED QUESTIONS */}
            {searchResponse.relatedQuestions.length > 0 && (
              <div className="bg-white rounded-2xl border border-chirmo-border p-4 sm:p-5 shadow-sm">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-chirmo-text-secondary mb-3 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-chirmo-brand" />
                  <span>Derinleştirilmiş İlgili Sorular</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {searchResponse.relatedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(q);
                        handleExecuteSearch(q);
                      }}
                      className="text-left px-3.5 py-2.5 rounded-xl border border-chirmo-border hover:border-chirmo-brand bg-chirmo-secondary/40 hover:bg-chirmo-brand-light/40 text-xs font-semibold text-chirmo-text transition-all flex items-center justify-between group"
                    >
                      <span className="pr-2">{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-chirmo-brand group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* -------------------- ZERO STATE: LUXURY BENTO GRID SHOWCASE -------------------- */
          <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
            {/* BENTO GRID ROW 1: Speed Dial (2 cols) + Workspace Live Status (1 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Bento Card 1: Global Web Speed Dial (Spans 2 columns on desktop) */}
              <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-3xl border border-chirmo-border/90 p-4 sm:p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-chirmo-brand/10 text-chirmo-brand flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-sm font-extrabold text-chirmo-text">
                        Küresel Web Portalları & Hızlı Başlatıcı
                      </h2>
                      <p className="text-[10px] text-chirmo-text-muted">
                        İzole Chromium sekmesinde anında güvenli gezinme başlatın
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-chirmo-secondary text-chirmo-text-secondary">
                    Sandbox Aktif
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {speedDialShortcuts.map((sc, i) => (
                    <button
                      key={i}
                      onClick={() => onNavigateToBrowser(sc.url)}
                      className={`p-3 rounded-2xl bg-gradient-to-br ${sc.accent} border hover:border-chirmo-brand hover:shadow-md transition-all flex items-center gap-2.5 group text-left`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-base group-hover:scale-110 transition-transform shrink-0">
                        {sc.icon}
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <span className="text-xs font-extrabold text-chirmo-text block truncate group-hover:text-chirmo-brand transition-colors">
                          {sc.title}
                        </span>
                        <span className="text-[10px] text-chirmo-text-muted block truncate">
                          {sc.domain}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bento Card 2: Live Workspace & Project Command Center */}
              <div className="bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-cyan-400/15 blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-cyan-300 text-[10px] font-extrabold uppercase tracking-wider">
                      <Layers className="w-3 h-3" /> Çalışma Alanı
                    </span>
                    <span className="text-[11px] text-indigo-200 font-semibold">Yerel Veritabanı</span>
                  </div>

                  <h3 className="text-lg font-black tracking-tight mb-1">
                    Proje & Görev Komuta Merkezi
                  </h3>
                  <p className="text-xs text-indigo-200 leading-relaxed mb-4">
                    Araştırmalarınızı projelere bağlayın, AI ajanlarıyla görevleri otomatikleştirin.
                  </p>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 text-center border border-white/10">
                      <span className="text-lg font-black text-white block">{projects.length}</span>
                      <span className="text-[10px] text-indigo-200">Proje</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 text-center border border-white/10">
                      <span className="text-lg font-black text-cyan-300 block">{tasks.length}</span>
                      <span className="text-[10px] text-indigo-200">Görev</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 text-center border border-white/10">
                      <span className="text-lg font-black text-emerald-300 block">{completedTasksCount}</span>
                      <span className="text-[10px] text-indigo-200">Biten</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                  <button
                    onClick={() => setShowQuickTaskModal(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white text-[#1E1B4B] hover:bg-indigo-50 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#4338CA]" />
                    <span>Hızlı Görev</span>
                  </button>
                  <button
                    onClick={onNavigateToProjects}
                    className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all"
                  >
                    Projeler ➔
                  </button>
                </div>
              </div>
            </div>

            {/* BENTO GRID ROW 2: AI Deep Discovery Prompts */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-chirmo-border/90 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-extrabold text-chirmo-text">
                      Tek Tıkla Yapay Zekâ Sentezi & Derin Araştırma Şablonları
                    </h2>
                    <p className="text-[10px] text-chirmo-text-muted">
                      Herhangi bir konuya tıklayarak Perplexity tarzı sentez raporunu anında oluşturun
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateToAgents('')}
                  className="text-xs font-bold text-chirmo-brand hover:underline hidden sm:inline-flex items-center gap-1"
                >
                  <span>Otonom Ajan Konsolu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {promptSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item.query);
                      handleExecuteSearch(item.query);
                    }}
                    className="p-3.5 rounded-2xl bg-[#F8F7FC] hover:bg-gradient-to-br hover:from-indigo-50/80 hover:to-purple-50/80 border border-chirmo-border hover:border-chirmo-brand/50 transition-all text-left flex flex-col justify-between group shadow-2xs"
                  >
                    <div>
                      <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-chirmo-brand/10 text-chirmo-brand mb-2">
                        {item.tag}
                      </span>
                      <p className="text-xs font-bold text-chirmo-text group-hover:text-chirmo-brand-dark line-clamp-2 leading-snug mb-3">
                        {item.text}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-chirmo-text-muted group-hover:text-chirmo-brand">
                      <span>Şimdi Sentezle</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* BENTO GRID ROW 3: Executive Value Proposition (Why Chirmo Sells) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/85 rounded-2xl border border-chirmo-border/80 p-4 flex items-start gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-chirmo-text mb-1">
                    10x Daha Hızlı Araştırma
                  </h3>
                  <p className="text-[11px] text-chirmo-text-secondary leading-relaxed">
                    Onlarca sekme arasında kaybolmak yerine, AI Sentez Motoru ve Otonom Ajanlarla saniyeler içinde özetlenmiş raporlar alın.
                  </p>
                </div>
              </div>

              <div className="bg-white/85 rounded-2xl border border-chirmo-border/80 p-4 flex items-start gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-chirmo-text mb-1">
                    %100 Yerel Zekâ & Tam Gizlilik
                  </h3>
                  <p className="text-[11px] text-chirmo-text-secondary leading-relaxed">
                    Hesaplamalar, döviz çevirileri, teknik ansiklopedi ve proje veritabanı tamamen cihazınızda çevrimdışı çalışır.
                  </p>
                </div>
              </div>

              <div className="bg-white/85 rounded-2xl border border-chirmo-border/80 p-4 flex items-start gap-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-chirmo-text mb-1">
                    Hepsi-Bir-Arada Süper Platform
                  </h3>
                  <p className="text-[11px] text-chirmo-text-secondary leading-relaxed">
                    Chromium Tarayıcı, AI Araştırma Ajanları, Proje Yönetimi, SEO Analizörü ve Toplu Web Kazıyıcı tek uygulamada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK TASK MODAL */}
      {showQuickTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-chirmo-border max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-chirmo-text flex items-center gap-2">
                <Plus className="w-4 h-4 text-chirmo-brand" />
                <span>Çalışma Alanına Hızlı Görev Ekle</span>
              </h3>
              <button
                onClick={() => setShowQuickTaskModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-chirmo-text-secondary mb-3">
              {projects.length > 0
                ? `Hedef Proje: "${projects[0].name}"`
                : 'Önce Projeler sayfasından bir proje oluşturmalısınız.'}
            </p>

            <input
              type="text"
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              placeholder="Yapılacak araştırmayı veya görevi yazın..."
              className="w-full px-3.5 py-2.5 text-xs border border-chirmo-border rounded-xl focus:border-chirmo-brand focus:outline-none mb-4 select-text"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowQuickTaskModal(false)}
                className="px-4 py-2 rounded-xl border border-chirmo-border text-xs font-semibold text-chirmo-text hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                disabled={!quickTaskTitle.trim() || projects.length === 0}
                onClick={handleCreateQuickTask}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white text-xs font-bold disabled:opacity-50"
              >
                Görevi Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
