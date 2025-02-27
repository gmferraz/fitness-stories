export const applyOpacityToColor = (color: string, opacity: number) => {
  // If opacity is 100 or undefined, return the original color
  if (opacity === 100 || opacity === undefined) return color;

  // Convert opacity percentage to hex
  const hexOpacity = Math.round((opacity / 100) * 255)
    .toString(16)
    .padStart(2, '0');

  // If color is already in rgba format, return as is
  if (color.startsWith('rgba')) return color;

  // If color is rgb format, convert to rgba
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity / 100})`);
  }

  // For hex colors, append the opacity
  return `${color}${hexOpacity}`;
};
