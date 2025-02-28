import React, { useEffect } from 'react';
import { Link, Redirect, Stack, router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { ThemeToggle } from '~/components/ThemeToggle';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { useOnboardingStore } from '~/features/onboarding/store/use-onboarding-store';
import { useAds } from '~/features/ads/use-ads';
import { useEnvironmentStore } from '~/features/app-setup/use-environment';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function AppLayout() {
  const { isCompleted: isOnboardingCompleted } = useOnboardingStore();
  const { t } = useTranslation();
  const { trackAppOpenAdView, markPaywallAsShown } = useAds();
  const isPremium = useEnvironmentStore((state) => state.isPremium);

  useEffect(() => {
    // Check if we should show the paywall after the third app open ad
    if (!isPremium && trackAppOpenAdView()) {
      // Mark paywall as shown to prevent showing it again
      markPaywallAsShown();

      // Navigate to paywall with removeAds preset
      router.push({
        pathname: '/paywall',
        params: { preset: 'removeAds' },
      });
    }
  }, [isPremium, trackAppOpenAdView, markPaywallAsShown]);

  if (!isOnboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen
        name="index"
        options={{
          ...INDEX_OPTIONS,
          title: t('layout.title'),
          headerTitleStyle: { fontSize: 22, fontWeight: '900' },
        }}
      />
      <Stack.Screen name="modal" options={{ ...MODAL_OPTIONS, title: t('layout.settings') }} />
      <Stack.Screen name="paywall" options={{ ...PAYWALL_OPTIONS }} />
    </Stack>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right', // for android
} as const;

const INDEX_OPTIONS = {
  headerLargeTitle: false,
  headerRight: () => <SettingsIcon />,
} as const;

function SettingsIcon() {
  const { colors } = useColorScheme();
  return (
    <Link href="/modal" asChild>
      <Pressable>
        {({ pressed }) => (
          <View className={cn(pressed ? 'opacity-50' : 'opacity-100')}>
            <Ionicons name="cog-outline" size={26} color={colors.foreground} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
  headerRight: () => <ThemeToggle />,
} as const;

const PAYWALL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom',
  headerShown: false,
} as const;
