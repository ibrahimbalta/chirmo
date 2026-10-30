import React, { useState, useEffect } from 'react'
import {
  Compass,
  Sparkles,
  ExternalLink,
  Bookmark,
  Check,
  Image as ImageIcon,
  Cpu,
  Building2,
  Mountain,
  Package,
  Flame,
  ArrowRight,
  FolderHeart
} from 'lucide-react'
import { VisualSearchService, VisualSearchResult } from '../../services/visualSearchService'
import { WorkspaceStorage } from '../../services/workspaceStorage'

interface DiscoverViewProps {
  onSearchTopic: (query: string) => void
  onOpenVisualDiscovery: (query: string) => void
  onCompareTopics: (optionA: string, optionB: string) => void
}

interface DiscoverCardItem {
  id: string
  title: string
  snippet: string
  url: string
  domain: string
  category: string
  badge: string
  imageUrl?: string
  publishedDate?: string
  relatedTopics: string[]
}

const DISCOVER_CATEGORIES = [
  {
    id: 'popular',
    label: 'Popüler Konular',
    icon: Flame,
    wikiQuery: 'Yapay zeka Kuantum bilgisayar Sürdürülebilir enerji Uzay araştırmaları',
    visualQuery: 'modern technology science architecture'
  },
  {
    id: 'tech_science',
    label: 'Teknoloji ve Bilim',
    icon: Cpu,
    wikiQuery: 'Yarı iletken Biyoteknoloji Nörobilim Robotik Füzyon enerjisi',
    visualQuery: 'robotics spacecraft laboratory telescope'
  },
  {
    id: 'design_arch',
    label: 'Tasarım ve Mimari',
    icon: Building2,
    wikiQuery: 'Modern mimarlık Endüstriyel tasarım Sürdürülebilir mimari Bauhaus',
    visualQuery: 'contemporary architecture minimalist building design'
  },
  {
    id: 'travel_nature',
    label: 'Seyahat ve Doğa',
    icon: Mountain,
    wikiQuery: 'Milli park UNESCO Dünya Mirası Ekosistem Biyoçeşitlilik',
    visualQuery: 'national park landscape mountains fjord'
  },
  {
    id: 'product',
    label: 'Ürün Keşfi',
    icon: Package,
    wikiQuery: 'Elektrikli otomobil Akıllı saat Giyilebilir teknoloji Güneş paneli',
    visualQuery: 'electric vehicle industrial design gadget camera'
  },
  {
    id: 'visual',
    label: 'Görsel Keşif',
    icon: ImageIcon,
    wikiQuery: 'Fotoğrafçılık Görsel sanatlar Dijital sanat Sinematografi',
    visualQuery: 'featured photography aerial view macro nature'
  }
]

