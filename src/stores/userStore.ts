import { create } from 'zustand';

// User interface for the store
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'founder' | 'investor' | 'mentor';
  createdAt: string;
  updatedAt: string;
  onboardingStep: string | null;
  isOnboarded: boolean;
  onboardingData: Record<string, unknown> | null;
}

// User store interface
interface UserStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  
  // Getters
  isAdmin: () => boolean;
  hasRole: (role: string) => boolean;
  getUserId: () => string | null;
  getUserEmail: () => string | null;
  getUserName: () => string | null;
}

// Create the Zustand store
export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,

  // Actions
  setUser: (user: User) => {
    set({ 
      user, 
      isAuthenticated: true 
    });
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      set({ user: updatedUser });
    }
  },

  clearUser: () => {
    set({ 
      user: null, 
      isAuthenticated: false 
    });
  },

  // Getters
  isAdmin: () => {
    const user = get().user;
    return user?.role === 'admin';
  },

  hasRole: (role: string) => {
    const user = get().user;
    return user?.role === role;
  },

  getUserId: () => {
    const user = get().user;
    return user?.id || null;
  },

  getUserEmail: () => {
    const user = get().user;
    return user?.email || null;
  },

  getUserName: () => {
    const user = get().user;
    return user?.name || null;
  },
}));