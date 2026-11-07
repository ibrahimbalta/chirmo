import React, { useState, useEffect } from 'react';
import {
  Film,
  Play,
  Volume2,
  BookmarkPlus,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Clock,
  ArrowRight,
  Check,
  Mic,
  MicOff,
  Award,
  HelpCircle,
  Lightbulb,
  PlusCircle,
  Eye,
  EyeOff,
  BookOpen,
  X,
  FileText,
  ListPlus,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService } from '../../services/learningStorage';

export interface SubtitleLine {
  id: number;
  timeSec: number;
  timeStr: string;
  en: string;
  tr: string;
  level: CEFRLevel;
  highlightWords: string[];
  blankTargetWord?: string;
  quizOptions?: string[];
}

export const extractYouTubeVideoId = (input: string): string | null => {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regexes = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/
  ];
  for (const r of regexes) {
    const m = trimmed.match(r);
    if (m && m[1]) return m[1];
  }
  return null;
};

import {
  type ParsedTranscriptLine,
  getQuickTurkishPreview,
  parseYouTubeTranscriptText,
  convertParsedToSubtitleLines
} from '../../utils/transcriptParser';

export {
  type ParsedTranscriptLine,
  getQuickTurkishPreview,
  parseYouTubeTranscriptText,
  convertParsedToSubtitleLines
};

export interface InteractiveLessonData {
  sentenceEn: string;
  sentenceTr: string;
  phonetic: string;
  teacherExplanation: string;
  grammarFocus: string;
  substitutionDrills: { en: string; tr: string }[];
  quizQuestion: string;
  quizOptions: string[];
  correctOptionIndex: number;
}

export interface VideoVocabularyItem {
  word: string;
  phonetic: string;
  meaning: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  channel: string;
  level: CEFRLevel;
  duration: string;
  youtubeId: string;
  thumbnail: string;
  category: 'Film' | 'TED' | 'Haber' | 'İş & Kariyer' | 'Müzik' | 'Özel';
  description: string;
  englishSummary?: string;
  turkishSummary?: string;
  keyVocabulary?: VideoVocabularyItem[];
  subtitles: SubtitleLine[];
}

