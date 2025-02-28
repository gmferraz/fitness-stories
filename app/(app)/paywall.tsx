import { useLocalSearchParams } from 'expo-router';
import { Paywall, PaywallPreset } from '~/features/paywall';

export default function PaywallScreen() {
  const { preset } = useLocalSearchParams<{ preset: PaywallPreset }>();

  return <Paywall preset={preset as PaywallPreset} />;
}
