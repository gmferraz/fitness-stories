export const formatDistance = (meters: number) => {
  const kilometers = meters / 1000;
  return `${kilometers.toFixed(2)} km`;
};

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const formatPace = (meters?: number, seconds?: number) => {
  if (!meters || !seconds) {
    return `0'0"`;
  }
  const minutesPerKm = seconds / 60 / (meters / 1000);
  const minutes = Math.floor(minutesPerKm);
  const secondsDecimal = (minutesPerKm - minutes) * 60;
  return `${minutes}'${secondsDecimal.toFixed(0)}"`;
};

export const formatHeartRate = (bpm?: number) => {
  return bpm ? `${Math.round(bpm)} bpm` : '-';
};

export const formatWatts = (watts?: number) => {
  return watts ? `${Math.round(watts)}w` : '-';
};

export const formatCadence = (cadence?: number) => {
  return cadence ? `${Math.round(cadence)} spm` : '-';
};
