import { i18n } from 'i18next';

export const formatWeekDateRange = (dateRange: string, i18n: i18n) => {
  // Expected input format: "01/02 - 08/02"
  const parts = dateRange.split(' - ');
  if (parts.length !== 2) return dateRange;

  try {
    const [startDay, startMonth] = parts[0].split('/');
    const [endDay, endMonth] = parts[1].split('/');

    // Create Date objects for proper month name formatting
    // Note: Using current year since it's not in the input
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, parseInt(startMonth, 10) - 1, parseInt(startDay, 10));
    const endDate = new Date(currentYear, parseInt(endMonth, 10) - 1, parseInt(endDay, 10));

    // Format the dates with full month names based on current locale
    const startFormatted = `${startDay} ${startDate.toLocaleString(i18n.language, { month: 'long' })}`;
    const endFormatted = `${endDay} ${endDate.toLocaleString(i18n.language, { month: 'long' })}`;

    return `${startFormatted} - ${endFormatted}`;
  } catch (error) {
    // If any parsing error occurs, return the original string
    console.error('Error formatting date range:', error);
    return dateRange;
  }
};
