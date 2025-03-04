import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { AppleHealthActivity, SportType } from '../features/home/types/activity';
import { APPLE_HEALTH_MOCK_WORKOUTS } from './mocks/apple-health-workouts';
import { useAppleHealthStore } from '../stores/use-apple-health-store';
import { translateSportType } from '~/features/home/utils/translate-sport-type';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react-native';

const workoutPermissions = [
  AppleHealthKit.Constants.Permissions.Workout,
  AppleHealthKit.Constants.Permissions.HeartRate,
  AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
  AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
  // Add these additional permissions that might be needed
  AppleHealthKit.Constants.Permissions.Steps,
  AppleHealthKit.Constants.Permissions.RunningSpeed,
  AppleHealthKit.Constants.Permissions.RunningPower,
  AppleHealthKit.Constants.Permissions.RunningStrideLength,
  AppleHealthKit.Constants.Permissions.DistanceCycling,
  AppleHealthKit.Constants.Permissions.DistanceSwimming,
  // Additional workout-related permissions
  AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
  AppleHealthKit.Constants.Permissions.AppleExerciseTime,
  AppleHealthKit.Constants.Permissions.Vo2Max,
  AppleHealthKit.Constants.Permissions.FlightsClimbed,
  AppleHealthKit.Constants.Permissions.BodyTemperature,
  AppleHealthKit.Constants.Permissions.OxygenSaturation,
  AppleHealthKit.Constants.Permissions.RespiratoryRate,
  AppleHealthKit.Constants.Permissions.BodyFatPercentage,
  AppleHealthKit.Constants.Permissions.WalkingHeartRateAverage,
  AppleHealthKit.Constants.Permissions.RestingHeartRate,
  AppleHealthKit.Constants.Permissions.HeartRateVariability,
];

const isDev = __DEV__;

