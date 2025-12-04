
import { Campaign, Lead, ContentPiece, FollowUpSequence, MarketingInsight, ContentTemplate } from '@/types/marketing';
import { Customer, Deal, Pipeline, TouchPoint, ConversionFunnel, ChannelROI, MarketingAutomation } from '@/types/crm';

class MarketingStorage {
  private static instance: MarketingStorage;

  private constructor() {}

  static getInstance(): MarketingStorage {
    if (!MarketingStorage.instance) {
      MarketingStorage.instance = new MarketingStorage();
    }
    return MarketingStorage.instance;
  }

  // Campaign Management
  getCampaigns(companyId: string): Campaign[] {
    const key = `marketing_campaigns_${companyId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : this.getDefaultCampaigns(companyId);
  }

  saveCampaign(campaign: Campaign): void {
    const campaigns = this.getCampaigns(campaign.companyId);
    const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
    
    if (existingIndex >= 0) {
      campaigns[existingIndex] = campaign;
    } else {
      campaigns.push(campaign);
    }
    
    const key = `marketing_campaigns_${campaign.companyId}`;
    localStorage.setItem(key, JSON.stringify(campaigns));
  }

  deleteCampaign(companyId: string, campaignId: string): void {
    const campaigns = this.getCampaigns(companyId);
    const filtered = campaigns.filter(c => c.id !== campaignId);
    const key = `marketing_campaigns_${companyId}`;
    localStorage.setItem(key, JSON.stringify(filtered));
  }

  // Lead Management
  getLeads(companyId: string): Lead[] {
    const key = `marketing_leads_${companyId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : this.getDefaultLeads(companyId);
  }

  saveLead(lead: Lead): void {
    const leads = this.getLeads(lead.companyId);
    const existingIndex = leads.findIndex(l => l.id === lead.id);
    
    if (existingIndex >= 0) {
      leads[existingIndex] = lead;
    } else {
      leads.push(lead);
    }
    
    const key = `marketing_leads_${lead.companyId}`;
    localStorage.setItem(key, JSON.stringify(leads));
  }

  // Content Management
  getContentPieces(companyId: string): ContentPiece[] {
    const key = `marketing_content_${companyId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveContentPiece(content: ContentPiece): void {
    const contents = this.getContentPieces(content.campaignId);
    const existingIndex = contents.findIndex(c => c.id === content.id);
    
    if (existingIndex >= 0) {
      contents[existingIndex] = content;
    } else {
      contents.push(content);
    }
    
    const key = `marketing_content_${content.campaignId}`;
    localStorage.setItem(key, JSON.stringify(contents));
  }

  // Customer Management
  getCustomers(companyId: string): Customer[] {
    const key = `crm_customers_${companyId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : this.getDefaultCustomers(companyId);
  }

  saveCustomer(customer: Customer): void {
    const customers = this.getCustomers(customer.companyId);
    const existingIndex = customers.findIndex(c => c.id === customer.id);
    
    if (existingIndex >= 0) {
      customers[existingIndex] = customer;
    } else {
      customers.push(customer);
    }
    
    const key = `crm_customers_${customer.companyId}`;
    localStorage.setItem(key, JSON.stringify(customers));
  }

  // Pipeline Management
  getPipelines(companyId: string): Pipeline[] {
    const key = `crm_pipelines_${companyId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : this.getDefaultPipelines(companyId);
  }

  savePipeline(pipeline: Pipeline): void {
    const pipelines = this.getPipelines(pipeline.companyId);
    const existingIndex = pipelines.findIndex(p => p.id === pipeline.id);
    
    if (existingIndex >= 0) {
      pipelines[existingIndex] = pipeline;
    } else {
      pipelines.push(pipeline);
    }
    
    const key = `crm_pipelines_${pipeline.companyId}`;
    localStorage.setItem(key, JSON.stringify(pipelines));
  }

  // Analytics & Insights
  getChannelROI(companyId: string): ChannelROI[] {
    const key = `marketing_roi_${companyId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : this.getDefaultChannelROI();
  }

  getMarketingInsights(companyId: string): MarketingInsight[] {
    const key = `marketing_insights_${companyId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : this.getDefaultInsights(companyId);
  }

  // Default Data Generators
  private getDefaultCampaigns(companyId: string): Campaign[] {
    return [
      {
        id: 'camp-1',
        companyId,
        name: 'Product Launch Campaign',
        type: 'product-launch',
        status: 'active',
        channels: ['instagram', 'email', 'whatsapp'],
        budget: {
          total: 50000,
          allocated: { instagram: 25000, email: 15000, whatsapp: 10000, linkedin: 0, website: 0, facebook: 0, youtube: 0 },
          spent: 18500
        },
        timeline: {
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          phases: []
        },
        goals: [
          { metric: 'leads', target: 500, current: 187, unit: 'leads' },
          { metric: 'conversions', target: 50, current: 23, unit: 'sales' }
        ],
        content: [],
        metrics: {
          totalImpressions: 45000,
          totalReach: 32000,
          totalEngagement: 2800,
          totalClicks: 1200,
          totalLeads: 187,
          totalConversions: 23,
          totalRevenue: 460000,
          costPerLead: 99,
          costPerAcquisition: 804,
          returnOnAdSpend: 24.8,
          channelPerformance: {
            instagram: { impressions: 25000, reach: 18000, engagement: 1800, clicks: 720, shares: 45, comments: 128, likes: 1200, saves: 89, leads: 98, conversions: 12, revenue: 240000, engagementRate: 7.2, clickThroughRate: 2.88, conversionRate: 1.67 },
            email: { impressions: 15000, reach: 12000, engagement: 800, clicks: 360, shares: 12, comments: 0, likes: 0, saves: 0, leads: 67, conversions: 8, revenue: 160000, engagementRate: 6.67, clickThroughRate: 3.0, conversionRate: 2.22 },
            whatsapp: { impressions: 5000, reach: 2000, engagement: 200, clicks: 120, shares: 8, comments: 15, likes: 0, saves: 0, leads: 22, conversions: 3, revenue: 60000, engagementRate: 10.0, clickThroughRate: 6.0, conversionRate: 2.5 },
            linkedin: { impressions: 0, reach: 0, engagement: 0, clicks: 0, shares: 0, comments: 0, likes: 0, saves: 0, leads: 0, conversions: 0, revenue: 0, engagementRate: 0, clickThroughRate: 0, conversionRate: 0 },
            website: { impressions: 0, reach: 0, engagement: 0, clicks: 0, shares: 0, comments: 0, likes: 0, saves: 0, leads: 0, conversions: 0, revenue: 0, engagementRate: 0, clickThroughRate: 0, conversionRate: 0 },
            facebook: { impressions: 0, reach: 0, engagement: 0, clicks: 0, shares: 0, comments: 0, likes: 0, saves: 0, leads: 0, conversions: 0, revenue: 0, engagementRate: 0, clickThroughRate: 0, conversionRate: 0 },
            youtube: { impressions: 0, reach: 0, engagement: 0, clicks: 0, shares: 0, comments: 0, likes: 0, saves: 0, leads: 0, conversions: 0, revenue: 0, engagementRate: 0, clickThroughRate: 0, conversionRate: 0 }
          }
        },
        aiInsights: [
          'Instagram Reels are performing 3x better than static posts',
          'Email open rates increase by 15% when sent on Tuesday mornings',
          'WhatsApp leads have highest conversion rate but lowest volume'
        ],
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z'
      }
    ];
  }

  private getDefaultLeads(companyId: string): Lead[] {
    return [
      {
        id: 'lead-1',
        companyId,
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '+91-9876543210',
        source: { type: 'social', specific: 'instagram-ad', campaign: 'camp-1', medium: 'social-media', term: 'ai-tools' },
        channel: 'instagram',
        campaignId: 'camp-1',
        score: 85,
        status: 'hot',
        stage: 'intent',
        tags: ['tech-founder', 'startup', 'high-value'],
        notes: 'Very interested in AI automation. Runs a 15-person startup.',
        interactions: [
          {
            id: 'int-1',
            leadId: 'lead-1',
            type: 'instagram-dm',
            channel: 'instagram',
            direction: 'inbound',
            message: 'Hi, I saw your post about AI automation. Can we discuss pricing?',
            outcome: 'positive',
            nextAction: 'Send pricing brochure',
            createdAt: '2024-01-18T14:30:00Z',
            metadata: {}
          }
        ],
        lastInteraction: '2024-01-18T14:30:00Z',
        nextFollowUp: '2024-01-22T10:00:00Z',
        estimatedValue: 50000,
        conversionProbability: 75,
        lifetimeValue: 150000,
        customFields: { company: 'TechStart Solutions', designation: 'Founder' },
        createdAt: '2024-01-15T09:15:00Z',
        updatedAt: '2024-01-18T14:35:00Z'
      },
      {
        id: 'lead-2',
        companyId,
        name: 'Priya Patel',
        email: 'priya@creativeminds.in',
        phone: '+91-9123456789',
        source: { type: 'referral', specific: 'existing-customer', medium: 'word-of-mouth' },
        channel: 'email',
        score: 65,
        status: 'warm',
        stage: 'consideration',
        tags: ['agency-owner', 'design', 'medium-value'],
        notes: 'Runs a creative agency. Looking for project management tools.',
        interactions: [],
        estimatedValue: 25000,
        conversionProbability: 45,
        lifetimeValue: 75000,
        customFields: { company: 'Creative Minds Agency', designation: 'Creative Director' },
        createdAt: '2024-01-16T11:20:00Z',
        updatedAt: '2024-01-16T11:20:00Z'
      }
    ];
  }

  private getDefaultCustomers(companyId: string): Customer[] {
    return [
      {
        id: 'cust-1',
        companyId,
        type: 'business',
        name: 'Amit Kumar',
        email: 'amit@digitalflow.com',
        phone: '+91-9988776655',
        company: 'DigitalFlow Solutions',
        designation: 'CEO',
        source: 'linkedin-campaign',
        acquisitionDate: '2023-12-01',
        totalValue: 120000,
        lifetimeValue: 350000,
        avgOrderValue: 40000,
        purchaseFrequency: 3,
        lastPurchase: '2024-01-10',
        status: 'active',
        healthScore: 85,
        preferences: {
          communicationChannel: ['email', 'whatsapp'],
          contentType: ['case-studies', 'webinars'],
          frequency: 'weekly',
          language: 'english',
          optedOut: false
        },
        interactions: [],
        purchases: [
          {
            id: 'purch-1',
            customerId: 'cust-1',
            orderId: 'ORD-001',
            productName: 'AI Automation Suite',
            amount: 40000,
            currency: 'INR',
            status: 'completed',
            paymentMethod: 'bank-transfer',
            createdAt: '2024-01-10T12:00:00Z'
          }
        ],
        tags: ['enterprise', 'high-value', 'advocate'],
        customFields: {},
        createdAt: '2023-12-01T10:00:00Z',
        updatedAt: '2024-01-10T12:30:00Z'
      }
    ];
  }

  private getDefaultPipelines(companyId: string): Pipeline[] {
    return [
      {
        id: 'pipe-1',
        companyId,
        name: 'Sales Pipeline',
        description: 'Main sales process for all products',
        isDefault: true,
        type: 'sales',
        stages: [
          { id: 'stage-1', name: 'Lead', description: 'New lead captured', order: 1, probability: 10, color: '#6b7280', automations: [], requirements: [] },
          { id: 'stage-2', name: 'Qualified', description: 'Lead has been qualified', order: 2, probability: 25, color: '#3b82f6', automations: [], requirements: [] },
          { id: 'stage-3', name: 'Demo Scheduled', description: 'Demo call scheduled', order: 3, probability: 50, color: '#f59e0b', automations: [], requirements: [] },
          { id: 'stage-4', name: 'Proposal Sent', description: 'Proposal has been sent', order: 4, probability: 75, color: '#10b981', automations: [], requirements: [] },
          { id: 'stage-5', name: 'Closed Won', description: 'Deal has been won', order: 5, probability: 100, color: '#059669', automations: [], requirements: [] },
          { id: 'stage-6', name: 'Closed Lost', description: 'Deal has been lost', order: 6, probability: 0, color: '#dc2626', automations: [], requirements: [] }
        ],
        metrics: {
          totalDeals: 45,
          totalValue: 1250000,
          conversionRate: 22,
          averageDealSize: 27777,
          averageSalesCycle: 21,
          stageConversion: {
            'stage-1': 80,
            'stage-2': 65,
            'stage-3': 45,
            'stage-4': 30,
            'stage-5': 22
          }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      }
    ];
  }

  private getDefaultChannelROI(): ChannelROI[] {
    return [
      {
        channel: 'instagram',
        spent: 25000,
        revenue: 350000,
        leads: 120,
        conversions: 28,
        roi: 1300,
        costPerLead: 208,
        costPerAcquisition: 893,
        lifetimeValue: 125000,
        paybackPeriod: 8.5
      },
      {
        channel: 'email',
        spent: 8000,
        revenue: 180000,
        leads: 85,
        conversions: 22,
        roi: 2150,
        costPerLead: 94,
        costPerAcquisition: 364,
        lifetimeValue: 81818,
        paybackPeriod: 4.5
      },
      {
        channel: 'whatsapp',
        spent: 5000,
        revenue: 95000,
        leads: 35,
        conversions: 12,
        roi: 1800,
        costPerLead: 143,
        costPerAcquisition: 417,
        lifetimeValue: 79167,
        paybackPeriod: 5.2
      }
    ];
  }

  private getDefaultInsights(companyId: string): MarketingInsight[] {
    return [
      {
        id: 'insight-1',
        type: 'opportunity',
        category: 'channel',
        title: 'WhatsApp showing highest conversion rates',
        description: 'WhatsApp leads convert at 34% vs industry average of 18%. Consider increasing budget allocation.',
        impact: 'high',
        actionable: true,
        recommendations: [
          'Increase WhatsApp budget by 40%',
          'Create more WhatsApp-specific content',
          'Set up automated WhatsApp sequences'
        ],
        data: { conversionRate: 34, industryAverage: 18, currentBudget: 5000 },
        createdAt: '2024-01-20T08:00:00Z'
      },
      {
        id: 'insight-2',
        type: 'warning',
        category: 'campaign',
        title: 'Email open rates declining',
        description: 'Email open rates have dropped 12% over the last 2 weeks. Subject lines may need optimization.',
        impact: 'medium',
        actionable: true,
        recommendations: [
          'A/B test subject lines',
          'Personalize sender names',
          'Review send times'
        ],
        data: { currentOpenRate: 18.5, previousOpenRate: 21.2, decline: 12.7 },
        createdAt: '2024-01-19T15:30:00Z'
      }
    ];
  }
}

export const marketingStorage = MarketingStorage.getInstance();
