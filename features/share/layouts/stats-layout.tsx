import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from '~/components/nativewindui/Text';
import { formatDistance, formatDuration } from '~/utils/formatters';
import { Activity } from '~/features/home/types/activity';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  getIconColor,
  DEFAULT_LAYOUT_STYLES,
} from '../utils/use-layout-edition-store';

interface StatsLayoutProps {
  pace: string;
  duration: number;
  unit: string;
  distance: number;
  activity: Activity;
  showBackground?: boolean;
}

export function StatsLayout({
  pace,
  duration,
  unit,
  distance,
  activity,
  showBackground = true,
}: StatsLayoutProps) {
  const { t } = useTranslation();
  const { styles } = useLayoutEditionStore();
  const style = styles.stats.isEdited ? styles.stats : DEFAULT_LAYOUT_STYLES.stats;

  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor, style.opacity);
  const icon = getIconColor(style.iconColor);

  const hasHeartRate = !!activity.average_heartrate && !!activity.max_heartrate;

  return (
    <View
      className="self-center overflow-hidden rounded-2xl"
      style={{
        width: 320,
        backgroundColor: showBackground ? bgColor : 'transparent',
        padding: style.padding ?? 16,
      }}>
      <View>
        <Text
          style={{
            fontFamily: style.fontFamily,
            color: textColor,
            fontSize: style.labelSize,
            lineHeight: style.labelSize * 1.2,
          }}
          className="mb-1">
          {t('share.layouts.common.totalDistance')}
        </Text>
        <Text
          style={{
            fontFamily: style.fontFamily,
            color: textColor,
            fontSize: style.titleSize,
            lineHeight: style.titleSize * 1.2,
          }}
          className="font-black">
          {formatDistance(distance)}
        </Text>
      </View>

      <View className="mt-6 flex-row justify-between">
        <View className="flex-1">
          <View className="mb-4 flex-row items-center">
            <MaterialCommunityIcons name="clock-outline" size={20} color={icon} />
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.labelSize,
                lineHeight: style.labelSize * 1.2,
              }}
              className="ml-2">
              {t('share.layouts.common.duration')}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.bodySize,
              lineHeight: style.bodySize * 1.2,
            }}
            className="ios:font-bold">
            {formatDuration(duration)}
          </Text>
        </View>

        <View className="flex-1">
          <View className="mb-4 flex-row items-center">
            <MaterialCommunityIcons name="speedometer" size={20} color={icon} />
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.labelSize,
                lineHeight: style.labelSize * 1.2,
              }}
              className="ml-2">
              {t('share.layouts.common.avgPace')}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.bodySize,
              lineHeight: style.bodySize * 1.2,
            }}
            className="ios:font-bold">
            {pace}
          </Text>
        </View>
      </View>

      {hasHeartRate && (
        <View className="mt-2">
          <View className="h-[1px] w-full" />
          <View className="mt-4 flex-row justify-between">
            <View className="flex-1">
              <View className="mb-4 flex-row items-center">
                <MaterialCommunityIcons name="heart-pulse" size={20} color={icon} />
                <Text
                  style={{
                    fontFamily: style.fontFamily,
                    color: textColor,
                    fontSize: style.labelSize,
                    lineHeight: style.labelSize * 1.2,
                  }}
                  className="ml-2">
                  {t('share.layouts.common.avgHeartRate')}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.bodySize,
                  lineHeight: style.bodySize * 1.2,
                }}
                className="ios:font-bold">
                {Math.round(activity.average_heartrate!)} bpm
              </Text>
            </View>

            <View className="flex-1">
              <View className="mb-4 flex-row items-center">
                <MaterialCommunityIcons name="heart" size={20} color={icon} />
                <Text
                  style={{
                    fontFamily: style.fontFamily,
                    color: textColor,
                    fontSize: style.labelSize,
                    lineHeight: style.labelSize * 1.2,
                  }}
                  className="ml-2">
                  {t('share.layouts.common.maxHeartRate')}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.bodySize,
                  lineHeight: style.bodySize * 1.2,
                }}
                className="ios:font-bold">
                {Math.round(activity.max_heartrate!)} bpm
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
