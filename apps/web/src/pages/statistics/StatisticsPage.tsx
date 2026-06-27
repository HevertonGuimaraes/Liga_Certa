import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppPageHeader } from '@/layouts/AppLayout';
import { FigmaErrorBanner, FigmaPanel } from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';

const labels: Record<string, string> = {
  totalPlayers: 'Atletas',
  totalCoaches: 'Técnicos',
  finishedMatches: 'Partidas finalizadas',
  championships: 'Campeonatos',
  teams: 'Times',
  matches: 'Partidas',
  goals: 'Gols',
};

export default function StatisticsPage() {
  const { data: stats, isLoading: loadingStats, isError: errorStats } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => api.get('/statistics').then((r) => r.data),
  });

  const { data: dashboard, isLoading: loadingDash } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/statistics/dashboard').then((r) => r.data),
  });

  if (loadingStats || loadingDash) return <LoadingState message="Carregando estatísticas..." />;

  const merged = { ...dashboard, ...stats };

  return (
    <div>
      <AppPageHeader title="Estatísticas" description="Estatísticas em tempo real do campeonato." />
      {errorStats && <FigmaErrorBanner message="Erro ao carregar estatísticas." />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(merged ?? {}).map(([key, value], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <FigmaPanel>
              <p className="font-display text-sm text-white/60">{labels[key] ?? key}</p>
              <p className="mt-2 font-display text-4xl font-bold text-white">{String(value)}</p>
            </FigmaPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
