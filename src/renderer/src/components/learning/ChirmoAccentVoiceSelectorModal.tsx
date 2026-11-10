import React, { useState, useEffect } from 'react';
import {
  LearningStorageService,
  VoiceAccentConfig,
  VoiceAccentId
} from '../../services/learningStorage';
import { TargetLanguageService } from '../../services/targetLanguageService';

interface ChirmoAccentVoiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccentChange?: (accentId: VoiceAccentId) => void;
}

export const ChirmoAccentVoiceSelectorModal: React.FC<ChirmoAccentVoiceSelectorModalProps> = ({
  isOpen,
  onClose,
  onAccentChange
}) => {
  const [accents, setAccents] = useState<VoiceAccentConfig[]>([]);
  const [selectedAccentId, setSelectedAccentId] = useState<VoiceAccentId>('us');
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [customTestSentence, setCustomTestSentence] = useState<string>(
    'Learning English with Chirmo feels so natural and engaging!'
  );
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setAccents(LearningStorageService.getAvailableAccents());
      setSelectedAccentId(LearningStorageService.getSelectedAccent());
      setSpeechRate(LearningStorageService.getSpeechRate());
      const lang = TargetLanguageService.getTargetLanguage();
      setCustomTestSentence(
        lang === 'de'
          ? 'Deutsch lernen mit Chirmo macht großen Spaß und fühlt sich ganz natürlich an!'
          : lang === 'fr'
            ? 'Apprendre le français avec Chirmo est si naturel et stimulant !'
            : 'Learning English with Chirmo feels so natural and engaging!'
      );
    }
  }, [isOpen]);

  const handleSelectAccent = (id: VoiceAccentId) => {
    setSelectedAccentId(id);
  };

  const handlePreview = (accent: VoiceAccentConfig) => {
    setPreviewingId(accent.id);
    LearningStorageService.speak(accent.sampleText, accent.id, speechRate);
    setTimeout(() => {
      setPreviewingId(null);
    }, 3500);
  };

  const handleTestCustomSentence = () => {
    if (!customTestSentence.trim()) return;
    setPreviewingId('custom');
    LearningStorageService.speak(customTestSentence, selectedAccentId, speechRate);
    setTimeout(() => {
      setPreviewingId(null);
    }, 4000);
  };

  const handleSaveAndApply = () => {
    LearningStorageService.setSelectedAccent(selectedAccentId);
    LearningStorageService.setSpeechRate(speechRate);
    if (onAccentChange) {
      onAccentChange(selectedAccentId);
    }
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-gray-900 via-gray-900 to-black border border-cyan-500/30 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-2xl shadow-inner">
              🎙️
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Doğal İnsan Sesleri & Aksan Seçici
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Canlı Ses Sentezi
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Chirmo ile konuşurken duymak istediğiniz aksanı ve konuşma hızını belirleyin.
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

        {/* Content Body - Scrollable */}
        <div className="overflow-y-auto space-y-5 my-4 pr-1 text-sm custom-scrollbar flex-1">
          {/* Accent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accents.map((acc) => {
              const isSelected = selectedAccentId === acc.id;
              const isPlaying = previewingId === acc.id;

              return (
                <div
                  key={acc.id}
                  onClick={() => handleSelectAccent(acc.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all relative ${
                    isSelected
                      ? 'bg-gradient-to-br from-cyan-950/60 to-gray-900 border-cyan-400 shadow-lg shadow-cyan-950/50'
                      : 'bg-gray-800/40 border-gray-700/60 hover:bg-gray-800/70 hover:border-gray-600'
                  }`}
                >
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow">
                      ✓ Aktif
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{acc.flag}</span>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {acc.label}
                      </div>
                      <div className="text-xs text-cyan-300 font-medium">{acc.personaName}</div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2 mb-3 min-h-[32px]">
                    {acc.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-700/40">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(acc);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition ${
                        isPlaying
                          ? 'bg-cyan-500 text-black border-cyan-400 animate-pulse font-semibold'
                          : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      {isPlaying ? '🔊 Konuşuyor...' : '▶️ Örnek Dinle'}
                    </button>
                    <span className="text-[11px] text-gray-400 font-mono">{acc.lang}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Speech Rate & Speed Control */}
          <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-200 flex items-center gap-2">
                ⚡ Konuşma Hızı:
                <span className="text-cyan-400 font-bold font-mono">{speechRate.toFixed(2)}x</span>
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                {[
                  { rate: 0.75, label: '0.75x Yavaş' },
                  { rate: 0.9, label: '0.9x Önerilen' },
                  { rate: 1.0, label: '1.0x Normal' },
                  { rate: 1.15, label: '1.15x Hızlı' }
                ].map((item) => (
                  <button
                    key={item.rate}
                    type="button"
                    onClick={() => setSpeechRate(item.rate)}
                    className={`px-2 py-0.5 rounded border transition ${
                      Math.abs(speechRate - item.rate) < 0.02
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                        : 'bg-gray-900 text-gray-400 border-gray-700 hover:text-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>0.6x (Çok Yavaş)</span>
              <span>1.0x (Doğal Konuşma Hızı)</span>
              <span>1.4x (Hızlı / Akıcı)</span>
            </div>
          </div>

          {/* Custom Sentence Live Tester */}
          <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/60">
            <label className="block text-xs font-semibold text-gray-200 mb-1.5">
              🎯 Canlı Test: Kendi Cümleni Seçilen Aksanla Dinle
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTestSentence}
                onChange={(e) => setCustomTestSentence(e.target.value)}
                placeholder="Dinlemek istediğiniz İngilizce cümleyi yazın..."
                className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleTestCustomSentence}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold text-xs rounded-lg hover:brightness-110 transition shadow flex items-center gap-1.5"
              >
                {previewingId === 'custom' ? '🔊 Dinletiliyor...' : '▶️ Test Et'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {savedToast ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                ✓ Başarıyla kaydedildi ve uygulandı!
              </span>
            ) : (
              <span>Seçilen ayar tüm konuşma ve sesli pratiklerde geçerli olur.</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg transition"
            >
              Vazgeç
            </button>
            <button
              onClick={handleSaveAndApply}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black text-xs font-bold rounded-lg transition shadow-md shadow-cyan-500/20"
            >
              Aksanı Seç ve Uygula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
