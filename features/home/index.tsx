import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text } from '../../components/nativewindui/Text';
import { LastActivityCard } from './components/LastActivityCard';
import { WeekSummaryCard } from './components/WeekSummaryCard';
import { useActivities } from './hooks/use-activities';
import { useWeekSummary } from './hooks/use-week-summary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { useMountEffect } from '~/utils/use-mount-effect';
import { useColorScheme } from '~/lib/useColorScheme';
import { EmptyState } from '~/components/EmptyState';
import { router } from 'expo-router';

export const HomeScreen = () => {
  const { activities, isLoading, refreshActivities, hasConnectedSource } = useActivities();
  const weekSummary = useWeekSummary();
  const { bottom } = useSafeAreaInsets();
  const [finishedMount, setFinishedMount] = useState(false);
  const { colors } = useColorScheme();

  useMountEffect(() => {
    setTimeout(() => {
      setFinishedMount(true);
    }, 1000);
  });

  if (!hasConnectedSource) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <EmptyState
          title="No app connected"
          subtitle="Connect your Strava or Apple Health to see your activities"
        />
      </View>
    );
  }

  if (isLoading && !finishedMount) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
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
              Last Exercise
            </Text>
            {activities.length > 0 && (
              <TouchableOpacity
                className="rounded-full bg-gray-100 px-4 py-2 dark:bg-gray-800"
                onPress={() => router.push('/activities-list')}>
                <Text variant="subhead" color="primary">
                  See All
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
              title="You haven't uploaded any activities"
              subtitle="To track your progress and achieve your goals, please upload your activities and stay healthy."
            />
          )}
        </View>

        {/* Week Summary Section */}
        <View>
          <View className="mb-4 flex-row items-baseline justify-between">
            <View>
              <Text variant="title1" className="font-semibold">
                Week Summary
              </Text>
              <Text variant="subhead" className="text-gray-500">
                {weekSummary.weekRange}
              </Text>
            </View>
            <TouchableOpacity
              className="rounded-full bg-gray-100 px-4 py-2 dark:bg-gray-800"
              onPress={() => router.push('/weeks-list')}>
              <Text variant="subhead" color="primary">
                See All
              </Text>
            </TouchableOpacity>
          </View>
          {weekSummary.totalActivities > 0 ? (
            <WeekSummaryCard {...weekSummary} />
          ) : (
            <EmptyState
              title="No activities this week"
              subtitle="Complete your first activity this week to see your progress and statistics."
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};
