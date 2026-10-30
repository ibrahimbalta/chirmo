import React, { useState, useEffect } from 'react'
import {
  Scale,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bookmark,
  Check,
  Sparkles,
  ShieldCheck,
  Info
} from 'lucide-react'
import { ComparisonService, SmartComparisonResult } from '../../services/comparisonService'
import { WorkspaceStorage } from '../../services/workspaceStorage'

interface CompareViewProps {
  initialOptionA?: string
  initialOptionB?: string
  onExploreTopic?: (topic: string) => void
}

const PRESET_COMPARISONS = [
  { a: 'Elektrikli otomobil', b: 'Hibrit otomobil', label: 'Elektrikli Araç vs Hibrit Araç' },
  { a: 'React', b: 'Vue.js', label: 'React vs Vue.js' },
  { a: 'Python', b: 'TypeScript', label: 'Python vs TypeScript' },
  { a: 'Güneş enerjisi', b: 'Rüzgâr enerjisi', label: 'Güneş vs Rüzgar Enerjisi' },
  { a: 'OLED', b: 'Sıvı kristal ekran', label: 'OLED vs LCD/LED Ekran' }
]

export const CompareView: React.FC<CompareViewProps> = ({
  initialOptionA = 'Elektrikli otomobil',
  initialOptionB = 'Hibrit otomobil',
  onExploreTopic
}) => {
  const [optionA, setOptionA] = useState(initialOptionA)
  const [optionB, setOptionB] = useState(initialOptionB)
  const [comparison, setComparison] = useState<SmartComparisonResult | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaved, setIsSaved] = useState<boolean>(false)

  const runComparison = async (a: string, b: string): Promise<void> => {
    const cleanA = a.trim()
    const cleanB = b.trim()
    if (!cleanA || !cleanB) return
    setIsLoading(true)
    setIsSaved(false)
    try {
      const res = await ComparisonService.compare(cleanA, cleanB)
      setComparison(res)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runComparison(initialOptionA, initialOptionB)
  }, [initialOptionA, initialOptionB])

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    runComparison(optionA, optionB)
  }

  const handleSwap = (): void => {
    const prevA = optionA
    setOptionA(optionB)
    setOptionB(prevA)
    runComparison(optionB, prevA)
  }

  const handleSaveComparison = (): void => {
    if (!comparison) return
    const allSources = [...comparison.optionA.sources, ...comparison.optionB.sources].map((s) => ({
      title: s.title,
      url: s.url
    }))
    WorkspaceStorage.saveComparison({
      optionA: comparison.optionA.canonicalTitle,
      optionB: comparison.optionB.canonicalTitle,
      summary: comparison.synthesisSummary,
      attributesCount: comparison.comparisonRows.length,
      sources: allSources
    })
    setIsSaved(true)
  }

  return (
    <div className="h-full overflow-y-auto bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 sm:pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chirmo-brand-light text-chirmo-brand text-xs font-semibold mb-2">
              <Scale className="w-3.5 h-3.5" />
              KANIT VE KAYNAK TABANLI AKILLI KARŞILAŞTIRMA
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Seçenekleri Gerçek Verilerle Yan Yana Karşılaştırın
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Rastgele puanlar üretmez. Wikipedia, OpenAlex ve GitHub kaynaklarından doğrulanmış
              verileri yan yana sunar; eksik verileri açıkça belirtir.
            </p>
          </div>

          {comparison && (
            <button
              type="button"
              onClick={handleSaveComparison}
              disabled={isSaved}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border self-start md:self-auto ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-chirmo-brand text-white border-chirmo-brand hover:bg-chirmo-brand-hover shadow-sm'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" /> Çalışma Alanına Kaydedildi
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" /> Karşılaştırmayı Kaydet
                </>
              )}
            </button>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 mb-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                1. Seçenek / Ürün / Teknoloji
              </label>
              <input
                type="text"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Örn: Elektrikli otomobil, React, OLED..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-chirmo-brand focus:ring-2 focus:ring-chirmo-brand/15 outline-none text-sm font-medium text-slate-900"
              />
            </div>

            <div className="md:col-span-1 flex justify-center pt-2 md:pt-5">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Seçenekleri yer değiştir"
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-chirmo-brand text-slate-500 hover:text-chirmo-brand transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                2. Seçenek / Ürün / Teknoloji
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="Örn: Hibrit otomobil, Vue.js, QLED..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-chirmo-brand focus:ring-2 focus:ring-chirmo-brand/15 outline-none text-sm font-medium text-slate-900"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-chirmo-brand hover:bg-chirmo-brand-hover text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap"
                >
                  {isLoading ? 'Analiz Ediliyor...' : 'Karşılaştır'}
                </button>
              </div>
            </div>
          </div>

          {/* Preset pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3 border-t border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-400">Hızlı Örnekler:</span>
            {PRESET_COMPARISONS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setOptionA(preset.a)
                  setOptionB(preset.b)
                  runComparison(preset.a, preset.b)
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-chirmo-brand-light border border-slate-200 hover:border-chirmo-brand/30 text-xs text-slate-600 hover:text-chirmo-brand font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </form>

        {/* Loading state */}
        {isLoading && (
          <div className="p-10 rounded-2xl border border-slate-200 bg-slate-50/40 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-chirmo-brand border-t-transparent animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700">
              "{optionA}" ve "{optionB}" için birincil kaynaklar taranıyor...
            </p>
            <p className="text-xs text-slate-500">
              Wikipedia (TR/EN), OpenAlex Akademik İndeks ve GitHub açık kaynak verileri
              karşılaştırılıyor.
            </p>
          </div>
        )}

        {/* Comparison Results */}
        {!isLoading && comparison && (
          <div className="space-y-6">
            {/* Transparency Notice */}
            <div className="p-4 rounded-xl bg-chirmo-brand-light/50 border border-chirmo-brand/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-chirmo-brand shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Veri Şeffaflığı Bildirimi: </span>
                {comparison.synthesisSummary}
              </div>
            </div>

            {/* Side-by-side Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[comparison.optionA, comparison.optionB].map((entity, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                          {idx === 0 ? '1. Seçenek' : '2. Seçenek'} • {entity.categoryLabel}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 mt-1.5">
                          {entity.canonicalTitle}
                        </h2>
                      </div>
                      {entity.thumbnailUrl && (
                        <img
                          src={entity.thumbnailUrl}
                          alt={entity.canonicalTitle}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                        />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">{entity.summary}</p>

                    {/* Price / License Box */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Fiyat / Lisans Bilgisi
                        </span>
                        {entity.isPriceVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Kaynaktan Doğrulandı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" /> Doğrulanmış Veri Yok
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-800">
                        {entity.priceOrLicenseInfo}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mt-4">
                      <h3 className="text-xs font-bold text-slate-900 mb-2">
                        Temel Özellikler (Kaynak Özeti)
                      </h3>
                      <ul className="space-y-1.5">
                        {entity.keyFeatures.map((feat, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-chirmo-brand mt-1.5 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Advantages */}
                    <div className="mt-4">
                      <h3 className="text-xs font-bold text-emerald-800 mb-1.5">
                        Avantajlar & Güçlü Yönler
                      </h3>
                      <ul className="space-y-1.5">
                        {entity.advantages.map((adv, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Disadvantages / Limitations */}
                    <div className="mt-4">
                      <h3 className="text-xs font-bold text-amber-800 mb-1.5">
                        Dezavantajlar / Dikkat Edilmesi Gerekenler
                      </h3>
                      <ul className="space-y-1.5">
                        {entity.limitations.map((lim, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                            <Info className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Use Cases */}
                    <div className="mt-4">
                      <h3 className="text-xs font-bold text-slate-900 mb-1.5">Kullanım Alanları</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {entity.useCases.map((u, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px]"
                          >
                            {u.slice(0, 90)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Verified Source Links */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Doğrulanmış Kaynak Bağlantıları ({entity.sources.length})
                      </span>
                      {onExploreTopic && (
                        <button
                          type="button"
                          onClick={() => onExploreTopic(entity.canonicalTitle)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-chirmo-brand hover:underline"
                        >
                          <Sparkles className="w-3 h-3" /> AI İle Derinlemesine İncele
                        </button>
                      )}
                    </div>
                    {entity.sources.length === 0 ? (
                      <p className="text-xs text-slate-400">
                        Doğrudan eşleşen açık kaynak bağlantısı bulunamadı.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {entity.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-chirmo-brand-light/40 border border-slate-200/60 text-xs text-slate-700 hover:text-chirmo-brand transition-colors"
                          >
                            <span className="truncate font-medium">{src.title}</span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 shrink-0 ml-2">
                              {src.domain} <ExternalLink className="w-3 h-3" />
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Side-by-Side Structured Comparison Matrix Table */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Ölçülebilir Metrik ve Nitelik Karşılaştırma Tablosu
                </h3>
                <span className="text-[11px] text-slate-500">
                  Son Güncelleme: {comparison.timestamp}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                      <th className="py-3 px-4 w-1/4">Kriter / Boyut</th>
                      <th className="py-3 px-4 w-1/3 text-chirmo-brand">
                        {comparison.optionA.canonicalTitle}
                      </th>
                      <th className="py-3 px-4 w-1/3 text-slate-800">
                        {comparison.optionB.canonicalTitle}
                      </th>
                      <th className="py-3 px-4 text-right">Doğrulama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {comparison.comparisonRows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {row.dimension}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{row.valueA}</td>
                        <td className="py-3.5 px-4 text-slate-700">{row.valueB}</td>
                        <td className="py-3.5 px-4 text-right">
                          {row.verified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> Doğrulandı
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold">
                              <AlertCircle className="w-3 h-3" /> Kısmi / Eksik
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
