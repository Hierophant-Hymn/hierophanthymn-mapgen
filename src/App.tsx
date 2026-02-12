import { useState, useCallback } from 'react';
import { MapCanvas } from './components/MapCanvas';
import { generateMap } from './utils/mapGenerator';
import { Territory, MapConfig } from './types/Territory';
import './App.css';

/**
 * Main application component
 *
 * Features:
 * - Territory count configuration
 * - Map regeneration
 * - JSON export/import (future Phase 3)
 * - Responsive canvas sizing
 */
function App() {
  // Map configuration
  const [config] = useState<MapConfig>({
    width: 1200,
    height: 800,
    territoryCount: 20,
    seed: Date.now()
  });

  const [territories, setTerritories] = useState<Territory[]>(() =>
    generateMap(config)
  );

  const [territoryCount, setTerritoryCount] = useState(20);

  /**
   * Regenerate the map with a new seed
   */
  const handleRegenerate = useCallback(() => {
    const newConfig = {
      ...config,
      territoryCount,
      seed: Date.now()
    };
    setTerritories(generateMap(newConfig));
  }, [config, territoryCount]);

  /**
   * Export map data as JSON
   */
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(territories, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `hierophant-map-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }, [territories]);

  /**
   * Import map data from JSON file
   */
  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setTerritories(data);
      } catch (error) {
        alert('Invalid JSON file');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Hierophant Hymn - Territory Generator</h1>
        <p className="subtitle">Procedural Medieval Strategy Map</p>
      </header>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="territory-count">
            Territory Count: <strong>{territoryCount}</strong>
          </label>
          <input
            id="territory-count"
            type="range"
            min="5"
            max="50"
            value={territoryCount}
            onChange={(e) => setTerritoryCount(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="button-group">
          <button onClick={handleRegenerate} className="btn btn-primary">
            🎲 Regenerate Map
          </button>
          <button onClick={handleExport} className="btn btn-secondary">
            💾 Export JSON
          </button>
          <label htmlFor="import-file" className="btn btn-secondary">
            📂 Import JSON
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="map-container">
        <MapCanvas
          territories={territories}
          width={config.width}
          height={config.height}
        />
      </div>

      <div className="info-panel">
        <h3>Map Statistics</h3>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Territories:</span>
            <span className="stat-value">{territories.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Map Size:</span>
            <span className="stat-value">{config.width} × {config.height}</span>
          </div>
        </div>

        <h3>Territory List</h3>
        <div className="territory-list">
          {territories.map((territory) => (
            <div key={territory.id} className="territory-item">
              <div
                className="territory-color"
                style={{ backgroundColor: territory.color }}
              />
              <span className="territory-name">{territory.name}</span>
            </div>
          ))}
        </div>
      </div>

      <footer className="app-footer">
        <p>
          Phase 1: Core Generator ✓ | Hover over territories for details
        </p>
      </footer>
    </div>
  );
}

export default App;
