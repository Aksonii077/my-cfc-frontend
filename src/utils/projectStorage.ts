
import { Project, Task, Milestone, TeamMember, ProjectTemplate, ProjectAnalytics, WorkloadAnalytics, TaskComment, ProjectBudget } from '@/types/project-management';
import { logger } from '@/utils/logger';

class ProjectStorage {
  private storagePrefix = 'cfc_project_';

  // Project Management
  async saveProject(project: Project): Promise<void> {
    try {
      const projects = await this.getProjects(project.companyId);
      const existingIndex = projects.findIndex(p => p.id === project.id);
      
      if (existingIndex >= 0) {
        projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
      } else {
        projects.push(project);
      }
      
      localStorage.setItem(`${this.storagePrefix}projects_${project.companyId}`, JSON.stringify(projects));
      logger.info('ProjectStorage: Project saved', { projectId: project.id, projectName: project.name });
    } catch (error) {
      logger.error('ProjectStorage: Error saving project', error);
      throw error;
    }
  }

  async getProjects(companyId: string): Promise<Project[]> {
    try {
      const stored = localStorage.getItem(`${this.storagePrefix}projects_${companyId}`);
      return stored ? JSON.parse(stored) : this.getMockProjects(companyId);
    } catch (error) {
      logger.error('ProjectStorage: Error loading projects', error);
      return this.getMockProjects(companyId);
    }
  }

  async getProject(projectId: string, companyId: string): Promise<Project | null> {
    const projects = await this.getProjects(companyId);
    return projects.find(p => p.id === projectId) || null;
  }

  async deleteProject(projectId: string, companyId: string): Promise<void> {
    try {
      const projects = await this.getProjects(companyId);
      const filteredProjects = projects.filter(p => p.id !== projectId);
      localStorage.setItem(`${this.storagePrefix}projects_${companyId}`, JSON.stringify(filteredProjects));
      
      // Also delete related tasks
      await this.deleteTasksByProject(projectId, companyId);
      logger.info('ProjectStorage: Project deleted', { projectId });
    } catch (error) {
      logger.error('ProjectStorage: Error deleting project', error);
      throw error;
    }
  }

  // Task Management
  async saveTask(task: Task): Promise<void> {
    try {
      const tasks = await this.getTasks(task.companyId);
      const existingIndex = tasks.findIndex(t => t.id === task.id);
      
      if (existingIndex >= 0) {
        tasks[existingIndex] = { ...task, updatedAt: new Date().toISOString() };
      } else {
        tasks.push(task);
      }
      
      localStorage.setItem(`${this.storagePrefix}tasks_${task.companyId}`, JSON.stringify(tasks));
      logger.info('ProjectStorage: Task saved', { taskId: task.id, taskTitle: task.title });
    } catch (error) {
      logger.error('ProjectStorage: Error saving task', error);
      throw error;
    }
  }

  async getTasks(companyId: string, projectId?: string): Promise<Task[]> {
    try {
      const stored = localStorage.getItem(`${this.storagePrefix}tasks_${companyId}`);
      let tasks = stored ? JSON.parse(stored) : this.getMockTasks(companyId);
      
      if (projectId) {
        tasks = tasks.filter((t: Task) => t.projectId === projectId);
      }
      
      return tasks;
    } catch (error) {
      logger.error('ProjectStorage: Error loading tasks', error);
      return this.getMockTasks(companyId);
    }
  }

  async getTask(taskId: string, companyId: string): Promise<Task | null> {
    const tasks = await this.getTasks(companyId);
    return tasks.find(t => t.id === taskId) || null;
  }

  async updateTaskStatus(taskId: string, companyId: string, status: Task['status']): Promise<void> {
    const task = await this.getTask(taskId, companyId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
      
      if (status === 'done') {
        task.completedAt = new Date().toISOString();
        task.progressPercentage = 100;
      }
      
      await this.saveTask(task);
    }
  }

  async deleteTask(taskId: string, companyId: string): Promise<void> {
    try {
      const tasks = await this.getTasks(companyId);
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      localStorage.setItem(`${this.storagePrefix}tasks_${companyId}`, JSON.stringify(filteredTasks));
      logger.info('ProjectStorage: Task deleted', { taskId });
    } catch (error) {
      logger.error('ProjectStorage: Error deleting task', error);
      throw error;
    }
  }

  async deleteTasksByProject(projectId: string, companyId: string): Promise<void> {
    try {
      const tasks = await this.getTasks(companyId);
      const filteredTasks = tasks.filter(t => t.projectId !== projectId);
      localStorage.setItem(`${this.storagePrefix}tasks_${companyId}`, JSON.stringify(filteredTasks));
    } catch (error) {
      logger.error('ProjectStorage: Error deleting project tasks', error);
    }
  }

  // Team Management
  async saveTeamMember(member: TeamMember, companyId: string): Promise<void> {
    try {
      const team = await this.getTeamMembers(companyId);
      const existingIndex = team.findIndex(m => m.id === member.id);
      
      if (existingIndex >= 0) {
        team[existingIndex] = member;
      } else {
        team.push(member);
      }
      
      localStorage.setItem(`${this.storagePrefix}team_${companyId}`, JSON.stringify(team));
      logger.info('ProjectStorage: Team member saved', { memberId: member.id, memberName: member.name });
    } catch (error) {
      logger.error('ProjectStorage: Error saving team member', error);
      throw error;
    }
  }

  async getTeamMembers(companyId: string): Promise<TeamMember[]> {
    try {
      const stored = localStorage.getItem(`${this.storagePrefix}team_${companyId}`);
      return stored ? JSON.parse(stored) : this.getMockTeamMembers(companyId);
    } catch (error) {
      logger.error('ProjectStorage: Error loading team members', error);
      return this.getMockTeamMembers(companyId);
    }
  }

