import React from 'react';
import { WeeksList } from '~/features/home/weeks-list';
import { Stack } from 'expo-router';
import { Text } from '~/components/nativewindui/Text';

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Weeks',
          headerLargeTitle: true,
          headerRight: () => (
            <Text variant="caption1" color="primary">
              Last 12 Weeks
            </Text>
          ),
        }}
      />
      <WeeksList />
    </>
  );
}
