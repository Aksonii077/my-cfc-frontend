
import { Startup } from '@/types/startup';
import { STARTUP_MILESTONES } from '@/components/dashboard/ProgressTracker';

export const calculateStartupProgress = (startup: Startup): number => {
  let progress = 0;
  
  progress += 12.5;
  
  const teamScore = Math.min((startup.teamSize || 1) / 3, 1) * 12.5;
  progress += teamScore;
  
  if (startup.stage === 'MVP' || startup.stage === 'Growth' || startup.stage === 'Scaling') {
    progress += 12.5;
  }
  
  if (startup.stage === 'Growth' || startup.stage === 'Scaling') {
    progress += 12.5;
  }
  
  const fundingScore = Math.min((startup.fundingReceived || 0) / 1000, 1) * 12.5;
  progress += fundingScore;
  
  if (startup.stage === 'Growth' || startup.stage === 'Scaling') {
    progress += 12.5;
  }
  
  if (startup.stage === 'Scaling') {
    progress += 12.5;
  }
  
  if (startup.fundingStage === 'fund') {
    progress += 12.5;
  }
  
  return Math.min(Math.round(progress), 100);
};

export const getCurrentMilestone = (progress: number): string => {
  const milestoneIndex = Math.floor((progress / 100) * STARTUP_MILESTONES.length);
  const adjustedIndex = Math.min(milestoneIndex, STARTUP_MILESTONES.length - 1);
  return STARTUP_MILESTONES[adjustedIndex].name;
};

export const getNextActionItem = (startup: Startup, progress: number): string => {
  if (progress < 25) {
    return 'Complete core team assembly and MVP development';
  } else if (progress < 50) {
    return 'Acquire first customers and secure seed funding';
  } else if (progress < 75) {
    return 'Focus on growth and expand customer base';
  } else {
    return 'Scale operations and prepare for Series A funding';
  }
};
