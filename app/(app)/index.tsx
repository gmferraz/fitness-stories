import { Stack } from 'expo-router';
import * as React from 'react';

import { HomeScreen } from '~/features/home';

export default function Screen() {
  return (
    <>
      <Stack.Screen name="index" options={{ headerLargeTitle: true, title: 'My Activities' }} />
      <HomeScreen />
    </>
  );
}
