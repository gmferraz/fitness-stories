import { useState } from 'react';
import '../../translation';
import Purchases from 'react-native-purchases';
import * as Sentry from '@sentry/react-native';
import { checkAndUpdatePromoCodeAvailability } from '~/utils/promo-code';

import { useMountEffect } from '~/utils/use-mount-effect';
import {
  InitializeEnvironmentStatus,
  useEnvironmentStore,
  useInitializeEnvironment,
} from './use-environment';
import { useAds } from '../ads/use-ads';
import { MMKV } from 'react-native-mmkv';
import { router } from 'expo-router';
import {
  showRequestReview,
  shouldShowReviewOnNextOpen,
  clearShouldShowReviewOnNextOpen,
} from '~/utils/app-review';
import { Platform } from 'react-native';

type AppSetupState = 'pending' | 'done' | 'failed';

const APP_OPEN_AD_VIEWS_KEY = 'appOpenAdViews';
const PAYWALL_SHOWN_KEY = 'paywallShown';

const storage = new MMKV();

export const runSynchronousSetupChores = () => {
  Purchases.configure({
    apiKey:
      Platform.select({
        ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
        android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
      }) ?? '',
  });
};

export const useAppSetup = () => {
  const [state, setState] = useState<AppSetupState>('pending');
  const { status } = useInitializeEnvironment();
  const { createAppOpenAd } = useAds();
  const isPremium = useEnvironmentStore((state) => state.isPremium);

  const trackAppOpenAdView = () => {
    if (isPremium) return false;

    // Check if paywall was already shown
    const paywallShown = storage.getBoolean(PAYWALL_SHOWN_KEY) || false;
    if (paywallShown) return false;

    // Get current count and increment
    const currentViews = storage.getNumber(APP_OPEN_AD_VIEWS_KEY) || 0;
    const newViews = currentViews + 1;
    storage.set(APP_OPEN_AD_VIEWS_KEY, newViews);

    // Return true if this is the third view
    return newViews === 3;
  };

  const markPaywallAsShown = () => {
    storage.set(PAYWALL_SHOWN_KEY, true);

    Sentry.captureMessage('Paywall shown', {
      level: 'info',
      tags: { action: 'paywall_ads_shown' },
    });

    router.push({
      pathname: '/paywall',
      params: { preset: 'removeAds' },
    });
  };

  useMountEffect(() => {
    const runSetup = async () => {
      const isConfigured = await Purchases.isConfigured();
      if (!isConfigured) {
        Purchases.configure({
          apiKey:
            Platform.select({
              ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
              android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
            }) ?? '',
        });
      }

      // Check promo code availability
      await checkAndUpdatePromoCodeAvailability();
    };

    const completeSetup = () => {
      const appOpenAd = createAppOpenAd();
      appOpenAd?.load();
      setState('done');

      // Show app open ad if applicable
      setTimeout(() => {
        if (!isPremium && appOpenAd?.loaded) {
          appOpenAd?.show().then(() => {
            const isThirdView = trackAppOpenAdView();
            if (isThirdView) {
              markPaywallAsShown();
            }
          });
        }
      }, 2000);

      // Check if we should show review based on previous Instagram share
      const shouldShowReview = shouldShowReviewOnNextOpen();

      if (shouldShowReview) {
        setTimeout(() => {
          showRequestReview();
          clearShouldShowReviewOnNextOpen();
          Sentry.captureMessage('Review request shown after app open (Instagram share)', {
            level: 'info',
            tags: { action: 'review_request_shown_after_app_open' },
          });
        }, 3000);
      }
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
