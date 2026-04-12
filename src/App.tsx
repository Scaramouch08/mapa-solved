import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const lng = -48.444;
  const lat = -1.381111;
  const zoom = 5; 

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
        
         map.current!.addSource('cidades-brasil', {
          type: 'geojson',
          data: 'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&intrarregiao=municipio'
        });

        map.current!.addLayer({
          id: 'preenchimento-cidade',
          type: 'fill', 
          source: 'cidades-brasil',
          paint: {
            'fill-color': 'black',
            'fill-opacity': 0.2
          }
        });

        map.current!.addLayer({
          id: 'municipios-fronteiras',
          type: 'line', 
          source: 'cidades-brasil',
          paint: {
            'line-color': 'black', 
            'line-width': 1          
          }
        });
  

       
map.current!.addSource('mangueirao-fonte', {
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
                properties: {
                  name: "Mangueirão"
                }
              }]
          }
        });
        map.current!.addLayer({
          id: 'mangueirao-ponto',
          type: 'circle',
          source: 'mangueirao-fonte',
          paint:{
            'circle-radius': 11,
            'circle-color': 'red',
            'circle-opacity': 1
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
    <div className="map-wrap" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapContainer} style={{ position: 'absolute', width: '100%', height: '100vh' }} />
    </div>
  );
};

export default MapComponent;