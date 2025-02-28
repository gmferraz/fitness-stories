import React from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Coordinate = { latitude: number; longitude: number };

// Helper: compute the bounding box for the coordinates.
const getBoundingBox = (coordinates: Coordinate[]) => {
  const lats = coordinates.map((c) => c.latitude);
  const lons = coordinates.map((c) => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  return { minLat, maxLat, minLon, maxLon };
};

// Improved transformation that handles large maps better
const transformCoordinates = (
  coordinates: { latitude: number; longitude: number }[],
  initialScale: number,
  margin: number,
  maxWidth: number,
  maxHeight: number
) => {
  if (coordinates.length === 0) {
    return { points: [], canvasWidth: maxWidth, canvasHeight: maxHeight };
  }

  const { minLat, maxLat, minLon, maxLon } = getBoundingBox(coordinates);

  // Calculate the latitude and longitude ranges
  const latRange = maxLat - minLat;
  const lonRange = maxLon - minLon;

  // If the range is too small, add a minimum to prevent division by zero
  const effectiveLatRange = Math.max(latRange, 0.0001);
  const effectiveLonRange = Math.max(lonRange, 0.0001);

  // Initial dimensions based on the provided scale
  let canvasWidth = effectiveLonRange * initialScale + margin * 2;
  let canvasHeight = effectiveLatRange * initialScale + margin * 2;

  // Calculate scale factors to fit within max dimensions
  const widthScaleFactor = maxWidth / canvasWidth;
  const heightScaleFactor = maxHeight / canvasHeight;

  // Use the smaller scale factor to ensure both dimensions fit
  const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor, 1);

  // Apply the scale factor
  canvasWidth = Math.min(canvasWidth * scaleFactor, maxWidth);
  canvasHeight = Math.min(canvasHeight * scaleFactor, maxHeight);

  // Calculate the final scale to use for coordinate transformation
  const finalScale = (canvasWidth - margin * 2) / effectiveLonRange;

  // Transform coordinates to canvas space
  const transformedPoints = coordinates.map(({ latitude, longitude }) => {
    const x = (longitude - minLon) * finalScale + margin;
    const y = canvasHeight - ((latitude - minLat) * finalScale + margin);
    return { x, y };
  });

  return { points: transformedPoints, canvasWidth, canvasHeight };
};

// Build a Skia path from the canvas points.
const createPath = (points: { x: number; y: number }[]) => {
  const path = Skia.Path.Make();
  if (points.length === 0) return path;
  path.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    path.lineTo(points[i].x, points[i].y);
  }
  return path;
};

export const SkiaMap = ({
  coordinates,
  color = 'white',
  strokeWidth = 5,
  maxWidth = screenWidth - 40, // Default to screen width minus some margin
  maxHeight = screenHeight * 0.7, // Default to 70% of screen height
}: {
  coordinates: { latitude: number; longitude: number }[];
  color?: string;
  strokeWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
}) => {
  // Base scale factor - will be adjusted based on map size
  const baseScale = 24000; // pixels per degree

  // Define a margin (in pixels) around the path.
  const margin = 20;

  // Transform the coordinates into canvas space, respecting both max width and height
  const {
    points: canvasPoints,
    canvasWidth,
    canvasHeight,
  } = transformCoordinates(coordinates, baseScale, margin, maxWidth, maxHeight);

  // Build the Skia path from these points.
  const skPath = createPath(canvasPoints);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
        <Path path={skPath} color={color} style="stroke" strokeWidth={strokeWidth} />
      </Canvas>
    </View>
  );
};
