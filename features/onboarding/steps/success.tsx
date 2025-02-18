import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { Text } from '~/components/nativewindui/Text';
import { Icon } from '@roninoss/icons';
import { useColorScheme } from '~/lib/useColorScheme';

interface SuccessStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ onNext, onBack }) => {
  const { colors } = useColorScheme();

  return (
    <View className="flex-1 items-center justify-between px-6 py-12">
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000 }}
        className="mt-36 w-full items-center">
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            damping: 10,
            stiffness: 100,
          }}
          className="mb-8 h-24 w-24 items-center justify-center rounded-full bg-green-200 dark:bg-green-100">
          <Icon name="check" size={48} color="#22C55E" />
        </MotiView>

        <Text variant="largeTitle" className="mb-4 text-center font-bold">
          You're All Set!
        </Text>
        <Text variant="body" className="mb-12 text-center text-gray-500">
          Start sharing your fitness journey with beautiful Instagram stories. Let's inspire others
          to stay active and healthy!
        </Text>
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
            <Text className="font-medium text-white">Get Started</Text>
            <Icon name="arrow-right" size={20} color="white" />
          </View>
        </MotiPressable>
      </View>
    </View>
  );
};
