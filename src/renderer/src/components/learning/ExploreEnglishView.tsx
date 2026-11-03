import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  Clock,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle,
  ExternalLink,
  Flame,
  Globe
} from 'lucide-react';
import { CEFRLevel, ExploredArticle } from '../../types';
import { CURATED_LEARNING_ARTICLES } from '../../services/learningStorage';

interface ExploreEnglishViewProps {
  userLevel: CEFRLevel;
  onOpenArticleInBrowser: (url: string) => void;
}

export const ExploreEnglishView: React.FC<ExploreEnglishViewProps> = ({
  userLevel,
  onOpenArticleInBrowser
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const categories = ['all', 'Teknoloji', 'Bilim & Enerji', 'Tarih & Kültür', 'Ekonomi'];
  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filteredArticles = CURATED_LEARNING_ARTICLES.filter((art) => {
    const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchLvl = selectedLevel === 'all' || art.level === selectedLevel;
    return matchCat && matchLvl;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Hero Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
              <Compass className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">İçerik & Okuma Merkezi</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Keşfet — Seviyene Uygun İngilizce Dünyası
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              İlgi alanına göre seçilmiş güncel makaleler. Sayfayı açtığında Chirmo bilmediğin kelimeleri işaretler ve öğrenmeni sağlar.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-4 h-4" />
            <span>Mevcut Seviyen: {userLevel}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat === 'all' ? 'Tüm Konular' : cat}
              </button>
            ))}
          </div>

          {/* Level selector */}
          <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
                  selectedLevel === lvl
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl === 'all' ? 'Tüm Seviyeler' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-8 shadow-xl">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md">
                Günün Önerilen Okuması
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900">
                B1 Seviyesi
              </span>
            </div>

            <h2 className="text-2xl font-black leading-tight">
              BBC News: Artificial Intelligence Is Changing Our World
            </h2>
            <p className="text-xs text-blue-100 leading-relaxed">
              "Artificial intelligence is helping businesses improve their services and reduce costs..."
              Bu makaleyi açarak B1 ve B2 seviyesindeki 8 yeni fiil ve sıfatı Chirmo ile okuyarak öğrenin.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => onOpenArticleInBrowser('https://www.bbc.com/news/technology')}
                className="px-5 py-2.5 bg-white text-slate-900 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
              >
                <span>Chirmo'da Okumaya Başla</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    {art.category}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      {art.level}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {art.summary}
                </p>

                {/* Vocabulary keywords preview */}
                <div className="pt-2 flex items-center space-x-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-medium">Önemli Kelimeler:</span>
                  {art.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{art.url}</span>
                </span>

                <button
                  onClick={() => onOpenArticleInBrowser(art.url)}
                  className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                >
                  <span>Chirmo'da Aç</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
