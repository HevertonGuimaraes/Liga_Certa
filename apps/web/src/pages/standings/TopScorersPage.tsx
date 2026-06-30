import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppPageHeader } from '@/layouts/AppLayout';
import {
  FigmaEmptyPanel,
  FigmaErrorBanner,
  FigmaPanel,
  FigmaFormField,
  FigmaInput,
  FigmaSelect,
  FigmaFormActions,
  FigmaRowActions,
} from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import { useDeleteItem } from '@/hooks/useDeleteItem';
import api from '@/api/client';
import type { Goal } from '@/types';

interface Scorer {
  playerId: string;
  playerName: string;
  teamName: string;
  goals: number;
}

const goalSchema = z.object({
  minute: z.coerce.number().int().min(1).max(120),
  playerId: z.string().uuid(),
  matchId: z.string().uuid(),
});

type GoalForm = z.infer<typeof goalSchema>;

export default function TopScorersPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const deleteGoal = useDeleteItem(['goals', 'top-scorers'], '/goals');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['top-scorers'],
    queryFn: () => api.get<Scorer[]>('/statistics/top-scorers').then((r) => r.data),
  });

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: () => api.get<Goal[]>('/goals').then((r) => r.data),
  });

  const { data: players } = useQuery({
    queryKey: ['players'],
    queryFn: () => api.get('/players').then((r) => r.data),
  });

  const { data: matches } = useQuery({
    queryKey: ['matches'],
    queryFn: () => api.get('/matches').then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
  });

  const createGoal = useMutation({
    mutationFn: (form: GoalForm) => api.post('/goals', form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['top-scorers'] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      reset();
      setShowForm(false);
    },
  });

  if (isLoading) return <LoadingState message="Carregando artilharia..." />;

  return (
    <div>
      <AppPageHeader title="Artilharia" description="Ranking de goleadores e gestão de gols." />
      <button type="button" onClick={() => setShowForm(!showForm)} className="liga-btn-primary mb-6 inline-flex text-sm">
        {showForm ? 'Cancelar' : 'Registrar gol'}
      </button>

      {isError && <FigmaErrorBanner message="Erro ao carregar artilharia." />}

      {showForm && (
        <FigmaPanel className="mb-6 max-w-2xl">
          <form onSubmit={handleSubmit((d) => createGoal.mutate(d))} className="space-y-4">
            <FigmaFormField label="Atleta" error={errors.playerId?.message}>
              <FigmaSelect {...register('playerId')}>
                <option value="">Selecione...</option>
                {players?.map((p: { id: string; name: string }) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </FigmaSelect>
            </FigmaFormField>
            <FigmaFormField label="Partida" error={errors.matchId?.message}>
              <FigmaSelect {...register('matchId')}>
                <option value="">Selecione...</option>
                {matches?.map((m: { id: string; homeTeam?: { name: string }; awayTeam?: { name: string } }) => (
                  <option key={m.id} value={m.id}>
                    {m.homeTeam?.name ?? 'Mandante'} x {m.awayTeam?.name ?? 'Visitante'}
                  </option>
                ))}
              </FigmaSelect>
            </FigmaFormField>
            <FigmaFormField label="Minuto" error={errors.minute?.message}>
              <FigmaInput type="number" min={1} max={120} {...register('minute')} />
            </FigmaFormField>
            <FigmaFormActions onCancel={() => setShowForm(false)} submitLabel="Registrar gol" loading={createGoal.isPending} />
          </form>
        </FigmaPanel>
      )}

      {!data?.length ? (
        <FigmaEmptyPanel title="Sem gols registrados" description="Registre gols nas partidas." />
      ) : (
        <FigmaPanel className="mb-8 overflow-hidden p-0">
          <ol className="divide-y divide-white/10">
            {data.map((s, i) => (
              <motion.li
                key={s.playerId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between px-6 py-5"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-liga-blue font-display text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold text-white">{s.playerName}</p>
                    <p className="font-display text-sm text-white/60">{s.teamName}</p>
                  </div>
                </div>
                <span className="font-display text-2xl font-bold text-liga-blue">{s.goals}</span>
              </motion.li>
            ))}
          </ol>
        </FigmaPanel>
      )}

      {goals && goals.length > 0 && (
        <>
          <h2 className="mb-4 font-display text-xl font-semibold text-white">Gols cadastrados</h2>
          <FigmaPanel>
            <ul className="divide-y divide-white/10">
              {goals.map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="font-display text-white">
                    {g.player?.name ?? 'Atleta'} — {g.minute}&apos; —{' '}
                    {g.match?.homeTeam?.name} x {g.match?.awayTeam?.name}
                  </span>
                  <FigmaRowActions
                    editTo={`/goals/${g.id}/edit`}
                    onDelete={() => {
                      if (confirm('Excluir este gol?')) deleteGoal.mutate(g.id);
                    }}
                    deleting={deleteGoal.isPending}
                  />
                </li>
              ))}
            </ul>
          </FigmaPanel>
        </>
      )}
    </div>
  );
}
