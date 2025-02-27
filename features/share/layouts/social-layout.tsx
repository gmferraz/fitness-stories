import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '~/components/nativewindui/Text';
import { formatDistance } from '~/utils/formatters';
import { Activity } from '~/features/home/types/activity';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  DEFAULT_LAYOUT_STYLES,
} from '../utils/use-layout-edition-store';

interface SocialLayoutProps {
  pace: string;
  distance: number;
  unit: string;
  activity: Activity;
  showBackground?: boolean;
}

export function SocialLayout({
  pace,
  distance,
  unit,
  activity,
  showBackground = true,
}: SocialLayoutProps) {
  const { t } = useTranslation();
  const hasHeartRate = !!activity.average_heartrate;
  const hasElevation = !!activity.total_elevation_gain;
  const { styles } = useLayoutEditionStore();
  const style = styles.social.isEdited ? styles.social : DEFAULT_LAYOUT_STYLES.social;

  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor, style.opacity);

  const commonTextStyles = {
    fontFamily: style.fontFamily,
    color: textColor,
  };

  const labelStyles = {
    ...commonTextStyles,
    fontSize: style.labelSize,
    lineHeight: style.labelSize * 1.2,
  };

  const bodyStyles = {
    ...commonTextStyles,
    fontSize: style.bodySize,
    lineHeight: style.bodySize * 1.2,
  };

  return (
    <View
      className="self-center overflow-hidden rounded-2xl"
      style={{
        width: 300,
        backgroundColor: showBackground ? bgColor : 'transparent',
        padding: style.padding ?? 12,
      }}>
      {hasHeartRate ? (
        // Layout with heart rate: 2x2 grid
        <View>
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text style={labelStyles} className="mb-1">
                {t('share.layouts.common.distance')}
              </Text>
              <Text style={bodyStyles} className="font-bold">
                {formatDistance(distance)}
              </Text>
            </View>

            <View className="flex-1">
              <Text style={labelStyles} className="mb-1">
                {t('share.layouts.common.avgPace')}
              </Text>
              <Text style={bodyStyles} className="font-bold">
                {pace}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between">
            <View className="flex-1">
              <Text style={labelStyles} className="mb-1">
                {t('share.layouts.common.avgHeartRate')}
              </Text>
              <Text style={bodyStyles} className="font-bold">
                {Math.round(activity.average_heartrate!)} bpm
              </Text>
            </View>

            {hasElevation && (
              <View className="flex-1">
                <Text style={labelStyles} className="mb-1">
                  {t('share.layouts.common.elevation')}
                </Text>
                <Text style={bodyStyles} className="font-bold">
                  {Math.round(activity.total_elevation_gain!)} m
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        // Layout without heart rate: single row with consistent gaps
        <View className="flex-row justify-between">
          <View className="w-1/3">
            <Text style={labelStyles} className="mb-1">
              {t('share.layouts.common.distance')}
            </Text>
            <Text style={bodyStyles} className="font-bold">
              {formatDistance(distance)}
            </Text>
          </View>

          <View className="w-1/3">
            <Text style={labelStyles} className="mb-1 self-center">
              {t('share.layouts.common.avgPace')}
            </Text>
            <Text style={bodyStyles} className="self-center font-bold">
              {pace}
            </Text>
          </View>

          {hasElevation && (
            <View className="w-1/3">
              <Text style={labelStyles} className="mb-1 self-end">
                {t('share.layouts.common.elevation')}
              </Text>
              <Text style={bodyStyles} className="self-end font-bold">
                {Math.round(activity.total_elevation_gain!)} m
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
