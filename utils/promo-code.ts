import { MMKV } from 'react-native-mmkv';
import { supabase } from './supabase';

const storage = new MMKV();
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
      storage.set(PROMO_CODE_ENABLED_KEY, false);
      return false;
    }

    const isEnabled = data?.enabled ?? false;
    storage.set(PROMO_CODE_ENABLED_KEY, isEnabled);
    return isEnabled;
  } catch (error) {
    console.error('Error checking promo code availability:', error);
    storage.set(PROMO_CODE_ENABLED_KEY, false);
    return false;
  }
};

export const isPromoCodeEnabled = () => {
  return storage.getBoolean(PROMO_CODE_ENABLED_KEY) ?? false;
};
