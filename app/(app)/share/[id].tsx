import React from 'react';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import Share from '~/features/share/Share';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useInstagramShareStore } from '~/features/share/utils/use-instagram-share-store';
import { MotiPressable } from 'moti/interactions';
import { useColorScheme } from '~/lib/useColorScheme';
import { View } from 'moti';
import { Text } from '~/components/nativewindui/Text';

export default function ShareScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: 'activity' | 'period' }>();
  const { step } = useInstagramShareStore();
  const { colors } = useColorScheme();

  const reformattedId = type === 'activity' ? id : id.replace(/\./g, '/');

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Share',
          headerLargeTitle: false,
          headerRight:
            step === 'layout'
              ? () => (
                  <Link href={`/layout-editor/${id}?type=${type}`} asChild>
                    <MotiPressable
                      animate={({ pressed }) => {
                        'worklet';
                        return {
                          scale: pressed ? 0.95 : 1,
                          opacity: pressed ? 0.9 : 1,
                        };
                      }}>
                      <View className="bg-primary/10 flex-row items-center rounded-full px-3 py-1.5">
                        <MaterialCommunityIcons
                          name="table-edit"
                          size={16}
                          color={colors.primary}
                        />
                        <Text color="primary" variant="caption1" className="ml-1 font-medium">
                          Edit
                        </Text>
                      </View>
                    </MotiPressable>
                  </Link>
                )
              : undefined,
        }}
      />
      <Share type={type} id={reformattedId} />
    </>
  );
}
