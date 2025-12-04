
import { EnhancedTransaction, Invoice, CashFlowForecast, BurnRateAnalysis, FinancialAlert, ConversationalQuery } from '@/types/finance';
import { financeStorage } from './financeStorage';

export class AIFinanceEngine {
  private static instance: AIFinanceEngine;
  
  static getInstance(): AIFinanceEngine {
    if (!AIFinanceEngine.instance) {
      AIFinanceEngine.instance = new AIFinanceEngine();
    }
    return AIFinanceEngine.instance;
  }

  // Transaction Classification
  async classifyTransaction(description: string, amount: number, vendor?: string): Promise<{
    category: string;
    confidence: number;
    tags: string[];
    aiClassification: string;
  }> {
    // Simulate AI classification with real-world patterns
    const patterns = {
      'uber|ola|taxi|cab|auto': { category: 'Travel & Transportation', tags: ['travel', 'business'] },
      'zomato|swiggy|food|restaurant|meal': { category: 'Team Meals & Entertainment', tags: ['food', 'team'] },
      'aws|google cloud|azure|digitalocean|server': { category: 'Cloud Infrastructure', tags: ['tech', 'infrastructure'] },
      'figma|canva|adobe|sketch|design': { category: 'Design Tools', tags: ['design', 'software'] },
      'zoom|slack|notion|productivity': { category: 'Productivity Software', tags: ['software', 'productivity'] },
      'salary|wage|payment|payroll': { category: 'Payroll & Benefits', tags: ['hr', 'salary'] },
      'rent|office|coworking|workspace': { category: 'Office & Facilities', tags: ['office', 'facilities'] },
      'internet|broadband|wifi|telecom': { category: 'Utilities & Communication', tags: ['utilities', 'communication'] },
      'marketing|ads|facebook|google ads|promotion': { category: 'Marketing & Advertising', tags: ['marketing', 'ads'] },
      'legal|lawyer|compliance|filing': { category: 'Legal & Compliance', tags: ['legal', 'compliance'] },
      'training|course|certification|learning': { category: 'Training & Development', tags: ['training', 'development'] },
    };

    const desc = description.toLowerCase();
    const vendorName = vendor?.toLowerCase() || '';
    const searchText = `${desc} ${vendorName}`;

    for (const [pattern, result] of Object.entries(patterns)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(searchText)) {
        return {
          category: result.category,
          confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
          tags: result.tags,
          aiClassification: `${result.category} - Auto-classified with ${Math.round((0.85 + Math.random() * 0.1) * 100)}% confidence`
        };
      }
    }

