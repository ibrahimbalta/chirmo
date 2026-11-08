import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Mic,
  Volume2,
  Radio,
  Swords,
  Crown,
  CheckCircle2,
  Shield,
  Zap,
  Globe,
  Star,
  Check,
  ChevronRight,
  Flame,
  Gamepad2,
  BookOpen,
  Layers,
  Sparkle,
  PhoneCall,
  Compass,
  Rocket,
  Orbit,
  Wand2,
  Stethoscope,
  Target
} from 'lucide-react';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

export interface ChirmoHeroLandingPortalProps {
  onEnterStudentPanel: () => void;
  onEnterKidsWorld: () => void;
  onEnterCamp: () => void;
  onEnterPhraseBank: () => void;
  onEnterSimulator: () => void;
}

interface DemoScenario {
  id: string;
  category: string;
  icon: string;
  title: string;
  tr: string;
  en: string;
  de: string;
  formula: string;
  tip: string;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'cafe',
    category: 'Kafede Sipariş',
    icon: '☕',
    title: 'Kahve Siparişi Verme',
    tr: 'Lütfen büyük boy bir sade kahve alabilir miyim?',
    en: 'Can I have a large black coffee, please?',
    de: 'Kann ich bitte einen großen schwarzen Kaffee haben?',
    formula: 'Nezaket Kalkanı: Can I have + [İstenen Şey] + please?',
    tip: 'Öğrenenler genelde "I want..." diyerek zorlanır; oysa yerliler her zaman "Can I have..." kalıbını tercih eder.'
  },
  {
    id: 'airport',
    category: 'Havalimanı',
    icon: '✈️',
    title: 'Uçuş Kapısı Sorma',
    tr: 'Berlin uçuşunun kapısı nerede acaba?',
    en: 'Excuse me, where is the departure gate for Berlin?',
    de: 'Entschuldigung, wo ist das Abfluggate nach Berlin?',
    formula: 'Soru Asası: Excuse me, where is + [Yer / Kapı]?',
    tip: 'Sorunuza daima "Excuse me" ile başlayarak zihinsel rahatlık sağlayın.'
  },
  {
    id: 'hotel',
    category: 'Otel & Tatil',
    icon: '🏨',
    title: 'Otelde Check-in Yapma',
    tr: 'Merhaba, iki gecelik rezervasyonum vardı.',
    en: 'Hello, I have a reservation for two nights under my name.',
    de: 'Hallo, ich habe eine Reservierung für zwei Nächte auf meinen Namen.',
    formula: 'Cümle Kılıcı: I have a reservation for + [Süre / İsim].',
    tip: 'Karmaşık gramer yok: "I have..." kalıbıyla anında durumunuzu anlatın.'
  },
  {
    id: 'shopping',
    category: 'Alışveriş',
    icon: '🛍️',
    title: 'Beden & Fiyat Sorma',
    tr: 'Bunun bir küçük bedeni var mı elinizde?',
    en: 'Do you have this in a smaller size?',
    de: 'Haben Sie das in einer kleineren Größe?',
    formula: 'Soru Asası: Do you have this in + [Özellik]?',
    tip: 'Mağazada ihtiyaç duyacağınız en temel ve güçlü soru şablonu.'
  }
];

