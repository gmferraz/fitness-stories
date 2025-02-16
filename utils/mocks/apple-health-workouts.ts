import { AppleHealthActivity } from '~/features/home/types/activity';

export const APPLE_HEALTH_MOCK_WORKOUTS: AppleHealthActivity[] = [
  {
    id: '1',
    name: 'Morning Run',
    type: 'Run',
    distance: 5200, // 5.2km
    moving_time: 1800, // 30 minutes
    elapsed_time: 1800,
    total_elevation_gain: 45,
    start_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // yesterday
    start_date_local: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    root: 'apple-health',
    source_name: 'Apple Watch',
    source_id: 'com.apple.health',
    device: 'Apple Watch Series 7',
    activity_id: '1',
    activity_type: 8, // Running
    average_speed: 10.4, // km/h
    max_speed: 12.5,
    average_heartrate: 155,
    max_heartrate: 175,
    average_cadence: 165,
    max_cadence: 180,
    calories: 450,
    total_energy_burned: 450,
    elev_high: 120,
    elev_low: 75,
    map: {
      id: '1_route',
      coordinates: [
        {
          latitude: -23.5505,
          longitude: -46.6333,
          altitude: 750,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          speed: 10.4,
        },
        {
          latitude: -23.5515,
          longitude: -46.6343,
          altitude: 755,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 300000).toISOString(),
          speed: 11.2,
        },
        {
          latitude: -23.5525,
          longitude: -46.6353,
          altitude: 760,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 600000).toISOString(),
          speed: 12.5,
        },
      ],
    },
  },
  {
    id: '2',
    name: 'Evening Cycling',
    type: 'Ride',
    distance: 15000, // 15km
    moving_time: 2700, // 45 minutes
    elapsed_time: 2700,
    total_elevation_gain: 120,
    start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    start_date_local: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    root: 'apple-health',
    source_name: 'Apple Watch',
    source_id: 'com.apple.health',
    device: 'Apple Watch Series 7',
    activity_id: '2',
    activity_type: 7, // Cycling
    average_speed: 20,
    max_speed: 35,
    average_heartrate: 145,
    max_heartrate: 165,
    average_cadence: 85,
    max_cadence: 95,
    calories: 600,
    total_energy_burned: 600,
    elev_high: 150,
    elev_low: 30,
    map: {
      id: '2_route',
      coordinates: [
        {
          latitude: -23.5505,
          longitude: -46.6333,
          altitude: 750,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          speed: 20,
        },
        {
          latitude: -23.5525,
          longitude: -46.6353,
          altitude: 770,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 900000).toISOString(),
          speed: 25,
        },
        {
          latitude: -23.5545,
          longitude: -46.6373,
          altitude: 790,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1800000).toISOString(),
          speed: 35,
        },
      ],
    },
  },
  {
    id: '3',
    name: 'HIIT Workout',
    type: 'HighIntensityIntervalTraining',
    distance: 0,
    moving_time: 1200, // 20 minutes
    elapsed_time: 1200,
    total_elevation_gain: 0,
    start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    start_date_local: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    root: 'apple-health',
    source_name: 'Apple Fitness+',
    source_id: 'com.apple.fitness',
    device: 'iPhone 13',
    activity_id: '3',
    activity_type: 63, // HIIT
    average_heartrate: 165,
    max_heartrate: 185,
    calories: 280,
    total_energy_burned: 280,
  },
  {
    id: '4',
    name: 'Pool Swimming',
    type: 'Swim',
    distance: 1500, // 1.5km
    moving_time: 1800, // 30 minutes
    elapsed_time: 1800,
    total_elevation_gain: 0,
    start_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    start_date_local: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    root: 'apple-health',
    source_name: 'Apple Watch',
    source_id: 'com.apple.health',
    device: 'Apple Watch Series 7',
    activity_id: '4',
    activity_type: 11, // Swimming
    average_speed: 3,
    max_speed: 3.5,
    average_heartrate: 135,
    max_heartrate: 155,
    calories: 400,
    total_energy_burned: 400,
  },
  {
    id: '5',
    name: 'Strength Training',
    type: 'WeightTraining',
    distance: 0,
    moving_time: 3600, // 60 minutes
    elapsed_time: 3600,
    total_elevation_gain: 0,
    start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    start_date_local: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    root: 'apple-health',
    source_name: 'Apple Watch',
    source_id: 'com.apple.health',
    device: 'Apple Watch Series 7',
    activity_id: '5',
    activity_type: 13, // Strength Training
    average_heartrate: 125,
    max_heartrate: 145,
    calories: 320,
    total_energy_burned: 320,
  },
];
