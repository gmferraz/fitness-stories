import React from 'react';
import { View } from 'react-native';
import { Text } from './nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  className?: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  className,
  icon = 'fitness-outline',
}) => {
  const { colors } = useColorScheme();

  return (
    <View
      className={`items-center justify-center rounded-3xl bg-card p-8 ${className ?? ''}`}
      style={{
        shadowColor: colors.primary,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
      }}>
      <View className="bg-primary/10 mb-5 h-16 w-16 items-center justify-center rounded-full">
        <Ionicons name={icon as any} size={32} color={colors.primary} />
      </View>
      <Text variant="title2" className="mb-3 text-center font-bold">
        {title}
      </Text>
      <Text variant="body" className="text-center text-gray-500 dark:text-gray-400">
        {subtitle}
      </Text>
    </View>
  );
};
