export type SportType =
  | 'AlpineSki'
  | 'BackcountrySki'
  | 'Badminton'
  | 'Canoeing'
  | 'Crossfit'
  | 'EBikeRide'
  | 'Elliptical'
  | 'EMountainBikeRide'
  | 'Golf'
  | 'GravelRide'
  | 'Handcycle'
  | 'HighIntensityIntervalTraining'
  | 'Hike'
  | 'IceSkate'
  | 'InlineSkate'
  | 'Kayaking'
  | 'Kitesurf'
  | 'MountainBikeRide'
  | 'NordicSki'
  | 'Pickleball'
  | 'Pilates'
  | 'Racquetball'
  | 'Ride'
  | 'RockClimbing'
  | 'RollerSki'
  | 'Rowing'
  | 'Run'
  | 'Sail'
  | 'Skateboard'
  | 'Snowboard'
  | 'Snowshoe'
  | 'Soccer'
  | 'Squash'
  | 'StairStepper'
  | 'StandUpPaddling'
  | 'Surfing'
  | 'Swim'
  | 'TableTennis'
  | 'Tennis'
  | 'TrailRun'
  | 'Velomobile'
  | 'VirtualRide'
  | 'VirtualRow'
  | 'VirtualRun'
  | 'Walk'
  | 'WeightTraining'
  | 'Wheelchair'
  | 'Windsurf'
  | 'Workout'
  | 'Yoga';

export type ActivityRoot = 'strava' | 'apple-health' | 'garmin';

export type BaseActivity = {
  id: string;
  name: string;
  type: SportType;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  root: ActivityRoot;
  calories?: number;
  average_speed?: number;
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  max_cadence?: number;
};

export type RouteCoordinate = {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp?: string;
  speed?: number;
};

export type AppleHealthActivity = BaseActivity & {
  root: 'apple-health';
  source_name: string;
  source_id: string;
  device?: string;
  activity_id: string;
  activity_type: number;
  average_speed?: number;
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  max_cadence?: number;
  total_energy_burned?: number;
  elev_high?: number;
  elev_low?: number;
  map?: {
    id: string;
    coordinates?: RouteCoordinate[];
  };
};

export type StravaActivity = {
  root: 'strava';
  id: string;
  name: string;
  type: SportType;
  sport_type: string; // More specific than type
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  elev_high: number;
  elev_low: number;
  start_date: string;
  start_date_local: string;
  average_speed: number;
  max_speed: number;

  // Heart rate data
  average_heartrate?: number; // In BPM
  max_heartrate?: number; // In BPM

  // Power metrics
  average_watts?: number; // Average power output
  max_watts?: number; // Maximum power output
  weighted_average_watts?: number; // Normalized power

  // Cadence
  average_cadence?: number; // Average RPM (for running: steps per minute)
  max_cadence?: number; // Maximum RPM

  calories?: number;

  map?: {
    id: string;
    summary_polyline?: string; // Original encoded polyline
    coordinates?: RouteCoordinate[]; // Decoded coordinates
  };
};

export type Activity =
  | StravaActivity
  | AppleHealthActivity
  | (BaseActivity & {
      root: 'garmin';
      // Add Garmin specific fields here
    });
