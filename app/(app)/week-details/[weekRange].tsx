import React from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { WeekDetails } from '~/features/home/week-details';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { useTranslation } from 'react-i18next';
import { View } from 'moti';
import { Text } from '~/components/nativewindui/Text';
import { MotiPressable } from 'moti/interactions';

export default function Screen() {
  const { weekRange } = useLocalSearchParams<{ weekRange: string }>();
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  const formattedWeekRange = weekRange.replace(/\//g, '.');

  return (
    <>
      <Stack.Screen
        options={{
          title: t('weekDetails.title'),
          headerLargeTitle: true,
          headerTitleAlign: 'center',
          headerRight: () => (
            <MotiPressable
              onPress={() => router.push(`/share/${formattedWeekRange}?type=period`)}
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
          ),
        }}
      />
      <WeekDetails weekRange={weekRange} />
    </>
  );
}
