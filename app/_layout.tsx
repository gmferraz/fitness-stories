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

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { useAppSetup } from '~/features/app-setup/use-app-setup';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false, // Reanimated runs in strict mode by default
});

export default function RootLayout() {
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
        <I18nextProvider i18n={i18n}>
          <BottomSheetModalProvider>
            <ActionSheetProvider>
              <NavThemeProvider value={NAV_THEME[colorScheme]}>
                <Slot />
              </NavThemeProvider>
            </ActionSheetProvider>
          </BottomSheetModalProvider>
        </I18nextProvider>
      </GestureHandlerRootView>
    </>
  );
}
