import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text } from '~/components/nativewindui/Text';
import { formatDistance, formatDuration } from '~/utils/formatters';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  getIconColor,
} from '../utils/use-layout-edition-store';

interface AchievementLayoutProps {
  pace: string;
  duration: number;
  unit: string;
  distance: number;
  title: string;
  showBackground?: boolean;
}

export function AchievementLayout({
  pace,
  duration,
  unit,
  distance,
  title,
  showBackground = true,
}: AchievementLayoutProps) {
  const { t } = useTranslation();
  const { styles } = useLayoutEditionStore();
  const style = styles.achievement;

  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);
  const icon = getIconColor(style.iconColor);

  return (
    <View
      className="self-center rounded-2xl p-4"
      style={{
        height: 340,
        width: 320,
        backgroundColor: showBackground ? bgColor : 'transparent',
      }}>
      <View className="flex-1 p-6">
        {/* Achievement Badge */}
        <View className="items-center">
          <View
            className="items-center justify-center rounded-full p-6"
            style={{
              backgroundColor: `${textColor}20`,
            }}>
            <MaterialCommunityIcons
              name="trophy"
              size={48}
              color={showBackground ? textColor : icon}
            />
          </View>

          <Text
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.titleSize * 1.2,
              lineHeight: style.titleSize * 1.4,
            }}
            className="mt-4 text-center font-black">
            {formatDistance(distance)}
          </Text>

          <Text
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.labelSize,
              lineHeight: style.labelSize * 1.2,
            }}
            className="mt-1 text-center">
            {title}
          </Text>
        </View>

        {/* Stats */}
        <View className="mt-6">
          <View className="rounded-2xl p-4">
            <View className="flex-row justify-between">
              <View>
                <Text
                  style={{
                    fontFamily: style.fontFamily,
                    color: textColor,
                    fontSize: style.labelSize,
                    lineHeight: style.labelSize * 1.2,
                  }}>
                  Time
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

              <View className="items-start">
                <Text
                  style={{
                    fontFamily: style.fontFamily,
                    color: textColor,
                    fontSize: style.labelSize,
                    lineHeight: style.labelSize * 1.2,
                  }}>
                  Avg Pace
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
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
