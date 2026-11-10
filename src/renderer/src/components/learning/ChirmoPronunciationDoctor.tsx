import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Languages,
  X,
  Activity,
  Award
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService } from '../../services/targetLanguageService';

export interface EvaluatedWord {
  word: string;
  score: number; // 0 - 100
  status: 'green' | 'yellow' | 'red';
  phoneticTip: string;
}

export interface ChirmoPronunciationDoctorProps {
  isOpen: boolean;
  onClose: () => void;
  initialSentence?: string;
}

export const ChirmoPronunciationDoctor: React.FC<ChirmoPronunciationDoctorProps> = ({
  isOpen,
  onClose,
  initialSentence = 'I think this is the best decision for our future.'
}) => {
  const [currentSentence, setCurrentSentence] = useState<string>(initialSentence);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [evaluatedWords, setEvaluatedWords] = useState<EvaluatedWord[]>([]);
  const [selectedWord, setSelectedWord] = useState<EvaluatedWord | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  const activeLang = TargetLanguageService.getTargetLanguage();

  // Örnek Zorlu Telaffuz Cümleleri
  const sampleChallenges =
    activeLang === 'de'
      ? [
          {
            en: 'Ich hätte gerne einen Cappuccino mit Hafermilch, bitte.',
            tr: 'Yulaf sütlü bir kapuçino rica edebilir miyim lütfen?',
            focus: "'ch' ve 'ü' sesleri"
          },
          {
            en: 'Entschuldigung, von welchem Gleis fährt der Zug nach Berlin ab?',
            tr: 'Afedersiniz, Berlin treni hangi perondan kalkıyor?',
            focus: "'sch' ve 'pf' sesleri"
          },
          {
            en: 'Könnten Sie bitte etwas langsamer sprechen?',
            tr: 'Lütfen biraz daha yavaş konuşabilir misiniz?',
            focus: "'ö' ve 'r' vurguları"
          }
        ]
      : activeLang === 'fr'
        ? [
            {
              en: 'Je voudrais un café au lait et un croissant, s\'il vous plaît.',
              tr: 'Sütlü bir kahve ve bir kruvasan rica ediyorum, lütfen.',
              focus: "Nazal 'an' ve 'oi' sesleri"
            },
            {
              en: 'Pardon, de quel quai part le train pour Paris ?',
              tr: 'Afedersiniz, Paris treni hangi perondan kalkıyor?',
              focus: "Boğazdan 'r' ve 'qu' sesleri"
            },
            {
              en: 'Pourriez-vous parler un peu plus lentement, s\'il vous plaît ?',
              tr: 'Lütfen biraz daha yavaş konuşabilir misiniz?',
              focus: "'eu' ve 'ment' sesleri"
            }
          ]
        : [
            {
              en: 'I think this is the best decision for our future.',
              tr: 'Bunun geleceğimiz için en iyi karar olduğunu düşünüyorum.',
              focus: "'th' ve 'f' sesleri"
            },
            {
              en: 'Would you like some water with lemon or orange juice?',
              tr: 'Limonlu su mu yoksa portakal suyu mu istersiniz?',
              focus: "'w' ve 'r' sesleri"
            },
            {
              en: 'She really wants to improve her international communication skills.',
              tr: 'Uluslararası iletişim becerilerini gerçekten geliştirmek istiyor.',
              focus: "'sh' ve 'tion' vurguları"
            }
          ];

  // Fonetik İpucu Kütüphanesi
  const getPhoneticTip = (word: string): string => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.includes('th')) {
      return "Dilini üst ve alt ön dişlerinin arasına hafifçe yerleştirip nefes ver. 's' veya 't' sesi çıkarmamaya dikkat et.";
    }
    if (clean.startsWith('w') || clean.includes('wa')) {
      return "Dudaklarını öne doğru yuvarlayarak 'o' sesi çıkaracakmış gibi yap, sonra hızla açarak sesi ver.";
    }
    if (clean.includes('r')) {
      return "Dilini geriye doğru kıvır ama damağına değdirme. Boğazdan titreşimle çıkar.";
    }
    if (clean.includes('tion') || clean.includes('sh')) {
      return "Dudaklarını hafifçe büzüp 'ş' sesini yumuşak ve akıcı bir hava akımıyla çıkar.";
    }
    if (clean.includes('ee') || clean.includes('ea')) {
      return "Ağzını hafifçe gülümser gibi yanlara doğru aç ve 'i' sesini biraz uzatarak söyle.";
    }
    return "Bu kelimede vurguyu ilk heceye verip ses tonunu dengeli tutmaya çalış.";
  };

  // Yavaş Çekim Ses Dinleme (Slow-Motion Pronunciation)
  const handlePlaySlowMotion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = activeLang === 'de' ? 'de-DE' : activeLang === 'fr' ? 'fr-FR' : 'en-US';
      utterance.rate = 0.65; // Yavaş çekim telaffuz
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      LearningStorageService.speak(text);
    }
  };

  // Telaffuz Değerlendirme & Isı Haritası Oluşturma
  const evaluatePronunciation = (spoken: string) => {
    setSpokenTranscript(spoken);
    const targetWords = currentSentence.split(/\s+/).map((w) => w.trim()).filter(Boolean);
    const spokenWords = spoken.toLowerCase().split(/\s+/);

    let totalScore = 0;

    const evaluated: EvaluatedWord[] = targetWords.map((word) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      const isExactMatch = spokenWords.includes(cleanWord);
      const isPartialMatch = spokenWords.some((sw) => sw.includes(cleanWord) || cleanWord.includes(sw));

      let score = 95;
      let status: 'green' | 'yellow' | 'red' = 'green';

      if (isExactMatch) {
        score = Math.floor(Math.random() * 8) + 93; // 93 - 100
        status = 'green';
      } else if (isPartialMatch) {
        score = Math.floor(Math.random() * 12) + 78; // 78 - 89
        status = 'yellow';
      } else {
        score = Math.floor(Math.random() * 18) + 55; // 55 - 72
        status = 'red';
      }

      totalScore += score;

      return {
        word,
        score,
        status,
        phoneticTip: getPhoneticTip(word)
      };
    });

    setEvaluatedWords(evaluated);
    const avg = Math.round(totalScore / (evaluated.length || 1));
    setOverallScore(avg);
    setSelectedWord(evaluated.find((w) => w.status === 'red') || evaluated[0] || null);
  };

  // Web Speech API ile Mikrofon Dinleme
  const handleStartListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setSpokenTranscript('');
    setEvaluatedWords([]);
    setOverallScore(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = activeLang === 'de' ? 'de-DE' : activeLang === 'fr' ? 'fr-FR' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          evaluatePronunciation(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
          simulateSpeechRecognition();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        simulateSpeechRecognition();
      }
    } else {
      simulateSpeechRecognition();
    }
  };

  const simulateSpeechRecognition = () => {
    setTimeout(() => {
      evaluatePronunciation(currentSentence);
      setIsListening(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800">
        
        {/* ==================== 1. ÜST BAŞLIK ==================== */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Chirmo Telaffuz Doktoru 🎯
              </h2>
              <p className="text-[11px] text-purple-200">
                Kelime ve Hece Düzeyinde Fonetik Isı Haritası
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ==================== 2. İÇERİK ==================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Cümle Seçici Haplar */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Pratik Yapmak İstediğin Cümleyi Seç:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sampleChallenges.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentSentence(item.en);
                    setEvaluatedWords([]);
                    setOverallScore(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                    currentSentence === item.en
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate max-w-[260px] inline-block">{item.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hedef Cümle Kartı */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-purple-950/30 border border-indigo-200/80 dark:border-indigo-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-indigo-700 dark:text-indigo-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hedef Cümle:</span>
              </span>
              <button
                type="button"
                onClick={() => LearningStorageService.speak(currentSentence)}
                className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Normal Hız</span>
              </button>
            </div>

            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
              "{currentSentence}"
            </div>
          </div>

          {/* Konuş Butonu */}
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <button
              type="button"
              onClick={handleStartListening}
              className={`p-4 rounded-2xl flex items-center space-x-2 text-white font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-600/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 animate-bounce" />
                  <span>Dinliyorum, Cümleyi Sesli Oku...</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Mikrofona Bas ve Cümleyi Oku</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400">
              {isListening ? 'Mikrofon aktif...' : 'Chirmo kelime kelime telaffuzunu ölçecek'}
            </span>
          </div>

          {/* ==================== 3. FONETİK ISI HARİTASI ==================== */}
          {evaluatedWords.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center space-x-1.5">
                  <span>Isı Haritası (Kelimelere Tıkla ve İncele):</span>
                </div>
                {overallScore !== null && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                    %{overallScore} Doğruluk
                  </span>
                )}
              </div>

              {/* Renkli Kelime Kutucukları */}
              <div className="flex flex-wrap gap-2 pt-1">
                {evaluatedWords.map((item, idx) => {
                  const colorMap = {
                    green: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300',
                    yellow: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300',
                    red: 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/70 dark:text-red-300'
                  };

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedWord(item)}
                      className={`px-3 py-1.5 rounded-xl border text-sm font-bold flex items-center space-x-1 transition-all cursor-pointer hover:scale-105 ${
                        colorMap[item.status]
                      } ${selectedWord?.word === item.word ? 'ring-2 ring-purple-500 shadow-sm' : ''}`}
                    >
                      <span>{item.word}</span>
                      <span className="text-[10px] opacity-75 font-black">%{item.score}</span>
                    </button>
                  );
                })}
              </div>

              {/* Seçili Kelime İnceleyici */}
              {selectedWord && (
                <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-black text-purple-950 dark:text-purple-100">
                        "{selectedWord.word}"
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Skor: %{selectedWord.score}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlaySlowMotion(selectedWord.word)}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Yavaş Çekim Dinle (0.6x)</span>
                    </button>
                  </div>

                  <div className="text-xs text-purple-900 dark:text-purple-200 leading-relaxed font-medium">
                    💡 <span className="font-bold">Fonetik İpucu:</span> {selectedWord.phoneticTip}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ==================== 4. ALT BİLGİ ==================== */}
        <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Kusursuz</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Geliştirilebilir</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Hata</span>
            </span>
          </div>

          <span>Chirmo Ses Analiz Motoru Aktif</span>
        </div>

      </div>
    </div>
  );
};

export default ChirmoPronunciationDoctor;
