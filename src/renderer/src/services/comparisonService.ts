// ============================================================================
// CHIRMO — SMART EVIDENCE-BASED COMPARISON ENGINE
// Compares two products, technologies, services, or concepts using real open
// APIs (Wikipedia TR/EN, GitHub, OpenAlex). Explicitly labels unverified/missing
// fields instead of inventing fake scores.
// ============================================================================

export interface ComparisonEntityProfile {
  name: string
  canonicalTitle: string
  categoryLabel: string
  summary: string
  thumbnailUrl?: string
  priceOrLicenseInfo: string
  isPriceVerified: boolean
  keyFeatures: string[]
  advantages: string[]
  limitations: string[]
  useCases: string[]
  metrics: {
    academicWorksCount: number | null
    githubStars: number | null
    githubLanguage: string | null
    githubLicense: string | null
    lastUpdated: string | null
  }
  sources: { title: string; url: string; domain: string }[]
}

export interface SmartComparisonResult {
  optionA: ComparisonEntityProfile
  optionB: ComparisonEntityProfile
  comparisonRows: {
    dimension: string
    valueA: string
    valueB: string
    verified: boolean
  }[]
  synthesisSummary: string
  timestamp: string
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
}

async function fetchJsonWithTimeout(url: string, timeoutMs = 1800): Promise<any | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) return null
    return await res.json()
  } catch {
    clearTimeout(timer)
    return null
  }
}

