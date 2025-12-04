
import { LegalDocument, DocumentType, ComplianceItem, IPAsset, LegalRisk, DueDiligence, LegalContext, LegalPrompt, LegalTemplate, LegalMetrics } from '@/types/legal';

class AILegalEngine {
  private templates: Map<DocumentType, LegalTemplate> = new Map();
  private complianceRules: Map<string, any> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeComplianceRules();
  }

  // Document Generation
  async generateDocument(
    type: DocumentType,
    context: LegalContext,
    parameters: any
  ): Promise<{ document: string; confidence: number; suggestions: string[] }> {
    console.log('AI Legal Engine: Generating document', { type, parameters });

    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Template not found for document type: ${type}`);
    }

    // AI-powered document generation
    const document = this.processTemplate(template, parameters, context);
    const confidence = this.calculateDocumentConfidence(type, parameters);
    const suggestions = this.generateDocumentSuggestions(type, parameters, context);

    return { document, confidence, suggestions };
  }

  private processTemplate(template: LegalTemplate, parameters: any, context: LegalContext): string {
    let content = template.content;

    // Replace template variables
    template.variables.forEach(variable => {
      const value = parameters[variable.name] || '';
      const placeholder = `{{${variable.name}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    // Add dynamic clauses based on context
    content = this.addContextualClauses(content, context, parameters);

    return content;
  }

  private addContextualClauses(content: string, context: LegalContext, parameters: any): string {
    // Add IP protection clauses if company has IP assets
    if (context.ipPortfolio.length > 0) {
      content += '\n\n**INTELLECTUAL PROPERTY PROTECTION**\n';
      content += 'All intellectual property created, developed, or conceived during the course of this agreement shall be the exclusive property of the Company.';
    }

    // Add data protection clauses for tech companies
    if (context.industry.includes('technology') || context.industry.includes('software')) {
      content += '\n\n**DATA PROTECTION & PRIVACY**\n';
      content += 'The parties agree to comply with all applicable data protection laws including the Information Technology Act, 2000 and Digital Personal Data Protection Act, 2023.';
    }

    // Add GST clauses if applicable
    if (parameters.value && parameters.value > 0) {
      content += '\n\n**GOODS AND SERVICES TAX**\n';
      content += 'GST at applicable rates shall be charged extra on the contract value as per prevailing tax laws.';
    }

    return content;
  }

  // Compliance Management
  async generateComplianceCalendar(
    entityType: string,
    registrationDate: string,
    businessType: string,
    turnover?: number
  ): Promise<ComplianceItem[]> {
    console.log('AI Legal Engine: Generating compliance calendar', { entityType, businessType });

    const calendar: ComplianceItem[] = [];
    const rules = this.complianceRules.get(entityType) || [];

    rules.forEach((rule: any) => {
      if (this.isComplianceApplicable(rule, { businessType, turnover })) {
        const item = this.createComplianceItem(rule, registrationDate);
        calendar.push(item);
      }
    });

    return calendar.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  private isComplianceApplicable(rule: any, context: { businessType: string; turnover?: number }): boolean {
    // Check business type requirements
    if (rule.businessTypes && !rule.businessTypes.includes(context.businessType)) {
      return false;
    }

    // Check turnover thresholds
    if (rule.minTurnover && context.turnover && context.turnover < rule.minTurnover) {
      return false;
    }

    return true;
  }

  private createComplianceItem(rule: any, registrationDate: string): ComplianceItem {
    const dueDate = this.calculateDueDate(rule.frequency, registrationDate);
    
    return {
      id: `compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyId: '',
      type: rule.type,
      category: rule.category,
      title: rule.title,
      description: rule.description,
      frequency: rule.frequency,
      dueDate,
      nextDueDate: this.calculateNextDueDate(dueDate, rule.frequency),
      status: 'upcoming',
      priority: rule.priority || 'medium',
      penalty: rule.penalty,
      filingFee: rule.filingFee,
      authority: rule.authority,
      formNumber: rule.formNumber,
      requirements: rule.requirements || [],
      documents: rule.documents || [],
      reminderDays: rule.reminderDays || [30, 15, 7, 1],
      autoCalculated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Risk Assessment
  async assessLegalRisks(context: LegalContext): Promise<LegalRisk[]> {
    console.log('AI Legal Engine: Assessing legal risks');

    const risks: LegalRisk[] = [];

    // Compliance risks
    const complianceRisks = this.assessComplianceRisks(context.complianceStatus);
    risks.push(...complianceRisks);

    // Contract risks
    const contractRisks = this.assessContractRisks(context.recentDocuments);
    risks.push(...contractRisks);

    // IP risks
    const ipRisks = this.assessIPRisks(context.ipPortfolio);
    risks.push(...ipRisks);

    return risks.sort((a, b) => b.riskScore - a.riskScore);
  }

  private assessComplianceRisks(compliance: ComplianceItem[]): LegalRisk[] {
    const risks: LegalRisk[] = [];
    const overdueItems = compliance.filter(item => 
      item.status === 'overdue' || 
      (item.status === 'due' && new Date(item.dueDate) < new Date())
    );

    overdueItems.forEach(item => {
      risks.push({
        id: `risk_compliance_${item.id}`,
        companyId: item.companyId,
        type: 'compliance',
        category: 'operational',
        title: `Overdue ${item.title}`,
        description: `${item.title} is overdue and may result in penalties`,
        severity: this.calculateRiskSeverity(item.priority, item.penalty),
        probability: 90,
        impact: this.calculateImpact(item.penalty),
        riskScore: 0,
        status: 'identified',
        mitigation: [`File ${item.title} immediately`, 'Set up automated reminders'],
        owner: '',
        cost: item.penalty || 0,
        relatedDocuments: [],
        aiDetected: true,
        lastReviewed: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    return risks;
  }

  private assessContractRisks(documents: LegalDocument[]): LegalRisk[] {
    const risks: LegalRisk[] = [];
    const expiringContracts = documents.filter(doc => 
      doc.expiryDate && 
      new Date(doc.expiryDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
    );

    expiringContracts.forEach(contract => {
      risks.push({
        id: `risk_contract_${contract.id}`,
        companyId: contract.companyId,
        type: 'contractual',
        category: 'operational',
        title: `Contract Expiring: ${contract.title}`,
        description: `${contract.title} expires on ${contract.expiryDate}`,
        severity: 'medium',
        probability: 100,
        impact: 60,
        riskScore: 0,
        status: 'identified',
        mitigation: ['Renew contract', 'Renegotiate terms', 'Find alternative'],
        owner: '',
        relatedDocuments: [contract.id],
        aiDetected: true,
        lastReviewed: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    return risks;
  }

  private assessIPRisks(ipAssets: IPAsset[]): LegalRisk[] {
    const risks: LegalRisk[] = [];
    const unprotectedAssets = ipAssets.filter(asset => 
      asset.status === 'idea' || asset.riskLevel === 'high'
    );

    unprotectedAssets.forEach(asset => {
      risks.push({
        id: `risk_ip_${asset.id}`,
        companyId: asset.companyId,
        type: 'ip_infringement',
        category: 'strategic',
        title: `IP Protection Risk: ${asset.title}`,
        description: `${asset.title} may need additional protection`,
        severity: asset.riskLevel as any,
        probability: 70,
        impact: 80,
        riskScore: 0,
        status: 'identified',
        mitigation: ['File trademark application', 'Conduct IP search', 'Register copyright'],
        owner: '',
        relatedDocuments: [],
        aiDetected: true,
        lastReviewed: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    return risks;
  }

  // Due Diligence
  async generateDueDiligenceReport(
    context: LegalContext,
    type: 'seed' | 'series_a' | 'series_b' | 'acquisition' | 'general'
  ): Promise<DueDiligence> {
    console.log('AI Legal Engine: Generating due diligence report', { type });

    const categories = this.getDueDiligenceCategories(type);
    const overallScore = this.calculateDueDiligenceScore(categories);
    const findings = this.generateDueDiligenceFindings(categories);
    const recommendations = this.generateDueDiligenceRecommendations(findings);

    return {
      id: `dd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      companyId: context.entity.companyId,
      type,
      requestedBy: 'ai_system',
      requestDate: new Date().toISOString(),
      status: 'completed',
      overallScore,
      categories,
      findings,
      recommendations,
      dataRoom: [],
      aiGenerated: true,
      confidential: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // AI Chat and Recommendations
  async processLegalQuery(query: string, context: LegalContext): Promise<{
    response: string;
    confidence: number;
    suggestions: string[];
    actions: string[];
  }> {
    console.log('AI Legal Engine: Processing legal query', { query });

    const lowerQuery = query.toLowerCase();
    let response = '';
    let confidence = 80;
    let suggestions: string[] = [];
    let actions: string[] = [];

    // Document generation queries
    if (lowerQuery.includes('create') || lowerQuery.includes('generate') || lowerQuery.includes('draft')) {
      if (lowerQuery.includes('nda')) {
        response = 'I can help you create an NDA. I\'ll need the parties involved and the purpose of disclosure.';
        suggestions = ['Standard NDA template', 'Mutual NDA', 'One-way NDA'];
        actions = ['Generate NDA'];
      } else if (lowerQuery.includes('contract') || lowerQuery.includes('agreement')) {
        response = 'I can generate various types of contracts including employment, vendor, and service agreements.';
        suggestions = ['Employment Contract', 'Vendor Agreement', 'Service Contract'];
        actions = ['Choose Contract Type'];
      }
    }
    
    // Compliance queries
    else if (lowerQuery.includes('compliance') || lowerQuery.includes('filing')) {
      const overdueCount = context.complianceStatus.filter(c => c.status === 'overdue').length;
      response = `You have ${overdueCount} overdue compliances. Your next filing is due on ${context.complianceStatus[0]?.dueDate || 'N/A'}.`;
      suggestions = ['View compliance calendar', 'Set up reminders', 'File overdue returns'];
      actions = ['Open Compliance Dashboard'];
    }
    
    // Risk assessment queries
    else if (lowerQuery.includes('risk') || lowerQuery.includes('legal issues')) {
      response = 'Based on your current legal profile, I\'ve identified several areas of concern including contract renewals and IP protection.';
      suggestions = ['Review contract expirations', 'Assess IP portfolio', 'Update legal policies'];
      actions = ['Generate Risk Report'];
    }
    
    // General legal advice
    else {
      response = 'I can help with document generation, compliance tracking, risk assessment, and legal advice for Indian startups.';
      suggestions = ['Generate legal document', 'Check compliance status', 'Assess legal risks'];
      actions = ['Ask Specific Question'];
      confidence = 60;
    }

    return { response, confidence, suggestions, actions };
  }

  // Utility Methods
  private calculateDueDate(frequency: string, startDate: string): string {
    const start = new Date(startDate);
    const due = new Date(start);

    switch (frequency) {
      case 'monthly':
        due.setMonth(due.getMonth() + 1);
        break;
      case 'quarterly':
        due.setMonth(due.getMonth() + 3);
        break;
      case 'half_yearly':
        due.setMonth(due.getMonth() + 6);
        break;
      case 'annually':
        due.setFullYear(due.getFullYear() + 1);
        break;
      default:
        due.setMonth(due.getMonth() + 1);
    }

    return due.toISOString().split('T')[0];
  }

  private calculateNextDueDate(currentDue: string, frequency: string): string {
    return this.calculateDueDate(frequency, currentDue);
  }

  private calculateDocumentConfidence(type: DocumentType, parameters: any): number {
    let confidence = 70;
    
    // Increase confidence for well-defined parameters
    const requiredFields = this.getRequiredFields(type);
    const providedFields = Object.keys(parameters).length;
    confidence += Math.min(30, (providedFields / requiredFields.length) * 30);

    return Math.round(confidence);
  }

  private getRequiredFields(type: DocumentType): string[] {
    const fieldMap: Record<DocumentType, string[]> = {
      'nda': ['party1', 'party2', 'purpose'],
      'employment_contract': ['employee', 'position', 'salary', 'startDate'],
      'vendor_agreement': ['vendor', 'services', 'value', 'duration'],
      'founder_agreement': ['founders', 'equity', 'roles'],
      // ... add more mappings
    } as any;

    return fieldMap[type] || [];
  }

  private generateDocumentSuggestions(type: DocumentType, parameters: any, context: LegalContext): string[] {
    const suggestions: string[] = [];

    if (type === 'employment_contract') {
      suggestions.push('Consider adding a non-compete clause');
      suggestions.push('Include intellectual property assignment');
      suggestions.push('Add confidentiality provisions');
    }

    if (context.entity.entityType === 'private_limited') {
      suggestions.push('Ensure ESOP compliance if equity is involved');
    }

    return suggestions;
  }

  private calculateRiskSeverity(priority: string, penalty?: number): any {
    if (penalty && penalty > 100000) return 'high';
    if (priority === 'urgent' || priority === 'high') return 'high';
    if (priority === 'medium') return 'medium';
    return 'low';
  }

  private calculateImpact(penalty?: number): number {
    if (!penalty) return 30;
    if (penalty > 500000) return 90;
    if (penalty > 100000) return 70;
    if (penalty > 10000) return 50;
    return 30;
  }

  private getDueDiligenceCategories(type: string): any[] {
    // Simplified categories for demo
    return [
      {
        name: 'Corporate Structure',
        score: 85,
        status: 'complete',
        items: [],
        weight: 20
      },
      {
        name: 'Compliance Status',
        score: 75,
        status: 'complete',
        items: [],
        weight: 25
      },
      {
        name: 'Intellectual Property',
        score: 90,
        status: 'complete',
        items: [],
        weight: 20
      },
      {
        name: 'Contracts & Agreements',
        score: 80,
        status: 'complete',
        items: [],
        weight: 15
      },
      {
        name: 'Litigation & Disputes',
        score: 95,
        status: 'complete',
        items: [],
        weight: 10
      },
      {
        name: 'Data Protection',
        score: 70,
        status: 'incomplete',
        items: [],
        weight: 10
      }
    ];
  }

  private calculateDueDiligenceScore(categories: any[]): number {
    const totalScore = categories.reduce((sum, cat) => sum + (cat.score * cat.weight), 0);
    const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
    return Math.round(totalScore / totalWeight);
  }

  private generateDueDiligenceFindings(categories: any[]): any[] {
    return [
      {
        category: 'Data Protection',
        severity: 'medium',
        issue: 'Privacy policy needs updating for DPDP Act compliance',
        impact: 'May affect investor confidence',
        recommendation: 'Update privacy policy and implement data protection measures',
        resolved: false
      }
    ];
  }

  private generateDueDiligenceRecommendations(findings: any[]): string[] {
    return [
      'Update privacy policy for DPDP Act 2023 compliance',
      'Implement regular compliance monitoring system',
      'Consider IP portfolio expansion',
      'Set up automated contract renewal tracking'
    ];
  }

  private initializeTemplates(): void {
    // Initialize legal document templates
    this.templates.set('nda', {
      id: 'template_nda',
      name: 'Non-Disclosure Agreement',
      category: 'nda',
      description: 'Standard NDA template for Indian jurisdiction',
      content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on {{date}} between:

Disclosing Party: {{party1}}
Receiving Party: {{party2}}

PURPOSE: {{purpose}}

CONFIDENTIAL INFORMATION:
The term "Confidential Information" shall include all information, technical data, trade secrets, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances or other business information disclosed by the Disclosing Party.

OBLIGATIONS:
1. The Receiving Party agrees to maintain the confidentiality of all Confidential Information
2. Use the information solely for the stated purpose
3. Not disclose to third parties without written consent
4. Return all materials upon request

DURATION: {{duration}} years from the date of execution

GOVERNING LAW: This Agreement shall be governed by the laws of India.

Disclosing Party: _________________
{{party1}}

Receiving Party: _________________  
{{party2}}`,
      variables: [
        { name: 'date', type: 'date', required: true, description: 'Agreement date', placeholder: '' },
        { name: 'party1', type: 'text', required: true, description: 'Disclosing party name', placeholder: 'Company Name' },
        { name: 'party2', type: 'text', required: true, description: 'Receiving party name', placeholder: 'Individual/Company Name' },
        { name: 'purpose', type: 'text', required: true, description: 'Purpose of disclosure', placeholder: 'Business discussions and potential collaboration' },
        { name: 'duration', type: 'number', required: true, description: 'Duration in years', placeholder: '2' }
      ],
      jurisdiction: 'India',
      lastUpdated: new Date().toISOString(),
      usage: 0,
      rating: 4.5,
      aiOptimized: true,
      tags: ['nda', 'confidentiality', 'standard']
    });

    // Add more templates...
  }

  private initializeComplianceRules(): void {
    // Initialize compliance rules for different entity types
    this.complianceRules.set('private_limited', [
      {
        type: 'roc_filing',
        category: 'corporate',
        title: 'Annual Return Filing (AOC-4)',
        description: 'Annual return to be filed with ROC within 60 days of AGM',
        frequency: 'annually',
        priority: 'high',
        penalty: 200000,
        filingFee: 1000,
        authority: 'Registrar of Companies',
        formNumber: 'AOC-4',
        requirements: ['Board Resolution', 'Financial Statements', 'Auditor Report'],
        reminderDays: [60, 30, 15, 7, 1]
      },
      {
        type: 'gst_return',
        category: 'taxation',
        title: 'GST Return Filing (GSTR-3B)',
        description: 'Monthly GST return filing',
        frequency: 'monthly',
        priority: 'high',
        penalty: 10000,
        filingFee: 0,
        authority: 'GST Department',
        formNumber: 'GSTR-3B',
        requirements: ['Invoice details', 'Input tax credit details'],
        reminderDays: [15, 7, 3, 1]
      }
    ]);
  }

  async calculateLegalMetrics(companyId: string): Promise<LegalMetrics> {
    // This would typically fetch real data
    return {
      totalDocuments: 25,
      activeContracts: 8,
      complianceScore: 85,
      overdueCompliance: 2,
      totalIPAssets: 5,
      riskScore: 25,
      dueDiligenceReadiness: 80,
      legalCosts: 150000,
      savingsRealized: 50000,
      aiDocumentsGenerated: 15,
      complianceAutomated: 75
    };
  }
}

export const aiLegalEngine = new AILegalEngine();
