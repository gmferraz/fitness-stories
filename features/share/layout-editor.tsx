import { View, ScrollView, Pressable } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { useState, useMemo, useEffect } from 'react';

import { Text } from '~/components/nativewindui/Text';
import { Slider } from '~/components/nativewindui/Slider';
import { Button } from '~/components/nativewindui/Button';
import { SegmentedControl } from '~/components/nativewindui/SegmentedControl';
import { useColorScheme } from '~/lib/useColorScheme';
import {
  useLayoutEditionStore,
  FontFamily,
  ColorScheme,
  BackgroundColor,
  FontColor,
  getFontColor,
  getBackgroundColor,
  type IconColor,
  getIconColor,
} from './utils/use-layout-edition-store';
import { MinimalLayout } from './layouts/minimal-layout';
import { SocialLayout } from './layouts/social-layout';
import { DetailedLayout } from './layouts/detailed-layout';
import { ProgressLayout } from './layouts/progress-layout';
import { MapLayout } from './layouts/map-layout';
import { StatsLayout } from './layouts/stats-layout';
import { AestheticLayout } from './layouts/aesthetic-layout';
import { AchievementLayout } from './layouts/achievement-layout';
import { WeightLayout } from './layouts/weight-layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInstagramShareStore } from './utils/use-instagram-share-store';
import { formatPace } from '~/utils/formatters';
import { LayoutType } from './utils/get-available-layouts';
import { router } from 'expo-router';
import { getStoredActivityDetails } from '../home/utils/get-stored-activity-details';

const FONT_FAMILIES: { label: string; value: FontFamily }[] = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Oswald', value: 'Oswald' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Poppins', value: 'Poppins' },
];

const COLOR_SCHEMES: { label: string; value: ColorScheme; color: string }[] = [
  { label: 'Blue', value: 'blue', color: '#007AFF' },
  { label: 'Purple', value: 'purple', color: '#5856D6' },
  { label: 'Pink', value: 'pink', color: '#FF2D55' },
  { label: 'Orange', value: 'orange', color: '#FF9500' },
  { label: 'Green', value: 'green', color: '#34C759' },
];

const BACKGROUND_COLORS: { label: string; value: BackgroundColor }[] = [
  { label: 'Dark', value: 'dark' },
  { label: 'White', value: 'white' },
  { label: 'Blue', value: 'blue-200' },
  { label: 'Purple', value: 'purple-600' },
  { label: 'Red', value: 'red-200' },
  { label: 'Orange', value: 'orange-200' },
];

const FONT_COLORS: { label: string; value: FontColor }[] = [
  { label: 'White', value: 'white' },
  { label: 'Black', value: 'black' },
  { label: 'Gray 900', value: 'gray-900' },
  { label: 'Gray 800', value: 'gray-800' },
  { label: 'Gray 700', value: 'gray-700' },
];

type EditorSection = 'Style' | 'Sizes' | 'Colors';
const EDITOR_SECTIONS: EditorSection[] = ['Style', 'Sizes', 'Colors'];

const LAYOUT_COMPONENTS: Record<LayoutType, React.ComponentType<any>> = {
  minimal: MinimalLayout,
  social: SocialLayout,
  detailed: DetailedLayout,
  progress: ProgressLayout,
  map: MapLayout,
  stats: StatsLayout,
  aesthetic: AestheticLayout,
  achievement: AchievementLayout,
  weight: WeightLayout,
};

