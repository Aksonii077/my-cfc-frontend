import { 
  Vendor, 
  PurchaseOrder, 
  InventoryItem, 
  SupplyChainAlert,
  CostCenter,
  LogisticsPartner,
  SupplyChainMetrics,
  SupplyChainPrompt
} from '@/types/supply-chain';

export class SupplyChainStorage {
  private static instance: SupplyChainStorage;
  private readonly STORAGE_KEYS = {
    VENDORS: 'supply_chain_vendors',
    PURCHASE_ORDERS: 'supply_chain_purchase_orders',
    INVENTORY: 'supply_chain_inventory',
    ALERTS: 'supply_chain_alerts',
    COST_CENTERS: 'supply_chain_cost_centers',
    LOGISTICS_PARTNERS: 'supply_chain_logistics_partners',
    METRICS: 'supply_chain_metrics',
    AI_PROMPTS: 'supply_chain_ai_prompts',
    SETTINGS: 'supply_chain_settings'
  };

  static getInstance(): SupplyChainStorage {
    if (!SupplyChainStorage.instance) {
      SupplyChainStorage.instance = new SupplyChainStorage();
    }
    return SupplyChainStorage.instance;
  }

  // Vendor Management
  async saveVendor(vendor: Vendor): Promise<void> {
    const vendors = await this.getVendors();
    const existingIndex = vendors.findIndex(v => v.id === vendor.id);
    
    if (existingIndex !== -1) {
      vendors[existingIndex] = { ...vendor, updatedAt: new Date().toISOString() };
    } else {
      vendors.push(vendor);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  }

  async getVendors(): Promise<Vendor[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.VENDORS);
    return stored ? JSON.parse(stored) : [];
  }

  async getVendor(id: string): Promise<Vendor | null> {
    const vendors = await this.getVendors();
    return vendors.find(v => v.id === id) || null;
  }

  async deleteVendor(id: string): Promise<void> {
    const vendors = await this.getVendors();
    const filtered = vendors.filter(v => v.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.VENDORS, JSON.stringify(filtered));
  }

  async getVendorsByCategory(category: string): Promise<Vendor[]> {
    const vendors = await this.getVendors();
    return vendors.filter(v => v.category === category);
  }

  async getTopVendors(limit: number = 5): Promise<Vendor[]> {
    const vendors = await this.getVendors();
    return vendors
      .sort((a, b) => b.aiScore.overallScore - a.aiScore.overallScore)
      .slice(0, limit);
  }

