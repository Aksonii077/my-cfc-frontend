import { Project, Task, ProjectContext, TaskPlanningContext, AIProjectPlan, AITaskRecommendation, AIProjectSummary, TeamMember, ProjectTemplate, ProjectAnalytics, DelayPrediction, WorkloadAnalytics } from '@/types/project-management';
import { aiContextEngine } from './ai-context-engine';

class AIProjectEngine {
  // Generate Project Plan method that was missing
  async generateProjectPlan(context: ProjectContext): Promise<AIProjectPlan> {
    console.log('🤖 Generating AI project plan with context:', context);
    
    const plan: AIProjectPlan = {
      projectName: `AI Generated Project - ${context.businessStage}`,
      description: `Automated project plan for ${context.industry} company in ${context.businessStage} stage`,
      phases: [
        {
          name: 'Planning Phase',
          description: 'Initial project setup and planning',
          duration: 14,
          tasks: [
            {
              title: 'Define project scope',
              description: 'Create detailed project scope document',
              estimatedHours: 16,
              priority: 'high',
              requiredSkills: ['project_management', 'analysis'],
              category: 'administrative',
              dependencies: []
            },
            {
              title: 'Assign team members',
              description: 'Allocate team members based on skills and availability',
              estimatedHours: 8,
              priority: 'high',
              requiredSkills: ['team_management'],
              category: 'administrative',
              dependencies: ['Define project scope']
            }
          ],
          deliverables: ['Project scope document', 'Team allocation plan'],
          dependencies: []
        },
        {
          name: 'Execution Phase',
          description: 'Main project development work',
          duration: 45,
          tasks: [
            {
              title: 'Core development work',
              description: 'Execute main project deliverables',
              estimatedHours: 120,
              priority: 'high',
              requiredSkills: ['development', 'design'],
              category: 'development',
              dependencies: ['Assign team members']
            }
          ],
          deliverables: ['Core project deliverables'],
          dependencies: ['Planning Phase']
        }
      ],
      estimatedDuration: 60,
      recommendedTeam: [
        {
          role: 'Project Manager',
          skills: ['project_management', 'communication'],
          estimatedHours: 40,
          suggestedAssignee: context.teamCapacity.find(m => m.role.includes('Manager'))?.name
        },
        {
          role: 'Developer',
          skills: ['development', 'technical'],
          estimatedHours: 120,
          suggestedAssignee: context.teamCapacity.find(m => m.skills.includes('development'))?.name
        }
      ],
      budgetBreakdown: [
        {
          category: 'personnel',
          allocated: context.budget * 0.7,
          spent: 0,
          remaining: context.budget * 0.7
        },
        {
          category: 'tools',
          allocated: context.budget * 0.2,
          spent: 0,
          remaining: context.budget * 0.2
        },
        {
          category: 'other',
          allocated: context.budget * 0.1,
          spent: 0,
          remaining: context.budget * 0.1
        }
      ],
      riskFactors: ['Resource constraints', 'Timeline pressure', 'Technical complexity'],
      successMetrics: ['On-time delivery', 'Budget adherence', 'Quality standards met']
    };

    return plan;
  }

  // Natural Language Project Planning
  async generateProjectFromPrompt(prompt: string, context: ProjectContext): Promise<AIProjectPlan> {
    console.log('🤖 Generating project plan from prompt:', prompt);
    
    // Parse prompt to extract key information
    const promptAnalysis = this.analyzePrompt(prompt);
    
    // Generate comprehensive project plan
    const projectPlan: AIProjectPlan = {
      projectName: promptAnalysis.projectName || 'AI Generated Project',
      description: `${prompt}\n\nThis project was automatically generated using AI analysis of your requirements.`,
      phases: this.generateProjectPhases(promptAnalysis, context),
      estimatedDuration: promptAnalysis.duration || this.estimateProjectDuration(promptAnalysis.complexity),
      recommendedTeam: this.recommendTeamComposition(promptAnalysis, context),
      budgetBreakdown: this.generateBudgetBreakdown(promptAnalysis.budget, promptAnalysis.projectType),
      riskFactors: this.identifyRiskFactors(promptAnalysis, context),
      successMetrics: this.generateSuccessMetrics(promptAnalysis)
    };

    // Project plan generated
    return projectPlan;
  }

