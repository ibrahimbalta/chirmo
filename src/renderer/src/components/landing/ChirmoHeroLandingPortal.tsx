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
  PhoneCall,
  PhoneOff,
  VolumeX,
  Volume1,
  Radio,
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
      de: 'Herzlich willkommen! Darf ich bitte Ihren Reisepass veya Ausweis sehen?'
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
  const [callActive, setCallActive] = useState(false);
  const [chestOpen, setChestOpen] = useState(false);
  const [playerXp, setPlayerXp] = useState(250);

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

  const handleAnswerCall = () => {
    setCallActive(true);
    setPlayerXp((prev) => prev + 25);
    const greeting =
      selectedLanguage === 'en'
        ? 'Hello! Chirmo live speaking coach is online. Let us practice now!'
        : 'Hallo! Dein Chirmo Sprachcoach ist online. Lass uns jetzt Deutsch sprechen!';
    handleSpeak(greeting, selectedLanguage);
  };

  const handleHangupCall = () => {
    setCallActive(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleToggleChest = () => {
    setChestOpen(!chestOpen);
    setPlayerXp((prev) => prev + 15);
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#0A071E] text-white flex flex-col font-sans select-none relative scroll-smooth">
      {/* ==================== KOZMİK OYUN PARÇACIKLARI & NEON IŞIK HARELERİ ==================== */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/25 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[150px]" />

        {/* Holografik Oyun Matrisi Izgarası */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #818cf8 1px, transparent 1px), linear-gradient(to bottom, #818cf8 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* ==================== 1. OYUN KOMUTA KONSOLU (TOP HUD) ==================== */}
      <header className="sticky top-0 z-50 w-full bg-[#110D2C]/90 backdrop-blur-xl border-b-2 border-purple-500/30 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3">
          
          {/* Sol: Chirmo Emblem & Canlı Sunucu Durumu */}
          <div
            onClick={onEnterStudentPanel}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            title="Chirmo Ana Portalı"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
              <div className="relative bg-[#191140] p-1.5 rounded-xl border border-purple-400/50">
                <ChirmoLogo size="md" variant="header" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-300 uppercase">
                  CHIRMO OS v2.0
                </span>
                <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>1.480 Çevrimiçi</span>
                </span>
              </div>
              <span className="text-[11px] text-purple-300/80 font-bold hidden sm:inline">
                Türkiye'nin Konuşma Odaklı Oyun Evreni
              </span>
            </div>
          </div>

          {/* Orta: Işınlanma Kısayolları */}
          <nav className="hidden lg:flex items-center space-x-2 text-xs font-black">
            <button
              onClick={onEnterCamp}
              className="px-3.5 py-2 rounded-xl bg-indigo-950/50 hover:bg-indigo-800/50 border border-indigo-500/40 text-indigo-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <span>🏕️</span>
              <span>30 Günlük Kamp</span>
            </button>
            <button
              onClick={onEnterKidsWorld}
              className="px-3.5 py-2 rounded-xl bg-pink-950/50 hover:bg-pink-800/50 border border-pink-500/40 text-pink-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
            >
              <span>🏰</span>
              <span>Lingoria Kids</span>
              <span className="text-[9px] bg-pink-500 text-white font-black px-1.5 py-0.5 rounded-full">5-17 Yaş</span>
            </button>
            <button
              onClick={onEnterPhraseBank}
              className="px-3.5 py-2 rounded-xl bg-blue-950/50 hover:bg-blue-800/50 border border-blue-500/40 text-blue-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>💬</span>
              <span>Kalıp Deposu</span>
            </button>
            <button
              onClick={onEnterSimulator}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-800/50 border border-emerald-500/40 text-emerald-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>🎙️</span>
              <span>Sesli Simülatör</span>
            </button>
          </nav>

          {/* Sağ: HUD Oyuncu Skoru, Dil ve Giriş Butonu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Oyuncu XP HUD */}
            <div className="hidden sm:flex items-center space-x-2 bg-[#1B1348] px-3 py-1.5 rounded-xl border border-purple-500/40 text-xs font-black shadow-inner">
              <span className="text-amber-400">⚡</span>
              <span className="text-amber-300 font-extrabold">{playerXp} XP</span>
              <span className="text-purple-400">•</span>
              <span className="text-pink-400">🔥 30 Gün</span>
            </div>

            {/* Dil Seçici */}
            <div className="flex items-center bg-[#18113E] p-1 rounded-xl border border-purple-500/40 text-xs font-black">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'en'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="İngilizce Boyutu"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
              <button
                onClick={() => handleLanguageChange('de')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'de'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="Almanca Boyutu"
              >
                <span>🇩🇪</span>
                <span>DE</span>
              </button>
            </div>

            {/* Ana Başla Butonu */}
            <button
              onClick={onEnterStudentPanel}
              className="h-10 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 transition-all cursor-pointer border border-cyan-300/40"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Öğrenci Paneline Gir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. ANA SAHNE: İKİ BÜYÜK BOYUT GEÇİDİ (PARLAYAN PORTALLAR) ==================== */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16 w-full flex flex-col justify-between">
        
        {/* Üst Oyun Manşeti */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 via-pink-900/60 to-cyan-900/60 border border-cyan-400/40 text-cyan-300 text-xs font-black tracking-wider mb-3 shadow-[0_0_25px_rgba(6,182,212,0.3)] animate-pulse">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>BOYUT SEÇİMİ VE KONUŞMA PROTOKOLÜ AKTİF</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-3">
            Yıllarca Ezberlediniz, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 drop-shadow-[0_4px_15px_rgba(236,72,153,0.4)]">
              Artık Konuşma Vakti!
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-purple-200/90 font-medium max-w-xl mx-auto">
            Geleneksel kursların ezberci kalıplarını yıkın. Gerçek bir web oyunu konsoluna girdiniz; aşağıdaki iki boyuttan birini seçin veya hemen canlı simülasyonu test edin!
          </p>
        </div>

        {/* 2 BÜYÜK OYUN BOYUT KAPISI (CYBER CAMP vs. LINGORIA FANTASY) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10">
          
          {/* BOYUT 1: 🏕️ 30 GÜNLÜK KAMP & CANLI CHIRMO TELEFON SİMÜLATÖRÜ */}
          <div className="relative rounded-[32px] bg-gradient-to-b from-[#181140] to-[#100A2E] border-2 border-cyan-500/50 p-6 sm:p-7 shadow-[0_0_40px_rgba(6,182,212,0.25)] flex flex-col justify-between hover:border-cyan-400 transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Kapı Başlığı */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/30">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center text-2xl font-bold shadow-md">
                    🏕️
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">BOYUT I • YETİŞKİN & KARİYER</span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">30 Günde Kendini İfade Etme Kampı</h3>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-cyan-950 text-cyan-300 px-3 py-1 rounded-full border border-cyan-400/40">
                  GÜNDE 15 DK
                </span>
              </div>

              {/* İNTERAKTİF CANLI TELEFON ARAMA SİMÜLATÖRÜ */}
              <div className="p-4 rounded-2xl bg-[#0F0A28] border-2 border-cyan-400/40 shadow-inner mb-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-black text-cyan-300">
                      {callActive ? 'CANLI ÇAĞRI DEVAM EDİYOR' : 'CHIRMO AI SİZİ SESLİ ARIYOR...'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Telefon Simülatörü</span>
                </div>

                {/* Arayan Kartı */}
                <div className="flex items-center space-x-3 bg-[#191144] p-3 rounded-xl border border-purple-500/30 mb-3">
                  <img
                    src="./chirmo-character.png"
                    alt="Chirmo Karakteri"
                    className="w-12 h-12 rounded-xl object-contain bg-purple-900/50 p-1 border border-purple-400/40"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/chirmo-avatar.png')) {
                        target.src = './chirmo-avatar.png';
                      }
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-white truncate">Chirmo AI Konuşma Robotu</div>
                    <div className="text-[11px] text-cyan-300 font-semibold truncate">
                      {callActive
                        ? `"${selectedLanguage === 'en' ? 'Are you ready to speak English?' : 'Lass uns jetzt Deutsch sprechen!'}"`
                        : 'Sesli konuşma pratiği için hazır.'}
                    </div>
                  </div>
                  {isSpeaking && (
                    <div className="flex items-center space-x-1">
                      <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" />
                      <span className="w-1 h-5 bg-pink-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  )}
                </div>

                {/* Telefon Aksiyon Butonları */}
                <div className="flex items-center justify-center space-x-3">
                  {!callActive ? (
                    <button
                      onClick={handleAnswerCall}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4 animate-bounce" />
                      <span>ARAMAYI CEVAPLA & DİNLE (+25 XP)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleHangupCall}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span>ARAMAYI SONLANDIR</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 4 Seviye Parkuru */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-black mb-5">
                <div className="p-2 rounded-xl bg-[#140D36] border border-cyan-500/20">
                  <div className="text-cyan-400">1. İSTASYON</div>
                  <div className="text-white mt-0.5">Isınma</div>
                </div>
                <div className="p-2 rounded-xl bg-[#140D36] border border-cyan-500/20">
                  <div className="text-cyan-400">2. İSTASYON</div>
                  <div className="text-white mt-0.5">Kalıp</div>
                </div>
                <div className="p-2 rounded-xl bg-cyan-900/40 border border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  <div className="text-amber-300">3. İSTASYON</div>
                  <div className="text-white mt-0.5">AI Canlı</div>
                </div>
                <div className="p-2 rounded-xl bg-[#140D36] border border-cyan-500/20">
                  <div className="text-cyan-400">4. İSTASYON</div>
                  <div className="text-white mt-0.5">Düello</div>
                </div>
              </div>
            </div>

            {/* Kapı Giriş Butonu */}
            <button
              onClick={onEnterStudentPanel}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-cyan-700 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center space-x-2 cursor-pointer active:scale-98 transition-all border border-cyan-300/40"
            >
              <Swords className="w-4 h-4 text-amber-300" />
              <span>Öğrenci Paneline Başla (Kampa Gir)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* BOYUT 2: 🏰 LINGORIA FANTEZİ KRALLIĞI & AÇILIR BÜYÜLÜ TEÇHİZAT SANDIĞI */}
          <div className="relative rounded-[32px] bg-gradient-to-b from-[#221042] to-[#14082C] border-2 border-pink-500/50 p-6 sm:p-7 shadow-[0_0_40px_rgba(236,72,153,0.25)] flex flex-col justify-between hover:border-pink-400 transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Kapı Başlığı */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-pink-500/30">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-400/40 flex items-center justify-center text-2xl font-bold shadow-md">
                    🏰
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">BOYUT II • ÇOCUK & GENÇ (5-17 YAŞ)</span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">Chirmo Kids: Lingoria Macera Evreni</h3>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-pink-950 text-pink-300 px-3 py-1 rounded-full border border-pink-400/40">
                  8 SEVİYE HARİTASI
                </span>
              </div>

              {/* İNTERAKTİF TIKLANABİLİR BÜYÜLÜ SANDIK MODÜLÜ */}
              <div className="p-4 rounded-2xl bg-[#15092E] border-2 border-pink-400/40 shadow-inner mb-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-base animate-bounce">🎁</span>
                    <span className="text-xs font-black text-amber-300">
                      Maceracının Büyülü Teçhizat Sandığı
                    </span>
                  </div>
                  <button
                    onClick={handleToggleChest}
                    className="text-[10px] font-black bg-purple-900/60 hover:bg-purple-800 text-pink-300 px-2.5 py-1 rounded-lg border border-pink-400/40 cursor-pointer active:scale-95 transition-all"
                  >
                    {chestOpen ? 'Sandığı Kapat ✕' : 'Sandığı Aç ➔ (+15 XP)'}
                  </button>
                </div>

                {/* Sandık İçeriği */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                  <div
                    onClick={() => handleSpeak('I want water. I have a book.', selectedLanguage)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      chestOpen
                        ? 'bg-purple-900/60 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-102'
                        : 'bg-[#1D1140] border-purple-500/30 text-purple-300 hover:bg-[#281858]'
                    }`}
                  >
                    <div className="text-lg mb-0.5">🗡️</div>
                    <div className="text-[11px] font-black">Cümle Kılıcı</div>
                    <div className="text-[9px] text-purple-300 font-semibold">Tıkla & Dinle</div>
                  </div>

                  <div
                    onClick={() => handleSpeak('Do you like games? Where is the castle?', selectedLanguage)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      chestOpen
                        ? 'bg-sky-900/60 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-102'
                        : 'bg-[#1D1140] border-sky-500/30 text-sky-300 hover:bg-[#281858]'
                    }`}
                  >
                    <div className="text-lg mb-0.5">❓</div>
                    <div className="text-[11px] font-black">Soru Asası</div>
                    <div className="text-[9px] text-sky-300 font-semibold">Tıkla & Dinle</div>
                  </div>

                  <div
                    onClick={() => handleSpeak('Can I have an apple, please?', selectedLanguage)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      chestOpen
                        ? 'bg-amber-900/60 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-102'
                        : 'bg-[#1D1140] border-amber-500/30 text-amber-300 hover:bg-[#281858]'
                    }`}
                  >
                    <div className="text-lg mb-0.5">🛡️</div>
                    <div className="text-[11px] font-black">Nezaket Kalkanı</div>
                    <div className="text-[9px] text-amber-300 font-semibold">Tıkla & Dinle</div>
                  </div>
                </div>
              </div>

              {/* 3 Özel Krallık Bölgesi */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-black mb-5">
                <div className="p-2 rounded-xl bg-[#1C0E3A] border border-pink-500/20 text-pink-200">
                  🌲 Kelime Ormanı
                </div>
                <div className="p-2 rounded-xl bg-[#1C0E3A] border border-pink-500/20 text-pink-200">
                  🏰 Gramer Kalesi
                </div>
                <div className="p-2 rounded-xl bg-[#1C0E3A] border border-pink-500/20 text-pink-200">
                  🎵 Şarkı Adası
                </div>
              </div>
            </div>

            {/* Kapı Giriş Butonu */}
            <button
              onClick={onEnterKidsWorld}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm shadow-[0_0_30px_rgba(236,72,153,0.4)] flex items-center justify-center space-x-2 cursor-pointer active:scale-98 transition-all border border-pink-300/40"
            >
              <span>Lingoria Dünyasını Aç 🎮</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================== 3. CANLI SAVAŞ & KALIP ARENASI (10 SANİYEDE TEST ET) ==================== */}
        <section className="rounded-3xl bg-[#140E36]/90 border-2 border-purple-500/40 p-6 sm:p-7 shadow-2xl backdrop-blur-xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-purple-500/30">
            <div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                  CANLI KALIP ARENASI
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Kalıp Mantığını 10 Saniyede Görün
              </h2>
            </div>

            {/* Hızlı Senaryo Seçici */}
            <div className="flex flex-wrap gap-1.5">
              {DEMO_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setActiveDemo(sc);
                    setPlayerXp((p) => p + 5);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeDemo.id === sc.id
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-300'
                      : 'bg-[#1C1448] text-purple-200 hover:bg-[#281D60]'
                  }`}
                >
                  <span>{sc.icon}</span>
                  <span>{sc.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aktif Soru & Cevap Kartı */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sol: Cümle & Ses */}
            <div className="p-4 rounded-2xl bg-[#0F092A] border border-purple-500/30 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 mb-1">
                  🇹🇷 "{activeDemo.tr}"
                </div>
                <div className="text-lg sm:text-xl font-black text-cyan-300 leading-snug mb-3">
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

            {/* Sağ: Formül & Püf Noktası */}
            <div className="p-4 rounded-2xl bg-[#0F092A] border border-purple-500/30 flex flex-col justify-between text-xs space-y-2">
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

        {/* ==================== 4. TÜRKİYE KÖK NEDEN ANALİZİ (GİZLİ GÜÇ) ==================== */}
        <section className="mb-6 p-6 rounded-3xl bg-[#120B30]/90 border border-purple-500/30">
          <div className="text-center max-w-xl mx-auto mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">NEDEN YILLARDIR ÇÖZÜLEMİYORDU?</span>
            <h3 className="text-xl font-black text-white mt-0.5">Neden Yıllardır Konuşamıyoruz?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 font-medium">
              <div className="font-black text-rose-400 mb-1">❌ Geleneksel Kurs & Kitap Çıkmazı:</div>
              Yıllarca Tense ezberletilir, hata yapınca küçük düşme korkusuyla kimse ağzını açamaz.
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 font-medium">
              <div className="font-black text-emerald-400 mb-1">✅ Chirmo Oyun & Kalıp Çözümü:</div>
              Cümle Kılıcı ve Soru Asası ile zihinsel Lego kalıpları ve 7/24 yargılamayan canlı AI koçu.
            </div>
          </div>
        </section>

        {/* ==================== 5. ALT BİLGİ HUD ==================== */}
        <footer className="pt-4 border-t border-purple-500/20 text-xs text-purple-300/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sıfır Kişisel Veri & Tarayıcı Tabanlı Güvenli Dil Stüdyosu</span>
          </div>
          <div>© {new Date().getFullYear()} Chirmo. Tüm hakları saklıdır.</div>
        </footer>
      </main>
    </div>
  );
};

export default ChirmoHeroLandingPortal;
