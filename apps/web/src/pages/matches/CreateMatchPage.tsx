import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppPageHeader } from '@/layouts/AppLayout';
import {
  FigmaPanel,
  FigmaFormField,
  FigmaInput,
  FigmaSelect,
  FigmaFormActions,
} from '@/components/layout/FigmaAppUI';
import api from '@/api/client';

const schema = z.object({
  championshipId: z.string().uuid('Selecione o campeonato'),
  homeTeamId: z.string().uuid('Selecione o time mandante'),
  awayTeamId: z.string().uuid('Selecione o time visitante'),
  scheduledAt: z.string().min(1, 'Informe data e hora'),
  homeScore: z.coerce.number().int().min(0).optional(),
  awayScore: z.coerce.number().int().min(0).optional(),
  status: z.enum(['SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED']),
});

type FormData = z.infer<typeof schema>;

export default function CreateMatchPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: championships } = useQuery({
    queryKey: ['championships'],
    queryFn: () => api.get('/championships').then((r) => r.data),
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get('/teams').then((r) => r.data),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'SCHEDULED' },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.post('/matches', {
        ...data,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      navigate('/matches');
    },
  });

  return (
    <div>
      <AppPageHeader title="Nova Partida" description="Cadastre um jogo com placar opcional." />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          <FigmaFormField label="Campeonato" error={errors.championshipId?.message}>
            <FigmaSelect {...register('championshipId')}>
              <option value="">Selecione...</option>
              {championships?.map((c: { id: string; name: string }) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </FigmaSelect>
          </FigmaFormField>
          <FigmaFormField label="Time mandante" error={errors.homeTeamId?.message}>
            <FigmaSelect {...register('homeTeamId')}>
              <option value="">Selecione...</option>
              {teams?.map((t: { id: string; name: string }) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </FigmaSelect>
          </FigmaFormField>
          <FigmaFormField label="Time visitante" error={errors.awayTeamId?.message}>
            <FigmaSelect {...register('awayTeamId')}>
              <option value="">Selecione...</option>
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
          <FigmaFormActions onCancel={() => navigate(-1)} submitLabel="Cadastrar partida" loading={mutation.isPending} />
        </form>
      </FigmaPanel>
    </div>
  );
}
