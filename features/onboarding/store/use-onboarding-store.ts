import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

export const onboardingStorage = new MMKV({
  id: 'onboarding-storage',
});

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return onboardingStorage.set(name, value);
  },
  getItem: (name) => {
    const value = onboardingStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return onboardingStorage.delete(name);
  },
};

interface OnboardingState {
  currentStep: number;
  isCompleted: boolean;
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      isCompleted: false,
      setCurrentStep: (step) => set({ currentStep: step }),
      completeOnboarding: () => set({ isCompleted: true, currentStep: 0 }),
      resetOnboarding: () => set({ currentStep: 0, isCompleted: false }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
