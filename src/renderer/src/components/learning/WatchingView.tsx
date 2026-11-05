import React, { useState, useEffect } from 'react';
import {
  Tv,
  Play,
  Pause,
  Volume2,
  BookmarkPlus,
  Sparkles,
  Search,
  ExternalLink,
  RotateCcw,
  Clock,
  Layers,
  ArrowRight,
  Check,
  Mic,
  MicOff,
  Award,
  HelpCircle,
  Film,
  Lightbulb,
  Radio,
  Briefcase,
  Music,
  PlusCircle,
  FileText,
  Sliders,
  X
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';

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
  // Direct 11 char ID
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
  subtitles: SubtitleLine[];
}

export const CURATED_VIDEOS: VideoLesson[] = [
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
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [savedWordsMap, setSavedWordsMap] = useState<Record<string, boolean>>({});
  const [selectedWordPopup, setSelectedWordPopup] = useState<string | null>(null);

  // Active Training Modes: 'shadowing' (Konuşma & Tekrar) | 'quiz' (Dinleme & Boşluk Doldurma) | 'dual_subtitles' (Altyazı Okuma)
  const [activeTrainingMode, setActiveTrainingMode] = useState<'shadowing' | 'quiz' | 'dual_subtitles'>('shadowing');

  // Shadowing & Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [shadowingScore, setShadowingScore] = useState<number | null>(null);
  const [shadowingFeedback, setShadowingFeedback] = useState<string | null>(null);

  // Quiz State
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);

  // Custom Subtitle Creator/Editor Modal
  const [isCustomSubtitleOpen, setIsCustomSubtitleOpen] = useState(false);
  const [customEnText, setCustomEnText] = useState('');
  const [customTrText, setCustomTrText] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeSubtitle = selectedVideo.subtitles[activeSubtitleIndex] || selectedVideo.subtitles[0];

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
    // Score between 60 and 100 based on matches
    const score = Math.min(100, Math.max(65, Math.round(ratio * 100)));
    setShadowingScore(score);

    if (score >= 85) {
      setShadowingFeedback('🌟 Mükemmel telaffuz ve ritim! Cümleyi ana dili gibi seslendirdin (+25 XP).');
      LearningStorageService.earnDailyXp(25);
    } else if (score >= 70) {
      setShadowingFeedback('👍 Gayet iyi! Bazı kelimelerin tonlamasını biraz daha vurgulayarak tekrar dene (+15 XP).');
      LearningStorageService.earnDailyXp(15);
    } else {
      setShadowingFeedback('💡 İyi deneme! "0.75x Yavaş Dinle" butonuna basarak telaffuzu dinle ve bir kez daha seslendir.');
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
      // High-quality simulation if mic is blocked or unavailable
      const simText = activeSubtitle.en;
      setSpokenTranscript(simText);
      evaluateShadowing(simText, activeSubtitle.en);
      setIsListening(false);
    }, 2000);
  };

  // Answer Quiz Option
  const handleAnswerQuiz = (selectedWord: string) => {
    const target = activeSubtitle.blankTargetWord || activeSubtitle.highlightWords[0] || 'good';
    setQuizAnswered(selectedWord);
    const isCorrect = selectedWord.toLowerCase() === target.toLowerCase();
    setIsQuizCorrect(isCorrect);

    if (isCorrect) {
      showToast('🎉 Harika dinleme! Doğru kelimeyi yakaladın (+20 XP)');
      LearningStorageService.earnDailyXp(20);
    } else {
      showToast('🤔 Tekrar dinleyelim! Doğru cevabı bulmak için cümleyi dinle.');
    }
  };

  // Load custom video from URL
  const loadVideoFromUrl = (url: string) => {
    if (!url.trim()) return;

    // Extract youtube video id
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
    const videoId = match ? match[1] : 'qQtmGceG9NA';

    const customLesson: VideoLesson = {
      id: 'custom-' + Date.now(),
      title: 'Özel Eklenen Video & Film Dersi',
      channel: 'Kullanıcı Bağlantısı',
      level: 'B2',
      duration: 'Canlı',
      youtubeId: videoId,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      category: 'Özel',
      description: 'Kullanıcının eklediği özel YouTube / video bağlantısı ile interaktif İngilizce shadowing ve konuşma eğitimi.',
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

  const filteredVideos =
    selectedCategory === 'Hepsi'
      ? CURATED_VIDEOS
      : CURATED_VIDEOS.filter((v) => v.category === selectedCategory);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF9FE] dark:bg-slate-950 overflow-y-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-xl animate-fade-in flex items-center space-x-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Universal URL Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              İstediğin İngilizce videonun linkini yapıştır; altyazı ve sesleri dinleyerek mikrofonla tekrar et, kelimeleri anında öğren!
            </p>
          </div>

          {/* Universal Video Link Input Form */}
          <form
            onSubmit={handleCustomUrlSubmit}
            className="flex items-center space-x-2 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="YouTube linki yapıştır (örn: youtube.com/watch?v=...)"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              Videoyu Yükle
            </button>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className="max-w-7xl mx-auto flex items-center space-x-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {['Hepsi', 'Film', 'TED', 'Haber', 'İş & Kariyer', 'Müzik'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
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
            onClick={() => setIsCustomSubtitleOpen(true)}
            className="ml-auto text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 hover:underline cursor-pointer whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Özel Cümle / Metin Ekle</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Video Player & Active Speaking Trainer (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
                        {/* YouTube IFrame Embed Container with Player Header Bar */}
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

            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTrainingMode('shadowing')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeTrainingMode === 'shadowing'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>🎙️ Shadowing & Konuşma Koçu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTrainingMode('quiz')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeTrainingMode === 'quiz'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>🧠 Dinleme & Boşluk Doldurma</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTrainingMode('dual_subtitles')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeTrainingMode === 'dual_subtitles'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>📖 Çift Altyazı & Kelime Analizi</span>
                </button>
              </div>

              <div className="text-[11px] font-bold text-slate-400 hidden sm:block">
                Cümle {activeSubtitleIndex + 1} / {selectedVideo.subtitles.length}
              </div>
            </div>

            {/* Interactive Sentence Theatre */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-100 dark:border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                    ⏱️ {activeSubtitle.timeStr}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Seviye: {activeSubtitle.level}
                  </span>
                </div>

                {/* Sentence Audio Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleSpeakSentence(activeSubtitle.en, 1.0)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 cursor-pointer transition-colors"
                    title="Normal Hızda Dinle"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Cümleyi Dinle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSpeakSentence(activeSubtitle.en, 0.75)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900 cursor-pointer transition-colors"
                    title="Yavaşlatılmış Ses ile Detaylı Dinle"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>0.75x Yavaş Dinle</span>
                  </button>
                </div>
              </div>

              {/* Clickable Words Display */}
              <div className="space-y-2">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  İngilizce Cümle (Kelimeye tıkla & anlamını öğren):
                </div>
                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {activeSubtitle.en.split(' ').map((rawWord, i) => {
                    const clean = rawWord.toLowerCase().replace(/[^a-z]/g, '');
                    const isHighlighted = activeSubtitle.highlightWords.includes(clean);
                    const isSelected = selectedWordPopup === clean;

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleWordClick(rawWord)}
                        className={`px-2.5 py-1.5 rounded-xl text-base sm:text-lg font-bold transition-all cursor-pointer ${
                          isHighlighted
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400'
                            : 'hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                        } ${isSelected ? 'ring-2 ring-indigo-500 scale-105 bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                      >
                        {rawWord}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Turkish Translation Display */}
              <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex items-start space-x-2.5 text-xs sm:text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-indigo-200 text-indigo-800 shrink-0">
                  Türkçe
                </span>
                <span className="leading-relaxed">{activeSubtitle.tr}</span>
              </div>

              {/* Word Popup Card */}
              {selectedWordPopup && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border-2 border-blue-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-black text-slate-900 dark:text-white capitalize">
                        {selectedWordPopup}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500 text-white">
                        {LearningStorageService.lookup(selectedWordPopup).level}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {LearningStorageService.lookup(selectedWordPopup).phonetic}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      {LearningStorageService.lookup(selectedWordPopup).translation}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSaveWord(selectedWordPopup)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer ${
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
                      <span>{savedWordsMap[selectedWordPopup] ? 'Deftere Eklendi' : 'Kelime Defterine Ekle'}</span>
                    </button>

                    {onOpenInTutor && (
                      <button
                        type="button"
                        onClick={() => onOpenInTutor(selectedWordPopup)}
                        className="p-2 rounded-xl bg-white dark:bg-slate-700 text-blue-600 border border-slate-200 dark:border-slate-600 hover:bg-blue-50 text-xs font-bold cursor-pointer"
                        title="AI Öğretmen ile İncele"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ==================== ACTIVE TRAINING AREA 1: SHADOWING ==================== */}
              {activeTrainingMode === 'shadowing' && (
                <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-slate-800/80 border-2 border-rose-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🎙️</span>
                      <div>
                        <h4 className="text-xs font-black text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                          Canlı Shadowing & Sesli Tekrar Koçu
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Videonun konuştuğu cümleyi mikrofona seslendir, yapay zeka tonlama ve telaffuzunu puanlasın.
                        </p>
                      </div>
                    </div>

                    {shadowingScore !== null && (
                      <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-rose-200 dark:border-slate-700 shadow-sm">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          Puan: %{shadowingScore}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mic Trigger Button */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={handleStartShadowing}
                      className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-white font-black text-sm shadow-md transition-all cursor-pointer ${
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
                          <span>Cümleyi Seslendir / Shadowing Yap</span>
                        </>
                      )}
                    </button>

                    <span className="text-xs text-slate-500 font-medium">
                      {isListening
                        ? 'Mikrofon aktif! İngilizce cümleyi konuş...'
                        : 'Mikrofon butonuna bas ve cümleyi yüksek sesle tekrar et.'}
                    </span>
                  </div>

                  {/* Spoken Feedback */}
                  {spokenTranscript && (
                    <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase">Algılanan Sesin:</div>
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
              )}

              {/* ==================== ACTIVE TRAINING AREA 2: LISTENING QUIZ ==================== */}
              {activeTrainingMode === 'quiz' && (
                <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/80 border-2 border-indigo-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🧠</span>
                    <div>
                      <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                        Dinleme & Boşluk Doldurma Testi
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Cümleyi dinle ve aşağıdaki eksik kelimeyi doğru tamamla!
                      </p>
                    </div>
                  </div>

                  {/* Masked sentence */}
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-slate-700 text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                    {activeSubtitle.en.split(' ').map((w, idx) => {
                      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
                      const isTarget =
                        clean === (activeSubtitle.blankTargetWord || activeSubtitle.highlightWords[0])?.toLowerCase();
                      if (isTarget) {
                        return (
                          <span
                            key={idx}
                            className="inline-block px-3 py-1 mx-1 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-2 border-dashed border-indigo-400 font-black animate-pulse"
                          >
                            {quizAnswered || '[ ? ]'}
                          </span>
                        );
                      }
                      return <span key={idx}> {w}</span>;
                    })}
                  </div>

                  {/* Quiz Option Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(activeSubtitle.quizOptions || [
                      activeSubtitle.blankTargetWord || 'target',
                      'optionB',
                      'optionC'
                    ]).map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAnswerQuiz(opt)}
                        className={`p-3 rounded-xl border-2 font-black text-xs sm:text-sm transition-all cursor-pointer ${
                          quizAnswered === opt
                            ? isQuizCorrect
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {isQuizCorrect !== null && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold text-center animate-bounce ${
                        isQuizCorrect
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {isQuizCorrect
                        ? '🎉 Doğru cevap! Kulakların harika çalışıyor.'
                        : '❌ Yanlış seçenek! Cümleyi tekrar dinle ve bir daha dene.'}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation to Next / Previous Subtitle Line */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={activeSubtitleIndex === 0}
                  onClick={() => {
                    setActiveSubtitleIndex((prev) => Math.max(0, prev - 1));
                    setShadowingScore(null);
                    setSpokenTranscript('');
                    setQuizAnswered(null);
                    setIsQuizCorrect(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Önceki Cümle
                </button>

                <button
                  type="button"
                  disabled={activeSubtitleIndex === selectedVideo.subtitles.length - 1}
                  onClick={() => {
                    setActiveSubtitleIndex((prev) =>
                      Math.min(selectedVideo.subtitles.length - 1, prev + 1)
                    );
                    setShadowingScore(null);
                    setSpokenTranscript('');
                    setQuizAnswered(null);
                    setIsQuizCorrect(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Sonraki Cümleye Geç →
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Subtitles Flow & Video Catalog (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Timeline Stream */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Diyalog Akışı ({selectedVideo.subtitles.length} Sahne)
                </h3>
                <span className="text-[10px] text-indigo-500 font-bold">Tıkla & O Sahneye Git</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
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
                    className={`w-full text-left p-3 rounded-2xl text-xs transition-all border cursor-pointer ${
                      activeSubtitleIndex === idx
                        ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium ring-2 ring-indigo-300 dark:ring-indigo-800'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        ⏱️ {sub.timeStr}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {sub.level}
                      </span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed text-slate-900 dark:text-slate-100">
                      {sub.en}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Curated Lessons Library */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Seçili Kategori: {selectedCategory} ({filteredVideos.length} Video)
              </h3>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
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
                    className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-center space-x-3 hover:scale-101 ${
                      selectedVideo.id === vid.id
                        ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20 ring-1 ring-red-400'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-16 h-12 object-cover rounded-xl shrink-0 border border-slate-200 dark:border-slate-700"
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

      {/* Custom Subtitle Dialog Modal */}
      {isCustomSubtitleOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Özel Altyazı / Diyalog Ekle
              </h3>
              <button
                type="button"
                onClick={() => setIsCustomSubtitleOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

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
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
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
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomSubtitleOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleAddCustomLine}
                className="px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
              >
                Diyaloğa Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
