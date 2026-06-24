import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState, LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Coach } from '@/types';

export default function CoachesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['coaches'],
    queryFn: () => api.get<Coach[]>('/coaches').then((r) => r.data),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <div className="text-destructive">Erro ao carregar técnicos.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Técnicos" />
      {!data?.length ? (
        <EmptyState title="Nenhum técnico cadastrado" />
      ) : (
        <ul className="divide-y rounded-lg border bg-card">
          {data.map((c) => (
            <li key={c.id} className="px-4 py-3">{c.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
