
import { EnhancedTransaction, Invoice, Budget, Vendor, Subscription, CashFlowForecast, BurnRateAnalysis, TaxRecord, FinancialAlert } from '@/types/finance';

export class FinanceStorage {
  private static instance: FinanceStorage;
  
  static getInstance(): FinanceStorage {
    if (!FinanceStorage.instance) {
      FinanceStorage.instance = new FinanceStorage();
    }
    return FinanceStorage.instance;
  }

  // Transactions
  saveTransaction(transaction: EnhancedTransaction): void {
    const transactions = this.getTransactions(transaction.companyId);
    const existingIndex = transactions.findIndex(t => t.id === transaction.id);
    
    if (existingIndex >= 0) {
      transactions[existingIndex] = transaction;
    } else {
      transactions.push(transaction);
    }
    
    localStorage.setItem(`finance-transactions-${transaction.companyId}`, JSON.stringify(transactions));
  }

  getTransactions(companyId: string): EnhancedTransaction[] {
    const stored = localStorage.getItem(`finance-transactions-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  deleteTransaction(companyId: string, transactionId: string): void {
    const transactions = this.getTransactions(companyId);
    const filtered = transactions.filter(t => t.id !== transactionId);
    localStorage.setItem(`finance-transactions-${companyId}`, JSON.stringify(filtered));
  }

  // Invoices
  saveInvoice(invoice: Invoice): void {
    const invoices = this.getInvoices(invoice.companyId);
    const existingIndex = invoices.findIndex(i => i.id === invoice.id);
    
    if (existingIndex >= 0) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.push(invoice);
    }
    
    localStorage.setItem(`finance-invoices-${invoice.companyId}`, JSON.stringify(invoices));
  }

  getInvoices(companyId: string): Invoice[] {
    const stored = localStorage.getItem(`finance-invoices-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  getInvoice(companyId: string, invoiceId: string): Invoice | null {
    const invoices = this.getInvoices(companyId);
    return invoices.find(i => i.id === invoiceId) || null;
  }

  // Vendors
  saveVendor(vendor: Vendor): void {
    const vendors = this.getVendors(vendor.companyId);
    const existingIndex = vendors.findIndex(v => v.id === vendor.id);
    
    if (existingIndex >= 0) {
      vendors[existingIndex] = vendor;
    } else {
      vendors.push(vendor);
    }
    
    localStorage.setItem(`finance-vendors-${vendor.companyId}`, JSON.stringify(vendors));
  }

  getVendors(companyId: string): Vendor[] {
    const stored = localStorage.getItem(`finance-vendors-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Budgets
  saveBudget(budget: Budget): void {
    const budgets = this.getBudgets(budget.companyId);
    const existingIndex = budgets.findIndex(b => b.id === budget.id);
    
    if (existingIndex >= 0) {
      budgets[existingIndex] = budget;
    } else {
      budgets.push(budget);
    }
    
    localStorage.setItem(`finance-budgets-${budget.companyId}`, JSON.stringify(budgets));
  }

  getBudgets(companyId: string): Budget[] {
    const stored = localStorage.getItem(`finance-budgets-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Subscriptions
  saveSubscription(subscription: Subscription): void {
    const subscriptions = this.getSubscriptions(subscription.companyId);
    const existingIndex = subscriptions.findIndex(s => s.id === subscription.id);
    
    if (existingIndex >= 0) {
      subscriptions[existingIndex] = subscription;
    } else {
      subscriptions.push(subscription);
    }
    
    localStorage.setItem(`finance-subscriptions-${subscription.companyId}`, JSON.stringify(subscriptions));
  }

  getSubscriptions(companyId: string): Subscription[] {
    const stored = localStorage.getItem(`finance-subscriptions-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Cash Flow Forecasts
  saveCashFlowForecast(forecast: CashFlowForecast): void {
    localStorage.setItem(`finance-forecast-${forecast.companyId}`, JSON.stringify(forecast));
  }

  getCashFlowForecast(companyId: string): CashFlowForecast | null {
    const stored = localStorage.getItem(`finance-forecast-${companyId}`);
    return stored ? JSON.parse(stored) : null;
  }

  // Financial Alerts
  saveAlert(alert: FinancialAlert): void {
    const alerts = this.getAlerts(alert.companyId);
    alerts.push(alert);
    localStorage.setItem(`finance-alerts-${alert.companyId}`, JSON.stringify(alerts));
  }

  getAlerts(companyId: string): FinancialAlert[] {
    const stored = localStorage.getItem(`finance-alerts-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  markAlertAsRead(companyId: string, alertId: string): void {
    const alerts = this.getAlerts(companyId);
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      localStorage.setItem(`finance-alerts-${companyId}`, JSON.stringify(alerts));
    }
  }

  // Export functionality
  exportToCSV(companyId: string, dataType: 'transactions' | 'invoices' | 'vendors'): string {
    let data: any[] = [];
    let headers: string[] = [];

    switch (dataType) {
      case 'transactions':
        data = this.getTransactions(companyId);
        headers = ['Date', 'Description', 'Category', 'Amount', 'Type', 'Vendor', 'Tags'];
        break;
      case 'invoices':
        data = this.getInvoices(companyId);
        headers = ['Invoice Number', 'Client', 'Amount', 'Status', 'Due Date', 'Issue Date'];
        break;
      case 'vendors':
        data = this.getVendors(companyId);
        headers = ['Name', 'Email', 'Total Spent', 'Last Transaction'];
        break;
    }

    let csv = headers.join(',') + '\n';
    data.forEach(item => {
      const row = headers.map(header => {
        const value = this.getNestedValue(item, header);
        return `"${value || ''}"`;
      }).join(',');
      csv += row + '\n';
    });

    return csv;
  }

  private getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((o, k) => (o || {})[k], obj);
  }

  // Backup and restore
  createBackup(companyId: string): string {
    const backup = {
      transactions: this.getTransactions(companyId),
      invoices: this.getInvoices(companyId),
      vendors: this.getVendors(companyId),
      budgets: this.getBudgets(companyId),
      subscriptions: this.getSubscriptions(companyId),
      forecast: this.getCashFlowForecast(companyId),
      alerts: this.getAlerts(companyId),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(backup, null, 2);
  }

  restoreFromBackup(companyId: string, backupData: string): boolean {
    try {
      const backup = JSON.parse(backupData);
      
      if (backup.transactions) {
        localStorage.setItem(`finance-transactions-${companyId}`, JSON.stringify(backup.transactions));
      }
      if (backup.invoices) {
        localStorage.setItem(`finance-invoices-${companyId}`, JSON.stringify(backup.invoices));
      }
      if (backup.vendors) {
        localStorage.setItem(`finance-vendors-${companyId}`, JSON.stringify(backup.vendors));
      }
      if (backup.budgets) {
        localStorage.setItem(`finance-budgets-${companyId}`, JSON.stringify(backup.budgets));
      }
      if (backup.subscriptions) {
        localStorage.setItem(`finance-subscriptions-${companyId}`, JSON.stringify(backup.subscriptions));
      }
      if (backup.forecast) {
        localStorage.setItem(`finance-forecast-${companyId}`, JSON.stringify(backup.forecast));
      }
      if (backup.alerts) {
        localStorage.setItem(`finance-alerts-${companyId}`, JSON.stringify(backup.alerts));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return false;
    }
  }
}

export const financeStorage = FinanceStorage.getInstance();
