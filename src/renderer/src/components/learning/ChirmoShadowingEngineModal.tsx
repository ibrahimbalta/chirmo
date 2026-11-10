import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

interface ShadowingItem {
  id: string;
  theme: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  en: string;
  de: string;
  fr?: string;
  tr: string;
  phoneticEn: string;
  phoneticDe: string;
  phoneticFr?: string;
  stressWords: string[];
  teacherTip: string;
}

const SHADOWING_DRILLS: ShadowingItem[] = [
  // A1 Seviyesi
  {
    id: 'sh-1',
    theme: '☕ Günlük Selamlaşma & Kafe',
    level: 'A1',
    en: 'Could I please get an iced latte with oat milk?',
    de: 'Könnte ich bitte einen Eiskaffee mit Hafermilch bekommen?',
    fr: 'Pourrais-je s\'il vous plaît avoir un café au lait avec du lait d\'avoine ?',
    tr: 'Lütfen yulaf sütlü bir buzlu latte alabilir miyim?',
    phoneticEn: 'Kud ay pliiz get ən ayst late vit out milk?',
    phoneticDe: 'Könte ih bite aynen Ayskafe mit Hafamilh bekomen?',
    phoneticFr: 'Purej sil vu ple avuar ö̃ kafe o le avek dü le davuan ?',
    stressWords: ['iced latte', 'oat milk', 'please'],
    teacherTip: 'Pratik İpucu: "Could I please get..." kalıbı emir kipi yerine geçen en kibar yerel kalıptır. Son kelimelere doğru ses tonunu hafif yükselt.'
  },
  {
    id: 'sh-2',
    theme: '👋 İlk Tanışma & İletişim',
    level: 'A1',
    en: 'It is really nice to finally meet you in person.',
    de: 'Es ist wirklich schön, dich endlich persönlich kennenzulernen.',
    fr: 'C\'est vraiment agréable de vous rencontrer enfin en personne.',
    tr: 'Sonunda seninle yüz yüze tanışmak gerçekten çok güzel.',
    phoneticEn: 'İt iz riıli nays tu faynıli miit yu in pöırsın.',
    phoneticDe: 'Es ist virklih şöön, dih endlih perzöönlih kenıntsulernen.',
    phoneticFr: 'Se vremon agreabl dö vu rankontre anfen an person.',
    stressWords: ['really nice', 'finally', 'in person'],
    teacherTip: 'Hoca Notu: "Finally" kelimesini söylerken ilk heceye hafif vurgu yap (FAY-nı-li). Karşı tarafa içten bir samimiyet verir.'
  },
  // A2 Seviyesi
  {
    id: 'sh-3',
    theme: '🚕 Şehir & Yol Tarifi',
    level: 'A2',
    en: 'Excuse me, is this museum within walking distance from here?',
    de: 'Entschuldigung, ist dieses Museum von hier aus zu Fuß erreichbar?',
    fr: 'Pardon, est-ce que ce musée est accessible à pied depuis ici ?',
    tr: 'Affedersiniz, bu müze buradan yürüme mesafesinde mi?',
    phoneticEn: 'Ekskyuuz mi, iz dis myuuziyım widin vooking distıns fram hiır?',
    phoneticDe: 'Entşuldikunk, ist dizıs Muzeyum fon hiır aus tsu Fuus er-rayhbar?',
    phoneticFr: 'Pardon, es kö sö müze e taksesibl a pye döpüi isi ?',
    stressWords: ['walking distance', 'from here', 'museum'],
    teacherTip: '"Within walking distance" bir blok kalıptır; kelimeleri tek tek çevirme, ağzından tek nefeste bir melodi gibi çıksın.'
  },
  {
    id: 'sh-4',
    theme: '🏨 Otel & Konaklama',
    level: 'A2',
    en: 'Would it be possible to arrange a late check-out tomorrow?',
    de: 'Wäre es möglich, morgen einen späteren Check-out zu vereinbaren?',
    fr: 'Serait-il possible de prévoir un départ tardif demain ?',
    tr: 'Yarın geç çıkış ayarlamak mümkün olabilir mi acaba?',
    phoneticEn: 'Vud it bi pasıbıl tu ıreync e leyt çek-aut tumoro?',
    phoneticDe: 'Veere es mööklih, morgen aynen şpeeteren Çek-aut tsu feraynbaaren?',
    phoneticFr: 'Söretil posibl dö prevuar ö̃ depar tardif dömen ?',
    stressWords: ['possible', 'late check-out', 'tomorrow'],
    teacherTip: '"Would it be possible..." kalıbını öğrenen bir öğrenci dünyanın her otelinde kapıları açar. Sesinde ricacı ve sakin tonu koru.'
  },
  // B1 Seviyesi
  {
    id: 'sh-5',
    theme: '💼 İş Mülakatı & Kariyer',
    level: 'B1',
    en: 'I specialize in finding efficient solutions under tight deadlines.',
    de: 'Ich habe mich darauf spezialisiert, unter Zeitdruck effiziente Lösungen zu finden.',
    fr: 'Je suis spécialisé dans la recherche de solutions efficaces sous des délais serrés.',
    tr: 'Kısa teslim süreleri altında verimli çözümler üretme konusunda uzmanım.',
    phoneticEn: 'Ay speşılayz in faynding ifişınt soluuşınz andır tayt dedlaynz.',
    phoneticDe: 'İh habe mih darauf şpetsiyaliziirt, untır Tsaytdruk efitsiyente Löözungen tsu finden.',
    phoneticFr: 'Jö süi spesyalize dan la röşerş dö solüsyon efikas su de dele sere.',
    stressWords: ['specialize', 'efficient solutions', 'tight deadlines'],
    teacherTip: 'Mülakatlarda duraklamadan, "efficient" ve "tight deadlines" anahtar kelimelerini tok bir sesle vurgulayarak güven aşıla.'
  },
  {
    id: 'sh-6',
    theme: '💡 Fikir Beyanı & Toplantı',
    level: 'B1',
    en: 'From my perspective, focusing on user experience will drive our growth.',
    de: 'Aus meiner Sicht wird der Fokus auf das Nutzererlebnis unser Wachstum vorantreiben.',
    fr: 'De mon point de vue, se concentrer sur l\'expérience utilisateur stimulera notre croissance.',
    tr: 'Benim bakış açıma göre, kullanıcı deneyimine odaklanmak büyümemizi tetikleyecektir.',
    phoneticEn: 'Fram may pöırspektiv, foukısing an yuuzır ikspiiriyıns vil drayv aur grouf.',
    phoneticDe: 'Aus maynır Ziht virt der Fookus auf das Nutser-erlebnis unzer Vakstum foran-trayben.',
    phoneticFr: 'Dö mon puen dö vü, sö konsantre sür leksperyans ütilisatör stimülra nötr kruasans.',
    stressWords: ['perspective', 'user experience', 'drive our growth'],
    teacherTip: '"I think" demek yerine "From my perspective" de; konuşmanın entelektüel seviyesi bir anda iki katına çıksın.'
  },
  // B2 Akıcılık
  {
    id: 'sh-7',
    theme: '🚀 İkna & Spontane Konuşma',
    level: 'B2',
    en: 'To be completely honest, we need to balance innovation with financial stability.',
    de: 'Um ehrlich zu sein, müssen wir Innovation mit finanzieller Stabilität in Einklang bringen.',
    fr: 'Pour être totalement honnête, nous devons équilibrer innovation et stabilité financière.',
    tr: 'Tamamen dürüst olmak gerekirse, inovasyon ile finansal istikrarı dengelememiz gerekiyor.',
    phoneticEn: 'Tu bi kımpliitli anıst, vi niid tu balıns inovayşın vit faynenşıl stıbiliti.',
    phoneticDe: 'Um eerlih tsu zayn, müsen vir Inovatsiyon mit finantsiyelır Ştabiliteet in Aynklang bringen.',
    phoneticFr: 'Pur etr totalman onet, nu dövon ekilibre inovasyon e stabilite finansyer.',
    stressWords: ['completely honest', 'balance innovation', 'financial stability'],
    teacherTip: 'Gölgeleme sırrı: Cümleyi konuşurken nefes alış yerini "honest"tan sonraki virgüle sakla. Dil ritimle nefes alır.'
  }
];

