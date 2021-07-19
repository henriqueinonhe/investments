import { useTranslation } from "react-i18next";

export interface LocalizationFunctions {
  formatNumber : (value : number) => string;
  formatCurrency : (value : number) => string;
  formatDate : (value : string) => string;
}

export function useLocalization() : LocalizationFunctions {
  const { i18n } = useTranslation();

  const locale = i18n.language;

  const formatNumber = new Intl.NumberFormat(locale).format;
  const formatCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2
  }).format;
  const formatDate = (date : string) : string => 
    new Intl.DateTimeFormat(locale, {
      timeZone: "utc"
    }).format(new Date(date));

  return {
    formatNumber,
    formatCurrency,
    formatDate
  };
}