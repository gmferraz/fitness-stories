import React from 'react';
import { Stack } from 'expo-router';
import { ActivitiesList } from '~/features/home/activities-list';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/nativewindui/Text';

export default function ActivitiesListScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('activitiesList.title'),
          headerLargeTitle: true,
          headerRight: () => (
            <Text variant="caption1" color="primary">
              {t('activitiesList.last90Days')}
            </Text>
          ),
        }}
      />
      <ActivitiesList />
    </>
  );
}
