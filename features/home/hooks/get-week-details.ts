import { startOfWeek, endOfWeek, parse } from 'date-fns';
import { weekStartStore } from '~/stores/use-week-start-store';
import { getStoredActivities } from '../utils/get-stored-activities';

export const getWeekDetails = (weekRange: string) => {
  const activities = getStoredActivities();
  const { weekStartsOn } = weekStartStore();

  const [startDateStr] = weekRange.split(' - ');
  const startDate = parse(startDateStr, 'dd/MM', new Date());
  const weekStart = startOfWeek(startDate, { weekStartsOn });
  const weekEnd = endOfWeek(weekStart, { weekStartsOn });

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
  const totalCalories = weekActivities.reduce((sum, activity) => sum + (activity.calories ?? 0), 0);
  const avgPace = totalDistance > 0 ? totalDuration / 60 / (totalDistance / 1000) : 0;

  return {
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
  };
};
