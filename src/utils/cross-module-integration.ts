import { Project, Task, TeamMember } from '@/types/project-management';
import { Employee } from '@/types/hr-employee';
import { projectStorage } from './projectStorage';

export interface CrossModuleEvent {
  id: string;
  moduleType: 'hr' | 'finance' | 'marketing' | 'legal' | 'supply_chain';
  eventType: string;
  data: any;
  timestamp: string;
  processed: boolean;
}

export interface ModuleIntegration {
  moduleType: string;
  syncEnabled: boolean;
  lastSync: string;
  syncFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  webhookUrl?: string;
}

class CrossModuleIntegrationService {
  private integrations: ModuleIntegration[] = [
    { moduleType: 'hr', syncEnabled: true, lastSync: new Date().toISOString(), syncFrequency: 'real-time' },
    { moduleType: 'finance', syncEnabled: true, lastSync: new Date().toISOString(), syncFrequency: 'daily' },
    { moduleType: 'marketing', syncEnabled: true, lastSync: new Date().toISOString(), syncFrequency: 'hourly' },
    { moduleType: 'legal', syncEnabled: true, lastSync: new Date().toISOString(), syncFrequency: 'weekly' },
    { moduleType: 'supply_chain', syncEnabled: true, lastSync: new Date().toISOString(), syncFrequency: 'daily' }
  ];

  // HR Module Integration
  async syncEmployeeData(companyId: string): Promise<void> {
    console.log('🔄 Syncing employee data from HR module');
    
    try {
      // Simulate fetching employee data from HR module
      const mockEmployees: Employee[] = [
        {
          id: 'emp_1',
          companyId,
          personalInfo: {
            name: 'Priya Sharma',
            email: 'priya@company.com',
            phone: '+91-9876543210'
          },
          employmentInfo: {
            employeeId: 'EMP001',
            role: 'UI/UX Designer',
            department: 'design',
            joiningDate: '2024-01-15',
            employmentType: 'full-time',
            workLocation: 'hybrid'
          },
          compensation: {
            basicSalary: 60000,
            hra: 12000,
            transportAllowance: 2000,
            mealAllowance: 1000,
            otherAllowances: 1000,
            grossSalary: 76000,
            pfContribution: 7200,
            esiContribution: 500,
            professionalTax: 200,
            tds: 5000,
            netSalary: 63100,
            paymentCycle: 'monthly'
          },
          documents: {},
          leaveBalance: {
            casual: 12,
            sick: 12,
            earned: 21,
            maternity: 120,
            paternity: 15,
            compensatory: 5,
            totalUsed: 9,
            totalRemaining: 177
          },
          performance: {
            overallRating: 4.5,
            goals: [],
            feedback: [],
            skillsAssessment: []
          },
          status: 'active',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: new Date().toISOString()
        }
      ];

      // Convert employees to team members and sync
      for (const employee of mockEmployees) {
        const teamMember: TeamMember = {
          id: employee.id,
          name: employee.personalInfo.name,
          role: employee.employmentInfo.role,
          department: employee.employmentInfo.department as any,
          skills: this.getSkillsFromRole(employee.employmentInfo.role),
          hourlyRate: employee.compensation.grossSalary / 160, // Assuming 160 hours per month
          capacity: 40, // 40 hours per week
          currentWorkload: 0, // Will be calculated from tasks
          availability: {
            totalHours: 40,
            availableHours: 40,
            allocatedHours: 0,
            leaveScheduled: []
          }
        };

        await projectStorage.saveTeamMember(teamMember, companyId);
      }

      // Employee data synced successfully
    } catch (error) {
      console.error('❌ Error syncing employee data:', error);
    }
  }

