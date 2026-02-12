# Hierophant Hymn - Territory Generator

A procedural territory generation system for a medieval grand strategy game. Built with TypeScript, React, and HTML5 Canvas.

## Features

### Phase 1 (Complete) ✓
- **Voronoi-based Territory Generation**: Uses Delaunay triangulation with Lloyd's relaxation for natural-looking borders
- **Medieval Name Generator**: Procedurally generates realistic medieval territory names
- **Interactive Canvas**: Hover over territories to see detailed information
- **Export/Import**: Save and load maps as JSON

### Phase 2 (Complete) ✓
- **Terrain-Based Generation**: Realistic terrain distribution (plains, forests, mountains, deserts, hills, coastal)
- **Territory Metadata**: Each territory includes population, culture, development level, and resources
- **Terrain-Aware Colors**: Visual color coding based on terrain types for immediate map readability
- **Resource System**: Food, gold, and military resources influenced by terrain
- **Enhanced Statistics**: View total population, average development, and terrain distribution
- **Zoom & Pan**: Interactive canvas with mouse wheel zoom and click-drag panning
- **Custom Seeds**: Enter specific seed numbers for reproducible map generation
- **Improved Generation**: Better relaxation algorithm (3 iterations) and edge padding for more natural territories

## Architecture

### Core Technologies
- **TypeScript**: Type-safe code with full IDE support
- **React 18**: Modern component architecture
- **Vite**: Lightning-fast build tool and dev server
- **d3-delaunay**: Efficient Voronoi diagram implementation
- **HTML5 Canvas**: High-performance rendering

### Key Design Decisions

1. **Lloyd's Relaxation**: 3 iterations applied to initial random points for evenly distributed, natural-looking territories
2. **Seeded Random Generation**: All randomness is seeded for fully reproducible maps
3. **Terrain-Based Generation**: Position-aware terrain distribution (mountains at edges, plains in center, coastal near borders)
4. **Realistic Metadata**: Population scales with territory area and terrain type; resources influenced by terrain
5. **Terrain-Aware Colors**: Color hues match terrain types for intuitive visual understanding
6. **Point-in-Polygon Detection**: Efficient ray-casting algorithm for hover detection with zoom/pan support
7. **Canvas Transformations**: Hardware-accelerated zoom and pan for smooth interaction
8. **Modular Architecture**: Separated concerns (types, utils, components) for maintainability

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Usage

1. **Adjust Territory Count**: Use the slider to control how many territories to generate (5-50)
2. **Custom Seeds**: Check "Use Custom Seed" to enter a specific seed for reproducible maps
3. **Regenerate**: Click "Regenerate Map" to create a new map
4. **Explore the Map**:
   - Hover over territories to see detailed metadata (population, culture, terrain, resources)
   - Click and drag to pan around the map
   - Use mouse wheel to zoom in/out
   - Click zoom controls (+/-) or Reset button
5. **View Statistics**: See total population, average development, and terrain distribution
6. **Export/Import**: Save and load maps as JSON with all metadata preserved

## Project Structure

```
src/
├── components/
│   └── MapCanvas.tsx         # Canvas rendering, zoom/pan, and interaction
├── types/
│   └── Territory.ts          # TypeScript interfaces (Territory, TerrainType, Metadata)
├── utils/
│   ├── mapGenerator.ts       # Core Voronoi generation with Lloyd's relaxation
│   ├── metadataGenerator.ts  # Terrain, population, and resource generation
│   ├── nameGenerator.ts      # Medieval name generation
│   └── colorGenerator.ts     # Terrain-aware color generation
├── App.tsx                   # Main application component
└── main.tsx                  # Entry point
```

## Roadmap

### Phase 3: Advanced Features (Next)
- Territory relationships (neighbors, borders, alliances)
- Historical generation (simulate territory changes over time)
- Diplomacy system (trade routes, wars, treaties)
- Advanced filtering (show only specific terrain types, resource-rich areas)
- Mini-map overview
- Save/load multiple map presets
- Advanced export options (PNG, SVG, CSV data)

## Technical Details

### Voronoi Generation Process
1. Generate N random seed points with edge padding
2. Apply Lloyd's relaxation (3 iterations) to improve distribution
3. Create Delaunay triangulation
4. Generate Voronoi diagram with map bounds clipping
5. Extract polygon coordinates and calculate area for each cell
6. Generate terrain based on position (distance from center/edges)
7. Generate metadata (population, resources, culture) based on terrain and area
8. Generate terrain-aware colors for visual cohesion

### Metadata Generation
- **Terrain**: Position-based algorithm (mountains at edges, plains in center, coastal near borders)
- **Population**: Base population by terrain type, scaled by territory area
- **Resources**: Food, gold, and military values influenced by terrain characteristics
- **Culture**: Randomly assigned from 12 medieval cultures
- **Development**: Calculated from resource values (gold 40%, food 30%, military 30%)

### Name Generation
- Combines syllable patterns (prefix + middle + suffix)
- Seeded randomness ensures reproducible names
- Avoids duplicates within a single map

### Color Generation
- Terrain-aware HSL color space for intuitive visual understanding
- Each terrain type has a base hue range (green for forests, blue for coastal, etc.)
- Variation within terrain types for territory distinction
- Muted saturation (40-70%) for strategic map aesthetic

## License

MIT

---

Built by Alexander Wu for Hierophant Hymn
