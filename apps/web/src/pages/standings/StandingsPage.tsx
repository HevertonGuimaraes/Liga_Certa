import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppPageHeader } from '@/layouts/AppLayout';
import {
  FigmaEmptyPanel,
  FigmaErrorBanner,
  FigmaTable,
  FigmaTableHead,
  FigmaTableBody,
  FigmaTableRow,
  FigmaTableCell,
} from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Standing } from '@/types';

export default function StandingsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['standings'],
    queryFn: () => api.get<Standing[]>('/standings').then((r) => r.data),
  });

  if (isLoading) return <LoadingState message="Carregando classificação..." />;

  return (
    <div>
      <AppPageHeader title="Classificação" description="Tabela atualizada do campeonato." />
      {isError && <FigmaErrorBanner message="Erro ao carregar classificação." />}
      {!data?.length ? (
        <FigmaEmptyPanel title="Classificação vazia" description="Registre partidas para atualizar a tabela." />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FigmaTable>
            <FigmaTableHead>
              <FigmaTableCell header>#</FigmaTableCell>
              <FigmaTableCell header>Time</FigmaTableCell>
              <FigmaTableCell header className="text-center">J</FigmaTableCell>
              <FigmaTableCell header className="text-center">V</FigmaTableCell>
              <FigmaTableCell header className="text-center">E</FigmaTableCell>
              <FigmaTableCell header className="text-center">D</FigmaTableCell>
              <FigmaTableCell header className="text-center">GP</FigmaTableCell>
              <FigmaTableCell header className="text-center">GC</FigmaTableCell>
              <FigmaTableCell header className="text-center">Pts</FigmaTableCell>
            </FigmaTableHead>
            <FigmaTableBody>
              {data.map((s, i) => (
                <FigmaTableRow key={s.id}>
                  <FigmaTableCell>{i + 1}</FigmaTableCell>
                  <FigmaTableCell className="font-semibold">{s.teamName}</FigmaTableCell>
                  <FigmaTableCell className="text-center">{s.played}</FigmaTableCell>
                  <FigmaTableCell className="text-center">{s.wins}</FigmaTableCell>
                  <FigmaTableCell className="text-center">{s.draws}</FigmaTableCell>
                  <FigmaTableCell className="text-center">{s.losses}</FigmaTableCell>
                  <FigmaTableCell className="text-center">{s.goalsFor}</FigmaTableCell>
                  <FigmaTableCell className="text-center">{s.goalsAgainst}</FigmaTableCell>
                  <FigmaTableCell className="text-center font-bold text-liga-blue">{s.points}</FigmaTableCell>
                </FigmaTableRow>
              ))}
            </FigmaTableBody>
          </FigmaTable>
        </motion.div>
      )}
    </div>
  );
}
