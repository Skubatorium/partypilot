import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import de from './locales/de.json'
import en from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en }
    },
    fallbackLng: 'de',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false
    },

    detection: {
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0
    }
  })

export default i18n 