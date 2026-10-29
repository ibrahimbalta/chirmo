export interface AgentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'awaiting_approval';
  requiresApproval?: boolean;
  result?: string;
  error?: string;
}

export interface AgentPlan {
  goal: string;
  targetUrl?: string;
  steps: AgentStep[];
}

export interface ScrapedPageData {
  url: string;
  title: string;
  description: string;
  headings: string[];
  mainText: string;
  wordCount: number;
  linksCount: number;
}

export interface ResearchResult {
  summary: string;
  keyFindings: string[];
  sources: string[];
  scrapedData?: ScrapedPageData;
  timestamp: string;
}
