import { activityStorage } from '../hooks/use-activities';
import { Activity } from '../types/activity';

export const getStoredActivities = (): Activity[] => {
  const activities = activityStorage.getString('activities');
  return activities ? JSON.parse(activities) : [];
};
