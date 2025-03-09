import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

// Create a new storage instance for Strava state
export const stravaStateStorage = new MMKV({
  id: 'strava-state-storage',
});

// Create Zustand storage adapter
const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return stravaStateStorage.set(name, value);
  },
  getItem: (name) => {
    const value = stravaStateStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return stravaStateStorage.delete(name);
  },
};

interface StravaState {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  reset: () => void;
}

export const useStravaStore = create(
  persist<StravaState>(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      reset: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'strava-state',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
