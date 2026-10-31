import { describe, it, expect, beforeEach } from 'vitest';
import { TabGroupService } from '../src/renderer/src/services/tabGroupService';
import { Tab } from '../src/renderer/src/types';

describe('TabGroupService', () => {
  beforeEach(() => {
    // Mock localStorage
    const store: Record<string, string> = {};
    global.localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
      length: 0,
      key: () => null
    } as any;
  });

  it('classifies academic and research tabs correctly', () => {
    const tab: Tab = {
      id: 't1',
      url: 'https://tr.wikipedia.org/wiki/Yapay_zeka',
      title: 'Yapay zekâ - Vikipedi',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isSecure: true
    };

    const res = TabGroupService.classifyTab(tab);
    expect(res.title).toContain('Araştırma & Akademi');
    expect(res.color).toBe('purple');
  });

  it('classifies developer and code tabs correctly', () => {
    const tab: Tab = {
      id: 't2',
      url: 'https://github.com/ibrahimbalta/chirmo',
      title: 'ibrahimbalta/chirmo: AI Desktop Browser',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
      isSecure: true
    };

    const res = TabGroupService.classifyTab(tab);
    expect(res.title).toContain('Yazılım & Teknoloji');
    expect(res.color).toBe('blue');
  });

  it('auto-groups multiple mixed tabs into semantic clusters', () => {
    const tabs: Tab[] = [
      {
        id: 't1',
        url: 'https://tr.wikipedia.org/wiki/Kuantum_hesaplama',
        title: 'Kuantum hesaplama',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isSecure: true
      },
      {
        id: 't2',
        url: 'https://github.com/facebook/react',
        title: 'React GitHub Repo',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isSecure: true
      },
      {
        id: 't3',
        url: 'https://arxiv.org/abs/2301.00001',
        title: 'Deep Learning Paper - arXiv',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isSecure: true
      }
    ];

    const { updatedTabs, groups } = TabGroupService.autoGroupTabs(tabs);
    expect(groups.length).toBeGreaterThanOrEqual(1);

    // Wikipedia and arXiv should share the Research group
    const wikiTab = updatedTabs.find((t) => t.id === 't1');
    const arxivTab = updatedTabs.find((t) => t.id === 't3');
    expect(wikiTab?.groupId).toBeDefined();
    expect(wikiTab?.groupId).toBe(arxivTab?.groupId);
    expect(wikiTab?.groupTitle).toContain('Araştırma');
  });

  it('supports un-grouping and collapsing groups', () => {
    const tabs: Tab[] = [
      {
        id: 't1',
        url: 'https://github.com',
        title: 'GitHub',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isSecure: true
      }
    ];

    const { updatedTabs, groups } = TabGroupService.autoGroupTabs(tabs);
    expect(groups.length).toBe(1);
    const grpId = groups[0].id;

    // Toggle collapse
    const collapsed = TabGroupService.toggleCollapse(grpId, groups);
    expect(collapsed[0].isCollapsed).toBe(true);

    // Ungroup
    const { updatedTabs: restoredTabs, groups: remainingGroups } =
      TabGroupService.ungroup(grpId, updatedTabs, collapsed);
    expect(remainingGroups.length).toBe(0);
    expect(restoredTabs[0].groupId).toBeUndefined();
  });
});
