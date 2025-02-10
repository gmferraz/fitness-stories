import { Activity } from '../types/activity';
import { getStoredActivities } from './get-stored-activities';

export const getStoredActivityDetails = (id: string): Activity => {
  const activities = getStoredActivities();
  const activity = activities.find((activity) => activity.id === id);
  if (!activity) {
    throw new Error('Activity not found');
  }
  return activity;
};
