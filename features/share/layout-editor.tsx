import {
  View,
  ScrollView,
  Pressable,
  Platform,
  ScrollView as HorizontalScrollView,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '~/components/nativewindui/Text';
import { Slider } from '~/components/nativewindui/Slider';
import { Button } from '~/components/nativewindui/Button';
import { SegmentedControl } from '~/components/nativewindui/SegmentedControl';
import { useColorScheme } from '~/lib/useColorScheme';
import {
  useLayoutEditionStore,
  FontFamily,
  BackgroundColor,
  FontColor,
  getFontColor,
  getBackgroundColor,
  type IconColor,
  getIconColor,
} from './utils/use-layout-edition-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInstagramShareStore } from './utils/use-instagram-share-store';
import { formatPace } from '~/utils/formatters';
import { router } from 'expo-router';
import { getStoredActivityDetails } from '../home/utils/get-stored-activity-details';
import { getWeekDetails, WeekDetails } from '~/features/home/hooks/get-week-details';
import { Activity } from '~/features/home/types/activity';
import { LAYOUT_COMPONENTS } from './components/share-layout-step';
import { getLayoutAvailableEdition } from './utils/get-layout-available-edition';

const FONT_FAMILIES: { label: string; value: FontFamily }[] = [
  { label: 'Inter', value: Platform.OS === 'ios' ? 'Inter' : 'Inter_400Regular' },
  { label: 'Oswald', value: Platform.OS === 'ios' ? 'Oswald' : 'Oswald_400Regular' },
  { label: 'Montserrat', value: Platform.OS === 'ios' ? 'Montserrat' : 'Montserrat_400Regular' },
  { label: 'Poppins', value: Platform.OS === 'ios' ? 'Poppins' : 'Poppins_400Regular' },
];

type EditorSection = 'Style' | 'Sizes' | 'Colors';

export function LayoutEditor({ id, type }: { id: string; type: 'activity' | 'period' }) {
  const { colors } = useColorScheme();
  const { t } = useTranslation();
  const [selectedSection, setSelectedSection] = useState<number>(0);
  const { selectedLayout } = useInstagramShareStore();
  const { bottom } = useSafeAreaInsets();

  const EDITOR_SECTIONS: EditorSection[] = [
    t('share.editor.style'),
    t('share.editor.sizes'),
    t('share.editor.color'),
  ];

  const { styles, activeLayout, setLayoutStyle, setActiveLayout, toggleBackground } =
    useLayoutEditionStore();

  const BACKGROUND_COLORS: { label: string; value: BackgroundColor }[] = [
    { label: t('share.editor.colors.white'), value: 'white' },
    { label: t('share.editor.colors.black'), value: 'black' },
    { label: 'Pastel Pink', value: 'pastel-pink' },
    { label: 'Pastel Blue', value: 'pastel-blue' },
    { label: 'Pastel Purple', value: 'pastel-purple' },
    { label: 'Pastel Green', value: 'pastel-green' },
    { label: 'Pastel Mint', value: 'pastel-mint' },
    { label: 'Pastel Lavender', value: 'pastel-lavender' },
    { label: 'Pastel Coral', value: 'pastel-coral' },
    { label: 'Pastel Turquoise', value: 'pastel-turquoise' },
    { label: 'Pastel Mauve', value: 'pastel-mauve' },
    { label: 'Pastel Sky Blue', value: 'pastel-sky-blue' },
    { label: 'Pastel Gray', value: 'pastel-gray' },
    { label: 'Vibrant Blue', value: 'vibrant-blue' },
    { label: 'Vibrant Purple', value: 'vibrant-purple' },
    { label: 'Vibrant Pink', value: 'vibrant-pink' },
    { label: 'Vibrant Teal', value: 'vibrant-teal' },
    { label: 'Vibrant Orange', value: 'vibrant-orange' },
    { label: 'Vibrant Red', value: 'vibrant-red' },
    { label: 'Vibrant Gray', value: 'vibrant-gray' },
  ];

  const FONT_COLORS: { label: string; value: FontColor }[] = [
    { label: t('share.editor.colors.white'), value: 'white' },
    { label: t('share.editor.colors.black'), value: 'black' },
    { label: 'Slate Blue-Gray', value: 'slate-blue-gray' },
    { label: 'Soft Burgundy', value: 'soft-burgundy' },
    { label: 'Moderate Plum', value: 'moderate-plum' },
    { label: 'Dark Olive Green', value: 'dark-olive-green' },
    { label: 'Deep Teal', value: 'deep-teal' },
    { label: 'Moderate Indigo', value: 'moderate-indigo' },
    { label: 'Slate Gray', value: 'slate-gray' },
    { label: 'Dark Brown', value: 'dark-brown' },
    { label: 'Forest Green', value: 'forest-green' },
    { label: 'Charcoal', value: 'charcoal' },
    { label: 'Midnight Blue', value: 'midnight-blue' },
    { label: 'Espresso Brown', value: 'espresso-brown' },
    { label: 'Iron Gray', value: 'iron-gray' },
    { label: 'Deep Aubergine', value: 'deep-aubergine' },
  ];

  const ICON_COLORS: { label: string; value: IconColor }[] = [
    { label: 'Blue', value: 'blue' },
    { label: 'Purple', value: 'purple' },
    { label: 'Pink', value: 'pink' },
    { label: 'Orange', value: 'orange' },
    { label: 'Green', value: 'green' },
    { label: 'White', value: 'white' },
    { label: 'Gray', value: 'gray' },
  ];

  // Get current layout style
  const currentStyle = selectedLayout ? styles[selectedLayout] : null;

  const availableEdition = selectedLayout ? getLayoutAvailableEdition(selectedLayout) : [];

  // Update active layout when selected layout changes
  useEffect(() => {
    if (selectedLayout && activeLayout !== selectedLayout) {
      setActiveLayout(selectedLayout);
    }
  }, [selectedLayout, activeLayout, setActiveLayout]);

  const entity: WeekDetails | Activity =
    type === 'activity' ? getStoredActivityDetails(id) : getWeekDetails(id);

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
      };
    } else {
      const weekDetails = entity as WeekDetails;
      return {
        weekRange: weekDetails.weekRange,
        totalActivities: weekDetails.totalActivities ?? 0,
        totalDistance: weekDetails.totalDistance ?? 0,
        totalDuration: weekDetails.totalDuration ?? 0,
        totalCalories: weekDetails.totalCalories ?? 0,
      };
    }
  }, []);

  const renderStyleSection = () => (
    <View className="space-y-12">
      {/* Font Family */}
      <View>
        <Text color="secondary" variant="subhead" className="mb-4 font-medium">
          {t('share.editor.font')}
        </Text>
        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
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

      {/* Opacity */}
      <View className="mt-4">
        <View className="flex-row items-center">
          <Text color="secondary" variant="subhead" className="flex-1 font-medium">
            {t('share.editor.opacity')}
          </Text>
          <View style={{ width: '60%' }}>
            <Slider
              value={currentStyle?.opacity ?? 100}
              minimumValue={5}
              maximumValue={100}
              step={5}
              onValueChange={(value) =>
                selectedLayout && setLayoutStyle(selectedLayout, { opacity: value })
              }
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderSizesSection = () => (
    <View className="space-y-12">
      {/* Title Size */}
      {availableEdition.includes('titleFontSize') && (
        <View className="flex-row items-center">
          <Text color="secondary" variant="subhead" className="flex-1 font-medium">
            {t('share.editor.titleSize')}
          </Text>
          <View style={{ width: '70%' }}>
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
        </View>
      )}

      {/* Body Size */}
      <View>
        <View className="flex-row items-center">
          <Text color="secondary" variant="subhead" className="flex-1 font-medium">
            {t('share.editor.bodySize')}
          </Text>
          <View style={{ width: '70%' }}>
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
        </View>
      </View>

      {/* Label Size */}
      <View>
        <View className="flex-row items-center">
          <Text color="secondary" variant="subhead" className="flex-1 font-medium">
            {t('share.editor.labelSize')}
          </Text>
          <View style={{ width: '70%' }}>
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
      </View>

      {/* Padding */}
      <View>
        <View className="flex-row items-center">
          <Text color="secondary" variant="subhead" className="flex-1 font-medium">
            {t('share.editor.padding')}
          </Text>
          <View style={{ width: '70%' }}>
            <Slider
              value={currentStyle?.padding ?? 16}
              minimumValue={4}
              maximumValue={24}
              step={1}
              onValueChange={(value) =>
                selectedLayout && setLayoutStyle(selectedLayout, { padding: value })
              }
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderColorsSection = () => (
    <View className="space-y-12">
      {/* Font Colors */}
      <View className="mb-4">
        <Text color="secondary" variant="subhead" className="mb-4 font-medium">
          {t('share.editor.fontColor')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
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
                className={`aspect-square w-10 items-center justify-center rounded-full ${
                  currentStyle?.fontColor === color.value ? 'border-2 border-primary' : ''
                }`}
                style={{ backgroundColor: getFontColor(color.value) }}>
                {currentStyle?.fontColor === color.value && (
                  <MaterialCommunityIcons name="check" size={20} color="white" />
                )}
              </View>
            </MotiPressable>
          ))}
        </ScrollView>
      </View>

      {/* Background Colors */}
      <View className="mb-4">
        <Text color="secondary" variant="subhead" className="mb-4 font-medium">
          {t('share.editor.backgroundColor')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
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
                className={`aspect-square w-10 items-center justify-center rounded-full ${
                  currentStyle?.backgroundColor === color.value
                    ? 'border-2 border-primary'
                    : 'border-border/30 border'
                }`}
                style={{ backgroundColor: getBackgroundColor(color.value, 100) }}>
                {currentStyle?.backgroundColor === color.value && (
                  <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                )}
              </View>
            </MotiPressable>
          ))}
        </ScrollView>
      </View>

      {/* Icon Colors */}
      {availableEdition.includes('iconColor') && (
        <View>
          <Text color="secondary" variant="subhead" className="mb-4 font-medium">
            {t('share.editor.iconColor')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
            {ICON_COLORS.map((color) => (
              <MotiPressable
                key={color.value}
                onPress={() =>
                  selectedLayout && setLayoutStyle(selectedLayout, { iconColor: color.value })
                }
                animate={({ pressed }) => {
                  'worklet';
                  return {
                    scale: pressed ? 0.95 : 1,
                    opacity: pressed ? 0.9 : 1,
                  };
                }}>
                <View
                  className={`aspect-square w-10 items-center justify-center rounded-full ${
                    currentStyle?.iconColor === color.value ? 'border-2 border-primary' : ''
                  }`}
                  style={{ backgroundColor: getIconColor(color.value) }}>
                  {currentStyle?.iconColor === color.value && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={color.value === 'white' ? 'black' : 'white'}
                    />
                  )}
                </View>
              </MotiPressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderPreview = () => {
    if (!entity || !selectedLayout || !props) return null;
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
        <View className="px-2 py-2">
          <View className="flex-row items-center justify-between">
            <MotiPressable
              onPress={() => selectedLayout && toggleBackground()}
              animate={({ pressed }) => {
                'worklet';
                return {
                  scale: pressed ? 0.95 : 1,
                  opacity: pressed ? 0.9 : 1,
                };
              }}>
              <View className="border-border/30 flex-row items-center gap-2 self-end rounded-full border px-3 py-1.5">
                <MaterialIcons
                  name={currentStyle?.showBackground ? 'visibility' : 'visibility-off'}
                  size={16}
                  color={colors.primary}
                />
                <Text color="primary" variant="caption1" className="font-medium">
                  {currentStyle?.showBackground
                    ? t('share.layout.hideBackground')
                    : t('share.layout.showBackground')}
                </Text>
              </View>
            </MotiPressable>
            <View />
          </View>

          <View className="mb-8 mt-2">{renderPreview()}</View>

          {/* Section Control */}
          <SegmentedControl
            values={EDITOR_SECTIONS}
            selectedIndex={selectedSection}
            onChange={(event) => {
              setSelectedSection(event.nativeEvent.selectedSegmentIndex);
            }}
            className="mb-3"
          />
        </View>

        {/* Section Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 24 }}>
          {selectedSection === 0 && renderStyleSection()}
          {selectedSection === 1 && renderSizesSection()}
          {selectedSection === 2 && renderColorsSection()}
        </ScrollView>

        <View
          style={{ paddingBottom: bottom + 16 }}
          className="border-border/30 border-t bg-background p-4">
          <Button variant="primary" size="lg" onPress={() => router.back()} className="w-full">
            <Text className="font-medium">{t('share.editor.done')}</Text>
          </Button>
        </View>
      </View>
    </MotiView>
  );
}
