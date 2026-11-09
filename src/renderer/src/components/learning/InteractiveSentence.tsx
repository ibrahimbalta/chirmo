import React, { useState } from 'react';
import { Volume2, BookmarkPlus, Check, BookOpen, Sparkles, X } from 'lucide-react';
import { ComprehensiveDictionaryService, ComprehensiveWordEntry } from '../../services/comprehensiveDictionary';
import { LearningStorageService } from '../../services/learningStorage';

interface InteractiveSentenceProps {
  sentence: string;
  translation?: string;
  language?: 'en' | 'de';
  showDictionaryBreakdown?: boolean;
  className?: string;
  sentenceClassName?: string;
}

export const InteractiveSentence: React.FC<InteractiveSentenceProps> = ({
  sentence,
  translation,
  language = 'en',
  showDictionaryBreakdown = true,
  className = '',
  sentenceClassName = ''
}) => {
  const [activeWordEntry, setActiveWordEntry] = useState<ComprehensiveWordEntry | null>(null);
  const [activeTokenIndex, setActiveTokenIndex] = useState<number | null>(null);
  const [savedWord, setSavedWord] = useState<string | null>(null);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(true);

  // Cümleyi kelime ve noktalama token'larına böl
  const tokens = React.useMemo(() => {
    if (!sentence) return [];
    // Kelimeleri ve aralarındaki boşluk/noktalamayı ayır
    return sentence.split(/(\s+|[“".,!?;:()]+)/).filter((t) => t.length > 0);
  }, [sentence]);

  // Cümle içindeki tüm kelimelerin sözlük analizi
  const wordEntries = React.useMemo(() => {
    return ComprehensiveDictionaryService.analyzeSentence(sentence, language);
  }, [sentence, language]);

  const handleWordClick = (token: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = token.trim().toLowerCase().replace(/[^a-zäöüß]/gi, '');
    if (!clean) return;

    const entry = ComprehensiveDictionaryService.lookup(clean, language);
    setActiveWordEntry(entry);
    setActiveTokenIndex(index);
    setSavedWord(null);
  };

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    LearningStorageService.speak(text);
  };

  const handleSaveWord = (entry: ComprehensiveWordEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      LearningStorageService.addWord({
        word: entry.word,
        translation: entry.translation,
        phonetic: entry.phonetic || `/${entry.word}/`,
        partOfSpeech: entry.partOfSpeech || 'Kelime',
        level: entry.level || 'A2',
        exampleSentence: sentence,
        exampleTranslation: translation || ''
      });
      setSavedWord(entry.word);
      setTimeout(() => setSavedWord(null), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div className={`space-y-2 select-text ${className}`} onClick={() => setActiveWordEntry(null)}>
      {/* 1. İNTERAKTİF CÜMLE ALANI */}
      <div className="relative">
        <div
          className={`text-sm sm:text-base font-black text-slate-900 dark:text-white leading-relaxed flex flex-wrap items-baseline gap-x-1 ${sentenceClassName}`}
        >
          {tokens.map((token, idx) => {
            const isWord = /[a-zA-ZäöüÄÖÜß]/.test(token);
            const isSelected = activeTokenIndex === idx;

            if (!isWord) {
              return (
                <span key={idx} className="text-slate-400 dark:text-slate-500 font-semibold select-none">
                  {token}
                </span>
              );
            }

            return (
              <span
                key={idx}
                onClick={(e) => handleWordClick(token, idx, e)}
                title="Türkçe anlamı ve telaffuz için tıkla / üzerine gel"
                className={`relative inline-block px-1 py-0.5 rounded-lg cursor-pointer transition-all duration-150 underline decoration-indigo-300 dark:decoration-indigo-700 decoration-dashed underline-offset-4 hover:decoration-solid hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black decoration-transparent shadow-xs scale-105'
                    : ''
                }`}
              >
                {token}
              </span>
            );
          })}
        </div>

        {/* Hover / Tıklama Popover Kartı (Türkçe Çeviri + Telaffuz) */}
        {activeWordEntry && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 -top-24 z-50 p-2.5 sm:p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 text-xs w-64 sm:w-72 space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-indigo-700 dark:text-indigo-400 capitalize text-sm">
                  {activeWordEntry.word}
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                  {activeWordEntry.level}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeWordEntry.phonetic}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveWordEntry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Türkçe Karşılığı:
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {activeWordEntry.translation}
              </p>
            </div>

            {activeWordEntry.tip && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 p-1 rounded-lg">
                💡 {activeWordEntry.tip}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={(e) => handleSpeak(activeWordEntry.word, e)}
                className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dinle</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleSaveWord(activeWordEntry, e)}
                className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
              >
                {savedWord === activeWordEntry.word ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Kaydedildi!</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3 h-3" />
                    <span>Sözlüğüme Ekle</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. TÜM CÜMLENİN TÜRKÇE ANLAMI */}
      {translation && (
        <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 italic flex items-center space-x-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 not-italic">Türkçesi:</span>
          <span>{translation}</span>
        </div>
      )}

      {/* 3. CÜMLENİN ALTINDAKİ KELİME SÖZLÜĞÜ (HER KELİMENİN ANLAMI) */}
      {showDictionaryBreakdown && wordEntries.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <button
              type="button"
              onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
              className="text-[11px] font-black text-indigo-700 dark:text-indigo-400 flex items-center space-x-1 cursor-pointer hover:underline"
            >
              <BookOpen className="w-3 h-3" />
              <span>Cümle İçi Kelime Sözlüğü ({wordEntries.length} kelime)</span>
            </button>
            <span className="text-[10px] text-slate-400 hidden xs:inline">
              Kelimeye veya 🔊 butonuna tıklayarak dinleyin
            </span>
          </div>

          {isBreakdownOpen && (
            <div className="flex flex-wrap gap-1.5 animate-in fade-in duration-200">
              {wordEntries.map((entry, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSpeak(entry.word)}
                  className="group px-2 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs hover:shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all active:scale-95 text-xs"
                  title={`${entry.word}: ${entry.translation} (Dinlemek için tıkla)`}
                >
                  <span className="font-black text-indigo-600 dark:text-indigo-400">
                    {entry.word}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                    {entry.translation}
                  </span>
                  <Volume2 className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 shrink-0 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
