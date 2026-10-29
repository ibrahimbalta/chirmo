import { AgentPlan, ScrapedPageData, ResearchResult } from './types';
import { resolveUrlOrSearch } from '../url-helper';

export interface AIProvider {
  createPlan(userPrompt: string, currentUrl?: string): Promise<AgentPlan>;
  generateResearchReport(
    goal: string,
    scrapedData: ScrapedPageData
  ): Promise<ResearchResult>;
}

export class LocalHeuristicProvider implements AIProvider {
  public async createPlan(userPrompt: string, currentUrl?: string): Promise<AgentPlan> {
    const trimmed = userPrompt.trim();

    // Extract URL if mentioned in prompt or fallback to current tab URL
    const urlMatch = trimmed.match(/https?:\/\/[^\s]+/);
    const targetUrl = urlMatch ? urlMatch[0] : currentUrl || resolveUrlOrSearch(trimmed);

    const isSensitive = 
      /satın al|öde|sil|form|şifre|giriş yap|kaydol|delete|pay|submit|login/i.test(trimmed);

    return {
      goal: trimmed,
      targetUrl,
      steps: [
        {
          id: 'step_1',
          title: 'Görevi ve Hedef Kaynağı Belirleme',
          description: `Kullanıcı talimatı analiz edildi. Hedef URL: ${targetUrl}`,
          status: 'pending',
        },
        {
          id: 'step_2',
          title: 'Web Sayfasını Ziyaret Etme ve Veri Ayıklama',
          description: 'Sayfadaki başlıklar, ana metin, meta açıklamaları güvenli şekilde taranıyor.',
          status: 'pending',
          requiresApproval: isSensitive,
        },
        {
          id: 'step_3',
          title: 'Bulguları Analiz Etme ve Raporlama',
          description: 'Toplanan verilerden özet, anahtar bulgular ve sonuç raporu derleniyor.',
          status: 'pending',
        },
      ],
    };
  }

  public async generateResearchReport(
    goal: string,
    scrapedData: ScrapedPageData
  ): Promise<ResearchResult> {
    const lines = scrapedData.mainText
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    // Pick top sentences for key findings
    const findings = lines.slice(0, 4);
    if (findings.length === 0) {
      findings.push(scrapedData.description || 'Sayfadan anlamlı özet metin elde edildi.');
    }

    const summary = `### Araştırma Hedefi: ${goal}

**İncelenen Web Sayfası:** ${scrapedData.title}  
**URL:** [${scrapedData.url}](${scrapedData.url})  
**Sayfa Boyutu:** ~${scrapedData.wordCount} kelime, ${scrapedData.linksCount} bağlantı.

#### Genel Özet
${scrapedData.description || findings[0] || 'Sayfa içeriği başarıyla tarandı ve analiz edildi.'}

#### Öne Çıkan Başlıklar
${scrapedData.headings.length > 0 
  ? scrapedData.headings.map((h) => `- ${h}`).join('\n') 
  : '- Sayfada belirgin alt başlık bulunamadı.'}

#### Temel Bulgular
${findings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

---
*Rapor Chirmo Araştırma Ajanı tarafından güvenli WebContentsView izolasyonunda taranarak üretilmiştir.*`;

    return {
      summary,
      keyFindings: findings,
      sources: [scrapedData.url],
      scrapedData,
      timestamp: new Date().toISOString(),
    };
  }
}

export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private fallback: LocalHeuristicProvider;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.fallback = new LocalHeuristicProvider();
  }

  public async createPlan(userPrompt: string, currentUrl?: string): Promise<AgentPlan> {
    return this.fallback.createPlan(userPrompt, currentUrl);
  }

  public async generateResearchReport(
    goal: string,
    scrapedData: ScrapedPageData
  ): Promise<ResearchResult> {
    if (!this.apiKey) {
      return this.fallback.generateResearchReport(goal, scrapedData);
    }

    try {
      const prompt = `Sen Chirmo masaüstü tarayıcısının profesyonel araştırma ajanısın.
Kullanıcının Görevi: "${goal}"
İncelenen Sayfa Başlığı: "${scrapedData.title}"
URL: "${scrapedData.url}"
Meta Açıklama: "${scrapedData.description}"
Sayfa Başlıkları: ${JSON.stringify(scrapedData.headings)}
Sayfa Metni (Özetlenmiş):
"${scrapedData.mainText.slice(0, 3000)}"

Lütfen bu web sayfası içeriğini analiz et ve Markdown formatında kurumsal, anlaşılır, Türkçe bir araştırma raporu üret.
Raporda şunlar olsun:
1. Kısa Yönetici Özeti
2. 3-5 Maddelik Temel Bulgular
3. Değerlendirme ve Sonuç`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!generatedText) {
        return this.fallback.generateResearchReport(goal, scrapedData);
      }

      return {
        summary: generatedText,
        keyFindings: [scrapedData.title, `${scrapedData.wordCount} kelime incelendi`],
        sources: [scrapedData.url],
        scrapedData,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('[GeminiProvider] Failed to call Gemini API, using local fallback:', err);
      return this.fallback.generateResearchReport(goal, scrapedData);
    }
  }
}
