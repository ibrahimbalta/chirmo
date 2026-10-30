// ============================================================================
// CHIRMO — UNIFIED PERSISTENT WORKSPACE STORAGE
// Manages Saved Searches, Favorite Sources, Research Files, Comparisons,
// Visual Collections, Projects, and Search History with full user control.
// ============================================================================

export interface SavedSearchItem {
  id: string
  query: string
  category: string
  resultCount: number
  summarySnippet?: string
  createdAt: number
}

export interface SavedSourceItem {
  id: string
  title: string
  url: string
  domain: string
  snippet: string
  category: 'web' | 'academic' | 'code' | 'discussion' | 'visual'
  publishedDate?: string
  projectId?: string
  createdAt: number
}

export interface SavedComparisonItem {
  id: string
  optionA: string
  optionB: string
  summary: string
  attributesCount: number
  sources: { title: string; url: string }[]
  createdAt: number
}

export interface SavedVisualItem {
  id: string
  title: string
  imageUrl: string
  thumbUrl: string
  sourceUrl: string
  author: string
  license: string
  category: string
  dimensions?: string
  collectionName: string
  createdAt: number
}

export interface SavedResearchReport {
  id: string
  goal: string
  summary: string
  markdownReport: string
  sources: { title: string; url: string }[]
  stepsCount: number
  createdAt: number
}

export interface SearchHistoryEntry {
  id: string
  query: string
  mode: string
  timestamp: number
}

const STORAGE_KEYS = {
  SAVED_SEARCHES: 'chirmo_ws_saved_searches_v1',
  FAVORITE_SOURCES: 'chirmo_ws_favorite_sources_v1',
  SAVED_COMPARISONS: 'chirmo_ws_saved_comparisons_v1',
  VISUAL_COLLECTIONS: 'chirmo_ws_visual_collections_v1',
  RESEARCH_REPORTS: 'chirmo_ws_research_reports_v1',
  SEARCH_HISTORY: 'chirmo_ws_search_history_v1',
  PROJECTS: 'chirmo_ws_projects_v1',
  AGENT_TASKS: 'chirmo_ws_agent_tasks_v1',
  NAV_HISTORY: 'chirmo_ws_nav_history_v1',
  SETTINGS: 'chirmo_ws_settings_v1',
  SEARCH_CACHE: 'chirmo_search_ttl_cache_v1'
} as const

const memoryStore = new Map<string, string>()

function safeRead<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(key)
      if (!raw) return fallback
      return JSON.parse(raw) as T
    }
    const memRaw = memoryStore.get(key)
    if (!memRaw) return fallback
    return JSON.parse(memRaw) as T
  } catch {
    return fallback
  }
}

function safeWrite<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, serialized)
      window.dispatchEvent(new CustomEvent('chirmo:workspace-updated', { detail: { key } }))
    } else {
      memoryStore.set(key, serialized)
    }
  } catch {
    // Ignore quota errors
  }
}

export class WorkspaceStorage {
  // --- Saved Searches ---
  static getSavedSearches(): SavedSearchItem[] {
    return safeRead<SavedSearchItem[]>(STORAGE_KEYS.SAVED_SEARCHES, [])
  }

  static saveSearch(item: Omit<SavedSearchItem, 'id' | 'createdAt'>): SavedSearchItem {
    const list = this.getSavedSearches()
    const existing = list.find((s) => s.query.toLowerCase() === item.query.toLowerCase())
    if (existing) {
      existing.resultCount = item.resultCount
      existing.summarySnippet = item.summarySnippet
      existing.createdAt = Date.now()
      safeWrite(STORAGE_KEYS.SAVED_SEARCHES, list)
      return existing
    }
    const created: SavedSearchItem = {
      ...item,
      id: `ssearch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now()
    }
    safeWrite(STORAGE_KEYS.SAVED_SEARCHES, [created, ...list].slice(0, 100))
    return created
  }

  static removeSavedSearch(id: string): void {
    const list = this.getSavedSearches().filter((s) => s.id !== id)
    safeWrite(STORAGE_KEYS.SAVED_SEARCHES, list)
  }

  static isSearchSaved(query: string): boolean {
    const q = query.trim().toLowerCase()
    return this.getSavedSearches().some((s) => s.query.toLowerCase() === q)
  }

  // --- Favorite Sources ---
  static getFavoriteSources(): SavedSourceItem[] {
    return safeRead<SavedSourceItem[]>(STORAGE_KEYS.FAVORITE_SOURCES, [])
  }

  static saveFavoriteSource(item: Omit<SavedSourceItem, 'id' | 'createdAt'>): SavedSourceItem {
    const list = this.getFavoriteSources()
    const existing = list.find((s) => s.url === item.url)
    if (existing) return existing
    const created: SavedSourceItem = {
      ...item,
      id: `fsource-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now()
    }
    safeWrite(STORAGE_KEYS.FAVORITE_SOURCES, [created, ...list].slice(0, 200))
    return created
  }

  static removeFavoriteSource(idOrUrl: string): void {
    const list = this.getFavoriteSources().filter((s) => s.id !== idOrUrl && s.url !== idOrUrl)
    safeWrite(STORAGE_KEYS.FAVORITE_SOURCES, list)
  }

