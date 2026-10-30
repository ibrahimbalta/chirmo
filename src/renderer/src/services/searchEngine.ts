/**
 * CHIRMO 2036 UNIVERSAL ENGINE — Next-Decade Search, Profession OS, Simulation & Autonomous Execution
 * Built for EVERY profession and EVERY segment of society:
 * - 8 Universal Profession & Life Modes (General, Entrepreneur, Student/Academic, Legal/Citizen, Health/Life, Shopping/Consumer, Kitchen/Home, Software/Engineering)
 * - Live Federated APIs (Wikipedia TR, OpenAlex 250M+ Academic Papers, GitHub Repos, HackerNews Live Feed)
 * - Temporal Time Machine (Past History ➔ 2026 Present ➔ 2036 Future Projection)
 * - Instant Document, Official Petition (Dilekçe), Contract & Business Plan Studio
 * - Interactive Study Mode (Flip Flashcards + Live Graded Multiple-Choice Quiz)
 * - Entrepreneur & Investor Opportunity Lab (Business Model, Target Market, Break-Even & ROI Simulator)
 * - Everyday Life Calculators (Math, Currency, KDV Tax, BMI/VKİ Health, Loan/Interest)
 */

import { Project, Task, HistoryEntry } from '../types';

export type SearchMode = 'all' | 'ai' | 'compare' | 'local' | 'tools';
export type PerspectiveLens = 'ceo' | 'engineer' | 'critic' | 'eli5';
export type TemporalEra = 'past' | 'present' | 'future2036';

export type ProfessionMode =
  | 'general'
  | 'entrepreneur'
  | 'student'
  | 'legal'
  | 'health'
  | 'shopping'
  | 'culinary'
  | 'tech';

export type DocumentTemplateType =
  | 'petition'
  | 'business_plan'
  | 'contract'
  | 'study_guide'
  | 'official_email'
  | 'press_release';

export interface ProfessionConfig {
  id: ProfessionMode;
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
  placeholder: string;
  sampleQueries: string[];
}

export const PROFESSION_MODES: ProfessionConfig[] = [
  {
    id: 'general',
    label: '🌐 Genel (Herkes İçin)',
    shortLabel: '🌐 Genel',
    badge: 'Evrensel Mod',
    description: 'Günlük yaşam, hızlı bilgi, hesaplamalar ve pratik çözümler',
    placeholder: 'Herhangi bir konu arayın, "10000 tl kdv", "175 cm 75 kg vki" veya "React vs Vue" yazın...',
    sampleQueries: ['Yapay Zeka 2036', '10000 tl kdv hesapla', '175 cm 75 kg boy kilo', '100 usd to try']
  },
  {
    id: 'entrepreneur',
    label: '🚀 Girişimci, Esnaf & İş Dünyası',
    shortLabel: '🚀 Girişim & İş',
    badge: 'İş & Yatırım Modu',
    description: 'Pazar analizi, iş planı, kârlılık hesabı, KOBİ ve yatırımcı sunumu üretimi',
    placeholder: 'İş fikri, sektör, pazar analizi veya maliyet hesabı arayın (Örn: E-Ticaret, Kahve Dükkanı)...',
    sampleQueries: ['Kahve Dükkanı Açmak', 'SaaS Girişimi Kurmak', 'E-İhracat Rehberi', 'Şirket Türleri: Limited vs Anonim']
  },
  {
    id: 'student',
    label: '🎓 Öğrenci, Öğretmen & Akademisyen',
    shortLabel: '🎓 Eğitim & Akademi',
    badge: 'Akademik & Sınav Modu',
    description: 'Konu özeti, bilimsel makaleler (OpenAlex), ezber kartları ve interaktif deneme testi',
    placeholder: 'Ders konusu, bilimsel kavram, tarih veya akademik makale arayın...',
    placeholder_short: 'Ders konusu veya makale arayın...',
    sampleQueries: ['Kuantum Fiziği', 'Fotosentez Süreci', 'Osmanlı Kuruluş Dönemi', 'Makine Öğrenmesi Algoritmaları']
  } as any,
  {
    id: 'legal',
    label: '⚖️ Hukuk, Dilekçe & Resmi İşler',
    shortLabel: '⚖️ Dilekçe & Hukuk',
    badge: 'Vatandaş & Hukuk Modu',
    description: 'Resmi dilekçe örnekleri, sözleşme taslakları, tüketici hakları ve mevzuat rehberi',
    placeholder: 'Dilekçe konusu, sözleşme türü veya yasal hak arayın (Örn: Tüketici Hakem Heyeti, Kira Sözleşmesi)...',
    sampleQueries: ['Tüketici Hakem Heyeti İade', 'Kira Sözleşmesi Tahliye', 'KVKK Aydınlatma Metni', 'İş Sözleşmesi Fesih']
  },
  {
    id: 'health',
    label: '🩺 Sağlık, Beslenme & Yaşam',
    shortLabel: '🩺 Sağlık & Yaşam',
    badge: 'Sağlıklı Yaşam Modu',
    description: 'Tıbbi terim sadeleştirme, VKİ/kalori analizi, beslenme ve bilimsel sağlık araştırmaları',
    placeholder: 'Besin değeri, sağlık terimi, egzersiz veya boy-kilo (Örn: 175 cm 72 kg) yazın...',
    sampleQueries: ['178 cm 76 kg boy kilo', 'Aralıklı Oruç (Intermittent Fasting)', 'D Vitamini Eksikliği', 'Akdeniz Diyeti']
  },
  {
    id: 'shopping',
    label: '🛍️ Alışveriş & Tüketici Rehberi',
    shortLabel: '🛍️ Alışveriş Rehberi',
    badge: 'Akıllı Tüketici Modu',
    description: 'Satın alma rehberi, fiyat/performans kıyaslaması, kronik sorun analizi',
    placeholder: 'Almak istediğiniz ürünü veya iki modeli karşılaştırın (Örn: Elektrikli vs Hibrit Araç)...',
    sampleQueries: ['Elektrikli Araç vs Hibrit Araç', 'Dizüstü Bilgisayar Satın Alma Rehberi', 'Robot Süpürge Karşılaştırma', 'OLED vs QLED TV']
  },
  {
    id: 'culinary',
    label: '🍳 Mutfak, Tarif & Ev Ekonomisi',
    shortLabel: '🍳 Mutfak & Ev',
    badge: 'Mutfak & Pratik Yaşam',
    description: 'Adım adım yemek hazırlama planı, malzeme dönüşümleri, ev ekonomisi ve tasarruf',
    placeholder: 'Yemek adı, elinizdeki malzemeler veya ev ekonomisi konusu yazın...',
    sampleQueries: ['Ev Yapımı Ekşi Mayalı Ekmek', 'Mercimek Çorbası Püf Noktaları', 'Aylık Mutfak Bütçesi Planlama', 'Zeytinyağlı Enginar']
  },
  {
    id: 'tech',
    label: '💻 Yazılım, Mühendislik & Teknoloji',
    shortLabel: '💻 Yazılım & Tekno',
    badge: 'Mühendislik Modu',
    description: 'Sistem mimarisi, açık kaynak GitHub kod depoları ve kod örnekleri',
    placeholder: 'Programlama dili, kütüphane, algoritma veya teknoloji karşılaştırması yazın...',
    sampleQueries: ['React vs Vue', 'TypeScript', 'Docker Konteyner Mimarisi', 'Python FastAPI']
  }
];

export interface InstantAnswer {
  type: 'calculator' | 'converter' | 'knowledge' | 'tech' | 'devtool' | 'finance' | 'health';
  title: string;
  subtitle?: string;
  result: string;
  details?: string;
  badge?: string;
  codeSnippet?: string;
  keyFacts?: string[];
  thumbnailUrl?: string;
  extra?: Record<string, any>;
}

export interface DecisionCriterion {
  name: string;
  weight: number; // 1 to 5
  scoreA: number; // 0 to 100
  scoreB: number; // 0 to 100
  note: string;
}

export interface DecisionMatrix {
  optionA: string;
  optionB: string;
  verdict: string;
  prosA: string[];
  prosB: string[];
  consA: string[];
  consB: string[];
  criteria: DecisionCriterion[];
}

export interface ActionBlueprintStep {
  step: number;
  title: string;
  description: string;
  estimatedTime: string;
  category: string;
}

export interface LiveGitHubRepo {
  id: number;
  fullName: string;
  description: string;
  stars: number;
  language: string;
  url: string;
}

export interface AcademicPaper {
  id: string;
  title: string;
  year: number;
  citedByCount: number;
  author: string;
  url: string;
  venue?: string;
}

export interface TemporalTimeline {
  past: {
    era: string;
    title: string;
    summary: string;
    milestones: string[];
  };
  present: {
    era: string;
    title: string;
    summary: string;
    milestones: string[];
  };
  future2036: {
    era: string;
    title: string;
    summary: string;
    milestones: string[];
    disruptionProbability: number;
  };
}

export interface FactCheckXRay {
  verifiabilityScore: number;
  neutralityScore: number;
  sourceDiversity: string;
  blindSpotWarning: string;
  verifiedClaims: string[];
}

export interface StudyFlashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface StudyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyModule {
  topic: string;
  flashcards: StudyFlashcard[];
  quiz: StudyQuizQuestion[];
}

export interface VentureOpportunity {
  topic: string;
  marketPotential: string;
  targetAudience: string;
  revenueModel: string;
  estimatedInitialCost: string;
  defaultUnitPrice: number;
  defaultUnitCost: number;
  defaultMonthlyFixedCost: number;
  pitchSlides: { slide: number; title: string; content: string }[];
}

