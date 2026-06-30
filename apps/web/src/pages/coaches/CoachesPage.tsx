import { useQuery } from '@tanstack/react-query';
import { AppPageHeader } from '@/layouts/AppLayout';
import { FigmaErrorBanner, FigmaEmptyPanel, FigmaPanel, FigmaRowActions } from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import { useDeleteItem } from '@/hooks/useDeleteItem';
import api from '@/api/client';
import type { Coach } from '@/types';

export default function CoachesPage() {
  const deleteMutation = useDeleteItem(['coaches'], '/coaches');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['coaches'],
    queryFn: () => api.get<Coach[]>('/coaches').then((r) => r.data),
  });

  if (isLoading) return <LoadingState message="Carregando técnicos..." />;

  return (
    <div>
      <AppPageHeader
        title="Técnicos"
        description="Equipe técnica dos times."
        actionTo="/coaches/new"
        actionLabel="Novo técnico"
      />
      {isError && <FigmaErrorBanner message="Erro ao carregar técnicos." />}
      {!data?.length ? (
        <FigmaEmptyPanel
          title="Nenhum técnico cadastrado"
          description="Cadastre o técnico vinculado a um time."
          actionTo="/coaches/new"
          actionLabel="Cadastrar técnico"
        />
      ) : (
        <FigmaPanel>
          <ul className="divide-y divide-white/10">
            {data.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-4">
                <span className="font-display text-lg font-medium text-white">{c.name}</span>
                <FigmaRowActions
                  editTo={`/coaches/${c.id}/edit`}
                  onDelete={() => {
                    if (confirm(`Excluir técnico "${c.name}"?`)) deleteMutation.mutate(c.id);
                  }}
                  deleting={deleteMutation.isPending}
                />
              </li>
            ))}
          </ul>
        </FigmaPanel>
      )}
    </div>
  );
}
