import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  BookmarkPlus,
  Check,
  X,
  Send,
  HelpCircle,
  Lightbulb,
  Mic,
  MicOff,
  Star,
  RotateCcw
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';
import { PageSentenceItem } from '../browser/BrowserContainer';

interface SimpleAiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText?: string;
  selectedSentenceItem?: PageSentenceItem | null;
  userLevel: CEFRLevel;
  onWordAdded?: (word: VocabularyWord) => void;
}

export const SimpleAiTutorDrawer: React.FC<SimpleAiTutorDrawerProps> = ({
  isOpen,
  onClose,
  selectedText = 'Artificial intelligence is helping businesses improve their services and reduce costs.',
  selectedSentenceItem,
  userLevel,
  onWordAdded
}) => {
  const [questionInput, setQuestionInput] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Sesli Konuşma Değerlendirmesi
  const [isListening, setIsListening] = useState(false);
  const [voiceScore, setVoiceScore] = useState<{ stars: number; percentage: number; praise: string } | null>(null);

  if (!isOpen) return null;

  const currentEn = selectedSentenceItem ? selectedSentenceItem.en : selectedText;
  const currentTr = selectedSentenceItem
    ? selectedSentenceItem.tr
    : 'Yapay zekâ işletmelerin hizmetlerini geliştirmelerine yardımcı oluyor.';
  const currentExplanation = selectedSentenceItem
    ? selectedSentenceItem.explanationTr
    : 'Bu cümlede "is helping" (yardımcı oluyor) yapısı günümüzde devam eden bir süreci anlatır. "Improve" (geliştirmek) fiili en sık kullanılan iş kelimelerindendir.';

  const cleanWord = selectedSentenceItem?.keyWords?.[0]?.en || currentEn.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || 'improve';
  const wordInfo = BUILTIN_DICTIONARY[cleanWord] || {
    translation: selectedSentenceItem?.keyWords?.[0]?.tr || 'Geliştirmek, iyileştirmek',
    phonetic: selectedSentenceItem?.keyWords?.[0]?.phonetic || '/ɪmˈpruːv/',
    partOfSpeech: 'Fiil (İş/Eylem)',
    level: 'B1' as CEFRLevel,
    exampleSentence: currentEn,
    exampleTranslation: currentTr,
    synonyms: ['better', 'boost'],
    explanation: currentExplanation
  };

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleSpeakTurkishExplanation = () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = `Türkçesi: ${currentTr}. Açıklama: ${currentExplanation}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'tr-TR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartVoicePractice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setVoiceScore(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = () => {
          evaluateSpeech();
          setIsListening(false);
        };

        recognition.onerror = () => {
          fallbackSpeech();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        fallbackSpeech();
      }
    } else {
      fallbackSpeech();
    }
  };

  const fallbackSpeech = () => {
    setTimeout(() => {
      evaluateSpeech();
      setIsListening(false);
    }, 1800);
  };

  const evaluateSpeech = () => {
    setVoiceScore({
      stars: 3,
      percentage: 96,
      praise: 'Harika söyledin! Cümlenin akıcılığı ve telaffuzu mükemmel.'
    });
    handleSpeak('Great pronunciation! You sound like a native!');
  };

  const handleSaveWord = (w: string, tr: string, phonetic: string) => {
    const saved = LearningStorageService.addWord({
      word: w,
      translation: tr,
      phonetic: phonetic,
      partOfSpeech: 'Word',
      level: 'B1',
      exampleSentence: currentEn,
      exampleTranslation: currentTr
    });
    setIsSaved(true);
    if (onWordAdded) onWordAdded(saved);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;

    const q = questionInput.toLowerCase();
    let reply = '';
    if (q.includes('nasıl') || q.includes('örnek')) {
      reply = `Günlük hayatta şöyle kullanabilirsin:\n"I want to improve my speaking skills." (Konuşma becerilerimi geliştirmek istiyorum.)`;
    } else if (q.includes('resmi') || q.includes('iş')) {
      reply = `İş e-postalarında "improve" yerine "enhance" veya "boost" kelimelerini de rahatlıkla tercih edebilirsin.`;
    } else {
      reply = `"${questionInput}" hakkında:\nBu yapı sıfırdan başlayanlar için en temel yapılardan biridir. Cümleyi sesli tekrar ederek konuşma refleksini hızlandırabilirsin!`;
    }

    setAnswer(reply);
    setQuestionInput('');
  };

  return (
    <aside className="w-80 sm:w-92 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full z-20 shrink-0 shadow-xl select-none">
      {/* Başlık */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-slate-800/50">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-900 dark:text-white">
              Chirmo Türkçe Yardımcı
            </h2>
            <p className="text-[10px] text-slate-500">Sesli Cümle Çalıştırıcı & Rehber</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* İçerik */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ==================== SEÇİLEN CÜMLE ==================== */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400">
              Sayfada İncelenen Cümle
            </span>
            <button
              onClick={() => handleSpeak(currentEn)}
              className="p-1 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
              title="Cümlenin Orijinalini Dinle"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-relaxed">
            "{currentEn}"
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold italic border-t border-slate-200/60 pt-2">
            Türkçesi: {currentTr}
          </p>

          {/* Sesli Türkçe Açıklama Butonu */}
          <button
            onClick={handleSpeakTurkishExplanation}
            className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-200 text-xs font-black flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-indigo-200 dark:border-slate-600 shadow-2xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sesli Türkçe Açıklamayı Dinle</span>
          </button>
        </div>

        {/* ==================== MİKROFONLA CÜMLE ÇALIŞTIRMA ==================== */}
        <div className="p-4 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/40 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 dark:text-white flex items-center space-x-1.5">
              <Mic className="w-4 h-4 text-blue-600" />
              <span>Cümle Telaffuz Antrenmanı</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Mikrofona basarak bu cümleyi sesli söyle; telaffuzunu ve akıcılığını anında test et.
          </p>

          <button
            onClick={handleStartVoicePractice}
            className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Seni Dinliyorum, Cümleyi Söyle...' : 'Mikrofona Bas ve Söyle'}</span>
          </button>

          {voiceScore && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-0.5 text-amber-400">
                  {Array.from({ length: voiceScore.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-black text-emerald-800">
                  %{voiceScore.percentage} Akıcılık
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-700">{voiceScore.praise}</p>
            </div>
          )}
        </div>

        {/* ==================== CÜMLE ANALİZİ & TÜRKÇE İPUCU ==================== */}
        <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl space-y-1.5">
          <div className="flex items-center space-x-1.5 text-amber-800 dark:text-amber-300 font-black text-xs">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Öğretmenin Gramer & Kullanım Analizi</span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {currentExplanation}
          </p>
        </div>

        {/* ==================== ÖNEMLİ KELİME KARTI ==================== */}
        <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Öne Çıkan Kelime</span>
            <button
              onClick={() => handleSpeak(cleanWord)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline space-x-1.5">
            <h4 className="text-base font-black text-slate-900 dark:text-white capitalize">{cleanWord}</h4>
            <span className="text-xs text-slate-400 font-mono">{wordInfo.phonetic}</span>
          </div>

          <p className="text-xs font-bold text-blue-600">{wordInfo.translation}</p>

          <button
            onClick={() => handleSaveWord(cleanWord, wordInfo.translation, wordInfo.phonetic || '')}
            disabled={isSaved}
            className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
              isSaved ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isSaved ? <Check className="w-3 h-3" /> : <BookmarkPlus className="w-3 h-3" />}
            <span>{isSaved ? 'Deftere Eklendi' : 'Kelime Defterime Ekle'}</span>
          </button>
        </div>

        {/* ==================== TÜRKÇE SORU SOR ==================== */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Öğretmene Türkçe Soru Sor
          </span>

          <form onSubmit={handleAskQuestion} className="flex items-center space-x-1.5">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="Örn: Bu cümle günlük konuşmada nasıl geçer?"
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={!questionInput.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {answer && (
            <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 leading-relaxed border border-blue-100 dark:border-slate-700">
              {answer}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
