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
  Terminal,
  Scale,
  AlertTriangle,
  Lightbulb,
  Code2,
  CheckCircle2,
  Timer,
  FileText,
  KeyRound,
  Star,
  GitBranch,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Network
} from 'lucide-react';
import {
  SearchEngineService,
  SearchMode,
  SearchResponse,
  PerspectiveLens
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
  const [activeTab, setActiveTab] = useState<'overview' | 'compare' | 'blueprint' | 'web' | 'local'>('overview');
  const [activeLens, setActiveLens] = useState<PerspectiveLens>('ceo');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Interactive Decision Matrix custom weights (index -> weight 1..5)
  const [customWeights, setCustomWeights] = useState<Record<number, number>>({});

  // Action Blueprint checked steps
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [blueprintExported, setBlueprintExported] = useState(false);

  // Built-in Swiss-Army Micro-App Studio state
  const [activeMicroApp, setActiveMicroApp] = useState<'none' | 'kdv' | 'dev' | 'scratchpad' | 'pomodoro'>('none');
  const [kdvAmount, setKdvAmount] = useState<string>('1000');
  const [kdvRate, setKdvRate] = useState<number>(20);
  const [devInput, setDevInput] = useState<string>('{"chirmo": "quantum", "hiz": "0.4ms"}');
  const [generatedPass, setGeneratedPass] = useState<string>('Ch!rm0_Q9#xL2$vP8@zK');
  const [scratchpadText, setScratchpadText] = useState<string>(() => {
    try {
      return localStorage.getItem('chirmo_scratchpad') || '📌 Hızlı Notlarım:\n- ';
    } catch {
      return '📌 Hızlı Notlarım:\n- ';
    }
  });

  // Pomodoro Focus Timer state
  const [pomoSeconds, setPomoSeconds] = useState<number>(25 * 60);
  const [pomoRunning, setPomoRunning] = useState<boolean>(false);

  // Search Memory Vault (Recent searches)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chirmo_recent_searches');
      return saved ? JSON.parse(saved) : ['React vs Svelte', 'Yapay Zeka', '1500 * 1.18', '100 usd to try'];
    } catch {
      return ['React vs Svelte', 'Yapay Zeka', '1500 * 1.18', '100 usd to try'];
    }
  });

  // Workspace context
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [showQuickTaskModal, setShowQuickTaskModal] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.chirmo) {
      window.chirmo.getProjects().then(setProjects).catch(() => {});
      window.chirmo.getTasks().then(setTasks).catch(() => {});
      window.chirmo.getHistory().then(setHistory).catch(() => {});
    }
  }, []);

  // Pomodoro timer interval
  useEffect(() => {
    if (!pomoRunning) return;
    const timer = setInterval(() => {
      setPomoSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [pomoRunning]);

  // Save scratchpad to localStorage
  const handleScratchpadChange = (val: string) => {
    setScratchpadText(val);
    try {
      localStorage.setItem('chirmo_scratchpad', val);
    } catch {
      // ignore storage errors
    }
  };

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

  // Real-time instant answer preview while typing
  const liveInstantPreview = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return undefined;
    return SearchEngineService.detectInstantAnswer(query.trim());
  }, [query]);

  const handleExecuteSearch = async (searchQuery: string, forcedMode?: SearchMode) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const targetMode = forcedMode || activeMode;
    setIsSearching(true);
    setBlueprintExported(false);
    setCheckedSteps({});
    setCustomWeights({});

    // Save to Memory Vault
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem('chirmo_recent_searches', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    try {
      const response = await SearchEngineService.search(trimmed, targetMode, {
        projects,
        tasks,
        history
      });
      setSearchResponse(response);
      if (targetMode === 'compare' || response.decisionMatrix) {
        setActiveTab('overview');
      } else {
        setActiveTab('overview');
      }
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

  // Turn the entire search Action Blueprint into a real Chirmo Project + Tasks with 1 click!
  const handleSpawnProjectFromBlueprint = async () => {
    if (!searchResponse || !window.chirmo) return;
    const proj = await window.chirmo.createProject(
      `🚀 ${searchResponse.query} Planı`,
      `Chirmo Quantum Motoru tarafından "${searchResponse.query}" araştırmasından otomatik üretilen icra projesi.`,
      '#6652C9'
    );

    for (const step of searchResponse.aiSynthesis.actionBlueprint) {
      await window.chirmo.createTask({
        projectId: proj.id,
        title: `Adım ${step.step}: ${step.title}`,
        description: `${step.description} (Tahmini Süre: ${step.estimatedTime})`
      });
    }

    const [updatedProjs, updatedTasks] = await Promise.all([
      window.chirmo.getProjects(),
      window.chirmo.getTasks()
    ]);
    setProjects(updatedProjs);
    setTasks(updatedTasks);
    setBlueprintExported(true);
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

  const generateNewPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_+-=';
    let res = '';
    for (let i = 0; i < 20; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(res);
  };

  // Calculate Weighted Decision Matrix totals live
  const matrixScores = useMemo(() => {
    const dm = searchResponse?.decisionMatrix;
    if (!dm) return { scoreA: 0, scoreB: 0, winner: '' };
    let totalWeight = 0;
    let sumA = 0;
    let sumB = 0;
    dm.criteria.forEach((c, idx) => {
      const w = customWeights[idx] ?? c.weight;
      totalWeight += w;
      sumA += c.scoreA * w;
      sumB += c.scoreB * w;
    });
    const finalA = totalWeight > 0 ? Math.round(sumA / totalWeight) : 0;
    const finalB = totalWeight > 0 ? Math.round(sumB / totalWeight) : 0;
    const winner = finalA >= finalB ? dm.optionA : dm.optionB;
    return { scoreA: finalA, scoreB: finalB, winner };
  }, [searchResponse?.decisionMatrix, customWeights]);

  const formatPomo = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // KDV Calculator numbers
  const numKdvBase = parseFloat(kdvAmount) || 0;
  const kdvTax = numKdvBase * (kdvRate / 100);
  const kdvTotal = numKdvBase + kdvTax;
  const kdvExcludedBase = numKdvBase / (1 + kdvRate / 100);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F8F7FC] text-chirmo-text select-none flex flex-col relative">
      {/* 1. ARCHITECTURAL GRID & AURORA MESH BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(#4338CA_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-[980px] h-[420px] bg-gradient-to-tr from-[#6652C9]/20 via-[#8B5CF6]/12 to-[#06B6D4]/15 blur-3xl rounded-full pointer-events-none" />

      {/* 2. TOP EXECUTIVE TELEMETRY & SWISS-ARMY MICRO-APP DOCK BAR */}
      <div className="relative z-10 border-b border-chirmo-border/70 bg-white/80 backdrop-blur-md px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-extrabold tracking-wide shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>QUANTUM MOTOR AKTİF</span>
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-chirmo-text-secondary font-semibold shrink-0">
            <Cpu className="w-3.5 h-3.5 text-chirmo-brand" />
            <span>Wikipedia + GitHub + HN + Yerel Füzyon</span>
          </span>
        </div>

        {/* Interactive Swiss-Army Utility Triggers */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveMicroApp(activeMicroApp === 'kdv' ? 'none' : 'kdv')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 ${
              activeMicroApp === 'kdv'
                ? 'bg-chirmo-brand text-white shadow-xs'
                : 'bg-chirmo-secondary hover:bg-gray-200 text-chirmo-text'
            }`}
          >
            <Calculator className="w-3 h-3" />
            <span>KDV & Finans</span>
          </button>

          <button
            onClick={() => setActiveMicroApp(activeMicroApp === 'dev' ? 'none' : 'dev')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 ${
              activeMicroApp === 'dev'
                ? 'bg-chirmo-brand text-white shadow-xs'
                : 'bg-chirmo-secondary hover:bg-gray-200 text-chirmo-text'
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>Şifre & JSON</span>
          </button>

          <button
            onClick={() => setActiveMicroApp(activeMicroApp === 'scratchpad' ? 'none' : 'scratchpad')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 ${
              activeMicroApp === 'scratchpad'
                ? 'bg-chirmo-brand text-white shadow-xs'
                : 'bg-chirmo-secondary hover:bg-gray-200 text-chirmo-text'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Not Defteri</span>
          </button>

          <button
            onClick={() => setActiveMicroApp(activeMicroApp === 'pomodoro' ? 'none' : 'pomodoro')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 ${
              activeMicroApp === 'pomodoro' || pomoRunning
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-chirmo-secondary hover:bg-gray-200 text-chirmo-text'
            }`}
          >
            <Timer className="w-3 h-3" />
            <span>{pomoRunning ? formatPomo(pomoSeconds) : 'Odak Sayacı'}</span>
          </button>
        </div>
      </div>

      {/* 2B. EXPANDABLE LIVE SWISS-ARMY MICRO-APP WORKBENCH */}
      {activeMicroApp !== 'none' && (
        <div className="relative z-20 bg-white border-b border-chirmo-brand/25 shadow-lg px-4 sm:px-6 py-4 animate-fadeIn">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-chirmo-brand flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                {activeMicroApp === 'kdv' && 'Canlı KDV, Vergi ve Fiyat Hesaplama Stüdyosu'}
                {activeMicroApp === 'dev' && 'Anında Güçlü Şifre Üretici & JSON / Metin Aracı'}
                {activeMicroApp === 'scratchpad' && 'Kalıcı Hızlı Hafıza Defteri (Otomatik Kaydedilir)'}
                {activeMicroApp === 'pomodoro' && 'Derin Çalışma & Pomodoro Odak Kronometresi'}
              </span>
              <button
                onClick={() => setActiveMicroApp('none')}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeMicroApp === 'kdv' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-chirmo-text-secondary block">Tutar (₺ / $):</label>
                  <input
                    type="number"
                    value={kdvAmount}
                    onChange={(e) => setKdvAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-chirmo-border text-sm font-bold focus:border-chirmo-brand outline-none select-text"
                  />
                  <div className="flex gap-1.5">
                    {[1, 10, 20].map((r) => (
                      <button
                        key={r}
                        onClick={() => setKdvRate(r)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold border ${
                          kdvRate === r
                            ? 'bg-chirmo-brand text-white border-chirmo-brand'
                            : 'bg-gray-50 text-chirmo-text border-gray-200'
                        }`}
                      >
                        %{r} KDV
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/60">
                  <span className="text-[10px] font-bold uppercase text-indigo-700 block">KDV Hariçten ➔ Dahile</span>
                  <div className="text-lg font-black text-indigo-950 mt-1">
                    {kdvTotal.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                  </div>
                  <span className="text-[11px] text-indigo-700">
                    +{kdvTax.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺ KDV eklendi
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block">KDV Dahilden ➔ Harice</span>
                  <div className="text-lg font-black text-emerald-950 mt-1">
                    {kdvExcludedBase.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                  </div>
                  <span className="text-[11px] text-emerald-700">
                    İçindeki KDV: {(numKdvBase - kdvExcludedBase).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺
                  </span>
                </div>
              </div>
            )}

            {activeMicroApp === 'dev' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-chirmo-secondary/60 border border-chirmo-border">
                  <span className="text-xs font-bold text-chirmo-text block mb-2">Kriptografik Şifre Üretici (20 Karakter)</span>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 rounded-xl bg-gray-900 text-emerald-400 text-xs font-mono select-text truncate">
                      {generatedPass}
                    </code>
                    <button
                      onClick={generateNewPassword}
                      className="px-3 py-2 rounded-xl bg-chirmo-brand text-white text-xs font-bold hover:opacity-95"
                    >
                      Yenile
                    </button>
                    <button
                      onClick={() => handleCopySummary(generatedPass)}
                      className="px-3 py-2 rounded-xl bg-white border border-chirmo-border text-xs font-bold"
                    >
                      Kopyala
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-chirmo-secondary/60 border border-chirmo-border">
                  <span className="text-xs font-bold text-chirmo-text block mb-1">
                    Hızlı Kelime, Karakter & Base64 Analizörü
                  </span>
                  <input
                    type="text"
                    value={devInput}
                    onChange={(e) => setDevInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-chirmo-border text-xs font-mono mb-2 select-text"
                  />
                  <div className="flex items-center justify-between text-[11px] text-chirmo-text-secondary">
                    <span>Karakter: <b>{devInput.length}</b></span>
                    <span>Kelime: <b>{devInput.trim().split(/\s+/).filter(Boolean).length}</b></span>
                    <span className="truncate max-w-[180px]">Base64: <b>{btoa(unescape(encodeURIComponent(devInput))).slice(0, 16)}...</b></span>
                  </div>
                </div>
              </div>
            )}

            {activeMicroApp === 'scratchpad' && (
              <div>
                <textarea
                  rows={3}
                  value={scratchpadText}
                  onChange={(e) => handleScratchpadChange(e.target.value)}
                  placeholder="Araştırma yaparken aklınıza gelenleri buraya yazın. Tarayıcıyı kapatsanız bile silinmez..."
                  className="w-full p-3 rounded-2xl border border-chirmo-border text-xs font-medium focus:border-chirmo-brand outline-none select-text"
                />
              </div>
            )}

            {activeMicroApp === 'pomodoro' && (
              <div className="flex flex-wrap items-center justify-between gap-4 bg-rose-50/60 border border-rose-200/70 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-rose-700 font-mono">{formatPomo(pomoSeconds)}</div>
                  <div>
                    <span className="text-xs font-extrabold text-chirmo-text block">Derin Odaklanma Oturumu</span>
                    <span className="text-[11px] text-chirmo-text-secondary">
                      Dikkat dağıtıcıları kapatın ve 25 dakika boyunca tek hedefe odaklanın.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPomoRunning(!pomoRunning)}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    {pomoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{pomoRunning ? 'Duraklat' : 'Başlat'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setPomoRunning(false);
                      setPomoSeconds(25 * 60);
                    }}
                    className="px-3 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sıfırla</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-5 sm:pt-7 pb-24 md:pb-14 flex flex-col flex-1">
        {/* HERO BRAND HEADER */}
        <div className="text-center mb-5 flex flex-col items-center">
          <div
            onClick={() => {
              setQuery('');
              setSearchResponse(null);
            }}
            className="mb-3 cursor-pointer transform hover:scale-105 transition-transform duration-300"
          >
            <ChirmoLogo size="lg" animated={true} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-chirmo-brand/20 text-chirmo-brand text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-chirmo-brand" />
            <span>Arama Motoru Değil • Karar, Sentez ve İcra Motoru</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-chirmo-text leading-[1.12] mb-2">
            10 Mavi Linkte Kaybolmayın.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4338CA] via-[#6652C9] to-[#06B6D4]">
              Karar Verin.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-chirmo-text-secondary max-w-2xl mx-auto leading-relaxed px-2">
            Canlı Wikipedia, GitHub ve HackerNews veri füzyonu,{' '}
            <span className="font-bold text-chirmo-text">4 Zihin Lensli Perspektif Sentezi</span>,{' '}
            <span className="font-bold text-chirmo-brand">Ağırlıklı Karar Matrisi (X vs Y)</span> ve Tek Tıkla Proje Üretici.
          </p>
        </div>

        {/* 4. FLAGSHIP QUANTUM OMNISEARCH CONSOLE */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4338CA] via-[#8B5CF6] to-[#06B6D4] rounded-3xl blur-md opacity-30 group-hover:opacity-55 group-focus-within:opacity-65 transition duration-500" />

            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-chirmo-brand/25 shadow-xl p-2 sm:p-2.5 flex flex-col gap-2">
              {/* Top Mode Selector Pills */}
              <div className="flex items-center justify-between px-1.5 sm:px-2 pt-0.5 border-b border-chirmo-border/50 pb-2 text-xs overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  {[
                    { id: 'all', label: '🌐 Kuantum Sentez (Canlı)' },
                    { id: 'compare', label: '⚖️ Karar Matrisi (X vs Y)' },
                    { id: 'ai', label: '🧠 4-Lens Perspektif' },
                    { id: 'local', label: '🗄️ Yerel Bellek' },
                    { id: 'tools', label: '🧮 Hesap & Döviz' }
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
                  placeholder="Herhangi bir konu arayın, 'React vs Vue' kıyaslayın, '1500 * 1.18' veya '100 usd to try' yazın..."
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
                    <span>Sentezleniyor...</span>
                  ) : (
                    <>
                      <span>Sentezle</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* LIVE INSTANT PREVIEW BAR WHILE TYPING */}
              {liveInstantPreview && (
                <div
                  onClick={() => handleExecuteSearch(query)}
                  className="mx-1 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-cyan-50/90 border border-indigo-200/70 flex items-center justify-between gap-2 cursor-pointer hover:border-chirmo-brand transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-md bg-chirmo-brand text-white text-[10px] font-extrabold uppercase shrink-0">
                      Anında Çözüm
                    </span>
                    <span className="text-xs font-semibold text-chirmo-text truncate">
                      {liveInstantPreview.title}:
                    </span>
                    <span className="text-xs sm:text-sm font-black text-chirmo-brand-dark truncate">
                      {liveInstantPreview.result}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-chirmo-brand shrink-0 flex items-center gap-1">
                    Raporu Aç <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* MEMORY VAULT & LIVE DEMO CHIPS */}
        <div className="w-full max-w-3xl mx-auto mb-6 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-chirmo-text-muted mr-1 shrink-0 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-chirmo-brand" /> Hafıza & Örnekler:
          </span>
          {[
            { label: '⚖️ React vs Vue Kıyasla', q: 'React vs Vue', mode: 'compare' as SearchMode },
            { label: '⚖️ PostgreSQL vs MongoDB', q: 'PostgreSQL vs MongoDB', mode: 'compare' as SearchMode },
            { label: '🌍 Mustafa Kemal Atatürk (Canlı Wiki)', q: 'Mustafa Kemal Atatürk', mode: 'all' as SearchMode },
            { label: '🤖 Yapay Zeka (Canlı Veri)', q: 'Yapay Zeka', mode: 'all' as SearchMode },
            { label: '💵 250 USD to TRY', q: '250 usd to try', mode: 'tools' as SearchMode }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(item.q);
                setActiveMode(item.mode);
                handleExecuteSearch(item.q, item.mode);
              }}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-chirmo-brand hover:text-white border border-chirmo-border/90 hover:border-chirmo-brand text-[11px] font-semibold text-chirmo-text-secondary transition-all shadow-2xs shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ==================== SEARCH RESULTS WORKBENCH ==================== */}
        {searchResponse ? (
          <div className="w-full max-w-4xl mx-auto space-y-5 animate-fadeIn">
            {/* Results Top Bar */}
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
                  🌟 Kuantum Sentez
                </button>
                <button
                  onClick={() => {
                    if (!searchResponse.decisionMatrix) {
                      const dm = SearchEngineService.buildDecisionMatrix(searchResponse.query, true);
                      setSearchResponse({ ...searchResponse, decisionMatrix: dm });
                    }
                    setActiveTab('compare');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'compare'
                      ? 'bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-white'
                  }`}
                >
                  ⚖️ Karar Matrisi {searchResponse.decisionMatrix ? '★' : ''}
                </button>
                <button
                  onClick={() => setActiveTab('blueprint')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'blueprint'
                      ? 'bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-white'
                  }`}
                >
                  🗺️ Eylem Planı & Kavram Ağı
                </button>
                <button
                  onClick={() => setActiveTab('web')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === 'web'
                      ? 'bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text hover:bg-white'
                  }`}
                >
                  🌐 Kaynaklar ({searchResponse.webResults.length})
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                  ⚡ {searchResponse.executionTimeMs}ms
                </span>
                <button
                  onClick={() =>
                    onNavigateToBrowser(`https://www.google.com/search?q=${encodeURIComponent(searchResponse.query)}`)
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-chirmo-border hover:border-chirmo-brand text-chirmo-text text-xs font-bold transition-all shadow-2xs"
                >
                  <span>Google'da Aç</span>
                  <ExternalLink className="w-3.5 h-3.5 text-chirmo-brand" />
                </button>
              </div>
            </div>

            {/* 1. INSTANT ANSWER / LIVE WIKIPEDIA KNOWLEDGE CARD */}
            {searchResponse.instantAnswer && activeTab === 'overview' && (
              <div className="bg-gradient-to-br from-white via-white to-indigo-50/50 rounded-2xl border-2 border-chirmo-brand/30 p-4 sm:p-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-chirmo-brand text-white">
                        {searchResponse.instantAnswer.badge || 'Doğrudan Çözüm'}
                      </span>
                      {searchResponse.instantAnswer.subtitle && (
                        <span className="text-xs font-semibold text-chirmo-text-secondary">
                          {searchResponse.instantAnswer.subtitle}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-chirmo-text mb-1">
                      {searchResponse.instantAnswer.title}
                    </h3>

                    <div className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1E1B4B] via-[#4338CA] to-[#6652C9] mb-2">
                      {searchResponse.instantAnswer.result}
                    </div>

                    {searchResponse.instantAnswer.details && (
                      <p className="text-xs sm:text-sm text-chirmo-text-secondary leading-relaxed select-text">
                        {searchResponse.instantAnswer.details}
                      </p>
                    )}
                  </div>

                  {searchResponse.instantAnswer.thumbnailUrl && (
                    <img
                      src={searchResponse.instantAnswer.thumbnailUrl}
                      alt={searchResponse.instantAnswer.title}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-chirmo-border shadow-sm shrink-0"
                    />
                  )}
                </div>

                {searchResponse.instantAnswer.codeSnippet && (
                  <div className="mt-4 bg-[#0F172A] rounded-xl p-3.5 text-xs font-mono text-indigo-100 overflow-x-auto select-text">
                    <pre>{searchResponse.instantAnswer.codeSnippet}</pre>
                  </div>
                )}
              </div>
            )}

            {/* 2. INTERACTIVE WEIGHTED DECISION MATRIX STUDIO ("X vs Y") */}
            {searchResponse.decisionMatrix && (activeTab === 'overview' || activeTab === 'compare') && (
              <div className="bg-white rounded-3xl border-2 border-indigo-500/30 p-4 sm:p-6 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-chirmo-border mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4338CA] to-[#6652C9] text-white flex items-center justify-center shadow-sm">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-black text-chirmo-text">
                          İnteraktif Karar Matrisi: {searchResponse.decisionMatrix.optionA} vs {searchResponse.decisionMatrix.optionB}
                        </h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Canlı Ağırlıklandırma
                        </span>
                      </div>
                      <p className="text-xs text-chirmo-text-secondary">
                        Sizin için hangi kriter daha önemliyse ağırlığını (1x-5x) değiştirin; kazanan anında yeniden hesaplansın!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Scoreboard Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-indigo-700 block">Seçenek A</span>
                      <span className="text-sm font-black text-chirmo-text">{searchResponse.decisionMatrix.optionA}</span>
                    </div>
                    <span className="text-2xl font-black text-indigo-700">{matrixScores.scoreA}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1E1B4B] to-[#4338CA] text-white flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-cyan-300">Önerilen Karar Lideri</span>
                    <span className="text-sm font-black mt-0.5">🏆 {matrixScores.winner}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-purple-700 block">Seçenek B</span>
                      <span className="text-sm font-black text-chirmo-text">{searchResponse.decisionMatrix.optionB}</span>
                    </div>
                    <span className="text-2xl font-black text-purple-700">{matrixScores.scoreB}</span>
                  </div>
                </div>

                {/* Criteria Rows with Weight Sliders */}
                <div className="space-y-3 mb-5">
                  {searchResponse.decisionMatrix.criteria.map((crit, idx) => {
                    const currentW = customWeights[idx] ?? crit.weight;
                    return (
                      <div key={idx} className="p-3 rounded-2xl bg-[#F8F7FC] border border-chirmo-border/80">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div>
                            <span className="text-xs font-extrabold text-chirmo-text">{crit.name}</span>
                            <span className="text-[11px] text-chirmo-text-muted block sm:inline sm:ml-2">
                              ({crit.note})
                            </span>
                          </div>

                          {/* Weight Selector 1x..5x */}
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-chirmo-text-secondary mr-1 flex items-center gap-1">
                              <Sliders className="w-3 h-3" /> Önem:
                            </span>
                            {[1, 2, 3, 4, 5].map((w) => (
                              <button
                                key={w}
                                type="button"
                                onClick={() => setCustomWeights((prev) => ({ ...prev, [idx]: w }))}
                                className={`w-6 h-6 rounded-lg text-[10px] font-extrabold transition-all ${
                                  currentW === w
                                    ? 'bg-chirmo-brand text-white shadow-2xs'
                                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                {w}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dual Progress Bars */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="w-24 truncate font-semibold text-indigo-800">
                              {searchResponse.decisionMatrix.optionA}
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full"
                                style={{ width: `${crit.scoreA}%` }}
                              />
                            </div>
                            <span className="font-bold text-indigo-800 w-7 text-right">{crit.scoreA}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="w-24 truncate font-semibold text-purple-800">
                              {searchResponse.decisionMatrix.optionB}
                            </span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${crit.scoreB}%` }}
                              />
                            </div>
                            <span className="font-bold text-purple-800 w-7 text-right">{crit.scoreB}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pros & Cons Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100">
                    <h4 className="font-extrabold text-indigo-900 mb-2">
                      ✅ {searchResponse.decisionMatrix.optionA} Güçlü Yanları
                    </h4>
                    <ul className="space-y-1 text-chirmo-text-secondary">
                      {searchResponse.decisionMatrix.prosA.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100">
                    <h4 className="font-extrabold text-purple-900 mb-2">
                      ✅ {searchResponse.decisionMatrix.optionB} Güçlü Yanları
                    </h4>
                    <ul className="space-y-1 text-chirmo-text-secondary">
                      {searchResponse.decisionMatrix.prosB.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 3. MULTI-PERSONA 4-LENS SYNTHESIS ENGINE */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-3xl border border-chirmo-border p-4 sm:p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-chirmo-border mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-extrabold text-chirmo-text block">
                        4-Boyutlu Perspektif & Sentez Motoru
                      </span>
                      <span className="text-[10px] text-chirmo-text-muted">
                        Aynı konuyu 4 farklı uzman zihin yapısıyla inceleyin
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {searchResponse.aiSynthesis.isLiveEnriched && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                        🟢 Canlı API Doğrulamalı
                      </span>
                    )}
                    <button
                      onClick={() =>
                        handleCopySummary(searchResponse.aiSynthesis.perspectives[activeLens].content)
                      }
                      className="px-2.5 py-1 rounded-lg bg-chirmo-secondary hover:bg-gray-200 text-chirmo-text text-xs font-bold flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                    </button>
                  </div>
                </div>

                {/* 4 LENS SWITCHER BUTTONS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    { id: 'ceo', label: '🎯 Yönetici (CEO)', sub: 'Strateji & Karar', icon: <TrendingUp className="w-3.5 h-3.5" /> },
                    { id: 'engineer', label: '💻 Mühendis', sub: 'Mimari & Sistem', icon: <Code2 className="w-3.5 h-3.5" /> },
                    { id: 'critic', label: '⚠️ Şeytanın Avukatı', sub: 'Gizli Risk & Tuzak', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
                    { id: 'eli5', label: '👶 Yalın Anlatım', sub: 'Sıfır Jargon (ELI5)', icon: <Lightbulb className="w-3.5 h-3.5" /> }
                  ].map((lens) => {
                    const isSelected = activeLens === lens.id;
                    return (
                      <button
                        key={lens.id}
                        type="button"
                        onClick={() => setActiveLens(lens.id as PerspectiveLens)}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#4338CA] to-[#6652C9] text-white border-transparent shadow-sm'
                            : 'bg-[#F8F7FC] hover:bg-white text-chirmo-text border-chirmo-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-extrabold">{lens.label}</span>
                          {lens.icon}
                        </div>
                        <span className={`text-[10px] block ${isSelected ? 'text-indigo-100' : 'text-chirmo-text-muted'}`}>
                          {lens.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Lens Content Box */}
                <div className="bg-[#F8F7FC] rounded-2xl p-4 border border-chirmo-border/80 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs sm:text-sm font-extrabold text-chirmo-brand-dark">
                      {searchResponse.aiSynthesis.perspectives[activeLens].title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-chirmo-brand/10 text-chirmo-brand">
                      {searchResponse.aiSynthesis.perspectives[activeLens].badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-chirmo-text leading-relaxed mb-3 select-text">
                    {searchResponse.aiSynthesis.perspectives[activeLens].content}
                  </p>

                  <div className="space-y-1.5">
                    {searchResponse.aiSynthesis.perspectives[activeLens].bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-chirmo-text-secondary select-text">
                        <CheckCircle2 className="w-4 h-4 text-chirmo-brand shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live GitHub Repositories Strip (If returned by GitHub API) */}
                {searchResponse.liveRepos && searchResponse.liveRepos.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-chirmo-text-secondary flex items-center gap-1.5 mb-2">
                      <GitBranch className="w-3.5 h-3.5 text-chirmo-brand" />
                      <span>Canlı GitHub Açık Kaynak Liderleri</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {searchResponse.liveRepos.map((repo) => (
                        <div
                          key={repo.id}
                          onClick={() => onNavigateToBrowser(repo.url)}
                          className="p-3 rounded-xl border border-chirmo-border hover:border-chirmo-brand bg-white hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-xs font-extrabold text-indigo-700 truncate">{repo.fullName}</span>
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                                <Star className="w-3 h-3 fill-amber-400" /> {repo.stars.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-[11px] text-chirmo-text-secondary line-clamp-2 mb-2">
                              {repo.description}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-chirmo-text-muted">{repo.language}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources & Action Bar */}
                <div className="pt-3 border-t border-chirmo-border flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSpawnProjectFromBlueprint}
                      disabled={blueprintExported}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white text-xs font-bold hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                    >
                      <FolderKanban className="w-4 h-4" />
                      <span>
                        {blueprintExported
                          ? '✅ 4 Görevli Proje Oluşturuldu!'
                          : '🚀 Tek Tıkla 4 Adımlı Projeye Dönüştür'}
                      </span>
                    </button>
                    <button
                      onClick={() => onNavigateToAgents(`"${searchResponse.query}" hakkında derin araştırma raporu hazırla.`)}
                      className="px-3.5 py-2 rounded-xl bg-chirmo-secondary hover:bg-gray-200 text-chirmo-text text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Bot className="w-4 h-4 text-chirmo-brand" />
                      <span>Otonom AI Ajanına Gönder</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ACTIONABLE BLUEPRINT & INTERACTIVE KNOWLEDGE GRAPH */}
            {(activeTab === 'overview' || activeTab === 'blueprint') && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Step-by-Step Execution Checklist (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-chirmo-border p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs sm:text-sm font-extrabold text-chirmo-text flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Adım Adım Uygulama & İcra Planı (Checklist)</span>
                    </h4>
                    <span className="text-[10px] font-bold text-chirmo-text-muted">Tamamlananları işaretleyin</span>
                  </div>

                  <div className="space-y-2.5">
                    {searchResponse.aiSynthesis.actionBlueprint.map((step) => {
                      const isDone = Boolean(checkedSteps[step.step]);
                      return (
                        <div
                          key={step.step}
                          onClick={() => setCheckedSteps((p) => ({ ...p, [step.step]: !p[step.step] }))}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isDone
                              ? 'bg-emerald-50/50 border-emerald-200 opacity-75'
                              : 'bg-[#F8F7FC] hover:bg-white border-chirmo-border'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isDone ? 'bg-emerald-600 text-white' : 'bg-chirmo-brand/15 text-chirmo-brand'
                            }`}
                          >
                            {isDone ? '✓' : step.step}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-xs font-extrabold ${isDone ? 'line-through text-gray-500' : 'text-chirmo-text'}`}>
                                {step.title}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600 shrink-0">
                                ⏱️ {step.estimatedTime}
                              </span>
                            </div>
                            <p className="text-[11px] text-chirmo-text-secondary mt-0.5">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Visual Knowledge Graph Nodes (1 col) */}
                <div className="bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white rounded-3xl p-5 shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="w-4 h-4 text-cyan-300" />
                      <h4 className="text-xs sm:text-sm font-extrabold">Görsel Kavram Haritası</h4>
                    </div>
                    <p className="text-[11px] text-indigo-200 mb-4">
                      Konunun alt dallarına tıklayarak araştırmanızı görsel olarak derinleştirin:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {searchResponse.aiSynthesis.knowledgeNodes.map((node, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setQuery(node);
                            handleExecuteSearch(node);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-cyan-400 hover:text-[#1E1B4B] border border-white/15 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <span>{node}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/15 text-[10px] text-indigo-200 flex items-center justify-between">
                    <span>Bağlantılı Düğümler: 6</span>
                    <span>Anlık Dallanma Aktif</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. WEB & FEDERATED RESULTS */}
            {(activeTab === 'overview' || activeTab === 'web') && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-chirmo-text-secondary px-1">
                  🌐 Canlı Web, Wikipedia, GitHub & HackerNews Sonuçları
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
          </div>
        ) : (
          /* ==================== ZERO STATE: WHY CHIRMO IS EXTRAORDINARY ==================== */
          <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
            {/* ROW 1: 3 Unprecedented Interactive Superpower Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Interactive Decision Matrix Launcher */}
              <div className="bg-white rounded-3xl border border-chirmo-border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      Sıra Dışı Özellik #1
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-chirmo-text mb-1">
                    ⚖️ Ağırlıklı Karar Matrisi (X vs Y)
                  </h3>
                  <p className="text-xs text-chirmo-text-secondary leading-relaxed mb-4">
                    İki teknoloji, ürün veya strateji arasında mı kaldınız? Kriter ağırlıklarını (1x-5x) kendiniz belirleyin, kazananı matematiksel olarak görün.
                  </p>
                </div>

                <div className="space-y-1.5">
                  {['React vs Svelte', 'PostgreSQL vs MongoDB', 'Ev Almak vs Kirada Oturmak'].map((cmp, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(cmp);
                        setActiveMode('compare');
                        handleExecuteSearch(cmp, 'compare');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F7FC] hover:bg-indigo-600 hover:text-white text-xs font-bold text-chirmo-text flex items-center justify-between transition-all"
                    >
                      <span>{cmp}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 2: 4-Lens Multi-Persona Perspective Launcher */}
              <div className="bg-white rounded-3xl border border-chirmo-border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                      Sıra Dışı Özellik #2
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-chirmo-text mb-1">
                    🧠 4-Lens Perspektif Motoru
                  </h3>
                  <p className="text-xs text-chirmo-text-secondary leading-relaxed mb-4">
                    Tek tip sıkıcı özetler yerine her konuyu <b>CEO</b>, <b>Mühendis</b>, <b>Şeytanın Avukatı (Gizli Riskler)</b> ve <b>5 Yaşındaki Çocuk (ELI5)</b> gözüyle inceleyin.
                  </p>
                </div>

                <div className="space-y-1.5">
                  {['Yapay Zeka', 'Mikroservis Mimarisi', 'SaaS Girişimi Kurmak'].map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(topic);
                        handleExecuteSearch(topic);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F7FC] hover:bg-purple-600 hover:text-white text-xs font-bold text-chirmo-text flex items-center justify-between transition-all"
                    >
                      <span>🔍 "{topic}" 4 Lens ile İncele</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 3: Built-in Swiss Army & Action OS */}
              <div className="bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/15 text-cyan-300 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/15 text-cyan-300">
                      Sıra Dışı Özellik #3
                    </span>
                  </div>
                  <h3 className="text-sm font-black mb-1">
                    🛠️ Gömülü İsviçre Çakısı & İcra Üssü
                  </h3>
                  <p className="text-xs text-indigo-200 leading-relaxed mb-4">
                    KDV hesaplamak, şifre üretmek, Pomodoro tutmak veya not almak için başka sitelere gitmeyin. Hepsi doğrudan arama motorunun içinde!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveMicroApp('kdv')}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-left flex items-center gap-2 transition-all"
                  >
                    <Calculator className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>KDV Hesapla</span>
                  </button>
                  <button
                    onClick={() => setActiveMicroApp('dev')}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-left flex items-center gap-2 transition-all"
                  >
                    <KeyRound className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span>Şifre Üret</span>
                  </button>
                  <button
                    onClick={() => setActiveMicroApp('scratchpad')}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-left flex items-center gap-2 transition-all"
                  >
                    <FileText className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Hızlı Notlar</span>
                  </button>
                  <button
                    onClick={() => setActiveMicroApp('pomodoro')}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-left flex items-center gap-2 transition-all"
                  >
                    <Timer className="w-4 h-4 text-rose-300 shrink-0" />
                    <span>Odak Sayacı</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ROW 2: Recent Memory Vault & Global Portals */}
            <div className="bg-white/90 rounded-3xl border border-chirmo-border p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-chirmo-text-secondary flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-chirmo-brand" />
                  <span>Küresel Portallar & Son Aramalarınız (Hafıza Kasası)</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((rs, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(rs);
                      handleExecuteSearch(rs);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#F8F7FC] hover:bg-chirmo-brand hover:text-white border border-chirmo-border text-xs font-bold text-chirmo-text transition-all flex items-center gap-1.5"
                  >
                    <Search className="w-3 h-3 opacity-60" />
                    <span>{rs}</span>
                  </button>
                ))}
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
