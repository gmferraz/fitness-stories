import AppleHealthKit, { HealthKitPermissions, HealthUnit } from 'react-native-health';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { AppleHealthActivity, SportType } from '../features/home/types/activity';
import { APPLE_HEALTH_MOCK_WORKOUTS } from './mocks/apple-health-workouts';
import { useAppleHealthStore } from '../stores/use-apple-health-store';
import { translateSportType } from '~/features/home/utils/translate-sport-type';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react-native';
import { usePostHog } from 'posthog-react-native';

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
  const posthog = usePostHog();

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

  // Function to analyze and log discrepancies between Apple Health data and our processed data
  const analyzeAndLogDiscrepancies = (workout: any, enrichedWorkout: AppleHealthActivity) => {
    if (!posthog) return;

    try {
      // Convert distance from miles to meters (1 mile = 1609.344 meters)
      const originalDistance = workout.distance * 1609.344; // Convert miles to meters
      const processedDistance = enrichedWorkout.distance;

      const originalDuration = workout.duration; // Original duration in seconds
      const processedDuration = enrichedWorkout.moving_time; // Our processed duration

      const originalCalories = parseInt(workout.calories ?? '0', 10);
      const processedCalories = enrichedWorkout.calories || 0; // Ensure it's not undefined

      // Calculate percentage differences
      const distanceDiffPercent =
        originalDistance > 0
          ? Math.abs(((processedDistance - originalDistance) / originalDistance) * 100)
          : 0;

      const durationDiffPercent =
        originalDuration > 0
          ? Math.abs(((processedDuration - originalDuration) / originalDuration) * 100)
          : 0;

      const caloriesDiffPercent =
        originalCalories > 0
          ? Math.abs(((processedCalories - originalCalories) / originalCalories) * 100)
          : 0;

      // Determine if there are significant discrepancies (more than 1%)
      const hasDistanceDiscrepancy = distanceDiffPercent > 1;
      const hasDurationDiscrepancy = durationDiffPercent > 1;
      const hasCaloriesDiscrepancy = caloriesDiffPercent > 1;

      // Common properties for all events
      const commonProperties = {
        workout_id: workout.id,
        workout_type: workout.activityId,
        workout_name: enrichedWorkout.name,
        workout_source: workout.sourceName,
        workout_source_id: workout.sourceId,
        workout_device: workout.device,
        timestamp: new Date().toISOString(),
        device_model: Platform.OS === 'ios' ? 'iOS' : 'Android',
        app_version:
          Platform.OS === 'ios'
            ? process.env.EXPO_PUBLIC_IOS_APP_VERSION
            : process.env.EXPO_PUBLIC_ANDROID_APP_VERSION,
      };

      // Log distance discrepancy if significant
      if (hasDistanceDiscrepancy) {
        posthog.capture('apple_health_distance_discrepancy', {
          ...commonProperties,
          original_distance_meters: originalDistance,
          processed_distance_meters: processedDistance,
          distance_diff_percent: distanceDiffPercent.toFixed(2),
          distance_diff_meters: Math.abs(processedDistance - originalDistance).toFixed(2),
          distance_unit: workout.distanceUnit,
          total_distance: workout.totalDistance,
          total_distance_unit: workout.totalDistanceUnit,
          // Pace calculation (min/km)
          original_pace:
            originalDistance > 0
              ? (originalDuration / 60 / (originalDistance / 1000)).toFixed(2)
              : 0,
          processed_pace:
            processedDistance > 0
              ? (processedDuration / 60 / (processedDistance / 1000)).toFixed(2)
              : 0,
          raw_metadata: workout.metadata ? JSON.stringify(workout.metadata) : undefined,
        });
      }

      // Log duration discrepancy if significant
      if (hasDurationDiscrepancy) {
        posthog.capture('apple_health_duration_discrepancy', {
          ...commonProperties,
          original_duration_seconds: originalDuration,
          processed_duration_seconds: processedDuration,
          duration_diff_percent: durationDiffPercent.toFixed(2),
          duration_diff_seconds: Math.abs(processedDuration - originalDuration).toFixed(2),
          raw_metadata: workout.metadata ? JSON.stringify(workout.metadata) : undefined,
        });
      }

      // Log calories discrepancy if significant
      if (hasCaloriesDiscrepancy) {
        posthog.capture('apple_health_calories_discrepancy', {
          ...commonProperties,
          original_calories: originalCalories,
          processed_calories: processedCalories,
          calories_diff_percent: caloriesDiffPercent.toFixed(2),
          calories_diff: Math.abs(processedCalories - originalCalories),
          raw_metadata: workout.metadata ? JSON.stringify(workout.metadata) : undefined,
        });
      }
    } catch (error) {
      console.error('Error analyzing workout discrepancies:', error);
      Sentry.captureException(error, {
        tags: { action: 'apple_health_discrepancy_analysis' },
      });
    }
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
      message: 'Fetching Apple Health workouts for last 90 days',
      level: 'info',
    });

    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
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

            // Convert distance from miles to meters (1 mile = 1609.344 meters)
            const distanceInMeters = workout.distance * 1609.344;

            // Log the distance conversion to console in dev mode
            if (isDev) {
              console.log('Apple Health Distance Conversion:', {
                workout_id: workout.id,
                raw_distance_miles: workout.distance,
                converted_distance_meters: distanceInMeters,
              });
            }

            const avgSpeed = distanceInMeters
              ? distanceInMeters / 1000 / (duration / 3600)
              : undefined;

            const enrichedWorkout: AppleHealthActivity = {
              id: `apple-${workout.id}`,
              name:
                translateSportType(t, mapWorkoutTypeToSportType(workout.activityId)) ||
                workout.activityName,
              type: mapWorkoutTypeToSportType(workout.activityId) as any,
              distance: distanceInMeters,
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

            // Log workout data to PostHog for debugging
            posthog?.capture('apple_health_workout_imported', {
              workout_id: workout.id,
              workout_type: workout.activityId,
              workout_name: enrichedWorkout.name,
              workout_source: workout.sourceName,
              workout_source_id: workout.sourceId,
              workout_device: workout.device,
              workout_start: workout.start,
              workout_end: workout.end,
              workout_duration_seconds: duration,
              workout_raw_distance_miles: workout.distance,
              workout_distance_meters: distanceInMeters,
              workout_calories: parseInt(workout.calories ?? '0', 10),
              workout_avg_speed: avgSpeed,
              workout_avg_heartrate: avgHeartRate,
              workout_max_heartrate: maxHeartRate,
              workout_avg_cadence: workout.metadata?.HKAverageCadence,
              workout_has_route: !!routeData?.data,
              // Include the raw data for debugging
              raw_workout: JSON.stringify(workout),
            });

            // Analyze and log any discrepancies
            analyzeAndLogDiscrepancies(workout, enrichedWorkout);

            return enrichedWorkout;
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
