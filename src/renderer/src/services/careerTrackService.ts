export interface PowerJargonItem {
  term: string;
  tr: string;
  example: string;
}

export interface CareerScenario {
  id: string;
  title: string;
  turkishTitle: string;
  characterName: string;
  characterRole: string;
  prompt: string;
  promptTr: string;
  targetKeywords: string[];
  suggestedReplies: string[];
}

export interface CareerTrack {
  id: string;
  title: string;
  turkishTitle: string;
  icon: string;
  description: string;
  powerJargon: PowerJargonItem[];
  scenarios: CareerScenario[];
}

export interface CareerEvaluationResult {
  score: number;
  matchedKeywords: string[];
  professionalTone: 'excellent' | 'competent' | 'needs_improvement';
  feedback: string;
  feedbackTr: string;
}

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'tech',
    title: 'IT & Software Engineering',
    turkishTitle: 'IT, Yazılım & Yapay Zekâ',
    icon: '💻',
    description: 'Daily standup toplantıları, kod incelemeleri, sistem mimarisi ve teknik engel açıklamaları.',
    powerJargon: [
      {
        term: 'Blocker',
        tr: 'İlerlemeyi durduran engel/tıkanıklık',
        example: "I don't have any blockers right now; I am waiting for the API review."
      },
      {
        term: 'Bandwidth',
        tr: 'Zaman veya iş gücü kapasitesi',
        example: 'I do not have the bandwidth this sprint to pick up extra tickets.'
      },
      {
        term: 'Refactor',
        tr: 'Kodu yeniden düzenleyip iyileştirme',
        example: 'We need to refactor the payment gateway to decrease technical debt.'
      },
      {
        term: 'Touch base',
        tr: 'Hızlıca bir araya gelip durumu güncelleme',
        example: 'Let us touch base after the deployment to monitor the error logs.'
      }
    ],
    scenarios: [
      {
        id: 'tech_standup',
        title: 'Daily Standup Update',
        turkishTitle: 'Günlük Standup Bilgilendirmesi',
        characterName: 'Sarah Chen',
        characterRole: 'Staff Software Architect (Silicon Valley)',
        prompt: 'Morning everyone! Please share your quick standup update: what did you ship yesterday, what is on your plate today, and do you have any blocker?',
        promptTr: 'Günaydın herkese! Lütfen standup güncellemenizi paylaşın: dün ne teslim ettiniz, bugün ne üzerinde çalışıyorsunuz ve herhangi bir engeliniz var mı?',
        targetKeywords: ['yesterday', 'today', 'blocker', 'deploy', 'refactor', 'test', 'ticket'],
        suggestedReplies: [
          'Yesterday I finished the user authentication endpoints. Today I am writing integration tests, and I have no blockers.',
          'Yesterday I merged the frontend redesign PR. Today I am addressing QA feedback, and I am waiting on API credentials as a minor blocker.',
          'I completed the database migration yesterday. Today I will monitor latency in staging. All clear on my end.'
        ]
      },
      {
        id: 'tech_incident',
        title: 'Production Incident & Post-Mortem',
        turkishTitle: 'Canlı Ortam Kesintisi & Kriz Açıklaması',
        characterName: 'David Miller',
        characterRole: 'VP of Engineering',
        prompt: 'We noticed a sudden spike in 500 errors in the checkout flow. Can you walk me through the root cause and our mitigation plan?',
        promptTr: 'Ödeme akışında ani bir 500 hata artışı fark ettik. Temel nedeni ve azaltma planımızı açıklar mısınız?',
        targetKeywords: ['root cause', 'mitigation', 'rollback', 'latency', 'fix', 'monitor', 'patch'],
        suggestedReplies: [
          'The root cause was a memory leak in the redis caching layer. We rolled back the latest build and latency is back to normal.',
          'We identified a misconfigured environment variable during deployment. A hotfix was deployed and we are monitoring logs.',
          'The issue stemmed from an unhandled null pointer. We isolated the service and implemented a defensive fallback.'
        ]
      }
    ]
  },
  {
    id: 'interview',
    title: 'Global Job Interview',
    turkishTitle: 'Uluslararası İş Görüşmesi & Mülakat',
    icon: '👔',
    description: 'STAR metodolojisiyle yetkinlik anlatımı, güçlü yönler, maaş ve kariyer hedefleri.',
    powerJargon: [
      {
        term: 'Value proposition',
        tr: 'Şirkete kattığınız temel değer teklifi',
        example: 'My value proposition lies in bridging business vision with technical execution.'
      },
      {
        term: 'Deliverable',
        tr: 'Teslim edilmesi taahhüt edilen somut iş çıktısı',
        example: 'I have consistently met all milestone deliverables ahead of schedule.'
      },
      {
        term: 'KPI (Key Performance Indicator)',
        tr: 'Temel performans göstergesi',
        example: 'In my last role, we exceeded our conversion KPIs by 28 percent.'
      },
      {
        term: 'Scalability',
        tr: 'Ölçeklenebilirlik / Büyümeye uyum',
        example: 'Designing for scalability allowed us to support millions of concurrent users.'
      }
    ],
    scenarios: [
      {
        id: 'interview_intro',
        title: 'Self-Introduction & Core Strengths',
        turkishTitle: 'Kendini Tanıtma & Temel Yetkinlikler',
        characterName: 'Elena Rostova',
        characterRole: 'Global Talent Acquisition Partner',
        prompt: 'Welcome to this interview! To start off, could you briefly introduce yourself and highlight your biggest professional accomplishment?',
        promptTr: 'Mülakatımıza hoş geldiniz! Başlangıç olarak, kendinizi kısaca tanıtır ve en büyük profesyonel başarınızdan bahseder misiniz?',
        targetKeywords: ['experience', 'strength', 'accomplishment', 'team', 'grow', 'lead', 'deliver'],
        suggestedReplies: [
          'I have over 5 years of experience in product development. My biggest accomplishment was scaling our platform to over 100,000 active users.',
          'I specialize in full-stack engineering and cross-functional leadership. I recently spearheaded a system rewrite that cut operational costs by 30%.',
          'I bring strong analytical thinking and proactive problem-solving to fast-paced international teams.'
        ]
      },
      {
        id: 'interview_conflict',
        title: 'Handling Conflict (STAR Method)',
        turkishTitle: 'Çatışma & Kriz Yönetimi (STAR Yöntemi)',
        characterName: 'Marcus Vance',
        characterRole: 'Hiring Director',
        prompt: 'Tell me about a time you had a strong disagreement with a colleague or stakeholder on a project. How did you handle it and what was the outcome?',
        promptTr: 'Bir projede bir meslektaşınızla veya paydaşla ciddi bir fikir ayrılığı yaşadığınız bir anı anlatın. Nasıl yönettiniz ve sonuç ne oldu?',
        targetKeywords: ['situation', 'task', 'action', 'result', 'listen', 'compromise', 'outcome', 'consensus'],
        suggestedReplies: [
          'We disagreed on architectural choices. I set up a benchmark test comparing both methods objectively, which led us to a data-driven consensus.',
          'I scheduled a one-on-one session to understand their constraints, and together we reached a balanced compromise that met the launch deadline.',
          'By focusing on user needs rather than personal opinions, we aligned the entire team around a shared priority.'
        ]
      }
    ]
  },
  {
    id: 'visa',
    title: 'Visa & Border Interview',
    turkishTitle: 'Vize Mülakatı & Konsolosluk',
    icon: '🛂',
    description: 'ABD/İngiltere vize memuru soruları, pasaport kontrolü ve seyahat niyet beyanları.',
    powerJargon: [
      {
        term: 'Purpose of visit',
        tr: 'Ziyaret amacı',
        example: 'The primary purpose of my visit is to attend an international tech conference.'
      },
      {
        term: 'Ties to home country',
        tr: 'Kendi ülkesine bağlayan iş/mülk/aile bağları',
        example: 'I have strong ties to my home country, including my permanent job and property.'
      },
      {
        term: 'Itinerary',
        tr: 'Seyahat planı ve konaklama çizelgesi',
        example: 'Here is my detailed day-to-day itinerary along with hotel reservations.'
      },
      {
        term: 'Sponsorship',
        tr: 'Maddi masrafların karşılanması / Sponsorluk',
        example: 'My employer is fully sponsoring all travel expenses and accommodations.'
      }
    ],
    scenarios: [
      {
        id: 'visa_purpose',
        title: 'Purpose of Visit & Duration',
        turkishTitle: 'Ziyaret Amacı ve Kalış Süresi',
        characterName: 'Officer Bradley',
        characterRole: 'Consular Visa Officer (US Embassy)',
        prompt: 'Good morning. What is the primary purpose of your travel to the United States, and how long do you intend to stay?',
        promptTr: 'Günaydın. Amerika Birleşik Devletleri seyahatinizin birincil amacı nedir ve ne kadar süre kalmayı planlıyorsunuz?',
        targetKeywords: ['purpose', 'travel', 'conference', 'vacation', 'stay', 'return', 'ticket', 'days'],
        suggestedReplies: [
          'The purpose of my trip is to attend an AI conference in San Francisco for 7 days, after which I will return to my full-time job.',
          'I am traveling for tourism and cultural sightseeing for 10 days with round-trip tickets already booked.',
          'I am participating in a specialized professional workshop in New York for two weeks.'
        ]
      },
      {
        id: 'visa_ties',
        title: 'Employment & Home Country Ties',
        turkishTitle: 'İş Durumu ve Ülke Bağları',
        characterName: 'Officer Bradley',
        characterRole: 'Consular Visa Officer (US Embassy)',
        prompt: 'Where are you currently employed, and who is covering your financial expenses during this trip?',
        promptTr: 'Şu anda nerede çalışıyorsunuz ve bu seyahat sırasındaki maddi harcamalarınızı kim karşılıyor?',
        targetKeywords: ['employed', 'company', 'salary', 'finance', 'sponsor', 'savings', 'expenses'],
        suggestedReplies: [
          'I work as a senior software engineer at a global firm, and my employer is covering all travel expenses.',
          'I am self-funding this vacation through my personal savings, and I have provided bank statements demonstrating financial stability.',
          'I have been with my current company for over 4 years and will resume work immediately upon my return.'
        ]
      }
    ]
  },
  {
    id: 'business',
    title: 'International Business & Sales',
    turkishTitle: 'Uluslararası Ticaret & Müşteri İletişimi',
    icon: '🤝',
    description: 'Ürün demosu, müşteri itirazlarını karşılama, sözleşme ve ortaklık müzakeresi.',
    powerJargon: [
      {
        term: 'Win-win',
        tr: 'Her iki tarafın da kazandığı anlaşma',
        example: 'Our proposed structure creates a true win-win for both organizations.'
      },
      {
        term: 'Ballpark figure',
        tr: 'Yaklaşık / Tahmini maliyet rakamı',
        example: 'Can you provide a ballpark figure for the annual enterprise license?'
      },
      {
        term: 'Action item',
        tr: 'Toplantı sonrası yapılması kararlaştırılan somut görev',
        example: 'Let us document the key action items and assign owners before adjourning.'
      },
      {
        term: 'Bottom line',
        tr: 'Nihai kârlılık veya en temel belirleyici nokta',
        example: 'The bottom line is that this automation tool saves 200 hours per month.'
      }
    ],
    scenarios: [
      {
        id: 'business_demo',
        title: 'Executive Value Pitch',
        turkishTitle: 'Yöneticiye Değer Sunumu & Demo',
        characterName: 'Jonathan Sterling',
        characterRole: 'Chief Commercial Officer',
        prompt: 'Thanks for this presentation. In one concise paragraph, what makes your solution superior to other competitors in our market?',
        promptTr: 'Bu sunum için teşekkürler. Tek bir özlü paragrafta, çözümünüzü pazarımızdaki diğer rakiplerden üstün kılan nedir?',
        targetKeywords: ['solution', 'advantage', 'cost', 'roi', 'efficiency', 'secure', 'differentiator'],
        suggestedReplies: [
          'Our solution cuts integration time by 50% while delivering a proven 3x return on investment within the first quarter.',
          'Unlike traditional alternatives, our AI engine operates with zero latency and enterprise-grade data privacy.',
          'We provide end-to-end automation with dedicated 24/7 client onboarding, guaranteeing smooth adoption.'
        ]
      },
      {
        id: 'business_objection',
        title: 'Handling Price Objection',
        turkishTitle: 'Fiyat İtirazını Müzakere Etme',
        characterName: 'Jonathan Sterling',
        characterRole: 'Chief Commercial Officer',
        prompt: 'Your platform looks impressive, but honestly the pricing is roughly 20% higher than our budget allowance. How can we make this work?',
        promptTr: 'Platformunuz etkileyici görünüyor, ancak dürüst olmak gerekirse fiyatlandırma bütçemizden yaklaşık %20 daha yüksek. Bunu nasıl çözebiliriz?',
        targetKeywords: ['flexible', 'tier', 'value', 'discount', 'contract', 'scope', 'payment', 'terms'],
        suggestedReplies: [
          'We can structure a tiered rollout or offer a discount in exchange for an annual multi-year commitment.',
          'Let us review the scope together so we can prioritize high-impact modules that fit directly within your initial budget.',
          'The upfront cost is quickly offset by the recurring labor hours your team will save from week one.'
        ]
      }
    ]
  }
];

