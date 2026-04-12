import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  
  const [mostrarCidades, setMostrarCidades] = useState(true);
  const [mostrarPonto, setMostrarPontos] = useState(true);

  const lng = -48.444;
  const lat = -1.381111;
  const zoom = 4;

  const toggleCidadesMapa = () => {
    if (!map.current) return;

    const visibilidade = mostrarCidades ? 'none' : 'visible';

    if (map.current.getLayer('municipios-prenchimento')) {
      map.current.setLayoutProperty('municipios-prenchimento', 'visibility', visibilidade);
    }
    if (map.current.getLayer('municipios-fronteiras')) {
      map.current.setLayoutProperty('municipios-fronteiras', 'visibility', visibilidade);
    }

    setMostrarCidades(!mostrarCidades);
  };

  const togglePontoMangueirao = ()=>{
    if(!map.current) return;
    
    const visibilidade = mostrarPonto ? 'none' : 'visible';

    if (map.current.getLayer ('mangueirao-ponto')){
      map.current.setLayoutProperty('mangueirao-ponto', 'visibility', visibilidade);
    }

    setMostrarPontos(!mostrarPonto)
  }

  useEffect(() => {
    if (map.current) return;

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [lng, lat],
        zoom: zoom
      });

      map.current.on('load', () => {
        map.current!.addSource('cidades-brasil', {
          type: 'geojson',
          data: 'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&intrarregiao=municipio'
        });

        map.current!.addLayer({
          id: 'municipios-prenchimento',
          type: 'fill',
          source: 'cidades-brasil',
          layout: { 'visibility': 'visible' }, 
          paint: {
            'fill-color': 'black',
            'fill-opacity': 0.2
          }
        });

        map.current!.addLayer({
          id: 'municipios-fronteiras',
          type: 'line',
          source: 'cidades-brasil',
          layout: { 'visibility': 'visible' }, 
          paint: {
            'line-color': 'black',
            'line-width': 1
          }
        });

        map.current!.addSource('mangueirao-fonte', {
          type: 'geojson',
          data: {
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              geometry: { type: "Point", coordinates: [lng, lat] },
              properties: { name: "Mangueirão" }
            }]
          }
        });

        map.current!.addLayer({
          id: 'mangueirao-ponto',
          type: 'circle',
          source: 'mangueirao-fonte',
          paint: {
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
  }, []);

  return (
    <div className="map-wrap" style={{ position: 'relative', width: '100%', height: '100vh' }}> 
      <button 
        onClick={toggleCidadesMapa}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 5,
          padding: '10px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: 'black'
        }}
      >
        {mostrarCidades ? 'Esconder Cidades' : 'Mostrar Cidades'}
      </button>

      <button 
        onClick={togglePontoMangueirao} 
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 5,
          padding: '10px',
          backgroundColor: 'white',
          border: '1px solid #7316a5',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: 'red'
        }}

      >
        {mostrarPonto ? 'Esconder ponto' : 'Mostrar Ponto'}
      </button>
      
      <div ref={mapContainer} style={{ position: 'absolute', width: '100%', height: '100vh' }} />
    </div>
  );
};

export default MapComponent;