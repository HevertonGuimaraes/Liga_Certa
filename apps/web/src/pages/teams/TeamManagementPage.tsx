import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/PageHeader';
import { LoadingState, Badge } from '@/design-system/components';
import api from '@/api/client';

export default function TeamManagementPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['team', id],
    queryFn: () => api.get(`/teams/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <div className="text-destructive">Time não encontrado.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title={data.name} description={`Sigla: ${data.shortName}`} />
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-4">Elenco</h3>
        {data.players?.length ? (
          <ul className="divide-y">
            {data.players.map((p: { id: string; name: string; number: number; position: string }) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <span>{p.number} — {p.name}</span>
                <Badge variant="outline">{p.position}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum atleta cadastrado.</p>
        )}
      </div>
    </div>
  );
}
