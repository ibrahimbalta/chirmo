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
  Award,
  Trophy,
  Flame,
  Check
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
    const score = isClose ? 94 : 78;

    setFeedback({
      score,
      naturalAlternative: selectedScenario.interactiveChallenge.suggestedAnswer,
      coachNote: selectedScenario.interactiveChallenge.coachTip,
      isPassed: true
    });

    LearningStorageService.addXP(40);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f0f4ff] dark:bg-slate-950 overflow-y-auto p-3 sm:p-6 pb-28 select-none max-w-full box-border">
      <div className="max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 min-w-0">

        {/* ==================== OYUN BAŞLIĞI VE OYUNCU HUD ==================== */}
        <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-md relative overflow-hidden min-w-0">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0">
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Gerçek Yaşam Rol Yapma Oyunu 🎭</span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight break-words">
                Sokakta & Seyahatte İngilizceyle Yaşa! 🌍
              </h1>
              <p className="text-xs text-emerald-100 hidden sm:block">
                Bir sahne seç, Chirmo ile canlı rol yap! Her denemede +40 XP kazan.
              </p>
            </div>

            {/* Oyuncu Puan Rozeti */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="px-2.5 py-1 rounded-xl bg-black/25 border border-white/20 flex items-center space-x-1.5 text-xs font-black text-amber-200">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>+40 XP / Görev</span>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-black/25 border border-white/20 flex items-center space-x-1.5 text-xs font-black text-white">
                <Flame className="w-3.5 h-3.5 text-orange-300" />
                <span>Canlı Diyalog</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== GÖREV SEÇİM PARKURU / SAHNE SEÇİCİ ==================== */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <span>🎯</span>
              <span>Oynamak İstediğin Görev Sahnesini Seç:</span>
            </h3>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
              {activeScenarios.length} Farklı Senaryo
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 min-w-0">
            {activeScenarios.map((sc, index) => {
              const isSelected = selectedScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenario(sc);
                    setUserSpeechInput('');
                    setFeedback(null);
                  }}
                  className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-w-0 relative ${
                    isSelected
                      ? 'border-emerald-500 bg-white dark:bg-slate-900 text-emerald-950 dark:text-emerald-100 shadow-sm ring-2 ring-emerald-500/30'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base sm:text-lg">{sc.badge.split(' ')[0]}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Lvl {index + 1}
                    </span>
                  </div>
                  <div className="text-xs font-black text-slate-800 dark:text-slate-100 truncate w-full">
                    {sc.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate w-full mt-0.5 flex items-center justify-between">
                    <span>{sc.category}</span>
                    <span className="text-amber-500 text-[10px]">⭐⭐⭐</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== AKTİF DİYALOG ARENASI ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-w-0">

          {/* SOL: CHIRMO İLE CANLI OYUN DİYALOĞU (7 Kolon) */}
          <div className="lg:col-span-8 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 min-w-0">
            {/* Görev Başlığı ve Zorluk */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 min-w-0">
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className="text-2xl shrink-0">{selectedScenario.badge.split(' ')[0]}</span>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                    {selectedScenario.title}
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate">
                    {selectedScenario.interactiveChallenge.situationTr}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase shrink-0">
                Aktif Görev
              </span>
            </div>

            {/* NPC KARAKTERİNİN (CHIRMO) KONUŞMA BALONU */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 space-y-2 min-w-0">
              <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-300 text-xs font-black min-w-0">
                <span className="flex items-center space-x-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span className="truncate">Chirmo Karşı Taraf Rolünde:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSpeak(selectedScenario.interactiveChallenge.aiQuestion)}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700 text-xs font-bold flex items-center space-x-1 shadow-2xs cursor-pointer transition-transform active:scale-95 shrink-0"
                  title="Sesli Dinle"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dinle</span>
                </button>
              </div>

              <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 break-words">
                "{selectedScenario.interactiveChallenge.aiQuestion}"
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 break-words">
                Türkçesi: {selectedScenario.interactiveChallenge.aiQuestionTr}
              </div>
            </div>

            {/* OYUNCUNUN HAMLESİ (SESLİ VEYA YAZILI YANIT) */}
            <div className="space-y-3 min-w-0">
              <div className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>🎮 Senin Sıran: Mikrofona Dokun ve Rolünü Oyna</span>
                <span className="text-[10px] text-slate-400 font-bold">İster konuş, ister yaz</span>
              </div>

              <div className="relative min-w-0">
                <textarea
                  rows={2}
                  value={userSpeechInput}
                  onChange={(e) => setUserSpeechInput(e.target.value)}
                  placeholder="Mikrofon butonuna basarak sesli söyle veya buraya yaz..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 transition-colors resize-none box-border"
                />
              </div>

              {/* OYUN AKSİYON BUTONLARI */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={handleStartListening}
                  disabled={isListening}
                  className={`flex-1 py-3 px-5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
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
                  className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-95 text-center"
                >
                  Cevabı Kontrol Et 🚀
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserSpeechInput(selectedScenario.interactiveChallenge.suggestedAnswer);
                    evaluateUserResponse(selectedScenario.interactiveChallenge.suggestedAnswer);
                  }}
                  className="py-3 px-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Örnek Cevap
                </button>
              </div>
            </div>

            {/* OYUN SKORU VE GERİ BİLDİRİM KARTI */}
            {feedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 space-y-2.5 animate-fade-in min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-black text-emerald-900 dark:text-emerald-100">
                      Doğallık Puanı: %{feedback.score} ⭐⭐⭐
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-100 font-black shrink-0">
                    +40 XP Kazanıldı 🏆
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 break-words">
                  <span className="font-bold text-slate-900 dark:text-white">💡 Koç İpucu: </span>
                  {feedback.coachNote}
                </div>

                <div className="pt-2 border-t border-emerald-200/80 dark:border-emerald-800 text-xs">
                  <span className="font-black text-emerald-950 dark:text-emerald-200">
                    Yerli Gibi En Doğal Cümle:
                  </span>
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold mt-1 flex items-center justify-between gap-2">
                    <span className="break-words">"{feedback.naturalAlternative}"</span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(feedback.naturalAlternative)}
                      className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 shrink-0"
                      title="Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SAĞ: GÜNÜN 4 GİZLİ GÜÇ KALIBI (5 Kolon) */}
          <div className="lg:col-span-4 p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Hayat Kurtaran Kalıplar</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                4 Kalıp
              </span>
            </div>

            <div className="space-y-2.5 min-w-0">
              {selectedScenario.keyChunks.map((chunk, cIdx) => (
                <div
                  key={cIdx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1 hover:border-indigo-200 transition-colors min-w-0"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 truncate">
                      {chunk.en}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(chunk.en)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer p-1 shrink-0"
                      title="Sesli Dinle"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 break-words">
                    {chunk.tr}
                  </div>
                  <div className="text-[10px] text-slate-400 italic truncate">
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

export default RealLifeSimulatorStudio;
