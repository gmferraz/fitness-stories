import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';
import { WeekSummary } from '../types/week-summary';

interface WeekCardProps {
  week: WeekSummary;
}

export const WeekCard: React.FC<WeekCardProps> = ({ week }) => {
  const { colors } = useColorScheme();

  const formatDistance = (meters: number) => {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(2)} km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <TouchableOpacity
      className="mb-3 overflow-hidden rounded-2xl bg-card"
      onPress={() => router.push(`/week-details/${encodeURIComponent(week.weekRange)}`)}>
      <View className="flex-row items-center p-4">
        <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <Ionicons name="calendar-outline" size={22} color={colors.primary} />
        </View>

        <View className="flex-1">
          <View className="mb-3 flex-row items-center justify-between">
            <Text variant="callout" className="font-medium">
              {week.weekRange}
            </Text>
            <View className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
              <Text variant="caption2" color="secondary">
                {week.totalActivities} {week.totalActivities === 1 ? 'activity' : 'activities'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={14} color={colors.grey} />
              <Text variant="footnote" color="secondary">
                {formatDuration(week.totalDuration)}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="map-outline" size={14} color={colors.grey} />
              <Text variant="footnote" color="secondary">
                {formatDistance(week.totalDistance)}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="flame-outline" size={14} color={colors.grey} />
              <Text variant="footnote" color="secondary">
                {week.totalCalories} cal
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
