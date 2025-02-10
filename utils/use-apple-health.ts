import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { AppleHealthActivity } from '../features/home/types/activity';
import { APPLE_HEALTH_MOCK_WORKOUTS } from './mocks/apple-health-workouts';
import { useAppleHealthStore } from '../stores/use-apple-health-store';

const isDev = __DEV__;

const PERMISSIONS: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Workout,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
    write: [],
  },
};

export const useAppleHealth = () => {
  const { isAvailable, isAuthenticated, setIsAvailable, setIsAuthenticated } =
    useAppleHealthStore();

  useEffect(() => {
    AppleHealthKit.isAvailable((err: any, available: boolean) => {
      if (err) {
        console.error('error initializing Healthkit: ', err);
        return;
      }
      setIsAvailable(available);
    });
    if (isAuthenticated) {
      initializeHealthKit();
    }
  }, []);

  const initializeHealthKit = async () => {
    if (!isAvailable) {
      console.error('HealthKit is not available');
      return;
    }
    try {
      AppleHealthKit.initHealthKit(PERMISSIONS, (error: string, result: any) => {
        if (error) {
          throw new Error(error);
        }
        if (result) {
          setIsAuthenticated(true);
        }
      });
    } catch (error) {
      console.error('Error initializing HealthKit:', error);
      setIsAuthenticated(false);
    }
  };

  const mapWorkoutTypeToSportType = (type: number): string => {
    // Using constants from AppleHealthKit.Constants.Activities
    const mapping: Record<number, string> = {
      [AppleHealthKit.Constants.Activities.Running]: 'Run',
      [AppleHealthKit.Constants.Activities.Cycling]: 'Ride',
      [AppleHealthKit.Constants.Activities.Walking]: 'Walk',
      [AppleHealthKit.Constants.Activities.Swimming]: 'Swim',
      [AppleHealthKit.Constants.Activities.Hiking]: 'Hike',
      [AppleHealthKit.Constants.Activities.Yoga]: 'Yoga',
      [AppleHealthKit.Constants.Activities.FunctionalStrengthTraining]: 'WeightTraining',
      [AppleHealthKit.Constants.Activities.TraditionalStrengthTraining]: 'WeightTraining',
      [AppleHealthKit.Constants.Activities.CrossTraining]: 'Crossfit',
      [AppleHealthKit.Constants.Activities.StairClimbing]: 'StairStepper',
      [AppleHealthKit.Constants.Activities.HighIntensityIntervalTraining]:
        'HighIntensityIntervalTraining',
      [AppleHealthKit.Constants.Activities.Soccer]: 'Soccer',
      [AppleHealthKit.Constants.Activities.Volleyball]: 'Volleyball',
      [AppleHealthKit.Constants.Activities.Elliptical]: 'Elliptical',
      [AppleHealthKit.Constants.Activities.Basketball]: 'Basketball',
      [AppleHealthKit.Constants.Activities.Tennis]: 'Tennis',
      [AppleHealthKit.Constants.Activities.Pilates]: 'Pilates',
    };
    return mapping[type] || 'Workout';
  };

  const getWorkoutRoute = async (workoutId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getWorkoutRouteSamples({ id: workoutId }, (err: string, results: any) => {
        if (err) {
          resolve(undefined); // Don't reject, as some workouts might not have routes
          return;
        }
        resolve(results);
      });
    });
  };

  const listLast150DaysWorkouts = async (): Promise<AppleHealthActivity[]> => {
    if (isDev) {
      return APPLE_HEALTH_MOCK_WORKOUTS;
    }

    if (!isAuthenticated || Platform.OS !== 'ios') {
      return [];
    }

    const startDate = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = new Date().toISOString();

    const workoutTypes = [
      AppleHealthKit.Constants.Observers.Cycling,
      AppleHealthKit.Constants.Observers.Running,
      AppleHealthKit.Constants.Observers.Workout,
    ];

    try {
      // Fetch workouts for each type in parallel
      const allWorkouts = await Promise.all(
        workoutTypes.map(
          (type) =>
            new Promise<any[]>((resolve, reject) => {
              AppleHealthKit.getSamples(
                {
                  startDate,
                  endDate,
                  ascending: false,
                  type,
                },
                (err: string, results: any[]) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  resolve(results || []);
                }
              );
            })
        )
      );

      // Merge all workout arrays and remove duplicates based on id
      const mergedWorkouts = Array.from(
        new Map(
          allWorkouts.flat().map((workout) => [workout.id || workout.start, workout])
        ).values()
      );

      // Sort by date descending
      const sortedWorkouts = mergedWorkouts.sort(
        (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
      );

      const enrichedWorkouts: AppleHealthActivity[] = await Promise.all(
        sortedWorkouts.map(async (workout) => {
          const [heartRateData, routeData] = await Promise.all([
            new Promise<any[]>((resolve, reject) => {
              AppleHealthKit.getHeartRateSamples(
                {
                  startDate: workout.start,
                  endDate: workout.end,
                  ascending: true,
                },
                (err: string, results: any[]) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  resolve(results || []);
                }
              );
            }),
            workout.id ? getWorkoutRoute(workout.id) : Promise.resolve(undefined),
          ]);

          const heartRates = heartRateData.map((hr) => hr.value);
          const avgHeartRate = heartRates.length
            ? heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length
            : undefined;
          const maxHeartRate = heartRates.length ? Math.max(...heartRates) : undefined;

          const duration =
            (new Date(workout.end).getTime() - new Date(workout.start).getTime()) / 1000;
          const distance = workout.totalDistance || 0;
          const avgSpeed = distance ? distance / 1000 / (duration / 3600) : undefined;

          return {
            id: `apple-${workout.id}`,
            name:
              workout.metadata?.HKWorkoutName || mapWorkoutTypeToSportType(workout.activityType),
            type: mapWorkoutTypeToSportType(workout.activityType) as any,
            distance,
            moving_time: duration,
            elapsed_time: duration,
            total_elevation_gain: 0,
            start_date: workout.start,
            start_date_local: workout.start,
            root: 'apple-health',
            source_name: workout.sourceName,
            source_id: workout.sourceId,
            device: workout.device,
            activity_id: workout.id || String(workout.start),
            activity_type: workout.activityType,
            average_heartrate: avgHeartRate,
            max_heartrate: maxHeartRate,
            calories: workout.totalEnergyBurned,
            total_energy_burned: workout.totalEnergyBurned,
            average_speed: avgSpeed,
            max_speed: undefined,
            average_cadence: workout.metadata?.HKAverageCadence,
            max_cadence: undefined,
            elev_high: undefined,
            elev_low: undefined,
            map: routeData?.data
              ? {
                  id: routeData.data.id,
                  coordinates: routeData.data.locations.map((loc: any) => ({
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    altitude: loc.altitude,
                    timestamp: loc.timestamp,
                    speed: loc.speed,
                  })),
                }
              : undefined,
          };
        })
      );

      return enrichedWorkouts;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      return [];
    }
  };

  const handleDisconnect = () => {
    setIsAuthenticated(false);
  };

  return {
    isAvailable,
    isAuthenticated,
    initializeHealthKit,
    listLast150DaysWorkouts,
    handleDisconnect,
  };
};
