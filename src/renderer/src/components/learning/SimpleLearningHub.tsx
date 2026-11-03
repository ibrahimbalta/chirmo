import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Bookmark,
  Volume2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  RotateCcw,
  Headphones,
  Check,
  Search,
  Award,
  ArrowRight
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';

interface SimpleLearningHubProps {
  userLevel: CEFRLevel;
  onLevelChange: (level: CEFRLevel) => void;
  onOpenInBrowser: (url: string) => void;
}

export const SimpleLearningHub: React.FC<SimpleLearningHubProps> = ({
  userLevel,
  onLevelChange,
  onOpenInBrowser
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'flashcards' | 'quiz' | 'listening'>('vault');
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  useEffect(() => {
    setWords(LearningStorageService.getSavedWords());
  }, []);

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleDeleteWord = (id: string) => {
    LearningStorageService.removeWord(id);
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  const handleMasteryVote = (id: string, isCorrect: boolean) => {
    LearningStorageService.updateMastery(id, isCorrect);
    setWords(LearningStorageService.getSavedWords());
    setShowAnswer(false);
    if (filteredWords.length > 0) {
      setCardIndex((prev) => (prev + 1) % filteredWords.length);
    }
  };

  const filteredWords = words.filter((w) =>
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const beginnerQuestions = [
    {
      q: '"Improve" kelimesi Türkçe ne anlama gelir?',
      opts: ['Geliştirmek / İyileştirmek', 'Koşmak', 'Yemek yemek', 'Uyumak'],
      correct: 0,
      expl: '"Improve" bir durumu veya yeteneği daha iyi hâle getirmek demektir.'
    },
    {
      q: 'Hangisi "Azaltmak / Düşürmek" anlamına gelir?',
      opts: ['Reduce', 'Apple', 'Water', 'Car'],
      correct: 0,
      expl: '"Reduce", maliyetleri veya miktarı azaltmak demektir.'
    },
    {
      q: '"Sustainable" kelimesinin anlamı nedir?',
      opts: ['Sürdürülebilir (Geleceğe kalıcı)', 'Zararlı', 'Bozuk', 'Pahalı'],
      correct: 0,
      expl: '"Sustainable", doğaya veya geleceğe zarar vermeden devam ettirilebilen şeyler için kullanılır.'
    }
  ];

  const currentQuiz = beginnerQuestions[quizIndex];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto select-none">
      {/* Üst Karşılama */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-1">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">İngilizce Öğrenme Rehberi</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Türkçe Anlatımlı İngilizce Öğren
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hiç İngilizce bilmeseniz bile internette gezinirken kelimeleri kaydedin, sesli dinleyin ve kolayca öğrenin.
            </p>
          </div>

          {/* Kolay Seviye Seçimi */}
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-1.5 rounded-2xl text-xs font-bold text-blue-700 dark:text-blue-300">
            <span>Seviyeniz:</span>
            {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onLevelChange(lvl)}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  userLevel === lvl
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
        {/* Kolay Sekmeler */}
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl text-xs">
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'vault'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Kelime Defterim ({words.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('flashcards');
              setShowAnswer(false);
              setCardIndex(0);
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kart Çevirmece</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2 Dakikalık Kolay Test</span>
          </button>
        </div>

        {/* 1. KELİME DEFTERİM */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kelime veya Türkçe anlam ara..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <span className="text-xs text-slate-400">
                Toplam <strong>{words.length}</strong> kelime kaydettiniz
              </span>
            </div>

            {filteredWords.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Henüz kelime defteriniz boş
                </h3>
                <p className="max-w-md mx-auto">
                  İnternette veya arama yaparken karşılaştığınız kelimeleri sağdaki AI paneline sorabilir veya tek tıkla defterinize ekleyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWords.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                            {item.word}
                          </h3>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                            {item.level}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleSpeak(item.word)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Dinle"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWord(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-2">
                        {item.translation}
                      </div>

                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] space-y-0.5 mt-2">
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          "{item.exampleSentence}"
                        </p>
                        <p className="text-slate-400 italic">
                          "{item.exampleTranslation}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Öğrenilme Durumu: %{item.mastery}</span>
                      <span>{item.reviewCount} Tekrar</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. KART ÇEVİRMECE (FLASHCARD) */}
        {activeTab === 'flashcards' && filteredWords.length > 0 && (
          <div className="max-w-md mx-auto w-full py-6 flex flex-col items-center space-y-4">
            <span className="text-xs font-bold text-slate-400">
              Kart {cardIndex + 1} / {filteredWords.length}
            </span>

            <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                {filteredWords[cardIndex].level} Seviyesi
              </span>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white capitalize">
                  {filteredWords[cardIndex].word}
                </h2>
                <button
                  onClick={() => handleSpeak(filteredWords[cardIndex].word)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-blue-600 font-bold hover:bg-blue-50 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dinle</span>
                </button>
              </div>

              {showAnswer ? (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-fade-in">
                  <p className="text-lg font-black text-emerald-600">
                    {filteredWords[cardIndex].translation}
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    "{filteredWords[cardIndex].exampleTranslation}"
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Türkçe Anlamını Göster
                </button>
              )}

              {showAnswer && (
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => handleMasteryVote(filteredWords[cardIndex].id, false)}
                    className="flex-1 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Hatırlayamadım
                  </button>
                  <button
                    onClick={() => handleMasteryVote(filteredWords[cardIndex].id, true)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    Biliyorum (+20%)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. 2 DAKİKALIK KOLAY TEST */}
        {activeTab === 'quiz' && (
          <div className="max-w-xl mx-auto w-full py-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Soru {quizIndex + 1} / {beginnerQuestions.length}</span>
                <span>Puanınız: {quizScore}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQuiz.q}
              </h3>

              <div className="grid grid-cols-1 gap-2 pt-2">
                {currentQuiz.opts.map((opt, i) => {
                  const isSelected = quizAnswered === i;
                  const isCorrect = i === currentQuiz.correct;

                  let style = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50';
                  if (quizAnswered !== null) {
                    if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                    else if (isSelected) style = 'border-rose-500 bg-rose-50 text-rose-800 font-bold';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (quizAnswered !== null) return;
                        setQuizAnswered(i);
                        if (i === currentQuiz.correct) {
                          setQuizScore((prev) => prev + 25);
                          LearningStorageService.incrementDailyWordCount(1);
                        }
                      }}
                      className={`p-3.5 text-left rounded-2xl border text-xs font-semibold transition-all ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizAnswered !== null && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <p className="text-xs text-slate-500 italic">{currentQuiz.expl}</p>
                  <button
                    onClick={() => {
                      setQuizAnswered(null);
                      if (quizIndex + 1 < beginnerQuestions.length) {
                        setQuizIndex((prev) => prev + 1);
                      } else {
                        setQuizIndex(0);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
                  >
                    {quizIndex + 1 === beginnerQuestions.length ? 'Yeniden Başla' : 'Sonraki Soru'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
