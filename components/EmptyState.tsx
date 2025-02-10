import React from 'react';
import { View } from 'react-native';
import { Text } from './nativewindui/Text';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle, className }) => {
  return (
    <View className={`items-center justify-center rounded-3xl bg-card p-8 ${className ?? ''}`}>
      <Text variant="title2" className="mb-2 text-center font-medium">
        {title}
      </Text>
      <Text variant="body" className="text-center text-gray-500 dark:text-gray-400">
        {subtitle}
      </Text>
    </View>
  );
};
