import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  Check,
  Star,
  RotateCcw,
  BookOpen,
  Headphones,
  Award,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Play,
  ArrowRight,
  Lightbulb,
  Compass
} from 'lucide-react';
import {
  DAILY_WORDS,
  EVERYDAY_SENTENCES,
  DAILY_DIALOGUES,
  DAILY_PATTERNS,
  SENTENCE_PUZZLES,
  GRAMMAR_BLUEPRINTS,
  DialogueItem,
  PatternItem,
  DailyLanguageData
} from '../../services/dailyEnglishData';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService } from '../../services/targetLanguageService';

export const DailyEnglishStudio: React.FC = () => {
  const targetLang = TargetLanguageService.getTargetLanguage();
  const currentDialogues = DailyLanguageData.getDialogues(targetLang);
  const currentSentences = DailyLanguageData.getEverydaySentences(targetLang);
  const currentPuzzles = DailyLanguageData.getSentencePuzzles(targetLang);

  // Aktif Alt Araç: 'dialogues' | 'puzzles' | 'listening' | 'patterns' | 'grammar'
  const [activeTool, setActiveTool] = useState<'dialogues' | 'puzzles' | 'listening' | 'patterns' | 'grammar'>('dialogues');

  // ==================== 1. DİYALOG & ROL YAPMA STATE ====================
  const [selectedDialogueIndex, setSelectedDialogueIndex] = useState(0);
  const [showDialogueTr, setShowDialogueTr] = useState(true);
  const [isRoleplayMode, setIsRoleplayMode] = useState(false);
  const [spokenRoleLines, setSpokenRoleLines] = useState<Record<string, boolean>>({});
  const [roleplayMicId, setRoleplayMicId] = useState<string | null>(null);

  // ==================== 2. CÜMLE KURMA BULMACASI STATE ====================
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle = currentPuzzles[puzzleIndex % currentPuzzles.length] || currentPuzzles[0];
  const puzzleTargetWords = currentPuzzle.en.split(' ');
  const [selectedWords, setSelectedWords] = useState<Array<{ word: string; index: number }>>([]);
  const [shuffledPool, setShuffledPool] = useState<Array<{ word: string; index: number }>>(() => {
    return currentPuzzle.en.split(' ').map((w, i) => ({ word: w, index: i })).sort(() => Math.random() - 0.5);
  });
  const [puzzleScore, setPuzzleScore] = useState(0);

  // ==================== 3. DİNLE & ANLA STATE ====================
  const [listenRound, setListenRound] = useState(0);
  const [listenCorrectCount, setListenCorrectCount] = useState(0);
  const [listenTotalCount, setListenTotalCount] = useState(0);
  const [listenAnswered, setListenAnswered] = useState<number | null>(null);

  // 3 Dinleme seçeneği oluştur
  const currentListenTarget = currentSentences[listenRound % currentSentences.length] || currentSentences[0];
  const [listenOptions, setListenOptions] = useState<string[]>(() => generateListenOptions(listenRound));

  function generateListenOptions(round: number) {
    const target = currentSentences[round % currentSentences.length] || currentSentences[0];
    const opts = [target.tr];
    while (opts.length < Math.min(3, currentSentences.length)) {
      const rand = currentSentences[Math.floor(Math.random() * currentSentences.length)].tr;
      if (!opts.includes(rand)) opts.push(rand);
    }
    return opts.sort(() => Math.random() - 0.5);
  }

  // ==================== SES İŞLEMLERİ ====================
  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handlePlayEntireDialogue = (dialogue: DialogueItem) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        dialogue.lines.forEach((line, i) => {
          const u = new SpeechSynthesisUtterance(line.en);
          u.lang = 'en-US';
          u.rate = 0.9;
          u.pitch = line.speaker === 'A' ? 1.0 : 1.15;
          window.speechSynthesis.speak(u);
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Rol yapma mikrofon simülasyonu
  const handleRoleMic = (lineId: string, expectedLineEn: string) => {
    setRoleplayMicId(lineId);
    setTimeout(() => {
      setSpokenRoleLines((prev) => ({ ...prev, [lineId]: true }));
      setRoleplayMicId(null);
      handleSpeak(expectedLineEn);
    }, 1500);
  };

  // Cümle Kurma - Kelime Seçimi
  const handleSelectWord = (item: { word: string; index: number }) => {
    setSelectedWords((prev) => [...prev, item]);
  };

  const handleUndoWord = () => {
    setSelectedWords((prev) => prev.slice(0, -1));
  };

  const handleNextPuzzle = () => {
    const nextIdx = (puzzleIndex + 1) % SENTENCE_PUZZLES.length;
    setPuzzleIndex(nextIdx);
    const nextPuzzle = SENTENCE_PUZZLES[nextIdx];
    setSelectedWords([]);
    setShuffledPool(nextPuzzle.en.split(' ').map((w, i) => ({ word: w, index: i })).sort(() => Math.random() - 0.5));
  };

  const isPuzzleComplete = selectedWords.length === puzzleTargetWords.length;
  const isPuzzleCorrect = isPuzzleComplete && selectedWords.map((w) => w.word).join(' ') === currentPuzzle.en;

  // Dinleme Testi - Cevap Verme
  const handleSelectListenAnswer = (opt: string, optIndex: number) => {
    if (listenAnswered !== null) return;
    setListenAnswered(optIndex);
    setListenTotalCount((prev) => prev + 1);
    if (opt === currentListenTarget.tr) {
      setListenCorrectCount((prev) => prev + 1);
    }
  };

  const handleNextListenRound = () => {
    const nextR = listenRound + 1;
    setListenRound(nextR);
    setListenAnswered(null);
    setListenOptions(generateListenOptions(nextR));
    handleSpeak(currentSentences[nextR % currentSentences.length].en);
  };

  const currentDialogue = currentDialogues[selectedDialogueIndex] || currentDialogues[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden select-none">
      {/* Üst Sekmeler */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Chirmo Günlük {targetLang === 'de' ? 'Almanca 🇩🇪' : targetLang === 'fr' ? 'Fransızca 🇫🇷' : 'İngilizce 🇬🇧'} & Pratik Stüdyosu</span>
            </span>
          </div>

          {/* 4 Ana Çalışma Modülü */}
          <div className="flex items-center space-x-1.5 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTool('dialogues')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTool === 'dialogues'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🗣️</span>
              <span>Diyalog & Rol Yapma ({currentDialogues.length})</span>
            </button>

            <button
              onClick={() => setActiveTool('puzzles')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTool === 'puzzles'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🧩</span>
              <span>Cümle Kurma Oyunu</span>
            </button>

            <button
              onClick={() => {
                setActiveTool('listening');
                handleSpeak(currentListenTarget.en);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTool === 'listening'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👂</span>
              <span>Kulak Antrenmanı</span>
            </button>

            <button
              onClick={() => setActiveTool('patterns')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTool === 'patterns'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📘</span>
              <span>Sihirli Kalıp Bankası</span>
            </button>

            <button
              onClick={() => setActiveTool('grammar')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTool === 'grammar'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⚡</span>
              <span>7 Adımda Cümle Mantığı</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ana Çalışma Alanı */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          {/* ==================== 1. MODÜL: DİYALOG VE ROL YAPMA ==================== */}
          {activeTool === 'dialogues' && (
            <div className="space-y-4">
              {/* Diyalog Seçici Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {currentDialogues.map((d, i) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDialogueIndex(i);
                      setSpokenRoleLines({});
                    }}
                    className={`px-3 py-1.5 rounded-2xl font-black transition-all cursor-pointer shrink-0 ${
                      selectedDialogueIndex === i
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {d.title}
                  </button>
                ))}
              </div>

              {/* Diyalog Başlık Kartı ve Ayarlar */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {currentDialogue.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Konuşma balonlarına tıklayarak tek tek dinleyebilir ya da "Rol Yap" modunda B kişisinin cümlelerini sen söyleyebilirsin!
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handlePlayEntireDialogue(currentDialogue)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Baştan Sona Dinle</span>
                  </button>

                  <button
                    onClick={() => setIsRoleplayMode(!isRoleplayMode)}
                    className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
                      isRoleplayMode
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>🎭</span>
                    <span>{isRoleplayMode ? 'Rol Yapma Açık' : 'Rol Yap (Sen Konuş)'}</span>
                  </button>
                </div>
              </div>

              {/* Diyalog Baloncukları */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                {currentDialogue.lines.map((line, idx) => {
                  const isPersonB = line.speaker === 'B';
                  const isRoleActive = isRoleplayMode && isPersonB;
                  const isSpoken = spokenRoleLines[`${currentDialogue.id}-${idx}`];
                  const isMicRecording = roleplayMicId === `${currentDialogue.id}-${idx}`;

                  return (
                    <div
                      key={idx}
                      className={`flex ${isPersonB ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        onClick={() => !isRoleActive && handleSpeak(line.en)}
                        className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl cursor-pointer transition-all ${
                          isPersonB
                            ? isRoleActive && !isSpoken
                              ? 'bg-purple-50 dark:bg-purple-950/40 border-2 border-dashed border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200'
                              : 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isRoleActive && !isSpoken ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-black text-purple-700 dark:text-purple-300">
                              <span>🎭 Sıra Sende (Sen Söyle):</span>
                              <span className="text-[10px] bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded-full">
                                B Kişisi
                              </span>
                            </div>
                            <p className="text-sm font-bold italic">
                              "{line.tr}"
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRoleMic(`${currentDialogue.id}-${idx}`, line.en);
                              }}
                              className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                                isMicRecording
                                  ? 'bg-rose-600 text-white animate-pulse'
                                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                              }`}
                            >
                              {isMicRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                              <span>{isMicRecording ? 'Dinleniyor...' : 'Mikrofona Bas ve Söyle'}</span>
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm sm:text-base font-extrabold leading-snug">
                                {line.en}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeak(line.en);
                                }}
                                className={`p-1 rounded-lg shrink-0 ${
                                  isPersonB ? 'text-blue-200 hover:text-white' : 'text-slate-400 hover:text-blue-600'
                                }`}
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {showDialogueTr && (
                              <p className={`text-xs mt-1 italic ${isPersonB ? 'text-blue-100' : 'text-slate-500'}`}>
                                {line.tr}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== 2. MODÜL: CÜMLE KURMA OYUNU ==================== */}
          {activeTool === 'puzzles' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                      🧩 Cümleyi Sen Kur • Soru {puzzleIndex + 1} / {SENTENCE_PUZZLES.length}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      Türkçesi: "{currentPuzzle.tr}"
                    </h3>
                  </div>

                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    ⭐ {puzzleScore} Puan
                  </span>
                </div>

                {/* Dizilen Cümle Alanı */}
                <div className={`min-h-[64px] p-4 rounded-2xl border-2 transition-all flex items-center flex-wrap gap-2 ${
                  isPuzzleComplete
                    ? isPuzzleCorrect
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                      : 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30'
                    : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}>
                  {selectedWords.length === 0 ? (
                    <span className="text-xs text-slate-400 font-medium">
                      Aşağıdaki kelimelere sırayla dokunarak İngilizce cümleyi oluştur...
                    </span>
                  ) : (
                    selectedWords.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-xs animate-in zoom-in-95"
                      >
                        {item.word}
                      </span>
                    ))
                  )}
                </div>

                {/* Sonuç ve Butonlar */}
                {isPuzzleComplete && (
                  <div className="p-3 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
                    {isPuzzleCorrect ? (
                      <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 font-black">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Mükemmel! Cümleyi doğru sırayla kurdun (+20 XP)</span>
                        <button
                          onClick={() => handleSpeak(currentPuzzle.en)}
                          className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-300 font-bold">
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span>Sıra hatalı oldu. "Geri Al" butonuna basarak tekrar dene.</span>
                      </div>
                    )}

                    {isPuzzleCorrect ? (
                      <button
                        onClick={() => {
                          setPuzzleScore((prev) => prev + 20);
                          handleNextPuzzle();
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-sm"
                      >
                        Sonraki Cümleye Geç
                      </button>
                    ) : (
                      <button
                        onClick={handleUndoWord}
                        className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                      >
                        Geri Al
                      </button>
                    )}
                  </div>
                )}

                {/* Kelime Havuzu */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center flex-wrap gap-2">
                  {shuffledPool.map((item) => {
                    const isAlreadySelected = selectedWords.some((w) => w.index === item.index);
                    return (
                      <button
                        key={item.index}
                        disabled={isAlreadySelected}
                        onClick={() => handleSelectWord(item)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          isAlreadySelected
                            ? 'opacity-30 bg-slate-100 dark:bg-slate-800 text-slate-400'
                            : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-blue-500 shadow-2xs'
                        }`}
                      >
                        {item.word}
                      </button>
                    );
                  })}

                  {selectedWords.length > 0 && !isPuzzleCorrect && (
                    <button
                      onClick={handleUndoWord}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Sonuncuyu Geri Al
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 3. MODÜL: DİNLE & ANLA (KULAK ANTRENMANI) ==================== */}
          {activeTool === 'listening' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Kulak Antrenmanı</span>
                  <span className="text-blue-600 font-black">
                    Doğru: {listenCorrectCount} / {listenTotalCount}
                  </span>
                </div>

                {/* Büyük Dinleme Butonu */}
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <button
                    onClick={() => handleSpeak(currentListenTarget.en)}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:scale-105 transition-all text-white flex items-center justify-center shadow-lg shadow-blue-500/25 cursor-pointer"
                  >
                    <Volume2 className="w-10 h-10" />
                  </button>
                  <p className="text-xs text-slate-500 font-semibold">
                    Cümleyi dinle, ardından doğru Türkçe anlamını seç 👆
                  </p>
                </div>

                {/* Seçenekler */}
                <div className="space-y-2">
                  {listenOptions.map((opt, i) => {
                    const isSelected = listenAnswered === i;
                    const isCorrect = opt === currentListenTarget.tr;

                    let btnClass = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';
                    if (listenAnswered !== null) {
                      if (isCorrect) btnClass = 'bg-emerald-600 text-white font-bold border-emerald-600';
                      else if (isSelected) btnClass = 'bg-rose-500 text-white font-bold border-rose-500';
                      else btnClass = 'opacity-40 bg-slate-100 text-slate-500';
                    }

                    return (
                      <button
                        key={opt}
                        disabled={listenAnswered !== null}
                        onClick={() => handleSelectListenAnswer(opt, i)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {listenAnswered !== null && isCorrect && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>

                {/* Devam Butonu */}
                {listenAnswered !== null && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Orijinal Cümle: <span className="text-blue-600">"{currentListenTarget.en}"</span>
                    </p>
                    <button
                      onClick={handleNextListenRound}
                      className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                    >
                      Sonraki Cümleyi Dinle
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== 4. MODÜL: SİHİRLİ KALIP BANKASI ==================== */}
          {activeTool === 'patterns' && (
            <div className="space-y-4">
              <div className="px-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  En Çok İşe Yarayan 30 Konuşma Kalıbı
                </h3>
                <p className="text-xs text-slate-500">
                  Boşluğu istediğin kelimeyle doldur; her ortamda kendini ifade et.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DAILY_PATTERNS.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-blue-600 dark:text-blue-400">
                          {pattern.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          Kalıp
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{pattern.desc}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {pattern.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs flex items-center justify-between"
                        >
                          <div>
                            <div className="font-extrabold text-slate-800 dark:text-slate-100">
                              "{ex.en}"
                            </div>
                            <div className="text-[11px] text-slate-500 italic">{ex.tr}</div>
                          </div>
                          <button
                            onClick={() => handleSpeak(ex.en)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg shrink-0 cursor-pointer"
                            title="Dinle"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 5. MODÜL: 7 ADIMDA CÜMLE MANTIĞI ==================== */}
          {activeTool === 'grammar' && (
            <div className="space-y-4">
              <div className="px-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  7 Adımda Cümle Kurma Mantığı
                </h3>
                <p className="text-xs text-slate-500">
                  Gramer ezberletmek için değil, Türkçe ile İngilizce arasındaki farkı anlaman için 7 basit kural.
                </p>
              </div>

              <div className="space-y-4">
                {GRAMMAR_BLUEPRINTS.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                        ⚡
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {rule.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {rule.desc}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      {rule.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs flex flex-col justify-between"
                        >
                          <div className="font-extrabold text-slate-800 dark:text-white">
                            "{ex.en}"
                          </div>
                          <div className="text-[11px] text-slate-500 italic mt-1">{ex.tr}</div>
                          <button
                            onClick={() => handleSpeak(ex.en)}
                            className="mt-2 text-blue-600 text-[11px] font-bold flex items-center space-x-1 hover:underline"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Dinle</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
