import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from '~/components/nativewindui/Text';
import { formatDistance } from '~/utils/formatters';
import { Activity } from '~/features/home/types/activity';
import { languageDetector } from '~/utils/i18n/languageDetector';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
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
  const hasHeartRate = !!activity.average_heartrate;
  const hasElevation = !!activity.total_elevation_gain;
  const { fontFamily, titleSize, bodySize, labelSize, fontColor, backgroundColor } =
    useLayoutEditionStore();

  const textColor = getFontColor(fontColor);
  const bgColor = getBackgroundColor(backgroundColor);

  return (
    <View
      className="self-center overflow-hidden rounded-2xl p-4"
      style={{
        width: 320,
        backgroundColor: showBackground ? bgColor : 'transparent',
      }}>
      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text
            style={{
              fontFamily,
              color: textColor,
              fontSize: labelSize,
              lineHeight: labelSize * 1.2,
            }}
            className="mb-1">
            Distance
          </Text>
          <Text
            style={{
              fontFamily,
              color: textColor,
              fontSize: bodySize,
              lineHeight: bodySize * 1.2,
            }}
            className="font-bold">
            {formatDistance(distance)}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            style={{
              fontFamily,
              color: textColor,
              fontSize: labelSize,
              lineHeight: labelSize * 1.2,
            }}
            className="mb-1">
            Avg Pace
          </Text>
          <Text
            style={{
              fontFamily,
              color: textColor,
              fontSize: bodySize,
              lineHeight: bodySize * 1.2,
            }}
            className="font-bold">
            {pace}
          </Text>
        </View>
      </View>

      {(hasHeartRate || hasElevation) && (
        <View className="mt-4 flex-row justify-between">
          {hasHeartRate && (
            <View className="flex-1">
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: labelSize,
                  lineHeight: labelSize * 1.2,
                }}
                className="mb-1">
                Avg HR
              </Text>
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: bodySize,
                  lineHeight: bodySize * 1.2,
                }}
                className="font-bold">
                {Math.round(activity.average_heartrate!)} bpm
              </Text>
            </View>
          )}

          {hasElevation && (
            <View className="flex-1">
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: labelSize,
                  lineHeight: labelSize * 1.2,
                }}
                className="mb-1">
                Elevation
              </Text>
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: bodySize,
                  lineHeight: bodySize * 1.2,
                }}
                className="font-bold">
                {Math.round(activity.total_elevation_gain!)} m
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
