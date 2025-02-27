import React from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

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

// Updated transformation that uses the bounding box to compute canvas dimensions.
// The canvas size will be limited to the path (plus a margin), and the drawing is zoomed out.
const transformCoordinates = (
  coordinates: { latitude: number; longitude: number }[],
  scale: number,
  margin: number,
  maxWidth: number
) => {
  const { minLat, maxLat, minLon, maxLon } = getBoundingBox(coordinates);

  // Compute canvas dimensions based on the coordinate range, chosen scale, and margin.
  let canvasWidth = (maxLon - minLon) * scale + margin * 2;
  let canvasHeight = (maxLat - minLat) * scale + margin * 2;

  // Calculate aspect ratio of the path
  const aspectRatio = canvasHeight / canvasWidth;

  // If the canvas width exceeds the maximum width, scale it down
  if (canvasWidth > maxWidth) {
    canvasWidth = maxWidth;
    canvasHeight = canvasWidth * aspectRatio;
    // Recalculate scale to fit the new dimensions
    scale = (canvasWidth - margin * 2) / (maxLon - minLon);
  }

  // Transform each coordinate to canvas space.
  // Note: we flip the y-axis so that higher latitudes appear toward the top.
  const transformedPoints = coordinates.map(({ latitude, longitude }) => {
    const x = (longitude - minLon) * scale + margin;
    const y = canvasHeight - ((latitude - minLat) * scale + margin);
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
}: {
  coordinates: { latitude: number; longitude: number }[];
  color?: string;
  strokeWidth?: number;
  maxWidth?: number;
}) => {
  // Define a scale factor.
  // For example, you might choose a scale of 700 pixels per degree (adjustable) to "zoom out".
  const scale = 24000; // pixels per degree (adjust as needed)
  const zoomFactor = 1; // Multiply to "zoom out" further if desired.
  const effectiveScale = scale * zoomFactor;

  // Define a margin (in pixels) around the path.
  const margin = 20;

  // Transform the coordinates into canvas space, respecting the maximum width.
  const {
    points: canvasPoints,
    canvasWidth,
    canvasHeight,
  } = transformCoordinates(coordinates, effectiveScale, margin, maxWidth);

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
