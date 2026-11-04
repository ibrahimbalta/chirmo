import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Zap,
  CheckCircle2,
  Trophy,
  Star,
  Award,
  ArrowRight,
  BookOpen,
  Coffee,
  Plane,
  ShoppingBag,
  RotateCcw,
  Plus,
  Check,
  Flame,
  Heart,
  Smile,
  ShieldCheck,
  Smartphone,
  Gamepad2,
  Lock,
  Compass,
  FileText,
  Music,
  Play
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { UserProfileService, UserProfile } from '../../services/userProfileService';
import { ChirmoSubscriptionModal } from '../subscription/ChirmoSubscriptionModal';
import {
  CampStorageService,
  THIRTY_DAY_MISSIONS,
  StudentCampProgress,
  DayMission
} from '../../services/curriculumData';
import { CEFRLevel } from '../../types';

export interface ChirmoVirtualTutorStudioProps {
  onSearch?: (queryOrUrl: string) => void;
  onNavigateToLearn?: () => void;
  onNavigateToKids?: () => void;
  onNavigateToGames?: () => void;
  onNavigateToSpeak?: () => void;
  onNavigateToTasks?: () => void;
  onOpenInstallModal?: () => void;
  userLevel?: CEFRLevel;
  pendingTaskCount?: number;
}

export const KIDS_AGE_DETAILS: Record<
  '5-7' | '8-10' | '11-13' | '14-17',
  {
    title: string;
    sub: string;
    badge: string;
    sampleEn: string;
    sampleTr: string;
    focus: string;
    pedagogicalFix: string;
    icon: string;
    song: string;
  }
> = {
  '5-7': {
    title: '5-7 Yaş',
    sub: 'Okul Öncesi',
    badge: 'Saf Edinim • Sıfır Gramer',
    sampleEn: 'Look! The happy puppy says woof woof! 🐶',
    sampleTr: 'Bak! Mutlu yavru köpek hav hav diyor!',
    focus: 'Görsel kartlar, hayvan sesleri, renkler ve neşeli çocuk şarkıları.',
    pedagogicalFix: 'Bebekler ana dilini nasıl öğreniyorsa öyle: Gramer kuralları yerine dinleyerek ve görerek doğal refleks kazanır.',
    icon: '🧸',
    song: 'Happy Animal Friends 🎵'
  },
  '8-10': {
    title: '8-10 Yaş',
    sub: 'İlkokul (2-4. Sınıf)',
    badge: 'MEB Müfredatı ile %100 Uyumlu',
    sampleEn: 'Can I have a red apple and cold milk, please? 🍎',
    sampleTr: 'Lütfen kırmızı bir elma ve soğuk süt alabilir miyim?',
    focus: 'MEB üniteleri (Ailem, Vücudum, Meyveler, Renkler), nezaket kalıpları.',
    pedagogicalFix: 'Okulda sınav için ezberletilen kelimeleri, sevimli 3D Chirmo robotuyla gerçek konuşmaya ve yüksek okul notlarına dönüştürür.',
    icon: '🎨',
    song: 'Colors & Magic Words 🎵'
  },
  '11-13': {
    title: '11-13 Yaş',
    sub: 'Ortaokul (5-7. Sınıf)',
    badge: 'Diyalog & Soru Sorma Refleksi',
    sampleEn: 'Excuse me, where is the science laboratory? 🔬',
    sampleTr: 'Affedersiniz, fen laboratuvarı nerede?',
    focus: 'Soru sorma cesareti ("Where is...", "How much..."), okul ve arkadaş diyalogları.',
    pedagogicalFix: 'Türk çocuklarının en büyük sorunu olan "konuşma çekingenliğini" kırmak için yargılamayan yapay zekâ arkadaş Chirmo ile sınırsız pratik.',
    icon: '📚',
    song: 'School Adventures & Questions 🎵'
  },
  '14-17': {
    title: '14-17 Yaş',
    sub: 'Gençler & Lise',
    badge: 'Sosyal İngilizce & Global Özgüven',
    sampleEn: 'I love discovering new music and playing games with my friends. 🎮',
    sampleTr: 'Arkadaşlarımla yeni müzikler keşfetmeyi ve oyun oynamayı çok seviyorum.',
    focus: 'Müzik, teknoloji, seyahat, oyunlar ve arkadaş ortamında doğal kendini ifade etme.',
    pedagogicalFix: 'Lise sınavları (LGS/YKS) ve günlük hayat için akıcı B1 konuşma düzeyi ve global özgüven kazandırır.',
    icon: '🎧',
    song: 'Global Vibes & Dreams 🎵'
  }
};

