import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button, EmptyState, LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Team } from '@/types';

export default function TeamsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get<Team[]>('/teams').then((r) => r.data),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <div className="text-destructive">Erro ao carregar times.</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Times"
        actions={<Button asChild><Link to="/teams/new"><Plus className="h-4 w-4" /> Novo time</Link></Button>}
      />
      {!data?.length ? (
        <EmptyState actionLabel="Criar time" onAction={() => (window.location.href = '/teams/new')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((t) => (
            <Link key={t.id} to={`/teams/${t.id}`} className="rounded-lg border bg-card p-5 shadow-sm hover:border-primary">
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.shortName}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
