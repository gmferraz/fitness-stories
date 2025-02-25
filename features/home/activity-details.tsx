import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/nativewindui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { sportTypeToIcon } from './utils/sport-type-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import StravaIcon from '~/assets/svg/strava.svg';
import AppleHealthIcon from '~/assets/svg/apple-health.svg';
import type { SvgProps } from 'react-native-svg';
import MapView, { Polyline } from 'react-native-maps';
import {
  formatCadence,
  formatDistance,
  formatDuration,
  formatHeartRate,
  formatPace,
  formatWatts,
} from '~/utils/formatters';
import { getStoredActivityDetails } from './utils/get-stored-activity-details';

interface ActivityDetailsProps {
  id: string;
}

interface StatItem {
  icon: string;
  value: string;
  label: string;
  color: string;
}

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ id }) => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  const activity = getStoredActivityDetails(id);

  if (!activity) {
    return null;
  }

  const hasRoute =
    (activity.root === 'strava' || activity.root === 'apple-health') &&
    !!activity.map?.coordinates?.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const getSourceIcon = (root: typeof activity.root) => {
    const IconProps: SvgProps = {
      width: 32,
      height: 32,
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

  const stats = [
    activity.moving_time > 0 && {
      icon: 'stopwatch-outline',
      value: formatDuration(activity.moving_time),
      label: t('home.activityDetails.stats.duration'),
      color: '#FF2D55',
    },
    activity.distance > 0 && {
      icon: 'map-outline',
      value: formatDistance(activity.distance),
      label: t('home.activityDetails.stats.distance'),
      color: '#5856D6',
    },
    activity.distance > 0 &&
      activity.moving_time > 0 && {
        icon: 'speedometer-outline',
        value: formatPace(activity.distance, activity.moving_time),
        label: t('home.activityDetails.stats.avgPace'),
        color: '#FF9500',
      },
    activity.total_elevation_gain > 0 && {
      icon: 'trending-up-outline',
      value: `${activity.total_elevation_gain}m`,
      label: t('home.activityDetails.stats.elevation'),
      color: '#34C759',
    },
    (activity.calories ?? 0) > 0 && {
      icon: 'flame-outline',
      value: `${activity.calories}`,
      label: t('home.activityDetails.stats.calories'),
      color: '#FF3B30',
    },
  ].filter((item): item is StatItem => Boolean(item));

  // Additional stats that are shown only if available
  const additionalStats =
    activity.root === 'strava'
      ? [
          activity.average_heartrate && {
            icon: 'heart-outline',
            value: formatHeartRate(activity.average_heartrate),
            label: t('home.activityDetails.stats.avgHeartRate'),
            color: '#FF3B30',
          },
          activity.max_heartrate && {
            icon: 'heart',
            value: formatHeartRate(activity.max_heartrate),
            label: t('home.activityDetails.stats.maxHeartRate'),
            color: '#FF3B30',
          },
          activity.average_watts && {
            icon: 'flash-outline',
            value: formatWatts(activity.average_watts),
            label: t('home.activityDetails.stats.avgPower'),
            color: '#007AFF',
          },
          activity.max_watts && {
            icon: 'flash',
            value: formatWatts(activity.max_watts),
            label: t('home.activityDetails.stats.maxPower'),
            color: '#007AFF',
          },
          activity.weighted_average_watts && {
            icon: 'pulse-outline',
            value: formatWatts(activity.weighted_average_watts),
            label: t('home.activityDetails.stats.normalizedPower'),
            color: '#007AFF',
          },
          activity.average_cadence && {
            icon: 'walk-outline',
            value: formatCadence(activity.average_cadence),
            label: t('home.activityDetails.stats.avgCadence'),
            color: '#5856D6',
          },
          activity.max_cadence && {
            icon: 'walk',
            value: formatCadence(activity.max_cadence),
            label: t('home.activityDetails.stats.maxCadence'),
            color: '#5856D6',
          },
        ].filter((item): item is StatItem => Boolean(item))
      : activity.root === 'apple-health'
        ? [
            activity.average_heartrate && {
              icon: 'heart-outline',
              value: formatHeartRate(activity.average_heartrate),
              label: t('home.activityDetails.stats.avgHeartRate'),
              color: '#FF3B30',
            },
            activity.max_heartrate && {
              icon: 'heart',
              value: formatHeartRate(activity.max_heartrate),
              label: t('home.activityDetails.stats.maxHeartRate'),
              color: '#FF3B30',
            },
            activity.total_energy_burned && {
              icon: 'pulse-outline',
              value: formatWatts(activity.total_energy_burned),
              label: t('home.activityDetails.stats.energyBurned'),
              color: '#007AFF',
            },
            activity.average_cadence && {
              icon: 'walk-outline',
              value: formatCadence(activity.average_cadence),
              label: t('home.activityDetails.stats.avgCadence'),
              color: '#5856D6',
            },
            activity.max_cadence && {
              icon: 'walk',
              value: formatCadence(activity.max_cadence),
              label: t('home.activityDetails.stats.maxCadence'),
              color: '#5856D6',
            },
          ].filter((item): item is StatItem => Boolean(item))
        : [];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingBottom: bottom + 16,
      }}>
      {/* Header Section */}
      <View className="border-gray-200 bg-card px-8 pb-6 pt-4 dark:border-gray-800">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <MaterialCommunityIcons
              name={sportTypeToIcon[activity.type as keyof typeof sportTypeToIcon]}
              size={24}
              color={colors.primary}
            />
          </View>
          <View className="flex-row items-center shadow-sm">{getSourceIcon(activity.root)}</View>
        </View>

        <Text variant="title1" className="mb-2">
          {activity.name}
        </Text>
        <Text variant="subhead" className="text-gray-500">
          {formatDate(activity.start_date)}
        </Text>
      </View>

      {/* Map Section */}
      {hasRoute && (
        <View className="mx-4 mb-4 mt-8 h-64 overflow-hidden rounded-2xl">
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: activity.map?.coordinates?.[0]?.latitude ?? 0,
              longitude: activity.map?.coordinates?.[0]?.longitude ?? 0,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}>
            <Polyline
              coordinates={activity.map?.coordinates ?? []}
              strokeColor={colors.primary}
              strokeWidth={3}
            />
          </MapView>
        </View>
      )}

      {/* Stats Grid */}
      <View className="p-4">
        <View className="flex-row flex-wrap">
          {/* Primary Stats */}
          {stats.map((stat) => (
            <View key={stat.label} className="w-1/2 p-1">
              <View className="rounded-2xl bg-card p-4">
                <View
                  className="mb-3 h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${stat.color}20` }}>
                  <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <Text variant="title2" className="font-semibold">
                  {stat.value}
                </Text>
                <Text variant="subhead" className="text-gray-500">
                  {stat.label}
                </Text>
              </View>
            </View>
          ))}

          {/* Additional Stats */}
          {additionalStats.map((stat) => (
            <View key={stat.label} className="w-1/2 p-1">
              <View className="rounded-2xl bg-card p-4">
                <View
                  className="mb-3 h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${stat.color}20` }}>
                  <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <Text variant="title2" className="font-semibold">
                  {stat.value}
                </Text>
                <Text variant="subhead" className="text-gray-500">
                  {stat.label}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
