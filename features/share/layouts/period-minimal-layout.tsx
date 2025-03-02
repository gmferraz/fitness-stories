import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
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
import { formatWeekDateRange } from '../utils/format-week-date-range';

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
  const { t, i18n } = useTranslation();
  const { styles: layoutStyles } = useLayoutEditionStore();
  const style = layoutStyles['period-minimal'].isEdited
    ? layoutStyles['period-minimal']
    : DEFAULT_LAYOUT_STYLES['period-minimal'];
  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor, style.opacity);
  const iconColor = getIconColor(style.iconColor);

  // Divider color based on text color
  const dividerColor = `${textColor}20`; // 20 is hex for 12% opacity

  const formattedDateRange = formatWeekDateRange(weekRange, i18n);

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
      ]}>
      <View>
        <Text
          className="mb-2 text-center"
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.titleSize,
            color: textColor,
            lineHeight: style.titleSize * 1.2,
            fontWeight: 'bold',
            letterSpacing: 0.5,
          }}>
          {t('share.layouts.periodMinimal.title')}
        </Text>

        {/* Subtitle with formatted date range */}
        <Text
          className="mb-6 text-center"
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.bodySize,
            color: textColor,
            lineHeight: style.bodySize * 1.2,
            opacity: 0.8,
          }}>
          {formattedDateRange}
        </Text>

        <View>
          {stats.map((stat, index) => (
            <React.Fragment key={stat.label}>
              <View className="mb-4 flex-row items-center justify-between py-2">
                <View className="flex-row items-center gap-3">
                  <View
                    className="items-center justify-center rounded-full p-2"
                    style={{
                      backgroundColor: showBackground
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.03)',
                    }}>
                    <Ionicons name={stat.icon as any} size={18} color={iconColor} />
                  </View>
                  <Text
                    style={{
                      fontFamily: style.fontFamily,
                      fontSize: style.labelSize,
                      color: textColor,
                      opacity: 0.9,
                      lineHeight: style.labelSize * 1.2,
                    }}>
                    {stat.label}
                  </Text>
                </View>
                <Text
                  className="ios:font-bold"
                  style={{
                    fontFamily: style.fontFamily,
                    fontSize: style.bodySize,
                    color: textColor,
                    lineHeight: style.bodySize * 1.2,
                  }}>
                  {stat.value}
                </Text>
              </View>
              {index < stats.length - 1 && (
                <View className="mb-4 h-[1px] w-full" style={{ backgroundColor: dividerColor }} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
};
