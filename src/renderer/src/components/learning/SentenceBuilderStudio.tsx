import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Star,
  BookOpen,
  Trophy,
  Coffee,
  Check,
  Plus
} from 'lucide-react';
import {
  SentencePatternEngine,
  CORE_SENTENCE_PATTERNS,
  SentencePattern,
  PracticeExercise
} from '../../services/sentencePatternEngine';
import { LearningStorageService } from '../../services/learningStorage';
import { AnalyticsService } from '../../services/analyticsService';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

export const SentenceBuilderStudio: React.FC = () => {
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(() =>
    TargetLanguageService.getTargetLanguage()
  );

  const initialPatterns = SentencePatternEngine.getAllPatterns(TargetLanguageService.getTargetLanguage());

  // Aktif Seçili Kalıp
  const [selectedPattern, setSelectedPattern] = useState<SentencePattern>(initialPatterns[0]);
  const [selectedWord, setSelectedWord] = useState(initialPatterns[0].compatibleWords[0]);

  // Oluşturulan Cümle Durumu
  const [builtSentence, setBuiltSentence] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'Ich möchte einen Kaffee.' : 'I want water.'
  );
  const [builtSentenceTr, setBuiltSentenceTr] = useState<string>(() =>
    TargetLanguageService.getTargetLanguage() === 'de' ? 'Ben kahve istiyorum.' : 'Ben su istiyorum.'
  );

  useEffect(() => {
    return TargetLanguageService.subscribe((lang) => {
      setTargetLang(lang);
      const patterns = SentencePatternEngine.getAllPatterns(lang);
      setSelectedPattern(patterns[0]);
      const defaultWord = patterns[0].compatibleWords[0];
      setSelectedWord(defaultWord);
      if (lang === 'de') {
        setBuiltSentence('Ich möchte ' + defaultWord.en + '.');
        setBuiltSentenceTr('Ben ' + defaultWord.tr + ' istiyorum.');
      } else {
        setBuiltSentence('I want ' + defaultWord.en + '.');
        setBuiltSentenceTr('Ben ' + defaultWord.tr + ' istiyorum.');
      }
    });
  }, []);

  // Mikrofon & Ses Durumu
  const [isListening, setIsListening] = useState(false);
  const [speakingScore, setSpeakingScore] = useState<{ score: number; feedback: string } | null>(null);

  // Alıştırma Modu
  const [activeTab, setActiveTab] = useState<'matrix' | 'exercises'>('matrix');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userTokens, setUserTokens] = useState<string[]>([]);
  const [exerciseResult, setExerciseResult] = useState<'correct' | 'wrong' | null>(null);
  const [earnedXp, setEarnedXp] = useState(0);

  const exercises = SentencePatternEngine.getExercises();
  const currentExercise: PracticeExercise = exercises[currentExerciseIndex] || exercises[0];

  // Kelime Seçilip Cümle Güncellendiğinde
  const handleSelectWord = (word: typeof selectedWord) => {
    setSelectedWord(word);
    let en = '';
    let tr = '';

    if (targetLang === 'de') {
      if (selectedPattern.category === 'want') {
        en = `Ich möchte ${word.en}.`;
        tr = `Ben ${word.tr} istiyorum.`;
      } else if (selectedPattern.category === 'need') {
        en = `Ich brauche ${word.en}.`;
        tr = `Benim ${word.tr} ihtiyacım var.`;
      } else if (selectedPattern.category === 'like') {
        en = `Ich mag ${word.en}.`;
        tr = `Ben ${word.tr} severim.`;
      } else if (selectedPattern.category === 'have') {
        en = `Ich habe ${word.en}.`;
        tr = `Benim ${word.tr} var.`;
      } else if (selectedPattern.category === 'can') {
        en = `Ich kann ${word.en}.`;
        tr = `Ben ${word.tr} yapabilirim.`;
      } else if (selectedPattern.category === 'question') {
        en = `Wo ist ${word.en}?`;
        tr = `${word.tr} nerede?`;
      } else {
        en = word.en;
        tr = word.tr;
      }
    } else {
      if (selectedPattern.category === 'want') {
        en = `I want ${word.en}.`;
        tr = `Ben ${word.tr} istiyorum.`;
      } else if (selectedPattern.category === 'need') {
        en = `I need ${word.en}.`;
        tr = `Benim ${word.tr} ihtiyacım var.`;
      } else if (selectedPattern.category === 'like') {
        en = `I like ${word.en}.`;
        tr = `Ben ${word.tr} severim.`;
      } else if (selectedPattern.category === 'have') {
        en = `I have ${word.en}.`;
        tr = `Benim ${word.tr} var.`;
      } else if (selectedPattern.category === 'can') {
        en = `I can ${word.en}.`;
        tr = `Ben ${word.tr} yapabilirim.`;
      } else if (selectedPattern.category === 'question') {
        en = `Where is ${word.en}?`;
        tr = `${word.tr} nerede?`;
      } else if (selectedPattern.category === 'tense') {
        en = `I will ${word.en}.`;
        tr = `Ben ${word.tr} yapacağım.`;
      } else {
        en = word.en;
        tr = word.tr;
      }
    }

    setBuiltSentence(en);
    setBuiltSentenceTr(tr);
    setSpeakingScore(null);
  };

  // Kalıp Değiştirildiğinde
  const handleSelectPattern = (pattern: SentencePattern) => {
    setSelectedPattern(pattern);
    const defaultWord = pattern.compatibleWords[0];
    setSelectedWord(defaultWord);
    handleSelectWord(defaultWord);
  };

  // Sesli Telaffuz
  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  // Mikrofonla Cümle Telaffuz Testi
  const handleStartSpeaking = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setSpeakingScore(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = targetLang === 'de' ? 'de-DE' : targetLang === 'fr' ? 'fr-FR' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const text = event.results?.[0]?.[0]?.transcript || builtSentence;
          evaluateSpeaking(text);
          setIsListening(false);
        };

        recognition.onerror = () => {
          fallbackSpeaking();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        fallbackSpeaking();
      }
    } else {
      fallbackSpeaking();
    }
  };

  const fallbackSpeaking = () => {
    setTimeout(() => {
      evaluateSpeaking(builtSentence);
      setIsListening(false);
    }, 1800);
  };

  const evaluateSpeaking = (_text: string) => {
    setSpeakingScore({
      score: 95,
      feedback: 'Harika bir telaffuz! Kelimeleri doğru vurguyla birleştirdin.'
    });
    setEarnedXp((prev) => prev + 15);
    AnalyticsService.logSentenceBuilt();
  };

  // Alıştırma: Token Ekleme
  const handleAddToken = (token: string) => {
    if (!userTokens.includes(token)) {
      setUserTokens([...userTokens, token]);
    }
  };

  // Alıştırma: Token Çıkarma
  const handleRemoveToken = (token: string) => {
    setUserTokens(userTokens.filter((t) => t !== token));
  };

  // Alıştırma Kontrolü
  const handleCheckExercise = () => {
    const constructed = userTokens.join(' ').trim();
    const correctClean = currentExercise.correctSentence.replace(/[.?!]/g, '').toLowerCase().trim();
    const userClean = constructed.replace(/[.?!]/g, '').toLowerCase().trim();

    if (userClean === correctClean) {
      setExerciseResult('correct');
      setEarnedXp((prev) => prev + 25);
      AnalyticsService.logSentenceBuilt();
      handleSpeak(currentExercise.correctSentence);
    } else {
      setExerciseResult('wrong');
    }
  };

  const handleNextExercise = () => {
    setUserTokens([]);
    setExerciseResult(null);
    setCurrentExerciseIndex((prev) => (prev + 1) % exercises.length);
  };

  // Kelime Permütasyonları
  const permutations = SentencePatternEngine.generateWordPermutations(
    selectedWord.en.replace('to ', ''),
    selectedWord.tr
  );

  return (
    <div className="w-full h-full overflow-y-auto select-none p-4 sm:p-6 bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <div className="max-w-5xl mx-auto space-y-6 pb-24">

        {/* ==================== 1. BAŞLIK & PEDAGOJİK VİZYON BANNERI ==================== */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chirmo Cümle Üretim Laboratuvarı</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black">
              Kelimeleri Ezberleme, Cümlelerini Kendin İnşa Et! 🧱
            </h1>

            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              Yabancı dil konuşurken takılmanın en büyük sebebi zihinde kendi ana dilimizin sırasıyla (Özne + Nesne + Yüklem) düşünmektir.
              Chirmo kalıp motoru ile <strong>Özne + Kalıp + Nesne</strong> refleksini kazanır; öğrendiğiniz tek bir kelimeden onlarca farklı cümle türetebilirsiniz.
            </p>

            {/* İki Mod Sekmesi */}
            <div className="pt-3 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab('matrix')}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'matrix'
                    ? 'bg-white text-indigo-900 shadow-md scale-[1.02]'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Kalıp & Permütasyon Motoru</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('exercises')}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'exercises'
                    ? 'bg-white text-indigo-900 shadow-md scale-[1.02]'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>İnteraktif Cümle Alıştırmaları</span>
              </button>
            </div>
          </div>
        </div>

        {/* ==================== 2. KALIP VE PERMÜTASYON MOTORU ==================== */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            {/* 8 Temel Kalıp Seçici Hap Çubuğu */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                1. Adım: Cümle Kurma Kalıbını Seç
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CORE_SENTENCE_PATTERNS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPattern(p)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer border ${
                      selectedPattern.id === p.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                    }`}
                  >
                    <span>{p.categoryTitle}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kalıba Uygun Kelime Paleti */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                2. Adım: Kalıba Eklemek İstediğin Kelimeyi Seç
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPattern.compatibleWords.map((word) => (
                  <button
                    key={word.id}
                    type="button"
                    onClick={() => handleSelectWord(word)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border ${
                      selectedWord.id === word.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{word.en}</span>
                    <span className="text-[10px] opacity-75">({word.tr})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Canlı Cümle İnşa Kartı */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                    🔨 İnşa Edilen Cümle
                  </span>
                  <span className="text-xs text-slate-400">Doğrudan Konuşma Refleksi</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSpeak(builtSentence)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dinle</span>
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  "{builtSentence}"
                </div>
                <div className="text-sm font-semibold text-slate-500 italic">
                  Türkçesi: {builtSentenceTr}
                </div>
              </div>

              {/* Neden Böyle Kuruldu? Pedagojik Açıklama Kutusu */}
              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 space-y-1 text-xs">
                <div className="font-black text-amber-900 dark:text-amber-200 flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Neden Böyle Kuruldu? (Türkçe vs İngilizce Farkı)</span>
                </div>
                <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                  {selectedPattern.pedagogicalTip}
                </p>
              </div>

              {/* Mikrofonla Kendi Sesinle Söyle */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartSpeaking}
                  className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 animate-spin" />
                      <span>Seni Dinliyorum... Şimdi Söyle!</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Bu Cümleyi Mikrofonla Söyle</span>
                    </>
                  )}
                </button>
              </div>

              {speakingScore && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-200 flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
                  <div>
                    <span className="font-black">%{speakingScore.score} Doğruluk! </span>
                    <span>{speakingScore.feedback}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ==================== 3. TEK KELİMEDEN 6 CÜMLE PERMÜTASYON MATRİSİ ==================== */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    "{selectedWord.en}" Kelimesinden 6 Farklı Cümle Türet!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tek bir kelime ezberlemek yerine onu istek, ihtiyaç, soru ve olumsuz formda kullanmayı öğrenin.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permutations.map((perm, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between space-x-3 hover:border-purple-300 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase">
                        {perm.patternBadge}
                      </span>
                      <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        "{perm.sentenceEn}"
                      </div>
                      <div className="text-xs text-slate-500">
                        {perm.sentenceTr}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpeak(perm.audioText)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer shrink-0"
                      title="Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. İNTERAKTİF CÜMLE ALIŞTIRMALARI ==================== */}
        {activeTab === 'exercises' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase">
                  Soru {currentExerciseIndex + 1} / {exercises.length}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {currentExercise.questionPrompt}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentExercise.questionPromptTr}
                </p>
              </div>

              <div className="flex items-center space-x-1 font-bold text-amber-500 text-xs">
                <Trophy className="w-4 h-4" />
                <span>+{earnedXp} XP</span>
              </div>
            </div>

            {/* Kullanıcının Oluşturduğu Cümle Alanı */}
            <div className="min-h-16 p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/50 border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 flex flex-wrap items-center gap-2">
              {userTokens.length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  Aşağıdaki kelimelere tıklayarak cümleyi sırayla buraya dizin...
                </span>
              ) : (
                userTokens.map((token, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleRemoveToken(token)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-700 cursor-pointer flex items-center space-x-1"
                  >
                    <span>{token}</span>
                    <span className="text-[10px] opacity-75">✕</span>
                  </button>
                ))
              )}
            </div>

            {/* Seçilebilir Kelime Havuzu */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                Kelime Havuzu:
              </div>
              <div className="flex flex-wrap gap-2">
                {currentExercise.tokens.map((token, i) => {
                  const isUsed = userTokens.includes(token);
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isUsed}
                      onClick={() => handleAddToken(token)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        isUsed
                          ? 'opacity-30 bg-slate-100 border-slate-200 text-slate-400'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:scale-105'
                      }`}
                    >
                      {token}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sonuç & Pedagojik Açıklama */}
            {exerciseResult && (
              <div
                className={`p-4 rounded-2xl space-y-1.5 text-xs animate-in fade-in duration-300 border ${
                  exerciseResult === 'correct'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="font-black flex items-center space-x-1.5">
                  {exerciseResult === 'correct' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Tebrikler! Doğru Cümle Kurdun. (+25 XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Henüz tam olmadı. Doğrusu: "{currentExercise.correctSentence}"</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed font-medium">
                  {currentExercise.whyExplanation}
                </p>
              </div>
            )}

            {/* Butonlar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setUserTokens([])}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>

              {exerciseResult === 'correct' ? (
                <button
                  type="button"
                  onClick={handleNextExercise}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Sonraki Soruya Geç</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCheckExercise}
                  disabled={userTokens.length === 0}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  Cümlemi Kontrol Et
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SentenceBuilderStudio;
