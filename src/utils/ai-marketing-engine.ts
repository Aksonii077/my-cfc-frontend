import { Campaign, Lead, ContentPiece, MarketingInsight, ContentType, MarketingChannel } from '@/types/marketing';
import { promptHub } from './prompt-hub';

class AIMarketingEngine {
  private static instance: AIMarketingEngine;

  private constructor() {}

  static getInstance(): AIMarketingEngine {
    if (!AIMarketingEngine.instance) {
      AIMarketingEngine.instance = new AIMarketingEngine();
    }
    return AIMarketingEngine.instance;
  }

  // Natural Language Query Processing
  async processQuery(companyId: string, query: string): Promise<string> {
    console.log('AI Marketing Engine: Processing query:', query);
    
    await this.delay(800);
    
    const lowerQuery = query.toLowerCase();
    
    // Campaign-related queries
    if (lowerQuery.includes('campaign')) {
      if (lowerQuery.includes('create') || lowerQuery.includes('new')) {
        return "I can help you create a new marketing campaign! Let me know your goals, target audience, and preferred channels. For example: 'Create a lead generation campaign for startups using Instagram and email for 30 days.'";
      }
      if (lowerQuery.includes('performance') || lowerQuery.includes('analytics')) {
        return "I can analyze your campaign performance and provide insights on ROI, engagement rates, and conversion metrics. Would you like me to analyze a specific campaign or all active campaigns?";
      }
      return "I can help with campaign creation, performance analysis, budget optimization, and strategy recommendations. What specific aspect of campaign management interests you?";
    }
    
    // Lead-related queries
    if (lowerQuery.includes('lead')) {
      if (lowerQuery.includes('find') || lowerQuery.includes('qualified')) {
        return "I can help identify your most qualified leads based on engagement, source quality, and behavioral patterns. I'll analyze lead scores, interaction history, and conversion probability to prioritize your outreach.";
      }
      if (lowerQuery.includes('score') || lowerQuery.includes('ranking')) {
        return "I use advanced scoring algorithms considering lead source, engagement level, company size, and interaction frequency. High-scoring leads (80+) should be contacted within 24 hours for best results.";
      }
      return "I can help with lead scoring, qualification, follow-up recommendations, and conversion optimization. What would you like to know about your leads?";
    }
    
    // Content-related queries
    if (lowerQuery.includes('content')) {
      if (lowerQuery.includes('ideas') || lowerQuery.includes('create')) {
        return "I can generate content ideas for social media, email campaigns, and blog posts. Tell me your target audience, industry, and preferred tone, and I'll create engaging content suggestions with captions, hashtags, and posting schedules.";
      }
      if (lowerQuery.includes('optimize') || lowerQuery.includes('improve')) {
        return "I can analyze your content performance and suggest improvements for better engagement. This includes optimal posting times, hashtag strategies, visual recommendations, and A/B testing ideas.";
      }
      return "I can help with content creation, optimization, scheduling, and performance analysis across all marketing channels. What type of content support do you need?";
    }
    
    // Analytics and insights
    if (lowerQuery.includes('analytics') || lowerQuery.includes('insights') || lowerQuery.includes('data')) {
      return "I provide comprehensive marketing analytics including ROI analysis, channel performance comparison, customer journey mapping, and predictive insights. I can identify trends, anomalies, and optimization opportunities across all your campaigns.";
    }
    
    // Budget and ROI
    if (lowerQuery.includes('budget') || lowerQuery.includes('roi') || lowerQuery.includes('cost')) {
      return "I can help optimize your marketing budget allocation across channels, predict ROI for different strategies, and identify cost-effective growth opportunities. Would you like a budget analysis or recommendations for upcoming campaigns?";
    }
    
    // Strategy and planning
    if (lowerQuery.includes('strategy') || lowerQuery.includes('plan')) {
      return "I can help develop comprehensive marketing strategies including market positioning, competitive analysis, channel selection, and timeline planning. Tell me about your business goals and I'll create a customized marketing roadmap.";
    }
    
    // Default helpful response
    return "I'm your AI Marketing Assistant! I can help with:\n\n🎯 Campaign creation and optimization\n📊 Lead scoring and qualification\n✍️ Content generation and ideas\n📈 Performance analytics and insights\n💰 Budget allocation and ROI analysis\n🚀 Marketing strategy development\n\nTry asking: 'Create a social media campaign' or 'Show me my best leads' or 'Give me content ideas for Instagram'";
  }