export const GERMAN_CAREER_TRACKS: CareerTrack[] = [
  // ==================== ALMANYA VİZE & KARİYER PAKETLERİ (DEUTSCH) ====================
  {
    id: 'german_visa',
    title: 'Almanya Konsolosluğu Vize Mülakatı',
    turkishTitle: '🇩🇪 Almanya Vize & Konsolosluk Mülakatı',
    icon: '🛂',
    description: 'Almanya Konsolosluğu vize memurunun seyahat amacı, kalış süresi ve mali güvence sorularına özgüvenle cevap verin.',
    powerJargon: [
      {
        term: 'Aufenthaltstitel',
        tr: 'Oturma izni / İkamet tezkeresi',
        example: 'Ich beantrage eine Blaue Karte EU als Softwareentwickler.'
      },
      {
        term: 'Krankenversicherung',
        tr: 'Sağlık sigortası',
        example: 'Ich habe eine lückenlose deutsche Krankenversicherung abgeschlossen.'
      },
      {
        term: 'Sperrkonto',
        tr: 'Bloke hesap (Öğrenci/İş arama güvencesi)',
        example: 'Mein Sperrkonto bei einer deutschen Bank deckt alle Lebenshaltungskosten ab.'
      }
    ],
    scenarios: [
      {
        id: 'de_visa_purpose',
        title: 'Zweck des Aufenthalts',
        turkishTitle: 'Almanya\'ya Gidiş Amacı & Kalış Planı',
        characterName: 'Herr Schmidt',
        characterRole: 'Konsulatsbeamter (Deutsches Generalkonsulat)',
        prompt: 'Guten Tag! Was ist der genaue Zweck Ihrer Reise nach Deutschland und wie lange planen Sie zu bleiben?',
        promptTr: 'İyi günler! Almanya seyahatinizin tam amacı nedir ve ne kadar süre kalmayı planlıyorsunuz?',
        targetKeywords: ['zweck', 'arbeiten', 'studium', 'vertrag', 'aufenthalt', 'deutschland', 'berlin'],
        suggestedReplies: [
          'Guten Tag! Ich habe einen unbefristeten Arbeitsvertrag als Ingenieur in Frankfurt und reise für meine berufliche Tätigkeit ein.',
          'Ich habe eine Zulassung an der Technischen Universität München für meinen Master und werde dort zwei Jahre studieren.',
          'Ich reise mit einem Visum zur Arbeitsplatzsuche ein und meine Finanzierung ist durch ein Sperrkonto vollständig gesichert.'
        ]
      },
      {
        id: 'de_visa_accommodation',
        title: 'Unterkunft und Lebensunterhalt',
        turkishTitle: 'Konaklama Yeri ve Yaşam Masrafları',
        characterName: 'Frau Weber',
        characterRole: 'Visa-Sachbearbeiterin',
        prompt: 'Wo werden Sie in den ersten Wochen wohnen und wie finanzieren Sie Ihren Lebensunterhalt in Deutschland?',
        promptTr: 'İlk haftalarda nerede ikamet edeceksiniz ve Almanya\'daki yaşam masraflarınızı nasıl finanse edeceksiniz?',
        targetKeywords: ['wohnung', 'hotel', 'gehalt', 'konto', 'finanzieren', 'monatlich', 'versicherung'],
        suggestedReplies: [
          'Für den ersten Monat habe ich eine möblierte Wohnung gemietet, und mein Monatsgehalt sichert meinen Lebensunterhalt vollständig ab.',
          'Ich habe bereits eine Unterkunft über meinen Arbeitgeber reserviert und verfüge über ausreichende finanzielle Mittel.',
          'Mein Sperrkonto enthält den geforderten Betrag für ein ganzes Jahr, inklusive voller Krankenversicherung.'
        ]
      }
    ]
  },
  {
    id: 'german_health',
    title: 'Almanya Sağlık & Klinik Hemşirelik',
    turkishTitle: '🇩🇪 Almanya Sağlık, Doktor & Hemşirelik',
    icon: '🩺',
    description: 'Alman hastane ve kliniklerinde hasta kabulü, semptom sorma ve hekim raporlama diyalogları.',
    powerJargon: [
      {
        term: 'Anamnese',
        tr: 'Hasta tıbbi öyküsü / Geçmişi',
        example: 'Wir müssen zuerst eine gründliche Anamnese durchführen.'
      },
      {
        term: 'Blutdruck',
        tr: 'Tansiyon / Kan basıncı',
        example: 'Ich werde jetzt Ihren Blutdruck und Puls messen.'
      },
      {
        term: 'Beschwerden',
        tr: 'Şikayetler / Ağrı',
        example: 'Seit wann haben Sie diese akuten Beschwerden?'
      }
    ],
    scenarios: [
      {
        id: 'de_med_intake',
        title: 'Patientenaufnahme & Symptome',
        turkishTitle: 'Hasta Kabul & Şikayet Tespiti',
        characterName: 'Dr. Hoffmann',
        characterRole: 'Oberarzt (Uniklinik Berlin)',
        prompt: 'Guten Tag! Der neue Patient klagt über starke Brustschmerzen. Wie ist sein aktueller Zustand und was haben Sie dokumentiert?',
        promptTr: 'İyi günler! Yeni hasta şiddetli göğüs ağrısından şikayet ediyor. Mevcut durumu nasıl ve neleri kaydettiniz?',
        targetKeywords: ['blutdruck', 'schmerzen', 'zustand', 'puls', 'stabil', 'medikamente', 'patient'],
        suggestedReplies: [
          'Der Blutdruck liegt bei 130 zu 85, der Puls ist stabil. Ich habe ihm ein EKG angelegt und den Kardiologen informiert.',
          'Der Patient berichtet von ziehenden Schmerzen seit heute Morgen. Die Vitalwerte sind stabil und die Akte ist vorbereitet.',
          'Wir haben die Erstversorgung abgeschlossen, Vitalzeichen gemessen und die Blutprobe ins Labor geschickt.'
        ]
      }
    ]
  }
];

