import { Ionicons } from '@expo/vector-icons';
import { Icon } from '@roninoss/icons';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';

import { useInstagramShareStore } from '../utils/use-instagram-share-store';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useAds } from '~/features/ads/use-ads';
import { InterstitialAd } from 'react-native-google-mobile-ads';

interface SharePhotoStepProps {
  next: () => void;
}

export function SharePhotoStep({ next }: SharePhotoStepProps) {
  const { colors } = useColorScheme();
  const { selectedImage, setSelectedImage } = useInstagramShareStore();
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { createInterstitialAd } = useAds();
  const [ad, setAd] = useState<InterstitialAd | null>(createInterstitialAd());

  useEffect(() => {
    ad?.load();
  }, []);

  const pickImage = async () => {
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert(t('share.photo.cameraPermissionError'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        aspect: [3, 4],
        quality: 1,
        mediaTypes: ['images', 'videos'],
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } finally {
      setIsLoading(false);
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
        {t('share.photo.title')}
      </Text>
      <Text color="primary" variant="subhead" className="mb-6 mt-2 opacity-80">
        {t('share.photo.description')}
      </Text>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : selectedImage ? (
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
          <View className="mt-8 flex-row justify-between" style={{ paddingBottom: bottom + 16 }}>
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
                  {t('share.photo.change')}
                </Text>
              </View>
            </MotiPressable>
            <MotiPressable
              onPress={() => {
                if (ad?.loaded) {
                  ad.show().then(() => {
                    setAd(createInterstitialAd());
                    ad.load();
                    next();
                  });
                } else {
                  next();
                }
              }}
              animate={({ pressed }) => {
                'worklet';
                return {
                  scale: pressed ? 0.95 : 1,
                };
              }}>
              <View className="flex-row items-center gap-2 rounded-full bg-primary px-4 py-2">
                <Text className="font-medium text-white">{t('share.photo.continue')}</Text>
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
                {t('share.photo.chooseFromLibrary.title')}
              </Text>
              <Text
                variant="subhead"
                className="mt-2 text-center opacity-60"
                style={{ color: colors.foreground }}>
                {t('share.photo.chooseFromLibrary.description')}
              </Text>
            </View>
          </MotiPressable>

          <Text color="primary" variant="title3" className="self-center font-medium opacity-60">
            {t('share.photo.or')}
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
                {t('share.photo.takePhoto.title')}
              </Text>
              <Text
                variant="subhead"
                className="mt-2 text-center opacity-60"
                style={{ color: colors.foreground }}>
                {t('share.photo.takePhoto.description')}
              </Text>
            </View>
          </MotiPressable>
        </MotiView>
      )}
    </MotiView>
  );
}
