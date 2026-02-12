/**
 * Medieval territory name generator
 * Creates realistic-sounding medieval names using syllable combinations
 */

import { SeededRandom } from './seededRandom';

const prefixes = [
  'Ald', 'Bal', 'Cor', 'Dun', 'Eld', 'Fal', 'Gar', 'Hil', 'Kal', 'Lor',
  'Mor', 'Nor', 'Ost', 'Pel', 'Quen', 'Rav', 'Sil', 'Thal', 'Val', 'Wel',
  'Wyn', 'Xer', 'Yor', 'Zar', 'Bran', 'Crim', 'Drak', 'Eber', 'Frey', 'Glen'
];

const middles = [
  'dor', 'mar', 'wen', 'thor', 'var', 'len', 'dan', 'kel', 'rin', 'mor',
  'wyn', 'dal', 'gar', 'ven', 'ton', 'burg', 'ham', 'shire', 'dale', 'wood',
  'mer', 'son', 'ter', 'den', 'ford', 'mont', 'vale', 'ridge', 'stone', 'haven'
];

const suffixes = [
  'ia', 'or', 'en', 'ar', 'on', 'us', 'um', 'land', 'mark', 'reich',
  'dom', 'hold', 'stead', 'ton', 'field', 'mere', 'moor', 'crest', 'peak', 'watch'
];

/**
 * Generate a medieval-sounding territory name
 * @param seed - Seed for reproducible generation
 * @returns A unique territory name
 */
export function generateTerritoryName(seed: number): string {
  const rng = new SeededRandom(seed);

  // Randomly decide name structure:
  // 60% chance: prefix + middle + suffix
  // 30% chance: prefix + suffix
  // 10% chance: prefix + middle
  const rand = rng.next();

  const prefix = prefixes[Math.floor(rng.next() * prefixes.length)];
  const middle = middles[Math.floor(rng.next() * middles.length)];
  const suffix = suffixes[Math.floor(rng.next() * suffixes.length)];

  if (rand < 0.6) {
    return prefix + middle + suffix;
  } else if (rand < 0.9) {
    return prefix + suffix;
  } else {
    return prefix + middle;
  }
}

/**
 * Generate a set of unique territory names
 * @param count - Number of names to generate
 * @param baseSeed - Base seed for generation
 * @returns Array of unique territory names
 */
export function generateTerritoryNames(count: number, baseSeed: number = Date.now()): string[] {
  const names = new Set<string>();
  let seed = baseSeed;

  while (names.size < count) {
    const name = generateTerritoryName(seed);
    names.add(name);
    seed++;
  }

  return Array.from(names);
}
