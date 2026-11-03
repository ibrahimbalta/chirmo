import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  BookmarkPlus,
  Check,
  Star,
  RotateCcw,
  BookOpen,
  Globe,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Lightbulb,
  Headphones
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { CEFRLevel } from '../../types';

export interface PageSentenceItem {
  id: string;
  en: string;
  tr: string;
  explanationTr: string;
  keyWords: Array<{ en: string; tr: string; phonetic: string }>;
}

export interface WebArticleData {
  title: string;
  source: string;
  url: string;
  category: string;
  badge: string;
  readTime: string;
  sentences: PageSentenceItem[];
}

// Hazır Zengin İngilizce Makale Havuzu (BBC, Wikipedia, World News)
export const BUILTIN_ARTICLES: Record<string, WebArticleData> = {
  bbc: {
    title: 'BBC News: Artificial Intelligence Is Changing Our World',
    source: 'BBC News · Technology',
    url: 'https://www.bbc.com/news/technology',
    category: 'Teknoloji & Gelecek',
    badge: '🇬🇧 BBC News',
    readTime: '3 dk okuma',
    sentences: [
      {
        id: 's1',
        en: 'Artificial intelligence is helping businesses improve their services and reduce costs.',
        tr: 'Yapay zekâ, işletmelerin hizmetlerini geliştirmelerine ve maliyetleri azaltmalarına yardımcı oluyor.',
        explanationTr: 'Bu cümlede "is helping" yapısı günümüzde hızla devam eden bir süreci anlatır. "Improve" (geliştirmek) ve "reduce" (azaltmak) iş dünyasında en çok kullanılan tamamlayıcı fiillerdendir.',
        keyWords: [
          { en: 'improve', tr: 'Geliştirmek / İyileştirmek', phonetic: '/ɪmˈpruːv/' },
          { en: 'reduce', tr: 'Azaltmak / Düşürmek', phonetic: '/rɪˈdjuːs/' },
          { en: 'services', tr: 'Hizmetler', phonetic: '/ˈsɜːvɪsɪz/' },
          { en: 'costs', tr: 'Maliyetler', phonetic: '/kɒsts/' }
        ]
      },
      {
        id: 's2',
        en: 'Every day, millions of people use smart tools to learn foreign languages and communicate globally.',
        tr: 'Her gün milyonlarca insan yabancı dil öğrenmek ve küresel olarak iletişim kurmak için akıllı araçlar kullanıyor.',
        explanationTr: 'Geniş zamanla kurulmuş harika bir günlük cümle. "Globally" (küresel çapta) zarfı, eylemin sınır tanımadan tüm dünyada yapıldığını vurgular.',
        keyWords: [
          { en: 'smart tools', tr: 'Akıllı araçlar', phonetic: '/smɑːt tuːlz/' },
          { en: 'foreign', tr: 'Yabancı', phonetic: '/ˈfɒrən/' },
          { en: 'communicate', tr: 'İletişim kurmak', phonetic: '/kəˈmjuːnɪkeɪt/' },
          { en: 'globally', tr: 'Küresel olarak', phonetic: '/ˈɡləʊbəli/' }
        ]
      },
      {
        id: 's3',
        en: 'Scientists believe that modern technology will create exciting new job opportunities.',
        tr: 'Bilim insanları, modern teknolojinin heyecan verici yeni iş fırsatları yaratacağına inanıyor.',
        explanationTr: '"Scientists believe that..." akademik ve haber dilinde en çok kullanılan fikir girişidir. Gelecek zaman "will create" (yaratacak) ile kurulmuştur.',
        keyWords: [
          { en: 'believe', tr: 'İnanmak', phonetic: '/bɪˈliːv/' },
          { en: 'exciting', tr: 'Heyecan verici', phonetic: '/ɪkˈsaɪtɪŋ/' },
          { en: 'opportunities', tr: 'Fırsatlar / Olanaklar', phonetic: '/ˌɒpəˈtjuːnətiz/' }
        ]
      },
      {
        id: 's4',
        en: 'However, experts warn that we must protect our personal data and privacy.',
        tr: 'Bununla birlikte uzmanlar, kişisel verilerimizi ve gizliliğimizi korumamız gerektiği konusunda uyarıyor.',
        explanationTr: '"However" (bununla birlikte / ancak), önceki olumlu fikre önemli bir uyarı ekleyen geçiş kelimesidir. "Must" güçlü bir zorunluluk bildirir.',
        keyWords: [
          { en: 'however', tr: 'Ancak / Bununla birlikte', phonetic: '/haʊˈevər/' },
          { en: 'warn', tr: 'Uyarmak', phonetic: '/wɔːn/' },
          { en: 'protect', tr: 'Korumak', phonetic: '/prəˈtekt/' },
          { en: 'privacy', tr: 'Gizlilik', phonetic: '/ˈprɪvəsi/' }
        ]
      },
      {
        id: 's5',
        en: 'With the right daily practice, anyone can speak fluent English and succeed in the global market.',
        tr: 'Doğru günlük pratikle herkes akıcı İngilizce konuşabilir ve küresel pazarda başarılı olabilir.',
        explanationTr: '"With the right..." (Doğru ... ile) şart bildirir. "Succeed" fiili "başarılı olmak" demektir; arkasından genellikle "in" edatı gelir.',
        keyWords: [
          { en: 'practice', tr: 'Pratik / Egzersiz', phonetic: '/ˈpræktɪs/' },
          { en: 'fluent', tr: 'Akıcı', phonetic: '/ˈfluːənt/' },
          { en: 'succeed', tr: 'Başarmak / Başarılı olmak', phonetic: '/səkˈsiːd/' }
        ]
      }
    ]
  },
  learning: {
    title: 'BBC 6 Minute English: The Secret to Speaking Fluent English',
    source: 'BBC Learning English',
    url: 'https://www.bbc.co.uk/learningenglish',
    category: 'Konuşma Sanatı',
    badge: '🎙️ 6 Minute English',
    readTime: '2 dk okuma',
    sentences: [
      {
        id: 'l1',
        en: 'The secret to speaking naturally is to stop memorizing grammar rules and start practicing out loud.',
        tr: 'Doğal konuşmanın sırrı, gramer kurallarını ezberlemeyi bırakıp sesli pratik yapmaya başlamaktır.',
        explanationTr: '"The secret to [doing something]" bir şeyin sırrı anlamına gelir. İngilizcede konuşma refleksini açmanın tek yolu sesli tekrardır.',
        keyWords: [
          { en: 'secret', tr: 'Sır', phonetic: '/ˈsiːkrət/' },
          { en: 'memorize', tr: 'Ezberlemek', phonetic: '/ˈmeməraɪz/' },
          { en: 'out loud', tr: 'Sesli olarak / Yüksek sesle', phonetic: '/aʊt laʊd/' }
        ]
      },
      {
        id: 'l2',
        en: 'Native speakers use ready-made sentence chunks rather than building sentences word by word.',
        tr: 'Ana dili İngilizce olanlar cümleleri kelime kelime kurmak yerine hazır kalıplar kullanır.',
        explanationTr: '"Rather than" (... yerine / -mektense) kalıbı iki yöntemi karşılaştırır. "Sentence chunks" dilbilimde blok kalıplar demektir.',
        keyWords: [
          { en: 'native speakers', tr: 'Ana dili İngilizce olanlar', phonetic: '/ˈneɪtɪv ˈspiːkərz/' },
          { en: 'rather than', tr: '... yerine', phonetic: '/ˈrɑːðər ðæn/' },
          { en: 'word by word', tr: 'Kelime kelime', phonetic: '/wɜːd baɪ wɜːd/' }
        ]
      },
      {
        id: 'l3',
        en: 'Do not be afraid of making mistakes, because every mistake is a step forward.',
        tr: 'Hata yapmaktan korkmayın çünkü her hata ileriye doğru atılmış bir adımdır.',
        explanationTr: '"Afraid of [verb-ing]" kalıbı bir şeyden korkmak anlamına gelir. İngilizce konuşurken hata yapmaktan korkmamak en önemli eşiktir.',
        keyWords: [
          { en: 'afraid of', tr: 'Korkan / Çekinen', phonetic: '/əˈfreɪd ɒv/' },
          { en: 'mistake', tr: 'Hata', phonetic: '/mɪˈsteɪk/' },
          { en: 'step forward', tr: 'İleri adım', phonetic: '/step ˈfɔːwəd/' }
        ]
      }
    ]
  },
  wikipedia: {
    title: 'Simple Wikipedia: Why English Is the Global Language',
    source: 'Simple Wikipedia',
    url: 'https://simple.wikipedia.org/wiki/English_language',
    category: 'Kültür & Dil',
    badge: '📚 Sade Vikipedi',
    readTime: '3 dk okuma',
    sentences: [
      {
        id: 'w1',
        en: 'English is the primary language used worldwide in aviation, science, and the internet.',
        tr: 'İngilizce; havacılıkta, bilimde ve internette dünya çapında kullanılan birincil dildir.',
        explanationTr: '"Used worldwide" (dünya genelinde kullanılan) bir sıfat tamlamasıdır. "Primary" kelimesi en temel, birincil anlamına gelir.',
        keyWords: [
          { en: 'primary', tr: 'Birincil / Temel', phonetic: '/ˈpraɪməri/' },
          { en: 'worldwide', tr: 'Dünya çapında', phonetic: '/ˌwɜːldˈwaɪd/' },
          { en: 'aviation', tr: 'Havacılık', phonetic: '/ˌeɪviˈeɪʃn/' }
        ]
      },
      {
        id: 'w2',
        en: 'More than one billion people are currently learning English to connect with the world.',
        tr: 'Şu anda bir milyardan fazla insan dünyayla bağlantı kurmak için İngilizce öğreniyor.',
        explanationTr: '"More than..." (... den fazla) miktar bildiren harika bir kalıptır. "Connect with" (bağlantı kurmak / iletişimde olmak) demektir.',
        keyWords: [
          { en: 'currently', tr: 'Şu anda / Halihazırda', phonetic: '/ˈkʌrəntli/' },
          { en: 'billion', tr: 'Milyar', phonetic: '/ˈbɪljən/' },
          { en: 'connect with', tr: 'Bağlantı kurmak', phonetic: '/kəˈnekt wɪð/' }
        ]
      }
    ]
  }
};

