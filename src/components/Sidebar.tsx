import React from 'react';
import type { Cidade } from '../types';
import styles from '../MapComponent.module.css';

interface SidebarProps {
  termoBusca: string;
  setTermoBusca: (termo: string) => void;
  cidadesFiltradasUI: Cidade[];
  idsSelecionados: string[];
  toggleCheckCidade: (id: string) => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  termoBusca,
  setTermoBusca,
  cidadesFiltradasUI,
  idsSelecionados,
  toggleCheckCidade,
  isLoading,
}) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h4 className={styles.headerTitle}>Filtro de Cidades</h4>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Buscar cidades..." 
            value={termoBusca} 
            onChange={(e) => setTermoBusca(e.target.value)}
            className={styles.searchInput}
          />
          {termoBusca.length > 0 && (
            <button 
              onClick={() => setTermoBusca('')} 
              className={styles.clearButton} 
              title="Limpar busca"
            >
              X
            </button>
          )}
        </div>
      </div>
      <div className={styles.listContainer}>
        {isLoading ? (
          <div className={styles.loadingText}>Carregando cidades...</div>
        ) : cidadesFiltradasUI.length === 0 ? (
          <div className={styles.emptyText}>Nenhuma cidade encontrada.</div>
        ) : (
          cidadesFiltradasUI.map(c => (
            <div key={c.id} className={styles.listItem}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={idsSelecionados.includes(c.id)} 
                  onChange={() => toggleCheckCidade(c.id)} 
                  className={styles.checkbox} 
                />
                {c.nome} - {c.uf}
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
