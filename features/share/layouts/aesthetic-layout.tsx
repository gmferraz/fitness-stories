import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/nativewindui/Text';
import { formatDuration } from '~/utils/formatters';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
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
  const { fontFamily, titleSize, bodySize, labelSize, fontColor, backgroundColor } =
    useLayoutEditionStore();

  const textColor = getFontColor(fontColor);
  const bgColor = getBackgroundColor(backgroundColor);

  return (
    <View
      className="self-center rounded-2xl p-4"
      style={{
        height: 320,
        width: 320,
        backgroundColor: showBackground ? bgColor : 'transparent',
      }}>
      <View className="flex-1 p-6">
        <View className="items-center">
          <Text
            style={{
              fontFamily,
              color: textColor,
              fontSize: labelSize,
              lineHeight: labelSize * 1.2,
            }}
            className="mb-2">
            Distance
          </Text>
          <Text
            style={{
              fontFamily,
              color: textColor,
              fontSize: titleSize * 1.4,
              lineHeight: titleSize * 1.6,
            }}
            className="font-black">
            {distance}
          </Text>
          <Text
            style={{
              fontFamily,
              color: textColor,
              fontSize: labelSize,
              lineHeight: labelSize * 1.2,
            }}>
            {unit}
          </Text>
        </View>

        <View className="mt-auto">
          <View className="h-[1px] w-full" style={{ backgroundColor: `${textColor}20` }} />

          <View className="mt-6 flex-row justify-between">
            <View>
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
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: labelSize,
                  lineHeight: labelSize * 1.2,
                }}>
                per {unit}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: labelSize,
                  lineHeight: labelSize * 1.2,
                }}
                className="mb-1">
                Duration
              </Text>
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: bodySize,
                  lineHeight: bodySize * 1.2,
                }}
                className="font-bold">
                {formatDuration(duration)}
              </Text>
              <Text
                style={{
                  fontFamily,
                  color: textColor,
                  fontSize: labelSize,
                  lineHeight: labelSize * 1.2,
                }}>
                total time
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
