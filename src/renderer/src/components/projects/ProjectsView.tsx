import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Play, 
  XCircle, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  FileText,
  ListTodo,
  Sparkles
} from 'lucide-react';
import { Project, Task, TaskStatus } from '../../types';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals & Forms
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#6652C9');

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskUrl, setNewTaskUrl] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('pending');

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    if (window.chirmo) {
      const projs = await window.chirmo.getProjects();
      setProjects(projs);
      if (projs.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projs[0].id);
        loadTasks(projs[0].id);
      } else if (selectedProjectId) {
        loadTasks(selectedProjectId);
      }
    }
  };

  const loadTasks = async (projectId: string) => {
    if (window.chirmo) {
      const t = await window.chirmo.getTasks(projectId);
      setTasks(t);
    }
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    loadTasks(id);
    setSelectedTask(null);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !window.chirmo) return;

    const created = await window.chirmo.createProject(
      newProjectName,
      newProjectDesc,
      newProjectColor
    );
    setShowNewProjectModal(false);
    setNewProjectName('');
    setNewProjectDesc('');
    await loadProjects();
    handleSelectProject(created.id);
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.chirmo || !confirm('Bu projeyi ve tüm bağlı görevleri silmek istediğinizden emin misiniz?')) return;
    await window.chirmo.deleteProject(id);
    setSelectedProjectId(null);
    await loadProjects();
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProjectId || !window.chirmo) return;

    await window.chirmo.createTask({
      projectId: selectedProjectId,
      title: newTaskTitle,
      description: newTaskDesc,
      targetUrl: newTaskUrl,
      status: newTaskStatus,
    });

    setShowNewTaskModal(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskUrl('');
    setNewTaskStatus('pending');
    loadTasks(selectedProjectId);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    if (!window.chirmo) return;
    await window.chirmo.updateTask(taskId, { status: newStatus });
    if (selectedProjectId) {
      loadTasks(selectedProjectId);
    }
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.chirmo) return;
    await window.chirmo.deleteTask(taskId);
    if (selectedProjectId) {
      loadTasks(selectedProjectId);
    }
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" /> Bekliyor
          </span>
        );
      case 'planning':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
            <Sparkles className="w-3 h-3" /> Planlanıyor
          </span>
        );
      case 'awaiting_approval':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
            <HelpCircle className="w-3 h-3" /> Onay Bekliyor
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
            <Play className="w-3 h-3 fill-current animate-pulse" /> Çalışıyor
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" /> Tamamlandı
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md">
            <AlertCircle className="w-3 h-3" /> Hata Oluştu
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium bg-gray-100 text-gray-500 line-through px-2 py-0.5 rounded-md">
            <XCircle className="w-3 h-3" /> İptal Edildi
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden bg-chirmo-secondary select-none pb-16 md:pb-0">
      {/* Left Column: Projects List */}
      <div className="w-full md:w-80 max-h-56 md:max-h-none border-b md:border-b-0 md:border-r border-chirmo-border bg-chirmo-bg flex flex-col justify-between shrink-0">
        <div className="p-4 border-b border-chirmo-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-chirmo-brand" />
            <h1 className="font-bold text-sm text-chirmo-text">Projeler</h1>
            <span className="text-xs bg-chirmo-secondary text-chirmo-text-secondary px-1.5 py-0.5 rounded font-mono">
              {projects.length}
            </span>
          </div>

          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-medium rounded-lg shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Proje</span>
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {projects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <div
                key={proj.id}
                onClick={() => handleSelectProject(proj.id)}
                className={`group p-3 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-chirmo-brand-light/50 border-chirmo-brand/40 shadow-xs'
                    : 'bg-chirmo-bg hover:bg-chirmo-secondary border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: proj.color || '#6652C9' }}
                    />
                    <h3 className={`text-xs font-semibold ${isSelected ? 'text-chirmo-brand' : 'text-chirmo-text'}`}>
                      {proj.name}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(proj.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-chirmo-text-muted hover:text-chirmo-error transition-all"
                    title="Projeyi Sil"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[11px] text-chirmo-text-secondary mt-1 line-clamp-2 leading-relaxed">
                  {proj.description || 'Açıklama belirtilmemiş.'}
                </p>

                <div className="mt-2 text-[10px] text-chirmo-text-muted flex items-center justify-between">
                  <span>{new Date(proj.createdAt).toLocaleDateString('tr-TR')}</span>
                  {isSelected && (
                    <span className="text-chirmo-brand font-medium flex items-center gap-0.5">
                      Seçildi <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Column: Project Tasks Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden bg-chirmo-bg border-r border-chirmo-border">
        {selectedProject ? (
          <>
            {/* Project Header */}
            <div className="p-5 border-b border-chirmo-border flex items-center justify-between bg-chirmo-bg">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedProject.color }}
                  />
                  <h2 className="text-base font-bold text-chirmo-text">{selectedProject.name}</h2>
                </div>
                <p className="text-xs text-chirmo-text-secondary mt-1">
                  {selectedProject.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewTaskModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-medium rounded-lg shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Görev Ekle</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 py-2.5 border-b border-chirmo-border bg-chirmo-secondary/60 flex items-center gap-1 overflow-x-auto text-xs">
              <span className="text-[11px] text-chirmo-text-secondary mr-2 font-medium flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filtre:
              </span>
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'pending', label: 'Bekleyen' },
                { id: 'running', label: 'Çalışan' },
                { id: 'awaiting_approval', label: 'Onay Bekleyen' },
                { id: 'completed', label: 'Tamamlanan' },
                { id: 'error', label: 'Hatalı' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    statusFilter === f.id
                      ? 'bg-chirmo-bg text-chirmo-brand border border-chirmo-border shadow-xs'
                      : 'text-chirmo-text-secondary hover:text-chirmo-text'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-2">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-chirmo-text-secondary">
                  <ListTodo className="w-10 h-10 mx-auto text-chirmo-text-muted mb-2" />
                  <p className="text-xs font-medium">Bu filtrede henüz görev bulunmuyor.</p>
                  <button
                    onClick={() => setShowNewTaskModal(true)}
                    className="mt-3 text-xs text-chirmo-brand hover:underline font-medium"
                  >
                    + Hemen yeni bir görev ekleyin
                  </button>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isTaskActive = selectedTask?.id === task.id;
                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isTaskActive
                          ? 'border-chirmo-brand bg-chirmo-brand-light/30 shadow-xs'
                          : 'border-chirmo-border bg-chirmo-bg hover:border-chirmo-border/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-chirmo-text">
                              {task.title}
                            </h4>
                            {getStatusBadge(task.status)}
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-chirmo-text-secondary mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {task.targetUrl && (
                            <div className="flex items-center gap-1 text-[10px] text-chirmo-brand mt-2 font-mono">
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate max-w-sm">{task.targetUrl}</span>
                            </div>
                          )}
                        </div>

                        {/* Quick Status Select */}
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                            className="text-[11px] bg-chirmo-secondary border border-chirmo-border rounded-lg px-2 py-1 text-chirmo-text focus:outline-none focus:border-chirmo-brand"
                          >
                            <option value="pending">Bekliyor</option>
                            <option value="planning">Planlanıyor</option>
                            <option value="awaiting_approval">Onay Bekliyor</option>
                            <option value="running">Çalışıyor</option>
                            <option value="completed">Tamamlandı</option>
                            <option value="error">Hata</option>
                            <option value="cancelled">İptal</option>
                          </select>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-chirmo-text-muted hover:text-chirmo-error transition-colors"
                            title="Görevi Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-chirmo-text-secondary">
            <FolderKanban className="w-12 h-12 text-chirmo-text-muted mb-3" />
            <p className="text-sm font-semibold text-chirmo-text">Lütfen Bir Proje Seçin</p>
            <p className="text-xs text-chirmo-text-secondary mt-1">
              Görevleri görmek veya yönetmek için sol listeden bir proje seçin ya da yeni oluşturun.
            </p>
          </div>
        )}
      </div>

      {/* Right Column: Task Detail & Logs Panel */}
      {selectedTask && (
        <div className="w-88 border-l border-chirmo-border bg-chirmo-secondary/40 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-chirmo-border bg-chirmo-bg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-chirmo-brand" />
              <h3 className="text-xs font-bold text-chirmo-text">Görev Detayları & Kayıtlar</h3>
            </div>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-xs text-chirmo-text-muted hover:text-chirmo-text"
            >
              Kapat ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block">
                Başlık
              </span>
              <p className="text-xs font-semibold text-chirmo-text mt-0.5">{selectedTask.title}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block">
                Durum
              </span>
              <div className="mt-1">{getStatusBadge(selectedTask.status)}</div>
            </div>

            {selectedTask.targetUrl && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block">
                  İlgili Web Adresi
                </span>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.chirmo) window.chirmo.createTab(selectedTask.targetUrl);
                  }}
                  className="text-xs text-chirmo-brand hover:underline font-mono break-all mt-0.5 block"
                >
                  {selectedTask.targetUrl}
                </a>
              </div>
            )}

            {selectedTask.result && (
              <div className="p-3 bg-chirmo-success/10 border border-chirmo-success/20 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-chirmo-success block">
                  Sonuç Raporu
                </span>
                <p className="text-xs text-chirmo-text mt-1 whitespace-pre-wrap">
                  {selectedTask.result}
                </p>
              </div>
            )}

            {selectedTask.error && (
              <div className="p-3 bg-chirmo-error/10 border border-chirmo-error/20 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-chirmo-error block">
                  Hata Detayı
                </span>
                <p className="text-xs text-chirmo-error mt-1">{selectedTask.error}</p>
              </div>
            )}

            {/* Logs Timeline */}
            <div>
              <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block mb-2">
                İşlem Günlüğü (Audit Log)
              </span>
              <div className="space-y-2 border-l border-chirmo-border ml-2 pl-3">
                {selectedTask.logs.map((log) => (
                  <div key={log.id} className="text-xs space-y-0.5">
                    <span className="text-[10px] text-chirmo-text-muted font-mono block">
                      {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                    </span>
                    <p className="text-[11px] text-chirmo-text leading-tight">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-chirmo-bg border border-chirmo-border rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-sm font-bold text-chirmo-text mb-1">Yeni Proje Oluştur</h2>
            <p className="text-xs text-chirmo-text-secondary mb-4">
              Araştırma görevlerinizi organize etmek için yeni bir çalışma projesi tanımlayın.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Proje Adı *
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Örn: Rakip Analizi 2026"
                  className="w-full px-3 py-1.5 bg-chirmo-secondary border border-chirmo-border rounded-lg text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Açıklama
                </label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Projenin amacı ve kapsamı..."
                  rows={3}
                  className="w-full px-3 py-1.5 bg-chirmo-secondary border border-chirmo-border rounded-lg text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Tema Rengi
                </label>
                <div className="flex items-center gap-2">
                  {['#6652C9', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setNewProjectColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        newProjectColor === c ? 'border-chirmo-text scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-3 py-1.5 border border-chirmo-border hover:bg-chirmo-secondary text-xs rounded-lg text-chirmo-text transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-medium rounded-lg shadow-xs transition-all"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-chirmo-bg border border-chirmo-border rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-sm font-bold text-chirmo-text mb-1">Yeni Görev Tanımla</h2>
            <p className="text-xs text-chirmo-text-secondary mb-4">
              "{selectedProject?.name}" projesine eklenecek görevi tanımlayın.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Görev Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Örn: Fiyatlandırma sayfasını incele ve özetle"
                  className="w-full px-3 py-1.5 bg-chirmo-secondary border border-chirmo-border rounded-lg text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Açıklama / Yönergeler
                </label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Görevin detayları veya yapılması gereken adımlar..."
                  rows={3}
                  className="w-full px-3 py-1.5 bg-chirmo-secondary border border-chirmo-border rounded-lg text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Hedef Web Adresi (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={newTaskUrl}
                  onChange={(e) => setNewTaskUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-1.5 bg-chirmo-secondary border border-chirmo-border rounded-lg text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Başlangıç Durumu
                </label>
                <select
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                  className="w-full px-3 py-1.5 bg-chirmo-secondary border border-chirmo-border rounded-lg text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand"
                >
                  <option value="pending">Bekliyor (pending)</option>
                  <option value="planning">Planlanıyor (planning)</option>
                  <option value="awaiting_approval">Onay Bekliyor (awaiting_approval)</option>
                  <option value="running">Çalışıyor (running)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3 py-1.5 border border-chirmo-border hover:bg-chirmo-secondary text-xs rounded-lg text-chirmo-text transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-medium rounded-lg shadow-xs transition-all"
                >
                  Görevi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
