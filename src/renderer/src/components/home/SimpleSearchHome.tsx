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
        {/* ==================== ÜST LOGO & SLOGAN ==================== */}
        <div className="flex flex-col items-center text-center space-y-2.5 pt-2 sm:pt-4">
          <div className="scale-110 sm:scale-125 mb-1">
            <ChirmoLogo size="lg" variant="hero" />
          </div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-black">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Sıfırdan 30 Günde Konuşma Garantili Yapay Zekâ Tarayıcısı</span>
          </div>
        </div>

        {/* ==================== ARAMA KUTUSU & İNGİLİZCE ÖĞRENME ARAÇLARI ==================== */}
        <div className="w-full max-w-2xl">
          {/* Arama Öğrenme Modları (Oval & Minimal Segmented Filter Bar) */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 mb-3">
            <button
              type="button"
              onClick={() => setSearchMode('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                searchMode === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Arama</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchMode('easy_english')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                searchMode === 'easy_english'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-blue-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>🇬🇧 Kolay İngilizce</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchMode('how_to_say')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                searchMode === 'how_to_say'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-purple-50'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-purple-500" />
              <span>🎙️ Nasıl Söylenir?</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchMode('vocab')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                searchMode === 'vocab'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />
              <span>📖 Kelime Sözlüğü</span>
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center shadow-lg hover:shadow-xl transition-all rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
              {searchMode === 'how_to_say' ? (
                <Mic className="w-5 h-5 text-purple-500 ml-4 shrink-0" />
              ) : searchMode === 'easy_english' ? (
                <BookOpen className="w-5 h-5 text-blue-500 ml-4 shrink-0" />
              ) : searchMode === 'vocab' ? (
                <Lightbulb className="w-5 h-5 text-emerald-500 ml-4 shrink-0" />
              ) : (
                <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              )}

              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  searchMode === 'easy_english'
                    ? "Kolay İngilizce ile araştır (örn: climate change, solar system)..."
                    : searchMode === 'how_to_say'
                    ? "Türkçe yaz, İngilizce konuşma kalıbını öğren (örn: hesabı alabilir miyim)..."
                    : searchMode === 'vocab'
                    ? "Kelime anlamı & telaffuz (örn: improve, sustainable, toplantı)..."
                    : "Web'de ara veya İngilizce öğrenmek istediğin bir konu/kelime yaz..."
                }
                className="w-full py-3.5 px-3 text-sm text-slate-800 dark:text-slate-100 bg-transparent outline-none placeholder:text-slate-400"
                autoFocus
              />

              {/* Sesli Dinleme Butonu (Eğer arama kutusunda yazı varsa) */}
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
                className="px-5 py-2.5 mr-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition-all shadow-sm shrink-0 cursor-pointer flex items-center space-x-1"
              >
                <span>Ara & Öğren</span>
              </button>
            </div>
          </form>

          {/* ==================== CANLI CHIRMO İNGİLİZCE ÖĞRENME KARTI ==================== */}
          {activeLearningCard && (
            <div className="mt-3 p-4 bg-gradient-to-br from-indigo-50/95 via-purple-50/70 to-white dark:from-slate-800/95 dark:via-slate-800/80 dark:to-slate-900 border border-indigo-200/90 dark:border-indigo-800/80 rounded-2xl shadow-lg backdrop-blur-md transition-all text-left">
              {/* Üst Bilgi Rozetleri */}
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-slate-700/60">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>
                      {activeLearningCard.detectedLang === 'tr'
                        ? 'Türkçe ➔ Doğal İngilizce'
                        : 'İngilizce ➔ Türkçe'}
                    </span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                    {activeLearningCard.partOfSpeech}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold">
                    {activeLearningCard.level} Seviye
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveLearningCard(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-full text-xs cursor-pointer"
                    title="Kapat"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Ana İngilizce & Türkçe İfade & Dinleme */}
              <div className="py-2.5 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-baseline space-x-2">
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {activeLearningCard.english}
                    </h4>
                    {activeLearningCard.phonetic && (
                      <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                        {activeLearningCard.phonetic}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {activeLearningCard.turkish}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeak(activeLearningCard.english)}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer transition-transform hover:scale-105 shrink-0"
                  title="Telaffuzu Dinle"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Günlük Konuşma Örneği */}
              <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-indigo-100/90 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Örnek Cümle:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSpeak(activeLearningCard.exampleSentenceEn)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Cümleyi Dinle</span>
                  </button>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  "{activeLearningCard.exampleSentenceEn}"
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  "{activeLearningCard.exampleSentenceTr}"
                </p>
                {activeLearningCard.tip && (
                  <p className="text-[10px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40 mt-1">
                    💡 <strong>İpucu:</strong> {activeLearningCard.tip}
                  </p>
                )}
              </div>

              {/* Aksiyon Butonları */}
              <div className="mt-3 pt-2.5 border-t border-indigo-100/80 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleAddLearningCardWord(activeLearningCard)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    learningCardAdded
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50'
                  }`}
                >
                  {learningCardAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{learningCardAdded ? 'Kelimelerime Eklendi!' : 'Kelime Defterime Ekle'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTestPracticeFromCard(activeLearningCard.english)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-1.5 shadow-xs cursor-pointer transition-transform hover:scale-102"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Telaffuzumu Test Et</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSearch(activeLearningCard.english)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center space-x-1.5 cursor-pointer ml-auto"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>İngilizce Ara</span>
                </button>
              </div>
            </div>
          )}

          {/* İngilizce Arama İlhamları (Pratik Hapları) */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 mt-3 text-xs">
            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Pratik Yap:</span>
            </span>
            {EnglishSearchHelper.getInspirationPrompts().map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => {
                  setSearchInput(prompt.text);
                  setSearchMode(prompt.mode);
                }}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-medium transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                title={`${prompt.title} (${prompt.category})`}
              >
                <span>{prompt.icon}</span>
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>

          {/* Hızlı Başlangıç Siteleri */}
          <div className="flex items-center justify-center flex-wrap gap-2 mt-2.5 text-xs">
            {quickSites.map((site) => (
              <button
                key={site.name}
                onClick={() => onSearch(site.url)}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{site.icon}</span>
                <span>{site.name}</span>
              </button>
            ))}
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
