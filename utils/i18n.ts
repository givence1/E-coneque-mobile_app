import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translationKeys } from "./translationKeysen";
import { translationKeysFr } from "./translationKeysFr";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { translation: translationKeys },
    fr: { translation: translationKeysFr },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
