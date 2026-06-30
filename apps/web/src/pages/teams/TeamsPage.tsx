import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppPageHeader } from '@/layouts/AppLayout';
import { FigmaErrorBanner, FigmaEmptyPanel, FigmaListCard, FigmaRowActions } from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import { useDeleteItem } from '@/hooks/useDeleteItem';
import api from '@/api/client';
import type { Team } from '@/types';

export default function TeamsPage() {
  const deleteMutation = useDeleteItem(['teams'], '/teams');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get<Team[]>('/teams').then((r) => r.data),
  });

  if (isLoading) return <LoadingState message="Carregando times..." />;

  return (
    <div>
      <AppPageHeader
        title="Times"
        description="Gerencie os times dos seus campeonatos."
        actionTo="/teams/new"
        actionLabel="Novo time"
      />
      {isError && <FigmaErrorBanner message="Erro ao carregar times." />}
      {!data?.length ? (
        <FigmaEmptyPanel
          title="Nenhum time cadastrado"
          description="Crie seu primeiro time para montar o elenco."
          actionLabel="Criar time"
          actionTo="/teams/new"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className="space-y-3">
                <FigmaListCard
                  title={t.name}
                  subtitle={t.shortName}
                  meta="Ver elenco e gestão"
                  actionLabel="Gerenciar →"
                  actionTo={`/teams/${t.id}`}
                />
                <FigmaRowActions
                  editTo={`/teams/${t.id}/edit`}
                  onDelete={() => {
                    if (confirm(`Excluir time "${t.name}"?`)) deleteMutation.mutate(t.id);
                  }}
                  deleting={deleteMutation.isPending}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
