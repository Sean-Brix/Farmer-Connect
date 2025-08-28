import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initI18n = () => {
  return i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',

      ns: ['translation'],
      defaultNS: 'translation',

      backend: {
        loadPath: path.join(__dirname, 'locales', '{{lng}}', '{{ns}}.json'),
      },

      detection: {
        order: ['header', 'querystring'],
        lookupHeader: 'accept-language',
        lookupQuerystring: 'lang',
        caches: false,
      },

      interpolation: {
        escapeValue: false,
      },
    });
};

export { initI18n, middleware };
export default i18next;
