import { useEffect, useState } from 'react';
import { MMKV } from 'react-native-mmkv';
import { useStrava } from '../../../utils/use-strava';
import { useAppleHealth } from '../../../utils/use-apple-health';
import { Activity } from '../types/activity';

export const activityStorage = new MMKV({
  id: 'activity-storage-v2',
});

// Set to true to prevent API requests and only use stored activities
const isDev = __DEV__;

interface UseActivitiesProps {
  origin?: 'home' | 'activities-list' | 'activity-details';
}

export const useActivities = ({ origin = 'home' }: UseActivitiesProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated: isStravaAuthenticated, listLast10RunningExercises } = useStrava();
  const { isAuthenticated: isAppleHealthAuthenticated, listLast150DaysWorkouts } = useAppleHealth();

  const fetchAndUpdateActivities = async () => {
    setIsLoading(true);
    try {
      if (!isDev) {
        const [stravaActivities, appleHealthActivities] = await Promise.all([
          isStravaAuthenticated ? listLast10RunningExercises() : Promise.resolve([]),
          isAppleHealthAuthenticated ? listLast150DaysWorkouts() : Promise.resolve([]),
        ]);

        const storedActivities = getStoredActivities().filter(
          (activity) =>
            (activity.root === 'strava' && isStravaAuthenticated) ||
            (activity.root === 'apple-health' && isAppleHealthAuthenticated)
        );

        // Merge new activities with stored ones, avoiding duplicates
        const mergedActivities = mergeActivities(storedActivities, [
          ...stravaActivities,
          ...appleHealthActivities,
        ]);

        // Sort by date descending
        const sortedActivities = mergedActivities.sort(
          (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );

        setActivities(sortedActivities);
        storeActivities(sortedActivities);
      } else {
        // In dev mode, just load stored activities
        const storedActivities = getStoredActivities().filter(
          (activity) =>
            (activity.root === 'strava' && isStravaAuthenticated) ||
            (activity.root === 'apple-health' && isAppleHealthAuthenticated)
        );
        const sortedActivities = storedActivities.sort(
          (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
        setActivities(sortedActivities);
        storeActivities(sortedActivities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStoredActivities = (): Activity[] => {
    const stored = activityStorage.getString('activities');
    return stored ? JSON.parse(stored) : [];
  };

  const storeActivities = (activities: Activity[]) => {
    activityStorage.set('activities', JSON.stringify(activities));
  };

  const mergeActivities = (stored: Activity[], newOnes: Activity[]): Activity[] => {
    const merged = [...stored];
    newOnes.forEach((newActivity) => {
      const existingIndex = merged.findIndex(
        (stored) => stored.root === newActivity.root && stored.id === newActivity.id
      );

      if (existingIndex === -1) {
        merged.push(newActivity);
      } else {
        // Update existing activity with new data
        merged[existingIndex] = newActivity;
      }
    });
    return merged;
  };

  useEffect(() => {
    const hasConnectedSource = isStravaAuthenticated || isAppleHealthAuthenticated;
    if (hasConnectedSource) {
      const stored = getStoredActivities();
      setActivities(stored);
      if (origin === 'home') {
        fetchAndUpdateActivities();
      }
    }
  }, [isStravaAuthenticated, isAppleHealthAuthenticated]);

  return {
    activities,
    isLoading,
    refreshActivities: fetchAndUpdateActivities,
    hasConnectedSource: isStravaAuthenticated || isAppleHealthAuthenticated,
  };
};
