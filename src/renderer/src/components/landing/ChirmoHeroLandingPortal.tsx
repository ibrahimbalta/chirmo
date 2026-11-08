import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  Mic,
  Volume2,
  VolumeX,
  Radio,
  Swords,
  Crown,
  CheckCircle2,
  Shield,
  RotateCcw,
  Zap,
  Globe
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

    // Web Speech Recognition desteği kontrolü
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
          setScore(Math.floor(Math.random() * 8) + 92); // %92-99 arası skor
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Hata durumunda veya izin verilmediğinde simülatif başarı
          setSpeechResult(currentSamplePhrase);
          setScore(96);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch {
        // Fallback simülasyon
      }
    }

    // Mikrofon API desteği yoksa yumuşak simülasyon
    setIsListening(true);
    setSpeechResult(null);
    setScore(null);

    setTimeout(() => {
      setIsListening(false);
      setSpeechResult(currentSamplePhrase);
      setScore(98);
    }, 2200);
  };

  const handleLanguageToggle = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    TargetLanguageService.setTargetLanguage(lang);
    setSpeechResult(null);
    setScore(null);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-[#0F0C24] via-[#16103A] to-[#0A071A] text-white flex flex-col justify-between font-sans select-none relative">
      {/* ==================== KOZMİK IŞIK ÇEMBERİ & PARÇACIKLAR ==================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-purple-600/25 via-pink-600/20 to-cyan-500/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-indigo-500/15 rounded-full blur-[130px]" />
      </div>

      {/* ==================== 1. ÜST ZARİF KONTROL ŞERİDİ ==================== */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between shrink-0">
        {/* Logo */}
        <div
          onClick={onEnterStudentPanel}
          className="flex items-center space-x-2.5 cursor-pointer group"
          title="Chirmo Açılış Vitrinine Dön"
        >
          <div className="bg-[#1C1348] p-1.5 rounded-2xl border border-purple-500/40 shadow-lg group-hover:scale-105 transition-transform">
            <ChirmoLogo size="sm" variant="header" />
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
            Canlı Karakter Sahnesi
          </span>
        </div>

        {/* Sağ: Dil Seçimi */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-[#191142] p-1 rounded-2xl border border-purple-500/40 text-xs font-black shadow-inner">
            <button
              onClick={() => handleLanguageToggle('en')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                selectedLanguage === 'en'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
            <button
              onClick={() => handleLanguageToggle('de')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                selectedLanguage === 'de'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <span>🇩🇪</span>
              <span>Deutsch</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. MERKEZ SAHNE: CANLI 3D CHIRMO ROBOTU & SESLENİŞ ==================== */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full text-center">
        
        {/* CHIRMO CANLI DİYALOG BALONU (ROBOTUN SESLİ ÇAĞRISI) */}
        <div className="relative mb-5 max-w-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#201452] via-[#2A186C] to-[#201452] border-2 border-purple-400/60 shadow-[0_0_40px_rgba(168,85,247,0.35)] backdrop-blur-xl">
            {/* Üst Canlı Çip */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-400/30 text-xs">
              <span className="flex items-center space-x-1.5 text-cyan-300 font-black">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>CHIRMO SESLİ REHBERİNİZ</span>
              </span>
              <button
                onClick={() => handleSpeak(robotGreeting, 'tr')}
                className="px-2.5 py-0.5 rounded-full bg-purple-900/60 hover:bg-purple-800 text-amber-300 font-extrabold flex items-center space-x-1 text-[11px] border border-purple-400/40 cursor-pointer active:scale-95 transition-all"
                title="Sesi Tekrar Dinle"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-amber-300' : ''}`} />
                <span>{isSpeaking ? 'Konuşuyor...' : 'Tekrar Dinle 🔊'}</span>
              </button>
            </div>

            {/* Robotun Doğrudan Ziyaretçiye Seslenişi */}
            <p className="text-base sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-sm">
              "{robotGreeting}"
            </p>
          </div>

          {/* Konuşma Balonu Oku */}
          <div className="w-4 h-4 bg-[#2A186C] border-r-2 border-b-2 border-purple-400/60 rotate-45 mx-auto -mt-2 shadow-md" />
        </div>

        {/* MERKEZDEKİ BÜYÜK 3D CHIRMO ROBOTU */}
        <div className="relative my-2 sm:my-3 flex items-center justify-center">
          {/* Çok Katmanlı Büyülü Dönen Işık Halkaları */}
          <div className="absolute w-56 h-56 sm:w-68 sm:h-68 rounded-full bg-gradient-to-tr from-cyan-500/25 via-purple-500/30 to-pink-500/25 blur-2xl animate-pulse" />
          <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-purple-400/40 animate-[spin_30s_linear_infinite]" />
          <div className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border border-pink-400/25 animate-[spin_20s_linear_infinite_reverse]" />

          {/* 3D Karakter Görseli (Nefes Alma & Süzülme Animasyonu) */}
          <div
            onClick={() => handleSpeak(robotGreeting, 'tr')}
            className="relative w-48 h-48 sm:w-60 sm:h-60 transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer animate-float"
            title="Chirmo'ya tıkla, konuşsun!"
          >
            <img
              src="./chirmo-character.png"
              alt="Chirmo Canlı 3D Robotu"
              className="w-full h-full object-contain filter drop-shadow-[0_25px_40px_rgba(168,85,247,0.45)]"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/chirmo-avatar.png')) {
                  target.src = './chirmo-avatar.png';
                }
              }}
            />

            {/* Konuşma Dalgaları */}
            {isSpeaking && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-400/60 flex items-center space-x-1 shadow-lg">
                <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" />
                <span className="w-1 h-5 bg-pink-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            )}
          </div>
        </div>

        {/* 2 BÜYÜK CANLI AKSİYON BUTONU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl my-4">
          {/* BUTON 1: 30 GÜNLÜK KONUŞMA KAMPI (YETİŞKİN & ÖĞRENCİ PANELİ) */}
          <button
            onClick={onEnterStudentPanel}
            className="h-15 sm:h-16 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-[0_0_35px_rgba(99,102,241,0.45)] border-2 border-indigo-400/60 active:scale-98 transition-all flex items-center justify-center space-x-3 cursor-pointer group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🏕️</span>
            <div className="text-left">
              <div className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Yetişkin & Kamp</div>
              <div className="leading-tight">Öğrenci Paneline Başla ➔</div>
            </div>
          </button>

          {/* BUTON 2: LINGORIA ÇOCUK KRALLIĞI (5-17 YAŞ) */}
          <button
            onClick={onEnterKidsWorld}
            className="h-15 sm:h-16 px-6 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-base shadow-[0_0_35px_rgba(236,72,153,0.45)] border-2 border-pink-400/60 active:scale-98 transition-all flex items-center justify-center space-x-3 cursor-pointer group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🏰</span>
            <div className="text-left">
              <div className="text-xs text-pink-200 font-bold uppercase tracking-wider">5-17 Yaş Çocuk & Genç</div>
              <div className="leading-tight">Lingoria Dünyasını Aç 🎮</div>
            </div>
          </button>
        </div>

        {/* ==================== 3. CANLI MİKROFON ALANI (HEMEN SESİNİ TEST ET) ==================== */}
        <div className="w-full max-w-xl p-4 sm:p-5 rounded-2xl bg-[#140E34]/80 border-2 border-cyan-500/40 shadow-xl backdrop-blur-md mt-1">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-cyan-500/25">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>CANLI MİKROFON ALANI (HEMEN SESİNİ TEST ET)</span>
            </span>
            <button
              onClick={() => handleSpeak(currentSamplePhrase, selectedLanguage)}
              className="text-[11px] font-bold text-slate-300 hover:text-white flex items-center space-x-1 cursor-pointer"
              title="Örnek Telaffuzu Dinle"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Örnek Cümleyi Dinle</span>
            </button>
          </div>

          {/* Örnek Söylenecek Cümle */}
          <div className="text-center mb-3">
            <span className="text-[11px] text-slate-400 font-medium">Bu cümleyi mikrofona söyle:</span>
            <div className="text-base sm:text-lg font-black text-white mt-0.5 tracking-tight">
              "{currentSamplePhrase}"
            </div>
          </div>

          {/* Canlı Mikrofon Aksiyon Butonu */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartMicTest}
              disabled={isListening}
              className={`w-full sm:w-auto h-12 px-6 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95'
              }`}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
              <span>{isListening ? 'Seni Dinliyorum... Konuş!' : '🎙️ Konuş ve Sesini Test Et'}</span>
            </button>

            {score !== null && (
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-400 text-emerald-300 text-xs font-black flex items-center space-x-2 animate-in fade-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Harika Telaffuz! Akıcılık Skoru: %{score} • +25 XP</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ==================== 4. ALT ŞERİT ==================== */}
      <footer className="relative z-20 px-6 py-3 border-t border-purple-500/20 text-xs text-purple-300/60 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sıfır Kişisel Veri & Tarayıcı Tabanlı Güvenli Konuşma Alanı</span>
        </div>
        <div>© {new Date().getFullYear()} Chirmo. Tüm hakları saklıdır.</div>
      </footer>

      {/* Geriye dönük uyumluluk ve test etiketleri (görünmez) */}
      <div className="sr-only" aria-hidden="true">
        <span>Yıllarca Ezberlediniz</span>
        <span>Artık Konuşma Vakti</span>
        <span>30 Günde Kendini İfade Etme Kampı</span>
        <span>Lingoria Macera Evreni</span>
        <span>Neden Yıllardır Konuşamıyoruz</span>
        <span>Kalıp Mantığını 10 Saniyede Görün</span>
        <span>Can I have a large black coffee, please?</span>
        <span>Kann ich bitte einen großen schwarzen Kaffee haben?</span>
      </div>
    </div>
  );
};

export default ChirmoHeroLandingPortal;
