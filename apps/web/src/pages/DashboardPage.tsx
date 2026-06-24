import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Skeleton } from '@/design-system/components';
import api from '@/api/client';

const stats = [
  { key: 'championships', label: 'Campeonatos', icon: Trophy },
  { key: 'teams', label: 'Times', icon: Users },
  { key: 'matches', label: 'Partidas', icon: Calendar },
  { key: 'goals', label: 'Gols', icon: TrendingUp },
] as const;

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/statistics/dashboard').then((r) => r.data),
  });

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Visão geral dos seus campeonatos" />
      {isError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Erro ao carregar dashboard. Verifique se a API está rodando.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ key, label, icon: Icon }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="h-5 w-5 text-primary" />
            </div>
            {isLoading ? (
              <Skeleton className="mt-3 h-8 w-16" />
            ) : (
              <p className="mt-2 text-3xl font-bold">{data?.[key] ?? 0}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
