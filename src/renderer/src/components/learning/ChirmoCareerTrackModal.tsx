import React, { useState, useEffect, useRef } from 'react';
import {
  CareerTrackService,
  CareerTrack,
  CareerScenario,
  CareerEvaluationResult
} from '../../services/careerTrackService';
import { LearningStorageService } from '../../services/learningStorage';

interface ChirmoCareerTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
}

export const ChirmoCareerTrackModal: React.FC<ChirmoCareerTrackModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const [tracks, setTracks] = useState<CareerTrack[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('tech');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('tech_standup');

  // Mic & Speech State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [userSpeechText, setUserSpeechText] = useState<string>('');
  const [evaluation, setEvaluation] = useState<CareerEvaluationResult | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [showSuggestedReplies, setShowSuggestedReplies] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      const allTracks = CareerTrackService.getTracks();
      setTracks(allTracks);
      if (allTracks.length > 0) {
        setSelectedTrackId(allTracks[0].id);
        if (allTracks[0].scenarios.length > 0) {
          setSelectedScenarioId(allTracks[0].scenarios[0].id);
        }
      }
    } else {
      if (isListening) stopListening();
    }
  }, [isOpen]);

  const currentTrack = tracks.find((t) => t.id === selectedTrackId) || tracks[0];
  const currentScenario =
    currentTrack?.scenarios.find((s) => s.id === selectedScenarioId) ||
    currentTrack?.scenarios[0];

  const handleTrackChange = (trackId: string) => {
    setSelectedTrackId(trackId);
    const track = tracks.find((t) => t.id === trackId);
    if (track && track.scenarios.length > 0) {
      setSelectedScenarioId(track.scenarios[0].id);
    }
    setUserSpeechText('');
    setEvaluation(null);
  };

  const handleScenarioChange = (scenario: CareerScenario) => {
    setSelectedScenarioId(scenario.id);
    setUserSpeechText('');
    setEvaluation(null);
    LearningStorageService.speak(scenario.prompt);
  };

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const fallback =
        currentScenario?.suggestedReplies[0] ||
        'I have met all milestone deliverables ahead of schedule with no blockers.';
      setUserSpeechText(fallback);
      processEvaluation(fallback);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserSpeechText(transcript);
        if (event.results[0].isFinal) {
          processEvaluation(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const processEvaluation = (speech: string) => {
    if (!currentScenario) return;
    const res = CareerTrackService.evaluateCareerSpeech(currentScenario, speech);
    setEvaluation(res);
    if (res.score >= 70 && onRewardXP) {
      onRewardXP(40);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800 bg-gray-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border border-blue-400/40 flex items-center justify-center text-2xl shadow-inner">
              💼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Mesleki & Sektörel Konuşma Paketleri
                </h2>
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Career Simulation
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                IT Standup, Global İş Mülakatı, Vize Konsolosluğu ve Uluslararası Müzakere Rol Yapma
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Sektör / Track Tabs */}
        <div className="flex items-center gap-2 p-3 sm:px-6 bg-gray-950/80 border-b border-gray-800 overflow-x-auto shrink-0 custom-scrollbar">
          {tracks.map((tr) => {
            const isActive = tr.id === selectedTrackId;
            return (
              <button
                key={tr.id}
                type="button"
                onClick={() => handleTrackChange(tr.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/40'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800 border border-gray-700/60'
                }`}
              >
                <span>{tr.icon}</span>
                <span>{tr.turkishTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 text-sm custom-scrollbar">
          {/* Track Description & Scenario Badges */}
          {currentTrack && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-gray-800/40 border border-gray-700/60">
                <p className="text-xs text-gray-300 font-medium">
                  {currentTrack.description}
                </p>
                <button
                  type="button"
                  onClick={() => setShowCheatSheet(!showCheatSheet)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 text-xs font-bold transition shrink-0 flex items-center gap-1.5"
                >
                  <span>⚡</span>
                  <span>{showCheatSheet ? 'Jargon Kartını Gizle' : 'Sektörel Jargon Sözlüğü'}</span>
                </button>
              </div>

              {/* Collapsible Power Jargon Cheat Sheet */}
              {showCheatSheet && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/50 to-gray-900 border border-indigo-500/30 space-y-3 animate-fadeIn">
                  <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Bu Sektörde En Çok Kullanılan Güç Terimleri:</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {currentTrack.powerJargon.map((j, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-gray-950/70 border border-gray-800"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-xs">{j.term}</span>
                          <span className="text-[11px] text-cyan-400 font-medium">{j.tr}</span>
                        </div>
                        <p className="text-[11px] text-gray-300 italic">"{j.example}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scenarios Carousel / Selector */}
              <div>
                <label className="text-xs font-bold text-gray-300 mb-2 block">
                  🎯 Senaryo Seçin:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentTrack.scenarios.map((sc) => {
                    const isSelected = sc.id === currentScenario?.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => handleScenarioChange(sc)}
                        className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-950/60 border-blue-400 text-white shadow-lg shadow-blue-950/40'
                            : 'bg-gray-800/40 border-gray-700/60 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-xl mt-0.5">🎙️</span>
                        <div>
                          <div className="font-bold text-xs">{sc.turkishTitle}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{sc.title}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Active Roleplay Stage */}
          {currentScenario && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900 border border-blue-500/30 space-y-4">
              {/* Character Roleplay Prompt Card */}
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-gray-950/80 border border-blue-500/30">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-2xl shrink-0 shadow">
                  👤
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-blue-300">
                        {currentScenario.characterName}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {currentScenario.characterRole}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSpeak(currentScenario.prompt)}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <span>🔊</span>
                      <span>Soruyu Dinle</span>
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-white mt-2 leading-relaxed">
                    "{currentScenario.prompt}"
                  </p>
                  <p className="text-xs text-gray-400 italic mt-1">
                    {currentScenario.promptTr}
                  </p>
                </div>
              </div>

              {/* Target Keywords Badge Pill Row */}
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Hedef Mesleki Anahtar Kelimeler (Cümlende geçirmeye çalış):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentScenario.targetKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* User Voice Input Zone */}
              <div className="p-4 rounded-xl bg-gray-950/90 border border-gray-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all shadow-xl shrink-0 ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:brightness-110 text-white shadow-blue-500/30'
                    }`}
                  >
                    {isListening ? '🛑' : '🎙️'}
                  </button>

                  <div className="flex-1 w-full">
                    <div className="text-[11px] text-gray-400 font-semibold mb-1 flex items-center justify-between">
                      <span>
                        {isListening
                          ? '🎤 Dinleniyor... Profesyonel yanıtınızı İngilizce olarak söyleyin:'
                          : 'Senin Cevabın:'}
                      </span>
                      <span className="text-[11px] text-amber-400 font-bold">+40 XP Ödül</span>
                    </div>
                    <div className="text-xs font-medium text-white min-h-[32px] p-2 rounded-lg bg-gray-900 border border-gray-800">
                      {userSpeechText ? (
                        <span>"{userSpeechText}"</span>
                      ) : (
                        <span className="text-gray-500 italic">
                          Mikrofona tıklayıp konuşun veya aşağıdan örnek yanıtları inceleyin...
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSuggestedReplies(!showSuggestedReplies)}
                    className="text-xs px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 shrink-0"
                  >
                    {showSuggestedReplies ? '💡 İpuçlarını Kapat' : '💡 Örnek Yanıtlar'}
                  </button>
                </div>

                {/* Suggested Replies Drawer */}
                {showSuggestedReplies && (
                  <div className="p-3 rounded-xl bg-gray-900/90 border border-blue-500/20 space-y-2 animate-fadeIn text-xs">
                    <div className="text-blue-300 font-bold">
                      🏆 Örnek Üst Düzey Kurumsal Yanıtlar (Tıklayıp inceleyebilirsin):
                    </div>
                    <div className="space-y-1.5">
                      {currentScenario.suggestedReplies.map((reply, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setUserSpeechText(reply);
                            processEvaluation(reply);
                          }}
                          className="p-2.5 rounded-lg bg-gray-950 hover:bg-blue-950/40 border border-gray-800 hover:border-blue-500/40 cursor-pointer text-gray-200 transition flex items-center justify-between"
                        >
                          <span className="leading-relaxed">"{reply}"</span>
                          <span className="text-[10px] text-blue-400 shrink-0 ml-2">Seç ➔</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Evaluation Feedback */}
              {evaluation && (
                <div
                  className={`p-4 rounded-xl border space-y-2 animate-fadeIn ${
                    evaluation.score >= 80
                      ? 'bg-emerald-950/40 border-emerald-500/50'
                      : 'bg-amber-950/40 border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {evaluation.score >= 80 ? '🏆' : '💼'}
                      </span>
                      <span className="text-xs font-bold text-white">
                        Mesleki Yetkinlik Puanı: {evaluation.score}/100
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          evaluation.professionalTone === 'excellent'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {evaluation.professionalTone === 'excellent'
                          ? 'Mükemmel Kurumsal Anlatım'
                          : 'Yetkin'}
                      </span>
                    </div>
                    {evaluation.score >= 70 && (
                      <span className="text-xs font-bold text-amber-400">+40 XP Eklendi!</span>
                    )}
                  </div>

                  <p className="text-xs text-white font-medium">{evaluation.feedback}</p>
                  <p className="text-[11px] text-gray-300 italic">{evaluation.feedbackTr}</p>

                  {evaluation.matchedKeywords.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-300">
                      <span>✓ Yakalanan Terimler:</span>
                      {evaluation.matchedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-emerald-950/70 border border-emerald-500/40 rounded-full font-mono text-[10px]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-900/60 shrink-0">
          <div className="text-xs text-gray-400">
            💼 Uluslararası mülakat ve toplantılara özgüvenle hazırlan.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold rounded-lg transition shadow"
          >
            Tamamla & Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
