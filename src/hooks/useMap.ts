import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_CENTER, MAP_ZOOM, GEOJSON_URL, MVT_URL, WMS_URL } from '../constants';
import type { CamadasAtivas } from '../types';

export const useMap = (camadasAtivas: CamadasAtivas, idsSelecionados: string[]) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapaCarregado, setMapaCarregado] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: MAP_CENTER,
      zoom: MAP_ZOOM
    });

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.addControl(new maplibregl.NavigationControl({
        visualizePitch: true, 
        visualizeRoll: true, 
        showZoom: true, 
        showCompass: true
      })
      )

      map.current.addSource('cities-brasil', { type: 'geojson', data: GEOJSON_URL });

      map.current.addLayer({
        id: 'municipios-preenchimento',
        type: 'fill',
        source: 'cities-brasil',
        paint: { 'fill-color': 'black', 'fill-opacity': 0.2 }
      });

      map.current.addLayer({
        id: 'municipios-borders',
        type: 'line',
        source: 'cities-brasil',
        paint: { 'line-color': 'black', 'line-width': 1 }
      });

      map.current.addSource('mvt-alertas', {
        type: 'vector',
        tiles: [MVT_URL],
        scheme: 'tms'
      });

      map.current.addLayer({
        id: 'camada-mvt',
        type: 'line',
        source: 'mvt-alertas',
        'source-layer': 'alerts_geo',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff0000',
          'line-width': 1.5
        }
      });

      map.current.addSource('wms-para', {
        type: 'raster',
        tiles: [WMS_URL],
        tileSize: 256
      });

      map.current.addLayer({
        id: 'camada-wms',
        type: 'raster',
        source: 'wms-para',
        paint: {}
      });

      setMapaCarregado(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapaCarregado || !map.current) return;
    const m = map.current;

    if (m.getLayer('camada-wms')) {
      m.setLayoutProperty('camada-wms', 'visibility', camadasAtivas.wms ? 'visible' : 'none');
    }

    if (m.getLayer('camada-mvt')) {
      m.setLayoutProperty('camada-mvt', 'visibility', camadasAtivas.mvt ? 'visible' : 'none');
    }

    const visMunicipios = camadasAtivas.municipios ? 'visible' : 'none';
    
    if (m.getLayer('municipios-preenchimento')) {
      m.setLayoutProperty('municipios-preenchimento', 'visibility', visMunicipios);
      m.setLayoutProperty('municipios-borders', 'visibility', visMunicipios);

      if (idsSelecionados.length === 0) {
        m.setFilter('municipios-preenchimento', null);
        m.setFilter('municipios-borders', null);
      } else {
        const filtro = ['in', ['get', 'codarea'], ['literal', idsSelecionados]] as maplibregl.FilterSpecification;
        m.setFilter('municipios-preenchimento', filtro);
        m.setFilter('municipios-borders', filtro);
      }
    }
  }, [camadasAtivas, idsSelecionados, mapaCarregado]);

  return { mapContainer };
};
