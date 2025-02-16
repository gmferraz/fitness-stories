import { act } from 'react';
import { Appearance } from 'react-native';
import { Activity, StravaActivity, AppleHealthActivity } from '~/features/home/types/activity';

export type LayoutType =
  | 'minimal'
  | 'social'
  | 'detailed'
  | 'progress'
  | 'map'
  | 'stats'
  | 'aesthetic'
  | 'achievement'
  | 'weight'
  | 'period-minimal'
  | 'period-stats'
  | 'period-social'
  | 'hiit'
  | 'hiit2';

interface LayoutRequirements {
  minimal: string[];
  detailed: string[];
  progress: string[];
  map: string[];
  stats: string[];
  aesthetic: string[];
  social: string[];
  achievement: string[];
  weight: string[];
  hiit: string[];
  hiit2: string[];
}

const LAYOUT_REQUIREMENTS: LayoutRequirements = {
  minimal: ['distance', 'moving_time'],
  social: ['distance', 'moving_time'],
  progress: ['distance', 'moving_time', 'average_speed'],
  map: ['map'],
  stats: ['average_heartrate', 'max_heartrate', 'average_speed', 'max_speed'],
  aesthetic: ['distance', 'moving_time'],
  detailed: ['distance', 'moving_time', 'average_speed'],
  achievement: ['distance', 'moving_time'],
  weight: ['moving_time'],
  hiit: ['moving_time', 'calories'],
  hiit2: ['moving_time', 'calories'],
};

export function getAvailableLayouts(
  type: 'activity' | 'period' = 'activity',
  activity?: Activity
): LayoutType[] {
  if (type === 'period') {
    return ['period-minimal', 'period-stats', 'period-social'];
  }

  if (!activity) return [];

  const availableLayouts: LayoutType[] = [];

  Object.entries(LAYOUT_REQUIREMENTS).forEach(([layout, requirements]) => {
    // Special case for weight layout - only show for WeightTraining activities
    if (layout === 'weight' && activity.type !== 'WeightTraining') {
      return;
    }

    const hasAllRequirements = requirements.every((requirement: string) => {
      if (requirement === 'map') {
        if (activity.root === 'strava') {
          const stravaActivity = activity as StravaActivity;
          return (
            stravaActivity.map &&
            (!!stravaActivity.map.coordinates?.length || stravaActivity.map.summary_polyline)
          );
        }
        if (activity.root === 'apple-health') {
          const appleActivity = activity as AppleHealthActivity;
          return appleActivity.map && !!appleActivity.map.coordinates?.length;
        }
        return false;
      }
      return !!activity[requirement as keyof Activity];
    });

    if (hasAllRequirements) {
      availableLayouts.push(layout as LayoutType);
    }
  });

  return availableLayouts;
}
