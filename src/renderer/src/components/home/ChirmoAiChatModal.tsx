import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Volume2,
  Mic,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Key
} from 'lucide-react';
import { GeminiAiTeacherService, ChatMessage } from '../../services/geminiAiTeacherService';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

interface ChirmoAiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export const ChirmoAiChatModal: React.FC<ChirmoAiChatModalProps> = ({
  isOpen,
  onClose,
  initialMessage
}) => {
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(() => TargetLanguageService.getTargetLanguage());

  useEffect(() => {
    return TargetLanguageService.subscribe((lang) => setTargetLang(lang));
  }, []);

  const defaultGreeting = initialMessage || (
    targetLang === 'de'
      ? 'Sollen wir heute lernen, wie man im Restaurant bestellt? 🍽️'
      : targetLang === 'fr'
        ? 'Voulez-vous apprendre comment commander au restaurant aujourd\'hui ? 🍽️'
        : 'Bugün restoranda nasıl sipariş verileceğini öğrenelim mi? 🍽️'
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'chirmo',
      text: defaultGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => GeminiAiTeacherService.getApiKey());
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await GeminiAiTeacherService.generateTutorResponse(text, messages);
      const chirmoMsg: ChatMessage = {
        id: `c-${Date.now()}`,
        sender: 'chirmo',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, chirmoMsg]);
      // Doğal sesli okuma
      handleSpeak(response.text);
    } catch {
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        sender: 'chirmo',
        text: 'I am right here with you! Let us try again: What would you like to practice? (Yanındayım! Tekrar deneyelim: Hangi konuda pratik yapmak istersin?)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      GeminiAiTeacherService.setApiKey(apiKeyInput.trim());
      setIsEditingKey(false);
      alert('Gemini API anahtarı başarıyla güncellendi!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl h-[620px] max-h-[92vh] rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">

        {/* Modal Başlığı */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/80 dark:from-slate-900 dark:to-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-1 flex items-center justify-center shadow-md shrink-0">
              <img
                src="./chirmo-avatar.png"
                alt="Chirmo AI"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  Chirmo AI Öğretmeni
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Google Gemini Canlı</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Sesli, cesaretlendirici ve seviyene özel akıllı {targetLang === 'de' ? 'Almanca' : targetLang === 'fr' ? 'Fransızca' : 'İngilizce'} konuşma arkadaşın
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setIsEditingKey(!isEditingKey)}
              className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Gemini API Anahtarını Yönet"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Ayar Kutusu (İsteğe Bağlı Genişletilebilir) */}
        {isEditingKey && (
          <div className="p-3 bg-purple-50 dark:bg-slate-800/80 border-b border-purple-200 dark:border-slate-700 flex items-center space-x-2 text-xs">
            <span className="font-bold text-purple-900 dark:text-purple-200 shrink-0">API Key:</span>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Gemini API Anahtarınızı yapıştırın..."
              className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-slate-600 text-xs font-mono"
            />
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs cursor-pointer"
            >
              Kaydet
            </button>
          </div>
        )}

        {/* Mesaj Akışı */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((msg) => {
            const isChirmo = msg.sender === 'chirmo';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isChirmo ? 'justify-start' : 'justify-end'}`}
              >
                {isChirmo && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-sm shrink-0 border border-purple-200">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-3.5 sm:p-4 text-xs sm:text-sm space-y-1.5 shadow-xs ${
                    isChirmo
                      ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-purple-100 dark:border-slate-800 rounded-tl-xs'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-tr-xs shadow-md shadow-purple-500/15'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-[10px] ${
                        isChirmo ? 'text-slate-400' : 'text-purple-200'
                      }`}
                    >
                      {msg.timestamp}
                    </span>

                    {isChirmo && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(msg.text)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 p-1 rounded-full hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Sesli Dinle"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {!isChirmo && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic pl-11">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-200" />
              <span>Chirmo yanıt hazırlıyor...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Akıllı Takılmayan İpucu Kolları (3 Seviyeli Konuşma Önerileri) */}
        <div className="p-2 sm:px-4 bg-[#fbfaff] dark:bg-slate-900 border-t border-purple-100 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-purple-700 dark:text-purple-300">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Ne Diyeceğini Bilemeyenler İçin Hazır Cevap İpuçları:</span>
            </span>
            <span className="text-slate-400 font-bold lowercase">seç & anında seslendir</span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {[
              { level: '🟢 Kolay', text: 'Water, please.', tr: 'Su lütfen.' },
              { level: '🟡 Doğal', text: 'Can I have the menu, please?', tr: 'Menüyü alabilir miyim?' },
              { level: '🔵 İleri', text: 'What do you recommend today?', tr: 'Bugün ne tavsiye edersiniz?' }
            ].map((tip) => (
              <button
                key={tip.text}
                type="button"
                onClick={() => {
                  setInputText(tip.text);
                  handleSpeak(tip.text);
                }}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50/70 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                title={`${tip.tr} (Tıkla ve dinle)`}
              >
                <span className="text-[10px]">{tip.level}:</span>
                <span className="font-black text-purple-900 dark:text-purple-200">"{tip.text}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hızlı Başlangıç Butonları */}
        <div className="p-2 sm:px-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto">
          {[
            'Restoranda sipariş verelim 🍽️',
            'Bana pratik bir soru sor 🌟',
            'Kendimi nasıl tanıtırım? 🤝',
            'Cümlemi düzeltir misin? ✍️'
          ].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 hover:text-purple-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Mesaj Gönderme Kutusu */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              targetLang === 'de'
                ? "Almanca veya Türkçe bir şey yazın (örn: Ich möchte einen Kaffee)..."
                : targetLang === 'fr'
                  ? "Fransızca veya Türkçe bir şey yazın (örn: Je voudrais un café)..."
                  : "İngilizce veya Türkçe bir şey yazın (örn: I want a coffee)..."
            }
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`p-3 rounded-2xl font-bold transition-all flex items-center justify-center cursor-pointer ${
              inputText.trim() && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/20 hover:scale-105 active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
            title="Mesaj Gönder"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChirmoAiChatModal;
