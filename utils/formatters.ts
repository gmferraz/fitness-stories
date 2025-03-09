export const formatDistance = (meters: number, showUnit = true) => {
  const kilometers = meters / 1000;
  return `${showUnit ? kilometers.toFixed(2) + ' km' : kilometers.toFixed(2)}`;
};

export const formatDuration = (seconds: number, showSeconds = true) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m${showSeconds && !!remainingSeconds ? ` ${remainingSeconds}s` : ''}`;
};

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export const formatPace = (meters?: number, seconds?: number, showUnit = true) => {
  if (!meters || !seconds) {
    return '0:00';
  }
  const minutesPerKm = seconds / 60 / (meters / 1000);
  const minutes = Math.floor(minutesPerKm);
  const secondsDecimal = Math.round((minutesPerKm - minutes) * 60);
  return `${minutes}:${secondsDecimal.toString().padStart(2, '0')}${showUnit ? ' /km' : ''}`;
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
