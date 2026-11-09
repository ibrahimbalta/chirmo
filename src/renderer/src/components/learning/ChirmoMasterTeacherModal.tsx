import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  Sparkles,
  Headphones,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Sword,
  ArrowRight,
  Heart,
  Award,
  CheckCircle2
} from 'lucide-react';
import { ChirmoShadowingEngineModal } from './ChirmoShadowingEngineModal';
import { ChirmoTurkishPitfallsRadarModal } from './ChirmoTurkishPitfallsRadarModal';
import { ChirmoGermanGenderMasteryModal } from './ChirmoGermanGenderMasteryModal';
import { ChirmoEmergencyCheatSheetModal } from './ChirmoEmergencyCheatSheetModal';
import { ChirmoSpeakingToolboxModal } from './ChirmoSpeakingToolboxModal';
import { TargetLanguageService } from '../../services/targetLanguageService';

interface ChirmoMasterTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
  initialStation?: 'shadowing' | 'pitfalls' | 'gender' | 'survival' | 'toolbox';
}

export const ChirmoMasterTeacherModal: React.FC<ChirmoMasterTeacherModalProps> = ({
  isOpen,
  onClose,
  onRewardXP,
  initialStation
}) => {
  const [activeSubModal, setActiveSubModal] = useState<
    'shadowing' | 'pitfalls' | 'gender' | 'survival' | 'toolbox' | null
  >(initialStation || null);

  if (!isOpen) return null;

  const targetLang = TargetLanguageService.getTargetLanguage();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
        <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
          {/* Hoca Başlığı & Rozet */}
          <div className="px-5 sm:px-8 py-4 bg-gradient-to-r from-amber-600 via-purple-700 to-indigo-800 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md shrink-0">
                🎓
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-wide">
                    50 Yıllık Hocanın Dil Çözüm İstasyonu
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase shadow-xs">
                    Altın Pedagoji
                  </span>
                </div>
                <p className="text-xs text-amber-100 font-medium mt-0.5">
                  Türkiye'nin Dil Öğrenme Engelini Yıkan 5 Devrimci Güç Bir Arada
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 50 Yıllık Hocanın Manifestosu */}
          <div className="p-4 sm:p-6 bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 flex items-start space-x-3 text-xs sm:text-sm text-amber-950 dark:text-amber-200">
            <span className="text-2xl shrink-0">📜</span>
            <div className="space-y-1">
              <div className="font-black text-amber-900 dark:text-amber-300">
                "Evladım, 50 yıldır tahta başındayım. Türk insanı zeki değil diye değil, dilin 'otopsisi' yapıldığı için konuşamadı!"
              </div>
              <p className="text-[11px] sm:text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                Aşağıdaki 5 laboratuvar, beynindeki Türkçe-yabancı dil uyuşmazlığını çözer, telaffuzunu yerliler gibi yapar ve hata korkunu sıfırlar. Hangisine ihtiyacın varsa tıkla ve konuşma kasını başlat!
              </p>
            </div>
          </div>

          {/* 5 Ana Pedagojik Laboratuvar Kartı */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Gölgeleme (Shadowing) */}
              <div
                onClick={() => setActiveSubModal('shadowing')}
                className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-xs hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                    Dünya #1 Metodu
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    1. Gölgeleme (Shadowing) Koçu
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Kulak duyar, beyin Türkçe düşünmeden ağız taklit eder. Yavaş/hızlı yerli sesiyle konuşma ritmini yakala.
                  </p>
                </div>

                <div className="flex items-center text-xs font-black text-indigo-600 dark:text-indigo-400 space-x-1">
                  <span>Gölgelemeye Başla</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 2. Türklerin 100 Hatası Radarı */}
              <div
                onClick={() => setActiveSubModal('pitfalls')}
                className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-amber-950/40 border-2 border-amber-200 dark:border-amber-800 hover:border-amber-500 transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-xs hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    Koruma Kalkanı
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    2. Türklerin 100 Sık Hatası Radarı
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    "I am agree", "Ich bin warm" gibi komik duruma düşüren tuzakları, yalancı arkadaşları ve edat hatalarını yok et.
                  </p>
                </div>

                <div className="flex items-center text-xs font-black text-amber-600 dark:text-amber-400 space-x-1">
                  <span>Tuzakları İncele & Test Et</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 3. Almanca Renkli Artikel Laboratuvarı */}
              <div
                onClick={() => setActiveSubModal('gender')}
                className="p-5 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-blue-950/40 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-xs hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    Der • Die • Das
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    3. Almanca Renkli Artikel Laboratuvarı
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Mavi (Der), Kırmızı (Die), Yeşil (Das) renk kodları, %100 kesin son ek kuralları ve Akkusativ/Dativ matrisi.
                  </p>
                </div>

                <div className="flex items-center text-xs font-black text-blue-600 dark:text-blue-400 space-x-1">
                  <span>Artikel Laboratuvarına Gir</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* 4. Acil Durum Cankurtaran Kiti */}
              <div
                onClick={() => setActiveSubModal('survival')}
                className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-800 dark:to-rose-950/40 border-2 border-rose-200 dark:border-rose-800 hover:border-rose-500 transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-xs hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                    Hayati Kurtarıcı
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                    4. Acil Durum Cankurtaran Kiti
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Havalimanı vize memuru, otel arızası, hastane alerji bildirimi, restoran hesabı için tek tıkla sesli oynat.
                  </p>
                </div>

                <div className="flex items-center text-xs font-black text-rose-600 dark:text-rose-400 space-x-1">
                  <span>Cankurtaran Kitini Aç</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* 5. Cümle Kılıcı & Konuşma Alet Çantası (Geniş Alt Kart) */}
            <div
              onClick={() => setActiveSubModal('toolbox')}
              className="p-5 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group hover:scale-[1.01] transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md shrink-0">
                  🗡️
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base sm:text-lg font-black">
                      5. Cümle Kılıcı & Konuşma Alet Çantası
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white">
                      5 Temel Dişli
                    </span>
                  </div>
                  <p className="text-xs text-pink-100 mt-0.5 leading-relaxed">
                    Soru sorma, rica etme, duygu katma ve bağlaçlarla uzun cümle kurmanın değişmez formülleri.
                  </p>
                </div>
              </div>

              <button className="px-4 py-2 rounded-xl bg-white text-purple-700 font-black text-xs shrink-0 flex items-center space-x-1.5 shadow-md group-hover:bg-amber-300 group-hover:text-slate-950 transition-all">
                <span>Alet Çantasını Aç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Modallar */}
      <ChirmoShadowingEngineModal
        isOpen={activeSubModal === 'shadowing'}
        onClose={() => setActiveSubModal(null)}
        onRewardXP={onRewardXP}
      />

      <ChirmoTurkishPitfallsRadarModal
        isOpen={activeSubModal === 'pitfalls'}
        onClose={() => setActiveSubModal(null)}
        onRewardXP={onRewardXP}
      />

      <ChirmoGermanGenderMasteryModal
        isOpen={activeSubModal === 'gender'}
        onClose={() => setActiveSubModal(null)}
        onRewardXP={onRewardXP}
      />

      <ChirmoEmergencyCheatSheetModal
        isOpen={activeSubModal === 'survival'}
        onClose={() => setActiveSubModal(null)}
      />

      <ChirmoSpeakingToolboxModal
        isOpen={activeSubModal === 'toolbox'}
        onClose={() => setActiveSubModal(null)}
        onRewardXP={onRewardXP}
      />
    </>
  );
};