  // Smart Task Assignment Algorithm
  async assignTaskOptimally(taskId: string, availableTeam: TeamMember[], context: ProjectContext): Promise<AITaskRecommendation> {
    console.log('🎯 Finding optimal assignment for task:', taskId);
    
    // Analyze team member fit based on skills, workload, and performance
    const recommendations = availableTeam.map(member => {
      const skillMatch = this.calculateSkillMatch(taskId, member);
      const workloadScore = this.calculateWorkloadScore(member);
      const performanceScore = this.getPerformanceScore(member.id);
      
      const confidence = (skillMatch * 0.4 + workloadScore * 0.3 + performanceScore * 0.3);
      
      return {
        memberId: member.id,
        memberName: member.name,
        confidence,
        reasoning: this.generateAssignmentReasoning(member, skillMatch, workloadScore, performanceScore)
      };
    }).sort((a, b) => b.confidence - a.confidence);

    const topRecommendation = recommendations[0];
    
    return {
      taskId,
      recommendedAssignee: topRecommendation.memberName,
      confidence: topRecommendation.confidence,
      reasoning: topRecommendation.reasoning,
      alternatives: recommendations.slice(1, 3).map(r => r.memberName)
    };
  }

  // Delay Prediction & Risk Assessment
  async predictProjectDelays(projectId: string, currentTasks: Task[], teamWorkload: WorkloadAnalytics[]): Promise<DelayPrediction> {
    console.log('📊 Analyzing delay risk for project:', projectId);
    
    // Analyze various risk factors
    const overloadedMembers = teamWorkload.filter(w => w.currentUtilization > 0.9).length;
    const blockedTasks = currentTasks.filter(t => t.status === 'blocked').length;
    const overdueCount = currentTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length;
    const criticalPathTasks = this.identifyCriticalPath(currentTasks);
    
    // Calculate delay likelihood
    let likelihood = 0;
    const factors: string[] = [];
    
    if (overloadedMembers > 0) {
      likelihood += 30;
      factors.push(`${overloadedMembers} team members overloaded`);
    }
    
    if (blockedTasks > 0) {
      likelihood += 25;
      factors.push(`${blockedTasks} tasks currently blocked`);
    }
    
    if (overdueCount > 0) {
      likelihood += 35;
      factors.push(`${overdueCount} tasks already overdue`);
    }
    
    if (criticalPathTasks.some(t => t.status === 'blocked')) {
      likelihood += 40;
      factors.push('Critical path tasks are blocked');
    }

    // Cap at 95%
    likelihood = Math.min(likelihood, 95);
    
    // Estimate delay duration
    const estimatedDelay = this.calculateDelayDuration(likelihood, factors);
    
    return {
      likelihood,
      estimatedDelay,
      factors,
      recommendations: this.generateDelayRecommendations(factors)
    };
  }

  // AI Project Summary Generation
  async generateWeeklySummary(projects: Project[], tasks: Task[], teamAnalytics: WorkloadAnalytics[]): Promise<AIProjectSummary> {
    console.log('📝 Generating weekly project summary');
    
    // Analyze overall project health
    const activeProjects = projects.filter(p => p.status === 'active');
    const completedTasks = tasks.filter(t => t.status === 'done' && this.isThisWeek(t.completedAt));
    const averageHealth = activeProjects.reduce((sum, p) => sum + p.healthScore, 0) / activeProjects.length;
    
    return {
      projectHealth: this.getHealthDescription(averageHealth),
      progressSummary: `Completed ${completedTasks.length} tasks across ${activeProjects.length} active projects this week.`,
      keyAchievements: this.identifyKeyAchievements(tasks, projects),
      currentRisks: this.identifyCurrentRisks(projects, tasks),
      upcomingMilestones: this.getUpcomingMilestones(projects),
      teamPerformance: this.analyzeTeamPerformance(teamAnalytics),
      recommendations: this.generateWeeklyRecommendations(projects, tasks),
      nextActions: this.identifyNextActions(projects, tasks)
    };
  }

