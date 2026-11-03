import React, { useState } from 'react';
import {
  Volume2,
  BookmarkPlus,
  Check,
  Sparkles,
  Compass,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  HeartHandshake
} from 'lucide-react';
import {
  REAL_LIFE_SCENARIOS,
  RealLifeScenario,
  CampStorageService
} from '../../services/curriculumData';
import { LearningStorageService } from '../../services/learningStorage';

interface GradeVocabularyViewProps {
  onWordAdded?: () => void;
}

export const GradeVocabularyView: React.FC<GradeVocabularyViewProps> = ({ onWordAdded }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>(null);
  const [addedWordMap, setAddedWordMap] = useState<Record<string, boolean>>({});

  const categories = [
    'Tümü',
    'Kafe & Restoran',
    'Havalimanı & Seyahat',
    'Sosyal Tanışma',
    'Doğal Tepkiler',
    'Yol Tarifi & Şehir',
    'İş & İnternet',
    'Acil Durumlar',
    'Alışveriş & Mağaza'
  ];

  const filteredScenarios =
    selectedCategory === 'Tümü'
      ? REAL_LIFE_SCENARIOS
      : REAL_LIFE_SCENARIOS.filter((s) => s.category === selectedCategory);

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleAddChunk = (chunk: {
    en: string;
    tr: string;
    phonetic: string;
    example: string;
    exampleTr: string;
  }) => {
    LearningStorageService.addWord({
      word: chunk.en,
      translation: chunk.tr,
      phonetic: chunk.phonetic,
      partOfSpeech: 'Chunk',
      level: 'A2',
      exampleSentence: chunk.example,
      exampleTranslation: chunk.exampleTr
    });

    setAddedWordMap((prev) => ({ ...prev, [chunk.en]: true }));
    onWordAdded?.();

    setTimeout(() => {
      setAddedWordMap((prev) => ({ ...prev, [chunk.en]: false }));
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto select-none p-4 sm:p-6">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* ==================== KATEGORİ SEÇİCİ BARI ==================== */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Hayat Kurtaran Gerçek Yaşam Durumları</span>
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Blok Kalıplarla Hızlı Konuşma
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2 pt-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Başlık ve Açıklama */}
        <div className="px-2">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <span>🗣️</span>
            <span>Kelimelerle Değil, Kalıplarla Düşün!</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ana dili İngilizce olanlar tek tek kelimeleri birleştirmez; hazır blok kalıpları ("chunks") fırlatır. İşte en çok ihtiyaç duyacağın durumlar:
          </p>
        </div>

        {/* ==================== SENARYOLAR VE KALIP KARTLARI ==================== */}
        <div className="space-y-4">
          {filteredScenarios.map((scenario) => {
            const isExpanded = expandedScenarioId === scenario.id || expandedScenarioId === null;

            return (
              <div
                key={scenario.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Senaryo Başlığı */}
                <div
                  onClick={() =>
                    setExpandedScenarioId(isExpanded && expandedScenarioId ? 'none' : scenario.id)
                  }
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{scenario.badge.split(' ')[0]}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {scenario.category}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {scenario.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{scenario.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                      {scenario.keyChunks.length} Sihirli Kalıp
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Senaryo İçeriği: Kalıplar ve İnteraktif Pratik */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-5">
                    {/* Kalıplar Izgarası */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {scenario.keyChunks.map((chunk) => {
                        const isAdded = !!addedWordMap[chunk.en];

                        return (
                          <div
                            key={chunk.en}
                            className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-2.5"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-baseline space-x-2">
                                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                    "{chunk.en}"
                                  </span>
                                  <button
                                    onClick={() => handleSpeak(chunk.en)}
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded-full cursor-pointer shrink-0"
                                    title="Doğru Okunuşu Dinle"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                                  {chunk.tr}
                                </div>
                                {chunk.phonetic && (
                                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                    {chunk.phonetic}
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => handleAddChunk(chunk)}
                                disabled={isAdded}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all shrink-0 ${
                                  isAdded
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 border border-slate-200 dark:border-slate-600'
                                }`}
                              >
                                {isAdded ? <Check className="w-3 h-3" /> : <BookmarkPlus className="w-3 h-3" />}
                                <span>{isAdded ? 'Eklendi' : 'Deftere Ekle'}</span>
                              </button>
                            </div>

                            <div className="bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-medium">
                                <span>"{chunk.example}"</span>
                                <button
                                  onClick={() => handleSpeak(chunk.example)}
                                  className="p-0.5 text-slate-400 hover:text-blue-600"
                                  title="Cümleyi Dinle"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="text-[11px] text-slate-500 italic mt-0.5">
                                {chunk.exampleTr}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* İnteraktif Rol Pratiği & Koç İpucu */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5 uppercase tracking-wide">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span>Gerçek Hayat Rol Pratiği: {scenario.interactiveChallenge.situation}</span>
                        </span>

                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
                          💡 İpucu: {scenario.interactiveChallenge.coachTip}
                        </span>
                      </div>

                      {/* Karşı Tarafın Sorusu */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Karşı Taraf Diyor Ki:</span>
                          <button
                            onClick={() => handleSpeak(scenario.interactiveChallenge.aiQuestion)}
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Sesli Dinle</span>
                          </button>
                        </div>
                        <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          "{scenario.interactiveChallenge.aiQuestion}"
                        </p>
                        <p className="text-xs text-slate-500 italic">
                          Türkçesi: {scenario.interactiveChallenge.aiQuestionTr}
                        </p>
                      </div>

                      {/* Senin Vereceğin Refleks Cevap */}
                      <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Senin Refleks Cevabın:</span>
                          <button
                            onClick={() => handleSpeak(scenario.interactiveChallenge.suggestedAnswer)}
                            className="text-xs font-bold text-emerald-600 hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Cevabı Dinle</span>
                          </button>
                        </div>
                        <p className="text-sm sm:text-base font-black text-emerald-800 dark:text-emerald-300">
                          "{scenario.interactiveChallenge.suggestedAnswer}"
                        </p>
                        <p className="text-xs text-slate-500 italic">
                          Türkçesi: {scenario.interactiveChallenge.suggestedAnswerTr}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
