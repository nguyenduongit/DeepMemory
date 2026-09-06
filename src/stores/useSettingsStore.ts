import { create } from 'zustand';
import { UserSettings } from '../core/progress/progress-types';
import { progressRepository } from '../repositories';

interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  toggleSound: () => Promise<void>;
  toggleReducedMotion: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {
    soundEnabled: true,
    reducedMotion: false,
    theme: 'dark',
  },
  isLoading: true,

  loadSettings: async () => {
    try {
      const s = await progressRepository.getSettings();
      set({ settings: s, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleSound: async () => {
    const current = get().settings;
    const updated: UserSettings = { ...current, soundEnabled: !current.soundEnabled };
    set({ settings: updated });
    await progressRepository.saveSettings(updated);
  },

  toggleReducedMotion: async () => {
    const current = get().settings;
    const updated: UserSettings = { ...current, reducedMotion: !current.reducedMotion };
    set({ settings: updated });
    await progressRepository.saveSettings(updated);
  },
}));
