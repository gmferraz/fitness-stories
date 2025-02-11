import React from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { WeekDetails } from '~/features/home/week-details';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

export default function Screen() {
  const { weekRange } = useLocalSearchParams<{ weekRange: string }>();
  const { colors } = useColorScheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Week Details',
          headerLargeTitle: true,
          headerRight: () => (
            <MaterialCommunityIcons
              onPress={() => router.push(`/share/week?weekRange=${weekRange}`)}
              name="instagram"
              size={28}
              color={colors.foreground}
            />
          ),
        }}
      />
      <WeekDetails weekRange={weekRange} />
    </>
  );
}
