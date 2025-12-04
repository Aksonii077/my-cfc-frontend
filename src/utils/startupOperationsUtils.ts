
import { Startup } from '@/types/startup';

export const voteForStartup = (startup: Startup): Startup => {
  return {
    ...startup,
    votes: (startup.votes || 0) + 1,
    engagementScore: (startup.engagementScore || 0) + 5
  };
};

export const investInStartup = (startup: Startup, amount: number): Startup => {
  const currentCoins = startup.coinsReceived || 0;
  const currentAngel = startup.angelCommitments || 0;
  
  return {
    ...startup,
    coinsReceived: currentCoins + amount,
    angelCommitments: currentAngel + amount,
    votes: (startup.votes || 0) + 1,
    engagementScore: (startup.engagementScore || 0) + 10
  };
};

export const addMediaToStartup = (startup: Startup, media: { type: string; url: string; title: string }): Startup => {
  const updatedStartup = { ...startup };
  
  if (media.type === 'video') {
    updatedStartup.pitchVideo = media.url;
  } else if (media.type === 'image') {
    const currentImages = updatedStartup.images || [];
    updatedStartup.images = [...currentImages, media.url];
  }
  
  return updatedStartup;
};
