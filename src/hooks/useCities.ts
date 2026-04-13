import { useState, useEffect, useMemo } from 'react';
import type { Cidade } from '../types';
import { LOCALIDADES_URL } from '../constants';

export const useCities = (termoBusca: string, idsSelecionados: string[]) => {
  const [listaCidades, setListaCidades] = useState<Cidade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(LOCALIDADES_URL)
      .then(res => res.json())
      .then(data => {
        const formatado: Cidade[] = data.map((cidade: any) => ({
          id: cidade.id.toString(),
          nome: cidade.nome,
          uf: cidade?.microrregiao?.mesorregiao?.UF?.sigla || ''
        }));
        formatado.sort((a, b) => a.nome.localeCompare(b.nome));
        setListaCidades(formatado);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Falha ao buscar cidade:", err);
        setIsLoading(false);
      });
  }, []);

  const cidadesFiltradasUI = useMemo(() => {
    return listaCidades
      .filter(c => 
        c.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        c.uf.toLowerCase().includes(termoBusca.toLowerCase())
      )
      .sort((a, b) => {
        const aSelecionado = idsSelecionados.includes(a.id);
        const bSelecionado = idsSelecionados.includes(b.id);
        if (aSelecionado && !bSelecionado) return -1;
        if (!aSelecionado && bSelecionado) return 1;
        return 0;
      })
      .slice(0, 50);
  }, [listaCidades, termoBusca, idsSelecionados]);

  return { cidadesFiltradasUI, isLoading };
};
