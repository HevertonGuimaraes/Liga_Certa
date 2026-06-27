import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppPageHeader } from '@/layouts/AppLayout';
import { FigmaEmptyPanel, FigmaErrorBanner, FigmaPanel } from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';

interface Scorer {
  playerId: string;
  playerName: string;
  teamName: string;
  goals: number;
}

export default function TopScorersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['top-scorers'],
    queryFn: () => api.get<Scorer[]>('/statistics/top-scorers').then((r) => r.data),
  });

  if (isLoading) return <LoadingState message="Carregando artilharia..." />;

  return (
    <div>
      <AppPageHeader title="Artilharia" description="Ranking de goleadores do campeonato." />
      {isError && <FigmaErrorBanner message="Erro ao carregar artilharia." />}
      {!data?.length ? (
        <FigmaEmptyPanel title="Sem gols registrados" description="Registre gols nas partidas." />
      ) : (
        <FigmaPanel className="p-0 overflow-hidden">
          <ol className="divide-y divide-white/10">
            {data.map((s, i) => (
              <motion.li
                key={s.playerId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between px-6 py-5"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-liga-blue font-display text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-white">{s.playerName}</p>
                    <p className="font-display text-sm text-white/60">{s.teamName}</p>
                  </div>
                </div>
                <span className="font-display text-2xl font-bold text-liga-blue">{s.goals}</span>
              </motion.li>
            ))}
          </ol>
        </FigmaPanel>
      )}
    </div>
  );
}
