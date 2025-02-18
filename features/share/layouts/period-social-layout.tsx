import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import {
  DEFAULT_LAYOUT_STYLES,
  getBackgroundColor,
  getFontColor,
  getIconColor,
  useLayoutEditionStore,
} from '../utils/use-layout-edition-store';
import { formatDistance, formatDuration } from '~/utils/formatters';

interface PeriodSocialLayoutProps {
  weekRange: string;
  totalActivities: number;
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  showBackground?: boolean;
}

export const PeriodSocialLayout: React.FC<PeriodSocialLayoutProps> = ({
  weekRange,
  totalActivities,
  totalDistance,
  totalDuration,
  totalCalories,
  showBackground = true,
}) => {
  const { t } = useTranslation();
  const { styles } = useLayoutEditionStore();
  const style = styles['period-social'].isEdited
    ? styles['period-social']
    : DEFAULT_LAYOUT_STYLES['period-social'];
  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);
  const icon = getIconColor(style.iconColor);

  const mainStat = {
    icon: 'trophy-outline',
    value: totalActivities.toString(),
    label: t('share.layouts.periodSocial.workoutsThisWeek', { count: totalActivities }),
  };

  const stats = [
    {
      icon: 'stopwatch-outline',
      value: formatDuration(totalDuration),
      label: t('share.layouts.common.duration'),
    },
    {
      icon: 'map-outline',
      value: formatDistance(totalDistance),
      label: t('share.layouts.common.distance'),
    },
    {
      icon: 'flame-outline',
      value: `${totalCalories}`,
      label: t('share.layouts.common.calories'),
    },
  ];

  return (
    <View
      className="aspect-square w-full overflow-hidden rounded-3xl p-6"
      style={{
        backgroundColor: showBackground ? bgColor : 'transparent',
      }}>
      <View className="flex-1">
        <View className="flex-1 justify-center">
          <View className="mb-10 items-center">
            <Text
              className="mb-2 text-center font-bold"
              style={{
                fontFamily: style.fontFamily,
                fontSize: style.titleSize,
                color: textColor,
                lineHeight: style.titleSize * 1.2,
              }}>
              {mainStat.value}
            </Text>
            <Text
              className="text-center"
              style={{
                fontFamily: style.fontFamily,
                fontSize: style.labelSize,
                color: textColor,
                lineHeight: style.labelSize * 1.2,
              }}>
              {mainStat.label}
            </Text>
          </View>

          <View className="flex-row justify-between">
            {stats.map((stat) => (
              <View key={stat.label} className="items-center">
                <Text
                  className="mb-2 text-center font-medium"
                  style={{
                    fontFamily: style.fontFamily,
                    fontSize: style.bodySize,
                    color: textColor,
                    lineHeight: style.bodySize * 1.2,
                  }}>
                  {stat.value}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name={stat.icon as any} size={14} color={icon} />
                  <Text
                    className="text-center"
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
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
