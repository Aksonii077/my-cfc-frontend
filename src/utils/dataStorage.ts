
import { CompletedTaskData } from '@/types/completionData';

const STORAGE_KEY = 'startup_completion_data';

export const saveCompletionData = (taskId: string, data: any, notes?: string) => {
  const existingData = getCompletionData();
  const completionRecord: CompletedTaskData = {
    taskId,
    completionDate: new Date().toISOString(),
    data,
    notes
  };
  
  existingData[taskId] = completionRecord;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
};

export const getCompletionData = (): Record<string, CompletedTaskData> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getTaskCompletionData = (taskId: string): CompletedTaskData | null => {
  const allData = getCompletionData();
  return allData[taskId] || null;
};

export const deleteCompletionData = (taskId: string) => {
  const existingData = getCompletionData();
  delete existingData[taskId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
};

export const exportCompletionData = () => {
  const data = getCompletionData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'startup-completion-data.json';
  a.click();
  URL.revokeObjectURL(url);
};
