import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

// Create a new storage instance for Apple Health state
const appleHealthStateStorage = new MMKV({
  id: 'apple-health-state-storage',
});

// Create Zustand storage adapter
const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return appleHealthStateStorage.set(name, value);
  },
  getItem: (name) => {
    const value = appleHealthStateStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return appleHealthStateStorage.delete(name);
  },
};

interface AppleHealthStore {
  isAvailable: boolean;
  isAuthenticated: boolean;
  setIsAvailable: (isAvailable: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  reset: () => void;
}

export const useAppleHealthStore = create(
  persist<AppleHealthStore>(
    (set) => ({
      isAvailable: false,
      isAuthenticated: false,
      setIsAvailable: (isAvailable) => set({ isAvailable }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      reset: () => set({ isAvailable: false, isAuthenticated: false }),
    }),
    {
      name: 'apple-health-state',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
