import { create } from 'zustand';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: (username: string, password: string) => {
    const isValid = username === 'abc' && password === '1234';
    if (isValid) {
      set({ isAuthenticated: true });
    }
    return isValid;
  },
  logout: () => set({ isAuthenticated: false }),
}));