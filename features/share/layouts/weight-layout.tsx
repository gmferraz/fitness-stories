import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from '~/components/nativewindui/Text';
import { formatDuration } from '~/utils/formatters';
import { Activity } from '~/features/home/types/activity';
import { languageDetector } from '~/utils/i18n/languageDetector';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  getIconColor,
} from '../utils/use-layout-edition-store';

interface WeightLayoutProps {
  duration: number;
  activity: Activity;
  showBackground?: boolean;
}

export function WeightLayout({ duration, activity, showBackground = true }: WeightLayoutProps) {
  const language = languageDetector.detect();
  const hasHeartRate = !!activity.average_heartrate;
  const hasCalories = !!activity.calories;
  const { fontFamily, titleSize, bodySize, labelSize, fontColor, backgroundColor, iconColor } =
    useLayoutEditionStore();

  const textColor = getFontColor(fontColor);
  const bgColor = getBackgroundColor(backgroundColor);
  const icon = getIconColor(iconColor);

  return (
    <View
      className={`self-center overflow-hidden rounded-2xl p-4 ${showBackground ? 'bg-card' : ''}`}
      style={{ width: 320, backgroundColor: showBackground ? bgColor : 'transparent' }}>
      <Text
        style={{
          fontFamily,
          color: textColor,
          fontSize: labelSize,
          lineHeight: labelSize * 1.2,
        }}
        className="mb-2">
        {new Date().toLocaleDateString(language, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>

      <View className="mt-2">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="dumbbell" size={24} color={icon} />
          <Text
            style={{
              fontFamily,
              color: textColor,
              fontSize: bodySize,
              lineHeight: bodySize * 1.2,
            }}
            className="ml-2 font-bold">
            Weight Training
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <Text
          style={{
            fontFamily,
            color: textColor,
            fontSize: labelSize,
            lineHeight: labelSize * 1.2,
          }}
          className="mb-1 opacity-60">
          Duration
        </Text>
        <Text
          style={{
            fontFamily,
            color: textColor,
            fontSize: titleSize,
            lineHeight: titleSize * 1.2,
          }}
          className="font-black">
          {formatDuration(duration)}
        </Text>
      </View>

      {(hasHeartRate || hasCalories) && (
        <View className="mt-6 flex-row justify-between">
          {hasHeartRate && (
            <View className="flex-1">
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: labelSize,
                  lineHeight: labelSize * 1.2,
                }}
                className="mb-1 opacity-60">
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

          {hasCalories && (
            <View className="flex-1">
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: labelSize,
                  lineHeight: labelSize * 1.2,
                }}
                className="mb-1 opacity-60">
                Calories
              </Text>
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: bodySize,
                  lineHeight: bodySize * 1.2,
                }}
                className="font-bold">
                {Math.round(activity.calories!)} kcal
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
