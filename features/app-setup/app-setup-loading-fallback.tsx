import { StyleSheet, View } from 'react-native';

import { ActivityIndicator } from '~/components/nativewindui/ActivityIndicator';
import { useColorScheme } from '~/lib/useColorScheme';

export interface AppSetupLoadingFallbackProps {}

export const AppSetupLoadingFallback = () => {
  const { colors } = useColorScheme();
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
      ]}>
      <ActivityIndicator size="large" />
    </View>
  );
};