export const useAppleHealth = () => {
  const { isAvailable, isAuthenticated, setIsAvailable, setIsAuthenticated } =
    useAppleHealthStore();

  const { t } = useTranslation();

  useEffect(() => {
    checkAvailabilityAndPermissions();
  }, []);

  const checkAvailabilityAndPermissions = async () => {
    if (Platform.OS !== 'ios') {
      setIsAvailable(false);
      return;
    }

    // Check if HealthKit is available on this device
    AppleHealthKit.isAvailable((err: any, available: boolean) => {
      if (err) {
        console.error('error checking Healthkit availability: ', err);
        Sentry.captureException(err, {
          tags: { action: 'apple_health_availability_check' },
        });
        setIsAvailable(false);
        return;
      }

      setIsAvailable(available);
      Sentry.setTag('apple_health_available', available);
    });
    Sentry.addBreadcrumb({
      category: 'health',
      message: 'Checking Apple Health availability',
      level: 'info',
    });

    if (isAuthenticated) {
      requestPermissions();
    }
  };

  const requestPermissions = () => {
    Sentry.addBreadcrumb({
      category: 'health',
      message: 'Requesting Apple Health permissions',
      level: 'info',
    });

    // Make sure we're requesting all the necessary permissions
    const permissions: HealthKitPermissions = {
      permissions: {
        read: workoutPermissions,
        write: [],
      },
    };

    // Request permissions from HealthKit
    AppleHealthKit.initHealthKit(permissions, (error: string, results: any) => {
      if (error) {
        console.error('Error initializing HealthKit:', error);
        Sentry.captureMessage('Error initializing HealthKit', {
          level: 'error',
          tags: { action: 'apple_health_init' },
          extra: { error },
        });
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      Sentry.setTag('apple_health_authenticated', true);
      Sentry.addBreadcrumb({
        category: 'health',
        message: 'Apple Health initialized successfully',
        level: 'info',
      });

      // Check authorization status for specific types
      checkAuthorizationStatus();
    });
  };

  const checkAuthorizationStatus = () => {
    Sentry.addBreadcrumb({
      category: 'health',
      message: 'Checking Apple Health authorization status',
      level: 'info',
    });

    // Check authorization status for Workout type specifically
    AppleHealthKit.getAuthStatus(
      { permissions: { read: workoutPermissions, write: [] } },
      (err: string, results: any) => {
        if (err) {
          console.error('Error checking authorization status:', err);
          Sentry.captureException(err, {
            tags: { action: 'apple_health_auth_status' },
          });
          return;
        }

        Sentry.addBreadcrumb({
          category: 'health',
          message: 'Apple Health authorization status checked',
          level: 'info',
          data: { results: JSON.stringify(results) },
        });
      }
    );
  };

  const mapWorkoutTypeToSportType = (type: number): SportType => {
    const mapping: Record<number, SportType> = {
      4: 'Badminton', // Badminton
      9: 'RockClimbing', // Climbing => RockClimbing
      11: 'Crossfit', // Cross Training => Crossfit
      13: 'Ride', // Cycling => Ride
      16: 'Elliptical', // Elliptical
      21: 'Golf', // Golf
      24: 'Hike', // Hiking => Hike
      34: 'Racquetball', // Racquetball
      35: 'Rowing', // Rowing
      37: 'Run', // Running => Run
      38: 'Sail', // Sailing => Sail
      39: 'InlineSkate', // Skating Sports => InlineSkate
      41: 'Soccer', // Soccer
      43: 'Squash', // Squash
      44: 'StairStepper', // Stair Climbing => StairStepper
      45: 'Surfing', // Surfing Sports => Surfing
      46: 'Swim', // Swimming => Swim
      47: 'TableTennis', // Table Tennis => TableTennis
      48: 'Tennis', // Tennis => Tennis
      50: 'WeightTraining', // Traditional Strength Training => WeightTraining
      52: 'Walk', // Walking => Walk
      57: 'Yoga', // Yoga
      60: 'NordicSki', // Cross Country Skiing => NordicSki
      61: 'AlpineSki', // Downhill Skiing => AlpineSki
      63: 'HighIntensityIntervalTraining', // High Intensity Interval Training
      66: 'Pilates', // Pilates
      67: 'Snowboard', // Snowboarding => Snowboard
      68: 'StairStepper', // Stairs => StairStepper
      69: 'StairStepper', // Step Training => StairStepper
      70: 'Wheelchair', // Wheelchair Walk Pace => Wheelchair
      71: 'Wheelchair', // Wheelchair Run Pace => Wheelchair
      74: 'Handcycle', // Hand Cycling => Handcycle
      79: 'Pickleball', // Pickleball
      3000: 'Workout', // Other => Workout
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
      Sentry.addBreadcrumb({
        category: 'health',
        message: 'Using mock Apple Health workouts in dev mode',
        level: 'info',
      });
      return APPLE_HEALTH_MOCK_WORKOUTS;
    }

    if (!isAvailable || Platform.OS !== 'ios') {
      const errorMsg = 'HealthKit is not available or not on iOS';
      console.log(errorMsg);
      Sentry.captureMessage(errorMsg, {
        level: 'warning',
        tags: { action: 'apple_health_fetch_workouts' },
        extra: { isAvailable, platform: Platform.OS },
      });
      return [];
    }

    // If not authenticated, request permissions first
    if (!isAuthenticated) {
      Sentry.captureMessage('Apple Health not authenticated, requesting permissions', {
        level: 'info',
        tags: { action: 'apple_health_fetch_workouts' },
      });
      return new Promise((resolve) => {
        requestPermissions();
        // Return empty array for now, user will need to retry after granting permissions
        resolve([]);
      });
    }

    Sentry.addBreadcrumb({
      category: 'health',
      message: 'Fetching Apple Health workouts for last 150 days',
      level: 'info',
    });

    const startDate = new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = new Date().toISOString();

    try {
      const workouts = await new Promise<any>((resolve, reject) => {
        AppleHealthKit.getAnchoredWorkouts(
          {
            startDate,
            endDate,
          },
          (err: any, results: any) => {
            if (err) {
              console.error('Error fetching workouts:', err);
              Sentry.captureException(err, {
                tags: { action: 'apple_health_fetch_workouts' },
                extra: { startDate, endDate },
              });
              reject(err);
              return;
            }
            resolve(results);
          }
        );
      });
      // If no workouts were found, return empty array
      if (!workouts?.data || workouts.data.length === 0) {
        Sentry.addBreadcrumb({
          category: 'health',
          message: 'No Apple Health workouts found',
          level: 'info',
        });
        return [];
      }

      Sentry.addBreadcrumb({
        category: 'health',
        message: `Found ${workouts.data.length} Apple Health workouts`,
        level: 'info',
      });

      // Sort by date descending
      const sortedWorkouts = workouts.data.sort(
        (a: any, b: any) => new Date(b.start).getTime() - new Date(a.start).getTime()
      );

      const enrichedWorkouts: AppleHealthActivity[] = await Promise.all(
        sortedWorkouts.map(async (workout: any) => {
          try {
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
                      Sentry.captureException(err, {
                        tags: {
                          action: 'apple_health_heart_rate',
                          workout_id: workout.id || 'unknown',
                        },
                      });
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
              ? Math.round(heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length)
              : undefined;
            const maxHeartRate = heartRates.length
              ? Math.round(Math.max(...heartRates))
              : undefined;

            const duration =
              (new Date(workout.end).getTime() - new Date(workout.start).getTime()) / 1000;
            const distance = workout.distance * 1000 || 0;
            const avgSpeed = distance ? distance / 1000 / (duration / 3600) : undefined;

            return {
              id: `apple-${workout.id}`,
              name:
                translateSportType(t, mapWorkoutTypeToSportType(workout.activityId)) ||
                workout.activityName,
              type: mapWorkoutTypeToSportType(workout.activityId) as any,
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
              activity_type: workout.activityId,
              average_heartrate: avgHeartRate,
              max_heartrate: maxHeartRate,
              calories: parseInt(workout.calories ?? '0', 10),
              total_energy_burned: parseInt(workout.calories ?? '0', 10),
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
          } catch (error) {
            Sentry.captureException(error, {
              tags: {
                action: 'apple_health_enrich_workout',
                workout_id: workout.id || 'unknown',
              },
            });
            // Return a basic workout without the enriched data
            return {
              id: `apple-${workout.id}`,
              name: workout.activityName,
              type: mapWorkoutTypeToSportType(workout.activityId) as any,
              start_date: workout.start,
              start_date_local: workout.start,
              root: 'apple-health',
              activity_id: workout.id || String(workout.start),
            } as AppleHealthActivity;
          }
        })
      );

      Sentry.addBreadcrumb({
        category: 'health',
        message: `Successfully processed ${enrichedWorkouts.length} Apple Health workouts`,
        level: 'info',
      });

      return enrichedWorkouts;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      Sentry.captureException(error, {
        tags: { action: 'apple_health_fetch_workouts' },
      });
      return [];
    }
  };

  const handleDisconnect = () => {
    Sentry.addBreadcrumb({
      category: 'health',
      message: 'User disconnecting from Apple Health',
      level: 'info',
    });
    setIsAuthenticated(false);
    Sentry.setTag('apple_health_authenticated', false);
  };

  return {
    isAvailable,
    isAuthenticated,
    initializeHealthKit: requestPermissions,
    listLast150DaysWorkouts,
    handleDisconnect,
  };
};
