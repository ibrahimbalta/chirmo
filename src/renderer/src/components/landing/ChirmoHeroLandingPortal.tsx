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
  RotateCcw
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
    <div className="min-h-screen w-full bg-[#FAF9FE] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* ==================== 1. RAFİNE MİNİMALİST NAVBAR ==================== */}
      <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Sol: Logo */}
          <div
            onClick={onEnterStudentPanel}
            className="flex items-center space-x-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            title="Chirmo Ana Sayfa"
          >
            <ChirmoLogo size="md" variant="header" />
            <span className="hidden xl:inline-flex text-[10px] font-black tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/50">
              Konuşma Koçu
            </span>
          </div>

          {/* Orta: İçerik Köprüsü Menüsü */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 text-xs font-bold text-slate-600">
            <button
              onClick={onEnterCamp}
              className="px-3 py-1.5 rounded-xl hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              30 Günlük Kamp
            </button>
            <button
              onClick={onEnterKidsWorld}
              className="px-3 py-1.5 rounded-xl hover:text-pink-600 hover:bg-slate-100 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <span>Lingoria Kids</span>
              <span className="text-[10px] font-extrabold bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded-full">5-17 Yaş</span>
            </button>
            <button
              onClick={onEnterPhraseBank}
              className="px-3 py-1.5 rounded-xl hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Yaşam Kalıp Deposu
            </button>
            <button
              onClick={onEnterSimulator}
              className="px-3 py-1.5 rounded-xl hover:text-purple-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Sesli Simülatör
            </button>
          </nav>

          {/* Sağ: Dil Değiştirici & Aksiyon Butonu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Segmented Dil Butonu */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'en'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="İngilizce Çalış"
              >
                <span>🇬🇧</span>
                <span className="font-bold">EN</span>
              </button>
              <button
                onClick={() => handleLanguageChange('de')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'de'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Almanca Çalış"
              >
                <span>🇩🇪</span>
                <span className="font-bold">DE</span>
              </button>
            </div>

            {/* Panele Gir Butonu */}
            <button
              onClick={onEnterStudentPanel}
              className="h-9.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Öğrenci Paneline Gir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. SPLIT HERO: EDİTÖRYAL HİKÂYE & CANLI CHIRMO SAHNESİ ==================== */}
      <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Zarif Ambiyans Işık Hareleri */}
        <div className="absolute top-12 left-1/4 w-[450px] h-[350px] bg-gradient-to-tr from-indigo-200/30 via-purple-100/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 right-10 w-[400px] h-[350px] bg-gradient-to-bl from-pink-200/20 via-blue-100/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* SOL SÜTUN (7 Birim): İDDİALI EDİTÖRYAL BAŞLIK VE HİKÂYE */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Üst Konsept Etiketi */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-200/60 text-indigo-700 text-xs font-extrabold tracking-wide mb-5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>TÜRKİYE'YE ÖZEL KONUŞMA METODOLOJİSİ</span>
            </div>

            {/* Ana Manşet */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-slate-950 tracking-tight leading-[1.08] mb-6">
              Yıllarca Ezberlediniz, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
                Artık Konuşma Vakti!
              </span>
            </h1>

            {/* Açıklama */}
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl mb-8">
              Kural ezberlemek sizi konuşturmaz. Chirmo, zihinsel düşünce kalıpları ve 7/24 yanınızda olan{' '}
              <strong className="text-slate-900 font-bold">yargılamayan yapay zekâ karakteriyle</strong>{' '}
              30 günde <span className="text-indigo-600 font-bold underline decoration-indigo-300">İngilizce</span> ve{' '}
              <span className="text-purple-600 font-bold underline decoration-purple-300">Almanca</span> konuşma bariyerinizi kökten yıkar.
            </p>

            {/* Büyük Eylemler */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8">
              <button
                onClick={onEnterStudentPanel}
                className="h-13 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-indigo-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <span>Öğrenci Paneline Başla</span>
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onEnterKidsWorld}
                className="h-13 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-pink-200 hover:border-pink-400 font-extrabold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <span className="text-lg">🏰</span>
                <span>Lingoria Dünyasını Aç</span>
                <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-md font-black">KIDS</span>
              </button>
            </div>

            {/* Güven ve Sosyal Kanıt Çizgisi */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-bold text-slate-500 pt-2 border-t border-slate-200/80 w-full max-w-xl">
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Günde 15 Dk Mikro Pratik</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sıfır Kişisel Veri & Gizlilik</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>CEFR A1-B2 Standartlarında</span>
              </div>
            </div>
          </div>

          {/* SAĞ SÜTUN (5 Birim): CHIRMO CANLI KARAKTER & DİYALOG SAHNESİ */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Arka Plan Konsol Kartı */}
            <div className="w-full max-w-md p-6 sm:p-7 rounded-[32px] bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
              
              {/* Üst Bar: Aktif Senaryo Seçici */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{activeDemo.icon}</span>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Canlı Simülasyon</div>
                    <div className="text-xs font-black text-slate-800">{activeDemo.category}</div>
                  </div>
                </div>

                {/* Eşitlik / Ses Dalgaları Göstergesi */}
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                  <span className={`w-1 h-3 rounded-full bg-indigo-600 ${isSpeaking ? 'animate-bounce' : 'h-2'}`} />
                  <span className={`w-1 h-4 rounded-full bg-purple-600 ${isSpeaking ? 'animate-bounce [animation-delay:150ms]' : 'h-3'}`} />
                  <span className={`w-1 h-2 rounded-full bg-pink-500 ${isSpeaking ? 'animate-bounce [animation-delay:300ms]' : 'h-2'}`} />
                  <span className="text-[10px] font-bold text-indigo-700 pl-1">
                    {isSpeaking ? 'Konuşuyor' : 'Hazır'}
                  </span>
                </div>
              </div>

              {/* DİYALOG BALONU 1: CHIRMO KARAKTERİ KONUŞUYOR */}
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
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50/60 border-indigo-200 shadow-xs'
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-extrabold text-indigo-700 mb-1">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>Chirmo AI Partner</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Tıkla & Dinle 🔊</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  "{selectedLanguage === 'en' ? activeDemo.dialoguePartner.en : activeDemo.dialoguePartner.de}"
                </div>
              </div>

              {/* MERKEZİ ROBOT KARAKTER ALANI */}
              <div className="relative py-4 my-2 flex items-center justify-center">
                {/* Çok Katmanlı Işıltı Halkaları */}
                <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/15 blur-xl -z-10 animate-pulse" />
                <div className="absolute w-36 h-36 rounded-full border border-indigo-200/60 -z-10 animate-[spin_20s_linear_infinite]" />

                {/* Karakter Görseli */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 transition-transform duration-300 hover:scale-105">
                  <img
                    src="./chirmo-character.png"
                    alt="Chirmo Konuşma Robotu"
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(79,70,229,0.22)]"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/chirmo-avatar.png')) {
                        target.src = './chirmo-avatar.png';
                      }
                    }}
                  />

                  {/* Konuşma Rozeti */}
                  <button
                    onClick={() =>
                      handleSpeak(
                        selectedLanguage === 'en' ? activeDemo.en : activeDemo.de,
                        selectedLanguage
                      )
                    }
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-extrabold shadow-md flex items-center space-x-1.5 transition-colors cursor-pointer"
                    title="Cümleyi Sesli Oku"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-amber-400' : ''}`} />
                    <span>Sesli Dinle</span>
                  </button>
                </div>
              </div>

              {/* DİYALOG BALONU 2: ÖĞRENCİ CEVABI (TÜRKÇE DÜŞÜNCE KALIBI) */}
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
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50/60 border-emerald-200 shadow-xs'
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-800 mb-1">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Senin Kuracağın Kalıp Cümle</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">+15 XP</span>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-950 leading-snug">
                  "{selectedLanguage === 'en' ? activeDemo.en : activeDemo.de}"
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-1">
                  🇹🇷 {activeDemo.tr}
                </div>
              </div>

              {/* Hızlı Senaryo Değiştirici Hapları */}
              <div className="flex items-center justify-between gap-1 pt-4 mt-4 border-t border-slate-100">
                {DEMO_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setActiveDemo(sc);
                      setHeroBubbleActive('user');
                    }}
                    className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-black transition-all cursor-pointer text-center ${
                      activeDemo.id === sc.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-500 hover:bg-slate-100'
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

      {/* ==================== 3. İKİ BÜYÜK DÜNYA (RENKLİ & MİMARİ ALANLAR) ==================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-100/60 border-y border-slate-200/80 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Bölüm Başlığı */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
              KİŞİYE ÖZEL İKİ FARKLI ÖĞRENME YOLU
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1.5">
              Hedefinize Uygun Dünyayı Seçin
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2">
              Yetişkinler için günlük 15 dakikalık iş & yaşam kampı, çocuklar için 8 seviyeli macera RPG oyunu.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PORTAL 1: YETİŞKİNLER & GENÇLER İÇİN 30 GÜNLÜK KAMP */}
            <div className="rounded-[32px] bg-white border border-slate-200 shadow-xl p-7 sm:p-8 flex flex-col justify-between hover:border-indigo-400 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-500/20">
                    🏕️
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Yetişkin & Kariyer Modu
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2">
                  30 Günde Kendini İfade Etme Kampı
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
                  Saatlerce gramer dinlemek yok. Günlük 15 dakikalık 4 istasyondan oluşan konuşma parkurunu tamamlayın, sesli diyalog kurun ve sertifikanızı alın.
                </p>

                {/* 4 İstasyon Şeması */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div className="text-xs font-black text-indigo-600 mb-0.5">1. İstasyon</div>
                    <div className="text-[11px] font-bold text-slate-700">3 Dk Isınma</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div className="text-xs font-black text-indigo-600 mb-0.5">2. İstasyon</div>
                    <div className="text-[11px] font-bold text-slate-700">Kalıp Analizi</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-center">
                    <div className="text-xs font-black text-indigo-700 mb-0.5">3. İstasyon</div>
                    <div className="text-[11px] font-black text-indigo-950">AI Canlı Arama</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div className="text-xs font-black text-indigo-600 mb-0.5">4. İstasyon</div>
                    <div className="text-[11px] font-bold text-slate-700">Düello & Rozet</div>
                  </div>
                </div>

                {/* Özellikler */}
                <ul className="space-y-2.5 text-xs font-bold text-slate-700 mb-8">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>İş görüşmesi, seyahat, restoran ve günlük diyalog kalıpları</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Chirmo AI ile gerçek telefon görüşmesi gibi 2 dakikalık sesli seans</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Hata yaptığınızda anında kibar ve motive edici Türkçe rehberlik</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterStudentPanel}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md hover:shadow-indigo-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>30 Günlük Kampa & Öğrenci Paneline Başla</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PORTAL 2: 5-17 YAŞ ÇOCUKLAR İÇİN LINGORIA KIDS */}
            <div className="rounded-[32px] bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-white border border-pink-200 shadow-xl p-7 sm:p-8 flex flex-col justify-between hover:border-pink-400 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-pink-500/20">
                    🏰
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200/60">
                    5-17 Yaş Çocuk & Genç
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2">
                  Chirmo Kids: Lingoria Macera Evreni
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
                  Sıkıcı ders masaları yerine eğlenceli bir RPG oyunu. Çocuklar İngilizce ve Almancayı görevler yaparak, seviye atlayarak ve konuşarak öğrenir.
                </p>

                {/* Harita ve Teçhizat Sandığı Önizleme Paneli */}
                <div className="p-3.5 rounded-2xl bg-white border border-pink-100 shadow-xs mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-purple-900 flex items-center space-x-1.5">
                      <span>⚔️</span>
                      <span>Maceracının Büyülü Teçhizat Sandığı</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">8 Seviye Haritası</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-black text-slate-700">
                    <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-100">
                      <div>🗡️ Cümle Kılıcı</div>
                      <div className="text-[9px] text-purple-600 font-semibold">Cümle Kurma</div>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100">
                      <div>❓ Soru Asası</div>
                      <div className="text-[9px] text-blue-600 font-semibold">Soru Sorma</div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100">
                      <div>🛡️ Nezaket Kalkanı</div>
                      <div className="text-[9px] text-amber-600 font-semibold">Rica & İstek</div>
                    </div>
                  </div>
                </div>

                {/* Özellikler */}
                <ul className="space-y-2.5 text-xs font-bold text-slate-700 mb-8">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>8 farklı fantastik ada (Kelime Ormanı, Gramer Kalesi, Şarkı Adası)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>Doğru telaffuzla konuşan hikâyeler ve karaoke şarkıları</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>XP, yıldızlar, seviye kilitleri ve güvenli çocuk modu</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterKidsWorld}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-sm shadow-md hover:shadow-pink-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Lingoria Dünyasını Aç 🎮</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. TÜRKİYE KÖK NEDEN ANALİZİ ==================== */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
            NEDEN YILLARDIR ÇÖZÜLEMİYORDU?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-1.5">
            Neden Yıllardır Konuşamıyoruz?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2">
            Sorun sizde değil; Türkçenin sondan eklemeli yapısıyla yabancı dillerin kalıp mimarisinin yanlış öğretilmesinde.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ESKİ METOT */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80">
            <div className="text-xs font-black text-rose-600 uppercase tracking-wider mb-2">❌ Geleneksel Kurslar & Kitaplar</div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Ezber Odaklı Yaklaşım</h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 font-semibold">
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-black shrink-0 mt-0.5">✕</span>
                <span>Yıllarca Present Perfect, Past Continuous gibi formüller ezberletilir; konuşmaya sıra gelmez.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-black shrink-0 mt-0.5">✕</span>
                <span>Hata yapınca eleştirilme veya sınıfta küçük düşme korkusu konuşma refleksini kilitler.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-black shrink-0 mt-0.5">✕</span>
                <span>Kelimeler tek tek ezberlenir; beyin cümleyi Türkçeden çevirmeye çalışırken tıkanır.</span>
              </li>
            </ul>
          </div>

          {/* CHIRMO ÇÖZÜMÜ */}
          <div className="p-8 rounded-3xl bg-indigo-50/50 border-2 border-indigo-200">
            <div className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-2">✅ Chirmo Konuşma Metodolojisi</div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Zihinsel Lego & Canlı AI Koçu</h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-800 font-bold">
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-indigo-600 font-black shrink-0 mt-0.5" />
                <span><strong>Cümle Kılıcı & Soru Asası:</strong> Dilbilgisi kuralları yerine hazır düşünce kalıplarıyla ilk günden cümle kurarsınız.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-indigo-600 font-black shrink-0 mt-0.5" />
                <span><strong>%100 Yargılamayan Chirmo AI:</strong> 7/24 istediğiniz kadar konuşun, hata yapın; sabırla yönlendirir.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-indigo-600 font-black shrink-0 mt-0.5" />
                <span><strong>1000+ Yaşam Kalıp Deposu:</strong> Kafe, otel, mülakat gibi tüm gerçek senaryolar elinizin altındadır.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ==================== 5. İNTERAKTİF SESLİ PRATİK DECKİ ==================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-y border-slate-200/80 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600">
              CANLI DENEYİM ALANI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Kalıp Mantığını 10 Saniyede Görün
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5">
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
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{sc.icon}</span>
                <span>{sc.category}</span>
              </button>
            ))}
          </div>

          {/* İnteraktif Kart */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF9FE] border border-slate-200/90 shadow-lg max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600">
                  {activeDemo.icon} {activeDemo.category}
                </span>
                <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  🇹🇷 "{activeDemo.tr}"
                </div>
              </div>

              {/* Dil Değiştirici */}
              <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                    selectedLanguage === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => handleLanguageChange('de')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                    selectedLanguage === 'de' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-500'
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
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
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
                className="h-12 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-md active:scale-95 transition-all"
                title="Sesli Telaffuz Dinle"
              >
                <Volume2 className={`w-4.5 h-4.5 ${isSpeaking ? 'animate-bounce text-amber-300' : ''}`} />
                <span>{isSpeaking ? 'Okunuyor...' : 'Sesli Dinle'}</span>
              </button>
            </div>

            {/* Formül ve İpucu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-200/80 text-xs mt-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="font-black text-indigo-900 mb-0.5">🧠 Zihinsel Kural / Formül:</div>
                <div className="font-semibold text-indigo-700">{activeDemo.formula}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="font-black text-amber-900 mb-0.5">💡 Türk Öğrenci Püf Noktası:</div>
                <div className="font-semibold text-amber-800">{activeDemo.tip}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. GECE MAVİSİ PRESTİJLİ FOOTER CTA ==================== */}
      <footer className="bg-[#0B0F19] text-white pt-16 pb-12 px-4 sm:px-6 w-full mt-auto">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>KAYIT VEYA KREDİ KARTI GEREKMEZ</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Bugün İlk Cümlenizi Kurun.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-8 font-medium">
            Tarayıcınızda sıfır kişisel veri güvenliğiyle hemen öğrenci paneline giriş yapın ve pratik yapmaya başlayın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <button
              onClick={onEnterStudentPanel}
              className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Öğrenci Paneline Gir ➔</span>
            </button>
            <button
              onClick={onEnterKidsWorld}
              className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-sm border border-slate-700 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>🏰 Kids Dünyasını Aç</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-8 border-t border-slate-800/80 font-medium gap-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-500" />
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
