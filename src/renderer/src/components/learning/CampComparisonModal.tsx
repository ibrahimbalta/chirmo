import React from 'react';
import {
  Award,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  X,
  Star,
  ShieldCheck,
  Zap,
  Volume2
} from 'lucide-react';
import { StudentCampProgress } from '../../services/curriculumData';
import { UserProfile } from '../../services/userProfileService';

interface CampComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: StudentCampProgress;
  userProfile: UserProfile;
}

export const CampComparisonModal: React.FC<CampComparisonModalProps> = ({
  isOpen,
  onClose,
  progress,
  userProfile
}) => {
  if (!isOpen) return null;

  const completedCount = (progress.completedDays || []).length;
  const isFinished = completedCount >= 30;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Başlık */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
              🎓
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">
                30 Günlük Başlangıç & Gelişim Karnesi
              </h2>
              <p className="text-xs text-blue-100">
                Chirmo Fluent Reflex Metodu Değerlendirme Raporu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gövde */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-100">
          {/* Karşılaştırma Kartları: Başlangıç vs Güncel Durum */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Başlangıç Durumu */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                1. Gün Başlangıç Seviyesi
              </span>
              <div className="text-base font-black text-slate-700 dark:text-slate-300">
                A1 — Sıfır Konuşma Refleksi
              </div>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pt-1">
                <li className="flex items-start space-x-1.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Cümle kurarken Türkçeden kelime kelime çeviri</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Hata yapma ve alay edilme korkusu (Duygusal Süzgeç)</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span>Sipariş verirken veya yol sorarken çekinme</span>
                </li>
              </ul>
            </div>

            {/* Güncel Kazanımlar */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                {isFinished ? '30. Gün Mezuniyet Düzeyi' : `Şu Anki Durum (${completedCount}/30 Gün)`}
              </span>
              <div className="text-base font-black text-emerald-950 dark:text-emerald-100 flex items-center space-x-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>B1 — İletişimsel Yeterlilik</span>
              </div>
              <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 pt-1">
                <li className="flex items-start space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Düşünmeden doğrudan hazır kalıpla (chunk) cevap verme</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Kafede, otelde ve havalimanında rahat diyalog kurabilme</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Hata yapmaktan korkmadan sesli konuşma özgüveni</span>
                </li>
              </ul>
            </div>
          </div>

          {/* İlerleme ve İstatistik Çubukları */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Tamamlanan Görev</div>
              <div className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                {completedCount} / 30 Gün
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Konuşma Puanı</div>
              <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">
                {progress.totalXp} XP
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Kesintisiz Seri</div>
              <div className="text-lg font-black text-amber-500 mt-0.5">
                {progress.streakDays} Gün 🔥
              </div>
            </div>
          </div>

          {/* Pedagojik Rapor Notu */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 space-y-1 leading-relaxed">
            <div className="font-bold flex items-center space-x-1.5 text-indigo-900 dark:text-indigo-100">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Chirmo AI Pedagoji Garantisi:</span>
            </div>
            <div>
              Chirmo kullanıcıya *"30 günde anadilin gibi olacaksın"* şeklinde gerçekçi olmayan vaatler vermez. Kazandırdığı şey, <strong>Türk insanının yıllarca aşamadığı konuşma bariyerini ve utanma duygusunu kırmak</strong>, günlük yaşamda kendini ifade edebilecek reflekse ulaştırmaktır.
            </div>
          </div>
        </div>

        {/* Kapat Butonu */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
