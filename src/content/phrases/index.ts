import { Phrase } from "../../types";
import { Locale } from "../../i18n";
import { PHRASE_POOL_EN } from "./en";
import { PHRASE_POOL_UK } from "./uk";
import { PHRASE_POOL_PL } from "./pl";

const PHRASE_POOLS: Record<Locale, Phrase[]> = {
  en: PHRASE_POOL_EN,
  uk: PHRASE_POOL_UK,
  pl: PHRASE_POOL_PL,
};

/**
 * Get random phrases for a specific locale
 */
export function getRandomPhrases(
  count: number,
  usedIds: string[],
  locale: Locale = "en",
): Phrase[] {
  const pool = PHRASE_POOLS[locale] || PHRASE_POOLS.en;
  const available = pool.filter((p) => !usedIds.includes(p.id));

  // Shuffle and take count
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get a phrase by ID from any locale pool
 */
export function getPhraseById(id: string): Phrase | undefined {
  // Determine locale from ID prefix
  const locale = id.split("-")[0] as Locale;
  const pool = PHRASE_POOLS[locale] || PHRASE_POOLS.en;
  return pool.find((p) => p.id === id);
}
