import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppPageHeader } from '@/layouts/AppLayout';
import {
  FigmaPanel,
  FigmaFormField,
  FigmaInput,
  FigmaSelect,
  FigmaFormActions,
  FigmaRowActions,
  FigmaTable,
  FigmaTableHead,
  FigmaTableBody,
  FigmaTableRow,
  FigmaTableCell,
  FigmaEmptyPanel,
  FigmaErrorBanner,
} from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import { useDeleteItem } from '@/hooks/useDeleteItem';
import api from '@/api/client';
import type { Standing } from '@/types';

const schema = z.object({
  teamId: z.string().uuid(),
  championshipId: z.string().uuid(),
  played: z.coerce.number().int().min(0),
  wins: z.coerce.number().int().min(0),
  draws: z.coerce.number().int().min(0),
  losses: z.coerce.number().int().min(0),
  goalsFor: z.coerce.number().int().min(0),
  goalsAgainst: z.coerce.number().int().min(0),
  points: z.coerce.number().int().min(0),
});

type FormData = z.infer<typeof schema>;

export default function StandingsPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteItem(['standings'], '/standings');

  const { data: standings, isLoading, isError } = useQuery({
    queryKey: ['standings'],
    queryFn: () => api.get<Standing[]>('/standings').then((r) => r.data),
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get('/teams').then((r) => r.data),
  });

  const { data: championships } = useQuery({
    queryKey: ['championships'],
    queryFn: () => api.get('/championships').then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => api.post('/standings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standings'] });
      reset();
      setShowForm(false);
    },
  });

  if (isLoading) return <LoadingState message="Carregando classificação..." />;

  return (
    <div>
      <AppPageHeader
        title="Classificação"
        description="Tabela atualizada do campeonato."
      />
      <button
          type="button"
          onClick={() => setShowForm(true)}
          className="liga-btn-primary mb-6 inline-flex text-sm"
      >
        {showForm ? 'Fechar formulário' : 'Cadastrar linha'}
      </button>

      {isError && <FigmaErrorBanner message="Erro ao carregar classificação." />}

      {showForm && (
        <FigmaPanel className="mb-6 max-w-2xl">
          <h3 className="mb-4 font-display text-lg font-semibold text-white">Cadastrar classificação</h3>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <FigmaFormField label="Campeonato" error={errors.championshipId?.message}>
              <FigmaSelect {...register('championshipId')}>
                <option value="">Selecione...</option>
                {championships?.map((c: { id: string; name: string }) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </FigmaSelect>
            </FigmaFormField>
            <FigmaFormField label="Time" error={errors.teamId?.message}>
              <FigmaSelect {...register('teamId')}>
                <option value="">Selecione...</option>
                {teams?.map((t: { id: string; name: string }) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </FigmaSelect>
            </FigmaFormField>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(['played', 'wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst', 'points'] as const).map((field) => (
                <FigmaFormField key={field} label={field}>
                  <FigmaInput type="number" min={0} {...register(field)} />
                </FigmaFormField>
              ))}
            </div>
            <FigmaFormActions onCancel={() => setShowForm(false)} submitLabel="Cadastrar" loading={createMutation.isPending} />
          </form>
        </FigmaPanel>
      )}

      {!standings?.length ? (
        <FigmaEmptyPanel title="Classificação vazia" description="Registre partidas ou cadastre linhas manualmente." />
      ) : (
        <FigmaTable>
          <FigmaTableHead>
            <FigmaTableCell header>#</FigmaTableCell>
            <FigmaTableCell header>Time</FigmaTableCell>
            <FigmaTableCell header className="text-center">J</FigmaTableCell>
            <FigmaTableCell header className="text-center">V</FigmaTableCell>
            <FigmaTableCell header className="text-center">E</FigmaTableCell>
            <FigmaTableCell header className="text-center">D</FigmaTableCell>
            <FigmaTableCell header className="text-center">GP</FigmaTableCell>
            <FigmaTableCell header className="text-center">GC</FigmaTableCell>
            <FigmaTableCell header className="text-center">Pts</FigmaTableCell>
            <FigmaTableCell header className="text-right">Ações</FigmaTableCell>
          </FigmaTableHead>
          <FigmaTableBody>
            {standings.map((s, i) => (
              <FigmaTableRow key={s.id}>
                <FigmaTableCell>{i + 1}</FigmaTableCell>
                <FigmaTableCell className="font-semibold">{s.teamName}</FigmaTableCell>
                <FigmaTableCell className="text-center">{s.played}</FigmaTableCell>
                <FigmaTableCell className="text-center">{s.wins}</FigmaTableCell>
                <FigmaTableCell className="text-center">{s.draws}</FigmaTableCell>
                <FigmaTableCell className="text-center">{s.losses}</FigmaTableCell>
                <FigmaTableCell className="text-center">{s.goalsFor}</FigmaTableCell>
                <FigmaTableCell className="text-center">{s.goalsAgainst}</FigmaTableCell>
                <FigmaTableCell className="text-center font-bold text-liga-blue">{s.points}</FigmaTableCell>
                <FigmaTableCell>
                  <FigmaRowActions
                    editTo={`/standings/${s.id}/edit`}
                    onDelete={() => {
                      if (confirm('Excluir esta linha da classificação?')) deleteMutation.mutate(s.id);
                    }}
                    deleting={deleteMutation.isPending}
                  />
                </FigmaTableCell>
              </FigmaTableRow>
            ))}
          </FigmaTableBody>
        </FigmaTable>
      )}
    </div>
  );
}
