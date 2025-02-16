import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/nativewindui/Text';
import { sportTypeToIcon } from '../utils/sport-type-icons';
import { Activity } from '../types/activity';
import StravaIcon from '~/assets/svg/strava.svg';
import AppleHealthIcon from '~/assets/svg/apple-health.svg';
import type { SvgProps } from 'react-native-svg';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { colors } = useColorScheme();

  const formatDistance = (meters: number) => {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(2)} km`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const getSourceIcon = (root: Activity['root']) => {
    const IconProps: SvgProps = {
      width: 20,
      height: 20,
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
    <TouchableOpacity
      className="mb-3 overflow-hidden rounded-2xl bg-card"
      onPress={() => router.push(`/activity-details/${activity.id}?type=${activity.type}`)}>
      <View className="flex-row items-center p-4">
        <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <MaterialCommunityIcons
            name={sportTypeToIcon[activity.type as keyof typeof sportTypeToIcon]}
            size={22}
            color={colors.primary}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text variant="callout" className="mb-1 font-medium">
              {activity.name}
            </Text>
            <View className="flex-row items-center shadow-sm">{getSourceIcon(activity.root)}</View>
          </View>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={14} color={colors.grey} />
              <Text variant="footnote" color="tertiary">
                {formatDuration(activity.moving_time)}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="map-outline" size={14} color={colors.grey} />
              <Text variant="footnote" color="tertiary">
                {formatDistance(activity.distance)}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={14} color={colors.grey} />
              <Text variant="footnote" color="tertiary">
                {formatDate(activity.start_date)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
