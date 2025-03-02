import { captureException } from '@sentry/react-native';
import { useEffect, useState } from 'react';
import Purchases from 'react-native-purchases';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { isTestFlight } from 'expo-testflight';

const envStorage = new MMKV({
  id: 'environment-storage',
});

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return envStorage.set(name, value);
  },
  getItem: (name) => {
    const value = envStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return envStorage.delete(name);
  },
};

interface EnvironmentState {
  userEmail: string | null;
  userGivenName: string | null;

  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (data: boolean) => void;

  userId: string | null;
  setUserId: (userId: string | null) => void;

  isPremium: boolean;
  setIsPremium: (isPremium: boolean) => void;

  isPremiumForever: boolean;
  setIsPremiumForever: (isPremiumForever: boolean) => void;

  isGui: boolean;
  setIsGui: (isGui: boolean) => void;

  reset: () => void;
}

export const useEnvironmentStore = create(
  persist<EnvironmentState>(
    (set) => ({
      userEmail: null,
      userGivenName: null,
      isGui: false,
      isPremium: false,
      isPremiumForever: false,
      hasCompletedOnboarding: false,
      setIsPremium: (data) => set(() => ({ isPremium: data })),
      setIsPremiumForever: (data) => set(() => ({ isPremiumForever: data })),
      setIsGui: (data) => set(() => ({ isGui: data })),
      userId: null,
      setUserId: (data) => set(() => ({ userId: data })),
      setHasCompletedOnboarding: (data) =>
        set(() => ({
          hasCompletedOnboarding: data,
        })),
      reset: () =>
        set(() => ({
          hasCompletedOnboarding: false,
          userId: null,
          email: null,
          givenName: null,
          isGui: false,
          isPremium: false,
          isPremiumForever: false,
        })),
    }),
    {
      name: 'environment',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export const useCurrentUserId = () => {
  const storedUserId = useEnvironmentStore((s) => s.userId);
  const setUserId = useEnvironmentStore((s) => s.setUserId);

  const setAndPersistUserId = (id: string | null) => {
    if (storedUserId === id) return;
    setUserId(id);
  };

  return { userId: storedUserId, setUserId: setAndPersistUserId };
};

export type InitializeEnvironmentStatus =
  | 'pending'
  | 'done'
  | 'doneButNoUser'
  | 'doneButLoggedOut'
  | 'failed';

export const useInitializeEnvironment = () => {
  const { userId } = useCurrentUserId();
  const setIsPremium = useEnvironmentStore((s) => s.setIsPremium);
  const isPremiumForever = useEnvironmentStore((s) => s.isPremiumForever);
  const [status, setStatus] = useState<InitializeEnvironmentStatus>('pending');

  const runInitialize = async () => {
    try {
      // If user has redeemed a code that grants premium forever, set premium to true
      if (isPremiumForever) {
        setIsPremium(true);
        return;
      }

      const customerInfo = await Purchases.getCustomerInfo();
      if (typeof customerInfo.entitlements.active['premium'] !== 'undefined' || isTestFlight) {
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }
    } catch (e) {
      captureException(e);
    } finally {
      setStatus('done');
    }
  };

  useEffect(() => {
    runInitialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isPremiumForever]);

  return { status, runInitialize };
};
