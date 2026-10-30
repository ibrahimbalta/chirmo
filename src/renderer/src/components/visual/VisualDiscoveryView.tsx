import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Bookmark,
  Check,
  Sparkles,
  Layers,
  X,
  Palette,
  Compass,
  RefreshCw,
  FolderHeart
} from 'lucide-react'
import {
  VisualSearchService,
  VisualSearchResult,
  VISUAL_CATEGORIES,
  UploadedImageAnalysis
} from '../../services/visualSearchService'
import { WorkspaceStorage, SavedVisualItem } from '../../services/workspaceStorage'

interface VisualDiscoveryViewProps {
  initialQuery?: string
  onExploreTopic?: (topic: string) => void
}

export const VisualDiscoveryView: React.FC<VisualDiscoveryViewProps> = ({
  initialQuery = '',
  onExploreTopic
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [results, setResults] = useState<VisualSearchResult[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<VisualSearchResult | null>(null)
  const [savedUrls, setSavedUrls] = useState<Set<string>>(new Set())
  const [collectionFilter, setCollectionFilter] = useState<boolean>(false)
  const [savedItems, setSavedItems] = useState<SavedVisualItem[]>([])
  const [collectionNameInput, setCollectionNameInput] = useState<string>('Tasarım & İlham Panosu')

  // Image upload & similarity analysis state
  const [uploadedAnalysis, setUploadedAnalysis] = useState<UploadedImageAnalysis | null>(null)
  const [isAnalyzingUpload, setIsAnalyzingUpload] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const syncSavedState = (): void => {
    const list = WorkspaceStorage.getVisualCollections()
    setSavedItems(list)
    setSavedUrls(new Set(list.map((i) => i.imageUrl)))
  }

  useEffect(() => {
    syncSavedState()
    const handler = (): void => syncSavedState()
    window.addEventListener('chirmo:workspace-updated', handler)
    return () => window.removeEventListener('chirmo:workspace-updated', handler)
  }, [])

  const runVisualSearch = async (searchQuery: string, categoryId: string): Promise<void> => {
    setIsLoading(true)
    setCollectionFilter(false)
    try {
      const items = await VisualSearchService.searchImages(searchQuery, categoryId, 24)
      setResults(items)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runVisualSearch(initialQuery, activeCategory)
  }, [initialQuery])

  const handleCategoryClick = (catId: string): void => {
    setActiveCategory(catId)
    const cat = VISUAL_CATEGORIES.find((c) => c.id === catId)
    const q = query.trim() || cat?.defaultQuery || ''
    runVisualSearch(q, catId)
  }

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    runVisualSearch(query, activeCategory)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsAnalyzingUpload(true)
    try {
      const analysis = await VisualSearchService.analyzeUploadedImage(file)
      setUploadedAnalysis(analysis)
      setQuery(analysis.suggestedQuery)
      await runVisualSearch(analysis.suggestedQuery, activeCategory)
    } catch {
      // ignore
    } finally {
      setIsAnalyzingUpload(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleToggleSave = (item: VisualSearchResult): void => {
    if (savedUrls.has(item.fullUrl)) {
      WorkspaceStorage.removeVisualItem(item.fullUrl)
    } else {
      WorkspaceStorage.saveVisualItem({
        title: item.title,
        imageUrl: item.fullUrl,
        thumbUrl: item.thumbUrl,
        sourceUrl: item.sourcePageUrl,
        author: item.author,
        license: item.license,
        category: item.category,
        dimensions: `${item.width}×${item.height}`,
        collectionName: collectionNameInput.trim() || 'Genel Koleksiyon'
      })
    }
    syncSavedState()
  }

  const handleFindSimilar = (item: VisualSearchResult): void => {
    const words = item.title
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 3)
      .join(' ')
    const nextQ = words || item.title
    setQuery(nextQ)
    setSelectedItem(null)
    runVisualSearch(nextQ, activeCategory)
  }

  return (
    <div className="h-full overflow-y-auto bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chirmo-brand-light text-chirmo-brand text-xs font-semibold mb-2">
              <ImageIcon className="w-3.5 h-3.5" />
              GÖRSEL KEŞİF & BENZER İÇERİK ARAMA
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Görseller Üzerinden Keşfet ve Koleksiyon Oluştur
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Wikimedia Commons açık lisanslı arşivlerinden gerçek görsel arama yapın veya kendi
              görselinizi yükleyerek renk/etiket tabanlı benzer içerikleri keşfedin.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-chirmo-brand bg-white hover:bg-chirmo-brand-light/40 text-slate-700 hover:text-chirmo-brand text-xs font-semibold transition-all shadow-sm"
            >
              <Upload className="w-4 h-4 text-chirmo-brand" />
              Görsel Yükle & Benzerini Ara
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => setCollectionFilter(!collectionFilter)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                collectionFilter
                  ? 'bg-chirmo-brand text-white border-chirmo-brand shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FolderHeart className="w-4 h-4" />
              Koleksiyonum ({savedItems.length})
            </button>
          </div>
        </div>

        {/* Search & Upload Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-5">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Görsel, mimari tasarım, ürün, doğa, bilimsel diyagram veya kavram arayın..."
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 focus:border-chirmo-brand focus:ring-2 focus:ring-chirmo-brand/15 outline-none text-sm text-slate-900 placeholder:text-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    runVisualSearch('', activeCategory)
                  }}
                  aria-label="Aramayı temizle"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-chirmo-brand hover:bg-chirmo-brand-hover text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Aranıyor...' : 'Görsellerde Ara'}
            </button>
          </div>
        </form>

        {/* Uploaded Image Inspection Card */}
        {(isAnalyzingUpload || uploadedAnalysis) && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl border border-chirmo-brand/25 bg-chirmo-brand-light/30">
            {isAnalyzingUpload ? (
              <div className="flex items-center gap-3 text-sm text-chirmo-brand font-medium">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Yüklenen görselin renk paleti, çözünürlüğü ve görsel etiketleri analiz ediliyor...
              </div>
            ) : (
              uploadedAnalysis && (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={uploadedAnalysis.dataUrl}
                      alt={uploadedAnalysis.fileName}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm bg-white"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-chirmo-brand">
                          Yüklenen Görsel Analizi
                        </span>
                        <span className="text-xs text-slate-500">
                          ({uploadedAnalysis.width}×{uploadedAnalysis.height}px •{' '}
                          {uploadedAnalysis.aspectRatio})
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        {uploadedAnalysis.fileName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                          <Palette className="w-3.5 h-3.5 text-chirmo-brand" />
                          Baskın Renkler:
                        </span>
                        {uploadedAnalysis.dominantColors.map((hex) => (
                          <span
                            key={hex}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-700"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-slate-300"
                              style={{ backgroundColor: hex }}
                            />
                            {hex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {uploadedAnalysis.extractedKeywords.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => {
                          setQuery(kw)
                          runVisualSearch(kw, activeCategory)
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-chirmo-brand hover:text-white border border-slate-200 text-xs font-medium text-slate-700 transition-colors"
                      >
                        #{kw}
                      </button>
                    ))}
                    <a
                      href={`https://www.bing.com/visualsearch`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:text-chirmo-brand"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Global Ters Görsel Arama
                    </a>
                    <button
                      type="button"
                      onClick={() => setUploadedAnalysis(null)}
                      aria-label="Analiz kutusunu kapat"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Visual Categories */}
        {!collectionFilter && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {VISUAL_CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    active
                      ? 'bg-chirmo-brand text-white border-chirmo-brand shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Saved Visual Collection View */}
        {collectionFilter ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Kaydedilen Görsel Koleksiyonum ({savedItems.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Kişisel çalışma alanınıza kaydettiğiniz doğrulanmış görsel kaynaklar
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCollectionFilter(false)}
                className="text-xs font-semibold text-chirmo-brand hover:underline"
              >
                ← Keşif Galerisine Dön
              </button>
            </div>

            {savedItems.length === 0 ? (
              <div className="text-center py-14 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <FolderHeart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Henüz kaydedilmiş bir görseliniz yok
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Galerideki herhangi bir görselin üzerindeki kaydet ikonuna tıklayarak koleksiyon
                  oluşturabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={item.thumbUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
                        {item.collectionName}
                      </span>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {item.author} • {item.license}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-chirmo-brand hover:underline"
                        >
                          Kaynağa Git <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          type="button"
                          onClick={() => WorkspaceStorage.removeVisualItem(item.id)}
                          className="text-[11px] text-red-600 hover:underline font-medium"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Live Visual Results Gallery */
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-slate-200" />
                    <div className="p-3.5 space-y-2">
                      <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-14 border border-slate-200 rounded-2xl bg-slate-50/50">
                <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Bu sorgu için açık lisanslı görsel bulunamadı
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Farklı anahtar kelimeler deneyebilir veya üstteki görsel kategorilerinden birini
                  seçebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((item) => {
                  const isSaved = savedUrls.has(item.fullUrl)
                  return (
                    <div
                      key={item.id}
                      className="group rounded-2xl border border-slate-200 hover:border-chirmo-brand/50 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all flex flex-col"
                    >
                      <div
                        onClick={() => setSelectedItem(item)}
                        className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={item.thumbUrl}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                          <span className="text-[11px] font-medium text-white bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                            {item.width}×{item.height}
                          </span>
                          <span className="text-[11px] font-semibold text-white bg-chirmo-brand px-2.5 py-1 rounded-lg">
                            Detay & Benzerleri
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className="text-left text-xs font-bold text-slate-900 hover:text-chirmo-brand line-clamp-2 transition-colors"
                          >
                            {item.title}
                          </button>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                            {item.author} • <span className="text-slate-400">{item.license}</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <a
                              href={item.sourcePageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-chirmo-brand"
                              title="Görselin orijinal kaynağına git"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Kaynak
                            </a>
                            <button
                              type="button"
                              onClick={() => handleFindSimilar(item)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-chirmo-brand"
                              title="Benzer görselleri keşfet"
                            >
                              <Sparkles className="w-3 h-3 text-chirmo-brand" />
                              Benzer
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleSave(item)}
                            aria-label={isSaved ? 'Koleksiyondan çıkar' : 'Koleksiyona kaydet'}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                              isSaved
                                ? 'bg-chirmo-brand-light text-chirmo-brand'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3 h-3" /> Kayıtlı
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-3 h-3" /> Kaydet
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Lightbox & Visual Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-200">
              <div className="md:w-3/5 bg-slate-950 flex items-center justify-center p-4 relative min-h-[280px]">
                <img
                  src={selectedItem.thumbUrl}
                  alt={selectedItem.title}
                  className="max-h-[70vh] w-auto object-contain rounded-lg"
                />
              </div>
              <div className="md:w-2/5 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-chirmo-brand-light text-chirmo-brand text-[11px] font-bold">
                      Doğrulanmış Açık Kaynak Görseli
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      aria-label="Kapat"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 mt-3">{selectedItem.title}</h2>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {selectedItem.description}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Eser Sahibi:</span>
                      <span className="font-medium text-slate-800">{selectedItem.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lisans:</span>
                      <span className="font-medium text-slate-800">{selectedItem.license}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Çözünürlük:</span>
                      <span className="font-medium text-slate-800">
                        {selectedItem.width} × {selectedItem.height} px
                      </span>
                    </div>
                    {selectedItem.timestamp && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Kayıt Tarihi:</span>
                        <span className="font-medium text-slate-800">{selectedItem.timestamp}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Kaydedilecek Koleksiyon Adı
                    </label>
                    <input
                      type="text"
                      value={collectionNameInput}
                      onChange={(e) => setCollectionNameInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:border-chirmo-brand outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSave(selectedItem)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                        savedUrls.has(selectedItem.fullUrl)
                          ? 'bg-chirmo-brand-light text-chirmo-brand border-chirmo-brand/30'
                          : 'bg-chirmo-brand text-white border-chirmo-brand hover:bg-chirmo-brand-hover'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {savedUrls.has(selectedItem.fullUrl) ? 'Koleksiyonda Kayıtlı' : 'Koleksiyona Kaydet'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFindSimilar(selectedItem)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border border-slate-200 hover:border-chirmo-brand text-slate-700 hover:text-chirmo-brand transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Benzer Görseller
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={selectedItem.sourcePageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Kaynağa Git
                    </a>

                    {onExploreTopic && (
                      <button
                        type="button"
                        onClick={() => {
                          const topic = selectedItem.title
                          setSelectedItem(null)
                          onExploreTopic(topic)
                        }}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium bg-slate-100 hover:bg-chirmo-brand-light text-slate-700 hover:text-chirmo-brand transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        Konuyu Araştır
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
