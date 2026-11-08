import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  FileText,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Award,
  Trophy,
  Flame,
  Star,
  Zap,
  Target,
  Compass,
  ArrowRight,
  Settings,
  Smile
} from 'lucide-react';
import { AnalyticsService } from '../../services/analyticsService';
import { LearningStorageService } from '../../services/learningStorage';
import {
  PersonalizedLearningPlanService,
  PersonalizedLearningRoadmap,
  PlanStep
} from '../../services/personalizedLearningPlanService';

interface SimpleTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEYS = {
  TASKS: 'chirmo_simple_tasks_v1',
  NOTES: 'chirmo_simple_notes_v1'
};

interface SimpleTaskWorkspaceProps {
  onNavigateTab?: (tab: string, subTab?: string) => void;
  onOpenPlanModal?: () => void;
}

export const SimpleTaskWorkspace: React.FC<SimpleTaskWorkspaceProps> = ({
  onNavigateTab,
  onOpenPlanModal
}) => {
  // Kişiselleştirilmiş Öğrenme Planı
  const [learningPlan, setLearningPlan] = useState<PersonalizedLearningRoadmap>(() =>
    PersonalizedLearningPlanService.getPlan()
  );

  const [tasks, setTasks] = useState<SimpleTask[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { id: '1', title: 'Bugün 15 dakika İngilizce sesli pratik yap (+25 XP)', completed: false, createdAt: new Date().toISOString() },
      { id: '2', title: 'Chirmo ile kafede kahve siparişi ver (+40 XP)', completed: false, createdAt: new Date().toISOString() },
      { id: '3', title: 'Lego kalıplarından 5 yeni cümle üret (+25 XP)', completed: true, createdAt: new Date().toISOString() }
    ];
  });

  const [newTaskInput, setNewTaskInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [justCompletedToast, setJustCompletedToast] = useState<string | null>(null);

  // Quick Notes state
  const [noteContent, setNoteContent] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.NOTES) || 'Buraya günlük çalışma notlarınızı, önemli linkleri ve hatırlatmalarınızı yazabilirsiniz.';
  });
  const [noteSaved, setNoteSaved] = useState(false);

  // Focus Timer (Pomodoro) state: 25 minutes = 1500 seconds
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    return PersonalizedLearningPlanService.subscribe((updated) => {
      setLearningPlan(updated);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      LearningStorageService.addXP(50);
      LearningStorageService.speak('Tebrikler! 25 dakikalık odaklanma seansını başarıyla tamamladın. 50 XP kazandın!');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  const handleStepCompleteToggle = (step: PlanStep) => {
    if (!step.completed) {
      const res = PersonalizedLearningPlanService.completeStep(step.id);
      setJustCompletedToast(`+${res.xpGained} XP! "${step.title}" tamamlandı! 🎉`);
      setTimeout(() => setJustCompletedToast(null), 2500);
    } else {
      PersonalizedLearningPlanService.resetStep(step.id);
    }
  };

  const handleStartStepAction = (step: PlanStep) => {
    if (onNavigateTab) {
      onNavigateTab(step.targetTab, step.subTab);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask: SimpleTask = {
      id: 'task-' + Date.now(),
      title: newTaskInput.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([newTask, ...tasks]);
    setNewTaskInput('');
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            LearningStorageService.addXP(25);
            setJustCompletedToast('+25 XP Görev Tamamlandı! 🎉');
            setTimeout(() => setJustCompletedToast(null), 2200);
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleSaveNote = () => {
    localStorage.setItem(STORAGE_KEYS.NOTES, noteContent);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f0f4ff] dark:bg-slate-950 overflow-y-auto select-none pb-24 sm:pb-8 max-w-full box-border">
      {/* Oyun Karakter HUD & Başlık */}
      <div className="p-3.5 sm:p-5 border-b border-indigo-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md min-w-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-black uppercase tracking-wider">
                Maceracı Görev Defteri & Seviye Karnesi 📜
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
              Kişisel Öğrenme Planım & Günlük Hedefler
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Yaşına ve seviyene göre hazırlanan adımları tamamla, XP puanı topla ve günlük yaşamda özgüvenle konuş!
            </p>
          </div>

          {/* Oyuncu Durum Hapı & Seviye Güncelleme */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenPlanModal && (
              <button
                type="button"
                onClick={onOpenPlanModal}
                className="px-3 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                title="Yaş, seviye ve hedeflerini yeniden seçip planı güncelle"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Planı Yenile</span>
              </button>
            )}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-2xl text-xs font-black text-amber-800 dark:text-amber-300 flex items-center space-x-1.5 shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{learningPlan.completedCount} / {learningPlan.steps.length} İstasyon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kutlama Bildirimi */}
      {justCompletedToast && (
        <div className="fixed top-16 right-4 sm:right-8 z-50 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-black text-xs shadow-xl border-2 border-white animate-bounce flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4" />
          <span>{justCompletedToast}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto w-full p-3 sm:p-6 space-y-5 min-w-0">

        {/* ==================== 1. SANA ÖZEL KİŞİSELLEŞTİRİLMİŞ ÖĞRENME YOL HARİTASI ==================== */}
        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl space-y-4 border border-indigo-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                  Sana Özel Öğrenme Planı (Adım Adım Yol Haritası) 🎯
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {learningPlan.levelTitle}
              </h2>
            </div>

            {/* Rozetler */}
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-amber-300">
                {learningPlan.targetLang === 'de' ? '🇩🇪 Almanca' : '🇬🇧 İngilizce'}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-indigo-200">
                {learningPlan.ageGroup === 'kids'
                  ? '🧒 5-11 Yaş (Çocuk)'
                  : learningPlan.ageGroup === 'teens'
                  ? '🎒 12-17 Yaş (Genç)'
                  : '💼 18+ Yaş (Yetişkin)'}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                ⭐ {learningPlan.earnedXp} / {learningPlan.totalXpReward} XP
              </span>
            </div>
          </div>

          {/* İlerleme Çubuğu */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
              <span>Yol Haritası Tamamlanma Oranı:</span>
              <span className="text-amber-300 font-black">
                %{learningPlan.progressPercent} ({learningPlan.completedCount} / {learningPlan.steps.length} İstasyon)
              </span>
            </div>
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(4, learningPlan.progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Adım İstasyon Kartları */}
          <div className="space-y-2.5 pt-1">
            {learningPlan.steps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  step.completed
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                    : 'bg-white/10 border-white/15 hover:bg-white/15 text-white'
                }`}
              >
                {/* Sol: İstasyon Bilgisi */}
                <div className="flex items-start space-x-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handleStepCompleteToggle(step)}
                    className="mt-0.5 cursor-pointer shrink-0 text-slate-300 hover:text-white transition"
                    title={step.completed ? 'Görevi Tekrar Aç' : 'Tamamlandı Olarak İşaretle'}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <div className="w-5 h-5 rounded-lg border-2 border-slate-400 hover:border-amber-400 flex items-center justify-center font-black text-[10px]">
                        {idx + 1}
                      </div>
                    )}
                  </button>

                  <div className="min-w-0 space-y-0.5 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/30 border border-indigo-400/30 text-indigo-200">
                        {step.badge}
                      </span>
                      <h3
                        className={`text-xs sm:text-sm font-black ${
                          step.completed ? 'line-through text-slate-300' : 'text-white'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-200/90 leading-relaxed">
                      {step.description}
                    </p>
                    <p className="text-[11px] text-amber-300/90 italic pt-0.5">
                      💡 {step.whyForYou}
                    </p>
                  </div>
                </div>

                {/* Sağ: Süre, XP ve Git Butonu */}
                <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-[11px] text-slate-300 font-medium">⏱️ {step.timeEstimate}</span>
                    <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                      +{step.xpReward} XP
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartStepAction(step)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 font-black text-xs transition-all shadow-xs flex items-center space-x-1 cursor-pointer active:scale-95"
                    >
                      <span>{step.actionText}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStepCompleteToggle(step)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        step.completed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/15 hover:bg-white/25 text-slate-200'
                      }`}
                      title={step.completed ? 'Geri al' : 'Tamamladım'}
                    >
                      {step.completed ? 'Tamamlandı ✅' : 'Bitirdim'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================== 2. KİŞİSEL ÖĞRENME KARNESİ & GELİŞİM RAPORU ==================== */}
        {(() => {
          const report = AnalyticsService.generateWeeklyReport();
          return (
            <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 min-w-0">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-black tracking-wider uppercase text-slate-700 dark:text-slate-200">
                    Haftalık Kişisel Gelişim Karnesi 📊
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                  Canlı İlerleme Verisi
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 min-w-0">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 truncate">Öğrenilen Kelime</div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 truncate">{report.totalWords} Kelime</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 truncate">Konuşma Süresi</div>
                  <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">{report.speakingMins} Dakika</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 truncate">Tamamlanan İstasyon</div>
                  <div className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5 truncate">{learningPlan.completedCount} Adım</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 truncate">Hafıza Kalıcılığı</div>
                  <div className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5 truncate">%88 (SM-2)</div>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs leading-relaxed space-y-1 min-w-0">
                <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5">
                  <span>🤖</span>
                  <span>Chirmo Koçluk Tavsiyesi:</span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 break-words">{report.feedbackMessage}</div>
                <div className="text-indigo-800 dark:text-indigo-200 font-semibold pt-0.5 break-words">
                  🎯 Öneri: {report.focusSuggestion}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ==================== 3. GÜNLÜK ÖZEL GÖREVLERİM & ODAKLANMA SAYACI ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-w-0">
          {/* Sol Kolon: Serbest Görev Listesi (7 Kolon) */}
          <div className="lg:col-span-7 space-y-4 min-w-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <ListTodo className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  <span>Günlük Özel Görevlerim</span>
                </h2>

                {/* Filtre Düğmeleri */}
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      filter === 'all'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Tümü ({tasks.length})
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      filter === 'pending'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Kalan ({pendingCount})
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-2 py-1 rounded-lg font-bold transition-all ${
                      filter === 'completed'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Bitenler ({completedCount})
                  </button>
                </div>
              </div>

              {/* Yeni Görev Ekleme Kutusu */}
              <form onSubmit={handleAddTask} className="flex items-center space-x-2 min-w-0">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Yeni bir görev ekle (örn: 10 yeni kelime tekrarı)..."
                  className="flex-1 min-w-0 px-3.5 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newTaskInput.trim()}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-black text-xs transition-all shadow-sm flex items-center space-x-1 shrink-0 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:inline">Göreve Ekle</span>
                </button>
              </form>

              {/* Görev Listesi */}
              <div className="space-y-2 min-w-0">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 space-y-2">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500/50" />
                    <p className="text-xs">Bu filtrede gösterilecek görev bulunmuyor.</p>
                  </div>
                ) : (
                  filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 min-w-0 ${
                        t.completed
                          ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/50 text-slate-400'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-indigo-200 shadow-2xs'
                      }`}
                    >
                      <button
                        onClick={() => handleToggleTask(t.id)}
                        className="flex items-center space-x-3 text-left flex-1 min-w-0 cursor-pointer"
                      >
                        {t.completed ? (
                          <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 hover:text-indigo-600" />
                        )}
                        <span className={`text-xs font-bold truncate ${t.completed ? 'line-through text-slate-400' : ''}`}>
                          {t.title}
                        </span>
                      </button>

                      <button
                        onClick={() => handleDeleteTask(t.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Görevi Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Odaklanma Sayacı (Pomodoro) & Not Defteri (5 Kolon) */}
          <div className="lg:col-span-5 space-y-4 min-w-0">
            {/* 25 Dakika Odak Sayacı (Pomodoro) */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4 relative overflow-hidden min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-200 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>25 Dk Odak Sayacı</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">
                  +50 XP Ödül
                </span>
              </div>

              {/* Süre Ekranı */}
              <div className="text-center py-2">
                <div className="text-4xl sm:text-5xl font-black tracking-tight font-mono">
                  {formatTimer(timeLeft)}
                </div>
                <div className="text-[11px] text-indigo-200 mt-1">
                  {isTimerRunning ? '🔥 Odaklanma Seansı Sürüyor...' : 'Hazır olduğunda başlat ve bölünmeden çalış.'}
                </div>
              </div>

              {/* Sayaç Düğmeleri */}
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md flex items-center space-x-2 cursor-pointer active:scale-95 ${
                    isTimerRunning
                      ? 'bg-amber-400 text-purple-950 hover:bg-amber-300'
                      : 'bg-white text-indigo-900 hover:bg-slate-100'
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Duraklat</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Odaklanmayı Başlat</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(1500);
                  }}
                  className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                  title="Sayacı Sıfırla"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hızlı Not Defteri */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 min-w-0">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                    Öğrenme & Çalışma Notlarım
                  </span>
                </div>
                {noteSaved && (
                  <span className="text-[10px] text-emerald-600 font-bold animate-fade-in">
                    Kaydedildi ✓
                  </span>
                )}
              </div>

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Önemli kalıpları, kelimeleri ve notlarını buraya karala..."
                rows={4}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  Notu Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SimpleTaskWorkspace;
