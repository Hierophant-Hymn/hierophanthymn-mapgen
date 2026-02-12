import { TerrainType, TerritoryMetadata } from '../types/Territory';

/**
 * Seeded random number generator
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

/**
 * Medieval culture names
 */
const cultures = [
  'Gothic', 'Norman', 'Saxon', 'Celtic', 'Frankish', 'Byzantine',
  'Slavic', 'Norse', 'Iberian', 'Lombard', 'Moorish', 'Venetian'
];

/**
 * Determine terrain type based on position and seed
 * Uses distance from center and edges to create natural terrain distribution
 */
export function generateTerrain(
  x: number,
  y: number,
  width: number,
  height: number,
  seed: number
): TerrainType {
  const rng = new SeededRandom(seed);

  // Calculate distance from center
  const centerX = width / 2;
  const centerY = height / 2;
  const distFromCenter = Math.sqrt(
    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
  );
  const maxDist = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
  const normalizedDist = distFromCenter / maxDist;

  // Calculate distance from edges
  const distFromEdge = Math.min(x, y, width - x, height - y);
  const normalizedEdgeDist = distFromEdge / Math.min(width, height);

  // Terrain probabilities based on position
  const rand = rng.next();

  // Mountains more likely near edges
  if (normalizedEdgeDist < 0.15 && rand < 0.6) {
    return TerrainType.MOUNTAINS;
  }

  // Coastal near edges but not in corners
  if (normalizedEdgeDist < 0.2 && normalizedDist < 0.7 && rand < 0.7) {
    return TerrainType.COASTAL;
  }

  // Hills transition between mountains and plains
  if (normalizedEdgeDist < 0.3 && rand < 0.5) {
    return TerrainType.HILLS;
  }

  // Plains more common in center
  if (normalizedDist < 0.5 && rand < 0.6) {
    return TerrainType.PLAINS;
  }

  // Forest scattered throughout
  if (rand < 0.25) {
    return TerrainType.FOREST;
  }

  // Desert in specific regions
  if (normalizedDist > 0.6 && rand < 0.3) {
    return TerrainType.DESERT;
  }

  // Default to plains
  return TerrainType.PLAINS;
}

/**
 * Generate resources based on terrain type
 */
function generateResources(terrain: TerrainType, seed: number): {
  food: number;
  gold: number;
  military: number;
} {
  const rng = new SeededRandom(seed);

  let food: number, gold: number, military: number;

  switch (terrain) {
    case TerrainType.PLAINS:
      food = rng.nextInt(70, 95);
      gold = rng.nextInt(40, 60);
      military = rng.nextInt(50, 70);
      break;

    case TerrainType.FOREST:
      food = rng.nextInt(60, 80);
      gold = rng.nextInt(30, 50);
      military = rng.nextInt(40, 60);
      break;

    case TerrainType.MOUNTAINS:
      food = rng.nextInt(20, 40);
      gold = rng.nextInt(70, 95);
      military = rng.nextInt(60, 85);
      break;

    case TerrainType.DESERT:
      food = rng.nextInt(15, 35);
      gold = rng.nextInt(50, 80);
      military = rng.nextInt(30, 50);
      break;

    case TerrainType.HILLS:
      food = rng.nextInt(50, 70);
      gold = rng.nextInt(55, 75);
      military = rng.nextInt(55, 75);
      break;

    case TerrainType.COASTAL:
      food = rng.nextInt(65, 85);
      gold = rng.nextInt(60, 85);
      military = rng.nextInt(45, 65);
      break;

    default:
      food = 50;
      gold = 50;
      military = 50;
  }

  return { food, gold, military };
}

/**
 * Calculate territory area from border points
 */
export function calculateArea(borderPoints: [number, number][]): number {
  let area = 0;
  const n = borderPoints.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += borderPoints[i][0] * borderPoints[j][1];
    area -= borderPoints[j][0] * borderPoints[i][1];
  }

  return Math.abs(area / 2);
}

/**
 * Generate complete metadata for a territory
 */
export function generateMetadata(
  x: number,
  y: number,
  width: number,
  height: number,
  area: number,
  seed: number
): TerritoryMetadata {
  const rng = new SeededRandom(seed);

  // Determine terrain
  const terrain = generateTerrain(x, y, width, height, seed);

  // Generate resources
  const resources = generateResources(terrain, seed + 1000);

  // Calculate population based on terrain and area
  let basePopulation: number;
  switch (terrain) {
    case TerrainType.PLAINS:
      basePopulation = rng.nextInt(8000, 15000);
      break;
    case TerrainType.FOREST:
      basePopulation = rng.nextInt(5000, 10000);
      break;
    case TerrainType.MOUNTAINS:
      basePopulation = rng.nextInt(2000, 5000);
      break;
    case TerrainType.DESERT:
      basePopulation = rng.nextInt(1000, 4000);
      break;
    case TerrainType.HILLS:
      basePopulation = rng.nextInt(6000, 12000);
      break;
    case TerrainType.COASTAL:
      basePopulation = rng.nextInt(10000, 18000);
      break;
    default:
      basePopulation = 5000;
  }

  // Scale population by area (larger territories = more people)
  const avgArea = (width * height) / 30; // Assuming ~30 territories average
  const areaMultiplier = Math.sqrt(area / avgArea);
  const population = Math.round(basePopulation * areaMultiplier);

  // Development level based on terrain and resources
  const development = Math.round(
    (resources.gold * 0.4 + resources.food * 0.3 + resources.military * 0.3)
  );

  // Assign culture
  const culture = cultures[rng.nextInt(0, cultures.length - 1)];

  return {
    population,
    terrain,
    resources,
    culture,
    development
  };
}
