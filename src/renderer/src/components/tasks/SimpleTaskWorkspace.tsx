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
  Target
} from 'lucide-react';
import { AnalyticsService } from '../../services/analyticsService';
import { LearningStorageService } from '../../services/learningStorage';

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

export const SimpleTaskWorkspace: React.FC = () => {
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
      <div className="p-3.5 sm:p-6 border-b border-indigo-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md min-w-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-[11px] font-black uppercase tracking-wider">
                Maceracı Görev Defteri & Seviye Karnesi 📜
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
              Günlük Macera Görevleri & Seviye Takibi
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Görevleri tamamla, XP puanı topla ve odak sayacıyla çalışma süreni katla!
            </p>
          </div>

          {/* Oyuncu Durum Hapı */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-2xl text-xs font-black text-amber-800 dark:text-amber-300 flex items-center space-x-1.5 shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{completedCount} / {tasks.length} Görev Bitti</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-2xl text-xs font-black text-emerald-800 dark:text-emerald-300 shadow-2xs">
              <span>{pendingCount > 0 ? `Kalan: ${pendingCount}` : 'Tüm Görevler Bitti! 🏆'}</span>
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

      <div className="max-w-5xl mx-auto w-full p-3 sm:p-6 space-y-4 sm:space-y-6 min-w-0">
        {/* ==================== KİŞİSEL ÖĞRENME KARNESİ & GELİŞİM RAPORU ==================== */}
        {(() => {
          const report = AnalyticsService.generateWeeklyReport();
          return (
            <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl space-y-4 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 min-w-0">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span className="text-xs font-black tracking-wider uppercase text-indigo-300">
                    Haftalık Kişisel Gelişim Karnesi
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 self-start sm:self-auto">
                  Canlı İlerleme Verisi
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 min-w-0">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 truncate">Öğrenilen Kelime</div>
                  <div className="text-lg sm:text-xl font-black text-white mt-0.5 truncate">{report.totalWords} Kelime</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 truncate">Konuşma Süresi</div>
                  <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5 truncate">{report.speakingMins} Dakika</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 truncate">Tamamlanan Ders</div>
                  <div className="text-lg sm:text-xl font-black text-amber-300 mt-0.5 truncate">{report.lessons} Ders</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center min-w-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400 truncate">Hafıza Kalıcılığı</div>
                  <div className="text-lg sm:text-xl font-black text-purple-300 mt-0.5 truncate">%88 (SM-2)</div>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 text-xs leading-relaxed space-y-1 min-w-0">
                <div className="font-bold text-indigo-200 flex items-center space-x-1.5">
                  <span>🤖</span>
                  <span>Chirmo Haftalık Koçluk Değerlendirmesi:</span>
                </div>
                <div className="text-slate-200 break-words">{report.feedbackMessage}</div>
                <div className="text-emerald-300 font-semibold pt-1 break-words">
                  🎯 Öneri: {report.focusSuggestion}
                </div>
              </div>
            </div>
          );
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-w-0">
          {/* Sol Kolon: Yapılacaklar Listesi (7 Kolon) */}
          <div className="lg:col-span-7 space-y-4 min-w-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <ListTodo className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  <span>Günlük Macera Görevleri</span>
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
              {filteredTasks.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Bu filtrede henüz bir görev bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-2 min-w-0">
                  {filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between space-x-3 min-w-0 ${
                        t.completed
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800 text-slate-400'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs hover:border-indigo-300'
                      }`}
                    >
                      <button
                        onClick={() => handleToggleTask(t.id)}
                        className="flex items-center space-x-2.5 sm:space-x-3 text-left flex-1 min-w-0 cursor-pointer"
                      >
                        {t.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 shrink-0 hover:text-indigo-600" />
                        )}
                        <span
                          className={`text-xs font-semibold break-words flex-1 min-w-0 ${
                            t.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {t.title}
                        </span>
                      </button>

                      <div className="flex items-center space-x-1 shrink-0">
                        {t.completed && (
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            +25 XP ✓
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kolon: Odaklanma Sayacı & Hızlı Not Defteri (5 Kolon) */}
          <div className="lg:col-span-5 space-y-4 min-w-0">
            {/* 25 Dakikalık Odak Sayacı (Pomodoro) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5 text-center min-w-0">
              <div className="flex items-center justify-center space-x-2 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Odaklanma Seansı (25 Dk = +50 XP)</span>
              </div>

              <div className="text-4xl font-black text-slate-900 dark:text-white tracking-widest font-mono py-1">
                {formatTimer(timeLeft)}
              </div>

              <div className="flex items-center justify-center space-x-2.5 pt-1">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer active:scale-95 ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Duraklat' : 'Seansı Başlat'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(1500);
                  }}
                  className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hızlı Not Defteri */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>Maceracı Not Defterim 📜</span>
                </h3>
                {noteSaved && (
                  <span className="text-[10px] text-emerald-600 font-bold">Kaydedildi! ✓</span>
                )}
              </div>

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={5}
                placeholder="Önemli iş notlarınızı buraya alın..."
                className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed select-text box-border"
              />

              <button
                onClick={handleSaveNote}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl transition-colors cursor-pointer active:scale-95"
              >
                Notu Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTaskWorkspace;
