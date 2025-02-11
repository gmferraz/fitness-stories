import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from '~/features/app-setup/use-environment';

interface WeekStartState {
  weekStartsOn: 0 | 1; // 0 for Sunday, 1 for Monday
  setWeekStartsOn: (weekStartsOn: 0 | 1) => void;
}

export const weekStartStore = create<WeekStartState>()(
  persist(
    (set) => ({
      weekStartsOn: 1, // Default to Monday
      setWeekStartsOn: (weekStartsOn) => set({ weekStartsOn }),
    }),
    {
      name: 'week-start-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
