import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export type TaskStatus = 
  | 'pending'
  | 'planning'
  | 'awaiting_approval'
  | 'running'
  | 'completed'
  | 'error'
  | 'cancelled';

export interface TaskLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  targetUrl?: string;
  result?: string;
  error?: string;
  logs: TaskLog[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  taskId?: string;
  projectId?: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'project' | 'task' | 'navigation' | 'system';
}

interface DatabaseSchema {
  projects: Project[];
  tasks: Task[];
  history: HistoryEntry[];
  activeProjectId: string | null;
}

const DEFAULT_DB: DatabaseSchema = {
  projects: [
    {
      id: 'proj_default',
      name: 'Genel Araştırma',
      description: 'Varsayılan web araştırmaları ve genel görevler',
      color: '#6652C9',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tasks: [],
  history: [],
  activeProjectId: 'proj_default',
};

export class WorkspaceDatabase {
  private filePath: string;
  private data: DatabaseSchema;

  constructor() {
    const userData = app.getPath('userData');
    this.filePath = path.join(userData, 'chirmo-workspace.json');
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          projects: parsed.projects || DEFAULT_DB.projects,
          tasks: parsed.tasks || [],
          history: parsed.history || [],
          activeProjectId: parsed.activeProjectId || 'proj_default',
        };
      }
    } catch (err) {
      console.warn('[WorkspaceDatabase] Failed to load workspace data, initializing defaults', err);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DB));
  }

  private persist(): void {
    try {
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error('[WorkspaceDatabase] Error saving workspace database:', err);
    }
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    return [...this.data.projects];
  }

  public getProject(id: string): Project | undefined {
    return this.data.projects.find((p) => p.id === id);
  }

  public createProject(name: string, description: string, color = '#6652C9'): Project {
    const newProject: Project = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      description: description.trim(),
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.projects.push(newProject);
    this.addHistory({
      action: 'Proje Oluşturuldu',
      details: `"${newProject.name}" projesi başarıyla oluşturuldu.`,
      projectId: newProject.id,
      type: 'project',
    });
    this.persist();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'color'>>): Project | null {
    const proj = this.data.projects.find((p) => p.id === id);
    if (!proj) return null;

    if (updates.name !== undefined) proj.name = updates.name.trim();
    if (updates.description !== undefined) proj.description = updates.description.trim();
    if (updates.color !== undefined) proj.color = updates.color;
    proj.updatedAt = new Date().toISOString();

    this.addHistory({
      action: 'Proje Güncellendi',
      details: `"${proj.name}" projesinin bilgileri güncellendi.`,
      projectId: proj.id,
      type: 'project',
    });
    this.persist();
    return proj;
  }

  public deleteProject(id: string): boolean {
    const index = this.data.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;

    const [deleted] = this.data.projects.splice(index, 1);
    // Also remove associated tasks
    this.data.tasks = this.data.tasks.filter((t) => t.projectId !== id);

    if (this.data.activeProjectId === id) {
      this.data.activeProjectId = this.data.projects[0]?.id || null;
    }

    this.addHistory({
      action: 'Proje Silindi',
      details: `"${deleted.name}" projesi ve tüm bağlı görevleri silindi.`,
      projectId: id,
      type: 'project',
    });
    this.persist();
    return true;
  }

  public getActiveProjectId(): string | null {
    return this.data.activeProjectId;
  }

  public setActiveProjectId(id: string | null): void {
    this.data.activeProjectId = id;
    this.persist();
  }

  // --- TASKS ---
  public getTasks(projectId?: string): Task[] {
    if (projectId) {
      return this.data.tasks.filter((t) => t.projectId === projectId);
    }
    return [...this.data.tasks];
  }

  public getTask(id: string): Task | undefined {
    return this.data.tasks.find((t) => t.id === id);
  }

  public createTask(data: {
    projectId: string;
    title: string;
    description?: string;
    targetUrl?: string;
    status?: TaskStatus;
  }): Task {
    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId: data.projectId,
      title: data.title.trim(),
      description: (data.description || '').trim(),
      status: data.status || 'pending',
      targetUrl: data.targetUrl?.trim(),
      logs: [
        {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          message: 'Görev oluşturuldu.',
          type: 'info',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.tasks.push(newTask);
    this.addHistory({
      action: 'Görev Eklendi',
      details: `"${newTask.title}" görevi eklendi (Durum: ${newTask.status}).`,
      taskId: newTask.id,
      projectId: newTask.projectId,
      type: 'task',
    });
    this.persist();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'logs'>>): Task | null {
    const task = this.data.tasks.find((t) => t.id === id);
    if (!task) return null;

    if (updates.title !== undefined) task.title = updates.title.trim();
    if (updates.description !== undefined) task.description = updates.description.trim();
    if (updates.status !== undefined && task.status !== updates.status) {
      const oldStatus = task.status;
      task.status = updates.status;
      task.logs.push({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `Durum güncellendi: ${oldStatus} -> ${updates.status}`,
        type: updates.status === 'error' ? 'error' : updates.status === 'completed' ? 'success' : 'info',
      });
    }
    if (updates.targetUrl !== undefined) task.targetUrl = updates.targetUrl;
    if (updates.result !== undefined) task.result = updates.result;
    if (updates.error !== undefined) task.error = updates.error;

    task.updatedAt = new Date().toISOString();

    this.persist();
    return task;
  }

  public cancelTask(id: string): Task | null {
    return this.updateTask(id, { status: 'cancelled' });
  }

  public deleteTask(id: string): boolean {
    const index = this.data.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    const [deleted] = this.data.tasks.splice(index, 1);
    this.addHistory({
      action: 'Görev Silindi',
      details: `"${deleted.title}" görevi silindi.`,
      taskId: id,
      projectId: deleted.projectId,
      type: 'task',
    });
    this.persist();
    return true;
  }

  public addTaskLog(taskId: string, message: string, type: 'info' | 'warn' | 'error' | 'success' = 'info'): TaskLog | null {
    const task = this.data.tasks.find((t) => t.id === taskId);
    if (!task) return null;

    const logEntry: TaskLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      message,
      type,
    };
    task.logs.push(logEntry);
    task.updatedAt = new Date().toISOString();
    this.persist();
    return logEntry;
  }

  // --- HISTORY ---
  public getHistory(): HistoryEntry[] {
    return [...this.data.history].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): HistoryEntry {
    const newEntry: HistoryEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    // Keep max 500 history records
    this.data.history.unshift(newEntry);
    if (this.data.history.length > 500) {
      this.data.history = this.data.history.slice(0, 500);
    }
    this.persist();
    return newEntry;
  }
}