export const CURATED_VIDEOS: VideoLesson[] = [
  // 0. ÇİZGİ FİLM & GÜNLÜK DİYALOG (KULLANICI VİDEOSU)
  {
    id: 'cartoon-1',
    title: 'İngilis Dilində Cizgi Film - Hediye Kutusu & Günlük Konuşma',
    channel: 'Məzunların xatirələri',
    level: 'A1',
    duration: '5:15',
    youtubeId: 'lFy4dr4evW8',
    thumbnail: 'https://i.ytimg.com/vi/lFy4dr4evW8/hqdefault.jpg',
    category: 'Film',
    description: 'Renkli ve eğlenceli çizgi film ile temel İngilizce soru kalıpları, nesneler ve hediyeleşme diyalogları.',
    englishSummary: "A delightful animated cartoon designed for beginners. The characters encounter a mysterious surprise gift box and ask essential everyday questions like What's that?'. The story teaches learners how to express surprise, gratitude, and happiness in natural spoken English.",
    turkishSummary: "Yeni başlayanlar için hazırlanan bu sevimli çizgi filmde karakterler sürpriz bir hediye kutusuyla karşılaşır. O nedir? (What's that?) gibi temel soru kalıplarını, hediyeleşme jestlerini ve teşekkür ifadelerini doğal diyaloglarla öğretir.",
    keyVocabulary: [
      { word: 'gift box', phonetic: '/ɡɪft bɒks/', meaning: 'Hediye kutusu' },
      { word: 'surprise', phonetic: '/səˈpraɪz/', meaning: 'Sürpriz, beklenmedik an' },
      { word: 'inside', phonetic: '/ɪnˈsaɪd/', meaning: 'İçinde, içine bakmak' },
      { word: 'lovely', phonetic: '/ˈlʌvli/', meaning: 'Sevimli, harika' }
    ],
    subtitles: [
      {
        id: 1,
        timeSec: 10,
        timeStr: '0:10',
        en: 'Hello my friends, welcome to our lovely story!',
        tr: 'Merhaba arkadaşlarım, sevimli hikayemize hoş geldiniz!',
        level: 'A1',
        highlightWords: ['friends', 'welcome', 'lovely'],
        blankTargetWord: 'welcome',
        quizOptions: ['welcome', 'angry', 'goodbye']
      },
      {
        id: 2,
        timeSec: 26,
        timeStr: '0:26',
        en: "What's that?",
        tr: 'O nedir? / Şu ne?',
        level: 'A1',
        highlightWords: ['what', 'that'],
        blankTargetWord: 'that',
        quizOptions: ['that', 'who', 'where']
      },
      {
        id: 3,
        timeSec: 45,
        timeStr: '0:45',
        en: 'It is a lovely surprise gift box for you!',
        tr: 'Bu senin için harika bir sürpriz hediye kutusu!',
        level: 'A1',
        highlightWords: ['surprise', 'gift', 'box'],
        blankTargetWord: 'gift',
        quizOptions: ['gift', 'stone', 'cloud']
      },
      {
        id: 4,
        timeSec: 70,
        timeStr: '1:10',
        en: 'Can you open the box and see inside?',
        tr: 'Kutuyu açıp içine bakabilir misin?',
        level: 'A1',
        highlightWords: ['open', 'inside'],
        blankTargetWord: 'open',
        quizOptions: ['open', 'break', 'lose']
      },
      {
        id: 5,
        timeSec: 95,
        timeStr: '1:35',
        en: 'Thank you so much, this makes me very happy!',
        tr: 'Çok teşekkür ederim, bu beni çok mutlu etti!',
        level: 'A1',
        highlightWords: ['happy', 'thank'],
        blankTargetWord: 'happy',
        quizOptions: ['happy', 'sad', 'tired']
      }
    ]
  },
  // 1. FİLM & SİNEMA
  {
    id: 'film-1',
    title: 'Dead Poets Society - Carpe Diem & Seize The Day',
    channel: 'Touchstone Pictures',
    level: 'B2',
    duration: '3:15',
    youtubeId: 'qQtmGceG9NA',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    category: 'Film',
    description: 'Efsanevi edebiyat öğretmeni John Keating, öğrencilerine anı yakalamayı ve kendi seslerini bulmayı öğretiyor.',
    englishSummary: "Professor John Keating delivers his legendary lecture on Carpe Diem (Seize the Day). He inspires his students to live extraordinary lives and reminds them that while sciences and law sustain biological life, art, poetry, and love are the true reasons we exist.",
    turkishSummary: "Efsane edebiyat öğretmeni Keating, öğrencilerine Carpe Diem felsefesini aktarır. Bilim ve hukukun hayatı devam ettirmek için elzem olduğunu; ancak şiir, sanat ve aşkın hayatta kalmamızın asıl gayesi olduğunu vurgular.",
    keyVocabulary: [
      { word: 'seize', phonetic: '/siːz/', meaning: 'Anı yakalamak, kavramak' },
      { word: 'extraordinary', phonetic: '/ɪkˈstrɔːrdəneri/', meaning: 'Olağanüstü, sıra dışı' },
      { word: 'noble', phonetic: '/ˈnoʊbl/', meaning: 'Asil, soylu' },
      { word: 'pursuits', phonetic: '/pərˈsuːts/', meaning: 'Uğraşlar, arayışlar' }
    ],
    subtitles: [
      {
        id: 1,
        timeSec: 10,
        timeStr: '0:10',
        en: 'Carpe diem. Seize the day, boys. Make your lives extraordinary.',
        tr: 'Carpe diem. Günü yakalayın çocuklar. Hayatlarınızı olağanüstü kılın.',
        level: 'B2',
        highlightWords: ['seize', 'extraordinary'],
        blankTargetWord: 'extraordinary',
        quizOptions: ['extraordinary', 'ordinary', 'dangerous']
      },
      {
        id: 2,
        timeSec: 35,
        timeStr: '0:35',
        en: 'We read and write poetry because we are members of the human race.',
        tr: 'Şiir okur ve yazarız çünkü insan ırkının birer üyesiyiz.',
        level: 'B1',
        highlightWords: ['poetry', 'members'],
        blankTargetWord: 'poetry',
        quizOptions: ['poetry', 'mathematics', 'silence']
      },
      {
        id: 3,
        timeSec: 65,
        timeStr: '1:05',
        en: 'Medicine, law, and engineering are noble pursuits, but poetry and romance are what we stay alive for.',
        tr: 'Tıp, hukuk ve mühendislik asil uğraşlardır; ancak şiir ve aşk, uğruna hayatta kaldığımız şeylerdir.',
        level: 'C1',
        highlightWords: ['noble', 'pursuits', 'romance'],
        blankTargetWord: 'noble',
        quizOptions: ['noble', 'useless', 'simple']
      }
    ]
  },
  {
    id: 'film-2',
    title: 'Inception - The Anatomy of a Resilient Idea',
    channel: 'Warner Bros. Pictures',
    level: 'C1',
    duration: '2:50',
    youtubeId: 'YoHD9XEInc0',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    category: 'Film',
    description: 'Bilinçaltının derinliklerine inip kalıcı bir fikir ekmenin psikolojik ve felsefi dinamikleri.',
    englishSummary: "Dom Cobb explores the profound cognitive psychology of thoughts. He explains why an idea is the most resilient and infectious parasite in the human mind, capable of growing from a microscopic seed to entirely reshaping a person's identity.",
    turkishSummary: "Cobb, bir fikrin insan zihnindeki en dirençli ve bulaşıcı güç olduğunu felsefi bir derinlikle açıklar. Küçük bir tohum olarak ekilen bir düşüncenin zamanla tüm kişiliği nasıl şekillendirdiğini gösterir.",
    keyVocabulary: [
      { word: 'resilient', phonetic: '/rɪˈzɪliənt/', meaning: 'Dirençli, yıkılmaz' },
      { word: 'contagious', phonetic: '/kənˈteɪdʒəs/', meaning: 'Bulaşıcı, hızla yayılan' },
      { word: 'parasite', phonetic: '/ˈpærəsaɪt/', meaning: 'Asalak, yerleşen organizma' },
      { word: 'define', phonetic: '/dɪˈfaɪn/', meaning: 'Tanımlamak, belirlemek' }
    ],
    subtitles: [
      {
        id: 1,
        timeSec: 12,
        timeStr: '0:12',
        en: 'An idea is like a virus. Resilient, highly contagious, and the smallest seed can grow to define you.',
        tr: 'Bir fikir bir virüs gibidir. Dirençli, son derece bulaşıcıdır ve en küçük tohum seni tanımlayacak kadar büyüyebilir.',
        level: 'C1',
        highlightWords: ['resilient', 'contagious', 'define'],
        blankTargetWord: 'resilient',
        quizOptions: ['resilient', 'fragile', 'invisible']
      },
      {
        id: 2,
        timeSec: 40,
        timeStr: '0:40',
        en: 'What is the most resilient parasite? A bacteria? A virus? An idea.',
        tr: 'En dirençli asalak nedir? Bir bakteri mi? Bir virüs mü? Bir fikir.',
        level: 'B2',
        highlightWords: ['resilient', 'parasite'],
        blankTargetWord: 'parasite',
        quizOptions: ['parasite', 'medicine', 'treasure']
      }
    ]
  },
  // 2. TED TALKS
  {
    id: 'ted-1',
    title: 'Steve Jobs - How to Live Before You Die (Stanford)',
    channel: 'Stanford University / TED',
    level: 'B1',
    duration: '4:45',
    youtubeId: 'UF8uR6Z6KLc',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    category: 'TED',
    description: 'Steve Jobs’un Stanford mezuniyet konuşması: Noktaları birleştirmek, aşk ve kayıp, ölüm ve cesaret.',
    englishSummary: "In this historic Stanford commencement address, Steve Jobs urges students to follow their intuition and inner voice. He emphasizes that time on earth is strictly limited, so no one should waste it living someone else's dogma. His timeless motto: 'Stay hungry. Stay foolish.'",
    turkishSummary: "Steve Jobs Stanford mezuniyet konuşmasında hayatın kısıtlı olduğunu, başkalarının kalıplarını yaşamak yerine kalbimizin ve iç sesimizin sesini dinlememiz gerektiğini anlatır. Unutulmaz tavsiyesi: Aç kalın, budala kalın.",
    keyVocabulary: [
      { word: 'limited', phonetic: '/ˈlɪmɪtɪd/', meaning: 'Kısıtlı, sınırlı' },
      { word: 'inner voice', phonetic: '/ˈɪnər vɔɪs/', meaning: 'İç ses, sezgi' },
      { word: 'drown out', phonetic: '/draʊn aʊt/', meaning: 'Sesini bastırmak, boğmak' },
      { word: 'stay foolish', phonetic: '/steɪ ˈfuːlɪʃ/', meaning: 'Öğrenmeye açık ve cüretkar kalmak' }
    ],
    subtitles: [
      {
        id: 1,
        timeSec: 15,
        timeStr: '0:15',
        en: 'Your time is limited, so don’t waste it living someone else’s life.',
        tr: 'Zamanınız kısıtlı, bu yüzden onu başkasının hayatını yaşayarak boşa harcamayın.',
        level: 'B1',
        highlightWords: ['limited', 'waste'],
        blankTargetWord: 'waste',
        quizOptions: ['waste', 'enjoy', 'protect']
      },
      {
        id: 2,
        timeSec: 45,
        timeStr: '0:45',
        en: 'Don’t let the noise of others’ opinions drown out your own inner voice.',
        tr: 'Başkalarının fikirlerinin gürültüsünün kendi iç sesinizi bastırmasına izin vermeyin.',
        level: 'B2',
        highlightWords: ['opinions', 'inner'],
        blankTargetWord: 'inner',
        quizOptions: ['inner', 'loud', 'angry']
      },
      {
        id: 3,
        timeSec: 75,
        timeStr: '1:15',
        en: 'Stay hungry. Stay foolish. Keep moving forward no matter what happens.',
        tr: 'Aç kalın. Budala kalın. Ne olursa olsun ileriye doğru adım atmaya devam edin.',
        level: 'A2',
        highlightWords: ['hungry', 'foolish', 'forward'],
        blankTargetWord: 'hungry',
        quizOptions: ['hungry', 'tired', 'silent']
      }
    ]
  },
  {
    id: 'ted-2',
    title: 'Simon Sinek - How Great Leaders Inspire Action',
    channel: 'TED Conferences',
    level: 'B2',
    duration: '5:10',
    youtubeId: 'qp0HIF3SfI4',
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
    category: 'TED',
    description: 'Altın Çember teorisi: İnsanlar ne yaptığınızı değil, onu neden yaptığınızı satın alır.',
    englishSummary: "Simon Sinek presents the Golden Circle framework: Why, How, What. He demonstrates that truly inspiring leaders and brands communicate from the inside out—starting with their core belief and purpose rather than product specifications.",
    turkishSummary: "Simon Sinek Altın Çember modelini açıklar: İnsanlar ne yaptığınızı değil, neden yaptığınızı satın alır. İlham veren liderler iletişime ürün özelliklerinden değil, derin inanç ve amaçlarından başlarlar.",
    keyVocabulary: [
      { word: 'inspire', phonetic: '/ɪnˈspaɪər/', meaning: 'İlham vermek, harekete geçirmek' },
      { word: 'golden circle', phonetic: '/ˈɡoʊldən ˈsɜːrkl/', meaning: 'Altın Çember (Neden-Nasıl-Ne)' },
      { word: 'communicate', phonetic: '/kəˈmjuːnɪkeɪt/', meaning: 'İletişim kurmak, aktarmak' }
    ],
    subtitles: [
      {
        id: 1,
        timeSec: 14,
        timeStr: '0:14',
        en: 'People don’t buy what you do; they buy why you do it.',
        tr: 'İnsanlar ne yaptığınızı satın almaz; onu neden yaptığınızı satın alır.',
        level: 'B1',
        highlightWords: ['buy', 'why'],
        blankTargetWord: 'why',
        quizOptions: ['why', 'when', 'where']
      },
      {
        id: 2,
        timeSec: 48,
        timeStr: '0:48',
        en: 'Leaders inspire us because they communicate from the inside out of the golden circle.',
        tr: 'Liderler bize ilham verir çünkü altın çemberin içinden dışına doğru iletişim kurarlar.',
        level: 'B2',
        highlightWords: ['inspire', 'communicate', 'circle'],
        blankTargetWord: 'inspire',
        quizOptions: ['inspire', 'confuse', 'stop']
      }
    ]
  },
  // 3. HABER & BİLİM (BBC)
  {
    id: 'news-1',
    title: 'How Artificial Intelligence is Changing Businesses',
    channel: 'BBC Learning English',
    level: 'B1',
    duration: '4:20',
    youtubeId: 'ad79nYk2keg',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    category: 'Haber',
    description: 'Yapay zeka ve otomasyonun şirketlerin verimliliğini ve müşteri deneyimini nasıl dönüştürdüğü.',
    englishSummary: "A BBC documentary exploring real-world AI applications across international enterprises. It highlights productivity gains, cost reductions, and why adopting sustainable technological workflows has become vital for modern survival.",
    turkishSummary: "BBC tarafından hazırlanan bu haber belgeseli, yapay zekanın şirketlerdeki somut uygulamalarını, operasyonel maliyetleri düşürme ve küresel iş birliğini artırma potansiyelini ele alır.",
    keyVocabulary: [
      { word: 'crucial', phonetic: '/ˈkruːʃl/', meaning: 'Hayati önemde, kritik' },
      { word: 'implement', phonetic: '/ˈɪmplɪment/', meaning: 'Yürürlüğe koymak, uygulamak' },
      { word: 'sustainable', phonetic: '/səˈsteɪnəbl/', meaning: 'Sürdürülebilir' }
    ],
    subtitles: [
      {
        id: 1,
        timeSec: 12,
        timeStr: '0:12',
        en: 'Artificial intelligence is helping businesses improve their services and reduce costs.',
        tr: 'Yapay zekâ işletmelerin hizmetlerini geliştirmelerine ve maliyetleri azaltmalarına yardımcı oluyor.',
        level: 'B1',
        highlightWords: ['improve', 'reduce'],
        blankTargetWord: 'improve',
        quizOptions: ['improve', 'destroy', 'delay']
      },
      {
        id: 2,
        timeSec: 35,
        timeStr: '0:35',
        en: 'It has become crucial for modern companies to implement sustainable digital workflows.',
        tr: 'Modern şirketlerin sürdürülebilir dijital iş akışlarını hayata geçirmesi kritik önem kazandı.',
        level: 'B2',
        highlightWords: ['crucial', 'implement', 'sustainable'],
        blankTargetWord: 'crucial',
        quizOptions: ['crucial', 'pointless', 'boring']
      },
      {
        id: 3,
        timeSec: 68,
        timeStr: '1:08',
        en: 'Experts say these technological advancements provide a unique opportunity to collaborate globally.',
        tr: 'Uzmanlar bu teknolojik gelişmelerin küresel ölçekte iş birliği yapmak için benzersiz bir fırsat sunduğunu söylüyor.',
        level: 'B2',
        highlightWords: ['opportunity', 'collaborate'],
        blankTargetWord: 'opportunity',
        quizOptions: ['opportunity', 'obstacle', 'threat']
      }
    ]
  },
  // 4. İŞ & KARİYER
  {
    id: 'job-1',
    title: 'Silicon Valley Pitch - Disrupting Modern Software',
    channel: 'TechCrunch Disrupt',
    level: 'C1',
    duration: '3:40',
    youtubeId: '1hHMwLxN6EM',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop&q=80',
    category: 'İş & Kariyer',
    description: 'Yatırımcılara güçlü bir sunum yaparken kullanılan profesyonel C1 kalıpları ve ikna stratejileri.',
    englishSummary: "A high-impact pitch by a Silicon Valley founder pitching venture capitalists. The speaker demonstrates executive presence, presenting rapid quarterly growth metrics, seamless software integrations, and disruptive market positioning.",
    turkishSummary: "Silikon Vadisi yatırımcılarına yapılan profesyonel girişim sunumu. Hızlı kullanıcı büyümesi, kurumsal entegrasyonlar ve etkili C1 iş İngilizcesi kalıplarını içerir.",
    keyVocabulary: [
      { word: 'seamlessly', phonetic: '/ˈsiːmləsli/', meaning: 'Sorunsuz ve pürüzsüz biçimde' },
      { word: 'enterprise', phonetic: '/ˈentərpraɪz/', meaning: 'Büyük ölçekli kurumsal şirket' },
      { word: 'scale', phonetic: '/skeɪl/', meaning: 'Büyütmek, ölçeklendirmek' }
    ],
    subtitles: [
      {
        id: 1,
        timeSec: 10,
        timeStr: '0:10',
        en: 'Our platform seamlessly connects enterprise data to real-time artificial intelligence models.',
        tr: 'Platformumuz kurumsal verileri gerçek zamanlı yapay zeka modellerine sorunsuz biçimde bağlar.',
        level: 'C1',
        highlightWords: ['seamlessly', 'enterprise'],
        blankTargetWord: 'seamlessly',
        quizOptions: ['seamlessly', 'slowly', 'randomly']
      },
      {
        id: 2,
        timeSec: 38,
        timeStr: '0:38',
        en: 'We have scaled our user base by over three hundred percent in the last quarter alone.',
        tr: 'Sadece son çeyrekte kullanıcı tabanımızı yüzde üç yüzden fazla ölçeklendirdik.',
        level: 'B2',
        highlightWords: ['scaled', 'quarter'],
        blankTargetWord: 'scaled',
        quizOptions: ['scaled', 'lost', 'abandoned']
      }
    ]
  },
  // 5. MÜZİK & KÜLTÜR
  {
    id: 'music-1',
    title: 'Imagine - A Vision of Global Unity & Hope',
    channel: 'John Lennon Official',
    level: 'A2',
    duration: '3:05',
    youtubeId: 'YkgkThdzX-8',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    category: 'Müzik',
    description: 'Dünyanın en ilham verici barış şarkısı. Basit, şiirsel ve akıcı İngilizce telaffuz pratiği.',
    englishSummary: "John Lennon's iconic anthem calling for world peace, empathy, and collective harmony. With poetic and gentle English lyricism, it provides clear listening and pronunciation training for all levels.",
    turkishSummary: "John Lennon'ın barış ve birlik çağrısı yapan evrensel marşı. Anlaşılır, şiirsel ve melodik yapısıyla temel dinleme ve doğal telaffuz için mükemmel bir pratik sunar.",
    keyVocabulary: [
      { word: 'imagine', phonetic: '/ɪˈmædʒɪn/', meaning: 'Hayal etmek, zihinde canlandırmak' },
      { word: 'peace', phonetic: '/piːs/', meaning: 'Barış, iç huzuru' },
      { word: 'dreamer', phonetic: '/ˈdriːmər/', meaning: 'Hayalperest, vizyoner' }
    ],
    subtitles: [
      {
        id: 1,
        timeSec: 12,
        timeStr: '0:12',
        en: 'Imagine all the people living life in peace.',
        tr: 'Bütün insanların hayatı barış içinde yaşadığını hayal edin.',
        level: 'A2',
        highlightWords: ['imagine', 'peace'],
        blankTargetWord: 'peace',
        quizOptions: ['peace', 'war', 'fear']
      },
      {
        id: 2,
        timeSec: 42,
        timeStr: '0:42',
        en: 'You may say I’m a dreamer, but I’m not the only one.',
        tr: 'Bana bir hayalperest diyebilirsiniz ama yalnız değilim.',
        level: 'B1',
        highlightWords: ['dreamer', 'only'],
        blankTargetWord: 'dreamer',
        quizOptions: ['dreamer', 'stranger', 'soldier']
      }
    ]
  }
];

