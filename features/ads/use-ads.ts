import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import mobileAds, {
  AppOpenAd,
  InterstitialAd,
  RewardedInterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import { MMKV } from 'react-native-mmkv';

import {
  APP_OPEN_ANDROID_AD_ID,
  APP_OPEN_APPLE_AD_ID,
  INTERSTITIAL_ANDROID_AD_ID,
  INTERSTITIAL_APPLE_AD_ID,
} from './add-ids';
import { useEnvironmentStore } from '../app-setup/use-environment';

const storage = new MMKV();
const TRACKING_PERMISSION_KEY = 'trackingPermission';
const APP_OPEN_AD_VIEWS_KEY = 'appOpenAdViews';
const PAYWALL_SHOWN_KEY = 'paywallShown';

export const useAds = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const isPremium = useEnvironmentStore((state) => state.isPremium);

  useEffect(() => {
    const initializeAds = async () => {
      let trackingPermission = storage.getString(TRACKING_PERMISSION_KEY);

      if (!trackingPermission) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const { status } = await requestTrackingPermissionsAsync();
        trackingPermission = status;
        storage.set(TRACKING_PERMISSION_KEY, status);
      }

      await mobileAds().initialize();
      setIsInitialized(true);
    };

    initializeAds();
  }, [isPremium]);

  const createAppOpenAd = () => {
    if (isPremium) return null;
    return AppOpenAd.createForAdRequest(
      // Platform.select({ ios: APP_OPEN_APPLE_AD_ID!, android: APP_OPEN_ANDROID_AD_ID! }) ?? '',
      TestIds.APP_OPEN,
      {
        requestNonPersonalizedAdsOnly: !isPersonalizedAdsAllowed(),
        keywords: ['running', 'clothing', 'sports', 'fitness', 'run', 'health', 'wellness'],
      }
    );
  };

  const createInterstitialAd = () => {
    if (isPremium) return null;
    return InterstitialAd.createForAdRequest(
      // Platform.select({ ios: INTERSTITIAL_APPLE_AD_ID!, android: INTERSTITIAL_ANDROID_AD_ID! }) ??
      // '',
      TestIds.INTERSTITIAL,
      {
        requestNonPersonalizedAdsOnly: !isPersonalizedAdsAllowed(),
        keywords: ['running', 'clothing', 'sports', 'fitness', 'run', 'health', 'wellness'],
      }
    );
  };

  const createRewardedAd = () => {
    if (isPremium) return null;
    return RewardedInterstitialAd.createForAdRequest(TestIds.REWARDED_INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: !isPersonalizedAdsAllowed(),
      keywords: ['running', 'clothing', 'sports', 'fitness', 'run', 'health', 'wellness'],
    });
  };

  const isPersonalizedAdsAllowed = () => {
    return storage.getString(TRACKING_PERMISSION_KEY) === 'granted';
  };

  // Track app open ad views and check if paywall should be shown
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
  };

  return {
    isInitialized,
    createAppOpenAd,
    createInterstitialAd,
    createRewardedAd,
    isPersonalizedAdsAllowed,
    showAds: !isPremium,
    trackAppOpenAdView,
    markPaywallAsShown,
  };
};
