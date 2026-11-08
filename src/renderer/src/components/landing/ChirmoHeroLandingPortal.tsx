import React, { useState } from 'react';
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
  Check
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
  const [activeDemo, setActiveDemo] = useState<DemoScenario>(DEMO_SCENARIOS[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
      utterance.rate = 0.9;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9FE] text-slate-800 flex flex-col font-sans select-none overflow-x-hidden selection:bg-purple-200">
      {/* ==================== ÜST SABİT CAM NAVBAR ==================== */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onEnterStudentPanel}>
            <ChirmoLogo size="lg" variant="header" className="drop-shadow-xs" />
            <span className="hidden lg:inline-block text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              30 Günde Konuşma Devrimi
            </span>
          </div>

          {/* Hızlı Gezinti Menüsü */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-bold text-slate-600">
            <button
              onClick={onEnterCamp}
              className="px-3 py-1.5 rounded-xl hover:text-indigo-600 hover:bg-indigo-50/70 transition-colors cursor-pointer"
            >
              🏕️ 30 Günlük Kamp
            </button>
            <button
              onClick={onEnterKidsWorld}
              className="px-3 py-1.5 rounded-xl hover:text-pink-600 hover:bg-pink-50/70 transition-colors cursor-pointer"
            >
              🏰 Lingoria Kids (5-17 Yaş)
            </button>
            <button
              onClick={onEnterPhraseBank}
              className="px-3 py-1.5 rounded-xl hover:text-blue-600 hover:bg-blue-50/70 transition-colors cursor-pointer"
            >
              💬 Yaşam Kalıp Deposu
            </button>
            <button
              onClick={onEnterSimulator}
              className="px-3 py-1.5 rounded-xl hover:text-purple-600 hover:bg-purple-50/70 transition-colors cursor-pointer"
            >
              🎙️ Sesli Simülatör
            </button>
          </nav>

          {/* Sağ Eylemler: Dil Seçici & Panele Giriş Butonu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dil Seçici Hap */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'en'
                    ? 'bg-white text-indigo-700 shadow-2xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="İngilizce Öğrenme Modu"
              >
                <span>🇬🇧</span>
                <span className="hidden sm:inline">İngilizce</span>
              </button>
              <button
                onClick={() => handleLanguageChange('de')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedLanguage === 'de'
                    ? 'bg-white text-purple-700 shadow-2xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Almanca Öğrenme Modu"
              >
                <span>🇩🇪</span>
                <span className="hidden sm:inline">Almanca</span>
              </button>
            </div>

            {/* Ana Eylem: Öğrenci Paneline Git */}
            <button
              onClick={onEnterStudentPanel}
              className="h-10 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-indigo-500/25 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer group"
            >
              <span>Öğrenci Paneline Gir</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ==================== HERO BÖLÜMÜ (APPLE & DUOLINGO TARZI BÜYÜK KARŞILAMA) ==================== */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center overflow-hidden">
        {/* Arka Plan Yumuşak Işık Efektleri */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-200/40 via-indigo-200/30 to-pink-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Canlı Rozet */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-purple-200/70 shadow-xs text-xs font-black text-purple-700 mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>TÜRKİYE'NİN İLK KONUŞMA ODAKLI YAPAY ZEKÂ DİL EKOSİSTEMİ</span>
          <span className="text-[10px] bg-purple-600 text-white px-2 py-0.2 rounded-full font-bold">YENİ</span>
        </div>

        {/* Ana Manşet */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mb-6">
          Yıllarca Ezberlediniz, <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Artık Konuşma Vakti!
          </span>
        </h1>

        {/* Alt Açıklama */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed mb-10 font-medium">
          Dilbilgisi kurallarına boğulmadan; zihinsel dil şablonları, günlük yaşam kalıp deposu ve{' '}
          <strong className="text-slate-900 font-bold">7/24 yargılamayan Chirmo AI konuşma koçuyla</strong>{' '}
          30 günde <span className="underline decoration-indigo-400 font-bold">İngilizce</span> ve{' '}
          <span className="underline decoration-amber-400 font-bold">Almanca</span> konuşun.
        </p>

        {/* 2 BÜYÜK YOL AYRIMI (YETİŞKİN / ÇOCUK VE GENÇ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-4xl mb-14 text-left">
          {/* KART 1: YETİŞKİNLER & GENÇLER İÇİN 30 GÜNLÜK KAMP */}
          <div className="relative p-7 rounded-3xl bg-white/90 backdrop-blur-xl border-2 border-indigo-200/80 hover:border-indigo-500 shadow-xl hover:shadow-2xl transition-all group flex flex-col justify-between">
            <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
              Yetişkin & Genç Modu
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🏕️
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                30 Günde Kendini İfade Etme Kampı
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                Günde sadece 15 dakika! 4 istasyonlu parkur: Isınma, Cümle Kalıpları, Chirmo AI Canlı Arama ve Konuşma Düellosu.
              </p>
              <div className="space-y-2 mb-6 text-xs font-bold text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Kafede, otelde, işte hemen konuşabileceğin hazır kalıplar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Chirmo AI ile 2 dakikalık gerçek sesli konuşma araması</span>
                </div>
              </div>
            </div>

            <button
              onClick={onEnterStudentPanel}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md hover:shadow-indigo-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98"
            >
              <span>Öğrenci Paneline Başla</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* KART 2: 5-17 YAŞ ÇOCUKLAR İÇİN LINGORIA KIDS OYUN DÜNYASI */}
          <div className="relative p-7 rounded-3xl bg-white/90 backdrop-blur-xl border-2 border-pink-200/80 hover:border-pink-500 shadow-xl hover:shadow-2xl transition-all group flex flex-col justify-between">
            <div className="absolute top-4 right-4 bg-pink-50 text-pink-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-pink-100">
              5-17 Yaş Çocuk & Genç
            </div>
            <div>
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🏰
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                Chirmo Kids: Lingoria Macera Evreni
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                Sıkıcı dersler yerine fantastik bir RPG oyunu! Büyülü Teçhizat Sandığı, 8 seviye haritası, şarkılar ve konuşan hikâyeler.
              </p>
              <div className="space-y-2 mb-6 text-xs font-bold text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>Cümle Kılıcı & Soru Asası ile kalıpları oyunla öğrenme</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>XP, yıldızlar, seviyeler ve interaktif mini oyunlar</span>
                </div>
              </div>
            </div>

            <button
              onClick={onEnterKidsWorld}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-sm shadow-md hover:shadow-pink-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98"
            >
              <span>Lingoria Dünyasını Aç 🎮</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* SOSYAL KANIT VE GÜVEN METRİKLERİ */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-600 text-xs sm:text-sm font-bold pt-4 border-t border-slate-200/80 w-full max-w-4xl">
          <div className="flex items-center space-x-2">
            <span className="text-amber-500 text-lg">⚡</span>
            <span>30 Günde Akıcı Konuşma Garantisi</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-indigo-500 text-lg">💬</span>
            <span>1000+ Yaşam Kalıp Deposu</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 text-lg">🤖</span>
            <span>%100 Yargılamayan Chirmo AI</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-500 text-lg">🇬🇧 🇩🇪</span>
            <span>İngilizce & Almanca Çift Dil</span>
          </div>
        </div>
      </section>

      {/* ==================== İNTERAKTİF CANLI DENEME VİTRİNİ (KULLANICI HEMEN TEST ETSİN) ==================== */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-indigo-50/40 border-y border-slate-200/80 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-black uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>GİRİŞ YAPMADAN HEMEN DENE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Kalıp Mantığını 10 Saniyede Görün
            </h2>
            <p className="text-xs sm:text-base text-slate-600 font-medium max-w-xl mx-auto mt-2">
              Kelimeleri tek tek düşünmek yerine hazır düşünce kalıplarını kullanın. Bir senaryo seçip sesli dinleyin:
            </p>
          </div>

          {/* Senaryo Seçim Hapları */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {DEMO_SCENARIOS.map((scenario) => {
              const isSelected = activeDemo.id === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => setActiveDemo(scenario)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{scenario.icon}</span>
                  <span>{scenario.category}</span>
                </button>
              );
            })}
          </div>

          {/* Aktif Senaryo Kartı */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
                  {activeDemo.icon} {activeDemo.category} — {activeDemo.title}
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  🇹🇷 "{activeDemo.tr}"
                </p>
              </div>

              {/* Dil Değiştirici */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                    selectedLanguage === 'en' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  🇬🇧 İngilizce
                </button>
                <button
                  onClick={() => handleLanguageChange('de')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                    selectedLanguage === 'de' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  🇩🇪 Almanca
                </button>
              </div>
            </div>

            {/* Hedef Dilde Cümle ve Sesli Okuma */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 mb-1">
                  {selectedLanguage === 'en' ? '🇬🇧 İngilizce Konuşma Kalıbı:' : '🇩🇪 Almanca Konuşma Kalıbı:'}
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
                className="h-12 px-5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
                title="Doğru Telaffuzu Sesli Dinle"
              >
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce text-indigo-600' : ''}`} />
                <span>{isSpeaking ? 'Dinletiliyor...' : 'Sesli Dinle'}</span>
              </button>
            </div>

            {/* Zihinsel Formül ve İpucu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-slate-100 text-xs">
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                <div className="font-black text-purple-900 mb-1">🧠 Zihinsel Lego Formülü:</div>
                <div className="font-semibold text-purple-700">{activeDemo.formula}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="font-black text-amber-900 mb-1">💡 Türk Öğrenci İpucu:</div>
                <div className="font-semibold text-amber-800">{activeDemo.tip}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TÜRKİYE'YE ÖZEL ÇÖZÜM KARŞILAŞTIRMASI ==================== */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-black uppercase tracking-wider mb-2 border border-rose-200/60">
            <span>KÖK NEDEN ANALİZİ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Neden Yıllardır Konuşamıyoruz?
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-medium max-w-xl mx-auto mt-2">
            Sorun sizde veya zekânızda değil, Türkiye'de uygulanan geleneksel ezberci eğitim metodunda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ESKİ YÖNTEMLER */}
          <div className="p-7 rounded-3xl bg-rose-50/50 border border-rose-200/80">
            <div className="flex items-center space-x-2 text-rose-700 font-black text-base sm:text-lg mb-4">
              <span>❌</span>
              <span>Geleneksel Kurslar & Kitaplar</span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 font-semibold">
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-black shrink-0">✕</span>
                <span>Yıllarca 12 tane zaman (Tense) kuralı ezberletilir, ağzınızı açacak cesaret kalmaz.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-black shrink-0">✕</span>
                <span>Hata yapmaktan ve sınıfta insanların dalga geçmesinden korkulur.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-black shrink-0">✕</span>
                <span>Kelimeler tek tek ezberlenir; cümleye dökerken Türkçe düşünüp tıkanıp kalınır.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-rose-500 font-black shrink-0">✕</span>
                <span>"Anlıyorum ama konuşamıyorum" sendromu ömür boyu sürer.</span>
              </li>
            </ul>
          </div>

          {/* CHIRMO ÇÖZÜMÜ */}
          <div className="p-7 rounded-3xl bg-emerald-50/50 border-2 border-emerald-300">
            <div className="flex items-center space-x-2 text-emerald-800 font-black text-base sm:text-lg mb-4">
              <span>✅</span>
              <span>Chirmo 30 Günde Konuşma Devrimi</span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-800 font-bold">
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 font-black shrink-0 mt-0.5" />
                <span><strong>Cümle Kılıcı & Soru Asası:</strong> Dilbilgisi yerine zihinsel Lego kalıplarıyla ilk günden cümle kurun.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 font-black shrink-0 mt-0.5" />
                <span><strong>%100 Yargılamayan Chirmo AI:</strong> 7/24 istediğiniz kadar konuşun, hata yapın, anında kibar düzeltme alın.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 font-black shrink-0 mt-0.5" />
                <span><strong>1000+ Yaşam Kalıp Deposu:</strong> Kafede, otelde, işte karşılaşacağınız her senaryo cebinizde.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 font-black shrink-0 mt-0.5" />
                <span><strong>Günde Sadece 15 Dakika:</strong> Saatlerce masa başında oturmadan mikro alışkanlıkla konuşun.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ==================== 4 ANA GÜÇ MERKEZİ (ÖZELLİK KARTLARI) ==================== */}
      <section className="py-16 px-4 sm:px-6 bg-slate-900 text-white w-full">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
              EKOSİSTEMİN İÇİNDE NELER VAR?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Başarılı Olmanız İçin Tasarlanmış 4 Modül
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. AI Konuşma */}
            <div
              onClick={onEnterSimulator}
              className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-black text-lg text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  Chirmo AI Canlı Arama
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Telefonla konuşur gibi 2 dakikalık gerçek sesli konuşma pratiği. Türkçe ipucu destekli.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs font-bold text-indigo-400 flex items-center space-x-1">
                <span>Dene</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. 30 Günlük Kamp */}
            <div
              onClick={onEnterCamp}
              className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-3">🏕️</div>
                <h3 className="font-black text-lg text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  30 Günlük Kamp
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Adım adım günlük istasyonlar. Isınma, kalıp analizi, diyalog ve düello ile tam akıcılık.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <span>Kampa Gir</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. Kalıp Deposu */}
            <div
              onClick={onEnterPhraseBank}
              className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-black text-lg text-white mb-2 group-hover:text-blue-400 transition-colors">
                  Yaşam Kalıp Deposu
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Kafede, havalimanında, otelde, takside hayat kurtaran 1000'den fazla sesli konuşma şablonu.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs font-bold text-blue-400 flex items-center space-x-1">
                <span>Kalıpları Aç</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. Lingoria Kids */}
            <div
              onClick={onEnterKidsWorld}
              className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-pink-500 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-3">🏰</div>
                <h3 className="font-black text-lg text-white mb-2 group-hover:text-pink-400 transition-colors">
                  Lingoria Kids
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  5-17 yaş çocuklar için 8 seviyeli macera haritası, şarkılar, hikâyeler ve rozetler.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs font-bold text-pink-400 flex items-center space-x-1">
                <span>Oyuna Başla</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== BÜYÜK ÇAĞRI (FOOTER CTA) ==================== */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Bugün İlk Cümlenizi Kurun!
            </h2>
            <p className="text-sm sm:text-base text-purple-100 max-w-xl mx-auto mb-8 font-medium">
              Kredi kartı gerekmez. Sıfır kişisel veri güvenliğiyle hemen öğrenci paneline giriş yapın ve 30 günlük yolculuğunuza başlayın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onEnterStudentPanel}
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-white text-indigo-700 hover:bg-slate-100 font-black text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Öğrenci Paneline Gir ➔</span>
              </button>
              <button
                onClick={onEnterKidsWorld}
                className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-indigo-950/40 hover:bg-indigo-950/60 text-white border border-white/20 font-black text-sm sm:text-base cursor-pointer transition-all flex items-center justify-center space-x-2"
              >
                <span>🏰 Kids Dünyasını Aç</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alt Telif ve Güvenilirlik */}
        <div className="mt-12 text-slate-400 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Sıfır Kişisel Veri Güvenliği — Tüm ilerleme tarayıcınızda güvendedir.</span>
          </div>
          <div>© {new Date().getFullYear()} Chirmo. Tüm hakları saklıdır.</div>
        </div>
      </section>
    </div>
  );
};

export default ChirmoHeroLandingPortal;
