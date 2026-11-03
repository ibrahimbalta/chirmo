import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  BookmarkPlus,
  Check,
  Send,
  Mic,
  MicOff,
  BookOpen,
  MessageSquare,
  HelpCircle,
  X,
  Languages,
  ArrowRight,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { CEFRLevel, VocabularyWord } from '../../types';
import { LearningStorageService, BUILTIN_DICTIONARY } from '../../services/learningStorage';

interface AiTutorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText?: string;
  userLevel: CEFRLevel;
  onWordAdded?: (word: VocabularyWord) => void;
}

export const AiTutorSidebar: React.FC<AiTutorSidebarProps> = ({
  isOpen,
  onClose,
  selectedText = 'Artificial intelligence is helping businesses improve their services and reduce costs.',
  userLevel,
  onWordAdded
}) => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'chat' | 'speech'>('analyze');
  const [inputText, setInputText] = useState(selectedText);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'tutor'; text: string; time: string }>>([
    {
      sender: 'tutor',
      text: `Hello! I am your Chirmo AI English Tutor. You are currently browsing at level **${userLevel}**.\n\nYou can highlight any English sentence or word on the page, and I will explain the grammar, vocabulary, and daily nuances. How can I help you today?`,
      time: '12:00'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingResult, setRecordingResult] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  // Derive analysis from the current text
  const cleanWordMatch = inputText.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') || 'improve';
  const wordInfo = BUILTIN_DICTIONARY[cleanWordMatch] || {
    translation: 'Geliştirmek, iyileştirmek',
    phonetic: '/ɪmˈpruːv/',
    partOfSpeech: 'Fiil (Verb)',
    level: 'B1' as CEFRLevel,
    exampleSentence: inputText,
    exampleTranslation: 'Yapay zekâ işletmelerin hizmetlerini geliştirmelerine ve maliyetleri düşürmelerine yardımcı oluyor.',
    synonyms: ['enhance', 'upgrade', 'better'],
    explanation: 'Bu cümledeki fiil yapısı, "is helping" (şimdiki zaman yardım fiili) sonrasında yalın mastar (bare infinitive) olarak kullanılmıştır.'
  };

  const handleSpeak = (textToSpeak: string) => {
    LearningStorageService.speak(textToSpeak);
  };

  const handleSaveToVault = () => {
    const newWord = LearningStorageService.addWord({
      word: cleanWordMatch,
      translation: wordInfo.translation,
      phonetic: wordInfo.phonetic,
      partOfSpeech: wordInfo.partOfSpeech,
      level: wordInfo.level,
      exampleSentence: wordInfo.exampleSentence,
      exampleTranslation: wordInfo.exampleTranslation
    });
    setIsSaved(true);
    if (onWordAdded) onWordAdded(newWord);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSendChat = (prompt?: string) => {
    const q = prompt || chatInput.trim();
    if (!q) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!prompt) setChatInput('');

    // Pedagogical dynamic response based on query
    setTimeout(() => {
      let reply = '';
      if (q.toLowerCase().includes('resmi') || q.toLowerCase().includes('formal')) {
        reply = `Bu cümleyi daha resmi (formal / business) bir dille şöyle ifade edebilirsin:\n\n**"Artificial intelligence facilitates enterprise efficiency and significantly mitigates operational expenditure."**\n\n*İpucu: "help" yerine "facilitate", "reduce costs" yerine "mitigate expenditure" tercih edilir.*`;
      } else if (q.toLowerCase().includes('gramer') || q.toLowerCase().includes('yapı')) {
        reply = `**Gramer İncelemesi (${userLevel} Seviyesi):**\n\n1. **Özne:** *Artificial intelligence* (Tekil üçüncü şahıs)\n2. **Yüklem:** *is helping* (Present Continuous Tense)\n3. **Nesne ve Tamlayıcı:** *businesses improve...* ("help someone do something" yapısı - ikinci fiil to almadan yalın gelir).\n\nGünlük konuşmada "help to improve" yerine doğrudan "help improve" daha doğaldır.`;
      } else if (q.toLowerCase().includes('örnek') || q.toLowerCase().includes('cümle')) {
        reply = `İşte günlük hayattan 2 harika örnek:\n\n1. *"Daily walking can greatly improve your mood."* (Günlük yürüyüş ruh halini büyük ölçüde iyileştirebilir.)\n2. *"We must reduce our plastic usage immediately."* (Plastik kullanımımızı derhal azaltmalıyız.)`;
      } else {
        reply = `Harika bir soru! "${q}" konusuyla ilgili olarak: Seçili içeriği seviyenize (**${userLevel}**) göre uyarladığımızda, en önemli nokta kelimelerin tek tek çevirisinden ziyade cümlenin akışını hissetmektir. İsterseniz bu kelimeyle mini bir telaffuz alıştırması yapalım!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'tutor' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 400);
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingResult(null);
      setTimeout(() => {
        setIsRecording(false);
        setRecordingResult('Harika telaffuz! Doğruluk: %94. Vurgu (stress) ilk hecede çok başarılı.');
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <aside className="w-84 xl:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full z-20 shrink-0 shadow-lg select-text">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
              <span>Chirmo AI Öğretmen</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {userLevel} Seviye
              </span>
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Sayfa bağlamında akıllı İngilizce koçu</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-800"
          title="Paneli Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-xs">
        <button
          onClick={() => setActiveTab('analyze')}
          className={`flex-1 py-2 px-3 font-medium flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'analyze'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Analiz & Anlam</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-3 font-medium flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'chat'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>AI Sohbet</span>
        </button>

        <button
          onClick={() => setActiveTab('speech')}
          className={`flex-1 py-2 px-3 font-medium flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'speech'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Telaffuz</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'analyze' && (
          <div className="space-y-4">
            {/* Cümlenin / Kelimenin Kendisi */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  İncelenen Metin
                </span>
                <button
                  onClick={() => handleSpeak(inputText)}
                  className="p-1 rounded text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 flex items-center space-x-1 text-[11px]"
                  title="Metni Seslendir"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">Dinle</span>
                </button>
              </div>
              <p className="text-xs font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
                "{inputText}"
              </p>
            </div>

            {/* Kelime Kartı & Seviye */}
            <div className="p-4 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 dark:from-slate-800/80 dark:to-slate-800/40 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                      {cleanWordMatch}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {wordInfo.phonetic}
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                      {wordInfo.level}
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                    {wordInfo.partOfSpeech}
                  </span>
                </div>

                <button
                  onClick={handleSaveToVault}
                  disabled={isSaved}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {isSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Kaydedildi' : 'Deftere Ekle'}</span>
                </button>
              </div>

              {/* Türkçe Anlamı */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-400 block font-medium">Türkçe Karşılığı</span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {wordInfo.translation}
                </p>
              </div>

              {/* Bağlamsal Örnek Cümle */}
              <div className="p-2.5 bg-white/80 dark:bg-slate-900/60 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-1">
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  "{wordInfo.exampleSentence}"
                </p>
                <p className="text-slate-500 dark:text-slate-400 italic">
                  "{wordInfo.exampleTranslation}"
                </p>
              </div>

              {/* Eş Anlamlılar */}
              {wordInfo.synonyms && wordInfo.synonyms.length > 0 && (
                <div className="flex items-center space-x-1.5 flex-wrap pt-1 text-[11px]">
                  <span className="text-slate-400">Eş Anlamlılar:</span>
                  {wordInfo.synonyms.map((syn) => (
                    <span
                      key={syn}
                      className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-medium"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* AI Gramer ve Seviye Açıklaması */}
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-xl space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-400 text-xs font-bold">
                <Lightbulb className="w-4 h-4" />
                <span>Öğretmen İpucu ({userLevel} Seviyesine Özel)</span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {wordInfo.explanation}
              </p>
            </div>

            {/* Hızlı Eylemler */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                AI'ya Hızlı Sor
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendChat('Bu cümleyi daha resmi (formal) nasıl yazabilirim?');
                  }}
                  className="p-2 text-left rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  💼 Daha resmi yap
                </button>
                <button
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendChat('Bu cümlenin gramer yapısını ayrıntılı açıkla.');
                  }}
                  className="p-2 text-left rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  📐 Gramerini açıkla
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-full space-y-3">
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 px-1 mt-0.5">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center space-x-1.5"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="İngilizce veya Türkçe bir şey sor..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'speech' && (
          <div className="space-y-4 text-center py-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Telaffuz Edilecek Cümle
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                "{wordInfo.exampleSentence}"
              </p>
              <button
                onClick={() => handleSpeak(wordInfo.exampleSentence)}
                className="inline-flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline pt-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Doğru Okunuşu Dinle</span>
              </button>
            </div>

            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <button
                onClick={handleToggleRecord}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-400/40'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white hover:scale-105'
                }`}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {isRecording ? 'Dinleniyor... Lütfen cümleyi sesli okuyun.' : 'Mikrofona basarak konuş'}
              </span>
            </div>

            {recordingResult && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1 text-left">
                <div className="flex items-center space-x-1.5 font-bold">
                  <Check className="w-4 h-4" />
                  <span>Değerlendirme Sonucu</span>
                </div>
                <p className="leading-relaxed">{recordingResult}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
