import en from 'translation/en.json';
import es from 'translation/es.json';
import fr from 'translation/fr.json';
import pt from 'translation/pt.json';

import { init18n } from '~/utils/i18n/init';

export const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  pt: {
    translation: pt,
  },
  fr: {
    translation: fr,
  },
};

export const fallbackLng = 'en';

export type LanguageCode = keyof typeof resources;

const i18n = init18n({ resources, fallbackLng });

export default i18n;
