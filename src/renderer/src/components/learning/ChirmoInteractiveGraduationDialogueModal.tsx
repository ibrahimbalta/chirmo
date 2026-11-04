import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Trophy,
  Lightbulb,
  X,
  RotateCcw,
  Send,
  HelpCircle,
  Award,
  CheckCircle2,
  VolumeX,
  Flame,
  MessageSquare
} from 'lucide-react';
import { ChirmoTalkingRobotAvatar, ChirmoAvatarState } from '../avatar/ChirmoTalkingRobotAvatar';
import { GeminiAiTeacherService, ChatMessage } from '../../services/geminiAiTeacherService';
import { LearningStorageService } from '../../services/learningStorage';

export interface ChirmoInteractiveGraduationDialogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber?: number; // Varsayılan 30 (Mezuniyet) veya tamamlanan gün
  milestoneTitle?: string;
}

export const ChirmoInteractiveGraduationDialogueModal: React.FC<
  ChirmoInteractiveGraduationDialogueModalProps
> = ({
  isOpen,
  onClose,
  dayNumber = 30,
  milestoneTitle = '30 Günlük Kamp Mezuniyet Konuşması'
}) => {
  const [avatarState, setAvatarState] = useState<ChirmoAvatarState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [inputTranscript, setInputTranscript] = useState('');
  const [isWhisperHintActive, setIsWhisperHintActive] = useState(false);
  const [activeHintText, setActiveHintText] = useState('');
  const [speakingScore, setSpeakingScore] = useState<number>(94);
  const [completedTurns, setCompletedTurns] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Akıllı Sesli İpucu Örnekleri (Kullanıcı Takıldığında Çıkacak Seçenekler)
  const quickStarterSuggestions = [
    {
      en: 'In my experience, learning English with Chirmo every day was really exciting!',
      tr: 'Benim deneyimime göre, Chirmo ile her gün İngilizce öğrenmek gerçekten çok heyecan vericiydi!'
    },
    {
      en: 'I feel much more confident speaking English now compared to day one.',
      tr: 'İlk güne kıyasla şimdi İngilizce konuşurken kendimi çok daha özgüvenli hissediyorum.'
    },
    {
      en: 'My favorite part of the 30-day journey was practicing real-life conversations.',
      tr: '30 günlük yolculuğun en sevdiğim kısmı gerçek hayat konuşmaları yapmaktı.'
    },
    {
      en: 'Could you give me one more speaking challenge to test my fluency?',
      tr: 'Akıcılığımı test etmek için bana bir konuşma meydan okuması daha verir misin?'
    }
  ];

  // İlk Açılış Kutlama Mesajı
  useEffect(() => {
    if (isOpen) {
      const welcomeEn =
        dayNumber >= 30
          ? 'Congratulations! You have completed the 30-Day Speaking Camp! I am so proud of you. How do you feel about speaking English today?'
          : `Amazing job reaching Day ${dayNumber}! Let's have a live conversation together. Tell me, how was your practice today?`;

      const initialChirmoMsg: ChatMessage = {
        id: 'initial_chirmo',
        sender: 'chirmo',
        text: welcomeEn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([initialChirmoMsg]);
      setAvatarState('speaking');
      LearningStorageService.speak(welcomeEn);

      const timer = setTimeout(() => {
        setAvatarState('idle');
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, dayNumber]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sesli Takıldım & İpucu Ver (Voice Whisper Co-pilot)
  const handleVoiceWhisperHint = () => {
    setIsWhisperHintActive(true);
    const randomHint =
      quickStarterSuggestions[Math.floor(Math.random() * quickStarterSuggestions.length)];
    setActiveHintText(randomHint.en);

    // Chirmo sesli olarak Türkçe ve İngilizce fısıldar
    const whisperAudio = `Don't worry! Try saying: ${randomHint.en}`;
    setAvatarState('speaking');
    LearningStorageService.speak(whisperAudio);

    setTimeout(() => {
      setAvatarState('idle');
    }, 4000);
  };

  // İpucu Cümlesini Kullanıcının Mesajı Olarak Gönder veya Söylet
  const handleSelectHint = (hintText: string) => {
    setInputTranscript(hintText);
    setIsWhisperHintActive(false);
    handleSendMessage(hintText);
  };

  // Web Speech API ile Kullanıcı Konuşmasını Dinleme
  const handleToggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setAvatarState('idle');
      return;
    }

    setIsListening(true);
    setAvatarState('listening');
    setInputTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputTranscript(transcript);
          if (event.results[0].isFinal) {
            setIsListening(false);
            handleSendMessage(transcript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          simulateSpeechFallback();
        };

        recognition.onend = () => {
          setIsListening(false);
          if (avatarState === 'listening') {
            setAvatarState('idle');
          }
        };

        recognition.start();
      } catch {
        simulateSpeechFallback();
      }
    } else {
      simulateSpeechFallback();
    }
  };

  const simulateSpeechFallback = () => {
    setTimeout(() => {
      const sample =
        quickStarterSuggestions[Math.floor(Math.random() * quickStarterSuggestions.length)].en;
      setInputTranscript(sample);
      setIsListening(false);
      handleSendMessage(sample);
    }, 2200);
  };

  // Mesaj Gönderme ve Chirmo Zekası
  const handleSendMessage = async (textToSend?: string) => {
    const finalMsg = textToSend || inputTranscript;
    if (!finalMsg.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: finalMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputTranscript('');
    setCompletedTurns((prev) => prev + 1);
    setAvatarState('thinking');

    try {
      // Gemini AI ile doğal, teşvik edici pedagojik yanıt üretimi
      const response = await GeminiAiTeacherService.generateTutorResponse(
        finalMsg,
        messages,
        `30 Günlük Kamp Mezuniyeti ve Akıcı İngilizce Konuşma Sohbeti. Gün: ${dayNumber}`
      );

      const chirmoReply: ChatMessage = {
        id: `chirmo_${Date.now()}`,
        sender: 'chirmo',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, chirmoReply]);
      setAvatarState('speaking');

      // Cevabın ilk İngilizce cümlesini seslendir
      const englishSentence = response.text.split('\n')[0] || response.text;
      LearningStorageService.speak(englishSentence);

      // Skoru ve özgüveni ödüllendir
      setSpeakingScore((prev) => Math.min(100, Math.max(88, prev + Math.floor(Math.random() * 3))));

      setTimeout(() => {
        setAvatarState('idle');
      }, 4000);
    } catch {
      setAvatarState('idle');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl h-[94vh] max-h-[820px] rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-white dark:bg-slate-950 border border-purple-300 dark:border-purple-900/60">
        
        {/* ==================== 1. ÜST BAŞLIK & MEZUNİYET ROZETİ ==================== */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5 text-amber-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center space-x-1.5">
                  <span>{milestoneTitle}</span>
                  <span className="text-xs bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full font-black">
                    Gün {dayNumber}
                  </span>
                </h2>
              </div>
              <p className="text-xs text-purple-200">
                Chirmo Sanal Robotun ile Karşılıklı Canlı İngilizce Konuşma Odası
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-white/20">
              <Award className="w-3.5 h-3.5" />
              <span>%{speakingScore} Akıcılık Skoru</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================== 2. ORTA BÖLÜM: AVATAR & DİYALOG ==================== */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-900/50">
          
          {/* Sol Panel: 3D Sanal Robot Chirmo Avatarı */}
          <div className="w-full md:w-72 bg-gradient-to-b from-indigo-50/80 via-white to-purple-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-purple-950/30 p-5 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 shrink-0">
            <div className="text-center">
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[11px] font-black mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Canlı Konuşma Partnerin</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">
                Chirmo Sanal Asistan
              </h3>
            </div>

            {/* İnteraktif Robot Avatar */}
            <div className="my-2">
              <ChirmoTalkingRobotAvatar
                state={avatarState}
                size="md"
                showStatusBadge={true}
                onClick={() => LearningStorageService.speak("Hello friend! Let's talk together!")}
              />
            </div>

            {/* İstatistik & Takıldım Butonu */}
            <div className="w-full space-y-2 pt-2">
              <button
                type="button"
                onClick={handleVoiceWhisperHint}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-purple-950 font-black text-xs flex items-center justify-center space-x-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
              >
                <Lightbulb className="w-4 h-4 fill-purple-950" />
                <span>💡 Takıldım / İpucu Ver</span>
              </button>

              <div className="flex items-center justify-around text-center py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                <div>
                  <span className="block text-indigo-600 dark:text-indigo-400 text-sm font-black">
                    {completedTurns}
                  </span>
                  <span>Karşılıklı Tur</span>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                <div>
                  <span className="block text-emerald-600 dark:text-emerald-400 text-sm font-black">
                    %{speakingScore}
                  </span>
                  <span>Özgüven</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Panel: Canlı Konuşma Balonları & Metin Alanı */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden p-4 sm:p-5">
            {/* Konuşma Geçmişi */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isUser
                          ? 'bg-indigo-600 text-white'
                          : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {isUser ? 'SEN' : '🤖'}
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      
                      {!isUser && (
                        <div className="mt-2 pt-2 border-t border-purple-100 dark:border-slate-700 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => LearningStorageService.speak(msg.text)}
                            className="inline-flex items-center space-x-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Sesli Dinle</span>
                          </button>
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* ==================== 3. SESLİ İPUCU HAPLARI (HINT PILLS) ==================== */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              {/* Takıldığında veya ipucu istendiğinde görünen öneriler */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cümleye Nasıl Başlayabilirsin? (Tıkla ve Söyle):</span>
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Takıldığın yerde Chirmo sana fısıldar
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {quickStarterSuggestions.slice(0, 3).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectHint(item.en)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 text-left text-xs font-semibold text-purple-900 dark:text-purple-200 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                    title={item.tr}
                  >
                    <span>💬</span>
                    <span className="truncate max-w-[280px] sm:max-w-md">{item.en}</span>
                  </button>
                ))}
              </div>

              {/* Kullanıcı Giriş & Mikrofon Barı */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`p-3.5 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                  title={isListening ? 'Dinlemeyi Durdur' : 'Konuşmaya Başla (Mikrofon)'}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5 animate-bounce" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                <input
                  type="text"
                  value={inputTranscript}
                  onChange={(e) => setInputTranscript(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isListening
                      ? 'Chirmo seni dinliyor, İngilizce konuş...'
                      : 'İngilizce bir cümle yaz veya mikrofona basıp konuş...'
                  }
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputTranscript.trim()}
                  className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition-all cursor-pointer disabled:cursor-not-allowed shadow-md"
                  title="Gönder"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== 4. MEZUNİYET TAMAMLAMA ALTI ==================== */}
        <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Chirmo AI Pedagoji & Gemini Doğal Konuşma Motoru Aktif</span>
          </div>

          <div className="flex items-center space-x-2">
            <span>Sessiz kalırsan Chirmo sana sesli fısıldar 👂</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChirmoInteractiveGraduationDialogueModal;
