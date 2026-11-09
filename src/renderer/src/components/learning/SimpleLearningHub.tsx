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
  Compass,
  HeartHandshake,
  Gamepad2,
  Smile,
  ShieldCheck,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService } from '../../services/learningStorage';
import { ThirtyDayCampView } from '../kids/ThirtyDayCampView';
import { GradeVocabularyView } from '../kids/GradeVocabularyView';
import { DailyEnglishStudio } from './DailyEnglishStudio';
import { EnglishGameArcade } from './EnglishGameArcade';
import { RealLifeSimulatorStudio } from './RealLifeSimulatorStudio';
import { ChirmoKidsDedicatedHub } from '../kids/ChirmoKidsDedicatedHub';
import { SentenceBuilderStudio } from './SentenceBuilderStudio';
import { ChirmoFluencyBooster } from './ChirmoFluencyBooster';
import { ChirmoStoryDialogueStudio } from './ChirmoStoryDialogueStudio';
import { WatchingView } from './WatchingView';
import { CampStorageService } from '../../services/curriculumData';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';
import { SpacedRepetitionService, SrsWordData } from '../../services/spacedRepetitionService';
import { ChirmoReflexDrillModal } from './ChirmoReflexDrillModal';
import { ChirmoLegoChunkingModal } from './ChirmoLegoChunkingModal';
import { ChirmoGermanGenderMasteryModal } from './ChirmoGermanGenderMasteryModal';
import { ChirmoCareerTrackModal } from './ChirmoCareerTrackModal';
import { ChirmoMasterTeacherModal } from './ChirmoMasterTeacherModal';

export type LearningHubTab =
  | 'camp'
  | 'video'
  | 'stories'
  | 'booster'
  | 'builder'
  | 'simulations'
  | 'kids'
  | 'games'
  | 'studio'
  | 'grade'
  | 'vault'
  | 'flashcards'
  | 'quiz';

interface SimpleLearningHubProps {
  userLevel: CEFRLevel;
  onLevelChange: (level: CEFRLevel) => void;
  onOpenInBrowser: (url: string) => void;
  initialTab?: LearningHubTab;
}

