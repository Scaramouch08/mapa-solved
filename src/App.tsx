import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const lng = -48.444;
  const lat = -1.381111;
  const zoom = 3; 

  useEffect(() => {
    if (map.current) return; 

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json', 
        center: [lng,lat],
        zoom: zoom
      });

      map.current.on('load', () => {
        new maplibregl.Marker({ color: "#0040ff" })
          .setLngLat([lng, lat])
          .addTo(map.current!);

       
        map.current!.addSource('cities-source', {
          type: 'geojson',
          data: '/brazil-cities.json'
        });

        map.current!.addLayer({
          id: 'cities-layer',
          type: 'circle', 
          source: 'cities-source',
          paint: {
            'circle-radius': 4,
            'circle-color': 'black',
            'circle-opacity': 0.5 
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