export class ComparisonService {
  static async fetchEntityProfile(rawName: string): Promise<ComparisonEntityProfile> {
    const cleanName = rawName.trim()
    const sources: { title: string; url: string; domain: string }[] = []

    let canonicalTitle = cleanName
    let categoryLabel = 'Kavram / Seçenek'
    let summary = ''
    let thumbnailUrl: string | undefined
    let lastUpdated: string | null = null
    let academicWorksCount: number | null = null
    let githubStars: number | null = null
    let githubLanguage: string | null = null
    let githubLicense: string | null = null

    // Run Wikipedia, OpenAlex, and GitHub queries in parallel with strict timeouts
    const [wikiResult, oaData, ghData] = await Promise.all([
      (async () => {
        const searchUrl = `https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanName)}&utf8=&format=json&origin=*&srlimit=2`
        const searchData = await fetchJsonWithTimeout(searchUrl, 1600)
        const firstHit = searchData?.query?.search?.[0]
        if (firstHit?.title) {
          const sumData = await fetchJsonWithTimeout(
            `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstHit.title)}`,
            1500
          )
          if (sumData?.extract) {
            return {
              title: firstHit.title as string,
              lastUpdated: firstHit.timestamp ? String(firstHit.timestamp).slice(0, 10) : null,
              summary: sumData.extract as string,
              categoryLabel: (sumData.description as string) || 'Ansiklopedik Kayıt',
              thumbnailUrl: sumData.thumbnail?.source as string | undefined,
              url:
                sumData.content_urls?.desktop?.page ||
                `https://tr.wikipedia.org/wiki/${encodeURIComponent(firstHit.title)}`,
              domain: 'tr.wikipedia.org',
              lang: 'TR'
            }
          }
        }
        // Fallback to EN Wikipedia
        const enSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanName)}&utf8=&format=json&origin=*&srlimit=1`
        const enSearchData = await fetchJsonWithTimeout(enSearchUrl, 1500)
        const hit = enSearchData?.query?.search?.[0]
        if (hit?.title) {
          const enSumData = await fetchJsonWithTimeout(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`,
            1500
          )
          if (enSumData?.extract) {
            return {
              title: hit.title as string,
              lastUpdated: hit.timestamp ? String(hit.timestamp).slice(0, 10) : null,
              summary: enSumData.extract as string,
              categoryLabel: (enSumData.description as string) || 'Küresel Ansiklopedik Kayıt',
              thumbnailUrl: enSumData.thumbnail?.source as string | undefined,
              url:
                enSumData.content_urls?.desktop?.page ||
                `https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`,
              domain: 'en.wikipedia.org',
              lang: 'EN'
            }
          }
        }
        return null
      })(),
      fetchJsonWithTimeout(
        `https://api.openalex.org/works?search=${encodeURIComponent(cleanName)}&per-page=2`,
        1800
      ),
      fetchJsonWithTimeout(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(cleanName)}&sort=stars&per_page=1`,
        1800
      )
    ])

    if (wikiResult) {
      canonicalTitle = wikiResult.title
      lastUpdated = wikiResult.lastUpdated
      summary = wikiResult.summary
      categoryLabel = wikiResult.categoryLabel
      thumbnailUrl = wikiResult.thumbnailUrl
      sources.push({
        title: `${canonicalTitle} — Wikipedia (${wikiResult.lang})`,
        url: wikiResult.url,
        domain: wikiResult.domain
      })
    }

    if (oaData?.meta) {
      academicWorksCount = oaData.meta.count ?? null
      const topPaper = oaData.results?.[0]
      if (topPaper?.title) {
        sources.push({
          title: `Akademik Çalışma: ${topPaper.title.slice(0, 70)} (${topPaper.publication_year || ''})`,
          url: topPaper.doi || topPaper.id || 'https://openalex.org',
          domain: 'openalex.org'
        })
      }
    }

    if (ghData?.items?.[0]) {
      const repo = ghData.items[0]
      const repoMatch =
        repo.name?.toLowerCase().includes(cleanName.toLowerCase()) ||
        cleanName.toLowerCase().includes(repo.name?.toLowerCase() || '___')
      if (repoMatch && repo.stargazers_count > 50) {
        githubStars = repo.stargazers_count
        githubLanguage = repo.language || null
        githubLicense = repo.license?.spdx_id || repo.license?.name || null
        sources.push({
          title: `GitHub: ${repo.full_name} (★ ${repo.stargazers_count.toLocaleString('tr-TR')})`,
          url: repo.html_url,
          domain: 'github.com'
        })
      }
    }

    // Extract structured factual sentences from summary without inventing anything
    const sentences = splitSentences(summary)

    // Price / License detection from real sources
    let priceOrLicenseInfo =
      'Doğrulanmış açık kaynak fiyat verisi bulunamadı (Resmi satıcı / güncel liste fiyatı kontrol edilmelidir)'
    let isPriceVerified = false

    const priceSentence = sentences.find((s) =>
      /\b(ücretsiz|açık kaynak|open-source|free|lisans|abonelik|fiyat|\$|€|₺|dolar|euro)\b/i.test(s)
    )
    if (githubLicense && githubLicense !== 'NOASSERTION') {
      priceOrLicenseInfo = `Açık Kaynak (${githubLicense} Lisansı — Ücretsiz kullanım)`
      isPriceVerified = true
    } else if (priceSentence) {
      priceOrLicenseInfo = priceSentence
      isPriceVerified = true
    }

    const keyFeatures =
      sentences.length > 0
        ? sentences.slice(0, 3)
        : ['Bu seçenek için birincil ansiklopedik özet kaydı bulunamadı.']

    // Extract advantage/strength cues from real text or metrics
    const advantages: string[] = []
    if (githubStars && githubStars > 1000) {
      advantages.push(
        `GitHub üzerinde ${githubStars.toLocaleString('tr-TR')} yıldız ile geniş açık kaynak geliştirici desteğine sahiptir.`
      )
    }
    if (academicWorksCount && academicWorksCount > 100) {
      advantages.push(
        `OpenAlex indeksinde ${academicWorksCount.toLocaleString('tr-TR')} bilimsel yayın/atıf ile güçlü literatür karşılığı bulunur.`
      )
    }
    if (sentences[1]) {
      advantages.push(sentences[1])
    }
    if (advantages.length === 0) {
      advantages.push(
        'Doğrulanmış kaynaklarda spesifik üstünlük/avantaj iddiası yer almamaktadır; tarafsız inceleme önerilir.'
      )
    }

    // Limitations / Considerations
    const limitations: string[] = []
    const limitationSentence = sentences.find((s) =>
      /\b(ancak|bununla birlikte|eleştiri|sınırlı|dezavantaj|zorluk|maliyet|gerektirir|however|although)\b/i.test(
        s
      )
    )
    if (limitationSentence) {
      limitations.push(limitationSentence)
    } else {
      limitations.push(
        'Birincil ansiklopedik kaynaklarda doğrudan raporlanmış bir kısıtlama metni bulunmadı; kullanım senaryosuna göre değerlendirilmelidir.'
      )
    }

    // Use cases
    const useCases: string[] = []
    if (categoryLabel && categoryLabel !== 'Kavram / Seçenek') {
      useCases.push(`Temel Alan: ${categoryLabel}`)
    }
    if (githubLanguage) {
      useCases.push(`Yazılım / Teknoloji Ekosistemi: ${githubLanguage} tabanlı projeler`)
    }
    if (sentences[0]) {
      useCases.push(sentences[0])
    }

    return {
      name: cleanName,
      canonicalTitle,
      categoryLabel,
      summary:
        summary ||
        `"${cleanName}" için Wikipedia üzerinde doğrudan özet metin bulunamadı. Aşağıdaki doğrulanmış dış kaynak bağlantıları üzerinden inceleyebilirsiniz.`,
      thumbnailUrl,
      priceOrLicenseInfo,
      isPriceVerified,
      keyFeatures,
      advantages,
      limitations,
      useCases,
      metrics: {
        academicWorksCount,
        githubStars,
        githubLanguage,
        githubLicense,
        lastUpdated
      },
      sources
    }
  }

  static async compare(rawOptionA: string, rawOptionB: string): Promise<SmartComparisonResult> {
    const [optionA, optionB] = await Promise.all([
      this.fetchEntityProfile(rawOptionA),
      this.fetchEntityProfile(rawOptionB)
    ])

    const comparisonRows: SmartComparisonResult['comparisonRows'] = [
      {
        dimension: 'Kategori / Tanım',
        valueA: optionA.categoryLabel,
        valueB: optionB.categoryLabel,
        verified: Boolean(optionA.summary && optionB.summary)
      },
      {
        dimension: 'Fiyat / Lisans Modeli',
        valueA: optionA.priceOrLicenseInfo,
        valueB: optionB.priceOrLicenseInfo,
        verified: optionA.isPriceVerified && optionB.isPriceVerified
      },
      {
        dimension: 'Akademik & Bilimsel Literatür Hacmi (OpenAlex)',
        valueA:
          optionA.metrics.academicWorksCount !== null
            ? `${optionA.metrics.academicWorksCount.toLocaleString('tr-TR')} bilimsel yayın`
            : 'Doğrulanmış veri yok',
        valueB:
          optionB.metrics.academicWorksCount !== null
            ? `${optionB.metrics.academicWorksCount.toLocaleString('tr-TR')} bilimsel yayın`
            : 'Doğrulanmış veri yok',
        verified:
          optionA.metrics.academicWorksCount !== null ||
          optionB.metrics.academicWorksCount !== null
      },
      {
        dimension: 'Açık Kaynak & Topluluk Etkileşimi (GitHub)',
        valueA:
          optionA.metrics.githubStars !== null
            ? `★ ${optionA.metrics.githubStars.toLocaleString('tr-TR')} yıldız (${optionA.metrics.githubLanguage || 'Çoklu Dil'})`
            : 'Yazılım deposu eşleşmesi yok / Ticari ürün',
        valueB:
          optionB.metrics.githubStars !== null
            ? `★ ${optionB.metrics.githubStars.toLocaleString('tr-TR')} yıldız (${optionB.metrics.githubLanguage || 'Çoklu Dil'})`
            : 'Yazılım deposu eşleşmesi yok / Ticari ürün',
        verified: optionA.metrics.githubStars !== null || optionB.metrics.githubStars !== null
      },
      {
        dimension: 'Son Kaynak Güncellemesi',
        valueA: optionA.metrics.lastUpdated || 'Belirtilmemiş',
        valueB: optionB.metrics.lastUpdated || 'Belirtilmemiş',
        verified: Boolean(optionA.metrics.lastUpdated || optionB.metrics.lastUpdated)
      }
    ]

    const totalSources = optionA.sources.length + optionB.sources.length
    const synthesisSummary = `Bu karşılaştırma tablosu "${optionA.canonicalTitle}" ve "${optionB.canonicalTitle}" için taranan ${totalSources} doğrulanmış açık kaynaktan (Wikipedia, OpenAlex, GitHub) elde edilen gerçek verilerle oluşturulmuştur. Rastgele puanlama yapılmamıştır; açık kaynaklarda yer almayan ticari fiyat/stok verileri şeffaflık ilkesi gereği işaretlenmiştir.`

    return {
      optionA,
      optionB,
      comparisonRows,
      synthesisSummary,
      timestamp: new Date().toLocaleString('tr-TR')
    }
  }
}
