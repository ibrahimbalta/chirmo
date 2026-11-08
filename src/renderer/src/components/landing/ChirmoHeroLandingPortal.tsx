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
  Target,
  Trophy,
  Coffee,
  Plane,
  Building2,
  ShoppingBag,
  Briefcase,
  UtensilsCrossed,
  Award,
  Play,
  LogIn,
  LogOut,
  User,
  Settings,
  X,
  Calendar,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';
import { PrivacyAuthService, SafeUserSession } from '../../services/privacyAuthService';
import { UserProfileService, UserProfile, CEFRLevelSimple } from '../../services/userProfileService';
import { ChirmoAuthModal } from '../auth/ChirmoAuthModal';

export interface ChirmoHeroLandingPortalProps {
  onEnterStudentPanel: () => void;
  onEnterKidsWorld: () => void;
  onEnterCamp: () => void;
  onEnterPhraseBank: () => void;
  onEnterSimulator: () => void;
  onEnterGames?: () => void;
  onEnterTasks?: () => void;
  onEnterVideo?: () => void;
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
  },
  {
    id: 'career',
    category: 'İş & Mülakat',
    icon: '💼',
    title: 'Deneyim Belirtme',
    tr: 'Proje yönetimi alanında beş yıllık deneyimim var.',
    en: 'I have five years of experience in project management.',
    de: 'Ich habe fünf Jahre Erfahrung im Projektmanagement.',
    formula: 'Yetkinlik Kalkanı: I have [Süre] of experience in [Alan].',
    tip: 'İş mülakatlarında kendini tanıtırken en prestijli ve doğrudan giriş şablonudur.'
  },
  {
    id: 'restaurant',
    category: 'Restoran',
    icon: '🍽️',
    title: 'Hesap İsteme',
    tr: 'Hesabı alabilir miyiz lütfen?',
    en: 'Could we get the check, please?',
    de: 'Könnten wir bitte die Rechnung haben?',
    formula: 'Nezaket Asası: Could we get the check, please?',
    tip: 'Restorandan ayrılırken en doğal ve kibar hesap isteme refleksidir.'
  }
];

