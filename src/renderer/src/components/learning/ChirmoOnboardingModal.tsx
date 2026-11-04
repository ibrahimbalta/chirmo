import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Clock,
  Target,
  ShieldCheck,
  Award,
  Zap,
  Heart,
  Smile
} from 'lucide-react';
import { UserProfileService, CEFRLevelSimple } from '../../services/userProfileService';
import { LearningStorageService } from '../../services/learningStorage';
import { AnalyticsService } from '../../services/analyticsService';

interface ChirmoOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (level: CEFRLevelSimple, goalMins: number) => void;
}

export const ChirmoOnboardingModal: React.FC<ChirmoOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevelSimple>('A1');
  const [selectedReason, setSelectedReason] = useState<string>('confidence');
  const [dailyMinutes, setDailyMinutes] = useState<number>(20);
  const [fearBarrier, setFearBarrier] = useState<string>('anxiety');
  const [diagnosticAnswer, setDiagnosticAnswer] = useState<number | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleDiagnosticSelect = (index: number) => {
    setDiagnosticAnswer(index);
    const isCorrect = index === 0;
    setDiagnosticResult(isCorrect);
  };

  const handleFinish = () => {
    // Profil güncelle
    UserProfileService.saveProfile({
      level: selectedLevel,
      dailyGoal: dailyMinutes
    });

    LearningStorageService.setUserLevel(selectedLevel);
    AnalyticsService.logLessonCompleted(100); // İlk onboarding tamamlama bonusu

    onComplete(selectedLevel, dailyMinutes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Üst Başlık & İlerleme Çubuğu */}
        <div className="p-5 sm:p-6 pb-3 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-purple-50/50 via-indigo-50/30 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-800/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <span className="text-xs font-black tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                Chirmo Seviye & İhtiyaç Analizi
              </span>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Adım {step} / 4
            </span>
          </div>

          {/* İlerleme Göstergesi */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Gövde Alanı */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* ADIM 1: MEVCUT SEVİYE & ÖĞRENME HEDEFİ */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  İngilizceyi hangi seviyeden öğrenmek istiyorsun?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Chirmo sıfırdan başlayanları doğrudan karmaşık İngilizceye maruz bırakmaz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    lvl: 'A1' as CEFRLevelSimple,
                    title: 'A1 — Sıfırdan Başlıyorum',
                    desc: 'Hiç İngilizce bilmiyorum veya sadece birkaç kelime hatırlıyorum.'
                  },
                  {
                    lvl: 'A2' as CEFRLevelSimple,
                    title: 'A2 — Temel Bilgim Var',
                    desc: 'Basit cümleleri anlıyorum ama konuşurken kekeliyorum.'
                  },
                  {
                    lvl: 'B1' as CEFRLevelSimple,
                    title: 'B1 — Anlıyorum Ama Konuşamıyorum',
                    desc: 'Duyduğumu anlıyorum fakat kafamda Türkçe çeviri yapmaktan yoruluyorum.'
                  },
                  {
                    lvl: 'B2' as CEFRLevelSimple,
                    title: 'B2 — Akıcılaşmak İstiyorum',
                    desc: 'İş veya seyahat için kendimi doğal ve hatasız ifade etmek istiyorum.'
                  }
                ].map((item) => (
                  <button
                    key={item.lvl}
                    type="button"
                    onClick={() => setSelectedLevel(item.lvl)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedLevel === item.lvl
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                        {item.title}
                        {selectedLevel === item.lvl && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ADIM 2: İHTİYAÇ VE DUYGUSAL BARİYER */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  İngilizce konuşurken seni en çok ne engelliyor?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Türkiye'deki en büyük problem konuşma kaygısıdır. Chirmo seni asla yargılamaz.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'anxiety',
                    title: 'Hata yapmaktan ve komik duruma düşmekten korkuyorum',
                    badge: 'Duygusal Süzgeç'
                  },
                  {
                    id: 'translation',
                    title: 'Kafamda önce Türkçe düşünüp kelime kelime çeviriyorum',
                    badge: 'Refleks Eksikliği'
                  },
                  {
                    id: 'forgetting',
                    title: 'Kelimeleri ezberliyorum ama 3 gün sonra unutuyorum',
                    badge: 'Aralıklı Tekrar İhtiyacı'
                  },
                  {
                    id: 'grammar',
                    title: 'Yıllarca okulda gramer gördüm ama ağzımdan tek cümle çıkmıyor',
                    badge: 'Pratik Yoksunluğu'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFearBarrier(item.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      fearBarrier === item.id
                        ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300 shrink-0 ml-2">
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Günde kaç dakika ayırabilirsin?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mins: 10, label: '10 Dakika', sub: 'Hızlı Ritim' },
                    { mins: 20, label: '20 Dakika', sub: 'Chirmo 4x5 Metodu (Önerilen)' },
                    { mins: 30, label: '30+ Dakika', sub: 'Hızlı Kamp' }
                  ].map((m) => (
                    <button
                      key={m.mins}
                      type="button"
                      onClick={() => setDailyMinutes(m.mins)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        dailyMinutes === m.mins
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-black'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-xs">{m.label}</div>
                      <div className="text-[10px] opacity-75">{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADIM 3: PRATİK TANI TESTİ (30 SANİYELİK MİNİ GÖREV) */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-black uppercase">
                  Mini Refleks Görevi
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  Yurtdışında bir kafedesin, buzlu latte sipariş edeceksin. Yerliler gibi en doğal ve kibar nasıl istersin?
                </h3>
              </div>

              <div className="space-y-2">
                {[
                  {
                    text: 'Can I get an iced latte to go, please?',
                    expl: '✅ Mükemmel! "Can I get..." kalıbı İngilizce konuşulan ülkelerde en doğal, yerel ve saygılı sipariş kalıbıdır.'
                  },
                  {
                    text: 'I want coffee latte now.',
                    expl: '❌ "I want..." emrivaki ve kaba algılanır. Yerliler sipariş verirken daima "Can I get..." kalıbını tercih eder.'
                  },
                  {
                    text: 'Give me one latte fast.',
                    expl: '❌ Emir kipi ("Give me") siparişte hoş karşılanmaz.'
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDiagnosticSelect(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      diagnosticAnswer === idx
                        ? idx === 0
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                          : 'border-red-400 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-red-100'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.text}</div>
                    {diagnosticAnswer === idx && (
                      <div className="text-[11px] mt-1.5 leading-relaxed font-medium">
                        {item.expl}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {diagnosticAnswer !== null && (
                <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    Chirmo ile gramer ezberlemeden bu refleks kalıplarını günlük hayatında otomatik söylemeye başlayacaksın!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ADIM 4: KİŞİSEL PLANIN HAZIR */}
          {step === 4 && (
            <div className="space-y-4 text-center animate-fade-in py-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl mx-auto shadow-lg shadow-indigo-500/30">
                🎉
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Kişisel 30 Günlük Programın Hazır!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Seviyene ({selectedLevel}), hedefine ve günlük {dailyMinutes} dakikalık programına göre ayarlandı.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>📌 Başlangıç Seviyesi:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{selectedLevel} (Refleks Kampı)</span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>⏱️ Günlük Hedef:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{dailyMinutes} Dakika (4x5 dk Metodu)</span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>🧠 Hafıza Sistemi:</span>
                  <span className="text-purple-600 dark:text-purple-400">SM-2 Akıllı Aralıklı Tekrar (SRS)</span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>🤖 AI Öğretmen:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Chirmo 3D Sesli Konuşma Koçu</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-200 font-medium">
                🎯 Chirmo akıcılık garantisi gibi sahte vaatler vermez; 30 günün sonunda kendi kendine konuşabilmeni, sipariş verebilmeni ve korkunu yenmeni sağlar.
              </div>
            </div>
          )}
        </div>

        {/* Alt Butonlar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Atla
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 3 && diagnosticAnswer === null}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>Devam Et</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Kampa Başla</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
