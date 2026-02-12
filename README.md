# Hierophant Hymn - Territory Generator

> A procedural territory generation system for a medieval grand strategy game. Built with TypeScript, React, and HTML5 Canvas.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

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

## Quick Start

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hierophant-Hymn/hierophanthymn-mapgen.git
cd hierophanthymn-mapgen

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Usage Guide

### Generating Maps

1. **Adjust Territory Count**: Use the slider to control how many territories to generate (5-50)
2. **Custom Seeds**: Check "Use Custom Seed" to enter a specific seed for reproducible maps
   - Same seed always generates the same map
   - Share seeds with others to recreate exact maps
3. **Regenerate**: Click "Regenerate Map" to create a new map

### Exploring the Map

- **Hover**: Move your mouse over territories to see detailed information
- **Pan**: Click and drag to move around the map
- **Zoom In/Out**: 
  - Use mouse wheel to zoom
  - Click the +/- buttons in the top-right corner
- **Reset View**: Click the "Reset" button to return to default zoom and position

### Territory Information

When hovering over a territory, you'll see:
- **Demographics**: Population, culture, development level
- **Terrain**: Type and area size
- **Resources**: Food, gold, and military production values (1-100)

### Saving and Loading

- **Export**: Click "Export JSON" to download your current map
- **Import**: Click "Import JSON" to load a previously saved map
  - All territory data, names, and metadata are preserved

## Architecture

### Core Technologies

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe code with full IDE support |
| **React 18** | Modern component architecture |
| **Vite** | Lightning-fast build tool and dev server |
| **d3-delaunay** | Efficient Voronoi diagram implementation |
| **HTML5 Canvas** | High-performance rendering |

### Key Design Decisions

1. **Lloyd's Relaxation**: 3 iterations applied to initial random points for evenly distributed, natural-looking territories
2. **Seeded Random Generation**: All randomness is seeded for fully reproducible maps
3. **Terrain-Based Generation**: Position-aware terrain distribution (mountains at edges, plains in center, coastal near borders)
4. **Realistic Metadata**: Population scales with territory area and terrain type; resources influenced by terrain
5. **Terrain-Aware Colors**: Color hues match terrain types for intuitive visual understanding
6. **Point-in-Polygon Detection**: Efficient ray-casting algorithm for hover detection with zoom/pan support
7. **Canvas Transformations**: Hardware-accelerated zoom and pan for smooth interaction
8. **Modular Architecture**: Separated concerns (types, utils, components) for maintainability

### Voronoi Generation Process

```
1. Generate N random seed points with edge padding
2. Apply Lloyd's relaxation (3 iterations) to improve distribution
3. Create Delaunay triangulation
4. Generate Voronoi diagram with map bounds clipping
5. Extract polygon coordinates and calculate area for each cell
6. Generate terrain based on position (distance from center/edges)
7. Generate metadata (population, resources, culture) based on terrain and area
8. Generate terrain-aware colors for visual cohesion
```

## Project Structure

```
hierophanthymn-mapgen/
├── src/
│   ├── components/
│   │   └── MapCanvas.tsx         # Canvas rendering, zoom/pan, and interaction
│   ├── types/
│   │   └── Territory.ts          # TypeScript interfaces (Territory, TerrainType, Metadata)
│   ├── utils/
│   │   ├── mapGenerator.ts       # Core Voronoi generation with Lloyd's relaxation
│   │   ├── metadataGenerator.ts  # Terrain, population, and resource generation
│   │   ├── nameGenerator.ts      # Medieval name generation
│   │   └── colorGenerator.ts     # Terrain-aware color generation
│   ├── App.tsx                   # Main application component
│   ├── App.css                   # Application styles
│   └── main.tsx                  # Entry point
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
└── README.md                     # This file
```

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (TypeScript check + Vite build) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Code Style

This project uses ESLint with TypeScript rules. Run `npm run lint` before committing.

### Adding New Features

1. **New terrain types**: Add to `TerrainType` enum in `src/types/Territory.ts`
2. **New territory properties**: Update `TerritoryMetadata` interface
3. **New generation algorithms**: Add to `src/utils/` directory
4. **New UI components**: Add to `src/components/` directory

## Troubleshooting

### Issue: "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use

