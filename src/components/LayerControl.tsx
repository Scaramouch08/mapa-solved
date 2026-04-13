import React from 'react';
import type { CamadasAtivas } from '../types';
import styles from '../MapComponent.module.css';

interface LayerControlProps {
  camadasAtivas: CamadasAtivas;
  toggleCamada: (camada: keyof CamadasAtivas) => void;
}

const LayerControl: React.FC<LayerControlProps> = ({ camadasAtivas, toggleCamada }) => {
  return (
    <div className={styles.layerControl}>
      <div className={styles.layerItem}>
        <span className={styles.layerLabel}>WMS</span>
        <input 
          type="checkbox" 
          checked={camadasAtivas.wms} 
          onChange={() => toggleCamada('wms')} 
          className={styles.layerCheckbox}
        />
      </div>
      <div className={styles.layerItem}>
        <span className={styles.layerLabel}>MVT</span>
        <input 
          type="checkbox" 
          checked={camadasAtivas.mvt} 
          onChange={() => toggleCamada('mvt')} 
          className={styles.layerCheckbox}
        />
      </div>
      <div className={styles.layerItem}>
        <span className={styles.layerLabel}>Municípios</span>
        <input 
          type="checkbox" 
          checked={camadasAtivas.municipios} 
          onChange={() => toggleCamada('municipios')} 
          className={styles.layerCheckbox}
        />
      </div>
    </div>
  );
};

export default LayerControl;
