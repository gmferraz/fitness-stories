import { StyleSheet, View } from 'react-native';

import { Text } from '~/components/nativewindui/Text';

export interface AppSetupErrorFallbackProps {}

export const AppSetupErrorFallback = () => {
  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      <Text numberOfLines={2}>Something went wrong while loading the app - please restart.</Text>
    </View>
  );
};
