import React, { useState } from 'react';
import {
  Search,
  Globe,
  Volume2,
  BookmarkPlus,
  Check,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckSquare,
  Clock,
  Compass
} from 'lucide-react';
import { ChirmoLogo } from '../common/ChirmoLogo';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';
import { CEFRLevel } from '../../types';

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

  // Günün kelimesi (Seviyeye uygun sade kelime)
  const dailyWordKey = 'improve';
  const dailyWord = BUILTIN_DICTIONARY[dailyWordKey];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSearch(searchInput.trim());
  };

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleAddDailyWord = () => {
    LearningStorageService.addWord({
      word: dailyWordKey,
      translation: dailyWord.translation,
      phonetic: dailyWord.phonetic,
      partOfSpeech: dailyWord.partOfSpeech,
      level: dailyWord.level,
      exampleSentence: dailyWord.exampleSentence,
      exampleTranslation: dailyWord.exampleTranslation
    });
    setWordAdded(true);
    setTimeout(() => setWordAdded(false), 2500);
  };

  const quickSites = [
    { name: 'Google', url: 'https://www.google.com', icon: '🔍' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' },
    { name: 'BBC Kolay İngilizce', url: 'https://www.bbc.co.uk/learningenglish', icon: '🇬🇧' },
    { name: 'Vikipedi (Sade)', url: 'https://simple.wikipedia.org', icon: '📚' },
    { name: 'Google Çeviri', url: 'https://translate.google.com', icon: '🌐' }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-full px-4 py-8 max-w-4xl mx-auto w-full select-none">
      {/* Üst Karşılama ve Logo */}
      <div className="flex flex-col items-center text-center space-y-3 pt-6 sm:pt-12">
        <div className="scale-110 sm:scale-125 mb-2">
          <ChirmoLogo size="lg" variant="hero" />
        </div>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-md">
          İnternette gezinirken doğal şekilde İngilizce öğrenin, günlük işlerinizi tek bir yerden takip edin.
        </p>
      </div>

      {/* Arama Kutusu */}
      <div className="w-full max-w-2xl my-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative flex items-center shadow-lg hover:shadow-xl transition-all rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Web'de arayın veya bir web adresi yazın (örn: bbc.com)..."
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

      {/* Alt Bilgi Kartları: Günün Kelimesi & İş Takibi */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
        {/* Günün Kelimesi Kartı */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-blue-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Günün Kelimesi</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {dailyWord.level} Seviyesi
            </span>
          </div>

          <div>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white capitalize">
                {dailyWordKey}
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {dailyWord.phonetic}
              </span>
              <button
                onClick={() => handleSpeak(dailyWordKey)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                title="Doğru Okunuşu Dinle"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
              {dailyWord.translation}
            </p>
            <p className="text-xs text-slate-500 italic mt-1">
              "{dailyWord.exampleTranslation}"
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleAddDailyWord}
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
              <span>Tüm Kelimeler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Günün Görevleri Kartı */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>İş & Görev Takibi</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {pendingTaskCount > 0 ? `${pendingTaskCount} Görev Var` : 'Görevler Tamam'}
            </span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Bugün Neler Yapacaksınız?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              İşlerinizi, çalışma hedeflerinizi ve yapılacaklar listenizi kolayca planlayın.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              To-Do & Çalışma Notları
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
