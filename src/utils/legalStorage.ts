
import { LegalDocument, ComplianceItem, IPAsset, LegalRisk, DueDiligence, LegalEntity, LegalAlert } from '@/types/legal';

class LegalStorage {
  private storageKey = 'legal_data';

  private getStorageData(): any {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch (error) {
      console.error('Error reading legal storage:', error);
      return this.getDefaultData();
    }
  }

  private saveStorageData(data: any): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving legal storage:', error);
    }
  }

  private getDefaultData() {
    return {
      entities: [],
      documents: [],
      compliance: [],
      ipAssets: [],
      risks: [],
      dueDiligence: [],
      alerts: []
    };
  }

  // Legal Entity Management
  async createEntity(entity: Omit<LegalEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<LegalEntity> {
    const data = this.getStorageData();
    const newEntity: LegalEntity = {
      ...entity,
      id: `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.entities.push(newEntity);
    this.saveStorageData(data);
    return newEntity;
  }

  async getEntities(companyId: string): Promise<LegalEntity[]> {
    const data = this.getStorageData();
    return data.entities.filter((entity: LegalEntity) => entity.companyId === companyId);
  }

  async updateEntity(id: string, updates: Partial<LegalEntity>): Promise<LegalEntity | null> {
    const data = this.getStorageData();
    const index = data.entities.findIndex((entity: LegalEntity) => entity.id === id);
    
    if (index !== -1) {
      data.entities[index] = {
        ...data.entities[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveStorageData(data);
      return data.entities[index];
    }
    return null;
  }

  // Document Management
  async createDocument(document: Omit<LegalDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<LegalDocument> {
    const data = this.getStorageData();
    const newDocument: LegalDocument = {
      ...document,
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.documents.push(newDocument);
    this.saveStorageData(data);
    return newDocument;
  }

  async getDocuments(companyId: string): Promise<LegalDocument[]> {
    const data = this.getStorageData();
    return data.documents
      .filter((doc: LegalDocument) => doc.companyId === companyId)
      .sort((a: LegalDocument, b: LegalDocument) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }

  async getDocumentsByType(companyId: string, type: string): Promise<LegalDocument[]> {
    const documents = await this.getDocuments(companyId);
    return documents.filter(doc => doc.type === type);
  }

  async updateDocument(id: string, updates: Partial<LegalDocument>): Promise<LegalDocument | null> {
    const data = this.getStorageData();
    const index = data.documents.findIndex((doc: LegalDocument) => doc.id === id);
    
    if (index !== -1) {
      data.documents[index] = {
        ...data.documents[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveStorageData(data);
      return data.documents[index];
    }
    return null;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const data = this.getStorageData();
    const index = data.documents.findIndex((doc: LegalDocument) => doc.id === id);
    
    if (index !== -1) {
      data.documents.splice(index, 1);
      this.saveStorageData(data);
      return true;
    }
    return false;
  }

  // Compliance Management
  async createComplianceItem(item: Omit<ComplianceItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ComplianceItem> {
    const data = this.getStorageData();
    const newItem: ComplianceItem = {
      ...item,
      id: `compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.compliance.push(newItem);
    this.saveStorageData(data);
    return newItem;
  }

  async getComplianceItems(companyId: string): Promise<ComplianceItem[]> {
    const data = this.getStorageData();
    return data.compliance
      .filter((item: ComplianceItem) => item.companyId === companyId)
      .sort((a: ComplianceItem, b: ComplianceItem) => 
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
  }

  async getOverdueCompliance(companyId: string): Promise<ComplianceItem[]> {
    const items = await this.getComplianceItems(companyId);
    const now = new Date();
    return items.filter(item => 
      item.status !== 'filed' && new Date(item.dueDate) < now
    );
  }

  async updateComplianceItem(id: string, updates: Partial<ComplianceItem>): Promise<ComplianceItem | null> {
    const data = this.getStorageData();
    const index = data.compliance.findIndex((item: ComplianceItem) => item.id === id);
    
    if (index !== -1) {
      data.compliance[index] = {
        ...data.compliance[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveStorageData(data);
      return data.compliance[index];
    }
    return null;
  }

  // IP Asset Management
  async createIPAsset(asset: Omit<IPAsset, 'id' | 'createdAt' | 'updatedAt'>): Promise<IPAsset> {
    const data = this.getStorageData();
    const newAsset: IPAsset = {
      ...asset,
      id: `ip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.ipAssets.push(newAsset);
    this.saveStorageData(data);
    return newAsset;
  }

  async getIPAssets(companyId: string): Promise<IPAsset[]> {
    const data = this.getStorageData();
    return data.ipAssets.filter((asset: IPAsset) => asset.companyId === companyId);
  }

  async updateIPAsset(id: string, updates: Partial<IPAsset>): Promise<IPAsset | null> {
    const data = this.getStorageData();
    const index = data.ipAssets.findIndex((asset: IPAsset) => asset.id === id);
    
    if (index !== -1) {
      data.ipAssets[index] = {
        ...data.ipAssets[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveStorageData(data);
      return data.ipAssets[index];
    }
    return null;
  }

  // Risk Management
  async createRisk(risk: Omit<LegalRisk, 'id' | 'createdAt' | 'updatedAt'>): Promise<LegalRisk> {
    const data = this.getStorageData();
    const newRisk: LegalRisk = {
      ...risk,
      id: `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      riskScore: risk.probability * risk.impact / 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.risks.push(newRisk);
    this.saveStorageData(data);
    return newRisk;
  }

  async getRisks(companyId: string): Promise<LegalRisk[]> {
    const data = this.getStorageData();
    return data.risks
      .filter((risk: LegalRisk) => risk.companyId === companyId)
      .sort((a: LegalRisk, b: LegalRisk) => b.riskScore - a.riskScore);
  }

  async updateRisk(id: string, updates: Partial<LegalRisk>): Promise<LegalRisk | null> {
    const data = this.getStorageData();
    const index = data.risks.findIndex((risk: LegalRisk) => risk.id === id);
    
    if (index !== -1) {
      data.risks[index] = {
        ...data.risks[index],
        ...updates,
        riskScore: (updates.probability || data.risks[index].probability) * 
                  (updates.impact || data.risks[index].impact) / 100,
        updatedAt: new Date().toISOString()
      };
      this.saveStorageData(data);
      return data.risks[index];
    }
    return null;
  }

  // Due Diligence
  async createDueDiligence(dd: Omit<DueDiligence, 'id' | 'createdAt' | 'updatedAt'>): Promise<DueDiligence> {
    const data = this.getStorageData();
    const newDD: DueDiligence = {
      ...dd,
      id: `dd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.dueDiligence.push(newDD);
    this.saveStorageData(data);
    return newDD;
  }

  async getDueDiligenceReports(companyId: string): Promise<DueDiligence[]> {
    const data = this.getStorageData();
    return data.dueDiligence.filter((dd: DueDiligence) => dd.companyId === companyId);
  }

  // Alerts
  async createAlert(alert: Omit<LegalAlert, 'id' | 'createdAt'>): Promise<LegalAlert> {
    const data = this.getStorageData();
    const newAlert: LegalAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    data.alerts.push(newAlert);
    this.saveStorageData(data);
    return newAlert;
  }

  async getActiveAlerts(companyId: string): Promise<LegalAlert[]> {
    const data = this.getStorageData();
    return data.alerts
      .filter((alert: LegalAlert) => 
        alert.companyId === companyId && alert.status === 'active'
      )
      .sort((a: LegalAlert, b: LegalAlert) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async updateAlert(id: string, updates: Partial<LegalAlert>): Promise<LegalAlert | null> {
    const data = this.getStorageData();
    const index = data.alerts.findIndex((alert: LegalAlert) => alert.id === id);
    
    if (index !== -1) {
      data.alerts[index] = {
        ...data.alerts[index],
        ...updates,
        resolvedAt: updates.status === 'resolved' ? new Date().toISOString() : data.alerts[index].resolvedAt
      };
      this.saveStorageData(data);
      return data.alerts[index];
    }
    return null;
  }

  // Utility Methods
  async initializeDemoData(companyId: string): Promise<void> {
    // Create demo entity
    await this.createEntity({
      companyId,
      entityType: 'private_limited',
      registrationNumber: 'U72900DL2023PTC123456',
      name: 'Demo Startup Private Limited',
      constitution: 'Memorandum and Articles of Association',
      registrationDate: '2023-01-15',
      registeredAddress: {
        line1: '123 Tech Park',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
      },
      authorizedCapital: 1000000,
      paidUpCapital: 100000,
      directors: [],
      shareholders: [],
      status: 'active',
      cin: 'U72900DL2023PTC123456',
      pan: 'AABCS1234F',
      gstin: '07AABCS1234F1Z5'
    });

    // Create demo compliance items
    await this.createComplianceItem({
      companyId,
      type: 'roc_filing',
      category: 'corporate',
      title: 'Annual Return Filing (AOC-4)',
      description: 'Annual return to be filed with ROC within 60 days of AGM',
      frequency: 'annually',
      dueDate: '2024-08-30',
      nextDueDate: '2025-08-30',
      status: 'upcoming',
      priority: 'high',
      penalty: 200000,
      filingFee: 1000,
      authority: 'Registrar of Companies',
      formNumber: 'AOC-4',
      requirements: ['Board Resolution', 'Financial Statements', 'Auditor Report'],
      documents: [],
      reminderDays: [60, 30, 15, 7, 1],
      autoCalculated: true
    });

    // Create demo IP asset
    await this.createIPAsset({
      companyId,
      type: 'trademark',
      title: 'Company Logo',
      description: 'Company brand logo trademark',
      status: 'applied',
      jurisdiction: 'India',
      applicationDate: '2023-06-15',
      cost: 15000,
      riskLevel: 'low',
      relatedAssets: [],
      documents: []
    });
  }

  async clearAllData(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }
}

export const legalStorage = new LegalStorage();
