/**
 * Terrain types for territories
 */
export enum TerrainType {
  PLAINS = 'plains',
  FOREST = 'forest',
  MOUNTAINS = 'mountains',
  DESERT = 'desert',
  HILLS = 'hills',
  COASTAL = 'coastal'
}

/**
 * Resources available in territories
 */
export interface TerritoryResources {
  food: number;        // 1-100
  gold: number;        // 1-100
  military: number;    // 1-100
}

/**
 * Territory metadata for Phase 2
 */
export interface TerritoryMetadata {
  population: number;
  terrain: TerrainType;
  resources: TerritoryResources;
  culture: string;
  development: number; // 1-100, represents infrastructure/civilization level
}

/**
 * Core Territory interface
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
  // Phase 2: Metadata
  metadata: TerritoryMetadata;
  // Calculated area (for realistic population density)
  area?: number;
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
