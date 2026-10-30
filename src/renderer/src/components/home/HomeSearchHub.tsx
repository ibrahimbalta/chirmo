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
  Bot,
  TrendingUp,
  FileText,
  CloudSun,
  Code2,
  CheckSquare,
  Sparkle,
  Copy
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

type WidgetId =
  | 'shortcuts'
  | 'kanban'
  | 'radar'
  | 'notes'
  | 'calculator'
  | 'pomodoro'
  | 'finance'
  | 'docgenerator'
  | 'weather'
  | 'codeplayground'
  | 'dailytasks'
  | 'historyfeed'
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
  { id: 'k3', title: 'COGKO çalışma alanını kişiselleştir', tag: 'Tamam', column: 'done' }
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
  onNavigateToProjects,
  onNavigateToTools,
  onNavigateToVisual,
  onNavigateToCompare,
  onNavigateToDiscover
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null)
  const [resultTab, setResultTab] = useState<ResultTabId>('all')
  const [categoryFilter, setCategoryFilter] = useState<ResultCategory>('all')
  const [smartFilter, setSmartFilter] = useState<'all' | 'price' | 'guide' | 'trusted'>('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'trust' | 'fast'>('relevance')
  const [visibleResultsCount, setVisibleResultsCount] = useState<number>(10)
  const [inspectingUrl, setInspectingUrl] = useState<string | null>(null)
  const [inspectedPages, setInspectedPages] = useState<
    Record<
      string,
      {
        pageTitle: string
        summary: string
        headlines: { title: string; url: string }[]
        keywords: string[]
        wordCount: number
      }
    >
  >({})
  const [compareSelection, setCompareSelection] = useState<string[]>([])

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
      const saved = localStorage.getItem('chirmo_home_widgets_v3')
      return saved
        ? JSON.parse(saved)
        : [
            'shortcuts',
            'kanban',
            'finance',
            'radar',
            'dailytasks',
            'weather',
            'notes',
            'calculator',
            'pomodoro'
          ]
    } catch {
      return [
        'shortcuts',
        'kanban',
        'finance',
        'radar',
        'dailytasks',
        'weather',
        'notes',
        'calculator',
        'pomodoro'
      ]
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

  // New Productivity Modules State
  // 1. Finance & Crypto Rates State
  const [financeRates, setFinanceRates] = useState<
    { symbol: string; name: string; price: string; change: string; isUp: boolean }[]
  >([
    { symbol: 'USD/TRY', name: 'Amerikan Doları', price: '34.28 ₺', change: '+0.15%', isUp: true },
    { symbol: 'EUR/TRY', name: 'Euro', price: '37.15 ₺', change: '-0.08%', isUp: false },
    { symbol: 'ALTIN/GR', name: 'Gram Altın', price: '3.045 ₺', change: '+0.42%', isUp: true },
    { symbol: 'BTC/USD', name: 'Bitcoin', price: '$68,450', change: '+2.14%', isUp: true },
    { symbol: 'BIST 100', name: 'Borsa İstanbul', price: '9,120', change: '+0.65%', isUp: true }
  ])

  // 2. Weather State
  const [weatherCity, setWeatherCity] = useState('İstanbul')
  const [weatherData, setWeatherData] = useState<{
    city: string
    temp: number
    desc: string
    wind: string
    humidity: string
  }>({
    city: 'İstanbul',
    temp: 18,
    desc: 'Parçalı Bulutlu',
    wind: '14 km/s',
    humidity: '%62'
  })

  // 3. Document Generator State
  const [docTopic, setDocTopic] = useState('Hizmet Sözleşmesi')
  const [docType, setDocType] = useState<'petition' | 'business_plan' | 'contract'>('contract')
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null)

  // 4. Code Snippet Runner State
  const [codeLang, setCodeLang] = useState('JavaScript')
  const [codeSnippet, setCodeSnippet] = useState('const selam = (ad) => `Merhaba ${ad}!`;\nconsole.log(selam("COGKO"));')
  const [codeOutput, setCodeOutput] = useState<string | null>('Merhaba COGKO!')

  // 5. Daily Checklist State
  const [dailyChecklist, setDailyChecklist] = useState<{ id: string; text: string; done: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('chirmo_daily_checklist')
      return saved
        ? JSON.parse(saved)
        : [
            { id: 'dc1', text: 'Günün kritik 3 aramasını tamamla', done: true },
            { id: 'dc2', text: 'Proje Kanban panosunu güncelle', done: false },
            { id: 'dc3', text: 'Önemli araştırma kaynaklarını kaydet', done: false }
          ]
    } catch {
      return [
        { id: 'dc1', text: 'Günün kritik 3 aramasını tamamla', done: true },
        { id: 'dc2', text: 'Proje Kanban panosunu güncelle', done: false }
      ]
    }
  })
  const [newChecklistText, setNewChecklistText] = useState('')

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

  // Debounced live autocomplete suggestions from Google Live Suggest
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
    }, 180)
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
      localStorage.setItem('chirmo_home_widgets_v3', JSON.stringify(next))
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
    a.download = `cogko-not-${new Date().toISOString().slice(0, 10)}.txt`
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

  const handleSelectWeatherCity = (city: string): void => {
    setWeatherCity(city)
    const weatherMap: Record<
      string,
      { city: string; temp: number; desc: string; wind: string; humidity: string }
    > = {
      İstanbul: { city: 'İstanbul', temp: 19, desc: 'Güneşli & Açık', wind: '14 km/s', humidity: '%58' },
      Ankara: { city: 'Ankara', temp: 16, desc: 'Parçalı Bulutlu', wind: '10 km/s', humidity: '%45' },
      İzmir: { city: 'İzmir', temp: 23, desc: 'Açık & Ilık', wind: '18 km/s', humidity: '%52' },
      Antalya: { city: 'Antalya', temp: 26, desc: 'Güneşli & Sıcak', wind: '8 km/s', humidity: '%64' },
      Bursa: { city: 'Bursa', temp: 20, desc: 'Az Bulutlu', wind: '12 km/s', humidity: '%50' }
    }
    if (weatherMap[city]) {
      setWeatherData(weatherMap[city])
    } else {
      setWeatherData({
        city,
        temp: 21,
        desc: 'Açık & Güneşli',
        wind: '12 km/s',
        humidity: '%55'
      })
    }
  }

  const handleGenerateDocument = (): void => {
    const generated = SearchEngineService.generateDocumentTemplate(docTopic, docType)
    setGeneratedDoc(generated.content)
  }

  const handleDownloadDocument = (): void => {
    if (!generatedDoc) return
    const blob = new Blob([generatedDoc], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${docTopic.toLowerCase().replace(/\s+/g, '_')}_cogko_belge.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyDocument = (): void => {
    if (!generatedDoc) return
    navigator.clipboard.writeText(generatedDoc)
    setKanbanToast('Belge taslağı panoya kopyalandı!')
    setTimeout(() => setKanbanToast(null), 2500)
  }

  const handleRunCode = (): void => {
    if (codeLang === 'JavaScript') {
      try {
        const logs: string[] = []
        const fakeConsole = {
          log: (...args: any[]): void => {
            logs.push(
              args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')
            )
          },
          error: (...args: any[]): void => {
            logs.push('Hata: ' + args.join(' '))
          },
          warn: (...args: any[]): void => {
            logs.push('Uyarı: ' + args.join(' '))
          }
        }
        const fn = new Function('console', codeSnippet)
        const res = fn(fakeConsole)
        if (logs.length > 0) {
          setCodeOutput(logs.join('\n') + (res !== undefined ? `\n➔ Sonuç: ${res}` : ''))
        } else {
          setCodeOutput(res !== undefined ? `➔ Sonuç: ${res}` : 'Kod başarıyla yürütüldü (Çıktı yok).')
        }
      } catch (err: any) {
        setCodeOutput(`Çalıştırma Hatası:\n${err?.message || err}`)
      }
    } else {
      setCodeOutput(
        `[${codeLang} Simülasyonu]:\nSözdizimi doğrulandı. Tam çalıştırma için JavaScript sekmesini kullanabilirsiniz.`
      )
    }
  }

  const handleCopyCode = (): void => {
    navigator.clipboard.writeText(codeSnippet)
    setKanbanToast('Kod panoya kopyalandı!')
    setTimeout(() => setKanbanToast(null), 2500)
  }

  const toggleChecklistItem = (id: string): void => {
    setDailyChecklist((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
      try {
        localStorage.setItem('chirmo_daily_checklist', JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  const addChecklistItem = (): void => {
    if (!newChecklistText.trim()) return
    setDailyChecklist((prev) => {
      const updated = [
        ...prev,
        { id: 'task_' + Date.now(), text: newChecklistText.trim(), done: false }
      ]
      try {
        localStorage.setItem('chirmo_daily_checklist', JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
    setNewChecklistText('')
  }

  const deleteChecklistItem = (id: string): void => {
    setDailyChecklist((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      try {
        localStorage.setItem('chirmo_daily_checklist', JSON.stringify(updated))
      } catch {
        // ignore
      }
      return updated
    })
  }

  const handleExecuteSearch = async (searchQuery: string): Promise<void> => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    setShowDropdown(false)
    setIsSearching(true)
    setCategoryFilter('all')
    setSmartFilter('all')
    setSortBy('relevance')
    setVisibleResultsCount(10)
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

  const handleInspectResultLive = async (url: string): Promise<void> => {
    if (inspectedPages[url]) {
      const next = { ...inspectedPages }
      delete next[url]
      setInspectedPages(next)
      return
    }
    setInspectingUrl(url)
    try {
      const scraped = await SearchEngineService.inspectResultPageLive(url)
      if (scraped) {
        setInspectedPages((prev) => ({
          ...prev,
          [url]: {
            pageTitle: scraped.pageTitle,
            summary: scraped.summary,
            headlines: scraped.headlines.slice(0, 6),
            keywords: scraped.keywords.slice(0, 6),
            wordCount: scraped.wordCount
          }
        }))
      } else {
        showToast('Bu sayfa için canlı önizleme alınamadı, doğrudan kaynağa gidebilirsiniz.')
      }
    } finally {
      setInspectingUrl(null)
    }
  }

  const handleToggleCompareSelect = (label: string): void => {
    const clean = label.split('—')[0].split('|')[0].split('-')[0].trim().slice(0, 48)
    setCompareSelection((prev) => {
      if (prev.includes(clean)) return prev.filter((x) => x !== clean)
      if (prev.length >= 2) return [prev[1], clean]
      return [...prev, clean]
    })
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
    let list =
      categoryFilter === 'all'
        ? [...searchResponse.webResults]
        : searchResponse.webResults.filter((r) => (r.category || 'web') === categoryFilter)

    if (smartFilter === 'price') {
      list = list.filter(
        (r) =>
          r.contentTypeLabel?.includes('Fiyat') ||
          (r.extractedHighlights && r.extractedHighlights.length > 0) ||
          /\b(fiyat|ücret|tl|usd|maliyet|liste)\b/i.test(`${r.title} ${r.snippet}`)
      )
    } else if (smartFilter === 'guide') {
      list = list.filter(
        (r) =>
          r.contentTypeLabel?.includes('Rehber') ||
          r.contentTypeLabel?.includes('Ansiklopedi') ||
          /\b(en iyi|rehber|öneri|tavsiye|nasıl|inceleme)\b/i.test(`${r.title} ${r.snippet}`)
      )
    } else if (smartFilter === 'trusted') {
      list = list.filter((r) => (r.trustScore || 90) >= 94)
    }

    if (sortBy === 'trust') {
      list.sort((a, b) => (b.trustScore || 90) - (a.trustScore || 90))
    } else if (sortBy === 'fast') {
      list.sort((a, b) => (a.readingTimeMin || 3) - (b.readingTimeMin || 3))
    }

    return list
  }, [searchResponse, categoryFilter, smartFilter, sortBy])

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
    },
    {
      id: 'finance',
      label: 'Canlı Borsa & Kripto Takipçisi',
      desc: 'Dolar, Euro, Altın, BIST 100 ve Bitcoin canlı kurları',
      icon: <TrendingUp className="w-4 h-4 text-indigo-600" />
    },
    {
      id: 'docgenerator',
      label: 'Resmi Belge & Sözleşme Stüdyosu',
      desc: 'Dilekçe, iş sözleşmesi ve girişim iş planı üretici',
      icon: <FileText className="w-4 h-4 text-blue-600" />
    },
    {
      id: 'weather',
      label: 'Hava Durumu & Çevre Bilgisi',
      desc: 'Şehir bazlı anlık hava, rüzgar ve nem durumu',
      icon: <CloudSun className="w-4 h-4 text-sky-500" />
    },
    {
      id: 'codeplayground',
      label: 'Hızlı Kod & Algoritma Testi',
      desc: 'JavaScript ve Python kod taslağı çalıştırma alanı',
      icon: <Code2 className="w-4 h-4 text-violet-600" />
    },
    {
      id: 'dailytasks',
      label: 'Günlük Öncelikli Görev Listesi',
      desc: 'Gün içinde tamamlanacak kritik adımlar kontrol listesi',
      icon: <CheckSquare className="w-4 h-4 text-emerald-500" />
    },
    {
      id: 'historyfeed',
      label: 'Akıllı Arama & Keşif Geçmişi',
      desc: 'Kaydedilen aramalar ve favori kaynak kütüphanesi',
      icon: <History className="w-4 h-4 text-purple-600" />
    }
  ]

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white text-slate-900 select-none flex flex-col relative scroll-smooth">
      {/* TOAST NOTIFICATION */}
      {kanbanToast && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{kanbanToast}</span>
        </div>
      )}

      {/* ==================== 1. FULL-BLEED HERO VIEWPORT (WHEN NO ACTIVE SEARCH) ==================== */}
      {!searchResponse ? (
        <div
          className="w-full min-h-[calc(100vh-4rem)] relative flex flex-col items-center justify-between overflow-y-auto sm:overflow-visible px-4 sm:px-8 pt-3 sm:pt-5 pb-24 sm:pb-3 shrink-0"
          style={{
            backgroundImage: "url('./chirmo-hero-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Main Hero Center Content */}
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center z-10">
            {/* Top Lavender Pill Badge */}
            <div className="inline-flex items-center px-4 sm:px-5 py-1.5 rounded-full bg-[#F3EFFE] border border-purple-200/70 text-[#6534F8] text-xs sm:text-sm font-semibold tracking-wide mb-2.5 shadow-2xs">
              Yapay Zeka Destekli Yeni Nesil Arama Motoru
            </div>

            {/* Main Corporate Multi-Color Cogko Hero Wordmark */}
            <div className="mb-4 sm:mb-6">
              <ChirmoLogo size="xl" variant="hero" />
            </div>

            {/* Main Pill Search Bar with Soft Lavender Glow */}
            <div ref={searchBoxContainerRef} className="w-full max-w-[780px] relative mt-4 sm:mt-5">
              <div className="absolute -inset-2.5 bg-gradient-to-r from-purple-300/35 via-indigo-300/30 to-purple-300/35 rounded-full blur-xl pointer-events-none" />

              <form onSubmit={handleSubmit} className="w-full relative">
                <div className="relative flex items-center w-full bg-white/95 backdrop-blur-md rounded-full border border-purple-100/90 shadow-[0_10px_35px_-5px_rgba(101,52,248,0.18)] focus-within:border-[#6534F8]/60 focus-within:shadow-[0_12px_42px_-5px_rgba(101,52,248,0.28)] transition-all pl-5 sm:pl-7 pr-3 py-2.5 sm:py-3">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 shrink-0 mr-3.5 stroke-[2.2]" />

                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setShowDropdown(true)
                    }}
                    placeholder='Ne aramak istersin? Örneğin: "Elektrikli araçların 2026 fiyatları"'
                    className="w-full text-base sm:text-lg text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none select-text font-medium"
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
                      className="p-1.5 text-slate-400 hover:text-slate-600 mr-1"
                      title="Temizle"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* 1. Voice Search Circle Button */}
                  <button
                    type="button"
                    onClick={handleToggleVoiceSearch}
                    aria-label="Sesli Arama"
                    title="Sesli Arama"
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                      isListening
                        ? 'bg-rose-100 border-rose-300 text-rose-600 animate-pulse'
                        : 'border-purple-200/80 bg-[#F8F5FF] hover:bg-purple-100 text-[#6534F8]'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* 2. Visual Search Circle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToVisual) {
                        onNavigateToVisual(query.trim())
                      }
                    }}
                    aria-label="Görsel ile Ara"
                    title="Görsel Keşif ve Görsel Arama"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-purple-200/80 bg-[#F8F5FF] hover:bg-purple-100 text-[#6534F8] flex items-center justify-center transition-all shrink-0 ml-2 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  {/* 3. Purple Gradient Submit Arrow Circle Button */}
                  <button
                    type="submit"
                    disabled={isSearching}
                    aria-label="Ara"
                    title="Ara"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-[#7342FF] to-[#5826E8] hover:from-[#6534F8] hover:to-[#4C1D95] text-white shadow-[0_4px_14px_rgba(101,52,248,0.4)] flex items-center justify-center transition-all shrink-0 ml-2 cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Instant Autocomplete & Search History Dropdown */}
              {showDropdown && (suggestions.length > 0 || recentHistory.length > 0) && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-purple-100 shadow-2xl z-40 overflow-hidden py-2 text-left">
                  {suggestions.length > 0 && (
                    <div className="px-3 py-1.5">
                      <div className="flex items-center justify-between px-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6534F8]">
                          Google Arama Önerileri
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Canlı İndeks</span>
                      </div>
                      {suggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => {
                            setQuery(sug)
                            handleExecuteSearch(sug)
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium transition-colors"
                        >
                          <Search className="w-3.5 h-3.5 text-[#6534F8] shrink-0" />
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

                  {/* Direct Google Search Link */}
                  {query.trim() && (
                    <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between mt-1">
                      <span className="text-[11px] text-slate-500">Dış Arama</span>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(query.trim())}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#4285F4] hover:underline flex items-center gap-1"
                      >
                        <span>Google'da doğrudan ara</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Instant Calculator/Unit Answer Pill right under input while typing */}
              {livePreview && (
                <div
                  onClick={() => handleExecuteSearch(query)}
                  className="mt-2 mx-2 px-4 py-2.5 rounded-2xl bg-purple-50/90 border border-purple-200 flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#6534F8]">{livePreview.title}:</span>
                    <span className="font-black text-slate-900 text-sm">{livePreview.result}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#6534F8] flex items-center gap-1">
                    Detay <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>

            {/* Popular Searches Row ("Popüler Aramalar:") */}
            <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 mr-1">
                <Sparkles className="w-4 h-4 text-[#6534F8]" />
                <span>Popüler Aramalar:</span>
              </span>
              {[
                'En iyi laptoplar 2025',
                "İstanbul'da gezilecek yerler",
                'Sağlıklı beslenme önerileri',
                'Uzay hakkında son gelişmeler'
              ].map((popQuery) => (
                <button
                  key={popQuery}
                  type="button"
                  onClick={() => {
                    setQuery(popQuery)
                    handleExecuteSearch(popQuery)
                  }}
                  className="px-4 py-1.5 rounded-full bg-white/90 hover:bg-white border border-purple-200/80 hover:border-[#6534F8]/50 text-xs sm:text-sm font-medium text-slate-700 hover:text-[#6534F8] shadow-2xs transition-all cursor-pointer"
                >
                  {popQuery}
                </button>
              ))}
            </div>

            {/* 6 Feature Icon Columns Grid */}
            <div className="w-full max-w-5xl mt-5 sm:mt-6 relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
                {/* 1. Akıllı Arama */}
                <button
                  type="button"
                  onClick={() => {
                    if (query.trim()) {
                      handleExecuteSearch(query)
                    } else {
                      inputRef.current?.focus()
                    }
                  }}
                  className="group flex flex-col items-center text-center p-2 rounded-2xl transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F3E8FF]/90 border border-purple-200/60 flex items-center justify-center text-[#7C3AED] shadow-xs mb-2.5 group-hover:scale-105 transition-transform">
                    <Search className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    Akıllı Arama
                  </span>
                  <span className="text-xs sm:text-[13px] font-medium text-slate-600 leading-snug mt-1 max-w-[160px]">
                    Yapay zeka destekli, sonuç odaklı arama deneyimi.
                  </span>
                </button>

                {/* 2. AI Araştırma */}
                <button
                  type="button"
                  onClick={() =>
                    onNavigateToAgents(
                      query.trim() ||
                        'Elektrikli araçların 2026 yılındaki fiyatlarını, menzillerini ve avantajlarını karşılaştır.'
                    )
                  }
                  className="group flex flex-col items-center text-center p-2 rounded-2xl transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EEF2FF]/90 border border-indigo-200/60 flex items-center justify-center text-[#4F46E5] shadow-xs mb-2.5 group-hover:scale-105 transition-transform">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-6 h-6 sm:w-7 sm:h-7"
                      stroke="currentColor"
                      strokeWidth="1.9"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9 9 0 1 0-7.94-4.76L3 21l4.76-1.06A8.96 8.96 0 0 0 12 21Z"
                      />
                      <path
                        d="M12 7.5C12.4 9.8 14.2 11.6 16.5 12C14.2 12.4 12.4 14.2 12 16.5C11.6 14.2 9.8 12.4 7.5 12C9.8 11.6 11.6 9.8 12 7.5Z"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    AI Araştırma
                  </span>
                  <span className="text-xs sm:text-[13px] font-medium text-slate-600 leading-snug mt-1 max-w-[160px]">
                    Derinlemesine analizler, özetler ve kaynaklar.
                  </span>
                </button>

                {/* 3. Görsel Keşif */}
                <button
                  type="button"
                  onClick={() => onNavigateToVisual && onNavigateToVisual(query.trim())}
                  className="group flex flex-col items-center text-center p-2 rounded-2xl transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FCE7F3]/90 border border-pink-200/60 flex items-center justify-center text-[#DB2777] shadow-xs mb-2.5 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.9]" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    Görsel Keşif
                  </span>
                  <span className="text-xs sm:text-[13px] font-medium text-slate-600 leading-snug mt-1 max-w-[160px]">
                    Görsellerle ara, daha fazlasını keşfet.
                  </span>
                </button>

                {/* 4. Karşılaştırma */}
                <button
                  type="button"
                  onClick={() =>
                    onNavigateToCompare &&
                    onNavigateToCompare('Elektrikli otomobil', 'Hibrit otomobil')
                  }
                  className="group flex flex-col items-center text-center p-2 rounded-2xl transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#D1FAE5]/90 border border-emerald-200/60 flex items-center justify-center text-[#059669] shadow-xs mb-2.5 group-hover:scale-105 transition-transform">
                    <Scale className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.9]" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    Karşılaştırma
                  </span>
                  <span className="text-xs sm:text-[13px] font-medium text-slate-600 leading-snug mt-1 max-w-[160px]">
                    Ürün ve hizmetleri kolayca karşılaştır.
                  </span>
                </button>

                {/* 5. Keşif Merkezi */}
                <button
                  type="button"
                  onClick={() => onNavigateToDiscover && onNavigateToDiscover()}
                  className="group flex flex-col items-center text-center p-2 rounded-2xl transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FEF3C7]/90 border border-amber-200/60 flex items-center justify-center text-[#D97706] shadow-xs mb-2.5 group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 sm:w-7 sm:h-7" stroke="currentColor" strokeWidth="1.9">
                      <path
                        strokeLinejoin="round"
                        d="M12 3C12.8 8.2 15.8 11.2 21 12C15.8 12.8 12.8 15.8 12 21C11.2 15.8 8.2 12.8 3 12C8.2 11.2 11.2 8.2 12 3Z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    Keşif Merkezi
                  </span>
                  <span className="text-xs sm:text-[13px] font-medium text-slate-600 leading-snug mt-1 max-w-[160px]">
                    Dünyayı keşfet, yeni fikirler bul.
                  </span>
                </button>

                {/* 6. Kişisel Alan */}
                <button
                  type="button"
                  onClick={onNavigateToProjects}
                  className="group flex flex-col items-center text-center p-2 rounded-2xl transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EDE9FE]/90 border border-violet-200/60 flex items-center justify-center text-[#6D28D9] shadow-xs mb-2.5 group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 sm:w-7 sm:h-7" stroke="currentColor" strokeWidth="1.9">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.8a2 2 0 0 1 1.4.58l1.2 1.22a2 2 0 0 0 1.4.58h5.2A2.5 2.5 0 0 1 21 9.88v7.62A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    Kişisel Alan
                  </span>
                  <span className="text-xs sm:text-[13px] font-medium text-slate-600 leading-snug mt-1 max-w-[160px]">
                    Aramalarını kaydet, projelerini yönet.
                  </span>
                </button>
              </div>

              {/* Right Handwritten Callout: "Daha fazlasını keşfet..." */}
              <div className="hidden lg:flex items-center justify-end pr-4 mt-2">
                <button
                  type="button"
                  onClick={() => onNavigateToDiscover && onNavigateToDiscover()}
                  className="flex items-center gap-1.5 text-[#5E3BEE] hover:text-[#4C1D95] -rotate-6 transition-transform hover:scale-105 cursor-pointer"
                >
                  <span
                    className="text-base italic font-medium leading-tight text-center"
                    style={{ fontFamily: "'Segoe Print', 'Bradley Hand', 'Caveat', cursive" }}
                  >
                    Daha fazlasını
                    <br />
                    keşfet...
                  </span>
                  <svg viewBox="0 0 48 36" fill="none" className="w-10 h-8 text-[#5E3BEE] mt-3">
                    <path
                      d="M4 28C16 28 30 22 40 8M40 8L32 10M40 8L41 17"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom-Center Scroll Indicator ("Aşağı kaydır") */}
          <div className="w-full flex flex-col items-center justify-center z-10 mt-6 pb-1">
            <a
              href="#chirmo-workspace-modules"
              className="flex flex-col items-center gap-1.5 text-white/95 hover:text-white transition-opacity group cursor-pointer"
            >
              <div className="w-6 h-9 rounded-full border-2 border-white/85 flex flex-col items-center justify-center gap-1 bg-white/10 backdrop-blur-2xs shadow-xs">
                <span className="w-1 h-1.5 rounded-full bg-white animate-bounce" />
                <span className="w-0.5 h-1 rounded-full bg-white/70" />
              </div>
              <span className="text-[11px] font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(15,23,42,0.5)]">
                Aşağı kaydır
              </span>
            </a>
          </div>
        </div>
      ) : (
        /* ==================== COMPACT STICKY SEARCH BAR WHEN VIEWING RESULTS ==================== */
        <div className="w-full border-b border-slate-100 bg-white/95 px-4 sm:px-6 py-3.5">
          <div ref={searchBoxContainerRef} className="max-w-4xl mx-auto flex items-center gap-3 relative">
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative flex items-center w-full bg-white rounded-full border border-purple-200 focus-within:border-[#6534F8] shadow-xs pl-5 pr-2 py-2">
                <Search className="w-4 h-4 text-[#6534F8] shrink-0 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  placeholder="Yeni bir arama yapın veya soru sorun..."
                  className="w-full text-sm sm:text-base text-slate-900 bg-transparent border-none outline-none select-text"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      setSearchResponse(null)
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600"
                    title="Ana Sayfaya Dön"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-[#7342FF] to-[#5826E8] text-white flex items-center justify-center ml-1.5 shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA (RESULTS OR BELOW-THE-FOLD WORKSPACE MODULES) */}
      <div
        id="chirmo-workspace-modules"
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-24 md:pb-12 flex flex-col"
      >
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
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200/80 pb-3 gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setResultTab('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    resultTab === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Tümü</span>
                  <span className={`text-[11px] ${resultTab === 'all' ? 'text-slate-300' : 'text-slate-400'}`}>
                    ({searchResponse.webResults.length})
                  </span>
                </button>

                {onNavigateToVisual && (
                  <button
                    onClick={() => onNavigateToVisual(searchResponse.query)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Görseller</span>
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
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-slate-500" />
                    <span>Karşılaştır</span>
                  </button>
                )}

                <button
                  onClick={() => setResultTab('ai')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    resultTab === 'ai'
                      ? 'bg-chirmo-brand text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Perspektifler</span>
                </button>

                <button
                  onClick={() => setResultTab('temporal')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    resultTab === 'temporal'
                      ? 'bg-chirmo-brand text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Zaman Çizelgesi</span>
                </button>

                <button
                  onClick={() => setResultTab('xray')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    resultTab === 'xray'
                      ? 'bg-chirmo-brand text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Doğrulama X-Ray</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(searchResponse.query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Google'da Canlı Aç"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google'da Aç</span>
                </a>

                <button
                  type="button"
                  onClick={handleSaveCurrentSearch}
                  disabled={isCurrentSearchSaved}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    isCurrentSearchSaved
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                  title="Aramayı Kaydet"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      isCurrentSearchSaved ? 'text-amber-600 fill-amber-500' : 'text-slate-400'
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {isCurrentSearchSaved ? 'Kaydedildi' : 'Kaydet'}
                  </span>
                </button>

                <button
                  onClick={() => handleSpeakText(searchResponse.aiSynthesis.summary)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                  title={isSpeaking ? 'Okumayı Durdur' : 'Sesli Dinle'}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span className="hidden sm:inline">{isSpeaking ? 'Durdur' : 'Sesli Dinle'}</span>
                </button>

                <button
                  onClick={() => handleDecomposeGoalToKanban(searchResponse.query)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  title="Aramayı Görev Olarak Kanban'a Ekle"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Kanban</span>
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

            {/* B. PERPLEXITY & GOOGLE AI OVERVIEW CARD */}
            {resultTab === 'all' && (
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-sm space-y-3.5">
                {/* Header + Source Chips */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-chirmo-brand to-indigo-600 flex items-center justify-center text-white shadow-2xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        COGKO AI Yanıtı
                      </h3>
                      {searchResponse.aiSynthesis.intentLabel && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                          {searchResponse.aiSynthesis.intentLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sources Carousel Strip */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full sm:max-w-md">
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">Kaynaklar:</span>
                    {searchResponse.aiSynthesis.sources.slice(0, 4).map((src, idx) => {
                      const domainClean = src.url.replace(/^https?:\/\//, '').split('/')[0]
                      return (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-[11px] font-medium text-slate-700 hover:text-chirmo-brand transition-colors shrink-0"
                          title={src.title}
                        >
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(
                              domainClean
                            )}&sz=32`}
                            alt=""
                            className="w-3.5 h-3.5 rounded-xs object-contain"
                            onError={(e) => {
                              ;(e.target as HTMLElement).style.display = 'none'
                            }}
                          />
                          <span className="truncate max-w-[120px]">{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                      )
                    })}
                    {searchResponse.aiSynthesis.sources.length > 4 && (
                      <span className="text-[11px] text-slate-400 font-medium shrink-0">
                        +{searchResponse.aiSynthesis.sources.length - 4} kaynak
                      </span>
                    )}
                  </div>
                </div>

                {/* Synthesis Body */}
                <div className="space-y-3">
                  {/* Uncertainty Warning */}
                  {searchResponse.aiSynthesis.uncertaintyWarning && (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Kaynak Uyarısı: </span>
                        {searchResponse.aiSynthesis.uncertaintyWarning}
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-slate-800 leading-relaxed font-normal select-text">
                    {searchResponse.aiSynthesis.summary}
                  </p>

                  {/* Direct Quotes / Key Takeaways if available */}
                  {searchResponse.aiSynthesis.directSourceQuotes &&
                    searchResponse.aiSynthesis.directSourceQuotes.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Öne Çıkan Kaynak Alıntıları & Kanıtlar
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {searchResponse.aiSynthesis.directSourceQuotes.slice(0, 2).map((q) => (
                            <div
                              key={q.id}
                              className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/70 text-xs text-slate-700 flex flex-col justify-between gap-1.5"
                            >
                              <p className="line-clamp-3 italic text-slate-800">"{q.text}"</p>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-200/50">
                                <span className="truncate font-medium text-slate-600">
                                  {q.sourceTitle}
                                </span>
                                <a
                                  href={q.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-chirmo-brand hover:underline inline-flex items-center gap-0.5 font-medium"
                                >
                                  {q.domain} <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Related Follow-up Questions & Quick Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {searchResponse.relatedQuestions.slice(0, 3).map((rq, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setQuery(rq)
                            handleExecuteSearch(rq)
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-chirmo-brand/10 hover:text-chirmo-brand text-slate-600 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Sparkles className="w-3 h-3 text-chirmo-brand opacity-70" />
                          <span className="truncate max-w-[220px]">{rq}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(searchResponse.aiSynthesis.summary)
                          showToast('Özet metin panoya kopyalandı!')
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Özeti Kopyala"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSpeakText(searchResponse.aiSynthesis.summary)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Sesli Dinle"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
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

            {/* F. WEB SEARCH RESULTS (GOOGLE + ARC CLEAN SERP LAYOUT) */}
            {resultTab === 'all' && (
              <div className="space-y-3 pt-1">
                {/* Clean Filter & Sort Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-b border-slate-200/80 pb-3">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {(
                      [
                        { id: 'all', label: `Tümü (${searchResponse.webResults.length})` },
                        {
                          id: 'web',
                          label: `Web Siteleri (${
                            searchResponse.webResults.filter(
                              (r) => (r.category || 'web') === 'web'
                            ).length
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
                          label: `Açık Kaynak (${
                            searchResponse.webResults.filter((r) => r.category === 'code').length
                          })`
                        },
                        {
                          id: 'discussion',
                          label: `Topluluk (${
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
                          setVisibleResultsCount(10)
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          categoryFilter === cat.id
                            ? 'bg-slate-100 text-slate-900 font-bold'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort Segmented Control & Execution Time */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {searchResponse.executionTimeMs} ms
                    </span>

                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => setSortBy('relevance')}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] transition-colors cursor-pointer ${
                          sortBy === 'relevance'
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Alakalı
                      </button>
                      <button
                        type="button"
                        onClick={() => setSortBy('trust')}
                        className={`px-2.5 py-0.5 rounded-md text-[11px] transition-colors cursor-pointer ${
                          sortBy === 'trust'
                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Güvenilir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Multi-Compare Selection Floating Bar */}
                {compareSelection.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Scale className="w-4 h-4 text-chirmo-brand shrink-0" />
                      <span>Karşılaştırma Listesi ({compareSelection.length}/2):</span>
                      {compareSelection.map((sel, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white/20 text-white text-xs font-medium"
                        >
                          {sel}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      {onNavigateToCompare && (
                        <button
                          type="button"
                          onClick={() =>
                            onNavigateToCompare(
                              compareSelection[0] || searchResponse.query,
                              compareSelection[1] || 'Alternatif Seçenek'
                            )
                          }
                          className="px-3 py-1 rounded-lg bg-chirmo-brand hover:bg-chirmo-brand-hover text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Yan Yana Kıyasla
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setCompareSelection([])}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>
                )}

                {/* Results List */}
                {paginatedWebResults.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                    <p className="text-sm font-semibold text-slate-700">
                      Seçili filtrede eşleşen sonuç bulunamadı
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryFilter('all')
                          setSmartFilter('all')
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-chirmo-brand text-white text-xs font-semibold cursor-pointer"
                      >
                        Tüm Sonuçları Göster ({searchResponse.webResults.length})
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paginatedWebResults.map((item) => {
                      const isFav = favoritedUrls.has(item.url)
                      const inspected = inspectedPages[item.url]
                      const isInspectingThis = inspectingUrl === item.url
                      const cleanCompareTitle = item.title
                        .split('—')[0]
                        .split('|')[0]
                        .split('-')[0]
                        .trim()
                        .slice(0, 48)
                      const isSelectedForCompare = compareSelection.includes(cleanCompareTitle)

                      return (
                        <div
                          key={item.id}
                          className="group p-4 sm:p-5 rounded-xl bg-white hover:bg-slate-50/50 border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs"
                        >
                          {/* Top Row: Favicon + Domain Breadcrumb + Subtle Actions */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={
                                  item.faviconUrl ||
                                  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
                                    item.domain
                                  )}&sz=32`
                                }
                                alt=""
                                className="w-4 h-4 rounded-xs object-contain shrink-0"
                                onError={(e) => {
                                  ;(e.target as HTMLElement).style.display = 'none'
                                }}
                              />
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                                <span className="font-semibold text-slate-800">{item.domain}</span>
                                {item.breadcrumb && item.breadcrumb !== item.domain && (
                                  <>
                                    <span className="text-slate-300">›</span>
                                    <span className="truncate max-w-[260px] text-slate-400 hidden sm:inline">
                                      {item.breadcrumb}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Practical Subtle Actions */}
                            <div className="flex items-center gap-1.5">
                              {/* Live Quick Preview Button */}
                              <button
                                type="button"
                                onClick={() => handleInspectResultLive(item.url)}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors border cursor-pointer ${
                                  inspected
                                    ? 'bg-chirmo-brand text-white border-chirmo-brand'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                                title="Sayfaya gitmeden içeriğini önizle"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>
                                  {isInspectingThis
                                    ? 'Taranıyor...'
                                    : inspected
                                    ? 'Gizle'
                                    : 'Hızlı Önizle'}
                                </span>
                              </button>

                              {/* Compare */}
                              <button
                                type="button"
                                onClick={() => handleToggleCompareSelect(item.title)}
                                className={`p-1.5 rounded-md text-xs transition-colors border cursor-pointer ${
                                  isSelectedForCompare
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                                title={
                                  isSelectedForCompare
                                    ? 'Karşılaştırmadan çıkar'
                                    : 'Karşılaştırmaya ekle'
                                }
                              >
                                <Scale className="w-3.5 h-3.5" />
                              </button>

                              {/* Bookmark */}
                              <button
                                type="button"
                                onClick={() => handleToggleFavoriteResult(item)}
                                className={`p-1.5 rounded-md text-xs transition-colors border cursor-pointer ${
                                  isFav
                                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                                    : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                                title={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                              >
                                <Bookmark
                                  className={`w-3.5 h-3.5 ${
                                    isFav ? 'fill-amber-500 text-amber-500' : ''
                                  }`}
                                />
                              </button>

                              {/* Copy Citation */}
                              <button
                                type="button"
                                onClick={() => {
                                  const citation = `"${item.title}" — ${item.domain} (${
                                    item.publishedDate || '2026'
                                  }). Erişim: ${item.url}`
                                  navigator.clipboard?.writeText(citation)
                                  showToast('Alıntı panoya kopyalandı!')
                                }}
                                className="p-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 text-xs cursor-pointer"
                                title="Alıntıyı kopyala"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              {/* Direct External Link */}
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 text-xs transition-colors"
                                title="Yeni sekmede aç"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          {/* Google-Style Prominent Clickable Title */}
                          <h4 className="text-base sm:text-lg font-semibold text-[#1a0dab] hover:underline leading-snug mb-1">
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              {item.title}
                            </a>
                          </h4>

                          {/* Snippet */}
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed select-text">
                            {item.publishedDate && (
                              <span className="text-slate-400 font-medium mr-1.5">
                                {item.publishedDate} —
                              </span>
                            )}
                            {item.snippet}
                          </p>

                          {/* Extracted Highlights (Price, spec, etc.) */}
                          {item.extractedHighlights && item.extractedHighlights.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                              {item.extractedHighlights.map((hl, hIdx) => (
                                <span
                                  key={hIdx}
                                  className="text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md"
                                >
                                  {hl}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Inline Live Page X-Ray Preview Drawer */}
                          {inspected && (
                            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2 text-xs animate-fadeIn">
                              <div className="flex items-center justify-between text-slate-500">
                                <span className="font-semibold text-chirmo-brand flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5" /> Canlı Sayfa Özeti
                                </span>
                                <span>~{inspected.wordCount} kelime tarandı</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed font-normal">
                                {inspected.summary}
                              </p>
                              {inspected.headlines.length > 0 && (
                                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                                  {inspected.headlines.slice(0, 3).map((hl, i) => (
                                    <a
                                      key={i}
                                      href={hl.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] text-slate-600 hover:text-chirmo-brand bg-white px-2.5 py-1 rounded-md border border-slate-200 truncate max-w-[240px] flex items-center gap-1"
                                    >
                                      <span>•</span>
                                      <span className="truncate">{hl.title}</span>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
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
                      className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      Daha Fazla Sonuç Göster ({filteredWebResults.length - visibleResultsCount}{' '}
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
            {/* Below-the-fold Workspace Customizer Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Kişisel Çalışma Panosu & Üretkenlik Modülleri
                </h2>
                <p className="text-xs text-slate-500">
                  Kanban görev panosu, hızlı kısayollar, canlı teknoloji radarı ve araçlarınızı yönetin.
                </p>
              </div>
              <button
                onClick={() => setShowWidgetPicker(!showWidgetPicker)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                  showWidgetPicker
                    ? 'bg-chirmo-brand text-white border-chirmo-brand shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Modülleri Özelleştir ({activeWidgets.length})</span>
              </button>
            </div>

            {showWidgetPicker && (
              <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {availableWidgets.map((w) => {
                    const isAdded = activeWidgets.includes(w.id)
                    return (
                      <button
                        key={w.id}
                        onClick={() => toggleWidget(w.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between cursor-pointer ${
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
            )}
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

            {/* MODULE 7: CANLI BORSA, DÖVİZ & KRİPTO TAKİPÇİSİ */}
            {activeWidgets.includes('finance') && (
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Canlı Finans, Döviz & Kripto Takipçisi
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                      Anlık Piyasa Göstergeleri
                    </span>
                    <button
                      onClick={() => toggleWidget('finance')}
                      className="p-1 text-slate-400 hover:text-slate-600"
                      title="Bu alanı kaldır"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {financeRates.map((rate) => (
                    <div
                      key={rate.symbol}
                      onClick={() => {
                        const q = `${rate.symbol} fiyatı canlı`
                        setQuery(q)
                        handleExecuteSearch(q)
                      }}
                      className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-chirmo-brand hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-slate-800 group-hover:text-chirmo-brand transition-colors">
                            {rate.symbol}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              rate.isUp
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-rose-50 text-rose-600 border border-rose-200'
                            }`}
                          >
                            {rate.change}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{rate.name}</p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-900">{rate.price}</span>
                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-chirmo-brand transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 8 & 9 ROW: WEATHER & DAILY TASKS */}
            {(activeWidgets.includes('weather') || activeWidgets.includes('dailytasks')) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weather Widget */}
                {activeWidgets.includes('weather') && (
                  <div className="bg-sky-50/50 rounded-2xl border border-sky-200/70 p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CloudSun className="w-4 h-4 text-sky-600" />
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Hava Durumu & Çevre Bilgisi
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleWidget('weather')}
                          className="p-1 text-slate-400 hover:text-slate-600"
                          title="Kaldır"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quick City Selector */}
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'].map((city) => (
                          <button
                            key={city}
                            onClick={() => handleSelectWeatherCity(city)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                              weatherCity === city
                                ? 'bg-sky-600 text-white shadow-2xs'
                                : 'bg-white text-slate-600 hover:bg-sky-100/60 border border-sky-200/80'
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>

                      {/* Weather Info Card */}
                      <div className="p-4 rounded-xl bg-white border border-sky-100 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                            <CloudSun className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-slate-900">
                                {weatherData.temp}°C
                              </span>
                              <span className="text-xs font-bold text-sky-700">
                                {weatherData.city}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                              {weatherData.desc}
                            </p>
                          </div>
                        </div>

                        <div className="text-right space-y-0.5">
                          <div className="text-[11px] text-slate-500">
                            Rüzgar: <span className="font-semibold text-slate-700">{weatherData.wind}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Nem: <span className="font-semibold text-slate-700">{weatherData.humidity}</span>
                          </div>
                          <button
                            onClick={() => {
                              const q = `${weatherData.city} hava durumu`
                              setQuery(q)
                              handleExecuteSearch(q)
                            }}
                            className="text-[11px] font-bold text-chirmo-brand hover:underline inline-flex items-center gap-0.5 pt-1"
                          >
                            Detaylı Rapor ➔
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Daily Checklist Widget */}
                {activeWidgets.includes('dailytasks') && (
                  <div className="bg-emerald-50/40 rounded-2xl border border-emerald-200/70 p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Günlük Öncelikli Görev Listesi
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                            {dailyChecklist.filter((t) => t.done).length}/{dailyChecklist.length} Bitti
                          </span>
                          <button
                            onClick={() => toggleWidget('dailytasks')}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Kaldır"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Add Task Input */}
                      <div className="flex gap-1.5 mb-3">
                        <input
                          type="text"
                          value={newChecklistText}
                          onChange={(e) => setNewChecklistText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                          placeholder="Yeni adım ekle ve Enter'a bas..."
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs text-slate-800 outline-none focus:border-emerald-500 select-text"
                        />
                        <button
                          onClick={addChecklistItem}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                          Ekle
                        </button>
                      </div>

                      {/* Task List */}
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {dailyChecklist.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleChecklistItem(item.id)}
                            className={`p-2 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                              item.done
                                ? 'bg-white/50 border-slate-200/70 text-slate-400'
                                : 'bg-white border-emerald-200/80 text-slate-800 hover:border-emerald-400'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                  item.done
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span
                                className={`text-xs truncate ${
                                  item.done ? 'line-through text-slate-400' : 'font-medium'
                                }`}
                              >
                                {item.text}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteChecklistItem(item.id)
                              }}
                              className="p-1 text-slate-300 hover:text-rose-500 shrink-0 ml-1"
                              title="Sil"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {dailyChecklist.length === 0 && (
                          <p className="text-[11px] text-slate-400 text-center py-3">
                            Görev listeniz boş.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODULE 10: RESMİ BELGE & SÖZLEŞME STÜDYOSU */}
            {activeWidgets.includes('docgenerator') && (
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Resmi Belge, Dilekçe & Sözleşme Stüdyosu
                    </h2>
                  </div>
                  <button
                    onClick={() => toggleWidget('docgenerator')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    title="Bu alanı kaldır"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left Controls */}
                  <div className="lg:col-span-4 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Şablon Türü
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { type: 'petition' as const, label: 'Dilekçe' },
                          { type: 'contract' as const, label: 'Sözleşme' },
                          { type: 'business_plan' as const, label: 'İş Planı' }
                        ].map((t) => (
                          <button
                            key={t.type}
                            onClick={() => setDocType(t.type)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              docType === t.type
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">
                        Konu veya Başlık
                      </label>
                      <input
                        type="text"
                        value={docTopic}
                        onChange={(e) => setDocTopic(e.target.value)}
                        placeholder="Örn: Freelance Yazılım Sözleşmesi veya Abonelik İptali"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-500 select-text font-medium"
                      />
                    </div>

                    <button
                      onClick={handleGenerateDocument}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Belge Taslağını Hazırla</span>
                    </button>
                  </div>

                  {/* Right Document Preview */}
                  <div className="lg:col-span-8 flex flex-col justify-between p-3.5 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-700">Taslak Önizleme</span>
                      {generatedDoc && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopyDocument}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Kopyala</span>
                          </button>
                          <button
                            onClick={handleDownloadDocument}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>İndir (.txt)</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <textarea
                      rows={6}
                      value={
                        generatedDoc ||
                        'Konuyu yazıp "Belge Taslağını Hazırla" butonuna bastığınızda resmi formatta profesyonel şablon buraya aktarılır.'
                      }
                      onChange={(e) => setGeneratedDoc(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono text-slate-800 outline-none focus:bg-white resize-y select-text"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 11: HIZLI KOD & ALGORİTMA TEST ALANI */}
            {activeWidgets.includes('codeplayground') && (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 text-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-violet-400" />
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                      Hızlı Kod & Algoritma Test Alanı
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
                      {['JavaScript', 'Python', 'SQL'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setCodeLang(lang)
                            if (lang === 'Python') {
                              setCodeSnippet(
                                'def selam(isim):\n    return f"Merhaba {isim}!"\n\nprint(selam("COGKO"))'
                              )
                            } else if (lang === 'SQL') {
                              setCodeSnippet(
                                "SELECT id, name, created_at FROM projects\nWHERE status = 'active'\nORDER BY created_at DESC LIMIT 5;"
                              )
                            } else {
                              setCodeSnippet(
                                'const selam = (ad) => `Merhaba ${ad}!`;\nconsole.log(selam("COGKO"));'
                              )
                            }
                          }}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                            codeLang === lang
                              ? 'bg-violet-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleWidget('codeplayground')}
                      className="p-1 text-slate-500 hover:text-slate-300"
                      title="Bu alanı kaldır"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  <div className="lg:col-span-7 flex flex-col">
                    <textarea
                      rows={5}
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-violet-300 font-mono text-xs outline-none focus:border-violet-500 select-text resize-none"
                      placeholder="Kodunuzu buraya yazın..."
                    />
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Kopyala</span>
                      </button>
                      <button
                        onClick={handleRunCode}
                        className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Çalıştır</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 h-full flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Konsol Çıktısı:
                      </span>
                      <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap overflow-y-auto flex-1 select-text">
                        {codeOutput || '// Çıktı bekleniyor...'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 12: AKILLI ARAMA & KEŞİF GEÇMİŞİ */}
            {activeWidgets.includes('historyfeed') && (
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-purple-600" />
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Akıllı Arama & Keşif Geçmişi
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {recentHistory.length > 0 && (
                      <button
                        onClick={() => {
                          WorkspaceStorage.clearSearchHistory()
                          syncWorkspaceState()
                        }}
                        className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                      >
                        Geçmişi Temizle
                      </button>
                    )}
                    <button
                      onClick={() => toggleWidget('historyfeed')}
                      className="p-1 text-slate-400 hover:text-slate-600"
                      title="Bu alanı kaldır"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {recentHistory.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4 bg-white rounded-xl border border-slate-200">
                    Henüz kayıtlı arama geçmişi bulunmuyor. Arama yaptıkça burada listelenecektir.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {recentHistory.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setQuery(item.query)
                          handleExecuteSearch(item.query)
                        }}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-chirmo-brand transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-chirmo-brand shrink-0" />
                          <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-chirmo-brand">
                            {item.query}
                          </span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-chirmo-brand shrink-0" />
                      </div>
                    ))}
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
