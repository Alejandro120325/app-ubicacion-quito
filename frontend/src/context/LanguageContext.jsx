import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { languages, translations } from "../i18n/translations.js";

const LANGUAGE_KEY = "quito-ui-language";
const FALLBACK_LANGUAGE = "es";

const LanguageContext = createContext(null);

const getStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    return languages.some((language) => language.id === stored)
      ? stored
      : FALLBACK_LANGUAGE;
  } catch {
    return FALLBACK_LANGUAGE;
  }
};

const formatText = (value, params = {}) =>
  value.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? "");

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en-US" : "es-EC";
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  const value = useMemo(() => {
    const t = (key, params) => {
      const phrase =
        translations[language]?.[key] ??
        translations[FALLBACK_LANGUAGE]?.[key] ??
        key;

      return typeof phrase === "string" ? formatText(phrase, params) : phrase;
    };

    return {
      language,
      languages,
      setLanguage,
      t
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  }

  return context;
};
