import React, { useState, useEffect, useRef, useMemo } from 'react'
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
  Download,
  GitBranch,
  Star,
  BookOpen,
  Bookmark,
  History,
  Image as ImageIcon,
  Compass,
  AlertTriangle,
  Quote,
  Bot
} from 'lucide-react'
import {
  SearchEngineService,
  SearchResponse,
  PerspectiveLens,
  TemporalEra,
  ResultCategory
} from '../../services/searchEngine'
import { Project, Task, HistoryEntry } from '../../types'
import { ChirmoLogo } from '../common/ChirmoLogo'
import { WorkspaceStorage, SearchHistoryEntry } from '../../services/workspaceStorage'

interface HomeSearchHubProps {
  initialQuery?: string
  onNavigateToBrowser: (url: string) => void
  onNavigateToAgents: (prompt: string) => void
  onNavigateToProjects: () => void
  onNavigateToTools: () => void
  onNavigateToVisual?: (query: string) => void
  onNavigateToCompare?: (optionA: string, optionB: string) => void
  onNavigateToDiscover?: () => void
}

type WidgetId = 'shortcuts' | 'kanban' | 'radar' | 'notes' | 'calculator' | 'pomodoro'
type ResultTabId = 'all' | 'ai' | 'temporal' | 'xray'

interface KanbanCard {
  id: string
  title: string
  tag: string
  column: 'todo' | 'doing' | 'done'
}

interface ShortcutItem {
  id: string
  title: string
  url: string
}

const DEFAULT_KANBAN: KanbanCard[] = [
  {
    id: 'k1',
    title: 'Hedef anahtar kelimeleri ve rakipleri incele',
    tag: 'Araştırma',
    column: 'todo'
  },
  { id: 'k2', title: 'Proje yol haritasını ve görevleri planla', tag: 'Plan', column: 'doing' },
  { id: 'k3', title: 'Chirmo çalışma alanını kişiselleştir', tag: 'Tamam', column: 'done' }
]

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  { id: 's1', title: 'Wikipedia', url: 'https://tr.wikipedia.org' },
  { id: 's2', title: 'OpenAlex', url: 'https://openalex.org' },
  { id: 's3', title: 'Wikimedia Commons', url: 'https://commons.wikimedia.org' },
  { id: 's4', title: 'GitHub', url: 'https://github.com' },
  { id: 's5', title: 'Hacker News', url: 'https://news.ycombinator.com' },
  { id: 's6', title: 'YouTube', url: 'https://www.youtube.com' }
]

const SUGGESTED_DISCOVERY_QUERIES = [
  'Yapay Zeka Ajanları',
  'Elektrikli otomobil vs Hibrit otomobil',
  'Kuantum bilgisayar',
  'Modern mimarlık',
  '100 usd to try',
  '10000 tl kdv'
]