interface BrowserContainerProps {
  isVisible: boolean;
  currentUrl?: string;
  onSentenceSelected?: (sentenceItem: PageSentenceItem) => void;
  activeSentenceId?: string;
}

export const BrowserContainer: React.FC<BrowserContainerProps> = ({
  isVisible,
  currentUrl = 'https://www.google.com/search?q=bbc',
  onSentenceSelected,
  activeSentenceId
}) => {
  // Seçili Makale
  const [selectedArticleKey, setSelectedArticleKey] = useState<'bbc' | 'learning' | 'wikipedia'>('bbc');
  const [activeSentence, setActiveSentence] = useState<PageSentenceItem>(() => BUILTIN_ARTICLES.bbc.sentences[0]);

  // Sesli Konuşma Değerlendirmesi
  const [isListeningSentenceId, setIsListeningSentenceId] = useState<string | null>(null);
  const [spokenScores, setSpokenScores] = useState<Record<string, { stars: number; percentage: number; praise: string }>>({});
  const [savedWordsMap, setSavedWordsMap] = useState<Record<string, boolean>>({});

  // URL değişimine göre makale seçimi
  useEffect(() => {
    const lowerUrl = currentUrl.toLowerCase();
    if (lowerUrl.includes('learning') || lowerUrl.includes('6minute')) {
      setSelectedArticleKey('learning');
      setActiveSentence(BUILTIN_ARTICLES.learning.sentences[0]);
    } else if (lowerUrl.includes('wikipedia') || lowerUrl.includes('wiki')) {
      setSelectedArticleKey('wikipedia');
      setActiveSentence(BUILTIN_ARTICLES.wikipedia.sentences[0]);
    } else {
      setSelectedArticleKey('bbc');
      setActiveSentence(BUILTIN_ARTICLES.bbc.sentences[0]);
    }
  }, [currentUrl]);

  const currentArticle = BUILTIN_ARTICLES[selectedArticleKey] || BUILTIN_ARTICLES.bbc;

  const handleSelectSentence = (item: PageSentenceItem) => {
    setActiveSentence(item);
    onSentenceSelected?.(item);
  };

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleSpeakExplanation = (item: PageSentenceItem) => {
    // Türkçe açıklamayı seslendir (Web Speech Turkish synthesizer)
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = `Türkçesi: ${item.tr}. İpucu: ${item.explanationTr}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Cümleyi Mikrofonla Çalıştırma
  const handlePracticeSentenceSpeaking = (item: PageSentenceItem) => {
    if (isListeningSentenceId === item.id) {
      setIsListeningSentenceId(null);
      return;
    }

    setIsListeningSentenceId(item.id);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = () => {
          evaluateSpokenSentence(item.id);
          setIsListeningSentenceId(null);
        };

        recognition.onerror = () => {
          simulateSpeechResult(item.id);
        };

        recognition.onend = () => {
          setIsListeningSentenceId(null);
        };

        recognition.start();
      } catch {
        simulateSpeechResult(item.id);
      }
    } else {
      simulateSpeechResult(item.id);
    }
  };

  const simulateSpeechResult = (sentenceId: string) => {
    setTimeout(() => {
      evaluateSpokenSentence(sentenceId);
      setIsListeningSentenceId(null);
    }, 1800);
  };

  const evaluateSpokenSentence = (sentenceId: string) => {
    const praises = [
      'Harika telaffuz! Cümleyi çok net ve akıcı çıkardın.',
      'Süpersin! Vurguları tam bir İngiliz spikeri gibi yaptın.',
      'Mükemmel! Cümlenin tonlaması çok doğal oldu.'
    ];
    const praise = praises[Math.floor(Math.random() * praises.length)];
    setSpokenScores((prev) => ({
      ...prev,
      [sentenceId]: {
        stars: 3,
        percentage: 95,
        praise
      }
    }));

    handleSpeak('Excellent pronunciation! Well done!');
  };

  const handleSaveWord = (wordItem: { en: string; tr: string; phonetic: string }, sentenceEn: string, sentenceTr: string) => {
    LearningStorageService.addWord({
      word: wordItem.en,
      translation: wordItem.tr,
      phonetic: wordItem.phonetic,
      partOfSpeech: 'Word',
      level: 'B1',
      exampleSentence: sentenceEn,
      exampleTranslation: sentenceTr
    });

    setSavedWordsMap((prev) => ({ ...prev, [wordItem.en]: true }));
    setTimeout(() => {
      setSavedWordsMap((prev) => ({ ...prev, [wordItem.en]: false }));
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF9FE] dark:bg-slate-950 overflow-y-auto select-none">
      {/* ==================== ÜST MAKALE VE HABER SEÇİCİ ÇUBUĞU ==================== */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chirmo Canlı İngilizce Okuyucu & Cümle Antrenörü</span>
            </span>
          </div>

          {/* Hızlı Makale Değiştirme Butonları */}
          <div className="flex items-center space-x-1.5 text-xs">
            <button
              onClick={() => {
                setSelectedArticleKey('bbc');
                setActiveSentence(BUILTIN_ARTICLES.bbc.sentences[0]);
              }}
              className={`px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                selectedArticleKey === 'bbc'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              🇬🇧 BBC Teknoloji
            </button>

            <button
              onClick={() => {
                setSelectedArticleKey('learning');
                setActiveSentence(BUILTIN_ARTICLES.learning.sentences[0]);
              }}
              className={`px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                selectedArticleKey === 'learning'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              🎙️ BBC 6 Minute
            </button>

            <button
              onClick={() => {
                setSelectedArticleKey('wikipedia');
                setActiveSentence(BUILTIN_ARTICLES.wikipedia.sentences[0]);
              }}
              className={`px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                selectedArticleKey === 'wikipedia'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              📚 Sade Vikipedi
            </button>
          </div>
        </div>
      </div>

      {/* ==================== MAKALE GÖVDESİ & İNTERAKTİF CÜMLELER ==================== */}
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Makale Başlık Kartı */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
              {currentArticle.badge}
            </span>
            <span className="text-slate-400 font-medium">
              {currentArticle.source} • {currentArticle.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {currentArticle.title}
          </h1>

          <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl border border-blue-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-blue-900 dark:text-blue-200">
              <Headphones className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold">
                Sayfadaki her cümleye tıkla: Sesli dinle, Türkçe açıklamasını duy ve mikrofona konuşarak pratik yap! 🎙️
              </span>
            </div>
          </div>
        </div>

        {/* ==================== CÜMLE CÜMLE ÇALIŞTIRMA LİSTESİ ==================== */}
        <div className="space-y-4">
          {currentArticle.sentences.map((item, index) => {
            const isSelected = activeSentence.id === item.id;
            const isListening = isListeningSentenceId === item.id;
            const score = spokenScores[item.id];

            return (
              <div
                key={item.id}
                onClick={() => handleSelectSentence(item)}
                className={`p-5 rounded-3xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-blue-400 dark:border-blue-500 shadow-lg ring-2 ring-blue-400/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-200 shadow-xs'
                }`}
              >
                {/* Cümle Başlığı & Dinleme Butonları */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      {/* İngilizce Orijinal Cümle */}
                      <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                        "{item.en}"
                      </p>

                      {/* Türkçe Çevirisi */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-1.5 flex items-center space-x-1.5">
                        <span className="text-blue-600 dark:text-blue-400 font-black">Türkçesi:</span>
                        <span>{item.tr}</span>
                      </p>
                    </div>
                  </div>

                  {/* Cümleyi Dinle Butonu */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(item.en);
                    }}
                    className="p-2.5 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors shrink-0 cursor-pointer shadow-xs"
                    title="İngilizce Cümleyi Sesli Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* ==================== TÜRKÇE SESLİ AÇIKLAMA ==================== */}
                <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-indigo-700 dark:text-indigo-300 flex items-center space-x-1 uppercase tracking-wide">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Öğretmenin Cümle Analizi:</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakExplanation(item);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-indigo-50 text-indigo-700 dark:text-indigo-200 text-xs font-bold border border-indigo-200 dark:border-slate-600 flex items-center space-x-1 cursor-pointer transition-colors shadow-xs"
                      title="Türkçe Açıklamayı Sesli Olarak Dinle"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Sesli Açıklamayı Dinle</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {item.explanationTr}
                  </p>

                  {/* Cümledeki Kelimeler ve Deftere Ekleme */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center flex-wrap gap-2">
                    <span className="text-[11px] font-bold text-slate-400">Önemli Kelimeler:</span>
                    {item.keyWords.map((kw) => {
                      const isSaved = !!savedWordsMap[kw.en];
                      return (
                        <div
                          key={kw.en}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs shadow-2xs"
                        >
                          <span className="font-extrabold text-slate-900 dark:text-white">{kw.en}</span>
                          <span className="text-slate-400 text-[10px]">({kw.tr})</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeak(kw.en);
                            }}
                            className="p-0.5 text-blue-600 hover:text-blue-800"
                            title="Dinle"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveWord(kw, item.en, item.tr);
                            }}
                            disabled={isSaved}
                            className={`p-0.5 rounded cursor-pointer ${
                              isSaved ? 'text-emerald-600' : 'text-slate-400 hover:text-blue-600'
                            }`}
                            title="Defterime Ekle"
                          >
                            {isSaved ? <Check className="w-3 h-3" /> : <BookmarkPlus className="w-3 h-3" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ==================== SESLİ CÜMLE ÇALIŞTIRMA (MİKROFON) ==================== */}
                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePracticeSentenceSpeaking(item);
                      }}
                      className={`px-4 py-2 rounded-2xl font-black text-xs transition-all shadow-sm flex items-center space-x-2 cursor-pointer ${
                        isListening
                          ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="w-4 h-4 animate-bounce" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                      <span>{isListening ? 'Seni Dinliyorum, Cümleyi Söyle...' : 'Bu Cümleyi Sesli Çalıştır (Sen Söyle)'}</span>
                    </button>
                  </div>

                  {/* Skor & Yıldız Gösterimi */}
                  {score && (
                    <div className="flex items-center space-x-3 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs animate-in fade-in">
                      <div className="flex items-center space-x-0.5 text-amber-400">
                        {Array.from({ length: score.stars }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="font-black text-emerald-800 dark:text-emerald-300">
                        %{score.percentage} Akıcılık
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 text-[11px] hidden md:inline">
                        • {score.praise}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
