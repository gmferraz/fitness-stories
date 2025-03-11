import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import Share from '~/features/share/Share';
import { useTranslation } from 'react-i18next';

export default function ShareScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: 'activity' | 'period' }>();
  const { t } = useTranslation();

  const reformattedId = type === 'activity' ? id : id.replace(/\./g, '/');

  return (
    <>
      <Stack.Screen
        options={{
          title: t('share.layouts.common.share'),
          headerLargeTitle: false,
          headerTitleAlign: 'center',
        }}
      />
      <Share type={type} id={reformattedId} />
    </>
  );
}
