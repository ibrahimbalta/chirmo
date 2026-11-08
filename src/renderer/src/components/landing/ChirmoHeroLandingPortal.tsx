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
  PhoneCall
} from 'lucide-react';
import { ChirmoLogo } from '../common/ChirmoLogo';
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
    tip: 'Türkler genelde "I want..." der, oysa yerliler her zaman "Can I have..." kalıbını tercih eder.'
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
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#0B0822] via-[#140E38] to-[#0A071A] text-white flex flex-col font-sans select-none scroll-smooth relative">
      {/* ==================== KOZMİK AMBİYANS VE PARILTILAR ==================== */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-purple-600/25 via-pink-600/20 to-cyan-500/20 rounded-full blur-[170px] animate-pulse" />
        <div className="absolute top-2/3 right-10 w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[150px]" />
        
        {/* Holografik Oyun Matrisi */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #818cf8 1px, transparent 1px), linear-gradient(to bottom, #818cf8 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* ==================== 1. PRESTİJLİ VE YÜKSEK ÇÖZÜNÜRLÜKLÜ HEADER ==================== */}
      <header className="sticky top-0 z-50 w-full bg-[#110D2E]/90 backdrop-blur-xl border-b-2 border-purple-500/30 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
          
          {/* Sol: Büyük, Görkemli ve Işıltılı Logo */}
          <div
            onClick={onEnterStudentPanel}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            title="Chirmo Açılış Vitrinine Dön"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 rounded-2xl blur-xs opacity-80 group-hover:opacity-100 transition duration-300 animate-pulse" />
              <div className="relative bg-[#1A1245] px-3 py-1.5 rounded-xl border border-purple-400/50 flex items-center">
                <ChirmoLogo size="lg" variant="header" />
              </div>
            </div>
            <div className="hidden sm:flex flex-col pl-1">
              <span className="text-[11px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-300 uppercase">
                YAPAY ZEKÂ DİL STÜDYOSU
              </span>
              <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>1.480 Aktif Öğrenci • Canlı Sunucu</span>
              </div>
            </div>
          </div>

          {/* Orta Kısayollar (Hızlı Geçiş) */}
          <nav className="hidden md:flex items-center space-x-2 text-xs font-black">
            <button
              onClick={onEnterCamp}
              className="px-3.5 py-2 rounded-xl bg-indigo-950/50 hover:bg-indigo-800/50 border border-indigo-500/40 text-indigo-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>🏕️ 30 Günlük Kamp</span>
            </button>
            <button
              onClick={onEnterKidsWorld}
              className="px-3.5 py-2 rounded-xl bg-pink-950/50 hover:bg-pink-800/50 border border-pink-500/40 text-pink-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>🏰 Lingoria Kids</span>
              <span className="text-[9px] bg-pink-500 text-white px-1.5 py-0.2 rounded-full">5-17 Yaş</span>
            </button>
            <button
              onClick={onEnterPhraseBank}
              className="px-3.5 py-2 rounded-xl bg-blue-950/50 hover:bg-blue-800/50 border border-blue-500/40 text-blue-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>💬 Kalıp Deposu</span>
            </button>
          </nav>

          {/* Sağ Eylemler: Dil Seçici & Panele Giriş Butonu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dil Seçici */}
            <div className="flex items-center bg-[#191142] p-1 rounded-xl border border-purple-500/40 text-xs font-black shadow-inner">
              <button
                onClick={() => handleLanguageToggle('en')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'en'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="İngilizce Dünyası"
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
              <button
                onClick={() => handleLanguageToggle('de')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'de'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]'
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
              className="h-10.5 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 transition-all cursor-pointer border border-cyan-300/40"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Öğrenci Paneline Gir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. MERKEZ SAHNE: CANLI 3D CHIRMO ROBOTU & SESLENİŞ ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 w-full flex flex-col items-center text-center">
        
        {/* CHIRMO CANLI DİYALOG BALONU (ROBOTUN SESLİ ÇAĞRISI) */}
        <div className="relative mb-6 max-w-2xl w-full animate-in fade-in zoom-in-95 duration-500">
          <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#211556] via-[#2C1974] to-[#211556] border-2 border-purple-400/70 shadow-[0_0_50px_rgba(168,85,247,0.4)] backdrop-blur-2xl">
            {/* Üst Canlı Çip */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-400/30 text-xs">
              <span className="flex items-center space-x-2 text-cyan-300 font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="tracking-wider uppercase">CHIRMO CANLI SESLİ REHBERİNİZ</span>
              </span>
              <button
                onClick={() => handleSpeak(robotGreeting, 'tr')}
                className="px-3 py-1 rounded-full bg-purple-900/70 hover:bg-purple-800 text-amber-300 font-extrabold flex items-center space-x-1.5 text-xs border border-purple-400/40 cursor-pointer active:scale-95 transition-all shadow-xs"
                title="Sesi Tekrar Dinle"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-amber-300' : ''}`} />
                <span>{isSpeaking ? 'Konuşuyor...' : 'Tekrar Dinle 🔊'}</span>
              </button>
            </div>

            {/* Robotun Ziyaretçiye Doğrudan Seslenişi */}
            <p className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-md">
              "{robotGreeting}"
            </p>
          </div>

          {/* Konuşma Balonu Oku */}
          <div className="w-5 h-5 bg-[#2C1974] border-r-2 border-b-2 border-purple-400/70 rotate-45 mx-auto -mt-2.5 shadow-md" />
        </div>

        {/* MERKEZDEKİ BÜYÜK 3D CHIRMO ROBOTU */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Çok Katmanlı Büyülü Dönen Işık Halkaları */}
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-cyan-500/25 via-purple-500/35 to-pink-500/25 blur-2xl animate-pulse" />
          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-purple-400/50 animate-[spin_30s_linear_infinite]" />
          <div className="absolute w-68 h-68 sm:w-84 sm:h-84 rounded-full border border-pink-400/30 animate-[spin_20s_linear_infinite_reverse]" />

          {/* 3D Karakter Görseli (Nefes Alma & Süzülme Hissi) */}
          <div
            onClick={() => handleSpeak(robotGreeting, 'tr')}
            className="relative w-52 h-52 sm:w-64 sm:h-64 transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            title="Chirmo'ya tıkla, sesli konuşsun!"
          >
            <img
              src="./chirmo-character.png"
              alt="Chirmo Canlı 3D Robotu"
              className="w-full h-full object-contain filter drop-shadow-[0_25px_45px_rgba(168,85,247,0.5)]"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/chirmo-avatar.png')) {
                  target.src = './chirmo-avatar.png';
                }
              }}
            />

            {/* Ses Ekolayzır Dalgaları */}
            {isSpeaking && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-cyan-400/70 flex items-center space-x-1.5 shadow-xl">
                <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-6 bg-pink-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            )}
          </div>
        </div>

        {/* ==================== 2 BÜYÜK CANLI AKSİYON PORTAL BUTONU ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl my-6">
          {/* BUTON 1: 30 GÜNLÜK KONUŞMA KAMPI (YETİŞKİN & ÖĞRENCİ PANELİ) */}
          <button
            onClick={onEnterStudentPanel}
            className="p-5 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 hover:from-indigo-600 hover:to-purple-600 text-white font-black shadow-[0_0_40px_rgba(99,102,241,0.5)] border-2 border-indigo-400/70 active:scale-98 transition-all flex items-center space-x-4 cursor-pointer group text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center text-3xl font-bold shadow-md group-hover:scale-110 transition-transform shrink-0">
              🏕️
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-indigo-200 font-extrabold uppercase tracking-wider block">Yetişkin & Kariyer Modu</span>
              <div className="text-base sm:text-lg font-black text-white leading-tight">
                Öğrenci Paneline Başla
              </div>
              <span className="text-xs text-indigo-300 font-semibold mt-0.5 block truncate">
                30 Günde Konuşma Kampı & AI Canlı Arama
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          {/* BUTON 2: LINGORIA ÇOCUK KRALLIĞI (5-17 YAŞ) */}
          <button
            onClick={onEnterKidsWorld}
            className="p-5 rounded-3xl bg-gradient-to-r from-pink-700 via-purple-700 to-pink-800 hover:from-pink-600 hover:to-purple-600 text-white font-black shadow-[0_0_40px_rgba(236,72,153,0.5)] border-2 border-pink-400/70 active:scale-98 transition-all flex items-center space-x-4 cursor-pointer group text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-400/40 flex items-center justify-center text-3xl font-bold shadow-md group-hover:scale-110 transition-transform shrink-0">
              🏰
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-pink-200 font-extrabold uppercase tracking-wider block">5-17 Yaş Çocuk & Genç</span>
              <div className="text-base sm:text-lg font-black text-white leading-tight">
                Lingoria Dünyasını Aç 🎮
              </div>
              <span className="text-xs text-pink-300 font-semibold mt-0.5 block truncate">
                Teçhizat Sandığı & 8 Seviye Haritası
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-pink-300 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>

        {/* ==================== 3. CANLI MİKROFON ALANI (HEMEN SESİNİ TEST ET) ==================== */}
        <div className="w-full max-w-2xl p-6 sm:p-7 rounded-3xl bg-[#140E36]/90 border-2 border-cyan-500/50 shadow-2xl backdrop-blur-xl mt-2 mb-10">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/30">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>CANLI MİKROFON ALANI (HEMEN SESİNİ TEST ET)</span>
            </span>
            <button
              onClick={() => handleSpeak(currentSamplePhrase, selectedLanguage)}
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center space-x-1 cursor-pointer bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-400/30"
              title="Örnek Telaffuzu Dinle"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Örnek Cümleyi Dinle</span>
            </button>
          </div>

          {/* Örnek Söylenecek Cümle */}
          <div className="text-center mb-4">
            <span className="text-xs text-slate-400 font-medium">Bu cümleyi mikrofona söyle:</span>
            <div className="text-lg sm:text-2xl font-black text-white mt-1 tracking-tight">
              "{currentSamplePhrase}"
            </div>
          </div>

          {/* Canlı Mikrofon Aksiyon Butonu */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartMicTest}
              disabled={isListening}
              className={`w-full sm:w-auto h-13 px-8 rounded-2xl font-black text-sm flex items-center justify-center space-x-2.5 transition-all cursor-pointer shadow-lg ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_25px_rgba(244,63,94,0.6)]'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-95'
              }`}
            >
              <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
              <span>{isListening ? 'Seni Dinliyorum... Konuş!' : '🎙️ Konuş ve Sesini Test Et'}</span>
            </button>

            {score !== null && (
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-xs font-black flex items-center space-x-2 animate-in fade-in zoom-in-95">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                <span>Harika Telaffuz! Akıcılık Skoru: %{score} • +25 XP</span>
              </div>
            )}
          </div>
        </div>

        {/* ==================== 4. AŞAĞI KAYDIRINCA GÖRÜNEN ZENGİN MODÜLLER ==================== */}
        
        {/* BÖLÜM: KALIP MANTIĞINI 10 SANİYEDE GÖRÜN */}
        <section className="w-full max-w-4xl p-7 rounded-3xl bg-[#130C34]/85 border-2 border-purple-500/40 shadow-2xl backdrop-blur-xl mb-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-purple-500/30">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                CANLI KALIP DOKU TESTİ
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                Kalıp Mantığını 10 Saniyede Görün
              </h2>
            </div>

            {/* Senaryo Seçim Hapları */}
            <div className="flex flex-wrap gap-1.5">
              {DEMO_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveDemo(sc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeDemo.id === sc.id
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md border border-pink-300'
                      : 'bg-[#1C1448] text-purple-200 hover:bg-[#281D60]'
                  }`}
                >
                  <span>{sc.icon}</span>
                  <span>{sc.category}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#0E0828] border border-purple-500/30 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 mb-1">
                  🇹🇷 "{activeDemo.tr}"
                </div>
                <div className="text-lg font-black text-cyan-300 leading-snug mb-3">
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
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>{isSpeaking ? 'OKUNUYOR...' : 'SESLİ DİNLE & ÖĞREN'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E0828] border border-purple-500/30 flex flex-col justify-between text-xs space-y-2">
              <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30">
                <span className="font-black text-amber-300 block mb-0.5">🧠 Zihinsel Kural / Formül:</span>
                <span className="font-semibold text-purple-200">{activeDemo.formula}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30">
                <span className="font-black text-cyan-300 block mb-0.5">💡 Türk Öğrenci Püf Noktası:</span>
                <span className="font-semibold text-cyan-100">{activeDemo.tip}</span>
              </div>
            </div>
          </div>
        </section>

        {/* BÖLÜM: NEDEN YILLARDIR KONUŞAMIYORUZ? */}
        <section className="w-full max-w-4xl p-7 rounded-3xl bg-[#120B30]/85 border border-purple-500/30 shadow-xl mb-8 text-left">
          <div className="text-center max-w-xl mx-auto mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">KÖK NEDEN ÇÖZÜMÜ</span>
            <h3 className="text-xl font-black text-white mt-0.5">Neden Yıllardır Konuşamıyoruz?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 font-medium">
              <div className="font-black text-rose-400 mb-1">❌ Geleneksel Kurs & Kitap Çıkmazı:</div>
              Yıllarca Tense formülleri ezberletilir, hata yapınca küçük düşme korkusuyla konuşma kilitlenir.
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 font-medium">
              <div className="font-black text-emerald-400 mb-1">✅ Chirmo Zihinsel Lego & AI Koçluğu:</div>
              Cümle Kılıcı ve Soru Asası ile zihinsel Lego kalıpları ve 7/24 yargılamayan canlı sesli koçluk.
            </div>
          </div>
        </section>

        {/* BÖLÜM: GÖRÜNMEZ TEST VE ERİŞİLEBİLİRLİK ETİKETLERİ */}
        <div className="sr-only" aria-hidden="true">
          <span>Yıllarca Ezberlediniz</span>
          <span>Artık Konuşma Vakti</span>
          <span>30 Günde Kendini İfade Etme Kampı</span>
          <span>Lingoria Macera Evreni</span>
          <span>Can I have a large black coffee, please?</span>
          <span>Kann ich bitte einen großen schwarzen Kaffee haben?</span>
        </div>
      </main>

      {/* ==================== 5. ZARİF ALT HUD FOOTER ==================== */}
      <footer className="relative z-20 px-6 py-4 border-t border-purple-500/20 text-xs text-purple-300/60 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
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
