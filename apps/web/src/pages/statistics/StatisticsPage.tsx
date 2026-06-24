import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/PageHeader';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';

export default function StatisticsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => api.get('/statistics').then((r) => r.data),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <div className="text-destructive">Erro ao carregar estatísticas.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Estatísticas" description="Resumo geral do campeonato" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(data ?? {}).map(([key, value]) => (
          <div key={key} className="rounded-lg border bg-card p-5">
            <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="mt-1 text-2xl font-bold">{String(value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
