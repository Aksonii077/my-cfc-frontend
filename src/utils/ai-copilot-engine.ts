
import { 
  Conversation, 
  ConversationMessage, 
  ExecutedCommand, 
  BusinessMetric,
  SmartAlert,
  SuggestedAction,
  QuickAction,
  SearchResult
} from '@/types/ai-copilot';
import { AIContext } from '@/types/startup-os';
import { aiContextEngine } from './ai-context-engine';

export class AICopilotEngine {
  private static instance: AICopilotEngine;
  private conversations: Map<string, Conversation> = new Map();
  private businessMetrics: Map<string, BusinessMetric[]> = new Map();
  private activeAlerts: Map<string, SmartAlert[]> = new Map();

  static getInstance(): AICopilotEngine {
    if (!AICopilotEngine.instance) {
      AICopilotEngine.instance = new AICopilotEngine();
    }
    return AICopilotEngine.instance;
  }

  async processMessage(companyId: string, message: string): Promise<ConversationMessage> {
    const conversation = this.getOrCreateConversation(companyId);
    const context = aiContextEngine.getContext(companyId);
    
    // Analyze message for commands
    const detectedCommands = this.parseCommands(message);
    const executedCommands: ExecutedCommand[] = [];
    
    // Execute any detected commands
    for (const command of detectedCommands) {
      const result = await this.executeCommand(companyId, command);
      executedCommands.push(result);
    }
    
    // Generate AI response
    const response = await this.generateResponse(companyId, message, context, executedCommands);
    
    // Create response message
    const responseMessage: ConversationMessage = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      commands: executedCommands,
      attachments: await this.generateAttachments(companyId, message, executedCommands)
    };
    
