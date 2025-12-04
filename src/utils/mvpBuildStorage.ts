
import { MVPBuildProgress, AIBrief, LovableProject } from '@/types/mvpBuild';

const MVP_BUILD_STORAGE_KEY = 'mvp_build_data';
const LOVABLE_PROJECTS_KEY = 'lovable_projects';

export const saveMVPBuildProgress = (progress: MVPBuildProgress) => {
  const existingData = getMVPBuildData();
  existingData[progress.id] = progress;
  localStorage.setItem(MVP_BUILD_STORAGE_KEY, JSON.stringify(existingData));
};

export const getMVPBuildData = (): Record<string, MVPBuildProgress> => {
  const stored = localStorage.getItem(MVP_BUILD_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getMVPBuildProgress = (id: string): MVPBuildProgress | null => {
  const allData = getMVPBuildData();
  return allData[id] || null;
};

export const saveAIBrief = (projectId: string, brief: AIBrief) => {
  const briefKey = `ai_brief_${projectId}`;
  localStorage.setItem(briefKey, JSON.stringify(brief));
};

export const getAIBrief = (projectId: string): AIBrief | null => {
  const briefKey = `ai_brief_${projectId}`;
  const stored = localStorage.getItem(briefKey);
  return stored ? JSON.parse(stored) : null;
};

export const saveLovableProject = (project: LovableProject) => {
  const existingProjects = getLovableProjects();
  existingProjects[project.id] = project;
  localStorage.setItem(LOVABLE_PROJECTS_KEY, JSON.stringify(existingProjects));
};

export const getLovableProjects = (): Record<string, LovableProject> => {
  const stored = localStorage.getItem(LOVABLE_PROJECTS_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const generateLovableReferralUrl = (utmSource = 'cofounder-circle') => {
  return `https://lovable.dev?utm_source=${utmSource}&utm_medium=partner&utm_campaign=mvp-builder`;
};

export const createMockProgressData = (projectId: string): MVPBuildProgress => {
  return {
    id: projectId,
    userId: 'current-user',
    projectName: 'My Awesome MVP',
    currentStage: 'brief-received',
    stages: {
      'brief-received': {
        status: 'completed',
        completedAt: new Date().toISOString(),
      },
      'discovery': {
        status: 'pending',
        estimatedDuration: '2-3 days',
      },
      'design': {
        status: 'pending',
        estimatedDuration: '3-5 days',
      },
      'development': {
        status: 'pending',
        estimatedDuration: '7-14 days',
      },
      'mvp-complete': {
        status: 'pending',
      },
    },
    estimatedCompletion: '2-3 weeks',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
