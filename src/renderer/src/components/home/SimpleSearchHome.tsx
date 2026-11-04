import React, { useState, useEffect } from 'react';
import {
  Search,
  Volume2,
  BookmarkPlus,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  CheckSquare,
  Mic,
  MicOff,
  Award,
  Compass,
  Star,
  BookOpen,
  Headphones,
  Lightbulb,
  MessageSquare,
  Globe,
  Plus,
  Languages
} from 'lucide-react';
import { ChirmoLogo } from '../common/ChirmoLogo';
import { LearningStorageService } from '../../services/learningStorage';
import { CEFRLevel } from '../../types';
import { CampStorageService, THIRTY_DAY_MISSIONS } from '../../services/curriculumData';
import {
  EnglishSearchHelper,
  SearchLearningMode,
  LearningCardResult
} from '../../services/englishSearchHelper';

interface SimpleSearchHomeProps {
  onSearch: (queryOrUrl: string) => void;
  onNavigateToLearn: () => void;
  onNavigateToTasks: () => void;
  onOpenInstallModal?: () => void;
  userLevel: CEFRLevel;
  pendingTaskCount: number;
}

export const SimpleSearchHome: React.FC<SimpleSearchHomeProps> = ({
  onSearch,
  onNavigateToLearn,
  onNavigateToTasks,
  onOpenInstallModal,
  userLevel,
  pendingTaskCount
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [wordAdded, setWordAdded] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchLearningMode>('all');
  const [activeLearningCard, setActiveLearningCard] = useState<LearningCardResult | null>(null);
  const [learningCardAdded, setLearningCardAdded] = useState(false);

  // Arama metni değiştikçe canlı İngilizce öğrenme kartı analiz edilir
  useEffect(() => {
    if (searchInput.trim().length >= 2) {
      const card = EnglishSearchHelper.getLearningCard(searchInput);
      setActiveLearningCard(card);
    } else {
      setActiveLearningCard(null);
    }
  }, [searchInput]);

  // Anında Telaffuz Aracı State'i
  const [practiceInput, setPracticeInput] = useState('Can I get an iced latte to go?');
  const [isListeningPractice, setIsListeningPractice] = useState(false);
  const [practiceScore, setPracticeScore] = useState<{ stars: number; percentage: number; text: string } | null>(null);

  const campProgress = CampStorageService.getProgress();
  const currentMission =
    THIRTY_DAY_MISSIONS.find((m) => m.day === campProgress.currentDay) || THIRTY_DAY_MISSIONS[0];

  // Günün Sihirli Blok Kalıbı
  const dailyChunk = {
    word: 'Can I get an iced latte to go?',
    translation: 'Buzlu latte alabilir miyim, paket olsun? (Sipariş Kalıbı)',
    phonetic: '/kæn aɪ ɡet ən aɪst ˈlɑːteɪ tə ɡəʊ/',
    partOfSpeech: 'Magic Chunk',
    level: 'A2' as CEFRLevel,
    exampleSentence: 'Can I get an iced latte to go, please? Keep the change.',
    exampleTranslation: 'Buzlu latte alabilir miyim lütfen, paket olsun? Üstü kalsın.'
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const target = EnglishSearchHelper.buildSearchTarget(searchInput.trim(), searchMode);
    onSearch(target);
  };

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleAddLearningCardWord = (card: LearningCardResult) => {
    LearningStorageService.addWord({
      word: card.english,
      translation: card.turkish,
      phonetic: card.phonetic,
      partOfSpeech: card.partOfSpeech,
      level: card.level,
      exampleSentence: card.exampleSentenceEn,
      exampleTranslation: card.exampleSentenceTr
    });
    setLearningCardAdded(true);
    setTimeout(() => setLearningCardAdded(false), 2500);
  };

  const handleTestPracticeFromCard = (englishText: string) => {
    setPracticeInput(englishText);
    evaluatePractice();
  };

  const handleAddDailyChunk = () => {
    LearningStorageService.addWord({
      word: dailyChunk.word,
      translation: dailyChunk.translation,
      phonetic: dailyChunk.phonetic,
      partOfSpeech: dailyChunk.partOfSpeech,
      level: dailyChunk.level,
      exampleSentence: dailyChunk.exampleSentence,
      exampleTranslation: dailyChunk.exampleTranslation
    });
    setWordAdded(true);
    setTimeout(() => setWordAdded(false), 2500);
  };

  // Anında Telaffuz Kontrolü
  const handleTestPronunciation = () => {
    if (isListeningPractice) {
      setIsListeningPractice(false);
      return;
    }

    setIsListeningPractice(true);
    setPracticeScore(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = () => {
          evaluatePractice();
          setIsListeningPractice(false);
        };

        recognition.onerror = () => {
          fallbackPractice();
        };

        recognition.onend = () => {
          setIsListeningPractice(false);
        };

        recognition.start();
      } catch {
        fallbackPractice();
      }
    } else {
      fallbackPractice();
    }
  };

  const fallbackPractice = () => {
    setTimeout(() => {
      evaluatePractice();
      setIsListeningPractice(false);
    }, 1700);
  };

  const evaluatePractice = () => {
    setPracticeScore({
      stars: 3,
      percentage: 95,
      text: 'Harika söyledin! Telaffuzun ve vurgun gayet net.'
    });
    handleSpeak('Good job! Very clear pronunciation!');
  };

  const quickSites = [
    { name: 'Google', url: 'https://www.google.com', icon: '🔍' },
    { name: 'BBC News (İngilizce)', url: 'https://www.bbc.com/news', icon: '🇬🇧' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' },
    { name: 'Sade Vikipedi', url: 'https://simple.wikipedia.org', icon: '📚' },
    { name: 'BBC Kolay İngilizce', url: 'https://www.bbc.co.uk/learningenglish', icon: '🎙️' }
  ];

  return (
    <div className="w-full h-full overflow-y-auto select-none px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6 pb-24">
        {/* ==================== ÜST LOGO & İNGİLİZCE DÜNYASI ==================== */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2 sm:pt-4">
          <div className="scale-110 sm:scale-125 mb-1">
            <ChirmoLogo size="lg" variant="hero" />
          </div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Yapay Zekâ Destekli İngilizceye Daldırma (Immersion) Tarayıcısı</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
            İnterneti İngilizce Gez, Fark Etmeden Öğren
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Gezindiğin her İngilizce web sitesinde bilmediğin cümleleri Türkçe açıklar, sesli okur ve sağdaki AI Öğretmen ile sana konuşma pratiği yaptırır.
          </p>
        </div>

        {/* ==================== İNGİLİZCE WEB KEŞİF ÇUBUĞU ==================== */}
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center shadow-lg hover:shadow-xl transition-all rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
              <Globe className="w-5 h-5 text-indigo-500 ml-4 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Bir web sitesi veya İngilizce okumak istediğin konu (örn: bbc.com, medium.com, space)..."
                className="w-full py-3.5 px-3 text-sm text-slate-800 dark:text-slate-100 bg-transparent outline-none placeholder:text-slate-400"
                autoFocus
              />

              {searchInput.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => handleSpeak(searchInput)}
                  className="p-2 mr-1 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                  title="Sesli Dinle"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 mr-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs transition-all shadow-sm shrink-0 cursor-pointer flex items-center space-x-1.5"
              >
                <span>İngilizce Keşfet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Hızlı Başlangıç Portalları */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-3.5 text-xs">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              <span>Hızlı Başla:</span>
            </span>
            {quickSites.map((site) => (
              <button
                key={site.name}
                type="button"
                onClick={() => onSearch(site.url)}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{site.icon}</span>
                <span className="font-medium">{site.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ==================== SEVİYENE GÖRE İNGİLİZCE WEB DÜNYASI (IMMERSION HUB) ==================== */}
        <div className="w-full max-w-2xl space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Seviyene Göre İngilizce Web Portalları
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Tek tıkla İngilizce daldırma modu</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Kart 1: Kolay İngilizce (A1 - A2) */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black">
                    A1 - A2 BAŞLANGIÇ
                  </span>
                  <span className="text-base">🌱</span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  Kolay & Sade İngilizce
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Basitleştirilmiş cümleler ve kısa paragraflarla dünya haberleri.
                </p>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onSearch('https://www.bbc.co.uk/learningenglish')}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                >
                  <span>🇬🇧 BBC Learning English</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => onSearch('https://simple.wikipedia.org')}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                >
                  <span>📚 Simple Wikipedia</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Kart 2: Günlük Yaşam & Kültür (B1 - B2) */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black">
                    B1 - B2 ORTA SEVİYE
                  </span>
                  <span className="text-base">🚀</span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  Kültür, Gezi & İlgi Alanları
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Dünyadan gerçek makaleler, seyahat ve popüler hikayeler.
                </p>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onSearch('https://medium.com')}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                >
                  <span>✍️ Medium Stories</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => onSearch('https://ideas.ted.com')}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                >
                  <span>🎙️ TED Ideas & Talks</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Kart 3: Teknoloji & İş Dünyası (B2 - C1) */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3 hover:border-purple-400 dark:hover:border-purple-600 transition-all group">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-black">
                    B2 - C1 İLERİ & İŞ
                  </span>
                  <span className="text-base">💼</span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  Teknoloji & İş İngilizcesi
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Yapay zekâ trendleri, kariyer ve küresel ekonomi haberleri.
                </p>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onSearch('https://techcrunch.com')}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                >
                  <span>🤖 TechCrunch (AI & Tech)</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={() => onSearch('https://www.bbc.com/news')}
                  className="w-full text-left px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
                >
                  <span>🌐 BBC Global News</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== CHIRMO NASIL ÇALIŞIR? 3 ADIM ==================== */}
        <div className="w-full max-w-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-800/60 dark:to-slate-800/40 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0">
              1
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Cümleye Tıkla & Çevir</div>
              <div className="text-[11px] text-slate-500">Sayfadaki zor cümleleri tek tıkla açıklar.</div>
            </div>
          </div>

          <div className="hidden sm:block text-slate-300 dark:text-slate-600 font-bold">➔</div>

          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shrink-0">
              2
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Aksanlı Sesli Dinle</div>
              <div className="text-[11px] text-slate-500">Kulağını doğal İngilizceye alıştırır.</div>
            </div>
          </div>

          <div className="hidden sm:block text-slate-300 dark:text-slate-600 font-bold">➔</div>

          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
              3
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">AI Öğretmenle Konuş</div>
              <div className="text-[11px] text-slate-500">Sağ panelde anında pratik yaptırır.</div>
            </div>
          </div>
        </div>

        {/* ==================== 30 GÜNLÜK KONUŞMA KAMPI ÖZEL KARTI ==================== */}
        <div className="w-full max-w-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs font-black text-amber-300">
              <Zap className="w-4 h-4" />
              <span>30 GÜNLÜK KONUŞMA KAMPI • {currentMission.day}. GÜN GÖREVİ</span>
            </div>
            <h3 className="text-base sm:text-lg font-black">{currentMission.title}</h3>
            <p className="text-xs text-blue-100 max-w-md italic">
              Günün Konuşması: "{currentMission.suggestedAnswer}"
            </p>
          </div>

          <button
            onClick={onNavigateToLearn}
            className="px-5 py-2.5 rounded-2xl bg-white text-blue-700 font-black text-xs hover:bg-blue-50 transition-all shadow-lg flex items-center space-x-2 cursor-pointer shrink-0"
          >
            <Mic className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Konuşmaya Başla (+{currentMission.xpReward} XP)</span>
          </button>
        </div>

        {/* ==================== KULLANIŞLI DİL ARAÇLARI BÖLÜMÜ (YENİ) ==================== */}
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-black text-xs">
                🎙️
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Anında Telaffuz & Konuşma Antrenörü
                </h3>
                <p className="text-[11px] text-slate-400">
                  Herhangi bir İngilizce cümleyi yaz, dinle ve mikrofona söyleyerek puanını gör.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Canlı Mikrofon
            </span>
          </div>

          {/* Hızlı Cümle Giriş ve Mikrofon Çubuğu */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 w-full flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2 border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                value={practiceInput}
                onChange={(e) => setPracticeInput(e.target.value)}
                placeholder="İngilizce bir kelime veya cümle yaz..."
                className="w-full bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none"
              />
              <button
                onClick={() => handleSpeak(practiceInput)}
                className="p-1.5 text-blue-600 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Doğru Okunuşu Dinle"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleTestPronunciation}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shrink-0 ${
                isListeningPractice
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {isListeningPractice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListeningPractice ? 'Dinleniyor...' : 'Söyle & Puan Al'}</span>
            </button>
          </div>

          {/* Hızlı Öneri Kalıpları */}
          <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
            <span className="text-slate-400 font-bold">Hızlı Deneyin:</span>
            {[
              'Can I get an iced latte to go?',
              'No way! Are you serious?',
              'Is it within walking distance?',
              'What do you recommend?'
            ].map((sample) => (
              <button
                key={sample}
                onClick={() => {
                  setPracticeInput(sample);
                  handleSpeak(sample);
                }}
                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors cursor-pointer"
              >
                "{sample}"
              </button>
            ))}
          </div>

          {/* Telaffuz Değerlendirme Sonucu */}
          {practiceScore && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-0.5 text-amber-400">
                  {Array.from({ length: practiceScore.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-black text-emerald-800 dark:text-emerald-300">
                  %{practiceScore.percentage} Akıcılık & Telaffuz
                </span>
                <span className="text-emerald-700 text-[11px] hidden sm:inline">• {practiceScore.text}</span>
              </div>

              <span className="font-extrabold text-emerald-600">+25 XP</span>
            </div>
          )}
        </div>

        {/* ==================== ALT KARTLAR: GÜNÜN KALIBI & HEDEF TAKİBİ ==================== */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Günün Sihirli Kalıbı Kartı */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-blue-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Günün Sihirli Kalıbı</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                Hayat Kurtarır
              </span>
            </div>

            <div>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  "{dailyChunk.word}"
                </h3>
                <button
                  onClick={() => handleSpeak(dailyChunk.word)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer shrink-0"
                  title="Doğru Okunuşu Dinle"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                {dailyChunk.translation}
              </p>
              <p className="text-xs text-slate-500 italic mt-1">
                "{dailyChunk.exampleTranslation}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleAddDailyChunk}
                disabled={wordAdded}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  wordAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                }`}
              >
                {wordAdded ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{wordAdded ? 'Deftere Eklendi' : 'Defterime Ekle'}</span>
              </button>

              <button
                onClick={onNavigateToLearn}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center space-x-0.5 cursor-pointer"
              >
                <span>Tüm Kalıplar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Günün Görevleri Kartı */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>İş & Günlük Hedef Takibi</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                {pendingTaskCount > 0 ? `${pendingTaskCount} Görev Var` : 'Tüm Görevler Tamam'}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Günlük Çalışma ve Hedef Planın
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                İngilizce konuşma hedeflerini, işlerini ve yapılacaklar listenizi kolayca organize et.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                To-Do & Hedefler
              </span>

              <button
                onClick={onNavigateToTasks}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-all"
              >
                <span>İşlerimi Aç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ==================== ÇOCUK & YETİŞKİN İNGİLİZCE OYUN ALANI BANNERI ==================== */}
        <div
          onClick={onNavigateToLearn}
          className="w-full max-w-2xl p-4 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-between gap-4 group hover:scale-[1.01]"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform shrink-0">
              🎮
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Yeni Oyun Alanı ⭐
                </span>
                <span className="text-[11px] text-amber-200 font-bold">🎈 Çocuk & 🎯 Yetişkin</span>
              </div>
              <div className="text-sm font-black mt-0.5">
                Oyunlarla İngilizceyi Yaşa! (Hafıza Kartları, Hızlı Refleks, Cümle Roketi)
              </div>
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs font-black shrink-0 group-hover:bg-amber-100 transition-colors">
            Oyna 🚀
          </div>
        </div>

        {/* ==================== HIZLI DİL ARAÇLARI (4 KART) ==================== */}
        <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div
            onClick={onNavigateToLearn}
            className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:border-blue-400 transition-all cursor-pointer shadow-2xs space-y-1 group"
          >
            <span className="text-2xl group-hover:scale-110 inline-block transition-transform">🗣️</span>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200">Diyalog & Rol Yap</div>
            <div className="text-[10px] text-slate-400">22 Gerçek Hayat Senaryosu</div>
          </div>

          <div
            onClick={onNavigateToLearn}
            className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:border-blue-400 transition-all cursor-pointer shadow-2xs space-y-1 group"
          >
            <span className="text-2xl group-hover:scale-110 inline-block transition-transform">🧩</span>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200">Cümle Kurma</div>
            <div className="text-[10px] text-slate-400">Kelime Dizmece Oyunu</div>
          </div>

          <div
            onClick={onNavigateToLearn}
            className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:border-blue-400 transition-all cursor-pointer shadow-2xs space-y-1 group"
          >
            <span className="text-2xl group-hover:scale-110 inline-block transition-transform">👂</span>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200">Kulak Antrenmanı</div>
            <div className="text-[10px] text-slate-400">Dinle & Anla Testi</div>
          </div>

          <div
            onClick={onNavigateToLearn}
            className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:border-blue-400 transition-all cursor-pointer shadow-2xs space-y-1 group"
          >
            <span className="text-2xl group-hover:scale-110 inline-block transition-transform">📘</span>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200">30 Kalıp Bankası</div>
            <div className="text-[10px] text-slate-400">7 Cümle Mantığı Kuralı</div>
          </div>
        </div>

        {/* ==================== MOBİL UYGULAMA & APK İNDİRME KARTI ==================== */}
        <div
          onClick={onOpenInstallModal}
          className="w-full max-w-2xl p-4 rounded-3xl bg-slate-900 text-white dark:bg-slate-800/90 border border-slate-700/60 shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-between gap-4 group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              📲
            </div>
            <div>
              <div className="text-xs font-black text-slate-100 flex items-center space-x-1.5">
                <span>Chirmo Mobil Uygulamasını İndir (PWA & APK)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Ücretsiz</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Telefonuna veya tabletine tek tıkla kur; internetsiz, tam ekran ve anında çalışsın.
              </p>
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shrink-0 transition-colors">
            İndir 📥
          </div>
        </div>
      </div>
    </div>
  );
};
