import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const lng = -48.5044;
  const lat = -1.4558;
  const zoom = 10;

  useEffect(() => {
    if (map.current) return; 

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json', 
        center: [lng,lat],
        zoom: 1
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        // Safe to add sources and layers now
        map.current!.addSource('my-custom-points', {
          type: 'geojson',
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [lng, lat] 
                },
                properties: {} // <-- The fix to satisfy TypeScript
              }
            ]
          }
        });

        map.current!.addLayer({
          id: 'points-layer',
          type: 'circle', 
          source: 'my-custom-points',
          paint: {
            'circle-radius': 8,
            'circle-color': 'black'
          }
        });
      });
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom]);

  return (
    <div className="map-wrap" style={{ position: 'relative', width: '100%', height: '800px' }}>
      <div ref={mapContainer} style={{ position: 'absolute', width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapComponent;