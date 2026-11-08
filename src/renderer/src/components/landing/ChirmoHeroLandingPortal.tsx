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
  Sparkle,
  Gift,
  HelpCircle,
  Lightbulb
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
  badgeColor: string;
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
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
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
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
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
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
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
    badgeColor: 'bg-pink-100 text-pink-900 border-pink-300',
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
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#FBF9FF] text-slate-900 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900 scroll-smooth relative">
      {/* ==================== AÇIK VE CANLI ÇOK RENKLİ ARKA PLAN IŞIKLARI ==================== */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Güneş Sarısı, Şeker Pembesi, Gök Mavisi & Nane Yeşili Işık Küreleri */}
        <div className="absolute -top-20 -left-20 w-[550px] h-[550px] bg-gradient-to-br from-amber-200/50 to-pink-200/40 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-sky-200/50 to-indigo-200/40 rounded-full blur-[100px]" />
        <div className="absolute top-2/3 left-1/4 w-[550px] h-[550px] bg-gradient-to-tr from-emerald-100/60 to-purple-200/40 rounded-full blur-[110px]" />
        <div className="absolute -bottom-20 right-1/3 w-[600px] h-[600px] bg-gradient-to-tl from-pink-200/40 to-amber-100/50 rounded-full blur-[120px]" />

        {/* Canlı Noktalı Oyun Deseni */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#4f46e5 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      {/* ==================== 1. RENKLİ & FERAH OYUN ÜST BARI (NAVBAR) ==================== */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b-2 border-indigo-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-17 flex items-center justify-between gap-3">
          
          {/* Sol: Chirmo Logosu & Renkli Oyun Rozeti */}
          <div
            onClick={onEnterStudentPanel}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            title="Chirmo Ana Portalı"
          >
            <div className="relative">
              <div className="bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-600 p-0.5 rounded-2xl shadow-md group-hover:scale-105 transition-transform">
                <div className="bg-white p-1 rounded-[14px]">
                  <ChirmoLogo size="md" variant="header" />
                </div>
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-black tracking-wider text-indigo-900 uppercase flex items-center space-x-1">
                <span>DİL OYUN EVRENİ</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[10px] text-purple-600 font-extrabold">30 Günde Konuşma Devrimi</span>
            </div>
          </div>

          {/* Orta: Renkli Kategori Hapları */}
          <nav className="hidden lg:flex items-center space-x-2 text-xs font-black">
            <button
              onClick={onEnterCamp}
              className="px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 text-amber-900 hover:border-amber-400 transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs active:scale-95"
            >
              <span className="text-sm">🏕️</span>
              <span>30 Günlük Kamp</span>
            </button>
            <button
              onClick={onEnterKidsWorld}
              className="px-3.5 py-2 rounded-2xl bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 text-pink-900 hover:border-pink-400 transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs active:scale-95"
            >
              <span className="text-sm">🏰</span>
              <span>Lingoria Kids</span>
              <span className="text-[9px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-black">5-17 Yaş</span>
            </button>
            <button
              onClick={onEnterPhraseBank}
              className="px-3.5 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 text-sky-900 hover:border-sky-400 transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs active:scale-95"
            >
              <span className="text-sm">💬</span>
              <span>Kalıp Deposu</span>
            </button>
            <button
              onClick={onEnterSimulator}
              className="px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 text-emerald-900 hover:border-emerald-400 transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs active:scale-95"
            >
              <span className="text-sm">🎙️</span>
              <span>Sesli Simülatör</span>
            </button>
          </nav>

          {/* Sağ: Dil Değiştirici & Renkli Başlama Butonu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dil Seçici Hapı */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border-2 border-slate-200 text-xs font-black">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'en'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="İngilizce Öğren"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
              <button
                onClick={() => handleLanguageChange('de')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'de'
                    ? 'bg-gradient-to-r from-amber-500 to-pink-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Almanca Öğren"
              >
                <span>🇩🇪</span>
                <span>DE</span>
              </button>
            </div>

            {/* Oyuna Başla Butonu (3D Buton Dokusu) */}
            <button
              onClick={onEnterStudentPanel}
              className="h-10.5 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-md hover:shadow-lg border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Öğrenci Paneline Gir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. AÇIK RENKLİ HERO ALANI: RENKLİ OYUN ARENASI ==================== */}
      <section className="relative pt-8 sm:pt-12 pb-14 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* SOL: MANŞET VE HİKÂYE (RENKLİ & NEŞELİ) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Görev Başlığı / XP Rozeti */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-pink-100 to-purple-100 border-2 border-purple-200 text-purple-900 text-xs font-black tracking-wide mb-6 shadow-xs">
              <span className="text-amber-500 text-base">✨</span>
              <span>30 GÜNDE KONUŞMA MACERASI</span>
              <span className="bg-gradient-to-r from-amber-400 to-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                +100 XP KAZAN
              </span>
            </div>

            {/* Ana Başlık */}
            <h1 className="text-4xl sm:text-6xl lg:text-[4rem] font-black tracking-tight leading-[1.06] text-slate-900 mb-6">
              Yıllarca Ezberlediniz, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-500">
                Artık Konuşma Vakti!
              </span>
            </h1>

            {/* Açıklama */}
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-xl mb-8">
              Kural ezberlemek yerine; <strong className="text-indigo-700 font-bold">Cümle Kılıcı</strong>,{' '}
              <strong className="text-purple-700 font-bold">Soru Asası</strong> ve 7/24 yanınızda olan{' '}
              <strong className="text-pink-600 font-bold">yargılamayan Chirmo AI konuşma koçuyla</strong>{' '}
              30 günde <span className="bg-indigo-100 text-indigo-900 font-black px-1.5 py-0.5 rounded-lg">İngilizce</span> ve{' '}
              <span className="bg-amber-100 text-amber-900 font-black px-1.5 py-0.5 rounded-lg">Almanca</span> konuşma refleksinizi açın.
            </p>

            {/* 2 Büyük Oyun Butonu */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
              {/* Buton 1: Öğrenci Paneline Başla */}
              <button
                onClick={onEnterStudentPanel}
                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-indigo-500/25 border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center space-x-3 cursor-pointer"
              >
                <Swords className="w-5 h-5 text-amber-300" />
                <span>Öğrenci Paneline Başla</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Buton 2: Lingoria Kids Dünyası */}
              <button
                onClick={onEnterKidsWorld}
                className="h-14 px-7 rounded-2xl bg-white hover:bg-pink-50 text-pink-700 border-2 border-pink-300 hover:border-pink-500 font-black text-sm sm:text-base shadow-md border-b-4 border-pink-400 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
              >
                <span className="text-2xl animate-bounce">🏰</span>
                <span>Lingoria Dünyasını Aç</span>
                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-black border border-pink-200">
                  5-17 YAŞ
                </span>
              </button>
            </div>

            {/* Renkli 3 Mini Başarı Kartı */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xl">
              <div className="p-3 rounded-2xl bg-amber-50/80 border-2 border-amber-200 flex items-center space-x-2.5 shadow-2xs">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="text-xs font-black text-amber-950">30 Günlük Seri</div>
                  <div className="text-[10px] text-amber-700 font-bold">Günde 15 Dk</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/80 border-2 border-purple-200 flex items-center space-x-2.5 shadow-2xs">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="text-xs font-black text-purple-950">1000+ Kalıp</div>
                  <div className="text-[10px] text-purple-700 font-bold">Zihinsel Lego</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/80 border-2 border-emerald-200 flex items-center space-x-2.5 shadow-2xs">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="text-xs font-black text-emerald-950">%100 Güven</div>
                  <div className="text-[10px] text-emerald-700 font-bold">Yargılanmasız</div>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ: CANLI CHIRMO KARAKTERİ & RENKLİ OYUN SAHNESİ */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Beyaz ve Renkli Kart Tabanı */}
            <div className="relative w-full max-w-md p-6 sm:p-7 rounded-[36px] bg-white border-2 border-indigo-200 shadow-2xl shadow-indigo-500/10 overflow-hidden">
              
              {/* Kartın Arkasındaki Renkli Gradyan Parıltılar */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-200/50 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />

              {/* Üst Kısım: Senaryo ve Ses Dalgaları */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b-2 border-slate-100 relative z-10">
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl p-1.5 rounded-xl bg-amber-100 border border-amber-200">
                    {activeDemo.icon}
                  </span>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-purple-600">CANLI DİYALOG ARENASI</div>
                    <div className="text-xs font-black text-slate-900">{activeDemo.category}</div>
                  </div>
                </div>

                {/* Ekolayzır Ses Dalgaları */}
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200">
                  <span className={`w-1 rounded-full bg-amber-500 ${isSpeaking ? 'h-4 animate-bounce' : 'h-2'}`} />
                  <span className={`w-1 rounded-full bg-pink-500 ${isSpeaking ? 'h-6 animate-bounce [animation-delay:150ms]' : 'h-3'}`} />
                  <span className={`w-1 rounded-full bg-indigo-600 ${isSpeaking ? 'h-5 animate-bounce [animation-delay:300ms]' : 'h-2'}`} />
                  <span className="text-[10px] font-black text-purple-900 pl-1">
                    {isSpeaking ? 'KONUŞUYOR' : 'HAZIR'}
                  </span>
                </div>
              </div>

              {/* DİYALOG BALONU 1: CHIRMO AI SORUSU */}
              <div
                onClick={() => {
                  setHeroBubbleActive('chirmo');
                  handleSpeak(
                    selectedLanguage === 'en' ? activeDemo.dialoguePartner.en : activeDemo.dialoguePartner.de,
                    selectedLanguage
                  );
                }}
                className={`p-3.5 rounded-2xl mb-3 cursor-pointer transition-all border-2 relative z-10 ${
                  heroBubbleActive === 'chirmo'
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-400 shadow-md scale-[1.01]'
                    : 'bg-slate-50 border-slate-200 hover:bg-purple-50/50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-black text-purple-800 mb-1">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    <span>Chirmo AI Konuşma Partneri</span>
                  </span>
                  <span className="text-[10px] font-black bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                    Tıkla & Dinle 🔊
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 leading-snug">
                  "{selectedLanguage === 'en' ? activeDemo.dialoguePartner.en : activeDemo.dialoguePartner.de}"
                </div>
              </div>

              {/* MERKEZİ 3D CHIRMO KARAKTERİ & BÜYÜLÜ PLATFORM */}
              <div className="relative py-3 my-1 flex items-center justify-center z-10">
                {/* Çok Renkli Parlayan Güneş / Halka */}
                <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-amber-300/40 via-pink-400/40 to-indigo-400/40 blur-xl animate-pulse" />
                <div className="absolute w-36 h-36 rounded-full border-4 border-dashed border-purple-300 animate-[spin_20s_linear_infinite]" />

                {/* 3D Karakter Görseli */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 transition-transform duration-300 hover:scale-105 select-none">
                  <img
                    src="./chirmo-character.png"
                    alt="Chirmo Konuşma Robotu"
                    className="w-full h-full object-contain filter drop-shadow-[0_16px_24px_rgba(79,70,229,0.3)]"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/chirmo-avatar.png')) {
                        target.src = './chirmo-avatar.png';
                      }
                    }}
                  />

                  {/* Sesli Okuma Aksiyon Butonu */}
                  <button
                    onClick={() =>
                      handleSpeak(
                        selectedLanguage === 'en' ? activeDemo.en : activeDemo.de,
                        selectedLanguage
                      )
                    }
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-600 hover:from-amber-500 hover:to-indigo-700 text-white text-xs font-black shadow-md border-b-2 border-indigo-900 active:border-b-0 active:translate-y-0.5 flex items-center space-x-1.5 transition-all cursor-pointer"
                    title="Cümleyi Sesli Oku"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-amber-200' : ''}`} />
                    <span>SESLİ DİNLE</span>
                  </button>
                </div>
              </div>

              {/* DİYALOG BALONU 2: OYUNCUNUN KURACAĞI KALIP CEVAP */}
              <div
                onClick={() => {
                  setHeroBubbleActive('user');
                  handleSpeak(
                    selectedLanguage === 'en' ? activeDemo.en : activeDemo.de,
                    selectedLanguage
                  );
                }}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border-2 relative z-10 ${
                  heroBubbleActive === 'user'
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400 shadow-md scale-[1.01]'
                    : 'bg-slate-50 border-slate-200 hover:bg-emerald-50/50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-black text-emerald-800 mb-1">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Senin Kuracağın Kalıp Cümle</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full font-black">
                    +15 XP ⚡
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 leading-snug">
                  "{selectedLanguage === 'en' ? activeDemo.en : activeDemo.de}"
                </div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">
                  🇹🇷 {activeDemo.tr}
                </div>
              </div>

              {/* Hızlı Senaryo Seçici Hapları */}
              <div className="flex items-center justify-between gap-1.5 pt-3.5 mt-3.5 border-t-2 border-slate-100 relative z-10">
                {DEMO_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setActiveDemo(sc);
                      setHeroBubbleActive('user');
                    }}
                    className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer text-center border ${
                      activeDemo.id === sc.id
                        ? 'bg-indigo-600 text-white shadow-xs border-indigo-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
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

      {/* ==================== 3. İKİ BÜYÜK DÜNYA (RENKLİ & FERAH KARTLAR) ==================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-y-2 border-indigo-100 w-full relative">
        <div className="max-w-7xl mx-auto">
          {/* Başlık */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border-2 border-indigo-200 px-3.5 py-1 rounded-full">
              HEDEFİNE GÖRE DÜNYANI SEÇ
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              İki Farklı Macera Kapısı
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-2">
              Yetişkinler için günlük 15 dakikalık iş & yaşam kampı, çocuklar için 8 seviyeli fantastik RPG macerası.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* KART 1: YETİŞKİNLER & GENÇLER İÇİN 30 GÜNLÜK KAMP */}
            <div className="rounded-[36px] bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 border-3 border-indigo-200 p-8 shadow-xl flex flex-col justify-between hover:border-indigo-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-indigo-300">
                    🏕️
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300">
                    Yetişkin & Kariyer Modu
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                  30 Günde Kendini İfade Etme Kampı
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                  Günde sadece 15 dakika! 4 istasyondan oluşan günlük konuşma parkuruyla kafe, havalimanı, otel ve iş görüşmelerinde duraksamadan konuşun.
                </p>

                {/* 4 İstasyon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  <div className="p-3 rounded-2xl bg-white border-2 border-indigo-100 text-center shadow-xs">
                    <div className="text-[10px] font-black text-indigo-600 uppercase">1. İSTASYON</div>
                    <div className="text-xs font-black text-slate-800 mt-0.5">3 Dk Isınma</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border-2 border-indigo-100 text-center shadow-xs">
                    <div className="text-[10px] font-black text-indigo-600 uppercase">2. İSTASYON</div>
                    <div className="text-xs font-black text-slate-800 mt-0.5">Kalıp Analizi</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-100 border-2 border-indigo-300 text-center shadow-xs">
                    <div className="text-[10px] font-black text-indigo-900 uppercase">3. İSTASYON</div>
                    <div className="text-xs font-black text-indigo-950 mt-0.5">Canlı AI Arama</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border-2 border-indigo-100 text-center shadow-xs">
                    <div className="text-[10px] font-black text-indigo-600 uppercase">4. İSTASYON</div>
                    <div className="text-xs font-black text-slate-800 mt-0.5">Düello & Rozet</div>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm font-bold text-slate-700 mb-8">
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Chirmo AI ile telefonla konuşur gibi 2 dakikalık sesli diyalog</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Hata yaptığınızda yargılamayan, anında Türkçe ipuçlu koçluk</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>30 günlük parkur sonunda resmi bitirme sertifikası</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterStudentPanel}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>30 Günlük Kampa & Öğrenci Paneline Başla</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* KART 2: 5-17 YAŞ ÇOCUKLAR İÇİN LINGORIA KIDS */}
            <div className="rounded-[36px] bg-gradient-to-br from-pink-50/80 via-white to-amber-50/60 border-3 border-pink-200 p-8 shadow-xl flex flex-col justify-between hover:border-pink-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-pink-300">
                    🏰
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-pink-100 text-pink-900 border border-pink-300">
                    5-17 Yaş Çocuk & Genç
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                  Chirmo Kids: Lingoria Macera Evreni
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                  Sıkıcı ders masaları yerine eğlenceli bir RPG oyunu. Çocuklar İngilizce ve Almancayı görevler yaparak, seviye atlayarak ve konuşarak öğrenir.
                </p>

                {/* Büyülü Teçhizat Sandığı Önizleme Paneli */}
                <div className="p-4 rounded-2xl bg-white border-2 border-pink-200 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-black text-purple-900 flex items-center space-x-1.5">
                      <span>⚔️</span>
                      <span>Maceracının Büyülü Teçhizat Sandığı</span>
                    </span>
                    <span className="text-[10px] font-black text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200">
                      8 Seviye Haritası
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                      <div>🗡️ Cümle Kılıcı</div>
                      <div className="text-[9px] text-purple-700 font-semibold mt-0.5">Cümle Kurma</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950">
                      <div>❓ Soru Asası</div>
                      <div className="text-[9px] text-sky-700 font-semibold mt-0.5">Soru Sorma</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                      <div>🛡️ Nezaket Kalkanı</div>
                      <div className="text-[9px] text-amber-700 font-semibold mt-0.5">Rica & İstek</div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm font-bold text-slate-700 mb-8">
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-600 shrink-0" />
                    <span>8 farklı ada: Kelime Ormanı, Gramer Kalesi, Şarkı Adası</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-600 shrink-0" />
                    <span>Konuşan interaktif masallar ve doğru telaffuzlu şarkılar</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-600 shrink-0" />
                    <span>Kazanılan yıldızlar, seviyeler, XP'ler ve güvenli çocuk alanı</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterKidsWorld}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-sm shadow-md border-b-4 border-purple-900 active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Lingoria Dünyasını Aç 🎮</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. TÜRKİYE KÖK NEDEN ANALİZİ (NET & ANLAŞILIR) ==================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-rose-600 bg-rose-50 border-2 border-rose-200 px-3.5 py-1 rounded-full">
            KÖK NEDEN ANALİZİ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Neden Yıllardır Konuşamıyoruz?
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-2">
            Sorun sizde veya zekânızda değil; Türkiye'de uygulanan ezberci gramer tabularında.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ESKİ METOT */}
          <div className="p-8 rounded-3xl bg-rose-50/60 border-2 border-rose-200 shadow-sm">
            <div className="text-xs font-black text-rose-700 uppercase tracking-wider mb-2">❌ Geleneksel Kurslar & Kitaplar</div>
            <h3 className="text-xl font-black text-slate-900 mb-4">Gramer Ezberi ve Korku</h3>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-700 font-semibold">
              <li className="flex items-start space-x-3">
                <span className="text-rose-500 font-black shrink-0 mt-0.5">✕</span>
                <span>Yıllarca Present Perfect, Past Continuous gibi formüller ezberletilir; konuşmaya sıra gelmez.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-rose-500 font-black shrink-0 mt-0.5">✕</span>
                <span>Hata yapınca sınıfta eleştirilme veya küçük düşme korkusu konuşma refleksini kilitler.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-rose-500 font-black shrink-0 mt-0.5">✕</span>
                <span>Kelimeler tek tek ezberlenir; beyin cümleyi Türkçeden çevirmeye çalışırken donup kalır.</span>
              </li>
            </ul>
          </div>

          {/* CHIRMO ÇÖZÜMÜ */}
          <div className="p-8 rounded-3xl bg-emerald-50/60 border-2 border-emerald-300 shadow-sm">
            <div className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">✅ Chirmo Dil Metodolojisi</div>
            <h3 className="text-xl font-black text-slate-900 mb-4">Zihinsel Lego & Canlı AI Koçu</h3>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-800 font-bold">
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-600 font-black shrink-0 mt-0.5" />
                <span><strong>Cümle Kılıcı & Soru Asası:</strong> Dilbilgisi kuralları yerine hazır düşünce kalıplarıyla ilk günden cümle kurarsınız.</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-600 font-black shrink-0 mt-0.5" />
                <span><strong>%100 Yargılamayan Chirmo AI:</strong> 7/24 istediğiniz kadar konuşun, hata yapın; sabırla motive eder.</span>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-emerald-600 font-black shrink-0 mt-0.5" />
                <span><strong>1000+ Yaşam Kalıp Deposu:</strong> Kafe, otel, mülakat gibi tüm gerçek senaryolar elinizin altındadır.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ==================== 5. İNTERAKTİF SESLİ PRATİK DECKİ (10 SANİYEDE TEST ET) ==================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white via-indigo-50/40 to-white border-y-2 border-indigo-100 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
              CANLI OYUN ALANI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Kalıp Mantığını 10 Saniyede Görün
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-1.5">
              Aşağıdaki senaryolara tıklayın; doğru aksanlı telaffuzu ve zihinsel formülü inceleyin.
            </p>
          </div>

          {/* Senaryo Seçim Hapları */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveDemo(sc)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center space-x-2 border-2 ${
                  activeDemo.id === sc.id
                    ? 'bg-indigo-600 text-white shadow-md border-indigo-700 scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-base">{sc.icon}</span>
                <span>{sc.category}</span>
              </button>
            ))}
          </div>

          {/* İnteraktif Kart */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-indigo-200 shadow-xl max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-100">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600">
                  {activeDemo.icon} {activeDemo.category}
                </span>
                <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  🇹🇷 "{activeDemo.tr}"
                </div>
              </div>

              {/* Dil Değiştirici */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                    selectedLanguage === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => handleLanguageChange('de')}
                  className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer transition-all ${
                    selectedLanguage === 'de' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  🇩🇪 DE
                </button>
              </div>
            </div>

            {/* Cümle ve Sesli Çalma */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {selectedLanguage === 'en' ? '🇬🇧 İngilizce Kalıp:' : '🇩🇪 Almanca Kalıp:'}
                </div>
                <div className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight leading-snug">
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
                className="h-12 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-600 hover:from-amber-500 hover:to-indigo-700 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-md border-b-2 border-indigo-900 active:border-b-0 active:translate-y-0.5 transition-all"
                title="Sesli Telaffuz Dinle"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-amber-200' : ''}`} />
                <span>{isSpeaking ? 'OKUNUYOR...' : 'SESLİ DİNLE'}</span>
              </button>
            </div>

            {/* Formül ve İpucu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t-2 border-slate-100 text-xs mt-3">
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                <div className="font-black text-purple-900 mb-0.5">🧠 Zihinsel Kural / Formül:</div>
                <div className="font-semibold text-purple-700">{activeDemo.formula}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="font-black text-amber-900 mb-0.5">💡 Türk Öğrenci Püf Noktası:</div>
                <div className="font-semibold text-amber-800">{activeDemo.tip}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. FERAH VE IŞILTILI KANIŞ FOOTER ==================== */}
      <footer className="bg-slate-900 text-white pt-16 pb-12 px-4 sm:px-6 w-full mt-auto">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-300 text-xs font-black mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KAYIT VEYA KREDİ KARTI GEREKMEZ</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Bugün İlk Cümlenizi Kurun.
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-8 font-medium">
            Tarayıcınızda sıfır kişisel veri güvenliğiyle hemen öğrenci paneline giriş yapın ve pratik yapmaya başlayın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <button
              onClick={onEnterStudentPanel}
              className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-black text-sm sm:text-base shadow-lg border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Öğrenci Paneline Gir ➔</span>
            </button>
            <button
              onClick={onEnterKidsWorld}
              className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-slate-800 hover:bg-slate-700 text-pink-300 font-black text-sm sm:text-base border-2 border-slate-700 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>🏰 Kids Dünyasını Aç</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-8 border-t border-slate-800 font-medium gap-3">
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
