import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Volume2,
  X,
  CheckCircle2,
  Lightbulb,
  Heart,
  Smile,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  Flame
} from 'lucide-react';
import { LearningStorageService } from '../../services/learningStorage';

interface GermanGenderWord {
  article: 'der' | 'die' | 'das';
  word: string;
  tr: string;
  category: string;
  sampleSentence: string;
  sampleSentenceTr: string;
}

const GENDER_WORDS: GermanGenderWord[] = [
  // 🔵 DER (Mavi)
  {
    article: 'der',
    word: 'Kaffee',
    tr: 'kahve',
    category: 'Yiyecek & İçecek',
    sampleSentence: 'Der Kaffee schmeckt heute ausgezeichnet.',
    sampleSentenceTr: 'Kahve bugün mükemmel bir tada sahip.'
  },
  {
    article: 'der',
    word: 'Bahnhof',
    tr: 'tren garı',
    category: 'Ulaşım & Şehir',
    sampleSentence: 'Der Bahnhof ist nur fünf Minuten entfernt.',
    sampleSentenceTr: 'Tren garı sadece 5 dakika uzaklıkta.'
  },
  {
    article: 'der',
    word: 'Tisch',
    tr: 'masa',
    category: 'Günlük Yaşam',
    sampleSentence: 'Könnten wir bitte den Tisch am Fenster bekommen?',
    sampleSentenceTr: 'Pencere kenarındaki masayı alabilir miyiz lütfen?'
  },
  {
    article: 'der',
    word: 'Termin',
    tr: 'randevu / toplantı',
    category: 'İş & Yaşam',
    sampleSentence: 'Der Termin um 14 Uhr passt mir sehr gut.',
    sampleSentenceTr: 'Saat 14\'teki randevu bana çok iyi uyuyor.'
  },
  {
    article: 'der',
    word: 'Flughafen',
    tr: 'havalimanı',
    category: 'Seyahat',
    sampleSentence: 'Der Flughafen ist sehr modern und groß.',
    sampleSentenceTr: 'Havalimanı çok modern ve büyük.'
  },
  {
    article: 'der',
    word: 'Lehrer',
    tr: 'öğretmen (erkek)',
    category: 'Meslekler',
    sampleSentence: 'Der Lehrer erklärt die Grammatik ganz einfach.',
    sampleSentenceTr: 'Öğretmen grameri çok basit açıklıyor.'
  },

  // 🔴 DIE (Kırmızı)
  {
    article: 'die',
    word: 'Rechnung',
    tr: 'hesap / fatura',
    category: 'Kafe & Restoran',
    sampleSentence: 'Die Rechnung bitte, zusammen oder getrennt?',
    sampleSentenceTr: 'Hesap lütfen, birlikte mi ayrı mı?'
  },
  {
    article: 'die',
    word: 'Sprache',
    tr: 'dil / lisan',
    category: 'Öğrenme',
    sampleSentence: 'Die deutsche Sprache ist sehr logisch aufgebaut.',
    sampleSentenceTr: 'Almanca dili çok mantıklı bir şekilde inşa edilmiştir.'
  },
  {
    article: 'die',
    word: 'Stadt',
    tr: 'şehir',
    category: 'Seyahat',
    sampleSentence: 'Die Stadt Berlin hat eine reiche Kultur.',
    sampleSentenceTr: 'Berlin şehri çok zengin bir kültüre sahiptir.'
  },
  {
    article: 'die',
    word: 'Übung',
    tr: 'pratik / alıştırma',
    category: 'Öğrenme',
    sampleSentence: 'Übung macht den Meister!',
    sampleSentenceTr: 'Pratik insanı usta yapar!'
  },
  {
    article: 'die',
    word: 'Möglichkeit',
    tr: 'olasılık / imkân',
    category: 'İş & Hayat',
    sampleSentence: 'Es gibt immer eine gute Möglichkeit.',
    sampleSentenceTr: 'Daima iyi bir imkân vardır.'
  },
  {
    article: 'die',
    word: 'Freundschaft',
    tr: 'dostluk / arkadaşlık',
    category: 'Duygular',
    sampleSentence: 'Echte Freundschaft ist unbezahlbar.',
    sampleSentenceTr: 'Gerçek dostluk paha biçilemez.'
  },

  // 🟢 DAS (Yeşil)
  {
    article: 'das',
    word: 'Brötchen',
    tr: 'küçük ekmek / sandviç ekmeği',
    category: 'Fırın & Kafe',
    sampleSentence: 'Das Brötchen ist ganz frisch gebacken.',
    sampleSentenceTr: 'Küçük ekmek fırından yeni çıkmış, taptaze.'
  },
  {
    article: 'das',
    word: 'Hotel',
    tr: 'otel',
    category: 'Seyahat',
    sampleSentence: 'Das Hotel liegt direkt am schönen Strand.',
    sampleSentenceTr: 'Otel tam olarak güzel kumsalın kenarında yer alıyor.'
  },
  {
    article: 'das',
    word: 'Ticket',
    tr: 'bilet',
    category: 'Ulaşım',
    sampleSentence: 'Das Ticket gilt für die ganze U-Bahn-Zone.',
    sampleSentenceTr: 'Bilet tüm metro bölgesinde geçerlidir.'
  },
  {
    article: 'das',
    word: 'Wasser',
    tr: 'su',
    category: 'İçecek',
    sampleSentence: 'Ein Glas stilles Wasser bitte.',
    sampleSentenceTr: 'Bir bardak gazsız su lütfen.'
  },
  {
    article: 'das',
    word: 'Mädchen',
    tr: 'genç kız / kız çocuğu',
    category: 'İnsan',
    sampleSentence: 'Das Mädchen lernt fleißig Deutsch.',
    sampleSentenceTr: 'Kız çocuğu gayretle Almanca öğreniyor.'
  },
  {
    article: 'das',
    word: 'Museum',
    tr: 'müze',
    category: 'Kültür',
    sampleSentence: 'Das Museum ist am Montag geschlossen.',
    sampleSentenceTr: 'Müze Pazartesi günü kapalıdır.'
  }
];

interface ChirmoGermanGenderMasteryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
}

type TabType = 'vault' | 'rules' | 'cases' | 'quiz';

export const ChirmoGermanGenderMasteryModal: React.FC<ChirmoGermanGenderMasteryModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('vault');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'der' | 'die' | 'das'>('all');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<'der' | 'die' | 'das' | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  if (!isOpen) return null;

  const filteredWords = GENDER_WORDS.filter((w) =>
    selectedFilter === 'all' ? true : w.article === selectedFilter
  );

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const currentQuizWord = GENDER_WORDS[quizIndex % GENDER_WORDS.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/30 dark:border-blue-500/40 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Üst Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <ShieldCheck className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-wide">
                  Almanca Renkli Artikel & Kural Laboratuvarı
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                  Der • Die • Das
                </span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium hidden sm:block">
                50 Yıllık Hoca Metodu • Görsel Renk Hafızasıyla Artikel Korkusuna Son
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Ana Sekme */}
        <div className="px-4 sm:px-6 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'vault', label: '🎨 Renkli Kelime Havuzu' },
            { id: 'rules', label: '📜 Altın Ek Kuralları (%100 Garanti)' },
            { id: 'cases', label: '🔄 Akkusativ & Dativ Dönüşümü' },
            { id: 'quiz', label: '🎯 Artikel Avcısı Testi' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                setSelectedArticle(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sekme 1: Renkli Kelime Havuzu */}
        {activeTab === 'vault' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {/* 3 Renk Kutusu */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <button
                onClick={() => setSelectedFilter(selectedFilter === 'der' ? 'all' : 'der')}
                className={`p-3 sm:p-4 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                  selectedFilter === 'der'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102 ring-2 ring-blue-300'
                    : 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 text-blue-900 dark:text-blue-200 hover:bg-blue-100'
                }`}
              >
                <div className="text-lg sm:text-2xl font-black">🔵 DER</div>
                <div className="text-[10px] sm:text-[11px] font-bold opacity-80 mt-0.5">Mavi / Eril</div>
              </button>

              <button
                onClick={() => setSelectedFilter(selectedFilter === 'die' ? 'all' : 'die')}
                className={`p-3 sm:p-4 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                  selectedFilter === 'die'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-102 ring-2 ring-rose-300'
                    : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200 hover:bg-rose-100'
                }`}
              >
                <div className="text-lg sm:text-2xl font-black">🔴 DIE</div>
                <div className="text-[10px] sm:text-[11px] font-bold opacity-80 mt-0.5">Kırmızı / Dişil</div>
              </button>

              <button
                onClick={() => setSelectedFilter(selectedFilter === 'das' ? 'all' : 'das')}
                className={`p-3 sm:p-4 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                  selectedFilter === 'das'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102 ring-2 ring-emerald-300'
                    : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <div className="text-lg sm:text-2xl font-black">🟢 DAS</div>
                <div className="text-[10px] sm:text-[11px] font-bold opacity-80 mt-0.5">Yeşil / Nötr</div>
              </button>
            </div>

            {/* Kelime Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredWords.map((item) => {
                const isDer = item.article === 'der';
                const isDie = item.article === 'die';
                const badgeBg = isDer
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-400'
                  : isDie
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-400'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-400';

                return (
                  <div
                    key={item.word}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-blue-400 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black border ${badgeBg}`}>
                          {item.article}
                        </span>
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {item.word}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSpeak(`${item.article} ${item.word}`)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition cursor-pointer"
                        title="Sesli Dinle"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Türkçesi: {item.tr} • <span className="text-slate-400">{item.category}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-150 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 italic">
                      "{item.sampleSentence}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sekme 2: Altın Ek Kuralları */}
        {activeTab === 'rules' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs sm:text-sm text-amber-950 dark:text-amber-200">
              <span className="font-black text-amber-800 dark:text-amber-300">💡 50 Yıllık Hoca Sırrı: </span>
              Almancada binlerce kelimenin son ekine bakarak makine gibi anında artikelini %100 bilirsin! Ezberleme, sonuna bak!
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* %100 DIE */}
              <div className="p-4 rounded-3xl bg-rose-50/80 dark:bg-slate-800 border-2 border-rose-300 space-y-3">
                <div className="text-sm font-black text-rose-700 dark:text-rose-400 flex items-center justify-between">
                  <span>🔴 %100 DIE (Dişil)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 font-extrabold">Son Ekler</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { suffix: '-ung', eg: 'die Zeitung (gazete)' },
                    { suffix: '-heit', eg: 'die Freiheit (özgürlük)' },
                    { suffix: '-keit', eg: 'die Möglichkeit (imkan)' },
                    { suffix: '-schaft', eg: 'die Freundschaft (dostluk)' },
                    { suffix: '-tät', eg: 'die Universität (üniversite)' },
                    { suffix: '-tion', eg: 'die Station (istasyon)' },
                    { suffix: '-ik', eg: 'die Musik (müzik)' }
                  ].map((s) => (
                    <div key={s.suffix} className="p-1.5 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-between font-medium">
                      <span className="font-black text-rose-600">{s.suffix}</span>
                      <span className="text-slate-600 dark:text-slate-300">{s.eg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* %100 DAS */}
              <div className="p-4 rounded-3xl bg-emerald-50/80 dark:bg-slate-800 border-2 border-emerald-300 space-y-3">
                <div className="text-sm font-black text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                  <span>🟢 %100 DAS (Nötr)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-extrabold">Son Ekler</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { suffix: '-chen', eg: 'das Mädchen (kız çocuğu)' },
                    { suffix: '-lein', eg: 'das Fräulein (küçük hanım)' },
                    { suffix: '-ment', eg: 'das Dokument (belge)' },
                    { suffix: '-um', eg: 'das Museum (müze)' },
                    { suffix: '-tum', eg: 'das Wachstum (büyüme)' }
                  ].map((s) => (
                    <div key={s.suffix} className="p-1.5 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-between font-medium">
                      <span className="font-black text-emerald-600">{s.suffix}</span>
                      <span className="text-slate-600 dark:text-slate-300">{s.eg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* %90 DER */}
              <div className="p-4 rounded-3xl bg-blue-50/80 dark:bg-slate-800 border-2 border-blue-300 space-y-3">
                <div className="text-sm font-black text-blue-700 dark:text-blue-400 flex items-center justify-between">
                  <span>🔵 %90 DER (Eril)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200 text-blue-800 font-extrabold">Son Ekler</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { suffix: '-ling', eg: 'der Schmetterling (kelebek)' },
                    { suffix: '-or', eg: 'der Motor (motor)' },
                    { suffix: '-ismus', eg: 'der Optimismus (iyimserlik)' },
                    { suffix: '-er', eg: 'der Lehrer (eylemi yapan)' },
                    { suffix: '-ist', eg: 'der Polizist (polis)' }
                  ].map((s) => (
                    <div key={s.suffix} className="p-1.5 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-between font-medium">
                      <span className="font-black text-blue-600">{s.suffix}</span>
                      <span className="text-slate-600 dark:text-slate-300">{s.eg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sekme 3: Akkusativ & Dativ Dönüşümü */}
        {activeTab === 'cases' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200">
              <span className="font-black">🎯 1 Dakikada Akkusativ (-i hali) ve Dativ (-e hali) Matrisi: </span>
              Türk öğrencilerin en çok korktuğu şey basittir: Sadece "DER" Akkusativ'de değişir (DEN olur). Dativ'de ise herkes değişir!
            </div>

            <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black">
                  <tr>
                    <th className="p-3">Cinsiyet</th>
                    <th className="p-3">Yalın (Nominativ)</th>
                    <th className="p-3">-i Hali (Akkusativ)</th>
                    <th className="p-3">-e Hali (Dativ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-medium">
                  <tr className="bg-blue-50/40 dark:bg-blue-950/20">
                    <td className="p-3 font-black text-blue-600">🔵 Eril (Maskulin)</td>
                    <td className="p-3 font-bold">DER Tisch</td>
                    <td className="p-3 font-black text-amber-600">DEN Tisch (Değişir!)</td>
                    <td className="p-3 font-black text-purple-600">DEM Tisch</td>
                  </tr>
                  <tr className="bg-rose-50/40 dark:bg-rose-950/20">
                    <td className="p-3 font-black text-rose-600">🔴 Dişil (Feminin)</td>
                    <td className="p-3 font-bold">DIE Stadt</td>
                    <td className="p-3 font-bold text-slate-600">DIE Stadt (Aynı kalır)</td>
                    <td className="p-3 font-black text-purple-600">DER Stadt</td>
                  </tr>
                  <tr className="bg-emerald-50/40 dark:bg-emerald-950/20">
                    <td className="p-3 font-black text-emerald-600">🟢 Nötr (Neutral)</td>
                    <td className="p-3 font-bold">DAS Hotel</td>
                    <td className="p-3 font-bold text-slate-600">DAS Hotel (Aynı kalır)</td>
                    <td className="p-3 font-black text-purple-600">DEM Hotel</td>
                  </tr>
                  <tr className="bg-amber-50/40 dark:bg-amber-950/20">
                    <td className="p-3 font-black text-amber-600">🟡 Çoğul (Plural)</td>
                    <td className="p-3 font-bold">DIE Kinder</td>
                    <td className="p-3 font-bold text-slate-600">DIE Kinder</td>
                    <td className="p-3 font-black text-purple-600">DEN Kindern (+n)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sekme 4: Artikel Avcısı Testi */}
        {activeTab === 'quiz' && (
          <div className="p-6 sm:p-10 flex-1 overflow-y-auto flex flex-col justify-between max-w-xl mx-auto w-full space-y-6">
            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black">
                🎯 Soru {quizIndex + 1} / {GENDER_WORDS.length} • Puan: {quizScore} XP
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                "___ {currentQuizWord.word}"
              </h3>
              <p className="text-xs text-slate-500">
                Anlamı: <span className="font-black text-slate-700 dark:text-slate-300">{currentQuizWord.tr}</span>
              </p>
            </div>

            {/* 3 Seçenek Butonu */}
            <div className="grid grid-cols-3 gap-3">
              {(['der', 'die', 'das'] as const).map((art) => {
                const isCorrect = art === currentQuizWord.article;
                const isSelected = selectedArticle === art;

                const bgClass =
                  art === 'der'
                    ? 'border-blue-400 hover:bg-blue-50 text-blue-600'
                    : art === 'die'
                    ? 'border-rose-400 hover:bg-rose-50 text-rose-600'
                    : 'border-emerald-400 hover:bg-emerald-50 text-emerald-600';

                return (
                  <button
                    key={art}
                    onClick={() => {
                      if (selectedArticle) return;
                      setSelectedArticle(art);
                      if (isCorrect) {
                        setQuizScore((prev) => prev + 25);
                        if (onRewardXP) onRewardXP(25);
                        handleSpeak(`${art} ${currentQuizWord.word}`);
                      }
                    }}
                    className={`py-6 rounded-2xl border-2 font-black text-xl transition-all cursor-pointer uppercase ${
                      !selectedArticle
                        ? `bg-white dark:bg-slate-800 ${bgClass}`
                        : isCorrect
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                        : isSelected
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'opacity-30'
                    }`}
                  >
                    {art}
                  </button>
                );
              })}
            </div>

            {selectedArticle && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-center space-y-1 animate-fade-in">
                <div className="font-black text-slate-900 dark:text-white">
                  Örnek: "{currentQuizWord.sampleSentence}"
                </div>
                <div className="text-[11px] text-slate-500 italic">{currentQuizWord.sampleSentenceTr}</div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedArticle(null);
                setQuizIndex((prev) => (prev + 1) % GENDER_WORDS.length);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Sonraki Kelime</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Alt Kapatma */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-bold flex items-center space-x-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Almanca artikelleri gözünde canlandır, renklerle düşün.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
          >
            Tamamdır
          </button>
        </div>
      </div>
    </div>
  );
};
