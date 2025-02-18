import React from 'react';
import { Icon } from '@roninoss/icons';
import { Link, Redirect, Stack } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ThemeToggle } from '~/components/ThemeToggle';
import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { useOnboardingStore } from '~/features/onboarding/store/use-onboarding-store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function AppLayout() {
  const { isCompleted: isOnboardingCompleted } = useOnboardingStore();

  if (!isOnboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="index" options={INDEX_OPTIONS} />
      <Stack.Screen name="modal" options={MODAL_OPTIONS} />
    </Stack>
  );
}

const SCREEN_OPTIONS = {
  animation: 'ios_from_right', // for android
} as const;

const INDEX_OPTIONS = {
  headerLargeTitle: true,
  title: 'My Activities',
  headerRight: () => <SettingsIcon />,
} as const;

function SettingsIcon() {
  const { colors } = useColorScheme();
  return (
    <Link href="/modal" asChild>
      <Pressable>
        {({ pressed }) => (
          <View className={cn(pressed ? 'opacity-50' : 'opacity-100')}>
            <Icon name="cog-outline" size={28} color={colors.foreground} />
          </View>
        )}
      </Pressable>
    </Link>
  );
}

const MODAL_OPTIONS = {
  presentation: 'modal',
  animation: 'fade_from_bottom', // for android
  title: 'Settings',
  headerRight: () => <ThemeToggle />,
} as const;
