import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // Set initial coordinates and zoom
  const lng = 0;
  const lat = 0;
  const zoom = 2;

  useEffect(() => {
    if (map.current) return; 

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json', // Open-source demo style
        center: [lng, lat],
        zoom: zoom
      });

      // Add navigation controls (zoom, rotate)
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="map-wrap" style={{ position: 'relative', width: '100%', height: '800px' }}>
      <div ref={mapContainer} style={{ position: 'absolute', width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapComponent;