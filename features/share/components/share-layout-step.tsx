import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Icon } from '@roninoss/icons';
import { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import { MotiPressable } from 'moti/interactions';
import { useEnvironmentStore } from '~/features/app-setup/use-environment';
import { router } from 'expo-router';
import { DetailedLayout } from '../layouts/detailed-layout';
import { MinimalLayout } from '../layouts/minimal-layout';
import { ProgressLayout } from '../layouts/progress-layout';
import { MapLayout } from '../layouts/map-layout';
import { StatsLayout } from '../layouts/stats-layout';
import { AestheticLayout } from '../layouts/aesthetic-layout';
import { SocialLayout } from '../layouts/social-layout';
import { AchievementLayout } from '../layouts/achievement-layout';
import { WeightLayout } from '../layouts/weight-layout';
import { useInstagramShareStore } from '../utils/use-instagram-share-store';
import { useLayoutEditionStore } from '../utils/use-layout-edition-store';
import { handleShareToInstagram } from '../utils/handle-share-to-instagram';
import { getAvailableLayouts, LayoutType } from '../utils/get-available-layouts';
import { formatPace } from '~/utils/formatters';

import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useMountEffect } from '~/utils/use-mount-effect';
import { getStoredActivityDetails } from '~/features/home/utils/get-stored-activity-details';
import { PeriodMinimalLayout } from '../layouts/period-minimal-layout';
import { PeriodStatsLayout } from '../layouts/period-stats-layout';
import { PeriodSocialLayout } from '../layouts/period-social-layout';
import { getWeekDetails, WeekDetails } from '~/features/home/hooks/get-week-details';
import { Activity } from '~/features/home/types/activity';
import { HiitLayout } from '../layouts/hiit-layout';
import { Hiit2Layout } from '../layouts/hiit2-layout';
import { AdvancedStatsLayout } from '../layouts/advanced-stats-layout';
import { setShouldShowReviewOnNextOpen } from '~/utils/app-review';

interface ShareLayoutStepProps {
  previous: () => void;
  id: string;
  type: 'activity' | 'period';
}

export const LAYOUT_COMPONENTS: Record<LayoutType, React.ComponentType<any>> = {
  minimal: MinimalLayout,
  social: SocialLayout,
  detailed: DetailedLayout,
  progress: ProgressLayout,
  map: MapLayout,
  stats: StatsLayout,
  aesthetic: AestheticLayout,
  achievement: AchievementLayout,
  weight: WeightLayout,
  hiit: HiitLayout,
  hiit2: Hiit2Layout,
  'period-minimal': PeriodMinimalLayout,
  'period-stats': PeriodStatsLayout,
  'period-social': PeriodSocialLayout,
  'advanced-stats': AdvancedStatsLayout,
};

