import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState, LoadingState } from '@/design-system/components';
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

  if (isLoading) return <LoadingState />;
  if (isError) return <div className="text-destructive">Erro ao carregar artilharia.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Artilharia" />
      {!data?.length ? (
        <EmptyState title="Sem gols registrados" />
      ) : (
        <ol className="divide-y rounded-lg border bg-card">
          {data.map((s, i) => (
            <li key={s.playerId} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{s.playerName}</p>
                  <p className="text-sm text-muted-foreground">{s.teamName}</p>
                </div>
              </div>
              <span className="text-lg font-bold">{s.goals}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
