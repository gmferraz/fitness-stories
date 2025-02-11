import { Activity } from './activity';

export interface WeekSummary {
  totalDistance: number;
  totalDuration: number;
  totalActivities: number;
  totalElevation: number;
  weekRange: string;
  avgPace: number;
  totalCalories: number;
  startDate: Date;
  endDate: Date;
  activities?: Activity[];
}