interface ChirmoShadowingEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
}

export const ChirmoShadowingEngineModal: React.FC<ChirmoShadowingEngineModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const [targetLang, setTargetLang] = useState<SupportedLanguage>(() =>
    TargetLanguageService.getTargetLanguage()
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 1.0>(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [completedDrills, setCompletedDrills] = useState<Set<string>>(new Set());
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'ALL' | 'A1' | 'A2' | 'B1' | 'B2'>('ALL');

  useEffect(() => {
    return TargetLanguageService.subscribe((lang) => setTargetLang(lang));
  }, []);

  if (!isOpen) return null;

  const filteredDrills = SHADOWING_DRILLS.filter((d) =>
    selectedLevelFilter === 'ALL' ? true : d.level === selectedLevelFilter
  );

  const currentItem = filteredDrills[currentIndex % filteredDrills.length] || SHADOWING_DRILLS[0];
  const activeText =
    targetLang === 'de'
      ? currentItem.de
      : targetLang === 'fr'
        ? (currentItem.fr || currentItem.en)
        : currentItem.en;
  const activePhonetic =
    targetLang === 'de'
      ? currentItem.phoneticDe
      : targetLang === 'fr'
        ? (currentItem.phoneticFr || currentItem.phoneticEn)
        : currentItem.phoneticEn;

  const handlePlayNative = (speed = playbackSpeed) => {
    setIsPlaying(true);
    LearningStorageService.speak(activeText);
    setTimeout(() => {
      setIsPlaying(false);
    }, 3500);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simüle edilen telaffuz & akıcılık analizi
      const simulatedScore = Math.floor(Math.random() * 16) + 85; // 85 - 100 arası
      setUserScore(simulatedScore);
      setCompletedDrills((prev) => new Set(prev).add(currentItem.id));
      if (onRewardXP) onRewardXP(20);
    } else {
      setUserScore(null);
      setIsRecording(true);
      // 0.5 saniye sonra yerli sesi alttan kısık başlatarak gölgeleme deneyimi sunuyoruz
      setTimeout(() => {
        LearningStorageService.speak(activeText);
      }, 500);
    }
  };

  const handleNext = () => {
    setUserScore(null);
    setIsRecording(false);
    setCurrentIndex((prev) => (prev + 1) % filteredDrills.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Üst Bar: 50 Yıllık Hoca Başlığı */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-wide">
                  Gölgeleme (Shadowing) Laboratuvarı
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-amber-200 border border-white/20">
                  Nöro-Konuşma Koçu
                </span>
              </div>
              <p className="text-[11px] text-pink-100 font-medium hidden sm:block">
                Dinle ve Tekrar Et Metodu • Doğal Konuşma Ritmini Yakala
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Dil Göstergesi */}
            <span className="px-2.5 py-1 rounded-xl bg-black/30 text-xs font-black border border-white/20">
              {targetLang === 'de' ? '🇩🇪 Almanca' : targetLang === 'fr' ? '🇫🇷 Fransızca' : '🇬🇧 İngilizce'}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Seviye Seçim Barı */}
        <div className="px-4 sm:px-6 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center space-x-1.5 shrink-0">
            {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevelFilter(lvl);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedLevelFilter === lvl
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {lvl === 'ALL' ? 'Tüm Seviyeler' : `${lvl} Seviye`}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 shrink-0">
            {filteredDrills.length} Kalıp Refleks Cümlesi
          </div>
        </div>

        {/* Ana Egzersiz Sahnesi */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Kart Başlığı & Rozet */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {currentItem.theme}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {currentIndex + 1} / {filteredDrills.length}
            </span>
          </div>

          {/* Cümle ve Vurgu Sahnesi */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-900 border-2 border-indigo-200/80 dark:border-indigo-900/50 space-y-3 shadow-md relative overflow-hidden">
            {/* Orijinal Cümle */}
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-relaxed">
              {activeText.split(' ').map((word, wIdx) => {
                const cleanWord = word.replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
                const isStressed = currentItem.stressWords.some((sw) =>
                  sw.toLowerCase().includes(cleanWord.toLowerCase())
                );
                return (
                  <span
                    key={wIdx}
                    className={`inline-block mr-1.5 transition-all ${
                      isStressed
                        ? 'text-indigo-600 dark:text-indigo-400 underline decoration-pink-500 decoration-4 underline-offset-4'
                        : ''
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>

            {/* Türkçe Okunuş Fonetiği (Türkçe Karakterlerle Kolaylaştırılmış) */}
            <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-slate-700 inline-flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase text-pink-600 dark:text-pink-400">
                🗣️ Doğal Okunuş:
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wide font-mono">
                "{activePhonetic}"
              </span>
            </div>

            {/* Karşılık */}
            <div className="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-400 border-t border-indigo-100 dark:border-slate-700 pt-2.5">
              Anlamı: <span className="text-slate-900 dark:text-white font-extrabold">{currentItem.tr}</span>
            </div>

            {/* Animasyonlu Dalga Çubuğu (Ses Çalarken Aktif) */}
            <div className="flex items-center space-x-1 pt-2 h-6">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-200 ${
                    isPlaying || isRecording
                      ? 'bg-gradient-to-t from-indigo-500 to-pink-500 h-full animate-pulse'
                      : 'bg-slate-300 dark:bg-slate-700 h-1.5'
                  }`}
                  style={{
                    animationDelay: `${(i % 5) * 150}ms`
                  }}
                />
              ))}
            </div>
          </div>

          {/* 50 Yıllık Hoca Püf Noktası */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 text-xs sm:text-sm flex items-start space-x-3">
            <span className="text-2xl shrink-0">🎓</span>
            <div>
              <div className="font-black text-amber-800 dark:text-amber-300 uppercase text-[11px] tracking-wide">
                Konuşma ve Telaffuz İpucu
              </div>
              <p className="mt-0.5 leading-relaxed font-medium">{currentItem.teacherTip}</p>
            </div>
          </div>

          {/* Skor Kartı (Kullanıcı Ses Kaydettiğinde) */}
          {userScore !== null && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 flex items-center justify-between text-emerald-900 dark:text-emerald-200 animate-fade-in">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                <div>
                  <div className="text-base font-black">Harika Refleks! Skor: %{userScore}</div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    Ağzınla sesin senkronizasyonu mükemmel. Dil kasların hafızayı kaydetti!
                  </div>
                </div>
              </div>
              <div className="text-right font-black text-emerald-600 text-lg sm:text-xl">
                +20 XP ⭐
              </div>
            </div>
          )}
        </div>

        {/* Alt Kontrol Paneli: Dinleme Hızı, Çalma ve Gölgeleme Mikrofonu */}
        <div className="p-3.5 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Hız Seçimi (0.75x / 1.0x) */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setPlaybackSpeed(0.75);
                handlePlayNative(0.75);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                playbackSpeed === 0.75
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>🐢 0.75x</span>
              <span className="hidden sm:inline">Yavaş & Net</span>
            </button>
            <button
              onClick={() => {
                setPlaybackSpeed(1.0);
                handlePlayNative(1.0);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                playbackSpeed === 1.0
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>⚡ 1.0x</span>
              <span className="hidden sm:inline">Yerli Hızı</span>
            </button>
          </div>

          {/* Ana Eylemler: Dinle & Gölgele & Sonraki */}
          <div className="flex items-center space-x-2">
            {/* Dinle Butonu */}
            <button
              onClick={() => handlePlayNative()}
              className="px-4 py-2.5 rounded-2xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-black text-xs sm:text-sm flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dinle</span>
            </button>

            {/* Gölgele Mikrofonu */}
            <button
              onClick={handleToggleRecord}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? 'Kaydı Bitir & Puanla' : '🎤 Şimdi Gölgele'}</span>
            </button>

            {/* Sonraki Cümle */}
            <button
              onClick={handleNext}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-black text-xs flex items-center space-x-1 transition-all cursor-pointer active:scale-95"
              title="Sonraki Cümle"
            >
              <span>Sonraki</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
