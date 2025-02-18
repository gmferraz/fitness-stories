import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  getIconColor,
  DEFAULT_LAYOUT_STYLES,
} from '../utils/use-layout-edition-store';
import { formatDistance, formatDuration } from '~/utils/formatters';

interface PeriodMinimalLayoutProps {
  weekRange: string;
  totalActivities: number;
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  showBackground?: boolean;
}

export const PeriodMinimalLayout: React.FC<PeriodMinimalLayoutProps> = ({
  weekRange,
  totalActivities,
  totalDistance,
  totalDuration,
  totalCalories,
  showBackground = true,
}) => {
  const { styles } = useLayoutEditionStore();
  const style = styles['period-minimal'].isEdited
    ? styles['period-minimal']
    : DEFAULT_LAYOUT_STYLES['period-minimal'];
  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);
  const icon = getIconColor(style.iconColor);

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
          Week summary
        </Text>

        <View className="flex-1 justify-center">
          {stats.map((stat, index) => (
            <View key={stat.label} className="mb-6 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Ionicons name={stat.icon as any} size={20} color={icon} />
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
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
