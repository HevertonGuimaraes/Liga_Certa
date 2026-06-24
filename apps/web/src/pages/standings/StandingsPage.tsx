import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState, LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Standing } from '@/types';

export default function StandingsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['standings'],
    queryFn: () => api.get<Standing[]>('/standings').then((r) => r.data),
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <div className="text-destructive">Erro ao carregar classificação.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Classificação" />
      {!data?.length ? (
        <EmptyState title="Classificação vazia" description="Registre partidas para atualizar a tabela." />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-center">J</th>
                <th className="px-3 py-2 text-center">V</th>
                <th className="px-3 py-2 text-center">E</th>
                <th className="px-3 py-2 text-center">D</th>
                <th className="px-3 py-2 text-center">GP</th>
                <th className="px-3 py-2 text-center">GC</th>
                <th className="px-3 py-2 text-center font-bold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s, i) => (
                <tr key={s.id} className="border-t">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{s.teamName}</td>
                  <td className="px-3 py-2 text-center">{s.played}</td>
                  <td className="px-3 py-2 text-center">{s.wins}</td>
                  <td className="px-3 py-2 text-center">{s.draws}</td>
                  <td className="px-3 py-2 text-center">{s.losses}</td>
                  <td className="px-3 py-2 text-center">{s.goalsFor}</td>
                  <td className="px-3 py-2 text-center">{s.goalsAgainst}</td>
                  <td className="px-3 py-2 text-center font-bold">{s.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
