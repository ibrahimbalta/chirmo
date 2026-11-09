import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Volume2,
  Mic,
  RotateCcw,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sparkles,
  Smile,
  Briefcase,
  HelpCircle,
  ArrowRight,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';

export type FluencyToolMode = 'shadowing' | 'reflex' | 'loop' | 'mistakes' | 'lifestyle';

interface ShadowingItem {
  id: string;
  en: string;
  tr: string;
  category: string;
  mouthGymTip: string;
  focusSound: string;
  audioPace: string;
}

interface SpeedReflexItem {
  id: string;
  situationEmoji: string;
  contextTr: string;
  targetEn: string;
  keywords: string[];
  hint: string;
}

interface LoopTrackItem {
  id: string;
  en: string;
  tr: string;
  repeatCount: number;
}

interface CommonMistakeItem {
  id: string;
  wrong: string;
  correct: string;
  explanationTr: string;
  drillQuestion: string;
  options: { text: string; isCorrect: boolean }[];
  category: string;
}

interface LifestyleContextItem {
  id: string;
  title: string;
  emoji: string;
  role: string;
  phrases: { en: string; tr: string; context: string }[];
}

export interface ChirmoFluencyBoosterProps {
  onBackToHome?: () => void;
  initialMode?: FluencyToolMode;
}

