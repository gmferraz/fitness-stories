import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '../../components/nativewindui/Text';
import { LastActivityCard } from './components/LastActivityCard';
import { WeekSummaryCard } from './components/WeekSummaryCard';
import { useActivities } from './hooks/use-activities';
import { useWeekSummary } from './hooks/use-week-summary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator as LoadingIndicator } from '~/components/nativewindui/ActivityIndicator';
import { useMountEffect } from '~/utils/use-mount-effect';
import { useColorScheme } from '~/lib/useColorScheme';
import { EmptyState } from '~/components/EmptyState';
import { router } from 'expo-router';
import { useStrava } from '~/utils/use-strava';
import { useAppleHealth } from '~/utils/use-apple-health';
import StravaIcon from '~/assets/svg/strava.svg';
import AppleHealthIcon from '~/assets/svg/apple-health.svg';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = () => {
  const { activities, isLoading, refreshActivities, hasConnectedSource } = useActivities();
  const weekSummary = useWeekSummary();
  const { bottom } = useSafeAreaInsets();
  const [finishedMount, setFinishedMount] = useState(false);
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  // Connect apps state and hooks
  const { isAuthenticated: isStravaConnected, handleLinkStrava } = useStrava();
  const {
    isAuthenticated: isAppleHealthConnected,
    isAvailable: isAppleHealthAvailable,
    initializeHealthKit,
  } = useAppleHealth();
  const [isConnectingStrava, setIsConnectingStrava] = useState(false);
  const [isConnectingAppleHealth, setIsConnectingAppleHealth] = useState(false);

  const handleStravaConnect = async () => {
    setIsConnectingStrava(true);
    await handleLinkStrava();
    setIsConnectingStrava(false);
  };

  const handleAppleHealthConnect = async () => {
    setIsConnectingAppleHealth(true);
    await initializeHealthKit();
    setIsConnectingAppleHealth(false);
  };

  useMountEffect(() => {
    setTimeout(() => {
      setFinishedMount(true);
    }, 1000);
  });

  if (!hasConnectedSource) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 bg-background px-6 pt-6">
        <View className="w-full space-y-4">
          <EmptyState
            title={t('home.noConnectedApps.title')}
            subtitle={t('home.noConnectedApps.subtitle')}
            className="mb-6"
          />
          <TouchableOpacity
            onPress={handleStravaConnect}
            disabled={isStravaConnected}
            className={`flex-row items-center justify-between rounded-2xl bg-card p-4 ${
              isStravaConnected ? 'opacity-50' : ''
            }`}>
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12">
                <StravaIcon />
              </View>
              <View>
                <Text variant="title2" className="font-semibold">
                  {t('home.apps.strava.title')}
                </Text>
                <Text variant="subhead" className="text-gray-500">
                  {isStravaConnected
                    ? t('home.apps.strava.connected')
                    : t('home.apps.strava.connect')}
                </Text>
              </View>
            </View>
            {isConnectingStrava ? (
              <ActivityIndicator size="small" color="white" />
            ) : isStravaConnected ? (
              <Ionicons name="checkmark" color="green" size={24} />
            ) : (
              <Ionicons name="add-circle-outline" color="gray" size={24} />
            )}
          </TouchableOpacity>

          {isAppleHealthAvailable && (
            <TouchableOpacity
              onPress={handleAppleHealthConnect}
              disabled={isAppleHealthConnected}
              className={`mt-4 flex-row items-center justify-between rounded-2xl bg-card p-4 ${
                isAppleHealthConnected ? 'opacity-50' : ''
              }`}>
              <View className="flex-row items-center gap-4">
                <View className="h-12 w-12">
                  <AppleHealthIcon />
                </View>
                <View>
                  <Text variant="title2" className="font-semibold">
                    {t('home.apps.appleHealth.title')}
                  </Text>
                  <Text variant="subhead" className="text-gray-500">
                    {isAppleHealthConnected
                      ? t('home.apps.appleHealth.connected')
                      : t('home.apps.appleHealth.connect')}
                  </Text>
                </View>
              </View>
              {isConnectingAppleHealth ? (
                <ActivityIndicator size="small" color="white" />
              ) : isAppleHealthConnected ? (
                <Ionicons name="checkmark" color="green" size={24} />
              ) : (
                <Ionicons name="add-circle-outline" color="gray" size={24} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  if (isLoading && !finishedMount) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <LoadingIndicator />
      </View>
    );
  }

  const lastActivity = activities[0];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingBottom: bottom + 16,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshActivities}
          tintColor={colors.primary}
        />
      }
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-6">
        <View className="mb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text variant="title1" className="font-semibold">
              {t('home.lastExercise.title')}
            </Text>
            {activities.length > 0 && (
              <TouchableOpacity
                className="rounded-full bg-gray-200 px-4 py-2 dark:bg-gray-800"
                onPress={() => router.push('/activities-list')}>
                <Text variant="subhead" color="primary">
                  {t('home.lastExercise.seeAll')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {lastActivity ? (
            <LastActivityCard
              onPress={() =>
                router.push(`/activity-details/${lastActivity.id}?type=${lastActivity.type}`)
              }
              activity={lastActivity}
            />
          ) : (
            <EmptyState
              title={t('home.lastExercise.empty.title')}
              subtitle={t('home.lastExercise.empty.subtitle')}
            />
          )}
        </View>

        {/* Week Summary Section */}
        <View>
          <View className="mb-4 flex-row items-baseline justify-between">
            <View>
              <Text variant="title1" className="font-semibold">
                {t('home.weekSummary.title')}
              </Text>
              <Text variant="subhead" className="text-gray-500">
                {weekSummary.weekRange}
              </Text>
            </View>
            <TouchableOpacity
              className="rounded-full bg-gray-200 px-4 py-2 dark:bg-gray-800"
              onPress={() => router.push('/weeks-list')}>
              <Text variant="subhead" color="primary">
                {t('home.weekSummary.seeAll')}
              </Text>
            </TouchableOpacity>
          </View>
          {weekSummary.totalActivities > 0 ? (
            <WeekSummaryCard {...weekSummary} />
          ) : (
            <EmptyState
              title={t('home.weekSummary.empty.title')}
              subtitle={t('home.weekSummary.empty.subtitle')}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};
