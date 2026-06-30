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

const schema = z.object({
  homeTeamId: z.string().uuid(),
  awayTeamId: z.string().uuid(),
  scheduledAt: z.string().min(1),
  homeScore: z.coerce.number().int().min(0).optional(),
  awayScore: z.coerce.number().int().min(0).optional(),
  status: z.enum(['SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED']),
});

type FormData = z.infer<typeof schema>;

export default function EditMatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['match', id],
    queryFn: () => api.get(`/matches/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get('/teams').then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (data) {
      const dt = new Date(data.scheduledAt);
      const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      reset({
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,
        scheduledAt: local,
        homeScore: data.homeScore ?? undefined,
        awayScore: data.awayScore ?? undefined,
        status: data.status,
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (form: FormData) =>
      api.patch(`/matches/${id}`, {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      navigate('/matches');
    },
  });

  if (isLoading) return <LoadingState message="Carregando..." />;
  if (isError) return <FigmaErrorBanner message="Erro ao carregar partida." />;

  return (
    <div>
      <AppPageHeader title="Editar Partida" />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          <FigmaFormField label="Mandante" error={errors.homeTeamId?.message}>
            <FigmaSelect {...register('homeTeamId')}>
              {teams?.map((t: { id: string; name: string }) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </FigmaSelect>
          </FigmaFormField>
          <FigmaFormField label="Visitante" error={errors.awayTeamId?.message}>
            <FigmaSelect {...register('awayTeamId')}>
              {teams?.map((t: { id: string; name: string }) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </FigmaSelect>
          </FigmaFormField>
          <FigmaFormField label="Data e hora" error={errors.scheduledAt?.message}>
            <FigmaInput type="datetime-local" {...register('scheduledAt')} />
          </FigmaFormField>
          <div className="grid gap-6 sm:grid-cols-2">
            <FigmaFormField label="Gols mandante">
              <FigmaInput type="number" min={0} {...register('homeScore')} />
            </FigmaFormField>
            <FigmaFormField label="Gols visitante">
              <FigmaInput type="number" min={0} {...register('awayScore')} />
            </FigmaFormField>
          </div>
          <FigmaFormField label="Status">
            <FigmaSelect {...register('status')}>
              <option value="SCHEDULED">Agendada</option>
              <option value="LIVE">Ao vivo</option>
              <option value="FINISHED">Finalizada</option>
              <option value="CANCELLED">Cancelada</option>
            </FigmaSelect>
          </FigmaFormField>
          <FigmaFormActions onCancel={() => navigate(-1)} submitLabel="Salvar" loading={mutation.isPending} />
        </form>
      </FigmaPanel>
    </div>
  );
}