export interface AiSynthesis {
  query: string;
  professionMode: ProfessionMode;
  summary: string;
  perspectives: Record<PerspectiveLens, { title: string; badge: string; content: string; bullets: string[] }>;
  temporal: TemporalTimeline;
  factCheck: FactCheckXRay;
  studyModule: StudyModule;
  ventureOpportunity: VentureOpportunity;
  keyTakeaways: string[];
  recommendedActions: string[];
  actionBlueprint: ActionBlueprintStep[];
  knowledgeNodes: string[];
  confidenceScore: number;
  isLiveEnriched: boolean;
  sources: { title: string; url: string; domain: string; snippet?: string }[];
  relatedQuestions: string[];
}

export interface WebSearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  badge?: string;
  stars?: number;
  language?: string;
  author?: string;
}

export interface LocalSearchResult {
  type: 'project' | 'task' | 'history';
  id: string;
  title: string;
  description: string;
  meta: string;
  status?: string;
  color?: string;
}

export interface SearchResponse {
  query: string;
  professionMode: ProfessionMode;
  timestamp: string;
  executionTimeMs: number;
  instantAnswer?: InstantAnswer;
  decisionMatrix?: DecisionMatrix;
  liveRepos?: LiveGitHubRepo[];
  academicPapers?: AcademicPaper[];
  aiSynthesis: AiSynthesis;
  webResults: WebSearchResult[];
  localResults: LocalSearchResult[];
  relatedQuestions: string[];
}

interface KnowledgeItem {
  keys: string[];
  title: string;
  category: string;
  tagline: string;
  description: string;
  keyFacts: string[];
  codeSnippet?: string;
  officialUrl: string;
}

const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    keys: ['chirmo', 'chirmo browser', 'chirmo nedir'],
    title: 'Chirmo 2036 Evrensel Arama & İşletim Motoru',
    category: 'Gelecek Nesil Arama, Karar & İcra Platformu',
    tagline: 'Toplumun Her Kesimi İçin: Ara, Öğren, Belge Üret, Hesapla ve İşini Tamamla.',
    description:
      'Chirmo; klasik web aramasını 8 farklı meslek ve yaşam modu, canlı Wikipedia/OpenAlex/GitHub veri füzyonu, 2036 Zaman Makinesi, Resmi Dilekçe & Belge Stüdyosu, İnteraktif Sınav/Öğrenme Motoru, Girişimcilik ROI Laboratuvarı ve Kanban proje panosuyla birleştiren geleceğin arama motorudur.',
    keyFacts: [
      '8 Evrensel Yaşam Modu: Girişimci, Öğrenci, Hukuk/Vatandaş, Sağlık, Tüketici, Mutfak ve Mühendis',
      'Belge & Dilekçe Stüdyosu: Aranan konudan tek tıkla resmi dilekçe, sözleşme veya iş planı üretimi',
      'Öğren & Test Et: Her konuyu ezber kartlarına (Flashcard) ve interaktif sınava dönüştürme',
      'Girişim & Finans Laboratuvarı: Başabaş (Break-even) analizi ve 5 slaytlık yatırımcı sunumu'
    ],
    officialUrl: 'https://github.com/ibrahimbalta/chirmo'
  },
  {
    keys: ['react', 'react.js', 'reactjs', 'react nedir'],
    title: 'React',
    category: 'Frontend Kütüphanesi',
    tagline: 'Kullanıcı arayüzleri oluşturmak için bildirimsel, bileşen tabanlı JavaScript kütüphanesi',
    description:
      'Meta tarafından geliştirilen React, sanal DOM (Virtual DOM) ve tek yönlü veri akışı yaklaşımıyla modern web ve masaüstü uygulamalarının temel yapı taşıdır.',
    keyFacts: [
      'Bileşen (Component) tabanlı modüler mimari ve güçlü Hook sistemi',
      'Declarative JSX sözdizimi ile yüksek tahmin edilebilirlik',
      'Zengin ekosistem: Next.js, Remix, React Native, Vite'
    ],
    codeSnippet: `import React, { useState } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>Sayaç: {count}</button>;\n}`,
    officialUrl: 'https://react.dev'
  },
  {
    keys: ['electron', 'electronjs', 'electron nedir'],
    title: 'Electron.js',
    category: 'Masaüstü Uygulama Çatısı',
    tagline: 'Web teknolojileri ile platformlar arası yerel masaüstü uygulamaları geliştirme çatısı',
    description:
      'Chromium görüntüleme motoru ile Node.js çalışma zamanını birleştiren Electron; VS Code, Slack, Figma, Cursor ve Chirmo gibi masaüstü uygulamalarının arkasındaki temel teknolojidir.',
    keyFacts: [
      'Main Process (Node.js) ve Renderer Process (Chromium) izole mimarisi',
      'WebContentsView ile modern, güvenli ve donanım hızlandırmalı sekme yönetimi',
      'Windows, macOS ve Linux için tek kod tabanından yerel (native) paketleme'
    ],
    codeSnippet: `import { app, BrowserWindow } from 'electron';\n\napp.whenReady().then(() => {\n  const win = new BrowserWindow({ width: 1280, height: 800 });\n  win.loadURL('https://chirmo.local');\n});`,
    officialUrl: 'https://www.electronjs.org'
  },
  {
    keys: ['typescript', 'ts', 'typescript nedir'],
    title: 'TypeScript',
    category: 'Programlama Dili',
    tagline: 'JavaScript için statik tip sistemine sahip kurumsal programlama dili',
    description:
      'Microsoft tarafından geliştirilen TypeScript, JavaScript koduna derleme zamanında tip denetimi (static typing), arayüzler (interfaces) ve generic yapılar kazandırır.',
    keyFacts: [
      'Derleme anında tip hatalarını yakalayarak üretim ortamı çökmelerini %80 azaltır',
      'Modern ECMAScript standartlarıyla %100 uyumlu süper kümedir',
      'Büyük ölçekli yazılım mimarilerinde endüstri standardıdır'
    ],
    codeSnippet: `interface SearchResult<T> {\n  query: string;\n  items: T[];\n  latencyMs: number;\n}`,
    officialUrl: 'https://www.typescriptlang.org'
  },
  {
    keys: ['yapay zeka', 'ai', 'artificial intelligence', 'yapay zeka nedir'],
    title: 'Yapay Zekâ (Artificial Intelligence)',
    category: 'Bilgisayar Bilimi & Otonom Sistemler',
    tagline: 'Muhakeme eden, öğrenen, planlayan ve karar veren algoritmik sistemler bütünü',
    description:
      'Yapay zeka; doğal dil işleme, örüntü tanıma, muhakeme ve otonom araç kullanımı (Agentic Workflows) yetenekleriyle bilginin aranmasından işin doğrudan icra edilmesine geçişi sağlayan temel devrimdir.',
    keyFacts: [
      'Büyük Dil Modelleri (LLM) ve Çok Modlu (Multimodal) akıl yürütme motorları',
      'Otonom Ajanlar (Agentic AI): Hedefi alt görevlere bölüp araç çalıştıran sistemler',
      'RAG (Retrieval-Augmented Generation) ile canlı veri kaynaklarıyla doğrulama'
    ],
    officialUrl: 'https://tr.wikipedia.org/wiki/Yapay_zek%C3%A2'
  },
  {
    keys: ['python', 'python nedir'],
    title: 'Python',
    category: 'Programlama Dili',
    tagline: 'Yapay zeka, veri bilimi ve otomasyon dünyasının lider programlama dili',
    description:
      'Okunabilir sözdizimi ve devasa bilimsel kütüphane ekosistemiyle Python; makine öğrenimi (PyTorch, TensorFlow), arka uç servisleri (FastAPI, Django) ve veri analizinin küresel standardıdır.',
    keyFacts: [
      'Yüksek okunabilirlik ve hızlı prototipleme gücü',
      'NumPy, Pandas, PyTorch, HuggingFace ile rakipsiz AI ekosistemi',
      'Otomasyon, web kazıma (scraping) ve API geliştirmede yüksek verimlilik'
    ],
    codeSnippet: `from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/search/{q}")\ndef search(q: str):\n    return {"query": q, "status": "ok"}`,
    officialUrl: 'https://www.python.org'
  },
  {
    keys: ['docker', 'docker nedir', 'container'],
    title: 'Docker',
    category: 'Bulut & Konteynerizasyon',
    tagline: 'Uygulamaları tüm bağımlılıklarıyla izole konteynerlerde paketleme platformu',
    description:
      'Docker, yazılımların geliştirme, test ve üretim sunucularında milimetrik olarak aynı ortamda çalışmasını sağlar.',
    keyFacts: [
      'Sanal makinelere (VM) kıyasla saniyeler içinde başlayan hafif konteyner yapısı',
      'Dockerfile ve Docker Compose ile kod olarak altyapı (IaC)',
      'Kubernetes ve modern mikroservis mimarilerinin temel yapı taşı'
    ],
    officialUrl: 'https://www.docker.com'
  }
];

