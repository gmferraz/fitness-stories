import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/nativewindui/Text';
import { sportTypeToIcon } from '../utils/sport-type-icons';
import { Activity } from '../types/activity';
import StravaIcon from '~/assets/svg/strava.svg';
import AppleHealthIcon from '~/assets/svg/apple-health.svg';
import type { SvgProps } from 'react-native-svg';
import { useColorScheme } from '~/lib/useColorScheme';
import { formatDistance, formatDuration, formatPace } from '~/utils/formatters';
import { useTranslation } from 'react-i18next';
import { translateSportType } from '../utils/translate-sport-type';

interface LastActivityCardProps {
  activity: Activity;
  onPress: () => void;
}

export const LastActivityCard: React.FC<LastActivityCardProps> = ({ activity, onPress }) => {
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
    });
  };

  const getSourceIcon = (root: Activity['root']) => {
    const IconProps: SvgProps = {
      width: 28,
      height: 28,
    };

    switch (root) {
      case 'strava':
      case 'garmin':
        return <StravaIcon {...IconProps} />;
      case 'apple-health':
        return <AppleHealthIcon {...IconProps} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} className="mb-4 overflow-hidden rounded-3xl bg-card">
      <View className="bg-primary/20 dark:bg-primary/10 flex-row items-center justify-between p-3">
        <View className="flex-row items-center gap-2">
          <View className="bg-primary/20 h-8 w-8 items-center justify-center rounded-full">
            <MaterialCommunityIcons
              name={sportTypeToIcon[activity.type as keyof typeof sportTypeToIcon]}
              size={18}
              color={colors.primary}
            />
          </View>
          <Text variant="callout" className="font-medium">
            {translateSportType(t, activity.type)}
          </Text>
        </View>
        <View className="mr-1 flex-row items-center shadow-sm">{getSourceIcon(activity.root)}</View>
      </View>

      <View className="p-4">
        <Text variant="title2" className="mb-1" numberOfLines={3}>
          {activity.name}
        </Text>
        <Text variant="subhead" className="mb-4 text-gray-500 dark:text-gray-400">
          {formatDate(activity.start_date)}
        </Text>

        <View className="flex-row flex-wrap gap-y-4">
          {!!activity.distance && (
            <View className="w-1/2">
              <Text variant="footnote" className="mb-1 text-gray-500 dark:text-gray-400">
                {t('lastActivityCard.stats.distance')}
              </Text>
              <Text variant="title3" className="font-semibold">
                {formatDistance(activity.distance)}
              </Text>
            </View>
          )}

          {!!activity.moving_time && (
            <View className="w-1/2">
              <Text variant="footnote" className="mb-1 text-gray-500 dark:text-gray-400">
                {t('lastActivityCard.stats.duration')}
              </Text>
              <Text variant="title3" className="font-semibold">
                {formatDuration(activity.moving_time)}
              </Text>
            </View>
          )}

          {!!activity.distance && !!activity.moving_time && (
            <View className="w-1/2">
              <Text variant="footnote" className="mb-1 text-gray-500 dark:text-gray-400">
                {t('lastActivityCard.stats.avgPace')}
              </Text>
              <Text variant="title3" className="font-semibold">
                {formatPace(activity.distance, activity.moving_time)}
              </Text>
            </View>
          )}

          {!!activity.total_elevation_gain && (
            <View className="w-1/2">
              <Text variant="footnote" className="mb-1 text-gray-500 dark:text-gray-400">
                {t('lastActivityCard.stats.elevation')}
              </Text>
              <Text variant="title3" className="font-semibold">
                {activity.total_elevation_gain}m
              </Text>
            </View>
          )}

          {!!activity.calories && !activity.total_elevation_gain && (
            <View className="w-1/2">
              <Text variant="footnote" className="mb-1 text-gray-500 dark:text-gray-400">
                {t('lastActivityCard.stats.calories')}
              </Text>
              <Text variant="title3" className="font-semibold">
                {activity.calories}kcal
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
