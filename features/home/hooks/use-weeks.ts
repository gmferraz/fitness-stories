import { useState, useCallback } from 'react';
import { useActivities } from './use-activities';
import { WeekSummary } from '../types/week-summary';
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';
import { weekStartStore } from '~/stores/use-week-start-store';

export const useWeeks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { activities, refreshActivities } = useActivities({ origin: 'activity-details' });
  const { weekStartsOn } = weekStartStore();

  const getWeeks = useCallback(() => {
    const weeks: WeekSummary[] = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const currentDate = subWeeks(now, i);
      const weekStart = startOfWeek(currentDate, { weekStartsOn });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn });

      const weekActivities = activities.filter((activity) => {
        const activityDate = new Date(activity.start_date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });

      const totalDistance = weekActivities.reduce((sum, activity) => sum + activity.distance, 0);
      const totalDuration = weekActivities.reduce((sum, activity) => sum + activity.moving_time, 0);
      const totalElevation = weekActivities.reduce(
        (sum, activity) => sum + activity.total_elevation_gain,
        0
      );
      const totalCalories = weekActivities.reduce(
        (sum, activity) => sum + (activity.calories ?? 0),
        0
      );
      const avgPace = totalDistance > 0 ? totalDuration / 60 / (totalDistance / 1000) : 0;

      const weekRange = `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM')}`;

      weeks.push({
        totalDistance,
        totalDuration,
        totalActivities: weekActivities.length,
        totalElevation,
        weekRange,
        avgPace,
        totalCalories,
        startDate: weekStart,
        endDate: weekEnd,
        activities: weekActivities,
      });
    }

    return weeks;
  }, [activities, weekStartsOn]);

  const refreshWeeks = useCallback(async () => {
    setIsLoading(true);
    await refreshActivities();
    setIsLoading(false);
  }, []);

  return {
    weeks: getWeeks(),
    isLoading,
    refreshWeeks,
  };
};
