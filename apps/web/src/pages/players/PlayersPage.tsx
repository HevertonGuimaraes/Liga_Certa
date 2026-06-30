import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppPageHeader } from '@/layouts/AppLayout';
import {
  FigmaErrorBanner,
  FigmaEmptyPanel,
  FigmaTable,
  FigmaTableHead,
  FigmaTableBody,
  FigmaTableRow,
  FigmaTableCell,
  FigmaRowActions,
} from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import { useDeleteItem } from '@/hooks/useDeleteItem';
import api from '@/api/client';
import type { Player } from '@/types';

export default function PlayersPage() {
  const deleteMutation = useDeleteItem(['players'], '/players');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['players'],
    queryFn: () => api.get<Player[]>('/players').then((r) => r.data),
  });

  if (isLoading) return <LoadingState message="Carregando atletas..." />;

  return (
    <div>
      <AppPageHeader
        title="Atletas"
        description="Gerencie o elenco dos times."
        actionTo="/players/new"
        actionLabel="Novo atleta"
      />
      {isError && <FigmaErrorBanner message="Erro ao carregar atletas." />}
      {!data?.length ? (
        <FigmaEmptyPanel
          title="Nenhum atleta cadastrado"
          description="Cadastre o primeiro atleta do seu time."
          actionLabel="Cadastrar atleta"
          actionTo="/players/new"
        />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FigmaTable>
            <FigmaTableHead>
              <FigmaTableCell header>Nome</FigmaTableCell>
              <FigmaTableCell header className="text-center">Número</FigmaTableCell>
              <FigmaTableCell header>Posição</FigmaTableCell>
              <FigmaTableCell header className="text-right">Ações</FigmaTableCell>
            </FigmaTableHead>
            <FigmaTableBody>
              {data.map((p) => (
                <FigmaTableRow key={p.id}>
                  <FigmaTableCell className="font-semibold">{p.name}</FigmaTableCell>
                  <FigmaTableCell className="text-center">{p.number}</FigmaTableCell>
                  <FigmaTableCell className="text-liga-blue">{p.position}</FigmaTableCell>
                  <FigmaTableCell>
                    <FigmaRowActions
                      editTo={`/players/${p.id}/edit`}
                      onDelete={() => {
                        if (confirm(`Excluir atleta "${p.name}"?`)) deleteMutation.mutate(p.id);
                      }}
                      deleting={deleteMutation.isPending}
                    />
                  </FigmaTableCell>
                </FigmaTableRow>
              ))}
            </FigmaTableBody>
          </FigmaTable>
        </motion.div>
      )}
    </div>
  );
}
