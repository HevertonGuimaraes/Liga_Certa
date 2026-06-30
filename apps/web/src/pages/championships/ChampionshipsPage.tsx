import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppPageHeader } from '@/layouts/AppLayout';
import { FigmaErrorBanner, FigmaEmptyPanel, FigmaListCard, FigmaRowActions } from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import { useDeleteItem } from '@/hooks/useDeleteItem';
import api from '@/api/client';
import type { Championship } from '@/types';

export default function ChampionshipsPage() {
  const deleteMutation = useDeleteItem(['championships'], '/championships');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['championships'],
    queryFn: () => api.get<Championship[]>('/championships').then((r) => r.data),
  });

  if (isLoading) return <LoadingState message="Carregando campeonatos..." className="text-white" />;

  return (
    <div>
      <AppPageHeader
        title="Meus Campeonatos"
        description="Crie e gerencie seus campeonatos esportivos."
        actionTo="/championships/new"
        actionLabel="Novo campeonato"
      />
      {isError && (
        <FigmaErrorBanner message="Erro ao carregar campeonatos. Verifique se a API está rodando." />
      )}
      {!data?.length ? (
        <FigmaEmptyPanel
          title="Nenhum campeonato"
          description="Crie seu primeiro campeonato para começar."
          actionLabel="Criar campeonato"
          actionTo="/championships/new"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="space-y-3">
                <FigmaListCard
                  title={c.name}
                  subtitle={`Temporada ${c.season}`}
                  meta={
                    c.startDate && c.endDate
                      ? `${new Date(c.startDate).toLocaleDateString('pt-BR')} - ${new Date(c.endDate).toLocaleDateString('pt-BR')}`
                      : 'Datas a definir'
                  }
                  actionLabel={`${c.status.toLowerCase()} · Gerenciar →`}
                  actionTo={`/championships/${c.id}`}
                />
                <FigmaRowActions
                  editTo={`/championships/${c.id}/edit`}
                  onDelete={() => {
                    if (confirm(`Excluir campeonato "${c.name}"?`)) deleteMutation.mutate(c.id);
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
