import { startOfWeek, endOfWeek, parse, format } from 'date-fns';
import { weekStartStore } from '~/stores/use-week-start-store';
import { getStoredActivities } from '../utils/get-stored-activities';
import { Activity } from '../types/activity';

export interface WeekDetails {
  totalDistance: number;
  totalDuration: number;
  totalActivities: number;
  totalElevation: number;
  weekRange: string;
  avgPace: number;
  totalCalories: number;
  startDate: Date;
  endDate: Date;
  activities: Activity[];
}

export const getWeekDetails = (weekRange: string): WeekDetails => {
  const activities = getStoredActivities();
  const { weekStartsOn } = weekStartStore();

  // Parse the start date with the current year
  const [startDateStr] = weekRange.split(' - ');
  const currentYear = new Date().getFullYear();
  const [startDay, startMonth] = startDateStr.split('/').map(Number);

  // Create a date object with the current year
  const startDate = new Date(currentYear, startMonth - 1, startDay);

  // Get the week boundaries
  const weekStart = startOfWeek(startDate, { weekStartsOn });
  const weekEnd = endOfWeek(weekStart, { weekStartsOn });

  // If the week spans across years (December to January), adjust the year
  if (startMonth === 12 && weekEnd.getMonth() === 0) {
    weekEnd.setFullYear(currentYear + 1);
  } else if (startMonth === 1 && weekStart.getMonth() === 11) {
    weekStart.setFullYear(currentYear - 1);
  }

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
