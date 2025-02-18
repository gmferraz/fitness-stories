import React from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ActivityDetails } from '~/features/home/activity-details';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { getAvailableLayouts } from '~/features/share/utils/get-available-layouts';
import { getStoredActivityDetails } from '~/features/home/utils/get-stored-activity-details';

export default function ActivityDetailsScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const { colors } = useColorScheme();

  const activity = getStoredActivityDetails(id);

  const availableLayouts = getAvailableLayouts('activity', activity);

  return (
    <>
      <Stack.Screen
        options={{
          title: type,
          headerLargeTitle: true,
          headerRight: availableLayouts.length
            ? () => (
                <MaterialCommunityIcons
                  onPress={() => router.push(`/share/${id}?type=activity`)}
                  name="instagram"
                  size={28}
                  color={colors.foreground}
                />
              )
            : undefined,
        }}
      />
      <ActivityDetails id={id} />
    </>
  );
}