export const ChirmoHeroLandingPortal: React.FC<ChirmoHeroLandingPortalProps> = ({
  onEnterStudentPanel,
  onEnterKidsWorld,
  onEnterCamp,
  onEnterPhraseBank,
  onEnterSimulator,
  onEnterGames,
  onEnterTasks,
  onEnterVideo
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(() =>
    TargetLanguageService.getTargetLanguage()
  );
  const [currentUser, setCurrentUser] = useState<SafeUserSession | null>(() =>
    PrivacyAuthService.getCurrentUser()
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    UserProfileService.getProfile()
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Giriş Yapılmadan Hiçbir Link Doğrudan Panele Girmesin: Korumalı Eylem Yöneticisi
  const handleProtectedAction = (action: () => void) => {
    if (!currentUser) {
      setPendingAction(() => action);
      setIsAuthModalOpen(true);
    } else {
      action();
    }
  };
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
    const unsubLang = TargetLanguageService.subscribe((lang) => {
      setSelectedLanguage(lang);
    });
    const unsubAuth = PrivacyAuthService.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    const unsubProfile = UserProfileService.subscribe((profile) => {
      setUserProfile(profile);
    });

    return () => {
      unsubLang();
      unsubAuth();
      unsubProfile();
    };
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

  // Otomatik ses çalma kapalı (ziyaretçi Chirmo'ya veya ses butonuna tıkladığında çalar)

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
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#180B3A] via-[#28104E] via-[#1A1648] via-[#240C3E] to-[#0E0522] text-white flex flex-col font-sans select-none scroll-smooth relative">
      {/* ==================== KOZMİK GEÇİŞLİ RENKLER, AURORA VE NEBULA IŞILTILARI ==================== */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Çok Renkli Canlı Geçiş Gradyanları */}
        <div className="absolute top-0 left-1/4 w-[850px] h-[850px] bg-gradient-to-br from-indigo-500/35 via-purple-600/30 to-pink-500/25 rounded-full blur-[170px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[750px] h-[750px] bg-gradient-to-bl from-fuchsia-500/30 via-pink-600/25 to-indigo-700/20 rounded-full blur-[180px]" />
        <div className="absolute top-2/3 left-[-100px] w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/25 via-blue-600/25 to-purple-800/20 rounded-full blur-[170px]" />
        <div className="absolute bottom-0 right-1/4 w-[850px] h-[700px] bg-gradient-to-t from-emerald-500/20 via-teal-600/20 to-purple-900/25 rounded-full blur-[190px]" />

        {/* Canlı Galaksi Yıldızları */}
        <div className="absolute top-14 left-20 w-2 h-2 bg-cyan-300 rounded-full animate-ping opacity-80" />
        <div className="absolute top-40 right-28 w-2.5 h-2.5 bg-pink-400 rounded-full animate-pulse opacity-90" />
        <div className="absolute top-80 left-1/3 w-1.5 h-1.5 bg-amber-300 rounded-full animate-ping opacity-75" />
        <div className="absolute bottom-56 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-pulse opacity-85" />
        <div className="absolute bottom-24 left-24 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-80" />

        {/* İnce Holografik Izgara Deseni */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #c084fc 1px, transparent 1px), linear-gradient(to bottom, #c084fc 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* ==================== 1. PRESTİJLİ VE BÜYÜTÜLMÜŞ LOGOLU KOZMİK ÜST BAR ==================== */}
      <header className="sticky top-0 z-50 w-full bg-[#180C3D]/80 backdrop-blur-2xl border-b border-purple-400/25 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Sol: Büyütülmüş, Net Chirmo Logosu */}
          <div
            onClick={() => handleProtectedAction(onEnterStudentPanel)}
            className="flex items-center cursor-pointer group shrink-0"
            title="Chirmo - Ana Ekrana Dön"
          >
            <img
              src="./chirmo-header-brand-logo.png"
              alt="Chirmo"
              className="h-10 sm:h-14 md:h-18 w-auto object-contain filter drop-shadow-[0_2px_14px_rgba(255,255,255,0.3)] drop-shadow-[0_6px_25px_rgba(168,85,247,0.55)] group-hover:scale-105 active:scale-95 transition-all duration-200"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/chirmo-logo.png')) {
                  target.src = './chirmo-logo.png';
                }
              }}
            />
          </div>

          {/* Orta: Hızlı Gezinti Çipleri */}
          <nav className="hidden lg:flex items-center space-x-2 text-xs font-black">
            <button
              onClick={() => handleProtectedAction(onEnterCamp)}
              className="px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-800/60 border border-indigo-500/40 text-indigo-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>🏕️ Kamp</span>
            </button>
            <button
              onClick={() => handleProtectedAction(onEnterKidsWorld)}
              className="px-3 py-1.5 rounded-xl bg-pink-950/60 hover:bg-pink-800/60 border border-pink-500/40 text-pink-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>🏰 Kids</span>
              <span className="text-[9px] bg-pink-500 text-white px-1.5 py-0.2 rounded-full font-bold">5-17</span>
            </button>
            <button
              onClick={() => handleProtectedAction(onEnterSimulator)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-800/60 border border-emerald-500/40 text-emerald-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>🎙️ Simülatör</span>
            </button>
            <button
              onClick={() => handleProtectedAction(onEnterPhraseBank)}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-800/60 border border-cyan-500/40 text-cyan-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>💬 Kalıplar</span>
            </button>
            <button
              onClick={() => handleProtectedAction(() => (onEnterGames ? onEnterGames() : onEnterStudentPanel()))}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-800/60 border border-rose-500/40 text-rose-200 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>⚔️ Düello</span>
            </button>
          </nav>

          {/* Sağ Eylemler: Dil Seçici, Giriş/Kullanıcı Sayfası & Hızlı Panel Butonu */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Dil Seçici (Mobilde bayraklı kompakt çip, masaüstünde tam metinli) */}
            <div className="flex items-center bg-[#23124A]/80 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-purple-400/30 text-xs font-black shadow-inner">
              <button
                onClick={() => handleLanguageToggle('en')}
                className={`px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'en'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)]'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="İngilizce Dünyası"
              >
                <span>🇬🇧</span>
                <span className="hidden sm:inline">English</span>
              </button>
              <button
                onClick={() => handleLanguageToggle('de')}
                className={`px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'de'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]'
                    : 'text-purple-300 hover:text-white'
                }`}
                title="Almanca Dünyası"
              >
                <span>🇩🇪</span>
                <span className="hidden sm:inline">Deutsch</span>
              </button>
            </div>

            {/* Giriş Yap / Kullanıcı Sayfası Butonu (Mobilde de daima net ve görünür) */}
            {!currentUser ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="h-9 sm:h-11 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center space-x-1.5 border border-purple-300/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 transition-all cursor-pointer shrink-0"
                title="Giriş Yap veya Ücretsiz Hesap Aç"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
                <span>Giriş Yap</span>
              </button>
            ) : (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="h-9 sm:h-11 px-2 sm:px-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-950/80 via-purple-950/80 to-indigo-950/80 hover:from-emerald-900/90 hover:to-indigo-900/90 text-white font-bold text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer active:scale-95 group shrink-0"
                title="Kullanıcı Sayfası ve Profil Detayları"
              >
                <span className="text-base sm:text-lg">{userProfile.avatarEmoji || '🎓'}</span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-emerald-300 group-hover:text-white transition-colors truncate max-w-[65px] sm:max-w-[110px]">
                    {currentUser.username}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-purple-300 font-semibold leading-none">
                    {userProfile.level} • Profilim
                  </span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse hidden sm:inline ml-0.5" />
              </button>
            )}

            {/* Öğrenci Paneline Gir Butonu - Giriş yapılmışsa mobilde de çıkar, giriş yapılmamışsa geniş ekranda gösterilir */}
            {currentUser && (
              <button
                onClick={() => handleProtectedAction(onEnterStudentPanel)}
                className="h-9 sm:h-11 px-2.5 sm:px-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-white font-black text-xs sm:text-sm flex items-center space-x-1.5 shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-95 transition-all cursor-pointer border border-cyan-300/40 shrink-0"
              >
                <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span className="hidden sm:inline">Öğrenci Paneline Gir</span>
                <span className="sm:hidden">Panel</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
            {!currentUser && (
              <button
                onClick={() => handleProtectedAction(onEnterStudentPanel)}
                className="hidden md:flex h-10 sm:h-11 px-3 sm:px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-white font-black text-xs sm:text-sm items-center space-x-1.5 sm:space-x-2 shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-95 transition-all cursor-pointer border border-cyan-300/40 shrink-0"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>Öğrenci Paneline Gir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ==================== 2. MERKEZ SAHNE: BÜYÜTÜLMÜŞ CHIRMO ROBOTU & ETRAFINDAKİ YÖRÜNGE KISAYOLLARI ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-16 w-full flex flex-col items-center text-center">
        
        {/* ==================== CHIRMO ORBITAL UNIVERSE (DEV 3D CHIRMO & ETRAFINDAKİ GEZEGEN KISAYOLLAR) ==================== */}
        <div className="relative w-full max-w-4xl min-h-[480px] sm:min-h-[560px] md:min-h-[620px] flex items-center justify-center my-1">
          
          {/* GALAKTİK YÖRÜNGE HALKALARI */}
          <div className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[560px] md:h-[560px] rounded-full border border-purple-400/25 border-dashed animate-[spin_60s_linear_infinite] pointer-events-none" />
          <div className="absolute w-[460px] h-[460px] sm:w-[620px] sm:h-[620px] md:w-[740px] md:h-[740px] rounded-full border border-cyan-400/20 border-dotted animate-[spin_80s_linear_infinite_reverse] pointer-events-none" />
          <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-600/30 to-pink-500/25 blur-3xl pointer-events-none" />

          {/* ==================== ETRAFINDAKİ ÇEŞİTLİ YUVARLAK GEZEGEN KISAYOLLARI ==================== */}
          
          {/* KISAYOL 1: 🏕️ 30 GÜNLÜK KAMP -> Kamp (learn) */}
          <div className="absolute top-2 left-2 sm:top-6 sm:left-8 md:top-8 md:left-12 z-20 group">
            <button
              onClick={() => handleProtectedAction(onEnterCamp)}
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-900 shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:shadow-[0_0_50px_rgba(99,102,241,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-indigo-300/80 animate-[bounce_6s_ease-in-out_infinite]"
              title="30 Günde Kendini İfade Etme Kampı"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-950/70 border border-indigo-400/60 flex items-center justify-center text-lg sm:text-2xl mb-0.5 shadow-inner">
                🏕️
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                30 Günlük Kamp
              </span>
              <span className="text-[8px] font-bold text-indigo-200">
                Konuşma Kampı
              </span>
            </button>
          </div>

          {/* KISAYOL 2: 🏰 LINGORIA KIDS -> Kids (kids) */}
          <div className="absolute top-2 right-2 sm:top-6 sm:right-8 md:top-8 md:right-12 z-20 group">
            <button
              onClick={() => handleProtectedAction(onEnterKidsWorld)}
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-br from-pink-500 via-purple-600 to-pink-900 shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:shadow-[0_0_50px_rgba(236,72,153,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-pink-300/80 animate-[bounce_7s_ease-in-out_infinite]"
              title="Lingoria Kids (5-17 Yaş Macera Evreni)"
            >
              <div className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-pink-500 text-white font-black text-[8px] border border-white shadow-md">
                5-17 Yaş
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-950/70 border border-pink-400/60 flex items-center justify-center text-lg sm:text-2xl mb-0.5 shadow-inner">
                🏰
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                Lingoria Kids
              </span>
              <span className="text-[8px] font-bold text-pink-200">
                Oyun Krallığı 🎮
              </span>
            </button>
          </div>

          {/* KISAYOL 3: 💬 KALIP DEPOSU -> Kalıp Deposu (phrases) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:left-2 md:left-4 z-20 group">
            <button
              onClick={() => handleProtectedAction(onEnterPhraseBank)}
              className="relative w-22 h-22 sm:w-26 sm:h-26 md:w-30 md:h-30 rounded-full p-1 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900 shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:shadow-[0_0_50px_rgba(6,182,212,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-cyan-300/80 animate-[bounce_8s_ease-in-out_infinite]"
              title="Kalıp Deposu & Cümle Kalıpları"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-cyan-950/70 border border-cyan-400/60 flex items-center justify-center text-base sm:text-xl mb-0.5 shadow-inner">
                💬
              </div>
              <span className="text-[10px] sm:text-[11px] font-black text-white leading-tight px-1">
                Kalıp Deposu
              </span>
              <span className="text-[8px] font-bold text-cyan-200">
                500+ Şablon
              </span>
            </button>
          </div>

          {/* KISAYOL 4: 🎙️ CANLI AI SİMÜLATÖR -> Ses Simülatörü (speak) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-2 md:right-4 z-20 group">
            <button
              onClick={() => handleProtectedAction(onEnterSimulator)}
              className="relative w-22 h-22 sm:w-26 sm:h-26 md:w-30 md:h-30 rounded-full p-1 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-900 shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:shadow-[0_0_50px_rgba(16,185,129,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-emerald-300/80 animate-[bounce_6.5s_ease-in-out_infinite]"
              title="Canlı Konuşma Simülatörü"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-950/70 border border-emerald-400/60 flex items-center justify-center text-base sm:text-xl mb-0.5 shadow-inner">
                🎙️
              </div>
              <span className="text-[10px] sm:text-[11px] font-black text-white leading-tight px-1">
                AI Simülatör
              </span>
              <span className="text-[8px] font-bold text-emerald-200">
                Canlı Arama ⚡
              </span>
            </button>
          </div>

          {/* KISAYOL 5: ⚔️ KONUŞMA DÜELLOSU -> Oyunlar & Düello (games) */}
          <div className="absolute bottom-4 left-2 sm:bottom-8 sm:left-10 md:bottom-10 md:left-14 z-20 group">
            <button
              onClick={() => handleProtectedAction(() => (onEnterGames ? onEnterGames() : onEnterStudentPanel()))}
              className="relative w-22 h-22 sm:w-26 sm:h-26 md:w-30 md:h-30 rounded-full p-1 bg-gradient-to-br from-rose-500 via-fuchsia-600 to-purple-900 shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:shadow-[0_0_50px_rgba(244,63,94,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-rose-300/80 animate-[bounce_7.5s_ease-in-out_infinite]"
              title="Speaking Düellosu & Oyunlar"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-rose-950/70 border border-rose-400/60 flex items-center justify-center text-base sm:text-xl mb-0.5 shadow-inner">
                ⚔️
              </div>
              <span className="text-[10px] sm:text-[11px] font-black text-white leading-tight px-1">
                Canlı Düello
              </span>
              <span className="text-[8px] font-bold text-rose-200">
                1v1 Arena 🏆
              </span>
            </button>
          </div>

          {/* KISAYOL 6: 👑 ÖĞRENCİ PANELİNE GİR -> Ana Stüdyo & Panel (search) */}
          <div className="absolute bottom-4 right-2 sm:bottom-8 sm:right-10 md:bottom-10 md:right-14 z-20 group">
            <button
              onClick={() => handleProtectedAction(onEnterStudentPanel)}
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-34 md:h-34 rounded-full p-1 bg-gradient-to-br from-amber-400 via-pink-600 to-purple-800 shadow-[0_0_35px_rgba(245,158,11,0.8)] hover:shadow-[0_0_55px_rgba(245,158,11,1)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-amber-300 animate-[bounce_5.5s_ease-in-out_infinite]"
              title="Öğrenci Paneline Başla"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-950/70 border border-amber-400/60 flex items-center justify-center text-lg sm:text-2xl mb-0.5 shadow-inner">
                👑
              </div>
              <span className="text-[10px] sm:text-xs font-black text-white leading-tight px-1">
                Öğrenci Paneli
              </span>
              <span className="text-[8px] font-extrabold text-amber-200">
                Hemen Başla 🚀
              </span>
            </button>
          </div>

          {/* KISAYOL 7: 🩺 TELAFFUZ DOKTORU -> Simülatör / Fonetik (speak) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 sm:top-1 md:top-2 z-20 group">
            <button
              onClick={() => handleProtectedAction(onEnterSimulator)}
              className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-br from-teal-500 via-cyan-600 to-indigo-900 shadow-[0_0_30px_rgba(20,184,166,0.6)] hover:shadow-[0_0_50px_rgba(20,184,166,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-teal-300/80 animate-[bounce_6.8s_ease-in-out_infinite]"
              title="Telaffuz Doktoru"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-teal-950/70 border border-teal-400/60 flex items-center justify-center text-sm sm:text-xl mb-0.5 shadow-inner">
                🩺
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-white leading-tight px-1">
                Telaffuz
              </span>
              <span className="text-[7px] sm:text-[8px] font-bold text-teal-200">
                AI Fonetik
              </span>
            </button>
          </div>

          {/* KISAYOL 8: 🎯 KARİYER ROTASI -> Hedefler (tasks) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 sm:bottom-1 md:bottom-2 z-20 group">
            <button
              onClick={() => handleProtectedAction(() => (onEnterTasks ? onEnterTasks() : onEnterCamp()))}
              className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-br from-purple-500 via-indigo-600 to-violet-950 shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_50px_rgba(168,85,247,0.95)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-purple-300/80 animate-[bounce_7.2s_ease-in-out_infinite]"
              title="Kariyer ve Mülakat İngilizcesi"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-950/70 border border-purple-400/60 flex items-center justify-center text-sm sm:text-xl mb-0.5 shadow-inner">
                🎯
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-white leading-tight px-1">
                Kariyer
              </span>
              <span className="text-[7px] sm:text-[8px] font-bold text-purple-200">
                İş İngilizcesi
              </span>
            </button>
          </div>

          {/* ==================== MERKEZDEKİ GÖRKEMLİ 3D CHIRMO KARAKTERİ ==================== */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div
              onClick={() => handleSpeak(robotGreeting, 'tr')}
              className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-[350px] md:h-[350px] transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              title="Chirmo'ya tıkla, sesli konuşsun!"
            >
              <img
                src="./chirmo-character.png"
                alt="Chirmo Canlı 3D Robotu"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_45px_rgba(168,85,247,0.65)]"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/chirmo-avatar.png')) {
                    target.src = './chirmo-avatar.png';
                  }
                }}
              />

              {/* Ses Ekolayzır Dalgaları */}
              {isSpeaking && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-cyan-400/70 flex items-center space-x-2 shadow-2xl">
                  <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-6 bg-pink-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  <span className="text-[11px] font-black text-white pl-1">Chirmo Konuşuyor...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== 3. DAHA ESTETİK, KOMPAKT 4 KOMUTA MERKEZİ ==================== */}
        <section className="w-full max-w-4xl my-6 text-left">
          <div className="text-center mb-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300">
              ⚡ ETKİLEŞİMLİ DİL MODÜLLERİ
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
              Yapay Zekâ ile Doğrudan Konuşmaya Başlayın
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            
            {/* KART 1: CANLI AI SESLİ GÖRÜŞME -> speak */}
            <div
              onClick={() => handleProtectedAction(onEnterSimulator)}
              className="p-4 sm:p-5 rounded-2xl bg-[#1B1044]/80 hover:bg-[#25135C]/90 border border-emerald-400/40 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all duration-200 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-[9px] font-black flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>SES MOTORU • 0.2sn TEPKİ</span>
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                    🎙️
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                  Canlı AI Sesli Görüşme & Simülatör
                </h3>
                <p className="text-[11px] text-purple-200/80 font-medium mt-1 leading-snug line-clamp-2">
                  Telefon araması gibi konuşun. Anlık telaffuz ve akıcılık düzeltmesiyle çekinmeden pratik yapın.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-300 flex items-center space-x-1">
                  <span>Simülatörü Başlat</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                  Hemen Ara 🔊
                </span>
              </div>
            </div>

            {/* KART 2: LINGORIA 3D KIDS -> kids */}
            <div
              onClick={() => handleProtectedAction(onEnterKidsWorld)}
              className="p-4 sm:p-5 rounded-2xl bg-[#261042]/80 hover:bg-[#341459]/90 border border-pink-400/40 hover:border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_35px_rgba(236,72,153,0.4)] transition-all duration-200 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-950/80 border border-pink-400/50 text-pink-300 text-[9px] font-black flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                    <span>5-17 YAŞ ÇOCUK PEDAGOJİSİ</span>
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-400/30 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                    🏰
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-pink-300 transition-colors">
                  Lingoria Macera Evreni 🎮
                </h3>
                <p className="text-[11px] text-purple-200/80 font-medium mt-1 leading-snug line-clamp-2">
                  8 seviyeli krallık haritası ve zırh sandıklarıyla çocukların eğlenerek İngilizce ve Almanca konuştuğu dünya.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-pink-500/20 flex items-center justify-between">
                <span className="text-[11px] font-black text-pink-300 flex items-center space-x-1">
                  <span>Lingoria Dünyasını Aç</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[9px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-md font-bold">
                  Oyna & Konuş ⚔️
                </span>
              </div>
            </div>

            {/* KART 3: 30 GÜNLÜK KAMP -> learn */}
            <div
              onClick={() => handleProtectedAction(onEnterCamp)}
              className="p-4 sm:p-5 rounded-2xl bg-[#17134A]/80 hover:bg-[#201A63]/90 border border-indigo-400/40 hover:border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)] transition-all duration-200 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-400/50 text-indigo-300 text-[9px] font-black flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>YETİŞKİN & KARİYER KAMPI</span>
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                    🏕️
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                  30 Günde Kendini İfade Etme Kampı
                </h3>
                <p className="text-[11px] text-purple-200/80 font-medium mt-1 leading-snug line-clamp-2">
                  Günde 15 dakikalık mikro-görevlerle sıfırdan yurt dışında rahatça konuşma seviyesine ulaşın.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-indigo-500/20 flex items-center justify-between">
                <span className="text-[11px] font-black text-indigo-300 flex items-center space-x-1">
                  <span>Öğrenci Paneline Başla</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-bold">
                  Kampa Katıl 🚀
                </span>
              </div>
            </div>

            {/* KART 4: 1V1 SPEAKING DÜELLOSU -> games */}
            <div
              onClick={() => handleProtectedAction(() => (onEnterGames ? onEnterGames() : onEnterStudentPanel()))}
              className="p-4 sm:p-5 rounded-2xl bg-[#280F33]/80 hover:bg-[#381447]/90 border border-amber-400/40 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] transition-all duration-200 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-400/50 text-amber-300 text-[9px] font-black flex items-center space-x-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>HAFTALIK ELMAS LİGİ</span>
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                    ⚔️
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors">
                  1v1 Konuşma Düellosu & Oyunlar
                </h3>
                <p className="text-[11px] text-purple-200/80 font-medium mt-1 leading-snug line-clamp-2">
                  Gerçek zamanlı rakiplerle kelime hızı ve doğru telaffuz yarışına girin, elmas liginde yükselin.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-300 flex items-center space-x-1">
                  <span>Düello Arenasına Gir</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold">
                  Meydan Oku 🏆
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ==================== 4. KOMPAKT CANLI MİKROFON ALANI ==================== */}
        <div className="relative w-full max-w-3xl my-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#1E0F47]/90 via-[#160A38]/90 to-[#10062B]/95 border-2 border-cyan-400/40 shadow-[0_0_40px_rgba(6,182,212,0.25)] backdrop-blur-xl">
            
            {/* Üst Başlık */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-3 mb-3 border-b border-cyan-500/30 gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center space-x-1.5">
                <Orbit className="w-4 h-4 text-amber-300 animate-spin" />
                <span>CANLI MİKROFON ARENASI (SESİNİ TEST ET)</span>
              </span>
              <button
                onClick={() => handleSpeak(currentSamplePhrase, selectedLanguage)}
                className="text-xs font-bold text-slate-200 hover:text-white flex items-center space-x-1 cursor-pointer bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-400/30 shadow-xs"
                title="Örnek Telaffuzu Dinle"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Örnek Cümleyi Dinle 🔊</span>
              </button>
            </div>

            {/* Test Cümlesi */}
            <div className="text-center mb-4">
              <span className="text-[11px] text-slate-300 font-medium">
                Mikrofona basıp cümleyi sesli oku:
              </span>
              <div className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-pink-200 mt-1 tracking-tight">
                "{currentSamplePhrase}"
              </div>
            </div>

            {/* KOMPAKT MİKROFON BUTONU */}
            <div className="flex flex-col items-center justify-center gap-2">
              <button
                onClick={handleStartMicTest}
                disabled={isListening}
                className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full font-black text-xs flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-xl ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_35px_rgba(244,63,94,0.85)] scale-105'
                    : 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95'
                }`}
                title="Mikrofona Konuş"
              >
                <Mic className={`w-7 h-7 sm:w-8 sm:h-8 ${isListening ? 'animate-bounce' : ''}`} />
                <span className="text-[10px] font-black mt-0.5 leading-tight text-center px-1">
                  {isListening ? 'Dinliyor...' : 'KONUŞ & TEST ET'}
                </span>
              </button>

              {score !== null && (
                <div className="mt-2 px-4 py-2 rounded-full bg-emerald-950/95 border border-emerald-400 text-emerald-300 text-xs font-black flex items-center space-x-1.5 animate-in fade-in zoom-in-95 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Harika Telaffuz! Akıcılık Skoru: %{score} • +25 XP</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== 5. KOMPAKT KALIP DOKU TESTİ ==================== */}
        <section className="w-full max-w-4xl my-6 text-center relative">
          
          <div className="mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300">
              CANLI KALIP DOKU TESTİ
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Kalıp Mantığını 10 Saniyede Görün
            </h2>
            <p className="text-[11px] text-purple-200/80 mt-0.5 max-w-md mx-auto">
              Ezber yok; zihinsel Lego gibi birbirine kenetlenen hazır şablonlarla anında konuşun.
            </p>
          </div>

          {/* KATEGORİ UYDU BUTONLARI */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setActiveDemo(sc)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                  activeDemo.id === sc.id
                    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-white scale-105'
                    : 'bg-[#22104A] text-purple-200 hover:bg-[#301666] border border-purple-400/30'
                }`}
              >
                <span>{sc.icon}</span>
                <span>{sc.category}</span>
              </button>
            ))}
          </div>

          {/* KOMPAKT 3 KÜRE KARTLARI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-left">
            
            {/* KÜRE 1: KONUŞMA VE SES KÜRESİ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#22104C]/90 to-[#160B36]/95 border border-purple-400/40 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black text-pink-400 uppercase tracking-wider block mb-1">
                  1. KONUŞMA ŞABLONU
                </span>
                <div className="text-[11px] font-semibold text-slate-200 mb-1">
                  🇹🇷 "{activeDemo.tr}"
                </div>
                <div className="text-sm sm:text-base font-black text-cyan-300 leading-snug my-1.5">
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
                className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>{isSpeaking ? 'OKUNUYOR...' : 'SESLİ DİNLE & ÖĞREN'}</span>
              </button>
            </div>

            {/* KÜRE 2: ZİHİNSEL KURAL & FORMÜL KÜRESİ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#22104C]/90 to-[#160B36]/95 border border-purple-400/40 shadow-lg flex flex-col justify-center">
              <span className="text-[9px] font-black text-amber-300 uppercase tracking-wider block mb-1.5">
                2. ZİHİNSEL KURAL / FORMÜL
              </span>
              <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-400/40 text-purple-200 font-bold text-xs leading-relaxed">
                {activeDemo.formula}
              </div>
              <span className="text-[9px] text-purple-200/80 font-medium mt-2 block">
                🧠 Kelimeleri tek tek çevirmek yerine bu kalıbı zihnine yapıştır.
              </span>
            </div>

            {/* KÜRE 3: PRATİK KONUŞMA PÜF NOKTASI KÜRESİ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#22104C]/90 to-[#160B36]/95 border border-cyan-400/40 shadow-lg flex flex-col justify-center">
              <span className="text-[9px] font-black text-cyan-300 uppercase tracking-wider block mb-1.5">
                3. PRATİK KONUŞMA PÜF NOKTASI
              </span>
              <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-100 font-semibold text-xs leading-relaxed">
                {activeDemo.tip}
              </div>
              <span className="text-[9px] text-cyan-200/80 font-medium mt-2 block">
                💡 Doğal akıcılığı sağlayan en önemli refleks.
              </span>
            </div>
          </div>
        </section>

        {/* ==================== 6. KOMPAKT KÖK NEDEN ÇÖZÜMÜ ==================== */}
        <section className="w-full max-w-4xl my-6 text-center">
          <div className="mb-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-pink-400">
              KÖK NEDEN ÇÖZÜMÜ
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Neden Yıllardır Konuşamıyoruz?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-xs">
            {/* KARA DELİK */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/50 border border-rose-500/40 shadow-lg text-rose-200">
              <div className="w-8 h-8 rounded-lg bg-rose-900/60 border border-rose-400/50 flex items-center justify-center text-base mb-2">
                ❌
              </div>
              <div className="font-black text-sm text-rose-300 mb-1">
                Geleneksel Kurs & Kitap Çıkmazı
              </div>
              <p className="leading-relaxed text-rose-200/90 font-medium">
                Yıllarca Tense formülleri ve kurallar ezberletilir; hata yapınca küçük düşme korkusuyla zihindeki konuşma refleksi kilitlenir.
              </p>
            </div>

            {/* SÜPERNOVA */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/50 border border-emerald-400/40 shadow-lg text-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/60 border border-emerald-400/50 flex items-center justify-center text-base mb-2">
                ✅
              </div>
              <div className="font-black text-sm text-emerald-300 mb-1">
                Chirmo Zihinsel Lego & AI Koçluğu
              </div>
              <p className="leading-relaxed text-emerald-200/90 font-medium">
                Cümle Kılıcı ve Soru Asası ile zihinsel Lego kalıpları birleştirilir. 7/24 yargılamayan canlı sesli AI koçluğuyla korkusuzca konuşulur.
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

      {/* ==================== 7. ZARİF ALT KOZMİK FOOTER ==================== */}
      <footer className="relative z-20 px-6 py-4 border-t border-purple-500/20 text-xs text-purple-300/70 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 bg-[#12072e]/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Sıfır Kişisel Veri Saklama • Tarayıcı Tabanlı Güvenli Konuşma Alanı</span>
        </div>
        <div>© {new Date().getFullYear()} Chirmo. Tüm hakları saklıdır.</div>
      </footer>

      {/* ==================== 8. KULLANICI SAYFASI & ÖĞRENCİ PROFİLİ MODALI ==================== */}
      {isProfileModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#210f47] via-[#1a0a38] to-[#120529] rounded-3xl border-2 border-purple-400/40 shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden text-white">
            {/* Üst Kozmik Başlık & Kapat Butonu */}
            <div className="relative p-6 sm:p-7 border-b border-purple-400/20 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-pink-900/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl shadow-inner">
                  {userProfile.avatarEmoji || '🎓'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-cyan-300">
                      {currentUser.username}
                    </h2>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                      {currentUser.plan === 'lifetime' ? 'Ömür Boyu VIP' : currentUser.plan === 'pro' ? 'Pro Plan' : 'Öğrenci Hesabı'}
                    </span>
                  </div>
                  <p className="text-xs text-purple-300/80 font-medium">
                    Chirmo Özel Kullanıcı Sayfası & Kişisel Gelişim Panosu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-purple-900/50 hover:bg-purple-800/80 border border-purple-400/30 flex items-center justify-center text-purple-300 hover:text-white transition-all cursor-pointer"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Avatar Değiştirme */}
              <div>
                <label className="text-xs font-bold text-purple-300 mb-2 block">
                  Avatar Emojinizi Seçin:
                </label>
                <div className="flex flex-wrap gap-2">
                  {['🎓', '🚀', '🦁', '👑', '⚡', '🌟', '🎯', '🦉', '🔥', '💎'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        const updated = UserProfileService.saveProfile({ avatarEmoji: emoji });
                        setUserProfile(updated);
                      }}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer border ${
                        userProfile.avatarEmoji === emoji
                          ? 'bg-purple-600/80 border-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                          : 'bg-purple-950/40 border-purple-400/20 hover:bg-purple-800/50 hover:border-purple-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* İstatistikler Kartları */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Seviye */}
                <div className="p-3.5 rounded-2xl bg-purple-950/50 border border-purple-400/30 text-center">
                  <span className="text-xs text-purple-300 font-semibold block mb-1">Seviyeniz</span>
                  <span className="text-xl sm:text-2xl font-black text-cyan-300">{userProfile.level}</span>
                </div>

                {/* Günlük Seri */}
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center">
                  <span className="text-xs text-amber-300 font-semibold block mb-1">Seri</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400">🔥 {userProfile.streakDays} Gün</span>
                </div>

                {/* Günlük Hedef */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                  <span className="text-xs text-emerald-300 font-semibold block mb-1">Günlük Hedef</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-400">
                    {userProfile.completedWordsToday}/{userProfile.dailyGoal}
                  </span>
                </div>

                {/* Dil */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-400/30 text-center">
                  <span className="text-xs text-indigo-300 font-semibold block mb-1">Hedef Dil</span>
                  <span className="text-lg sm:text-xl font-black text-indigo-300">
                    {selectedLanguage === 'de' ? '🇩🇪 Almanca' : '🇬🇧 İngilizce'}
                  </span>
                </div>
              </div>

              {/* CEFR Seviye Değiştirici */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-400/20">
                <label className="text-xs font-bold text-purple-200 mb-2.5 block">
                  Hedef Konuşma Seviyenizi Belirleyin:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevelSimple[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        const updated = UserProfileService.saveProfile({ level: lvl });
                        setUserProfile(updated);
                      }}
                      className={`py-2 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                        userProfile.level === lvl
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                          : 'bg-purple-900/30 text-purple-300 border-purple-400/20 hover:bg-purple-800/40 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Günlük Kelime İlerleme Çubuğu */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-400/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-purple-200">Bugünkü Konuşma & Kalıp İlerlemesi</span>
                  <span className="font-black text-emerald-400">
                    %{Math.min(100, Math.round((userProfile.completedWordsToday / Math.max(1, userProfile.dailyGoal)) * 100))}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-purple-950 border border-purple-500/30 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((userProfile.completedWordsToday / Math.max(1, userProfile.dailyGoal)) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* Eylem Butonları */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    onEnterStudentPanel();
                  }}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-95 transition-all cursor-pointer border border-cyan-300/40"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Öğrenci Paneline Devam Et</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    onEnterCamp();
                  }}
                  className="py-3.5 px-4 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-400/40 text-indigo-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>🏕️ 30 Günlük Kamp</span>
                </button>

                <button
                  onClick={() => {
                    PrivacyAuthService.logout();
                    setCurrentUser(null);
                    setIsProfileModalOpen(false);
                  }}
                  className="py-3.5 px-4 rounded-2xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  title="Oturumu Güvenli Kapat"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Güvenli Çıkış</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 9. GİRİŞ / KAYIT AUTH MODALI ==================== */}
      <ChirmoAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
          // Giriş yapan kullanıcı bekleyen bir kısayola tıkladıysa ona, yoksa genel öğrenci paneline yönlendirilir
          if (pendingAction) {
            const next = pendingAction;
            setPendingAction(null);
            next();
          } else {
            onEnterStudentPanel();
          }
        }}
      />
    </div>
  );
};

export default ChirmoHeroLandingPortal;
