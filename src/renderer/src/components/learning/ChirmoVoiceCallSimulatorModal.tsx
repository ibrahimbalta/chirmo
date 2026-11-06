import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  PhoneCall,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Trophy,
  Award,
  Flame,
  X,
  Languages,
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { CampStorageService } from '../../services/curriculumData';
import { GeminiAiTeacherService } from '../../services/geminiAiTeacherService';
import { TargetLanguageService } from '../../services/targetLanguageService';

export type CallScreenState = 'ringing' | 'in-call' | 'summary';

export interface ChirmoVoiceCallSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName?: string;
  topic?: string;
}

export const ChirmoVoiceCallSimulatorModal: React.FC<ChirmoVoiceCallSimulatorModalProps> = ({
  isOpen,
  onClose,
  callerName = 'Chirmo AI Öğretmeni',
  topic = '2 Dakikalık Günlük Kahve Molası Sohbeti'
}) => {
  const [callState, setCallState] = useState<CallScreenState>('ringing');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chirmoSpeech, setChirmoSpeech] = useState<string>('');
  const [chirmoSpeechTr, setChirmoSpeechTr] = useState<string>('');
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [turnCount, setTurnCount] = useState<number>(0);
  const [showSubtitle, setShowSubtitle] = useState<boolean>(true);
  const [isChirmoSpeaking, setIsChirmoSpeaking] = useState<boolean>(false);

  const targetLang = TargetLanguageService.getTargetLanguage();

  // Telefon Çağrısı Başlangıç Mesajları (İngilizce & Almanca)
  const englishCallScenarios = [
    {
      en: "Hey friend! It's Chirmo. I have just two quick minutes during my coffee break. How is your day going so far?",
      tr: 'Selam arkadaşım! Ben Chirmo. Kahve molamda sana hızlıca 2 dakika ayırdım. Bugünün nasıl geçiyor?'
    },
    {
      en: "Hello there! Chirmo calling for our daily speaking habit. What is one exciting thing you did today?",
      tr: 'Merhaba! Günlük konuşma alışkanlığımız için Chirmo arıyor. Bugün yaptığın heyecan verici bir şey var mı?'
    }
  ];

  const germanCallScenarios = [
    {
      en: "Hallo mein Freund! Hier ist Chirmo. Ich habe kurz zwei Minuten Pause. Wie läuft dein Tag bis jetzt?",
      tr: 'Selam arkadaşım! Ben Chirmo. İki dakika molam var. Günün şu ana kadar nasıl geçiyor?'
    },
    {
      en: "Guten Tag! Chirmo ruft für unsere tägliche Deutschpraxis an. Was hast du heute Schönes gemacht?",
      tr: 'İyi günler! Günlük Almanca pratiğimiz için Chirmo arıyor. Bugün güzel ne yaptın?'
    }
  ];

  const initialCallScenarios = targetLang === 'de' ? germanCallScenarios : englishCallScenarios;

  const englishReplySuggestions = [
    {
      en: 'My day is going great, thank you! I just had some coffee.',
      tr: 'Günüm harika geçiyor, teşekkürler! Ben de biraz kahve içtim.'
    },
    {
      en: 'I am a little busy with work, but really happy to practice English with you!',
      tr: 'İşlerle biraz meşgulüm ama seninle İngilizce pratik yapmaktan çok mutluyum!'
    },
    {
      en: 'I went for a walk this morning and the weather was very nice.',
      tr: 'Bu sabah yürüyüşe çıktım ve hava çok güzeldi.'
    }
  ];

  const germanReplySuggestions = [
    {
      en: 'Mein Tag läuft super, danke! Ich trinke gerade Kaffee.',
      tr: 'Günüm harika geçiyor, teşekkürler! Şu an kahve içiyorum.'
    },
    {
      en: 'Ich bin etwas beschäftigt, aber ich freue mich sehr, mit dir Deutsch zu sprechen!',
      tr: 'Biraz meşgulüm ama seninle Almanca konuşmaktan çok mutluyum!'
    },
    {
      en: 'Ich war heute Morgen spazieren und das Wetter war wunderschön.',
      tr: 'Bu sabah yürüyüşe çıktım ve hava çok güzeldi.'
    }
  ];

  const quickCallReplySuggestions = targetLang === 'de' ? germanReplySuggestions : englishReplySuggestions;

  // Zil Çalma & Sayaç Döngüsü
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && callState === 'in-call') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, callState]);

  // Modal Açıldığında Sıfırla
  useEffect(() => {
    if (isOpen) {
      setCallState('ringing');
      setCallDuration(0);
      setTurnCount(0);
      setUserTranscript('');
      const scenario = initialCallScenarios[Math.floor(Math.random() * initialCallScenarios.length)];
      setChirmoSpeech(scenario.en);
      setChirmoSpeechTr(scenario.tr);
    }
  }, [isOpen]);

  // Aramayı Cevapla
  const handleAnswerCall = () => {
    setCallState('in-call');
    setIsChirmoSpeaking(true);
    LearningStorageService.speak(chirmoSpeech);

    setTimeout(() => {
      setIsChirmoSpeaking(false);
      startSpeechRecognition();
    }, 4500);
  };

  // Aramayı Sonlandır
  const handleEndCall = () => {
    setCallState('summary');
    // Günlük seri ve XP ödülü
    CampStorageService.completeDayMission(1, 35);
  };

  // Web Speech API ile Kullanıcıyı Dinle
  const startSpeechRecognition = () => {
    setIsListening(true);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = targetLang === 'de' ? 'de-DE' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setUserTranscript(transcript);
          setIsListening(false);
          processUserReply(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }
  };

  // Kullanıcı Cevabını İşle ve Chirmo'nun Dönüşünü Üret
  const processUserReply = async (userText: string) => {
    setTurnCount((prev) => prev + 1);
    setIsChirmoSpeaking(true);

    try {
      const prompt = `Kullanıcı seninle 2 dakikalık hızlı bir telefon görüşmesi yapıyor.
Senin önceki cümlen: "${chirmoSpeech}".
Kullanıcının telefonda söylediği: "${userText}".

Lütfen telefonda arkadaş canlısı, neşeli ve kısa (1-2 cümle) bir İngilizce karşılık ver. Hemen ardından parantez içinde Türkçe anlamını yaz.`;

      const result = await GeminiAiTeacherService.generateTutorResponse(
        prompt,
        [],
        'Günlük 2 Dakikalık Hızlı Telefon Konuşması'
      );

      let enText = result.text;
      let trText = '';
      if (result.text.includes('(')) {
        enText = result.text.split('(')[0].trim();
        trText = result.text.split('(')[1].replace(')', '').trim();
      }

      setChirmoSpeech(enText);
      setChirmoSpeechTr(trText || 'Harika konuştun! Çok iyi gidiyorsun.');
      LearningStorageService.speak(enText);
    } catch {
      const fallbackEn = "That sounds wonderful! I am really glad we had this quick English call today.";
      const fallbackTr = "Kulağa harika geliyor! Bugün bu hızlı İngilizce aramayı yaptığımıza çok sevindim.";
      setChirmoSpeech(fallbackEn);
      setChirmoSpeechTr(fallbackTr);
      LearningStorageService.speak(fallbackEn);
    } finally {
      setTimeout(() => {
        setIsChirmoSpeaking(false);
      }, 3500);
    }
  };

  // Zaman Formatı (01:24)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      {/* Telefon Ekran Çerçevesi */}
      <div className="w-full max-w-sm sm:max-w-md h-[92vh] max-h-[720px] rounded-[36px] overflow-hidden shadow-2xl flex flex-col bg-slate-900 text-white border-4 border-slate-800 relative">
        
        {/* ==================== 1. ÇALAN TELEFON DURUMU (RINGING) ==================== */}
        {callState === 'ringing' && (
          <div className="flex-1 flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 text-center animate-pulse duration-1000">
            {/* Üst Bilgi */}
            <div className="pt-6 space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gelen Sesli Arama 📞</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {callerName}
              </h2>
              <p className="text-xs text-purple-200">{topic}</p>
            </div>

            {/* Titreşen 3D Chirmo Maskot Aurası */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-4 border-purple-500 animate-ping opacity-50 pointer-events-none" />
              <span className="absolute -inset-4 rounded-full border-2 border-indigo-400 animate-pulse opacity-40 pointer-events-none" />
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-gradient-to-tr from-purple-600 to-indigo-600 p-3 shadow-2xl flex items-center justify-center">
                <img
                  src="./chirmo-character.png"
                  alt="Chirmo Calling"
                  className="w-full h-full object-contain filter drop-shadow-md animate-wiggle"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.endsWith('/chirmo-avatar.png')) {
                      img.src = './chirmo-avatar.png';
                    }
                  }}
                />
              </div>
            </div>

            {/* Cevapla / Reddet Butonları */}
            <div className="w-full pb-6 flex items-center justify-around">
              {/* Reddet Butonu */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transition-transform active:scale-90 cursor-pointer"
                  title="Reddet"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                <span className="text-xs font-bold text-slate-300">Meşgul</span>
              </div>

              {/* Cevapla Butonu */}
              <div className="flex flex-col items-center space-y-2">
                <button
                  type="button"
                  onClick={handleAnswerCall}
                  className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/50 transition-transform active:scale-95 hover:scale-105 cursor-pointer animate-bounce"
                  title="Cevapla"
                >
                  <Phone className="w-9 h-9" />
                </button>
                <span className="text-xs font-black text-emerald-400">Yanıtla</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. AKTİF SESLİ ARAMA DURUMU (IN-CALL) ==================== */}
        {callState === 'in-call' && (
          <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-950">
            {/* Üst Arama Başlığı & Süre */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-600 p-1">
                  <img
                    src="./chirmo-character.png"
                    alt="Chirmo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{callerName}</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{formatTime(callDuration)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSubtitle(!showSubtitle)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                  showSubtitle ? 'bg-amber-400 text-purple-950' : 'bg-white/10 text-white'
                }`}
                title="Altyazı Aç / Kapat"
              >
                <Languages className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Türkçe</span>
              </button>
            </div>

            {/* Orta: Konuşan Chirmo & Canlı Altyazı */}
            <div className="my-auto py-4 space-y-4 text-center">
              {/* Ses Dalgası Aurası */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                {isChirmoSpeaking && (
                  <>
                    <span className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-60" />
                    <span className="absolute -inset-3 rounded-full border border-indigo-400 animate-pulse opacity-40" />
                  </>
                )}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 shadow-xl flex items-center justify-center">
                  <img
                    src="./chirmo-character.png"
                    alt="Chirmo"
                    className={`w-full h-full object-contain ${
                      isChirmoSpeaking ? 'animate-wiggle scale-105' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Chirmo'nun Söylediği Cümle */}
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-300">
                  <span>Chirmo Söylüyor:</span>
                  <button
                    type="button"
                    onClick={() => LearningStorageService.speak(chirmoSpeech)}
                    className="hover:underline flex items-center space-x-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Tekrar Dinle</span>
                  </button>
                </div>
                <div className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                  "{chirmoSpeech}"
                </div>
                {showSubtitle && chirmoSpeechTr && (
                  <div className="text-[11px] font-medium text-amber-200 border-t border-white/10 pt-1">
                    🇹🇷 {chirmoSpeechTr}
                  </div>
                )}
              </div>

              {/* Hızlı Cevap Seçenekleri */}
              <div className="space-y-1.5 text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Cevap Olarak Şunu Söyleyebilirsin:
                </div>
                {quickCallReplySuggestions.slice(0, 2).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUserTranscript(item.en);
                      processUserReply(item.en);
                    }}
                    className="w-full p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-700/50 text-left transition-all cursor-pointer"
                  >
                    <div className="text-xs font-bold text-purple-200 truncate">💬 {item.en}</div>
                    {showSubtitle && (
                      <div className="text-[10px] text-slate-400 truncate">🇹🇷 {item.tr}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Alt Telefon Kontrol Butonları */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-around">
              {/* Mikrofon Aç/Kapa */}
              <button
                type="button"
                onClick={() => {
                  if (isListening) {
                    setIsListening(false);
                  } else {
                    startSpeechRecognition();
                  }
                }}
                className={`p-3.5 rounded-full transition-all cursor-pointer ${
                  isListening
                    ? 'bg-amber-400 text-purple-950 animate-bounce'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
                title={isListening ? 'Dinliyor...' : 'Konuşmaya Başla'}
              >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>

              {/* Aramayı Bitir Butonu */}
              <button
                type="button"
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transition-transform active:scale-95 cursor-pointer"
                title="Görüşmeyi Sonlandır"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              {/* Hoparlör Sesi */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-full transition-all cursor-pointer ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
                title="Sesi Kapat"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== 3. GÖRÜŞME SONU KARNESİ (SUMMARY) ==================== */}
        {callState === 'summary' && (
          <div className="flex-1 flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-center animate-fade-in">
            <div className="pt-4 space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
                <Trophy className="w-8 h-8 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-white">Görüşme Tamamlandı! 🎉</h2>
              <p className="text-xs text-purple-200">
                Bugünün 2 dakikalık hızlı konuşma pratiğini başarıyla bitirdin.
              </p>
            </div>

            {/* İstatistik Rozetleri */}
            <div className="w-full grid grid-cols-3 gap-2 py-4">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
                <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <div className="text-xs font-black text-white">{formatTime(callDuration)}</div>
                <div className="text-[10px] text-slate-400">Süre</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
                <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-xs font-black text-amber-400">+35 XP</div>
                <div className="text-[10px] text-slate-400">Puan</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
                <Award className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-xs font-black text-emerald-400">%96</div>
                <div className="text-[10px] text-slate-400">Özgüven</div>
              </div>
            </div>

            {/* Kapat Butonu */}
            <div className="w-full pb-4 space-y-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer"
              >
                Harika, Ana Sayfaya Dön
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChirmoVoiceCallSimulatorModal;
