'use client'

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import en from './public/locales/en/translation.json';
import gu from './public/locales/gu/translation.json';
import hi from './public/locales/hi/translation.json';
import mr from './public/locales/mr/translation.json';

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        hi: { translation: hi },
        mr: { translation: mr },
        gu: { translation: gu },
      },
      fallbackLng: 'en',
      debug: true,
      nonExplicitSupportedLngs: true, // en-IN → en
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;