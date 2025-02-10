import { Dimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '~/components/nativewindui/Text';
import { languageDetector } from '~/utils/i18n/languageDetector';
import { formatPace, formatDuration, formatDistance } from '~/utils/formatters';

interface NoBgLayoutProps {
  distance: number;
  duration: number;
  pace: number;
  unit: string;
  title: string;
}

export function NoBgLayout({ distance, duration, pace, unit }: NoBgLayoutProps) {
  const language = languageDetector.detect();
  const width = Dimensions.get('window').width;
  const { t } = useTranslation();

  return (
    <View className="self-center rounded-2xl p-4 pl-6" style={{ height: 160, width: width - 48 }}>
      <Text color="primary" variant="caption2" className="mb-1">
        {new Date().toLocaleDateString(language, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
      <Text numberOfLines={2} color="primary" variant="largeTitle" className="mb-4 font-bold">
        {formatDistance(distance)}
      </Text>
      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text color="primary" variant="caption1" className="mb-1">
            Avg pace
          </Text>
          <Text color="primary" variant="title3" className="font-bold">
            {pace}
          </Text>
        </View>
        <View className="ml-3 flex-1">
          <Text color="primary" variant="caption1" className="mb-1">
            Time
          </Text>
          <Text color="primary" variant="title3" className="font-bold">
            {formatDuration(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
}
