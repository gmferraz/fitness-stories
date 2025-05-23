import React, { useEffect, useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator as LoadingIndicator } from '~/components/nativewindui/ActivityIndicator';
import { useColorScheme } from '~/lib/useColorScheme';
import { EmptyState } from '~/components/EmptyState';
import { router, usePathname } from 'expo-router';
import { useStrava } from '~/utils/use-strava';
import { useAppleHealth } from '~/utils/use-apple-health';
import StravaIcon from '~/assets/svg/strava.svg';
import AppleHealthIcon from '~/assets/svg/apple-health.svg';
import { Ionicons } from '@expo/vector-icons';
import { useWeeks } from './hooks/use-weeks';
import { usePostHog } from 'posthog-react-native';

export const HomeScreen = () => {
  const { activities, isLoading, refreshActivities, hasConnectedSource } = useActivities({
    origin: 'home',
  });
  const posthog = usePostHog();
  const pathname = usePathname();

  useEffect(() => {
    posthog.capture('$pageview', {
      $current_url: pathname,
    });

    return () => {
      posthog.capture('$pageleave', {
        $current_url: pathname,
      });
    };
  }, [pathname]);

  const { bottom } = useSafeAreaInsets();
  const { colors } = useColorScheme();
  const { t } = useTranslation();
  const { weeks } = useWeeks();

  const weekSummary = weeks[0];

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

  if (!hasConnectedSource) {
    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1 bg-background">
        <View className="w-full space-y-6 px-6 pt-10">
          <EmptyState
            title={t('home.noConnectedApps.title')}
            subtitle={t('home.noConnectedApps.subtitle')}
            className="mb-8 shadow-lg"
          />
          <Text variant="title2" className="mb-4 text-center font-semibold">
            {t('home.apps.connectPrompt')}
          </Text>
          <TouchableOpacity
            onPress={handleStravaConnect}
            disabled={isStravaConnected}
            className={`flex-row items-center justify-between rounded-2xl bg-card p-5 shadow-md ${
              isStravaConnected ? 'opacity-50' : ''
            }`}>
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
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
              <View className="h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Ionicons name="checkmark" color="green" size={20} />
              </View>
            ) : (
              <View className="bg-primary/10 h-8 w-8 items-center justify-center rounded-full">
                <Ionicons name="add" color={colors.primary} size={20} />
              </View>
            )}
          </TouchableOpacity>

          {isAppleHealthAvailable && (
            <TouchableOpacity
              onPress={handleAppleHealthConnect}
              disabled={isAppleHealthConnected}
              className={`mt-4 flex-row items-center justify-between rounded-2xl bg-card p-5 shadow-md ${
                isAppleHealthConnected ? 'opacity-50' : ''
              }`}>
              <View className="flex-row items-center gap-4">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
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
                <View className="h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Ionicons name="checkmark" color="green" size={20} />
                </View>
              ) : (
                <View className="bg-primary/10 h-8 w-8 items-center justify-center rounded-full">
                  <Ionicons name="add" color={colors.primary} size={20} />
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  if (isLoading && hasConnectedSource && !activities.length) {
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
      <View className="px-5 pt-4">
        <View className="mb-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text variant="title1" className="font-bold">
              {t('home.lastExercise.title')}
            </Text>
            {activities.length > 0 && (
              <TouchableOpacity
                className="rounded-full px-4 py-2"
                onPress={() => router.push('/activities-list')}>
                <Text variant="subhead" color="primary" className="font-medium">
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
              className="shadow-lg"
            />
          )}
        </View>

        {/* Week Summary Section */}
        <View>
          <View className="mb-4 flex-row items-baseline justify-between">
            <View>
              <Text variant="title1" className="font-bold">
                {t('home.weekSummary.title')}
              </Text>
              <Text variant="subhead" className="text-gray-500">
                {weekSummary.weekRange}
              </Text>
            </View>
            <TouchableOpacity
              className="rounded-full px-4 py-2"
              onPress={() => router.push('/weeks-list')}>
              <Text variant="subhead" color="primary" className="font-medium">
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
              className="shadow-lg"
              icon="calendar-outline"
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};
