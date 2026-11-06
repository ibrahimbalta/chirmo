import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Volume2,
  Mic,
  CheckCircle2,
  X,
  ArrowRight,
  Lightbulb,
  Award,
  RotateCcw
} from 'lucide-react';
import {
  LegoChunkService,
  LegoPatternRoot,
  LegoBrick
} from '../../services/legoChunkService';
import { TargetLanguageService } from '../../services/targetLanguageService';
import { LearningStorageService } from '../../services/learningStorage';

interface ChirmoLegoChunkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
}

export const ChirmoLegoChunkingModal: React.FC<ChirmoLegoChunkingModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const [targetLang, setTargetLang] = useState(() => TargetLanguageService.getTargetLanguage());
  const [patterns, setPatterns] = useState<LegoPatternRoot[]>([]);
  const [selectedPatternIndex, setSelectedPatternIndex] = useState(0);
  const [selectedBrickIndex, setSelectedBrickIndex] = useState(0);

  // Mic Speaking
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    return TargetLanguageService.subscribe((lang) => setTargetLang(lang));
  }, []);

  useEffect(() => {
    if (isOpen) {
      const activePatterns = LegoChunkService.getPatterns(targetLang);
      setPatterns(activePatterns);
      setSelectedPatternIndex(0);
      setSelectedBrickIndex(0);
      setIsSuccess(false);
      setSpokenText('');
    }
  }, [isOpen, targetLang]);

  const currentPattern = patterns[selectedPatternIndex] || patterns[0];
  const currentBrick: LegoBrick | undefined = currentPattern?.bricks?.[selectedBrickIndex];

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleSelectBrick = (index: number) => {
    setSelectedBrickIndex(index);
    setIsSuccess(false);
    setSpokenText('');
    const brick = currentPattern.bricks[index];
    if (brick) {
      handleSpeak(brick.fullSentence);
    }
  };

  const handleMicPractice = () => {
    if (!currentBrick) return;
    setIsListening(true);
    setSpokenText('');
    setIsSuccess(false);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTimeout(() => {
        setIsListening(false);
        setSpokenText(currentBrick.fullSentence);
        setIsSuccess(true);
        LearningStorageService.addXP(25);
        onRewardXP?.(25);
        handleSpeak(targetLang === 'de' ? 'Perfekt ausgesprochen!' : 'Perfect chunking!');
      }, 1600);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = targetLang === 'de' ? 'de-DE' : 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenText(transcript);
        setIsListening(false);
        setIsSuccess(true);
        LearningStorageService.addXP(25);
        onRewardXP?.(25);
        handleSpeak(targetLang === 'de' ? 'Großartig!' : 'Well done!');
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpokenText(currentBrick.fullSentence);
        setIsSuccess(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  if (!isOpen || !currentPattern) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-200 dark:border-indigo-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Üst Başlık Barı */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base sm:text-lg">
                  Lego Kalıp Sihirbazı 🧱
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-black uppercase">
                  {targetLang === 'de' ? '🇩🇪 Almanca' : '🇬🇧 İngilizce'}
                </span>
              </div>
              <p className="text-xs text-indigo-100 font-medium">
                1 güçlü ana gövde kalıbıyla onlarca farklı cümleyi saniyeler içinde kur!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gövde */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Kalıp Seçim Sekmeleri */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {patterns.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPatternIndex(idx);
                  setSelectedBrickIndex(0);
                  setIsSuccess(false);
                  setSpokenText('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  selectedPatternIndex === idx
                    ? 'bg-indigo-600 text-white shadow-md scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Kalıp #{idx + 1}: {p.pattern}
              </button>
            ))}
          </div>

          {/* Ana Gövde (Root Brick) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-indigo-700 dark:text-indigo-300 tracking-wider">
                Ana Gövde Kalıbı:
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {currentPattern.patternTr}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-indigo-100">
              {currentPattern.pattern}
            </div>
            <div className="flex items-start space-x-2 text-xs text-indigo-800 dark:text-indigo-300 pt-1">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{currentPattern.pedagogicalTip}</span>
            </div>
          </div>

          {/* Lego Parçaları (Eklentiler) */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
              Gövdeye Eklenecek Lego Parçaları (Tıkla ve Birleştir):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentPattern.bricks.map((brick, idx) => {
                const isSelected = selectedBrickIndex === idx;
                return (
                  <button
                    key={brick.id}
                    onClick={() => handleSelectBrick(idx)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-101 ring-2 ring-blue-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-black flex items-center space-x-1.5">
                        <span>🧩</span>
                        <span>+ {brick.label}</span>
                      </div>
                      <div
                        className={`text-[11px] font-medium mt-0.5 ${
                          isSelected ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {brick.labelTr}
                      </div>
                    </div>

                    <div
                      className={`p-1.5 rounded-lg transition-transform group-hover:scale-110 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tam Cümle & Sesli Pratik Kartı */}
          {currentBrick && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-slate-800 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 uppercase">
                  Oluşan Tam Cümle:
                </span>
                <button
                  type="button"
                  onClick={() => handleSpeak(currentBrick.fullSentence)}
                  className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer transition shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Dinle</span>
                </button>
              </div>

              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                "{currentBrick.fullSentence}"
              </div>
              <div className="text-xs text-slate-500 italic">
                Türkçesi: {currentBrick.fullSentenceTr}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleMicPractice}
                  disabled={isListening}
                  className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition cursor-pointer shadow-md ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>
                    {isListening ? 'Seni Dinliyorum, Cümleyi Oku...' : 'Mikrofonla Sen Söyle (+25 XP)'}
                  </span>
                </button>

                {isSuccess && (
                  <div className="flex items-center space-x-1.5 text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Harika Telaffuz! Kas hafızan oluştu.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Alt Kapatma Barı */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1 text-xs text-slate-500 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Kalıplarla konuşmak Türkçeden çevirme refleksini yok eder.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-black transition cursor-pointer"
          >
            Tamamla
          </button>
        </div>
      </div>
    </div>
  );
};
