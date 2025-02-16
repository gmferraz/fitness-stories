import { captureException } from '@sentry/react-native';
import { useEffect, useState } from 'react';
import Purchases from 'react-native-purchases';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

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

  reset: () => void;

  isGui: boolean;
}

export const useEnvironmentStore = create(
  persist<EnvironmentState>(
    (set) => ({
      userEmail: null,
      userGivenName: null,
      isGui: false,
      isPremium: false,
      hasCompletedOnboarding: false,
      setIsPremium: (data) => set(() => ({ isPremium: data })),
      userId: null,
      setUserId: (data) => set(() => ({ userId: data })),
      setHasCompletedOnboarding: (data) =>
        set(() => ({
          hasCompletedOnboarding: data,
        })),
      reset: () =>
        set(() => ({
          runningPlan: null,
          hasCompletedOnboarding: false,
          userId: null,
          email: null,
          givenName: null,
          isGui: false,
          isPremium: false,
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
  const [status, setStatus] = useState<InitializeEnvironmentStatus>('pending');

  const runInitialize = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      if (typeof customerInfo.entitlements.active['premium'] !== 'undefined') {
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
  }, [userId]);

  return { status, runInitialize };
};
