import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LayerControl from './components/LayerControl';
import { useMap } from './hooks/useMap';
import { useCities } from './hooks/useCities';
import type { CamadasAtivas } from './types';
import styles from './MapComponent.module.css';

const MapComponent: React.FC = () => {
  const [termoBusca, setTermoBusca] = useState('');
  const [idsSelecionados, setIdsSelecionados] = useState<string[]>([]);
  const [camadasAtivas, setCamadasAtivas] = useState<CamadasAtivas>({
    wms: true,
    mvt: true,
    municipios: true
  });

  const { cidadesFiltradasUI, isLoading } = useCities(termoBusca, idsSelecionados);
  const { mapContainer } = useMap(camadasAtivas, idsSelecionados);

  const toggleCheckCidade = (id: string) => {
    setIdsSelecionados(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleCamada = (camada: keyof CamadasAtivas) => {
    setCamadasAtivas(prev => ({
      ...prev,
      [camada]: !prev[camada]
    }));
  };

  return (
    <div className={styles.container}>
      <Sidebar 
        termoBusca={termoBusca}
        setTermoBusca={setTermoBusca}
        cidadesFiltradasUI={cidadesFiltradasUI}
        idsSelecionados={idsSelecionados}
        toggleCheckCidade={toggleCheckCidade}
        isLoading={isLoading}
      />
      
      <div className={styles.mapWrap}>
        <LayerControl 
          camadasAtivas={camadasAtivas}
          toggleCamada={toggleCamada}
        />
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default MapComponent;
