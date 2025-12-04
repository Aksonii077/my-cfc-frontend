
import { 
  Vendor, 
  VendorAIScore, 
  PurchaseOrder, 
  InventoryItem, 
  DemandForecast,
  CostOptimization,
  SupplyChainAlert,
  SupplyChainMetrics,
  SupplyChainPrompt,
  SupplyChainContext,
  LogisticsPartner,
  OptimizationOpportunity
} from '@/types/supply-chain';

export class AISupplyEngine {
  private static instance: AISupplyEngine;

  static getInstance(): AISupplyEngine {
    if (!AISupplyEngine.instance) {
      AISupplyEngine.instance = new AISupplyEngine();
    }
    return AISupplyEngine.instance;
  }

  // Vendor Intelligence
  async calculateVendorAIScore(vendor: Vendor): Promise<VendorAIScore> {
    const performance = vendor.performance;
    
    // Calculate component scores
    const costEfficiency = this.calculateCostEfficiency(vendor);
    const reliability = (performance.onTimeDeliveryRate + performance.reliabilityScore * 10) / 2;
    const quality = performance.qualityRating * 10;
    const serviceLevel = this.calculateServiceLevel(vendor);
    
    // Overall weighted score
    const overallScore = Math.round(
      (costEfficiency * 0.3) + 
      (reliability * 0.3) + 
      (quality * 0.25) + 
      (serviceLevel * 0.15)
    );

    const riskAssessment = this.assessVendorRisk(vendor);
    const recommendation = this.generateVendorRecommendation(overallScore, vendor);

    return {
      overallScore,
      costEfficiency,
      reliability,
      quality,
      serviceLevel,
      riskAssessment,
      recommendation,
      lastUpdated: new Date().toISOString(),
      trends: this.calculateScoreTrends(vendor)
    };
  }

  private calculateCostEfficiency(vendor: Vendor): number {
    // Simulate cost efficiency calculation based on pricing vs market average
    const baseScore = vendor.performance.priceCompetitiveness * 10;
    const volumeBonus = vendor.performance.totalOrders > 10 ? 5 : 0;
    return Math.min(baseScore + volumeBonus, 100);
  }

  private calculateServiceLevel(vendor: Vendor): number {
    const responseScore = Math.max(100 - (vendor.performance.responseTime * 2), 0);
    const communicationScore = vendor.performance.disputeHistory.length < 2 ? 90 : 70;
    return (responseScore + communicationScore) / 2;
  }

  private assessVendorRisk(vendor: Vendor): 'low' | 'medium' | 'high' | 'critical' {
    let riskScore = 0;
    
    if (vendor.performance.onTimeDeliveryRate < 80) riskScore += 30;
    if (vendor.performance.disputeHistory.length > 2) riskScore += 20;
    if (vendor.performance.qualityRating < 7) riskScore += 25;
    if (!vendor.contactInfo.gstNumber) riskScore += 15;

    if (riskScore >= 70) return 'critical';
    if (riskScore >= 50) return 'high';
    if (riskScore >= 30) return 'medium';
    return 'low';
  }

  private generateVendorRecommendation(score: number, vendor: Vendor): string {
    if (score >= 85) {
      return `Excellent vendor - priority partner. Consider increasing order volume for better rates.`;
    } else if (score >= 70) {
      return `Good reliable vendor. Monitor ${vendor.performance.onTimeDeliveryRate < 90 ? 'delivery times' : 'pricing'} for optimization.`;
    } else if (score >= 55) {
      return `Average vendor. Consider renegotiating terms or finding alternatives for critical items.`;
    } else {
      return `Below average vendor. Recommend finding replacement or implementing strict monitoring.`;
    }
  }

  private calculateScoreTrends(vendor: Vendor): any[] {
    // Simulate trend calculation - in real implementation, this would analyze historical data
    return [
      {
        metric: 'delivery_performance',
        trend: vendor.performance.onTimeDeliveryRate > 85 ? 'improving' : 'declining',
        changePercent: Math.random() * 20 - 10,
        period: 'last_30_days'
      },
      {
        metric: 'cost_efficiency',
        trend: 'stable',
        changePercent: Math.random() * 10 - 5,
        period: 'last_30_days'
      }
    ];
  }

  // Smart Vendor Discovery
  async findOptimalVendors(requirements: {
    category: string;
    location?: string;
    maxPrice?: number;
    minQuality?: number;
    urgency?: 'low' | 'medium' | 'high';
  }): Promise<Vendor[]> {
    // Simulate vendor discovery with AI scoring
    const mockVendors = this.generateMockVendors(requirements);
    return mockVendors.sort((a, b) => b.aiScore.overallScore - a.aiScore.overallScore);
  }