  // Campaign Planning AI
  async generateCampaign(prompt: string, context: any = {}): Promise<Partial<Campaign>> {
    console.log('AI: Generating campaign for:', prompt);
    
    // Simulate AI processing
    await this.delay(1500);

    // Parse the prompt to extract campaign details
    const campaignType = this.extractCampaignType(prompt);
    const channels = this.extractChannels(prompt);
    const timeline = this.extractTimeline(prompt);
    
    return {
      name: this.generateCampaignName(prompt),
      type: campaignType,
      channels: channels,
      timeline: {
        startDate: timeline.start,
        endDate: timeline.end,
        phases: this.generateCampaignPhases(campaignType, timeline)
      },
      goals: this.generateCampaignGoals(campaignType),
      budget: this.generateBudgetAllocation(channels),
      aiInsights: this.generateCampaignInsights(campaignType, channels)
    };
  }

  // Content Generation AI
  async generateContent(type: ContentType, channel: MarketingChannel, context: any): Promise<Partial<ContentPiece>> {
    console.log('AI: Generating content for:', type, channel);
    
    await this.delay(1000);

    const content = this.getContentTemplate(type, channel, context);
    
    return {
      type,
      channel,
      title: content.title,
      content: content.text,
      aiGenerated: true,
      brandVoice: context.tone || 'professional',
      language: context.language || 'english',
      performance: {
        impressions: 0,
        reach: 0,
        engagement: 0,
        clicks: 0,
        shares: 0,
        comments: 0,
        likes: 0,
        saves: 0,
        leads: 0,
        conversions: 0,
        revenue: 0,
        engagementRate: 0,
        clickThroughRate: 0,
        conversionRate: 0
      }
    };
  }

  // Lead Scoring AI
  async scoreLeads(leads: Lead[]): Promise<Lead[]> {
    console.log('AI: Scoring', leads.length, 'leads');
    
    return leads.map(lead => ({
      ...lead,
      score: this.calculateLeadScore(lead),
      status: this.determineLeadStatus(lead),
      conversionProbability: this.predictConversionProbability(lead)
    }));
  }

  // Follow-up Recommendations AI
  async generateFollowUpRecommendations(lead: Lead): Promise<string[]> {
    console.log('AI: Generating follow-up for lead:', lead.name);
    
    await this.delay(800);

    const recommendations = [];
    
    if (lead.score > 80) {
      recommendations.push('Schedule a demo call within 24 hours');
      recommendations.push('Send personalized pricing proposal');
      recommendations.push('Connect on LinkedIn with personal message');
    } else if (lead.score > 60) {
      recommendations.push('Send case study relevant to their industry');
      recommendations.push('Invite to upcoming webinar');
      recommendations.push('Follow up with value-added content');
    } else {
      recommendations.push('Add to nurture email sequence');
      recommendations.push('Share educational blog content');
      recommendations.push('Engage with their social media posts');
    }

    return recommendations;
  }

  // Campaign Performance Analysis AI
  async analyzeCampaignPerformance(campaign: Campaign): Promise<MarketingInsight[]> {
    console.log('AI: Analyzing campaign performance for:', campaign.name);
    
    await this.delay(1200);

    const insights: MarketingInsight[] = [];

    // ROI Analysis
    if (campaign.metrics.returnOnAdSpend > 500) {
      insights.push({
        id: `insight-${Date.now()}-1`,
        type: 'success',
        category: 'campaign',
        title: 'Excellent ROI Performance',
        description: `Campaign is generating ${campaign.metrics.returnOnAdSpend}% ROI, well above industry benchmark of 300%.`,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Scale up budget for this campaign',
          'Apply successful elements to other campaigns',
          'Document winning strategies for future use'
        ],
        data: { roi: campaign.metrics.returnOnAdSpend, benchmark: 300 },
        createdAt: new Date().toISOString()
      });
    }