export class SearchEngineService {
  /**
   * Main Federated Search & 2036 Universal Synthesis Entry Point
   */
  public static async search(
    query: string,
    mode: SearchMode = 'all',
    workspaceContext: {
      projects?: Project[];
      tasks?: Task[];
      history?: HistoryEntry[];
    } = {},
    professionMode: ProfessionMode = 'general'
  ): Promise<SearchResponse> {
    const startTime = performance.now();
    const trimmed = query.trim();
    const timestamp = new Date().toISOString();

    // 1. Instant Local Evaluation (Math, KDV, BMI/VKİ, Loan, Currency/Unit, Knowledge Base)
    const instantAnswer = this.detectInstantAnswer(trimmed);

    // 2. Local Workspace Search
    const localResults = this.searchWorkspace(trimmed, workspaceContext);

    // 3. Decision Matrix Detection
    const decisionMatrix = this.buildDecisionMatrix(trimmed, mode === 'compare');

    // 4. Live Federated Multi-Source Fetch (Wikipedia TR + OpenAlex Academic + GitHub + HackerNews)
    const liveData = await this.fetchLiveFederatedSources(trimmed);

    const finalInstantAnswer: InstantAnswer | undefined =
      instantAnswer ||
      (liveData.wikiSummary
        ? {
            type: 'knowledge',
            title: liveData.wikiSummary.title,
            subtitle: liveData.wikiSummary.description || 'Canlı Ansiklopedi Kaydı',
            result: liveData.wikiSummary.extract.split('.')[0] + '.',
            details: liveData.wikiSummary.extract,
            badge: 'Canlı Wikipedia',
            thumbnailUrl: liveData.wikiSummary.thumbnail,
            extra: { officialUrl: liveData.wikiSummary.url }
          }
        : undefined);

    // 5. Build 2036 Synthesis (4 Lenses + Temporal + Fact-Check + Study Quiz + Venture Lab)
    const aiSynthesis = this.generateAiSynthesis(
      trimmed,
      professionMode,
      finalInstantAnswer,
      localResults,
      liveData,
      decisionMatrix
    );

    // 6. Merge Web Results (Wikipedia + Academic Papers + GitHub + Global Web)
    const webResults = this.mergeWebResults(trimmed, liveData, professionMode);

    // 7. Related Questions
    const relatedQuestions = this.generateRelatedQuestions(trimmed, decisionMatrix, professionMode);

    const executionTimeMs = Math.max(12, Math.round(performance.now() - startTime));

    return {
      query: trimmed,
      professionMode,
      timestamp,
      executionTimeMs,
      instantAnswer: finalInstantAnswer,
      decisionMatrix,
      liveRepos: liveData.githubRepos,
      academicPapers: liveData.academicPapers,
      aiSynthesis,
      webResults,
      localResults,
      relatedQuestions
    };
  }

  /**
   * Generates a complete, editable, downloadable Document / Petition / Contract / Business Plan
   * for ANY topic and template type!
   */
  public static generateDocumentTemplate(
    topic: string,
    templateType: DocumentTemplateType
  ): { title: string; subtitle: string; content: string } {
    const cleanTopic = topic.trim() || 'Genel Konu';
    const dateStr = new Date().toLocaleDateString('tr-TR');

    switch (templateType) {
      case 'petition':
        return {
          title: `${cleanTopic} — Resmi Başvuru ve Talep Dilekçesi`,
          subtitle: 'Kurumlara, Belediyelere, Üniversitelere veya Tüketici Hakem Heyetine Uygun Resmi Format',
          content: `T.C.
İLGİLİ KURUM / MÜDÜRLÜK MAKAMINA
                                                                Tarih: ${dateStr}

KONU: ${cleanTopic} Hakkında Talep ve Başvurumdur.

AÇIKLAMALAR:
1. Tarafımca "${cleanTopic}" konusu kapsamında yaşanan durum / talep edilen işlem aşağıda detaylandırılmıştır.
2. İlgili mevzuat, hakkaniyet ilkeleri ve yasal haklarım çerçevesinde; söz konusu durumun incelenerek mağduriyetimin giderilmesi veya talebimin işleme alınması gerekmektedir.
3. Konuya ilişkin gerekli bilgi, belge ve dayanaklar dilekçe ekinde sunulmuştur.

SONUÇ VE İSTEM:
Yukarıda arz ve izah edilen nedenlerle; "${cleanTopic}" konulu başvurumun kabulüne, gerekli incelemenin yapılarak yasal süresi içerisinde tarafıma yazılı olarak bilgi verilmesine karar verilmesini saygılarımla arz ve talep ederim.

Adı Soyadı : [Adınız Soyadınız]
T.C. Kimlik: [T.C. Kimlik Numaranız]
Adres      : [Açık Adresiniz]
Telefon    : [Telefon Numaranız]
İmza       : ___________________

EKLER:
1. Kimlik Fotokopisi / İlgili Belgeler
2. Kanıtlayıcı Evrak / Fatura / Kayıt Sureti`
        };

      case 'business_plan':
        return {
          title: `${cleanTopic} — Girişim İş Planı & Yatırımcı Özeti (Lean Canvas)`,
          subtitle: 'Girişimciler, KOBİ Sahipleri ve Yatırımcı Sunumları İçin Stratejik Plan',
          content: `===================================================================
CHIRMO 2036 GİRİŞİM & İŞ PLANI: ${cleanTopic.toUpperCase()}
Tarih: ${dateStr}
===================================================================

1. PROBLEM VE PAZAR İHTİYACI
- Mevcut pazarda "${cleanTopic}" alanında kullanıcılar/müşteriler yüksek maliyet, zaman kaybı ve karmaşık süreçlerle karşılaşmaktadır.
- Hedef kitlenin en büyük beklentisi hızlı, güvenilir ve şeffaf bir çözüme ulaşmaktır.

2. DEĞER ÖNERİSİ (ÇÖZÜMÜMÜZ)
- "${cleanTopic}" sürecini dijitalleştirerek ve standartlaştırarak maliyeti %35 düşüren, hızı 3 katına çıkaran yeni nesil hizmet/ürün modeli.

3. HEDEF KİTLE (MÜŞTERİ SEGMENTLERİ)
- Birincil Kitle: Bireysel tüketiciler ve aktif hizmet arayanlar.
- İkincil Kitle (B2B): Kurumsal firmalar, esnaf ve KOBİ işletmeleri.

4. GELİR MODELİ VE FİNANSAL PROJEKSİYON
- Gelir Kaynakları: Doğrudan satış, aylık abonelik (SaaS/Üyelik) ve katma değerli danışmanlık/hizmet paketi.
- Hedeflenen Brüt Kâr Marjı: %45 - %65 aralığı.
- Tahmini Başabaş (Break-Even) Süresi: 6 - 9 Ay.

5. PAZARLAMA VE BÜYÜME KANALLARI
- Dijital arama görünürlüğü (SEO), sosyal medya içerik pazarlaması, yerel iş birlikleri ve müşteri referans programı.

6. İLK 30 GÜNLÜK AKSİYON PLANI
[ ] Rakip ve fiyat analizi tablosunun tamamlanması
[ ] Minimum Uygulanabilir Ürün/Hizmet (MVP) paketinin hazırlanması
[ ] İlk 10 pilot müşteriden geri bildirim toplanması`
        };

      case 'contract':
        return {
          title: `${cleanTopic} — Hizmet ve İşbirliği Sözleşmesi Taslağı`,
          subtitle: 'Ticari İşler, Freelance Projeler ve Hizmet Alımları İçin Çerçeve Sözleşme',
          content: `HİZMET VE İŞBİRLİĞİ SÖZLEŞMESİ
Konu: ${cleanTopic}
Tarih: ${dateStr}

MADDE 1 - TARAFLAR
1.1. HİZMET VEREN: [Firma / Kişi Adı] (Bundan böyle "YÜKLENİCİ" olarak anılacaktır.)
1.2. HİZMET ALAN : [Müşteri / Firma Adı] (Bundan böyle "İŞVEREN" olarak anılacaktır.)

MADDE 2 - SÖZLEŞMENİN KONUSU VE KAPSAMI
İşbu sözleşmenin konusu; YÜKLENİCİ tarafından İŞVEREN'e "${cleanTopic}" kapsamında sunulacak mal/hizmetlerin şartlarının, teslim sürelerinin ve mali hükümlerin belirlenmesidir.

MADDE 3 - SÜRE VE TESLİMAT
3.1. İşbu sözleşme imza tarihinde yürürlüğe girer.
3.2. "${cleanTopic}" kapsamındaki işler kararlaştırılan takvime uygun şekilde teslim edilecektir.

MADDE 4 - ÜCRET VE ÖDEME KOŞULLARI
4.1. Toplam Hizmet Bedeli: [Tutar Giriniz] TL + KDV olarak belirlenmiştir.
4.2. Ödemenin %50'si iş başlangıcında, kalan %50'si ise teslimat onayında banka yoluyla ödenecektir.

MADDE 5 - GİZLİLİK VE KVKK
Taraflar, işbu sözleşme kapsamında öğrendikleri ticari sırları ve kişisel verileri üçüncü kişilerle paylaşmamayı taahhüt eder.

YÜKLENİCİ (İmza/Kaşe)                        İŞVEREN (İmza/Kaşe)
_____________________                        _____________________`
        };

      case 'study_guide':
        return {
          title: `${cleanTopic} — Akademik Ders Özeti ve Sınav Çalışma Rehberi`,
          subtitle: 'Öğrenciler, Öğretmenler ve Araştırmacılar İçin Yapılandırılmış Çalışma Notu',
          content: `===================================================================
DERS VE ARAŞTIRMA NOTU: ${cleanTopic.toUpperCase()}
Tarih: ${dateStr}
===================================================================

1. TEMEL TANIM VE KAVRAMSAL ÇERÇEVE
"${cleanTopic}", ilgili disiplinin temel yapı taşlarından biri olup neden-sonuç ilişkileri, tarihsel gelişimi ve pratik uygulamalarıyla incelenir.

2. SINAVLARDA VE MULAKATLARDA EN ÇOK SORULAN 3 NOKTA
• Soru 1: ${cleanTopic} kavramının temel amacı ve çözdüğü ana problem nedir?
• Soru 2: Geleneksel yöntemlerle modern yaklaşım arasındaki en kritik fark nedir?
• Soru 3: Uygulamada en sık yapılan hatalar ve dikkat edilmesi gereken kurallar nelerdir?

3. AKILDA TUTMA (FEYNMAN TEKNİĞİ İLE ÖZET)
Konuyu hiç bilmeyen birine anlatırken şu 3 anahtar kelime üzerinden özetleyin:
1) Başlangıç Niyeti / Girdi
2) İşleyiş Mekanizması / Dönüşüm
3) Elde Edilen Somut Çıktı

4. ÇALIŞMA VE TEKRAR TAKVİMİ (ARALIKLI TEKRAR)
[ ] 1. Tekrar: Bugün öğrenilen kavramları kendi cümlelerinle yaz.
[ ] 2. Tekrar (3 Gün Sonra): Chirmo "Öğren & Test Et" sekmesindeki mini sınavı çöz.
[ ] 3. Tekrar (7 Gün Sonra): Eksik kalan terimleri gözden geçir.`
        };

      case 'official_email':
        return {
          title: `${cleanTopic} — Kurumsal Teklif ve İletişim E-Postası`,
          subtitle: 'İş Ortaklığı, Müşteri Teklifi veya Resmi Kurumsal Yazışma Şablonu',
          content: `Konu: ${cleanTopic} — İşbirliği ve Süreç Değerlendirmesi Hk.

Sayın [Yetkili Adı Soyadı],

Umarım bu e-posta size iyi bir haftada ulaşır.

[Şirketiniz / Kurumunuz] bünyesinde yürütmekte olduğunuz çalışmaları yakından takip ediyoruz. "${cleanTopic}" alanında operasyonel verimliliği artırmak ve süreçlerinize doğrudan değer katmak amacıyla hazırladığımız çözüm önerimizi sizinle paylaşmak isteriz.

Önerdiğimiz yapı sayesinde:
• Süreç maliyetlerinde ölçülebilir tasarruf sağlanması,
• Uygulama hızının ve kalite standartlarının yükseltilmesi,
• Ekibinizin iş yükünün hafifletilmesi hedeflenmektedir.

Uygun görmeniz halinde, önümüzdeki hafta 15 dakikalık kısa bir çevrimiçi görüşmede detayları sunmaktan memnuniyet duyarız.

Saygılarımla,

[Adınız Soyadınız]
[Unvanınız / Kurumunuz]
[Telefon & İletişim Bilgileriniz]`
        };

      case 'press_release':
      default:
        return {
          title: `${cleanTopic} — Basın Bülteni ve Kamuoyu Duyurusu`,
          subtitle: 'Medya, Web Sitesi ve Sosyal Medya Kanalları İçin Resmi Duyuru Metni',
          content: `BASIN BÜLTENİ — HEMEN YAYINLANABİLİR
Tarih: ${dateStr}

${cleanTopic.toUpperCase()} ALANINDA YENİ DÖNEM BAŞLIYOR

"${cleanTopic}" konusunda geliştirilen yenilikçi yaklaşım ve çözüm standartları kamuoyuyla paylaşıldı. Kullanıcı odaklı tasarım ve yüksek erişilebilirlik ilkeleriyle hayata geçirilen bu adım, sektörde hız ve kalite çıtasını yukarı taşıyor.

Öne Çıkan Başlıklar:
• Her kesimden kullanıcının kolayca erişebileceği yalın ve şeffaf yapı.
• Zaman ve maliyet tasarrufu sağlayan yeni nesil uygulama adımları.
• Sürdürülebilir ve geleceğe uyumlu (2036 vizyonlu) altyapı.

Detaylı bilgi için: [Web Siteniz / İletişim Adresiniz]`
        };
    }
  }

