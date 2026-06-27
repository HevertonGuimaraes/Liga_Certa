import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppPageHeader } from '@/layouts/AppLayout';
import {
  FigmaErrorBanner,
  FigmaEmptyPanel,
  FigmaTable,
  FigmaTableHead,
  FigmaTableBody,
  FigmaTableRow,
  FigmaTableCell,
} from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Player } from '@/types';

export default function PlayersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['players'],
    queryFn: () => api.get<Player[]>('/players').then((r) => r.data),
  });

  if (isLoading) return <LoadingState message="Carregando atletas..." />;

  return (
    <div>
      <AppPageHeader title="Atletas" description="Gerencie o elenco dos times." />
      {isError && <FigmaErrorBanner message="Erro ao carregar atletas." />}
      {!data?.length ? (
        <FigmaEmptyPanel
          title="Nenhum atleta cadastrado"
          description="Cadastre atletas pela gestão do time."
          actionLabel="Ver times"
          actionTo="/teams"
        />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FigmaTable>
            <FigmaTableHead>
              <FigmaTableCell header>Nome</FigmaTableCell>
              <FigmaTableCell header className="text-center">Número</FigmaTableCell>
              <FigmaTableCell header>Posição</FigmaTableCell>
            </FigmaTableHead>
            <FigmaTableBody>
              {data.map((p) => (
                <FigmaTableRow key={p.id}>
                  <FigmaTableCell className="font-semibold">{p.name}</FigmaTableCell>
                  <FigmaTableCell className="text-center">{p.number}</FigmaTableCell>
                  <FigmaTableCell className="text-liga-blue">{p.position}</FigmaTableCell>
                </FigmaTableRow>
              ))}
            </FigmaTableBody>
          </FigmaTable>
        </motion.div>
      )}
    </div>
  );
}
