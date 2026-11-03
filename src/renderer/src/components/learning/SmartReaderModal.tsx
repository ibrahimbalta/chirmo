import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Volume2,
  BookmarkPlus,
  Check,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  Flame,
  Award,
  Layers
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';

interface SmartReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle?: string;
  pageUrl?: string;
  userLevel: CEFRLevel;
  onWordAdded?: (word: VocabularyWord) => void;
}

export const SmartReaderModal: React.FC<SmartReaderModalProps> = ({
  isOpen,
  onClose,
  pageTitle = 'Artificial Intelligence Is Changing Our World',
  pageUrl = 'https://www.bbc.com/news/technology',
  userLevel,
  onWordAdded
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'vocab' | 'quiz'>('reader');
  const [savedWords, setSavedWords] = useState<Record<string, boolean>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>('improve');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isOpen) return null;

  // Key page vocabulary
  const pageKeywords = ['improve', 'reduce', 'sustainable', 'crucial', 'collaborate'];

  const quizQuestions = [
    {
      id: 1,
      q: 'According to the article, how does AI primarily assist businesses?',
      opts: [
        'By reducing costs and improving their services',
        'By replacing all human employees completely',
        'By increasing overall manufacturing expenses',
        'By stopping international collaboration'
      ],
      correct: 0,
      expl: 'İlk paragrafta belirtildiği gibi: "AI is helping businesses improve their services and reduce costs."'
    },
    {
      id: 2,
      q: 'What kind of digital workflows are described as "crucial" for modern companies?',
      opts: ['Temporary', 'Sustainable', 'Outdated', 'Manual'],
      correct: 1,
      expl: '"Sustainable digital workflows" (sürdürülebilir iş akışları) modern şirketler için kritik olarak tanımlanmıştır.'
    },
    {
      id: 3,
      q: 'What does the word "collaborate" mean in the text?',
      opts: ['Yarışmak / Rekabet etmek', 'İş birliği yapmak / Birlikte çalışmak', 'Ertelemek', 'Terk etmek'],
      correct: 1,
      expl: '"Collaborate", ortak bir hedef için birlikte emek harcamak / iş birliği yapmak demektir.'
    }
  ];

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleSaveWord = (word: string) => {
    const lookup = LearningStorageService.lookup(word);
    const saved = LearningStorageService.addWord({
      word,
      translation: lookup.translation,
      phonetic: lookup.phonetic,
      partOfSpeech: lookup.partOfSpeech,
      level: lookup.level,
      exampleSentence: `Artificial intelligence is helping businesses ${word} their operations.`,
      exampleTranslation: `Yapay zekâ işletmelerin operasyonlarını ${lookup.translation.toLowerCase()} yardımcı oluyor.`
    });
    setSavedWords((prev) => ({ ...prev, [word]: true }));
    if (onWordAdded) onWordAdded(saved);
  };

  const handleSelectQuizOpt = (qId: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct) correct += 1;
    });
    return correct;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full h-[90vh] max-h-[850px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Chirmo Akıllı Okuma Modu
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  {userLevel} Seviyesine Uyarlanmış
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">{pageTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('reader')}
            className={`flex-1 py-3 px-4 font-semibold flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'reader'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sadeleştirilmiş Makale</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex-1 py-3 px-4 font-semibold flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'vocab'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Sayfa Kelimeleri ({pageKeywords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-3 px-4 font-semibold flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'quiz'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>3 Soruluk Anlama Testi</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'reader' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-800 dark:text-indigo-300 flex items-center justify-between">
                <span>
                  💡 <strong>İpucu:</strong> Renkli kelimelerin üzerine tıklayarak Türkçe anlamını ve fonetik okunuşunu dinleyebilirsiniz.
                </span>
                <button
                  onClick={() => handleSpeak('Artificial intelligence is helping businesses improve their services.')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] flex items-center space-x-1 shrink-0 ml-2 shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Dinle</span>
                </button>
              </div>

              {/* Article Content */}
              <article className="prose prose-slate dark:prose-invert max-w-none space-y-5 text-sm leading-relaxed select-text">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white not-prose">
                  {pageTitle}
                </h1>

                <p className="text-slate-700 dark:text-slate-200">
                  Artificial intelligence is helping businesses{' '}
                  <button
                    onClick={() => setSelectedWord('improve')}
                    className="font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 hover:scale-105 transition-all"
                  >
                    improve
                  </button>{' '}
                  their daily services and{' '}
                  <button
                    onClick={() => setSelectedWord('reduce')}
                    className="font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 hover:scale-105 transition-all"
                  >
                    reduce
                  </button>{' '}
                  unnecessary operational costs. In modern technology, automation allows teams to work much faster than before.
                </p>

                <p className="text-slate-700 dark:text-slate-200">
                  Industry experts emphasize that it has become{' '}
                  <button
                    onClick={() => setSelectedWord('crucial')}
                    className="font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 hover:scale-105 transition-all"
                  >
                    crucial
                  </button>{' '}
                  to adopt{' '}
                  <button
                    onClick={() => setSelectedWord('sustainable')}
                    className="font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 hover:scale-105 transition-all"
                  >
                    sustainable
                  </button>{' '}
                  digital practices. When companies{' '}
                  <button
                    onClick={() => setSelectedWord('collaborate')}
                    className="font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 hover:scale-105 transition-all"
                  >
                    collaborate
                  </button>{' '}
                  across continents, they exchange knowledge and build stronger software systems.
                </p>
              </article>

              {/* Active Word Card Inspector */}
              {selectedWord && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border border-blue-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-black text-slate-900 dark:text-white capitalize">
                        {selectedWord}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {LearningStorageService.lookup(selectedWord).level}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {LearningStorageService.lookup(selectedWord).phonetic}
                      </span>
                      <button
                        onClick={() => handleSpeak(selectedWord)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-100"
                        title="Dinle"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {LearningStorageService.lookup(selectedWord).translation}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSaveWord(selectedWord)}
                    disabled={savedWords[selectedWord]}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 ${
                      savedWords[selectedWord]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {savedWords[selectedWord] ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    <span>{savedWords[selectedWord] ? 'Kaydedildi' : '+ Deftere Ekle'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vocab' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {pageKeywords.map((kw) => {
                const info = LearningStorageService.lookup(kw);
                const isSaved = !!savedWords[kw];

                return (
                  <div
                    key={kw}
                    className="p-4 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                            {kw}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                            {info.level}
                          </span>
                        </div>

                        <button
                          onClick={() => handleSpeak(kw)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1">
                        {info.translation}
                      </p>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1">
                        "{info.exampleSentence}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex justify-end">
                      <button
                        onClick={() => handleSaveWord(kw)}
                        disabled={isSaved}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1 ${
                          isSaved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                        <span>{isSaved ? 'Kaydedildi' : '+ Deftere Ekle'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                <span>
                  Makaleyi ne kadar anladığınızı test edin. 3 soruyu cevaplayarak günlük hedefinize puan ekleyin.
                </span>
                {quizSubmitted && (
                  <span className="font-bold text-emerald-600">
                    Skorunuz: {calculateScore()} / 3 Doğru
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {quizQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm"
                  >
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {idx + 1}. {q.q}
                    </h3>

                    <div className="space-y-2">
                      {q.opts.map((opt, optIdx) => {
                        const isSelected = quizAnswers[q.id] === optIdx;
                        const isCorrect = q.correct === optIdx;

                        let style = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50';
                        if (quizSubmitted) {
                          if (isCorrect) {
                            style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 font-bold';
                          } else if (isSelected) {
                            style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 font-bold';
                          }
                        } else if (isSelected) {
                          style = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOpt(q.id, optIdx)}
                            disabled={quizSubmitted}
                            className={`w-full p-3 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${style}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100 dark:border-slate-700">
                        {q.expl}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setQuizSubmitted(true);
                      LearningStorageService.incrementDailyWordCount(calculateScore());
                    }}
                    disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Testi Tamamla & Puanı Kaydet
                  </button>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Tekrar Çöz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
