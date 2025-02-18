import { Dimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '~/components/nativewindui/Text';
import { languageDetector } from '~/utils/i18n/languageDetector';
import { formatDistance, formatDuration } from '~/utils/formatters';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  DEFAULT_LAYOUT_STYLES,
} from '../utils/use-layout-edition-store';
import { Activity } from '~/features/home/types/activity';

interface MinimalLayoutProps {
  pace: string;
  duration: number;
  unit: string;
  distance: number;
  elevation?: number;
  showBackground?: boolean;
  activity: Activity;
}

export function MinimalLayout({
  pace,
  duration,
  unit,
  distance,
  showBackground = true,
  activity,
}: MinimalLayoutProps) {
  const language = languageDetector.detect();
  const width = Dimensions.get('window').width;
  const { t } = useTranslation();
  const { styles } = useLayoutEditionStore();
  const style = styles.minimal.isEdited ? styles.minimal : DEFAULT_LAYOUT_STYLES.minimal;

  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);
  const hasElevation = !!activity.total_elevation_gain;

  return (
    <View
      className="flex-col self-center rounded-2xl p-4"
      style={{
        width: width - 48,
        backgroundColor: showBackground ? bgColor : 'transparent',
      }}>
      <Text
        style={{
          fontFamily: style.fontFamily,
          color: textColor,
          fontSize: style.labelSize,
          lineHeight: style.labelSize * 1.2,
        }}>
        {new Date().toLocaleDateString(language, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
      <Text
        numberOfLines={2}
        className="mb-6 mt-2 font-bold"
        style={{
          fontSize: style.titleSize,
          fontFamily: style.fontFamily,
          lineHeight: style.titleSize * 1.2,
          color: textColor,
        }}>
        {formatDistance(distance)}
      </Text>

      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text
            className="mb-1"
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.labelSize,
              lineHeight: style.labelSize * 1.2,
            }}>
            Avg pace
          </Text>
          <Text
            className="font-bold"
            style={{
              fontSize: style.bodySize,
              fontFamily: style.fontFamily,
              lineHeight: style.bodySize * 1.2,
              color: textColor,
            }}>
            {pace}
          </Text>
        </View>
        <View className="ml-3 flex-1">
          <Text
            className="mb-1"
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.labelSize,
              lineHeight: style.labelSize * 1.2,
            }}>
            Time
          </Text>
          <Text
            className="font-bold"
            style={{
              fontSize: style.bodySize,
              fontFamily: style.fontFamily,
              lineHeight: style.bodySize * 1.2,
              color: textColor,
            }}>
            {formatDuration(duration)}
          </Text>
        </View>
        {!!hasElevation && (
          <View className="ml-3 flex-1">
            <Text
              className="mb-1"
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.labelSize,
                lineHeight: style.labelSize * 1.2,
              }}>
              Elevation
            </Text>
            <Text
              className="font-bold"
              style={{
                fontSize: style.bodySize,
                fontFamily: style.fontFamily,
                lineHeight: style.bodySize * 1.2,
                color: textColor,
              }}>
              {activity.total_elevation_gain}m
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