export const HomeSearchHub: React.FC<HomeSearchHubProps> = ({
  initialQuery = '',
  onNavigateToBrowser,
  onNavigateToAgents,
  onNavigateToVisual,
  onNavigateToCompare,
  onNavigateToDiscover
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null)
  const [resultTab, setResultTab] = useState<ResultTabId>('all')
  const [categoryFilter, setCategoryFilter] = useState<ResultCategory>('all')
  const [visibleResultsCount, setVisibleResultsCount] = useState<number>(8)

  // Autocomplete & Search History dropdown state
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentHistory, setRecentHistory] = useState<SearchHistoryEntry[]>([])
  const [showDropdown, setShowDropdown] = useState<boolean>(false)

  // Saved search & favorited sources state
  const [isCurrentSearchSaved, setIsCurrentSearchSaved] = useState<boolean>(false)
  const [favoritedUrls, setFavoritedUrls] = useState<Set<string>>(new Set())

  // Engine Controls
  const [activeLens, setActiveLens] = useState<PerspectiveLens>('ceo')
  const [activeEra, setActiveEra] = useState<TemporalEra>('future2036')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [kanbanToast, setKanbanToast] = useState<string | null>(null)

  // Customizable Widgets State
  const [activeWidgets, setActiveWidgets] = useState<WidgetId[]>(() => {
    try {
      const saved = localStorage.getItem('chirmo_home_widgets_v2')
      return saved ? JSON.parse(saved) : ['shortcuts', 'kanban', 'radar']
    } catch {
      return ['shortcuts', 'kanban', 'radar']
    }
  })
  const [showWidgetPicker, setShowWidgetPicker] = useState(false)

  // Kanban Board State
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>(() => {
    try {
      const saved = localStorage.getItem('chirmo_kanban_cards')
      return saved ? JSON.parse(saved) : DEFAULT_KANBAN
    } catch {
      return DEFAULT_KANBAN
    }
  })
  const [newKanbanTitle, setNewKanbanTitle] = useState('')
  const [addingToCol, setAddingToCol] = useState<'todo' | 'doing' | 'done' | null>(null)

  // Shortcuts State
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(() => {
    try {
      const saved = localStorage.getItem('chirmo_shortcuts')
      return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS
    } catch {
      return DEFAULT_SHORTCUTS
    }
  })
  const [showAddShortcut, setShowAddShortcut] = useState(false)
  const [newSiteTitle, setNewSiteTitle] = useState('')
  const [newSiteUrl, setNewSiteUrl] = useState('')

  // Sticky Note State
  const [noteText, setNoteText] = useState<string>(() => {
    try {
      return localStorage.getItem('chirmo_quick_note') || ''
    } catch {
      return ''
    }
  })

  // Quick Calculator State
  const [calcInput, setCalcInput] = useState('100 usd to try')

  // Pomodoro Timer State
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60)
  const [pomoRunning, setPomoRunning] = useState(false)

  // Live Tech Radar State
  const [radarItems, setRadarItems] = useState<
    { id: string; title: string; url: string; points: number; author: string }[]
  >([])

  // Workspace context
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const searchBoxContainerRef = useRef<HTMLDivElement>(null)

  const syncWorkspaceState = (): void => {
    setRecentHistory(WorkspaceStorage.getSearchHistory())
    setFavoritedUrls(new Set(WorkspaceStorage.getFavoriteSources().map((f) => f.url)))
    if (searchResponse) {
      setIsCurrentSearchSaved(WorkspaceStorage.isSearchSaved(searchResponse.query))
    }
  }

  useEffect(() => {
    if (window.chirmo) {
      window.chirmo.getProjects().then(setProjects).catch(() => {})
      window.chirmo.getTasks().then(setTasks).catch(() => {})
      window.chirmo.getHistory().then(setHistory).catch(() => {})
    }
    SearchEngineService.fetchLiveTechRadar().then(setRadarItems).catch(() => {})
    syncWorkspaceState()

    const onWsUpdate = (): void => syncWorkspaceState()
    window.addEventListener('chirmo:workspace-updated', onWsUpdate)
    return () => window.removeEventListener('chirmo:workspace-updated', onWsUpdate)
  }, [])

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setQuery(initialQuery)
      handleExecuteSearch(initialQuery)
    }
  }, [initialQuery])

  // Close autocomplete dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        searchBoxContainerRef.current &&
        !searchBoxContainerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced live autocomplete suggestions from Wikipedia Opensearch
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setSuggestions([])
      return
    }
    const timer = setTimeout(() => {
      SearchEngineService.fetchAutocompleteSuggestions(trimmed).then((list) => {
        setSuggestions(list)
      })
    }, 220)
    return () => clearTimeout(timer)
  }, [query])

  // Pomodoro countdown effect
  useEffect(() => {
    if (!pomoRunning) return
    const interval = setInterval(() => {
      setPomoSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [pomoRunning])

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const showToast = (msg: string): void => {
    setKanbanToast(msg)
    setTimeout(() => setKanbanToast(null), 2800)
  }

  const handleToggleVoiceSearch = (): void => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      showToast('Tarayıcınız sesli komutu desteklemiyor, örnek sorgu aktarıldı.')
      setQuery('Yapay Zeka')
      handleExecuteSearch('Yapay Zeka')
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'tr-TR'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      setIsListening(true)
      recognition.start()

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript
        setIsListening(false)
        if (transcript) {
          setQuery(transcript)
          handleExecuteSearch(transcript)
        }
      }

      recognition.onerror = () => {
        setIsListening(false)
        showToast('Mikrofon izni kapalıysa metin yazarak arayabilirsiniz.')
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    } catch {
      setIsListening(false)
    }
  }

  const handleSpeakText = (text: string): void => {
    if (!('speechSynthesis' in window)) {
      showToast('Sesli okuma bu cihazda desteklenmiyor.')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'tr-TR'
    utterance.rate = 1.02
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const updateWidgets = (next: WidgetId[]): void => {
    setActiveWidgets(next)
    try {
      localStorage.setItem('chirmo_home_widgets_v2', JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  const toggleWidget = (id: WidgetId): void => {
    if (activeWidgets.includes(id)) {
      updateWidgets(activeWidgets.filter((w) => w !== id))
    } else {
      updateWidgets([...activeWidgets, id])
    }
  }

  const updateKanban = (next: KanbanCard[]): void => {
    setKanbanCards(next)
    try {
      localStorage.setItem('chirmo_kanban_cards', JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  const handleAddKanbanCard = (col: 'todo' | 'doing' | 'done'): void => {
    if (!newKanbanTitle.trim()) return
    const card: KanbanCard = {
      id: `kb_${Date.now()}`,
      title: newKanbanTitle.trim(),
      tag: col === 'todo' ? 'Yeni' : col === 'doing' ? 'Aktif' : 'Bitti',
      column: col
    }
    updateKanban([...kanbanCards, card])
    setNewKanbanTitle('')
    setAddingToCol(null)
  }

  const moveKanbanCard = (id: string, targetCol: 'todo' | 'doing' | 'done'): void => {
    updateKanban(kanbanCards.map((c) => (c.id === id ? { ...c, column: targetCol } : c)))
  }

  const deleteKanbanCard = (id: string): void => {
    updateKanban(kanbanCards.filter((c) => c.id !== id))
  }

  const handleDecomposeGoalToKanban = (goalText: string): void => {
    const targetGoal = goalText.trim() || 'Yeni Proje Hedefi'
    const generated = SearchEngineService.decomposeGoalToKanban(targetGoal)
    const newCards: KanbanCard[] = generated.map((g, idx) => ({
      id: `kb_auto_${Date.now()}_${idx}`,
      title: g.title,
      tag: g.tag,
      column: g.column
    }))
    updateKanban([...newCards, ...kanbanCards])
    if (!activeWidgets.includes('kanban')) {
      updateWidgets([...activeWidgets, 'kanban'])
    }
    showToast(`"${targetGoal}" için 4 görev otomatik olarak Kanban panosuna eklendi!`)
  }

  const addSearchToKanban = (title: string): void => {
    const card: KanbanCard = {
      id: `kb_${Date.now()}`,
      title,
      tag: 'Arama',
      column: 'todo'
    }
    updateKanban([card, ...kanbanCards])
    if (!activeWidgets.includes('kanban')) {
      updateWidgets([...activeWidgets, 'kanban'])
    }
    showToast('Görev Kanban "Yapılacaklar" sütununa eklendi.')
  }

  const handleDownloadNote = (): void => {
    if (!noteText.trim()) return
    const blob = new Blob([noteText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chirmo-not-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleAddShortcut = (e: React.FormEvent): void => {
    e.preventDefault()
    if (!newSiteTitle.trim() || !newSiteUrl.trim()) return
    const formattedUrl = newSiteUrl.startsWith('http')
      ? newSiteUrl.trim()
      : `https://${newSiteUrl.trim()}`
    const next = [
      ...shortcuts,
      { id: `s_${Date.now()}`, title: newSiteTitle.trim(), url: formattedUrl }
    ]
    setShortcuts(next)
    try {
      localStorage.setItem('chirmo_shortcuts', JSON.stringify(next))
    } catch {
      // ignore
    }
    setNewSiteTitle('')
    setNewSiteUrl('')
    setShowAddShortcut(false)
  }

  const removeShortcut = (id: string): void => {
    const next = shortcuts.filter((s) => s.id !== id)
    setShortcuts(next)
    try {
      localStorage.setItem('chirmo_shortcuts', JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  const livePreview = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return undefined
    return SearchEngineService.detectInstantAnswer(query.trim())
  }, [query])

  const calcWidgetOutput = useMemo(() => {
    return SearchEngineService.detectInstantAnswer(calcInput)
  }, [calcInput])

  const kanbanProgress = useMemo(() => {
    if (kanbanCards.length === 0) return 0
    const doneCount = kanbanCards.filter((c) => c.column === 'done').length
    return Math.round((doneCount / kanbanCards.length) * 100)
  }, [kanbanCards])

  const handleExecuteSearch = async (searchQuery: string): Promise<void> => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    setShowDropdown(false)
    setIsSearching(true)
    setCategoryFilter('all')
    setVisibleResultsCount(8)
    WorkspaceStorage.addSearchHistory(trimmed, 'all')

    try {
      const response = await SearchEngineService.search(trimmed, 'all', {
        projects,
        tasks,
        history
      })
      setSearchResponse(response)
      setResultTab('all')
      setIsCurrentSearchSaved(WorkspaceStorage.isSearchSaved(trimmed))
      setRecentHistory(WorkspaceStorage.getSearchHistory())
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    handleExecuteSearch(query)
  }

  const handleSaveCurrentSearch = (): void => {
    if (!searchResponse) return
    WorkspaceStorage.saveSearch({
      query: searchResponse.query,
      category: categoryFilter,
      resultCount: searchResponse.webResults.length,
      summarySnippet: searchResponse.aiSynthesis.summary.slice(0, 180)
    })
    setIsCurrentSearchSaved(true)
    showToast(`"${searchResponse.query}" araması Çalışma Alanına kaydedildi.`)
  }

  const handleToggleFavoriteResult = (item: SearchResponse['webResults'][0]): void => {
    if (favoritedUrls.has(item.url)) {
      WorkspaceStorage.removeFavoriteSource(item.url)
      showToast('Kaynak favorilerden çıkarıldı.')
    } else {
      WorkspaceStorage.saveFavoriteSource({
        title: item.title,
        url: item.url,
        domain: item.domain,
        snippet: item.snippet,
        category: item.category || 'web',
        publishedDate: item.publishedDate
      })
      showToast('Kaynak Favori Kaynaklarınıza kaydedildi.')
    }
    syncWorkspaceState()
  }

  const filteredWebResults = useMemo(() => {
    if (!searchResponse) return []
    if (categoryFilter === 'all') return searchResponse.webResults
    return searchResponse.webResults.filter((r) => (r.category || 'web') === categoryFilter)
  }, [searchResponse, categoryFilter])

  const paginatedWebResults = useMemo(() => {
    return filteredWebResults.slice(0, visibleResultsCount)
  }, [filteredWebResults, visibleResultsCount])

  const formatPomo = (sec: number): string => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const availableWidgets: { id: WidgetId; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'shortcuts',
      label: 'Hızlı Kısayollar',
      desc: 'Sık kullandığınız doğrulanmış kaynaklar',
      icon: <Globe className="w-4 h-4 text-chirmo-brand" />
    },
    {
      id: 'kanban',
      label: 'Kanban Proje Panosu',
      desc: 'Yapılacaklar, Devam Eden ve Biten işler',
      icon: <Kanban className="w-4 h-4 text-emerald-600" />
    },
    {
      id: 'radar',
      label: 'Küresel Teknoloji & Gündem Akışı',
      desc: 'Dünya genelinde öne çıkan canlı başlıklar',
      icon: <Radio className="w-4 h-4 text-chirmo-brand" />
    },
    {
      id: 'notes',
      label: 'Hızlı Not Defteri',
      desc: 'Anlık fikirler ve indirilebilir notlar',
      icon: <StickyNote className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'calculator',
      label: 'Hesap, KDV, VKİ & Döviz Kutusu',
      desc: 'Anında matematik, vergi ve canlı kur çevirici',
      icon: <Calculator className="w-4 h-4 text-rose-500" />
    },
    {
      id: 'pomodoro',
      label: 'Odak Kronometresi',
      desc: '25 dakikalık çalışma sayacı',
      icon: <Timer className="w-4 h-4 text-teal-600" />
    }
  ]

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white text-slate-900 select-none flex flex-col relative">
      {/* TOAST NOTIFICATION */}
      {kanbanToast && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{kanbanToast}</span>
        </div>
      )}

      {/* TOP BAR */}
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          {searchResponse ? (
            <button
              onClick={() => {
                setSearchResponse(null)
                setQuery('')
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ChirmoLogo size="sm" />
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-chirmo-brand" />
              <span>Chirmo AI Keşif ve Araştırma Platformu</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWidgetPicker(!showWidgetPicker)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showWidgetPicker
                ? 'bg-chirmo-brand text-white border-chirmo-brand shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Çalışma Panosu Modülleri ({activeWidgets.length})</span>
          </button>
        </div>
      </div>

      {/* WIDGET CUSTOMIZER DRAWER */}
      {showWidgetPicker && (
        <div className="w-full bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-4 animate-fadeIn">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700">
                Ana Sayfa Çalışma Alanı Modüllerini Özelleştirin
              </span>
              <button
                onClick={() => setShowWidgetPicker(false)}
                className="text-xs font-semibold text-chirmo-brand hover:underline"
              >
                Kapat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {availableWidgets.map((w) => {
                const isAdded = activeWidgets.includes(w.id)
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWidget(w.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between ${
                      isAdded
                        ? 'bg-white border-chirmo-brand ring-2 ring-chirmo-brand/10 shadow-xs'
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
                        isAdded ? 'bg-chirmo-brand text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-24 md:pb-12 flex flex-col">
        {/* ==================== 1. SEARCH HERO & AUTOCOMPLETE ==================== */}
        <div
          className={`w-full flex flex-col items-center transition-all ${
            searchResponse ? 'pt-4 pb-5' : 'pt-7 sm:pt-12 pb-7'
          }`}
        >
          {!searchResponse && (
            <div className="mb-5 text-center">
              <ChirmoLogo size="xl" />
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2">
                Aradığını yalnızca bulma. Anla, keşfet, karşılaştır ve karar ver.
              </p>
            </div>
          )}

          {/* Search Bar Container with Instant Suggestions & History Dropdown */}
          <div ref={searchBoxContainerRef} className="w-full max-w-2xl relative">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative flex items-center w-full bg-white rounded-2xl border border-slate-300 hover:border-slate-400 focus-within:border-chirmo-brand focus-within:ring-4 focus-within:ring-chirmo-brand/10 shadow-xs transition-all px-4 sm:px-5 py-2.5 sm:py-3">
                <Search className="w-5 h-5 text-chirmo-brand shrink-0 mr-3" />

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  placeholder="Web'de arayın, yapay zekâya sorun, iki seçeneği karşılaştırın veya hesaplayın..."
                  className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none select-text"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      setSearchResponse(null)
                      inputRef.current?.focus()
                    }}
                    aria-label="Aramayı temizle"
                    className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                    title="Temizle"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleToggleVoiceSearch}
                  aria-label="Sesli Arama"
                  className={`p-2 rounded-full mr-1.5 transition-colors ${
                    isListening
                      ? 'bg-rose-100 text-rose-600 animate-pulse'
                      : 'hover:bg-slate-100 text-slate-500 hover:text-chirmo-brand'
                  }`}
                  title="Sesli Arama"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="submit"
                  disabled={isSearching || !query.trim()}
                  className="px-5 py-2 rounded-xl bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs sm:text-sm font-semibold transition-colors disabled:opacity-40 shrink-0 shadow-xs"
                >
                  {isSearching ? 'Aranıyor...' : 'Ara'}
                </button>
              </div>
            </form>

            {/* Instant Autocomplete & Search History Dropdown */}
            {showDropdown && (suggestions.length > 0 || recentHistory.length > 0) && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-40 overflow-hidden py-2">
                {suggestions.length > 0 && (
                  <div className="px-3 py-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-chirmo-brand px-2 block mb-1">
                      Anlık Arama Önerileri
                    </span>
                    {suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => {
                          setQuery(sug)
                          handleExecuteSearch(sug)
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-chirmo-brand-light/50 flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium transition-colors"
                      >
                        <Search className="w-3.5 h-3.5 text-chirmo-brand shrink-0" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                )}

                {recentHistory.length > 0 && (
                  <div className="px-3 py-1.5 border-t border-slate-100">
                    <div className="flex items-center justify-between px-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Son Aramalarınız
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          WorkspaceStorage.clearSearchHistory()
                          setRecentHistory([])
                        }}
                        className="text-[10px] text-slate-400 hover:text-rose-600"
                      >
                        Temizle
                      </button>
                    </div>
                    {recentHistory.slice(0, 4).map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between rounded-xl hover:bg-slate-50 px-3 py-1.5"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setQuery(h.query)
                            handleExecuteSearch(h.query)
                          }}
                          className="flex items-center gap-2.5 text-xs text-slate-700 font-medium flex-1 text-left"
                        >
                          <History className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{h.query}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            WorkspaceStorage.removeSearchHistoryItem(h.id)
                            setRecentHistory(WorkspaceStorage.getSearchHistory())
                          }}
                          className="p-1 text-slate-300 hover:text-rose-500"
                          title="Geçmişten kaldır"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Instant Calculator/Unit Answer Pill right under input while typing */}
            {livePreview && !searchResponse && (
              <div
                onClick={() => handleExecuteSearch(query)}
                className="mt-2 mx-2 px-4 py-2.5 rounded-2xl bg-chirmo-brand-light/70 border border-chirmo-brand/25 flex items-center justify-between cursor-pointer hover:bg-chirmo-brand-light transition-colors"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-chirmo-brand">{livePreview.title}:</span>
                  <span className="font-black text-slate-900 text-sm">{livePreview.result}</span>
                </div>
                <span className="text-[11px] font-semibold text-chirmo-brand flex items-center gap-1">
                  Detay <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            )}

            {/* Suggested Searches & Platform Mode Shortcuts Below Search Bar */}
            {!searchResponse && (
              <div className="mt-4 space-y-3">
                {/* Suggested Queries */}
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">
                    Önerilen Aramalar:
                  </span>
                  {SUGGESTED_DISCOVERY_QUERIES.map((sq) => (
                    <button
                      key={sq}
                      type="button"
                      onClick={() => {
                        setQuery(sq)
                        handleExecuteSearch(sq)
                      }}
                      className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-chirmo-brand-light border border-slate-200 hover:border-chirmo-brand/30 text-[11px] font-medium text-slate-600 hover:text-chirmo-brand transition-colors"
                    >
                      {sq}
                    </button>
                  ))}
                </div>

                {/* Quick Feature Entry Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {onNavigateToDiscover && (
                    <button
                      type="button"
                      onClick={onNavigateToDiscover}
                      className="px-3.5 py-2 rounded-xl bg-chirmo-brand-light hover:bg-chirmo-brand text-chirmo-brand hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Keşif Merkezi (Discover)</span>
                    </button>
                  )}

                  {onNavigateToVisual && (
                    <button
                      type="button"
                      onClick={() => onNavigateToVisual(query.trim())}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-chirmo-brand" />
                      <span>Görsel Keşif</span>
                    </button>
                  )}

                  {onNavigateToCompare && (
                    <button
                      type="button"
                      onClick={() => onNavigateToCompare('Elektrikli otomobil', 'Hibrit otomobil')}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Scale className="w-3.5 h-3.5 text-chirmo-brand" />
                      <span>Akıllı Karşılaştırma</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onNavigateToAgents(
                        query.trim() ||
                          'Elektrikli araçların 2026 yılındaki fiyatlarını, menzillerini ve avantajlarını karşılaştır.'
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-chirmo-brand" />
                    <span>Derin Araştırma (Research)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== 2. SEARCH RESULTS & AI ANSWER ENGINE VIEW ==================== */}
        {searchResponse ? (
          <div className="w-full max-w-4xl mx-auto space-y-5 animate-fadeIn">
            {/* Typo Tolerance ("Bunu mu demek istediniz?") Banner */}
            {searchResponse.didYouMean && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Yazım önerisi — Bunu mu demek istediniz:{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(searchResponse.didYouMean!)
                        handleExecuteSearch(searchResponse.didYouMean!)
                      }}
                      className="font-bold text-chirmo-brand underline hover:text-chirmo-brand-hover"
                    >
                      {searchResponse.didYouMean}
                    </button>
                  </span>
                </div>
              </div>
            )}

            {/* Top Result Mode Tabs + Action Controls */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2 gap-2 text-xs">
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setResultTab('all')}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    resultTab === 'all'
                      ? 'border-chirmo-brand text-chirmo-brand'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tümü & AI Yanıt ({searchResponse.webResults.length})
                </button>

                <button
                  onClick={() => setResultTab('ai')}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                    resultTab === 'ai'
                      ? 'border-chirmo-brand text-chirmo-brand'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Çoklu Perspektif Analizi</span>
                </button>

                {onNavigateToVisual && (
                  <button
                    onClick={() => onNavigateToVisual(searchResponse.query)}
                    className="pb-2 -mb-2.5 font-semibold border-b-2 border-transparent text-slate-500 hover:text-chirmo-brand transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Görsellerde Keşfet</span>
                  </button>
                )}

                {onNavigateToCompare && (
                  <button
                    onClick={() => {
                      const dm = searchResponse.decisionMatrix
                      if (dm) {
                        onNavigateToCompare(dm.optionA, dm.optionB)
                      } else {
                        onNavigateToCompare(searchResponse.query, 'Alternatif')
                      }
                    }}
                    className="pb-2 -mb-2.5 font-semibold border-b-2 border-transparent text-slate-500 hover:text-chirmo-brand transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Karşılaştır</span>
                  </button>
                )}

                <button
                  onClick={() => setResultTab('temporal')}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                    resultTab === 'temporal'
                      ? 'border-chirmo-brand text-chirmo-brand'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Zaman Evrimi</span>
                </button>

                <button
                  onClick={() => setResultTab('xray')}
                  className={`pb-2 -mb-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                    resultTab === 'xray'
                      ? 'border-chirmo-brand text-chirmo-brand'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Kaynak X-Ray</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSaveCurrentSearch}
                  disabled={isCurrentSearchSaved}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors border ${
                    isCurrentSearchSaved
                      ? 'bg-chirmo-brand-light text-chirmo-brand border-chirmo-brand/30'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {isCurrentSearchSaved ? (
                    <>
                      <Check className="w-3 h-3" /> Arama Kayıtlı
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3 h-3 text-chirmo-brand" /> Aramayı Kaydet
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSpeakText(searchResponse.aiSynthesis.summary)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors ${
                    isSpeaking
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="Özeti Sesli Dinle"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
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

            {/* A. INSTANT CALCULATOR / CONVERTER CARD */}
            {searchResponse.instantAnswer &&
              searchResponse.instantAnswer.type !== 'knowledge' &&
              resultTab === 'all' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-chirmo-brand block mb-1">
                      {searchResponse.instantAnswer.badge || 'Anlık Hesaplama'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {searchResponse.instantAnswer.title}
                    </h3>
                    <div className="text-xl font-black text-chirmo-brand mb-2">
                      {searchResponse.instantAnswer.result}
                    </div>
                    {searchResponse.instantAnswer.details && (
                      <p className="text-xs text-slate-600 leading-relaxed select-text">
                        {searchResponse.instantAnswer.details}
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* B. AI SEARCH ANSWER ENGINE — VISUAL SEPARATION OF AI SYNTHESIS VS DIRECT SOURCE EVIDENCE */}
            {resultTab === 'all' && (
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                {/* Top Header Bar */}
                <div className="px-4 sm:px-5 py-3 bg-chirmo-brand-light/50 border-b border-chirmo-brand/15 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-chirmo-brand text-white text-[11px] font-bold">
                      <Sparkles className="w-3 h-3" />
                      AI SEARCH — CEVAP VE KAYNAK SENTEZİ
                    </span>
                    {searchResponse.aiSynthesis.intentLabel && (
                      <span className="text-[11px] font-semibold text-slate-600">
                        Amaç: {searchResponse.aiSynthesis.intentLabel}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-500">
                    {searchResponse.aiSynthesis.sources.length} Kaynak İncelendi •{' '}
                    {searchResponse.executionTimeMs} ms
                  </span>
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  {/* Uncertainty Warning when no verified primary source is found */}
                  {searchResponse.aiSynthesis.uncertaintyWarning && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Doğrulanmış Birincil Kaynak Uyarısı: </span>
                        {searchResponse.aiSynthesis.uncertaintyWarning}
                      </div>
                    </div>
                  )}

                  {/* LAYER 1: AI Generated Synthesis (Visually Distinct) */}
                  <div className="p-4 rounded-xl bg-chirmo-brand-light/25 border border-chirmo-brand/20">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-chirmo-brand flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Tarafından Oluşturulan Sentez Özeti
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Kaynaklara Dayalı Özetleme
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed select-text">
                      {searchResponse.aiSynthesis.summary}
                    </p>
                  </div>

                  {/* LAYER 2: Direct Quotes / Facts Extracted from Primary Sources (Visually Distinct) */}
                  {searchResponse.aiSynthesis.directSourceQuotes &&
                    searchResponse.aiSynthesis.directSourceQuotes.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                          <Quote className="w-3.5 h-3.5" />
                          Doğrudan Birincil Kaynaklardan Alınan Kanıtlar ({
                            searchResponse.aiSynthesis.directSourceQuotes.length
                          })
                        </span>

                        <div className="grid grid-cols-1 gap-2.5">
                          {searchResponse.aiSynthesis.directSourceQuotes.map((q) => (
                            <div
                              key={q.id}
                              className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/80 flex flex-col justify-between gap-2"
                            >
                              <p className="text-xs text-slate-800 leading-relaxed select-text">
                                <span className="inline-block font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded mr-1.5 text-[11px]">
                                  [{q.id}]
                                </span>
                                {q.text}
                              </p>
                              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-emerald-100">
                                <span className="font-semibold text-emerald-800">
                                  Kaynak: {q.sourceTitle}{' '}
                                  {q.publishedDate ? `(${q.publishedDate})` : ''}
                                </span>
                                <a
                                  href={q.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-semibold text-chirmo-brand hover:underline"
                                >
                                  {q.domain} <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Source Links Strip */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Cevabın Dayandığı Kaynak Bağlantıları
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {searchResponse.aiSynthesis.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-chirmo-brand-light border border-slate-200 hover:border-chirmo-brand/30 text-xs font-medium text-slate-700 hover:text-chirmo-brand transition-colors"
                        >
                          <span className="w-4 h-4 rounded-full bg-chirmo-brand text-white text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="truncate max-w-[200px]">{src.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Related Follow-up Questions */}
                  {searchResponse.relatedQuestions.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        İlgili Devam Soruları
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {searchResponse.relatedQuestions.map((rq, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setQuery(rq)
                              handleExecuteSearch(rq)
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-chirmo-brand hover:text-white border border-slate-200 text-xs font-medium text-slate-700 transition-colors"
                          >
                            <span>{rq}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* C. MULTI-PERSPECTIVE TAB */}
            {resultTab === 'ai' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-chirmo-brand-light/30 border border-chirmo-brand/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-chirmo-brand flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Çok Boyutlu Bakış Açısı Lensi</span>
                  </span>

                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {(
                      [
                        { id: 'ceo', label: '🎯 Yönetici' },
                        { id: 'engineer', label: '🔬 Uzman & Teknik' },
                        { id: 'critic', label: '⚠️ Risk Analizi' },
                        { id: 'eli5', label: '👶 Yalın Anlatım' }
                      ] as const
                    ).map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setActiveLens(l.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                          activeLens === l.id
                            ? 'bg-chirmo-brand text-white shadow-2xs'
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
                      <span className="text-chirmo-brand font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* D. TEMPORAL EVOLUTION TAB */}
            {resultTab === 'temporal' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-chirmo-brand" />
                      <span>Zaman Evrimi: "{searchResponse.query}"</span>
                    </h3>
                  </div>

                  <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
                    {(
                      [
                        { id: 'past', label: '⏪ Geçmiş' },
                        { id: 'present', label: '📍 Bugün' },
                        { id: 'future2036', label: '⏩ Gelecek Vizyonu' }
                      ] as const
                    ).map((e) => (
                      <button
                        key={e.id}
                        onClick={() => setActiveEra(e.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          activeEra === e.id
                            ? 'bg-chirmo-brand text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {e.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <span className="text-xs font-extrabold text-chirmo-brand uppercase">
                    {searchResponse.aiSynthesis.temporal[activeEra].era}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {searchResponse.aiSynthesis.temporal[activeEra].title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed select-text">
                    {searchResponse.aiSynthesis.temporal[activeEra].summary}
                  </p>
                </div>
              </div>
            )}

            {/* E. FACT-CHECK & SOURCE X-RAY TAB */}
            {resultTab === 'xray' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Kaynak Çeşitliliği ve Doğrulama X-Ray Analizi</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block mb-1">Birincil Kaynak Durumu</span>
                    <span className="text-sm font-bold text-slate-900">
                      {searchResponse.aiSynthesis.hasVerifiedPrimarySources
                        ? 'Doğrulanmış Açık Kaynak Mevcut ✓'
                        : 'Sınırlı Kaynak — Dikkatli İnceleme Önerilir'}
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
                  <b>⚠️ Kör Nokta Uyarısı:</b>{' '}
                  {searchResponse.aiSynthesis.factCheck.blindSpotWarning}
                </div>
              </div>
            )}

            {/* F. CATEGORIZED WEB RESULTS WITH SOURCE METADATA, FAVORITE & PAGINATION */}
            {resultTab === 'all' && (
              <div className="space-y-4 pt-1">
                {/* Category Filter Pills */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {(
                      [
                        { id: 'all', label: `Tüm Sonuçlar (${searchResponse.webResults.length})` },
                        {
                          id: 'web',
                          label: `Web & Ansiklopedi (${
                            searchResponse.webResults.filter((r) => (r.category || 'web') === 'web')
                              .length
                          })`
                        },
                        {
                          id: 'academic',
                          label: `Akademik (${
                            searchResponse.webResults.filter((r) => r.category === 'academic')
                              .length
                          })`
                        },
                        {
                          id: 'code',
                          label: `Açık Kaynak Kod (${
                            searchResponse.webResults.filter((r) => r.category === 'code').length
                          })`
                        },
                        {
                          id: 'discussion',
                          label: `Topluluk & Gündem (${
                            searchResponse.webResults.filter((r) => r.category === 'discussion')
                              .length
                          })`
                        }
                      ] as const
                    ).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategoryFilter(cat.id)
                          setVisibleResultsCount(8)
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                          categoryFilter === cat.id
                            ? 'bg-chirmo-brand text-white border-chirmo-brand'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result Cards */}
                {paginatedWebResults.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                    <p className="text-sm font-semibold text-slate-700">
                      Bu kategoride eşleşen sonuç bulunamadı
                    </p>
                    <p className="text-xs text-slate-500">
                      "Tüm Sonuçlar" sekmesine geçebilir veya arama teriminizi genişletebilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedWebResults.map((item) => {
                      const isFav = favoritedUrls.has(item.url)
                      return (
                        <div
                          key={item.id}
                          className="group p-4 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-chirmo-brand/40 transition-all shadow-2xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-semibold text-slate-700">{item.domain}</span>
                              {item.badge && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-chirmo-brand-light text-chirmo-brand font-semibold">
                                  {item.badge}
                                </span>
                              )}
                              {item.publishedDate && (
                                <span className="text-[11px] text-slate-400">
                                  • Tarih: {item.publishedDate}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleFavoriteResult(item)}
                                className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
                                  isFav
                                    ? 'bg-chirmo-brand-light text-chirmo-brand'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                }`}
                              >
                                <Bookmark className="w-3 h-3" />
                                {isFav ? 'Favoride' : 'Kaydet'}
                              </button>

                              <button
                                type="button"
                                onClick={() => addSearchToKanban(item.title)}
                                className="text-[11px] text-emerald-700 hover:underline font-semibold"
                              >
                                + Kanban
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  onNavigateToAgents(`Şu kaynağı analiz et: ${item.url}`)
                                }
                                className="text-[11px] text-slate-500 hover:text-chirmo-brand font-medium"
                              >
                                Derin Analiz
                              </button>

                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-chirmo-brand hover:underline flex items-center gap-1"
                              >
                                <span>Kaynağa Git</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm sm:text-base font-bold text-slate-900 group-hover:text-chirmo-brand transition-colors mb-1"
                          >
                            {item.title}
                          </a>

                          <p className="text-xs text-slate-600 leading-relaxed select-text">
                            {item.snippet}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Pagination / Load More Button */}
                {filteredWebResults.length > visibleResultsCount && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleResultsCount((prev) => prev + 8)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-chirmo-brand hover:text-white text-xs font-semibold text-slate-700 transition-colors"
                    >
                      Daha Fazla Sonuç Yükle ({filteredWebResults.length - visibleResultsCount}{' '}
                      kaldı)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ==================== 3. MODULAR WORKSPACE & KANBAN ==================== */
          <div className="w-full space-y-6 mt-2">
            {/* MODULE 1: QUICK SHORTCUTS */}
            {activeWidgets.includes('shortcuts') && (
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-chirmo-brand" />
                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Hızlı Kısayollar
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAddShortcut(!showAddShortcut)}
                      className="text-xs font-semibold text-chirmo-brand hover:underline flex items-center gap-1"
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
                  <form
                    onSubmit={handleAddShortcut}
                    className="mb-3 flex flex-wrap gap-2 bg-white p-3 rounded-xl border border-slate-200"
                  >
                    <input
                      type="text"
                      value={newSiteTitle}
                      onChange={(e) => setNewSiteTitle(e.target.value)}
                      placeholder="Site adı (Örn: GitHub)"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs flex-1 min-w-[120px] outline-none focus:border-chirmo-brand"
                    />
                    <input
                      type="text"
                      value={newSiteUrl}
                      onChange={(e) => setNewSiteUrl(e.target.value)}
                      placeholder="Adres (Örn: github.com)"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs flex-1 min-w-[160px] outline-none focus:border-chirmo-brand"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-chirmo-brand text-white text-xs font-semibold"
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
                      className="group relative bg-white hover:bg-chirmo-brand-light/40 rounded-xl border border-slate-200/90 hover:border-chirmo-brand p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-2xs"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeShortcut(site.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 p-0.5 text-slate-400 hover:text-rose-500 transition-opacity"
                        title="Kısayolu sil"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="w-8 h-8 rounded-full bg-chirmo-brand-light text-chirmo-brand font-bold text-xs flex items-center justify-center mb-1.5">
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

            {/* MODULE 2: INTERACTIVE KANBAN BOARD */}
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
                      <span className="text-[10px] font-bold text-slate-600">
                        %{kanbanProgress} Bitti
                      </span>
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
                      { id: 'doing', title: 'Devam Eden', dot: 'bg-chirmo-brand' },
                      { id: 'done', title: 'Tamamlandı', dot: 'bg-emerald-500' }
                    ] as const
                  ).map((col) => {
                    const colCards = kanbanCards.filter((c) => c.column === col.id)
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
                              onClick={() =>
                                setAddingToCol(addingToCol === col.id ? null : col.id)
                              }
                              className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-chirmo-brand"
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
                                  if (e.key === 'Enter') handleAddKanbanCard(col.id)
                                }}
                                placeholder="Görev başlığı yazın..."
                                className="w-full text-xs bg-white px-2.5 py-1.5 rounded border border-slate-200 outline-none focus:border-chirmo-brand mb-1.5 select-text"
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
                                  className="px-2.5 py-1 rounded bg-chirmo-brand text-white text-[11px] font-semibold"
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
                                className="group p-2.5 rounded-lg bg-slate-50 hover:bg-chirmo-brand-light/20 border border-slate-200/80 transition-all flex items-start justify-between gap-2"
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
                                        moveKanbanCard(
                                          card.id,
                                          col.id === 'done' ? 'doing' : 'todo'
                                        )
                                      }
                                      className="p-1 rounded hover:bg-white text-slate-500 hover:text-chirmo-brand"
                                      title="Sola taşı"
                                    >
                                      <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {col.id !== 'done' && (
                                    <button
                                      onClick={() =>
                                        moveKanbanCard(
                                          card.id,
                                          col.id === 'todo' ? 'doing' : 'done'
                                        )
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
                          className="mt-3 w-full py-1.5 rounded-lg border border-dashed border-slate-200 hover:border-chirmo-brand text-[11px] font-medium text-slate-500 hover:text-chirmo-brand flex items-center justify-center gap-1 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Kart Ekle</span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* MODULE 3: LIVE GLOBAL TECH RADAR */}
            {activeWidgets.includes('radar') && (
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-chirmo-brand animate-pulse" />
                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Canlı Küresel Teknoloji & Gündem Akışı
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
                      className="p-3 rounded-xl bg-white hover:bg-chirmo-brand-light/30 border border-slate-200/90 hover:border-chirmo-brand cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-2">
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>🔥 {item.points} puan</span>
                        <span className="text-chirmo-brand font-semibold">Kaynağı Aç ➔</span>
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
                          setNoteText(e.target.value)
                          try {
                            localStorage.setItem('chirmo_quick_note', e.target.value)
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
                          <Calculator className="w-4 h-4 text-chirmo-brand" />
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
                        placeholder="Örn: 100 usd to try veya 1500 * 1.20"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-chirmo-brand mb-3 select-text"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Sonuç:</span>
                      <span className="text-sm font-black text-chirmo-brand">
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
                        {pomoRunning ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                        <span>{pomoRunning ? 'Duraklat' : 'Başlat'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setPomoRunning(false)
                          setPomoSeconds(25 * 60)
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
  )
}
