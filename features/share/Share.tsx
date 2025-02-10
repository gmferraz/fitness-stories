import { View } from 'react-native';

import { ShareLayoutStep } from './components/share-layout-step';
import { SharePhotoStep } from './components/share-photo-step';
import { useInstagramShareStore } from './utils/use-instagram-share-store';

import { useColorScheme } from '~/lib/useColorScheme';
import { useUnmountEffect } from '~/utils/use-mount-effect';

export default function Share({ id }: { id: string }) {
  const { colors } = useColorScheme();
  const { step, setStep, reset } = useInstagramShareStore();

  useUnmountEffect(() => {
    reset();
  });

  return (
    <View
      className="flex-1"
      style={{
        paddingTop: 16,
        backgroundColor: colors.background,
      }}>
      {step === 'photo' && (
        <View className="flex-1 px-6">
          <SharePhotoStep next={() => setStep('layout')} />
        </View>
      )}
      {step === 'layout' && (
        <View className="flex-1 px-6">
          <ShareLayoutStep id={id} previous={() => setStep('photo')} />
        </View>
      )}
    </View>
  );
}
