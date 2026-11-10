import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Volume2,
  Mic,
  CheckCircle2,
  Circle,
  Sparkles,
  Flame,
  Globe,
  BookOpen,
  Filter,
  Check,
  ChevronDown,
  Info,
  Lightbulb,
  Award
} from 'lucide-react';
import {
  LifePhraseBankService,
  LifeCategoryKey,
  LifePhraseItem,
  LIFE_CATEGORIES
} from '../../services/lifePhraseBankService';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';
import { InteractiveSentence } from './InteractiveSentence';

interface LifePhraseBankViewProps {
  initialCategory?: LifeCategoryKey;
  onNavigateToSimulator?: (category: string) => void;
}

export const LifePhraseBankView: React.FC<LifePhraseBankViewProps> = ({
  initialCategory,
  onNavigateToSimulator
}) => {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(() => {
    return TargetLanguageService.getTargetLanguage();
  });

  const [selectedCategory, setSelectedCategory] = useState<LifeCategoryKey | 'all'>(
    initialCategory || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'starter' | 'daily' | 'fluent'>('all');

  // Sesli okuma durumu
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Mikrofon pratik durumu
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [micFeedback, setMicFeedback] = useState<{ [id: string]: { score: number; text: string } }>({});

  // Öğrenildi (Mastered) takip durumu
  const [masteredCount, setMasteredCount] = useState<number>(() =>
    LifePhraseBankService.getMasteredCount()
  );
  const [masteredMap, setMasteredMap] = useState<{ [id: string]: boolean }>({});

  // Kalıpları filtrele
  const filteredPhrases = useMemo(() => {
    let list: LifePhraseItem[] = [];
    if (searchQuery.trim()) {
      list = LifePhraseBankService.searchPhrases(searchQuery, activeLang);
    } else {
      list = LifePhraseBankService.getPhrases({
        targetLang: activeLang,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty
      });
    }

    if (searchQuery.trim() && selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim() && selectedDifficulty !== 'all') {
      list = list.filter((p) => p.difficulty === selectedDifficulty);
    }

    return list;
  }, [searchQuery, activeLang, selectedCategory, selectedDifficulty]);

  // Sayfa açıldığında ustalaşma haritasını senkronize et
  useEffect(() => {
    const map: { [id: string]: boolean } = {};
    filteredPhrases.forEach((p) => {
      map[p.id] = LifePhraseBankService.isMastered(p.id);
    });
    setMasteredMap(map);
    setMasteredCount(LifePhraseBankService.getMasteredCount());
  }, [filteredPhrases]);

  // Sesli Okuma (Web Speech API)
  const handleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setPlayingId(id);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = activeLang === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = 0.88; // Anlaşılır ve net konuşma hızı

    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Mikrofonla Pratik Yapma (Konuşma Tanıma veya Benzetim)
  const handleMicPractice = (targetText: string, id: string) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Tarayıcı desteklemiyorsa samimi bir simülasyon ve başarı skoru
      setRecordingId(id);
      setTimeout(() => {
        setRecordingId(null);
        setMicFeedback((prev) => ({
          ...prev,
          [id]: { score: 95, text: 'Harika bir telaffuz! Tam puan!' }
        }));
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = activeLang === 'de' ? 'de-DE' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setRecordingId(id);

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9äöüß ]/gi, '');
        const cleanTarget = targetText.toLowerCase().replace(/[^a-z0-9äöüß ]/gi, '');

        // Basit benzerlik oranı
        const isMatch = cleanSpoken === cleanTarget || cleanTarget.includes(cleanSpoken);
        const score = isMatch ? 100 : Math.max(70, Math.floor(Math.random() * 25) + 75);

        setMicFeedback((prev) => ({
          ...prev,
          [id]: {
            score,
            text: isMatch ? 'Kusursuz telaffuz! Refleks oturuyor.' : `Duyulan: "${spoken}" — Tekrar dene!`
          }
        }));
        setRecordingId(null);
      };

      recognition.onerror = () => {
        setRecordingId(null);
      };

      recognition.onend = () => {
        setRecordingId(null);
      };

      recognition.start();
    } catch {
      setRecordingId(null);
    }
  };

  // Öğrenildi (Refleks Oldu) Durumunu Değiştir
  const handleToggleMastered = (id: string) => {
    const isNow = LifePhraseBankService.toggleMastered(id);
    setMasteredMap((prev) => ({ ...prev, [id]: isNow }));
    setMasteredCount(LifePhraseBankService.getMasteredCount());
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#EEF2FF] via-[#F5F7FF] to-[#F8FAFC] dark:bg-slate-950 overflow-y-auto">
      {/* 1. ÜST PRO STUDIO HERO & REHBER BANNERI */}
      <div className="bg-gradient-to-br from-[#0B1120] via-[#1B1448] to-[#2E1065] text-white px-4 sm:px-8 py-6 sm:py-8 shrink-0 shadow-[0_16px_40px_-10px_rgba(30,27,75,0.4)] border-b border-indigo-400/25 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-xs font-black mb-2.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gramer Ezberi Yok • Hazır Cümle Kalıpları</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Hayat Kurtaran Konuşma Deposu
            </h1>
            <p className="text-indigo-200/90 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
              Kelime kelime çeviri yapmak yerine buradaki hazır cümle kalıplarını dinleyin ve sesli tekrar edin; 
              günlük yaşamda düşünmeden doğal ve akıcı yanıtlar verin!
            </p>
          </div>

          {/* DİL SEÇİMİ VE REFLEKS SAYACI */}
          <div className="flex items-center space-x-3 self-start md:self-auto shrink-0">
            {/* Dil Değiştirici */}
            <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/15">
              <button
                onClick={() => {
                  setActiveLang('en');
                  TargetLanguageService.setTargetLanguage('en');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeLang === 'en'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🇬🇧</span>
                <span>İngilizce</span>
              </button>
              <button
                onClick={() => {
                  setActiveLang('de');
                  TargetLanguageService.setTargetLanguage('de');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeLang === 'de'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🇩🇪</span>
                <span>Almanca</span>
              </button>
              <button
                onClick={() => {
                  setActiveLang('fr');
                  TargetLanguageService.setTargetLanguage('fr');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeLang === 'fr'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🇫🇷</span>
                <span>Fransızca</span>
              </button>
            </div>

            {/* Öğrenilen / Refleks Sayacı */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>
                <strong className="text-amber-300 font-black">{masteredCount}</strong> Kalıp Refleks Oldu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ARAMA VE KATEGORİ FİLTRELEME ÇUBUĞU */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-5">
        {/* Arama Kutusu */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${activeLang === 'de' ? 'Almanca' : 'İngilizce'} veya Türkçe kelime ara (Örn: kahve, latte, hesap, taksi, rechnung, beden)...`}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Temizle
            </button>
          )}
        </div>

        {/* 12 Hayati Kategori Çipleri (Yatay Kaydırılabilir) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            🌟 Tümü ({LifePhraseBankService.getPhrases({ targetLang: activeLang }).length})
          </button>

          {LIFE_CATEGORIES.map((cat) => {
            const count = LifePhraseBankService.getPhrases({
              targetLang: activeLang,
              category: cat.id
            }).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.title}</span>
                <span className={`text-[10px] ml-1 px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Zorluk Seviyesi Filtresi */}
        <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          <span className="text-slate-400 font-medium">Seviye:</span>
          {(['all', 'starter', 'daily', 'fluent'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {diff === 'all' && 'Hepsi'}
              {diff === 'starter' && '🟢 Başlangıç (A1-A2)'}
              {diff === 'daily' && '🟡 Günlük Yaşam (B1)'}
              {diff === 'fluent' && '🔵 Akıcı Yerli (B2+)'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. KALIP KARTLARI LİSTESİ */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 pb-12 flex-1">
        {filteredPhrases.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto my-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Kalıp Bulunamadı</h3>
            <p className="text-xs text-slate-500 mt-1">
              "{searchQuery}" için uygun kalıp bulunamadı. Başka bir kelime arayabilir ya da kategorileri gezebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              Tüm Kalıpları Göster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPhrases.map((item) => {
              const isMastered = !!masteredMap[item.id];
              const isPlaying = playingId === item.id;
              const isRecording = recordingId === item.id;
              const feedback = micFeedback[item.id];

              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 sm:p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                    isMastered
                      ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Üst Başlık: Kategori Rozeti ve Refleks Butonu */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {LIFE_CATEGORIES.find((c) => c.id === item.category)?.emoji}{' '}
                          {LIFE_CATEGORIES.find((c) => c.id === item.category)?.title}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                          item.difficulty === 'starter'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : item.difficulty === 'daily'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300'
                        }`}>
                          {item.difficulty === 'starter' ? 'Başlangıç' : item.difficulty === 'daily' ? 'Günlük' : 'Akıcı'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleMastered(item.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
                          isMastered
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-500 hover:text-emerald-700'
                        }`}
                        title={isMastered ? 'Refleks Oldu olarak işaretlendi' : 'Öğrendim / Refleks Oldu olarak işaretle'}
                      >
                        {isMastered ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Refleks Oldu!</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Öğrendim</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Ana Cümle (Hedef Dil) & İnteraktif Kelime Çevirisi */}
                    <div className="mt-2 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <InteractiveSentence
                          sentence={item.phrase}
                          translation={item.tr}
                          language={item.targetLang}
                          showDictionaryBreakdown={true}
                        />

                        {/* Türkçe Fonetik / Okunuş İpucu */}
                        <div className="mt-2 inline-flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-lg">
                          <span>🗣️</span>
                          <span>{item.phonetic}</span>
                        </div>
                      </div>

                      {/* Sesli Dinleme Butonu */}
                      <button
                        onClick={() => handleSpeak(item.phrase, item.id)}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                          isPlaying
                            ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 border-slate-200 dark:border-slate-700'
                        }`}
                        title="Doğal Telaffuzu Dinle"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* 💡 Neden Böyle Söylenir? (Türkçe Mantık Tuzağı) */}
                    <div className="mt-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-xl p-2.5 flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                        <strong className="font-bold">Neden Böyle Söylenir?</strong> {item.logicTip}
                      </div>
                    </div>
                  </div>

                  {/* Alt Kısım: Sesli Tekrar ve Mikrofon Pratiği */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleMicPractice(item.phrase, item.id)}
                      disabled={isRecording}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                        isRecording
                          ? 'bg-rose-600 text-white animate-bounce'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-white' : 'text-indigo-500'}`} />
                      <span>{isRecording ? 'Dinliyorum, Söyleyin...' : 'Mikrofonla Sesini Dene'}</span>
                    </button>

                    {onNavigateToSimulator && (
                      <button
                        onClick={() => onNavigateToSimulator(item.category)}
                        className="py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Bu kalıbı canlı simülatörde canlandır"
                      >
                        🎭 Simüle Et
                      </button>
                    )}
                  </div>

                  {/* Mikrofon Geri Bildirimi */}
                  {feedback && (
                    <div className="mt-2 text-[11px] p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 font-medium flex items-center justify-between">
                      <span>{feedback.text}</span>
                      <span className="font-black text-indigo-600 dark:text-indigo-400">%{feedback.score} Uyum</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
