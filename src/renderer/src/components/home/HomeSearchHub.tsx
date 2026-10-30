import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Globe,
  Calculator,
  ArrowRight,
  ExternalLink,
  X,
  Plus,
  LayoutGrid,
  Kanban,
  StickyNote,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Check,
  Sparkles,
  Scale,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Clock,
  ShieldCheck,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Radio,
  Sliders,
  Download,
  GitBranch,
  Star
} from 'lucide-react';
import {
  SearchEngineService,
  SearchResponse,
  PerspectiveLens,
  TemporalEra
} from '../../services/searchEngine';
import { Project, Task, HistoryEntry } from '../../types';
import { ChirmoLogo } from '../common/ChirmoLogo';

interface HomeSearchHubProps {
  onNavigateToBrowser: (url: string) => void;
  onNavigateToAgents: (prompt: string) => void;
  onNavigateToProjects: () => void;
  onNavigateToTools: () => void;
}

type WidgetId = 'shortcuts' | 'kanban' | 'radar' | 'notes' | 'calculator' | 'pomodoro';

interface KanbanCard {
  id: string;
  title: string;
  tag: string;
  column: 'todo' | 'doing' | 'done';
}

interface ShortcutItem {
  id: string;
  title: string;
  url: string;
}

const DEFAULT_KANBAN: KanbanCard[] = [
  { id: 'k1', title: 'Hedef anahtar kelimeleri ve rakipleri incele', tag: 'Araştırma', column: 'todo' },
  { id: 'k2', title: '2036 vizyonu ve proje yol haritasını çıkar', tag: 'Plan', column: 'doing' },
  { id: 'k3', title: 'Chirmo çalışma alanını kişiselleştir', tag: 'Tamam', column: 'done' }
];

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  { id: 's1', title: 'Google', url: 'https://www.google.com' },
  { id: 's2', title: 'YouTube', url: 'https://www.youtube.com' },
  { id: 's3', title: 'GitHub', url: 'https://github.com' },
  { id: 's4', title: 'Wikipedia', url: 'https://tr.wikipedia.org' },
  { id: 's5', title: 'ChatGPT', url: 'https://chatgpt.com' },
  { id: 's6', title: 'X / Twitter', url: 'https://x.com' }
];

