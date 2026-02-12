/**
 * Core Territory interface for Phase 1
 * Represents a single territory in the generated map
 */
export interface Territory {
  id: string;
  name: string;
  color: string;
  centerX: number;
  centerY: number;
  // Polygon points defining the territory border
  borderPoints: [number, number][];
}

/**
 * Configuration for map generation
 */
export interface MapConfig {
  width: number;
  height: number;
  territoryCount: number;
  seed?: number;
}
