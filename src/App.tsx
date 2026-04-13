import React, { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Cidade {
  id: string;
  nome: string;
  uf: string;
}

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  
  const [mostrarCidades, setMostrarCidades] = useState(true);
  const [mostrarPonto, setMostrarPontos] = useState(true);
  const [mapaCarregado, setMapaCarregado] = useState(false);

  // dados e interação
  const [listaCidades, setListaCidades] = useState<Cidade[]>([]);
  const [idsSelecionados, setIdsSelecionados] = useState<string[]>([]);
  const [termoBusca, setTermoBusca] = useState('');

  const lng = -48.444;
  const lat = -1.381111;
  const zoom = 3;
  
  const geojsonUrl = 'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&intrarregiao=municipio';
  const localidadesUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios';

  useEffect(() => {
    fetch(localidadesUrl)
      .then(res => res.json())
      .then(data => {
        const formatado = data.map((cidade: any) => {

          const siglaUf = cidade?.microrregiao?.mesorregiao?.UF?.sigla || '';
          return{
          id: cidade.id.toString(), 
          nome: cidade.nome,
          uf: siglaUf
          };
        });
        
        formatado.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        setListaCidades(formatado);
      })
      .catch(err => console.error("Falha ao buscar cidade:", err));
  }, []);

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
        map.current!.addSource('cidades-brasil', { type: 'geojson', data: geojsonUrl });

        map.current!.addLayer({
          id: 'municipios-prenchimento',
          type: 'fill',
          source: 'cidades-brasil',
          paint: { 'fill-color': 'black', 'fill-opacity': 0.2 }
        });

        map.current!.addLayer({
          id: 'municipios-fronteiras',
          type: 'line',
          source: 'cidades-brasil',
          paint: { 'line-color': 'black', 'line-width': 1 }
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
          paint: { 'circle-radius': 11, 'circle-color': 'red', 'circle-opacity': 1 }
        });

        setMapaCarregado(true);
      });
    }

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

    if (!mostrarCidades) {
      m.setFilter('municipios-prenchimento', ['==', ['get', 'codarea'], '']);
      m.setFilter('municipios-fronteiras', ['==', ['get', 'codarea'], '']);
    } else if (idsSelecionados.length === 0) {
      m.setFilter('municipios-prenchimento', null);
      m.setFilter('municipios-fronteiras', null);
    } else {
      const filtro = ['in', ['get', 'codarea'], ['literal', idsSelecionados]] as maplibregl.FilterSpecification;
      m.setFilter('municipios-prenchimento', filtro);
      m.setFilter('municipios-fronteiras', filtro);
    }
  }, [idsSelecionados, mostrarCidades, mapaCarregado]);

  const toggleCidadesMapa = () => {
    setMostrarCidades(!mostrarCidades);
  };

  const togglePontoMangueirao = () => {
    if(!map.current) return;
    const visibilidade = mostrarPonto ? 'none' : 'visible';
    if (map.current.getLayer('mangueirao-ponto')){
      map.current.setLayoutProperty('mangueirao-ponto', 'visibility', visibilidade);
    }
    setMostrarPontos(!mostrarPonto)
  }

  const toggleCheckCidade = (id: string) => {
    setIdsSelecionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const cidadesFiltradasUI = useMemo(() => {
    return listaCidades
      .filter(c => 
        c.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        c.uf.toLowerCase().includes(termoBusca.toLowerCase())
      )

        .sort((a, b) =>{
          const aSelecionado = idsSelecionados.includes(a.id);
          const bSelecionado = idsSelecionados.includes(b.id);

          if(aSelecionado && !bSelecionado) return -1;
          if(!aSelecionado && bSelecionado) return 1;

          return 0;
        })
      .slice(0, 50);
  }, [listaCidades, termoBusca, idsSelecionados]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      
      <div style={{ width: '220px', background: 'white', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <div style={{ padding: '15px', borderBottom: '2px solid #eee' }}>
          <h4 style={{ margin: '0 0 10px 0' , fontFamily:'Verdana'}}>Filtro de Cidades</h4>
          <div style={{ position: 'relative', display: 'flex', width: '100%', marginBottom: '10px' }}>
          <input 
              type="text" 
              placeholder="Buscar cidades..." 
              value={termoBusca} 
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                paddingRight: '30px',
                boxSizing: 'border-box',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            
            {termoBusca.length > 0 && (
              <button
                onClick={() => setTermoBusca('')}
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'black',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  zIndex: 10
                }}
                title="Limpar busca"
              >
                X
              </button>
            )}
            </div>
          </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {cidadesFiltradasUI.map(c => (
            <div key={c.id} style={{ fontSize: '15px', marginBottom: '5px' }}>
              <label style={{ cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={idsSelecionados.includes(c.id)}
                  onChange={() => toggleCheckCidade(c.id)} 
                  style={{ accentColor: 'green' }}
                />
                {c.nome} - {c.uf}
              </label>
            </div>
          ))}
          {listaCidades.length > 0 && cidadesFiltradasUI.length === 100 && (
            <small style={{ color: 'black', display: 'block', marginTop: '10px' }}>
            
            </small>
          )}
        </div>
      </div>

      <div className="map-wrap" style={{ flex: 1, position: 'relative' }}> 
        <button 
          onClick={toggleCidadesMapa}
          style={{
            position: 'absolute', top: '10px', left: '10px', zIndex: 5,
            padding: '10px', backgroundColor: 'white', border: '1px solid #ccc',
            borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color:'black'
          }}
        >
          {mostrarCidades ? 'Esconder Cidades' : 'Mostrar Cidades'}
        </button>

        <button 
          onClick={togglePontoMangueirao} 
          style={{
            position: 'absolute', top: '10px', right: '10px', zIndex: 5,
            padding: '10px', backgroundColor: 'white', border: '1px solid #000000',
            borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'red'
          }}
        >
          {mostrarPonto ? 'Esconder ponto' : 'Mostrar Ponto'}
        </button>
        
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default MapComponent;