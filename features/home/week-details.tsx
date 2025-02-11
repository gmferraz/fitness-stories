import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityCard } from '~/features/home/components/ActivityCard';
import { getWeekDetails } from '~/features/home/hooks/get-week-details';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { formatDistance, formatDuration, formatPace } from '~/utils/formatters';

export const WeekDetails = ({ weekRange }: { weekRange: string }) => {
  const weekDetails = getWeekDetails(weekRange);
  const { bottom } = useSafeAreaInsets();
  const { colors } = useColorScheme();

  const stats = [
    weekDetails.totalActivities > 0 && {
      icon: 'podium-outline',
      value: `${weekDetails.totalActivities}`,
      label: 'Total Activities',
      color: '#007AFF',
    },
    weekDetails.totalDuration > 0 && {
      icon: 'stopwatch-outline',
      value: formatDuration(weekDetails.totalDuration),
      label: 'Duration',
      color: '#FF2D55',
    },
    weekDetails.totalDistance > 0 && {
      icon: 'map-outline',
      value: formatDistance(weekDetails.totalDistance),
      label: 'Distance',
      color: '#5856D6',
    },
    weekDetails.totalDistance > 0 &&
      weekDetails.totalDuration > 0 && {
        icon: 'speedometer-outline',
        value: formatPace(weekDetails.totalDistance, weekDetails.totalDuration),
        label: 'Avg Pace',
        color: '#FF9500',
      },
    weekDetails.totalElevation > 0 && {
      icon: 'trending-up-outline',
      value: `${weekDetails.totalElevation}m`,
      label: 'Elevation',
      color: '#34C759',
    },
    weekDetails.totalCalories > 0 && {
      icon: 'flame-outline',
      value: `${weekDetails.totalCalories}`,
      label: 'Calories',
      color: '#FF3B30',
    },
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingBottom: bottom + 16,
      }}>
      {/* Header Section */}
      <View className="border-gray-200 bg-card px-8 pb-6 pt-4 dark:border-gray-800">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          </View>
        </View>

        <Text variant="title1" className="mb-2">
          Summary
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
                  <Text variant="footnote" className="text-gray-500">
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
            Activities
          </Text>
          {weekDetails.activities?.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};