export const HomeSearchHub: React.FC<HomeSearchHubProps> = ({
  onNavigateToBrowser,
  onNavigateToAgents
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [resultTab, setResultTab] = useState<'all' | 'ai' | 'temporal' | 'compare' | 'xray'>('all');

  // 2036 Future Engine Controls
  const [activeLens, setActiveLens] = useState<PerspectiveLens>('ceo');
  const [activeEra, setActiveEra] = useState<TemporalEra>('future2036');
  const [customWeights, setCustomWeights] = useState<Record<number, number>>({});
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [kanbanToast, setKanbanToast] = useState<string | null>(null);

  // Interactive Simulator Sliders (inside results)
  const [simSpeed, setSimSpeed] = useState(75);
  const [simBudget, setSimBudget] = useState(50);

  // Customizable Widgets State
  const [activeWidgets, setActiveWidgets] = useState<WidgetId[]>(() => {
    try {
      const saved = localStorage.getItem('chirmo_home_widgets');
      return saved ? JSON.parse(saved) : ['shortcuts', 'kanban', 'radar'];
    } catch {
      return ['shortcuts', 'kanban', 'radar'];
    }
  });
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);

  // Kanban Board State
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>(() => {
    try {
      const saved = localStorage.getItem('chirmo_kanban_cards');
      return saved ? JSON.parse(saved) : DEFAULT_KANBAN;
    } catch {
      return DEFAULT_KANBAN;
    }
  });
  const [newKanbanTitle, setNewKanbanTitle] = useState('');
  const [addingToCol, setAddingToCol] = useState<'todo' | 'doing' | 'done' | null>(null);

  // Shortcuts State
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(() => {
    try {
      const saved = localStorage.getItem('chirmo_shortcuts');
      return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
    } catch {
      return DEFAULT_SHORTCUTS;
    }
  });
  const [showAddShortcut, setShowAddShortcut] = useState(false);
  const [newSiteTitle, setNewSiteTitle] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');

  // Sticky Note State
  const [noteText, setNoteText] = useState<string>(() => {
    try {
      return localStorage.getItem('chirmo_quick_note') || '';
    } catch {
      return '';
    }
  });

  // Quick Calculator & KDV State
  const [calcInput, setCalcInput] = useState('1500 * 1.20');

  // Pomodoro Timer State
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);

  // Live Tech Radar State
  const [radarItems, setRadarItems] = useState<{ id: string; title: string; url: string; points: number; author: string }[]>([]);

  // Workspace context
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (window.chirmo) {
      window.chirmo.getProjects().then(setProjects).catch(() => {});
      window.chirmo.getTasks().then(setTasks).catch(() => {});
      window.chirmo.getHistory().then(setHistory).catch(() => {});
    }
    SearchEngineService.fetchLiveTechRadar().then(setRadarItems).catch(() => {});
  }, []);

  // Pomodoro countdown effect
  useEffect(() => {
    if (!pomoRunning) return;
    const interval = setInterval(() => {
      setPomoSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [pomoRunning]);

  // Stop speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const showToast = (msg: string) => {
    setKanbanToast(msg);
    setTimeout(() => setKanbanToast(null), 2800);
  };

  // Real Web Speech API Voice Recognition
  const handleToggleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Tarayıcınız sesli komutu desteklemiyor, örnek sesli sorgu aktarıldı.');
      setQuery('Yapay Zeka 2036 Geleceği');
      handleExecuteSearch('Yapay Zeka 2036 Geleceği');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        setIsListening(false);
        if (transcript) {
          setQuery(transcript);
          handleExecuteSearch(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Mikrofon izni kapalıysa metin yazarak arayabilirsiniz.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch {
      setIsListening(false);
    }
  };

  // Real Web Speech Synthesis (Text-to-Speech Read Aloud)
  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Sesli okuma bu cihazda desteklenmiyor.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.02;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Persist widgets
  const updateWidgets = (next: WidgetId[]) => {
    setActiveWidgets(next);
    try {
      localStorage.setItem('chirmo_home_widgets', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const toggleWidget = (id: WidgetId) => {
    if (activeWidgets.includes(id)) {
      updateWidgets(activeWidgets.filter((w) => w !== id));
    } else {
      updateWidgets([...activeWidgets, id]);
    }
  };

  // Persist Kanban
  const updateKanban = (next: KanbanCard[]) => {
    setKanbanCards(next);
    try {
      localStorage.setItem('chirmo_kanban_cards', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleAddKanbanCard = (col: 'todo' | 'doing' | 'done') => {
    if (!newKanbanTitle.trim()) return;
    const card: KanbanCard = {
      id: `kb_${Date.now()}`,
      title: newKanbanTitle.trim(),
      tag: col === 'todo' ? 'Yeni' : col === 'doing' ? 'Aktif' : 'Bitti',
      column: col
    };
    updateKanban([...kanbanCards, card]);
    setNewKanbanTitle('');
    setAddingToCol(null);
  };

  const moveKanbanCard = (id: string, targetCol: 'todo' | 'doing' | 'done') => {
    updateKanban(
      kanbanCards.map((c) => (c.id === id ? { ...c, column: targetCol } : c))
    );
  };

  const deleteKanbanCard = (id: string) => {
    updateKanban(kanbanCards.filter((c) => c.id !== id));
  };

  // Autonomous Goal-to-Kanban Decomposition
  const handleDecomposeGoalToKanban = (goalText: string) => {
    const targetGoal = goalText.trim() || 'Yeni Proje Hedefi';
    const generated = SearchEngineService.decomposeGoalToKanban(targetGoal);
    const newCards: KanbanCard[] = generated.map((g, idx) => ({
      id: `kb_auto_${Date.now()}_${idx}`,
      title: g.title,
      tag: g.tag,
      column: g.column
    }));
    updateKanban([...newCards, ...kanbanCards]);
    if (!activeWidgets.includes('kanban')) {
      updateWidgets([...activeWidgets, 'kanban']);
    }
    showToast(`"${targetGoal}" için 4 görev otomatik olarak Kanban panosuna eklendi!`);
  };

  const addSearchToKanban = (title: string) => {
    const card: KanbanCard = {
      id: `kb_${Date.now()}`,
      title,
      tag: 'Arama',
      column: 'todo'
    };
    updateKanban([card, ...kanbanCards]);
    if (!activeWidgets.includes('kanban')) {
      updateWidgets([...activeWidgets, 'kanban']);
    }
    showToast('Görev Kanban "Yapılacaklar" sütununa eklendi.');
  };

  // Download Note as .txt file
  const handleDownloadNote = () => {
    if (!noteText.trim()) return;
    const blob = new Blob([noteText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chirmo-not-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Persist Shortcuts
  const handleAddShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteTitle.trim() || !newSiteUrl.trim()) return;
    const formattedUrl = newSiteUrl.startsWith('http') ? newSiteUrl.trim() : `https://${newSiteUrl.trim()}`;
    const next = [...shortcuts, { id: `s_${Date.now()}`, title: newSiteTitle.trim(), url: formattedUrl }];
    setShortcuts(next);
    try {
      localStorage.setItem('chirmo_shortcuts', JSON.stringify(next));
    } catch {
      // ignore
    }
    setNewSiteTitle('');
    setNewSiteUrl('');
    setShowAddShortcut(false);
  };

  const removeShortcut = (id: string) => {
    const next = shortcuts.filter((s) => s.id !== id);
    setShortcuts(next);
    try {
      localStorage.setItem('chirmo_shortcuts', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // Live instant preview while typing in the search bar
  const livePreview = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return undefined;
    return SearchEngineService.detectInstantAnswer(query.trim());
  }, [query]);

  // Quick calculator widget evaluation
  const calcWidgetOutput = useMemo(() => {
    return SearchEngineService.detectInstantAnswer(calcInput);
  }, [calcInput]);

  // Weighted Decision Matrix live calculation
  const matrixScores = useMemo(() => {
    const dm = searchResponse?.decisionMatrix;
    if (!dm) return { scoreA: 0, scoreB: 0, winner: '' };
    let totalW = 0;
    let sumA = 0;
    let sumB = 0;
    dm.criteria.forEach((c, idx) => {
      const w = customWeights[idx] ?? c.weight;
      totalW += w;
      sumA += c.scoreA * w;
      sumB += c.scoreB * w;
    });
    const scoreA = totalW > 0 ? Math.round(sumA / totalW) : 0;
    const scoreB = totalW > 0 ? Math.round(sumB / totalW) : 0;
    return {
      scoreA,
      scoreB,
      winner: scoreA >= scoreB ? dm.optionA : dm.optionB
    };
  }, [searchResponse?.decisionMatrix, customWeights]);

  // Kanban completion percentage
  const kanbanProgress = useMemo(() => {
    if (kanbanCards.length === 0) return 0;
    const doneCount = kanbanCards.filter((c) => c.column === 'done').length;
    return Math.round((doneCount / kanbanCards.length) * 100);
  }, [kanbanCards]);

  const handleExecuteSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setCustomWeights({});
    try {
      const response = await SearchEngineService.search(trimmed, 'all', {
        projects,
        tasks,
        history
      });
      setSearchResponse(response);
      setResultTab('all');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(query);
  };

  const formatPomo = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const availableWidgets: { id: WidgetId; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'shortcuts',
      label: 'Hızlı Kısayollar',
      desc: 'Sık kullandığınız web siteleri',
      icon: <Globe className="w-4 h-4 text-blue-600" />
    },
    {
      id: 'kanban',
      label: 'Kanban Proje Panosu',
      desc: 'Yapılacaklar, Devam Eden ve Biten işler',
      icon: <Kanban className="w-4 h-4 text-emerald-600" />
    },
    {
      id: 'radar',
      label: 'Canlı Teknoloji Radarı',
      desc: 'Küresel gündem ve anlık teknoloji akışı',
      icon: <Radio className="w-4 h-4 text-indigo-600" />
    },
    {
      id: 'notes',
      label: 'Hızlı Not Defteri',
      desc: 'Anlık fikirler ve indirilebilir notlar',
      icon: <StickyNote className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'calculator',
      label: 'Hesap & Döviz Kutusu',
      desc: 'Anında matematik ve kur çevirici',
      icon: <Calculator className="w-4 h-4 text-rose-500" />
    },
    {
      id: 'pomodoro',
      label: 'Pomodoro Odak Sayacı',
      desc: '25 dakikalık derin çalışma kronometresi',
      icon: <Timer className="w-4 h-4 text-teal-600" />
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white text-slate-900 select-none flex flex-col relative">
      {/* TOAST NOTIFICATION */}
      {kanbanToast && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{kanbanToast}</span>
        </div>
      )}

      {/* TOP BAR: Clean & Minimal */}
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          {searchResponse ? (
            <button
              onClick={() => {
                setSearchResponse(null);
                setQuery('');
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ChirmoLogo size="sm" />
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Chirmo 2036 • Canlı Sentez & Kanban Motoru</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWidgetPicker(!showWidgetPicker)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showWidgetPicker
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Alan Ekle / Çıkar ({activeWidgets.length})</span>
          </button>
        </div>
      </div>

      {/* WIDGET CUSTOMIZER DRAWER */}
      {showWidgetPicker && (
        <div className="w-full bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-4 animate-fadeIn">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700">
                Ana Sayfa Modüllerini Seçin (İstediğiniz aracı ekleyin veya kaldırın)
              </span>
              <button
                onClick={() => setShowWidgetPicker(false)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Kapat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {availableWidgets.map((w) => {
                const isAdded = activeWidgets.includes(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWidget(w.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between ${
                      isAdded
                        ? 'bg-white border-blue-500 ring-2 ring-blue-500/10 shadow-xs'
                        : 'bg-white/60 border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">{w.icon}</div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{w.label}</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{w.desc}</span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        isAdded ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-24 md:pb-12 flex flex-col">
        {/* ==================== 1. PURE GOOGLE-STYLE SEARCH HERO ==================== */}
        <div className={`w-full flex flex-col items-center transition-all ${searchResponse ? 'pt-4 pb-5' : 'pt-8 sm:pt-14 pb-8'}`}>
          {!searchResponse && (
            <div className="mb-5 text-center">
              <ChirmoLogo size="xl" />
            </div>
          )}

          {/* Clean Rounded-Full Search Bar with Live Voice Microphone */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div className="relative flex items-center w-full bg-white rounded-full border border-slate-300 hover:border-slate-400 focus-within:border-blue-600 shadow-xs hover:shadow-md focus-within:shadow-md transition-all px-4 sm:px-5 py-2.5 sm:py-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Web'de arayın, 'React vs Vue' karşılaştırın veya '1500 * 1.20' hesaplayın..."
                className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none select-text"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSearchResponse(null);
                    inputRef.current?.focus();
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                  title="Temizle"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={handleToggleVoiceSearch}
                className={`p-2 rounded-full mr-1.5 transition-colors ${
                  isListening
                    ? 'bg-rose-100 text-rose-600 animate-pulse'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-blue-600'
                }`}
                title="Sesli Arama Başlat"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors disabled:opacity-40 shrink-0"
              >
                {isSearching ? '...' : 'Ara'}
              </button>
            </div>

            {/* Instant Answer Pill right under input while typing */}
            {livePreview && !searchResponse && (
              <div
                onClick={() => handleExecuteSearch(query)}
                className="mt-2 mx-4 px-4 py-2 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between cursor-pointer hover:bg-blue-100/70 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-blue-700">{livePreview.title}:</span>
                  <span className="font-black text-slate-900 text-sm">{livePreview.result}</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  Detay <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            )}

            {/* Clean Action Buttons Below Search Bar */}
            {!searchResponse && (
              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
                <button
                  type="submit"
                  onClick={() => {
                    if (query.trim()) handleExecuteSearch(query);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
                >
                  Chirmo ile Ara
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const targetGoal = query.trim() || 'Yeni Web Girişimi Kurmak';
                    handleDecomposeGoalToKanban(targetGoal);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/70 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  title="Yazdığınız hedefi otomatik olarak 4 adımlı Kanban görevlerine böler"
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Hedefi Kanban'a Böl</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = query.trim()
                      ? `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`
                      : 'https://www.google.com';
                    onNavigateToBrowser(target);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>Google'da Aç</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ==================== 2. 2036 NEXT-GEN SEARCH RESULTS VIEW ==================== */}
        {searchResponse ? (
          <div className="w-full max-w-3xl mx-auto space-y-5 animate-fadeIn">
            {/* Clean Google-style Result Tabs + 2036 Modes */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2 gap-2 text-xs">
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setResultTab('all')}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    resultTab === 'all'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tümü ({searchResponse.webResults.length})
                </button>

                <button
                  onClick={() => setResultTab('temporal')}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                    resultTab === 'temporal'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>2036 Zaman Makinesi</span>
                </button>

                <button
                  onClick={() => setResultTab('ai')}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                    resultTab === 'ai'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>4-Zihin Lensi</span>
                </button>

                <button
                  onClick={() => {
                    if (!searchResponse.decisionMatrix) {
                      const dm = SearchEngineService.buildDecisionMatrix(searchResponse.query, true);
                      setSearchResponse({ ...searchResponse, decisionMatrix: dm });
                    }
                    setResultTab('compare');
                  }}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                    resultTab === 'compare'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Karar Matrisi</span>
                </button>

                <button
                  onClick={() => setResultTab('xray')}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                    resultTab === 'xray'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Doğruluk X-Ray (%{searchResponse.aiSynthesis.factCheck.verifiabilityScore})</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSpeakText(searchResponse.aiSynthesis.summary)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors ${
                    isSpeaking
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="Özeti Sesli Dinle"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Durdur' : 'Sesli Dinle'}</span>
                </button>

                <button
                  onClick={() => handleDecomposeGoalToKanban(searchResponse.query)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Kanban'a Böl</span>
                </button>
              </div>
            </div>

            {/* A. INSTANT ANSWER / LIVE WIKIPEDIA CARD */}
            {searchResponse.instantAnswer && resultTab === 'all' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    {searchResponse.instantAnswer.badge || 'Hızlı Yanıt'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {searchResponse.instantAnswer.title}
                  </h3>
                  <div className="text-xl font-black text-blue-600 mb-2">
                    {searchResponse.instantAnswer.result}
                  </div>
                  {searchResponse.instantAnswer.details && (
                    <p className="text-xs text-slate-600 leading-relaxed select-text">
                      {searchResponse.instantAnswer.details}
                    </p>
                  )}
                </div>
                {searchResponse.instantAnswer.thumbnailUrl && (
                  <img
                    src={searchResponse.instantAnswer.thumbnailUrl}
                    alt={searchResponse.instantAnswer.title}
                    className="w-24 h-24 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                )}
              </div>
            )}

            {/* B. 2036 TEMPORAL TIME MACHINE TAB (Geçmiş ➔ Bugün ➔ 2036 Gelecek) */}
            {resultTab === 'temporal' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Zaman Makinesi: "{searchResponse.query}" Evrimi</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Konunun geçmiş kökenini, bugünkü canlı durumunu ve 10 yıl sonraki (2036) geleceğini inceleyin
                    </p>
                  </div>

                  {/* Era Switcher */}
                  <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
                    {(
                      [
                        { id: 'past', label: '⏪ Geçmiş Köken' },
                        { id: 'present', label: '📍 2026 Bugün' },
                        { id: 'future2036', label: '⏩ 2036 Gelecek' }
                      ] as const
                    ).map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setActiveEra(e.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          activeEra === e.id
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {e.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Era Content */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-600 uppercase">
                      {searchResponse.aiSynthesis.temporal[activeEra].era}
                    </span>
                    {activeEra === 'future2036' && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Dönüşüm Etkisi: %{searchResponse.aiSynthesis.temporal.future2036.disruptionProbability}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {searchResponse.aiSynthesis.temporal[activeEra].title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed select-text">
                    {searchResponse.aiSynthesis.temporal[activeEra].summary}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {searchResponse.aiSynthesis.temporal[activeEra].milestones.map((m, i) => (
                      <div key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="text-blue-600 font-bold">➔</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Parameter Simulator */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">
                    🎛️ Canlı Etki & Verimlilik Simülatörü (Parametreleri Kaydırın)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Otomasyon & AI Entegrasyon Oranı</span>
                        <span>%{simSpeed}</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={simSpeed}
                        onChange={(e) => setSimSpeed(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Kaynak & Zaman Yatırımı</span>
                        <span>%{simBudget}</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={simBudget}
                        onChange={(e) => setSimBudget(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-blue-200/60 text-xs">
                    <span className="text-slate-600">Tahmini Hızlanma Çarpanı:</span>
                    <span className="font-black text-blue-700 text-sm">
                      {((simSpeed * 0.08) + (simBudget * 0.04)).toFixed(1)}x Daha Yüksek Verim
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* C. 4-LENS PERSPECTIVE SWITCHER (CEO, Engineer, Devil's Advocate, ELI5) */}
            {(resultTab === 'all' || resultTab === 'ai') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Akıllı Sentez & Bakış Açısı Lensi</span>
                  </span>

                  {/* 4 Lens Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {(
                      [
                        { id: 'ceo', label: '🎯 Yönetici' },
                        { id: 'engineer', label: '💻 Mühendis' },
                        { id: 'critic', label: '⚠️ Risk Analizi' },
                        { id: 'eli5', label: '👶 Yalın Anlatım' }
                      ] as const
                    ).map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setActiveLens(l.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                          activeLens === l.id
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed select-text">
                  {searchResponse.aiSynthesis.perspectives[activeLens].content}
                </p>

                <div className="space-y-1">
                  {searchResponse.aiSynthesis.perspectives[activeLens].bullets.map((item, idx) => (
                    <div key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* D. INTERACTIVE WEIGHTED DECISION MATRIX TAB */}
            {resultTab === 'compare' && searchResponse.decisionMatrix && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      ⚖️ {searchResponse.decisionMatrix.optionA} vs {searchResponse.decisionMatrix.optionB}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kriter önem derecesini (1x-5x) değiştirerek sizin için en doğru seçimi hesaplayın
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold">
                    🏆 Lider: {matrixScores.winner} ({matrixScores.scoreA} vs {matrixScores.scoreB})
                  </div>
                </div>

                <div className="space-y-3">
                  {searchResponse.decisionMatrix.criteria.map((c, i) => {
                    const currentW = customWeights[i] ?? c.weight;
                    return (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-slate-800">{c.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 mr-1 flex items-center gap-1">
                              <Sliders className="w-3 h-3" /> Önem:
                            </span>
                            {[1, 2, 3, 4, 5].map((w) => (
                              <button
                                key={w}
                                onClick={() => setCustomWeights((p) => ({ ...p, [i]: w }))}
                                className={`w-6 h-6 rounded text-[10px] font-bold ${
                                  currentW === w
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-600'
                                }`}
                              >
                                {w}x
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                          <span>{searchResponse.decisionMatrix?.optionA}: <b>{c.scoreA}</b></span>
                          <span>{searchResponse.decisionMatrix?.optionB}: <b>{c.scoreB}</b></span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                          <div className="bg-blue-600 h-full" style={{ width: `${c.scoreA / 2}%` }} />
                          <div className="bg-emerald-500 h-full" style={{ width: `${c.scoreB / 2}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* E. FACT-CHECK & REALITY X-RAY TAB */}
            {resultTab === 'xray' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Gerçeklik, Tarafsızlık ve Kaynak X-Ray Analizi</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Doğrulanabilirlik: %{searchResponse.aiSynthesis.factCheck.verifiabilityScore}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block mb-1">Tarafsızlık Skoru</span>
                    <span className="text-base font-black text-slate-900">
                      %{searchResponse.aiSynthesis.factCheck.neutralityScore} Tarafsız
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block mb-1">Kaynak Çeşitliliği</span>
                    <span className="text-xs font-bold text-slate-800">
                      {searchResponse.aiSynthesis.factCheck.sourceDiversity}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                  <b>⚠️ Kör Nokta Uyarısı:</b> {searchResponse.aiSynthesis.factCheck.blindSpotWarning}
                </div>
              </div>
            )}

            {/* F. LIVE GITHUB REPOS STRIP (When available) */}
            {resultTab === 'all' && searchResponse.liveRepos && searchResponse.liveRepos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {searchResponse.liveRepos.map((repo) => (
                  <div
                    key={repo.id}
                    onClick={() => onNavigateToBrowser(repo.url)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200 hover:border-blue-400 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-blue-700 truncate flex items-center gap-1">
                        <GitBranch className="w-3 h-3 shrink-0" />
                        {repo.fullName}
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {repo.stars.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{repo.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* G. CLEAN GOOGLE-STYLE WEB LINKS */}
            {resultTab === 'all' && (
              <div className="space-y-3 pt-1">
                {searchResponse.webResults.map((item) => (
                  <div
                    key={item.id}
                    className="group p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{item.domain}</span>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addSearchToKanban(item.title)}
                          className="opacity-0 group-hover:opacity-100 text-[11px] text-emerald-600 hover:underline font-semibold transition-opacity"
                        >
                          + Kanban'a Ekle
                        </button>
                        <button
                          onClick={() => onNavigateToAgents(`Şu kaynağı analiz et: ${item.url}`)}
                          className="opacity-0 group-hover:opacity-100 text-[11px] text-slate-500 hover:text-blue-600 font-medium transition-opacity"
                        >
                          AI ile Özetle
                        </button>
                        <button
                          onClick={() => onNavigateToBrowser(item.url)}
                          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>Aç</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <h4
                      onClick={() => onNavigateToBrowser(item.url)}
                      className="text-sm sm:text-base font-semibold text-blue-700 group-hover:underline cursor-pointer mb-1"
                    >
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed select-text">
                      {item.snippet}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ==================== 3. MODULAR ADD/REMOVE WORKSPACE & KANBAN ==================== */
          <div className="w-full space-y-6 mt-2">
            {/* MODULE 1: QUICK SHORTCUTS */}
            {activeWidgets.includes('shortcuts') && (
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Hızlı Kısayollar
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAddShortcut(!showAddShortcut)}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Site Ekle</span>
                    </button>
                    <button
                      onClick={() => toggleWidget('shortcuts')}
                      className="p-1 text-slate-400 hover:text-slate-600"
                      title="Bu alanı kaldır"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {showAddShortcut && (
                  <form onSubmit={handleAddShortcut} className="mb-3 flex flex-wrap gap-2 bg-white p-3 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      value={newSiteTitle}
                      onChange={(e) => setNewSiteTitle(e.target.value)}
                      placeholder="Site adı (Örn: GitHub)"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs flex-1 min-w-[120px] outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={newSiteUrl}
                      onChange={(e) => setNewSiteUrl(e.target.value)}
                      placeholder="Adres (Örn: github.com)"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs flex-1 min-w-[160px] outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                    >
                      Ekle
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {shortcuts.map((site) => (
                    <div
                      key={site.id}
                      onClick={() => onNavigateToBrowser(site.url)}
                      className="group relative bg-white hover:bg-blue-50/40 rounded-xl border border-slate-200/90 hover:border-blue-400 p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-2xs"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeShortcut(site.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 p-0.5 text-slate-400 hover:text-rose-500 transition-opacity"
                        title="Kısayolu sil"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mb-1.5">
                        {site.title.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 truncate w-full">
                        {site.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 2: INTERACTIVE KANBAN BOARD WITH PROGRESS BAR */}
            {activeWidgets.includes('kanban') && (
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Kanban className="w-4 h-4 text-emerald-600" />
                      <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Kanban Proje & Görev Panosu
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${kanbanProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">%{kanbanProgress} Bitti</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleWidget('kanban')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    title="Bu alanı kaldır"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(
                    [
                      { id: 'todo', title: 'Yapılacaklar', dot: 'bg-amber-500' },
                      { id: 'doing', title: 'Devam Eden', dot: 'bg-blue-600' },
                      { id: 'done', title: 'Tamamlandı', dot: 'bg-emerald-500' }
                    ] as const
                  ).map((col) => {
                    const colCards = kanbanCards.filter((c) => c.column === col.id);
                    return (
                      <div
                        key={col.id}
                        className="bg-white rounded-xl border border-slate-200/90 p-3 flex flex-col justify-between min-h-[180px]"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                              <span className="text-xs font-bold text-slate-800">{col.title}</span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                                {colCards.length}
                              </span>
                            </div>
                            <button
                              onClick={() => setAddingToCol(addingToCol === col.id ? null : col.id)}
                              className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-blue-600"
                              title="Kart Ekle"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {addingToCol === col.id && (
                            <div className="mb-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                              <input
                                type="text"
                                value={newKanbanTitle}
                                onChange={(e) => setNewKanbanTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddKanbanCard(col.id);
                                }}
                                placeholder="Görev başlığı yazın..."
                                className="w-full text-xs bg-white px-2.5 py-1.5 rounded border border-slate-200 outline-none focus:border-blue-500 mb-1.5 select-text"
                                autoFocus
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => setAddingToCol(null)}
                                  className="px-2 py-1 text-[11px] text-slate-500"
                                >
                                  İptal
                                </button>
                                <button
                                  onClick={() => handleAddKanbanCard(col.id)}
                                  className="px-2.5 py-1 rounded bg-blue-600 text-white text-[11px] font-semibold"
                                >
                                  Ekle
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            {colCards.map((card) => (
                              <div
                                key={card.id}
                                className="group p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50/30 border border-slate-200/80 transition-all flex items-start justify-between gap-2"
                              >
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`text-xs font-medium text-slate-800 break-words ${
                                      col.id === 'done' ? 'line-through text-slate-400' : ''
                                    }`}
                                  >
                                    {card.title}
                                  </p>
                                  <span className="inline-block text-[10px] text-slate-400 mt-1">
                                    {card.tag}
                                  </span>
                                </div>

                                <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                                  {col.id !== 'todo' && (
                                    <button
                                      onClick={() =>
                                        moveKanbanCard(card.id, col.id === 'done' ? 'doing' : 'todo')
                                      }
                                      className="p-1 rounded hover:bg-white text-slate-500 hover:text-blue-600"
                                      title="Sola taşı"
                                    >
                                      <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {col.id !== 'done' && (
                                    <button
                                      onClick={() =>
                                        moveKanbanCard(card.id, col.id === 'todo' ? 'doing' : 'done')
                                      }
                                      className="p-1 rounded hover:bg-white text-slate-500 hover:text-emerald-600"
                                      title="Sağa taşı"
                                    >
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteKanbanCard(card.id)}
                                    className="p-1 rounded hover:bg-white text-slate-400 hover:text-rose-500"
                                    title="Sil"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {colCards.length === 0 && (
                              <p className="text-[11px] text-slate-400 text-center py-4">
                                Görev yok
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setAddingToCol(col.id)}
                          className="mt-3 w-full py-1.5 rounded-lg border border-dashed border-slate-200 hover:border-blue-400 text-[11px] font-medium text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Kart Ekle</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODULE 3: LIVE GLOBAL TECH RADAR (Canlı Teknoloji & Gündem Radarı) */}
            {activeWidgets.includes('radar') && (
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Canlı Küresel Teknoloji & Gündem Radarı
                    </h2>
                  </div>
                  <button
                    onClick={() => toggleWidget('radar')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    title="Bu alanı kaldır"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {radarItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onNavigateToBrowser(item.url)}
                      className="p-3 rounded-xl bg-white hover:bg-blue-50/30 border border-slate-200/90 hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-2">
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>🔥 {item.points} puan</span>
                        <span className="text-blue-600 font-semibold">Oku ➔</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 4, 5, 6 ROW: Notes, Calculator, Pomodoro */}
            {(activeWidgets.includes('notes') ||
              activeWidgets.includes('calculator') ||
              activeWidgets.includes('pomodoro')) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeWidgets.includes('notes') && (
                  <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StickyNote className="w-4 h-4 text-amber-600" />
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Hızlı Not Defteri
                          </h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleDownloadNote}
                            className="p-1 text-amber-700 hover:bg-amber-100 rounded"
                            title="Notu .txt olarak indir"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleWidget('notes')}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Kaldır"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={4}
                        value={noteText}
                        onChange={(e) => {
                          setNoteText(e.target.value);
                          try {
                            localStorage.setItem('chirmo_quick_note', e.target.value);
                          } catch {
                            // ignore
                          }
                        }}
                        placeholder="Notlarınızı buraya yazın (Otomatik kaydedilir)..."
                        className="w-full p-2.5 rounded-xl bg-white border border-amber-200/90 text-xs text-slate-800 outline-none focus:border-amber-500 select-text"
                      />
                    </div>
                  </div>
                )}

                {activeWidgets.includes('calculator') && (
                  <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-blue-600" />
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Hesap & Döviz Kutusu
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleWidget('calculator')}
                          className="p-1 text-slate-400 hover:text-slate-600"
                          title="Kaldır"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={calcInput}
                        onChange={(e) => setCalcInput(e.target.value)}
                        placeholder="Örn: 1500 * 1.20 veya 100 usd to try"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 mb-3 select-text"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Sonuç:</span>
                      <span className="text-base font-black text-blue-600">
                        {calcWidgetOutput ? calcWidgetOutput.result : '—'}
                      </span>
                    </div>
                  </div>
                )}

                {activeWidgets.includes('pomodoro') && (
                  <div className="bg-teal-50/40 rounded-2xl border border-teal-200/80 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-teal-600" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Odak Kronometresi
                        </h3>
                      </div>
                      <button
                        onClick={() => toggleWidget('pomodoro')}
                        className="p-1 text-slate-400 hover:text-slate-600"
                        title="Kaldır"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-center my-2">
                      <span className="text-3xl font-black font-mono text-teal-800">
                        {formatPomo(pomoSeconds)}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPomoRunning(!pomoRunning)}
                        className="flex-1 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1"
                      >
                        {pomoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{pomoRunning ? 'Duraklat' : 'Başlat'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setPomoRunning(false);
                          setPomoSeconds(25 * 60);
                        }}
                        className="p-1.5 rounded-xl bg-white border border-teal-200 text-teal-700"
                        title="Sıfırla"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
