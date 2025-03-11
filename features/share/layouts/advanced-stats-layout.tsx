import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '~/components/nativewindui/Text';
import { formatCalories, formatDistance, formatDuration, formatWatts } from '~/utils/formatters';
import { Activity } from '~/features/home/types/activity';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  DEFAULT_LAYOUT_STYLES,
} from '../utils/use-layout-edition-store';

interface AdvancedStatsLayoutProps {
  pace: string;
  duration: number;
  unit: string;
  distance: number;
  activity: Activity;
  showBackground?: boolean;
}

export function AdvancedStatsLayout({
  pace,
  duration,
  unit,
  distance,
  activity,
  showBackground = true,
}: AdvancedStatsLayoutProps) {
  const { t } = useTranslation();
  const { styles } = useLayoutEditionStore();
  const style = styles['advanced-stats']?.isEdited
    ? styles['advanced-stats']
    : DEFAULT_LAYOUT_STYLES['advanced-stats'];

  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor, style.opacity);

  const hasElevation = !!activity.total_elevation_gain;
  const hasCalories = !!activity.calories;
  // Check if activity has power data (only available for Strava activities)
  const hasPower = activity.root === 'strava' && activity.average_watts;

  return (
    <View
      className="self-center overflow-hidden rounded-2xl"
      style={{
        width: 320,
        backgroundColor: showBackground ? bgColor : 'transparent',
        padding: style.padding ?? 16,
      }}>
      {/* First Row: Distance and Elevation Gain */}
      <View className="flex-row justify-between">
        <View className="flex-1 items-center">
          <Text
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.labelSize,
              lineHeight: style.labelSize * 1.2,
            }}
            className="mb-2">
            {t('share.layouts.common.distance')}
          </Text>
          <Text
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.bodySize,
              lineHeight: style.bodySize * 1.2,
            }}
            className="font-bold">
            {formatDistance(distance)}
          </Text>
        </View>

        {hasElevation && (
          <View className="flex-1 items-center">
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.labelSize,
                lineHeight: style.labelSize * 1.2,
              }}
              className="mb-2">
              {t('share.layouts.common.elevation')}
            </Text>
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.bodySize,
                lineHeight: style.bodySize * 1.2,
              }}
              className="font-bold">
              {activity.total_elevation_gain}m
            </Text>
          </View>
        )}
      </View>

      <View className="mt-3">
        <View className="mt-4 flex-row justify-between">
          <View className="flex-1 items-center">
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.labelSize,
                lineHeight: style.labelSize * 1.2,
              }}
              className="mb-2">
              {t('share.layouts.common.duration')}
            </Text>
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.bodySize,
                lineHeight: style.bodySize * 1.2,
              }}
              className="font-bold">
              {formatDuration(duration)}
            </Text>
          </View>

          {hasPower ? (
            <View className="flex-1 items-center">
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="mb-2">
                {t('share.layouts.common.avgPower')}
              </Text>
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.bodySize,
                  lineHeight: style.bodySize * 1.2,
                }}
                className="font-bold">
                {formatWatts((activity as any).average_watts)}
              </Text>
            </View>
          ) : (
            <View className="flex-1" />
          )}
        </View>
      </View>

      {/* Third Row: Avg Pace and Calories */}
      <View className="mt-3">
        <View className="mt-4 flex-row justify-between">
          <View className="flex-1 items-center">
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.labelSize,
                lineHeight: style.labelSize * 1.2,
              }}
              className="mb-2">
              {t('share.layouts.common.avgPace')}
            </Text>
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.bodySize,
                lineHeight: style.bodySize * 1.2,
              }}
              className="font-bold">
              {pace}
            </Text>
          </View>

          {hasCalories && (
            <View className="flex-1 items-center">
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="mb-2">
                {t('share.layouts.common.calories')}
              </Text>
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.bodySize,
                  lineHeight: style.bodySize * 1.2,
                }}
                className="font-bold">
                {formatCalories(activity.calories)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
