import { useEffect, useRef, useState } from 'react';
import { Territory } from '../types/Territory';

interface MapCanvasProps {
  territories: Territory[];
  width: number;
  height: number;
}

/**
 * Canvas component for rendering the territory map
 *
 * Architecture decisions:
 * - Uses HTML5 Canvas for efficient rendering of large numbers of polygons
 * - Implements hover detection using point-in-polygon algorithm
 * - Double-buffered drawing to prevent flicker
 * - Renders borders separately from fills for clean visual separation
 */
export function MapCanvas({ territories, width, height }: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredTerritory, setHoveredTerritory] = useState<Territory | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Pan and zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState<{ x: number; y: number } | null>(null);

  /**
   * Main rendering function
   * Draws all territories with borders and optional hover highlight
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw each territory
    territories.forEach(territory => {
      const isHovered = hoveredTerritory?.id === territory.id;

      // Draw territory fill
      ctx.fillStyle = territory.color;
      ctx.beginPath();
      territory.borderPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });
      ctx.closePath();
      ctx.fill();

      // Highlight hovered territory
      if (isHovered) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      }

      // Draw border
      ctx.strokeStyle = isHovered ? '#fff' : '#333';
      ctx.lineWidth = isHovered ? 3 : 1.5;
      ctx.stroke();
    });

    // Draw territory names at center points
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    territories.forEach(territory => {
      // Draw text outline for better visibility
      ctx.strokeText(territory.name, territory.centerX, territory.centerY);
      ctx.fillText(territory.name, territory.centerX, territory.centerY);
    });

    ctx.restore();
  }, [territories, width, height, hoveredTerritory, pan, zoom]);

  /**
   * Point-in-polygon algorithm using ray casting
   * Determines if a point is inside a polygon
   */
  const isPointInPolygon = (point: [number, number], polygon: [number, number][]): boolean => {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

      if (intersect) inside = !inside;
    }

    return inside;
  };

  /**
   * Transform screen coordinates to world coordinates
   */
  const screenToWorld = (screenX: number, screenY: number): [number, number] => {
    return [
      (screenX - pan.x) / zoom,
      (screenY - pan.y) / zoom
    ];
  };

  /**
   * Handle mouse movement for hover detection and panning
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    // Handle panning
    if (isPanning && lastPanPos) {
      const dx = screenX - lastPanPos.x;
      const dy = screenY - lastPanPos.y;
      setPan({ x: pan.x + dx, y: pan.y + dy });
      setLastPanPos({ x: screenX, y: screenY });
      return;
    }

    setMousePos({ x: screenX, y: screenY });

    // Convert to world coordinates for hit detection
    const [worldX, worldY] = screenToWorld(screenX, screenY);

    // Find which territory the mouse is over
    const territory = territories.find(t =>
      isPointInPolygon([worldX, worldY], t.borderPoints)
    );

    setHoveredTerritory(territory || null);
  };

  const handleMouseLeave = () => {
    setHoveredTerritory(null);
    setMousePos(null);
    setIsPanning(false);
    setLastPanPos(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) { // Left mouse button
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      setIsPanning(true);
      setLastPanPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setLastPanPos(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Zoom factor
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.5), 5);

    // Adjust pan to zoom towards mouse position
    const zoomChange = newZoom / zoom;
    const newPanX = mouseX - (mouseX - pan.x) * zoomChange;
    const newPanY = mouseY - (mouseY - pan.y) * zoomChange;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{
          border: '2px solid #333',
          cursor: isPanning ? 'grabbing' : hoveredTerritory ? 'pointer' : 'grab',
          display: 'block'
        }}
      />

      {/* Zoom controls */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '8px',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
      }}>
        <button
          onClick={() => setZoom(Math.min(zoom * 1.2, 5))}
          style={{
            padding: '6px 12px',
            border: 'none',
            background: '#2a5298',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          +
        </button>
        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: '500' }}>
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom(Math.max(zoom * 0.8, 0.5))}
          style={{
            padding: '6px 12px',
            border: 'none',
            background: '#2a5298',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          −
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '6px 12px',
            border: 'none',
            background: '#6c757d',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: '500'
          }}
        >
          Reset
        </button>
      </div>

      {/* Hover tooltip */}
      {hoveredTerritory && mousePos && (
        <div
          style={{
            position: 'absolute',
            left: mousePos.x + 10,
            top: mousePos.y + 10,
            background: 'rgba(0, 0, 0, 0.95)',
            color: '#fff',
            padding: '14px 18px',
            borderRadius: '8px',
            pointerEvents: 'none',
            fontSize: '13px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            minWidth: '220px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '6px' }}>
            {hoveredTerritory.name}
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>DEMOGRAPHICS</div>
            <div style={{ fontSize: '12px', marginLeft: '8px' }}>
              <div>Population: <span style={{ color: '#4fc3f7' }}>{hoveredTerritory.metadata.population.toLocaleString()}</span></div>
              <div>Culture: <span style={{ color: '#81c784' }}>{hoveredTerritory.metadata.culture}</span></div>
              <div>Development: <span style={{ color: '#ffb74d' }}>{hoveredTerritory.metadata.development}%</span></div>
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>TERRAIN</div>
            <div style={{ fontSize: '12px', marginLeft: '8px', textTransform: 'capitalize' }}>
              <span style={{ color: '#a5d6a7' }}>{hoveredTerritory.metadata.terrain}</span>
              {hoveredTerritory.area && (
                <span style={{ opacity: 0.7, marginLeft: '8px' }}>
                  ({Math.round(hoveredTerritory.area).toLocaleString()} km²)
                </span>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '4px' }}>RESOURCES</div>
            <div style={{ fontSize: '12px', marginLeft: '8px' }}>
              <div>Food: <span style={{ color: '#8bc34a' }}>{hoveredTerritory.metadata.resources.food}/100</span></div>
              <div>Gold: <span style={{ color: '#ffd54f' }}>{hoveredTerritory.metadata.resources.gold}/100</span></div>
              <div>Military: <span style={{ color: '#ef5350' }}>{hoveredTerritory.metadata.resources.military}/100</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
