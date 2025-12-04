
import { Employee, JobDescription, OfferLetter, OnboardingPlan, TeamAnalytics, ConversationalHRQuery, CandidateProfile, LeaveRequest } from '@/types/hr';
import { hrStorage } from './hrStorage';

export class AIHREngine {
  private static instance: AIHREngine;
  
  static getInstance(): AIHREngine {
    if (!AIHREngine.instance) {
      AIHREngine.instance = new AIHREngine();
    }
    return AIHREngine.instance;
  }

  // Job Description Generation
  async generateJobDescription(role: string, experience: string, additionalRequirements?: string): Promise<JobDescription> {
    // Simulate AI generation with industry-standard templates
    const jdTemplates = {
      'frontend developer': {
        responsibilities: [
          'Develop responsive web applications using modern frameworks',
          'Collaborate with designers to implement pixel-perfect UIs',
          'Write clean, maintainable, and testable code',
          'Optimize applications for maximum speed and scalability',
          'Participate in code reviews and technical discussions'
        ],
        requirements: [
          `${experience} of experience in frontend development`,
          'Proficiency in React, JavaScript, TypeScript',
          'Experience with HTML5, CSS3, and responsive design',
          'Knowledge of state management (Redux, Context API)',
          'Understanding of RESTful APIs and GraphQL'
        ],
        skills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Git', 'Responsive Design']
      },
      'backend developer': {
        responsibilities: [
          'Design and develop scalable backend services and APIs',
          'Work with databases to optimize query performance',
          'Implement authentication and authorization systems',
          'Monitor and maintain application performance',
          'Collaborate with frontend team for API integration'
        ],
        requirements: [
          `${experience} of experience in backend development`,
          'Proficiency in Node.js, Python, or Java',
          'Experience with databases (MongoDB, PostgreSQL)',
          'Knowledge of cloud platforms (AWS, GCP)',
          'Understanding of microservices architecture'
        ],
        skills: ['Node.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'API Development']
      },
      'product manager': {
        responsibilities: [
          'Define product vision and strategy aligned with business goals',
          'Conduct market research and competitive analysis',
          'Work with engineering teams to prioritize features',
          'Analyze user feedback and product metrics',
          'Coordinate product launches and go-to-market strategies'
        ],
        requirements: [
          `${experience} of experience in product management`,
          'Strong analytical and problem-solving skills',
          'Experience with product analytics tools',
          'Understanding of user experience design',
          'Excellent communication and leadership skills'
        ],
        skills: ['Product Strategy', 'Analytics', 'User Research', 'Agile', 'Wireframing']
      }
    };

    const template = jdTemplates[role.toLowerCase() as keyof typeof jdTemplates] || jdTemplates['frontend developer'];
    
    return {
      id: `jd-${Date.now()}`,
      companyId: 'demo-company',
      title: role,
      department: this.inferDepartment(role),
      experienceLevel: this.parseExperienceLevel(experience),
      experienceYears: experience,
      jobType: 'full-time',
      location: 'Bangalore, India (Hybrid)',
      salaryRange: this.generateSalaryRange(role, experience),
      responsibilities: template.responsibilities,
      requirements: template.requirements,
      skills: template.skills,
      benefits: [
        'Competitive salary with equity participation',
        'Health insurance for you and family',
        'Flexible working hours and remote options',
        'Learning and development budget',
        'Annual team retreats and events'
      ],
      description: `We are looking for a talented ${role} to join our growing startup team. You'll work in a fast-paced environment where your contributions directly impact our product and growth.`,
      postedDate: new Date().toISOString(),
      status: 'draft',
      applicantCount: 0,
      aiGenerated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Offer Letter Generation
  async generateOfferLetter(candidateInfo: any, roleDetails: any): Promise<OfferLetter> {
    const grossSalary = parseInt(roleDetails.salary) || 1200000;
    const compensation = this.calculateCompensation(grossSalary);

    return {
      id: `offer-${Date.now()}`,
      candidateId: candidateInfo.id || 'candidate-1',
      companyId: 'demo-company',
      role: roleDetails.role,
      department: roleDetails.department,
      startDate: roleDetails.joinDate,
      compensation,
      benefits: [
        'Health insurance for employee and family',
        'Provident Fund as per statutory requirements',
        'Gratuity as per Payment of Gratuity Act',
        'Flexible working hours',
        'Learning and development opportunities'
      ],
      workLocation: 'Hybrid (Bangalore office + remote)',
      reportingManager: 'To be assigned',
      probationPeriod: 6,
      noticePeriod: 30,
      terms: [
        'Employment is subject to successful background verification',
        'Confidentiality and non-disclosure agreements apply',
        'Company policies and code of conduct must be followed',
        'Subject to Indian labor laws and regulations'
      ],
      status: 'draft',
      offerLetterUrl: undefined,
      aiGenerated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Onboarding Plan Generation
  async generateOnboardingPlan(role: string, department: string): Promise<OnboardingPlan> {
    const baseTasks = [
      {
        id: 'task-1',
        title: 'Complete documentation',
        description: 'Submit all required documents including PAN, Aadhaar, bank details',
        category: 'administrative' as const,
        assignedTo: 'HR Team',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const,
        priority: 'high' as const,
        dependencies: []
      },
      {
        id: 'task-2',
        title: 'IT equipment setup',
        description: 'Receive laptop, email setup, access to company tools',
        category: 'technical' as const,
        assignedTo: 'IT Team',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const,
        priority: 'high' as const,
        dependencies: []
      },
      {
        id: 'task-3',
        title: 'Company orientation',
        description: 'Learn about company culture, values, and policies',
        category: 'cultural' as const,
        assignedTo: 'HR Team',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const,
        priority: 'medium' as const,
        dependencies: ['task-1']
      }
    ];

    // Add role-specific tasks
    if (role.toLowerCase().includes('developer')) {
      baseTasks.push({
        id: 'task-4',
        title: 'Development environment setup',
        description: 'Set up development tools, access to repositories, and coding standards',
        category: 'technical' as const,
        assignedTo: 'Tech Lead',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const,
        priority: 'high' as const,
        dependencies: ['task-2']
      });
    }

    return {
      id: `onboarding-${Date.now()}`,
      employeeId: 'new-employee',
      role,
      department,
      startDate: new Date().toISOString(),
      tasks: baseTasks,
      documents: [
        {
          id: 'doc-1',
          title: 'Employee Handbook',
          description: 'Complete guide to company policies and procedures',
          category: 'handbook',
          required: true,
          status: 'not-started',
          signRequired: false
        },
        {
          id: 'doc-2',
          title: 'Employment Contract',
          description: 'Signed employment agreement',
          category: 'contract',
          required: true,
          status: 'not-started',
          signRequired: true
        }
      ],
      trainingSessions: [
        {
          id: 'training-1',
          title: 'Company Culture and Values',
          description: 'Introduction to our mission, vision, and working principles',
          type: 'instructor-led',
          duration: 120,
          materials: ['Culture Deck', 'Values Presentation'],
          status: 'scheduled',
          completionPercentage: 0
        }
      ],
      checkpoints: [
        {
          id: 'checkpoint-1',
          title: '30-day check-in',
          description: 'Review progress and gather feedback',
          scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          participants: ['new-employee', 'manager', 'hr'],
          status: 'scheduled',
          actionItems: []
        }
      ],
      status: 'not-started',
      completionPercentage: 0,
      aiGenerated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Team Analytics Generation
  async generateTeamAnalytics(companyId: string): Promise<TeamAnalytics> {
    const employees = hrStorage.getEmployees(companyId);
    const payrolls = hrStorage.getPayrollRecords(companyId);
    const leaves = hrStorage.getCompanyLeaveRequests(companyId);

    // Calculate department breakdown
    const deptStats = employees.reduce((acc, emp) => {
      const dept = emp.employmentInfo.department;
      if (!acc[dept]) {
        acc[dept] = { count: 0, totalSalary: 0 };
      }
      acc[dept].count++;
      acc[dept].totalSalary += emp.compensation.grossSalary;
      return acc;
    }, {} as Record<string, { count: number; totalSalary: number }>);

    const departmentBreakdown = Object.entries(deptStats).map(([dept, stats]) => ({
      department: dept,
      headcount: stats.count,
      averageSalary: stats.totalSalary / stats.count,
      vacancies: Math.floor(Math.random() * 3), // Simulated
      turnoverRate: Math.random() * 15 // Simulated 0-15%
    }));

    // Calculate other metrics
    const totalPayroll = employees.reduce((sum, emp) => sum + emp.compensation.grossSalary, 0);
    const averageTenure = employees.reduce((sum, emp) => {
      const tenure = (Date.now() - new Date(emp.employmentInfo.joiningDate).getTime()) / (365 * 24 * 60 * 60 * 1000);
      return sum + tenure;
    }, 0) / employees.length;

    return {
      companyId,
      totalEmployees: employees.length,
      departmentBreakdown,
      averageTenure,
      turnoverRate: Math.random() * 12, // Simulated annual turnover
      diversityMetrics: {
        genderDistribution: { male: Math.floor(employees.length * 0.6), female: Math.floor(employees.length * 0.35), other: Math.floor(employees.length * 0.05) },
        ageDistribution: { '20-30': Math.floor(employees.length * 0.4), '30-40': Math.floor(employees.length * 0.4), '40-50': Math.floor(employees.length * 0.15), '50+': Math.floor(employees.length * 0.05) },
        experienceDistribution: { 'entry': Math.floor(employees.length * 0.3), 'mid': Math.floor(employees.length * 0.5), 'senior': Math.floor(employees.length * 0.2) }
      },
      compensationStats: {
        averageSalary: totalPayroll / employees.length,
        medianSalary: this.calculateMedianSalary(employees),
        salaryRange: { min: Math.min(...employees.map(e => e.compensation.grossSalary)), max: Math.max(...employees.map(e => e.compensation.grossSalary)) },
        totalPayrollCost: totalPayroll,
        salaryBandCompliance: 0.85 // Simulated compliance percentage
      },
      performanceStats: {
        averageRating: 3.8,
        highPerformers: Math.floor(employees.length * 0.2),
        lowPerformers: Math.floor(employees.length * 0.1),
        goalCompletionRate: 0.75
      },
      leaveStats: {
        totalLeavesTaken: leaves.filter(l => l.status === 'approved').length,
        averageLeavePerEmployee: leaves.length / employees.length,
        mostUsedLeaveType: 'casual',
        leaveApprovalRate: 0.9
      },
      workloadDistribution: employees.map(emp => ({
        employeeId: emp.id,
        name: emp.personalInfo.name,
        activeTasks: Math.floor(Math.random() * 10) + 1,
        completedTasks: Math.floor(Math.random() * 20) + 5,
        overdueTask: Math.floor(Math.random() * 3),
        workloadScore: Math.random() * 100,
        burnoutRisk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      })),
      hiringForecast: {
        nextQuarterHires: Math.ceil(employees.length * 0.2),
        priorityRoles: ['Senior Developer', 'Product Manager', 'Marketing Specialist'],
        budgetRequirement: Math.ceil(employees.length * 0.2) * 1500000,
        timeToHire: 45,
        recommendations: [
          'Focus on senior-level hires to reduce training time',
          'Consider remote candidates to expand talent pool',
          'Implement employee referral program for faster hiring'
        ]
      },
      generatedAt: new Date().toISOString()
    };
  }

  // Natural Language Query Processing
  async processHRQuery(companyId: string, query: string): Promise<ConversationalHRQuery> {
    const lowerQuery = query.toLowerCase();
    let intent: ConversationalHRQuery['intent'] = 'general';
    let response = '';

    const employees = hrStorage.getEmployees(companyId);
    const leaves = hrStorage.getCompanyLeaveRequests(companyId);
    const payrolls = hrStorage.getPayrollRecords(companyId);

    // Intent detection and response generation
    if (lowerQuery.includes('payroll') || lowerQuery.includes('salary') || lowerQuery.includes('cost')) {
      intent = 'payroll';
      const thisMonth = new Date().toISOString().slice(0, 7);
      const monthlyPayroll = hrStorage.calculateTotalPayroll(companyId, thisMonth);
      response = `This month's total payroll is ₹${monthlyPayroll.toLocaleString()}. You have ${employees.length} active employees with an average salary of ₹${Math.round(monthlyPayroll / employees.length).toLocaleString()}.`;
    } else if (lowerQuery.includes('leave') || lowerQuery.includes('absence') || lowerQuery.includes('vacation')) {
      intent = 'leave';
      const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
      const approvedLeaves = leaves.filter(l => l.status === 'approved' && new Date(l.startDate) <= new Date() && new Date(l.endDate) >= new Date()).length;
      response = `You have ${pendingLeaves} pending leave requests and ${approvedLeaves} employees currently on leave. Recent leave trends show healthy work-life balance.`;
    } else if (lowerQuery.includes('hire') || lowerQuery.includes('recruit') || lowerQuery.includes('candidate')) {
      intent = 'hiring';
      response = `Based on your current team workload, I recommend prioritizing a Senior Developer and Product Manager. Average time-to-hire is 45 days. Consider implementing an employee referral program to speed up the process.`;
    } else if (lowerQuery.includes('team') || lowerQuery.includes('employee') || lowerQuery.includes('staff')) {
      intent = 'employee-info';
      const activeCount = employees.filter(e => e.status === 'active').length;
      const departments = [...new Set(employees.map(e => e.employmentInfo.department))];
      response = `You have ${activeCount} active employees across ${departments.length} departments: ${departments.join(', ')}. Team is growing at a healthy pace with good retention rates.`;
    } else if (lowerQuery.includes('performance') || lowerQuery.includes('rating') || lowerQuery.includes('review')) {
      intent = 'analytics';
      response = `Team performance metrics show 75% goal completion rate with average rating of 3.8/5. ${Math.floor(employees.length * 0.2)} employees are high performers. Consider scheduling quarterly reviews for better tracking.`;
    } else if (lowerQuery.includes('compliance') || lowerQuery.includes('policy') || lowerQuery.includes('legal')) {
      intent = 'compliance';
      response = `HR compliance status: 85% documentation complete. Upcoming: PF returns due next month, 3 employees need PAN updates. All employment contracts are up to date.`;
    } else {
      // General summary
      const totalPayroll = employees.reduce((sum, emp) => sum + emp.compensation.grossSalary, 0);
      response = `HR Summary: ${employees.length} employees, ₹${Math.round(totalPayroll/12).toLocaleString()}/month payroll, ${leaves.filter(l => l.status === 'pending').length} pending leaves. Team health looks good!`;
    }

    return {
      id: `hr-query-${Date.now()}`,
      query,
      intent,
      response,
      confidence: 0.8,
      timestamp: new Date().toISOString(),
      userId: 'current-user'
    };
  }

  // Candidate Scoring
  async scoreCandidate(candidate: CandidateProfile, jobRequirements: string[]): Promise<{ score: number; assessment: string }> {
    // Simple AI scoring based on skill matching
    const candidateSkills = candidate.skills.map(s => s.toLowerCase());
    const requiredSkills = jobRequirements.map(r => r.toLowerCase());
    
    const skillMatch = requiredSkills.filter(req => 
      candidateSkills.some(skill => skill.includes(req) || req.includes(skill))
    ).length;
    
    const skillScore = (skillMatch / requiredSkills.length) * 40; // 40% weight
    const experienceScore = Math.min((candidate.experience / 5) * 30, 30); // 30% weight, capped at 5 years
    const profileScore = candidate.personalInfo.linkedinUrl ? 15 : 0; // 15% for professional presence
    const portfolioScore = candidate.portfolioUrl ? 15 : 0; // 15% for portfolio
    
    const totalScore = skillScore + experienceScore + profileScore + portfolioScore;
    
    let assessment = '';
    if (totalScore >= 80) {
      assessment = 'Excellent candidate - Strong technical skills, relevant experience, and professional presence. Highly recommended for interview.';
    } else if (totalScore >= 60) {
      assessment = 'Good candidate - Meets most requirements with some potential gaps. Recommended for screening call.';
    } else if (totalScore >= 40) {
      assessment = 'Average candidate - Basic requirements met but may need additional evaluation. Consider for initial screening.';
    } else {
      assessment = 'Below requirements - Significant skill or experience gaps. May not be suitable for this role.';
    }
    
    return {
      score: Math.round(totalScore),
      assessment
    };
  }

  // Helper Methods
  private inferDepartment(role: string): string {
    const roleMapping = {
      'developer': 'Technology',
      'engineer': 'Technology',
      'designer': 'Design',
      'product': 'Product',
      'marketing': 'Marketing',
      'sales': 'Sales',
      'hr': 'Human Resources',
      'finance': 'Finance',
      'operations': 'Operations'
    };

    const roleLower = role.toLowerCase();
    for (const [key, dept] of Object.entries(roleMapping)) {
      if (roleLower.includes(key)) return dept;
    }
    return 'General';
  }

  private parseExperienceLevel(experience: string): 'entry' | 'mid' | 'senior' | 'lead' | 'principal' {
    if (experience.includes('0-2') || experience.includes('junior')) return 'entry';
    if (experience.includes('2-5') || experience.includes('mid')) return 'mid';
    if (experience.includes('5+') || experience.includes('senior')) return 'senior';
    if (experience.includes('8+') || experience.includes('lead')) return 'lead';
    return 'mid';
  }

  private generateSalaryRange(role: string, experience: string) {
    const baseSalary = role.toLowerCase().includes('senior') ? 1500000 : 
                     role.toLowerCase().includes('lead') ? 2000000 : 
                     1000000;
    
    const experienceMultiplier = experience.includes('0-2') ? 0.7 :
                                experience.includes('2-5') ? 1.0 :
                                experience.includes('5+') ? 1.3 : 1.0;
    
    const min = Math.round(baseSalary * experienceMultiplier * 0.8);
    const max = Math.round(baseSalary * experienceMultiplier * 1.2);
    
    return { min, max, currency: 'INR' };
  }

  private calculateCompensation(grossSalary: number) {
    const basicSalary = Math.round(grossSalary * 0.5);
    const hra = Math.round(basicSalary * 0.4);
    const transportAllowance = 1600;
    const mealAllowance = 2200;
    const otherAllowances = grossSalary - basicSalary - hra - transportAllowance - mealAllowance;
    
    const pfContribution = Math.round(basicSalary * 0.12);
    const esiContribution = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0;
    const professionalTax = 2400;
    const tds = Math.round(grossSalary * 0.1);
    
    const netSalary = grossSalary - pfContribution - esiContribution - professionalTax - tds;

    return {
      basicSalary,
      hra,
      transportAllowance,
      mealAllowance,
      otherAllowances,
      grossSalary,
      pfContribution,
      esiContribution,
      professionalTax,
      tds,
      netSalary,
      paymentCycle: 'monthly' as const
    };
  }

  private calculateMedianSalary(employees: Employee[]): number {
    const salaries = employees.map(e => e.compensation.grossSalary).sort((a, b) => a - b);
    const mid = Math.floor(salaries.length / 2);
    return salaries.length % 2 === 0 ? (salaries[mid - 1] + salaries[mid]) / 2 : salaries[mid];
  }
}

export const aiHREngine = AIHREngine.getInstance();