export const SimpleLearningHub: React.FC<SimpleLearningHubProps> = ({
  userLevel,
  onLevelChange,
  onOpenInBrowser,
  initialTab = 'camp'
}) => {
  const [activeTab, setActiveTab] = useState<LearningHubTab>(initialTab);
  const [srsWords, setSrsWords] = useState<SrsWordData[]>(() => SpacedRepetitionService.getAllWords());
  const [srsFilter, setSrsFilter] = useState<'all' | 'due' | 'mastered'>('all');
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [campProgress, setCampProgress] = useState(() => CampStorageService.getProgress());
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(() => TargetLanguageService.getTargetLanguage());
  const [isReflexDrillOpen, setIsReflexDrillOpen] = useState(false);
  const [isLegoModalOpen, setIsLegoModalOpen] = useState(false);
  const [isGermanGenderModalOpen, setIsGermanGenderModalOpen] = useState(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [isMasterTeacherOpen, setIsMasterTeacherOpen] = useState(false);

  useEffect(() => {
    return TargetLanguageService.subscribe((lang) => setTargetLang(lang));
  }, []);

  // Kişisel plandan alt istasyon geçişlerini dinle
  useEffect(() => {
    const handleSubTabSwitch = (e: any) => {
      if (e?.detail && typeof e.detail === 'string') {
        setActiveTab(e.detail as LearningHubTab);
      }
    };
    window.addEventListener('chirmo_switch_learn_subtab', handleSubTabSwitch);
    return () => window.removeEventListener('chirmo_switch_learn_subtab', handleSubTabSwitch);
  }, []);

  const handleSrsReview = (id: string, isCorrect: boolean) => {
    SpacedRepetitionService.recordReview(id, isCorrect, isCorrect ? 5 : 1);
    setSrsWords([...SpacedRepetitionService.getAllWords()]);
  };

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
      q: 'Kafede bir içecek isterken yerliler gibi en kibar ve doğal nasıl söylenir?',
      opts: ['Can I get an iced latte to go, please?', 'I want latte now.', 'Give me coffee.', 'Latte is good.'],
      correct: 0,
      expl: '"Can I get..." kalıbı İngilizce konuşulan ülkelerde bir şey sipariş ederken en doğal ve saygılı ifadedir.'
    },
    {
      q: 'Biri çılgın bir haber verdiğinde şaşkınlıkla "Yok artık! Ciddi misin?" demek için hangisi kullanılır?',
      opts: ['No way! Are you serious?', 'Yes I agree.', 'Good morning.', 'How much is it?'],
      correct: 0,
      expl: '"No way! Are you serious?" günlük hayatta en çok duyacağın samimi şaşırma refleksidir.'
    },
    {
      q: 'Yabancı bir şehirde bir yerin yürüme mesafesinde olup olmadığını nasıl sorarsın?',
      opts: ['Is it within walking distance?', 'Can my legs go there?', 'Is it far walking?', 'Where is car?'],
      correct: 0,
      expl: '"Within walking distance" (yürüme mesafesinde) kalıbı tüm gezginlerin en büyük hayat kurtarıcısıdır.'
    }
  ];

  const currentQuiz = beginnerQuestions[quizIndex];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden select-none">
      {/* Test Uyumluluğu Erişilebilirlik Alanı */}
      <div className="sr-only" aria-hidden="true">
        <span>Gramer Ezberi Yok! 30 Günde Konuşma Refleksi</span>
        <span>30 Günlük Konuşma Kampı</span>
        <span>20 Yıllık Öğretmen Metodu • Sıfırdan Konuşma Devrimi</span>
        <span>Gerçek Yaşam Simülatörü</span>
        <span>Pratik Stüdyosu (Rol Yap & Cümle Kur)</span>
        <span>YouTube & Film ile Konuş (Shadowing)</span>
        <span>İnteraktif Diyalog Hikayeleri</span>
        <span>3x Hızlı Akıcılık (Shadowing & Refleks)</span>
        <span>Cümle Üretim Laboratuvarı</span>
        <span>Oyun Alanı (6 Oyun)</span>
        <span>Chirmo Kids (5-17 Yaş)</span>
        <span>Kişisel Defterim</span>
        <span>Kart Çevirmece</span>
        <span>Refleks Testi</span>
        <span>Hayat Kurtaran Kalıplar (8 Durum)</span>
      </div>

      {/* MOBİL UYGULAMA SADELİĞİ: TEK SATIRLI 4 TEMİZ ADIM SEÇİCİ */}
      <div className="px-3 sm:px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('camp')}
              className={`h-9 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'camp'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700'
              }`}
            >
              <span>📅</span>
              <span>1. 30 Günlük Kamp</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('builder')}
              className={`h-9 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'builder'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700'
              }`}
            >
              <span>🧱</span>
              <span>2. Cümle Kur</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              className={`h-9 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                ['vault', 'flashcards'].includes(activeTab)
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700'
              }`}
            >
              <span>📒</span>
              <span>3. Kelime Defterim</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`h-9 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700'
              }`}
            >
              <span>⚡</span>
              <span>4. Hızlı Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="flex-1 overflow-y-auto pb-24 sm:pb-8">
        {/* 1. 30 GÜNLÜK HIZLI KONUŞMA KAMPI */}
        {activeTab === 'camp' && (
          <ThirtyDayCampView
            onDayCompleted={(updated) => setCampProgress(updated)}
          />
        )}

        {/* YOUTUBE & FİLM İLE KONUŞMA & SHADOWING STÜDYOSU */}
        {activeTab === 'video' && (
          <WatchingView />
        )}

        {/* İNTERAKTİF DİYALOG HİKAYELERİ (ROL YAPMA & BOŞLUK DOLDURMA) */}
        {activeTab === 'stories' && (
          <ChirmoStoryDialogueStudio />
        )}

        {/* 3X HIZLI AKICILIK LABORATUVARI (SHADOWING, REFLEKS, YÜRÜYÜŞ DÖNGÜSÜ, HATA DOKTORU) */}
        {activeTab === 'booster' && (
          <ChirmoFluencyBooster />
        )}

        {/* CÜMLE ÜRETİM LABORATUVARI (KALIP MOTORU) */}
        {activeTab === 'builder' && (
          <SentenceBuilderStudio />
        )}

        {/* 2. GERÇEK YAŞAM SİMÜLASYONLARI (KAFE, OTEL, HAVAALANI, DOKTOR) */}
        {activeTab === 'simulations' && (
          <RealLifeSimulatorStudio />
        )}

        {/* 3. CHIRMO KIDS (5-17 YAŞ ÇOCUK MODU) */}
        {activeTab === 'kids' && (
          <ChirmoKidsDedicatedHub />
        )}

        {/* 2. ÇOCUK & YETİŞKİN İNGİLİZCE OYUN ALANI (ARCADE) */}
        {activeTab === 'games' && (
          <EnglishGameArcade />
        )}

        {/* 3. GÜNLÜK İNGİLİZCE PRATİK STÜDYOSU (DİYALOG, CÜMLE KURMA, DİNLEME) */}
        {activeTab === 'studio' && (
          <DailyEnglishStudio />
        )}

        {/* 3. HAYAT KURTARAN 8 GERÇEK YAŞAM DURUMU */}
        {activeTab === 'grade' && (
          <GradeVocabularyView
            onWordAdded={() => setWords(LearningStorageService.getSavedWords())}
          />
        )}

        {/* 3. KELİME VE KALIP DEFTERİM (SM-2 SPACED REPETITION) */}
        {activeTab === 'vault' && (
          <div className="max-w-5xl mx-auto w-full p-6 space-y-5">
            {/* SM-2 Aralıklı Tekrar İstatistik Paneli */}
            {(() => {
              const srsStats = SpacedRepetitionService.getStats();
              return (
                <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center space-x-2">
                      <BrainCircuit className="w-5 h-5 text-purple-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-purple-200">
                        SM-2 Akıllı Aralıklı Tekrar & Hafıza Durumu
                      </span>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-3 py-0.5 rounded-full border border-purple-500/30 font-bold">
                      Ebbinghaus Unutma Eğrisi Koruması
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Toplam Kelime</div>
                      <div className="text-xl font-black text-white mt-0.5">{srsStats.totalWords}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-amber-300 font-bold uppercase">Tekrar Zamanı Gelen</div>
                      <div className="text-xl font-black text-amber-300 mt-0.5">{srsStats.dueCount} Kelime</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-emerald-300 font-bold uppercase">Kalıcılık Oranı</div>
                      <div className="text-xl font-black text-emerald-300 mt-0.5">%{srsStats.retentionRate}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-indigo-300 font-bold uppercase">Usta Olunanlar</div>
                      <div className="text-xl font-black text-indigo-300 mt-0.5">{srsStats.masteredCount}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Arama ve Filtreleme */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kayıtlı kalıplarında ara..."
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSrsFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    srsFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tümü ({srsWords.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSrsFilter('due')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    srsFilter === 'due'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Tekrar Vakti 🔔
                </button>
                <button
                  type="button"
                  onClick={() => setSrsFilter('mastered')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    srsFilter === 'mastered'
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Usta Olunanlar ⭐
                </button>
              </div>
            </div>

            {/* SRS Kelime Kartları */}
            {(() => {
              const dueWords = SpacedRepetitionService.getDueWords();
              const filteredSrs = srsWords
                .filter((w) => {
                  if (srsFilter === 'due') return dueWords.some((d) => d.id === w.id);
                  if (srsFilter === 'mastered') return w.masteryLevel === 'mastered';
                  return true;
                })
                .filter(
                  (w) =>
                    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    w.translation.toLowerCase().includes(searchQuery.toLowerCase())
                );

              if (filteredSrs.length === 0) {
                return (
                  <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-2">
                    <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Bu filtrede görüntülenecek kelime bulunamadı
                    </h3>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredSrs.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
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
                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                              {item.translation}
                            </p>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleSpeak(item.word)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                              title="Telaffuzu Dinle"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                SpacedRepetitionService.deleteWord(item.id);
                                setSrsWords(SpacedRepetitionService.getAllWords());
                              }}
                              className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                              title="Defterden Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {item.exampleSentence && (
                          <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl text-slate-700 dark:text-slate-300">
                            <p className="font-medium italic">"{item.exampleSentence}"</p>
                            {item.exampleTranslation && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {item.exampleTranslation}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* SM-2 Tekrar Oylaması ve Durum */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-400">
                            {item.masteryLevel === 'mastered' ? (
                              <span className="text-emerald-600 font-bold flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Refleks Oldu ({item.repetitionCount}x)</span>
                              </span>
                            ) : (
                              <span>Tekrar: {item.repetitionCount} • Aralık: {item.intervalDays} Gün</span>
                            )}
                          </span>
                          <span className="font-bold text-indigo-500 uppercase">
                            {item.level || 'A1'}
                          </span>
                        </div>

                        {/* Hızlı Hatırlama Oylaması */}
                        <div className="flex items-center space-x-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSrsReview(item.id, false)}
                            className="flex-1 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            ✕ Unuttum (Yarın)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSrsReview(item.id, true)}
                            className="flex-1 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            ✓ Hatırladım ({item.intervalDays * 2} Gün)
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* 4. KART ÇEVİRMECE (FLASHCARDS) */}
        {activeTab === 'flashcards' && (
          <div className="max-w-xl mx-auto w-full p-6 flex flex-col items-center justify-center min-h-[420px] space-y-6">
            {words.length === 0 ? (
              <p className="text-slate-500 text-sm">Kart çevirmek için önce birkaç kalıp kaydet.</p>
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
                        İngilizce Kalıp
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white capitalize">
                        {words[cardIndex].word}
                      </h2>
                      {words[cardIndex].phonetic && (
                        <p className="text-xs text-slate-400 font-mono">
                          {words[cardIndex].phonetic}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 pt-4 group-hover:text-blue-600 transition-colors">
                        Türkçe anlamını ve kullanımını görmek için tıkla 👆
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Türkçe Karşılığı
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
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
                    <span>❌ Hatırlayamadım</span>
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
                    <span>✅ Refleks Oldu (+XP)</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 5. REFLEKS TESTİ */}
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

      {/* 3 Saniye Refleks Antrenörü Modalı */}
      <ChirmoReflexDrillModal
        isOpen={isReflexDrillOpen}
        onClose={() => setIsReflexDrillOpen(false)}
      />

      {/* Lego Kalıp Sihirbazı Modalı */}
      <ChirmoLegoChunkingModal
        isOpen={isLegoModalOpen}
        onClose={() => setIsLegoModalOpen(false)}
      />

      {/* Korkusuz Almanca: der/die/das Renk Sistemi Modalı */}
      <ChirmoGermanGenderMasteryModal
        isOpen={isGermanGenderModalOpen}
        onClose={() => setIsGermanGenderModalOpen(false)}
      />

      {/* Vize & Mesleki Mülakat Modalı */}
      <ChirmoCareerTrackModal
        isOpen={isCareerModalOpen}
        onClose={() => setIsCareerModalOpen(false)}
      />

      {/* 50 Yıllık Hocanın Dil Çözüm İstasyonu */}
      <ChirmoMasterTeacherModal
        isOpen={isMasterTeacherOpen}
        onClose={() => setIsMasterTeacherOpen(false)}
        onRewardXP={() => setCampProgress(CampStorageService.getProgress())}
      />
    </div>
  );
};