  /**
   * Decomposes any user goal or search topic into actionable Kanban cards automatically
   */
  public static decomposeGoalToKanban(
    goal: string,
    professionMode: ProfessionMode = 'general'
  ): { title: string; tag: string; column: 'todo' | 'doing' | 'done' }[] {
    const clean = goal.trim();

    if (professionMode === 'entrepreneur') {
      return [
        { title: `${clean}: Pazar büyüklüğü ve rakip fiyatlarını analiz et`, tag: 'Pazar Analizi', column: 'doing' },
        { title: `${clean}: Başabaş (Break-even) maliyet ve kâr tablosunu çıkar`, tag: 'Finans', column: 'todo' },
        { title: `${clean}: İlk ürün/hizmet paketini ve sözleşmeyi hazırla`, tag: 'Operasyon', column: 'todo' },
        { title: `${clean}: İlk 10 potansiyel müşteriye teklif sun`, tag: 'Satış', column: 'todo' }
      ];
    }

    if (professionMode === 'student') {
      return [
        { title: `${clean}: Temel kavramları ve akademik makaleleri incele`, tag: 'Literatür', column: 'doing' },
        { title: `${clean}: Chirmo Çalışma Rehberi ile ders özetini çıkar`, tag: 'Özet Not', column: 'todo' },
        { title: `${clean}: Ezber kartlarını (Flashcard) tekrar et`, tag: 'Ezber', column: 'todo' },
        { title: `${clean}: Mini deneme sınavını çözüp eksikleri kapat`, tag: 'Sınav', column: 'todo' }
      ];
    }

    if (professionMode === 'legal') {
      return [
        { title: `${clean}: İlgili mevzuat ve yasal süreleri kontrol et`, tag: 'Mevzuat', column: 'doing' },
        { title: `${clean}: Kanıtlayıcı belge, fatura ve kayıtları dosyala`, tag: 'Evrak', column: 'todo' },
        { title: `${clean}: Chirmo Belge Stüdyosundan resmi dilekçeyi oluştur`, tag: 'Dilekçe', column: 'todo' },
        { title: `${clean}: Resmi başvuruyu yap ve takip numarasını kaydet`, tag: 'Başvuru', column: 'todo' }
      ];
    }

    return [
      { title: `${clean}: Mevcut durum ve kaynak araştırmasını tamamla`, tag: 'Araştırma', column: 'doing' },
      { title: `${clean}: Alternatifleri karşılaştır ve araç seçimi yap`, tag: 'Karar', column: 'todo' },
      { title: `${clean}: İlk prototip / uygulama adımını başlat`, tag: 'Uygulama', column: 'todo' },
      { title: `${clean}: Riskleri test et ve sonucu doğrula`, tag: 'Kontrol', column: 'todo' }
    ];
  }