  // Demand Forecasting
  async generateDemandForecast(item: InventoryItem): Promise<DemandForecast> {
    const consumption = item.consumptionRate;
    
    // AI-powered forecast calculation
    const seasonalFactor = this.calculateSeasonalFactor(item);
    const trendFactor = this.calculateTrendFactor(item);
    
    const nextWeek = Math.round(consumption.weekly * seasonalFactor * trendFactor);
    const nextMonth = Math.round(consumption.monthly * seasonalFactor * trendFactor);
    const nextQuarter = Math.round(nextMonth * 3 * 0.95); // Slight discount for longer periods

    return {
      nextWeek,
      nextMonth,
      nextQuarter,
      confidence: this.calculateForecastConfidence(item),
      factors: this.identifyForecastFactors(item),
      aiInsights: this.generateForecastInsights(item, nextMonth),
      lastUpdated: new Date().toISOString()
    };
  }

  private calculateSeasonalFactor(item: InventoryItem): number {
    const month = new Date().getMonth();
    // Simulate seasonal patterns
    if (item.category === 'packaging' && [9, 10, 11].includes(month)) {
      return 1.3; // Festival season boost
    }
    return 1.0;
  }

  private calculateTrendFactor(item: InventoryItem): number {
    // Simulate growth trend analysis
    return 1.05; // 5% growth trend
  }

  private calculateForecastConfidence(item: InventoryItem): number {
    let confidence = 80; // Base confidence
    
    if (item.consumptionRate.monthly > 0) confidence += 10;
    if (item.consumptionRate.seasonal.length > 0) confidence += 5;
    
    return Math.min(confidence, 95);
  }

  private identifyForecastFactors(item: InventoryItem): string[] {
    return [
      'Historical consumption patterns',
      'Seasonal trends',
      'Market growth indicators',
      'Current inventory levels'
    ];
  }

  private generateForecastInsights(item: InventoryItem, forecast: number): string[] {
    const insights = [];
    
    if (forecast > item.consumptionRate.monthly * 1.2) {
      insights.push('Higher than usual demand expected - consider advance ordering');
    }
    
    if (item.currentStock < forecast) {
      insights.push('Current stock insufficient for forecasted demand');
    }
    
    return insights;
  }

  // Smart Reorder System
  async generateReorderSuggestions(companyId: string): Promise<{
    urgent: InventoryItem[];
    recommended: InventoryItem[];
    optimal: InventoryItem[];
  }> {
    // Mock implementation - in real system, this would fetch actual inventory
    const inventory = this.getMockInventory(companyId);
    
    const urgent = inventory.filter(item => 
      item.currentStock <= item.minThreshold
    );
    
    const recommended = inventory.filter(item => 
      item.currentStock <= item.minThreshold * 1.5 && 
      item.currentStock > item.minThreshold
    );
    
    const optimal = inventory.filter(item => {
      const forecast = item.forecast;
      return item.currentStock < forecast.nextMonth && 
             item.currentStock > item.minThreshold * 1.5;
    });

    return { urgent, recommended, optimal };
  }

  // Cost Optimization Engine
  async analyzeCostOptimization(companyId: string): Promise<CostOptimization> {
    const opportunities = await this.identifyOptimizationOpportunities(companyId);
    const potentialSavings = opportunities.reduce((sum, opp) => sum + opp.potentialSaving, 0);
    
    return {
      opportunities,
      potentialSavings,
      priorityActions: this.generatePriorityActions(opportunities),
      lastAnalyzed: new Date().toISOString()
    };
  }

  private async identifyOptimizationOpportunities(companyId: string): Promise<OptimizationOpportunity[]> {
    return [
      {
        area: 'Vendor Consolidation',
        description: 'Consolidate orders with top 3 vendors for volume discounts',
        potentialSaving: 15000,
        effort: 'medium',
        timeline: '2-4 weeks',
        aiConfidence: 85
      },
      {
        area: 'Logistics Optimization',
        description: 'Switch to consolidated shipping for 25% cost reduction',
        potentialSaving: 8000,
        effort: 'low',
        timeline: '1-2 weeks',
        aiConfidence: 90
      },
      {
        area: 'Inventory Management',
        description: 'Optimize reorder quantities to reduce holding costs',
        potentialSaving: 5000,
        effort: 'low',
        timeline: '1 week',
        aiConfidence: 75
      },
      {
        area: 'Payment Terms',
        description: 'Negotiate better payment terms with top vendors',
        potentialSaving: 12000,
        effort: 'high',
        timeline: '4-6 weeks',
        aiConfidence: 70
      }
    ];
  }

