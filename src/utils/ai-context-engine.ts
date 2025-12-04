
import { AIContext, Company, Transaction, Campaign, Task, Contract, ModuleInsight } from '@/types/startup-os';

export class AIContextEngine {
  private static instance: AIContextEngine;
  private context: Map<string, AIContext> = new Map();

  static getInstance(): AIContextEngine {
    if (!AIContextEngine.instance) {
      AIContextEngine.instance = new AIContextEngine();
    }
    return AIContextEngine.instance;
  }

  async updateContext(companyId: string, updates: Partial<AIContext>): Promise<void> {
    const currentContext = this.context.get(companyId) || this.getDefaultContext(companyId);
    const updatedContext = { ...currentContext, ...updates, lastUpdated: new Date().toISOString() };
    this.context.set(companyId, updatedContext);
    
    // Store in localStorage for persistence
    localStorage.setItem(`ai-context-${companyId}`, JSON.stringify(updatedContext));
  }

  getContext(companyId: string): AIContext {
    let context = this.context.get(companyId);
    
    if (!context) {
      // Try to load from localStorage
      const stored = localStorage.getItem(`ai-context-${companyId}`);
      if (stored) {
        context = JSON.parse(stored);
        this.context.set(companyId, context!);
      } else {
        context = this.getDefaultContext(companyId);
        this.context.set(companyId, context);
      }
    }
    
    return context;
  }

  private getDefaultContext(companyId: string): AIContext {
    return {
      companyId,
      stage: 'idea',
      currentCashFlow: 0,
      monthlyBurn: 0,
      runway: 0,
      teamSize: 1,
      recentTransactions: [],
      activeCampaigns: [],
      urgentTasks: [],
      complianceDeadlines: [],
      goals: [],
      painPoints: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  async generateInsights(companyId: string): Promise<ModuleInsight[]> {
    const context = this.getContext(companyId);
    const insights: ModuleInsight[] = [];

    // Financial insights
    if (context.runway < 60) {
      insights.push({
        module: 'finance',
        type: 'warning',
        title: 'Low Runway Alert',
        description: `Company runway is ${context.runway} days. Consider fundraising or cost reduction.`,
        actionRequired: true,
        priority: 'high',
        relatedEntities: ['transactions', 'budget'],
        createdAt: new Date().toISOString(),
      });
    }

    // HR insights
    if (context.teamSize > 5 && context.currentCashFlow < 0) {
      insights.push({
        module: 'hr',
        type: 'warning',
        title: 'Team Size vs Cash Flow',
        description: 'Consider hiring freeze or team optimization given negative cash flow.',
        actionRequired: true,
        priority: 'medium',
        relatedEntities: ['team', 'payroll'],
        createdAt: new Date().toISOString(),
      });
    }

    // Marketing insights
    if (context.activeCampaigns.length === 0 && context.stage !== 'idea') {
      insights.push({
        module: 'marketing',
        type: 'opportunity',
        title: 'No Active Marketing Campaigns',
        description: 'Consider launching marketing campaigns to drive growth.',
        actionRequired: false,
        priority: 'medium',
        relatedEntities: ['campaigns'],
        createdAt: new Date().toISOString(),
      });
    }

    return insights;
  }

  async getAIRecommendation(companyId: string, query: string): Promise<string> {
    const context = this.getContext(companyId);
    
    // Simulate AI recommendation based on context
    const recommendations = {
      'cash flow': `Based on your current burn rate of ₹${context.monthlyBurn}/month and runway of ${context.runway} days, consider: 1) Reducing non-essential expenses 2) Accelerating revenue generation 3) Exploring funding options`,
      'hiring': `With ${context.teamSize} team members and current cash flow of ₹${context.currentCashFlow}, recommend ${context.currentCashFlow > 0 ? 'strategic hiring in revenue-generating roles' : 'hiring freeze until cash flow improves'}`,
      'marketing': `For a ${context.stage} stage startup, focus on: 1) Product-market fit validation 2) Cost-effective digital marketing 3) Customer feedback loops`,
      'default': `Based on your ${context.stage} stage startup with ${context.teamSize} team members, focus on sustainable growth and cash flow management.`
    };

    const key = Object.keys(recommendations).find(k => query.toLowerCase().includes(k)) || 'default';
    return recommendations[key as keyof typeof recommendations];
  }
}

export const aiContextEngine = AIContextEngine.getInstance();
