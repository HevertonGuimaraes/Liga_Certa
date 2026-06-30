import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppPageHeader } from '@/layouts/AppLayout';
import {
  FigmaPanel,
  FigmaFormField,
  FigmaInput,
  FigmaSelect,
  FigmaFormActions,
  FigmaErrorBanner,
} from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Goal } from '@/types';

const schema = z.object({
  minute: z.coerce.number().int().min(1).max(120),
  playerId: z.string().uuid(),
  matchId: z.string().uuid(),
});

type FormData = z.infer<typeof schema>;

export default function EditGoalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: goals, isLoading, isError } = useQuery({
    queryKey: ['goals'],
    queryFn: () => api.get<Goal[]>('/goals').then((r) => r.data),
  });

  const goal = goals?.find((g) => g.id === id);

  const { data: players } = useQuery({
    queryKey: ['players'],
    queryFn: () => api.get('/players').then((r) => r.data),
  });

  const { data: matches } = useQuery({
    queryKey: ['matches'],
    queryFn: () => api.get('/matches').then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (goal) reset({ minute: goal.minute, playerId: goal.playerId, matchId: goal.matchId });
  }, [goal, reset]);

  const mutation = useMutation({
    mutationFn: (form: FormData) => api.patch(`/goals/${id}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['top-scorers'] });
      navigate('/top-scorers');
    },
  });

  if (isLoading) return <LoadingState message="Carregando..." />;
  if (isError || !goal) return <FigmaErrorBanner message="Gol não encontrado." />;

  return (
    <div>
      <AppPageHeader title="Editar Gol" />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <FigmaFormField label="Atleta" error={errors.playerId?.message}>
            <FigmaSelect {...register('playerId')}>
              {players?.map((p: { id: string; name: string }) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </FigmaSelect>
          </FigmaFormField>
          <FigmaFormField label="Partida" error={errors.matchId?.message}>
            <FigmaSelect {...register('matchId')}>
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
          <FigmaFormActions onCancel={() => navigate(-1)} submitLabel="Salvar" loading={mutation.isPending} />
        </form>
      </FigmaPanel>
    </div>
  );
}
