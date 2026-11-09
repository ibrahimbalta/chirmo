import React, { useState } from 'react';
import {
  X,
  Volume2,
  Copy,
  Check,
  Search,
  Plane,
  Building2,
  HeartPulse,
  UtensilsCrossed,
  Car,
  Briefcase,
  ShieldAlert,
  Sparkles,
  Zap
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

interface SurvivalPhrase {
  id: string;
  category: 'airport' | 'hotel' | 'hospital' | 'restaurant' | 'transport' | 'interview' | 'emergency';
  titleTr: string;
  en: string;
  de: string;
  tr: string;
  phoneticEn: string;
  phoneticDe: string;
  urgency: 'high' | 'medium';
}

const SURVIVAL_PHRASES: SurvivalPhrase[] = [
  // 1. HAVALİMANI & PASAPORT
  {
    id: 'surv-1',
    category: 'airport',
    titleTr: 'Pasaport ve biniş kartını takdim etme',
    en: 'Here is my passport and boarding pass.',
    de: 'Hier sind mein Reisepass und meine Bordkarte.',
    tr: 'İşte pasaportum ve biniş kartım.',
    phoneticEn: 'Hiır iz may pasport end bording pas.',
    phoneticDe: 'Hiır zint mayn Rayzepas unt mayne Bortkarte.',
    urgency: 'high'
  },
  {
    id: 'surv-2',
    category: 'airport',
    titleTr: 'Ziyaret amacını ve süresini beyan etme (Vize memuruna)',
    en: 'I am visiting for tourism for ten days and staying at the Hilton.',
    de: 'Ich bin zehn Tage zu touristischen Zwecken hier und übernachte im Hilton.',
    tr: 'On gün turizm amacıyla buradayım ve Hilton\'da kalıyorum.',
    phoneticEn: 'Ay em viziting for turizım for ten deyz end steying et dı Hiltın.',
    phoneticDe: 'İh bin tseen Taage tsu turiistişen Tsekken hiır unt übırnahte im Hiltın.',
    urgency: 'high'
  },
  {
    id: 'surv-3',
    category: 'airport',
    titleTr: 'Kayıp bagaj bildirimi',
    en: 'Excuse me, my checked luggage did not arrive on the carousel.',
    de: 'Entschuldigung, mein aufgegebenes Gepäck ist nicht auf dem Band angekommen.',
    tr: 'Affedersiniz, kayıtlı bagajım dönen bantta çıkmadı.',
    phoneticEn: 'Ekskyuuz mi, may çekt lagıc did nat ırayv an dı kerusel.',
    phoneticDe: 'Entşuldikunk, mayn auf-gegeebenes Gepek ist niht auf dem Bant angekommen.',
    urgency: 'high'
  },

  // 2. OTEL & KONAKLAMA
  {
    id: 'surv-4',
    category: 'hotel',
    titleTr: 'Rezervasyon ile giriş yapma',
    en: 'Hello, I have a reservation under the name Yilmaz.',
    de: 'Guten Tag, ich habe eine Reservierung auf den Namen Yilmaz.',
    tr: 'Merhaba, Yılmaz adına yapılmış bir rezervasyonum var.',
    phoneticEn: 'Helou, ay hev e rezırveyşın andır dı neym Yılmaz.',
    phoneticDe: 'Guutın Taak, ih habe ayne Rezerviyrung auf deen Naamen Yılmaz.',
    urgency: 'medium'
  },
  {
    id: 'surv-5',
    category: 'hotel',
    titleTr: 'Klima veya oda arızasını bildirme',
    en: 'The air conditioner in room 304 is not working properly.',
    de: 'Die Klimaanlage in Zimmer 304 funktioniert nicht richtig.',
    tr: '304 numaralı odadaki klima düzgün çalışmıyor.',
    phoneticEn: 'Dı eır kındişınır in ruum frii-ou-for iz nat vörking prapırli.',
    phoneticDe: 'Dii Kliima-anlage in Tsimır dray-hundırt-fiır funktsiyoniırt niht rihtih.',
    urgency: 'medium'
  },
  {
    id: 'surv-6',
    category: 'hotel',
    titleTr: 'Geç çıkış (Late Check-out) isteme',
    en: 'Could I please arrange a late check-out for tomorrow afternoon?',
    de: 'Könnte ich bitte einen späten Check-out für morgen Nachmittag vereinbaren?',
    tr: 'Yarın öğleden sonra için geç çıkış ayarlayabilir miyim lütfen?',
    phoneticEn: 'Kud ay pliiz ıreync e leyt çek-aut for tumoro aftırnuun?',
    phoneticDe: 'Könte ih bite aynen şpeeten Çek-aut füür morgen Nahmitaak feraynbaaren?',
    urgency: 'medium'
  },

  // 3. HASTANE & ECZANE & SAĞLIK
  {
    id: 'surv-7',
    category: 'hospital',
    titleTr: 'Alerji bildirme (Hayati Tehlike)',
    en: 'I have a severe allergy to penicillin and nuts.',
    de: 'Ich habe eine schwere Allergie gegen Penicillin und Nüsse.',
    tr: 'Penisiline ve kuruyemişe karşı çok şiddetli alerjim var.',
    phoneticEn: 'Ay hev e sıviır elırci tu penisilin end nats.',
    phoneticDe: 'İh habe ayne şveere Alergi geegen Penitsilin unt Nüse.',
    urgency: 'high'
  },
  {
    id: 'surv-8',
    category: 'hospital',
    titleTr: 'Ağrı ve şikayet anlatma',
    en: 'I have a high fever and severe stomach pain since yesterday.',
    de: 'Ich habe seit gestern hohes Fieber und starke Magenschmerzen.',
    tr: 'Dünden beri yüksek ateşim ve şiddetli mide ağrım var.',
    phoneticEn: 'Ay hev e hay fiivır end sıviır stamık peyn sins yestırdey.',
    phoneticDe: 'İh habe zayt gestırn hoohes Fiibır unt ştarke Maagın-şmertsen.',
    urgency: 'high'
  },
  {
    id: 'surv-9',
    category: 'hospital',
    titleTr: 'Eczaneden reçetesiz ilaç isteme',
    en: 'Do you have something over the counter for a terrible headache?',
    de: 'Haben Sie etwas Rezeptfreies gegen starke Kopfschmerzen?',
    tr: 'Şiddetli baş ağrısı için reçetesiz alabileceğim bir şeyiniz var mı?',
    phoneticEn: 'Du yu hev samting ovır dı kauntır for e terıbıl hedeyk?',
    phoneticDe: 'Haabın Zii etvas Retsept-frayes geegen ştarke Kopf-şmertsen?',
    urgency: 'medium'
  },

  // 4. RESTORAN & KAFE
  {
    id: 'surv-10',
    category: 'restaurant',
    titleTr: 'Masa isteme',
    en: 'A table for two outside, please, if available.',
    de: 'Einen Tisch für zwei draußen, bitte, wenn möglich.',
    tr: 'Varsa dışarıda iki kişilik bir masa lütfen.',
    phoneticEn: 'E teybıl for tu autsayd, pliiz, if ıveylıbıl.',
    phoneticDe: 'Aynen Tiş füür tsvay drausın, bite, ven mööklih.',
    urgency: 'medium'
  },
  {
    id: 'surv-11',
    category: 'restaurant',
    titleTr: 'Hesabı isteme (Ayrı veya birlikte)',
    en: 'Could we get the check, please? Can we pay separately by card?',
    de: 'Könnten wir bitte die Rechnung haben? Können wir getrennt mit Karte zahlen?',
    tr: 'Hesabı alabilir miyiz lütfen? Kartla ayrı ayrı ödeyebilir miyiz?',
    phoneticEn: 'Kud vi get dı çek, pliiz? Ken vi pey sepırıtli bay kard?',
    phoneticDe: 'Könnten vir bite dii Rehnunk haabın? Können vir getrent mit Karte tsaalın?',
    urgency: 'medium'
  },

  // 5. ULAŞIM & TAKSİ
  {
    id: 'surv-12',
    category: 'transport',
    titleTr: 'Taksiye adres gösterme ve ücret sorma',
    en: 'Could you please take me to this address? How much will it approximately cost?',
    de: 'Könnten Sie mich bitte zu dieser Adresse bringen? Wie viel wird es ungefähr kosten?',
    tr: 'Beni bu adrese götürebilir misiniz lütfen? Yaklaşık ne kadar tutar?',
    phoneticEn: 'Kud yu pliiz teyk mi tu dis edres? Hau maç vil it ıpraksımıtli kost?',
    phoneticDe: 'Könnten Zii mih bite tsu diizır Adrese bringen? Vii fiil virt es ungefeer kostın?',
    urgency: 'high'
  },

  // 6. İŞ MÜLAKATI & KENDİNİ TANITMA
  {
    id: 'surv-13',
    category: 'interview',
    titleTr: 'Kendini 2 cümlede profesyonelce tanıtma',
    en: 'I have over six years of experience delivering robust digital products in fast-paced teams.',
    de: 'Ich verfüge über mehr als sechs Jahre Erfahrung in der Entwicklung robuster digitaler Produkte in dynamischen Teams.',
    tr: 'Hızlı tempolu ekiplerde güçlü dijital ürünler geliştirme konusunda altı yıldan fazla deneyimim var.',
    phoneticEn: 'Ay hev ovır siks yiırs ov ikspiiriyıns dılivıring roubast dicitıl pradakts in fast-peyst tiimz.',
    phoneticDe: 'İh ferfüüge üübır meer als zeks Yaare Erfaarunk in der Entviklunk robuuster dicitaalır Produkte in dünaamişen Tiimz.',
    urgency: 'medium'
  },

  // 7. ACİL DURUM & POLİS
  {
    id: 'surv-14',
    category: 'emergency',
    titleTr: 'Kayıp cüzdan & pasaport bildirimi',
    en: 'Help, someone just stole my bag with my passport and money! Please call the police!',
    de: 'Hilfe, jemand hat gerade meine Tasche mit Pass und Geld gestohlen! Bitte rufen Sie die Polizei!',
    tr: 'İmdat, biri az önce pasaportum ve paramın olduğu çantamı çaldı! Lütfen polisi arayın!',
    phoneticEn: 'Help, samvan cast stoul may beg vit may pasport end mani! Pliiz kool dı pıliis!',
    phoneticDe: 'Hilfe, yeemant hat geraade mayne Taşhe mit Pas unt Gelt geştoolın! Bite ruufın Zii dii Politsay!',
    urgency: 'high'
  }
];

interface ChirmoEmergencyCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChirmoEmergencyCheatSheetModal: React.FC<ChirmoEmergencyCheatSheetModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetLang = TargetLanguageService.getTargetLanguage();

  const categories = [
    { id: 'all', label: 'Tümü', icon: Zap },
    { id: 'airport', label: '✈️ Havalimanı', icon: Plane },
    { id: 'hotel', label: '🏨 Otel', icon: Building2 },
    { id: 'hospital', label: '🏥 Sağlık & Acil', icon: HeartPulse },
    { id: 'restaurant', label: '🍽️ Restoran', icon: UtensilsCrossed },
    { id: 'transport', label: '🚕 Taksi & Ulaşım', icon: Car },
    { id: 'interview', label: '💼 Mülakat', icon: Briefcase },
    { id: 'emergency', label: '🆘 Polis & Kayıp', icon: ShieldAlert }
  ];

  const filteredPhrases = SURVIVAL_PHRASES.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category === selectedCat;
    const matchesSearch =
      searchQuery === '' ||
      p.titleTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.de.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSpeak = (text: string, speed = 1.0) => {
    LearningStorageService.speak(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-rose-500/30 dark:border-rose-500/40 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Üst Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-wide">
                  Acil Durum & Seyahat Cankurtaran Kiti
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                  Tek Tıkla Sesli Oynat
                </span>
              </div>
              <p className="text-[11px] text-pink-100 font-medium hidden sm:block">
                Havalimanında, otelde, hastanede ve restoranda tek tıkla yerli gibi konuş ve derdini anlat
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-xl bg-black/30 text-xs font-black border border-white/20">
              {targetLang === 'de' ? '🇩🇪 Almanca' : '🇬🇧 İngilizce'}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Kategori Filtresi & Arama */}
        <div className="p-3 sm:px-6 sm:py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Arama */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Durum ara (ör: vize, klima, ağrı)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Kartlar Sahnesi */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPhrases.map((phrase) => {
              const activeText = targetLang === 'de' ? phrase.de : phrase.en;
              const activePhonetic = targetLang === 'de' ? phrase.phoneticDe : phrase.phoneticEn;

              return (
                <div
                  key={phrase.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 transition-all flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                      📌 {phrase.titleTr}
                    </span>
                    {phrase.urgency === 'high' && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        🚨 Hayati Kalıp
                      </span>
                    )}
                  </div>

                  {/* Orijinal Cümle */}
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      "{activeText}"
                    </div>

                    {/* Türkçe Karşılık */}
                    <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-1">
                      🇹🇷 {phrase.tr}
                    </div>
                  </div>

                  {/* Türkçe Okunuş Kılavuzu (Hatasız Telaffuz) */}
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-700 flex items-center space-x-2">
                    <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase shrink-0">
                      🗣️ Oku:
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono tracking-wide">
                      {activePhonetic}
                    </span>
                  </div>

                  {/* Butonlar: Sesli Dinle (Normal & Yavaş), Kopyala */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSpeak(activeText, 1.0)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dinle (1.0x)</span>
                      </button>

                      <button
                        onClick={() => handleSpeak(activeText, 0.75)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
                        title="Yavaş Telaffuz"
                      >
                        <span>🐢 Yavaş</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopy(phrase.id, activeText)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition-all cursor-pointer"
                      title="Cümleyi Kopyala"
                    >
                      {copiedId === phrase.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