    // Add to conversation
    conversation.messages.push({
      id: `msg_${Date.now() - 1}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    conversation.messages.push(responseMessage);
    
    // Update conversation context
    await this.updateConversationContext(companyId, message, responseMessage);
    
    return responseMessage;
  }

  private parseCommands(message: string): Array<{ action: string; module: string; parameters: Record<string, any> }> {
    const commands = [];
    const lowerMessage = message.toLowerCase();
    
    // Financial commands
    if (lowerMessage.includes('create invoice') || lowerMessage.includes('send invoice')) {
      const clientMatch = message.match(/for ([A-Za-z\s]+)/);
      commands.push({
        action: 'create_invoice',
        module: 'finance',
        parameters: { client: clientMatch?.[1] || 'Unknown Client' }
      });
    }
    
    if (lowerMessage.includes('check runway') || lowerMessage.includes('cash flow')) {
      commands.push({
        action: 'get_financial_summary',
        module: 'finance',
        parameters: {}
      });
    }
    
    // HR commands
    if (lowerMessage.includes('create job') || lowerMessage.includes('post job')) {
      const roleMatch = message.match(/for ([A-Za-z\s]+)/);
      commands.push({
        action: 'create_job_posting',
        module: 'hr',
        parameters: { role: roleMatch?.[1] || 'New Role' }
      });
    }
    
    // Marketing commands
    if (lowerMessage.includes('launch campaign') || lowerMessage.includes('create campaign')) {
      commands.push({
        action: 'create_campaign',
        module: 'marketing',
        parameters: {}
      });
    }
    
    // Project commands
    if (lowerMessage.includes('create project') || lowerMessage.includes('new project')) {
      commands.push({
        action: 'create_project',
        module: 'project',
        parameters: {}
      });
    }
    
    return commands;
  }

  private async executeCommand(companyId: string, command: { action: string; module: string; parameters: Record<string, any> }): Promise<ExecutedCommand> {
    const executedCommand: ExecutedCommand = {
      id: `cmd_${Date.now()}`,
      command: command.action,
      module: command.module,
      action: command.action,
      parameters: command.parameters,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    try {
      // Simulate command execution based on module and action
      let result;
      
      switch (command.module) {
        case 'finance':
          result = await this.executeFinanceCommand(companyId, command.action, command.parameters);
          break;
        case 'hr':
          result = await this.executeHRCommand(companyId, command.action, command.parameters);
          break;
        case 'marketing':
          result = await this.executeMarketingCommand(companyId, command.action, command.parameters);
          break;
        case 'project':
          result = await this.executeProjectCommand(companyId, command.action, command.parameters);
          break;
        default:
          result = { message: 'Command not supported yet' };
      }
      
      executedCommand.status = 'completed';
      executedCommand.result = result;
    } catch (error) {
      executedCommand.status = 'failed';
      executedCommand.result = { error: (error as Error).message };
    }
    
    return executedCommand;
  }

  private async executeFinanceCommand(companyId: string, action: string, parameters: Record<string, any>) {
    switch (action) {
      case 'create_invoice':
        return {
          message: `Invoice created for ${parameters.client}`,
          invoiceId: `INV-${Date.now()}`,
          amount: 50000,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      case 'get_financial_summary':
        const context = aiContextEngine.getContext(companyId);
        return {
          currentCash: context.currentCashFlow,
          monthlyBurn: context.monthlyBurn,
          runway: context.runway,
          recommendation: context.runway < 60 ? 'Consider fundraising soon' : 'Runway looks healthy'
        };
      default:
        return { message: 'Finance action completed' };
    }
  }

  private async executeHRCommand(companyId: string, action: string, parameters: Record<string, any>) {
    switch (action) {
      case 'create_job_posting':
        return {
          message: `Job posting created for ${parameters.role}`,
          jobId: `JOB-${Date.now()}`,
          estimatedApplicants: Math.floor(Math.random() * 50) + 10
        };
      default:
        return { message: 'HR action completed' };
    }
  }

  private async executeMarketingCommand(companyId: string, action: string, parameters: Record<string, any>) {
    switch (action) {
      case 'create_campaign':
        return {
          message: 'Marketing campaign template created',
          campaignId: `CAM-${Date.now()}`,
          estimatedReach: Math.floor(Math.random() * 5000) + 1000
        };
      default:
        return { message: 'Marketing action completed' };
    }
  }

  private async executeProjectCommand(companyId: string, action: string, parameters: Record<string, any>) {
    switch (action) {
      case 'create_project':
        return {
          message: 'Project created successfully',
          projectId: `PRJ-${Date.now()}`,
          estimatedDuration: '4-6 weeks'
        };
      default:
        return { message: 'Project action completed' };
    }
  }

  private async generateResponse(companyId: string, message: string, context: AIContext, commands: ExecutedCommand[]): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    // Financial queries
    if (lowerMessage.includes('runway') || lowerMessage.includes('cash') || lowerMessage.includes('money')) {
      return `Your current runway is ${context.runway} days with ₹${(context.currentCashFlow / 1000).toFixed(0)}K in the bank and a monthly burn of ₹${(context.monthlyBurn / 1000).toFixed(0)}K. ${context.runway < 60 ? 'Consider accelerating fundraising efforts.' : 'Your financial runway looks healthy.'}`;
    }
    
    if (lowerMessage.includes('team') || lowerMessage.includes('hire') || lowerMessage.includes('employee')) {
      return `You currently have ${context.teamSize} team members. ${context.currentCashFlow > 0 ? 'Your cash flow supports strategic hiring.' : 'Consider hiring freeze until cash flow improves.'}`;
    }
    
    if (lowerMessage.includes('task') || lowerMessage.includes('project') || lowerMessage.includes('deadline')) {
      return `You have ${context.urgentTasks.length} urgent tasks pending. ${context.urgentTasks.length > 5 ? 'Consider prioritizing or delegating some tasks.' : 'Task workload is manageable.'}`;
    }
    
    if (lowerMessage.includes('summary') || lowerMessage.includes('update') || lowerMessage.includes('status')) {
      return `Here's your startup summary: ${context.stage} stage company with ${context.teamSize} people, ${context.runway} days runway, and ${context.activeCampaigns.length} active campaigns. ${commands.length > 0 ? 'I have also executed the requested actions.' : ''}`;
    }
    
    // Command responses
    if (commands.length > 0) {
      const completedCommands = commands.filter(cmd => cmd.status === 'completed');
      if (completedCommands.length > 0) {
        return `I have completed ${completedCommands.length} action(s) for you. ${completedCommands.map(cmd => cmd.result?.message || `${cmd.action} completed`).join('. ')}`;
      }
    }
    
    // Default intelligent response
    return `I understand you are asking about "${message}". Based on your current business context (${context.stage} stage, ${context.teamSize} people, ${context.runway} days runway), here are some relevant insights and recommendations I can provide. What specific aspect would you like me to focus on?`;
  }

