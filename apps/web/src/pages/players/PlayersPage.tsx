import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState, LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Player } from '@/types';

export default function PlayersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['players'],
    queryFn: () => api.get<Player[]>('/players').then((r) => r.data),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <div className="text-destructive">Erro ao carregar atletas.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Atletas" description="Gerencie o elenco dos times" />
      {!data?.length ? (
        <EmptyState title="Nenhum atleta" description="Cadastre atletas pela gestão do time." />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Número</th>
                <th className="px-4 py-3 text-left">Posição</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.number}</td>
                  <td className="px-4 py-3">{p.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
