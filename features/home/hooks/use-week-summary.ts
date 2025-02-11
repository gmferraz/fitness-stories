import { useWeeks } from './use-weeks';

export const useWeekSummary = () => {
  const { weeks } = useWeeks();
  return weeks[0]; // Return the most recent week
};