export class CareerTrackService {
  public static getTracks(lang?: string): CareerTrack[] {
    if (lang === 'de') {
      return [...GERMAN_CAREER_TRACKS, ...CAREER_TRACKS];
    }
    return CAREER_TRACKS;
  }

  public static getTrackById(id: string): CareerTrack | undefined {
    return [...CAREER_TRACKS, ...GERMAN_CAREER_TRACKS].find(t => t.id === id);
  }

  public static evaluateCareerSpeech(
    scenario: CareerScenario,
    speechText: string
  ): CareerEvaluationResult {
    const text = (speechText || '').trim();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount < 4) {
      return {
        score: 45,
        matchedKeywords: [],
        professionalTone: 'needs_improvement',
        feedback: 'Your answer is too brief for an executive or professional conversation. Provide more detail.',
        feedbackTr: 'Yanıtınız profesyonel veya kurumsal bir görüşme için çok kısa. Daha fazla detay ve bağlam sunun.'
      };
    }

    const lower = text.toLowerCase();
    const matched = scenario.targetKeywords.filter(kw => lower.includes(kw.toLowerCase()));

    let score = 65;
    if (wordCount >= 10) score += 10;
    if (wordCount >= 18) score += 10;
    score += Math.min(20, matched.length * 6);

    score = Math.min(100, Math.max(40, score));

    let tone: 'excellent' | 'competent' | 'needs_improvement' = 'competent';
    if (score >= 82) tone = 'excellent';
    else if (score < 60) tone = 'needs_improvement';

    return {
      score,
      matchedKeywords: matched,
      professionalTone: tone,
      feedback:
        score >= 82
          ? 'Outstanding executive delivery! You articulated your points clearly with industry-standard terminology.'
          : 'Solid response! You communicated your core thought; consider incorporating more target professional keywords.',
      feedbackTr:
        score >= 82
          ? 'Mükemmel kurumsal anlatım! Düşüncelerinizi uluslararası iş standartlarına uygun terminolojiyle çok net ifade ettiniz.'
          : 'Başarılı bir yanıt! Ana mesajı aktardınız; hedeflenen mesleki anahtar kelimeleri daha fazla kullanarak cümlenizi zenginleştirebilirsiniz.'
    };
  }
}