const RELATED_TOPIC_CLUSTERS: Record<string, { topics: string[]; comparisons: [string, string][] }> = {
  popular: {
    topics: [
      'Yapay Zeka Ajanları',
      'Kuantum Hesaplama',
      'Yenilenebilir Enerji Depolama',
      'Uzay Teleskopları',
      'Otonom Ulaşım',
      'Biyoinformatik'
    ],
    comparisons: [
      ['Elektrikli otomobil', 'Hibrit otomobil'],
      ['Güneş enerjisi', 'Rüzgâr enerjisi']
    ]
  },
  tech_science: {
    topics: [
      'CRISPR Gen Düzenleme',
      'Nükleer Füzyon',
      'Büyük Dil Modelleri',
      'Yarı İletken Çip Mimarisi',
      'İnsansı Robotlar',
      'Kuantum Kriptografi'
    ],
    comparisons: [
      ['Python', 'TypeScript'],
      ['React', 'Vue.js']
    ]
  },
  design_arch: {
    topics: [
      'Biyofilik Mimari',
      'Brütalist Mimari',
      'Endüstriyel Ürün Tasarımı',
      'Kentsel Dönüşüm & Yeşil Şehirler',
      'İskandinav Tasarımı',
      'Modüler Yapılar'
    ],
    comparisons: [
      ['Modern mimarlık', 'Klasik mimarlık'],
      ['Ahşap yapı', 'Betonarme']
    ]
  },
  travel_nature: {
    topics: [
      'Türkiye UNESCO Dünya Mirasları',
      'Kuzey Işıkları (Aurora)',
      'Mercan Resifleri Koruma',
      'Ekoturizm Rotaları',
      'Jeoparklar',
      'Alpler Doğa Yürüyüşü'
    ],
    comparisons: [
      ['Ekoturizm', 'Kültür turizmi'],
      ['Kampçılık', 'Karavan turizmi']
    ]
  },
  product: {
    topics: [
      'Katı Hal Bataryalı Araçlar',
      'OLED ve MicroLED Ekranlar',
      'Akıllı Ev Otomasyonu',
      'Güneş Enerjili Taşınabilir Güç İstasyonu',
      'Aynasız Fotoğraf Makineleri',
      'Ergonomik Çalışma Ekipmanları'
    ],
    comparisons: [
      ['OLED', 'Sıvı kristal ekran'],
      ['Dizüstü bilgisayar', 'Tablet bilgisayar']
    ]
  },
  visual: {
    topics: [
      'Mimari Fotoğrafçılık',
      'Astrofotoğrafçılık',
      'Makro Doğa Fotoğrafları',
      'Hava Fotoğrafçılığı',
      'Minimalist Kompozisyon',
      'Kültürel Miras Arşivleri'
    ],
    comparisons: [
      ['Dijital fotoğrafçılık', 'Analog fotoğrafçılık'],
      ['Geniş açı lens', 'Telefoto lens']
    ]
  }
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  onSearchTopic,
  onOpenVisualDiscovery,
  onCompareTopics
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('popular')
  const [cards, setCards] = useState<DiscoverCardItem[]>([])
  const [visualItems, setVisualItems] = useState<VisualSearchResult[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [favoritedUrls, setFavoritedUrls] = useState<Set<string>>(new Set())
  const [showCollectionsModal, setShowCollectionsModal] = useState<boolean>(false)

  const syncFavorites = (): void => {
    const favs = WorkspaceStorage.getFavoriteSources()
    setFavoritedUrls(new Set(favs.map((f) => f.url)))
  }

  useEffect(() => {
    syncFavorites()
    const handler = (): void => syncFavorites()
    window.addEventListener('chirmo:workspace-updated', handler)
    return () => window.removeEventListener('chirmo:workspace-updated', handler)
  }, [])

  const loadCategoryContent = async (catId: string): Promise<void> => {
    const cat = DISCOVER_CATEGORIES.find((c) => c.id === catId) || DISCOVER_CATEGORIES[0]
    setIsLoading(true)
    try {
      const [wikiRes, oaRes, visuals] = await Promise.allSettled([
        fetch(
          `https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            cat.wikiQuery
          )}&utf8=&format=json&origin=*&srlimit=6`
        ).then((r) => (r.ok ? r.json() : null)),
        fetch(
          `https://api.openalex.org/works?search=${encodeURIComponent(
            cat.visualQuery
          )}&per-page=4&sort=cited_by_count:desc`
        ).then((r) => (r.ok ? r.json() : null)),
        VisualSearchService.searchImages(cat.visualQuery, catId, 8)
      ])

      const nextCards: DiscoverCardItem[] = []
      const cluster = RELATED_TOPIC_CLUSTERS[catId] || RELATED_TOPIC_CLUSTERS.popular

      if (wikiRes.status === 'fulfilled' && Array.isArray(wikiRes.value?.query?.search)) {
        wikiRes.value.query.search.forEach((h: any, idx: number) => {
          const cleanSnippet = (h.snippet || '')
            .replace(/<\/?[^>]+(>|$)/g, '')
            .replace(/&quot;/g, '"')
          nextCards.push({
            id: `disc-wiki-${h.pageid || idx}`,
            title: h.title,
            snippet: cleanSnippet,
            url: `https://tr.wikipedia.org/wiki/${encodeURIComponent(h.title)}`,
            domain: 'tr.wikipedia.org',
            category: cat.label,
            badge: 'Ansiklopedik Keşif',
            publishedDate: h.timestamp ? h.timestamp.slice(0, 10) : undefined,
            relatedTopics: cluster.topics.slice(0, 3)
          })
        })
      }

      if (oaRes.status === 'fulfilled' && Array.isArray(oaRes.value?.results)) {
        oaRes.value.results.forEach((w: any, idx: number) => {
          if (!w.title) return
          nextCards.push({
            id: `disc-oa-${w.id || idx}`,
            title: w.title,
            snippet: `Hakemli Bilimsel Araştırma (${w.publication_year || 2024}) • ${
              w.authorships?.[0]?.author?.display_name || 'Akademik Grup'
            } • ${(w.cited_by_count || 0).toLocaleString('tr-TR')} bilimsel atıf`,
            url: w.doi || w.id || 'https://openalex.org',
            domain: 'openalex.org',
            category: cat.label,
            badge: `Akademik • ${w.publication_year || 2024}`,
            publishedDate: String(w.publication_year || 2024),
            relatedTopics: cluster.topics.slice(2, 5)
          })
        })
      }

      setCards(nextCards)
      if (visuals.status === 'fulfilled') {
        setVisualItems(visuals.value.slice(0, 8))
      } else {
        setVisualItems([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategoryContent(activeCategory)
  }, [activeCategory])

  const handleToggleFavorite = (card: DiscoverCardItem): void => {
    if (favoritedUrls.has(card.url)) {
      WorkspaceStorage.removeFavoriteSource(card.url)
    } else {
      WorkspaceStorage.saveFavoriteSource({
        title: card.title,
        url: card.url,
        domain: card.domain,
        snippet: card.snippet,
        category: card.domain.includes('openalex') ? 'academic' : 'web',
        publishedDate: card.publishedDate
      })
    }
    syncFavorites()
  }

  const activeCluster = RELATED_TOPIC_CLUSTERS[activeCategory] || RELATED_TOPIC_CLUSTERS.popular
  const savedFavorites = WorkspaceStorage.getFavoriteSources()

  return (
    <div className="h-full overflow-y-auto bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chirmo-brand-light text-chirmo-brand text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              DISCOVER — KEŞİF VE İLHAM MERKEZİ
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Yeni Fikirleri, Bilimi ve Görsel Dünyayı Keşfedin
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Doğrulanmış açık kaynaklardan derlenen popüler konular, teknoloji, mimari, doğa ve
              ürün keşifleri.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCollectionsModal(!showCollectionsModal)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border self-start md:self-auto ${
              showCollectionsModal
                ? 'bg-chirmo-brand text-white border-chirmo-brand shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FolderHeart className="w-4 h-4" />
            Kişisel Koleksiyonlarım ({savedFavorites.length})
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {DISCOVER_CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const active = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-chirmo-brand text-white border-chirmo-brand shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Personal Collections Drawer */}
        {showCollectionsModal && (
          <div className="mb-8 p-5 rounded-2xl border border-chirmo-brand/25 bg-chirmo-brand-light/25">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Kaydedilen Keşif Koleksiyonum ({savedFavorites.length})
              </h2>
              <button
                type="button"
                onClick={() => setShowCollectionsModal(false)}
                className="text-xs font-semibold text-chirmo-brand hover:underline"
              >
                Kapat
              </button>
            </div>
            {savedFavorites.length === 0 ? (
              <p className="text-xs text-slate-500">
                Henüz kaydettiğiniz bir keşif kartı yok. Kartların sağ altındaki "Kaydet" butonunu
                kullanarak kendi kişisel bilgi koleksiyonunuzu oluşturabilirsiniz.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedFavorites.slice(0, 6).map((fav) => (
                  <div
                    key={fav.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-chirmo-brand uppercase">
                        {fav.domain}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                        {fav.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{fav.snippet}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <a
                        href={fav.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-chirmo-brand hover:underline inline-flex items-center gap-1"
                      >
                        Kaynağı Aç <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          WorkspaceStorage.removeFavoriteSource(fav.id)
                          syncFavorites()
                        }}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related Topics & Smart Comparison Shortcuts */}
        <div className="mb-7 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                İlişkili Konular Arasında Keşif Yapın
              </span>
              <div className="flex flex-wrap gap-2">
                {activeCluster.topics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => onSearchTopic(topic)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-chirmo-brand hover:text-white border border-slate-200 text-xs font-medium text-slate-700 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-chirmo-brand group-hover:text-white" />
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:border-l md:border-slate-200 md:pl-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Önerilen Karşılaştırmalar
              </span>
              <div className="flex flex-wrap gap-2">
                {activeCluster.comparisons.map(([a, b]) => (
                  <button
                    key={`${a}-${b}`}
                    type="button"
                    onClick={() => onCompareTopics(a, b)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-chirmo-brand-light hover:bg-chirmo-brand text-chirmo-brand hover:text-white text-xs font-semibold transition-colors"
                  >
                    {a} vs {b}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Discovery Strip */}
        {visualItems.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-chirmo-brand" />
                Görsel Keşif Akışı
              </h2>
              <button
                type="button"
                onClick={() => {
                  const cat = DISCOVER_CATEGORIES.find((c) => c.id === activeCategory)
                  onOpenVisualDiscovery(cat?.visualQuery || '')
                }}
                className="text-xs font-semibold text-chirmo-brand hover:underline inline-flex items-center gap-1"
              >
                Tüm Görsel Galeriyi Aç <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {visualItems.slice(0, 4).map((vis) => (
                <div
                  key={vis.id}
                  onClick={() => onOpenVisualDiscovery(vis.title)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-sm"
                >
                  <img
                    src={vis.thumbUrl}
                    alt={vis.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent p-3 flex flex-col justify-end">
                    <p className="text-xs font-bold text-white line-clamp-1">{vis.title}</p>
                    <span className="text-[10px] text-white/80">{vis.license}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Knowledge & Research Discovery Feed */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-3">
            Doğrulanmış Kaynaklardan Güncel Keşif Kartları
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse space-y-3"
                >
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-12 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => {
                const isFav = favoritedUrls.has(card.url)
                return (
                  <div
                    key={card.id}
                    className="rounded-2xl border border-slate-200 hover:border-chirmo-brand/40 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-chirmo-brand-light text-chirmo-brand text-[11px] font-semibold">
                          {card.badge}
                        </span>
                        {card.publishedDate && (
                          <span className="text-[11px] text-slate-400">{card.publishedDate}</span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                        {card.snippet}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSearchTopic(card.title)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-chirmo-brand hover:underline"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            AI İle Araştır
                          </button>
                          <a
                            href={card.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                          >
                            Kaynak <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(card)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            isFav
                              ? 'bg-chirmo-brand-light text-chirmo-brand'
                              : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {isFav ? (
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
        </div>
      </div>
    </div>
  )
}
