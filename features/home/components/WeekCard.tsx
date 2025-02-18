import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';
import { WeekSummary } from '../types/week-summary';
import { useTranslation } from 'react-i18next';

interface WeekCardProps {
  week: WeekSummary;
}

export const WeekCard: React.FC<WeekCardProps> = ({ week }) => {
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  const formatWeekRange = (weekRange: string) => {
    const [start, end] = weekRange.split(' - ');
    const formatDate = (dateStr: string) => {
      const [day, month] = dateStr.split('/');
      // Create a date object for the current year
      const date = new Date();
      date.setMonth(parseInt(month, 10) - 1);
      date.setDate(parseInt(day, 10));

      return new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'short',
      })
        .format(date)
        .toLowerCase()
        .replace('.', '');
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

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
              {formatWeekRange(week.weekRange)}
            </Text>
            <View className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
              <Text variant="caption2" color="primary">
                {week.totalActivities}{' '}
                {t(`weekCard.activity_${week.totalActivities === 1 ? 'one' : 'other'}`)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={14} color={colors.grey} />
              <Text variant="footnote" color="tertiary">
                {formatDuration(week.totalDuration)}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="map-outline" size={14} color={colors.grey} />
              <Text variant="footnote" color="tertiary">
                {formatDistance(week.totalDistance)}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="flame-outline" size={14} color={colors.grey} />
              <Text variant="footnote" color="tertiary">
                {week.totalCalories} cal
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
