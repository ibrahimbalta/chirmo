import React, { useState } from 'react';
import {
  GraduationCap,
  Volume2,
  BookmarkPlus,
  Check,
  Sparkles,
  HelpCircle,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import {
  GradeLevel,
  CurriculumUnit,
  GRADE_UNITS,
  CampStorageService
} from '../../services/curriculumData';
import { LearningStorageService } from '../../services/learningStorage';

interface GradeVocabularyViewProps {
  initialGrade?: GradeLevel;
  onGradeChange?: (grade: GradeLevel) => void;
  onWordAdded?: () => void;
}

export const GradeVocabularyView: React.FC<GradeVocabularyViewProps> = ({
  initialGrade,
  onGradeChange,
  onWordAdded
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(() => {
    return initialGrade || CampStorageService.getProgress().selectedGrade || '8';
  });

  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const [addedWordMap, setAddedWordMap] = useState<Record<string, boolean>>({});

  const units = GRADE_UNITS[selectedGrade] || [];

  const handleGradeSelect = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    CampStorageService.setSelectedGrade(grade);
    onGradeChange?.(grade);
    setExpandedUnitId(null);
  };

  const handleSpeak = (text: string) => {
    LearningStorageService.speak(text);
  };

  const handleAddWord = (word: {
    en: string;
    tr: string;
    phonetic: string;
    example: string;
    exampleTr: string;
  }) => {
    LearningStorageService.addWord({
      word: word.en,
      translation: word.tr,
      phonetic: word.phonetic,
      partOfSpeech: 'Word',
      level: selectedGrade === '8' ? 'B1' : 'A1',
      exampleSentence: word.example,
      exampleTranslation: word.exampleTr
    });

    setAddedWordMap((prev) => ({ ...prev, [word.en]: true }));
    onWordAdded?.();

    setTimeout(() => {
      setAddedWordMap((prev) => ({ ...prev, [word.en]: false }));
    }, 2000);
  };

  const gradeTitles: Record<GradeLevel, { title: string; subtitle: string; icon: string }> = {
    '5': {
      title: '5. Sınıf İngilizce',
      subtitle: 'Sıfırdan İngilizceye İlk Adım, Selamlaşma ve Çevre',
      icon: '🌱'
    },
    '6': {
      title: '6. Sınıf İngilizce',
      subtitle: 'Günlük Yaşam, Saatler, Rutinler ve Beslenme',
      icon: '⚡'
    },
    '7': {
      title: '7. Sınıf İngilizce',
      subtitle: 'Dış Görünüş, Kişilik, Sporlar ve Gelecek Hayalleri',
      icon: '🚀'
    },
    '8': {
      title: '8. Sınıf LGS İngilizce',
      subtitle: 'LGS Sınavı Tam Puan Hedefi, Friendship & Teen Life',
      icon: '🏆'
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto select-none p-4 sm:p-6">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* ==================== SINIF SEÇİM SEKMELERİ ==================== */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>MEB Müfredatı Sınıf Seçimi</span>
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Milli Eğitim Bakanlığı Müfredatına %100 Uyumlu
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['5', '6', '7', '8'] as GradeLevel[]).map((grade) => {
              const isSelected = selectedGrade === grade;
              const info = gradeTitles[grade];

              return (
                <button
                  key={grade}
                  onClick={() => handleGradeSelect(grade)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-2xl mb-1">{info.icon}</span>
                  <span className="text-sm font-extrabold">{grade}. Sınıf</span>
                  {grade === '8' && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${
                      isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-800'
                    }`}>
                      LGS Hazırlık
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seçilen Sınıf Bilgi Başlığı */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span>{gradeTitles[selectedGrade].icon}</span>
              <span>{gradeTitles[selectedGrade].title} Üniteleri</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {gradeTitles[selectedGrade].subtitle}
            </p>
          </div>
        </div>

        {/* ==================== ÜNİTELER LİSTESİ ==================== */}
        <div className="space-y-4">
          {units.map((unit) => {
            const isExpanded = expandedUnitId === unit.id || expandedUnitId === null; // varsayılan açık

            return (
              <div
                key={unit.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Ünite Başlığı Barı */}
                <div
                  onClick={() => setExpandedUnitId(isExpanded && expandedUnitId ? 'none' : unit.id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-xs">
                      {unit.unitNumber}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {unit.badge}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {unit.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{unit.theme}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                      {unit.keyWords.length} Temel Kelime
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Ünite İçeriği: Kelimeler ve Konuşma Kartı */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-5">
                    {/* Kelimeler Izgarası */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {unit.keyWords.map((kw) => {
                        const isAdded = !!addedWordMap[kw.en];

                        return (
                          <div
                            key={kw.en}
                            className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-2.5"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-baseline space-x-2">
                                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                                    {kw.en}
                                  </span>
                                  <span className="text-xs text-slate-400 font-mono">
                                    {kw.phonetic}
                                  </span>
                                  <button
                                    onClick={() => handleSpeak(kw.en)}
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded-full cursor-pointer"
                                    title="Doğru Okunuşu Dinle"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                                  {kw.tr}
                                </div>
                              </div>

                              <button
                                onClick={() => handleAddWord(kw)}
                                disabled={isAdded}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all ${
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
                                <span>"{kw.example}"</span>
                                <button
                                  onClick={() => handleSpeak(kw.example)}
                                  className="p-0.5 text-slate-400 hover:text-blue-600"
                                  title="Cümleyi Dinle"
                                >
                                  <Volume2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="text-[11px] text-slate-500 italic mt-0.5">
                                {kw.exampleTr}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Günlük Konuşma ve LGS Soru Pratiği */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5 uppercase tracking-wide">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span>Ünite Konuşma Pratiği</span>
                        </span>

                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                          💡 İpucu: {unit.dailySpeakingPrompt.audioTip}
                        </span>
                      </div>

                      {/* Soru */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Soru:</span>
                          <button
                            onClick={() => handleSpeak(unit.dailySpeakingPrompt.question)}
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Soruyu Dinle</span>
                          </button>
                        </div>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                          "{unit.dailySpeakingPrompt.question}"
                        </p>
                        <p className="text-xs text-slate-500 italic">
                          Türkçesi: {unit.dailySpeakingPrompt.questionTr}
                        </p>
                      </div>

                      {/* Örnek Cevap */}
                      <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Örnek Cevabın:</span>
                          <button
                            onClick={() => handleSpeak(unit.dailySpeakingPrompt.expectedAnswerExample)}
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Cevabı Dinle</span>
                          </button>
                        </div>
                        <p className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                          "{unit.dailySpeakingPrompt.expectedAnswerExample}"
                        </p>
                        <p className="text-xs text-slate-500 italic">
                          Türkçesi: {unit.dailySpeakingPrompt.expectedAnswerTr}
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
