import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

//import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  //.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lang: "en",
    fallbackLng: {
      "en-US": ["en"],
      default: ["en"]
    },
    debug: true,
    keySeparator: false,
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json"
    },
    react: {
      wait: true
    }
  });

export default i18n;
