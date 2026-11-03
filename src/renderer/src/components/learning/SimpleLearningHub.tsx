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
  Check,
  Search,
  Award,
  Zap,
  GraduationCap
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService } from '../../services/learningStorage';
import { ThirtyDayCampView } from '../kids/ThirtyDayCampView';
import { GradeVocabularyView } from '../kids/GradeVocabularyView';
import { CampStorageService, GradeLevel } from '../../services/curriculumData';

interface SimpleLearningHubProps {
  userLevel: CEFRLevel;
  onLevelChange: (level: CEFRLevel) => void;
  onOpenInBrowser: (url: string) => void;
  initialTab?: 'camp' | 'grade' | 'vault' | 'flashcards' | 'quiz';
}

export const SimpleLearningHub: React.FC<SimpleLearningHubProps> = ({
  userLevel,
  onLevelChange,
  onOpenInBrowser,
  initialTab = 'camp'
}) => {
  const [activeTab, setActiveTab] = useState<'camp' | 'grade' | 'vault' | 'flashcards' | 'quiz'>(initialTab);
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [campProgress, setCampProgress] = useState(() => CampStorageService.getProgress());

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
      q: 'LGS 1. Ünite: "Count on" ifadesinin Türkçe karşılığı nedir?',
      opts: ['Güvenmek / Sırtını dayamak', 'Koşmak', 'Yemek yemek', 'Uyumak'],
      correct: 0,
      expl: '"Count on", gerçek arkadaşların birbirine güvenmesi anlamında LGS sınavında çok sık sorulur.'
    },
    {
      q: '"Would you like to join us?" sorusuna kibarca bahane bildirerek ret nasıl verilir?',
      opts: ['I would love to, but I have to study.', 'Yes, of course.', 'No, go away.', 'I don\'t know.'],
      correct: 0,
      expl: '"I would love to, but..." LGS\'de en popüler kibarca reddetme kalıbıdır.'
    },
    {
      q: '"Unbearable" kelimesi ne anlama gelir?',
      opts: ['Katlanılmaz / Çekilmez', 'Çok eğlenceli', 'Lezzetli', 'Pahalı'],
      correct: 0,
      expl: '"Unbearable", katlanılması güç, rahatsız edici durumlar veya müzik türleri için kullanılır.'
    }
  ];

  const currentQuiz = beginnerQuestions[quizIndex];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden select-none">
      {/* Üst Karşılama ve Hızlı Bilgi */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-0.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">
                5-8. Sınıf MEB & Konuşma Kampı
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              1 Ayda İngilizce Konuşma & LGS Hazırlık
            </h1>
          </div>

          {/* Sınıf & XP Rozeti */}
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 text-blue-700 dark:text-blue-300 text-xs font-black">
              {campProgress.selectedGrade}. Sınıf {campProgress.selectedGrade === '8' ? '(LGS)' : ''}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs font-black">
              🔥 {campProgress.streakDays} Gün Seri
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 border border-purple-200 text-purple-700 dark:text-purple-300 text-xs font-black">
              ⭐ {campProgress.totalXp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Sekmeler Menüsü */}
      <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center space-x-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('camp')}
            className={`py-2 px-3.5 rounded-xl font-black flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'camp'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>30 Günlük Konuşma Kampı 🚀</span>
          </button>

          <button
            onClick={() => setActiveTab('grade')}
            className={`py-2 px-3.5 rounded-xl font-black flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'grade'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>5-8. Sınıf MEB Üniteleri 📚</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vault'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Kelime Defterim ({words.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('flashcards');
              setShowAnswer(false);
              setCardIndex(0);
            }}
            className={`py-2 px-3 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'flashcards'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kart Çevirmece</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>LGS Mini Test</span>
          </button>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="flex-1 overflow-y-auto">
        {/* 1. 30 GÜNLÜK HIZLI KONUŞMA KAMPI */}
        {activeTab === 'camp' && (
          <ThirtyDayCampView
            onDayCompleted={(updated) => setCampProgress(updated)}
          />
        )}

        {/* 2. 5-8. SINIF MEB MÜFREDAT KELİMELERİ */}
        {activeTab === 'grade' && (
          <GradeVocabularyView
            initialGrade={campProgress.selectedGrade}
            onGradeChange={(grade) => {
              setCampProgress((prev) => ({ ...prev, selectedGrade: grade }));
            }}
            onWordAdded={() => setWords(LearningStorageService.getSavedWords())}
          />
        )}

        {/* 3. KELİME DEFTERİM */}
        {activeTab === 'vault' && (
          <div className="max-w-5xl mx-auto w-full p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kayıtlı kelimelerinde ara..."
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="text-xs text-slate-500 font-semibold">
                Toplam {filteredWords.length} Kelime Kayıtlı
              </div>
            </div>

            {filteredWords.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                  Henüz bu filtreye uygun kelime yok
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Ünitelerden veya web sayfalarından kelime kaydederek kendi kişisel defterini oluşturabilirsin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredWords.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-baseline space-x-1.5">
                            <h4 className="text-base font-black text-slate-900 dark:text-white capitalize">
                              {item.word}
                            </h4>
                            {item.phonetic && (
                              <span className="text-[11px] text-slate-400 font-mono">
                                {item.phonetic}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                            {item.translation}
                          </p>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleSpeak(item.word)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Telaffuzu Dinle"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWord(item.id)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Defterden Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {item.exampleSentence && (
                        <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-slate-700 dark:text-slate-300">
                          <p className="font-medium italic">"{item.exampleSentence}"</p>
                          {item.exampleTranslation && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {item.exampleTranslation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        {item.masteryLevel >= 4 ? (
                          <span className="text-emerald-600 font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Öğrenildi</span>
                          </span>
                        ) : (
                          <span>Tekrar Ediliyor</span>
                        )}
                      </span>
                      <span className="font-semibold text-slate-400">
                        {item.level || 'A1'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. KART ÇEVİRMECE (FLASHCARDS) */}
        {activeTab === 'flashcards' && (
          <div className="max-w-xl mx-auto w-full p-6 flex flex-col items-center justify-center min-h-[420px] space-y-6">
            {words.length === 0 ? (
              <p className="text-slate-500 text-sm">Kart çevirmek için önce birkaç kelime kaydet.</p>
            ) : (
              <>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Kart {cardIndex + 1} / {words.length}
                </div>

                <div
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="w-full h-64 bg-white dark:bg-slate-900 rounded-3xl border-2 border-blue-200 dark:border-slate-700 shadow-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-blue-500 transition-all group"
                >
                  {!showAnswer ? (
                    <div className="space-y-3">
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        İngilizce Kelime
                      </span>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white capitalize">
                        {words[cardIndex].word}
                      </h2>
                      {words[cardIndex].phonetic && (
                        <p className="text-xs text-slate-400 font-mono">
                          {words[cardIndex].phonetic}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 pt-4 group-hover:text-blue-600 transition-colors">
                        Türkçe anlamını görmek için tıkla 👆
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Türkçe Anlamı
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        {words[cardIndex].translation}
                      </h2>
                      {words[cardIndex].exampleSentence && (
                        <p className="text-xs text-slate-500 italic max-w-sm">
                          "{words[cardIndex].exampleSentence}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 w-full justify-center">
                  <button
                    onClick={() => handleMasteryVote(words[cardIndex].id, false)}
                    className="px-5 py-2.5 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <span>❌ Henüz Bilmiyorum</span>
                  </button>
                  <button
                    onClick={() => handleSpeak(words[cardIndex].word)}
                    className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    title="Sesli Dinle"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMasteryVote(words[cardIndex].id, true)}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <span>✅ Biliyorum (+XP)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 5. KOLAY TEST */}
        {activeTab === 'quiz' && (
          <div className="max-w-xl mx-auto w-full p-6 space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Soru {quizIndex + 1} / {beginnerQuestions.length}</span>
              <span className="text-blue-600">Skor: {quizScore} Doğru</span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {currentQuiz.q}
              </h3>

              <div className="space-y-2">
                {currentQuiz.opts.map((opt, i) => {
                  const isSelected = quizAnswered === i;
                  const isCorrect = i === currentQuiz.correct;

                  let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';
                  if (quizAnswered !== null) {
                    if (isCorrect) btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-600';
                    else if (isSelected) btnStyle = 'bg-rose-500 text-white font-bold border-rose-500';
                    else btnStyle = 'opacity-40 bg-slate-100 text-slate-500';
                  }

                  return (
                    <button
                      key={opt}
                      disabled={quizAnswered !== null}
                      onClick={() => {
                        setQuizAnswered(i);
                        if (i === currentQuiz.correct) {
                          setQuizScore((prev) => prev + 1);
                        }
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizAnswered !== null && isCorrect && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>

              {quizAnswered !== null && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    💡 {currentQuiz.expl}
                  </p>
                  <button
                    onClick={() => {
                      setQuizAnswered(null);
                      setQuizIndex((prev) => (prev + 1) % beginnerQuestions.length);
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Sonraki Soruya Geç
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