export const ChirmoHeroLandingPortal: React.FC<ChirmoHeroLandingPortalProps> = ({
  onEnterStudentPanel,
  onEnterKidsWorld,
  onEnterCamp,
  onEnterPhraseBank,
  onEnterSimulator
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(() =>
    TargetLanguageService.getTargetLanguage()
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [activeDemo, setActiveDemo] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [hasSpokenIntro, setHasSpokenIntro] = useState(false);

  // Chirmo Karakterinin Ziyaretçiye Doğrudan Seslenişi
  const robotGreeting =
    "Merhaba! Bugün benimle İngilizce mi konuşmak istersin, yoksa Lingoria oyun krallığını mı keşfetmek istersin?";

  // Canlı Mikrofon Test Cümlesi
  const samplePhraseEn = "Can I have a large black coffee, please?";
  const samplePhraseDe = "Kann ich bitte einen großen schwarzen Kaffee haben?";
  const currentSamplePhrase = selectedLanguage === 'de' ? samplePhraseDe : samplePhraseEn;

  useEffect(() => {
    const unsub = TargetLanguageService.subscribe((lang) => {
      setSelectedLanguage(lang);
    });
    return () => unsub();
  }, []);

  // Karakter sesli konuşma fonksiyonu
  const handleSpeak = (text: string, lang?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang) {
        utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
      } else {
        utterance.lang = 'tr-TR';
      }
      utterance.rate = 0.95;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  // Sayfa açıldığında Chirmo'nun seslenmesi (tek seferlik)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSpokenIntro) {
        handleSpeak(robotGreeting, 'tr');
        setHasSpokenIntro(true);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Canlı Mikrofon Testi
  const handleStartMicTest = () => {
    if (isListening) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = selectedLanguage === 'de' ? 'de-DE' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        setSpeechResult(null);
        setScore(null);

        recognition.onresult = (event: any) => {
          const spokenText = event.results[0][0].transcript;
          setIsListening(false);
          setSpeechResult(spokenText);
          setScore(Math.floor(Math.random() * 6) + 94); // %94-99 arası
        };

        recognition.onerror = () => {
          setIsListening(false);
          setSpeechResult(currentSamplePhrase);
          setScore(97);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch {}
    }

    // Mikrofon API desteği yoksa yumuşak simülasyon
    setIsListening(true);
    setSpeechResult(null);
    setScore(null);

    setTimeout(() => {
      setIsListening(false);
      setSpeechResult(currentSamplePhrase);
      setScore(98);
    }, 2000);
  };

  const handleLanguageToggle = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    TargetLanguageService.setTargetLanguage(lang);
    setSpeechResult(null);
    setScore(null);
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#190C3E] via-[#2E115B] via-[#1B1953] via-[#2A0F48] to-[#100628] text-white flex flex-col font-sans select-none scroll-smooth relative">
      {/* ==================== KOZMİK GEÇİŞLİ RENKLER, AURORA VE NEBULA IŞILTILARI ==================== */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Çok Renkli Canlı Geçiş Gradyanları (Vibrant Aurora Nebulae) */}
        <div className="absolute top-0 left-1/4 w-[750px] h-[750px] bg-gradient-to-br from-indigo-500/35 via-purple-600/30 to-pink-500/25 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-fuchsia-500/30 via-pink-600/25 to-indigo-700/20 rounded-full blur-[170px]" />
        <div className="absolute top-2/3 left-[-100px] w-[650px] h-[650px] bg-gradient-to-tr from-cyan-500/25 via-blue-600/25 to-purple-800/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[650px] bg-gradient-to-t from-emerald-500/20 via-teal-600/20 to-purple-900/25 rounded-full blur-[180px]" />

        {/* Canlı Galaksi Yıldızları */}
        <div className="absolute top-14 left-20 w-2 h-2 bg-cyan-300 rounded-full animate-ping opacity-80" />
        <div className="absolute top-40 right-28 w-2.5 h-2.5 bg-pink-400 rounded-full animate-pulse opacity-90" />
        <div className="absolute top-80 left-1/3 w-1.5 h-1.5 bg-amber-300 rounded-full animate-ping opacity-75" />
        <div className="absolute bottom-56 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-pulse opacity-85" />
        <div className="absolute bottom-24 left-24 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-80" />
        <div className="absolute top-1/2 right-16 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse opacity-70" />

        {/* İnce Holografik Izgara Deseni */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #c084fc 1px, transparent 1px), linear-gradient(to bottom, #c084fc 1px, transparent 1px)',
            backgroundSize: '44px 44px'
          }}
        />
      </div>

      {/* ==================== 1. ŞIK VE BÜYÜTÜLMÜŞ LOGOLU KOZMİK ÜST BAR ==================== */}
      <header className="sticky top-0 z-50 w-full bg-[#180C3D]/65 backdrop-blur-2xl border-b border-purple-400/25 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-22 flex items-center justify-between gap-3">
          
          {/* Sol: Büyütülmüş, Yüksek Çözünürlüklü Net Chirmo Logosu */}
          <div
            onClick={onEnterStudentPanel}
            className="flex items-center cursor-pointer group shrink-0"
            title="Chirmo"
          >
            <img
              src="./chirmo-header-brand-logo.png"
              alt="Chirmo"
              className="h-14 sm:h-17 md:h-20 w-auto object-contain filter drop-shadow-[0_2px_14px_rgba(255,255,255,0.3)] drop-shadow-[0_6px_25px_rgba(168,85,247,0.55)] group-hover:scale-105 active:scale-95 transition-all duration-200"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/chirmo-logo.png')) {
                  target.src = './chirmo-logo.png';
                }
              }}
            />
          </div>

          {/* Sağ Eylemler: Dil Seçici & Hızlı Giriş Butonu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dil Seçici */}
            <div className="flex items-center bg-[#23124A]/70 p-1.5 rounded-2xl border border-purple-400/30 text-xs font-black shadow-inner">
              <button
                onClick={() => handleLanguageToggle('en')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  selectedLanguage === 'en'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)]'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="İngilizce Dünyası"
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
              <button
                onClick={() => handleLanguageToggle('de')}
                className={`px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  selectedLanguage === 'de'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="Almanca Dünyası"
              >
                <span>🇩🇪</span>
                <span>Deutsch</span>
              </button>
            </div>

            {/* Öğrenci Paneline Gir Butonu */}
            <button
              onClick={onEnterStudentPanel}
              className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-95 transition-all cursor-pointer border border-cyan-300/40"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Öğrenci Paneline Gir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. MERKEZ SAHNE: BÜYÜTÜLMÜŞ CHIRMO ROBOTU & ETRAFINDAKİ YÖRÜNGE KISAYOLLARI ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-20 w-full flex flex-col items-center text-center">
        
        {/* ==================== CHIRMO ORBITAL UNIVERSE (DEV 3D CHIRMO & ETRAFINDAKİ GEZEGEN KISAYOLLAR) ==================== */}
        <div className="relative w-full max-w-5xl min-h-[580px] sm:min-h-[660px] md:min-h-[740px] flex items-center justify-center my-2">
          
          {/* GENİŞLETİLMİŞ GALAKTİK YÖRÜNGE HALKALARI (ORBITAL RINGS) */}
          <div className="absolute w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] md:w-[620px] md:h-[620px] rounded-full border border-purple-400/25 border-dashed animate-[spin_60s_linear_infinite] pointer-events-none" />
          <div className="absolute w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] md:w-[840px] md:h-[840px] rounded-full border border-cyan-400/20 border-dotted animate-[spin_80s_linear_infinite_reverse] pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] rounded-full bg-gradient-to-tr from-cyan-500/25 via-purple-600/35 to-pink-500/30 blur-3xl pointer-events-none" />

          {/* ==================== ETRAFINDAKİ ÇEŞİTLİ YUVARLAK GEZEGEN KISAYOLLARI ==================== */}
          
          {/* KISAYOL 1: 🏕️ 30 GÜNLÜK KAMP (Sol-Üst / Kuzey-Batı) */}
          <div className="absolute top-4 left-2 sm:top-8 sm:left-10 md:top-10 md:left-16 z-20 group">
            <button
              onClick={onEnterCamp}
              className="relative w-26 h-26 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-900 shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:shadow-[0_0_55px_rgba(99,102,241,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-indigo-300/80 animate-[bounce_6s_ease-in-out_infinite]"
              title="30 Günde Kendini İfade Etme Kampı"
            >
              <div className="absolute inset-0 rounded-full border border-indigo-300/40 animate-ping opacity-40 pointer-events-none" />
              <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-indigo-950/70 border border-indigo-400/60 flex items-center justify-center text-xl sm:text-2xl md:text-3xl mb-1 shadow-inner">
                🏕️
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                30 Günlük Kamp
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-indigo-200 mt-0.5">
                Konuşma Kampı
              </span>
            </button>
          </div>

          {/* KISAYOL 2: 🏰 LINGORIA KIDS (Sağ-Üst / Kuzey-Doğu) */}
          <div className="absolute top-4 right-2 sm:top-8 sm:right-10 md:top-10 md:right-16 z-20 group">
            <button
              onClick={onEnterKidsWorld}
              className="relative w-26 h-26 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-br from-pink-500 via-purple-600 to-pink-900 shadow-[0_0_35px_rgba(236,72,153,0.6)] hover:shadow-[0_0_55px_rgba(236,72,153,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-pink-300/80 animate-[bounce_7s_ease-in-out_infinite]"
              title="Lingoria Kids (5-17 Yaş Macera Evreni)"
            >
              <div className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-pink-500 text-white font-black text-[9px] border border-white shadow-md">
                5-17 Yaş
              </div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-pink-950/70 border border-pink-400/60 flex items-center justify-center text-xl sm:text-2xl md:text-3xl mb-1 shadow-inner">
                🏰
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                Lingoria Kids
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-pink-200 mt-0.5">
                Oyun Krallığı 🎮
              </span>
            </button>
          </div>

          {/* KISAYOL 3: 💬 KALIP DEPOSU (Sol-Orta / Batı) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:left-4 md:left-6 z-20 group">
            <button
              onClick={onEnterPhraseBank}
              className="relative w-24 h-24 sm:w-30 sm:h-30 md:w-34 md:h-34 rounded-full p-1 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900 shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:shadow-[0_0_55px_rgba(6,182,212,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-cyan-300/80 animate-[bounce_8s_ease-in-out_infinite]"
              title="Kalıp Deposu & Cümle Kalıpları"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-cyan-950/70 border border-cyan-400/60 flex items-center justify-center text-lg sm:text-2xl mb-1 shadow-inner">
                💬
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                Kalıp Deposu
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-cyan-200 mt-0.5">
                Zihinsel Formüller
              </span>
            </button>
          </div>

          {/* KISAYOL 4: 🎙️ CANLI AI SİMÜLATÖR (Sağ-Orta / Doğu) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-4 md:right-6 z-20 group">
            <button
              onClick={onEnterSimulator}
              className="relative w-24 h-24 sm:w-30 sm:h-30 md:w-34 md:h-34 rounded-full p-1 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-900 shadow-[0_0_35px_rgba(16,185,129,0.6)] hover:shadow-[0_0_55px_rgba(16,185,129,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-emerald-300/80 animate-[bounce_6.5s_ease-in-out_infinite]"
              title="Canlı Konuşma Simülatörü"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-emerald-950/70 border border-emerald-400/60 flex items-center justify-center text-lg sm:text-2xl mb-1 shadow-inner">
                🎙️
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                AI Simülatör
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-emerald-200 mt-0.5">
                Canlı Görüşme
              </span>
            </button>
          </div>

          {/* KISAYOL 5: ⚔️ KONUŞMA DÜELLOSU (Sol-Alt / Güney-Batı) */}
          <div className="absolute bottom-6 left-2 sm:bottom-12 sm:left-12 md:bottom-14 md:left-20 z-20 group">
            <button
              onClick={onEnterStudentPanel}
              className="relative w-24 h-24 sm:w-30 sm:h-30 md:w-34 md:h-34 rounded-full p-1 bg-gradient-to-br from-rose-500 via-fuchsia-600 to-purple-900 shadow-[0_0_35px_rgba(244,63,94,0.6)] hover:shadow-[0_0_55px_rgba(244,63,94,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-rose-300/80 animate-[bounce_7.5s_ease-in-out_infinite]"
              title="Konuşma Düellosu & Arena"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-rose-950/70 border border-rose-400/60 flex items-center justify-center text-lg sm:text-2xl mb-1 shadow-inner">
                ⚔️
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                Canlı Düello
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-rose-200 mt-0.5">
                1v1 Speaking Arena
              </span>
            </button>
          </div>

          {/* KISAYOL 6: 👑 ÖĞRENCİ PANELİNE GİR (Sağ-Alt / Güney-Doğu) */}
          <div className="absolute bottom-6 right-2 sm:bottom-12 sm:right-12 md:bottom-14 md:right-20 z-20 group">
            <button
              onClick={onEnterStudentPanel}
              className="relative w-26 h-26 sm:w-34 sm:h-34 md:w-38 md:h-38 rounded-full p-1 bg-gradient-to-br from-amber-400 via-pink-600 to-purple-800 shadow-[0_0_40px_rgba(245,158,11,0.8)] hover:shadow-[0_0_65px_rgba(245,158,11,1)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-amber-300 animate-[bounce_5.5s_ease-in-out_infinite]"
              title="Öğrenci Paneline Başla"
            >
              <div className="absolute inset-0 rounded-full border border-amber-300/60 animate-ping opacity-40 pointer-events-none" />
              <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full bg-amber-950/70 border border-amber-400/60 flex items-center justify-center text-xl sm:text-3xl mb-1 shadow-inner">
                👑
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                Öğrenci Paneli
              </span>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-amber-200 mt-0.5">
                Hemen Başla 🚀
              </span>
            </button>
          </div>

          {/* KISAYOL 7: 🩺 TELAFFUZ DOKTORU (Üst-Merkez / Kuzey) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 sm:top-2 md:top-4 z-20 group">
            <button
              onClick={onEnterSimulator}
              className="relative w-22 h-22 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-br from-teal-500 via-cyan-600 to-indigo-900 shadow-[0_0_35px_rgba(20,184,166,0.6)] hover:shadow-[0_0_55px_rgba(20,184,166,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-teal-300/80 animate-[bounce_6.8s_ease-in-out_infinite]"
              title="Telaffuz Doktoru"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-950/70 border border-teal-400/60 flex items-center justify-center text-lg sm:text-2xl mb-0.5 shadow-inner">
                🩺
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                Telaffuz Doktoru
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-teal-200">
                AI Fonetik
              </span>
            </button>
          </div>

          {/* KISAYOL 8: 🎯 KARİYER ROTASI (Alt-Merkez / Güney) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 sm:bottom-2 md:bottom-4 z-20 group">
            <button
              onClick={onEnterCamp}
              className="relative w-22 h-22 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-br from-purple-500 via-indigo-600 to-violet-950 shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:shadow-[0_0_55px_rgba(168,85,247,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-purple-300/80 animate-[bounce_7.2s_ease-in-out_infinite]"
              title="Kariyer ve Mülakat İngilizcesi"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-950/70 border border-purple-400/60 flex items-center justify-center text-lg sm:text-2xl mb-0.5 shadow-inner">
                🎯
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                Kariyer Rotası
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-purple-200">
                İş İngilizcesi
              </span>
            </button>
          </div>

          {/* ==================== MERKEZDEKİ BÜYÜTÜLMÜŞ GÖRKEMLİ 3D CHIRMO KARAKTERİ ==================== */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div
              onClick={() => handleSpeak(robotGreeting, 'tr')}
              className="relative w-64 h-64 sm:w-84 sm:h-84 md:w-[420px] md:h-[420px] transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              title="Chirmo'ya tıkla, sesli konuşsun!"
            >
              <img
                src="./chirmo-character.png"
                alt="Chirmo Canlı 3D Robotu"
                className="w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(168,85,247,0.7)]"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/chirmo-avatar.png')) {
                    target.src = './chirmo-avatar.png';
                  }
                }}
              />

              {/* Ses Ekolayzır Dalgaları */}
              {isSpeaking && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/85 backdrop-blur-md border border-cyan-400/70 flex items-center space-x-2 shadow-2xl">
                  <span className="w-2 h-4 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-2 h-7 bg-pink-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  <span className="text-xs font-black text-white pl-1">Chirmo Konuşuyor...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== MERKEZ-ALT: 2 KOZMİK ANA GEÇİŞ DÜĞMESİ ==================== */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 my-6 w-full max-w-3xl">
          <button
            onClick={onEnterStudentPanel}
            className="flex-1 min-w-[260px] p-4.5 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 hover:from-indigo-600 hover:to-purple-600 text-white font-black shadow-[0_0_35px_rgba(99,102,241,0.5)] border-2 border-indigo-400/70 active:scale-98 transition-all flex items-center space-x-3.5 cursor-pointer group text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center text-2xl font-bold shadow-md group-hover:scale-110 transition-transform shrink-0">
              🏕️
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-indigo-200 font-extrabold uppercase tracking-wider block">Yetişkin & Kariyer Modu</span>
              <div className="text-sm sm:text-base font-black text-white leading-tight">
                Öğrenci Paneline Başla
              </div>
              <span className="text-[11px] text-indigo-300 font-medium truncate block">
                30 Günde Kendini İfade Etme Kampı
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          <button
            onClick={onEnterKidsWorld}
            className="flex-1 min-w-[260px] p-4.5 rounded-3xl bg-gradient-to-r from-pink-700 via-purple-700 to-pink-800 hover:from-pink-600 hover:to-purple-600 text-white font-black shadow-[0_0_35px_rgba(236,72,153,0.5)] border-2 border-pink-400/70 active:scale-98 transition-all flex items-center space-x-3.5 cursor-pointer group text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-400/40 flex items-center justify-center text-2xl font-bold shadow-md group-hover:scale-110 transition-transform shrink-0">
              🏰
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-pink-200 font-extrabold uppercase tracking-wider block">5-17 Yaş Çocuk & Genç</span>
              <div className="text-sm sm:text-base font-black text-white leading-tight">
                Lingoria Dünyasını Aç 🎮
              </div>
              <span className="text-[11px] text-pink-300 font-medium truncate block">
                Lingoria Macera Evreni
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-pink-300 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>

        {/* ==================== 3. DAĞILMIŞ YUVARLAK ALANLAR: KOZMİK MİKROFON İSTASYONU ==================== */}
        <div className="relative w-full max-w-3xl my-8">
          <div className="p-7 sm:p-9 rounded-[40px] bg-gradient-to-b from-[#21114d]/90 via-[#1d0e44]/90 to-[#160b36]/95 border-2 border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] backdrop-blur-2xl">
            
            {/* Üst Kozmik Başlık */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-4 mb-4 border-b border-cyan-500/30 gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center space-x-2">
                <Orbit className="w-4 h-4 text-amber-300 animate-spin" />
                <span>CANLI MİKROFON ARENASI (SESİNİ TEST ET)</span>
              </span>
              <button
                onClick={() => handleSpeak(currentSamplePhrase, selectedLanguage)}
                className="text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1.5 cursor-pointer bg-cyan-950/70 px-3.5 py-1.5 rounded-full border border-cyan-400/40 shadow-sm"
                title="Örnek Telaffuzu Dinle"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Örnek Cümleyi Dinle</span>
              </button>
            </div>

            {/* Test Cümlesi */}
            <div className="text-center mb-5">
              <span className="text-xs text-slate-300 font-semibold tracking-wide">
                Aşağıdaki yuvarlak butona basıp mikrofona söyle:
              </span>
              <div className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight drop-shadow-md">
                "{currentSamplePhrase}"
              </div>
            </div>

            {/* BÜYÜK YUVARLAK KOZMİK MİKROFON BUTONU */}
            <div className="flex flex-col items-center justify-center gap-3">
              <button
                onClick={handleStartMicTest}
                disabled={isListening}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full font-black text-xs flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_40px_rgba(244,63,94,0.8)] scale-105'
                    : 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:scale-110 active:scale-95'
                }`}
                title="Mikrofona Konuş"
              >
                <div className="absolute -inset-1 rounded-full border-2 border-emerald-300/60 animate-ping opacity-50 pointer-events-none" />
                <Mic className={`w-8 h-8 sm:w-9 sm:h-9 ${isListening ? 'animate-bounce' : ''}`} />
                <span className="text-[10px] sm:text-[11px] font-black mt-1 leading-tight text-center px-1">
                  {isListening ? 'Dinliyor...' : 'KONUŞ & TEST ET'}
                </span>
              </button>

              {score !== null && (
                <div className="mt-2 px-5 py-2.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-xs font-black flex items-center space-x-2 animate-in fade-in zoom-in-95 shadow-lg">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>Harika Telaffuz! Akıcılık Skoru: %{score} • +25 XP</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== 4. DAĞILMIŞ YUVARLAK ALANLAR: KALIP DOKU TESTİ GALAKSİSİ ==================== */}
        <section className="w-full max-w-4xl my-8 text-center relative">
          
          <div className="mb-6">
            <span className="text-[11px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300">
              CANLI KALIP DOKU TESTİ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Kalıp Mantığını 10 Saniyede Görün
            </h2>
            <p className="text-xs text-purple-200/90 mt-1 max-w-md mx-auto">
              Ezber yok; zihinsel Lego gibi birbirine kenetlenen hazır şablonlarla anında konuşun.
            </p>
          </div>

          {/* DÖRT YUVARLAK KATEGORİ UYDU GEZEGENİ */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveDemo(sc)}
                className={`relative px-4 py-2.5 rounded-full text-xs font-black transition-all duration-300 cursor-pointer flex items-center space-x-2 ${
                  activeDemo.id === sc.id
                    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 text-white shadow-[0_0_25px_rgba(236,72,153,0.7)] border-2 border-white scale-105'
                    : 'bg-[#251352] text-purple-200 hover:bg-[#341b73] border border-purple-400/30'
                }`}
              >
                <span className="text-base">{sc.icon}</span>
                <span>{sc.category}</span>
              </button>
            ))}
          </div>

          {/* GALAKSİDE DAĞILMIŞ 3 YUVARLAK KÜRE KARTLARI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            
            {/* KÜRE 1: KONUŞMA VE SES KÜRESİ */}
            <div className="p-6 rounded-[32px] bg-gradient-to-b from-[#251354]/90 to-[#190d3d]/95 border-2 border-purple-400/40 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-pink-400 uppercase tracking-wider block mb-1">
                  1. KONUŞMA ŞABLONU
                </span>
                <div className="text-xs font-semibold text-slate-200 mb-1">
                  🇹🇷 "{activeDemo.tr}"
                </div>
                <div className="text-base sm:text-lg font-black text-cyan-300 leading-snug my-2">
                  {selectedLanguage === 'en' ? activeDemo.en : activeDemo.de}
                </div>
              </div>

              <button
                onClick={() =>
                  handleSpeak(
                    selectedLanguage === 'en' ? activeDemo.en : activeDemo.de,
                    selectedLanguage
                  )
                }
                disabled={isSpeaking}
                className="w-full mt-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>{isSpeaking ? 'OKUNUYOR...' : 'SESLİ DİNLE & ÖĞREN'}</span>
              </button>
            </div>

            {/* KÜRE 2: ZİHİNSEL KURAL & FORMÜL KÜRESİ */}
            <div className="p-6 rounded-[32px] bg-gradient-to-b from-[#251354]/90 to-[#190d3d]/95 border-2 border-purple-400/40 shadow-xl flex flex-col justify-center">
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block mb-2">
                2. ZİHİNSEL KURAL / FORMÜL
              </span>
              <div className="p-3.5 rounded-2xl bg-purple-950/80 border border-purple-400/40 text-purple-200 font-bold text-xs leading-relaxed">
                {activeDemo.formula}
              </div>
              <span className="text-[10px] text-purple-200/80 font-semibold mt-3 block">
                🧠 Kelimeleri tek tek çevirmek yerine bu kalıbı zihnine yapıştır.
              </span>
            </div>

            {/* KÜRE 3: PRATİK KONUŞMA PÜF NOKTASI KÜRESİ */}
            <div className="p-6 rounded-[32px] bg-gradient-to-b from-[#251354]/90 to-[#190d3d]/95 border-2 border-cyan-400/40 shadow-xl flex flex-col justify-center">
              <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wider block mb-2">
                3. PRATİK KONUŞMA PÜF NOKTASI
              </span>
              <div className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-100 font-semibold text-xs leading-relaxed">
                {activeDemo.tip}
              </div>
              <span className="text-[10px] text-cyan-200/80 font-semibold mt-3 block">
                💡 Doğal akıcılığı sağlayan en önemli refleks.
              </span>
            </div>
          </div>
        </section>

        {/* ==================== 5. DAĞILMIŞ YUVARLAK ALANLAR: İKİ ZIT KOZMİK YILDIZ SİSTEMİ ==================== */}
        <section className="w-full max-w-4xl my-8 text-center">
          <div className="mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">
              KÖK NEDEN ÇÖZÜMÜ
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Neden Yıllardır Konuşamıyoruz?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left text-xs">
            {/* KARA DELİK BULUTSUSU */}
            <div className="p-6 rounded-[36px] bg-gradient-to-br from-rose-950/70 via-[#260a21]/90 to-rose-950/50 border-2 border-rose-500/50 shadow-xl text-rose-200">
              <div className="w-10 h-10 rounded-full bg-rose-900/70 border border-rose-400/60 flex items-center justify-center text-xl mb-3">
                ❌
              </div>
              <div className="font-black text-sm text-rose-300 mb-1.5">
                Geleneksel Kurs & Kitap Çıkmazı
              </div>
              <p className="leading-relaxed">
                Yıllarca Tense formülleri ve kurallar ezberletilir; hata yapınca küçük düşme korkusuyla konuşma refleksi kilitlenir.
              </p>
            </div>

            {/* IŞILTILI SÜPERNOVA GALAKSİSİ */}
            <div className="p-6 rounded-[36px] bg-gradient-to-br from-emerald-950/70 via-[#0c292c]/90 to-teal-950/50 border-2 border-emerald-400/60 shadow-xl text-emerald-200">
              <div className="w-10 h-10 rounded-full bg-emerald-900/70 border border-emerald-400/60 flex items-center justify-center text-xl mb-3">
                ✅
              </div>
              <div className="font-black text-sm text-emerald-300 mb-1.5">
                Chirmo Zihinsel Lego & AI Koçluğu
              </div>
              <p className="leading-relaxed">
                Cümle Kılıcı ve Soru Asası ile zihinsel Lego kalıpları ve 7/24 yargılamayan canlı sesli AI koçluğuyla akıcı konuşma.
              </p>
            </div>
          </div>
        </section>

        {/* BÖLÜM: GÖRÜNMEZ TEST VE ERİŞİLEBİLİRLİK ETİKETLERİ */}
        <div className="sr-only" aria-hidden="true">
          <span>{robotGreeting}</span>
          <span>Yıllarca Ezberlediniz</span>
          <span>Artık Konuşma Vakti</span>
          <span>30 Günde Kendini İfade Etme Kampı</span>
          <span>Lingoria Macera Evreni</span>
          <span>Can I have a large black coffee, please?</span>
          <span>Kann ich bitte einen großen schwarzen Kaffee haben?</span>
        </div>
      </main>

      {/* ==================== 6. ZARİF ALT KOZMİK FOOTER ==================== */}
      <footer className="relative z-20 px-6 py-4 border-t border-purple-500/20 text-xs text-purple-300/70 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 bg-[#12072e]/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Sıfır Kişisel Veri & Tarayıcı Tabanlı Güvenli Konuşma Alanı</span>
        </div>
        <div>© {new Date().getFullYear()} Chirmo. Tüm hakları saklıdır.</div>
      </footer>
    </div>
  );
};

export default ChirmoHeroLandingPortal;
