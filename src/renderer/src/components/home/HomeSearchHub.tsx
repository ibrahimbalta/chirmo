import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Globe,
  Calculator,
  BookOpen,
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
  Scale
} from 'lucide-react';
import {
  SearchEngineService,
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

type WidgetId = 'shortcuts' | 'kanban' | 'notes' | 'calculator';

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
  { id: 'k1', title: 'Rakip siteleri incele ve not çıkar', tag: 'Araştırma', column: 'todo' },
  { id: 'k2', title: 'Yeni proje yol haritasını hazırla', tag: 'Plan', column: 'doing' },
  { id: 'k3', title: 'Haftalık görev listesini oluştur', tag: 'Tamam', column: 'done' }
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
  onNavigateToBrowser
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [resultTab, setResultTab] = useState<'all' | 'ai' | 'compare'>('all');

  // Customizable Widgets State (Add / Remove widgets like modular blocks)
  const [activeWidgets, setActiveWidgets] = useState<WidgetId[]>(() => {
    try {
      const saved = localStorage.getItem('chirmo_home_widgets');
      return saved ? JSON.parse(saved) : ['shortcuts', 'kanban'];
    } catch {
      return ['shortcuts', 'kanban'];
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

  // Shortcuts State (Add / Remove sites)
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

  // Quick Calculator Widget State
  const [calcInput, setCalcInput] = useState('1500 * 1.20');

  // Workspace context for search
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
  }, []);

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

  // Add search item directly to Kanban
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

  const handleExecuteSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setIsSearching(true);
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
      id: 'notes',
      label: 'Hızlı Not Defteri',
      desc: 'Anlık fikirler ve karalama alanı',
      icon: <StickyNote className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'calculator',
      label: 'Hesap & Döviz Kutusu',
      desc: 'Anında matematik ve döviz çevirici',
      icon: <Calculator className="w-4 h-4 text-rose-500" />
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white text-slate-900 select-none flex flex-col">
      {/* TOP BAR: Clean & Minimal (Like Google's top-right bar) */}
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          {searchResponse && (
            <button
              onClick={() => {
                setSearchResponse(null);
                setQuery('');
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ChirmoLogo size="sm" />
            </button>
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

      {/* WIDGET CUSTOMIZER DRAWER (Add / Remove Homepage Sections) */}
      {showWidgetPicker && (
        <div className="w-full bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-4 animate-fadeIn">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700">
                Ana Sayfa Alanlarını Özelleştir ( İstediğiniz modülü ekleyin veya kaldırın )
              </span>
              <button
                onClick={() => setShowWidgetPicker(false)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Tamam
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
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
        <div className={`w-full flex flex-col items-center transition-all ${searchResponse ? 'pt-4 pb-6' : 'pt-10 sm:pt-16 pb-8'}`}>
          {!searchResponse && (
            <div className="mb-6 text-center">
              <ChirmoLogo size="xl" />
            </div>
          )}

          {/* Clean Rounded-Full Search Bar */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div className="relative flex items-center w-full bg-white hover:bg-white rounded-full border border-slate-300 hover:border-slate-400 focus-within:border-blue-600 shadow-xs hover:shadow-md focus-within:shadow-md transition-all px-4 sm:px-5 py-2.5 sm:py-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Web'de arayın, '1500 * 1.20' hesaplayın veya 'React vs Vue' karşılaştırın..."
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

            {/* Google-Style Clean Action Buttons when on homepage */}
            {!searchResponse && (
              <div className="flex items-center justify-center gap-3 mt-5">
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

        {/* ==================== 2. CLEAN SEARCH RESULTS VIEW ==================== */}
        {searchResponse ? (
          <div className="w-full max-w-3xl mx-auto space-y-5 animate-fadeIn">
            {/* Simple Google-style Result Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setResultTab('all')}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors ${
                    resultTab === 'all'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tümü ({searchResponse.webResults.length})
                </button>
                <button
                  onClick={() => setResultTab('ai')}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1 ${
                    resultTab === 'ai'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Özeti</span>
                </button>
                <button
                  onClick={() => {
                    if (!searchResponse.decisionMatrix) {
                      const dm = SearchEngineService.buildDecisionMatrix(searchResponse.query, true);
                      setSearchResponse({ ...searchResponse, decisionMatrix: dm });
                    }
                    setResultTab('compare');
                  }}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1 ${
                    resultTab === 'compare'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Kıyaslama</span>
                </button>
              </div>

              <button
                onClick={() => addSearchToKanban(`Araştır: ${searchResponse.query}`)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Kanban'a Ekle</span>
              </button>
            </div>

            {/* Instant Answer / Wikipedia Knowledge Box */}
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
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                )}
              </div>
            )}

            {/* AI Summary Tab or Top Overview */}
            {(resultTab === 'all' || resultTab === 'ai') && (
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/40 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Akıllı Özet</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3 select-text">
                  {searchResponse.aiSynthesis.summary}
                </p>
                <div className="space-y-1">
                  {searchResponse.aiSynthesis.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comparison View */}
            {resultTab === 'compare' && searchResponse.decisionMatrix && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  ⚖️ {searchResponse.decisionMatrix.optionA} vs {searchResponse.decisionMatrix.optionB}
                </h3>
                <p className="text-xs text-slate-600">{searchResponse.decisionMatrix.verdict}</p>
                <div className="space-y-2.5">
                  {searchResponse.decisionMatrix.criteria.map((c, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-semibold text-slate-700 mb-1">
                        <span>{c.name}</span>
                        <span>
                          {searchResponse.decisionMatrix?.optionA}: {c.scoreA} | {searchResponse.decisionMatrix?.optionB}: {c.scoreB}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="bg-blue-600 h-full" style={{ width: `${c.scoreA / 2}%` }} />
                        <div className="bg-teal-500 h-full" style={{ width: `${c.scoreB / 2}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clean Google-Style Web Links */}
            {resultTab === 'all' && (
              <div className="space-y-4 pt-1">
                {searchResponse.webResults.map((item) => (
                  <div
                    key={item.id}
                    className="group p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs text-slate-500 truncate">{item.domain}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addSearchToKanban(item.title)}
                          className="opacity-0 group-hover:opacity-100 text-[11px] text-slate-500 hover:text-blue-600 font-medium transition-opacity"
                        >
                          + Kanban'a Ekle
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
            {/* MODULE A: QUICK SHORTCUTS (Eklenip Çıkarılabilir Hızlı Kısayollar) */}
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

            {/* MODULE B: INTERACTIVE KANBAN BOARD (Kanban Proje & Görev Panosu) */}
            {activeWidgets.includes('kanban') && (
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Kanban className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Kanban Proje & Görev Panosu
                    </h2>
                  </div>
                  <button
                    onClick={() => toggleWidget('kanban')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    title="Bu alanı kaldır"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3 Kanban Columns: Yapılacaklar, Devam Eden, Tamamlandı */}
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
                          {/* Column Header */}
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

                          {/* Add Card Input */}
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

                          {/* Cards List */}
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

                                {/* Move Left / Move Right / Delete Controls */}
                                <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                                  {col.id !== 'todo' && (
                                    <button
                                      onClick={() =>
                                        moveKanbanCard(card.id, col.id === 'done' ? 'doing' : 'todo')
                                      }
                                      className="p-1 rounded hover:bg-white text-slate-500 hover:text-blue-600"
                                      title="Önceki sütuna taşı"
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
                                      title="Sonraki sütuna taşı"
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

            {/* MODULE C & D ROW: Sticky Notes & Quick Calculator */}
            {(activeWidgets.includes('notes') || activeWidgets.includes('calculator')) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeWidgets.includes('notes') && (
                  <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <StickyNote className="w-4 h-4 text-amber-600" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Hızlı Not Defteri
                        </h3>
                      </div>
                      <button
                        onClick={() => toggleWidget('notes')}
                        className="p-1 text-slate-400 hover:text-slate-600"
                        title="Bu alanı kaldır"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
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
                      placeholder="Unutmamak istediğiniz notları buraya yazın (Otomatik kaydedilir)..."
                      className="w-full p-3 rounded-xl bg-white border border-amber-200/90 text-xs text-slate-800 outline-none focus:border-amber-500 select-text"
                    />
                  </div>
                )}

                {activeWidgets.includes('calculator') && (
                  <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-blue-600" />
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Hızlı Hesap & Döviz Çevirici
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleWidget('calculator')}
                          className="p-1 text-slate-400 hover:text-slate-600"
                          title="Bu alanı kaldır"
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
