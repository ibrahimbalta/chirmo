import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Mic,
  Smile,
  Layers,
  Volume2,
  CheckCircle2,
  Shield,
  Zap,
  Globe,
  Award,
  Play,
  Heart,
  ChevronRight,
  Flame,
  Star,
  Check,
  Bot,
  Compass,
  MessageSquare,
  Headphones,
  Sliders,
  TrendingUp,
  RotateCcw,
  Swords,
  Crown,
  Trophy,
  Gamepad2,
  Sparkle
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
  dialoguePartner: {
    en: string;
    de: string;
  };
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
    tip: 'Türkler genelde "I want..." der, oysa yerliler her zaman "Can I have..." kalıbını tercih eder.',
    dialoguePartner: {
      en: 'Sure thing! For here or to go?',
      de: 'Sehr gerne! Zum Hieressen oder zum Mitnehmen?'
    }
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
    tip: 'Sorunuza daima "Excuse me" ile başlayarak zihinsel rahatlık sağlayın.',
    dialoguePartner: {
      en: 'Gate B24, right past the duty-free shop on your left.',
      de: 'Gate B24, direkt hinter dem Duty-Free-Shop auf der linken Seite.'
    }
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
    tip: 'Karmaşık gramer yok: "I have..." kalıbıyla anında durumunuzu anlatın.',
    dialoguePartner: {
      en: 'Welcome! May I have your passport or ID, please?',
      de: 'Herzlich willkommen! Darf ich bitte Ihren Reisepass oder Ausweis sehen?'
    }
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
    tip: 'Mağazada ihtiyaç duyacağınız en temel ve güçlü soru şablonu.',
    dialoguePartner: {
      en: 'Let me check in the back for you, just a moment!',
      de: 'Ich schaue kurz im Lager nach, einen kleinen Moment bitte!'
    }
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
  const [activeDemo, setActiveDemo] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [heroBubbleActive, setHeroBubbleActive] = useState<'chirmo' | 'user'>('chirmo');

  useEffect(() => {
    const unsub = TargetLanguageService.subscribe((lang) => {
      setSelectedLanguage(lang);
    });
    return () => unsub();
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    TargetLanguageService.setTargetLanguage(lang);
  };

  const handleSpeak = (text: string, lang: SupportedLanguage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'de' ? 'de-DE' : 'en-US';
      utterance.rate = 0.92;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#0A071E] text-white flex flex-col font-sans selection:bg-purple-500 selection:text-white scroll-smooth relative">
      {/* ==================== KOZMİK OYUN PARILTI VE ARKA PLAN IŞIKLARI ==================== */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Büyülü Mor & Mavi Işık Merkezleri */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-purple-600/25 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-blue-600/20 rounded-full blur-[130px]" />
        <div className="absolute top-2/3 left-1/3 w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[160px]" />

        {/* İnce Oyun Grid Izgarası */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* ==================== 1. OYUN TİPİ SAYDAM ÜST BAR (NAVBAR) ==================== */}
      <header className="sticky top-0 z-50 w-full bg-[#0E0A2A]/85 backdrop-blur-xl border-b border-purple-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-17 flex items-center justify-between gap-3">
          {/* Sol: Chirmo Logosu & Oyun Rozeti */}
          <div
            onClick={onEnterStudentPanel}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            title="Chirmo Ana Portalı"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-[#16103A] p-1.5 rounded-xl border border-purple-400/40">
                <ChirmoLogo size="md" variant="header" />
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 uppercase">
                DİL OYUN EVRENİ
              </span>
              <span className="text-[10px] text-purple-300/80 font-bold">30 Günde Konuşma Devrimi</span>
            </div>
          </div>

          {/* Orta: Işınlanma Menüsü */}
          <nav className="hidden lg:flex items-center space-x-1.5 text-xs font-extrabold text-slate-300">
            <button
              onClick={onEnterCamp}
              className="px-3.5 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-800/40 border border-purple-500/20 hover:border-purple-400/50 text-purple-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>🏕️</span>
              <span>30 Günlük Kamp</span>
            </button>
            <button
              onClick={onEnterKidsWorld}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-900/40 to-purple-900/40 hover:from-pink-800/50 hover:to-purple-800/50 border border-pink-500/40 text-pink-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
            >
              <span>🏰</span>
              <span>Lingoria Kids</span>
              <span className="text-[9px] bg-pink-500 text-white font-black px-1.5 py-0.5 rounded-full">5-17 Yaş</span>
            </button>
            <button
              onClick={onEnterPhraseBank}
              className="px-3.5 py-2 rounded-xl bg-blue-950/40 hover:bg-blue-800/40 border border-blue-500/20 hover:border-blue-400/50 text-blue-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>💬</span>
              <span>Kalıp Deposu</span>
            </button>
            <button
              onClick={onEnterSimulator}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-800/40 border border-emerald-500/20 hover:border-emerald-400/50 text-emerald-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>🎙️</span>
              <span>Sesli Simülatör</span>
            </button>
          </nav>

          {/* Sağ: Dil Değiştirici & Işıltılı Başlama Butonu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dil Seçici Konsol */}
            <div className="flex items-center bg-[#18113E] p-1 rounded-xl border border-purple-500/30 text-xs font-black">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'en'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_10px_rgba(124,58,237,0.5)]'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="İngilizce Dünyası"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
              <button
                onClick={() => handleLanguageChange('de')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'de'
                    ? 'bg-gradient-to-r from-amber-500 to-pink-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="Almanca Dünyası"
              >
                <span>🇩🇪</span>
                <span>DE</span>
              </button>
            </div>

            {/* Oyuna Gir Butonu */}
            <button
              onClick={onEnterStudentPanel}
              className="relative group cursor-pointer active:scale-95 transition-transform"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 rounded-xl blur-xs opacity-80 group-hover:opacity-100 transition duration-200 animate-pulse" />
              <div className="relative h-10 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-[#581C87] to-[#3B0764] hover:from-[#6B21A8] hover:to-[#4C1D95] border border-pink-400/60 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg">
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Öğrenci Paneline Gir</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. EFSANEVİ OYUN HERO BÖLÜMÜ (CANLI CHIRMO ARENASI) ==================== */}
      <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* SOL: OYUNCU HİKÂYESİ & DESTANSI BAŞLIK */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Seviye / Görev Rozeti */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-pink-500/40 text-pink-300 text-xs font-black tracking-wide mb-6 shadow-[0_0_20px_rgba(236,72,153,0.3)] animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>GÖREV: TÜRKİYE'DEKİ DİL KİLİDİNİ KIR!</span>
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 px-2 py-0.5 rounded-full font-black">
                +100 XP
              </span>
            </div>

            {/* Ana Destansı Başlık */}
            <h1 className="text-4xl sm:text-6xl lg:text-[4.2rem] font-black tracking-tight leading-[1.04] mb-6">
              Yıllarca Ezberlediniz, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-purple-400 drop-shadow-[0_5px_15px_rgba(244,114,182,0.3)]">
                Artık Konuşma Vakti!
              </span>
            </h1>

            {/* Açıklama */}
            <p className="text-base sm:text-lg text-purple-200/90 font-medium leading-relaxed max-w-xl mb-8">
              Kural ezberlemek yerine; <strong className="text-amber-300 font-bold">Cümle Kılıcı</strong>,{' '}
              <strong className="text-blue-300 font-bold">Soru Asası</strong> ve 7/24 yanınızda olan{' '}
              <strong className="text-pink-300 font-bold">yargılamayan Chirmo AI konuşma koçuyla</strong>{' '}
              30 günde <span className="text-white font-black underline decoration-pink-500">İngilizce</span> ve{' '}
              <span className="text-white font-black underline decoration-amber-400">Almanca</span> konuşma refleksinizi açın.
            </p>

            {/* 2 Büyük Macera Butonu */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              {/* Buton 1: Kampa Başla */}
              <button
                onClick={onEnterStudentPanel}
                className="relative group cursor-pointer active:scale-98"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse" />
                <div className="relative h-14 px-8 rounded-2xl bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 hover:from-purple-600 hover:to-pink-500 text-white font-black text-base shadow-2xl flex items-center justify-center space-x-3 border border-pink-300/40">
                  <Swords className="w-5 h-5 text-amber-300" />
                  <span>Öğrenci Paneline Başla</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </button>

              {/* Buton 2: Kids Dünyası */}
              <button
                onClick={onEnterKidsWorld}
                className="h-14 px-6 rounded-2xl bg-[#1D1448] hover:bg-[#2A1C68] text-white border-2 border-pink-500/50 hover:border-pink-400 font-black text-sm shadow-[0_0_25px_rgba(236,72,153,0.25)] flex items-center justify-center space-x-2.5 transition-all cursor-pointer active:scale-98"
              >
                <span className="text-2xl animate-bounce">🏰</span>
                <span>Lingoria Dünyasını Aç</span>
                <span className="text-[10px] bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-0.5 rounded-full font-black">
                  5-17 YAŞ
                </span>
              </button>
            </div>

            {/* Oyuncu Metrikleri & Başarı Rozetleri */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#140E38]/80 border border-purple-500/30 backdrop-blur-md w-full max-w-xl">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg border border-amber-400/30">
                  🔥
                </div>
                <div>
                  <div className="text-xs font-black text-white">30 Günlük</div>
                  <div className="text-[10px] text-purple-300 font-bold">Kesintisiz Seri</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-lg border border-purple-400/30">
                  ⭐
                </div>
                <div>
                  <div className="text-xs font-black text-white">1000+ Kalıp</div>
                  <div className="text-[10px] text-purple-300 font-bold">Zihinsel Lego</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-lg border border-emerald-400/30">
                  🛡️
                </div>
                <div>
                  <div className="text-xs font-black text-white">%100 Güven</div>
                  <div className="text-[10px] text-emerald-300 font-bold">Yargılanmasız</div>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ: CHIRMO KARAKTERİ & BÜYÜLÜ ARENA KONSOLU */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Dış Parlayan Çerçeve */}
            <div className="relative w-full max-w-md p-6 sm:p-7 rounded-[36px] bg-gradient-to-b from-[#1C134A] to-[#120B30] border-2 border-purple-500/40 shadow-[0_0_60px_rgba(147,51,234,0.3)] backdrop-blur-2xl overflow-hidden">
              
              {/* Konsol Üst Şeridi */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-purple-500/30">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl animate-spin [animation-duration:12s]">{activeDemo.icon}</span>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-pink-400">CANLI DİYALOG ARENASI</div>
                    <div className="text-xs font-black text-white">{activeDemo.category}</div>
                  </div>
                </div>

                {/* Sesli Eşitleyici Dalgalar */}
                <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <span className={`w-1 rounded-full bg-amber-400 ${isSpeaking ? 'h-4 animate-bounce' : 'h-2'}`} />
                  <span className={`w-1 rounded-full bg-pink-400 ${isSpeaking ? 'h-6 animate-bounce [animation-delay:150ms]' : 'h-3'}`} />
                  <span className={`w-1 rounded-full bg-cyan-400 ${isSpeaking ? 'h-5 animate-bounce [animation-delay:300ms]' : 'h-2'}`} />
                  <span className="text-[10px] font-black text-purple-200 pl-1">
                    {isSpeaking ? 'KONUŞUYOR' : 'HAZIR'}
                  </span>
                </div>
              </div>

              {/* DİYALOG BALONU 1: CHIRMO KONUŞUYOR */}
              <div
                onClick={() => {
                  setHeroBubbleActive('chirmo');
                  handleSpeak(
                    selectedLanguage === 'en' ? activeDemo.dialoguePartner.en : activeDemo.dialoguePartner.de,
                    selectedLanguage
                  );
                }}
                className={`p-3.5 rounded-2xl mb-3 cursor-pointer transition-all border ${
                  heroBubbleActive === 'chirmo'
                    ? 'bg-gradient-to-r from-purple-800/80 to-indigo-800/80 border-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.4)]'
                    : 'bg-[#150F36] border-purple-900/60 hover:bg-[#1E154C]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-black text-purple-300 mb-1">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Chirmo AI Konuşma Partneri</span>
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-full">
                    Tıkla & Dinle 🔊
                  </span>
                </div>
                <div className="text-sm font-black text-white leading-snug">
                  "{selectedLanguage === 'en' ? activeDemo.dialoguePartner.en : activeDemo.dialoguePartner.de}"
                </div>
              </div>

              {/* MERKEZİ ROBOT KARAKTER GÖRSELİ & BÜYÜ HALKASI */}
              <div className="relative py-4 my-1 flex items-center justify-center">
                {/* Dönen Büyülü Yıldız Halkaları */}
                <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-purple-600/30 via-pink-600/30 to-amber-500/20 blur-xl -z-10 animate-pulse" />
                <div className="absolute w-40 h-40 rounded-full border-2 border-dashed border-purple-400/50 -z-10 animate-[spin_15s_linear_infinite]" />
                <div className="absolute w-48 h-48 rounded-full border border-pink-400/30 -z-10 animate-[spin_25s_linear_infinite_reverse]" />

                {/* 3D Chirmo Robot Karakteri */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 transition-transform duration-300 hover:scale-105 select-none">
                  <img
                    src="./chirmo-character.png"
                    alt="Chirmo Konuşma Robotu"
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(236,72,153,0.35)]"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/chirmo-avatar.png')) {
                        target.src = './chirmo-avatar.png';
                      }
                    }}
                  />

                  {/* Sesli Çalma Butonu */}
                  <button
                    onClick={() =>
                      handleSpeak(
                        selectedLanguage === 'en' ? activeDemo.en : activeDemo.de,
                        selectedLanguage
                      )
                    }
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                    title="Cümleyi Sesli Oku"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                    <span>SESLİ DİNLE</span>
                  </button>
                </div>
              </div>

              {/* DİYALOG BALONU 2: OYUNCU HAMLESİ (KALIP CEVAP) */}
              <div
                onClick={() => {
                  setHeroBubbleActive('user');
                  handleSpeak(
                    selectedLanguage === 'en' ? activeDemo.en : activeDemo.de,
                    selectedLanguage
                  );
                }}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  heroBubbleActive === 'user'
                    ? 'bg-gradient-to-r from-emerald-900/70 to-teal-900/70 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    : 'bg-[#150F36] border-purple-900/60 hover:bg-[#1E154C]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-black text-emerald-300 mb-1">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Senin Kuracağın Kalıp Cümle</span>
                  </span>
                  <span className="text-[10px] text-emerald-200 bg-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    +15 XP ⚡
                  </span>
                </div>
                <div className="text-sm font-black text-white leading-snug">
                  "{selectedLanguage === 'en' ? activeDemo.en : activeDemo.de}"
                </div>
                <div className="text-[11px] font-semibold text-purple-200/80 mt-1">
                  🇹🇷 {activeDemo.tr}
                </div>
              </div>

              {/* Hızlı Senaryo Seçici Kartları */}
              <div className="flex items-center justify-between gap-1.5 pt-3.5 mt-3.5 border-t border-purple-500/30">
                {DEMO_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setActiveDemo(sc);
                      setHeroBubbleActive('user');
                    }}
                    className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer text-center ${
                      activeDemo.id === sc.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)] border border-pink-300/60'
                        : 'text-purple-300 hover:bg-purple-950/60'
                    }`}
                  >
                    <span>{sc.icon}</span>
                    <span className="hidden sm:inline ml-1">{sc.category.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. İKİ BÜYÜK MACERA PORTALI (RENKLİ & FANTASTİK) ==================== */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#0E0A2A] via-[#140E3A] to-[#0E0A2A] border-y border-purple-500/20 w-full relative">
        <div className="max-w-7xl mx-auto">
          {/* Bölüm Başlığı */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/30">
              İKİ FARKLI MACERA ROTASI
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-3 text-white">
              Sana En Uygun Dünyayı Seç
            </h2>
            <p className="text-sm text-purple-200/80 font-medium mt-2">
              İster günlük 15 dakikalık iş & kariyer kampına katıl, ister 8 seviyeli fantastik oyun haritasında seviye atla.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PORTAL 1: YETİŞKİNLER & GENÇLER İÇİN 30 GÜNLÜK KAMP */}
            <div className="relative rounded-[36px] bg-gradient-to-br from-[#1C1448] to-[#120B30] border-2 border-indigo-500/40 p-8 shadow-[0_0_50px_rgba(99,102,241,0.2)] flex flex-col justify-between hover:border-indigo-400 transition-all group overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center text-3xl font-bold shadow-lg">
                    🏕️
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                    Yetişkin & Kariyer Modu
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  30 Günde Kendini İfade Etme Kampı
                </h3>
                <p className="text-sm text-purple-200/80 leading-relaxed font-medium mb-6">
                  Günde sadece 15 dakika! 4 istasyondan oluşan günlük konuşma parkuruyla kafe, havalimanı, otel ve iş görüşmelerinde duraksamadan konuşun.
                </p>

                {/* 4 İstasyon Parkuru */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  <div className="p-3 rounded-2xl bg-[#140D36] border border-indigo-500/30 text-center">
                    <div className="text-[10px] font-black text-indigo-400 uppercase">1. İSTASYON</div>
                    <div className="text-xs font-black text-white mt-0.5">3 Dk Isınma</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#140D36] border border-indigo-500/30 text-center">
                    <div className="text-[10px] font-black text-indigo-400 uppercase">2. İSTASYON</div>
                    <div className="text-xs font-black text-white mt-0.5">Kalıp Analizi</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-600/30 border border-indigo-400 text-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <div className="text-[10px] font-black text-amber-300 uppercase">3. İSTASYON</div>
                    <div className="text-xs font-black text-white mt-0.5">Canlı AI Arama</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#140D36] border border-indigo-500/30 text-center">
                    <div className="text-[10px] font-black text-indigo-400 uppercase">4. İSTASYON</div>
                    <div className="text-xs font-black text-white mt-0.5">Düello & Rozet</div>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm font-bold text-slate-200 mb-8">
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Chirmo AI ile telefonla konuşur gibi 2 dakikalık sesli diyalog</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Hata yaptığınızda yargılamayan, anında Türkçe ipuçlu koçluk</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>30 günlük parkur sonunda resmi bitirme sertifikası</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterStudentPanel}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98"
              >
                <span>30 Günlük Kampa & Öğrenci Paneline Başla</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PORTAL 2: 5-17 YAŞ ÇOCUKLAR İÇİN LINGORIA KIDS DÜNYASI */}
            <div className="relative rounded-[36px] bg-gradient-to-br from-[#241348] via-[#1C0F38] to-[#14092A] border-2 border-pink-500/40 p-8 shadow-[0_0_50px_rgba(236,72,153,0.25)] flex flex-col justify-between hover:border-pink-400 transition-all group overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-400/40 flex items-center justify-center text-3xl font-bold shadow-lg">
                    🏰
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40">
                    5-17 Yaş Çocuk & Genç
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  Chirmo Kids: Lingoria Macera Evreni
                </h3>
                <p className="text-sm text-pink-200/80 leading-relaxed font-medium mb-6">
                  Sıkıcı ders masaları yerine eğlenceli bir RPG oyunu. Çocuklar İngilizce ve Almancayı görevler yaparak, seviye atlayarak ve konuşarak öğrenir.
                </p>

                {/* Büyülü Teçhizat Sandığı Önizleme Konsolu */}
                <div className="p-4 rounded-2xl bg-[#160B30]/90 border border-pink-500/30 shadow-lg mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-amber-300 flex items-center space-x-1.5">
                      <span>⚔️</span>
                      <span>Maceracının Büyülü Teçhizat Sandığı</span>
                    </span>
                    <span className="text-[10px] font-black text-pink-300 bg-pink-900/50 px-2.5 py-0.5 rounded-full border border-pink-400/30">
                      8 Seviye Haritası
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                    <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200">
                      <div>🗡️ Cümle Kılıcı</div>
                      <div className="text-[9px] text-purple-300 font-semibold mt-0.5">Cümle Kurma</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-900/40 border border-blue-500/30 text-blue-200">
                      <div>❓ Soru Asası</div>
                      <div className="text-[9px] text-blue-300 font-semibold mt-0.5">Soru Sorma</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-900/40 border border-amber-500/30 text-amber-200">
                      <div>🛡️ Nezaket Kalkanı</div>
                      <div className="text-[9px] text-amber-300 font-semibold mt-0.5">Rica & Nezaket</div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm font-bold text-slate-200 mb-8">
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
                    <span>8 farklı ada: Kelime Ormanı, Gramer Kalesi, Şarkı Adası</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
                    <span>Konuşan interaktif masallar ve doğru telaffuzlu şarkılar</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
                    <span>Kazanılan yıldızlar, seviyeler, XP'ler ve güvenli çocuk alanı</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterKidsWorld}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-sm shadow-[0_0_25px_rgba(236,72,153,0.4)] flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98"
              >
                <span>Lingoria Dünyasını Aç 🎮</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. TÜRKİYE'YE ÖZEL ÇÖZÜM ANALİZİ ==================== */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/30">
            KÖK NEDEN ANALİZİ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
            Neden Yıllardır Konuşamıyoruz?
          </h2>
          <p className="text-sm text-purple-200/80 font-medium mt-2">
            Sorun sizde veya zekânızda değil; Türkiye'de uygulanan ezberci gramer tabularında.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ESKİ METOT */}
          <div className="p-8 rounded-3xl bg-[#140D32] border border-rose-500/30 shadow-lg">
            <div className="text-xs font-black text-rose-400 uppercase tracking-wider mb-2">❌ Geleneksel Kurslar & Kitaplar</div>
            <h3 className="text-xl font-black text-white mb-4">Gramer Ezberi ve Korku</h3>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-300 font-semibold">
              <li className="flex items-start space-x-3">
                <span className="text-rose-400 font-black shrink-0 mt-0.5">✕</span>
                <span>Yıllarca Present Perfect, Past Continuous gibi formüller ezberletilir; konuşmaya sıra gelmez.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-rose-400 font-black shrink-0 mt-0.5">✕</span>
                <span>Hata yapınca sınıfta eleştirilme veya küçük düşme korkusu konuşma refleksini kilitler.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-rose-400 font-black shrink-0 mt-0.5">✕</span>
                <span>Kelimeler tek tek ezberlenir; beyin cümleyi Türkçeden çevirmeye çalışırken donup kalır.</span>
              </li>
            </ul>
          </div>

          {/* CHIRMO ÇÖZÜMÜ */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1E124A] to-[#120B30] border-2 border-emerald-400/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <div className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-2">✅ Chirmo Dil Metodolojisi</div>
            <h3 className="text-xl font-black text-white mb-4">Zihinsel Lego & Canlı AI Koçu</h3>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-100 font-bold">
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-400 font-black shrink-0 mt-0.5" />
                <span><strong>Cümle Kılıcı & Soru Asası:</strong> Dilbilgisi kuralları yerine hazır düşünce kalıplarıyla ilk günden cümle kurarsınız.</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-400 font-black shrink-0 mt-0.5" />
                <span><strong>%100 Yargılamayan Chirmo AI:</strong> 7/24 istediğiniz kadar konuşun, hata yapın; sabırla motive eder.</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-400 font-black shrink-0 mt-0.5" />
                <span><strong>1000+ Yaşam Kalıp Deposu:</strong> Kafe, otel, mülakat gibi tüm gerçek senaryolar elinizin altındadır.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ==================== 5. İNTERAKTİF SESLİ PRATİK DECKİ (10 SANİYEDE TEST ET) ==================== */}
      <section className="py-20 px-4 sm:px-6 bg-[#0E0A2A] border-y border-purple-500/20 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/30">
              CANLI OYUN ALANI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
              Kalıp Mantığını 10 Saniyede Görün
            </h2>
            <p className="text-sm text-purple-200/80 font-medium mt-1.5">
              Aşağıdaki senaryolara tıklayın; doğru aksanlı telaffuzu ve zihinsel formülü inceleyin.
            </p>
          </div>

          {/* Senaryo Seçim Hapları */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveDemo(sc)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 ${
                  activeDemo.id === sc.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-400/50'
                    : 'bg-[#18113E] text-purple-200 hover:bg-[#221752] border border-purple-500/20'
                }`}
              >
                <span className="text-base">{sc.icon}</span>
                <span>{sc.category}</span>
              </button>
            ))}
          </div>

          {/* İnteraktif Kart */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#150F38] border-2 border-purple-500/40 shadow-2xl max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-500/30">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-pink-400">
                  {activeDemo.icon} {activeDemo.category}
                </span>
                <div className="text-lg sm:text-xl font-black text-white mt-0.5">
                  🇹🇷 "{activeDemo.tr}"
                </div>
              </div>

              {/* Dil Değiştirici */}
              <div className="flex items-center space-x-1 bg-[#1E154C] p-1 rounded-xl border border-purple-400/40">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                    selectedLanguage === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-purple-300'
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => handleLanguageChange('de')}
                  className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                    selectedLanguage === 'de' ? 'bg-pink-600 text-white shadow-xs' : 'text-purple-300'
                  }`}
                >
                  🇩🇪 DE
                </button>
              </div>
            </div>

            {/* Cümle ve Sesli Çalma */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                  {selectedLanguage === 'en' ? '🇬🇧 İngilizce Kalıp:' : '🇩🇪 Almanca Kalıp:'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
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
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95 transition-all"
                title="Sesli Telaffuz Dinle"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>{isSpeaking ? 'OKUNUYOR...' : 'SESLİ DİNLE'}</span>
              </button>
            </div>

            {/* Formül ve İpucu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-purple-500/30 text-xs mt-3">
              <div className="p-3.5 rounded-2xl bg-[#1C1448] border border-purple-500/30">
                <div className="font-black text-amber-300 mb-0.5">🧠 Zihinsel Kural / Formül:</div>
                <div className="font-semibold text-purple-200">{activeDemo.formula}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1C1448] border border-purple-500/30">
                <div className="font-black text-cyan-300 mb-0.5">💡 Türk Öğrenci Püf Noktası:</div>
                <div className="font-semibold text-purple-200">{activeDemo.tip}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. DEVRİM ÇAĞRISI (BÜYÜLÜ KONSOL FOOTER) ==================== */}
      <footer className="bg-[#070514] text-white pt-16 pb-12 px-4 sm:px-6 w-full mt-auto border-t border-purple-500/30">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-400/40 text-purple-300 text-xs font-black mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>KAYIT VEYA KREDİ KARTI GEREKMEZ</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Bugün İlk Cümlenizi Kurun.
          </h2>
          <p className="text-sm text-purple-300/80 max-w-md mx-auto mb-8 font-medium">
            Tarayıcınızda sıfır kişisel veri güvenliğiyle hemen öğrenci paneline giriş yapın ve pratik yapmaya başlayın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <button
              onClick={onEnterStudentPanel}
              className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm sm:text-base shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Öğrenci Paneline Gir ➔</span>
            </button>
            <button
              onClick={onEnterKidsWorld}
              className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-[#1C1348] hover:bg-[#281B66] text-pink-200 font-black text-sm sm:text-base border border-pink-500/40 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>🏰 Kids Dünyasını Aç</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-purple-400/60 pt-8 border-t border-purple-900/60 font-medium gap-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Sıfır Kişisel Veri ile Gizlilik Korumalı Dil Stüdyosu</span>
            </div>
            <div>© {new Date().getFullYear()} Chirmo. Tüm hakları saklıdır.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChirmoHeroLandingPortal;
