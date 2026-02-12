import { Delaunay } from 'd3-delaunay';
import { Territory, MapConfig } from '../types/Territory';
import { generateTerritoryNames } from './nameGenerator';
import { generateTerrainColor } from './colorGenerator';
import { generateMetadata, calculateArea } from './metadataGenerator';

/**
 * Core map generator using Voronoi diagrams
 *
 * Architecture:
 * 1. Generate random seed points (Lloyd's relaxation for better distribution)
 * 2. Create Voronoi diagram using Delaunay triangulation
 * 3. Clip polygons to map bounds
 * 4. Generate names and colors for each territory
 */

/**
 * Seeded random number generator for reproducible maps
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
}

/**
 * Generate random points with Lloyd's relaxation for better distribution
 * Lloyd's algorithm iteratively moves points toward the centroid of their Voronoi cell
 * This creates more natural-looking, evenly-spaced territories
 */
function generateRelaxedPoints(
  count: number,
  width: number,
  height: number,
  seed: number,
  relaxationIterations: number = 2
): [number, number][] {
  const rng = new SeededRandom(seed);

  // Generate initial random points
  let points: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    points.push([
      rng.next() * width,
      rng.next() * height
    ]);
  }

  // Apply Lloyd's relaxation
  for (let iteration = 0; iteration < relaxationIterations; iteration++) {
    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    const newPoints: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      const cell = voronoi.cellPolygon(i);
      if (cell) {
        // Calculate centroid of the cell
        let cx = 0, cy = 0;
        for (const [x, y] of cell) {
          cx += x;
          cy += y;
        }
        cx /= cell.length;
        cy /= cell.length;
        newPoints.push([cx, cy]);
      } else {
        // Keep original point if cell calculation fails
        newPoints.push(points[i]);
      }
    }
    points = newPoints;
  }

  return points;
}

/**
 * Generate a complete map with territories
 * @param config - Map configuration
 * @returns Array of territories with names, colors, and borders
 */
export function generateMap(config: MapConfig): Territory[] {
  const { width, height, territoryCount, seed = Date.now() } = config;

  // Generate well-distributed seed points
  const points = generateRelaxedPoints(territoryCount, width, height, seed);

  // Create Voronoi diagram
  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, width, height]);

  // Generate names
  const names = generateTerritoryNames(territoryCount, seed);

  // Build territory objects
  const territories: Territory[] = [];

  for (let i = 0; i < territoryCount; i++) {
    const cell = voronoi.cellPolygon(i);

    if (cell) {
      // Remove duplicate closing point if present
      const borderPoints: [number, number][] = cell.slice(0, -1);

      // Calculate territory area
      const area = calculateArea(borderPoints);

      // Generate metadata based on position and area
      const metadata = generateMetadata(
        points[i][0],
        points[i][1],
        width,
        height,
        area,
        seed + i
      );

      // Generate terrain-aware color
      const color = generateTerrainColor(metadata.terrain, i, seed);

      territories.push({
        id: `territory-${i}`,
        name: names[i],
        color,
        centerX: points[i][0],
        centerY: points[i][1],
        borderPoints,
        area,
        metadata
      });
    }
  }

  return territories;
}

/**
 * Re-generate a map with the same configuration but new seed
 */
export function regenerateMap(config: MapConfig): Territory[] {
  return generateMap({
    ...config,
    seed: Date.now()
  });
}
