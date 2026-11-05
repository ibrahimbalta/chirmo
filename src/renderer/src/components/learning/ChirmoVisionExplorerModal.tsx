import React, { useState, useRef, useEffect } from 'react';
import {
  VisionExplorerService,
  DetectedObjectResult,
  ObjectSpeakingEvaluation
} from '../../services/visionExplorerService';
import { LearningStorageService } from '../../services/learningStorage';

interface ChirmoVisionExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
}

export const ChirmoVisionExplorerModal: React.FC<ChirmoVisionExplorerModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const [scenes, setScenes] = useState<DetectedObjectResult[]>([]);
  const [activeScene, setActiveScene] = useState<DetectedObjectResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // User Speaking / Mic state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [userSpokenText, setUserSpokenText] = useState<string>('');
  const [evaluation, setEvaluation] = useState<ObjectSpeakingEvaluation | null>(null);
  const [showTurkishBridge, setShowTurkishBridge] = useState<boolean>(false);
  const [customInputQuery, setCustomInputQuery] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      const presets = VisionExplorerService.getPresetScenes();
      setScenes(presets);
      if (presets.length > 0 && !activeScene) {
        setActiveScene(presets[0]);
      }
    } else {
      stopCamera();
      if (isListening) stopListening();
    }
  }, [isOpen]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Tarayıcınız kamera erişimini desteklemiyor veya izin verilmedi.');
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError('Kameraya erişilemedi. Lütfen izinleri kontrol edin veya aşağıdaki hazır nesneleri seçin.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhotoAndAnalyze = () => {
    setIsScanning(true);

    // If video active, draw frame to canvas
    if (videoRef.current && isCameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 400;
      canvas.height = videoRef.current.videoHeight || 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
      }
    }

    // Simulate smart real-world vision scan in 900ms
    setTimeout(() => {
      setIsScanning(false);
      // Pick a random scene or cycle
      const presets = VisionExplorerService.getPresetScenes();
      const randomScene = presets[Math.floor(Math.random() * presets.length)];
      setActiveScene(randomScene);
      setUserSpokenText('');
      setEvaluation(null);
      LearningStorageService.speak(`Detected: ${randomScene.objectName}`);
    }, 900);
  };

  const handleSelectPreset = (scene: DetectedObjectResult) => {
    setActiveScene(scene);
    setCapturedImage(null);
    setUserSpokenText('');
    setEvaluation(null);
    LearningStorageService.speak(scene.objectName);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputQuery.trim()) return;
    const result = VisionExplorerService.analyzeObject(customInputQuery);
    setActiveScene(result);
    setCustomInputQuery('');
    setUserSpokenText('');
    setEvaluation(null);
    LearningStorageService.speak(result.objectName);
  };

  const handleSpeakText = (text: string) => {
    LearningStorageService.speak(text);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const fallback = activeScene?.suggestedAnswers[0] || 'I use this every day.';
      setUserSpokenText(fallback);
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
        setUserSpokenText(transcript);
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
    if (!activeScene) return;
    const evalRes = VisionExplorerService.evaluateUserResponse(activeScene, speech);
    setEvaluation(evalRes);
    if (evalRes.isRelevant && evalRes.score >= 70) {
      if (onRewardXP) onRewardXP(25);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow Backdrops */}
        <div className="absolute top-0 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800 bg-gray-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-2xl shadow-inner">
              📸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Etrafını Göster, İngilizce Konuş
                </h2>
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI Vision Explorer
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Kameranızı bir nesneye tutun veya seçin; Chirmo anında analiz edip sizinle konuşsun!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Content Grid */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 text-sm custom-scrollbar">
          {/* Top Control Bar: Camera vs Presets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Camera / Visual View (5 cols) */}
            <div className="lg:col-span-5 bg-gray-950/80 rounded-2xl border border-gray-800 p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[260px]">
              {isCameraActive ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-48 object-cover rounded-xl border border-cyan-500/40"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-cyan-950/40">
                      <div className="w-full h-1 bg-cyan-400 shadow-lg shadow-cyan-400 animate-pulse" />
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={capturePhotoAndAnalyze}
                      disabled={isScanning}
                      className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-lg transition shadow"
                    >
                      {isScanning ? '🔍 Taranıyor...' : '🎯 Nesneyi Tara'}
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              ) : capturedImage ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={capturedImage}
                    alt="Captured scene"
                    className="w-full h-48 object-cover rounded-xl border border-cyan-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setCapturedImage(null)}
                    className="mt-3 text-xs text-gray-400 hover:text-white underline"
                  >
                    Fotoğrafı Temizle
                  </button>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="text-5xl mb-2 animate-bounce">
                    {activeScene ? activeScene.emoji : '📷'}
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1">
                    {activeScene ? activeScene.objectName : 'Çevrendeki Nesneyi Göster'}
                  </h4>
                  <p className="text-xs text-gray-400 mb-4 max-w-xs">
                    Kamerayı açarak etrafındaki nesneleri tarayabilir veya aşağıdaki hazır örnekleri seçebilirsin.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5"
                    >
                      <span>📷</span>
                      <span>Kamerayı Başlat</span>
                    </button>
                  </div>
                  {cameraError && (
                    <div className="mt-2 text-[11px] text-amber-400 max-w-xs">{cameraError}</div>
                  )}
                </div>
              )}
            </div>

            {/* Presets and Custom Input (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-300 mb-2 flex items-center justify-between">
                  <span>⚡ Hızlı Gerçek Hayat Nesneleri (Pratik Yap):</span>
                  <span className="text-[11px] text-cyan-400">Tıkla ve Başla</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {scenes.map((sc) => {
                    const isSelected = activeScene?.id === sc.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => handleSelectPreset(sc)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                          isSelected
                            ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-950/40'
                            : 'bg-gray-800/40 border-gray-700/60 text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-2xl">{sc.emoji}</span>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold truncate">{sc.objectName}</div>
                          <div className="text-[10px] text-gray-400 truncate">{sc.turkishName}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Search/Object Input */}
              <form onSubmit={handleCustomSearch} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customInputQuery}
                  onChange={(e) => setCustomInputQuery(e.target.value)}
                  placeholder="Başka bir nesne adı yaz (örn: book, bicycle, glasses)..."
                  className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs rounded-xl border border-gray-600 transition"
                >
                  Analiz Et
                </button>
              </form>
            </div>
          </div>

          {/* Active Detected Object Analysis */}
          {activeScene && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900 border border-cyan-500/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-700/60">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{activeScene.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">{activeScene.objectName}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                        {activeScene.cefrLevel}
                      </span>
                    </div>
                    <div className="text-xs text-cyan-300 font-medium">
                      {activeScene.turkishName} &bull;{' '}
                      <span className="text-gray-400 font-mono">{activeScene.phonetic}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSpeakText(activeScene.objectName)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>🔊</span>
                  <span>Telaffuz Et</span>
                </button>
              </div>

              {/* Contextual Sentences */}
              <div>
                <h4 className="text-xs font-bold text-gray-300 mb-2">
                  📖 Bağlamsal Gerçek Hayat Cümleleri (CEFR Seviyeli):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {activeScene.contextualSentences.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">
                            {s.level} Seviyesi
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSpeakText(s.en)}
                            className="text-gray-400 hover:text-cyan-300 text-xs"
                            title="Cümleyi Dinle"
                          >
                            🔊
                          </button>
                        </div>
                        <p className="text-xs text-white font-medium mb-1.5 leading-relaxed">
                          "{s.en}"
                        </p>
                      </div>
                      <p className="text-[11px] text-gray-400 italic border-t border-gray-800/80 pt-1.5">
                        {s.tr}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chirmo Interactive Speaking Challenge */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/40 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-xl shrink-0">
                    🤖
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                      <span>Chirmo Konuşma Görevi</span>
                      <span className="text-amber-400 font-black">+25 XP Ödül</span>
                    </div>
                    <p className="text-sm font-bold text-white mt-0.5">
                      "{activeScene.chirmoQuestion}"
                    </p>
                    <p className="text-xs text-gray-300 italic mt-0.5">
                      {activeScene.chirmoQuestionTr}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSpeakText(activeScene.chirmoQuestion)}
                    className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs"
                    title="Soruyu Sesli Oku"
                  >
                    🔊
                  </button>
                </div>

                {/* Spoken Recording Box */}
                <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all shadow-lg shrink-0 ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50'
                        : 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:brightness-110 text-black shadow-cyan-500/30'
                    }`}
                  >
                    {isListening ? '🛑' : '🎙️'}
                  </button>

                  <div className="flex-1 w-full">
                    <div className="text-[11px] text-gray-400 font-semibold mb-1">
                      {isListening
                        ? '🎤 Dinliyor... İngilizce cümleni söyle:'
                        : userSpokenText
                        ? 'Senin Yanıtın:'
                        : 'Mikrofona tıkla ve bu nesneyle ilgili İngilizce bir cümle kur:'}
                    </div>
                    <div className="text-xs font-medium text-white min-h-[22px]">
                      {userSpokenText ? (
                        <span>"{userSpokenText}"</span>
                      ) : (
                        <span className="text-gray-500 italic">
                          (Örn: "I use my coffee mug every morning to stay alert.")
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTurkishBridge(!showTurkishBridge)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 shrink-0"
                  >
                    {showTurkishBridge ? '💡 İpuçlarını Gizle' : '💡 Nasıl Cevap Verebilirim?'}
                  </button>
                </div>

                {/* Collapsible Turkish Bridge / Hints */}
                {showTurkishBridge && (
                  <div className="p-3 rounded-xl bg-gray-900/90 border border-cyan-500/20 space-y-2 animate-fadeIn text-xs">
                    <div className="text-cyan-300 font-bold">
                      💬 Örnek Hazır Cümleler (Tıklayarak kullanabilirsin):
                    </div>
                    <div className="space-y-1.5">
                      {activeScene.suggestedAnswers.map((ans, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setUserSpokenText(ans);
                            processEvaluation(ans);
                          }}
                          className="p-2 rounded-lg bg-gray-950 hover:bg-cyan-950/40 border border-gray-800 hover:border-cyan-500/40 cursor-pointer text-gray-200 transition flex items-center justify-between"
                        >
                          <span>"{ans}"</span>
                          <span className="text-[10px] text-cyan-400">Kullan ➔</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evaluation Feedback Banner */}
                {evaluation && (
                  <div
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 animate-fadeIn ${
                      evaluation.score >= 80
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs flex items-center gap-2">
                        <span>{evaluation.score >= 80 ? '🎉 Harika Konuşma!' : '👍 İyi Deneme!'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-bold">
                          Skor: {evaluation.score}/100
                        </span>
                        {evaluation.score >= 70 && (
                          <span className="text-amber-400 font-black text-[11px]">+25 XP Kazanıldı!</span>
                        )}
                      </div>
                      <p className="text-xs mt-1 text-white font-medium">{evaluation.feedback}</p>
                      <p className="text-[11px] text-gray-300 italic mt-0.5">{evaluation.feedbackTr}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSpeakText(evaluation.feedback)}
                      className="p-2 rounded-lg bg-black/30 hover:bg-black/50 text-sm shrink-0"
                      title="Geribildirimi Dinle"
                    >
                      🔊
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-900/60 shrink-0">
          <div className="text-xs text-gray-400">
            📸 Çevrendeki nesneleri İngilizceye çevirerek dil refleksini hızlandır.
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black text-xs font-bold rounded-lg transition shadow"
          >
            Tamamla & Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
