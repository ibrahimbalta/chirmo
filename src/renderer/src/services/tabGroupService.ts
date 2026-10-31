import { Tab, TabGroup } from '../types';

export interface GroupColorTheme {
  name: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  badge: string;
}

export const GROUP_COLOR_THEMES: Record<string, GroupColorTheme> = {
  purple: {
    name: 'Mor',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  blue: {
    name: 'Mavi',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  emerald: {
    name: 'Zümrüt',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  amber: {
    name: 'Kehribar',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  rose: {
    name: 'Gül',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-700 border-rose-200'
  },
  cyan: {
    name: 'Turkuaz',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
    badge: 'bg-cyan-100 text-cyan-700 border-cyan-200'
  }
};

interface CategoryRule {
  title: string;
  color: keyof typeof GROUP_COLOR_THEMES;
  keywords: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    title: '📚 Araştırma & Akademi',
    color: 'purple',
    keywords: [
      'wikipedia', 'openalex', 'arxiv', 'scholar', 'jstor', 'pubmed',
      'edu', 'research', 'bilim', 'makale', 'tez', 'kitap', 'wiki',
      'encyclopedia', 'paper', 'docs', 'reference'
    ]
  },
  {
    title: '💻 Yazılım & Teknoloji',
    color: 'blue',
    keywords: [
      'github', 'gitlab', 'stackoverflow', 'npmjs', 'developer',
      'vercel', 'react', 'typescript', 'python', 'rust', 'docker',
      'api', 'replit', 'huggingface', 'cursor', 'claude', 'openai',
      'chatgpt', 'gemini', 'ollama', 'code', 'kod'
    ]
  },
  {
    title: '📰 Haber & Medya',
    color: 'amber',
    keywords: [
      'news', 'haber', 'bbc', 'cnn', 'mynet', 'bundle', 'hürriyet',
      'sozcu', 'gazete', 'times', 'reuters', 'bloomberg', 'medium',
      'substack', 'gündem', 'son dakika', 'press'
    ]
  },
  {
    title: '🛒 Finans & Alışveriş',
    color: 'emerald',
    keywords: [
      'amazon', 'trendyol', 'hepsiburada', 'ebay', 'shop', 'store',
      'borsa', 'tradingview', 'döviz', 'altın', 'banka', 'kripto',
      'binance', 'coin', 'finance', 'finans', 'fiyat', 'satın al'
    ]
  },
  {
    title: '🎨 Tasarım & Yaratıcılık',
    color: 'rose',
    keywords: [
      'figma', 'dribbble', 'behance', 'canva', 'unsplash', 'pexels',
      'pinterest', 'design', 'tasarım', 'ui', 'ux', 'font', 'icon',
      'artstation', 'midjourney'
    ]
  },
  {
    title: '💬 Sosyal & Topluluk',
    color: 'cyan',
    keywords: [
      'twitter', 'x.com', 'linkedin', 'reddit', 'youtube', 'discord',
      'slack', 'telegram', 'instagram', 'facebook', 'forum', 'community'
    ]
  }
];

export class TabGroupService {
  private static STORAGE_KEY = 'chirmo_tab_groups_v1';

  /**
   * Classify a tab into a semantic category based on its title and URL.
   */
  public static classifyTab(tab: Tab): { title: string; color: string } {
    const textToAnalyze = `${tab.title || ''} ${tab.url || ''}`.toLowerCase();

    for (const rule of CATEGORY_RULES) {
      for (const kw of rule.keywords) {
        if (textToAnalyze.includes(kw)) {
          return { title: rule.title, color: rule.color };
        }
      }
    }

    // Domain fallback if URL exists
    try {
      const parsed = new URL(tab.url);
      const host = parsed.hostname.replace(/^www\./, '');
      const parts = host.split('.');
      if (parts.length > 0 && parts[0].length > 2) {
        const domainName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        return { title: `🌐 ${domainName}`, color: 'blue' };
      }
    } catch {
      // ignore
    }

    return { title: '⚡ Genel Çalışma', color: 'purple' };
  }

  /**
   * Automatically groups open tabs using AI / heuristic semantic classification.
   */
  public static autoGroupTabs(tabs: Tab[]): { updatedTabs: Tab[]; groups: TabGroup[] } {
    const groupMap = new Map<string, { title: string; color: string; tabIds: string[] }>();

    tabs.forEach((tab) => {
      // Keep pinned tabs separate
      if (tab.isPinned) return;

      const classification = this.classifyTab(tab);
      const groupKey = classification.title;

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          title: classification.title,
          color: classification.color,
          tabIds: []
        });
      }

      groupMap.get(groupKey)!.tabIds.push(tab.id);
    });

    const groups: TabGroup[] = [];
    const updatedTabs = tabs.map((tab) => ({ ...tab }));

    groupMap.forEach((gData, groupTitle) => {
      // Create a group if there is at least 1 tab classified
      const groupId = `grp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const group: TabGroup = {
        id: groupId,
        title: groupTitle,
        color: gData.color,
        isCollapsed: false,
        tabCount: gData.tabIds.length
      };
      groups.push(group);

      // Assign to tabs
      gData.tabIds.forEach((tId) => {
        const targetTab = updatedTabs.find((t) => t.id === tId);
        if (targetTab) {
          targetTab.groupId = groupId;
          targetTab.groupTitle = group.title;
          targetTab.groupColor = group.color;
        }
      });
    });

    this.saveGroups(groups);
    return { updatedTabs, groups };
  }

  /**
   * Creates a custom manual group for specific tabs.
   */
  public static createCustomGroup(
    title: string,
    color: string,
    tabIds: string[],
    tabs: Tab[],
    existingGroups: TabGroup[]
  ): { updatedTabs: Tab[]; groups: TabGroup[] } {
    const groupId = `grp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newGroup: TabGroup = {
      id: groupId,
      title: title.trim() || 'Yeni Grup',
      color: color || 'purple',
      isCollapsed: false,
      tabCount: tabIds.length
    };

    const updatedGroups = [...existingGroups.filter((g) => g.id !== groupId), newGroup];
    const updatedTabs = tabs.map((t) => {
      if (tabIds.includes(t.id)) {
        return {
          ...t,
          groupId: newGroup.id,
          groupTitle: newGroup.title,
          groupColor: newGroup.color
        };
      }
      return t;
    });

    this.saveGroups(updatedGroups);
    return { updatedTabs, groups: updatedGroups };
  }

  /**
   * Ungroups a specific group and restores tabs to standalone state.
   */
  public static ungroup(
    groupId: string,
    tabs: Tab[],
    existingGroups: TabGroup[]
  ): { updatedTabs: Tab[]; groups: TabGroup[] } {
    const updatedGroups = existingGroups.filter((g) => g.id !== groupId);
    const updatedTabs = tabs.map((t) => {
      if (t.groupId === groupId) {
        const { groupId: _, groupTitle: __, groupColor: ___, ...rest } = t;
        return rest as Tab;
      }
      return t;
    });

    this.saveGroups(updatedGroups);
    return { updatedTabs, groups: updatedGroups };
  }

  /**
   * Toggle collapsed status of a group.
   */
  public static toggleCollapse(groupId: string, existingGroups: TabGroup[]): TabGroup[] {
    const next = existingGroups.map((g) => {
      if (g.id === groupId) {
        return { ...g, isCollapsed: !g.isCollapsed };
      }
      return g;
    });
    this.saveGroups(next);
    return next;
  }

  /**
   * Saves groups to local persistence.
   */
  public static saveGroups(groups: TabGroup[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(groups));
    } catch {
      // ignore
    }
  }

  /**
   * Loads persisted groups.
   */
  public static loadGroups(): TabGroup[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