```bash
# Kill process on port 5173 (Linux/Mac)
lsof -ti:5173 | xargs kill -9

# Or specify different port
npm run dev -- --port 3000
```

### Issue: Build fails with TypeScript errors

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update TypeScript
npm install -D typescript@latest
```

### Issue: Map doesn't render

1. Check browser console for errors
2. Verify canvas width/height are valid
3. Ensure territory count is between 5-50
4. Try regenerating with default settings

## Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check if the bug is already reported in [Issues](https://github.com/Hierophant-Hymn/hierophanthymn-mapgen/issues)
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

Open an issue with the "enhancement" label describing:
- The feature you'd like to see
- Why it would be useful
- How it might work

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m "Add feature: description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add TypeScript types for new code
- Keep functions small and focused
- Comment complex algorithms
- Test your changes manually

## Roadmap

### Phase 3: Advanced Features (Planned)

- [ ] Territory relationships (neighbors, borders, alliances)
- [ ] Historical generation (simulate territory changes over time)
- [ ] Diplomacy system (trade routes, wars, treaties)
- [ ] Advanced filtering (show only specific terrain types, resource-rich areas)
- [ ] Mini-map overview
- [ ] Save/load multiple map presets
- [ ] Advanced export options (PNG, SVG, CSV data)
- [ ] Keyboard navigation and accessibility improvements
- [ ] Mobile/touch support
- [ ] 3D terrain visualization

### Future Improvements

- [ ] Add unit tests (Vitest)
- [ ] Add component tests (React Testing Library)
- [ ] Performance optimization for large maps (50+ territories)
- [ ] Undo/redo functionality
- [ ] Map editor mode (manually adjust territories)
- [ ] Different map shapes (circular, irregular)
- [ ] Climate zones affecting terrain
- [ ] River and road generation

## Technical Details

### Metadata Generation

- **Terrain**: Position-based algorithm
  - Mountains: Near edges (distance < 15% from edge)
  - Coastal: Near edges but not corners
  - Plains: Center regions
  - Hills: Transition zones
  - Forest: Scattered throughout
  - Desert: Specific regions based on distance from center

- **Population**: Base population by terrain type, scaled by territory area
  - Plains: 8,000-15,000 base
  - Coastal: 10,000-18,000 base
  - Forest: 5,000-10,000 base
  - Mountains: 2,000-5,000 base
  - Area multiplier adjusts for territory size

- **Resources**: Terrain-specific ranges
  - Food: Best in plains (70-95), worst in desert/mountains
  - Gold: Best in mountains (70-95), good in coastal
  - Military: Best in mountains (60-85), good in hills

- **Culture**: Randomly assigned from 12 medieval cultures
  - Gothic, Norman, Saxon, Celtic, Frankish, Byzantine, Slavic, Norse, Iberian, Lombard, Moorish, Venetian

- **Development**: Calculated from resource values (gold 40%, food 30%, military 30%)

### Name Generation

- Combines syllable patterns (prefix + middle + suffix)
- Three structure types:
  - 60% chance: prefix + middle + suffix (e.g., "Aldmerville")
  - 30% chance: prefix + suffix (e.g., "Balor")
  - 10% chance: prefix + middle (e.g., "Cordor")
- Seeded randomness ensures reproducible names
- Automatic duplicate avoidance within a single map

### Color Generation

- Uses HSL color space for better color distribution
- Terrain-aware base hues:
  - Plains: Yellowish-green (80-120°)
  - Forest: Green (120-150°)
  - Mountains: Grayscale (0° with low saturation)
  - Desert: Orange-yellow (40-70°)
  - Hills: Brown-orange (25-60°)
  - Coastal: Blue (200-240°)
- Variation within terrain types for territory distinction
- Muted saturation (40-70%) for strategic map aesthetic

## Performance Notes

- Recommended max territories: 50 (performance may degrade beyond this)
- Canvas redraws on hover (optimization opportunity - see [Issue #4](https://github.com/Hierophant-Hymn/hierophanthymn-mapgen/issues/4))
- Lloyd's relaxation iterations: 3 (balance between quality and speed)

## License

MIT License - see [LICENSE](LICENSE) file for details

---

**Built by Alexander Wu for Hierophant Hymn**

For questions or support, please [open an issue](https://github.com/Hierophant-Hymn/hierophanthymn-mapgen/issues).
