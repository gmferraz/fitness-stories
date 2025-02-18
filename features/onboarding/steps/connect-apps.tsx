import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { Text } from '~/components/nativewindui/Text';
import { Icon } from '@roninoss/icons';
import { useStrava } from '~/utils/use-strava';
import { useAppleHealth } from '~/utils/use-apple-health';
import StravaIcon from '~/assets/svg/strava.svg';
import AppleHealthIcon from '~/assets/svg/apple-health.svg';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

interface ConnectAppsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const ConnectAppsStep: React.FC<ConnectAppsStepProps> = ({ onNext, onBack }) => {
  const { colors } = useColorScheme();
  const { isAuthenticated: isStravaConnected, handleLinkStrava } = useStrava();
  const {
    isAuthenticated: isAppleHealthConnected,
    isAvailable: isAppleHealthAvailable,
    initializeHealthKit,
  } = useAppleHealth();

  const [isConnectingStrava, setIsConnectingStrava] = useState(false);
  const [isConnectingAppleHealth, setIsConnectingAppleHealth] = useState(false);

  const handleStravaConnect = async () => {
    setIsConnectingStrava(true);
    await handleLinkStrava();
    setIsConnectingStrava(false);
  };

  const handleAppleHealthConnect = async () => {
    setIsConnectingAppleHealth(true);
    await initializeHealthKit();
    setIsConnectingAppleHealth(false);
  };

  return (
    <View className="flex-1 items-center justify-between px-6 py-12">
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000 }}
        className="w-full items-center">
        <Text variant="largeTitle" className="mb-4 text-center font-bold">
          Connect Your Apps
        </Text>
        <Text variant="body" className="mb-12 text-center text-gray-500">
          Link your fitness apps to automatically import your activities. You can always connect
          them later.
        </Text>

        <View className="w-full space-y-4">
          <TouchableOpacity
            onPress={handleStravaConnect}
            disabled={isStravaConnected}
            className={`flex-row items-center justify-between rounded-2xl bg-card p-4 ${
              isStravaConnected ? 'opacity-50' : ''
            }`}>
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12">
                <StravaIcon />
              </View>
              <View>
                <Text variant="title2" className="font-semibold">
                  Strava
                </Text>
                <Text variant="subhead" className="text-gray-500">
                  {isStravaConnected ? 'Connected' : 'Connect'}
                </Text>
              </View>
            </View>
            {isConnectingStrava ? (
              <ActivityIndicator size="small" color="white" />
            ) : isStravaConnected ? (
              <Ionicons name="checkmark" color="green" size={24} />
            ) : (
              <Ionicons name="add-circle-outline" color="gray" size={24} />
            )}
          </TouchableOpacity>

          {isAppleHealthAvailable && (
            <TouchableOpacity
              onPress={handleAppleHealthConnect}
              disabled={isAppleHealthConnected}
              className={`mt-4 flex-row items-center justify-between rounded-2xl bg-card p-4 ${
                isAppleHealthConnected ? 'opacity-50' : ''
              }`}>
              <View className="flex-row items-center gap-4">
                <View className="h-12 w-12">
                  <AppleHealthIcon />
                </View>
                <View>
                  <Text variant="title2" className="font-semibold">
                    Apple Health
                  </Text>
                  <Text variant="subhead" className="text-gray-500">
                    {isAppleHealthConnected ? 'Connected' : 'Connect'}
                  </Text>
                </View>
              </View>
              {isConnectingAppleHealth ? (
                <ActivityIndicator size="small" color="white" />
              ) : isAppleHealthConnected ? (
                <Ionicons name="checkmark" color="green" size={24} />
              ) : (
                <Ionicons name="add-circle-outline" color="gray" size={24} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </MotiView>

      <View className="w-full flex-row justify-between">
        <MotiPressable
          onPress={onBack}
          animate={({ pressed }) => {
            'worklet';
            return {
              scale: pressed ? 0.95 : 1,
            };
          }}>
          <View className="border-border/30 flex-row items-center gap-2 rounded-full border px-4 py-2">
            <Icon name="arrow-left" size={20} color={colors.primary} />
            <Text color="primary" variant="callout" className="font-medium">
              Back
            </Text>
          </View>
        </MotiPressable>
        <MotiPressable
          onPress={onNext}
          animate={({ pressed }) => {
            'worklet';
            return {
              scale: pressed ? 0.95 : 1,
            };
          }}>
          <View className="flex-row items-center gap-2 rounded-full bg-primary px-4 py-2">
            <Text className="font-medium text-white">Continue</Text>
            <Icon name="arrow-right" size={20} color="white" />
          </View>
        </MotiPressable>
      </View>
    </View>
  );
};
