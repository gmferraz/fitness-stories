import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/nativewindui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityCard } from '~/features/home/components/ActivityCard';
import { getWeekDetails } from '~/features/home/hooks/get-week-details';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { formatDistance, formatDuration, formatPace } from '~/utils/formatters';
import { router } from 'expo-router';
import { Button } from '~/components/nativewindui/Button';

export const WeekDetails = ({ weekRange }: { weekRange: string }) => {
  const weekDetails = getWeekDetails(weekRange);
  const { bottom } = useSafeAreaInsets();
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  const stats = [
    weekDetails.totalActivities > 0 && {
      icon: 'podium-outline',
      value: `${weekDetails.totalActivities}`,
      label: t('home.weekDetails.stats.totalActivities'),
      color: '#007AFF',
    },
    weekDetails.totalDuration > 0 && {
      icon: 'stopwatch-outline',
      value: formatDuration(weekDetails.totalDuration),
      label: t('home.weekDetails.stats.duration'),
      color: '#FF2D55',
    },
    weekDetails.totalDistance > 0 && {
      icon: 'map-outline',
      value: formatDistance(weekDetails.totalDistance),
      label: t('home.weekDetails.stats.distance'),
      color: '#5856D6',
    },
    weekDetails.totalDistance > 0 &&
      weekDetails.totalDuration > 0 && {
        icon: 'speedometer-outline',
        value: formatPace(weekDetails.totalDistance, weekDetails.totalDuration),
        label: t('home.weekDetails.stats.avgPace'),
        color: '#FF9500',
      },
    weekDetails.totalElevation > 0 && {
      icon: 'trending-up-outline',
      value: `${weekDetails.totalElevation}m`,
      label: t('home.weekDetails.stats.elevation'),
      color: '#34C759',
    },
    weekDetails.totalCalories > 0 && {
      icon: 'flame-outline',
      value: `${weekDetails.totalCalories}`,
      label: t('home.weekDetails.stats.calories'),
      color: '#FF3B30',
    },
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  const hasActivities = !!weekDetails.activities?.length;
  const formattedWeekRange = weekRange.replace(/\//g, '.');

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: bottom + 80,
        }}>
        {/* Header Section */}
        <View className="border-gray-200 bg-card px-8 pb-6 pt-4 dark:border-gray-800">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            </View>
          </View>

          <Text variant="title1" className="mb-2">
            {t('home.weekDetails.title')}
          </Text>
          <Text variant="subhead" className="text-gray-500">
            {weekDetails.weekRange}
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="p-4">
          <View className="flex-row flex-wrap">
            {stats.map((stat) => {
              if (!stat) return null;
              return (
                <View key={stat.label} className="w-1/2 p-1">
                  <View className="rounded-2xl bg-card p-4">
                    <View
                      className="mb-3 h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${stat.color}20` }}>
                      <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                    </View>
                    <Text variant="title2" className="font-semibold">
                      {stat.value}
                    </Text>
                    <Text variant="subhead" className="text-gray-500">
                      {stat.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Activities Section */}
        {!!weekDetails.activities?.length && (
          <View className="px-4">
            <Text variant="title2" className="mb-4 font-semibold">
              {t('home.weekDetails.activities')}
            </Text>
            {weekDetails.activities?.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Fixed Share Button */}
      {!!hasActivities && (
        <View className="absolute inset-x-0 bottom-0 bg-background">
          <View style={{ paddingBottom: bottom ? bottom + 8 : 16 }} className="p-4">
            <Button
              variant="primary"
              size="lg"
              onPress={() => router.push(`/share/${formattedWeekRange}?type=period`)}
              className="w-full">
              <Text className="font-medium">{t('activityDetails.shareOnInstagram')}</Text>
              <MaterialCommunityIcons name="instagram" size={20} color="white" />
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};