  private generatePriorityActions(opportunities: OptimizationOpportunity[]): string[] {
    return opportunities
      .sort((a, b) => (b.potentialSaving / (b.effort === 'low' ? 1 : b.effort === 'medium' ? 2 : 3)) - 
                      (a.potentialSaving / (a.effort === 'low' ? 1 : a.effort === 'medium' ? 2 : 3)))
      .slice(0, 3)
      .map(opp => `${opp.area}: ${opp.description}`);
  }

  // Logistics Intelligence
  async optimizeLogistics(requirements: {
    destination: string;
    weight: number;
    urgency: 'standard' | 'express' | 'same_day';
    value: number;
  }): Promise<{
    recommended: LogisticsPartner;
    alternatives: LogisticsPartner[];
    reasoning: string;
  }> {
    const partners = this.getMockLogisticsPartners();
    
    // AI scoring based on requirements
    const scoredPartners = partners.map(partner => ({
      ...partner,
      score: this.calculateLogisticsScore(partner, requirements)
    })).sort((a, b) => b.score - a.score);

    return {
      recommended: scoredPartners[0],
      alternatives: scoredPartners.slice(1, 3),
      reasoning: this.generateLogisticsReasoning(scoredPartners[0], requirements)
    };
  }

  private calculateLogisticsScore(partner: LogisticsPartner, requirements: any): number {
    let score = partner.performance.reliability * 0.3;
    score += partner.performance.costEfficiency * 0.3;
    score += partner.performance.avgDeliveryTime < 24 && requirements.urgency === 'express' ? 20 : 10;
    score += partner.performance.successRate * 0.2;
    return score;
  }

  private generateLogisticsReasoning(partner: LogisticsPartner, requirements: any): string {
    return `${partner.name} recommended for ${requirements.urgency} delivery to ${requirements.destination}. 
    Strong performance: ${partner.performance.successRate}% success rate, 
    ${partner.performance.avgDeliveryTime}h avg delivery time, 
    cost-efficient with ${partner.performance.costEfficiency}/10 rating.`;
  }

  // AI Chat Assistant
  async processSupplyChainQuery(query: string, context: SupplyChainContext): Promise<SupplyChainPrompt> {
    const lowercaseQuery = query.toLowerCase();
    let response = '';
    let actions: string[] = [];
    let confidence = 80;

    // Vendor-related queries
    if (lowercaseQuery.includes('vendor') || lowercaseQuery.includes('supplier')) {
      if (lowercaseQuery.includes('best') || lowercaseQuery.includes('recommend')) {
        response = this.generateVendorRecommendationResponse(context);
        actions = ['view_vendors', 'compare_vendors'];
      } else if (lowercaseQuery.includes('performance')) {
        response = this.generateVendorPerformanceResponse(context);
        actions = ['vendor_analytics'];
      }
    }
    // Inventory queries
    else if (lowercaseQuery.includes('stock') || lowercaseQuery.includes('inventory')) {
      if (lowercaseQuery.includes('low') || lowercaseQuery.includes('running out')) {
        response = this.generateLowStockResponse(context);
        actions = ['reorder_items', 'view_alerts'];
      } else if (lowercaseQuery.includes('forecast')) {
        response = this.generateForecastResponse(context);
        actions = ['view_forecast', 'adjust_reorder'];
      }
    }
    // Cost queries
    else if (lowercaseQuery.includes('cost') || lowercaseQuery.includes('save') || lowercaseQuery.includes('budget')) {
      response = this.generateCostOptimizationResponse(context);
      actions = ['view_cost_analysis', 'implement_savings'];
    }
    // PO queries
    else if (lowercaseQuery.includes('purchase order') || lowercaseQuery.includes('po')) {
      response = this.generatePOResponse(context);
      actions = ['create_po', 'view_orders'];
    }
    // Default response
    else {
      response = this.generateDefaultResponse(context);
      actions = ['view_dashboard'];
      confidence = 60;
    }

    return {
      query,
      context,
      response,
      confidence,
      actions,
      timestamp: new Date().toISOString()
    };
  }

