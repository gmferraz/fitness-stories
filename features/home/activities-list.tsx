import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { ActivityCard } from './components/ActivityCard';
import { useActivities } from './hooks/use-activities';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';
import { EmptyState } from '~/components/EmptyState';

export const ActivitiesList: React.FC = () => {
  const { activities, isLoading, refreshActivities } = useActivities();
  const { bottom } = useSafeAreaInsets();
  const { colors } = useColorScheme();

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: bottom + 16,
      }}
      contentInsetAdjustmentBehavior="automatic"
      data={activities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ActivityCard activity={item} />}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshActivities}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={
        <EmptyState
          title="No activities yet"
          subtitle="Your activities will appear here once you complete them."
          className="mt-8"
        />
      }
    />
  );
};
