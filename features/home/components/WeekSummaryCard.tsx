import React from 'react';
import { View } from 'react-native';
import { Text } from '../../../components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { formatDistance, formatPace, formatDuration } from '~/utils/formatters';

interface WeekSummaryCardProps {
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  avgPace: number;
}

export const WeekSummaryCard: React.FC<WeekSummaryCardProps> = ({
  totalDistance,
  totalDuration,
  totalCalories,
  avgPace,
}) => {
  const stats = [
    {
      icon: 'stopwatch-outline',
      value: formatDuration(totalDuration),
      label: 'Active Time',
      color: '#FF2D55',
    },
    {
      icon: 'map-outline',
      value: formatDistance(totalDistance),
      label: 'km Total',
      color: '#5856D6',
    },
    {
      icon: 'speedometer-outline',
      value: formatPace(totalDistance, totalDuration),
      label: 'Avg Pace',
      color: '#FF9500',
    },
    {
      icon: 'flame-outline',
      value: totalCalories.toString(),
      label: 'Calories',
      color: '#34C759',
    },
  ];

  return (
    <View className="rounded-3xl bg-card p-4">
      <View className="flex-row flex-wrap">
        {stats.map((stat, index) => (
          <View key={stat.label} className="w-1/2 p-2">
            <View className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800/50">
              <View
                className="mb-2 h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: `${stat.color}20` }}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text variant="title2" className="font-semibold">
                {stat.value}
              </Text>
              <Text variant="footnote" className="text-gray-500 dark:text-gray-400">
                {stat.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
