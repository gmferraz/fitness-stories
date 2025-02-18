import React from 'react';
import { Stack } from 'expo-router';
import { OnboardingScreen } from '~/features/onboarding';

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <OnboardingScreen />
    </>
  );
}
