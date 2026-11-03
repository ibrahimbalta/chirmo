import React from 'react';
import {
  TrendingUp,
  Award,
  Flame,
  Clock,
  BookOpen,
  CheckCircle,
  Calendar,
  Sparkles,
  Target
} from 'lucide-react';
import { CEFRLevel, DailyGoalProgress } from '../../types';

interface ProgressViewProps {
  progress: DailyGoalProgress;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ progress }) => {
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentIdx = levels.indexOf(progress.currentLevel);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Kişisel Gelişim Raporu</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              İlerlemem & Seviye Haritam
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Günlük tarayıcı kullanımından kazandığın kelimeler ve CEFR basamaklarındaki gelişimin.
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <Award className="w-4 h-4" />
            <span>Mevcut Seviye: {progress.currentLevel}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Toplam Kelime</span>
              <BookOpen className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {progress.totalWordsLearned}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
              <span>+3 bugün eklendi</span>
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Gün Serisi (Streak)</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-500">
              {progress.streakDays} Gün
            </div>
            <p className="text-[11px] text-slate-400">
              Her gün düzenli kullanım
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">İngilizce Gezinti</span>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {progress.readingMinutesToday} dk
            </div>
            <p className="text-[11px] text-slate-400">
              Bugünkü aktif okuma süresi
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Kalıcılık Oranı</span>
              <Target className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-3xl font-black text-teal-600">
              %88
            </div>
            <p className="text-[11px] text-slate-400">
              SRS tekrar başarı puanı
            </p>
          </div>
        </div>

        {/* CEFR Level Roadmap */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                CEFR Dil Yolu (A1'den C2'ye)
              </h2>
              <p className="text-xs text-slate-500">
                Hedefinize doğru ilerleyişiniz internette karşılaştığınız kelimelerin seviyelerine göre otomatik güncellenir.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {progress.currentLevel} Seviyesinde Aktif
            </span>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-6 gap-2 pt-4">
            {levels.map((lvl, index) => {
              const isPast = index < currentIdx;
              const isCurrent = index === currentIdx;

              let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700';
              if (isPast) {
                badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 font-bold';
              } else if (isCurrent) {
                badgeStyle = 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border-blue-500 font-black scale-105';
              }

              return (
                <div
                  key={lvl}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${badgeStyle}`}
                >
                  <span className="text-sm">{lvl}</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-80">
                    {isPast ? 'Tamamlandı' : isCurrent ? 'Şu Anda' : 'Sırada'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Kelime Dağarcığı Dağılımı (CEFR)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-300 font-medium">
                  <span>A1 - A2 (Temel Kelimeler)</span>
                  <span>14 Kelime</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full w-[35%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-300 font-medium">
                  <span>B1 - B2 (Orta & İleri Seviye)</span>
                  <span>22 Kelime</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[55%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-300 font-medium">
                  <span>C1 - C2 (Yetkin & Akademik)</span>
                  <span>6 Kelime</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[15%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Chirmo Akıllı Öneri
            </h3>
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>B1'den B2'ye Geçiş İpucu</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Teknoloji ve bilim haberlerinde sıkça geçen <strong>sustainable</strong>, <strong>crucial</strong> ve <strong>implement</strong> gibi B2 fiil ve sıfatlarını başarıyla öğrendiniz. Şimdi The Economist veya MIT Tech Review makalelerinde 10 dakikalık bir gezinti yaparak B2 kelimelerini pekiştirebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
