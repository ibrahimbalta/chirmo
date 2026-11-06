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
  RotateCcw
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

  // 🟢 DAS (Yeşil)
  {
    article: 'das',
    word: 'Brötchen',
    tr: 'küçük ekmek / sandviç ekmeği',
    category: 'Fırın & Kafe',
    sampleSentence: 'Das Brötchen ist ganz frisch gebacken.',
    sampleSentenceTr: 'Ekmekçik fırından yeni çıkmış, taptaze.'
  },
  {
    article: 'das',
    word: 'Wasser',
    tr: 'su',
    category: 'Yiyecek & İçecek',
    sampleSentence: 'Ein Glas Wasser ohne Kohlensäure, bitte.',
    sampleSentenceTr: 'Gazsız bir bardak su lütfen.'
  },
  {
    article: 'das',
    word: 'Hotel',
    tr: 'otel',
    category: 'Konaklama',
    sampleSentence: 'Das Hotel liegt direkt im Stadtzentrum.',
    sampleSentenceTr: 'Otel tam şehir merkezinde yer alıyor.'
  },
  {
    article: 'das',
    word: 'Ticket',
    tr: 'bilet',
    category: 'Ulaşım',
    sampleSentence: 'Das Ticket gilt für die ganze Zone.',
    sampleSentenceTr: 'Bilet tüm bölge için geçerlidir.'
  }
];

interface ChirmoGermanGenderMasteryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChirmoGermanGenderMasteryModal: React.FC<ChirmoGermanGenderMasteryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'der' | 'die' | 'das'>('all');
  const [fearlessModeEnabled, setFearlessModeEnabled] = useState(true);

  if (!isOpen) return null;

  const filteredWords =
    selectedFilter === 'all'
      ? GENDER_WORDS
      : GENDER_WORDS.filter((w) => w.article === selectedFilter);

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-300 dark:border-blue-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Üst Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-base sm:text-lg">
                  Korkusuz Almanca: Renk Kodlu Artikel Sistemi 🇩🇪
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                der / die / das korkusuna son! Görsel renk hafızası ve sokak cesareti.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gövde */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Korkusuz Sokak Modu Açıklama Kartı */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-amber-950/20 border-2 border-amber-300 dark:border-amber-700/60 flex items-start space-x-3 shadow-xs">
            <Smile className="w-7 h-7 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-200">
                  20 Yıllık Öğretmen Tüyosu: "Korkusuz Sokak Modu"
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-purple-950 text-[10px] font-black">
                  Aktif
                </span>
              </div>
              <p className="text-xs text-amber-900/90 dark:text-amber-300 leading-relaxed font-medium">
                Almanya'da bir fırında *"Ich hätte gerne <span className="underline font-bold">der</span> Brötchen"* (yanlış artikel) deseniz bile fırıncı size gülümser ve ekmeğinizi verir! 
                <strong> Anlaşmak, kusursuz gramerden 100 kat daha değerlidir.</strong> Asla artikel hatırlayamadım diye susmayın!
              </p>
            </div>
          </div>

          {/* Renk Skalası Kutucukları */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedFilter(selectedFilter === 'der' ? 'all' : 'der')}
              className={`p-3 sm:p-4 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                selectedFilter === 'der'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-102 ring-2 ring-blue-300'
                  : 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 text-blue-900 dark:text-blue-200 hover:bg-blue-100'
              }`}
            >
              <div className="text-xl sm:text-2xl font-black">🔵 DER</div>
              <div className="text-[11px] font-bold opacity-80 mt-0.5">Mavi / Maskulin (Eril)</div>
            </button>

            <button
              onClick={() => setSelectedFilter(selectedFilter === 'die' ? 'all' : 'die')}
              className={`p-3 sm:p-4 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                selectedFilter === 'die'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-lg scale-102 ring-2 ring-rose-300'
                  : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200 hover:bg-rose-100'
              }`}
            >
              <div className="text-xl sm:text-2xl font-black">🔴 DIE</div>
              <div className="text-[11px] font-bold opacity-80 mt-0.5">Kırmızı / Feminin (Dişil)</div>
            </button>

            <button
              onClick={() => setSelectedFilter(selectedFilter === 'das' ? 'all' : 'das')}
              className={`p-3 sm:p-4 rounded-2xl text-center border-2 transition-all cursor-pointer ${
                selectedFilter === 'das'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-102 ring-2 ring-emerald-300'
                  : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <div className="text-xl sm:text-2xl font-black">🟢 DAS</div>
              <div className="text-[11px] font-bold opacity-80 mt-0.5">Yeşil / Neutral (Nötr)</div>
            </button>
          </div>

          {/* Kelime Kartları Havuzu */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Görsel Bilinçaltı Hafızasıyla Kelimeler:</span>
              <span>{filteredWords.length} Kelime</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredWords.map((item) => {
                const isDer = item.article === 'der';
                const isDie = item.article === 'die';
                const isDas = item.article === 'das';

                const badgeBg = isDer
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-300'
                  : isDie
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300';

                return (
                  <div
                    key={item.word}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2 hover:border-indigo-400 transition"
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
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer transition"
                        title="Doğru Okunuşu Dinle"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Anlamı: {item.tr} ({item.category})
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 italic">
                      "{item.sampleSentence}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alt Kapatma */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-bold flex items-center space-x-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Kelimeleri mavi, kırmızı ve yeşil resimler gibi hayal et.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
          >
            Anladım, Cesurca Konuşacağım!
          </button>
        </div>
      </div>
    </div>
  );
};
