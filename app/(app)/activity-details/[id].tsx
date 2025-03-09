import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityDetails } from '~/features/home/activity-details';
import { useTranslation } from 'react-i18next';
import { translateSportType } from '~/features/home/utils/translate-sport-type';
import { SportType } from '~/features/home/types/activity';

export default function ActivityDetailsScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: translateSportType(t, type as SportType),
          headerLargeTitle: false,
          headerTitleAlign: 'center',
        }}
      />
      <ActivityDetails id={id} />
    </>
  );
}
