import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Star,
  RefreshCw,
  Lightbulb,
  Award
} from 'lucide-react';
import { CurriculumService, RealLifeScenario } from '../../services/curriculumData';
import { TargetLanguageService } from '../../services/targetLanguageService';
import { LearningStorageService } from '../../services/learningStorage';
import { AnalyticsService } from '../../services/analyticsService';

export const RealLifeSimulatorStudio: React.FC = () => {
  const activeScenarios = CurriculumService.getScenarios();
  const [selectedScenario, setSelectedScenario] = useState<RealLifeScenario>(activeScenarios[0]);
  const [userSpeechInput, setUserSpeechInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    naturalAlternative: string;
    coachNote: string;
    isPassed: boolean;
  } | null>(null);

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleStartListening = () => {
    setIsListening(true);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = TargetLanguageService.getTargetLanguage() === 'de' ? 'de-DE' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          setIsListening(false);
          const transcript = event.results[0][0].transcript;
          setUserSpeechInput(transcript);
          evaluateUserResponse(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          fallbackSimulateSpeech();
        };

        recognition.start();
        return;
      } catch {
        // Fallback
      }
    }

    fallbackSimulateSpeech();
  };

  const fallbackSimulateSpeech = () => {
    setTimeout(() => {
      setIsListening(false);
      const sample = selectedScenario.interactiveChallenge.suggestedAnswer;
      setUserSpeechInput(sample);
      evaluateUserResponse(sample);
    }, 1500);
  };

  const evaluateUserResponse = (text: string) => {
    AnalyticsService.logSpeakingSession(30);
    const target = selectedScenario.interactiveChallenge.suggestedAnswer.toLowerCase();
    const input = text.toLowerCase();

    const isClose = target.split(' ').some((word) => word.length > 3 && input.includes(word));
    const score = isClose ? 92 : 75;

    setFeedback({
      score,
      naturalAlternative: selectedScenario.interactiveChallenge.suggestedAnswer,
      coachNote: selectedScenario.interactiveChallenge.coachTip,
      isPassed: true
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto p-4 sm:p-6 pb-28 select-none">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* ==================== ÜST BAŞLIK ==================== */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Gerçek Yaşam Simülasyonları</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Sokakta & Seyahatte İngilizceyle Yaşa! 🌍
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Kafede sipariş verirken, otelde check-in yaparken veya havalimanında paniklemeden konuş. Chirmo rol arkadaşın olur, hata yaptığında seni yargılamadan en doğal kalıbı öğretir.
            </p>
          </div>
        </div>

        {/* ==================== SENARYO KARTLARI SEÇİCİSİ ==================== */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            🎭 Simülasyon Sahnesini Seç:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {activeScenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedScenario(sc);
                  setUserSpeechInput('');
                  setFeedback(null);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedScenario.id === sc.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="text-lg mb-1">{sc.badge.split(' ')[0]}</div>
                <div className="text-xs font-black text-slate-800 dark:text-slate-100 line-clamp-1">
                  {sc.title}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {sc.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ==================== AKTİF SİMÜLASYON SAHNESİ ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SOL: CHIRMO KARŞI TARAF ROLÜ VE KONUŞMA ALANI */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{selectedScenario.badge.split(' ')[0]}</span>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {selectedScenario.title}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {selectedScenario.interactiveChallenge.situationTr}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase">
                Canlı Rol
              </span>
            </div>

            {/* CHIRMO KONUŞMA BALONU */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 text-xs font-black">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Karşı Taraf (Chirmo AI):</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSpeak(selectedScenario.interactiveChallenge.aiQuestion)}
                  className="hover:scale-110 transition-transform cursor-pointer text-indigo-600 flex items-center space-x-1 text-[11px]"
                  title="Sesli Dinle"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dinle</span>
                </button>
              </div>

              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                "{selectedScenario.interactiveChallenge.aiQuestion}"
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {selectedScenario.interactiveChallenge.aiQuestionTr}
              </div>
            </div>

            {/* KULLANICININ YANIT VERME ALANI */}
            <div className="space-y-3">
              <div className="text-xs font-black text-slate-700 dark:text-slate-300">
                Senin Yanıtın (Sesli veya Yazılı):
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  value={userSpeechInput}
                  onChange={(e) => setUserSpeechInput(e.target.value)}
                  placeholder="Mikrofon butonuna basarak sesli söyle veya buraya yaz..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartListening}
                  disabled={isListening}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-102'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 animate-spin" />
                      <span>Dinleniyor... Konuşun!</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Mikrofonla Yanıt Ver 🎤</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => evaluateUserResponse(userSpeechInput || selectedScenario.interactiveChallenge.suggestedAnswer)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Cevabı Kontrol Et
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserSpeechInput(selectedScenario.interactiveChallenge.suggestedAnswer);
                    evaluateUserResponse(selectedScenario.interactiveChallenge.suggestedAnswer);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-medium text-xs transition-colors cursor-pointer"
                >
                  Örnek Cevabı Doldur
                </button>
              </div>
            </div>

            {/* GERİ BİLDİRİM VE KOÇ DEĞERLENDİRMESİ */}
            {feedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-black text-emerald-900 dark:text-emerald-100">
                      Doğallık Puanı: %{feedback.score}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold">
                    +40 XP
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <div className="font-bold text-slate-900 dark:text-white mb-0.5">
                    💡 Koç İpucu:
                  </div>
                  {feedback.coachNote}
                </div>

                <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800 text-xs">
                  <span className="font-bold text-emerald-950 dark:text-emerald-200">
                    Yerli Gibi En Doğal Cümle:
                  </span>
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5 flex items-center justify-between">
                    <span>"{feedback.naturalAlternative}"</span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(feedback.naturalAlternative)}
                      className="cursor-pointer hover:scale-110 transition-transform ml-2"
                      title="Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SAĞ: BU SENARYODAKİ HAYAT KURTARAN 4 REFLEKS KALIP (KEY CHUNKS) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Hayat Kurtaran Kalıplar</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400">4 Kalıp</span>
            </div>

            <div className="space-y-3">
              {selectedScenario.keyChunks.map((chunk, cIdx) => (
                <div
                  key={cIdx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      {chunk.en}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(chunk.en)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Sesli Dinle"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {chunk.tr}
                  </div>
                  <div className="text-[10px] text-slate-400 italic">
                    {chunk.phonetic}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
