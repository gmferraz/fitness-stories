import { Ionicons } from '@expo/vector-icons';
import { Icon } from '@roninoss/icons';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';

import { useInstagramShareStore } from '../utils/use-instagram-share-store';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';

interface SharePhotoStepProps {
  next: () => void;
}

export function SharePhotoStep({ next }: SharePhotoStepProps) {
  const { colors } = useColorScheme();
  const { selectedImage, setSelectedImage } = useInstagramShareStore();
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert(t('runningPlan.share.cameraPermissionError'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      aspect: [3, 4],
      quality: 1,
      allowsEditing: true,
      videoMaxDuration: 15,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const isVideo = useMemo(() => {
    return (
      selectedImage?.toLowerCase().endsWith('.mp4') || selectedImage?.toLowerCase().endsWith('.mov')
    );
  }, [selectedImage]);

  const videoPlayer = useVideoPlayer(isVideo ? selectedImage : null, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <MotiView
      className="flex-1"
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300 }}>
      <Text color="primary" variant="title1" className="font-bold">
        Pick a background
      </Text>
      <Text color="primary" variant="subhead" className="mb-6 mt-2 opacity-80">
        Choose a background to your story
      </Text>
      {selectedImage ? (
        <MotiView
          className="flex-1 justify-center"
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300 }}>
          {isVideo ? (
            <VideoView
              player={videoPlayer}
              style={{ flex: 1, borderRadius: 24 }}
              contentFit="contain"
              nativeControls={false}
            />
          ) : (
            <Image
              source={{ uri: selectedImage }}
              className="flex-1 rounded-3xl"
              style={{ shadowColor: colors.primary, shadowOpacity: 0.1, shadowRadius: 20 }}
            />
          )}
          <View className="mt-8 flex-row justify-between" style={{ paddingBottom: bottom }}>
            <MotiPressable
              onPress={() => setSelectedImage(null)}
              animate={({ pressed }) => {
                'worklet';
                return {
                  scale: pressed ? 0.95 : 1,
                };
              }}>
              <View className="border-border/30 flex-row items-center gap-2 rounded-full border px-4 py-2">
                <Icon name="arrow-left" size={20} color={colors.primary} />
                <Text color="primary" variant="callout" className="font-medium">
                  Change
                </Text>
              </View>
            </MotiPressable>
            <MotiPressable
              onPress={next}
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
        </MotiView>
      ) : (
        <MotiView
          style={{ gap: 16 }}
          className="mt-4 flex-1 flex-col"
          from={{ translateY: 20, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 200 }}>
          <MotiPressable
            onPress={pickImage}
            animate={({ pressed }) => {
              'worklet';
              return {
                scale: pressed ? 0.98 : 1,
              };
            }}>
            <View className="items-center justify-center overflow-hidden rounded-3xl bg-card p-8">
              <View className="bg-primary/10 mb-6 rounded-full p-4">
                <Ionicons name="images" size={32} color={colors.primary} />
              </View>
              <Text variant="title2" className="font-semibold" style={{ color: colors.foreground }}>
                Choose from library
              </Text>
              <Text
                variant="subhead"
                className="mt-2 text-center opacity-60"
                style={{ color: colors.foreground }}>
                Select your favorite media from your gallery
              </Text>
            </View>
          </MotiPressable>

          <Text color="primary" variant="title3" className="self-center font-medium opacity-60">
            Or
          </Text>

          <MotiPressable
            onPress={takePhoto}
            animate={({ pressed }) => {
              'worklet';
              return {
                scale: pressed ? 0.98 : 1,
              };
            }}>
            <View className="items-center justify-center overflow-hidden rounded-3xl bg-card p-8">
              <View className="bg-primary/10 mb-6 rounded-full p-4">
                <Ionicons name="camera" size={32} color={colors.primary} />
              </View>
              <Text variant="title2" className="font-semibold" style={{ color: colors.foreground }}>
                Take a photo
              </Text>
              <Text
                variant="subhead"
                className="mt-2 text-center opacity-60"
                style={{ color: colors.foreground }}>
                Capture a new moment right now
              </Text>
            </View>
          </MotiPressable>
        </MotiView>
      )}
    </MotiView>
  );
}
