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
  const { styles: layoutStyles } = useLayoutEditionStore();
  const style = layoutStyles['period-social'].isEdited
    ? layoutStyles['period-social']
    : DEFAULT_LAYOUT_STYLES['period-social'];
  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor, style.opacity);
  const iconColor = getIconColor(style.iconColor);

  // Accent color for the trophy icon
  const accentColor = iconColor === '#000000' ? '#FFD700' : iconColor;

  const mainStat = {
    icon: 'trophy-outline',
    value: totalActivities.toString(),
    label: t(
      `share.layouts.periodSocial.workoutsThisWeek_${totalActivities === 1 ? 'one' : 'other'}`
    ),
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
      className="w-full overflow-hidden rounded-3xl"
      style={[
        {
          backgroundColor: showBackground ? bgColor : 'transparent',
          padding: style.padding ?? 20,
        },
        showBackground && localStyles.cardShadow,
      ]}>
      <View>
        <View className="py-4">
          <View className="mb-12 items-center">
            <View
              className="mb-4 rounded-full p-3"
              style={{
                backgroundColor: showBackground ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)',
              }}>
              <Ionicons name={mainStat.icon as any} size={32} color={accentColor} />
            </View>
            <Text
              className="mb-2 text-center font-bold"
              style={{
                fontFamily: style.fontFamily,
                fontSize: style.titleSize * 1.2,
                color: textColor,
                lineHeight: style.titleSize * 1.4,
                letterSpacing: 0.5,
              }}>
              {mainStat.value}
            </Text>
            <Text
              className="text-center"
              style={{
                fontFamily: style.fontFamily,
                fontSize: style.labelSize * 1.1,
                color: textColor,
                opacity: 0.9,
                lineHeight: style.labelSize * 1.3,
              }}>
              {mainStat.label}
            </Text>
          </View>

          <View
            className="rounded-xl py-4"
            style={{
              backgroundColor: showBackground ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderWidth: showBackground ? 0 : 1,
              borderColor: 'rgba(0,0,0,0.05)',
            }}>
            <View className="flex-row justify-evenly">
              {stats.map((stat) => (
                <View key={stat.label} className="items-center px-2">
                  <Text
                    className="mb-2 text-center font-bold"
                    style={{
                      fontFamily: style.fontFamily,
                      fontSize: style.bodySize,
                      color: textColor,
                      lineHeight: style.bodySize * 1.2,
                    }}>
                    {stat.value}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name={stat.icon as any} size={14} color={iconColor} />
                    <Text
                      className="text-center"
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
              ))}
            </View>
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
