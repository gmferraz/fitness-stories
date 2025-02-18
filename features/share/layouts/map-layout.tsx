import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '~/components/nativewindui/Text';
import { formatDistance, formatDuration, formatPace } from '~/utils/formatters';
import { SkiaMap } from '~/components/SkiaMap';
import { Activity, StravaActivity, AppleHealthActivity } from '~/features/home/types/activity';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  getIconColor,
  DEFAULT_LAYOUT_STYLES,
} from '../utils/use-layout-edition-store';

interface MapLayoutProps {
  pace: string;
  duration: number;
  unit: string;
  distance: number;
  activity: Activity;
  showBackground?: boolean;
}

export function MapLayout({
  pace,
  duration,
  unit,
  distance,
  activity,
  showBackground = true,
}: MapLayoutProps) {
  const { t } = useTranslation();
  const { styles } = useLayoutEditionStore();
  const style = styles.map.isEdited ? styles.map : DEFAULT_LAYOUT_STYLES.map;

  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);
  const icon = getIconColor(style.iconColor);

  const getCoordinates = () => {
    if (activity.root === 'strava') {
      const stravaActivity = activity as StravaActivity;
      return stravaActivity.map?.coordinates || [];
    }
    if (activity.root === 'apple-health') {
      const appleActivity = activity as AppleHealthActivity;
      return appleActivity.map?.coordinates || [];
    }
    return [];
  };

  const coordinates = getCoordinates();

  if (coordinates.length === 0) return null;

  return (
    <View className="self-center overflow-hidden rounded-3xl" style={{ width: 320 }}>
      <View style={{ backgroundColor: showBackground ? bgColor : 'transparent' }}>
        <View className="overflow-hidden">
          <SkiaMap coordinates={coordinates} color={icon} strokeWidth={4} />
        </View>

        <View className="p-4">
          <Text
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.titleSize,
              lineHeight: style.titleSize * 1.2,
            }}
            className="font-bold">
            {formatDistance(distance)}
          </Text>

          <View className="mt-4 flex-row justify-between">
            <View className="flex-1">
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="mb-1">
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
                {formatPace(distance, duration)}
              </Text>
            </View>
            <View className="ml-3 flex-1">
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="mb-1">
                {t('share.layouts.common.time')}
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
          </View>

          {activity.average_heartrate && (
            <View className="mt-4 flex-row justify-between">
              <View className="flex-1">
                <Text
                  style={{
                    fontFamily: style.fontFamily,
                    color: textColor,
                    fontSize: style.labelSize,
                    lineHeight: style.labelSize * 1.2,
                  }}
                  className="mb-1">
                  {t('share.layouts.common.avgHeartRate')}
                </Text>
                <Text
                  style={{
                    fontFamily: style.fontFamily,
                    color: textColor,
                    fontSize: style.bodySize,
                    lineHeight: style.bodySize * 1.2,
                  }}
                  className="font-bold">
                  {Math.round(activity.average_heartrate)} bpm
                </Text>
              </View>
              {activity.max_heartrate && (
                <View className="ml-3 flex-1">
                  <Text
                    style={{
                      fontFamily: style.fontFamily,
                      color: textColor,
                      fontSize: style.labelSize,
                      lineHeight: style.labelSize * 1.2,
                    }}
                    className="mb-1">
                    {t('share.layouts.common.maxHeartRate')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: style.fontFamily,
                      color: textColor,
                      fontSize: style.bodySize,
                      lineHeight: style.bodySize * 1.2,
                    }}
                    className="font-bold">
                    {Math.round(activity.max_heartrate)} bpm
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
