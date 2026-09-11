import { create } from 'zustand';

export type AppRoute =
  | { name: 'launchpad' }
  | { name: 'module-home'; moduleId: string }
  | { name: 'number-sequence' }
  | { name: 'learning'; moduleId: string }
  | { name: 'training-setup'; moduleId: string }
  | { name: 'training-session'; moduleId: string }
  | { name: 'result'; moduleId: string }
  | { name: 'statistics'; moduleId?: string }
  | { name: 'settings' };

interface AppState {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  goBack: () => void;
  history: AppRoute[];
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRoute: { name: 'launchpad' },
  history: [{ name: 'launchpad' }],

  navigate: (route) => {
    set((state) => ({
      currentRoute: route,
      history: [...state.history, route],
    }));
    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  goBack: () => {
    const { history } = get();
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const prev = newHistory[newHistory.length - 1];
      set({
        currentRoute: prev,
        history: newHistory,
      });
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      set({ currentRoute: { name: 'launchpad' }, history: [{ name: 'launchpad' }] });
    }
  },
}));