export function ShareLayoutStep({ previous, id, type }: ShareLayoutStepProps) {
  const { colors } = useColorScheme();
  const { bottom } = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const { selectedImage, setSelectedLayout } = useInstagramShareStore();
  const { lastUsedLayout, setLastUsedLayout, styles, toggleBackground, setActiveLayout } =
    useLayoutEditionStore();
  const width = Dimensions.get('window').width;
  const { t } = useTranslation();
  const viewShotRef = useRef<ViewShot>(null);
  const isPremium = useEnvironmentStore((state) => state.isPremium);

  const entity: WeekDetails | Activity =
    type === 'activity' ? getStoredActivityDetails(id) : getWeekDetails(id);
  const availableLayouts = getAvailableLayouts(
    type,
    type === 'activity' ? (entity as Activity) : undefined
  );

  // Get current layout and its style
  const currentLayout = availableLayouts[currentPage];
  const currentStyle = currentLayout ? styles[currentLayout] : null;

  // Find the index of the last used layout if it exists
  const initialIndex = useMemo(() => {
    if (!lastUsedLayout) return 0;
    const index = availableLayouts.indexOf(lastUsedLayout);
    return index >= 0 ? index : 0;
  }, [availableLayouts, lastUsedLayout]);

  const handlePageSelected = (page: number) => {
    const newLayout = availableLayouts[page];
    setCurrentPage(page);
    setSelectedLayout(newLayout);
    setActiveLayout(newLayout);
  };

  // Set initial layout and style
  useMountEffect(() => {
    const initialLayout = availableLayouts[initialIndex];
    setCurrentPage(initialIndex);
    setSelectedLayout(initialLayout);
    setActiveLayout(initialLayout);
  });

  // Function to handle the actual sharing to Instagram
  const shareToInstagram = async () => {
    try {
      if (!viewShotRef.current?.capture || !selectedImage) return;

      const stickerUri = await viewShotRef.current.capture();
      const isVideoFile =
        selectedImage.toLowerCase().endsWith('.mp4') ||
        selectedImage.toLowerCase().endsWith('.mov') ||
        selectedImage.toLowerCase().endsWith('.avi') ||
        selectedImage.toLowerCase().includes('video/');

      if (stickerUri) {
        // Store the current layout as the last used layout before sharing
        setLastUsedLayout(availableLayouts[currentPage]);
        setShouldShowReviewOnNextOpen();
        await handleShareToInstagram({
          backgroundUri: selectedImage,
          stickerUri,
          isVideo: isVideoFile,
        });
      }
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
    }
  };

  // Function to handle the share button click
  const handleShare = async () => {
    // Check if user is premium and if the current layout is edited
    const isLayoutEdited = currentStyle?.isEdited || false;

    // If user is not premium and layout is edited, redirect to paywall
    if (!isPremium && isLayoutEdited) {
      // Store the current layout as the last used layout before redirecting
      setLastUsedLayout(currentLayout);
      router.push({
        pathname: '/paywall',
        params: { preset: 'editTemplates' },
      });
      return;
    }

    await shareToInstagram();
  };

  const props = useMemo(() => {
    if (!entity) return null;

    if (type === 'activity') {
      const activity = entity as Activity;
      const { moving_time, distance, name } = activity;
      return {
        distance,
        duration: moving_time,
        pace: formatPace(distance, moving_time),
        unit: 'km',
        title: name,
        activity,
        showBackground: currentStyle?.showBackground ?? true,
      };
    } else {
      const weekDetails = entity as WeekDetails;
      return {
        weekRange: weekDetails.weekRange,
        totalActivities: weekDetails.totalActivities ?? 0,
        totalDistance: weekDetails.totalDistance ?? 0,
        totalDuration: weekDetails.totalDuration ?? 0,
        totalCalories: weekDetails.totalCalories ?? 0,
        showBackground: currentStyle?.showBackground ?? true,
      };
    }
  }, [entity, type, currentStyle]);

  if (!selectedImage || !entity) return null;

  const renderItem = ({ index }: { index: number }) => {
    const layout = availableLayouts[index];
    const LayoutComponent = LAYOUT_COMPONENTS[layout];
    const layoutStyle = styles[layout];

    // Ensure we're using the correct style for the current layout
    const currentLayoutStyle = index === currentPage ? layoutStyle : styles[layout];

    return (
      <View className="px-2">
        <ViewShot
          ref={index === currentPage ? viewShotRef : undefined}
          options={{
            format: 'png',
            quality: 1,
            result: 'data-uri',
          }}>
          <View style={{ borderRadius: 16, overflow: 'hidden' }}>
            <LayoutComponent
              {...props}
              showBackground={currentLayoutStyle?.showBackground ?? true}
            />
          </View>
        </ViewShot>
        <View className="mt-4 flex-row items-center justify-between">
          <MotiPressable
            onPress={() => {
              router.push({
                pathname: `/layout-editor/[id]`,
                params: { id, type },
              });
            }}
            animate={({ pressed }) => {
              'worklet';
              return {
                scale: pressed ? 0.95 : 1,
                opacity: pressed ? 0.9 : 1,
              };
            }}>
            <View className="border-border/30 flex-row items-center gap-2 self-end rounded-full border px-3 py-1.5">
              <MaterialCommunityIcons name="table-edit" size={16} color={colors.primary} />
              <Text color="primary" variant="subhead" className="font-medium">
                {t('share.layouts.common.edit')}
              </Text>
            </View>
          </MotiPressable>
          <MotiPressable
            onPress={toggleBackground}
            animate={({ pressed }) => {
              'worklet';
              return {
                scale: pressed ? 0.95 : 1,
                opacity: pressed ? 0.9 : 1,
              };
            }}>
            <View className="border-border/30 flex-row items-center gap-2 self-end rounded-full border px-3 py-1.5">
              <MaterialIcons
                name={currentLayoutStyle?.showBackground ? 'visibility' : 'visibility-off'}
                size={16}
                color={colors.primary}
              />
              <Text color="primary" variant="subhead" className="font-medium">
                {currentLayoutStyle?.showBackground
                  ? t('share.layout.hideBackground')
                  : t('share.layout.showBackground')}
              </Text>
            </View>
          </MotiPressable>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <Text color="primary" variant="title1" className="mb-2 font-bold">
        {t('share.layout.title')}
      </Text>
      <Text color="primary" variant="subhead" className="mb-6 opacity-80">
        {t('share.layout.description')}
      </Text>

      <Carousel
        loop
        width={width - 48}
        height={520}
        autoPlay={false}
        data={availableLayouts}
        defaultIndex={initialIndex}
        onSnapToItem={handlePageSelected}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.92,
          parallaxScrollingOffset: 40,
          parallaxAdjacentItemScale: 0.5,
        }}
      />

      <View className="mb-8 flex-row justify-center" style={{ gap: 6 }}>
        {availableLayouts.map((_, index) => (
          <View
            key={index}
            className="h-1.5 rounded-full"
            style={{
              width: currentPage === index ? 24 : 6,
              backgroundColor: currentPage === index ? colors.primary : colors.grey3,
            }}
          />
        ))}
      </View>

      <View className="mt-auto flex-row justify-between" style={{ paddingBottom: bottom + 16 }}>
        <MotiPressable
          onPress={previous}
          animate={({ pressed }) => {
            'worklet';
            return {
              scale: pressed ? 0.95 : 1,
            };
          }}>
          <View className="border-border/30 flex-row items-center gap-2 rounded-full border px-4 py-2">
            <Icon name="arrow-left" size={20} color={colors.primary} />
            <Text color="primary" variant="callout" className="font-medium">
              {t('share.layout.back')}
            </Text>
          </View>
        </MotiPressable>
        <MotiPressable
          onPress={handleShare}
          animate={({ pressed }) => {
            'worklet';
            return {
              scale: pressed ? 0.95 : 1,
            };
          }}>
          <View className="flex-row items-center gap-2 rounded-full bg-primary px-4 py-2">
            <Text className="font-medium text-white">{t('share.layout.share')}</Text>
            <MaterialIcons name="share" size={20} color="white" />
          </View>
        </MotiPressable>
      </View>
    </View>
  );
}
