import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import {
  DEFAULT_LAYOUT_STYLES,
  getBackgroundColor,
  getFontColor,
  useLayoutEditionStore,
} from '../utils/use-layout-edition-store';
import { formatDistance, formatDuration } from '~/utils/formatters';

interface PeriodStatsLayoutProps {
  weekRange: string;
  totalActivities: number;
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  totalElevation: number;
  showBackground?: boolean;
}

export const PeriodStatsLayout: React.FC<PeriodStatsLayoutProps> = ({
  weekRange,
  totalActivities,
  totalDistance,
  totalDuration,
  totalCalories,
  totalElevation,
  showBackground = true,
}) => {
  const { styles } = useLayoutEditionStore();
  const style = styles['period-stats'].isEdited
    ? styles['period-stats']
    : DEFAULT_LAYOUT_STYLES['period-stats'];
  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);

  const stats = [
    {
      icon: 'barbell-outline',
      value: totalActivities.toString(),
      label: 'Activities',
    },
    {
      icon: 'stopwatch-outline',
      value: formatDuration(totalDuration),
      label: 'Duration',
    },
    {
      icon: 'map-outline',
      value: formatDistance(totalDistance),
      label: 'Distance',
    },
    {
      icon: 'flame-outline',
      value: `${totalCalories}`,
      label: 'Calories',
    },
  ];

  return (
    <View
      className="aspect-square w-full overflow-hidden rounded-3xl p-6"
      style={{
        backgroundColor: showBackground ? bgColor : 'transparent',
      }}>
      <View className="flex-1">
        <Text
          className="mb-6 text-center"
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.titleSize,
            color: textColor,
            lineHeight: style.titleSize * 1.2,
            fontWeight: 'bold',
          }}>
          My week
        </Text>

        <View className="flex-1 justify-center">
          <View className="flex-row flex-wrap justify-between">
            {stats.map((stat) => (
              <View key={stat.label} className="mb-8 w-[45%]">
                <View className="mb-2 items-center">
                  <Text
                    className="font-medium"
                    style={{
                      fontFamily: style.fontFamily,
                      fontSize: style.bodySize,
                      color: textColor,
                      lineHeight: style.bodySize * 1.2,
                    }}>
                    {stat.value}
                  </Text>
                  <View className="mt-2 flex-row items-center gap-2">
                    <Text
                      style={{
                        fontFamily: style.fontFamily,
                        fontSize: style.labelSize,
                        color: textColor,
                        lineHeight: style.labelSize * 1.2,
                      }}>
                      {stat.label}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
