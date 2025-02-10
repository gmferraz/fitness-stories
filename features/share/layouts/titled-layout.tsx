import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';

import { Text } from '~/components/nativewindui/Text';
import { formatDistance, formatDuration } from '~/utils/formatters';

interface TitledLayoutProps {
  distance: number;
  duration: number;
  pace: number;
  unit: string;
  title: string;
  showBackground?: boolean;
}

export function TitledLayout({
  distance,
  duration,
  pace,
  unit,
  title,
  showBackground = true,
}: TitledLayoutProps) {
  const width = Dimensions.get('window').width;
  const { t } = useTranslation();

  return (
    <View
      className={`self-center rounded-2xl ${showBackground ? 'bg-card' : ''}`}
      style={{ height: 80, width: width - 48 }}>
      <View className="rounded-xl p-4">
        <View className="flex-row justify-between">
          <View>
            <Text color="primary" variant="caption1" className="mb-1">
              Distance
            </Text>
            <Text color="primary" variant="title3" className="font-bold">
              {formatDistance(distance)}
            </Text>
          </View>
          <View>
            <Text color="primary" variant="caption1" className="mb-1">
              Time
            </Text>
            <Text color="primary" variant="title3" className="font-bold">
              {formatDuration(duration)}
            </Text>
          </View>
          <View>
            <Text color="primary" variant="caption1" className="mb-1">
              Pace
            </Text>
            <Text color="primary" variant="title3" className="font-bold">
              {pace}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
