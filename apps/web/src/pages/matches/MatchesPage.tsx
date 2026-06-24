import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/PageHeader';
import { Badge, EmptyState, LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Match } from '@/types';

export default function MatchesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['matches'],
    queryFn: () => api.get<Match[]>('/matches').then((r) => r.data),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <div className="text-destructive">Erro ao carregar partidas.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Partidas" />
      {!data?.length ? (
        <EmptyState title="Nenhuma partida agendada" />
      ) : (
        <div className="space-y-3">
          {data.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
              <div>
                <p className="font-medium">
                  {m.homeScore ?? '-'} x {m.awayScore ?? '-'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(m.scheduledAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <Badge variant={m.status === 'LIVE' ? 'success' : 'secondary'}>{m.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
