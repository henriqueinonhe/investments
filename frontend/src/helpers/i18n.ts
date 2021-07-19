import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../locale/en.locale.json";
import ptTranslations from "../locale/pt.locale.json";

i18n
  .use(initReactI18next)
  .init({
    lng: "pt",
    defaultNS: "common",
    fallbackNS: ["common"],
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: enTranslations,
      pt: ptTranslations
    }
  });

export default i18n;