  // Purchase Order Management
  async savePurchaseOrder(po: PurchaseOrder): Promise<void> {
    const orders = await this.getPurchaseOrders();
    const existingIndex = orders.findIndex(o => o.id === po.id);
    
    if (existingIndex !== -1) {
      orders[existingIndex] = { ...po, updatedAt: new Date().toISOString() };
    } else {
      orders.push(po);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(orders));
  }

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.PURCHASE_ORDERS);
    return stored ? JSON.parse(stored) : [];
  }

  async getPurchaseOrder(id: string): Promise<PurchaseOrder | null> {
    const orders = await this.getPurchaseOrders();
    return orders.find(o => o.id === id) || null;
  }

  async getPurchaseOrdersByVendor(vendorId: string): Promise<PurchaseOrder[]> {
    const orders = await this.getPurchaseOrders();
    return orders.filter(o => o.vendorId === vendorId);
  }

  async getPurchaseOrdersByStatus(status: string): Promise<PurchaseOrder[]> {
    const orders = await this.getPurchaseOrders();
    return orders.filter(o => o.status === status);
  }

  async updatePurchaseOrderStatus(id: string, status: string): Promise<void> {
    const orders = await this.getPurchaseOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status as any;
      order.updatedAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(orders));
    }
  }

  // Inventory Management
  async saveInventoryItem(item: InventoryItem): Promise<void> {
    const inventory = await this.getInventory();
    const existingIndex = inventory.findIndex(i => i.id === item.id);
    
    if (existingIndex !== -1) {
      inventory[existingIndex] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      inventory.push(item);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }

  async getInventory(): Promise<InventoryItem[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.INVENTORY);
    return stored ? JSON.parse(stored) : [];
  }

  async getInventoryItem(id: string): Promise<InventoryItem | null> {
    const inventory = await this.getInventory();
    return inventory.find(i => i.id === id) || null;
  }

  async getInventoryBySKU(sku: string): Promise<InventoryItem | null> {
    const inventory = await this.getInventory();
    return inventory.find(i => i.sku === sku) || null;
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    const inventory = await this.getInventory();
    return inventory.filter(i => i.currentStock <= i.minThreshold);
  }

  async getOverstockItems(): Promise<InventoryItem[]> {
    const inventory = await this.getInventory();
    return inventory.filter(i => i.currentStock >= i.maxThreshold);
  }

  async updateStock(id: string, newStock: number): Promise<void> {
    const inventory = await this.getInventory();
    const item = inventory.find(i => i.id === id);
    if (item) {
      item.currentStock = newStock;
      item.updatedAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    }
  }

  // Alert Management
  async saveAlert(alert: SupplyChainAlert): Promise<void> {
    const alerts = await this.getAlerts();
    const existingIndex = alerts.findIndex(a => a.id === alert.id);
    
    if (existingIndex !== -1) {
      alerts[existingIndex] = alert;
    } else {
      alerts.push(alert);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }

  async getAlerts(): Promise<SupplyChainAlert[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.ALERTS);
    return stored ? JSON.parse(stored) : [];
  }

  async getActiveAlerts(): Promise<SupplyChainAlert[]> {
    const alerts = await this.getAlerts();
    return alerts.filter(a => a.status === 'active');
  }

  async getAlertsBySeverity(severity: string): Promise<SupplyChainAlert[]> {
    const alerts = await this.getAlerts();
    return alerts.filter(a => a.severity === severity);
  }

  async acknowledgeAlert(id: string): Promise<void> {
    const alerts = await this.getAlerts();
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      alert.status = 'acknowledged';
      localStorage.setItem(this.STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    }
  }

  async resolveAlert(id: string): Promise<void> {
    const alerts = await this.getAlerts();
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      alert.status = 'resolved';
      localStorage.setItem(this.STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    }
  }

  // Cost Center Management
  async saveCostCenter(costCenter: CostCenter): Promise<void> {
    const costCenters = await this.getCostCenters();
    const existingIndex = costCenters.findIndex(c => c.id === costCenter.id);
    
    if (existingIndex !== -1) {
      costCenters[existingIndex] = { ...costCenter, updatedAt: new Date().toISOString() };
    } else {
      costCenters.push(costCenter);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.COST_CENTERS, JSON.stringify(costCenters));
  }

  async getCostCenters(): Promise<CostCenter[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.COST_CENTERS);
    return stored ? JSON.parse(stored) : [];
  }

  async getCostCenter(id: string): Promise<CostCenter | null> {
    const costCenters = await this.getCostCenters();
    return costCenters.find(c => c.id === id) || null;
  }

  // Logistics Partner Management
  async saveLogisticsPartner(partner: LogisticsPartner): Promise<void> {
    const partners = await this.getLogisticsPartners();
    const existingIndex = partners.findIndex(p => p.id === partner.id);
    
    if (existingIndex !== -1) {
      partners[existingIndex] = partner;
    } else {
      partners.push(partner);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.LOGISTICS_PARTNERS, JSON.stringify(partners));
  }

  async getLogisticsPartners(): Promise<LogisticsPartner[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.LOGISTICS_PARTNERS);
    return stored ? JSON.parse(stored) : [];
  }

  async getActiveLogisticsPartners(): Promise<LogisticsPartner[]> {
    const partners = await this.getLogisticsPartners();
    return partners.filter(p => p.status === 'active');
  }

  // Metrics and Analytics
  async saveMetrics(metrics: SupplyChainMetrics): Promise<void> {
    localStorage.setItem(this.STORAGE_KEYS.METRICS, JSON.stringify(metrics));
  }

  async getMetrics(): Promise<SupplyChainMetrics | null> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.METRICS);
    return stored ? JSON.parse(stored) : null;
  }

  // AI Prompt History
  async savePrompt(prompt: SupplyChainPrompt): Promise<void> {
    const prompts = await this.getPrompts();
    prompts.unshift(prompt); // Add to beginning
    
    // Keep only last 100 prompts
    if (prompts.length > 100) {
      prompts.splice(100);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.AI_PROMPTS, JSON.stringify(prompts));
  }

  async getPrompts(): Promise<SupplyChainPrompt[]> {
    const stored = localStorage.getItem(this.STORAGE_KEYS.AI_PROMPTS);
    return stored ? JSON.parse(stored) : [];
  }

  async getRecentPrompts(limit: number = 10): Promise<SupplyChainPrompt[]> {
    const prompts = await this.getPrompts();
    return prompts.slice(0, limit);
  }

  // Data Export/Import
  async exportData(): Promise<{
    vendors: Vendor[];
    purchaseOrders: PurchaseOrder[];
    inventory: InventoryItem[];
    alerts: SupplyChainAlert[];
    costCenters: CostCenter[];
    logisticsPartners: LogisticsPartner[];
    metrics: SupplyChainMetrics | null;
    exportDate: string;
  }> {
    return {
      vendors: await this.getVendors(),
      purchaseOrders: await this.getPurchaseOrders(),
      inventory: await this.getInventory(),
      alerts: await this.getAlerts(),
      costCenters: await this.getCostCenters(),
      logisticsPartners: await this.getLogisticsPartners(),
      metrics: await this.getMetrics(),
      exportDate: new Date().toISOString()
    };
  }

  async importData(data: any): Promise<void> {
    if (data.vendors) {
      localStorage.setItem(this.STORAGE_KEYS.VENDORS, JSON.stringify(data.vendors));
    }
    if (data.purchaseOrders) {
      localStorage.setItem(this.STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(data.purchaseOrders));
    }
    if (data.inventory) {
      localStorage.setItem(this.STORAGE_KEYS.INVENTORY, JSON.stringify(data.inventory));
    }
    if (data.alerts) {
      localStorage.setItem(this.STORAGE_KEYS.ALERTS, JSON.stringify(data.alerts));
    }
    if (data.costCenters) {
      localStorage.setItem(this.STORAGE_KEYS.COST_CENTERS, JSON.stringify(data.costCenters));
    }
    if (data.logisticsPartners) {
      localStorage.setItem(this.STORAGE_KEYS.LOGISTICS_PARTNERS, JSON.stringify(data.logisticsPartners));
    }
    if (data.metrics) {
      localStorage.setItem(this.STORAGE_KEYS.METRICS, JSON.stringify(data.metrics));
    }
  }

  // Utility Methods
  async clearAllData(): Promise<void> {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  async getDataSize(): Promise<{ [key: string]: number }> {
    const sizes: { [key: string]: number } = {};
    
    Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
      const data = localStorage.getItem(key);
      sizes[name] = data ? data.length : 0;
    });
    
    return sizes;
  }

  async generateReport(): Promise<{
    totalVendors: number;
    activeVendors: number;
    totalPOs: number;
    activePOs: number;
    totalInventoryItems: number;
    lowStockItems: number;
    activeAlerts: number;
    criticalAlerts: number;
    dataSize: { [key: string]: number };
  }> {
    const vendors = await this.getVendors();
    const pos = await this.getPurchaseOrders();
    const inventory = await this.getInventory();
    const alerts = await this.getAlerts();
    
    return {
      totalVendors: vendors.length,
      activeVendors: vendors.filter(v => v.status === 'active').length,
      totalPOs: pos.length,
      activePOs: pos.filter(p => ['approved', 'sent', 'in_progress'].includes(p.status)).length,
      totalInventoryItems: inventory.length,
      lowStockItems: inventory.filter(i => i.currentStock <= i.minThreshold).length,
      activeAlerts: alerts.filter(a => a.status === 'active').length,
      criticalAlerts: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
      dataSize: await this.getDataSize()
    };
  }
}

export const supplyChainStorage = SupplyChainStorage.getInstance();