  private async generateAttachments(companyId: string, message: string, commands: ExecutedCommand[]) {
    const attachments = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('chart') || lowerMessage.includes('graph') || lowerMessage.includes('trend')) {
      attachments.push({
        type: 'chart',
        title: 'Cash Flow Trend',
        data: {
          type: 'line',
          data: Array.from({ length: 6 }, (_, i) => ({
            month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
            value: Math.floor(Math.random() * 100000) + 50000
          }))
        }
      });
    }
    
    return attachments;
  }

  private getOrCreateConversation(companyId: string): Conversation {
    let conversation = this.conversations.get(companyId);
    if (!conversation) {
      conversation = {
        id: `conv_${companyId}_${Date.now()}`,
        companyId,
        messages: [],
        context: {
          activeModules: ['finance', 'hr', 'marketing', 'project'],
          recentActions: [],
          businessMetrics: {},
          userPreferences: {
            dashboardLayout: ['metrics', 'alerts', 'insights'],
            alertFrequency: 'immediate',
            preferredMetrics: ['runway', 'team-size', 'revenue'],
            notificationChannels: ['in-app']
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.conversations.set(companyId, conversation);
    }
    return conversation;
  }

  private async updateConversationContext(companyId: string, userMessage: string, assistantMessage: ConversationMessage) {
    const conversation = this.conversations.get(companyId);
    if (conversation) {
      conversation.context.recentActions.unshift(userMessage);
      if (conversation.context.recentActions.length > 10) {
        conversation.context.recentActions = conversation.context.recentActions.slice(0, 10);
      }
      conversation.updatedAt = new Date().toISOString();
    }
  }

  // Business Metrics Management
  async updateBusinessMetrics(companyId: string): Promise<BusinessMetric[]> {
    const context = aiContextEngine.getContext(companyId);
    
    const metrics: BusinessMetric[] = [
      {
        id: 'runway',
        name: 'Runway',
        value: context.runway,
        unit: 'days',
        trend: context.runway > 90 ? 'stable' : context.runway > 60 ? 'down' : 'down',
        trendValue: -5,
        module: 'finance',
        category: 'financial',
        importance: context.runway < 60 ? 'critical' : 'medium',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'cash-flow',
        name: 'Cash Flow',
        value: context.currentCashFlow,
        unit: '₹',
        trend: context.currentCashFlow > 0 ? 'up' : 'down',
        trendValue: 15,
        module: 'finance',
        category: 'financial',
        importance: 'critical',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'team-size',
        name: 'Team Size',
        value: context.teamSize,
        unit: 'people',
        trend: 'up',
        trendValue: 2,
        module: 'hr',
        category: 'operational',
        importance: 'medium',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'active-campaigns',
        name: 'Active Campaigns',
        value: context.activeCampaigns.length,
        unit: 'campaigns',
        trend: 'stable',
        trendValue: 0,
        module: 'marketing',
        category: 'growth',
        importance: 'medium',
        lastUpdated: new Date().toISOString()
      }
    ];
    
    this.businessMetrics.set(companyId, metrics);
    return metrics;
  }

  getBusinessMetrics(companyId: string): BusinessMetric[] {
    return this.businessMetrics.get(companyId) || [];
  }

  // Smart Alerts Management
  async generateSmartAlerts(companyId: string): Promise<SmartAlert[]> {
    const context = aiContextEngine.getContext(companyId);
    const alerts: SmartAlert[] = [];
    
    // Financial alerts
    if (context.runway < 60) {
      alerts.push({
        id: `alert_runway_${Date.now()}`,
        companyId,
        type: 'warning',
        severity: context.runway < 30 ? 'critical' : 'high',
        title: 'Low Runway Alert',
        description: `Your runway is only ${context.runway} days. Consider fundraising or cost reduction.`,
        suggestedActions: [
          {
            id: 'action_fundraise',
            title: 'Start Fundraising',
            description: 'Begin reaching out to investors',
            command: 'create_investor_deck',
            module: 'finance',
            estimatedImpact: '+90 days runway',
            urgency: 'immediate'
          },
          {
            id: 'action_cost_cut',
            title: 'Review Expenses',
            description: 'Identify non-essential costs to cut',
            command: 'expense_audit',
            module: 'finance',
            estimatedImpact: '+20% runway',
            urgency: 'this-week'
          }
        ],
        affectedModules: ['finance', 'hr'],
        triggeredBy: {
          type: 'threshold',
          source: 'runway_calculation',
          data: { runway: context.runway, threshold: 60 }
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // HR alerts
    if (context.urgentTasks.length > context.teamSize * 2) {
      alerts.push({
        id: `alert_workload_${Date.now()}`,
        companyId,
        type: 'warning',
        severity: 'medium',
        title: 'High Workload Alert',
        description: `Team has ${context.urgentTasks.length} urgent tasks for ${context.teamSize} people.`,
        suggestedActions: [
          {
            id: 'action_delegate',
            title: 'Redistribute Tasks',
            description: 'Balance workload across team',
            command: 'rebalance_tasks',
            module: 'project',
            estimatedImpact: 'Reduced burnout risk',
            urgency: 'today'
          }
        ],
        affectedModules: ['hr', 'project'],
        triggeredBy: {
          type: 'pattern',
          source: 'task_analysis',
          data: { taskCount: context.urgentTasks.length, teamSize: context.teamSize }
        },
        status: 'active',
        createdAt: new Date().toISOString()
      });
    }
    
    this.activeAlerts.set(companyId, alerts);
    return alerts;
  }

  getActiveAlerts(companyId: string): SmartAlert[] {
    return this.activeAlerts.get(companyId) || [];
  }

  // Quick Actions
  getQuickActions(): QuickAction[] {
    return [
      {
        id: 'create_invoice',
        title: 'Create Invoice',
        description: 'Generate a new invoice for a client',
        icon: 'FileText',
        module: 'finance',
        command: 'create_invoice',
        category: 'finance'
      },
      {
        id: 'post_job',
        title: 'Post Job',
        description: 'Create and publish a job posting',
        icon: 'Users',
        module: 'hr',
        command: 'create_job_posting',
        category: 'hr'
      },
      {
        id: 'launch_campaign',
        title: 'Launch Campaign',
        description: 'Start a new marketing campaign',
        icon: 'Megaphone',
        module: 'marketing',
        command: 'create_campaign',
        category: 'marketing'
      },
      {
        id: 'create_project',
        title: 'New Project',
        description: 'Create a new project',
        icon: 'FolderPlus',
        module: 'project',
        command: 'create_project',
        category: 'project'
      },
      {
        id: 'review_contracts',
        title: 'Review Contracts',
        description: 'Check pending contracts',
        icon: 'FileCheck',
        module: 'legal',
        command: 'review_contracts',
        category: 'legal'
      },
      {
        id: 'check_inventory',
        title: 'Check Inventory',
        description: 'Review inventory levels',
        icon: 'Package',
        module: 'supply',
        command: 'inventory_check',
        category: 'supply'
      }
    ];
  }

  // Universal Search
  async search(companyId: string, query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Search quick actions
    const quickActions = this.getQuickActions();
    quickActions.forEach(action => {
      if (action.title.toLowerCase().includes(lowerQuery) || 
          action.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: action.id,
          type: 'command',
          title: action.title,
          description: action.description,
          module: action.module,
          relevance: 0.9
        });
      }
    });
    
    // Search business metrics
    const metrics = this.getBusinessMetrics(companyId);
    metrics.forEach(metric => {
      if (metric.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: metric.id,
          type: 'data',
          title: metric.name,
          description: `Current: ${metric.value} ${metric.unit}`,
          module: metric.module,
          relevance: 0.8,
          data: metric
        });
      }
    });
    
    // Search alerts
    const alerts = this.getActiveAlerts(companyId);
    alerts.forEach(alert => {
      if (alert.title.toLowerCase().includes(lowerQuery) || 
          alert.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: alert.id,
          type: 'insight',
          title: alert.title,
          description: alert.description,
          module: alert.affectedModules[0],
          relevance: 0.7,
          data: alert
        });
      }
    });
    
    return results.sort((a, b) => b.relevance - a.relevance);
  }
}

export const aiCopilotEngine = AICopilotEngine.getInstance();
