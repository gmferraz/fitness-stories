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
  DEFAULT_LAYOUT_STYLES,
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
  const { styles } = useLayoutEditionStore();
  const style = styles.weight.isEdited ? styles.weight : DEFAULT_LAYOUT_STYLES.weight;

  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);
  const icon = getIconColor(style.iconColor);

  return (
    <View
      className={`self-center overflow-hidden rounded-2xl p-4 ${showBackground ? 'bg-card' : ''}`}
      style={{ width: 320, backgroundColor: showBackground ? bgColor : 'transparent' }}>
      <Text
        style={{
          fontFamily: style.fontFamily,
          color: textColor,
          fontSize: style.labelSize,
          lineHeight: style.labelSize * 1.2,
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
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.bodySize,
              lineHeight: style.bodySize * 1.2,
            }}
            className="ml-2 font-bold">
            Weight Training
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <Text
          style={{
            fontFamily: style.fontFamily,
            color: textColor,
            fontSize: style.labelSize,
            lineHeight: style.labelSize * 1.2,
          }}
          className="mb-1 opacity-60">
          Duration
        </Text>
        <Text
          style={{
            fontFamily: style.fontFamily,
            color: textColor,
            fontSize: style.titleSize,
            lineHeight: style.titleSize * 1.2,
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
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="mb-1 opacity-60">
                Avg HR
              </Text>
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.bodySize,
                  lineHeight: style.bodySize * 1.2,
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
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="mb-1 opacity-60">
                Calories
              </Text>
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.bodySize,
                  lineHeight: style.bodySize * 1.2,
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
