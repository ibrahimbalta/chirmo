import React, { useState } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
  Trophy,
  Flame
} from 'lucide-react';
import { CEFRLevel, DailyGoalProgress } from '../../types';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';

interface PracticeViewProps {
  userLevel: CEFRLevel;
  progress: DailyGoalProgress;
  onRefreshProgress: () => void;
}

interface QuizQuestion {
  id: number;
  type: 'meaning' | 'blank';
  question: string;
  targetWord: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  userLevel,
  progress,
  onRefreshProgress
}) => {
  const [questions] = useState<QuizQuestion[]>([
    {
      id: 1,
      type: 'meaning',
      question: '"improve" kelimesinin Türkçe karşılığı hangisidir?',
      targetWord: 'improve',
      options: ['Geliştirmek / İyileştirmek', 'Azaltmak / Düşürmek', 'Sürdürmek', 'Ertelemek'],
      correctAnswer: 'Geliştirmek / İyileştirmek',
      explanation: '"Improve", bir durumun ya da becerinin kalitesini artırmak (better, enhance) anlamına gelir.'
    },
    {
      id: 2,
      type: 'blank',
      question: 'Cümleyi tamamlayın: "Getting enough sleep is _______ for cognitive performance."',
      targetWord: 'crucial',
      options: ['crucial', 'reduce', 'temporary', 'accidental'],
      correctAnswer: 'crucial',
      explanation: '"Crucial", hayati önem taşıyan / kritik (vital, essential) anlamına gelen B2 seviyesi bir sıfattır.'
    },
    {
      id: 3,
      type: 'meaning',
      question: '"sustainable" kelimesi hangi anlama gelir?',
      targetWord: 'sustainable',
      options: ['Kaçınılmaz', 'Sürdürülebilir', 'Zararlı', 'Bilinmeyen'],
      correctAnswer: 'Sürdürülebilir',
      explanation: 'Sürdürülebilir, geleceği tüketmeden devam ettirilebilir (viable, renewable) demektir.'
    },
    {
      id: 4,
      type: 'blank',
      question: 'Cümleyi tamamlayın: "With rapid automation, changes have become _______ in modern industry."',
      targetWord: 'inevitable',
      options: ['inevitable', 'improve', 'fragile', 'narrow'],
      correctAnswer: 'inevitable',
      explanation: '"Inevitable", ne olursa olsun gerçekleşmesi kesin, kaçınılmaz (unavoidable) anlamına gelen C1 seviyesi bir kelimedir.'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt === currentQ.correctAnswer) {
      setScore((prev) => prev + 25);
      LearningStorageService.incrementDailyWordCount(1);
      onRefreshProgress();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-1">
              <Dumbbell className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Günlük Egzersiz & Mini Test</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Practice Mode — Pratik ve Hatırlatma
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              İnternette karşılaştığın ve seviyene uygun kelimelerle 2 dakikalık hızlı antrenman.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Skor: {score} Puan</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full p-6 flex-1 flex flex-col justify-center">
        {isFinished ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-white shadow-lg">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Tebrikler! Günlük Pratiği Tamamladın
              </h2>
              <p className="text-xs text-slate-500">
                Bugünkü hedefine ulaştın. Toplam <strong>{score}</strong> puan kazandın ve kelime hafızanı güçlendirdin.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block">Doğru Cevap</span>
                <span className="text-lg font-bold text-emerald-600">{score / 25} / 4</span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="text-slate-400 block">Streak Kazanımı</span>
                <span className="text-lg font-bold text-amber-500">+1 Gün</span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Çöz</span>
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Soru {currentIndex + 1} / {questions.length}</span>
              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded">
                Seviye {userLevel}
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {currentQ.type === 'meaning' ? 'Anlam Sorusu' : 'Cümle Tamamlama'}
                </span>
                <button
                  onClick={() => handleSpeak(currentQ.targetWord)}
                  className="p-1 rounded text-blue-600 hover:bg-blue-50 flex items-center space-x-1 text-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[10px] font-semibold">Telaffuz</span>
                </button>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let optClass = 'border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-800/80';
                if (isAnswered) {
                  if (isCorrect) {
                    optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                  } else if (isSelected) {
                    optClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className={`w-full p-4 text-left rounded-2xl border text-xs transition-all flex items-center justify-between shadow-sm ${optClass}`}
                  >
                    <span className="font-medium">{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1 animate-fade-in">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Açıklama:</span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
                >
                  <span>{currentIndex + 1 === questions.length ? 'Sonuçları Gör' : 'Sonraki Soru'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
