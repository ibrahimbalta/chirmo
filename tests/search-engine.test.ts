import { describe, it, expect } from 'vitest';
import { SearchEngineService } from '../src/renderer/src/services/searchEngine';
import { LiveWebScraper } from '../src/renderer/src/services/liveWebScraper';

describe('SearchEngineService', () => {
  it('resolves natural language prompts like mynet.com spor haberlerini listele to exact URLs', () => {
    const u1 = LiveWebScraper.resolveTargetUrlFromPrompt('mynet.com git spor haberlerini listele');
    expect(u1).toBe('https://spor.mynet.com');

    const u2 = LiveWebScraper.resolveTargetUrlFromPrompt('hurriyet.com.tr ekonomi haberlerini özetle');
    expect(u2).toBe('https://www.hurriyet.com.tr/ekonomi/');
  });
  it('correctly calculates mathematical expressions', () => {
    const res1 = SearchEngineService.detectInstantAnswer('1250 * 1.2');
    expect(res1).toBeDefined();
    expect(res1?.type).toBe('calculator');
    expect(res1?.result).toBe('1500');

    const res2 = SearchEngineService.detectInstantAnswer('hesapla: (100 + 50) / 3');
    expect(res2).toBeDefined();
    expect(res2?.result).toBe('50');

    const res3 = SearchEngineService.detectInstantAnswer('15% of 2000');
    expect(res3).toBeDefined();
    expect(res3?.result).toBe('300');
  });

  it('correctly converts currencies and units', () => {
    const curRes = SearchEngineService.detectInstantAnswer('100 usd to try');
    expect(curRes).toBeDefined();
    expect(curRes?.type).toBe('converter');
    expect(curRes?.result).toContain('TRY');

    const distRes = SearchEngineService.detectInstantAnswer('100 km to miles');
    expect(distRes).toBeDefined();
    expect(distRes?.type).toBe('converter');
    expect(distRes?.result).toContain('62.14 Mil');

    const kdvRes = SearchEngineService.detectInstantAnswer('10000 tl kdv');
    expect(kdvRes).toBeDefined();
    expect(kdvRes?.type).toBe('finance');
    expect(kdvRes?.result).toContain('12');

    const bmiRes = SearchEngineService.detectInstantAnswer('175 cm 75 kg');
    expect(bmiRes).toBeDefined();
    expect(bmiRes?.type).toBe('health');
    expect(bmiRes?.result).toContain('VKİ');
  });

  it('generates official petitions, contracts, and business plans for any topic', () => {
    const petition = SearchEngineService.generateDocumentTemplate('Tüketici İadesi', 'petition');
    expect(petition.title).toContain('Tüketici İadesi');
    expect(petition.content).toContain('SONUÇ VE İSTEM');

    const bizPlan = SearchEngineService.generateDocumentTemplate('Kahve Dükkanı', 'business_plan');
    expect(bizPlan.content).toContain('GELİR MODELİ');
  });

  it('matches offline knowledge base for tech concepts', () => {
    const techRes = SearchEngineService.detectInstantAnswer('React nedir');
    expect(techRes).toBeDefined();
    expect(techRes?.type).toBe('tech');
    expect(techRes?.title).toBe('React');
    expect(techRes?.codeSnippet).toBeDefined();

    const chirmoRes = SearchEngineService.detectInstantAnswer('chirmo');
    expect(chirmoRes).toBeDefined();
    expect(chirmoRes?.title).toContain('Chirmo');
  });

  it('builds weighted Decision Matrix for X vs Y comparisons', () => {
    const matrix = SearchEngineService.buildDecisionMatrix('React vs Svelte');
    expect(matrix).toBeDefined();
    expect(matrix?.optionA).toBe('React');
    expect(matrix?.optionB).toBe('Svelte');
    expect(matrix?.criteria.length).toBe(5);
  });

  it('performs full search with 4-lens perspectives, action blueprint, and knowledge graph nodes', async () => {
    const searchRes = await SearchEngineService.search('TypeScript');
    expect(searchRes.query).toBe('TypeScript');
    expect(searchRes.aiSynthesis).toBeDefined();
    expect(searchRes.aiSynthesis.perspectives.ceo).toBeDefined();
    expect(searchRes.aiSynthesis.perspectives.engineer).toBeDefined();
    expect(searchRes.aiSynthesis.perspectives.critic).toBeDefined();
    expect(searchRes.aiSynthesis.perspectives.eli5).toBeDefined();
    expect(searchRes.aiSynthesis.actionBlueprint.length).toBe(4);
    expect(searchRes.aiSynthesis.knowledgeNodes.length).toBe(6);
    expect(searchRes.aiSynthesis.temporal.past).toBeDefined();
    expect(searchRes.aiSynthesis.temporal.present).toBeDefined();
    expect(searchRes.aiSynthesis.temporal.future2036).toBeDefined();
    expect(searchRes.aiSynthesis.temporal.future2036.disruptionProbability).toBeGreaterThan(50);
    expect(searchRes.aiSynthesis.factCheck.verifiabilityScore).toBeGreaterThan(50);
    expect(searchRes.webResults.length).toBeGreaterThanOrEqual(2);
    expect(searchRes.relatedQuestions.length).toBe(4);
  });

  it('decomposes user goals into actionable Kanban tasks', () => {
    const tasks = SearchEngineService.decomposeGoalToKanban('SaaS Girişimi Kurmak');
    expect(tasks.length).toBe(4);
    expect(tasks.some((t) => t.column === 'todo')).toBe(true);
    expect(tasks.some((t) => t.column === 'doing')).toBe(true);
  });

  it('fetches live or fallback tech radar items', async () => {
    const radar = await SearchEngineService.fetchLiveTechRadar();
    expect(radar.length).toBeGreaterThan(0);
    expect(radar[0].title).toBeDefined();
  });

  it('indexes local projects and tasks offline', async () => {
    const searchRes = await SearchEngineService.search('e-ticaret', 'all', {
      projects: [
        {
          id: 'p1',
          name: 'E-Ticaret Sitesi Analizi',
          description: 'Rakip fiyatlarını inceleme',
          color: '#6652C9',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    });

    expect(searchRes.localResults.length).toBe(1);
    expect(searchRes.localResults[0].title).toBe('E-Ticaret Sitesi Analizi');
  });
});
