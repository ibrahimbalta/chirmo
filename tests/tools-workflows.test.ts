import { describe, it, expect } from 'vitest';
import { WorkflowEngine } from '../src/main/ai/workflow-engine';

describe('Tools and Workflows Engine', () => {
  const mockDb: any = {
    createTask: (data: any) => ({ id: 'mock_task', ...data }),
    updateTask: () => {},
    addTaskLog: () => {},
  };

  it('should provide pre-configured templates for competitor analysis, SEO, and news digest', () => {
    const engine = new WorkflowEngine(mockDb);
    const templates = engine.getTemplates();

    expect(templates.length).toBeGreaterThanOrEqual(3);

    const ids = templates.map((t) => t.id);
    expect(ids).toContain('wf_competitor');
    expect(ids).toContain('wf_seo_audit');
    expect(ids).toContain('wf_news_digest');

    const competitorWf = templates.find((t) => t.id === 'wf_competitor');
    expect(competitorWf?.steps.length).toBe(3);
  });
});
