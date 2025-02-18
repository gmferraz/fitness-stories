import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import {
  useLayoutEditionStore,
  getFontColor,
  getBackgroundColor,
  DEFAULT_LAYOUT_STYLES,
} from '../utils/use-layout-edition-store';
import { formatTime } from '~/utils/formatters';
import { Activity } from '~/features/home/types/activity';

interface Hiit2LayoutProps {
  activity: Activity;
  showBackground?: boolean;
}

export function Hiit2Layout({ activity, showBackground = true }: Hiit2LayoutProps) {
  const { styles } = useLayoutEditionStore();
  const style = styles.hiit2.isEdited ? styles.hiit2 : DEFAULT_LAYOUT_STYLES.hiit2;
  const textColor = getFontColor(style.fontColor);
  const bgColor = getBackgroundColor(style.backgroundColor);
  const hasHeartRate = !!activity.average_heartrate;
  const hasMaxHeartRate = !!activity.max_heartrate;

  const commonTextStyles = {
    fontFamily: style.fontFamily,
    color: textColor,
  };

  const labelStyles = {
    ...commonTextStyles,
    fontSize: style.labelSize,
    lineHeight: style.labelSize * 1.2,
  };

  const bodyStyles = {
    ...commonTextStyles,
    fontSize: style.bodySize,
    lineHeight: style.bodySize * 1.2,
  };

  return (
    <View
      className="self-center overflow-hidden rounded-2xl p-4"
      style={{
        width: 300,
        backgroundColor: showBackground ? bgColor : 'transparent',
      }}>
      {hasHeartRate ? (
        // Layout with heart rate: 2x2 grid
        <View>
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text style={labelStyles} className="mb-1">
                Duration
              </Text>
              <Text style={bodyStyles} className="font-bold">
                {formatTime(activity.moving_time)}
              </Text>
            </View>

            <View className="flex-1">
              <Text style={labelStyles} className="mb-1">
                Calories
              </Text>
              <Text style={bodyStyles} className="font-bold">
                {activity.calories}
              </Text>
            </View>
          </View>

          {hasHeartRate && (
            <View className="mt-4 flex-row justify-between">
              <View className="flex-1">
                <Text style={labelStyles} className="mb-1">
                  Heart Rate
                </Text>
                <Text style={bodyStyles} className="font-bold">
                  {activity.average_heartrate} bpm
                </Text>
              </View>

              {hasMaxHeartRate && (
                <View className="flex-1">
                  <Text style={labelStyles} className="mb-1">
                    Max Heart Rate
                  </Text>
                  <Text style={bodyStyles} className="font-bold">
                    {activity.max_heartrate} bpm
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      ) : (
        // Layout without heart rate: single row with consistent gaps
        <View className="flex-row justify-between">
          <View className="w-1/3">
            <Text style={labelStyles} className="mb-1">
              Duration
            </Text>
            <Text style={bodyStyles} className="font-bold">
              {formatTime(activity.moving_time)}
            </Text>
          </View>

          <View className="w-1/3">
            <Text style={labelStyles} className="mb-1 self-center">
              Calories
            </Text>
            <Text style={bodyStyles} className="self-center font-bold">
              {activity.calories}
            </Text>
          </View>

          {hasHeartRate && (
            <View className="w-1/3">
              <Text style={labelStyles} className="mb-1 self-end">
                Heart Rate
              </Text>
              <Text style={bodyStyles} className="self-end font-bold">
                {activity.average_heartrate} bpm
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
