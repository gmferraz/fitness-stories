import React from 'react';
import { View, Dimensions, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useOnboardingStore } from './store/use-onboarding-store';
import { WelcomeStep } from './steps/welcome';
import { ConnectAppsStep } from './steps/connect-apps';
import { CreateStoriesStep } from './steps/create-stories';
import { SuccessStep } from './steps/success';

const { width } = Dimensions.get('window');

export const OnboardingScreen = () => {
  const { bottom, top } = useSafeAreaInsets();
  const { currentStep, setCurrentStep, completeOnboarding } = useOnboardingStore();

  const handleNext = () => {
    if (currentStep === 3) {
      completeOnboarding();
      router.replace('/');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  return (
    <View className="flex-1 bg-background">
      <MotiView
        style={{
          width: width * 4,
          flexDirection: 'row',
          transform: [{ translateX: -width * currentStep }],
          flex: 1,
          marginTop: top,
          marginBottom: bottom,
        }}
        animate={{
          translateX: -width * currentStep,
        }}
        transition={{
          type: 'timing',
          duration: 300,
        }}>
        <View style={{ width }}>
          <WelcomeStep onNext={handleNext} />
        </View>
        <View style={{ width }}>
          <ConnectAppsStep onNext={handleNext} onBack={handleBack} />
        </View>
        <View style={{ width }}>
          <CreateStoriesStep onNext={handleNext} onBack={handleBack} />
        </View>
        <View style={{ width }}>
          <SuccessStep onNext={handleNext} onBack={handleBack} />
        </View>
      </MotiView>
    </View>
  );
};
