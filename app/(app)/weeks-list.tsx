import React from 'react';
import { Stack } from 'expo-router';
import { WeeksList } from '~/features/home/weeks-list';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/nativewindui/Text';

export default function Screen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('weeksList.title'),
          headerLargeTitle: true,
          headerRight: () => (
            <Text variant="caption1" color="primary">
              {t('weeksList.last12Weeks')}
            </Text>
          ),
        }}
      />
      <WeeksList />
    </>
  );
}
