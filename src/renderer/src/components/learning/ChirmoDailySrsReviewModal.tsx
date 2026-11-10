// Chirmo Günlük Bilimsel Aralıklı Tekrar Modalı (SuperMemo SM-2 SRS Review Session)
// Kullanıcının unutma eğrisine girmiş kelimelerini ve hata defterindeki cümlelerini
// 3D kart çevirme ve 4 seviyeli hafıza puanlama ile kalıcı belleğe aktarır.

import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Brain,
  RotateCw,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  SpacedRepetitionService,
  SrsReviewItem,
  SrsRating
} from '../../services/spacedRepetitionService';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

interface ChirmoDailySrsReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete?: (reviewedCount: number, earnedXp: number) => void;
}

export const ChirmoDailySrsReviewModal: React.FC<ChirmoDailySrsReviewModalProps> = ({
  isOpen,
  onClose,
  onSessionComplete
}) => {
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(() => TargetLanguageService.getTargetLanguage());
  const [queue, setQueue] = useState<SrsReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0);

  useEffect(() => {
    return TargetLanguageService.subscribe((lang) => setTargetLang(lang));
  }, []);

  useEffect(() => {
    if (isOpen) {
      const items = SpacedRepetitionService.getUnifiedReviewQueue(targetLang);
      setQueue(items);
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsCompleted(items.length === 0);
      setSessionReviewedCount(0);
    }
  }, [isOpen, targetLang]);

  if (!isOpen) return null;

  const currentItem = queue[currentIndex];

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && currentItem) {
      handleSpeak(currentItem.audioText);
    }
  };

  const handleRate = (rating: SrsRating) => {
    if (!currentItem) return;

    SpacedRepetitionService.recordUnifiedReview(currentItem, rating);
    const newReviewedCount = sessionReviewedCount + 1;
    setSessionReviewedCount(newReviewedCount);

    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Oturum bitti
      setIsCompleted(true);
      const earnedXp = newReviewedCount * 10;
      LearningStorageService.addXP(earnedXp);
      if (onSessionComplete) {
        onSessionComplete(newReviewedCount, earnedXp);
      }
    }
  };

  const progressPercent = queue.length > 0 ? Math.round(((currentIndex) / queue.length) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl h-[620px] max-h-[92vh] rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Üst Bar */}
        <div className="p-4 sm:p-5 border-b border-indigo-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/80 dark:from-slate-900 dark:to-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  Günün Aralıklı Tekrarı (SRS)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                  {targetLang === 'de' ? '🇩🇪 Almanca' : targetLang === 'fr' ? '🇫🇷 Fransızca' : '🇬🇧 İngilizce'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                SuperMemo SM-2 Bilimsel Hafıza Eğrisi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İlerleme Çubuğu */}
        {!isCompleted && queue.length > 0 && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 relative">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Kart Gövdesi veya Tamamlanma Ekranı */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
          {isCompleted ? (
            <div className="text-center space-y-4 max-w-md py-6 animate-scale-up">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/25">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Tebrikler! Günlük Tekrar Tamamlandı
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {sessionReviewedCount > 0
                    ? `${sessionReviewedCount} adet kartı başarıyla hafızana kazıdın.`
                    : 'Bugün için tekrar bekleyen hiçbir kartın yok! Yeni kelimeler ve cümleler öğrenmeye devam et.'}
                </p>
              </div>

              {sessionReviewedCount > 0 && (
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-black">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>+{sessionReviewedCount * 10} XP Hesabına Eklendi!</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Tamamla ve Stüdyoya Dön
                </button>
              </div>
            </div>
          ) : currentItem ? (
            <div className="w-full flex-1 flex flex-col justify-between max-w-md">
              
              {/* Kart Bilgi Başlığı */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-bold flex items-center space-x-1">
                  <span>Kart {currentIndex + 1} / {queue.length}</span>
                  {currentItem.sourceType === 'mistake' && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black ml-2">
                      📖 Hata Düzeltme
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-medium flex items-center space-x-1">
                  <Clock className="w-3 h-3 mr-0.5" />
                  <span>Aralık: {currentItem.intervalDays} gün</span>
                </span>
              </div>

              {/* 3D Etkileşimli Kart */}
              <div
                onClick={handleFlip}
                className={`flex-1 min-h-[260px] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-300 border shadow-lg ${
                  isFlipped
                    ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border-transparent'
                    : 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                {!isFlipped ? (
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-black">
                      Nasıl söylersin? (Hatırla)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {currentItem.frontPrompt}
                    </h2>
                    {currentItem.frontSubPrompt && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        {currentItem.frontSubPrompt}
                      </p>
                    )}
                    <div className="pt-2 flex items-center justify-center space-x-1 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                      <RotateCw className="w-4 h-4 animate-spin-slow" />
                      <span>Cevabı görmek için karta dokun</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in text-white">
                    <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white font-black">
                      Doğru İfade
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black leading-tight flex items-center justify-center gap-2">
                      <span>{currentItem.backText}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(currentItem.audioText);
                        }}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                        title="Dinle"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </h2>
                    {currentItem.backExplanationTr && (
                      <p className="text-xs text-indigo-100 bg-white/10 p-3 rounded-2xl max-w-sm mx-auto">
                        {currentItem.backExplanationTr}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Alt Butonlar */}
              <div className="mt-4 pt-2">
                {!isFlipped ? (
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Cevabı Göster</span>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-center font-bold text-slate-400">
                      Bu kartı ne kadar iyi hatırladın?
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => handleRate(1)}
                        className="py-2.5 px-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black transition-all cursor-pointer flex flex-col items-center"
                      >
                        <span>Unuttum</span>
                        <span className="text-[10px] font-medium opacity-80">(1 gün)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRate(3)}
                        className="py-2.5 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-black transition-all cursor-pointer flex flex-col items-center"
                      >
                        <span>Zordu</span>
                        <span className="text-[10px] font-medium opacity-80">(3 gün)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRate(4)}
                        className="py-2.5 px-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-black transition-all cursor-pointer flex flex-col items-center"
                      >
                        <span>İyiydi</span>
                        <span className="text-[10px] font-medium opacity-80">(Normal)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRate(5)}
                        className="py-2.5 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-black transition-all cursor-pointer flex flex-col items-center"
                      >
                        <span>Çok Kolay</span>
                        <span className="text-[10px] font-medium opacity-80">(Hızlı)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
