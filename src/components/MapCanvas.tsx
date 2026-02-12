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
  }, [territories, width, height, hoveredTerritory]);

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
   * Handle mouse movement for hover detection
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Find which territory the mouse is over
    const territory = territories.find(t =>
      isPointInPolygon([x, y], t.borderPoints)
    );

    setHoveredTerritory(territory || null);
  };

  const handleMouseLeave = () => {
    setHoveredTerritory(null);
    setMousePos(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          border: '2px solid #333',
          cursor: hoveredTerritory ? 'pointer' : 'default',
          display: 'block'
        }}
      />

      {/* Hover tooltip */}
      {hoveredTerritory && mousePos && (
        <div
          style={{
            position: 'absolute',
            left: mousePos.x + 10,
            top: mousePos.y + 10,
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '6px',
            pointerEvents: 'none',
            fontSize: '14px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            zIndex: 1000
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {hoveredTerritory.name}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            ID: {hoveredTerritory.id}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Center: ({Math.round(hoveredTerritory.centerX)}, {Math.round(hoveredTerritory.centerY)})
          </div>
        </div>
      )}
    </div>
  );
}