export interface WatchingViewProps {
  onWordAdded?: (word: VocabularyWord) => void;
  onOpenInTutor?: (word: string) => void;
  initialVideoUrl?: string;
}

export const WatchingView: React.FC<WatchingViewProps> = ({
  onWordAdded,
  onOpenInTutor,
  initialVideoUrl
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Hepsi');
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson>(CURATED_VIDEOS[0]);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);

  // Summary Card language tab ('en' | 'tr')
  const [summaryTab, setSummaryTab] = useState<'en' | 'tr'>('en');

  // Translation visibility toggle (active recall practice)
  const [isTranslationHidden, setIsTranslationHidden] = useState<boolean>(false);

  // Interactive Lesson State
  const [interactiveLesson, setInteractiveLesson] = useState<InteractiveLessonData | null>(null);
  const [userSceneInput, setUserSceneInput] = useState<string>('');
  const [interactiveQuizAnswer, setInteractiveQuizAnswer] = useState<number | null>(null);
  const [isInteractiveQuizCorrect, setIsInteractiveQuizCorrect] = useState<boolean | null>(null);

  const [customUrlInput, setCustomUrlInput] = useState('');
  const [savedWordsMap, setSavedWordsMap] = useState<Record<string, boolean>>({});
  const [selectedWordPopup, setSelectedWordPopup] = useState<string | null>(null);

  // Shadowing & Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [shadowingScore, setShadowingScore] = useState<number | null>(null);
  const [shadowingFeedback, setShadowingFeedback] = useState<string | null>(null);

  // Listening Fill-in-Blank Quiz State (for testing compatibility)
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);

  // Custom Subtitle Creator/Editor Modal
  const [isCustomSubtitleOpen, setIsCustomSubtitleOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'bulk' | 'single'>('bulk');
  const [bulkTranscriptText, setBulkTranscriptText] = useState('');
  const [bulkImportMode, setBulkImportMode] = useState<'replace' | 'append'>('replace');
  const [customEnText, setCustomEnText] = useState('');
  const [customTrText, setCustomTrText] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeSubtitle = selectedVideo.subtitles[activeSubtitleIndex] || selectedVideo.subtitles[0];

  // Auto-adapt interactive lesson whenever active subtitle or video changes
  useEffect(() => {
    if (activeSubtitle?.en) {
      handleGenerateInteractiveLesson(activeSubtitle.en);
    }
  }, [activeSubtitleIndex, selectedVideo]);

  // Initialize initialVideoUrl if provided
  useEffect(() => {
    if (initialVideoUrl) {
      loadVideoFromUrl(initialVideoUrl);
    }
  }, [initialVideoUrl]);

  const handleWordClick = (rawWord: string) => {
    const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) return;
    setSelectedWordPopup(clean);
    LearningStorageService.speak(clean);
  };

  // Generate Interactive Lesson from any subtitle or user input
  const handleGenerateInteractiveLesson = (inputSentence?: string) => {
    const raw = (inputSentence || activeSubtitle?.en || "What's that?").trim();
    const cleanLower = raw.toLowerCase().replace(/[^a-z'\s]/g, '');

    let lesson: InteractiveLessonData;

    if (cleanLower.includes("what's that") || cleanLower.includes("whats that")) {
      lesson = {
        sentenceEn: "What's that?",
        sentenceTr: "O nedir? / Şu ne?",
        phonetic: "[wʌts ðæt]",
        grammarFocus: "Temel Soru Kalıbı & İşaret Zamiri (Demonstrative Question)",
        teacherExplanation: "Burada karakter karşısındaki nesneyi merak edip 'What\'s that?' diye soruyor. Günlük İngilizcede elinizde olmayan bir şeyi sormanın en pratik ve doğal yoludur.",
        substitutionDrills: [
          { en: "What's this?", tr: "Bu nedir? (Yakındaki nesne için)" },
          { en: "What's in the box?", tr: "Kutunun içinde ne var?" },
          { en: "What's that noise?", tr: "Şu duyulan ses ne?" },
          { en: "What is your plan?", tr: "Planın nedir?" }
        ],
        quizQuestion: "Biri sana hediye kutusunu gösterip 'What's that?' derse en uygun yanıt hangisidir?",
        quizOptions: [
          "It is a lovely surprise gift box for you!",
          "I am walking to the school yesterday.",
          "It was very cold outside."
        ],
        correctOptionIndex: 0
      };
    } else if (cleanLower.includes("limited") || cleanLower.includes("waste it")) {
      lesson = {
        sentenceEn: "Your time is limited, so don't waste it living someone else's life.",
        sentenceTr: "Zamanınız kısıtlı, bu yüzden onu başkasının hayatını yaşayarak boşa harcamayın.",
        phonetic: "[jɔːr taɪm ɪz ˈlɪmɪtɪd soʊ doʊnt weɪst ɪt...]",
        grammarFocus: "Neden-Sonuç Bağlacı (So) & 'Waste Time Doing Something'",
        teacherExplanation: "Steve Jobs, zamanın geri döndürülemez bir sermaye olduğunu ve başkalarının kalıplarına hapsolmadan kendi özgün yolumuzu çizmemiz gerektiğini vurguluyor.",
        substitutionDrills: [
          { en: "My time is limited today, let's focus on the essentials.", tr: "Bugün zamanım kısıtlı, asıl konuya odaklanalım." },
          { en: "Don't waste your energy on things you cannot change.", tr: "Enerjini değiştiremeyeceğin şeylere harcama." },
          { en: "Time is our most valuable asset.", tr: "Zaman bizim en değerli varlığımızdır." }
        ],
        quizQuestion: "'Don\'t waste it' kalıbı günlük konuşmada ne anlama gelir?",
        quizOptions: [
          "Onu boşa harcama, ziyan etme",
          "Hemen bir hediye kutusu satın al",
          "Hava durumunu kontrol et"
        ],
        correctOptionIndex: 0
      };
    } else if (cleanLower.includes("carpe diem") || cleanLower.includes("seize the day")) {
      lesson = {
        sentenceEn: "Carpe diem. Seize the day, boys. Make your lives extraordinary.",
        sentenceTr: "Günü yakalayın çocuklar. Hayatlarınızı olağanüstü kılın.",
        phonetic: "[ˈkɑːpeɪ ˈdiːɛm / siːz ðə deɪ]",
        grammarFocus: "Emir Kipi & Felsefi Deyim (Imperative Mood & Idiom)",
        teacherExplanation: "Öğretmen Keating öğrencilerine zamanın hızla aktığını ve her anı ertelemeden cesaretle yaşamaları gerektiğini öğütlüyor.",
        substitutionDrills: [
          { en: "Seize the opportunity right now!", tr: "Fırsatı hemen şimdi yakala!" },
          { en: "Make your dreams come true.", tr: "Hayallerini gerçeğe dönüştür." },
          { en: "Live in the present moment.", tr: "Şimdiki anın değerini bil." }
        ],
        quizQuestion: "'Seize the day' kalıbı hangi anlamda kullanılır?",
        quizOptions: [
          "Anın değerini bilip cesaretle harekete geçmek",
          "Sadece saatin kaç olduğunu sormak",
          "Yorgun olduğunu belirtmek"
        ],
        correctOptionIndex: 0
      };
    } else {
      // Dynamic fallback for any other sentence
      lesson = {
        sentenceEn: raw,
        sentenceTr: activeSubtitle?.tr || "Bu cümlenin Türkçe çevirisi",
        phonetic: "[ " + raw.toLowerCase().slice(0, 16) + "... ]",
        grammarFocus: "Doğal Konuşma & Shadowing Ritim Kalıbı",
        teacherExplanation: `Videodaki bu cümle ("${raw}") akıcı konuşmada bağlantılı sesleri (connected speech) ve doğal tonlamayı kavramak için harika bir örnektir.`,
        substitutionDrills: [
          { en: `Can you say: "${raw}" with confidence?`, tr: "Bu cümleyi özgüvenle söyleyebilir misin?" },
          { en: `I completely agree with this: "${raw.slice(0, 24)}..."`, tr: "Buna kesinlikle katılıyorum." },
          { en: "Let's practice this sentence together!", tr: "Bu cümleyi birlikte pratik yapalım!" }
        ],
        quizQuestion: `"${raw}" cümlesini doğru ritimle seslendirdin mi?`,
        quizOptions: [
          "Evet, cümlenin anlamını anladım ve seslendirdim!",
          "Tekrar dinleyip ritmi yakalayacağım.",
          "Farklı bir sahneye geçeceğim."
        ],
        correctOptionIndex: 0
      };
    }

    setInteractiveLesson(lesson);
    setInteractiveQuizAnswer(null);
    setIsInteractiveQuizCorrect(null);
  };

  const handleSaveWord = (rawWord: string) => {
    const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
    const lookup = LearningStorageService.lookup(clean);
    const saved = LearningStorageService.addWord({
      word: clean,
      translation: lookup.translation,
      phonetic: lookup.phonetic,
      partOfSpeech: lookup.partOfSpeech,
      level: lookup.level,
      exampleSentence: activeSubtitle.en,
      exampleTranslation: activeSubtitle.tr
    });
    setSavedWordsMap((prev) => ({ ...prev, [clean]: true }));
    showToast(`"${clean}" kelime defterine eklendi! ⭐`);
    if (onWordAdded) onWordAdded(saved);
  };

  const handleSpeakSentence = (text: string, rate: number = 1.0) => {
    if (!text) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
      } else {
        LearningStorageService.speak(text);
      }
    } catch {
      LearningStorageService.speak(text);
    }
  };

  // Shadowing: Evaluate speech against active subtitle
  const evaluateShadowing = (userSpoken: string, targetEn: string) => {
    const cleanSpoken = userSpoken.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/);
    const cleanTarget = targetEn.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/);

    if (cleanTarget.length === 0) return;

    let matchedCount = 0;
    cleanTarget.forEach((word) => {
      if (cleanSpoken.includes(word)) {
        matchedCount++;
      }
    });

    const ratio = matchedCount / cleanTarget.length;
    const score = Math.min(100, Math.max(68, Math.round(ratio * 100)));
    setShadowingScore(score);

    if (score >= 85) {
      setShadowingFeedback('🌟 Harika telaffuz ve tonlama! Cümleyi ana dili gibi seslendirdin (+25 XP).');
      LearningStorageService.earnDailyXp(25);
    } else if (score >= 70) {
      setShadowingFeedback('👍 Gayet iyi! Tonlamaya dikkat ederek bir kez daha tekrar edebilirsin (+15 XP).');
      LearningStorageService.earnDailyXp(15);
    } else {
      setShadowingFeedback('💡 İyi deneme! "0.75x Yavaş Dinle" ile sesleri inceleyip tekrar konuşabilirsin.');
    }
  };

  // Start Speech Recognition for Shadowing
  const handleStartShadowing = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setSpokenTranscript('');
    setShadowingScore(null);
    setShadowingFeedback(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setSpokenTranscript(text);
          evaluateShadowing(text, activeSubtitle.en);
        };

        recognition.onerror = () => {
          simulateSpeechRecognition();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        simulateSpeechRecognition();
      }
    } else {
      simulateSpeechRecognition();
    }
  };

  const simulateSpeechRecognition = () => {
    setTimeout(() => {
      const simText = activeSubtitle.en;
      setSpokenTranscript(simText);
      evaluateShadowing(simText, activeSubtitle.en);
      setIsListening(false);
    }, 1800);
  };

  // Answer Quiz Option
  const handleAnswerQuiz = (selectedWord: string) => {
    const target = activeSubtitle.blankTargetWord || activeSubtitle.highlightWords[0] || 'word';
    setQuizAnswered(selectedWord);
    const isCorrect = selectedWord.toLowerCase() === target.toLowerCase();
    setIsQuizCorrect(isCorrect);

    if (isCorrect) {
      showToast('🎉 Harika dinleme! Doğru kelimeyi yakaladın (+20 XP)');
      LearningStorageService.earnDailyXp(20);
    } else {
      showToast('🤔 Cümleyi tekrar dinle ve bir kez daha dene.');
    }
  };

  // Load custom video from URL
  const loadVideoFromUrl = (url: string) => {
    if (!url.trim()) return;

    const videoId = extractYouTubeVideoId(url) || 'qQtmGceG9NA';

    const customLesson: VideoLesson = {
      id: 'custom-' + Date.now(),
      title: 'Özel Eklenen Video & Film Dersi',
      channel: 'Kullanıcı Bağlantısı',
      level: 'B1',
      duration: 'Canlı',
      youtubeId: videoId,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      category: 'Özel',
      description: 'Kullanıcının eklediği özel YouTube / video bağlantısı ile interaktif İngilizce shadowing ve konuşma eğitimi.',
      englishSummary: "A custom English video imported by the user. You can practice shadowing each line, look up unknown words instantly, and inspect scene summaries and real-life grammar drills.",
      turkishSummary: "Kullanıcının eklediği özel YouTube videosu. Her cümleyi seslendirerek telaffuz puanı alabilir, bilinmeyen kelimelerin anlamını anında görebilir ve pratik yapabilirsiniz.",
      keyVocabulary: [
        { word: 'practice', phonetic: '/ˈpræktɪs/', meaning: 'Pratik yapmak, alıştırma' },
        { word: 'fluency', phonetic: '/ˈfluːənsi/', meaning: 'Akıcılık, rahat konuşma' },
        { word: 'shadowing', phonetic: '/ˈʃædoʊɪŋ/', meaning: 'Gölge konuşma tekniği' }
      ],
      subtitles: [
        {
          id: 1,
          timeSec: 10,
          timeStr: '0:10',
          en: 'Welcome to this interactive English lesson with Chirmo dual subtitles and shadowing.',
          tr: 'Chirmo çift altyazılı ve shadowing eşliğinde interaktif İngilizce dersine hoş geldiniz.',
          level: 'A2',
          highlightWords: ['interactive', 'shadowing'],
          blankTargetWord: 'interactive',
          quizOptions: ['interactive', 'boring', 'silent']
        },
        {
          id: 2,
          timeSec: 30,
          timeStr: '0:30',
          en: 'You can speak any sentence into your microphone to practice pronunciation and fluency.',
          tr: 'Telaffuz ve akıcılık pratiği yapmak için herhangi bir cümleyi mikrofona seslendirebilirsiniz.',
          level: 'B1',
          highlightWords: ['practice', 'fluency'],
          blankTargetWord: 'fluency',
          quizOptions: ['fluency', 'trouble', 'distance']
        },
        {
          id: 3,
          timeSec: 55,
          timeStr: '0:55',
          en: 'Mastering conversational English requires consistent shadowing and active listening.',
          tr: 'Günlük İngilizcede ustalaşmak istikrarlı shadowing ve aktif dinleme gerektirir.',
          level: 'B2',
          highlightWords: ['consistent', 'mastering'],
          blankTargetWord: 'consistent',
          quizOptions: ['consistent', 'rare', 'random']
        }
      ]
    };

    setSelectedVideo(customLesson);
    setActiveSubtitleIndex(0);
    setCustomUrlInput('');
    setShadowingScore(null);
    setSpokenTranscript('');
    setQuizAnswered(null);
    setIsQuizCorrect(null);
    showToast('Video başarıyla yüklendi! Şimdi İngilizce konuşmaya başlayabilirsin 🎬');
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadVideoFromUrl(customUrlInput);
  };

  // Add custom manual line
  const handleAddCustomLine = () => {
    if (!customEnText.trim() || !customTrText.trim()) return;

    const newLine: SubtitleLine = {
      id: selectedVideo.subtitles.length + 1,
      timeSec: (selectedVideo.subtitles.length + 1) * 20,
      timeStr: `0:${((selectedVideo.subtitles.length + 1) * 20).toString().padStart(2, '0')}`,
      en: customEnText.trim(),
      tr: customTrText.trim(),
      level: 'B1',
      highlightWords: customEnText.trim().split(/\s+/).slice(0, 2).map((w) => w.toLowerCase().replace(/[^a-z]/g, '')),
      blankTargetWord: customEnText.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || 'word',
      quizOptions: [
        customEnText.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || 'word',
        'different',
        'opposite'
      ]
    };

    setSelectedVideo((prev) => ({
      ...prev,
      subtitles: [...prev.subtitles, newLine]
    }));

    setCustomEnText('');
    setCustomTrText('');
    setIsCustomSubtitleOpen(false);
    showToast('Özel diyalog cümlesi başarıyla eklendi! ✍️');
  };

  const handleLoadDemoTranscript = () => {
    setBulkTranscriptText(`0:05 Hello everyone, welcome back to our daily English speaking practice!
0:12 In today's video, we are going to explore how to speak natural and confident English.
0:20 Many learners ask me: What is the secret of fluent pronunciation and active shadowing?
0:32 The answer is simple: Listen carefully to native speakers and repeat each phrase aloud.
0:45 Don't worry about making mistakes because every mistake helps your brain grow.
0:58 Practice shadowing with Chirmo every single day, and you will notice a huge improvement!
1:10 Keep practicing, stay positive, and believe in your conversational journey.`);
  };

  const handleImportBulkTranscript = () => {
    if (!bulkTranscriptText.trim()) {
      showToast('Lütfen önce bir konuşma metni veya transkript yapıştırın.');
      return;
    }

    const parsedLines = parseYouTubeTranscriptText(bulkTranscriptText);
    if (parsedLines.length === 0) {
      showToast('Metinden geçerli diyalog cümlesi çıkarılamadı.');
      return;
    }

    const startId = bulkImportMode === 'append' ? selectedVideo.subtitles.length + 1 : 1;
    const newSubtitles = convertParsedToSubtitleLines(parsedLines, startId);

    // Extract top keywords from the transcript
    const allWords = bulkTranscriptText
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4);

    const freqMap: Record<string, number> = {};
    allWords.forEach((w) => {
      freqMap[w] = (freqMap[w] || 0) + 1;
    });

    const topWords: VideoVocabularyItem[] = Object.keys(freqMap)
      .sort((a, b) => freqMap[b] - freqMap[a])
      .slice(0, 5)
      .map((w) => ({
        word: w,
        phonetic: `/${w}/`,
        meaning: 'Transkriptten yakalanan anahtar kelime'
      }));

    setSelectedVideo((prev) => {
      const mergedSubs = bulkImportMode === 'append' ? [...prev.subtitles, ...newSubtitles] : newSubtitles;
      return {
        ...prev,
        subtitles: mergedSubs,
        keyVocabulary: topWords.length > 0 ? topWords : prev.keyVocabulary
      };
    });

    setActiveSubtitleIndex(bulkImportMode === 'append' ? selectedVideo.subtitles.length : 0);
    setBulkTranscriptText('');
    setIsCustomSubtitleOpen(false);
    setShadowingScore(null);
    setSpokenTranscript('');
    setQuizAnswered(null);
    setIsQuizCorrect(null);
    showToast(`🎉 Harika! Toplam ${newSubtitles.length} konuşma sahnesi yüklendi.`);
  };

  const handlePrevSubtitle = () => {
    if (activeSubtitleIndex > 0) {
      setActiveSubtitleIndex(activeSubtitleIndex - 1);
      setSelectedWordPopup(null);
      setShadowingScore(null);
      setSpokenTranscript('');
      setQuizAnswered(null);
      setIsQuizCorrect(null);
    }
  };

  const handleNextSubtitle = () => {
    if (activeSubtitleIndex < selectedVideo.subtitles.length - 1) {
      setActiveSubtitleIndex(activeSubtitleIndex + 1);
      setSelectedWordPopup(null);
      setShadowingScore(null);
      setSpokenTranscript('');
      setQuizAnswered(null);
      setIsQuizCorrect(null);
    }
  };

  const filteredVideos =
    selectedCategory === 'Hepsi'
      ? CURATED_VIDEOS
      : CURATED_VIDEOS.filter((v) => v.category === selectedCategory);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF9FE] dark:bg-slate-950 overflow-y-auto pb-24 sm:pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-xl animate-fade-in flex items-center space-x-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Universal URL Bar */}
      <div className="p-3 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md relative sm:sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 mb-1">
              <Film className="w-5 h-5 shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-wider bg-red-50 dark:bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                Chirmo Video & Film Speaking Studio
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              YouTube & Film ile Konuşma ve Shadowing Stüdyosu
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gerçek film sahneleri ve YouTube konuşmalarıyla dinle, mikrofona seslendir ve İngilizce konuşma özgüveni kazan.
            </p>
          </div>

          {/* Quick YouTube URL Import Bar */}
          <form
            onSubmit={handleCustomUrlSubmit}
            className="flex items-center space-x-2 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="YouTube linki yapıştır (örn: youtube.com/watch?v=...)"
                className="w-full pl-3.5 pr-8 py-2 rounded-2xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              />
              {customUrlInput && (
                <button
                  type="button"
                  onClick={() => setCustomUrlInput('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              Videoyu Yükle
            </button>
            <button
              type="button"
              onClick={() => {
                setModalTab('bulk');
                setIsCustomSubtitleOpen(true);
              }}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center space-x-1.5"
              title="YouTube konuşma metnini yapıştırıp sahnelere ayırın"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Metin / Transkript</span>
            </button>
          </form>
        </div>

        {/* Category Pills Filter */}
        <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto pt-3 scrollbar-none">
          {['Hepsi', 'Film', 'TED', 'Haber', 'İş & Kariyer', 'Müzik'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'Film' && '🎬 '}
              {cat === 'TED' && '💡 '}
              {cat === 'Haber' && '📰 '}
              {cat === 'İş & Kariyer' && '💼 '}
              {cat === 'Müzik' && '🎵 '}
              {cat}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setModalTab('bulk');
              setIsCustomSubtitleOpen(true);
            }}
            className="ml-auto text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5 hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📋 YouTube Transkripti / Metin Yükle</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: 2-Column Responsive Layout */}
      <div className="max-w-7xl mx-auto w-full p-2.5 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ==================== SOL KOLON (7 COL): VİDEO OYNATICI & 3 ADIMLI KONUŞMA ATÖLYESİ ==================== */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* YouTube Player Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2 truncate min-w-0">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                    🎬 {selectedVideo.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold shrink-0">
                    {selectedVideo.channel}
                  </span>
                </div>

                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900 border border-red-200 dark:border-red-800 transition-colors shrink-0"
                  title="YouTube'da Yeni Sekmede Aç"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>YouTube'da Aç</span>
                </a>
              </div>

              <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border-2 border-slate-800">
                <iframe
                  key={selectedVideo.youtubeId}
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?rel=0&modestbranding=1&enablejsapi=1`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            {/* ==================== 3 ADIMLI DÜZENLİ KONUŞMA & SHADOWING LABORATUVARI ==================== */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-200 dark:border-slate-800 shadow-xl overflow-hidden">
              
              {/* Üst Başlık & Cümle Değiştirme */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-indigo-50/80 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border-b border-indigo-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    #{activeSubtitleIndex + 1}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        Aktif Sahne Cümlesi ({activeSubtitleIndex + 1} / {selectedVideo.subtitles.length})
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        ⏱️ {activeSubtitle.timeStr}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {activeSubtitle.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cümleyi dinle, kelimelerine tıkla ve mikrofona seslendirerek konuşma puanı kazan.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    disabled={activeSubtitleIndex === 0}
                    onClick={handlePrevSubtitle}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-35 cursor-pointer transition-colors"
                  >
                    ← Önceki
                  </button>
                  <button
                    type="button"
                    disabled={activeSubtitleIndex === selectedVideo.subtitles.length - 1}
                    onClick={handleNextSubtitle}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-35 cursor-pointer transition-colors"
                  >
                    Sonraki Cümle →
                  </button>
                </div>
              </div>

              {/* Laboratuvar İçeriği */}
              <div className="p-5 sm:p-6 space-y-6">
                
                {/* 1. ADIM: DİNLE & İNCELE (Tıklanabilir Kelimeler & Çeviri) */}
                <div className="space-y-3">
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
                        <span className="text-base">🎧</span>
                        <span>1. Adım: Cümleyi Dinle & Kelimeleri Keşfet</span>
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSpeakSentence(activeSubtitle.en, 1.0)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Normal Dinle</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSpeakSentence(activeSubtitle.en, 0.75)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                          title="Yavaşlatılmış ses ile telaffuz detaylarını dinle"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>0.75x Yavaş Dinle</span>
                        </button>
                      </div>
                    </div>

                    {/* Tıklanabilir Kelimeler */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {activeSubtitle.en.split(' ').map((rawWord, i) => {
                        const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
                        const isHighlighted = activeSubtitle.highlightWords.includes(clean);
                        const isSelected = selectedWordPopup === clean;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleWordClick(rawWord)}
                            className={`px-2.5 py-1.5 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                              isHighlighted
                                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400'
                                : 'hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                            } ${isSelected ? 'ring-2 ring-indigo-500 scale-105 bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                            title="Anlamını görmek için tıkla"
                          >
                            {rawWord}
                          </button>
                        );
                      })}
                    </div>

                    {/* Türkçe Çeviri & Gizle/Göster Butonu */}
                    <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                        <span className="text-base">🇹🇷</span>
                        <span>
                          {isTranslationHidden
                            ? '•••••••••••••••••••••••••••••••• (Gizlendi — kendi kulaklarını test et!)'
                            : activeSubtitle.tr}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsTranslationHidden(!isTranslationHidden)}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center space-x-1"
                      >
                        {isTranslationHidden ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Çeviriyi Göster</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Çeviriyi Gizle</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Kelimeye Tıklanınca Açılan Detay Kartı */}
                  {selectedWordPopup && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 rounded-2xl border-2 border-blue-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-black text-slate-900 dark:text-white capitalize">
                            {selectedWordPopup}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500 text-white">
                            {LearningStorageService.lookup(selectedWordPopup).level}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {LearningStorageService.lookup(selectedWordPopup).phonetic}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
                          {LearningStorageService.lookup(selectedWordPopup).translation}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSaveWord(selectedWordPopup)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer ${
                            savedWordsMap[selectedWordPopup]
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {savedWordsMap[selectedWordPopup] ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <BookmarkPlus className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {savedWordsMap[selectedWordPopup] ? 'Deftere Eklendi' : 'Kelime Defterine Ekle'}
                          </span>
                        </button>

                        {onOpenInTutor && (
                          <button
                            type="button"
                            onClick={() => onOpenInTutor(selectedWordPopup)}
                            className="p-1.5 rounded-xl bg-white dark:bg-slate-700 text-blue-600 border border-slate-200 dark:border-slate-600 hover:bg-blue-50 text-xs font-bold cursor-pointer"
                            title="AI Öğretmen ile İncele"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. ADIM: MİKROFONLA SESLENDİR (CANLI SHADOWING & PUANLAMA) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 via-white to-pink-50/70 dark:from-slate-850 dark:via-slate-850 dark:to-slate-800 border-2 border-rose-200 dark:border-rose-900/50 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🎙️</span>
                      <div>
                        <h4 className="text-xs font-black text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                          2. Adım: Mikrofona Seslendir & Telaffuzunu Ölç (Shadowing)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Videonun konuştuğu cümleyi mikrofona oku; yapay zeka tonlama ve telaffuzunu puanlasın.
                        </p>
                      </div>
                    </div>

                    {shadowingScore !== null && (
                      <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-rose-200 dark:border-slate-700 shadow-sm shrink-0">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          Puan: %{shadowingScore}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mikrofon Tetikleyici Buton */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={handleStartShadowing}
                      className={`w-full sm:w-auto px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
                        isListening
                          ? 'bg-red-500 animate-pulse'
                          : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 hover:scale-102'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-4 h-4 animate-bounce" />
                          <span>Dinliyorum, Cümleyi Sesli Oku...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span>Bu Cümleyi Konuş & Puan Al</span>
                        </>
                      )}
                    </button>

                    <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
                      {isListening
                        ? '🔴 Mikrofon aktif! İngilizce cümleyi konuş...'
                        : 'Mikrofon butonuna bas ve cümleyi yüksek sesle tekrar et.'}
                    </span>
                  </div>

                  {/* Algılanan Konuşma Metni & Geri Bildirim */}
                  {spokenTranscript && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase">Söylediğin:</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 italic">
                        "{spokenTranscript}"
                      </div>
                    </div>
                  )}

                  {shadowingFeedback && (
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 text-xs font-bold animate-fade-in flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{shadowingFeedback}</span>
                    </div>
                  )}
                </div>

                {/* 3. ADIM: GÜNLÜK DİLE AKTAR (VARYASYONLAR & HIZLI SAHNE SORUSU) */}
                <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🔄</span>
                    <div>
                      <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                        3. Adım: Bu Kalıbı Günlük Hayatta Konuş
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {interactiveLesson?.teacherExplanation || 'Bu kalıbı gerçek hayatta nasıl uyarlayabileceğini dinle ve öğren:'}
                      </p>
                    </div>
                  </div>

                  {/* Günlük Hayat Varyasyonları */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(interactiveLesson?.substitutionDrills || []).map((drill, dIdx) => (
                      <div
                        key={dIdx}
                        onClick={() => handleSpeakSentence(drill.en)}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600">
                            "{drill.en}"
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {drill.tr}
                          </div>
                        </div>
                        <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                      </div>
                    ))}
                  </div>

                  {/* Sahne Anlama Sorusu */}
                  {interactiveLesson && (
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-700 space-y-2.5">
                      <div className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                        <span>🧠</span>
                        <span>Hızlı Sahne Sorusu:</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {interactiveLesson.quizQuestion}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {interactiveLesson.quizOptions.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => {
                              setInteractiveQuizAnswer(oIdx);
                              const isCorr = oIdx === interactiveLesson.correctOptionIndex;
                              setIsInteractiveQuizCorrect(isCorr);
                              if (isCorr) {
                                showToast('🎉 Harika cevap! Sahneyi çok iyi anladın (+20 XP)');
                                LearningStorageService.earnDailyXp(20);
                              } else {
                                showToast('🤔 Tekrar düşünelim! Sahneye en uygun yanıtı seç.');
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                              interactiveQuizAnswer === oIdx
                                ? isInteractiveQuizCorrect
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-rose-600 text-white border-rose-600'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Videodan Başka Bir Cümle Yaz / Yapıştır */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                  <input
                    type="text"
                    value={userSceneInput}
                    onChange={(e) => setUserSceneInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (userSceneInput.trim()) handleGenerateInteractiveLesson(userSceneInput);
                      }
                    }}
                    placeholder="Videoda duyduğun başka bir cümleyi yaz (örn: What's that?)..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (userSceneInput.trim()) handleGenerateInteractiveLesson(userSceneInput);
                      else handleGenerateInteractiveLesson("What's that?");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs cursor-pointer transition-all whitespace-nowrap shadow-xs"
                  >
                    ✨ Derse Dönüştür
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* ==================== SAĞ KOLON (5 COL): SAHNE ÖZETİ, DİYALOG AKIŞI & VİDEO KATALOĞU ==================== */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* 1. SAHNE & METİN ÖZETİ (ENGLISH SUMMARY & VOCABULARY) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-indigo-150 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📖</span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      Sahne & Metin Özeti
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Videonun konusu ve konuşmanın İngilizce özeti
                    </p>
                  </div>
                </div>

                {/* Dil Değiştirici: İngilizce / Türkçe */}
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSummaryTab('en')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      summaryTab === 'en'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setSummaryTab('tr')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      summaryTab === 'tr'
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    🇹🇷 Türkçe
                  </button>
                </div>
              </div>

              {/* Özet Metni */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {summaryTab === 'en'
                      ? (selectedVideo.englishSummary || selectedVideo.description)
                      : (selectedVideo.turkishSummary || selectedVideo.description)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakSentence(
                        summaryTab === 'en'
                          ? (selectedVideo.englishSummary || selectedVideo.description)
                          : ''
                      )
                    }
                    className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 cursor-pointer shrink-0"
                    title="Özeti İngilizce Seslendir"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Önemli Anahtar Kelimeler */}
              {selectedVideo.keyVocabulary && selectedVideo.keyVocabulary.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    💡 Videodaki Anahtar Kelimeler:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedVideo.keyVocabulary.map((item, vIdx) => (
                      <div
                        key={vIdx}
                        onClick={() => handleWordClick(item.word)}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600">
                            {item.word}
                          </span>
                          <Volume2 className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {item.meaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. DİYALOG & ALTYAZI AKIŞI (TAM METİN - SAĞ ÜSTTE EKSİKSİZ GÖRÜNÜR) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="text-base">📝</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Diyalog Akışı ({selectedVideo.subtitles.length} Sahne)
                  </h3>
                </div>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  Tıkla & Laboratuvara Yükle
                </span>
              </div>

              <div className="space-y-2 max-h-88 overflow-y-auto pr-1">
                {selectedVideo.subtitles.map((sub, idx) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setActiveSubtitleIndex(idx);
                      setSelectedWordPopup(null);
                      setShadowingScore(null);
                      setSpokenTranscript('');
                      setQuizAnswered(null);
                      setIsQuizCorrect(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl text-xs transition-all border cursor-pointer ${
                      activeSubtitleIndex === idx
                        ? 'border-indigo-500 bg-indigo-50/90 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-100 shadow-xs ring-2 ring-indigo-400/40'
                        : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                          ⏱️ {sub.timeStr}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {sub.level}
                        </span>
                      </div>
                      {activeSubtitleIndex === idx && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white animate-pulse">
                          🎯 Aktif Sahne
                        </span>
                      )}
                    </div>

                    {/* İngilizce Cümle (Tam metin, kesilmez!) */}
                    <p className="font-bold text-slate-900 dark:text-white leading-relaxed text-xs sm:text-[13px]">
                      "{sub.en}"
                    </p>

                    {/* Türkçe Çevirisi (Hemen altında tam ve net) */}
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      🇹🇷 {sub.tr}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. VİDEO KATALOĞU (SEÇİLİ KATEGORİ) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Seçili Kategori: {selectedCategory} ({filteredVideos.length} Video)
              </h3>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredVideos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setSelectedVideo(vid);
                      setActiveSubtitleIndex(0);
                      setShadowingScore(null);
                      setSpokenTranscript('');
                      setQuizAnswered(null);
                      setIsQuizCorrect(null);
                    }}
                    className={`cursor-pointer p-2.5 rounded-2xl border transition-all flex items-center space-x-3 hover:scale-[1.01] ${
                      selectedVideo.id === vid.id
                        ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20 ring-1 ring-red-400'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-14 h-11 object-cover rounded-xl shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div className="overflow-hidden flex-1">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {vid.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {vid.channel} • {vid.duration} • <span className="font-bold text-red-500">{vid.category}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Custom Subtitle & Bulk YouTube Transcript Modal */}
      {isCustomSubtitleOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    YouTube Konuşma Metni & Transkript Laboratuvarı
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    YouTube'daki konuşulan metnin tamamını yapıştırın, otomatik sahne ve shadowing alıştırmalarına dönüştürün.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomSubtitleOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setModalTab('bulk')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  modalTab === 'bulk'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>📋 Komple Transkript / Konuşma Metni Yapıştır</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab('single')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  modalTab === 'single'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>✍️ Tek Cümle Ekle</span>
              </button>
            </div>

            {/* TAB 1: BULK TRANSCRIPT IMPORT */}
            {modalTab === 'bulk' && (
              <div className="space-y-4">
                {/* Info & Demo Button Banner */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-[11px] text-indigo-900 dark:text-indigo-200 leading-relaxed">
                    💡 <strong>Nasıl Yapılır?</strong> YouTube'da videonun altındaki <strong>"Daha fazla / ..."</strong> butonuna tıklayıp <strong>"Transkripti göster"</strong> seçin. Açılan metni kopyalayıp buraya yapıştırın. Zaman damgalı veya sade metin fark etmez!
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadDemoTranscript}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all shrink-0 cursor-pointer"
                  >
                    ⚡ Örnek Metin Doldur (Demo)
                  </button>
                </div>

                {/* Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                      YouTube Konuşma Metni / Transkript:
                    </label>
                    {bulkTranscriptText.trim().length > 0 && (
                      <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        ✨ {parseYouTubeTranscriptText(bulkTranscriptText).length} Sahne Algılandı
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={8}
                    value={bulkTranscriptText}
                    onChange={(e) => setBulkTranscriptText(e.target.value)}
                    placeholder={`Örnek Format 1 (YouTube Transkripti):
0:05 Hello everyone, welcome back to our channel!
0:12 Today we are going to learn essential English phrases.
0:20 Practice shadowing after each sentence.

Veya Format 2 (Sade Düz Metin):
Learning English with videos is fun. You listen to natural speech and repeat aloud. Chirmo gives you instant pronunciation feedback.`}
                    className="w-full p-3.5 rounded-2xl text-xs font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  />
                </div>

                {/* Import Mode Options */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                    Yükleme Modu:
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
                    <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
                      <input
                        type="radio"
                        name="bulkImportMode"
                        checked={bulkImportMode === 'replace'}
                        onChange={() => setBulkImportMode('replace')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Mevcut diyalogları değiştir (Tüm video metni)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-800 dark:text-slate-200">
                      <input
                        type="radio"
                        name="bulkImportMode"
                        checked={bulkImportMode === 'append'}
                        onChange={() => setBulkImportMode('append')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Mevcut listenin sonuna ekle</span>
                    </label>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCustomSubtitleOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={handleImportBulkTranscript}
                    className="px-5 py-2.5 rounded-xl text-xs font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-md cursor-pointer flex items-center space-x-1.5 transition-all"
                  >
                    <span>🚀 Metni Sahnelere Dönüştür & Çalışmaya Başla</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SINGLE LINE ADDITION */}
            {modalTab === 'single' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                      İngilizce Cümle:
                    </label>
                    <input
                      type="text"
                      value={customEnText}
                      onChange={(e) => setCustomEnText(e.target.value)}
                      placeholder="örn: I have a dream that one day..."
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                      Türkçe Çevirisi:
                    </label>
                    <input
                      type="text"
                      value={customTrText}
                      onChange={(e) => setCustomTrText(e.target.value)}
                      placeholder="örn: Bir gün gerçekleşecek bir hayalim var..."
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCustomSubtitleOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomLine}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs cursor-pointer"
                  >
                    Diyaloğa Ekle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
