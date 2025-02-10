import React from 'react';
import { Stack } from 'expo-router';
import { ActivitiesList } from '~/features/home/activities-list';
import { Text } from '~/components/nativewindui/Text';

export default function ActivitiesListScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'All Activities',
          headerLargeTitle: true,
          headerRight: () => (
            <Text variant="caption1" color="primary">
              Last 90 days
            </Text>
          ),
        }}
      />
      <ActivitiesList />
    </>
  );
}