    // Default classification for unknown patterns
    return {
      category: 'General Business Expense',
      confidence: 0.6,
      tags: ['uncategorized'],
      aiClassification: 'General Business Expense - Manual review recommended'
    };
  }

  // Anomaly Detection
  detectAnomalies(companyId: string, newTransaction: EnhancedTransaction): FinancialAlert[] {
    const transactions = financeStorage.getTransactions(companyId);
    const alerts: FinancialAlert[] = [];

    // Same vendor amount anomaly
    const vendorTransactions = transactions.filter(t => 
      t.vendor === newTransaction.vendor && t.vendor && t.id !== newTransaction.id
    );

    if (vendorTransactions.length > 0) {
      const avgAmount = vendorTransactions.reduce((sum, t) => sum + t.amount, 0) / vendorTransactions.length;
      const threshold = avgAmount * 2.5; // 250% of average

      if (newTransaction.amount > threshold && newTransaction.amount > 10000) {
        alerts.push({
          id: `anomaly-${Date.now()}`,
          companyId,
          type: 'anomaly',
          severity: 'high',
          title: 'Unusual Transaction Amount',
          message: `Transaction of ₹${newTransaction.amount.toLocaleString()} to ${newTransaction.vendor} is ${Math.round((newTransaction.amount / avgAmount) * 100)}% higher than usual (avg: ₹${avgAmount.toLocaleString()})`,
          actionRequired: true,
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    // High amount threshold
    if (newTransaction.amount > 50000) {
      alerts.push({
        id: `high-amount-${Date.now()}`,
        companyId,
        type: 'anomaly',
        severity: 'medium',
        title: 'High Amount Transaction',
        message: `Large transaction of ₹${newTransaction.amount.toLocaleString()} requires attention`,
        actionRequired: true,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    return alerts;
  }

  // Cash Flow Forecasting
  async generateCashFlowForecast(companyId: string): Promise<CashFlowForecast> {
    const transactions = financeStorage.getTransactions(companyId);
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));

    // Filter recent transactions
    const recentTransactions = transactions.filter(t => new Date(t.date) >= threeMonthsAgo);

    // Calculate monthly averages
    const monthlyIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) / 3;

    const monthlyExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) / 3;

    // Generate scenarios
    const scenarios = [
      {
        name: 'pessimistic' as const,
        income: monthlyIncome * 0.7,
        expenses: monthlyExpenses * 1.2,
        netFlow: (monthlyIncome * 0.7) - (monthlyExpenses * 1.2),
        probability: 0.2
      },
      {
        name: 'realistic' as const,
        income: monthlyIncome,
        expenses: monthlyExpenses,
        netFlow: monthlyIncome - monthlyExpenses,
        probability: 0.6
      },
      {
        name: 'optimistic' as const,
        income: monthlyIncome * 1.3,
        expenses: monthlyExpenses * 0.9,
        netFlow: (monthlyIncome * 1.3) - (monthlyExpenses * 0.9),
        probability: 0.2
      }
    ];

    const forecast: CashFlowForecast = {
      id: `forecast-${companyId}-${Date.now()}`,
      companyId,
      period: 'next-6-months',
      projectedIncome: monthlyIncome * 6,
      projectedExpenses: monthlyExpenses * 6,
      netCashFlow: (monthlyIncome - monthlyExpenses) * 6,
      confidence: 0.75,
      scenarios,
      generatedAt: new Date().toISOString()
    };

    financeStorage.saveCashFlowForecast(forecast);
    return forecast;
  }

  // Burn Rate Analysis
  calculateBurnRate(companyId: string): BurnRateAnalysis {
    const transactions = financeStorage.getTransactions(companyId);
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));

    // Current month expenses
    const currentMonthExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= oneMonthAgo)
      .reduce((sum, t) => sum + t.amount, 0);

    // Average monthly expenses over 3 months
    const threeMonthExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= threeMonthsAgo)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const averageMonthlyBurn = threeMonthExpenses / 3;

    // Calculate trend
    let burnTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (currentMonthExpenses > averageMonthlyBurn * 1.1) {
      burnTrend = 'increasing';
    } else if (currentMonthExpenses < averageMonthlyBurn * 0.9) {
      burnTrend = 'decreasing';
    }

    // Calculate current cash (simplified - in real app would come from bank integration)
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const cashBalance = totalIncome - totalExpenses;

    const runway = averageMonthlyBurn > 0 ? (cashBalance / averageMonthlyBurn) * 30 : Infinity;
    const runwayAtCurrentBurn = currentMonthExpenses > 0 ? (cashBalance / currentMonthExpenses) * 30 : Infinity;

    return {
      companyId,
      currentMonthlyBurn: currentMonthExpenses,
      averageMonthlyBurn,
      burnTrend,
      runway: Math.max(0, runway),
      runwayAtCurrentBurn: Math.max(0, runwayAtCurrentBurn),
      cashBalance,
      forecastDate: new Date().toISOString()
    };
  }

  // Natural Language Query Processing
  async processNaturalLanguageQuery(companyId: string, query: string): Promise<ConversationalQuery> {
    const lowerQuery = query.toLowerCase();
    let intent: ConversationalQuery['intent'] = 'summary';
    let response = '';

    const transactions = financeStorage.getTransactions(companyId);
    const invoices = financeStorage.getInvoices(companyId);

    // Intent detection
    if (lowerQuery.includes('invoice') || lowerQuery.includes('bill')) {
      intent = 'invoice';
      if (lowerQuery.includes('create') || lowerQuery.includes('generate')) {
        response = 'I can help you create an invoice. Please provide the client name, amount, and description.';
      } else {
        const unpaidInvoices = invoices.filter(i => i.status !== 'paid').length;
        response = `You have ${unpaidInvoices} unpaid invoices. Total pending amount: ₹${invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}`;
      }
    } else if (lowerQuery.includes('forecast') || lowerQuery.includes('predict')) {
      intent = 'forecast';
      const burnRate = this.calculateBurnRate(companyId);
      response = `Based on your current burn rate of ₹${burnRate.averageMonthlyBurn.toLocaleString()}/month, you have approximately ${Math.floor(burnRate.runway)} days of runway remaining.`;
    } else if (lowerQuery.includes('expense') || lowerQuery.includes('spent') || lowerQuery.includes('cost')) {
      intent = 'expense';
      const thisMonth = new Date();
      const startOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
      const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
        .reduce((sum, t) => sum + t.amount, 0);
      response = `This month you've spent ₹${monthlyExpenses.toLocaleString()}. Your top expense categories are: ${this.getTopCategories(transactions, 'expense', 3)}`;
    } else if (lowerQuery.includes('revenue') || lowerQuery.includes('income') || lowerQuery.includes('earned')) {
      intent = 'summary';
      const thisMonth = new Date();
      const startOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
      const monthlyIncome = transactions
        .filter(t => t.type === 'income' && new Date(t.date) >= startOfMonth)
        .reduce((sum, t) => sum + t.amount, 0);
      response = `This month you've earned ₹${monthlyIncome.toLocaleString()}. Your main revenue sources are: ${this.getTopCategories(transactions, 'income', 3)}`;
    } else if (lowerQuery.includes('save') || lowerQuery.includes('optimize') || lowerQuery.includes('reduce')) {
      intent = 'optimization';
      response = this.generateOptimizationSuggestions(transactions);
    } else {
      // General summary
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const netProfit = totalIncome - totalExpenses;
      response = `Financial Summary: Revenue ₹${totalIncome.toLocaleString()}, Expenses ₹${totalExpenses.toLocaleString()}, Net: ₹${netProfit.toLocaleString()}`;
    }

    return {
      id: `query-${Date.now()}`,
      query,
      intent,
      response,
      confidence: 0.8,
      timestamp: new Date().toISOString()
    };
  }

  private getTopCategories(transactions: EnhancedTransaction[], type: 'income' | 'expense', limit: number): string {
    const categoryTotals = transactions
      .filter(t => t.type === type)
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([category, amount]) => `${category} (₹${amount.toLocaleString()})`)
      .join(', ');
  }

  private generateOptimizationSuggestions(transactions: EnhancedTransaction[]): string {
    const suggestions = [
      'Consider switching to annual subscriptions for software tools to save 10-20%',
      'Review your SaaS subscriptions - you might have unused tools',
      'Negotiate better payment terms with vendors for improved cash flow',
      'Set up automated expense tracking to catch overspending early'
    ];

    return `Cost optimization suggestions: ${suggestions[Math.floor(Math.random() * suggestions.length)]}`;
  }

  // Invoice Generation from Natural Language
  async generateInvoiceFromText(companyId: string, text: string): Promise<Partial<Invoice>> {
    // Simple NLP parsing for invoice creation
    const amountMatch = text.match(/₹?([\d,]+)/);
    const clientMatch = text.match(/to\s+([^₹]+?)(?:\s+for|\s+₹|$)/i) || text.match(/for\s+([^₹]+?)(?:\s+₹|$)/i);
    const descriptionMatch = text.match(/for\s+(.+?)(?:\s+₹|$)/i);

    const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0;
    const clientName = clientMatch ? clientMatch[1].trim() : '';
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';

    const gstRate = 0.18; // 18% GST
    const gstAmount = amount * gstRate;
    const totalAmount = amount + gstAmount;

    return {
      companyId,
      clientName,
      amount,
      gstAmount,
      totalAmount,
      description,
      status: 'draft',
      paymentTerms: '30 days',
      isRecurring: false,
      items: [{
        id: '1',
        description,
        quantity: 1,
        rate: amount,
        amount,
        gstRate: 18
      }]
    };
  }
}

export const aiFinanceEngine = AIFinanceEngine.getInstance();
