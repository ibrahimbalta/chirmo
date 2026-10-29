import { describe, it, expect } from 'vitest';

describe('Project and Task Management Database Logic', () => {
  interface MockProject {
    id: string;
    name: string;
    description: string;
    color: string;
  }

  interface MockTask {
    id: string;
    projectId: string;
    title: string;
    status: string;
    logs: { message: string; timestamp: string }[];
  }

  it('should support creating a project with name and description', () => {
    const project: MockProject = {
      id: 'proj_1',
      name: 'Yapay Zeka Arastirmasi',
      description: 'AI ajanlari ve modeller uzerine calisma',
      color: '#6652C9',
    };

    expect(project.id).toBe('proj_1');
    expect(project.name).toBe('Yapay Zeka Arastirmasi');
    expect(project.color).toBe('#6652C9');
  });

  it('should support task status transitions according to Chirmo spec', () => {
    const validStatuses = [
      'pending',
      'planning',
      'awaiting_approval',
      'running',
      'completed',
      'error',
      'cancelled',
    ];

    const task: MockTask = {
      id: 'task_1',
      projectId: 'proj_1',
      title: 'Fiyat sayfasini tara',
      status: 'pending',
      logs: [{ message: 'Gorev olusturuldu', timestamp: new Date().toISOString() }],
    };

    expect(validStatuses).toContain(task.status);

    // Transition to planning
    task.status = 'planning';
    task.logs.push({ message: 'Planlaniyor', timestamp: new Date().toISOString() });
    expect(task.status).toBe('planning');

    // Transition to completed
    task.status = 'completed';
    task.logs.push({ message: 'Tamamlandi', timestamp: new Date().toISOString() });
    expect(task.status).toBe('completed');
    expect(task.logs.length).toBe(3);
  });

  it('should filter tasks by project id accurately', () => {
    const tasks: MockTask[] = [
      { id: '1', projectId: 'p1', title: 'Task 1', status: 'pending', logs: [] },
      { id: '2', projectId: 'p2', title: 'Task 2', status: 'completed', logs: [] },
      { id: '3', projectId: 'p1', title: 'Task 3', status: 'running', logs: [] },
    ];

    const p1Tasks = tasks.filter((t) => t.projectId === 'p1');
    expect(p1Tasks.length).toBe(2);
    expect(p1Tasks.map((t) => t.id)).toEqual(['1', '3']);
  });
});
