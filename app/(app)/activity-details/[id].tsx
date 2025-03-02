import React from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ActivityDetails } from '~/features/home/activity-details';
import { getStoredActivityDetails } from '~/features/home/utils/get-stored-activity-details';
import { getAvailableLayouts } from '~/features/share/utils/get-available-layouts';
import { MotiPressable } from 'moti/interactions';
import { View } from 'moti';
import { Text } from '~/components/nativewindui/Text';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { useTranslation } from 'react-i18next';
import { translateSportType } from '~/features/home/utils/translate-sport-type';
import { SportType } from '~/features/home/types/activity';

export default function ActivityDetailsScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const activity = getStoredActivityDetails(id);
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  const availableLayouts = activity ? getAvailableLayouts('activity', activity) : [];

  return (
    <>
      <Stack.Screen
        options={{
          title: translateSportType(t, type as SportType),
          headerLargeTitle: true,
          headerTitleAlign: 'center',
          headerRight: () =>
            availableLayouts.length > 0 ? (
              <MotiPressable
                onPress={() => router.push(`/share/${id}?type=activity`)}
                animate={({ pressed }) => {
                  'worklet';
                  return {
                    scale: pressed ? 0.95 : 1,
                    opacity: pressed ? 0.9 : 1,
                  };
                }}>
                <View className="bg-primary/10 flex-row items-center rounded-full px-3 py-1.5">
                  <MaterialCommunityIcons name="instagram" size={16} color={colors.primary} />
                  <Text color="primary" variant="subhead" className="ml-2 font-medium">
                    {t('activityDetails.shareOnInstagram')}
                  </Text>
                </View>
              </MotiPressable>
            ) : undefined,
        }}
      />
      <ActivityDetails id={id} />
    </>
  );
}
