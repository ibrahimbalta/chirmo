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
  ListTodo
} from 'lucide-react';

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
      { id: '1', title: 'Bugün 15 dakika İngilizce haber oku', completed: false, createdAt: new Date().toISOString() },
      { id: '2', title: 'Haftalık proje raporunu hazırla', completed: false, createdAt: new Date().toISOString() },
      { id: '3', title: 'Chirmo kelime defterindeki 5 kelimeyi tekrar et', completed: true, createdAt: new Date().toISOString() }
    ];
  });

  const [newTaskInput, setNewTaskInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

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
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
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

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto select-none">
      {/* Başlık Alanı */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <CheckSquare className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">İş & Çalışma Yönetimi</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              İş Takibi & Günlük Plan
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Günlük yapılacak işlerinizi, hedeflerinizi ve çalışma notlarınızı kolayca yönetin.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <span>{pendingCount > 0 ? `Kalan: ${pendingCount} İş` : 'Tüm İşler Bitti! 🎉'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon: Yapılacaklar Listesi (2 Birim) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <ListTodo className="w-5 h-5 text-blue-600" />
                  <span>Yapılacaklar Listesi</span>
                </h2>

                {/* Filtre Düğmeleri */}
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      filter === 'all'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Tümü ({tasks.length})
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      filter === 'pending'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Yapılacak ({pendingCount})
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      filter === 'completed'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Bitenler
                  </button>
                </div>
              </div>

              {/* Yeni Görev Ekleme Kutusu */}
              <form onSubmit={handleAddTask} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="Yeni bir iş veya görev yazın (örn: 3 yeni kelime ezberle)..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newTaskInput.trim()}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-sm flex items-center space-x-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ekle</span>
                </button>
              </form>

              {/* Görev Listesi */}
              {filteredTasks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Bu filtrede henüz bir görev bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between space-x-3 ${
                        t.completed
                          ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 text-slate-400'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                      }`}
                    >
                      <button
                        onClick={() => handleToggleTask(t.id)}
                        className="flex items-center space-x-3 text-left flex-1 cursor-pointer"
                      >
                        {t.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            t.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {t.title}
                        </span>
                      </button>

                      <button
                        onClick={() => handleDeleteTask(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kolon: Odaklanma Sayacı & Hızlı Not Defteri */}
          <div className="space-y-4">
            {/* 25 Dakikalık Odak Sayacı (Pomodoro) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Odaklanma Sayacı</span>
              </div>

              <div className="text-4xl font-black text-slate-900 dark:text-white tracking-widest font-mono">
                {formatTimer(timeLeft)}
              </div>

              <div className="flex items-center justify-center space-x-3 pt-1">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Duraklat' : 'Başlat'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(1500);
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hızlı Not Defteri */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>Çalışma Notlarım</span>
                </h3>
                {noteSaved && (
                  <span className="text-[10px] text-emerald-600 font-bold">Kaydedildi!</span>
                )}
              </div>

              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={6}
                placeholder="Önemli iş notlarınızı buraya alın..."
                className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed select-text"
              />

              <button
                onClick={handleSaveNote}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
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
