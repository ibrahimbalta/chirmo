import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Play, 
  XCircle, 
  HelpCircle, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Link2
} from 'lucide-react';
import { Project, Task, TaskStatus, Tab } from '../../types';

interface TaskSidebarProps {
  currentTab: Tab | null;
  onClose: () => void;
}

export const TaskSidebar: React.FC<TaskSidebarProps> = ({ currentTab, onClose }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  useEffect(() => {
    loadProjectsAndTasks();
  }, []);

  const loadProjectsAndTasks = async () => {
    if (window.chirmo) {
      const projs = await window.chirmo.getProjects();
      setProjects(projs);
      const activeId = (await window.chirmo.getActiveProjectId()) || projs[0]?.id || null;
      setActiveProjectId(activeId);
      if (activeId) {
        const t = await window.chirmo.getTasks(activeId);
        setTasks(t);
      }
    }
  };

  const handleSelectProject = async (id: string) => {
    setActiveProjectId(id);
    if (window.chirmo) {
      await window.chirmo.setActiveProjectId(id);
      const t = await window.chirmo.getTasks(id);
      setTasks(t);
    }
  };

  const handleQuickAddCurrentPage = () => {
    if (currentTab) {
      setTaskTitle(`İncele: ${currentTab.title || 'Web Sayfası'}`);
      setTaskDesc(`Sayfa URL'si: ${currentTab.url}`);
      setShowQuickAdd(true);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !activeProjectId || !window.chirmo) return;

    await window.chirmo.createTask({
      projectId: activeProjectId,
      title: taskTitle,
      description: taskDesc,
      targetUrl: currentTab?.url,
      status: 'pending',
    });

    setTaskTitle('');
    setTaskDesc('');
    setShowQuickAdd(false);
    const updated = await window.chirmo.getTasks(activeProjectId);
    setTasks(updated);
  };

  const handleStatusToggle = async (taskId: string, currentStatus: TaskStatus) => {
    if (!window.chirmo) return;
    const nextStatus: TaskStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await window.chirmo.updateTask(taskId, { status: nextStatus });
    if (activeProjectId) {
      const updated = await window.chirmo.getTasks(activeProjectId);
      setTasks(updated);
    }
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="w-80 h-full border-l border-chirmo-border bg-chirmo-bg flex flex-col justify-between shadow-lg z-20 select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div>
        <div className="p-3.5 border-b border-chirmo-border flex items-center justify-between bg-chirmo-secondary/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-chirmo-brand" />
            <h3 className="text-xs font-bold text-chirmo-text">Görev & Çalışma Alanı</h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-chirmo-text-muted hover:text-chirmo-text p-1"
          >
            ✕
          </button>
        </div>

        {/* Project Selector */}
        <div className="p-3 border-b border-chirmo-border">
          <label className="text-[10px] uppercase font-semibold text-chirmo-text-muted block mb-1">
            Aktif Proje
          </label>
          <select
            value={activeProjectId || ''}
            onChange={(e) => handleSelectProject(e.target.value)}
            className="w-full text-xs bg-chirmo-secondary border border-chirmo-border rounded-lg px-2.5 py-1.5 text-chirmo-text focus:outline-none focus:border-chirmo-brand font-medium"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action: Link Current Page */}
        <div className="p-3 border-b border-chirmo-border bg-chirmo-brand-light/30">
          <button
            onClick={handleQuickAddCurrentPage}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-medium rounded-lg shadow-xs transition-all"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Mevcut Sayfayı Göreve Ekle</span>
          </button>
        </div>

        {/* Quick Add Form */}
        {showQuickAdd && (
          <form onSubmit={handleCreateTask} className="p-3 border-b border-chirmo-border bg-chirmo-secondary/30 space-y-2">
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Görev başlığı..."
              className="w-full px-2.5 py-1 text-xs bg-chirmo-bg border border-chirmo-border rounded-md text-chirmo-text focus:outline-none focus:border-chirmo-brand"
            />
            <textarea
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="Görev notu..."
              rows={2}
              className="w-full px-2.5 py-1 text-xs bg-chirmo-bg border border-chirmo-border rounded-md text-chirmo-text focus:outline-none focus:border-chirmo-brand resize-none"
            />
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setShowQuickAdd(false)}
                className="px-2 py-0.5 text-[11px] text-chirmo-text-muted hover:text-chirmo-text"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] bg-chirmo-brand text-white rounded-md font-medium"
              >
                Kaydet
              </button>
            </div>
          </form>
        )}

        {/* Tasks List */}
        <div className="p-3 overflow-y-auto max-h-[calc(100vh-250px)] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-chirmo-text-secondary font-medium">
            <span>Proje Görevleri ({tasks.length})</span>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8 text-chirmo-text-muted text-xs">
              Bu projede henüz görev yok.
            </div>
          ) : (
            tasks.map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    isCompleted
                      ? 'bg-gray-50/60 border-chirmo-border/60 text-gray-500'
                      : 'bg-chirmo-bg border-chirmo-border text-chirmo-text shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => handleStatusToggle(task.id, task.status)}
                      className="mt-0.5 text-chirmo-text-muted hover:text-chirmo-brand"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-chirmo-success" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded border border-chirmo-border hover:border-chirmo-brand" />
                      )}
                    </button>

                    <div className="flex-1">
                      <p className={`font-medium ${isCompleted ? 'line-through text-chirmo-text-muted' : ''}`}>
                        {task.title}
                      </p>
                      {task.targetUrl && (
                        <span className="text-[10px] text-chirmo-brand truncate block mt-0.5 font-mono">
                          {task.targetUrl}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-chirmo-border text-[11px] text-chirmo-text-secondary bg-chirmo-secondary/30">
        <span>Tüm görevleri yönetmek için sol menüden </span>
        <span className="font-semibold text-chirmo-brand">Projeler</span>
        <span> sekmesine geçebilirsiniz.</span>
      </div>
    </div>
  );
};
