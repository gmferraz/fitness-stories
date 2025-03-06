import React, { useState } from 'react';
import { View, Image, useWindowDimensions, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-native-reanimated-carousel';
import { Text } from '~/components/nativewindui/Text';
import { Icon } from '@roninoss/icons';
import { useColorScheme } from '~/lib/useColorScheme';

interface CreateStoriesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const steps = [
  {
    key: 'selectActivity',
    image: require('~/assets/onboarding/card.png'),
  },
  {
    key: 'shareToInstagram',
    image: require('~/assets/onboarding/details.png'),
  },
  {
    key: 'chooseBackground',
    image: require('~/assets/onboarding/background.png'),
  },
  {
    key: 'pickLayout',
    image: require('~/assets/onboarding/layout.png'),
  },
];

export const CreateStoriesStep: React.FC<CreateStoriesStepProps> = ({ onNext, onBack }) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  const handleSnapToItem = (index: number) => {
    setActiveIndex(index);
  };

  const carouselHeight = Dimensions.get('window').height * 0.45;

  return (
    <View className="flex-1 items-center justify-between px-6 py-12">
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000 }}
        className="w-full items-center">
        <Text variant="largeTitle" className="mb-4 text-center font-bold">
          {t('onboarding.createStories.title')}
        </Text>
        <Text variant="body" className="mb-8 text-center text-gray-500">
          {t('onboarding.createStories.description')}
        </Text>

        <View className="mt-4 w-full" style={{ height: carouselHeight }}>
          <Carousel
            width={width - 48}
            height={carouselHeight}
            data={steps}
            onSnapToItem={handleSnapToItem}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.92,
              parallaxScrollingOffset: 40,
              parallaxAdjacentItemScale: 0.5,
            }}
            renderItem={({ item, index }) => (
              <MotiView
                from={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  type: 'timing',
                  duration: 300,
                }}
                className="px-2">
                <Image
                  source={item.image}
                  className="mb-6 w-full rounded-3xl"
                  style={{ height: carouselHeight - 120 }}
                  resizeMode="contain"
                />
                <Text variant="body" color="primary" className="text-center text-xl">
                  {t(`onboarding.createStories.steps.${item.key}.description`)}
                </Text>
              </MotiView>
            )}
          />
        </View>

        <View className="mb-8 flex-row justify-center" style={{ gap: 6 }}>
          {steps.map((_, index) => (
            <View
              key={index}
              className="h-1.5 rounded-full"
              style={{
                width: activeIndex === index ? 24 : 6,
                backgroundColor: activeIndex === index ? colors.primary : colors.grey3,
              }}
            />
          ))}
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
              {t('onboarding.createStories.back')}
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
            <Text className="font-medium text-white">{t('onboarding.createStories.continue')}</Text>
            <Icon name="arrow-right" size={20} color="white" />
          </View>
        </MotiPressable>
      </View>
    </View>
  );
};
