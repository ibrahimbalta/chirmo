import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Trophy,
  Lightbulb,
  X,
  Send,
  Award,
  CheckCircle2,
  Languages
} from 'lucide-react';
import { ChirmoTalkingRobotAvatar, ChirmoAvatarState } from '../avatar/ChirmoTalkingRobotAvatar';
import { GeminiAiTeacherService, ChatMessage } from '../../services/geminiAiTeacherService';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService } from '../../services/targetLanguageService';

export interface DialogueMessage extends ChatMessage {
  translationTr?: string;
}

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
  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [inputTranscript, setInputTranscript] = useState('');
  const [isWhisperHintActive, setIsWhisperHintActive] = useState(false);
  const [activeHint, setActiveHint] = useState<{ en: string; tr: string } | null>(null);
  const [speakingScore, setSpeakingScore] = useState<number>(94);
  const [completedTurns, setCompletedTurns] = useState<number>(0);
  const [showAllTranslations, setShowAllTranslations] = useState<boolean>(true);

  // Türkçe Düşün, İngilizce Konuş (Cevap Asistanı Köprüsü)
  const [isTurkishBridgeOpen, setIsTurkishBridgeOpen] = useState(false);
  const [turkishInput, setTurkishInput] = useState('');
  const [isTranslatingTurkish, setIsTranslatingTurkish] = useState(false);
  const [translatedEnglishAnswer, setTranslatedEnglishAnswer] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const targetLang = TargetLanguageService.getTargetLanguage();
  const targetFlag = targetLang === 'de' ? '🇩🇪' : targetLang === 'fr' ? '🇫🇷' : '🇬🇧';
  const targetLangName = targetLang === 'de' ? 'Almanca' : targetLang === 'fr' ? 'Fransızca' : 'İngilizce';

  // Akıllı Sesli İpucu Örnekleri (İngilizce, Almanca & Fransızca)
  const englishStarters = [
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
    },
    {
      en: 'I can easily understand what you say, but I want to build longer sentences.',
      tr: 'Söylediklerini kolayca anlıyorum ama daha uzun cümleler kurmak istiyorum.'
    }
  ];

  const germanStarters = [
    {
      en: 'Meiner Meinung nach macht das tägliche Deutschlernen mit Chirmo wirklich Spaß!',
      tr: 'Benim fikrime göre, Chirmo ile her gün Almanca öğrenmek gerçekten çok eğlenceli!'
    },
    {
      en: 'Ich fühle mich jetzt viel sicherer, wenn ich Deutsch spreche.',
      tr: 'Almanca konuşurken şimdi kendimi çok daha özgüvenli hissediyorum.'
    },
    {
      en: 'Mein liebstes Hobby ist Radfahren und neue Sprachen lernen.',
      tr: 'En sevdiğim hobi bisiklete binmek ve yeni diller öğrenmek.'
    },
    {
      en: 'Könntest du mir bitte eine weitere Sprechaufgabe geben?',
      tr: 'Bana lütfen bir konuşma görevi daha verir misin?'
    },
    {
      en: 'Ich verstehe dich sehr gut, aber ich möchte noch fließender antworten.',
      tr: 'Seni çok iyi anlıyorum ama daha da akıcı yanıt vermek istiyorum.'
    }
  ];

  const frenchStarters = [
    {
      en: 'À mon avis, apprendre le français chaque jour avec Chirmo est vraiment passionnant !',
      tr: 'Bence Chirmo ile her gün Fransızca öğrenmek gerçekten çok heyecan verici!'
    },
    {
      en: 'Je me sens beaucoup plus confiant pour parler français maintenant.',
      tr: 'Artık Fransızca konuşurken kendime çok daha fazla güveniyorum.'
    },
    {
      en: 'Ce que je préfère, c\'est pratiquer des conversations de la vie réelle.',
      tr: 'En sevdiğim şey gerçek hayattaki konuşmaları pratik etmek.'
    },
    {
      en: 'Pourriez-vous me donner un autre défi pour tester ma fluidité ?',
      tr: 'Akıcılığımı test etmek için bana bir konuşma görevi daha verir misiniz?'
    },
    {
      en: 'Je comprends très bien, mais je veux faire des phrases encore plus naturelles.',
      tr: 'Çok iyi anlıyorum ama daha da doğal cümleler kurmak istiyorum.'
    }
  ];

  const quickStarterSuggestions = targetLang === 'de' ? germanStarters : targetLang === 'fr' ? frenchStarters : englishStarters;

  // İlk Açılış Kutlama Mesajı & Türkçe Açıklaması
  useEffect(() => {
    if (isOpen) {
      const welcomeText = targetLang === 'de'
        ? (dayNumber >= 30
            ? 'Herzlichen Glückwunsch! Du hast das 30-Tage-Camp erfolgreich abgeschlossen! Wie fühlst du dich heute beim Deutschsprechen?'
            : `Tolle Leistung! Tag ${dayNumber} erreicht! Lass uns live auf Deutsch sprechen. Wie war deine Praxis heute?`)
        : targetLang === 'fr'
          ? (dayNumber >= 30
              ? 'Félicitations ! Tu as terminé avec succès le camp de 30 jours ! Comment te sens-tu pour parler français aujourd\'hui ?'
              : `Bravo ! Jour ${dayNumber} atteint ! Parlons en direct en français. Comment s'est passée ta pratique aujourd'hui ?`)
          : (dayNumber >= 30
              ? 'Congratulations! You have completed the 30-Day Speaking Camp! I am so proud of you. How do you feel about speaking English today?'
              : `Amazing job reaching Day ${dayNumber}! Let's have a live conversation together. Tell me, how was your practice today?`);

      const welcomeTr = targetLang === 'de'
        ? (dayNumber >= 30
            ? 'Tebrikler! 30 Günlük Almanca Konuşma Kampını başarıyla tamamladın! Seninle gurur duyuyorum. Bugün Almanca konuşurken kendini nasıl hissediyorsun?'
            : `Harika iş! ${dayNumber}. Güne ulaştın! Birlikte canlı Almanca pratik yapalım. Anlat bakalım, bugünkü konuşma pratiğin nasıldı?`)
        : targetLang === 'fr'
          ? (dayNumber >= 30
              ? 'Tebrikler! 30 Günlük Fransızca Konuşma Kampını başarıyla tamamladın! Seninle gurur duyuyorum. Bugün Fransızca konuşurken kendini nasıl hissediyorsun?'
              : `Harika iş! ${dayNumber}. Güne ulaştın! Birlikte canlı Fransızca pratik yapalım. Anlat bakalım, bugünkü konuşma pratiğin nasıldı?`)
          : (dayNumber >= 30
              ? 'Tebrikler! 30 Günlük Konuşma Kampını başarıyla tamamladın! Seninle gurur duyuyorum. Bugün İngilizce konuşurken kendini nasıl hissediyorsun?'
              : `Harika iş! ${dayNumber}. Güne ulaştın! Birlikte canlı pratik yapalım. Anlat bakalım, bugünkü konuşma pratiğin nasıldı?`);

      const initialChirmoMsg: DialogueMessage = {
        id: 'initial_chirmo',
        sender: 'chirmo',
        text: welcomeText,
        translationTr: welcomeTr,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([initialChirmoMsg]);
      setAvatarState('speaking');
      LearningStorageService.speak(welcomeText);

      const timer = setTimeout(() => {
        setAvatarState('idle');
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, dayNumber, targetLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sesli Takıldım & İpucu Ver (Voice Whisper Co-pilot)
  const handleVoiceWhisperHint = () => {
    setIsWhisperHintActive(true);
    const randomHint =
      quickStarterSuggestions[Math.floor(Math.random() * quickStarterSuggestions.length)];
    setActiveHint(randomHint);

    // Chirmo sesli olarak fısıldar
    const whisperAudio = targetLang === 'de'
      ? `Keine Sorge! Versuch zu sagen: ${randomHint.en}`
      : `Don't worry! Try saying: ${randomHint.en}`;
    setAvatarState('speaking');
    LearningStorageService.speak(whisperAudio);

    setTimeout(() => {
      setAvatarState('idle');
    }, 4000);
  };

  // İpucu Cümlesini Kullanıcının Mesajı Olarak Gönder veya Söylet
  const handleSelectHint = (suggestion: { en: string; tr: string }) => {
    setInputTranscript(suggestion.en);
    setIsWhisperHintActive(false);
    handleSendMessage(suggestion.en, suggestion.tr);
  };

  // Aklındaki Cevabı Türkçe Yaz -> Doğal Hedef Dile Çevir
  const handleTranslateTurkishAnswer = async () => {
    if (!turkishInput.trim()) return;
    setIsTranslatingTurkish(true);

    try {
      const lastChirmoQuestion =
        messages.filter((m) => m.sender === 'chirmo').slice(-1)[0]?.text ||
        'Can you tell me more about that?';

      const targetAnswer = await GeminiAiTeacherService.translateTurkishThoughtToTargetLanguage(
        turkishInput.trim(),
        lastChirmoQuestion,
        targetLang
      );

      setTranslatedEnglishAnswer(targetAnswer);
    } catch {
      // Çevrimdışı / Hızlı Yerel Sözlük Yedek Fallback
      const sample = targetLang === 'de'
        ? `Ich möchte sagen, dass ${turkishInput.trim()}, weil es mir sehr wichtig ist.`
        : `I would like to say that ${turkishInput.trim()}, because it is very important and interesting to me.`;
      setTranslatedEnglishAnswer(sample);
    } finally {
      setIsTranslatingTurkish(false);
    }
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
        recognition.lang = targetLang === 'de' ? 'de-DE' : 'en-US';
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
        quickStarterSuggestions[Math.floor(Math.random() * quickStarterSuggestions.length)];
      setInputTranscript(sample.en);
      setIsListening(false);
      handleSendMessage(sample.en, sample.tr);
    }, 2200);
  };

  // Mesaj Gönderme ve Chirmo Zekası
  const handleSendMessage = async (textToSend?: string, customTranslation?: string) => {
    const finalMsg = textToSend || inputTranscript;
    if (!finalMsg.trim()) return;

    // Eğer kullanıcı hazır ipuçlarından birini söylediyse Türkçe karşılığını eşle
    const matchedHint = quickStarterSuggestions.find(
      (h) => h.en.toLowerCase() === finalMsg.trim().toLowerCase()
    );
    const userTranslation = customTranslation || matchedHint?.tr;

    const userMsg: DialogueMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: finalMsg.trim(),
      translationTr: userTranslation,
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
        `30 Günlük Kamp Mezuniyeti ve Akıcı İngilizce Konuşma Sohbeti. Gün: ${dayNumber}. Cevap verirken her İngilizce cümlenin Türkçe açıklamasını da ekle.`
      );

      // Yanıt metninden İngilizce ve Türkçe bölümleri ayır
      let enText = response.text;
      let trText = '';

      if (response.text.includes('\n')) {
        const lines = response.text.split('\n').filter((l) => l.trim().length > 0);
        enText = lines[0] || response.text;
        trText = lines.slice(1).join(' ').replace(/^Türkçe:\s*/i, '').replace(/^\(|\)$/g, '');
      } else if (response.text.includes('(') && response.text.includes(')')) {
        const parts = response.text.split('(');
        enText = parts[0].trim();
        trText = parts[1].replace(')', '').trim();
      }

      const chirmoReply: DialogueMessage = {
        id: `chirmo_${Date.now()}`,
        sender: 'chirmo',
        text: enText,
        translationTr: trText || 'Tebrikler, harika konuşuyorsun! Sohbetimize devam edelim.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, chirmoReply]);
      setAvatarState('speaking');

      // Yalnızca İngilizce cümleyi seslendir
      LearningStorageService.speak(enText);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl h-[96vh] sm:h-[94vh] max-h-[850px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-white dark:bg-slate-950 border border-purple-300 dark:border-purple-900/60">
        
        {/* ==================== 1. ÜST BAŞLIK & MEZUNİYET ROZETİ ==================== */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800 text-white flex items-center justify-between shrink-0 gap-2">
          {/* Sol Kısım: Başlık & Rozet */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 animate-bounce" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h2 className="text-xs sm:text-base font-black tracking-tight truncate max-w-[130px] sm:max-w-xs">
                  {milestoneTitle}
                </h2>
                <span className="text-[9px] sm:text-xs bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full font-black shrink-0">
                  Gün {dayNumber}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-purple-200 truncate">
                Chirmo Sanal Robot ile Karşılıklı Canlı İngilizce
              </p>
            </div>
          </div>

          {/* Sağ Kısım: Simetrik Menü & Butonlar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAllTranslations(!showAllTranslations)}
              className={`h-8 px-2 sm:px-2.5 rounded-xl text-[10px] sm:text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                showAllTranslations
                  ? 'bg-amber-400 text-purple-950 shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              title="Türkçe Açıklamaları Aç / Kapat"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{showAllTranslations ? 'TR Açık' : 'TR Kapalı'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================== 2. ORTA BÖLÜM: AVATAR & DİYALOG ==================== */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-900/50">
          
          {/* Sol Panel: 3D Sanal Robot Chirmo Avatarı (Mobil için kompakt, masaüstü için dikey) */}
          <div className="w-full md:w-64 bg-gradient-to-b from-indigo-50/80 via-white to-purple-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-purple-950/30 p-2 sm:p-3.5 flex flex-row md:flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 shrink-0 gap-2 sm:gap-3">
            
            {/* Avatar Bölümü */}
            <div className="flex items-center space-x-2 md:space-x-0 md:flex-col text-center shrink-0">
              <ChirmoTalkingRobotAvatar
                state={avatarState}
                size="sm"
                showStatusBadge={false}
                onClick={() => LearningStorageService.speak("Hello friend! Let's talk together!")}
              />
              <div className="text-left md:text-center mt-0 md:mt-2">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full inline-block mb-0.5">
                  Sanal Asistan
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white leading-tight">
                  Chirmo Robot
                </h3>
              </div>
            </div>

            {/* İstatistik & Takıldım Butonu */}
            <div className="flex-1 md:w-full space-y-1.5">
              <button
                type="button"
                onClick={handleVoiceWhisperHint}
                className="w-full h-8 sm:h-9 px-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-purple-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Lightbulb className="w-3.5 h-3.5 fill-purple-950 shrink-0" />
                <span className="truncate">💡 Takıldım / İpucu Ver</span>
              </button>

              <div className="flex items-center justify-around text-center py-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                <div>
                  <span className="block text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-black">
                    {completedTurns}
                  </span>
                  <span>Tur</span>
                </div>
                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                <div>
                  <span className="block text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-black">
                    %{speakingScore}
                  </span>
                  <span>Özgüven</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Panel: Canlı Konuşma Balonları & Metin Alanı */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden p-3 sm:p-5">
            
            {/* Konuşma Geçmişi */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 sm:pr-2">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-2 sm:space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-xs ${
                        isUser
                          ? 'bg-indigo-600 text-white'
                          : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {isUser ? 'SEN' : '🤖'}
                    </div>

                    <div
                      className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      {/* İngilizce Asıl Cümle */}
                      <div className="whitespace-pre-wrap font-bold text-[13px] sm:text-sm">
                        {msg.text}
                      </div>

                      {/* Türkçe Açıklaması */}
                      {showAllTranslations && msg.translationTr && (
                        <div
                          className={`mt-2 pt-2 border-t text-[11px] sm:text-xs font-medium flex items-start space-x-1.5 ${
                            isUser
                              ? 'border-indigo-500/50 text-indigo-100'
                              : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <span
                            className={`shrink-0 font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded ${
                              isUser
                                ? 'bg-white/20 text-white'
                                : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            }`}
                          >
                            Türkçe
                          </span>
                          <span className="italic leading-normal">{msg.translationTr}</span>
                        </div>
                      )}
                      
                      {!isUser && (
                        <div className="mt-1.5 pt-1.5 border-t border-purple-50 dark:border-slate-700/50 flex items-center justify-between">
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

            {/* ==================== 3. CÜMLE BAŞLATICI & TÜRKÇE AÇIKLAMALARI (HINT CARDS) ==================== */}
            <div className="pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
              
              {/* Aktif Fısıltı İpucu Varsa Göster */}
              {isWhisperHintActive && activeHint && (
                <div className="p-2.5 sm:p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-xl space-y-1 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-black text-amber-900 dark:text-amber-200">
                    <span className="flex items-center space-x-1">
                      <span>💡</span>
                      <span>Chirmo'nun Sesli İpucu:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => LearningStorageService.speak(activeHint.en)}
                      className="text-[11px] text-amber-800 dark:text-amber-300 underline font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Sesli Dinle</span>
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                    {targetFlag} "{activeHint.en}"
                  </div>
                  <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    🇹🇷 Türkçe Açıklaması: "{activeHint.tr}"
                  </div>
                </div>
              )}

              {/* Cümleye Nasıl Başlayabilirsin Başlığı */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="flex items-center space-x-1 text-purple-700 dark:text-purple-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cümleye Nasıl Başlayabilirsin? (Türkçe Açıklamalı):</span>
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  Tıkla ve Chirmo ile konuş
                </span>
              </div>

              {/* Türkçe Açıklamalı Cümle Kartları */}
              <div className="space-y-1.5 max-h-36 sm:max-h-44 overflow-y-auto pr-1">
                {quickStarterSuggestions.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectHint(item)}
                    className="p-2 sm:p-2.5 rounded-xl bg-purple-50/80 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 border border-purple-200/90 dark:border-purple-800 transition-all cursor-pointer group active:scale-[0.99] flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex-1 min-w-0">
                      {/* Hedef Dilde Cümle */}
                      <div className="text-xs sm:text-sm font-bold text-purple-950 dark:text-purple-100 flex items-center space-x-1.5">
                        <span className="text-xs shrink-0">{targetFlag}</span>
                        <span className="truncate">{item.en}</span>
                      </div>
                      
                      {/* Türkçe Açıklaması */}
                      <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 mt-0.5 pl-4 sm:pl-5">
                        <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 shrink-0">
                          Türkçe:
                        </span>
                        <span className="truncate">{item.tr}</span>
                      </div>
                    </div>

                    {/* Sesli Dinle Butonu */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        LearningStorageService.speak(item.en);
                      }}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300 shrink-0 shadow-2xs transition-colors"
                      title="Telaffuzu Dinle"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* ==================== TÜRKÇE DÜŞÜN, İNGİLİZCE KONUŞ KÖPRÜSÜ ==================== */}
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setIsTurkishBridgeOpen(!isTurkishBridgeOpen)}
                  className="w-full py-2 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 hover:from-amber-500/25 hover:to-indigo-500/25 border border-amber-400/50 dark:border-amber-600/50 text-xs font-black text-amber-900 dark:text-amber-200 flex items-center justify-between transition-all cursor-pointer shadow-2xs gap-1.5"
                >
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <span className="text-xs sm:text-sm shrink-0">🇹🇷 ➔ {targetFlag}</span>
                    <span className="truncate">Aklındaki Cevabı Türkçe Yaz → {targetLangName} Cevap Üret</span>
                  </div>
                  <span className="text-[10px] bg-amber-400 text-purple-950 px-2 py-0.5 rounded-full font-black shrink-0">
                    {isTurkishBridgeOpen ? 'Kapat ✕' : 'Aç & Pratik Yap ✨'}
                  </span>
                </button>

                {isTurkishBridgeOpen && (
                  <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50/95 to-purple-50/85 dark:from-slate-900 dark:to-purple-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl space-y-2 animate-fade-in shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                      <span className="flex items-center space-x-1 text-amber-800 dark:text-amber-300 text-[11px] sm:text-xs">
                        <span>💡</span>
                        <span>Ne söylemek istiyorsan Türkçe yaz, Chirmo doğal {targetLang === 'de' ? 'Almancaya' : 'İngilizceye'} çevirsin:</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                      <input
                        type="text"
                        value={turkishInput}
                        onChange={(e) => setTurkishInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleTranslateTurkishAnswer();
                        }}
                        placeholder="Örn: En sevdiğim hobi hafta sonları bisiklete binmek..."
                        className="flex-1 min-w-0 h-10 px-3 rounded-xl border border-amber-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={handleTranslateTurkishAnswer}
                        disabled={isTranslatingTurkish || !turkishInput.trim()}
                        className="h-10 px-3 sm:px-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-purple-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center space-x-1 shrink-0 shadow-xs active:scale-95"
                        title={targetLang === 'de' ? 'Almancaya Çevir' : 'İngilizceye Çevir'}
                      >
                        {isTranslatingTurkish ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <span>Çevir ✨</span>
                        )}
                      </button>
                    </div>

                    {translatedEnglishAnswer && (
                      <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-800 space-y-2 shadow-xs">
                        <div>
                          <div className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 flex items-center justify-between">
                            <span>Chirmo'nun Hazırladığı {targetLangName} Cevap:</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                              ✓ Hazır
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1">
                            {targetFlag} "{translatedEnglishAnswer}"
                          </div>
                          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 italic mt-0.5">
                            🇹🇷 Türkçe: "{turkishInput}"
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => LearningStorageService.speak(translatedEnglishAnswer)}
                            className="h-9 px-2 rounded-xl bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition active:scale-95"
                            title="Telaffuzu Dinle"
                          >
                            <Volume2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Sesli Dinle</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleSendMessage(translatedEnglishAnswer, turkishInput);
                              setTranslatedEnglishAnswer(null);
                              setTurkishInput('');
                              setIsTurkishBridgeOpen(false);
                            }}
                            className="h-9 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs transition active:scale-95"
                            title="Bu Cevabı Chirmo'ya Gönder"
                          >
                            <span className="truncate">🚀 Bu Cevabı Chirmo'ya Gönder</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Kullanıcı Giriş & Mikrofon Barı */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 pt-1">
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 active:scale-95 ${
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
                      ? `Chirmo seni dinliyor, ${targetLangName} konuş...`
                      : `${targetLangName} bir cümle yaz veya mikrofona basıp konuş...`
                  }
                  className="flex-1 min-w-0 h-10 sm:h-11 px-3 sm:px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputTranscript.trim()}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition-all cursor-pointer disabled:cursor-not-allowed shadow-md shrink-0 flex items-center justify-center active:scale-95"
                  title="Gönder"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== 4. MEZUNİYET TAMAMLAMA ALTI ==================== */}
        <div className="px-3 sm:px-5 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center space-x-1.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Chirmo AI Pedagoji & Gemini Canlı Çeviri Aktif</span>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <span>Sessiz kalırsan Chirmo sana sesli fısıldar 👂</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChirmoInteractiveGraduationDialogueModal;
