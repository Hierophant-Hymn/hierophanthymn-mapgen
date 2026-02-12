/**
 * Color generation utilities for territories
 * Generates visually distinct colors with medieval/strategic map aesthetics
 */

/**
 * Generate a color using HSL for better distribution
 * @param index - Territory index
 * @param _total - Total number of territories (unused, kept for API compatibility)
 * @param seed - Seed for color variation
 * @returns Hex color string
 */
export function generateTerritoryColor(index: number, _total: number, seed: number = 0): string {
  // Use golden ratio for hue distribution to maximize color distinction
  const goldenRatio = 0.618033988749895;

  // Base hue distributed evenly
  const hue = ((index * goldenRatio + seed * 0.1) % 1) * 360;

  // Saturation: 50-70% for muted, strategic map colors
  const saturation = 50 + (seed % 20);

  // Lightness: 45-65% for good visibility
  const lightness = 45 + ((index * 7 + seed) % 20);

  return hslToHex(hue, saturation, lightness);
}

/**
 * Convert HSL to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;

  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generate a set of visually distinct colors
 * @param count - Number of colors to generate
 * @param seed - Seed for reproducibility
 * @returns Array of hex color strings
 */
export function generateColorPalette(count: number, seed: number = 0): string[] {
  return Array.from({ length: count }, (_, i) => generateTerritoryColor(i, count, seed));
}
