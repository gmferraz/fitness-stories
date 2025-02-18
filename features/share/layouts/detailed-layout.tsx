import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';

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

interface WorkoutLayoutProps {
  distance: number;
  duration: number;
  pace: string;
  unit: string;
  showBackground?: boolean;
  activity: Activity;
}

export function DetailedLayout({
  distance,
  duration,
  pace,
  showBackground = true,
  activity,
}: WorkoutLayoutProps) {
  const width = Dimensions.get('window').width;
  const { t } = useTranslation();
  const { styles } = useLayoutEditionStore();
  const style = styles.detailed.isEdited ? styles.detailed : DEFAULT_LAYOUT_STYLES.detailed;

  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);
  const icon = getIconColor(style.iconColor);

  const totalElevation = activity.total_elevation_gain ?? 0;

  return (
    <View
      className="self-center rounded-2xl p-4"
      style={{
        width: width - 48,
        backgroundColor: showBackground ? bgColor : 'transparent',
      }}>
      <View className="flex-col">
        <View className="mb-3 flex-row justify-between">
          <View className={`w-[48%] rounded-xl p-3 ${showBackground ? 'bg-white/10' : ''}`}>
            <View className="mb-1 flex-row items-center">
              <Ionicons name="map-outline" size={16} color={icon} />
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="ml-1">
                Distance
              </Text>
            </View>
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

          <View className={`w-[48%] rounded-xl p-3 ${showBackground ? 'bg-white/10' : ''}`}>
            <View className="mb-1 flex-row items-center">
              <Ionicons name="time-outline" size={16} color={icon} />
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="ml-1">
                Time
              </Text>
            </View>
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

        <View className="flex-row justify-between">
          <View className={`w-[48%] rounded-xl p-3 ${showBackground ? 'bg-white/10' : ''}`}>
            <View className="mb-1 flex-row items-center">
              <Ionicons name="speedometer-outline" size={16} color={icon} />
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="ml-1">
                Pace
              </Text>
            </View>
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
          <View className={`w-[48%] rounded-xl p-3 ${showBackground ? 'bg-white/10' : ''}`}>
            <View className="mb-1 flex-row items-center">
              <Ionicons name="arrow-up-circle-outline" size={16} color={icon} />
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="ml-1">
                Elevation
              </Text>
            </View>
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.bodySize,
                lineHeight: style.bodySize * 1.2,
              }}
              className="font-bold">
              {totalElevation}m
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
