import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppPageHeader } from '@/layouts/AppLayout';
import { FigmaBadge, FigmaEmptyPanel, FigmaErrorBanner, FigmaPanel } from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Match } from '@/types';

function statusVariant(status: Match['status']) {
  if (status === 'LIVE') return 'live' as const;
  if (status === 'FINISHED') return 'finished' as const;
  return 'default' as const;
}

function statusLabel(status: Match['status']) {
  const map = { SCHEDULED: 'Agendada', LIVE: 'Ao vivo', FINISHED: 'Finalizada' };
  return map[status] ?? status;
}

export default function MatchesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['matches'],
    queryFn: () => api.get<Match[]>('/matches').then((r) => r.data),
  });

  if (isLoading) return <LoadingState message="Carregando partidas..." />;

  return (
    <div>
      <AppPageHeader title="Partidas" description="Agenda e resultados dos jogos." />
      {isError && <FigmaErrorBanner message="Erro ao carregar partidas." />}
      {!data?.length ? (
        <FigmaEmptyPanel title="Nenhuma partida agendada" description="Cadastre partidas no campeonato." />
      ) : (
        <div className="space-y-4">
          {data.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <FigmaPanel className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-2xl font-bold text-white">
                    {m.homeScore ?? '-'} <span className="text-white/40">×</span> {m.awayScore ?? '-'}
                  </p>
                  <p className="mt-1 font-display text-sm text-white/60">
                    {new Date(m.scheduledAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <FigmaBadge variant={statusVariant(m.status)}>{statusLabel(m.status)}</FigmaBadge>
              </FigmaPanel>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
