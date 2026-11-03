import React, { useState } from 'react';
import {
  Search,
  Volume2,
  BookmarkPlus,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  CheckSquare,
  Flame,
  Mic,
  Award,
  Compass,
  HeartHandshake
} from 'lucide-react';
import { ChirmoLogo } from '../common/ChirmoLogo';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';
import { CEFRLevel } from '../../types';
import { CampStorageService, THIRTY_DAY_MISSIONS } from '../../services/curriculumData';

interface SimpleSearchHomeProps {
  onSearch: (queryOrUrl: string) => void;
  onNavigateToLearn: () => void;
  onNavigateToTasks: () => void;
  userLevel: CEFRLevel;
  pendingTaskCount: number;
}

export const SimpleSearchHome: React.FC<SimpleSearchHomeProps> = ({
  onSearch,
  onNavigateToLearn,
  onNavigateToTasks,
  userLevel,
  pendingTaskCount
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [wordAdded, setWordAdded] = useState(false);

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
    onSearch(searchInput.trim());
  };

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
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

  const quickSites = [
    { name: 'Google', url: 'https://www.google.com', icon: '🔍' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' },
    { name: 'BBC Kolay İngilizce', url: 'https://www.bbc.co.uk/learningenglish', icon: '🇬🇧' },
    { name: 'Sade Vikipedi', url: 'https://simple.wikipedia.org', icon: '📚' },
    { name: 'Google Çeviri', url: 'https://translate.google.com', icon: '🌐' }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-full px-4 py-8 max-w-4xl mx-auto w-full select-none">
      {/* Üst Karşılama ve Logo */}
      <div className="flex flex-col items-center text-center space-y-3 pt-4 sm:pt-8">
        <div className="scale-110 sm:scale-125 mb-1">
          <ChirmoLogo size="lg" variant="hero" />
        </div>
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-black">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Sıfırdan 30 Günde Konuşma Garantili Yapay Zekâ Tarayıcısı</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-lg">
          20 yıllık öğretmen metoduyla gramer ezberini unut! İnternette gezinirken günde 5 dakika konuşma refleksi kazan, tüm hedeflerini tek yerden yönet.
        </p>
      </div>

      {/* Arama Kutusu */}
      <div className="w-full max-w-2xl my-5">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center shadow-lg hover:shadow-xl transition-all rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Web'de ara veya bir site adresi yaz (örn: bbc.com, wikipedia.org)..."
              className="w-full py-3.5 px-3 text-sm text-slate-800 dark:text-slate-100 bg-transparent outline-none placeholder:text-slate-400"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-2.5 mr-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm shrink-0 cursor-pointer"
            >
              Ara veya Git
            </button>
          </div>
        </form>

        {/* Hızlı Başlangıç Siteleri */}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-xs">
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
      <div className="w-full max-w-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-5 text-white shadow-md mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs font-black text-amber-300">
            <Zap className="w-4 h-4" />
            <span>30 GÜNLÜK KONUŞMA KAMPI • {currentMission.day}. GÜN GÖREVİ</span>
          </div>
          <h3 className="text-lg font-black">{currentMission.title}</h3>
          <p className="text-xs text-blue-100 max-w-md">
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

      {/* Alt Bilgi Kartları: Günün Kalıbı & İş Takibi */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
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
    </div>
  );
};
