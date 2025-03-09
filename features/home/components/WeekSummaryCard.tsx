import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { formatDistance, formatPace, formatDuration } from '~/utils/formatters';
import { useColorScheme } from '~/lib/useColorScheme';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

interface WeekSummaryCardProps {
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  avgPace: number;
  weekRange: string;
  totalActivities: number;
}

export const WeekSummaryCard: React.FC<WeekSummaryCardProps> = ({
  totalDistance,
  totalDuration,
  totalCalories,
  avgPace,
  weekRange,
  totalActivities,
}) => {
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  const stats = [
    {
      icon: 'stats-chart-outline',
      value: totalActivities.toString(),
      label: t('weekDetails.stats.totalActivities'),
      color: '#34C759',
    },
    {
      icon: 'stopwatch-outline',
      value: formatDuration(totalDuration),
      label: t('weekSummaryCard.stats.activeTime'),
      color: '#FF2D55',
    },
    {
      icon: 'map-outline',
      value: formatDistance(totalDistance),
      label: t('weekSummaryCard.stats.distance'),
      color: '#5856D6',
    },
    {
      icon: 'speedometer-outline',
      value: formatPace(totalDistance, totalDuration),
      label: t('weekSummaryCard.stats.avgPace'),
      color: '#FF9500',
    },
  ];

  return (
    <TouchableOpacity
      onPress={() => router.push(`/week-details/${encodeURIComponent(weekRange)}`)}
      className="overflow-hidden rounded-3xl bg-card p-4"
      style={{
        shadowColor: colors.primary,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
      }}>
      <View className="flex-row flex-wrap">
        {stats.map((stat, index) => (
          <View key={stat.label} className="w-1/2 p-2">
            <View className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800/50">
              <View
                className="mb-3 h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${stat.color}20` }}>
                <Ionicons name={stat.icon as any} size={22} color={stat.color} />
              </View>
              <Text variant="title2" className="font-bold">
                {stat.value}
              </Text>
              <Text variant="footnote" className="text-gray-500 dark:text-gray-400">
                {stat.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};