  async createOnboardingProject(employee: Employee): Promise<Project> {
    console.log('🆕 Creating onboarding project for:', employee.personalInfo.name);

    const onboardingProject: Project = {
      id: `onboarding_${employee.id}_${Date.now()}`,
      companyId: employee.companyId,
      name: `Onboarding - ${employee.personalInfo.name}`,
      description: `Complete onboarding process for ${employee.personalInfo.name} (${employee.employmentInfo.role})`,
      status: 'active',
      priority: 'high',
      type: 'hiring',
      phase: 'planning',
      startDate: employee.employmentInfo.joiningDate,
      endDate: new Date(new Date(employee.employmentInfo.joiningDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 40,
      actualHours: 0,
      milestones: [
        {
          id: 'milestone_1',
          projectId: `onboarding_${employee.id}_${Date.now()}`,
          title: 'Day 1 Setup',
          description: 'Complete initial setup and orientation',
          dueDate: employee.employmentInfo.joiningDate,
          status: 'pending',
          deliverables: ['Workspace setup', 'Account creation', 'Initial orientation'],
          dependencies: []
        }
      ],
      teamMembers: [],
      budget: {
        totalBudget: 25000,
        spentBudget: 0,
        allocatedBudget: 25000,
        budgetBreakdown: [
          { category: 'personnel', allocated: 20000, spent: 0, remaining: 20000 },
          { category: 'tools', allocated: 5000, spent: 0, remaining: 5000 }
        ],
        currency: 'INR'
      },
      aiMetadata: {
        complexity: 'low',
        riskFactors: ['New employee adaptation'],
        recommendedTeamSize: 2,
        predictedDuration: 14,
        similarProjectReferences: [],
        autoGeneratedTasks: true
      },
      moduleReferences: [
        {
          moduleType: 'hr',
          referenceId: employee.id,
          referenceType: 'employee',
          description: 'Employee onboarding',
          syncStatus: 'synced'
        }
      ],
      progressPercentage: 0,
      healthScore: 95,
      riskScore: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await projectStorage.saveProject(onboardingProject);
    return onboardingProject;
  }

  // Finance Module Integration
  async syncBudgetData(projectId: string, financeData: any): Promise<void> {
    console.log('💰 Syncing budget data for project:', projectId);
    
    const project = await projectStorage.getProject(projectId, financeData.companyId);
    if (project) {
      project.budget.spentBudget = financeData.actualSpent || project.budget.spentBudget;
      project.budget.budgetBreakdown = financeData.breakdown || project.budget.budgetBreakdown;
      await projectStorage.saveProject(project);
    }
  }

  async generateInvoiceFromMilestone(projectId: string, milestoneId: string): Promise<any> {
    console.log('📄 Generating invoice for milestone:', milestoneId);
    
    return {
      id: `inv_${Date.now()}`,
      projectId,
      milestoneId,
      amount: 50000,
      status: 'draft',
      generatedAt: new Date().toISOString()
    };
  }

  // Marketing Module Integration
  async createCampaignProject(campaignData: any): Promise<Project> {
    console.log('📢 Creating project for marketing campaign:', campaignData.name);

    const campaignProject: Project = {
      id: `campaign_${Date.now()}`,
      companyId: campaignData.companyId,
      name: `Marketing Campaign - ${campaignData.name}`,
      description: campaignData.description,
      status: 'planning',
      priority: 'medium',
      type: 'marketing_campaign',
      phase: 'planning',
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      estimatedHours: 80,
      actualHours: 0,
      milestones: [],
      teamMembers: [],
      budget: {
        totalBudget: campaignData.budget || 100000,
        spentBudget: 0,
        allocatedBudget: campaignData.budget || 100000,
        budgetBreakdown: [
          { category: 'marketing', allocated: campaignData.budget * 0.8, spent: 0, remaining: campaignData.budget * 0.8 },
          { category: 'personnel', allocated: campaignData.budget * 0.2, spent: 0, remaining: campaignData.budget * 0.2 }
        ],
        currency: 'INR'
      },
      aiMetadata: {
        complexity: 'medium',
        riskFactors: ['Market competition', 'Budget constraints'],
        recommendedTeamSize: 3,
        predictedDuration: 30,
        similarProjectReferences: [],
        autoGeneratedTasks: true
      },
      moduleReferences: [
        {
          moduleType: 'marketing',
          referenceId: campaignData.id,
          referenceType: 'campaign',
          description: 'Marketing campaign project',
          syncStatus: 'synced'
        }
      ],
      progressPercentage: 0,
      healthScore: 85,
      riskScore: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await projectStorage.saveProject(campaignProject);
    return campaignProject;
  }

  // Legal Module Integration
  async createComplianceTask(complianceData: any): Promise<Task> {
    console.log('⚖️ Creating compliance task:', complianceData.title);

    const complianceTask: Task = {
      id: `compliance_${Date.now()}`,
      projectId: complianceData.projectId || 'general_compliance',
      companyId: complianceData.companyId,
      title: complianceData.title,
      description: complianceData.description,
      status: 'todo',
      priority: 'high',
      dueDate: complianceData.deadline,
      estimatedHours: 8,
      actualHours: 0,
      dependencies: [],
      blockers: [],
      tags: [{ id: 'compliance', name: 'Compliance', color: '#red', category: 'administrative' }],
      category: 'administrative',
      aiMetadata: {
        complexityScore: 6,
        estimationConfidence: 80,
        skillRequirements: ['legal', 'compliance'],
        autoGenerated: true
      },
      progressPercentage: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await projectStorage.saveTask(complianceTask);
    return complianceTask;
  }

  // Supply Chain Integration
  async createProcurementProject(procurementData: any): Promise<Project> {
    console.log('🚛 Creating procurement project:', procurementData.title);

    const procurementProject: Project = {
      id: `procurement_${Date.now()}`,
      companyId: procurementData.companyId,
      name: `Procurement - ${procurementData.title}`,
      description: procurementData.description,
      status: 'planning',
      priority: 'medium',
      type: 'operations',
      phase: 'planning',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 40,
      actualHours: 0,
      milestones: [],
      teamMembers: [],
      budget: {
        totalBudget: procurementData.budget || 200000,
        spentBudget: 0,
        allocatedBudget: procurementData.budget || 200000,
        budgetBreakdown: [
          { category: 'operations', allocated: procurementData.budget * 0.9, spent: 0, remaining: procurementData.budget * 0.9 },
          { category: 'personnel', allocated: procurementData.budget * 0.1, spent: 0, remaining: procurementData.budget * 0.1 }
        ],
        currency: 'INR'
      },
      aiMetadata: {
        complexity: 'medium',
        riskFactors: ['Supplier delays', 'Quality issues'],
        recommendedTeamSize: 2,
        predictedDuration: 30,
        similarProjectReferences: [],
        autoGeneratedTasks: true
      },
      moduleReferences: [
        {
          moduleType: 'supply_chain',
          referenceId: procurementData.id,
          referenceType: 'procurement',
          description: 'Procurement project',
          syncStatus: 'synced'
        }
      ],
      progressPercentage: 0,
      healthScore: 80,
      riskScore: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await projectStorage.saveProject(procurementProject);
    return procurementProject;
  }

  // Event Processing
  async processModuleEvent(event: CrossModuleEvent): Promise<void> {
    console.log('🔄 Processing cross-module event:', event.eventType);

    switch (event.moduleType) {
      case 'hr':
        await this.processHREvent(event);
        break;
      case 'finance':
        await this.processFinanceEvent(event);
        break;
      case 'marketing':
        await this.processMarketingEvent(event);
        break;
      case 'legal':
        await this.processLegalEvent(event);
        break;
      case 'supply_chain':
        await this.processSupplyChainEvent(event);
        break;
    }

    event.processed = true;
  }

  private async processHREvent(event: CrossModuleEvent): Promise<void> {
    switch (event.eventType) {
      case 'employee_hired':
        await this.createOnboardingProject(event.data);
        break;
      case 'employee_performance_updated':
        // Update task assignment algorithms based on performance
        break;
      case 'leave_scheduled':
        // Adjust project timelines for scheduled leave
        break;
    }
  }

  private async processFinanceEvent(event: CrossModuleEvent): Promise<void> {
    switch (event.eventType) {
      case 'budget_updated':
        await this.syncBudgetData(event.data.projectId, event.data);
        break;
      case 'expense_recorded':
        // Update project expense tracking
        break;
    }
  }

  private async processMarketingEvent(event: CrossModuleEvent): Promise<void> {
    switch (event.eventType) {
      case 'campaign_created':
        await this.createCampaignProject(event.data);
        break;
      case 'lead_converted':
        // Create customer onboarding project
        break;
    }
  }

  private async processLegalEvent(event: CrossModuleEvent): Promise<void> {
    switch (event.eventType) {
      case 'compliance_required':
        await this.createComplianceTask(event.data);
        break;
      case 'contract_deadline':
        // Add contract milestone to project timeline
        break;
    }
  }

  private async processSupplyChainEvent(event: CrossModuleEvent): Promise<void> {
    switch (event.eventType) {
      case 'procurement_needed':
        await this.createProcurementProject(event.data);
        break;
      case 'vendor_delay':
        // Update project risk scores and timelines
        break;
    }
  }

  // Utility methods
  private getSkillsFromRole(role: string): string[] {
    const roleSkillMap: { [key: string]: string[] } = {
      'UI/UX Designer': ['UI/UX', 'Figma', 'Mobile Design', 'User Research'],
      'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript'],
      'Product Manager': ['Product Strategy', 'Analytics', 'User Stories', 'Roadmapping'],
      'Marketing Manager': ['Digital Marketing', 'Content Strategy', 'SEO', 'Analytics'],
      'Sales Executive': ['Lead Generation', 'CRM', 'Negotiation', 'Customer Relations']
    };

    return roleSkillMap[role] || ['General'];
  }

  // Configuration methods
  getIntegrations(): ModuleIntegration[] {
    return this.integrations;
  }

  updateIntegration(moduleType: string, config: Partial<ModuleIntegration>): void {
    const integration = this.integrations.find(i => i.moduleType === moduleType);
    if (integration) {
      Object.assign(integration, config);
    }
  }
}

export const crossModuleIntegration = new CrossModuleIntegrationService();