  static isSourceFavorited(url: string): boolean {
    return this.getFavoriteSources().some((s) => s.url === url)
  }

  // --- Saved Comparisons ---
  static getSavedComparisons(): SavedComparisonItem[] {
    return safeRead<SavedComparisonItem[]>(STORAGE_KEYS.SAVED_COMPARISONS, [])
  }

  static saveComparison(item: Omit<SavedComparisonItem, 'id' | 'createdAt'>): SavedComparisonItem {
    const list = this.getSavedComparisons()
    const created: SavedComparisonItem = {
      ...item,
      id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now()
    }
    safeWrite(STORAGE_KEYS.SAVED_COMPARISONS, [created, ...list].slice(0, 50))
    return created
  }

  static removeComparison(id: string): void {
    const list = this.getSavedComparisons().filter((c) => c.id !== id)
    safeWrite(STORAGE_KEYS.SAVED_COMPARISONS, list)
  }

  // --- Visual Collections ---
  static getVisualCollections(): SavedVisualItem[] {
    return safeRead<SavedVisualItem[]>(STORAGE_KEYS.VISUAL_COLLECTIONS, [])
  }

  static saveVisualItem(item: Omit<SavedVisualItem, 'id' | 'createdAt'>): SavedVisualItem {
    const list = this.getVisualCollections()
    const existing = list.find((v) => v.imageUrl === item.imageUrl)
    if (existing) return existing
    const created: SavedVisualItem = {
      ...item,
      id: `vis-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now()
    }
    safeWrite(STORAGE_KEYS.VISUAL_COLLECTIONS, [created, ...list].slice(0, 150))
    return created
  }

  static removeVisualItem(idOrUrl: string): void {
    const list = this.getVisualCollections().filter(
      (v) => v.id !== idOrUrl && v.imageUrl !== idOrUrl
    )
    safeWrite(STORAGE_KEYS.VISUAL_COLLECTIONS, list)
  }

  static isVisualSaved(imageUrl: string): boolean {
    return this.getVisualCollections().some((v) => v.imageUrl === imageUrl)
  }

  // --- Saved Research Reports ---
  static getResearchReports(): SavedResearchReport[] {
    return safeRead<SavedResearchReport[]>(STORAGE_KEYS.RESEARCH_REPORTS, [])
  }

  static saveResearchReport(
    item: Omit<SavedResearchReport, 'id' | 'createdAt'>
  ): SavedResearchReport {
    const list = this.getResearchReports()
    const created: SavedResearchReport = {
      ...item,
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now()
    }
    safeWrite(STORAGE_KEYS.RESEARCH_REPORTS, [created, ...list].slice(0, 50))
    return created
  }

  static removeResearchReport(id: string): void {
    const list = this.getResearchReports().filter((r) => r.id !== id)
    safeWrite(STORAGE_KEYS.RESEARCH_REPORTS, list)
  }

  // --- Search Query History ---
  static getSearchHistory(): SearchHistoryEntry[] {
    return safeRead<SearchHistoryEntry[]>(STORAGE_KEYS.SEARCH_HISTORY, [])
  }

  static addSearchHistory(query: string, mode = 'all'): void {
    const clean = query.trim()
    if (!clean || clean.length < 2) return
    const list = this.getSearchHistory().filter(
      (h) => h.query.toLowerCase() !== clean.toLowerCase()
    )
    const entry: SearchHistoryEntry = {
      id: `sh-${Date.now()}`,
      query: clean,
      mode,
      timestamp: Date.now()
    }
    safeWrite(STORAGE_KEYS.SEARCH_HISTORY, [entry, ...list].slice(0, 40))
  }

  static removeSearchHistoryItem(id: string): void {
    const list = this.getSearchHistory().filter((h) => h.id !== id)
    safeWrite(STORAGE_KEYS.SEARCH_HISTORY, list)
  }

  static clearSearchHistory(): void {
    safeWrite(STORAGE_KEYS.SEARCH_HISTORY, [])
  }

  // --- Generic Key Access for WebMock Persistence ---
  static getRaw<T>(key: keyof typeof STORAGE_KEYS, fallback: T): T {
    return safeRead<T>(STORAGE_KEYS[key], fallback)
  }

  static setRaw<T>(key: keyof typeof STORAGE_KEYS, value: T): void {
    safeWrite<T>(STORAGE_KEYS[key], value)
  }

  // --- Cache & Full Data Control ---
  static clearCacheOnly(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      window.localStorage.removeItem(STORAGE_KEYS.SEARCH_CACHE)
      window.sessionStorage?.clear()
    } catch {
      // ignore
    }
  }

  static clearAllUserData(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k))
      window.dispatchEvent(new CustomEvent('chirmo:workspace-updated', { detail: { key: 'all' } }))
    } catch {
      // ignore
    }
  }

  static exportWorkspaceJSON(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        platform: 'Chirmo AI Discovery & Research Platform',
        savedSearches: this.getSavedSearches(),
        favoriteSources: this.getFavoriteSources(),
        savedComparisons: this.getSavedComparisons(),
        visualCollections: this.getVisualCollections(),
        researchReports: this.getResearchReports(),
        searchHistory: this.getSearchHistory()
      },
      null,
      2
    )
  }
}
