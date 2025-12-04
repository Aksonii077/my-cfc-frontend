
import { 
  Competitor, 
  CompetitorActivity, 
  CompetitorComparison, 
  AIInsight, 
  CompetitorAlert, 
  WeeklyDigest,
  CompetitorProfile 
} from '@/types/competition-tracker';

export class CompetitionStorage {
  private static instance: CompetitionStorage;
  
  static getInstance(): CompetitionStorage {
    if (!CompetitionStorage.instance) {
      CompetitionStorage.instance = new CompetitionStorage();
    }
    return CompetitionStorage.instance;
  }

  // Competitor Management
  saveCompetitor(competitor: Competitor): void {
    const competitors = this.getCompetitors(competitor.companyId);
    const existingIndex = competitors.findIndex(c => c.id === competitor.id);
    
    if (existingIndex >= 0) {
      competitors[existingIndex] = { ...competitor, updatedAt: new Date().toISOString() };
    } else {
      competitors.push(competitor);
    }
    
    localStorage.setItem(`competition-competitors-${competitor.companyId}`, JSON.stringify(competitors));
  }

  getCompetitors(companyId: string): Competitor[] {
    const stored = localStorage.getItem(`competition-competitors-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  getCompetitor(companyId: string, competitorId: string): Competitor | null {
    const competitors = this.getCompetitors(companyId);
    return competitors.find(c => c.id === competitorId) || null;
  }

  deleteCompetitor(companyId: string, competitorId: string): void {
    const competitors = this.getCompetitors(companyId);
    const filtered = competitors.filter(c => c.id !== competitorId);
    localStorage.setItem(`competition-competitors-${companyId}`, JSON.stringify(filtered));
    
    // Clean up related data
    this.deleteCompetitorActivities(competitorId);
    this.deleteCompetitorInsights(companyId, competitorId);
  }

  // Activity Management
  saveActivity(activity: CompetitorActivity): void {
    const activities = this.getActivities(activity.competitorId);
    const existingIndex = activities.findIndex(a => a.id === activity.id);
    
    if (existingIndex >= 0) {
      activities[existingIndex] = activity;
    } else {
      activities.push(activity);
    }
    
    // Sort by detection time (newest first)
    activities.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
    
    localStorage.setItem(`competition-activities-${activity.competitorId}`, JSON.stringify(activities));
  }

  getActivities(competitorId: string): CompetitorActivity[] {
    const stored = localStorage.getItem(`competition-activities-${competitorId}`);
    return stored ? JSON.parse(stored) : [];
  }

  getAllActivities(companyId: string): CompetitorActivity[] {
    const competitors = this.getCompetitors(companyId);
    const allActivities: CompetitorActivity[] = [];
    
    competitors.forEach(competitor => {
      const activities = this.getActivities(competitor.id);
      allActivities.push(...activities);
    });
    
    // Sort by detection time (newest first)
    return allActivities.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
  }

  deleteCompetitorActivities(competitorId: string): void {
    localStorage.removeItem(`competition-activities-${competitorId}`);
  }

  // Insights Management
  saveInsight(insight: AIInsight): void {
    const insights = this.getInsights(insight.companyId);
    const existingIndex = insights.findIndex(i => i.id === insight.id);
    
    if (existingIndex >= 0) {
      insights[existingIndex] = insight;
    } else {
      insights.push(insight);
    }
    
    localStorage.setItem(`competition-insights-${insight.companyId}`, JSON.stringify(insights));
  }

  getInsights(companyId: string): AIInsight[] {
    const stored = localStorage.getItem(`competition-insights-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  getActiveInsights(companyId: string): AIInsight[] {
    const insights = this.getInsights(companyId);
    const now = new Date();
    
    return insights.filter(insight => {
      if (insight.status === 'dismissed') return false;
      if (insight.expiresAt && new Date(insight.expiresAt) < now) return false;
      return true;
    });
  }

  deleteCompetitorInsights(companyId: string, competitorId: string): void {
    const insights = this.getInsights(companyId);
    const filtered = insights.filter(i => i.competitorId !== competitorId);
    localStorage.setItem(`competition-insights-${companyId}`, JSON.stringify(filtered));
  }

  // Alerts Management
  saveAlert(alert: CompetitorAlert): void {
    const alerts = this.getAlerts(alert.companyId);
    const existingIndex = alerts.findIndex(a => a.id === alert.id);
    
    if (existingIndex >= 0) {
      alerts[existingIndex] = { ...alert, updatedAt: new Date().toISOString() };
    } else {
      alerts.push(alert);
    }
    
    localStorage.setItem(`competition-alerts-${alert.companyId}`, JSON.stringify(alerts));
  }

  getAlerts(companyId: string): CompetitorAlert[] {
    const stored = localStorage.getItem(`competition-alerts-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  getActiveAlerts(companyId: string): CompetitorAlert[] {
    const alerts = this.getAlerts(companyId);
    return alerts.filter(alert => alert.isActive);
  }

  // Comparisons Management
  saveComparison(comparison: CompetitorComparison): void {
    const comparisons = this.getComparisons(comparison.companyId);
    const existingIndex = comparisons.findIndex(c => c.id === comparison.id);
    
    if (existingIndex >= 0) {
      comparisons[existingIndex] = { ...comparison, updatedAt: new Date().toISOString() };
    } else {
      comparisons.push(comparison);
    }
    
    localStorage.setItem(`competition-comparisons-${comparison.companyId}`, JSON.stringify(comparisons));
  }

  getComparisons(companyId: string): CompetitorComparison[] {
    const stored = localStorage.getItem(`competition-comparisons-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Weekly Digests
  saveWeeklyDigest(digest: WeeklyDigest): void {
    const digests = this.getWeeklyDigests(digest.companyId);
    const existingIndex = digests.findIndex(d => d.id === digest.id);
    
    if (existingIndex >= 0) {
      digests[existingIndex] = digest;
    } else {
      digests.push(digest);
    }
    
    localStorage.setItem(`competition-digests-${digest.companyId}`, JSON.stringify(digests));
  }

  getWeeklyDigests(companyId: string): WeeklyDigest[] {
    const stored = localStorage.getItem(`competition-digests-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Analytics and Statistics
  getCompetitionStats(companyId: string) {
    const competitors = this.getCompetitors(companyId);
    const allActivities = this.getAllActivities(companyId);
    const insights = this.getActiveInsights(companyId);
    
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentActivities = allActivities.filter(a => new Date(a.detectedAt) > lastWeek);
    const monthlyActivities = allActivities.filter(a => new Date(a.detectedAt) > lastMonth);
    
    return {
      totalCompetitors: competitors.length,
      activeCompetitors: competitors.filter(c => c.status === 'active').length,
      totalActivities: allActivities.length,
      recentActivities: recentActivities.length,
      monthlyActivities: monthlyActivities.length,
      totalInsights: insights.length,
      criticalInsights: insights.filter(i => i.priority === 'critical').length,
      
      // Activity breakdown
      activitiesByCategory: this.groupActivitiesByCategory(recentActivities),
      activitiesByCompetitor: this.groupActivitiesByCompetitor(recentActivities),
      
      // Trends
      weeklyTrend: this.calculateWeeklyTrend(companyId),
    };
  }

  private groupActivitiesByCategory(activities: CompetitorActivity[]) {
    const grouped: Record<string, number> = {};
    activities.forEach(activity => {
      grouped[activity.category] = (grouped[activity.category] || 0) + 1;
    });
    return grouped;
  }

  private groupActivitiesByCompetitor(activities: CompetitorActivity[]) {
    const grouped: Record<string, number> = {};
    activities.forEach(activity => {
      grouped[activity.competitorId] = (grouped[activity.competitorId] || 0) + 1;
    });
    return grouped;
  }

  private calculateWeeklyTrend(companyId: string) {
    const allActivities = this.getAllActivities(companyId);
    const now = new Date();
    const weeks = [];
    
    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      
      const weekActivities = allActivities.filter(a => {
        const activityDate = new Date(a.detectedAt);
        return activityDate >= weekStart && activityDate < weekEnd;
      });
      
      weeks.unshift({
        week: weekStart.toISOString().slice(0, 10),
        activities: weekActivities.length
      });
    }
    
    return weeks;
  }

  // Utility methods
  markActivityAsRead(competitorId: string, activityId: string): void {
    const activities = this.getActivities(competitorId);
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      activity.isRead = true;
      localStorage.setItem(`competition-activities-${competitorId}`, JSON.stringify(activities));
    }
  }

  bookmarkActivity(competitorId: string, activityId: string): void {
    const activities = this.getActivities(competitorId);
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      activity.isBookmarked = !activity.isBookmarked;
      localStorage.setItem(`competition-activities-${competitorId}`, JSON.stringify(activities));
    }
  }

  updateInsightStatus(companyId: string, insightId: string, status: AIInsight['status']): void {
    const insights = this.getInsights(companyId);
    const insight = insights.find(i => i.id === insightId);
    if (insight) {
      insight.status = status;
      localStorage.setItem(`competition-insights-${companyId}`, JSON.stringify(insights));
    }
  }

  // Export functionality
  exportCompetitionData(companyId: string): string {
    const data = {
      competitors: this.getCompetitors(companyId),
      activities: this.getAllActivities(companyId),
      insights: this.getInsights(companyId),
      alerts: this.getAlerts(companyId),
      comparisons: this.getComparisons(companyId),
      digests: this.getWeeklyDigests(companyId),
      stats: this.getCompetitionStats(companyId),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  // Search and filtering
  searchActivities(companyId: string, query: string, filters?: {
    competitorId?: string;
    category?: string;
    type?: string;
    importance?: string;
    dateRange?: { start: string; end: string };
  }): CompetitorActivity[] {
    let activities = this.getAllActivities(companyId);
    
    // Apply filters
    if (filters?.competitorId) {
      activities = activities.filter(a => a.competitorId === filters.competitorId);
    }
    
    if (filters?.category) {
      activities = activities.filter(a => a.category === filters.category);
    }
    
    if (filters?.type) {
      activities = activities.filter(a => a.type === filters.type);
    }
    
    if (filters?.importance) {
      activities = activities.filter(a => a.importance === filters.importance);
    }
    
    if (filters?.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      activities = activities.filter(a => {
        const activityDate = new Date(a.detectedAt);
        return activityDate >= start && activityDate <= end;
      });
    }
    
    // Apply text search
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      activities = activities.filter(a => 
        a.title.toLowerCase().includes(lowerQuery) ||
        a.description.toLowerCase().includes(lowerQuery) ||
        a.content?.toLowerCase().includes(lowerQuery) ||
        a.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    return activities;
  }
}

export const competitionStorage = CompetitionStorage.getInstance();