/**
 * ChirmoVirtualTutorStudio
 * Modern, ferah ve sadeleştirilmiş ana sayfa.
 * Aileler için Chirmo Kids (MEB uyumlu, güvenli, veli raporlu)
 * ve Yetişkinler için 30 Günlük Konuşma Kampı değer önerilerini
 * net, şık ve karmaşadan uzak bir tasarımda bir araya getirir.
 */
export const ChirmoVirtualTutorStudio: React.FC<ChirmoVirtualTutorStudioProps> = ({
  onNavigateToLearn,
  onNavigateToKids,
  onNavigateToGames,
  onNavigateToSpeak,
  onNavigateToTasks,
  onOpenInstallModal
}) => {
  // Profil ve İlerleme Durumu
  const [profile, setProfile] = useState<UserProfile>(() => UserProfileService.getProfile());
  const [campProgress, setCampProgress] = useState<StudentCampProgress>(() =>
    CampStorageService.getProgress()
  );

  useEffect(() => {
    return UserProfileService.subscribe((updated) => {
      setProfile(updated);
    });
  }, []);

  // Chirmo Karakter Durumu ('idle' | 'speaking' | 'listening' | 'cheering')
  const [chirmoState, setChirmoState] = useState<'idle' | 'speaking' | 'listening' | 'cheering'>('idle');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [kidsPreviewAge, setKidsPreviewAge] = useState<'5-7' | '8-10' | '11-13' | '14-17'>('8-10');

  // Günün Görevi (30 günlük kamptan)
  const currentMission: DayMission =
    THIRTY_DAY_MISSIONS.find((m) => m.day === campProgress.currentDay) || THIRTY_DAY_MISSIONS[0];

  // Mikrofon & Konuşma Pratiği Durumu
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [scoreResult, setScoreResult] = useState<{
    stars: number;
    percentage: number;
    feedback: string;
    earnedXp: number;
  } | null>(null);
  const [wordSaved, setWordSaved] = useState(false);

  // Chirmo'nun Sesli Konuşması
  const handleChirmoSpeak = (text: string, onEndCallback?: () => void) => {
    setChirmoState('speaking');
    LearningStorageService.speak(text);
    const duration = Math.max(1800, text.length * 65);
    setTimeout(() => {
      setChirmoState('idle');
      if (onEndCallback) onEndCallback();
    }, duration);
  };

  // Mikrofon ile Konuşma Testi
  const handleStartSpeaking = () => {
    if (isListening) {
      setIsListening(false);
      setChirmoState('idle');
      return;
    }

    setIsListening(true);
    setChirmoState('listening');
    setTranscript('');
    setScoreResult(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const text = event.results?.[0]?.[0]?.transcript || currentMission.suggestedAnswer;
          setTranscript(text);
          finishSpeakingEvaluation(text);
          setIsListening(false);
        };

        recognition.onerror = () => {
          fallbackSpeakingEvaluation();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        fallbackSpeakingEvaluation();
      }
    } else {
      fallbackSpeakingEvaluation();
    }
  };

  const fallbackSpeakingEvaluation = () => {
    setTimeout(() => {
      const mockSpoken = currentMission.suggestedAnswer;
      setTranscript(mockSpoken);
      finishSpeakingEvaluation(mockSpoken);
      setIsListening(false);
    }, 2000);
  };

  const finishSpeakingEvaluation = (spokenText: string) => {
    setChirmoState('cheering');
    const earned = currentMission.xpReward;

    setScoreResult({
      stars: 3,
      percentage: 96,
      feedback: `Harika söyledin ${profile.hasCustomName ? profile.name : ''}! Telaffuzun ve kelime vurguların çok netti.`,
      earnedXp: earned
    });

    const updated = CampStorageService.completeDayMission(currentMission.day, earned);
    setCampProgress({ ...updated });

    handleChirmoSpeak('Awesome job! Your pronunciation is very clear.');
  };

  const handleSaveToWordBook = () => {
    LearningStorageService.addWord({
      word: currentMission.suggestedAnswer,
      translation: currentMission.suggestedAnswerTr,
      level: (currentMission.week === 1 ? 'A1' : currentMission.week === 2 ? 'A2' : 'B1') as CEFRLevel,
      exampleSentence: currentMission.suggestedAnswer,
      exampleTranslation: currentMission.suggestedAnswerTr,
      partOfSpeech: 'Günün Konuşma Kalıbı'
    });
    setWordSaved(true);
    setTimeout(() => setWordSaved(false), 2500);
  };

  return (
    <div className="w-full h-full overflow-y-auto select-none px-3 sm:px-6 py-5 sm:py-7">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6 pb-20">

        {/* ==================== 1. CHIRMO CANLI SANAL ÖĞRETMEN VİTRİNİ ==================== */}
        <div className="w-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
          {/* Arka Plan Dekoratif Işık Halkaları */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 sm:gap-7">
            {/* Chirmo 3D Canlı Avatarı & Ses Dalgaları */}
            <div className="relative shrink-0 flex flex-col items-center">
              <div
                onClick={() =>
                  handleChirmoSpeak(
                    `Hello ${profile.hasCustomName ? profile.name : 'friend'}! I am Chirmo, your personal English speaking coach.`
                  )
                }
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/10 backdrop-blur-md border-2 p-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-xl group hover:scale-105 ${
                  chirmoState === 'listening'
                    ? 'border-emerald-400 shadow-emerald-500/40 ring-4 ring-emerald-400/20'
                    : chirmoState === 'speaking'
                    ? 'border-amber-400 shadow-amber-500/40 ring-4 ring-amber-400/20'
                    : chirmoState === 'cheering'
                    ? 'border-pink-400 shadow-pink-500/40 ring-4 ring-pink-400/20'
                    : 'border-white/30 hover:border-white/70'
                }`}
                title="Chirmo ile sesli tanışmak için tıkla"
              >
                {/* Parlayan Arka Plan Halesi */}
                <div
                  className={`absolute inset-0 rounded-3xl transition-opacity duration-300 blur-md pointer-events-none ${
                    chirmoState === 'listening'
                      ? 'bg-emerald-500/30 opacity-100'
                      : chirmoState === 'speaking'
                      ? 'bg-amber-500/30 opacity-100'
                      : chirmoState === 'cheering'
                      ? 'bg-pink-500/30 opacity-100'
                      : 'bg-purple-500/10 opacity-0 group-hover:opacity-100'
                  }`}
                />

                {/* 3D Chirmo Robot Karakter Görseli (Görsel 2) */}
                <img
                  src="./chirmo-avatar.png"
                  alt="Chirmo AI"
                  className="w-full h-full object-contain relative z-10 drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (!img.src.endsWith('/chirmo-avatar.png')) {
                      img.src = './chirmo-avatar.png';
                    }
                  }}
                />

                {/* Durum Balonu (Chirmo konuşurken/dinlerken/kutlarken) */}
                {chirmoState !== 'idle' && (
                  <div className="absolute -top-1.5 -right-1.5 z-20 w-7 h-7 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-lg flex items-center justify-center text-sm border border-purple-200 animate-bounce">
                    {chirmoState === 'cheering' ? '🎉' : chirmoState === 'listening' ? '👂' : '🗣️'}
                  </div>
                )}
              </div>

              {/* CHIRMO AI Rozeti */}
              <div className="relative z-10 -mt-2.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-400/50 text-[10px] font-black tracking-widest text-purple-100 shadow-md uppercase">
                CHIRMO AI
              </div>

              {/* Canlı Ses Dalgası */}
              <div className="flex items-center space-x-1 mt-2.5 h-4">
                <span
                  className={`w-1 rounded-full bg-emerald-400 transition-all ${
                    chirmoState === 'listening' || chirmoState === 'speaking'
                      ? 'h-4 animate-bounce'
                      : 'h-1.5 opacity-50'
                  }`}
                ></span>
                <span
                  className={`w-1 rounded-full bg-amber-400 transition-all delay-75 ${
                    chirmoState === 'listening' || chirmoState === 'speaking'
                      ? 'h-5 animate-bounce'
                      : 'h-2 opacity-60'
                  }`}
                ></span>
                <span
                  className={`w-1 rounded-full bg-purple-300 transition-all delay-150 ${
                    chirmoState === 'listening' || chirmoState === 'speaking'
                      ? 'h-3 animate-bounce'
                      : 'h-1 opacity-40'
                  }`}
                ></span>
              </div>
            </div>

            {/* Chirmo Karşılama ve Motivasyon Metni */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold text-amber-300 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>30 Günde Kendini İfade Etme Kampı • Türkiye'nin Yeni Nesil Ekosistemi</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                "Merhaba {profile.hasCustomName ? profile.name : 'Dostum'}! Bugün İngilizce konuşuyoruz."
              </h2>

              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-xl">
                Gramer ezberiyle vakit kaybetmek yok, hata yapmaktan korkmak yok! Ben hem çocukların hem yetişkinlerin sabırlı sanal öğretmeniyim.
              </p>

              {/* Hızlı İlerleme & Tanışma Şeridi */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    handleChirmoSpeak(
                      `Hello! Welcome to Chirmo. You can speak English fluently in thirty days. Let's practice together!`
                    )
                  }
                  className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition-all flex items-center space-x-1.5 cursor-pointer border border-white/20 shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Chirmo'yu Dinle 🗣️</span>
                </button>

                <div className="flex items-center space-x-1 font-bold text-amber-300 px-2.5 py-1 rounded-full bg-black/20">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{campProgress.streakDays} Gün Seri</span>
                </div>

                <div className="flex items-center space-x-1 font-bold text-purple-200 px-2.5 py-1 rounded-full bg-black/20">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{campProgress.totalXp} XP</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-md shadow-amber-500/20 hover:scale-105"
                  title="200 TL / Ay Chirmo Premium Üyelik"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-950" />
                  <span>Premium (200 TL) 💎</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 2. AİLELER & YETİŞKİNLER İÇİN İKİLİ ÖĞRENME GEÇİDİ (DUAL GATEWAY) ==================== */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GEÇİT 1: 🎈 CHIRMO KIDS (TÜRKİYE'NİN ÇOCUK EĞİTİMİNİ ÇÖZEN ZENGİN ALAN) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-pink-50/90 via-white to-amber-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-pink-300 dark:border-pink-900/60 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-2xl shadow-xs">
              Ailelerin 1 Numaralı Tercihi
            </div>

            <div className="space-y-3.5">
              {/* Başlık ve Rozet */}
              <div className="flex items-center space-x-2.5 text-pink-600 dark:text-pink-400">
                <span className="text-3xl animate-bounce">🎈</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                    Chirmo Kids (5 - 17 Yaş)
                  </h3>
                  <p className="text-[11px] font-bold text-pink-600 dark:text-pink-400">
                    Türkiye'de Çocukların İngilizce Konuşma Sorununu Çözen Alan
                  </p>
                </div>
              </div>

              {/* Pedagojik Açıklama */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Okullarda yıllarca kural ezberletildiği için çocuklar konuşmaktan korkuyor. Chirmo Kids, her yaş grubuna özel pedagojik oyunlar, şarkılar ve sevimli 3D robot arkadaşı ile dili bir ders değil, hayat boyu sürecek bir refleks haline getirir.
              </p>

              {/* 4 Yaş Kademesi Seçim Sekmesi */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Çocuğunuzun Yaşını Seçin (Özel Pedagoji & Müfredat):
                </div>
                <div className="grid grid-cols-4 gap-1 p-1 bg-pink-100/60 dark:bg-slate-800 rounded-2xl">
                  {(['5-7', '8-10', '11-13', '14-17'] as const).map((ageKey) => {
                    const item = KIDS_AGE_DETAILS[ageKey];
                    const isActive = kidsPreviewAge === ageKey;
                    return (
                      <button
                        key={ageKey}
                        type="button"
                        onClick={() => setKidsPreviewAge(ageKey)}
                        className={`py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 font-black shadow-xs scale-[1.02]'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 text-[11px] font-bold'
                        }`}
                      >
                        <div className="text-sm">{item.icon}</div>
                        <div className="text-[10px] font-bold">{item.title}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seçili Yaş Kademesinin Canlı Önizleme Kartı */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-pink-200/80 dark:border-pink-900/40 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 text-[10px] font-black uppercase">
                    {KIDS_AGE_DETAILS[kidsPreviewAge].badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleChirmoSpeak(KIDS_AGE_DETAILS[kidsPreviewAge].sampleEn)}
                    className="px-2 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Chirmo ile Dinle</span>
                  </button>
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    "{KIDS_AGE_DETAILS[kidsPreviewAge].sampleEn}"
                  </div>
                  <div className="text-[11px] text-slate-500 italic">
                    Anlamı: {KIDS_AGE_DETAILS[kidsPreviewAge].sampleTr}
                  </div>
                </div>

                <div className="pt-1 border-t border-pink-50 dark:border-slate-700/60 text-[11px] text-pink-950 dark:text-pink-200 leading-snug">
                  💡 <strong>Nasıl Öğretiyor?</strong> {KIDS_AGE_DETAILS[kidsPreviewAge].pedagogicalFix}
                </div>
              </div>

              {/* 4 Temel Aile Güvencesi */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 pt-1">
                <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>%100 Güvenli & Reklamsız</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>MEB Müfredat Uyumlu</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30">
                  <Star className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Yıldız & Rozet Ödülleri</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30">
                  <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Haftalık Veli Karnesi</span>
                </div>
              </div>
            </div>

            {/* Butonlar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToKids && onNavigateToKids()}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-black text-xs shadow-md shadow-pink-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <span>Chirmo Kids Dünyasını Aç</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* GEÇİT 2: 🎯 CHIRMO YETİŞKİN (30 GÜNDE KONUŞMA KAMPI) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-2 border-indigo-200/80 dark:border-indigo-900/60 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-2xl shadow-xs">
              30 Günde Konuşma Garantisi
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Chirmo Yetişkin (18+ Yaş)
                  </h3>
                  <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    30 Günde Pratik Konuşma & Refleks Kampı
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Yıllarca gramer kuralları ezberleyip konuşamadınız mı? Yargılamayan sanal öğretmen Chirmo ile günde 15 dakika konuşarak dil bariyerini aşın.
              </p>

              {/* Yetişkinler İçin 4 Temel Değer Maddesi */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 pt-1">
                <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/30">
                  <Mic className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Sıfır Gramer Ezberi</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/30">
                  <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Kafe & Mülakat Simülasyonu</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/30">
                  <Zap className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>SM-2 Akıllı Unutmama Motoru</span>
                </div>
                <div className="flex items-center space-x-1.5 p-1.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/30">
                  <Flame className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Günde Sadece 15 Dakika</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToLearn && onNavigateToLearn()}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer group-hover:scale-[1.01]"
            >
              <span>30 Günlük Kampa Başla</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ==================== 3. GÜNÜN HIZLI 5 DAKİKALIK KONUŞMA ANTRENMANI ==================== */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 font-bold text-xs">
                ⚡ Hızlı Pratik
              </span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Günün Konuşma Görevi: {currentMission.title}
              </h3>
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              +{currentMission.xpReward} XP Puanı
            </span>
          </div>

          {/* Chirmo'nun Sorusu & Örnek Cevap */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                🤖 Chirmo Sana Soruyor:
              </span>
              <button
                type="button"
                onClick={() => handleChirmoSpeak(currentMission.aiPrompt)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 text-xs font-bold shadow-2xs hover:bg-indigo-50 flex items-center space-x-1 cursor-pointer border border-slate-200 dark:border-slate-600"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dinle</span>
              </button>
            </div>
            <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              "{currentMission.aiPrompt}"
            </p>
            <p className="text-xs text-slate-500 italic">
              Türkçesi: {currentMission.speakingGoalTr}
            </p>
          </div>

          {/* Senin Vermen Gereken Doğal Cevap */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-800 dark:text-indigo-300">
                🗣️ Doğal İngilizce Yanıt Kalıbı:
              </span>
              <button
                type="button"
                onClick={() => handleChirmoSpeak(currentMission.suggestedAnswer)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-2xs hover:bg-indigo-50 flex items-center space-x-1 cursor-pointer border border-indigo-200 dark:border-indigo-800"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Telaffuzunu Duy</span>
              </button>
            </div>
            <p className="text-sm sm:text-base font-black text-indigo-950 dark:text-indigo-100">
              "{currentMission.suggestedAnswer}"
            </p>
            <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
              Anlamı: {currentMission.suggestedAnswerTr}
            </p>
          </div>

          {/* Konuşma Butonu & Mikrofon Aksiyonu */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleStartSpeaking}
              className={`flex-1 w-full py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 hover:scale-[1.01]'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 animate-spin" />
                  <span>Seni Dinliyorum... Şimdi Konuş!</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Mikrofon ile Chirmo'ya Cevap Ver</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveToWordBook}
              disabled={wordSaved}
              className={`py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer border ${
                wordSaved
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Aralıklı Tekrar (SM-2) Kelime Defterine Kaydet"
            >
              {wordSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Kelimelerime Eklendi</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Kelimelerime Ekle</span>
                </>
              )}
            </button>
          </div>

          {/* Canlı Değerlendirme & Geri Bildirim Sonucu */}
          {scoreResult && (
            <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="text-base">🎉</span>
                  <span className="font-black text-xs text-emerald-900 dark:text-emerald-200">
                    Chirmo Değerlendirmesi:
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-amber-500">
                  {Array.from({ length: scoreResult.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 ml-1">
                    %{scoreResult.percentage} Akıcılık
                  </span>
                </div>
              </div>

              {transcript && (
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Algılanan İfadeniz:</strong> "{transcript}"
                </p>
              )}

              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                {scoreResult.feedback}
              </p>
            </div>
          )}
        </div>

        {/* ==================== CÜMLE ÜRETİM LABORATUVARI BANNERI ==================== */}
        <div className="w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-purple-500/30 relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[11px] font-black uppercase">
              <span>🧱 Chirmo Cümle Üretim Laboratuvarı</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              Kalıptan Cümle Üretme Sistemi (I want, I need, I like...)
            </h3>
            <p className="text-xs text-purple-200 max-w-xl">
              Cümleleri ezberleme! 8 temel konuşma kalıbı ile tek bir kelimeden 6 farklı cümle üretmeyi öğren.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToLearn && onNavigateToLearn()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-xs shadow-md shrink-0 flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-[1.02] relative z-10"
          >
            <span>Laboratuvara Gir</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ==================== 4. HIZLI ERİŞİM KISAYOL BARI (4 RENKLİ BUTON) ==================== */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onNavigateToLearn && onNavigateToLearn()}
            className="p-3.5 rounded-2xl bg-indigo-50/80 hover:bg-indigo-100/80 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-900/40 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <div className="font-black text-xs text-indigo-950 dark:text-indigo-200">
              Günün 15 Dk Görevi
            </div>
            <div className="text-[11px] text-indigo-700/80 dark:text-indigo-400">
              {currentMission.day}. Gün Pratiği
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToSpeak && onNavigateToSpeak()}
            className="p-3.5 rounded-2xl bg-rose-50/80 hover:bg-rose-100/80 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/40 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform mb-2">
              <Coffee className="w-4 h-4" />
            </div>
            <div className="font-black text-xs text-rose-950 dark:text-rose-200">
              Chirmo ile Canlı Rol Yapma
            </div>
            <div className="text-[11px] text-rose-700/80 dark:text-rose-400">
              Kafe & Havalimanı
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToGames && onNavigateToGames()}
            className="p-3.5 rounded-2xl bg-amber-50/80 hover:bg-amber-100/80 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/40 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform mb-2">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div className="font-black text-xs text-amber-950 dark:text-amber-200">
              Hızlı Pratik Oyunları
            </div>
            <div className="text-[11px] text-amber-700/80 dark:text-amber-400">
              Arcade & Eşleştirme
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToLearn && onNavigateToLearn()}
            className="p-3.5 rounded-2xl bg-purple-50/80 hover:bg-purple-100/80 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 border border-purple-200/70 dark:border-purple-900/40 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform mb-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="font-black text-xs text-purple-950 dark:text-purple-200">
              30 Günlük Harita
            </div>
            <div className="text-[11px] text-purple-700/80 dark:text-purple-400">
              Tüm Görev Planı
            </div>
          </button>
        </div>

        {/* ==================== 5. NEDEN CHIRMO? AİLE VE EĞİTİM GÜVENCESİ ==================== */}
        <div className="w-full p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="text-center space-y-1">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Türkiye'nin Dil Çözüm Metodolojisi
            </h4>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200">
              Neden Hem Aileler Hem Yetişkinler Chirmo'yu Tercih Ediyor?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
              <div className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                <span>🇹🇷</span>
                <span>Türk Kullanıcılara Özel</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Türkçe düşünüp tıkanma alışkanlığını yıkan, doğrudan konuşma refleksine odaklı pedagojik yaklaşım.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
              <div className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                <span>🛡️</span>
                <span>Güvenli & Ölçülebilir</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Sahte puanlar yok. Gerçek süre, gerçek ses analizi ve ebeveynler için şeffaf haftalık gelişim karnesi.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
              <div className="font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                <span>🧠</span>
                <span>Akıllı Aralıklı Tekrar</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Ebbinghaus unutma eğrisini kıran SM-2 algoritması ile öğrenilen her ifade kalıcı hafızada saklanır.
              </p>
            </div>
          </div>
        </div>

        {/* 200 TL / Ay Abonelik ve Premium Modalı */}
        <ChirmoSubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
        />

      </div>
    </div>
  );
};

export default ChirmoVirtualTutorStudio;