    // Channel Performance
    const bestChannel = Object.entries(campaign.metrics.channelPerformance)
      .sort(([,a], [,b]) => b.conversionRate - a.conversionRate)[0];

    insights.push({
      id: `insight-${Date.now()}-2`,
      type: 'opportunity',
      category: 'channel',
      title: `${bestChannel[0]} showing best conversion rates`,
      description: `${bestChannel[0]} has ${bestChannel[1].conversionRate.toFixed(1)}% conversion rate. Consider reallocating budget.`,
      impact: 'medium',
      actionable: true,
      recommendations: [
        `Increase ${bestChannel[0]} budget by 25%`,
        `Create more ${bestChannel[0]}-specific content`,
        `Study ${bestChannel[0]} success factors for other channels`
      ],
      data: { channel: bestChannel[0], conversionRate: bestChannel[1].conversionRate },
      createdAt: new Date().toISOString()
    });

    return insights;
  }

  // Content Performance Optimization AI
  async optimizeContent(content: ContentPiece): Promise<string[]> {
    console.log('AI: Optimizing content:', content.title);
    
    await this.delay(900);

    const suggestions = [];

    if (content.performance.engagementRate < 2) {
      suggestions.push('Add more engaging hooks in the first 3 seconds');
      suggestions.push('Include trending hashtags relevant to your niche');
      suggestions.push('Add call-to-action buttons or interactive elements');
    }

    if (content.performance.clickThroughRate < 1) {
      suggestions.push('Strengthen your call-to-action');
      suggestions.push('Create more curiosity in your captions');
      suggestions.push('Use more compelling visuals or thumbnails');
    }

    suggestions.push('Test posting at different times of day');
    suggestions.push('Experiment with different content formats');

    return suggestions;
  }

  // Natural Language Campaign Planning
  async planCampaignFromNL(input: string): Promise<any> {
    console.log('AI: Planning campaign from natural language:', input);
    
    // Extract key information from natural language
    const analysis = {
      objective: this.extractObjective(input),
      target_audience: this.extractTargetAudience(input),
      timeline: this.extractTimelineFromNL(input),
      budget: this.extractBudgetFromNL(input),
      channels: this.extractChannelsFromNL(input)
    };

    return {
      campaign_structure: this.generateCampaignStructure(analysis),
      content_calendar: this.generateContentCalendar(analysis),
      budget_allocation: this.generateBudgetBreakdown(analysis),
      success_metrics: this.generateSuccessMetrics(analysis),
      timeline: this.generateDetailedTimeline(analysis)
    };
  }

  // Helper Methods
  private extractCampaignType(prompt: string): Campaign['type'] {
    if (prompt.toLowerCase().includes('launch')) return 'product-launch';
    if (prompt.toLowerCase().includes('awareness') || prompt.toLowerCase().includes('brand')) return 'brand-awareness';
    if (prompt.toLowerCase().includes('lead') || prompt.toLowerCase().includes('generate')) return 'lead-generation';
    if (prompt.toLowerCase().includes('retention') || prompt.toLowerCase().includes('customer')) return 'retention';
    if (prompt.toLowerCase().includes('hiring') || prompt.toLowerCase().includes('recruit')) return 'hiring';
    return 'lead-generation';
  }

  private extractChannels(prompt: string): MarketingChannel[] {
    const channels: MarketingChannel[] = [];
    if (prompt.toLowerCase().includes('instagram') || prompt.toLowerCase().includes('insta')) channels.push('instagram');
    if (prompt.toLowerCase().includes('whatsapp') || prompt.toLowerCase().includes('wa')) channels.push('whatsapp');
    if (prompt.toLowerCase().includes('email') || prompt.toLowerCase().includes('mail')) channels.push('email');
    if (prompt.toLowerCase().includes('linkedin') || prompt.toLowerCase().includes('linkedin')) channels.push('linkedin');
    
    // Default channels if none specified
    if (channels.length === 0) {
      return ['instagram', 'email', 'whatsapp'];
    }
    
    return channels;
  }

  private extractTimeline(prompt: string): { start: string, end: string } {
    const today = new Date();
    const start = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
    
    let duration = 30; // default 30 days
    if (prompt.includes('week')) duration = 7;
    if (prompt.includes('2 week')) duration = 14;
    if (prompt.includes('month')) duration = 30;
    if (prompt.includes('quarter')) duration = 90;
    
    const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  private generateCampaignName(prompt: string): string {
    const product = this.extractProductName(prompt) || 'Product';
    const type = this.extractCampaignType(prompt);
    
    const nameTemplates = {
      'product-launch': `${product} Launch Campaign`,
      'brand-awareness': `${product} Brand Awareness Drive`,
      'lead-generation': `${product} Lead Generation Campaign`,
      'retention': `${product} Customer Retention Campaign`,
      'hiring': `${product} Talent Acquisition Campaign`,
      'feedback': `${product} Feedback Collection Campaign`
    };
    
    return nameTemplates[type] || `${product} Marketing Campaign`;
  }

  private extractProductName(prompt: string): string | null {
    // Simple extraction - in real implementation, use NLP
    const words = prompt.split(' ');
    const productKeywords = ['app', 'tool', 'platform', 'service', 'product', 'software', 'course'];
    
    for (let i = 0; i < words.length; i++) {
      if (productKeywords.includes(words[i].toLowerCase()) && i > 0) {
        return words[i - 1];
      }
    }
    
    return null;
  }

  private generateCampaignPhases(type: Campaign['type'], timeline: any): any[] {
    const duration = Math.ceil((new Date(timeline.end).getTime() - new Date(timeline.start).getTime()) / (1000 * 60 * 60 * 24));
    
    if (duration <= 7) {
      return [
        { id: 'phase-1', name: 'Launch', description: 'Campaign launch and initial push', startDate: timeline.start, endDate: timeline.end, tasks: [], status: 'pending' }
      ];
    }
    
    const phaseLength = Math.ceil(duration / 3);
    const start = new Date(timeline.start);
    
    return [
      {
        id: 'phase-1',
        name: 'Awareness',
        description: 'Build awareness and generate interest',
        startDate: timeline.start,
        endDate: new Date(start.getTime() + phaseLength * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tasks: [],
        status: 'pending'
      },
      {
        id: 'phase-2', 
        name: 'Engagement',
        description: 'Drive engagement and capture leads',
        startDate: new Date(start.getTime() + phaseLength * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(start.getTime() + 2 * phaseLength * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        tasks: [],
        status: 'pending'
      },
      {
        id: 'phase-3',
        name: 'Conversion',
        description: 'Focus on conversions and closing deals',
        startDate: new Date(start.getTime() + 2 * phaseLength * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: timeline.end,
        tasks: [],
        status: 'pending'
      }
    ];
  }

  private generateCampaignGoals(type: Campaign['type']): any[] {
    const goalTemplates = {
      'product-launch': [
        { metric: 'leads', target: 200, current: 0, unit: 'leads' },
        { metric: 'conversions', target: 20, current: 0, unit: 'sales' },
        { metric: 'reach', target: 10000, current: 0, unit: 'people' }
      ],
      'brand-awareness': [
        { metric: 'reach', target: 50000, current: 0, unit: 'people' },
        { metric: 'engagement', target: 2000, current: 0, unit: 'interactions' },
        { metric: 'brand-awareness', target: 15, current: 0, unit: '% increase' }
      ],
      'lead-generation': [
        { metric: 'leads', target: 500, current: 0, unit: 'leads' },
        { metric: 'conversions', target: 50, current: 0, unit: 'sales' }
      ]
    };
    
    return goalTemplates[type] || goalTemplates['lead-generation'];
  }

  private generateBudgetAllocation(channels: MarketingChannel[]): any {
    const totalBudget = 50000; // Default budget
    const allocation: any = {};
    
    // Equal allocation for now - can be made smarter
    const perChannel = Math.floor(totalBudget / channels.length);
    
    ['instagram', 'whatsapp', 'email', 'linkedin', 'website', 'facebook', 'youtube'].forEach(channel => {
      allocation[channel] = channels.includes(channel as MarketingChannel) ? perChannel : 0;
    });
    
    return {
      total: totalBudget,
      allocated: allocation,
      spent: 0
    };
  }

  private generateCampaignInsights(type: Campaign['type'], channels: MarketingChannel[]): string[] {
    return [
      `${channels[0]} typically shows highest engagement for ${type} campaigns`,
      'Post timing optimization can improve reach by 40%',
      'Video content performs 3x better than static images',
      'Personalized messaging increases conversion rates by 25%'
    ];
  }

  private getContentTemplate(type: ContentType, channel: MarketingChannel, context: any): { title: string, text: string } {
    const templates = {
      'instagram-post': {
        title: `${context.product || 'Product'} Launch Post`,
        text: `🚀 Exciting news! We're launching ${context.product || 'our new product'} that will revolutionize ${context.industry || 'your workflow'}!\n\n✨ Key features:\n• Feature 1\n• Feature 2\n• Feature 3\n\n👇 Comment "INTERESTED" to learn more!\n\n#startup #innovation #${context.product?.toLowerCase() || 'product'}`
      },
      'whatsapp-broadcast': {
        title: `${context.product || 'Product'} Launch Announcement`,
        text: `Hi [Name],\n\nHope you're doing well! 🌟\n\nI wanted to personally share some exciting news - we've just launched ${context.product || 'our new solution'} that helps ${context.benefit || 'businesses grow faster'}.\n\n🎯 Perfect for: ${context.audience || 'Your business'}\n💡 Key benefit: ${context.benefit || 'Save time and increase efficiency'}\n\nWould love to show you a quick demo. Are you free for a 15-minute call this week?\n\nBest regards,\n[Your Name]`
      },
      'email-newsletter': {
        title: `${context.product || 'Product'} Launch - Exclusive Access`,
        text: `Subject: 🚀 You're invited - Exclusive early access to ${context.product || 'our new product'}\n\nHi [Name],\n\nAs one of our valued subscribers, you get exclusive early access to ${context.product || 'our latest innovation'}.\n\n🎯 What it does: ${context.description || 'Solves your biggest challenges'}\n⚡ Why it matters: ${context.benefit || 'Saves you time and money'}\n🎁 Special offer: 30% off for early adopters\n\n[CTA Button: Get Early Access]\n\nQuestions? Simply reply to this email.\n\nCheers,\n[Your Name]`
      }
    };
    
    return templates[type] || { title: 'Generated Content', text: 'AI-generated content for your campaign.' };
  }

  private calculateLeadScore(lead: Lead): number {
    let score = 0;
    
    // Source scoring
    if (lead.source.type === 'referral') score += 30;
    else if (lead.source.type === 'organic') score += 25;
    else if (lead.source.type === 'paid') score += 20;
    else score += 10;
    
    // Interaction scoring
    score += lead.interactions.length * 10;
    
    // Recent activity
    if (lead.lastInteraction) {
      const daysSince = (Date.now() - new Date(lead.lastInteraction).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 1) score += 20;
      else if (daysSince < 7) score += 10;
      else if (daysSince < 30) score += 5;
    }
    
    // Company size (if available)
    if (lead.customFields?.company) score += 15;
    
    return Math.min(100, score);
  }

  private determineLeadStatus(lead: Lead): Lead['status'] {
    if (lead.score > 80) return 'hot';
    if (lead.score > 60) return 'warm';
    return 'cold';
  }

  private predictConversionProbability(lead: Lead): number {
    // Simple probability based on score and interactions
    let probability = lead.score * 0.8;
    
    if (lead.interactions.length > 2) probability += 10;
    if (lead.source.type === 'referral') probability += 15;
    
    return Math.min(100, Math.round(probability));
  }

  private extractObjective(input: string): string {
    if (input.includes('launch')) return 'product-launch';
    if (input.includes('awareness')) return 'brand-awareness';
    if (input.includes('leads')) return 'lead-generation';
    return 'general-marketing';
  }

  private extractTargetAudience(input: string): string {
    const audiences = ['founders', 'startups', 'small business', 'enterprise', 'freelancers', 'agencies'];
    for (const audience of audiences) {
      if (input.toLowerCase().includes(audience)) return audience;
    }
    return 'general';
  }

  private extractTimelineFromNL(input: string): { duration: number, unit: string } {
    if (input.includes('week')) return { duration: 1, unit: 'weeks' };
    if (input.includes('month')) return { duration: 1, unit: 'months' };
    return { duration: 2, unit: 'weeks' };
  }

  private extractBudgetFromNL(input: string): number {
    const budgetMatch = input.match(/(\d+)k?/);
    if (budgetMatch) {
      return parseInt(budgetMatch[1]) * (input.includes('k') ? 1000 : 1);
    }
    return 25000; // default
  }

  private extractChannelsFromNL(input: string): MarketingChannel[] {
    const channels: MarketingChannel[] = [];
    if (input.includes('instagram')) channels.push('instagram');
    if (input.includes('whatsapp')) channels.push('whatsapp');
    if (input.includes('email')) channels.push('email');
    if (input.includes('linkedin')) channels.push('linkedin');
    
    return channels.length > 0 ? channels : ['instagram', 'email'];
  }

  private generateCampaignStructure(analysis: any): any {
    return {
      phases: this.generateCampaignPhases(analysis.objective, analysis.timeline),
      content_types: this.getRecommendedContentTypes(analysis.channels),
      posting_schedule: this.generatePostingSchedule(analysis.channels)
    };
  }

  private generateContentCalendar(analysis: any): any {
    return {
      week_1: ['awareness-posts', 'educational-content', 'behind-scenes'],
      week_2: ['product-features', 'testimonials', 'social-proof'],
      week_3: ['conversion-focused', 'limited-offers', 'urgency-content'],
      week_4: ['retention', 'community-building', 'feedback-collection']
    };
  }

  private generateBudgetBreakdown(analysis: any): any {
    const total = analysis.budget || 25000;
    return {
      content_creation: Math.floor(total * 0.3),
      paid_promotion: Math.floor(total * 0.5),
      tools_software: Math.floor(total * 0.1),
      contingency: Math.floor(total * 0.1)
    };
  }

  private generateSuccessMetrics(analysis: any): any {
    return {
      primary: this.getPrimaryMetrics(analysis.objective),
      secondary: this.getSecondaryMetrics(analysis.objective),
      tracking_frequency: 'daily'
    };
  }

  private generateDetailedTimeline(analysis: any): any {
    return {
      preparation: '3-5 days',
      execution: `${analysis.timeline.duration} ${analysis.timeline.unit}`,
      analysis: '2-3 days',
      optimization: 'ongoing'
    };
  }

  private getRecommendedContentTypes(channels: MarketingChannel[]): string[] {
    const types = ['educational-posts', 'behind-the-scenes', 'product-demos', 'testimonials'];
    if (channels.includes('instagram')) types.push('reels', 'carousels', 'stories');
    if (channels.includes('email')) types.push('newsletters', 'case-studies');
    if (channels.includes('whatsapp')) types.push('personal-updates', 'exclusive-offers');
    return types;
  }

  private generatePostingSchedule(channels: MarketingChannel[]): any {
    const schedule: any = {};
    
    channels.forEach(channel => {
      switch (channel) {
        case 'instagram':
          schedule[channel] = { frequency: 'daily', best_times: ['9AM', '6PM'] };
          break;
        case 'email':
          schedule[channel] = { frequency: 'weekly', best_times: ['Tuesday 10AM'] };
          break;
        case 'whatsapp':
          schedule[channel] = { frequency: 'bi-weekly', best_times: ['Friday 4PM'] };
          break;
        default:
          schedule[channel] = { frequency: 'weekly', best_times: ['10AM'] };
      }
    });
    
    return schedule;
  }

  private getPrimaryMetrics(objective: string): string[] {
    const metrics: Record<string, string[]> = {
      'product-launch': ['sign-ups', 'pre-orders', 'demo-requests'],
      'brand-awareness': ['reach', 'impressions', 'brand-mentions'],
      'lead-generation': ['leads', 'email-signups', 'contact-forms']
    };
    
    return metrics[objective] || ['engagement', 'reach', 'clicks'];
  }

  private getSecondaryMetrics(objective: string): string[] {
    return ['engagement-rate', 'click-through-rate', 'cost-per-acquisition', 'social-shares'];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const aiMarketingEngine = AIMarketingEngine.getInstance();
