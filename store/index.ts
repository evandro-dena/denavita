// Store global — Zustand
// Será expandido nos próximos prompts
import { create } from 'zustand';

interface AppState {
  isAuthenticated: boolean;
}

export const useAppStore = create<AppState>(() => ({
  isAuthenticated: false,
}));
