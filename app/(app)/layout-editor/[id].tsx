import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { LayoutEditor } from '~/features/share/layout-editor';
import { MotiPressable } from 'moti/interactions';
import { useLayoutEditionStore } from '~/features/share/utils/use-layout-edition-store';
import { View } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useTranslation } from 'react-i18next';

export default function LayoutEditorScreen() {
  const { activeLayout, resetLayoutStyle } = useLayoutEditionStore();
  const { id, type } = useLocalSearchParams<{ id: string; type: 'activity' | 'period' }>();
  const { colors } = useColorScheme();
  const { t } = useTranslation();

  const handleReset = () => {
    if (activeLayout) {
      resetLayoutStyle(activeLayout);
    }
  };

  const reformattedId = type === 'activity' ? id : id.replace(/\./g, '/');

  return (
    <>
      <Stack.Screen
        options={{
          title: t('share.editor.title'),
          headerLargeTitle: false,
          headerTitleAlign: 'center',
          headerRight: () => (
            <MotiPressable
              onPress={handleReset}
              animate={({ pressed }) => {
                'worklet';
                return {
                  scale: pressed ? 0.95 : 1,
                  opacity: pressed ? 0.9 : 1,
                };
              }}>
              <View className="bg-primary/10 flex-row items-center rounded-full px-3 py-1.5">
                <MaterialCommunityIcons name="refresh" size={16} color={colors.primary} />
                <Text color="primary" variant="subhead" className="ml-2 font-medium">
                  {t('share.editor.reset')}
                </Text>
              </View>
            </MotiPressable>
          ),
        }}
      />
      <LayoutEditor id={reformattedId} type={type} />
    </>
  );
}
