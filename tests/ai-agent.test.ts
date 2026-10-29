import { describe, it, expect } from 'vitest';
import { LocalHeuristicProvider } from '../src/main/ai/provider';
import { ScrapedPageData } from '../src/main/ai/types';

describe('AI Agent Planning and Synthesis Engine', () => {
  const provider = new LocalHeuristicProvider();

  it('should decompose a user prompt into a structured 3-step agent plan', async () => {
    const prompt = 'https://example.com sayfasını incele ve özet çıkar';
    const plan = await provider.createPlan(prompt);

    expect(plan.goal).toBe(prompt);
    expect(plan.targetUrl).toBe('https://example.com');
    expect(plan.steps.length).toBe(3);
    expect(plan.steps[0].status).toBe('pending');
    expect(plan.steps[1].title).toContain('Web Sayfasını Ziyaret Etme');
  });

  it('should flag sensitive operations for user approval', async () => {
    const sensitivePrompt = 'https://example.com adresindeki hesabı sil ve çıkış yap';
    const plan = await provider.createPlan(sensitivePrompt);

    expect(plan.steps[1].requiresApproval).toBe(true);
  });

  it('should synthesize a structured research report from scraped web data', async () => {
    const mockScraped: ScrapedPageData = {
      url: 'https://electronjs.org',
      title: 'Build cross-platform desktop apps with JavaScript, HTML, and CSS',
      description: 'Electron is a framework for building desktop applications.',
      headings: ['Features', 'Getting Started', 'Community'],
      mainText: 'Electron combines Chromium and Node.js into a single runtime. It allows developers to build rich desktop applications using web technologies. Security is a paramount concern in modern Electron apps.',
      wordCount: 28,
      linksCount: 15,
    };

    const report = await provider.generateResearchReport(
      'Electron mimarisini araştır',
      mockScraped
    );

    expect(report.sources).toContain('https://electronjs.org');
    expect(report.summary).toContain('Build cross-platform desktop apps');
    expect(report.summary).toContain('Features');
    expect(report.keyFindings.length).toBeGreaterThan(0);
  });
});
