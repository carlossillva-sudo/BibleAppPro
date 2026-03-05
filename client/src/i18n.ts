import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      privacy: {
        title: 'Política de Privacidade',
        back: 'Voltar',
      },
      common: {
        welcome: 'Bem-vindo',
      },
    },
  },
  en: {
    translation: {
      privacy: {
        title: 'Privacy Policy',
        back: 'Back',
      },
      common: {
        welcome: 'Welcome',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt',
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
