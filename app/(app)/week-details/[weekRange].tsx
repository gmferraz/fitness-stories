import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { WeekDetails } from '~/features/home/week-details';
import { useTranslation } from 'react-i18next';

export default function Screen() {
  const { weekRange } = useLocalSearchParams<{ weekRange: string }>();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('weekDetails.title'),
          headerLargeTitle: false,
          headerTitleAlign: 'center',
        }}
      />
      <WeekDetails weekRange={weekRange} />
    </>
  );
}