  private generateVendorRecommendationResponse(context: SupplyChainContext): string {
    const topVendor = context.activeVendors.sort((a, b) => b.aiScore.overallScore - a.aiScore.overallScore)[0];
    return `Based on AI analysis, ${topVendor?.name || 'GreenPack Solutions'} is your top-performing vendor with a ${topVendor?.aiScore.overallScore || 92}/100 score. They excel in reliability (${topVendor?.aiScore.reliability || 94}%) and cost efficiency. Consider increasing order volume for better rates.`;
  }

  private generateVendorPerformanceResponse(context: SupplyChainContext): string {
    const avgScore = context.activeVendors.reduce((sum, v) => sum + v.aiScore.overallScore, 0) / context.activeVendors.length;
    return `Your vendor portfolio has an average AI score of ${avgScore.toFixed(1)}/100. ${context.activeVendors.filter(v => v.aiScore.overallScore > 80).length} vendors are performing excellently. Consider optimizing underperforming vendors for 15-20% cost savings.`;
  }

  private generateLowStockResponse(context: SupplyChainContext): string {
    const lowStockItems = context.currentInventory.filter(item => item.currentStock <= item.minThreshold);
    return `⚠️ ${lowStockItems.length} items are below minimum threshold. Critical: ${lowStockItems.filter(item => item.currentStock <= item.minThreshold * 0.5).length} items need immediate reordering. AI suggests bulk ordering top 3 items for 12% savings.`;
  }

  private generateForecastResponse(context: SupplyChainContext): string {
    return `AI forecast shows 15% increased demand next month. Packaging materials need 25% stock increase. Recommend advancing orders for seasonal items. Current forecast accuracy: 87%.`;
  }

  private generateCostOptimizationResponse(context: SupplyChainContext): string {
    return `AI identified ₹42,000 potential monthly savings: Vendor consolidation (₹18k), logistics optimization (₹15k), payment terms renegotiation (₹9k). Priority: Implement logistics optimization first for quick wins.`;
  }

  private generatePOResponse(context: SupplyChainContext): string {
    const activePOs = context.recentOrders.filter(po => ['approved', 'sent', 'in_progress'].includes(po.status));
    return `You have ${activePOs.length} active purchase orders worth ₹${activePOs.reduce((sum, po) => sum + po.finalAmount, 0).toLocaleString('en-IN')}. AI suggests creating bulk PO for top 3 vendors for better rates.`;
  }

  private generateDefaultResponse(context: SupplyChainContext): string {
    return `Your supply chain is running smoothly. Overall efficiency: ${context.metrics.performanceScore}/100. ${context.alerts.filter(a => a.severity === 'high').length} high-priority alerts need attention. AI recommends focusing on cost optimization for maximum impact.`;
  }

  // Mock data generators for development
  private generateMockVendors(requirements: any): Vendor[] {
    // Mock vendor generation based on requirements
    return [];
  }

  private getMockInventory(companyId: string): InventoryItem[] {
    // Mock inventory data
    return [];
  }

  private getMockLogisticsPartners(): LogisticsPartner[] {
    return [
      {
        id: 'shiprocket',
        name: 'Shiprocket',
        type: 'courier',
        serviceAreas: ['All India'],
        pricing: { baseRate: 30, perKmRate: 1.5 },
        performance: {
          avgDeliveryTime: 48,
          successRate: 94,
          costEfficiency: 8.5,
          customerRating: 4.2,
          coverage: 95,
          reliability: 88
        },
        features: ['COD', 'Express', 'Tracking', 'API'],
        apiIntegration: true,
        contactInfo: {
          primaryContact: 'Support Team',
          email: 'support@shiprocket.in',
          phone: '+91-8882340000',
          website: 'https://shiprocket.in'
        },
        status: 'active'
      },
      {
        id: 'dunzo',
        name: 'Dunzo',
        type: 'last_mile',
        serviceAreas: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'],
        pricing: { baseRate: 25, perKmRate: 2.0 },
        performance: {
          avgDeliveryTime: 2,
          successRate: 96,
          costEfficiency: 7.8,
          customerRating: 4.4,
          coverage: 85,
          reliability: 92
        },
        features: ['Same Day', 'Express', 'Real-time Tracking'],
        apiIntegration: true,
        contactInfo: {
          primaryContact: 'Business Team',
          email: 'business@dunzo.com',
          phone: '+91-8050081111',
          website: 'https://dunzo.com'
        },
        status: 'active'
      }
    ];
  }
}

export const aiSupplyEngine = AISupplyEngine.getInstance();
