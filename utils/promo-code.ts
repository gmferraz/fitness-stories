import { MMKV } from 'react-native-mmkv';
import { supabase } from './supabase';

export const promoCodeStorage = new MMKV();
const PROMO_CODE_ENABLED_KEY = 'promoCodeEnabled';

export const checkAndUpdatePromoCodeAvailability = async () => {
  try {
    const { data, error } = await supabase
      .from('codes')
      .select('*')
      .eq('code', 'isPromoEnabled')
      .single();

    if (error) {
      console.error('Error checking promo code availability:', error);
      promoCodeStorage.set(PROMO_CODE_ENABLED_KEY, false);
      return false;
    }

    const isEnabled = data?.enabled ?? false;
    promoCodeStorage.set(PROMO_CODE_ENABLED_KEY, isEnabled);
    return isEnabled;
  } catch (error) {
    console.error('Error checking promo code availability:', error);
    promoCodeStorage.set(PROMO_CODE_ENABLED_KEY, false);
    return false;
  }
};

export const isPromoCodeEnabled = () => {
  return promoCodeStorage.getBoolean(PROMO_CODE_ENABLED_KEY) ?? false;
};
