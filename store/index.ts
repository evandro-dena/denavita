// Store global — Zustand
import { create } from 'zustand';

interface AppState {
  isAuthenticated: boolean;
  likedRecipeIds: Set<string>;
  toggleLikedRecipe: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  likedRecipeIds: new Set(),
  toggleLikedRecipe: (id: string) =>
    set((state) => {
      const next = new Set(state.likedRecipeIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { likedRecipeIds: next };
    }),
}));
