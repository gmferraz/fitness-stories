import '../global.css';
import 'expo-dev-client';
import React from 'react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import i18n from '~/translation';
import { PostHogProvider } from 'posthog-react-native';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { useAppSetup } from '~/features/app-setup/use-app-setup';
import { isRunningInExpoGo } from 'expo';
import * as Sentry from '@sentry/react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false, // Reanimated runs in strict mode by default
});

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: 'https://1229d9988993e486029dd9a05d289177@o4508842715381760.ingest.us.sentry.io/4508842717544448',
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
  tracesSampleRate: 1.0,
});

function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { state: setupState } = useAppSetup();

  console.log('setupState', setupState);

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PostHogProvider
          apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
          options={{
            host: 'https://us.i.posthog.com',
          }}>
          <I18nextProvider i18n={i18n}>
            <BottomSheetModalProvider>
              <ActionSheetProvider>
                <NavThemeProvider value={NAV_THEME[colorScheme]}>
                  <Slot />
                </NavThemeProvider>
              </ActionSheetProvider>
            </BottomSheetModalProvider>
          </I18nextProvider>
        </PostHogProvider>
      </GestureHandlerRootView>
    </>
  );
}

export default Sentry.wrap(RootLayout);