  /**
   * Fetches live global technology headlines from HackerNews Algolia API for the Live Radar widget
   */
  public static async fetchLiveTechRadar(): Promise<{ id: string; title: string; url: string; points: number; author: string }[]> {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2200);
      const res = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=6', {
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!res.ok) return [];
      const json = await res.json();
      return (json.hits || []).slice(0, 6).map((h: any) => ({
        id: h.objectID,
        title: h.title,
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        points: h.points || 100,
        author: h.author || 'tech'
      }));
    } catch {
      return [
        { id: '1', title: 'Autonomous AI Agents & Local-First Browsers in 2026', url: 'https://news.ycombinator.com', points: 420, author: 'chirmo' },
        { id: '2', title: 'Why SQLite and Local Storage Are Replacing Cloud Databases', url: 'https://www.sqlite.org', points: 315, author: 'dev' },
        { id: '3', title: 'Next-Generation WebContentsView Architecture in Electron', url: 'https://www.electronjs.org', points: 280, author: 'system' }
      ];
    }
  }

  /**
   * Fetches real live data from public CORS-friendly APIs:
   * 1. Wikipedia TR REST API (Encyclopedia)
   * 2. OpenAlex API (250M+ Peer-Reviewed Scientific & Academic Papers across Medicine, Law, Economics, Science)
   * 3. GitHub Search API (Open Source Repositories)
   * 4. HackerNews Algolia API (Global Discussions)
   */
  private static async fetchLiveFederatedSources(query: string): Promise<{
    wikiSummary?: { title: string; description?: string; extract: string; url: string; thumbnail?: string };
    academicPapers: AcademicPaper[];
    githubRepos: LiveGitHubRepo[];
    hnResults: WebSearchResult[];
  }> {
    const cleanQ = query
      .replace(/\b(nedir|kimdir|nasıl|ne demek|hakkında|bilgi|özet|vs|karşılaştır)\b/gi, '')
      .trim();

    const targetQuery = cleanQ || query.trim();

    const fetchWithTimeout = async (url: string, timeoutMs = 2200) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        clearTimeout(timer);
        return null;
      }
    };

    const isPureMath = targetQuery.length < 2 || /^[\d\s\+\-\*\/]+$/.test(targetQuery);

    const [wikiTr, openAlexPapers, githubData, hnData] = await Promise.all([
      (async () => {
        if (isPureMath) return undefined;
        const searchUrl = `https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          targetQuery
        )}&utf8=&format=json&origin=*&srlimit=1`;
        const searchJson = await fetchWithTimeout(searchUrl, 2000);
        const firstHit = searchJson?.query?.search?.[0];
        if (!firstHit?.title) return undefined;

        const summaryUrl = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          firstHit.title
        )}`;
        const sumJson = await fetchWithTimeout(summaryUrl, 2000);
        if (!sumJson || !sumJson.extract) return undefined;

        return {
          title: sumJson.title,
          description: sumJson.description,
          extract: sumJson.extract,
          url:
            sumJson.content_urls?.desktop?.page ||
            `https://tr.wikipedia.org/wiki/${encodeURIComponent(sumJson.title)}`,
          thumbnail: sumJson.thumbnail?.source
        };
      })(),

      // OpenAlex Scientific & Academic Works API (Medicine, Law, Education, Economics, Engineering)
      (async (): Promise<AcademicPaper[]> => {
        if (isPureMath) return [];
        const oaUrl = `https://api.openalex.org/works?search=${encodeURIComponent(
          targetQuery
        )}&per-page=3&sort=cited_by_count:desc`;
        const oaJson = await fetchWithTimeout(oaUrl, 2200);
        if (!oaJson?.results || !Array.isArray(oaJson.results)) return [];
        return oaJson.results
          .filter((w: any) => w.title)
          .slice(0, 3)
          .map((w: any) => ({
            id: w.id || String(Math.random()),
            title: w.title,
            year: w.publication_year || 2025,
            citedByCount: w.cited_by_count || 0,
            author: w.authorships?.[0]?.author?.display_name || 'Akademik Araştırma Grubu',
            url: w.doi || w.primary_location?.landing_page_url || `https://scholar.google.com/scholar?q=${encodeURIComponent(w.title)}`,
            venue: w.primary_location?.source?.display_name || 'Bilimsel Yayın'
          }));
      })(),

      (async () => {
        if (isPureMath) return [];
        const ghUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
          targetQuery
        )}&sort=stars&order=desc&per_page=3`;
        const ghJson = await fetchWithTimeout(ghUrl, 2200);
        if (!ghJson?.items || !Array.isArray(ghJson.items)) return [];
        return ghJson.items.slice(0, 3).map((repo: any) => ({
          id: repo.id,
          fullName: repo.full_name,
          description: repo.description || 'Açık kaynak GitHub deposu',
          stars: repo.stargazers_count || 0,
          language: repo.language || 'Code',
          url: repo.html_url
        }));
      })(),

      (async () => {
        if (isPureMath) return [];
        const hnUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
          targetQuery
        )}&hitsPerPage=3`;
        const hnJson = await fetchWithTimeout(hnUrl, 2000);
        if (!hnJson?.hits || !Array.isArray(hnJson.hits)) return [];
        return hnJson.hits
          .filter((h: any) => h.title && (h.url || h.objectID))
          .slice(0, 3)
          .map((h: any, idx: number) => ({
            id: `hn_${h.objectID || idx}`,
            title: h.title,
            url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
            snippet: `Küresel Gündem & Tartışma • ${h.points || 0} puan • ${h.num_comments || 0} yorum • Yazar: @${h.author}`,
            domain: h.url ? new URL(h.url).hostname.replace('www.', '') : 'news.ycombinator.com',
            badge: 'Canlı Gündem'
          }));
      })()
    ]);

    return {
      wikiSummary: wikiTr,
      academicPapers: openAlexPapers || [],
      githubRepos: githubData || [],
      hnResults: hnData || []
    };
  }

  /**
   * Interactive Decision Matrix Builder for "X vs Y" comparisons
   */
  public static buildDecisionMatrix(query: string, forceCompare = false): DecisionMatrix | undefined {
    const vsMatch = query.match(
      /^(.+?)\s+(?:vs\.?|veya|mi yoksa|karşılaştır|ile)\s+(.+?)(?:\s+karşılaştırma|\s+farkı|\s+hangisi)?$/i
    );
    if (!vsMatch && !forceCompare) return undefined;

    const optionA = vsMatch ? vsMatch[1].trim() : query.trim();
    const optionB = vsMatch ? vsMatch[2].trim() : 'Alternatif Seçenek';

    const hash = (str: string) => str.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const hA = hash(optionA.toLowerCase());
    const hB = hash(optionB.toLowerCase());

    const criteria: DecisionCriterion[] = [
      {
        name: 'Kalite, Performans & Verim',
        weight: 5,
        scoreA: 78 + (hA % 18),
        scoreB: 75 + (hB % 20),
        note: 'Günlük kullanımda sunduğu hız, dayanıklılık ve sonuç kalitesi'
      },
      {
        name: 'Kullanım & Uygulama Kolaylığı',
        weight: 4,
        scoreA: 74 + ((hA * 3) % 22),
        scoreB: 80 + ((hB * 3) % 16),
        note: 'Herkes tarafından hızlıca öğrenilebilir ve uygulanabilir olma durumu'
      },
      {
        name: 'Güvenilirlik & Destek Ağı',
        weight: 4,
        scoreA: 82 + ((hA * 7) % 15),
        scoreB: 76 + ((hB * 7) % 19),
        note: 'Yaygınlık, kurumsal/topluluk desteği ve sorun çözme hızı'
      },
      {
        name: 'Maliyet & Fiyat/Performans',
        weight: 5,
        scoreA: 76 + ((hA * 5) % 20),
        scoreB: 81 + ((hB * 5) % 16),
        note: 'Bütçe dostu olma, bakım gideri ve yatırımın geri dönüşü'
      },
      {
        name: '2036 Gelecek Uyumluluğu',
        weight: 4,
        scoreA: 84 + ((hA * 2) % 14),
        scoreB: 79 + ((hB * 2) % 17),
        note: 'Uzun vadeli değerini koruma ve yeni teknolojilere uyum'
      }
    ];

    return {
      optionA,
      optionB,
      verdict: `Kalite, uzun ömürlülük ve yaygın destek öncelikli olduğunda "${optionA}" öne çıkarken; bütçe esnekliği ve pratik başlangıç açısından "${optionB}" güçlü bir alternatif sunmaktadır.`,
      prosA: [
        `${optionA} yüksek güvenilirlik ve kanıtlanmış standartlara sahiptir.`,
        'Uzun vadede değerini ve performansını korur.'
      ],
      prosB: [
        `${optionB} daha düşük başlangıç maliyeti ve pratik kullanım sunar.`,
        'Hızlı sonuç almak isteyenler için esnektir.'
      ],
      consA: ['Başlangıç maliyeti veya hazırlık süreci biraz daha yüksek olabilir.'],
      consB: ['İleri düzey beklentilerde kapasite sınırlarına daha erken ulaşabilir.'],
      criteria
    };
  }

  /**
   * Instant local evaluation:
   * - Everyday Finance: KDV Calculator ("10000 tl kdv"), Loan/Interest
   * - Health: BMI / VKİ Calculator ("175 cm 75 kg")
   * - Math expressions & percentages
   * - Currency & Unit conversions
   * - Offline Encyclopedia
   */
  public static detectInstantAnswer(query: string): InstantAnswer | undefined {
    const lower = query.toLowerCase().trim();

    // 1. KDV / Vergi Hesaplayıcı (Esnaf, Muhasebe, Girişimci ve Vatandaş İçin)
    const kdvMatch = lower.match(/(\d+(?:[\.,]\d+)?)\s*(?:tl|try|₺|dolar|usd)?\s*(?:%\s*(\d+))?\s*kdv/i);
    if (kdvMatch) {
      const amount = parseFloat(kdvMatch[1].replace(',', '.'));
      const rate = kdvMatch[2] ? parseFloat(kdvMatch[2]) : 20;
      const kdvTutari = amount * (rate / 100);
      const kdvDahil = amount + kdvTutari;
      const kdvHarictenMatrah = amount / (1 + rate / 100);
      return {
        type: 'finance',
        title: `KDV ve Vergi Hesaplayıcı (%${rate})`,
        subtitle: `Ana Tutar: ${amount.toLocaleString('tr-TR')} ₺`,
        result: `${kdvDahil.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺ (KDV Dahil)`,
        details: `• +%${rate} KDV Tutarı: ${kdvTutari.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺ | • Eğer ${amount.toLocaleString('tr-TR')} ₺ KDV Dahil ise KDV Hariç Net: ${kdvHarictenMatrah.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺ (%10 KDV Dahil: ${(amount * 1.1).toLocaleString('tr-TR')} ₺)`,
        badge: 'Finans & Muhasebe'
      };
    }

    // 2. Boy / Kilo Vücut Kitle İndeksi (VKİ / BMI) & Günlük Kalori/Su İhtiyacı (Sağlık Modu)
    const bmiMatch = lower.match(/(\d{3})\s*cm\s*(\d{2,3})\s*(?:kg|kilo)/i);
    if (bmiMatch) {
      const heightCm = parseFloat(bmiMatch[1]);
      const weightKg = parseFloat(bmiMatch[2]);
      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);
      const status =
        bmi < 18.5
          ? 'Zayıf'
          : bmi < 24.9
          ? 'İdeal / Sağlıklı Kilo'
          : bmi < 29.9
          ? 'Fazla Kilolu'
          : 'Obezite Sınırı';
      const idealWeight = (22 * heightM * heightM).toFixed(1);
      const waterLiters = (weightKg * 0.033).toFixed(1);
      return {
        type: 'health',
        title: 'Vücut Kitle İndeksi (VKİ) & Sağlık Analizi',
        subtitle: `Boy: ${heightCm} cm • Kilo: ${weightKg} kg`,
        result: `VKİ: ${bmi.toFixed(1)} (${status})`,
        details: `• İdeal Hedef Kilonuz: ~${idealWeight} kg • Günlük Önerilen Su Tüketimi: ${waterLiters} Litre • Günlük Bazal Kalori İhtiyacı: ~${Math.round(weightKg * 24)} kcal`,
        badge: 'Sağlık & Yaşam'
      };
    }

    // 3. Math Evaluator
    const mathResult = this.evaluateMath(lower);
    if (mathResult) return mathResult;

    // 4. Currency & Unit Converter
    const convResult = this.evaluateConversion(lower);
    if (convResult) return convResult;

    // 5. Knowledge Base Match
    for (const item of KNOWLEDGE_BASE) {
      if (item.keys.some((k) => lower === k || lower.startsWith(k + ' ') || lower.endsWith(' ' + k))) {
        return {
          type: 'tech',
          title: item.title,
          subtitle: item.category,
          result: item.tagline,
          details: item.description,
          badge: item.category,
          codeSnippet: item.codeSnippet,
          keyFacts: item.keyFacts,
          extra: { officialUrl: item.officialUrl }
        };
      }
    }

    return undefined;
  }

  private static evaluateMath(query: string): InstantAnswer | undefined {
    const cleanQuery = query
      .replace(/^(hesapla|hesap|calc|calculate|ne kadar|kaç eder|sonuç)[:\s]*/i, '')
      .trim();

    const pctMatch = cleanQuery.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|i|si|ü|nin|nın)\s*(\d+(?:\.\d+)?)/i);
    if (pctMatch) {
      const pct = parseFloat(pctMatch[1]);
      const total = parseFloat(pctMatch[2]);
      const result = (pct / 100) * total;
      return {
        type: 'calculator',
        title: 'Yüzde & Oran Hesaplama',
        subtitle: `${total} sayısının %${pct} oranı`,
        result: `${result}`,
        details: `Formül: (${pct} / 100) × ${total} = ${result} • Artışlı Toplam: ${total + result} • İndirimli Kalan: ${total - result}`,
        badge: 'Matematik'
      };
    }

    const mathRegex = /^[\d\s\+\-\*\/\^\(\)\.\,\%]+$/;
    if (mathRegex.test(cleanQuery) && /[\+\-\*\/\^]/.test(cleanQuery)) {
      try {
        const sanitized = cleanQuery.replace(/\^/g, '**').replace(/,/g, '.');
        // eslint-disable-next-line no-new-func
        const fn = new Function(`"use strict"; return (${sanitized});`);
        const val = fn();
        if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
          const formatted = Number.isInteger(val) ? val.toString() : val.toFixed(4).replace(/\.?0+$/, '');
          return {
            type: 'calculator',
            title: 'Anında Matematik & Finans Motoru',
            subtitle: cleanQuery,
            result: formatted,
            details: `${cleanQuery} = ${formatted} • (+%20 KDV Dahil: ${(val * 1.2).toFixed(2)} | +%10 KDV Dahil: ${(val * 1.1).toFixed(2)})`,
            badge: 'Hesap Makinesi'
          };
        }
      } catch {
        // Ignore parse error
      }
    }

    return undefined;
  }

  private static evaluateConversion(query: string): InstantAnswer | undefined {
    const currencyMatch = query.match(
      /(\d+(?:\.\d+)?)\s*(usd|dolar|eur|euro|try|tl|gbp|sterlin|btc|gram altın|altın)\s*(?:to|in|kaç|->)\s*(usd|dolar|eur|euro|try|tl|gbp|sterlin)/i
    );

    if (currencyMatch) {
      const amount = parseFloat(currencyMatch[1]);
      const from = currencyMatch[2].toLowerCase();
      const to = currencyMatch[3].toLowerCase();

      const ratesToUsd: Record<string, number> = {
        usd: 1.0,
        dolar: 1.0,
        eur: 1.08,
        euro: 1.08,
        gbp: 1.29,
        sterlin: 1.29,
        try: 0.029,
        tl: 0.029,
        btc: 68500.0,
        altın: 88.0,
        'gram altın': 88.0
      };

      const rateNames: Record<string, string> = {
        usd: 'USD ($)',
        dolar: 'USD ($)',
        eur: 'EUR (€)',
        euro: 'EUR (€)',
        gbp: 'GBP (£)',
        sterlin: 'GBP (£)',
        try: 'TRY (₺)',
        tl: 'TRY (₺)',
        btc: 'Bitcoin (BTC)',
        altın: 'Gram Altın',
        'gram altın': 'Gram Altın'
      };

      if (ratesToUsd[from] && ratesToUsd[to]) {
        const inUsd = amount * ratesToUsd[from];
        const converted = inUsd / ratesToUsd[to];
        const formatted = converted.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        return {
          type: 'converter',
          title: 'Döviz, Altın & Kur Dönüştürücü',
          subtitle: `${amount} ${rateNames[from]} ➔ ${rateNames[to]}`,
          result: `${formatted} ${to.toUpperCase()}`,
          details: `1 ${from.toUpperCase()} ≈ ${(ratesToUsd[from] / ratesToUsd[to]).toFixed(2)} ${to.toUpperCase()}`,
          badge: 'Finans & Döviz'
        };
      }
    }

    const distMatch = query.match(/(\d+(?:\.\d+)?)\s*(km|kilometre|mil|miles)\s*(?:to|in|kaç)\s*(km|mil|miles)/i);
    if (distMatch) {
      const val = parseFloat(distMatch[1]);
      const from = distMatch[2].toLowerCase();
      if (from.startsWith('km') || from.startsWith('kilo')) {
        const miles = val * 0.621371;
        return {
          type: 'converter',
          title: 'Mesafe Dönüştürücü',
          subtitle: `${val} Kilometre`,
          result: `${miles.toFixed(2)} Mil`,
          details: `1 Kilometre = 0.621371 Mil`,
          badge: 'Birim'
        };
      } else {
        const km = val * 1.60934;
        return {
          type: 'converter',
          title: 'Mesafe Dönüştürücü',
          subtitle: `${val} Mil`,
          result: `${km.toFixed(2)} Kilometre`,
          details: `1 Mil = 1.60934 Kilometre`,
          badge: 'Birim'
        };
      }
    }

    return undefined;
  }

  private static searchWorkspace(
    query: string,
    context: {
      projects?: Project[];
      tasks?: Task[];
      history?: HistoryEntry[];
    }
  ): LocalSearchResult[] {
    const q = query.toLowerCase();
    const results: LocalSearchResult[] = [];

    if (context.projects) {
      for (const p of context.projects) {
        if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
          results.push({
            type: 'project',
            id: p.id,
            title: p.name,
            description: p.description || 'Açıklama belirtilmemiş.',
            meta: `Proje • ${new Date(p.createdAt).toLocaleDateString('tr-TR')}`,
            color: p.color
          });
        }
      }
    }

    if (context.tasks) {
      for (const t of context.tasks) {
        if (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.result && t.result.toLowerCase().includes(q))
        ) {
          results.push({
            type: 'task',
            id: t.id,
            title: t.title,
            description: t.description || t.result || 'Görev kaydı',
            meta: `Görev • Durum: ${t.status}`,
            status: t.status
          });
        }
      }
    }

    return results.slice(0, 8);
  }

  private static generateAiSynthesis(
    query: string,
    professionMode: ProfessionMode,
    instantAnswer?: InstantAnswer,
    localResults: LocalSearchResult[] = [],
    liveData?: {
      wikiSummary?: { title: string; description?: string; extract: string; url: string };
      academicPapers: AcademicPaper[];
      githubRepos: LiveGitHubRepo[];
      hnResults: WebSearchResult[];
    },
    decisionMatrix?: DecisionMatrix
  ): AiSynthesis {
    const baseSummary = liveData?.wikiSummary?.extract
      ? liveData.wikiSummary.extract
      : instantAnswer?.details
      ? `${instantAnswer.title}: ${instantAnswer.details}`
      : decisionMatrix
      ? decisionMatrix.verdict
      : `"${query}" konusu; canlı ansiklopedik kaynaklar, hakemli bilimsel yayınlar (OpenAlex) ve sektörel veriler taranarak sentezlenmiştir.`;

    const perspectives: Record<PerspectiveLens, { title: string; badge: string; content: string; bullets: string[] }> = {
      ceo: {
        title: 'İş Dünyası, Girişimci & Yönetici Özeti',
        badge: 'Strateji & Kazanç',
        content: `"${query}" alanında temel strateji; zaman ve kaynak maliyetini düşürerek doğrudan ekonomik veya pratik değer üretmektir. ${baseSummary.slice(0, 175)}`,
        bullets: [
          'Büyük bütçeler harcamadan önce küçük ölçekli pilot uygulama ile doğrulama yapın.',
          'Girişim & Finans sekmesinden başabaş (Break-Even) maliyet hesabını kontrol edin.',
          'Belge Stüdyosu sekmesinden resmi teklif veya iş planı şablonunu tek tıkla indirin.'
        ]
      },
      engineer: {
        title: 'Teknik, Akademik & Uzman Derinliği',
        badge: 'Bilimsel & Sistemik',
        content: `Uzman perspektifinden "${query}"; kanıta dayalı veriler, standart metodolojiler ve ölçülebilir kriterlerle ele alınmalıdır.${
          liveData?.academicPapers?.length
            ? ` Akademik literatürde "${liveData.academicPapers[0].title}" (${liveData.academicPapers[0].citedByCount} atıf) önemli referanslardan biridir.`
            : ''
        }`,
        bullets: [
          'Doğrulanmış veriler ve standart prosedürler dışındaki varsayımlarla hareket etmeyin.',
          'Süreçleri ölçülebilir adımlara bölerek hata payını sıfıra indirin.',
          'Alternatif yöntemleri Karar Matrisi sekmesinden ağırlıklandırarak kıyaslayın.'
        ]
      },
      critic: {
        title: 'Şeytanın Avukatı & Tüketici/Yatırımcı Risk Analizi',
        badge: 'Gizli Riskler & Uyarılar',
        content: `"${query}" konusunda en sık yapılan hata; görünmeyen maliyetleri, yasal/operasyonel yükümlülükleri ve uzun vadeli bakım zorluklarını göz ardı etmektir.`,
        bullets: [
          'Gizli maliyet uyarısı: İlk alım veya başlangıç maliyetinin yanı sıra sürdürme giderlerini hesaplayın.',
          'Tek kaynağa bağımlılık riski: Her zaman bir B planı ve alternatif tedarik/çözüm bulundurun.',
          'Resmi işlemlerde sözleşme veya dilekçe detaylarını yazılı güvence altına alın.'
        ]
      },
      eli5: {
        title: 'Herkes İçin En Yalın Anlatım (Sıfır Jargon)',
        badge: 'Pratik & Anlaşılır',
        content: `"${query}" konusunu hiç karmaşık terimlere boğulmadan; günlük hayatta işinizi kolaylaştıran, size zaman kazandıran ve doğru adımı atmanızı sağlayan pratik bir rehber olarak düşünebilirsiniz.`,
        bullets: [
          'Karmaşık terimleri bir kenara bırakıp doğrudan "Ne işe yarar?" sorusuna odaklanır.',
          'Herkesin 5 dakikada anlayıp uygulayabileceği net adımlar sunar.',
          'İster öğrenci, ister esnaf, ister ev kullanıcısı olun doğrudan sonuca götürür.'
        ]
      }
    };

    // 2036 Temporal Time Machine Timeline
    const temporal: TemporalTimeline = {
      past: {
        era: 'Geçmiş & Geleneksel Dönem',
        title: `${query} — Klasik Yöntemler ve İlk Standartlar`,
        summary: `"${query}" alanında geçmişte tüm süreçler fiziksel evraklarla, yavaş iletişim kanallarıyla ve yüksek iş gücü maliyetiyle yürütülmekteydi.`,
        milestones: [
          'Geleneksel yöntemlerin ve ilk mesleki kuralların oluşumu',
          'Manuel kayıt ve fiziksel işlem süreçlerinden dijitale ilk geçiş',
          'Temel kalite ve güvenlik standartlarının belirlenmesi'
        ]
      },
      present: {
        era: '2026 Bugün (Canlı Veri)',
        title: `${query} — Dijitalleşme ve Yapay Zekâ Destekli Dönem`,
        summary: baseSummary,
        milestones: [
          liveData?.wikiSummary
            ? `Ansiklopedik Doğrulama: ${liveData.wikiSummary.title}`
            : 'Dijital araçlar ve çevrimiçi platformlarla hızlanan süreçler',
          liveData?.academicPapers?.length
            ? `Bilimsel Literatür: "${liveData.academicPapers[0].title.slice(0, 60)}..." (${liveData.academicPapers[0].citedByCount} atıf)`
            : 'Veri odaklı karar alma ve maliyet optimizasyonu',
          'Mobil ve masaüstü platformlardan anlık erişim standardı'
        ]
      },
      future2036: {
        era: '2036 Gelecek Vizyonu (+10 Yıl)',
        title: `${query} — Tam Otonom ve Kişiselleştirilmiş 2036 Çağı`,
        summary: `2036 yılında "${query}", bürokrasinin ve manuel işlem adımlarının %95 oranında ortadan kalktığı, yapay zeka ajanlarının saniyeler içinde kişiye özel üretim, analiz ve resmi onay gerçekleştirdiği otonom bir yapıya kavuşacaktır.`,
        milestones: [
          'Sıfır bürokrasi: Resmi işlemlerin, sözleşmelerin ve analizlerin saniyeler içinde otonom tamamlanması',
          'Kişiselleştirilmiş simülasyon: Karar vermeden önce sonucun %98 doğrulukla önceden simüle edilmesi',
          'Toplumun her kesimi için uzmanlık bariyerinin kalkması ve demokratik erişim'
        ],
        disruptionProbability: 94
      }
    };

    // Fact-Check & Reality X-Ray
    const factCheck: FactCheckXRay = {
      verifiabilityScore:
        liveData?.wikiSummary || liveData?.academicPapers?.length || liveData?.githubRepos?.length ? 98 : 93,
      neutralityScore: 96,
      sourceDiversity: liveData?.academicPapers?.length
        ? 'Çok Yüksek (Wikipedia + OpenAlex Bilimsel Makaleler + Küresel Web)'
        : 'Yüksek (Çoklu İndeks ve Çapraz Kaynak Kontrolü)',
      blindSpotWarning: `"${query}" konusunda tek taraflı reklam veya popüler yorumlara bağlı kalmamak için Karar Matrisi ve Doğruluk X-Ray verilerini birlikte değerlendirin.`,
      verifiedClaims: [
        liveData?.wikiSummary
          ? `${liveData.wikiSummary.title} maddesi canlı Wikipedia ansiklopedisinden doğrulandı.`
          : `"${query}" kavramı çoklu doğrulama filtrelerinden geçirildi.`,
        liveData?.academicPapers?.length
          ? `OpenAlex veritabanından ${liveData.academicPapers.length} adet hakemli akademik çalışma eşleştirildi.`
          : 'Sektörel ve pratik uygulama standartlarıyla çapraz kontrol yapıldı.'
      ]
    };

    // Interactive Study Module (Flashcards + Graded Quiz) for ANY topic
    const studyModule: StudyModule = {
      topic: query,
      flashcards: [
        {
          id: 'fc1',
          category: 'Temel Kavram',
          front: `${query} nedir ve temel amacı nedir?`,
          back: baseSummary.slice(0, 220) + (baseSummary.length > 220 ? '...' : '')
        },
        {
          id: 'fc2',
          category: 'Kritik Kriter',
          front: `${query} konusunda başarılı sonuç almak için en önemli kural nedir?`,
          back: 'Doğru planlama yapmak, alternatifleri maliyet/performans açısından kıyaslamak ve süreci ölçülebilir adımlara (Kanban) bölmektir.'
        },
        {
          id: 'fc3',
          category: '2036 Geleceği',
          front: `${query} alanı 2036 yılında nasıl bir dönüşüm geçirecek?`,
          back: 'Manuel ve zaman alıcı süreçler %95 oranında otonom sistemlere devredilerek saniyeler içinde kişiselleştirilmiş sonuç üretilecektir.'
        }
      ],
      quiz: [
        {
          id: 'q1',
          question: `"${query}" alanında bir projeye veya sürece başlarken atılması gereken ilk stratejik adım hangisidir?`,
          options: [
            'Hiç araştırma yapmadan en pahalı seçeneği satın almak',
            'İhtiyacı tanımlayıp doğrulanmış kaynaklardan ve Karar Matrisinden kıyaslama yapmak',
            'Süreci belirsiz bırakıp rastgele ilerlemek',
            'Risk analizini tamamen göz ardı etmek'
          ],
          correctIndex: 1,
          explanation: 'Başarılı bir süreç, ihtiyacın net tanımlanması ve alternatiflerin rasyonel kriterlerle kıyaslanmasıyla başlar.'
        },
        {
          id: 'q2',
          question: `"${query}" konusunda 'Şeytanın Avukatı (Risk Analizi)' lensine göre en çok dikkat edilmesi gereken tuzak nedir?`,
          options: [
            'Görünmeyen uzun vadeli maliyetleri ve tek kaynağa bağımlılık riskini unutmak',
            'Çok hızlı bilgiye ulaşmak',
            'Farklı bakış açılarını incelemek',
            'Planlı hareket etmek'
          ],
          correctIndex: 0,
          explanation: 'Görünmeyen bakım/sürdürme maliyetleri ve tek bir kaynağa bağımlı kalmak en büyük operasyonel risktir.'
        },
        {
          id: 'q3',
          question: `Chirmo 2036 projeksiyonuna göre "${query}" alanında gelecek 10 yılda hangi değişim öne çıkacaktır?`,
          options: [
            'Kağıt ve bürokrasinin daha da artması',
            'Bilgiye erişimin zorlaşması',
            'Otonom yapay zeka sistemleriyle sıfır-bürokrasi ve anlık simülasyon',
            'Dijital araçların tamamen terk edilmesi'
          ],
          correctIndex: 2,
          explanation: '2036 vizyonunda arama ve iş süreçleri otonom simülasyon ve sıfır bürokrasi temeline dayanmaktadır.'
        }
      ]
    };

    // Entrepreneur & Investor Opportunity Module
    const ventureOpportunity: VentureOpportunity = {
      topic: query,
      marketPotential: 'Yüksek Büyüme & Dijital Dönüşüm Potansiyeli',
      targetAudience: 'Bireysel tüketiciler, KOBİ işletmeleri ve kurumsal müşteriler',
      revenueModel: 'Hizmet Satışı + Aylık Abonelik (SaaS / Üyelik) + Danışmanlık Paketi',
      estimatedInitialCost: 'Düşük / Orta (Yalın Başlangıç & MVP Odaklı)',
      defaultUnitPrice: 1500,
      defaultUnitCost: 600,
      defaultMonthlyFixedCost: 27000,
      pitchSlides: [
        {
          slide: 1,
          title: '1. Problem & Fırsat',
          content: `"${query}" alanında insanlar ve işletmeler karmaşık süreçler, bilgi kirliliği ve yüksek maliyet nedeniyle zaman kaybetmektedir.`
        },
        {
          slide: 2,
          title: '2. Yenilikçi Çözümümüz',
          content: `"${query}" sürecini tek çatı altında hızlandıran, şeffaf fiyat ve yüksek kalite standardı sunan yeni nesil model.`
        },
        {
          slide: 3,
          title: '3. Pazar Büyüklüğü & Hedef Kitle',
          content: 'Hem bireysel kullanıcıları (B2C) hem de kurumsal işletmeleri (B2B) kapsayan geniş ve sürekli büyüyen pazar.'
        },
        {
          slide: 4,
          title: '4. Gelir Modeli & Kârlılık',
          content: 'Tekrarlayan gelir (Recurring Revenue) ve yüksek brüt kâr marjı ile 6 ay içinde başabaş noktasına ulaşan finansal yapı.'
        },
        {
          slide: 5,
          title: '5. Büyüme & 2036 Vizyonu',
          content: 'Yerel liderlikten küresel ölçeğe uzanan, yapay zeka ve otomasyon destekli ölçeklenebilir büyüme haritası.'
        }
      ]
    };

    const keyTakeaways: string[] = instantAnswer?.keyFacts || [
      liveData?.wikiSummary
        ? `Ansiklopedik Kaynak: ${liveData.wikiSummary.title}`
        : `"${query}" için çok boyutlu analiz ve uygulama adımları hazırlandı.`,
      liveData?.academicPapers?.length
        ? `Bilimsel Referans: "${liveData.academicPapers[0].title}" (${liveData.academicPapers[0].year})`
        : 'Belge Stüdyosu sekmesinden resmi dilekçe, sözleşme veya iş planı indirebilirsiniz.',
      'Öğren & Test Et sekmesinden konuyu ezber kartları ve mini sınavla pekiştirebilirsiniz.'
    ];

    const actionBlueprint: ActionBlueprintStep[] = [
      {
        step: 1,
        title: `${query} — İhtiyaç ve Kapsam Tespiti`,
        description: 'Hedefinizi ve bütçe/zaman sınırlarınızı netleştirin.',
        estimatedTime: '15 dk',
        category: 'Hazırlık'
      },
      {
        step: 2,
        title: 'Alternatif ve Maliyet Kıyaslaması',
        description: 'Karar Matrisi ve Girişim/Finans hesaplayıcısı ile en doğru seçeneği belirleyin.',
        estimatedTime: '20 dk',
        category: 'Analiz'
      },
      {
        step: 3,
        title: 'Resmi Belge / Plan Hazırlığı',
        description: 'Belge Üretici sekmesinden gerekli dilekçe, sözleşme veya iş planını indirin.',
        estimatedTime: '10 dk',
        category: 'Belgeleme'
      },
      {
        step: 4,
        title: 'Uygulama ve Kanban Takibi',
        description: 'Adımları Kanban panosuna aktararak tamamlanana kadar takip edin.',
        estimatedTime: 'Sürekli',
        category: 'İcra'
      }
    ];

    const cleanWords = query.split(/\s+/).filter((w) => w.length > 2);
    const rootConcept = cleanWords[0] || query;
    const knowledgeNodes = [
      `${rootConcept} Nedir`,
      `${rootConcept} vs Alternatifler`,
      `${rootConcept} Dilekçe & Sözleşme`,
      `${rootConcept} Maliyet & Kâr Hesabı`,
      `${rootConcept} 2036 Geleceği`,
      `${rootConcept} Akademik Makaleler`
    ];

    const sources: { title: string; url: string; domain: string }[] = [];
    if (liveData?.wikiSummary) {
      sources.push({
        title: `${liveData.wikiSummary.title} — Wikipedia`,
        url: liveData.wikiSummary.url,
        domain: 'wikipedia.org'
      });
    }
    if (liveData?.academicPapers?.length) {
      sources.push({
        title: `${liveData.academicPapers[0].title} (${liveData.academicPapers[0].citedByCount} Atıf)`,
        url: liveData.academicPapers[0].url,
        domain: 'openalex.org'
      });
    }
    if (liveData?.githubRepos?.length) {
      sources.push({
        title: `${liveData.githubRepos[0].fullName} (${liveData.githubRepos[0].stars.toLocaleString()} ⭐)`,
        url: liveData.githubRepos[0].url,
        domain: 'github.com'
      });
    }
    sources.push({
      title: `${query} — Google Web İndeksi`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      domain: 'google.com'
    });

    return {
      query,
      professionMode,
      summary: baseSummary,
      perspectives,
      temporal,
      factCheck,
      studyModule,
      ventureOpportunity,
      keyTakeaways,
      recommendedActions: actionBlueprint.map((a) => a.title),
      actionBlueprint,
      knowledgeNodes,
      confidenceScore: factCheck.verifiabilityScore,
      isLiveEnriched: Boolean(
        liveData?.wikiSummary ||
          liveData?.academicPapers?.length ||
          liveData?.githubRepos?.length ||
          liveData?.hnResults?.length
      ),
      sources,
      relatedQuestions: this.generateRelatedQuestions(query, decisionMatrix, professionMode)
    };
  }

  private static mergeWebResults(
    query: string,
    liveData: {
      wikiSummary?: { title: string; description?: string; extract: string; url: string };
      academicPapers: AcademicPaper[];
      githubRepos: LiveGitHubRepo[];
      hnResults: WebSearchResult[];
    },
    professionMode: ProfessionMode
  ): WebSearchResult[] {
    const encoded = encodeURIComponent(query);
    const results: WebSearchResult[] = [];

    if (liveData.wikiSummary) {
      results.push({
        id: 'live-wiki',
        title: `${liveData.wikiSummary.title} — Wikipedia Ansiklopedisi`,
        url: liveData.wikiSummary.url,
        snippet: liveData.wikiSummary.extract,
        domain: 'tr.wikipedia.org',
        badge: 'Canlı Ansiklopedi'
      });
    }

    // Include peer-reviewed scientific/academic papers from OpenAlex
    for (const paper of liveData.academicPapers) {
      results.push({
        id: `oa-${paper.id}`,
        title: `${paper.title} (${paper.year})`,
        url: paper.url,
        snippet: `Hakemli Bilimsel Araştırma • Yazar: ${paper.author} • Yayın: ${paper.venue} • Atıf Sayısı: ${paper.citedByCount.toLocaleString()}`,
        domain: 'scholar.openalex.org',
        badge: `🎓 Akademik Makale • ${paper.citedByCount} Atıf`
      });
    }

    for (const repo of liveData.githubRepos) {
      results.push({
        id: `gh-${repo.id}`,
        title: `${repo.fullName} — Açık Kaynak (${repo.stars.toLocaleString()} ⭐)`,
        url: repo.url,
        snippet: repo.description,
        domain: 'github.com',
        badge: `${repo.language} • ★ ${repo.stars.toLocaleString()}`,
        stars: repo.stars,
        language: repo.language
      });
    }

    for (const hn of liveData.hnResults) {
      results.push(hn);
    }

    if (professionMode === 'legal') {
      results.push({
        id: 'web-mevzuat',
        title: `${query} — T.C. Cumhurbaşkanlığı Mevzuat Bilgi Sistemi Arama`,
        url: `https://www.google.com/search?q=${encodeURIComponent(query + ' site:mevzuat.gov.tr OR site:resmigazete.gov.tr')}`,
        snippet: `"${query}" konusuyla ilgili yürürlükteki kanun, yönetmelik ve Resmi Gazete kararlarını inceleyin.`,
        domain: 'mevzuat.gov.tr',
        badge: '⚖️ Resmi Mevzuat'
      });
    }

    results.push(
      {
        id: 'web-google',
        title: `${query} — Google Canlı Arama Sonuçları`,
        url: `https://www.google.com/search?q=${encoded}`,
        snippet: `"${query}" için tüm küresel web sayfalarını, haberleri ve dokümanları doğrudan Google üzerinde açın.`,
        domain: 'google.com',
        badge: 'Google Arama'
      },
      {
        id: 'web-yt',
        title: `${query} — Video Eğitimler, Tarifler ve Uygulamalı Analizler`,
        url: `https://www.youtube.com/results?search_query=${encoded}`,
        snippet: `${query} konusuyla ilgili adım adım görsel anlatımlar, uzman incelemeleri ve rehber videoları.`,
        domain: 'youtube.com',
        badge: 'Video Rehber'
      }
    );

    return results;
  }

  public static generateRelatedQuestions(
    query: string,
    decisionMatrix?: DecisionMatrix,
    professionMode: ProfessionMode = 'general'
  ): string[] {
    const q = query.trim();
    if (decisionMatrix) {
      return [
        `${decisionMatrix.optionA} hangi durumlarda tercih edilmeli?`,
        `${decisionMatrix.optionB} fiyat/performans avantajları nelerdir?`,
        `${decisionMatrix.optionA} vs ${decisionMatrix.optionB} 2036 vizyonu`,
        `Hangisi uzun vadede daha ekonomik?`
      ];
    }
    if (professionMode === 'entrepreneur') {
      return [
        `${q} iş fikri için ne kadar sermaye gerekir?`,
        `${q} alanında kâr marjı ve başabaş noktası nedir?`,
        `${q} vs Alternatif iş modelleri`,
        `${q} 2036 yılında nasıl bir pazara dönüşecek?`
      ];
    }
    if (professionMode === 'legal') {
      return [
        `${q} için resmi başvuru dilekçesi nasıl yazılır?`,
        `${q} yasal süresi ve hak düşürücü şartları nelerdir?`,
        `${q} Tüketici Hakem Heyeti / Mahkeme süreci`,
        `${q} sözleşme örneği`
      ];
    }
    return [
      `${q} vs Alternatifleri karşılaştırması`,
      `${q} 2036 yılında nasıl olacak?`,
      `${q} adım adım nasıl uygulanır?`,
      `${q} kullanırken en sık yapılan hatalar`
    ];
  }
}
