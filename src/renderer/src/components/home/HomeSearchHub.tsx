import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  Layers,
  ShieldCheck,
  TrendingUp,
  X,
  Plus,
  Compass
} from 'lucide-react';
import {
  SearchEngineService,
  SearchMode,
  SearchResponse,
  InstantAnswer
} from '../../services/searchEngine';
import { Project, Task, HistoryEntry } from '../../types';

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

  // Speed dial shortcuts
  const speedDialShortcuts = [
    { title: 'Google', url: 'https://www.google.com', icon: '🔍', color: 'from-blue-500 to-red-500' },
    { title: 'GitHub', url: 'https://github.com', icon: '🐙', color: 'from-gray-700 to-gray-900' },
    { title: 'YouTube', url: 'https://www.youtube.com', icon: '▶️', color: 'from-red-500 to-red-700' },
    { title: 'Wikipedia', url: 'https://tr.wikipedia.org', icon: '📚', color: 'from-gray-400 to-gray-600' },
    { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '💡', color: 'from-orange-500 to-amber-600' },
    { title: 'ChatGPT', url: 'https://chatgpt.com', icon: '🤖', color: 'from-emerald-500 to-teal-700' },
    { title: 'Reddit', url: 'https://reddit.com', icon: '🔥', color: 'from-orange-600 to-red-600' },
    { title: 'X (Twitter)', url: 'https://x.com', icon: '✖️', color: 'from-gray-800 to-black' }
  ];

  // AI Prompt Suggestions
  const promptSuggestions = [
    '🚀 2026 Otonom Yapay Zeka Ajanları Mimarisi',
    '⚡ React vs Svelte mimari karşılaştırması',
    '🧮 1500 * 1.18 hesapla',
    '💵 100 usd to try döviz kuru',
    '💻 Electron.js nedir ve nasıl çalışır?',
    '📊 E-Ticaret SEO ve dönüşüm optimizasyonu'
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gradient-to-b from-[#FAF9FE] via-[#FFFFFF] to-[#F5F6FA] text-chirmo-text select-none flex flex-col">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-chirmo-brand/10 via-purple-400/5 to-transparent blur-3xl pointer-events-none -z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-6 py-8 flex flex-col flex-1">
        {/* Top Header / Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-chirmo-brand/10 border border-chirmo-brand/20 text-chirmo-brand text-xs font-semibold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-chirmo-brand animate-pulse" />
            <span>Chirmo Akıllı Arama & Keşif Merkezi</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-emerald-700 font-medium">Yerel Zekâ Aktif</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-chirmo-text via-chirmo-brand-dark to-chirmo-brand mb-1">
            CHIRMO
          </h1>
          <p className="text-sm text-chirmo-text-secondary max-w-lg mx-auto">
            Google arama gücü, çevrimdışı yerel zekâ, hesaplayıcı ve proje yönetimi tek merkezde.
          </p>
        </div>

        {/* Center Omnisearch Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-6">
          <div className="relative group">
            {/* Search Bar Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-chirmo-brand via-purple-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-45 transition duration-300"></div>

            <div className="relative bg-white rounded-2xl border border-chirmo-border shadow-md hover:shadow-lg transition-all p-1.5 flex flex-col gap-1.5">
              {/* Mode Pills */}
              <div className="flex items-center justify-between px-3 pt-1 border-b border-chirmo-border/40 pb-1.5 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveMode('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      activeMode === 'all'
                        ? 'bg-chirmo-brand text-white shadow-xs'
                        : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-chirmo-secondary'
                    }`}
                  >
                    🌐 Tümü & Web
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('ai')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      activeMode === 'ai'
                        ? 'bg-chirmo-brand text-white shadow-xs'
                        : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-chirmo-secondary'
                    }`}
                  >
                    ⚡ AI Sentezi
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('local')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      activeMode === 'local'
                        ? 'bg-chirmo-brand text-white shadow-xs'
                        : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-chirmo-secondary'
                    }`}
                  >
                    🗄️ Yerel Bellek
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('tools')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      activeMode === 'tools'
                        ? 'bg-chirmo-brand text-white shadow-xs'
                        : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-chirmo-secondary'
                    }`}
                  >
                    🧮 Hesap & Araçlar
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-chirmo-text-muted">
                  <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px]">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px]">K</kbd>
                </div>
              </div>

              {/* Main Input Row */}
              <div className="flex items-center px-3 py-1 gap-3">
                <Search className="w-5 h-5 text-chirmo-brand shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Google'da arayın, 'React nedir' yazın, '150 * 1.2' hesaplayın veya projelerinizde arayın..."
                  className="w-full text-sm font-medium bg-transparent border-none outline-none text-chirmo-text placeholder:text-chirmo-text-muted select-text"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSearchResponse(null);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSearching || !query.trim()}
                  className="px-4 py-2 rounded-xl bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-chirmo-brand/30 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isSearching ? (
                    <span>Sentezleniyor...</span>
                  ) : (
                    <>
                      <span>Arama Yap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* -------------------- SEARCH RESULTS SECTION -------------------- */}
        {searchResponse ? (
          <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
            {/* Results Navigation Bar */}
            <div className="flex items-center justify-between border-b border-chirmo-border pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-chirmo-brand text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-chirmo-secondary'
                  }`}
                >
                  🌟 Genel Bakış
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'ai'
                      ? 'bg-chirmo-brand text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-chirmo-secondary'
                  }`}
                >
                  ⚡ AI Sentezi (Derin)
                </button>
                <button
                  onClick={() => setActiveTab('web')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'web'
                      ? 'bg-chirmo-brand text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-chirmo-secondary'
                  }`}
                >
                  🌐 Web Sonuçları ({searchResponse.webResults.length})
                </button>
                <button
                  onClick={() => setActiveTab('local')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'local'
                      ? 'bg-chirmo-brand text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-chirmo-secondary'
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-chirmo-text text-xs font-medium transition-colors"
                title="Bu aramayı tam Google sayfasında aç"
              >
                <span>Google'da Canlı Aç</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>

            {/* A. INSTANT ANSWER CARD (Calculator / Converter / Tech Knowledge) */}
            {searchResponse.instantAnswer && (activeTab === 'overview' || activeTab === 'ai') && (
              <div className="bg-gradient-to-br from-white to-purple-50/40 rounded-2xl border border-chirmo-brand/30 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-chirmo-brand-light flex items-center justify-center text-chirmo-brand">
                      {searchResponse.instantAnswer.type === 'calculator' && <Calculator className="w-4 h-4" />}
                      {searchResponse.instantAnswer.type === 'converter' && <Coins className="w-4 h-4" />}
                      {searchResponse.instantAnswer.type === 'tech' && <BookOpen className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-chirmo-text">{searchResponse.instantAnswer.title}</h3>
                      {searchResponse.instantAnswer.subtitle && (
                        <p className="text-xs text-chirmo-text-secondary">{searchResponse.instantAnswer.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-chirmo-brand/10 text-chirmo-brand border border-chirmo-brand/20">
                    {searchResponse.instantAnswer.badge || 'Anında Yanıt'}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-2xl font-extrabold text-chirmo-brand-dark tracking-tight">
                    {searchResponse.instantAnswer.result}
                  </div>
                  {searchResponse.instantAnswer.details && (
                    <p className="text-xs text-chirmo-text-secondary mt-1">{searchResponse.instantAnswer.details}</p>
                  )}
                </div>

                {/* Key Facts Bullet points */}
                {searchResponse.instantAnswer.keyFacts && (
                  <div className="space-y-1.5 my-3 bg-white/70 rounded-xl p-3 border border-chirmo-border/60">
                    <span className="text-[11px] font-semibold text-chirmo-text block mb-1">Önemli Özellikler:</span>
                    {searchResponse.instantAnswer.keyFacts.map((fact, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-chirmo-text-secondary">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Code Snippet if present */}
                {searchResponse.instantAnswer.codeSnippet && (
                  <div className="mt-3 bg-gray-900 rounded-xl p-3 text-xs font-mono text-gray-100 overflow-x-auto select-text">
                    <pre>{searchResponse.instantAnswer.codeSnippet}</pre>
                  </div>
                )}
              </div>
            )}

            {/* B. AI SYNTHESIS (PERPLEXITY-STYLE DEEP INSIGHT) */}
            {(activeTab === 'overview' || activeTab === 'ai') && (
              <div className="bg-white rounded-2xl border border-chirmo-border p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-chirmo-border mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-chirmo-brand text-white flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-chirmo-text">Chirmo AI Sentez Motoru</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      Güvenilirlik: %{searchResponse.aiSynthesis.confidenceScore}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopySummary(searchResponse.aiSynthesis.summary)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1 transition-colors"
                      title="Özeti Kopyala"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                    </button>
                  </div>
                </div>

                {/* AI Executive Summary */}
                <p className="text-sm text-chirmo-text leading-relaxed mb-4 select-text font-normal">
                  {searchResponse.aiSynthesis.summary}
                </p>

                {/* Key Takeaways */}
                <div className="bg-chirmo-secondary/60 rounded-xl p-4 border border-chirmo-border/70 mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-chirmo-text mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-chirmo-brand" />
                    <span>Önemli Çıkarımlar & Bulgular</span>
                  </h4>
                  <div className="space-y-2">
                    {searchResponse.aiSynthesis.keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-chirmo-text-secondary select-text">
                        <div className="w-4 h-4 rounded-full bg-chirmo-brand/10 text-chirmo-brand flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                          {idx + 1}
                        </div>
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sources & Citations */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-chirmo-text-secondary block mb-2">Başvurulan Kaynaklar:</span>
                  <div className="flex flex-wrap gap-2">
                    {searchResponse.aiSynthesis.sources.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => onNavigateToBrowser(src.url)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs text-chirmo-text transition-colors"
                      >
                        <Globe className="w-3 h-3 text-chirmo-brand" />
                        <span className="font-medium truncate max-w-[200px]">{src.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-chirmo-border flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToAgents(`"${searchResponse.query}" hakkında derin araştırma raporu hazırla.`)}
                      className="px-3 py-1.5 rounded-lg bg-chirmo-brand text-white text-xs font-semibold hover:bg-chirmo-brand-hover transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Ajanına Araştırt</span>
                    </button>
                    <button
                      onClick={() => setShowQuickTaskModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-chirmo-border hover:bg-chirmo-secondary text-chirmo-text text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-chirmo-brand" />
                      <span>Projeye Görev Ekle</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-chirmo-text-muted">
                    Sorgu zamanı: {new Date(searchResponse.timestamp).toLocaleTimeString('tr-TR')}
                  </span>
                </div>
              </div>
            )}

            {/* C. LOCAL WORKSPACE RESULTS */}
            {(activeTab === 'overview' || activeTab === 'local') && searchResponse.localResults.length > 0 && (
              <div className="bg-white rounded-2xl border border-chirmo-border p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-chirmo-border">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-chirmo-brand" />
                    <h3 className="text-sm font-bold text-chirmo-text">Yerel Çalışma Alanı Eşleşmeleri</h3>
                  </div>
                  <button
                    onClick={onNavigateToProjects}
                    className="text-xs text-chirmo-brand hover:underline font-medium"
                  >
                    Tüm Projeleri Aç
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {searchResponse.localResults.map((lr) => (
                    <div
                      key={lr.id}
                      onClick={onNavigateToProjects}
                      className="p-3 rounded-xl border border-chirmo-border hover:border-chirmo-brand/40 bg-chirmo-secondary/30 hover:bg-chirmo-brand-light/30 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-chirmo-text truncate">{lr.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-chirmo-text-secondary px-1">
                  🌐 Web & Kaynak Sonuçları
                </h3>

                {searchResponse.webResults.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-chirmo-border p-4 shadow-2xs hover:shadow-sm hover:border-chirmo-brand/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-semibold text-chirmo-brand">{item.domain}</span>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-200">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <h4
                          onClick={() => onNavigateToBrowser(item.url)}
                          className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer mb-1"
                        >
                          {item.title}
                        </h4>

                        <p className="text-xs text-chirmo-text-secondary leading-relaxed select-text">
                          {item.snippet}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => onNavigateToBrowser(item.url)}
                          className="px-2.5 py-1 rounded-md bg-chirmo-brand text-white text-xs font-medium hover:bg-chirmo-brand-hover transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>Aç</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() =>
                            onNavigateToAgents(`Şu sayfayı analiz et ve özetle: ${item.url}`)
                          }
                          className="px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 hover:bg-gray-100 text-chirmo-text text-[11px] font-medium transition-colors"
                        >
                          AI ile Oku
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* E. RELATED QUESTIONS (PEOPLE ALSO ASK) */}
            {searchResponse.relatedQuestions.length > 0 && (
              <div className="bg-white rounded-2xl border border-chirmo-border p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-chirmo-text-secondary mb-3 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-chirmo-brand" />
                  <span>Bunu da Keşfetmek İsteyebilirsiniz</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {searchResponse.relatedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(q);
                        handleExecuteSearch(q);
                      }}
                      className="text-left px-3 py-2 rounded-xl border border-chirmo-border hover:border-chirmo-brand/40 bg-chirmo-secondary/40 hover:bg-chirmo-brand-light/40 text-xs font-medium text-chirmo-text transition-all flex items-center justify-between group"
                    >
                      <span>{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-chirmo-brand group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* -------------------- ZERO STATE (DISCOVERY & SHORTCUTS) -------------------- */
          <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
            {/* Speed Dial Shortcuts Grid */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-chirmo-text-secondary flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-chirmo-brand" />
                  <span>Hızlı Erişim Siteleri</span>
                </span>
                <span className="text-[11px] text-chirmo-text-muted">Tek tıkla tarayıcıda aç</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {speedDialShortcuts.map((sc, i) => (
                  <button
                    key={i}
                    onClick={() => onNavigateToBrowser(sc.url)}
                    className="p-3.5 rounded-2xl bg-white border border-chirmo-border/80 hover:border-chirmo-brand/40 hover:shadow-md transition-all flex items-center gap-3 group text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-chirmo-secondary flex items-center justify-center text-lg shadow-xs group-hover:scale-105 transition-transform">
                      {sc.icon}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-chirmo-text block truncate group-hover:text-chirmo-brand transition-colors">
                        {sc.title}
                      </span>
                      <span className="text-[10px] text-chirmo-text-muted block truncate">{sc.url.replace('https://', '')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Research Prompts Discovery */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-chirmo-text-secondary flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                  <span>Öne Çıkan AI Araştırma & Keşif İstekleri</span>
                </span>
                <span className="text-[11px] text-chirmo-text-muted">Tıkla ve anında sentezle</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {promptSuggestions.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(prompt);
                      handleExecuteSearch(prompt);
                    }}
                    className="p-3 rounded-xl bg-white border border-chirmo-border hover:border-chirmo-brand/50 hover:bg-chirmo-brand-light/30 transition-all text-left text-xs font-medium text-chirmo-text flex items-center justify-between group shadow-2xs"
                  >
                    <span className="line-clamp-1">{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-chirmo-brand group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Workspace Live Snapshot Card */}
            <div className="bg-gradient-to-r from-white via-white to-purple-50/30 rounded-2xl border border-chirmo-border p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-chirmo-brand-light text-chirmo-brand flex items-center justify-center">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-chirmo-text">Çalışma Alanı Durumu</h3>
                    <p className="text-xs text-chirmo-text-secondary">
                      {projects.length} kayıtlı proje • {tasks.length} toplam görev • Çevrimdışı hazır
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQuickTaskModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Hızlı Görev Ekle</span>
                  </button>
                  <button
                    onClick={onNavigateToProjects}
                    className="px-3 py-1.5 rounded-xl bg-white border border-chirmo-border hover:bg-chirmo-secondary text-chirmo-text text-xs font-medium transition-colors"
                  >
                    Projeleri Gör
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Intelligence & Productivity Tip */}
            <div className="bg-chirmo-secondary/70 rounded-2xl border border-chirmo-border/80 p-4 flex items-start gap-3 text-xs text-chirmo-text-secondary">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-chirmo-text block mb-0.5">Yerel ve Gizlilik Odaklı Tasarlandı</span>
                <p>
                  Chirmo arama motoru matematiksel hesaplamaları, birim dönüştürmeleri ve proje aramalarını tamamen
                  cihazınızda yerel olarak çalıştırır. İnternetiniz olmasa dahi anında cevap verir; verileriniz dışarı aktarılmaz.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QUICK TASK MODAL */}
      {showQuickTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-chirmo-border max-w-md w-full p-6 shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-chirmo-text flex items-center gap-2">
                <Plus className="w-4 h-4 text-chirmo-brand" />
                <span>Hızlı Görev Oluştur</span>
              </h3>
              <button
                onClick={() => setShowQuickTaskModal(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600"
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
              placeholder="Yapılacak işi yazın..."
              className="w-full px-3 py-2 text-xs border border-chirmo-border rounded-xl focus:border-chirmo-brand focus:outline-none mb-4 select-text"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowQuickTaskModal(false)}
                className="px-3 py-1.5 rounded-lg border border-chirmo-border text-xs text-chirmo-text hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                disabled={!quickTaskTitle.trim() || projects.length === 0}
                onClick={handleCreateQuickTask}
                className="px-4 py-1.5 rounded-lg bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-semibold disabled:opacity-50"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
