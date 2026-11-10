// Chirmo Kişisel Akıllı Hata Defteri (Personal Error Vault Modal)
// Kullanıcının konuşma ve yazma esnasında yaptığı hataları kategorize eder,
// doğrusunu ve doğal yerli alternatiflerini sesli dinletir, aralıklı tekrarla pekiştirir.

import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  CheckCircle2,
  Sparkles,
  Trash2,
  Filter,
  Award,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import {
  AiCorrectionService,
  UserMistakeRecord,
  ErrorCategory
} from '../../services/aiCorrectionService';
import { LearningStorageService } from '../../services/learningStorage';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';

interface ChirmoErrorVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChirmoErrorVaultModal: React.FC<ChirmoErrorVaultModalProps> = ({ isOpen, onClose }) => {
  const [mistakes, setMistakes] = useState<UserMistakeRecord[]>([]);
  const [filterLang, setFilterLang] = useState<SupportedLanguage | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ErrorCategory | 'all'>('all');
  const [showMastered, setShowMastered] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMistakes(AiCorrectionService.getAllMistakes());
      // Başlangıçta aktif hedef dili seç
      setFilterLang(TargetLanguageService.getLanguage());
    }
  }, [isOpen]);

  useEffect(() => {
    return AiCorrectionService.subscribe((updated) => {
      setMistakes(updated);
    });
  }, []);

  if (!isOpen) return null;

  const filteredMistakes = mistakes.filter((m) => {
    const langMatch = filterLang === 'all' || m.targetLang === filterLang;
    const catMatch = selectedCategory === 'all' || m.errorCategory === selectedCategory;
    const masteredMatch = showMastered ? m.mastered : !m.mastered;
    return langMatch && catMatch && masteredMatch;
  });

  const handleSpeak = (text: string, id: string) => {
    setActiveSpeechId(id);
    LearningStorageService.speak(text);
    setTimeout(() => setActiveSpeechId(null), 1500);
  };

  const handleMarkMastered = (id: string) => {
    const success = AiCorrectionService.markMistakeAsMastered(id);
    if (success) {
      LearningStorageService.addXp(20);
    }
  };

  const handleDelete = (id: string) => {
    AiCorrectionService.deleteMistake(id);
  };

  const unresolvedCount = mistakes.filter((m) => !m.mastered).length;
  const masteredCount = mistakes.filter((m) => m.mastered).length;

  const categoryLabels: Record<ErrorCategory, { tr: string; icon: string }> = {
    grammar: { tr: 'Dilbilgisi', icon: '📐' },
    vocabulary: { tr: 'Kelime Seçimi', icon: '📚' },
    preposition: { tr: 'Edat Kullanımı', icon: '🎯' },
    word_order: { tr: 'Söz Dizimi', icon: '🔀' },
    article: { tr: 'Artikeller (der/die/das/the/le)', icon: '🏷️' },
    spelling: { tr: 'Yazım Hatası', icon: '✍️' },
    fluency: { tr: 'Doğal Akıcılık', icon: '🌊' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl h-[680px] max-h-[92vh] rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Üst Başlık */}
        <div className="p-4 sm:p-6 border-b border-amber-100 dark:border-slate-800 bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-purple-50/80 dark:from-slate-900 dark:to-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                  Kişisel Akıllı Hata Defteri
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black">
                  {unresolvedCount} Aktif İyileştirme
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Konuşurken yaptığın hatalar unutulmaz; bilimsel aralıklı tekrarla kalıcı doğruya dönüşür.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filtre ve Sekme Çubuğu */}
        <div className="p-3 sm:px-6 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Dil Filtresi */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-bold text-[11px] flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Dil:
            </span>
            <button
              type="button"
              onClick={() => setFilterLang('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterLang === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => setFilterLang('en')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterLang === 'en'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              🇬🇧 İngilizce
            </button>
            <button
              type="button"
              onClick={() => setFilterLang('de')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterLang === 'de'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              🇩🇪 Almanca
            </button>
            <button
              type="button"
              onClick={() => setFilterLang('fr')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterLang === 'fr'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              🇫🇷 Fransızca
            </button>
          </div>

          {/* Aktif / Ustalaşılanlar Sekmesi */}
          <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setShowMastered(false)}
              className={`px-3 py-1 rounded-lg font-black transition-all ${
                !showMastered
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Geliştirilecekler ({unresolvedCount})
            </button>
            <button
              type="button"
              onClick={() => setShowMastered(true)}
              className={`px-3 py-1 rounded-lg font-black transition-all flex items-center space-x-1 ${
                showMastered
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Aştıklarım ({masteredCount})</span>
            </button>
          </div>
        </div>

        {/* Hata Kartları Listesi */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredMistakes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-3xl">
                {showMastered ? '🏆' : '🌟'}
              </div>
              <p className="font-black text-slate-700 dark:text-slate-200 text-base">
                {showMastered
                  ? 'Henüz ustalaşılan hata bulunmuyor.'
                  : 'Tebrikler! Çözülmeyi bekleyen hiçbir hatan yok.'}
              </p>
              <p className="text-xs max-w-md text-slate-500">
                {showMastered
                  ? 'Geliştirilecekler sekmesindeki hataları pratik edip "Öğrendim" butonuna basarak buraya taşıyabilirsin.'
                  : 'Chirmo AI Öğretmen ile serbest sohbet yap veya telaffuz doktorunda pratik yap; takıldığın yerler otomatik olarak buraya eklenecektir.'}
              </p>
            </div>
          ) : (
            filteredMistakes.map((record) => {
              const catInfo = record.errorCategory ? categoryLabels[record.errorCategory] : null;
              return (
                <div
                  key={record.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                    record.mastered
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : 'bg-white dark:bg-slate-800 border-amber-100 dark:border-slate-700 shadow-xs hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                        {record.targetLang === 'de' ? '🇩🇪 Almanca' : record.targetLang === 'fr' ? '🇫🇷 Fransızca' : '🇬🇧 İngilizce'}
                      </span>
                      {catInfo && (
                        <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-800 flex items-center space-x-1">
                          <span>{catInfo.icon}</span>
                          <span>{catInfo.tr}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleSpeak(record.correctedText, record.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          activeSpeechId === record.id
                            ? 'bg-amber-500 text-white'
                            : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-700'
                        }`}
                        title="Doğru Hali Sesli Dinle"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(record.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Cümle Karşılaştırması */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start space-x-2 text-xs sm:text-sm">
                      <span className="text-rose-500 font-black shrink-0 w-16">Senin Sözün:</span>
                      <span className="text-rose-700 dark:text-rose-400 line-through font-medium">
                        {record.originalText}
                      </span>
                    </div>

                    <div className="flex items-start space-x-2 text-xs sm:text-sm">
                      <span className="text-emerald-600 font-black shrink-0 w-16">Doğrusu:</span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                        {record.correctedText}
                      </span>
                    </div>

                    {record.nativeAlternative && record.nativeAlternative !== record.correctedText && (
                      <div className="flex items-start space-x-2 text-xs">
                        <span className="text-indigo-600 font-black shrink-0 w-16">Doğal Yerli:</span>
                        <span className="text-indigo-700 dark:text-indigo-300 italic font-medium">
                          &ldquo;{record.nativeAlternative}&rdquo;
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Türkçe Pedagojik Açıklama */}
                  {record.explanationTr && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-50/70 dark:bg-slate-900 border border-amber-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-900 dark:text-amber-300">Püf Noktası: </span>
                        <span>{record.explanationTr}</span>
                      </div>
                    </div>
                  )}

                  {/* Alt Aksiyon Butonları */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Tekrar Sayısı: {record.reviewCount || 1}
                    </span>

                    {!record.mastered ? (
                      <button
                        type="button"
                        onClick={() => handleMarkMastered(record.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Artık Biliyorum (+20 XP)</span>
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-black flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Kusursuz Öğrenildi</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bilgilendirici Alt Çubuk */}
        <div className="p-3 sm:px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Hatalarını tekrar etmek öğrenmenin en hızlı ve kalıcı yoludur.</span>
          </span>
          <span className="font-bold text-slate-600 dark:text-slate-300">
            SuperMemo SM-2 Destekli
          </span>
        </div>
      </div>
    </div>
  );
};