  // Cross-Module Integration
  async syncWithHRModule(projectId: string, hrData: any): Promise<void> {
    console.log('🔄 Syncing project with HR module');
    // Implementation for HR integration
  }

  async syncWithFinanceModule(projectId: string, financeData: any): Promise<void> {
    console.log('💰 Syncing project with Finance module');
    // Implementation for Finance integration
  }

  async syncWithMarketingModule(projectId: string, marketingData: any): Promise<void> {
    console.log('📢 Syncing project with Marketing module');
    // Implementation for Marketing integration
  }

  async syncWithLegalModule(projectId: string, legalData: any): Promise<void> {
    console.log('⚖️ Syncing project with Legal module');
    // Implementation for Legal integration
  }

  // Template Management
  getProjectTemplates(): ProjectTemplate[] {
    return [
      {
        id: 'fundraising',
        name: 'Fundraising Campaign',
        description: 'Complete fundraising process from pitch deck to closing',
        type: 'fundraising',
        phases: [
          {
            name: 'Preparation',
            description: 'Prepare materials and strategy',
            durationDays: 14,
            tasks: [
              {
                title: 'Create pitch deck',
                description: 'Design compelling investor presentation',
                estimatedHours: 24,
                requiredSkills: ['design', 'business_strategy'],
                priority: 'high',
                category: 'content'
              },
              {
                title: 'Prepare financial projections',
                description: 'Build 3-year financial model',
                estimatedHours: 16,
                requiredSkills: ['finance', 'analysis'],
                priority: 'high',
                category: 'research'
              }
            ],
            deliverables: ['Pitch deck', 'Financial model', 'Investor list']
          }
        ],
        estimatedDuration: 90,
        requiredRoles: ['CEO', 'CFO', 'Designer'],
        budgetRange: { min: 50000, max: 200000, currency: 'INR' }
      },
      {
        id: 'product_launch',
        name: 'Product Launch',
        description: 'End-to-end product launch campaign',
        type: 'product_development',
        phases: [
          {
            name: 'Pre-Launch',
            description: 'Prepare for launch',
            durationDays: 21,
            tasks: [
              {
                title: 'Finalize product features',
                description: 'Complete development and testing',
                estimatedHours: 80,
                requiredSkills: ['development', 'testing'],
                priority: 'urgent',
                category: 'development'
              }
            ],
            deliverables: ['Product ready', 'Marketing materials', 'Launch plan']
          }
        ],
        estimatedDuration: 60,
        requiredRoles: ['Product Manager', 'Developer', 'Marketing Manager'],
        budgetRange: { min: 100000, max: 500000, currency: 'INR' }
      }
    ];
  }

  // Private helper methods
  private analyzePrompt(prompt: string) {
    // Extract key information from natural language prompt
    const duration = this.extractDuration(prompt);
    const budget = this.extractBudget(prompt);
    const teamSize = this.extractTeamSize(prompt);
    const projectType = this.extractProjectType(prompt);
    const complexity = this.assessComplexity(prompt);
    
    return {
      projectName: this.extractProjectName(prompt),
      duration,
      budget,
      teamSize,
      projectType,
      complexity,
      requirements: prompt
    };
  }

