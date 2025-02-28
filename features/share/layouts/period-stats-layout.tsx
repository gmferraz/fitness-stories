import React from 'react';
import { View, StyleSheet } from 'react-native';
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
  const { t } = useTranslation();
  const { styles: layoutStyles } = useLayoutEditionStore();
  const style = layoutStyles['period-stats'].isEdited
    ? layoutStyles['period-stats']
    : DEFAULT_LAYOUT_STYLES['period-stats'];
  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor, style.opacity);
  const iconColor = getIconColor(style.iconColor || style.fontColor);

  // Slightly lighter/darker version of the background for card backgrounds
  const cardBgColor = showBackground
    ? typeof style.backgroundColor === 'string' &&
      (style.backgroundColor === 'white' || style.backgroundColor.toUpperCase() === '#FFFFFF')
      ? 'rgba(0,0,0,0.03)'
      : 'rgba(255,255,255,0.08)'
    : 'transparent';

  const stats = [
    {
      icon: 'barbell-outline',
      value: totalActivities.toString(),
      label: t('share.layouts.common.workouts'),
    },
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
      className="w-full overflow-hidden rounded-2xl"
      style={[
        {
          backgroundColor: showBackground ? bgColor : 'transparent',
          padding: style.padding ?? 20,
        },
        showBackground && localStyles.cardShadow,
      ]}>
      <View>
        <Text
          className="mb-8 text-center"
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.titleSize,
            color: textColor,
            lineHeight: style.titleSize * 1.2,
            fontWeight: 'bold',
            letterSpacing: 0.5,
          }}>
          {t('share.layouts.periodStats.title')}
        </Text>

        <View>
          <View className="flex-row flex-wrap justify-between">
            {stats.map((stat) => (
              <View
                key={stat.label}
                className="mb-6 w-[48%] rounded-xl p-3"
                style={{
                  backgroundColor: cardBgColor,
                  borderWidth: showBackground ? 0 : 1,
                  borderColor: 'rgba(0,0,0,0.05)',
                }}>
                <View className="items-center">
                  <View className="mb-2 flex-row items-center">
                    <Ionicons name={stat.icon as any} size={18} color={iconColor} />
                  </View>
                  <Text
                    className="font-bold"
                    style={{
                      fontFamily: style.fontFamily,
                      fontSize: style.bodySize * 1.2,
                      color: textColor,
                      lineHeight: style.bodySize * 1.4,
                    }}>
                    {stat.value}
                  </Text>
                  <View className="mt-1">
                    <Text
                      style={{
                        fontFamily: style.fontFamily,
                        fontSize: style.labelSize,
                        color: textColor,
                        opacity: 0.8,
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

const localStyles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
