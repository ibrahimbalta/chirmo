import React, { useState } from 'react';
import {
  Volume2,
  BookmarkPlus,
  Check,
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';

interface WordPopoverCardProps {
  word: string;
  onClose: () => void;
  onOpenInTutor: (word: string) => void;
  onWordSaved?: (word: VocabularyWord) => void;
}

export const WordPopoverCard: React.FC<WordPopoverCardProps> = ({
  word,
  onClose,
  onOpenInTutor,
  onWordSaved
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const cleanWord = word.trim().toLowerCase().replace(/[^a-z]/g, '');
  const info = LearningStorageService.lookup(cleanWord);

  const handleSpeak = () => {
    LearningStorageService.speak(word);
  };

  const handleSave = () => {
    const saved = LearningStorageService.addWord({
      word: cleanWord,
      translation: info.translation,
      phonetic: info.phonetic,
      partOfSpeech: info.partOfSpeech,
      level: info.level,
      exampleSentence: info.exampleSentence,
      exampleTranslation: info.exampleTranslation
    });
    setIsSaved(true);
    if (onWordSaved) onWordSaved(saved);
  };

  return (
    <div className="absolute z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-200 dark:border-slate-700 p-4 w-72 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-sm text-slate-900 dark:text-white capitalize">
              {cleanWord}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
              {info.level}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {info.phonetic} • {info.partOfSpeech}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleSpeak}
            className="p-1 rounded text-blue-600 hover:bg-blue-50"
            title="Dinle"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
            title="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <span className="text-[10px] text-slate-400 block font-medium">Türkçe Anlamı</span>
        <p className="font-bold text-slate-800 dark:text-slate-100">
          {info.translation}
        </p>
      </div>

      <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] space-y-0.5">
        <p className="text-slate-700 dark:text-slate-300 italic">
          "{info.exampleSentence}"
        </p>
        <p className="text-slate-500 text-[10px]">
          "{info.exampleTranslation}"
        </p>
      </div>

      <div className="pt-1 flex items-center space-x-2">
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center space-x-1 shadow-sm ${
            isSaved
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSaved ? <Check className="w-3 h-3" /> : <BookmarkPlus className="w-3 h-3" />}
          <span>{isSaved ? 'Eklendi' : '+ Kelimelerime Ekle'}</span>
        </button>

        <button
          onClick={() => {
            onOpenInTutor(cleanWord);
            onClose();
          }}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400"
          title="AI Öğretmen ile Detaylı İncele"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
