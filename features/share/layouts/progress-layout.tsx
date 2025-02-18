import { Dimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '~/components/nativewindui/Text';
import { formatDistance, formatDuration } from '~/utils/formatters';
import { Activity } from '~/features/home/types/activity';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  DEFAULT_LAYOUT_STYLES,
} from '../utils/use-layout-edition-store';

interface ProgressLayoutProps {
  pace: string;
  duration: number;
  activity: Activity;
  showBackground?: boolean;
}

export function ProgressLayout({
  pace,
  duration,
  activity,
  showBackground = true,
}: ProgressLayoutProps) {
  const width = Dimensions.get('window').width;
  const { t } = useTranslation();
  const { styles } = useLayoutEditionStore();
  const style = styles.progress.isEdited ? styles.progress : DEFAULT_LAYOUT_STYLES.progress;

  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);

  return (
    <View className="self-center rounded-2xl" style={{ height: 180, width: width - 48 }}>
      <View
        className="mb-2 flex-col rounded-xl p-4"
        style={{ backgroundColor: showBackground ? bgColor : 'transparent' }}>
        <Text
          style={{
            fontFamily: style.fontFamily,
            color: textColor,
            fontSize: style.bodySize,
            lineHeight: style.labelSize * 1.2,
          }}
          className="mb-2"
          numberOfLines={3}>
          {activity.name}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: style.fontFamily,
            color: textColor,
            fontSize: style.titleSize,
            lineHeight: style.titleSize * 1.2,
          }}
          className="mb-4 font-bold">
          {formatDistance(activity.distance)}
        </Text>

        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.labelSize,
                lineHeight: style.labelSize * 1.2,
              }}
              className="mb-1">
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
          <View className="ml-3 flex-1">
            <Text
              style={{
                fontFamily: style.fontFamily,
                color: textColor,
                fontSize: style.labelSize,
                lineHeight: style.labelSize * 1.2,
              }}
              className="mb-1">
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
        </View>
      </View>
    </View>
  );
}
