import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { WeekCard } from '~/features/home/components/WeekCard';
import { useWeeks } from '~/features/home/hooks/use-weeks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';
import { EmptyState } from '~/components/EmptyState';

export const WeeksList = () => {
  const { weeks, isLoading, refreshWeeks } = useWeeks();
  const { bottom } = useSafeAreaInsets();
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: bottom + 16,
      }}
      contentInsetAdjustmentBehavior="automatic"
      data={weeks.filter((week) => week.totalActivities > 0)}
      keyExtractor={(item) => item.weekRange}
      renderItem={({ item }) => <WeekCard week={item} />}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshWeeks}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={
        <EmptyState
          title={t('home.weeksList.empty.title')}
          subtitle={t('home.weeksList.empty.subtitle')}
          className="mt-8"
        />
      }
    />
  );
};
