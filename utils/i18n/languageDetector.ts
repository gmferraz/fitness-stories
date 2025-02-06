import * as Localization from 'expo-localization';
import { LanguageDetectorModule } from 'i18next';
import { MMKV } from 'react-native-mmkv';

const LANGUAGE_KEY = 'user_language';
const storage = new MMKV();

export const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () => {
    try {
      const storedLanguage = storage.getString(LANGUAGE_KEY);
      if (storedLanguage) {
        return storedLanguage;
      }
      const locales = Localization.getLocales();
      return locales[0].languageCode ?? 'en';
    } catch (error) {
      console.error('Error detecting language:', error);
      return 'en';
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      storage.set(LANGUAGE_KEY, lng);
    } catch (error) {
      console.error('Error caching user language:', error);
    }
  },
};