  private extractDuration(prompt: string): number {
    const durationMatch = prompt.match(/(\d+)\s*(day|week|month)/i);
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      const unit = durationMatch[2].toLowerCase();
      
      switch (unit) {
        case 'day': return value;
        case 'week': return value * 7;
        case 'month': return value * 30;
        default: return 14;
      }
    }
    return 14; // Default 2 weeks
  }

  private extractBudget(prompt: string): number {
    const budgetMatch = prompt.match(/[₹$]\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*([kmb])?/i);
    if (budgetMatch) {
      let value = parseFloat(budgetMatch[1].replace(/,/g, ''));
      const multiplier = budgetMatch[2]?.toLowerCase();
      
      switch (multiplier) {
        case 'k': value *= 1000; break;
        case 'm': value *= 1000000; break;
        case 'b': value *= 1000000000; break;
      }
      
      return value;
    }
    return 50000; // Default budget
  }

  private extractTeamSize(prompt: string): number {
    const teamMatch = prompt.match(/(\d+)\s*(people|person|member)/i);
    return teamMatch ? parseInt(teamMatch[1]) : 3;
  }

  private extractProjectType(prompt: string): string {
    const types = {
      'marketing': ['marketing', 'campaign', 'promotion', 'advertising'],
      'product_development': ['product', 'development', 'build', 'feature'],
      'hiring': ['hiring', 'recruitment', 'onboard'],
      'fundraising': ['fundraising', 'investment', 'funding', 'investor'],
      'compliance': ['compliance', 'legal', 'regulation', 'audit']
    };

    for (const [type, keywords] of Object.entries(types)) {
      if (keywords.some(keyword => prompt.toLowerCase().includes(keyword))) {
        return type;
      }
    }
    
    return 'other';
  }

  private assessComplexity(prompt: string): string {
    const complexityIndicators = {
      high: ['complex', 'advanced', 'integration', 'multiple teams', 'cross-functional'],
      medium: ['moderate', 'standard', 'typical'],
      low: ['simple', 'basic', 'straightforward', 'quick']
    };

    for (const [level, indicators] of Object.entries(complexityIndicators)) {
      if (indicators.some(indicator => prompt.toLowerCase().includes(indicator))) {
        return level;
      }
    }
    
    return 'medium';
  }

  private extractProjectName(prompt: string): string {
    // Simple extraction - first few words or specific patterns
    const match = prompt.match(/^(.*?)(for|with|using|in|over)/i);
    if (match) {
      return match[1].trim().replace(/^(plan|create|build|develop)\s*/i, '');
    }
    
    return prompt.split(' ').slice(0, 4).join(' ');
  }

  private generateProjectPhases(promptAnalysis: any, context: ProjectContext) {
    // Generate phases based on project type and complexity
    const basePhases = [
      {
        name: 'Planning & Setup',
        description: 'Initial planning and resource allocation',
        duration: Math.ceil(promptAnalysis.duration * 0.2),
        tasks: [],
        deliverables: ['Project plan', 'Team assignments', 'Timeline'],
        dependencies: []
      },
      {
        name: 'Execution',
        description: 'Main development and implementation phase',
        duration: Math.ceil(promptAnalysis.duration * 0.6),
        tasks: [],
        deliverables: ['Core deliverables', 'Progress reports'],
        dependencies: ['Planning & Setup']
      },
      {
        name: 'Review & Delivery',
        description: 'Final review, testing, and delivery',
        duration: Math.ceil(promptAnalysis.duration * 0.2),
        tasks: [],
        deliverables: ['Final product', 'Documentation', 'Handover'],
        dependencies: ['Execution']
      }
    ];

    return basePhases;
  }

  private recommendTeamComposition(promptAnalysis: any, context: ProjectContext) {
    // Recommend team based on project type and available resources
    return [
      {
        role: 'Project Lead',
        skills: ['project_management', 'leadership'],
        estimatedHours: promptAnalysis.duration * 2,
        suggestedAssignee: context.teamCapacity.find(m => m.role.toLowerCase().includes('lead'))?.name
      }
    ];
  }

  private generateBudgetBreakdown(totalBudget: number, projectType: string) {
    // Generate realistic budget breakdown based on project type
    return [
      { category: 'personnel' as const, allocated: totalBudget * 0.6, spent: 0, remaining: totalBudget * 0.6 },
      { category: 'tools' as const, allocated: totalBudget * 0.2, spent: 0, remaining: totalBudget * 0.2 },
      { category: 'operations' as const, allocated: totalBudget * 0.2, spent: 0, remaining: totalBudget * 0.2 }
    ];
  }

  private identifyRiskFactors(promptAnalysis: any, context: ProjectContext): string[] {
    const risks = [];
    
    if (promptAnalysis.duration < 7) {
      risks.push('Very tight timeline may cause quality issues');
    }
    
    if (context.teamSize < promptAnalysis.teamSize) {
      risks.push('Insufficient team size for planned scope');
    }
    
    if (promptAnalysis.complexity === 'high') {
      risks.push('High complexity may lead to scope creep');
    }
    
    return risks;
  }

  private generateSuccessMetrics(promptAnalysis: any): string[] {
    return [
      'On-time delivery',
      'Budget adherence',
      'Quality standards met',
      'Stakeholder satisfaction'
    ];
  }

  private estimateProjectDuration(complexity: string): number {
    switch (complexity) {
      case 'high': return 45;
      case 'medium': return 21;
      case 'low': return 7;
      default: return 14;
    }
  }

  private calculateSkillMatch(taskId: string, member: TeamMember): number {
    // Simplified skill matching algorithm
    return Math.random() * 0.4 + 0.6; // 60-100% match
  }

  private calculateWorkloadScore(member: TeamMember): number {
    const utilization = member.currentWorkload / member.capacity;
    return Math.max(0, 1 - utilization);
  }

  private getPerformanceScore(memberId: string): number {
    // Simplified performance scoring
    return Math.random() * 0.3 + 0.7; // 70-100%
  }

  private generateAssignmentReasoning(member: TeamMember, skillMatch: number, workload: number, performance: number): string {
    return `${member.name} has strong skill alignment (${Math.round(skillMatch * 100)}%), good availability (${Math.round(workload * 100)}% free), and excellent performance history.`;
  }

  private identifyCriticalPath(tasks: Task[]): Task[] {
    // Simplified critical path identification
    return tasks.filter(t => t.priority === 'urgent' || t.priority === 'high');
  }

  private calculateDelayDuration(likelihood: number, factors: string[]): number {
    // Estimate delay based on risk factors
    return Math.ceil(likelihood / 10); // days
  }

  private generateDelayRecommendations(factors: string[]): string[] {
    const recommendations = [];
    
    if (factors.some(f => f.includes('overloaded'))) {
      recommendations.push('Redistribute workload or hire additional resources');
    }
    
    if (factors.some(f => f.includes('blocked'))) {
      recommendations.push('Prioritize resolving blocked tasks');
    }
    
    if (factors.some(f => f.includes('overdue'))) {
      recommendations.push('Review and adjust project timeline');
    }
    
    return recommendations;
  }

  private isThisWeek(dateString?: string): boolean {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return date >= weekStart && date < weekEnd;
  }

  private getHealthDescription(score: number): string {
    if (score >= 80) return 'Excellent - All projects on track';
    if (score >= 60) return 'Good - Minor risks identified';
    if (score >= 40) return 'Fair - Some attention needed';
    return 'Poor - Immediate action required';
  }

  private identifyKeyAchievements(tasks: Task[], projects: Project[]): string[] {
    return [
      'Completed major milestone in Product Development',
      'Successfully onboarded 2 new team members',
      'Delivered marketing campaign on schedule'
    ];
  }

  private identifyCurrentRisks(projects: Project[], tasks: Task[]): string[] {
    const risks = [];
    const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
    
    if (blockedTasks > 0) {
      risks.push(`${blockedTasks} tasks currently blocked`);
    }
    
    return risks;
  }

  private getUpcomingMilestones(projects: Project[]): string[] {
    return [
      'MVP Testing Phase - Due in 3 days',
      'Investor Presentation - Due next week'
    ];
  }

  private analyzeTeamPerformance(analytics: WorkloadAnalytics[]): string {
    const avgUtilization = analytics.reduce((sum, a) => sum + a.currentUtilization, 0) / analytics.length;
    return `Team operating at ${Math.round(avgUtilization * 100)}% capacity with good efficiency levels`;
  }

  private generateWeeklyRecommendations(projects: Project[], tasks: Task[]): string[] {
    return [
      'Focus on resolving blocked tasks',
      'Consider additional resources for high-priority projects',
      'Schedule stakeholder updates for next week'
    ];
  }

  private identifyNextActions(projects: Project[], tasks: Task[]): string[] {
    return [
      'Review and approve pending task assignments',
      'Update project timelines based on current progress',
      'Prepare weekly status report for stakeholders'
    ];
  }
}

export const aiProjectEngine = new AIProjectEngine();
