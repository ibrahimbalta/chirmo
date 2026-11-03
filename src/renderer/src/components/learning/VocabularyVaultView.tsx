import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Volume2,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService } from '../../services/learningStorage';

interface VocabularyVaultViewProps {
  onOpenWordInBrowser?: (word: string) => void;
}

export const VocabularyVaultView: React.FC<VocabularyVaultViewProps> = () => {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setWords(LearningStorageService.getSavedWords());
  }, []);

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleDelete = (id: string) => {
    LearningStorageService.removeWord(id);
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  const handleMasteryVote = (id: string, isCorrect: boolean) => {
    LearningStorageService.updateMastery(id, isCorrect);
    setWords(LearningStorageService.getSavedWords());
    if (isFlashcardMode) {
      setShowAnswer(false);
      setCurrentCardIndex((prev) => (prev + 1) % filteredWords.length);
    }
  };

  const filteredWords = words.filter((w) => {
    const matchLevel = filterLevel === 'all' || w.level === filterLevel;
    const matchSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchSearch;
  });

  const levels: Array<string> = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-1">
              <Bookmark className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Kişisel Öğrenme Havuzu</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Kelimelerim (Vocabulary Vault)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              İnternette gezinirken kaydettiğin tüm İngilizce kelimeler ve akıllı tekrar durumu ({words.length} kelime)
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setIsFlashcardMode(!isFlashcardMode);
                setShowAnswer(false);
                setCurrentCardIndex(0);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isFlashcardMode
                  ? 'bg-blue-600 text-white shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isFlashcardMode ? 'Kart Modundan Çık' : 'Flashcard Pratiği Başlat'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 flex-1 flex flex-col space-y-6">
        {/* Flashcard Practice Mode */}
        {isFlashcardMode && filteredWords.length > 0 ? (
          <div className="max-w-xl mx-auto w-full py-8 flex flex-col items-center">
            <div className="text-xs font-bold text-slate-400 mb-3">
              Kart {currentCardIndex + 1} / {filteredWords.length}
            </div>

            <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {filteredWords[currentCardIndex].level} • {filteredWords[currentCardIndex].partOfSpeech}
              </span>

              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white capitalize">
                  {filteredWords[currentCardIndex].word}
                </h2>
                {filteredWords[currentCardIndex].phonetic && (
                  <p className="text-sm font-mono text-slate-400">
                    {filteredWords[currentCardIndex].phonetic}
                  </p>
                )}
                <button
                  onClick={() => handleSpeak(filteredWords[currentCardIndex].word)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dinle</span>
                </button>
              </div>

              {/* Reveal translation toggle */}
              {showAnswer ? (
                <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in">
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {filteredWords[currentCardIndex].translation}
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs space-y-1">
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      "{filteredWords[currentCardIndex].exampleSentence}"
                    </p>
                    <p className="text-slate-500 italic">
                      "{filteredWords[currentCardIndex].exampleTranslation}"
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
                >
                  Anlamını & Örnek Cümleyi Göster
                </button>
              )}

              {/* Action votes */}
              {showAnswer && (
                <div className="flex items-center space-x-4 pt-2 w-full">
                  <button
                    onClick={() => handleMasteryVote(filteredWords[currentCardIndex].id, false)}
                    className="flex-1 py-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl border border-rose-200 dark:border-rose-800 transition-colors flex items-center justify-center space-x-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Zordu, Tekrar Göster</span>
                  </button>

                  <button
                    onClick={() => handleMasteryVote(filteredWords[currentCardIndex].id, true)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Biliyorum (+20%)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kelime veya Türkçe anlam ara..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Level Filter Tabs */}
              <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFilterLevel(lvl)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
                      filterLevel === lvl
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lvl === 'all' ? 'Tümü' : lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Word Grid */}
            {filteredWords.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Henüz bu kriterde kayıtlı kelime yok
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  İnternette gezinirken bilmediğin kelimelerin üzerine tıklayarak ya da sağdaki AI Öğretmen panelinden "+ Kelime Defterime Ekle" butonuyla buraya kelime ekleyebilirsin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWords.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                              {item.word}
                            </h3>
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                              {item.level}
                            </span>
                          </div>
                          {item.phonetic && (
                            <span className="text-xs text-slate-400 font-mono">
                              {item.phonetic}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleSpeak(item.word)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Dinle"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                        {item.translation}
                      </div>

                      <div className="mt-2 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] space-y-1">
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          "{item.exampleSentence}"
                        </p>
                        <p className="text-slate-400 italic">
                          "{item.exampleTranslation}"
                        </p>
                      </div>
                    </div>

                    {/* Mastery Bar & Info */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-400">Ustalık:</span>
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${item.mastery}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          %{item.mastery}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400">
                        {item.reviewCount} Tekrar
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
