import { Employee, LeaveRequest, JobDescription, CandidateProfile, OfferLetter, OnboardingPlan, TeamAnalytics, HRAlert, Payroll, Reimbursement } from '@/types/startup-os';
import { PayrollRecord } from '@/types/hr-payroll';

export class HRStorage {
  private static instance: HRStorage;
  
  static getInstance(): HRStorage {
    if (!HRStorage.instance) {
      HRStorage.instance = new HRStorage();
    }
    return HRStorage.instance;
  }

  // Employee Management
  saveEmployee(employee: Employee): void {
    const employees = this.getEmployees(employee.companyId);
    const existingIndex = employees.findIndex(e => e.id === employee.id);
    
    if (existingIndex >= 0) {
      employees[existingIndex] = employee;
    } else {
      employees.push(employee);
    }
    
    localStorage.setItem(`hr-employees-${employee.companyId}`, JSON.stringify(employees));
  }

  getEmployees(companyId: string): Employee[] {
    const stored = localStorage.getItem(`hr-employees-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  getEmployee(companyId: string, employeeId: string): Employee | null {
    const employees = this.getEmployees(companyId);
    return employees.find(e => e.id === employeeId) || null;
  }

  deleteEmployee(companyId: string, employeeId: string): void {
    const employees = this.getEmployees(companyId);
    const filtered = employees.filter(e => e.id !== employeeId);
    localStorage.setItem(`hr-employees-${companyId}`, JSON.stringify(filtered));
  }

  // Leave Management
  saveLeaveRequest(leave: LeaveRequest): void {
    const leaves = this.getLeaveRequests(leave.employeeId);
    const existingIndex = leaves.findIndex(l => l.id === leave.id);
    
    if (existingIndex >= 0) {
      leaves[existingIndex] = leave;
    } else {
      leaves.push(leave);
    }
    
    localStorage.setItem(`hr-leaves-${leave.employeeId}`, JSON.stringify(leaves));
  }

  getLeaveRequests(employeeId: string): LeaveRequest[] {
    const stored = localStorage.getItem(`hr-leaves-${employeeId}`);
    return stored ? JSON.parse(stored) : [];
  }

  getCompanyLeaveRequests(companyId: string): LeaveRequest[] {
    const employees = this.getEmployees(companyId);
    const allLeaves: LeaveRequest[] = [];
    
    employees.forEach(employee => {
      const leaves = this.getLeaveRequests(employee.id);
      allLeaves.push(...leaves);
    });
    
    return allLeaves;
  }

  // Payroll Management - Updated to handle Payroll type
  savePayrollRecord(payroll: Payroll): void {
    const payrolls = this.getPayrollRecords(payroll.companyId);
    const existingIndex = payrolls.findIndex(p => p.id === payroll.id);
    
    if (existingIndex >= 0) {
      payrolls[existingIndex] = payroll;
    } else {
      payrolls.push(payroll);
    }
    
    localStorage.setItem(`hr-payroll-${payroll.companyId}`, JSON.stringify(payrolls));
  }

  getPayrollRecords(companyId: string): Payroll[] {
    const stored = localStorage.getItem(`hr-payroll-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  getEmployeePayrollRecords(employeeId: string, companyId: string): Payroll[] {
    const allPayrolls = this.getPayrollRecords(companyId);
    return allPayrolls.filter(p => p.entries.some(entry => entry.employeeId === employeeId));
  }

  // Job Descriptions
  saveJobDescription(jd: JobDescription): void {
    const jobs = this.getJobDescriptions(jd.companyId);
    const existingIndex = jobs.findIndex(j => j.id === jd.id);
    
    if (existingIndex >= 0) {
      jobs[existingIndex] = jd;
    } else {
      jobs.push(jd);
    }
    
    localStorage.setItem(`hr-jobs-${jd.companyId}`, JSON.stringify(jobs));
  }

  getJobDescriptions(companyId: string): JobDescription[] {
    const stored = localStorage.getItem(`hr-jobs-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Candidate Management
  saveCandidate(candidate: CandidateProfile): void {
    const candidates = this.getCandidates(candidate.jobDescriptionId);
    const existingIndex = candidates.findIndex(c => c.id === candidate.id);
    
    if (existingIndex >= 0) {
      candidates[existingIndex] = candidate;
    } else {
      candidates.push(candidate);
    }
    
    localStorage.setItem(`hr-candidates-${candidate.jobDescriptionId}`, JSON.stringify(candidates));
  }

  getCandidates(jobDescriptionId: string): CandidateProfile[] {
    const stored = localStorage.getItem(`hr-candidates-${jobDescriptionId}`);
    return stored ? JSON.parse(stored) : [];
  }

  getCompanyCandidates(companyId: string): CandidateProfile[] {
    const jobs = this.getJobDescriptions(companyId);
    const allCandidates: CandidateProfile[] = [];
    
    jobs.forEach(job => {
      const candidates = this.getCandidates(job.id);
      allCandidates.push(...candidates);
    });
    
    return allCandidates;
  }

  // Offer Letters
  saveOfferLetter(offer: OfferLetter): void {
    const offers = this.getOfferLetters(offer.companyId);
    const existingIndex = offers.findIndex(o => o.id === offer.id);
    
    if (existingIndex >= 0) {
      offers[existingIndex] = offer;
    } else {
      offers.push(offer);
    }
    
    localStorage.setItem(`hr-offers-${offer.companyId}`, JSON.stringify(offers));
  }

  getOfferLetters(companyId: string): OfferLetter[] {
    const stored = localStorage.getItem(`hr-offers-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Onboarding Plans
  saveOnboardingPlan(plan: OnboardingPlan): void {
    const plans = this.getOnboardingPlans(plan.employeeId);
    const existingIndex = plans.findIndex(p => p.id === plan.id);
    
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
    } else {
      plans.push(plan);
    }
    
    localStorage.setItem(`hr-onboarding-${plan.employeeId}`, JSON.stringify(plans));
  }

  getOnboardingPlans(employeeId: string): OnboardingPlan[] {
    const stored = localStorage.getItem(`hr-onboarding-${employeeId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // Team Analytics
  saveTeamAnalytics(analytics: TeamAnalytics): void {
    localStorage.setItem(`hr-analytics-${analytics.companyId}`, JSON.stringify(analytics));
  }

  getTeamAnalytics(companyId: string): TeamAnalytics | null {
    const stored = localStorage.getItem(`hr-analytics-${companyId}`);
    return stored ? JSON.parse(stored) : null;
  }

  // HR Alerts
  saveHRAlert(alert: HRAlert): void {
    const alerts = this.getHRAlerts(alert.companyId);
    alerts.push(alert);
    localStorage.setItem(`hr-alerts-${alert.companyId}`, JSON.stringify(alerts));
  }

  getHRAlerts(companyId: string): HRAlert[] {
    const stored = localStorage.getItem(`hr-alerts-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  markAlertAsRead(companyId: string, alertId: string): void {
    const alerts = this.getHRAlerts(companyId);
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      localStorage.setItem(`hr-alerts-${companyId}`, JSON.stringify(alerts));
    }
  }

  // Reimbursement Management
  saveReimbursement(reimbursement: Reimbursement): void {
    const reimbursements = this.getReimbursements(reimbursement.companyId);
    const existingIndex = reimbursements.findIndex(r => r.id === reimbursement.id);
    
    if (existingIndex >= 0) {
      reimbursements[existingIndex] = reimbursement;
    } else {
      reimbursements.push(reimbursement);
    }
    
    localStorage.setItem(`hr-reimbursements-${reimbursement.companyId}`, JSON.stringify(reimbursements));
  }

  getReimbursements(companyId: string): Reimbursement[] {
    const stored = localStorage.getItem(`hr-reimbursements-${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }

  getEmployeeReimbursements(employeeId: string, companyId: string): Reimbursement[] {
    const allReimbursements = this.getReimbursements(companyId);
    return allReimbursements.filter(r => r.employeeId === employeeId);
  }

  // Utility Methods
  calculateTotalPayroll(companyId: string, month: string): number {
    const payrolls = this.getPayrollRecords(companyId);
    return payrolls
      .filter(p => p.payPeriod.includes(month))
      .reduce((sum, p) => sum + p.totalNet, 0);
  }

  getActiveEmployeeCount(companyId: string): number {
    const employees = this.getEmployees(companyId);
    return employees.filter(e => e.status === 'active').length;
  }

  getPendingLeaveRequests(companyId: string): LeaveRequest[] {
    const leaves = this.getCompanyLeaveRequests(companyId);
    return leaves.filter(l => l.status === 'pending');
  }

  getUpcomingBirthdays(companyId: string, days: number = 7): Employee[] {
    const employees = this.getEmployees(companyId);
    const today = new Date();
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return employees.filter(emp => {
      if (!emp.personalInfo.dateOfBirth) return false;
      
      const birthDate = new Date(emp.personalInfo.dateOfBirth);
      const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      
      return thisYearBirthday >= today && thisYearBirthday <= futureDate;
    });
  }

  // Export functionality
  exportToCSV(companyId: string, dataType: 'employees' | 'payroll' | 'leaves'): string {
    let data: any[] = [];
    let headers: string[] = [];

    switch (dataType) {
      case 'employees':
        data = this.getEmployees(companyId);
        headers = ['Name', 'Email', 'Role', 'Department', 'Status', 'Joining Date', 'Gross Salary'];
        break;
      case 'payroll':
        data = this.getPayrollRecords(companyId);
        headers = ['Pay Period', 'Total Gross', 'Total Deductions', 'Total Net', 'Status'];
        break;
      case 'leaves':
        data = this.getCompanyLeaveRequests(companyId);
        headers = ['Employee ID', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status'];
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
      employees: this.getEmployees(companyId),
      leaves: this.getCompanyLeaveRequests(companyId),
      payroll: this.getPayrollRecords(companyId),
      jobs: this.getJobDescriptions(companyId),
      candidates: this.getCompanyCandidates(companyId),
      offers: this.getOfferLetters(companyId),
      analytics: this.getTeamAnalytics(companyId),
      alerts: this.getHRAlerts(companyId),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(backup, null, 2);
  }

  restoreFromBackup(companyId: string, backupData: string): boolean {
    try {
      const backup = JSON.parse(backupData);
      
      if (backup.employees) {
        localStorage.setItem(`hr-employees-${companyId}`, JSON.stringify(backup.employees));
      }
      if (backup.payroll) {
        localStorage.setItem(`hr-payroll-${companyId}`, JSON.stringify(backup.payroll));
      }
      if (backup.jobs) {
        localStorage.setItem(`hr-jobs-${companyId}`, JSON.stringify(backup.jobs));
      }
      if (backup.offers) {
        localStorage.setItem(`hr-offers-${companyId}`, JSON.stringify(backup.offers));
      }
      if (backup.analytics) {
        localStorage.setItem(`hr-analytics-${companyId}`, JSON.stringify(backup.analytics));
      }
      if (backup.alerts) {
        localStorage.setItem(`hr-alerts-${companyId}`, JSON.stringify(backup.alerts));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to restore HR backup:', error);
      return false;
    }
  }
}

export const hrStorage = HRStorage.getInstance();

// Export convenience function for easier access
export const getEmployees = (companyId: string = 'default'): Employee[] => {
  return hrStorage.getEmployees(companyId);
};
