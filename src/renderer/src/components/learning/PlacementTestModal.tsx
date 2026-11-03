import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  X,
  RotateCcw
} from 'lucide-react';
import { CEFRLevel } from '../../types';

interface PlacementTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteLevel: (level: CEFRLevel) => void;
}

interface TestQuestion {
  id: number;
  levelTarget: CEFRLevel;
  question: string;
  options: string[];
  correct: number;
}

const TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    levelTarget: 'A1',
    question: 'She _______ from Spain. She is Italian.',
    options: ["isn't", "aren't", "not", "am not"],
    correct: 0
  },
  {
    id: 2,
    levelTarget: 'A2',
    question: 'Yesterday evening, we _______ dinner at that new Italian restaurant.',
    options: ['have', 'had', 'having', 'has'],
    correct: 1
  },
  {
    id: 3,
    levelTarget: 'B1',
    question: 'I have been studying English in this school _______ three years.',
    options: ['since', 'for', 'during', 'while'],
    correct: 1
  },
  {
    id: 4,
    levelTarget: 'B2',
    question: 'If they _______ the tickets in advance, they would not have missed the show.',
    options: ['bought', 'have bought', 'had bought', 'buy'],
    correct: 2
  },
  {
    id: 5,
    levelTarget: 'C1',
    question: 'Rarely _______ such an eloquent and persuasive presentation.',
    options: ['I have heard', 'have I heard', 'I heard', 'I had hear'],
    correct: 1
  }
];

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({
  isOpen,
  onClose,
  onCompleteLevel
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const currentQ = TEST_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    setSelectedOpt(idx);
  };

  const handleNext = () => {
    if (selectedOpt === null) return;
    const nextAnswers = [...answers, selectedOpt];
    setAnswers(nextAnswers);
    setSelectedOpt(null);

    if (currentIdx + 1 < TEST_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsDone(true);
    }
  };

  // Calculate CEFR placement
  const calculateResult = (): CEFRLevel => {
    let score = 0;
    TEST_QUESTIONS.forEach((q, i) => {
      if (answers[i] === q.correct) score += 1;
    });

    if (score <= 1) return 'A1';
    if (score === 2) return 'A2';
    if (score === 3) return 'B1';
    if (score === 4) return 'B2';
    return 'C1';
  };

  const finalLevel = calculateResult();

  const handleApply = () => {
    onCompleteLevel(finalLevel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {isDone ? (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Seviye Tespit Sonucu
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                Seviyeniz: {finalLevel}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Chirmo artık ziyaret ettiğiniz sayfalardaki içerikleri, kelime vurgularını ve AI öğretmen açıklamalarını <strong>{finalLevel}</strong> seviyesine göre özelleştirecek.
              </p>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Bu Seviyeyi Chirmo'da Başlat
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-bold">
                <span>Hızlı Seviye Belirleme</span>
                <span>{currentIdx + 1} / {TEST_QUESTIONS.length}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / TEST_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                Hedef: {currentQ.levelTarget} Sorusu
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full p-3.5 text-left rounded-2xl border text-xs font-semibold transition-all ${
                    selectedOpt === i
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                disabled={selectedOpt === null}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
              >
                <span>{currentIdx + 1 === TEST_QUESTIONS.length ? 'Sonucu Gör' : 'İleri'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
