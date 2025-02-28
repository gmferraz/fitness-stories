import { useState } from 'react';
import '../../translation';
// import Purchases from 'react-native-purchases';

import { useMountEffect } from '~/utils/use-mount-effect';
import {
  InitializeEnvironmentStatus,
  useEnvironmentStore,
  useInitializeEnvironment,
} from './use-environment';
import { useAds } from '../ads/use-ads';

type AppSetupState = 'pending' | 'done' | 'failed';

export const runSynchronousSetupChores = () => {
  // TODO: Uncomment this when we have a way to test the app without ads
  // Purchases.configure({
  //   apiKey:
  //     Platform.select({
  //       ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
  //       android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
  //     }) ?? '',
  // });
};

export const useAppSetup = () => {
  const [state, setState] = useState<AppSetupState>('pending');
  const { status } = useInitializeEnvironment();
  const { createAppOpenAd } = useAds();
  const isPremium = useEnvironmentStore((state) => state.isPremium);

  useMountEffect(() => {
    const runSetup = async () => {};

    const completeSetup = () => {
      const appOpenAd = createAppOpenAd();
      appOpenAd?.load();
      setState('done');
      setTimeout(() => {
        if (!isPremium && appOpenAd?.loaded) {
          appOpenAd?.show();
        }
      }, 1000);
    };

    runSetup()
      .then(completeSetup)
      .catch(() => runSetup().then(completeSetup))
      .catch((e) => {
        console.error(e);
        setState('failed');
      });
  });

  return {
    state: getCombinedState(state, status),
    appSetupState: state,
    environmentSetupState: status,
  };
};

function getCombinedState(
  appSetupState: AppSetupState,
  environmentSetupState: InitializeEnvironmentStatus
): AppSetupState {
  if (appSetupState === 'pending' || environmentSetupState === 'pending') return 'pending';
  if (appSetupState === 'failed' || environmentSetupState === 'failed') return 'failed';

  if (
    appSetupState === 'done' &&
    (environmentSetupState === 'done' ||
      environmentSetupState === 'doneButNoUser' ||
      environmentSetupState === 'doneButLoggedOut')
  )
    return 'done';

  return 'pending';
}
