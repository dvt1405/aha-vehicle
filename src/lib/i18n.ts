import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import viCommon from '../../public/locales/vi/common.json';

const resources = {
  vi: {
    common: viCommon,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // default language (Vietnamese)
    fallbackLng: 'vi',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;