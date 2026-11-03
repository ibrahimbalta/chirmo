import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  BookmarkPlus,
  Check,
  X,
  Send,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';

interface SimpleAiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText?: string;
  userLevel: CEFRLevel;
  onWordAdded?: (word: VocabularyWord) => void;
}

export const SimpleAiTutorDrawer: React.FC<SimpleAiTutorDrawerProps> = ({
  isOpen,
  onClose,
  selectedText = 'Artificial intelligence is helping businesses improve their services and reduce costs.',
  userLevel,
  onWordAdded
}) => {
  const [questionInput, setQuestionInput] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const cleanWord = selectedText.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || 'improve';
  const wordInfo = BUILTIN_DICTIONARY[cleanWord] || {
    translation: 'Geliştirmek, iyileştirmek',
    phonetic: '/ɪmˈpruːv/',
    partOfSpeech: 'Fiil (İş/Eylem)',
    level: 'B1' as CEFRLevel,
    exampleSentence: selectedText,
    exampleTranslation: 'Yapay zekâ işletmelerin hizmetlerini geliştirmelerine yardımcı oluyor.',
    synonyms: ['better', 'boost'],
    explanation: 'Bu kelimeyi bir şeyi daha iyi duruma getirmek için kullanırız. Günlük hayatta ve işte çok sık geçer.'
  };

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleSaveWord = () => {
    const saved = LearningStorageService.addWord({
      word: cleanWord,
      translation: wordInfo.translation,
      phonetic: wordInfo.phonetic,
      partOfSpeech: wordInfo.partOfSpeech,
      level: wordInfo.level,
      exampleSentence: wordInfo.exampleSentence,
      exampleTranslation: wordInfo.exampleTranslation
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
      reply = `Günlük hayatta şöyle kullanabilirsin:\n"I want to improve my speaking." (Konuşmamı geliştirmek istiyorum.)`;
    } else if (q.includes('resmi') || q.includes('iş')) {
      reply = `İş e-postalarında "improve" yerine "enhance" veya "upgrade" kelimelerini de rahatlıkla tercih edebilirsin.`;
    } else {
      reply = `"${questionInput}" hakkında:\nBu yapı sıfırdan başlayanlar için en temel fiillerden biridir. Sürekli pratik yaparak ve defterine kaydederek kalıcı kılabilirsin!`;
    }

    setAnswer(reply);
    setQuestionInput('');
  };

  return (
    <aside className="w-80 sm:w-88 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full z-20 shrink-0 shadow-xl select-none">
      {/* Başlık */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-slate-800/50">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
              Chirmo Türkçe Yardımcı
            </h2>
            <p className="text-[10px] text-slate-500">Sayfadaki kelime ve cümle rehberiniz</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* İçerik */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* İncelenen Cümle */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Sayfada Seçilen Metin
          </span>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic">
            "{selectedText}"
          </p>
          <button
            onClick={() => handleSpeak(selectedText)}
            className="text-[11px] text-blue-600 font-bold flex items-center space-x-1 pt-0.5 hover:underline"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Tüm Cümleyi Dinle</span>
          </button>
        </div>

        {/* Ana Kelime Kartı */}
        <div className="p-4 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/40 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white capitalize">
                  {cleanWord}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {wordInfo.phonetic}
                </span>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
                {wordInfo.translation}
              </span>
            </div>

            <button
              onClick={() => handleSpeak(cleanWord)}
              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              title="Okunuşunu Dinle"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2.5 bg-white/90 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/60 text-[11px] space-y-0.5">
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              "{wordInfo.exampleSentence}"
            </p>
            <p className="text-slate-500 italic">
              "{wordInfo.exampleTranslation}"
            </p>
          </div>

          <button
            onClick={handleSaveWord}
            disabled={isSaved}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 shadow-xs cursor-pointer ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Deftere Eklendi' : '+ Kelime Defterime Ekle'}</span>
          </button>
        </div>

        {/* Kolay Türkçe İpucu */}
        <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl space-y-1.5">
          <div className="flex items-center space-x-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Türkçe Öğrenme İpucu</span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
            {wordInfo.explanation}
          </p>
        </div>

        {/* Soru Sor Alanı */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Türkçe Yardım Al
          </span>

          <form onSubmit={handleAskQuestion} className="flex items-center space-x-1.5">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="Örn: Bu kelimeyle cümle kur..."
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
            <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 leading-relaxed animate-fade-in border border-blue-100 dark:border-slate-700">
              {answer}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
