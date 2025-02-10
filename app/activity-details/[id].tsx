import React from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ActivityDetails } from '~/features/home/activity-details';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
export default function ActivityDetailsScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const { colors } = useColorScheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: type,
          headerLargeTitle: true,
          headerRight: () => (
            <MaterialCommunityIcons
              onPress={() => router.push(`/share/${id}`)}
              name="instagram"
              size={28}
              color={colors.foreground}
            />
          ),
        }}
      />
      <ActivityDetails id={id} />
    </>
  );
}
