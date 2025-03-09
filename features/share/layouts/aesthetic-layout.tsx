import { Dimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/nativewindui/Text';
import { formatDistance, formatDuration } from '~/utils/formatters';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  DEFAULT_LAYOUT_STYLES,
} from '../utils/use-layout-edition-store';
interface AestheticLayoutProps {
  pace: string;
  duration: number;
  unit: string;
  distance: number;
  title: string;
  showBackground?: boolean;
}

export function AestheticLayout({
  pace,
  duration,
  unit,
  distance,
  title,
  showBackground = true,
}: AestheticLayoutProps) {
  const { t } = useTranslation();
  const { styles } = useLayoutEditionStore();
  const style = styles.aesthetic.isEdited ? styles.aesthetic : DEFAULT_LAYOUT_STYLES.aesthetic;
  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor, style.opacity);
  const width = Dimensions.get('window').width;
  const padding = style.padding;

  return (
    <View
      className="self-center rounded-2xl p-4"
      style={{
        width: width - 48,
        backgroundColor: showBackground ? bgColor : 'transparent',
        padding: padding ?? 16,
      }}>
      <View className="flex-col p-4">
        <View className="items-center">
          <Text
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.labelSize,
              lineHeight: style.labelSize * 1.2,
            }}
            className="mb-2">
            {t('share.layouts.common.distance')}
          </Text>
          <Text
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.titleSize * 1.4,
              lineHeight: style.titleSize * 1.6,
            }}
            className="font-black">
            {formatDistance(distance, false)}
          </Text>
          <Text
            style={{
              fontFamily: style.fontFamily,
              color: textColor,
              fontSize: style.labelSize,
              lineHeight: style.labelSize * 1.2,
            }}>
            {unit}
          </Text>
        </View>

        <View className="mt-8">
          <View className="h-[1px] w-full" style={{ backgroundColor: `${textColor}20` }} />

          <View className="mt-4 flex-row justify-between">
            <View>
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
                {pace}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontFamily: style.fontFamily,
                  color: textColor,
                  fontSize: style.labelSize,
                  lineHeight: style.labelSize * 1.2,
                }}
                className="mb-1">
                {t('share.layouts.common.duration')}
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
    </View>
  );
}
