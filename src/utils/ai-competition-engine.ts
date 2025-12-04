
import { 
  Competitor, 
  CompetitorActivity, 
  AIInsight, 
  WeeklyDigest,
  ActivityType,
  TrackingCategory 
} from '@/types/competition-tracker';
import { competitionStorage } from './competitionStorage';

export class AICompetitionEngine {
  private static instance: AICompetitionEngine;
  
  static getInstance(): AICompetitionEngine {
    if (!AICompetitionEngine.instance) {
      AICompetitionEngine.instance = new AICompetitionEngine();
    }
    return AICompetitionEngine.instance;
  }

  // AI Analysis Methods
  async analyzeActivity(activity: CompetitorActivity, competitor: Competitor): Promise<Partial<CompetitorActivity>> {
    try {
      const prompt = this.buildActivityAnalysisPrompt(activity, competitor);
      const response = await this.callAI(prompt);
      
      return {
        aiSummary: response.summary,
        aiInsights: response.insights,
        actionSuggestions: response.actionSuggestions,
        sentiment: response.sentiment,
        importance: this.calculateImportance(activity, response)
      };
    } catch (error) {
      console.error('Error analyzing activity:', error);
      return {};
    }
  }

  async generateInsights(companyId: string): Promise<AIInsight[]> {
    const competitors = competitionStorage.getCompetitors(companyId);
    const recentActivities = this.getRecentActivities(companyId, 7); // Last 7 days
    
    if (recentActivities.length === 0) {
      return [];
    }

    try {
      const prompt = this.buildInsightGenerationPrompt(competitors, recentActivities);
      const response = await this.callAI(prompt);
      
      return response.insights.map((insight: any, index: number) => ({
        id: `insight-${Date.now()}-${index}`,
        companyId,
        competitorId: insight.competitorId,
        type: insight.type,
        priority: insight.priority,
        title: insight.title,
        description: insight.description,
        actionItems: insight.actionItems,
        relatedActivities: insight.relatedActivities,
        confidence: insight.confidence || 75,
        status: 'new' as const,
        createdAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.generateFallbackInsights(recentActivities);
    }
  }

  async generateWeeklyDigest(companyId: string): Promise<WeeklyDigest> {
    const weekStarting = this.getWeekStartDate();
    const competitors = competitionStorage.getCompetitors(companyId);
    const weeklyActivities = this.getRecentActivities(companyId, 7);
    const insights = competitionStorage.getActiveInsights(companyId);
    
    try {
      const prompt = this.buildWeeklyDigestPrompt(competitors, weeklyActivities, insights);
      const response = await this.callAI(prompt);
      
      return {
        id: `digest-${Date.now()}`,
        companyId,
        weekStarting,
        summary: response.summary,
        topInsights: insights.slice(0, 5),
        activitySummary: {
          totalActivities: weeklyActivities.length,
          byCategory: this.groupByCategory(weeklyActivities),
          topCompetitors: this.getTopActiveCompetitors(weeklyActivities)
        },
        recommendations: response.recommendations,
        swotAnalysis: response.swotAnalysis,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating weekly digest:', error);
      return this.generateFallbackDigest(companyId, weekStarting, weeklyActivities);
    }
  }

  async detectTrends(companyId: string): Promise<Array<{
    type: string;
    description: string;
    confidence: number;
    impact: 'positive' | 'negative' | 'neutral';
    competitors: string[];
  }>> {
    const activities = competitionStorage.getAllActivities(companyId);
    const last30Days = activities.filter(a => 
      new Date(a.detectedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    // Pattern detection
    const trends = [];

    // Funding trend
    const fundingActivities = last30Days.filter(a => a.type === 'funding_round');
    if (fundingActivities.length > 0) {
      trends.push({
        type: 'funding_activity',
        description: `${fundingActivities.length} competitors raised funding in the last 30 days`,
        confidence: 85,
        impact: 'negative' as const,
        competitors: [...new Set(fundingActivities.map(a => a.competitorId))]
      });
    }

    // Hiring trend
    const hiringActivities = last30Days.filter(a => a.type === 'job_posting');
    if (hiringActivities.length > 5) {
      trends.push({
        type: 'hiring_surge',
        description: `Increased hiring activity detected across ${new Set(hiringActivities.map(a => a.competitorId)).size} competitors`,
        confidence: 70,
        impact: 'negative' as const,
        competitors: [...new Set(hiringActivities.map(a => a.competitorId))]
      });
    }

    // Product launch trend
    const productLaunches = last30Days.filter(a => 
      a.type === 'product_launch' || a.type === 'feature_launch'
    );
    if (productLaunches.length > 0) {
      trends.push({
        type: 'product_innovation',
        description: `${productLaunches.length} new product/feature launches detected`,
        confidence: 80,
        impact: 'negative' as const,
        competitors: [...new Set(productLaunches.map(a => a.competitorId))]
      });
    }

    return trends;
  }

  // Helper Methods
  private buildActivityAnalysisPrompt(activity: CompetitorActivity, competitor: Competitor): string {
    return `
Analyze this competitive activity and provide insights:

Competitor: ${competitor.name}
Activity Type: ${activity.type}
Title: ${activity.title}
Description: ${activity.description}
Content: ${activity.content || 'N/A'}

Please provide:
1. A concise summary (2-3 sentences)
2. Key insights (3-5 bullet points)
3. Suggested actions for our startup
4. Sentiment analysis (positive/negative/neutral)

Format as JSON with fields: summary, insights, actionSuggestions, sentiment
`;
  }

  private buildInsightGenerationPrompt(competitors: Competitor[], activities: CompetitorActivity[]): string {
    const competitorNames = competitors.map(c => c.name).join(', ');
    const activitySummary = activities.map(a => `${a.type}: ${a.title}`).join('\n');

    return `
Analyze recent competitive activities and generate strategic insights:

Competitors: ${competitorNames}
Recent Activities (last 7 days):
${activitySummary}

Generate 3-5 strategic insights covering:
- Opportunities we should pursue
- Threats we should monitor
- Market trends emerging
- Competitive gaps we can exploit

Format as JSON with array of insights, each having: type, priority, title, description, actionItems, competitorId, confidence
`;
  }

  private buildWeeklyDigestPrompt(competitors: Competitor[], activities: CompetitorActivity[], insights: AIInsight[]): string {
    return `
Create a weekly competitive intelligence digest:

Competitors: ${competitors.length} tracked
Activities this week: ${activities.length}
Key insights: ${insights.length}

Provide:
1. Executive summary of the week
2. Top 5 recommendations for action
3. SWOT analysis considering competitive landscape

Format as JSON with fields: summary, recommendations, swotAnalysis
`;
  }

  private async callAI(prompt: string): Promise<any> {
    // Simulated AI response for demonstration
    // In a real implementation, this would call OpenAI, Claude, or another AI service
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          summary: "Competitor activity analyzed successfully",
          insights: ["Market expansion detected", "Pricing strategy shift observed"],
          actionSuggestions: ["Monitor pricing changes", "Evaluate market opportunity"],
          sentiment: "neutral",
          recommendations: ["Focus on product differentiation", "Accelerate feature development"],
          swotAnalysis: {
            strengths: ["Strong product-market fit"],
            weaknesses: ["Limited marketing budget"],
            opportunities: ["Competitor pricing gaps"],
            threats: ["Increased competition"]
          }
        });
      }, 1000);
    });
  }

