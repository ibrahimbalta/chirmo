import { ToolExecutor } from './tool-executor';
import { resolveUrlOrSearch, isSecureUrl } from '../url-helper';

export interface PageAnalysisResult {
  url: string;
  title: string;
  metaDescription: string;
  wordCount: number;
  headings: string[];
  linksCount: number;
  isHttps: boolean;
  readabilityScore: string;
  topKeywords: { word: string; count: number }[];
  analyzedAt: string;
}

export interface LinkExtractionResult {
  url: string;
  internalLinks: string[];
  externalLinks: string[];
  totalLinks: number;
}

export class ToolsService {
  /**
   * Performs deep SEO, readability and metadata analysis of a web page.
   */
  public static async analyzePage(url: string): Promise<PageAnalysisResult> {
    const scraped = await ToolExecutor.scrapeWebPage(url);
    const parsedUrl = new URL(scraped.url);

    // Calculate word frequency and keywords
    const stopWords = new Set([
      've', 'veya', 'ile', 'bir', 'bu', 'da', 'de', 'için', 'çok', 'en', 'gibi',
      'daha', 'kadar', 'sonra', 'olan', 'olarak', 'the', 'and', 'or', 'in', 'of',
      'to', 'a', 'is', 'that', 'for', 'on', 'with', 'as', 'at', 'by', 'an', 'be',
    ]);

    const words = scraped.mainText
      .toLowerCase()
      .replace(/[^\p{L}\s]/gu, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w));

    const freqMap: { [word: string]: number } = {};
    for (const w of words) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }

    const topKeywords = Object.entries(freqMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Readability estimate
    let readability = 'Orta (Standart Web Dili)';
    if (scraped.wordCount > 1000) readability = 'Detaylı / Kapsamlı İçerik';
    else if (scraped.wordCount < 150) readability = 'Kısa / Özet Sayfa';

    return {
      url: scraped.url,
      title: scraped.title,
      metaDescription: scraped.description || 'Meta açıklama etiketi bulunamadı.',
      wordCount: scraped.wordCount,
      headings: scraped.headings,
      linksCount: scraped.linksCount,
      isHttps: isSecureUrl(scraped.url),
      readabilityScore: readability,
      topKeywords,
      analyzedAt: new Date().toISOString(),
    };
  }
}