  // Analytics & Reporting
  async getProjectAnalytics(projectId: string, companyId: string): Promise<ProjectAnalytics> {
    const project = await this.getProject(projectId, companyId);
    const tasks = await this.getTasks(companyId, projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }

    const completedTasks = tasks.filter(t => t.status === 'done');
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
    
    const totalEstimated = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const totalActual = tasks.reduce((sum, t) => sum + t.actualHours, 0);
    const averageTaskTime = completedTasks.length > 0 ? 
      completedTasks.reduce((sum, t) => sum + t.actualHours, 0) / completedTasks.length : 0;

    return {
      completionRate,
      averageTaskTime,
      teamEfficiency: totalEstimated > 0 ? (totalEstimated / Math.max(totalActual, 1)) * 100 : 100,
      budgetUtilization: (project.budget.spentBudget / project.budget.totalBudget) * 100,
      riskScore: project.riskScore,
      delayPrediction: {
        likelihood: Math.min(project.riskScore, 95),
        estimatedDelay: Math.ceil(project.riskScore / 10),
        factors: ['Resource constraints', 'Scope changes'],
        recommendations: ['Review timeline', 'Add resources']
      }
    };
  }

  async getWorkloadAnalytics(companyId: string): Promise<WorkloadAnalytics[]> {
    const team = await this.getTeamMembers(companyId);
    const tasks = await this.getTasks(companyId);
    
    return team.map(member => {
      const memberTasks = tasks.filter(t => t.assigneeId === member.id);
      const completedTasks = memberTasks.filter(t => t.status === 'done');
      
      return {
        teamMemberId: member.id,
        currentUtilization: member.currentWorkload / member.capacity,
        projectedWorkload: [0.8, 0.7, 0.9, 0.6], // Next 4 weeks
        efficiency: 0.85,
        completionRate: memberTasks.length > 0 ? (completedTasks.length / memberTasks.length) * 100 : 0,
        averageTaskTime: completedTasks.length > 0 ? 
          completedTasks.reduce((sum, t) => sum + t.actualHours, 0) / completedTasks.length : 0
      };
    });
  }

  // Comments & Updates
  async addTaskComment(taskId: string, companyId: string, comment: Omit<TaskComment, 'id'>): Promise<void> {
    const task = await this.getTask(taskId, companyId);
    if (task) {
      const newComment: TaskComment = {
        ...comment,
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      task.comments = task.comments || [];
      task.comments.push(newComment);
      await this.saveTask(task);
    }
  }

  // Mock Data
  private getMockProjects(companyId: string): Project[] {
    return [
      {
        id: 'proj_1',
        companyId,
        name: 'Mobile App v2.0',
        description: 'Major update to mobile application with new features',
        status: 'active',
        priority: 'high',
        type: 'product_development',
        phase: 'execution',
        startDate: '2024-01-01',
        endDate: '2024-03-15',
        estimatedHours: 480,
        actualHours: 280,
        milestones: [],
        teamMembers: [],
        budget: {
          totalBudget: 500000,
          spentBudget: 280000,
          allocatedBudget: 450000,
          budgetBreakdown: [],
          currency: 'INR'
        },
        aiMetadata: {
          complexity: 'high',
          riskFactors: ['Technical complexity', 'Tight timeline'],
          recommendedTeamSize: 5,
          predictedDuration: 75,
          similarProjectReferences: [],
          autoGeneratedTasks: false
        },
        moduleReferences: [],
        progressPercentage: 67,
        healthScore: 78,
        riskScore: 35,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      }
    ];
  }

  private getMockTasks(companyId: string): Task[] {
    return [
      {
        id: 'task_1',
        projectId: 'proj_1',
        companyId,
        title: 'Design new user interface',
        description: 'Create modern, responsive UI for mobile app',
        status: 'in_progress',
        priority: 'high',
        assigneeId: 'user_1',
        assigneeName: 'Priya Sharma',
        dueDate: '2024-02-15',
        estimatedHours: 40,
        actualHours: 25,
        dependencies: [],
        blockers: [],
        tags: [{ id: 'tag_1', name: 'UI/UX', color: '#3B82F6', category: 'design' }],
        category: 'design',
        aiMetadata: {
          complexityScore: 7,
          estimationConfidence: 85,
          skillRequirements: ['UI/UX', 'Figma', 'Mobile Design'],
          autoGenerated: false
        },
        progressPercentage: 60,
        comments: [],
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: new Date().toISOString()
      }
    ];
  }

  private getMockTeamMembers(companyId: string): TeamMember[] {
    return [
      {
        id: 'user_1',
        name: 'Priya Sharma',
        role: 'UI/UX Designer',
        department: 'design',
        skills: ['UI/UX', 'Figma', 'Mobile Design'],
        hourlyRate: 2000,
        capacity: 40,
        currentWorkload: 28,
        availability: {
          totalHours: 40,
          availableHours: 12,
          allocatedHours: 28,
          leaveScheduled: []
        }
      },
      {
        id: 'user_2',
        name: 'Rahul Kumar',
        role: 'Full Stack Developer',
        department: 'engineering',
        skills: ['React', 'Node.js', 'MongoDB'],
        hourlyRate: 2500,
        capacity: 40,
        currentWorkload: 35,
        availability: {
          totalHours: 40,
          availableHours: 5,
          allocatedHours: 35,
          leaveScheduled: []
        }
      }
    ];
  }
}

export const projectStorage = new ProjectStorage();
