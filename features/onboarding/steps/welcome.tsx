import React from 'react';
import { View, Image, Linking } from 'react-native';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { useTranslation } from 'react-i18next';
import { Text } from '~/components/nativewindui/Text';
import { Icon } from '@roninoss/icons';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center px-6">
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000 }}
        className="items-center">
        <Image
          source={require('~/assets/new-icon.png')}
          className="mb-8 h-32 w-32 rounded-3xl"
          resizeMode="contain"
        />
        <Text variant="largeTitle" className="mb-4 text-center font-bold">
          {t('onboarding.welcome.title')}
        </Text>
        <Text variant="body" className="mb-12 text-center text-gray-500">
          {t('onboarding.welcome.description')}
        </Text>
      </MotiView>

      <MotiPressable
        onPress={onNext}
        animate={({ pressed }) => {
          'worklet';
          return {
            scale: pressed ? 0.95 : 1,
          };
        }}>
        <View className="mb-6 flex-row items-center gap-2 rounded-full bg-primary px-4 py-2">
          <Text className="font-medium text-white">{t('onboarding.welcome.getStarted')}</Text>
          <Icon name="arrow-right" size={20} color="white" />
        </View>
      </MotiPressable>

      <View className="mt-2 flex-row justify-center gap-4">
        <Text
          className="text-sm text-gray-500 underline"
          onPress={() => Linking.openURL('https://fitstories-drab.vercel.app/privacy/en')}>
          {t('settings.privacyPolicy')}
        </Text>
        <Text
          className="text-sm text-gray-500 underline"
          onPress={() => Linking.openURL('https://fitstories-drab.vercel.app/terms/en')}>
          {t('settings.terms')}
        </Text>
      </View>
    </View>
  );
};