export function LayoutEditor({ id }: { id: string }) {
  const { colors } = useColorScheme();
  const [selectedSection, setSelectedSection] = useState<number>(0);
  const { selectedLayout } = useInstagramShareStore();
  const { bottom } = useSafeAreaInsets();

  const { styles, activeLayout, setLayoutStyle, setActiveLayout, toggleBackground } =
    useLayoutEditionStore();

  // Get current layout style
  const currentStyle = selectedLayout ? styles[selectedLayout] : null;

  // Update active layout when selected layout changes
  useEffect(() => {
    if (selectedLayout && activeLayout !== selectedLayout) {
      setActiveLayout(selectedLayout);
    }
  }, [selectedLayout, activeLayout, setActiveLayout]);

  const activity = getStoredActivityDetails(id);

  const props = useMemo(() => {
    if (!activity) return null;
    const { moving_time, distance, name } = activity;
    return {
      distance,
      duration: moving_time,
      pace: formatPace(distance, moving_time),
      unit: 'km',
      title: name,
      activity,
    };
  }, [activity]);

  const renderStyleSection = () => (
    <View className="mb-6">
      <Text color="primary" variant="heading" className="mb-4 font-bold">
        Font Style
      </Text>
      <View className="flex-col" style={{ gap: 8 }}>
        {FONT_FAMILIES.map((font) => (
          <MotiPressable
            key={font.value}
            onPress={() =>
              selectedLayout && setLayoutStyle(selectedLayout, { fontFamily: font.value })
            }
            animate={({ pressed }) => {
              'worklet';
              return {
                scale: pressed ? 0.95 : 1,
                opacity: pressed ? 0.9 : 1,
              };
            }}>
            <View
              className={`self-start rounded-xl border p-3 ${
                currentStyle?.fontFamily === font.value
                  ? 'bg-primary/5 border-primary'
                  : 'border-border/30'
              }`}>
              <Text
                color="primary"
                variant="callout"
                style={{ fontFamily: font.value }}
                className={currentStyle?.fontFamily === font.value ? 'font-bold' : 'font-medium'}>
                {font.label}
              </Text>
            </View>
          </MotiPressable>
        ))}
      </View>
    </View>
  );

  const renderSizesSection = () => (
    <View className="mb-6">
      <View className="mb-6">
        <View className="mb-2 flex-row items-center justify-between">
          <Text color="primary" variant="heading" className="font-bold">
            Title Size
          </Text>
          <Text color="primary" variant="callout" className="font-medium">
            {currentStyle?.titleSize}px
          </Text>
        </View>
        <Slider
          value={currentStyle?.titleSize ?? 28}
          minimumValue={20}
          maximumValue={40}
          step={1}
          onValueChange={(value) =>
            selectedLayout && setLayoutStyle(selectedLayout, { titleSize: value })
          }
        />
      </View>
      <View className="mb-6">
        <View className="mb-2 flex-row items-center justify-between">
          <Text color="primary" variant="heading" className="font-bold">
            Body Size
          </Text>
          <Text color="primary" variant="callout" className="font-medium">
            {currentStyle?.bodySize}px
          </Text>
        </View>
        <Slider
          value={currentStyle?.bodySize ?? 18}
          minimumValue={12}
          maximumValue={24}
          step={1}
          onValueChange={(value) =>
            selectedLayout && setLayoutStyle(selectedLayout, { bodySize: value })
          }
        />
      </View>
      <View>
        <View className="mb-2 flex-row items-center justify-between">
          <Text color="primary" variant="heading" className="font-bold">
            Label Size
          </Text>
          <Text color="primary" variant="callout" className="font-medium">
            {currentStyle?.labelSize}px
          </Text>
        </View>
        <Slider
          value={currentStyle?.labelSize ?? 14}
          minimumValue={10}
          maximumValue={18}
          step={1}
          onValueChange={(value) =>
            selectedLayout && setLayoutStyle(selectedLayout, { labelSize: value })
          }
        />
      </View>
    </View>
  );

  const renderColorsSection = () => (
    <View className="mb-6">
      {/* Font Colors */}
      <View className="mb-8">
        <Text color="primary" variant="heading" className="mb-4 font-bold">
          Font Color
        </Text>
        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
          {FONT_COLORS.map((color) => (
            <MotiPressable
              key={color.value}
              onPress={() =>
                selectedLayout && setLayoutStyle(selectedLayout, { fontColor: color.value })
              }
              animate={({ pressed }) => {
                'worklet';
                return {
                  scale: pressed ? 0.95 : 1,
                  opacity: pressed ? 0.9 : 1,
                };
              }}>
              <View
                className={`aspect-square w-12 items-center justify-center rounded-full ${
                  currentStyle?.fontColor === color.value ? 'border-2 border-primary' : ''
                }`}
                style={{ backgroundColor: getFontColor(color.value) }}>
                {currentStyle?.fontColor === color.value && (
                  <MaterialCommunityIcons name="check" size={20} color="white" />
                )}
              </View>
            </MotiPressable>
          ))}
        </View>
      </View>

      {/* Background Colors */}
      <View className="mb-8">
        <Text color="primary" variant="heading" className="mb-4 font-bold">
          Background Color
        </Text>
        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
          {BACKGROUND_COLORS.map((color) => (
            <MotiPressable
              key={color.value}
              onPress={() =>
                selectedLayout && setLayoutStyle(selectedLayout, { backgroundColor: color.value })
              }
              animate={({ pressed }) => {
                'worklet';
                return {
                  scale: pressed ? 0.95 : 1,
                  opacity: pressed ? 0.9 : 1,
                };
              }}>
              <View
                className={`aspect-square w-12 items-center justify-center rounded-full ${
                  currentStyle?.backgroundColor === color.value
                    ? 'border-2 border-primary'
                    : 'border-border/30 border'
                }`}
                style={{ backgroundColor: getBackgroundColor(color.value) }}>
                {currentStyle?.backgroundColor === color.value && (
                  <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                )}
              </View>
            </MotiPressable>
          ))}
        </View>
      </View>

      <View className="mb-6">
        <Text className="mb-2 font-medium">Icon Color</Text>
        <View className="flex-row flex-wrap gap-2">
          {['blue', 'purple', 'pink', 'orange', 'green', 'white', 'gray'].map((color) => (
            <Pressable
              key={color}
              onPress={() =>
                selectedLayout && setLayoutStyle(selectedLayout, { iconColor: color as IconColor })
              }
              className={`h-8 w-8 items-center justify-center rounded-full ${
                currentStyle?.iconColor === color ? 'border-2 border-white' : ''
              }`}
              style={{ backgroundColor: getIconColor(color as IconColor) }}>
              {currentStyle?.iconColor === color && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={color === 'white' ? 'black' : 'white'}
                />
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  const renderPreview = () => {
    if (!activity || !selectedLayout || !props) return null;
    const LayoutComponent = LAYOUT_COMPONENTS[selectedLayout];
    const currentStyle = styles[selectedLayout];
    return <LayoutComponent {...props} showBackground={currentStyle?.showBackground ?? true} />;
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      className="flex-1">
      <View className="flex-1">
        <View className="p-6">
          <View className="flex-row items-center justify-between">
            <Text color="primary" variant="title1" className="mb-4 font-bold">
              Layout Editor
            </Text>
            <MotiPressable
              onPress={() => selectedLayout && toggleBackground()}
              animate={({ pressed }) => {
                'worklet';
                return {
                  scale: pressed ? 0.95 : 1,
                  opacity: pressed ? 0.9 : 1,
                };
              }}>
              <View className="border-border/30 mt-2 flex-row items-center gap-2 self-end rounded-full border px-3 py-1.5">
                <MaterialIcons
                  name={currentStyle?.showBackground ? 'visibility' : 'visibility-off'}
                  size={16}
                  color={colors.primary}
                />
                <Text color="primary" variant="caption1" className="font-medium">
                  {currentStyle?.showBackground ? 'Hide background' : 'Show background'}
                </Text>
              </View>
            </MotiPressable>
          </View>

          {/* Preview Section */}
          <View className="mb-4">{renderPreview()}</View>

          {/* Section Control */}
          <SegmentedControl
            values={EDITOR_SECTIONS}
            selectedIndex={selectedSection}
            onChange={(event) => {
              setSelectedSection(event.nativeEvent.selectedSegmentIndex);
            }}
            className="mb-6"
          />
        </View>

        {/* Section Content */}
        <ScrollView
          showsVerticalScrollIndicator
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 24 }}>
          {selectedSection === 0 && renderStyleSection()}
          {selectedSection === 1 && renderSizesSection()}
          {selectedSection === 2 && renderColorsSection()}
        </ScrollView>

        <View
          style={{ paddingBottom: bottom }}
          className="border-border/30 border-t bg-background p-6">
          <Button variant="primary" size="lg" onPress={() => router.back()} className="w-full">
            <Text className="font-medium">Done</Text>
          </Button>
        </View>
      </View>
    </MotiView>
  );
}
