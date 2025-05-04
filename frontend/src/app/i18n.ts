import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationData from './i18n.json';

type TranslationData = typeof translationData;
type Language = keyof TranslationData;

const resources = Object.keys(translationData).reduce((acc, lang) => {
  const language = lang as Language;
  acc[language] = { translation: translationData[language] };
  return acc;
}, {} as Record<Language, { translation: TranslationData[Language] }>);

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const storedLang = localStorage.getItem('lang');
    if (storedLang && resources[storedLang as Language]) return storedLang;
  }
  return 'en';
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: getInitialLanguage(),
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
}

export default i18n;