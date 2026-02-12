# Hierophant Hymn - Territory Generator

A procedural territory generation system for a medieval grand strategy game. Built with TypeScript, React, and HTML5 Canvas.

## Features

### Phase 1 (Complete) ✓
- **Voronoi-based Territory Generation**: Uses Delaunay triangulation with Lloyd's relaxation for natural-looking borders
- **Medieval Name Generator**: Procedurally generates realistic medieval territory names
- **Color Distribution**: Smart HSL-based color palette for visually distinct territories
- **Interactive Canvas**: Hover over territories to see details
- **Export/Import**: Save and load maps as JSON

## Architecture

### Core Technologies
- **TypeScript**: Type-safe code with full IDE support
- **React 18**: Modern component architecture
- **Vite**: Lightning-fast build tool and dev server
- **d3-delaunay**: Efficient Voronoi diagram implementation
- **HTML5 Canvas**: High-performance rendering

### Key Design Decisions

1. **Lloyd's Relaxation**: Applied to initial random points to create more evenly distributed, natural-looking territories
2. **Seeded Random Generation**: All randomness is seeded for reproducible maps
3. **Point-in-Polygon Detection**: Efficient ray-casting algorithm for hover detection
4. **HSL Color Generation**: Uses golden ratio distribution for maximum visual distinction
5. **Modular Architecture**: Separated concerns (types, utils, components) for maintainability

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Usage

1. **Adjust Territory Count**: Use the slider to control how many territories to generate (5-50)
2. **Regenerate**: Click "Regenerate Map" to create a new random map
3. **Hover**: Move your mouse over territories to see their details
4. **Export**: Save the current map as JSON
5. **Import**: Load a previously saved map

## Project Structure

```
src/
├── components/
│   └── MapCanvas.tsx         # Canvas rendering and interaction
├── types/
│   └── Territory.ts          # TypeScript interfaces
├── utils/
│   ├── mapGenerator.ts       # Core Voronoi generation logic
│   ├── nameGenerator.ts      # Medieval name generation
│   └── colorGenerator.ts     # Color palette generation
├── App.tsx                   # Main application component
└── main.tsx                  # Entry point
```

## Roadmap

### Phase 2: Metadata System (Next)
- Population ranges
- Terrain types (plains, mountains, forests, desert)
- Resources (food, gold, military)
- Culture/religion flags

### Phase 3: Advanced Features
- Territory relationships (neighbors, alliances)
- Historical generation (simulate territory changes over time)
- Advanced export options

## Technical Details

### Voronoi Generation Process
1. Generate N random seed points
2. Apply Lloyd's relaxation (2 iterations by default) to improve distribution
3. Create Delaunay triangulation
4. Generate Voronoi diagram with map bounds clipping
5. Extract polygon coordinates for each cell

### Name Generation
- Combines syllable patterns (prefix + middle + suffix)
- Seeded randomness ensures reproducible names
- Avoids duplicates within a single map

### Color Generation
- HSL color space for perceptual uniformity
- Golden ratio (φ ≈ 0.618) for hue distribution
- Muted saturation (50-70%) for strategic map aesthetic

## License

MIT

---

Built by Alexander Wu for Hierophant Hymn
