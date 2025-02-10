import { useMemo } from 'react';
import { Activity } from '../types/activity';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { useWeekStartStore } from '~/stores/use-week-start-store';

interface WeekSummary {
  totalDistance: number;
  totalDuration: number;
  totalActivities: number;
  totalElevation: number;
  weekRange: string;
  avgPace: number;
  totalCalories: number;
}

export const useWeekSummary = (activities: Activity[]): WeekSummary => {
  const { weekStartsOn } = useWeekStartStore();

  return useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn });
    const weekEnd = endOfWeek(now, { weekStartsOn });

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

    return {
      totalDistance,
      totalDuration,
      totalActivities: weekActivities.length,
      totalElevation,
      weekRange,
      avgPace,
      totalCalories,
    };
  }, [activities, weekStartsOn]);
};
