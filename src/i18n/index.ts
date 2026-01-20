import en from "../locales/en.json";
import uk from "../locales/uk.json";
import pl from "../locales/pl.json";

export type Locale = "en" | "uk" | "pl";

export const DEFAULT_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES: Locale[] = ["en", "uk", "pl"];

type ErrorTranslations = typeof en;

const locales: Record<Locale, ErrorTranslations> = { en, uk, pl };

/**
 * Get translated error message
 * @param errorCode - Error code key (e.g., 'ROOM_NOT_FOUND')
 * @param locale - Target locale
 * @returns Translated error message (falls back to English)
 */
export function getErrorMessage(
  errorCode: keyof typeof en.errors,
  locale: Locale = "en",
): string {
  const translations = locales[locale] || locales.en;
  return translations.errors[errorCode] || locales.en.errors[errorCode] || errorCode;
}

/**
 * Validate and normalize locale
 */
export function normalizeLocale(locale: string | undefined): Locale {
  if (locale && SUPPORTED_LOCALES.includes(locale as Locale)) {
    return locale as Locale;
  }
  return DEFAULT_LOCALE;
}