  private calculateImportance(activity: CompetitorActivity, aiResponse: any): 'low' | 'medium' | 'high' | 'critical' {
    // Simple importance calculation based on activity type and AI confidence
    const highImportanceTypes: ActivityType[] = ['funding_round', 'product_launch', 'pricing_update'];
    const mediumImportanceTypes: ActivityType[] = ['feature_launch', 'team_change', 'partnership'];
    
    if (highImportanceTypes.includes(activity.type)) return 'high';
    if (mediumImportanceTypes.includes(activity.type)) return 'medium';
    return 'low';
  }

  private getRecentActivities(companyId: string, days: number): CompetitorActivity[] {
    const activities = competitionStorage.getAllActivities(companyId);
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return activities.filter(a => new Date(a.detectedAt) > cutoffDate);
  }

  private groupByCategory(activities: CompetitorActivity[]): Record<TrackingCategory, number> {
    const grouped: Record<string, number> = {};
    activities.forEach(activity => {
      grouped[activity.category] = (grouped[activity.category] || 0) + 1;
    });
    return grouped as Record<TrackingCategory, number>;
  }

  private getTopActiveCompetitors(activities: CompetitorActivity[]): string[] {
    const counts: Record<string, number> = {};
    activities.forEach(activity => {
      counts[activity.competitorId] = (counts[activity.competitorId] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([competitorId]) => competitorId);
  }

  private getWeekStartDate(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Start from Monday
    return new Date(now.setDate(diff)).toISOString().slice(0, 10);
  }

  private generateFallbackInsights(activities: CompetitorActivity[]): AIInsight[] {
    if (activities.length === 0) return [];

    const insights: AIInsight[] = [];
    const now = new Date().toISOString();

    // Generate basic insights based on activity patterns
    const fundingActivities = activities.filter(a => a.type === 'funding_round');
    if (fundingActivities.length > 0) {
      insights.push({
        id: `insight-funding-${Date.now()}`,
        companyId: activities[0].competitorId, // This should be corrected to get actual companyId
        type: 'threat',
        priority: 'high',
        title: 'Competitor Funding Activity',
        description: `${fundingActivities.length} competitors have raised funding recently`,
        actionItems: ['Review fundraising timeline', 'Prepare competitive positioning'],
        relatedActivities: fundingActivities.map(a => a.id),
        confidence: 85,
        status: 'new',
        createdAt: now
      });
    }

    return insights;
  }

  private generateFallbackDigest(companyId: string, weekStarting: string, activities: CompetitorActivity[]): WeeklyDigest {
    return {
      id: `digest-fallback-${Date.now()}`,
      companyId,
      weekStarting,
      summary: `This week we tracked ${activities.length} competitive activities across your monitored competitors.`,
      topInsights: [],
      activitySummary: {
        totalActivities: activities.length,
        byCategory: this.groupByCategory(activities),
        topCompetitors: this.getTopActiveCompetitors(activities)
      },
      recommendations: [
        'Continue monitoring competitor activities',
        'Focus on product differentiation',
        'Maintain competitive pricing strategy'
      ],
      createdAt: new Date().toISOString()
    };
  }
}

export const aiCompetitionEngine = AICompetitionEngine.getInstance();
