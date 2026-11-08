import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
  Target,
  Zap,
  Smile,
  Compass,
  Trophy,
  Award
} from 'lucide-react';
import { CEFRLevelSimple, UserProfileService } from '../../services/userProfileService';
import { LearningStorageService } from '../../services/learningStorage';
import { AnalyticsService } from '../../services/analyticsService';
import { TargetLanguageService, SupportedLanguage } from '../../services/targetLanguageService';
import {
  PersonalizedLearningPlanService,
  AgeGroup,
  TargetFocus,
  PersonalizedLearningRoadmap
} from '../../services/personalizedLearningPlanService';

interface ChirmoOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (level: CEFRLevelSimple, targetTab?: string) => void;
}

export const ChirmoOnboardingModal: React.FC<ChirmoOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(() =>
    TargetLanguageService.getTargetLanguage()
  );
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('adults');
  const [ageNumber, setAgeNumber] = useState<number>(24);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevelSimple>('A1');
  const [selectedFocus, setSelectedFocus] = useState<TargetFocus>('daily');
  const [dailyMinutes, setDailyMinutes] = useState<number>(20);
  const [diagnosticAnswer, setDiagnosticAnswer] = useState<number | null>(null);
  const [previewPlan, setPreviewPlan] = useState<PersonalizedLearningRoadmap | null>(null);

  if (!isOpen) return null;

  const handleLangChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    TargetLanguageService.setTargetLanguage(lang);
  };

  const handleAgeGroupChange = (group: AgeGroup) => {
    setSelectedAgeGroup(group);
    if (group === 'kids') setAgeNumber(8);
    else if (group === 'teens') setAgeNumber(15);
    else setAgeNumber(26);
  };

  const handleDiagnosticSelect = (index: number) => {
    setDiagnosticAnswer(index);
  };

  const handleStepToPreview = () => {
    // Generate plan preview
    const generated = PersonalizedLearningPlanService.buildPlan({
      ageGroup: selectedAgeGroup,
      ageNumber,
      level: selectedLevel,
      targetLang: selectedLang,
      targetFocus: selectedFocus
    });
    setPreviewPlan(generated);
    setStep(4);
  };

  const handleFinish = () => {
    // 1. Generate & save personalized plan
    PersonalizedLearningPlanService.generateAndSavePlan({
      ageGroup: selectedAgeGroup,
      ageNumber,
      level: selectedLevel,
      targetLang: selectedLang,
      targetFocus: selectedFocus
    });

    // 2. Save profile
    UserProfileService.saveProfile({
      level: selectedLevel,
      dailyGoal: dailyMinutes,
      ...(selectedAgeGroup ? { ageGroup: selectedAgeGroup } : {}),
      ...(ageNumber ? { age: ageNumber } : {}),
      ...(selectedFocus ? { targetFocus: selectedFocus } : {})
    } as any);

    // 3. Mark completed in localStorage
    try {
      localStorage.setItem('chirmo_onboarding_completed_v1', 'true');
    } catch {}

    LearningStorageService.setUserLevel(selectedLevel);
    AnalyticsService.logLessonCompleted(100); // Onboarding completion bonus XP

    onComplete(selectedLevel, 'tasks');
    onClose();
  };

  const isDe = selectedLang === 'de';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Üst Başlık & İlerleme Çubuğu */}
        <div className="p-4 sm:p-6 pb-3 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-purple-50/50 via-indigo-50/30 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-800/30 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <span className="text-xs font-black tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                Chirmo Seviye & Öğrenme Planı Sihirbazı
              </span>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Adım {step} / 4
            </span>
          </div>

          {/* İlerleme Göstergesi */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Gövde Alanı */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">

          {/* ==================== ADIM 1: DİL & YAŞ GRUBU ==================== */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Önce Seni Tanıyalım: Dil ve Yaş Grubu Seç
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Chirmo, içeriği ve alıştırmaları senin yaşına ve dil hedefine göre özel olarak filtreler.
                </p>
              </div>

              {/* 1. Hedef Dil Seçimi */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  1. Öğrenmek İstediğin Dil:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLangChange('en')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedLang === 'en'
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🇬🇧</span>
                      <div>
                        <div className="font-black text-xs">İngilizce</div>
                        <div className="text-[10px] text-slate-500">English Speaking</div>
                      </div>
                    </div>
                    {selectedLang === 'en' && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLangChange('de')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedLang === 'de'
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">🇩🇪</span>
                      <div>
                        <div className="font-black text-xs">Almanca</div>
                        <div className="text-[10px] text-slate-500">Deutsch Sprechen</div>
                      </div>
                    </div>
                    {selectedLang === 'de' && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                </div>
              </div>

              {/* 2. Yaş Grubu Seçimi */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  2. Yaş Grubun Hangisi?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      key: 'kids' as AgeGroup,
                      emoji: '🧒',
                      title: '5 - 11 Yaş (Çocuk)',
                      desc: 'Oyunlar, sevimli hayvanlar ve Chirmo Kids'
                    },
                    {
                      key: 'teens' as AgeGroup,
                      emoji: '🎒',
                      title: '12 - 17 Yaş (Genç)',
                      desc: 'Okul ezberi yok; müzik ve konuşma refleksleri'
                    },
                    {
                      key: 'adults' as AgeGroup,
                      emoji: '💼',
                      title: '18+ Yaş (Yetişkin)',
                      desc: 'Günlük yaşam, seyahat, iş ve özgüvenle konuşma'
                    }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleAgeGroupChange(item.key)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedAgeGroup === item.key
                          ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 ring-2 ring-purple-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xl mb-1">{item.emoji}</div>
                      <div className="font-black text-xs text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{item.title}</span>
                        {selectedAgeGroup === item.key && (
                          <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== ADIM 2: MEVCUT SEVİYE & HEDEF ODAK ==================== */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Mevcut Seviyen ve Öncelikli Hedefin
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Chirmo sıfırdan başlayanları doğrudan zorlamaz; adım adım konuşma kasını geliştirir.
                </p>
              </div>

              {/* Seviye Kartları */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Mevcut Konuşma Durumun:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      lvl: 'A1' as CEFRLevelSimple,
                      title: 'A1 — Sıfırdan Başlıyorum',
                      desc: isDe ? 'Hiç Almanca bilmiyorum veya sadece birkaç kelime hatırlıyorum.' : 'Hiç İngilizce bilmiyorum veya sadece birkaç kelime biliyorum.'
                    },
                    {
                      lvl: 'A2' as CEFRLevelSimple,
                      title: 'A2 — Temel Seviyedeyim',
                      desc: 'Basit cümleleri anlıyorum ama yabancı biriyle konuşurken tıkanıyorum.'
                    },
                    {
                      lvl: 'B1' as CEFRLevelSimple,
                      title: 'B1 — Anlıyorum Ama Konuşamıyorum',
                      desc: 'Duyduğumu anlıyorum fakat kafamda Türkçe çeviri yapmaktan yoruluyorum.'
                    },
                    {
                      lvl: 'B2' as CEFRLevelSimple,
                      title: 'B2/C1 — Akıcılaşmak İstiyorum',
                      desc: 'İş, mülakat, seyahat veya altyazısız film izlemek için akıcılık istiyorum.'
                    }
                  ].map((item) => (
                    <button
                      key={item.lvl}
                      type="button"
                      onClick={() => setSelectedLevel(item.lvl)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedLevel === item.lvl
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{item.title}</span>
                        {selectedLevel === item.lvl && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hedef Odak */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  En Büyük Hedefin / Önceliğin:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { key: 'daily' as TargetFocus, icon: '☕', label: 'Günlük Yaşam' },
                    { key: 'cinema' as TargetFocus, icon: '🎬', label: 'Film & Shadowing' },
                    { key: 'career' as TargetFocus, icon: '💼', label: 'İş & Mülakat' },
                    { key: 'games' as TargetFocus, icon: '🎮', label: 'Oyun & Eğlence' }
                  ].map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setSelectedFocus(f.key)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedFocus === f.key
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-black'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-base">{f.icon}</div>
                      <div className="text-[10px] truncate mt-0.5">{f.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== ADIM 3: DOĞAL DİYALOG REFLEKS TESTİ ==================== */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-black uppercase">
                  ⚡ 30 Saniyelik Doğal Konuşma Refleksi
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                  {isDe
                    ? 'Berlin’de bir kafedesin, kahve sipariş edeceksin. Yerliler gibi en doğal ve saygılı nasıl istersin?'
                    : 'Yurt dışında bir kafedesin, kahve sipariş edeceksin. Yerliler gibi en doğal ve kibar nasıl istersin?'}
                </h3>
              </div>

              <div className="space-y-2">
                {(isDe
                  ? [
                      {
                        text: 'Einen Kaffee zum Mitnehmen bitte.',
                        expl: '✅ Mükemmel! "...bitte" ve "zum Mitnehmen" (al-götür) günlük Almancada en doğal sipariş kalıbıdır.'
                      },
                      {
                        text: 'Ich will Kaffee jetzt.',
                        expl: '❌ "Ich will..." (istiyorum) kaba algılanır. Almanlar sipariş verirken daima rica kalıplarını kullanır.'
                      },
                      {
                        text: 'Gib mir Kaffee sofort.',
                        expl: '❌ Emir kipi ("Gib mir") siparişlerde asla kullanılmaz.'
                      }
                    ]
                  : [
                      {
                        text: 'Can I get an iced latte to go, please?',
                        expl: '✅ Harika! "Can I get..." kalıbı İngilizce konuşulan ülkelerde en doğal, yerel ve saygılı sipariş formülüdür.'
                      },
                      {
                        text: 'I want coffee latte now.',
                        expl: '❌ "I want..." emrivaki ve kaba algılanır. Yerliler siparişte daima "Can I get..." kalıbını tercih eder.'
                      },
                      {
                        text: 'Give me one latte fast.',
                        expl: '❌ Emir kipi ("Give me") günlük yaşamda hoş karşılanmaz.'
                      }
                    ]
                ).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDiagnosticSelect(idx)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      diagnosticAnswer === idx
                        ? idx === 0
                          ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                          : 'border-red-400 bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-100'
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
                    Chirmo ile gramer ezberlemeden bu refleks kalıplarını günlük hayatında otomatik söyleyeceksin!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ==================== ADIM 4: KİŞİSEL PLANIN HAZIR (ÖNİZLEME) ==================== */}
          {step === 4 && previewPlan && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
                  🎉
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1.5">
                  Sana Özel Chirmo Öğrenme Planı Hazır!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Yaşın ({selectedAgeGroup === 'kids' ? 'Çocuk' : selectedAgeGroup === 'teens' ? 'Genç' : 'Yetişkin'}), seviyen ({selectedLevel}) ve hedefin için en uygun alanlar sıralandı.
                </p>
              </div>

              {/* Profil Özet Rozetleri */}
              <div className="flex items-center justify-center flex-wrap gap-1.5 text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold">
                  {selectedLang === 'de' ? '🇩🇪 Almanca' : '🇬🇧 İngilizce'}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold">
                  {previewPlan.levelTitle}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold">
                  ⭐ Toplam {previewPlan.totalXpReward} XP Ödül
                </span>
              </div>

              {/* Sıralı Adım Önizlemesi */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {previewPlan.steps.map((st, i) => (
                  <div
                    key={st.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                          {st.title}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {st.badge} • {st.timeEstimate}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 shrink-0 ml-2">
                      +{st.xpReward} XP
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-200 font-medium text-center">
                🚀 Bu görevler doğrudan <span className="font-black">"Hedeflerim"</span> sekmesine yüklenecek ve her adımı sırayla tamamlayabileceksin!
              </div>
            </div>
          )}
        </div>

        {/* Alt Butonlar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Şimdilik Atla
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
            >
              <span>Devam Et</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : step === 3 ? (
            <button
              type="button"
              onClick={handleStepToPreview}
              disabled={diagnosticAnswer === null}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 text-white text-xs font-black shadow-md transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
            >
              <span>Planımı Oluştur 🎯</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <span>Planımı Başlat & Hedeflerime Git 🚀</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