export const ChirmoFluencyBooster: React.FC<ChirmoFluencyBoosterProps> = ({
  onBackToHome,
  initialMode = 'shadowing'
}) => {
  const [activeMode, setActiveMode] = useState<FluencyToolMode>(initialMode);

  // Gamification & Skor
  const [boosterPoints, setBoosterPoints] = useState<number>(() => {
    const saved = localStorage.getItem('chirmo_fluency_points');
    return saved ? parseInt(saved, 10) : 150;
  });

  const awardPoints = (pts: number) => {
    setBoosterPoints((prev) => {
      const next = prev + pts;
      localStorage.setItem('chirmo_fluency_points', next.toString());
      return next;
    });
  };

  const handleSpeak = (text: string, rate: number = 0.95) => {
    LearningStorageService.speak(text);
  };

  // ==========================================
  // 1. GÖLGELEME & AĞIZ JİMNASTİĞİ (SHADOWING)
  // ==========================================
  const SHADOWING_ITEMS: ShadowingItem[] = [
    {
      id: 'sh-1',
      en: 'What do you think about this idea?',
      tr: 'Bu fikir hakkında ne düşünüyorsun?',
      category: 'Fikir İsteme',
      mouthGymTip: '"th" sesinde dilini üst ve alt ön dişlerinin arasına hafifçe çıkarıp hava üfle (think /θ/).',
      focusSound: 'th /θ/ Sesi',
      audioPace: 'Doğal Ritim'
    },
    {
      id: 'sh-2',
      en: 'I would like to have a cup of coffee, please.',
      tr: 'Bir fincan kahve rica ediyorum.',
      category: 'Restoran & Kafe',
      mouthGymTip: '"would like" derken dudaklarını yuvarla (w), ses boğazdan yumuşakça akmalı.',
      focusSound: 'w Sesi & Nezaket',
      audioPace: 'Akıcı & Kibar'
    },
    {
      id: 'sh-3',
      en: 'Could you please speak a little slower?',
      tr: 'Lütfen biraz daha yavaş konuşabilir misiniz?',
      category: 'Kurtarıcı Kalıp',
      mouthGymTip: '"slower" derken son heceyi yutmadan yumuşak bir schwa (/ə/) ile bitir.',
      focusSound: 'Schwa /ə/ ve Ritim',
      audioPace: 'Net & Vurgulu'
    },
    {
      id: 'sh-4',
      en: 'I am really looking forward to meeting you.',
      tr: 'Seninle buluşmayı gerçekten dört gözle bekliyorum.',
      category: 'Sosyal & İş',
      mouthGymTip: '"forward" kelimesinde iki heceyi birbirine bağla: [for-wəd].',
      focusSound: 'Akıcı Ulama (Linking)',
      audioPace: 'Enerjik'
    },
    {
      id: 'sh-5',
      en: 'How much does this ticket cost?',
      tr: 'Bu biletin fiyatı ne kadar?',
      category: 'Seyahat & Bilet',
      mouthGymTip: '"How much does" kalıbını tek bir kelime gibi birleştir: [hav-mıç-dız].',
      focusSound: 'Hızlı Soru Vurgusu',
      audioPace: 'Hızlı Günlük'
    },
    {
      id: 'sh-6',
      en: 'Excuse me, is this seat taken?',
      tr: 'Affedersiniz, bu koltuk dolu mu?',
      category: 'Toplu Taşıma & Kafe',
      mouthGymTip: '"Excuse me" derken [ɪk-skjuːz miː] sesini yumuşak ve kibar çıkar.',
      focusSound: 'Nezaket & Vurgu',
      audioPace: 'Doğal & Kibar'
    },
    {
      id: 'sh-7',
      en: 'Can you recommend a good local restaurant?',
      tr: 'İyi bir yerel restoran önerebilir misiniz?',
      category: 'Turizm & Keşif',
      mouthGymTip: '"recommend" kelimesinde vurgu son hecededir: [re-kə-MEND].',
      focusSound: 'Kelime Vurgusu',
      audioPace: 'Akıcı'
    },
    {
      id: 'sh-8',
      en: 'I would like to check in, please.',
      tr: 'Otele giriş yapmak istiyorum lütfen.',
      category: 'Otel & Giriş',
      mouthGymTip: '"check in" iki kelimesini birbirine ula: [çe-kɪn].',
      focusSound: 'Ulama (Linking)',
      audioPace: 'Net & Resmi'
    },
    {
      id: 'sh-9',
      en: 'It was a pleasure meeting you today.',
      tr: 'Bugün sizinle tanışmak bir zevkti.',
      category: 'Sosyal & Veda',
      mouthGymTip: '"pleasure" [ple-jır] şeklinde "j" sesiyle çıkarılır.',
      focusSound: '/ʒ/ Sesi',
      audioPace: 'Sıcak & Samimi'
    }
  ];

  const [shadowIndex, setShadowIndex] = useState(0);
  const [isShadowRecording, setIsShadowRecording] = useState(false);
  const [shadowScore, setShadowScore] = useState<number | null>(null);
  const activeShadow = SHADOWING_ITEMS[shadowIndex];

  const handleSimulateShadowingMic = () => {
    setIsShadowRecording(true);
    setShadowScore(null);
    setTimeout(() => {
      setIsShadowRecording(false);
      const randomScore = Math.floor(Math.random() * 11) + 89; // 89-99
      setShadowScore(randomScore);
      awardPoints(15);
      handleSpeak('Excellent rhythm and pronunciation!');
    }, 2400);
  };

  // ==========================================
  // 2. GÖRSEL HIZLI REFLEKS (SPEED REACTION)
  // ==========================================
  const REFLEX_ITEMS: SpeedReflexItem[] = [
    {
      id: 'ref-1',
      situationEmoji: '☕ 💸',
      contextTr: 'Kafedesin ve garsona kahvenin ne kadar olduğunu sorman gerekiyor!',
      targetEn: 'How much is the coffee?',
      keywords: ['How much', 'is', 'the coffee?'],
      hint: 'Fiyat sorarken her zaman "How much is...?" kalıbı kullanılır.'
    },
    {
      id: 'ref-2',
      situationEmoji: '🚕 📍',
      contextTr: 'Yurtdışındasın ve acil bir taksiye ihtiyacın var!',
      targetEn: 'I need a taxi.',
      keywords: ['I need', 'a taxi.'],
      hint: 'İhtiyaç bildirmek için doğrudan "I need..." kullanılır.'
    },
    {
      id: 'ref-3',
      situationEmoji: '🍽️ 💧',
      contextTr: 'Restoranda garson yanından geçiyor, kibarca su istemelisin!',
      targetEn: 'Can I have some water, please?',
      keywords: ['Can I have', 'some water,', 'please?'],
      hint: 'Nezaketle bir şey istemek için en doğal kalıp: "Can I have...?"'
    },
    {
      id: 'ref-4',
      situationEmoji: '❓ 🗺️',
      contextTr: 'Yolda kayboldun ve metro istasyonunun nerede olduğunu sormalısın!',
      targetEn: 'Where is the metro station?',
      keywords: ['Where is', 'the metro station?'],
      hint: 'Yer ve yön sorarken: "Where is...?" kalıbı kurtarıcındır.'
    },
    {
      id: 'ref-5',
      situationEmoji: '🧾 💳',
      contextTr: 'Yemek bitti, garsona hesabı getirmesini söylemelisin!',
      targetEn: 'Could we have the bill, please?',
      keywords: ['Could we have', 'the bill, please?'],
      hint: 'Hesap isterken "Could we have the bill?" en kibar formüldür.'
    },
    {
      id: 'ref-6',
      situationEmoji: '📶 📱',
      contextTr: 'Otele vardın ve wifi şifresini sorman gerekiyor!',
      targetEn: 'What is the wifi password?',
      keywords: ['What is', 'the wifi password?'],
      hint: 'Şifre ve bilgi sorarken: "What is...?"'
    },
    {
      id: 'ref-7',
      situationEmoji: '⏰ 🏃',
      contextTr: 'Arkadaşına saatin kaç olduğunu sormalısın!',
      targetEn: 'What time is it?',
      keywords: ['What time', 'is it?'],
      hint: 'Saat sorarken: "What time is it?"'
    }
  ];

  const [reflexIndex, setReflexIndex] = useState(0);
  const [reflexTimer, setReflexTimer] = useState(4);
  const [isReflexActive, setIsReflexActive] = useState(false);
  const [reflexSuccess, setReflexSuccess] = useState(false);
  const activeReflex = REFLEX_ITEMS[reflexIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReflexActive && reflexTimer > 0) {
      interval = setInterval(() => {
        setReflexTimer((t) => t - 1);
      }, 1000);
    } else if (reflexTimer === 0 && isReflexActive) {
      setIsReflexActive(false);
    }
    return () => clearInterval(interval);
  }, [isReflexActive, reflexTimer]);

  const handleStartReflex = () => {
    setReflexTimer(4);
    setIsReflexActive(true);
    setReflexSuccess(false);
  };

  const handleReflexAnswer = () => {
    setReflexSuccess(true);
    setIsReflexActive(false);
    awardPoints(20);
    handleSpeak(`Great reflex! ${activeReflex.targetEn}`);
  };

  // ==========================================
  // 3. YÜRÜYÜŞ & KULAK DOLDURMA (PASSIVE IMMERSION)
  // ==========================================
  const LOOP_TRACKS: LoopTrackItem[] = [
    { id: 'trk-1', en: 'Can I have the bill, please?', tr: 'Hesabı alabilir miyim lütfen?', repeatCount: 2 },
    { id: 'trk-2', en: 'I am looking for the exit.', tr: 'Çıkış kapısını arıyorum.', repeatCount: 2 },
    { id: 'trk-3', en: 'Do you speak English?', tr: 'İngilizce biliyor musunuz?', repeatCount: 2 },
    { id: 'trk-4', en: 'I would like to make a reservation.', tr: 'Rezervasyon yaptırmak istiyorum.', repeatCount: 2 },
    { id: 'trk-5', en: 'No problem at all, have a nice day!', tr: 'Hiç sorun değil, iyi günler dilerim!', repeatCount: 2 }
  ];

  const [isPlayingLoop, setIsPlayingLoop] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loopSpeed, setLoopSpeed] = useState<number>(1.0);
  const currentTrack = LOOP_TRACKS[currentTrackIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingLoop) {
      // Önce Türkçeyi seslendir, 1.2 sn sonra İngilizceyi 2 kez seslendir
      handleSpeak(currentTrack.tr);
      timer = setTimeout(() => {
        handleSpeak(currentTrack.en);
        setTimeout(() => {
          handleSpeak(currentTrack.en);
          // 4 sn sonra bir sonraki parçaya geç
          setTimeout(() => {
            if (isPlayingLoop) {
              setCurrentTrackIndex((prev) => (prev + 1) % LOOP_TRACKS.length);
            }
          }, 4000);
        }, 2200);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isPlayingLoop, currentTrackIndex]);

  // ==========================================
  // 4. EN SIK YAPILAN KRİTİK HATALAR KLİNİĞİ
  // ==========================================
  const COMMON_MISTAKES: CommonMistakeItem[] = [
    {
      id: 'err-1',
      wrong: 'I am agree with you.',
      correct: 'I agree with you.',
      explanationTr: '"agree" kelimesi İngilizcede zaten bir eylemdir (fiildir). Bu yüzden başına "am/is/are" eklenmez.',
      drillQuestion: 'Hangi cümle doğrudur?',
      category: 'Fiil / Durum Karmaşası',
      options: [
        { text: 'I am agree with this plan.', isCorrect: false },
        { text: 'I agree with this plan.', isCorrect: true },
        { text: 'I do agreeing with this plan.', isCorrect: false }
      ]
    },
    {
      id: 'err-2',
      wrong: 'I have 25 years old.',
      correct: 'I am 25 years old.',
      explanationTr: 'Birebir çeviride "25 yaşındayım / 25 yaşına sahibim" mantığı kullanılır ancak İngilizcede yaş bir nesne değil durumdur (to be kullanılır).',
      drillQuestion: 'Arkadaşına yaşını söylerken hangisini kullanırsın?',
      category: 'Yaş İfade Etme',
      options: [
        { text: 'I have 30 years old.', isCorrect: false },
        { text: 'I am 30 years old.', isCorrect: true },
        { text: 'My age has 30.', isCorrect: false }
      ]
    },
    {
      id: 'err-3',
      wrong: 'I didn\'t went to work yesterday.',
      correct: 'I didn\'t go to work yesterday.',
      explanationTr: '"didn\'t" yardımcı fiili geçmiş zaman anlamını zaten taşır; arkasından gelen fiil her zaman yalın (1. hal) olmalıdır.',
      drillQuestion: 'Dün sinemaya gitmediğini nasıl söylersin?',
      category: 'Geçmiş Zaman Kuralı',
      options: [
        { text: 'I didn\'t went to cinema.', isCorrect: false },
        { text: 'I didn\'t go to the cinema.', isCorrect: true },
        { text: 'I not went to the cinema.', isCorrect: false }
      ]
    },
    {
      id: 'err-4',
      wrong: 'Can you make a photo of us?',
      correct: 'Can you take a photo of us?',
      explanationTr: 'Fotoğraf çekmek İngilizcede "make" değil, daima "take a photo" olarak söylenir.',
      drillQuestion: 'Birisinden fotoğrafını çekmesini rica ederken hangisi doğrudur?',
      category: 'Make vs Take',
      options: [
        { text: 'Could you make my picture?', isCorrect: false },
        { text: 'Could you take a picture of me?', isCorrect: true },
        { text: 'Do you photo me?', isCorrect: false }
      ]
    }
  ];

  const [mistakeIndex, setMistakeIndex] = useState(0);
  const [selectedMistakeOpt, setSelectedMistakeOpt] = useState<number | null>(null);
  const [mistakeAnswered, setMistakeAnswered] = useState<boolean>(false);
  const activeMistake = COMMON_MISTAKES[mistakeIndex];

  const handleSelectMistakeOption = (index: number, isCorrect: boolean) => {
    setSelectedMistakeOpt(index);
    setMistakeAnswered(true);
    if (isCorrect) {
      awardPoints(15);
      handleSpeak('Doğru cevap! Harikasın!');
    } else {
      handleSpeak('Dikkat! Püf noktasını tekrar oku.');
    }
  };

  // ==========================================
  // 5. KENDİ HAYATIM / HEDEFE ÖZEL KALIPLAR
  // ==========================================
  const LIFESTYLE_CONTEXTS: LifestyleContextItem[] = [
    {
      id: 'ls-dev',
      title: 'Yazılımcı & Teknoloji',
      emoji: '💻',
      role: 'Software Developer',
      phrases: [
        { en: 'I am working on fixing this bug.', tr: 'Bu hatayı düzeltmek üzerine çalışıyorum.', context: 'Daily Standup' },
        { en: 'Could we schedule a quick call to discuss the API?', tr: 'API konusunu görüşmek için hızlı bir görüşme planlayabilir miyiz?', context: 'İletişim' },
        { en: 'I will deploy the changes by the end of the day.', tr: 'Değişiklikleri gün sonuna kadar yayına alacağım.', context: 'Teslimat' }
      ]
    },
    {
      id: 'ls-tourism',
      title: 'Turizm, Kafe & Hizmet',
      emoji: '☕',
      role: 'Service & Tourism',
      phrases: [
        { en: 'Welcome! How can I help you today?', tr: 'Hoş geldiniz! Bugün size nasıl yardımcı olabilirim?', context: 'Karşılama' },
        { en: 'Would you like to pay with cash or card?', tr: 'Nakit mi yoksa kartla mı ödemek istersiniz?', context: 'Ödeme Alma' },
        { en: 'Here is your receipt, have a wonderful day!', tr: 'İşte fişiniz, harika bir gün dilerim!', context: 'Uğurlama' }
      ]
    },
    {
      id: 'ls-travel',
      title: 'Yurt Dışı Tatili & Seyahat',
      emoji: '✈️',
      role: 'Tourist & Explorer',
      phrases: [
        { en: 'Where is the baggage claim area?', tr: 'Bagaj teslim alanı nerede?', context: 'Havalimanı' },
        { en: 'Could I have a window seat, please?', tr: 'Cam kenarı bir koltuk alabilir miyim lütfen?', context: 'Check-in' },
        { en: 'Is breakfast included in the room price?', tr: 'Oda fiyatına kahvaltı dahil mi?', context: 'Otel Girişi' }
      ]
    },
    {
      id: 'ls-daily',
      title: 'Günlük Sosyal Hayat & Sohbet',
      emoji: '🌟',
      role: 'Daily Conversationalist',
      phrases: [
        { en: 'Nice to meet you! How was your weekend?', tr: 'Tanıştığımıza memnun oldum! Hafta sonun nasıl geçti?', context: 'Arkadaşlık' },
        { en: 'Let me know if you need anything.', tr: 'Bir şeye ihtiyacın olursa bana haber ver.', context: 'Nezaket' },
        { en: 'That sounds like a great plan!', tr: 'Kulağa harika bir plan gibi geliyor!', context: 'Katılma' }
      ]
    }
  ];

  const [selectedLifestyleId, setSelectedLifestyleId] = useState('ls-dev');
  const activeLifestyle = LIFESTYLE_CONTEXTS.find((l) => l.id === selectedLifestyleId) || LIFESTYLE_CONTEXTS[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto">
      {/* ÜST AFİŞ & SKOR BAR */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white p-5 sm:p-7 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>3x Hızlı Konuşma Hızlandırıcısı</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center space-x-2">
              <span>Hızlı Akıcılık Laboratuvarı</span>
              <span className="text-xl">🚀</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Zihinde çeviri engelini kıran, ağız kaslarını konuşturan ve yürürken bile pratik yaptıran bilimsel metotlar.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2.5 rounded-2xl flex items-center space-x-2.5 shadow-xs">
              <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
              <div>
                <div className="text-[10px] uppercase font-bold text-indigo-200">Refleks Puanı</div>
                <div className="text-base font-black">{boosterPoints} XP ⭐</div>
              </div>
            </div>

            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="px-3.5 py-2.5 rounded-2xl bg-white text-indigo-900 font-black text-xs hover:bg-indigo-50 transition-all cursor-pointer shadow-sm"
              >
                ← Ana Sayfa
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ARAÇ SEÇİM SEKMELERİ */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-5">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-4">
          {[
            { id: 'shadowing', label: '🎧 Gölgeleme (Shadowing)', tag: 'Ağız Jimnastiği' },
            { id: 'reflex', label: '⚡ Hızlı Refleks', tag: 'Sıfır Çeviri' },
            { id: 'loop', label: '🚶 Yürüyüş Modu', tag: 'Kulak Doldurma' },
            { id: 'mistakes', label: '🩺 Hata Doktoru', tag: 'Kritik Tuzaklar' },
            { id: 'lifestyle', label: '🎯 Hayatım & Meslek', tag: 'Özelleştirilmiş' }
          ].map((tab) => {
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveMode(tab.id as FluencyToolMode)}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-transparent shadow-md scale-102 font-black'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs sm:text-sm font-black">{tab.label}</div>
                <div
                  className={`text-[10px] mt-1 font-bold ${
                    isActive ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {tab.tag}
                </div>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* MOD 1: GÖLGELEME & AĞIZ JİMNASTİĞİ */}
        {/* ============================================================ */}
        {activeMode === 'shadowing' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
                  Teknik: Dil Kas Hafızası & Shadowing
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Chirmo ile Aynı Anda Söyle
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Önce dinle. Ardından konuşmaya başladığı anda duraksamadan aynı ritim ve tonlamayla tekrar et!
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShadowIndex((prev) => (prev > 0 ? prev - 1 : SHADOWING_ITEMS.length - 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Önceki
                </button>
                <span className="text-xs font-black text-slate-400">
                  {shadowIndex + 1} / {SHADOWING_ITEMS.length}
                </span>
                <button
                  type="button"
                  onClick={() => setShadowIndex((prev) => (prev + 1) % SHADOWING_ITEMS.length)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Sonraki
                </button>
              </div>
            </div>

            {/* CÜMLE KARTI */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/40 dark:from-slate-800/60 dark:to-slate-800/30 border border-indigo-100 dark:border-slate-700 text-center space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-xs font-black shadow-xs">
                <span>🎯 {activeShadow.category}</span>
                <span>•</span>
                <span>{activeShadow.focusSound}</span>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                "{activeShadow.en}"
              </div>

              <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
                {activeShadow.tr}
              </div>

              {/* Ağız Jimnastiği Kutusu */}
              <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-left flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
                <span className="text-lg">👄</span>
                <div>
                  <span className="font-black">Ağız & Dil İpucu: </span>
                  <span>{activeShadow.mouthGymTip}</span>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSpeak(activeShadow.en)}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dinle (Chirmo Oynat)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateShadowingMic}
                  disabled={isShadowRecording}
                  className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all cursor-pointer ${
                    isShadowRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isShadowRecording ? 'Dinleniyor... Konuş!' : 'Mikrofonla Gölgele'}</span>
                </button>
              </div>

              {/* Telaffuz Skoru */}
              {shadowScore !== null && (
                <div className="pt-2 animate-fade-in inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Harika Ritim! Telaffuz Eşleşmesi: %{shadowScore} 🏆 (+15 XP)</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MOD 2: GÖRSEL HIZLI REFLEKS */}
        {/* ============================================================ */}
        {activeMode === 'reflex' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[11px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
                Teknik: Doğrudan Görsel Eşleme (Çevirisiz Konuşma)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Görsel Refleks Antrenmanı
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Zihninden çeviri yapmayı unut! Ekrana gelen duruma göre 3 saniye içinde ağzından İngilizce cümleyi çıkar.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center space-y-4">
              <div className="text-6xl my-2 animate-bounce">{activeReflex.situationEmoji}</div>

              <div className="max-w-lg mx-auto text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                "{activeReflex.contextTr}"
              </div>

              {isReflexActive ? (
                <div className="space-y-3">
                  <div className="text-4xl font-black text-rose-500 animate-pulse">
                    ⏱️ {reflexTimer} sn
                  </div>
                  <div className="text-xs text-slate-500">Düşünmeden doğrudan seslendir:</div>
                  <button
                    type="button"
                    onClick={handleReflexAnswer}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer"
                  >
                    "{activeReflex.targetEn}" dedim! 🎯
                  </button>
                </div>
              ) : reflexSuccess ? (
                <div className="space-y-3">
                  <div className="text-2xl font-black text-emerald-600 flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-6 h-6" />
                    <span>Mükemmel Refleks!</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    "{activeReflex.targetEn}"
                  </div>
                  <div className="text-xs text-slate-500">{activeReflex.hint}</div>
                  <button
                    type="button"
                    onClick={() => {
                      setReflexIndex((prev) => (prev + 1) % REFLEX_ITEMS.length);
                      setReflexSuccess(false);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-black text-xs cursor-pointer shadow-xs"
                  >
                    Sonraki Refleks Kartı →
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={handleStartReflex}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-sm shadow-lg shadow-amber-500/20 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                  >
                    Geri Sayımı Başlat (3 Saniyede Söyle) ⚡
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MOD 3: YÜRÜYÜŞ & KULAK DOLDURMA (PASSIVE IMMERSION) */}
        {/* ============================================================ */}
        {activeMode === 'loop' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[11px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                Teknik: Pasif İşitsel Maruz Kalma (Passive Immersion)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Yürüyüş & Kulak Doldurma Modu
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Kulaklığını tak, cebine koy! Sistem önce Türkçe anlamını, hemen ardından 2 defa doğal İngilizce telaffuzunu çalarak zihnine kazır.
              </p>
            </div>

            {/* OYNATICI KARTI */}
            <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-2xl">
                <Headphones className="w-8 h-8 text-indigo-300" />
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-black">
                  Parça {currentTrackIndex + 1} / {LOOP_TRACKS.length}
                </div>
                <div className="text-xl sm:text-2xl font-black mt-2 text-white">
                  "{currentTrack.en}"
                </div>
                <div className="text-sm text-indigo-200 font-medium mt-1">
                  {currentTrack.tr}
                </div>
              </div>

              {/* Kontrol Butonları */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : LOOP_TRACKS.length - 1))}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  title="Önceki"
                >
                  <SkipBack className="w-5 h-5 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlayingLoop(!isPlayingLoop)}
                  className="p-5 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/30 cursor-pointer"
                  title={isPlayingLoop ? 'Durdur' : 'Yürüyüş Modunu Başlat'}
                >
                  {isPlayingLoop ? (
                    <Pause className="w-7 h-7 text-white fill-white" />
                  ) : (
                    <Play className="w-7 h-7 text-white fill-white translate-x-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTrackIndex((prev) => (prev + 1) % LOOP_TRACKS.length)}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  title="Sonraki"
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="text-xs text-indigo-300/80">
                {isPlayingLoop
                  ? '🎧 Kesintisiz Çalıyor: Türkçe İpucu ➔ 2x Doğal İngilizce'
                  : 'Oynat düğmesine basarak arka plan döngüsünü başlatın.'}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MOD 4: EN SIK YAPILAN KRİTİK HATALAR */}
        {/* ============================================================ */}
        {activeMode === 'mistakes' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full">
                  Klinik: En Sık Yapılan Tipik Dil ve Gramer Hataları
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Kurtarıcı Püf Noktaları Doktoru
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Birebir çeviri yaparken düşülen 20 temel hatayı bir kez öğren, ömür boyu doğru konuş.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setMistakeIndex((prev) => (prev > 0 ? prev - 1 : COMMON_MISTAKES.length - 1));
                    setSelectedMistakeOpt(null);
                    setMistakeAnswered(false);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Önceki
                </button>
                <span className="text-xs font-black text-slate-400">
                  {mistakeIndex + 1} / {COMMON_MISTAKES.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMistakeIndex((prev) => (prev + 1) % COMMON_MISTAKES.length);
                    setSelectedMistakeOpt(null);
                    setMistakeAnswered(false);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Sonraki
                </button>
              </div>
            </div>

            {/* HATA KARŞILAŞTIRMA KUTUSU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Yanlış */}
              <div className="p-5 rounded-3xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-black text-xs uppercase">
                  <span>❌ Çok Sık Yapılan Hata</span>
                </div>
                <div className="text-lg font-black text-rose-950 dark:text-rose-200 line-through">
                  "{activeMistake.wrong}"
                </div>
              </div>

              {/* Doğru */}
              <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-black text-xs uppercase">
                  <span>✅ Doğal İngilizce Doğrusu</span>
                </div>
                <div className="text-lg font-black text-emerald-950 dark:text-emerald-200">
                  "{activeMistake.correct}"
                </div>
              </div>
            </div>

            {/* AÇIKLAMA */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed">
              <span className="font-black">💡 Neden Böyle? </span>
              {activeMistake.explanationTr}
            </div>

            {/* MİNİ PRATİK TESTİ */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-black uppercase text-slate-500">
                Mini Sınav: {activeMistake.drillQuestion}
              </div>
              <div className="space-y-2">
                {activeMistake.options.map((opt, i) => {
                  const isSelected = selectedMistakeOpt === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectMistakeOption(i, opt.isCorrect)}
                      className={`w-full p-3 rounded-2xl text-left text-xs sm:text-sm font-bold transition-all cursor-pointer border flex items-center justify-between ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-black'
                            : 'bg-rose-100 border-rose-400 text-rose-900 font-black'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && (opt.isCorrect ? '✅ Doğru!' : '❌ Tekrar Dene!')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MOD 5: KENDİ HAYATIM & MESLEK */}
        {/* ============================================================ */}
        {activeMode === 'lifestyle' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[11px] font-black uppercase text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full">
                Teknik: Kişisel İhtiyaç Odaklı Konuşma (Contextual Life-Learning)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Kendi Hayatına ve Hedefine Özel Kalıplar
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Alakasız kelimeleri boşver! Yarın sabah işinde veya seyahatinde doğrudan kullanacağın cümlelere odaklan.
              </p>
            </div>

            {/* Kategori Seçimi */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {LIFESTYLE_CONTEXTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedLifestyleId(item.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedLifestyleId === item.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-102 font-black'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="text-xs sm:text-sm font-black mt-2">{item.title}</div>
                </button>
              ))}
            </div>

            {/* SEÇİLEN KATEGORİNİN KALIPLARI */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black uppercase text-slate-500">
                {activeLifestyle.title} İçin En Kritik Konuşma Kalıpları:
              </div>
              <div className="grid grid-cols-1 gap-3">
                {activeLifestyle.phrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-300 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full">
                        {phrase.context}
                      </span>
                      <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
                        "{phrase.en}"
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {phrase.tr}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpeak(phrase.en)}
                      className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 hover:bg-purple-200 font-black text-xs flex items-center space-x-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Seslendir</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChirmoFluencyBooster;
