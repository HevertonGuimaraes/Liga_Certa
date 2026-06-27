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
  name: z.string().min(2),
  shortName: z.string().min(2).max(5),
  championshipId: z.string().uuid('Selecione um campeonato'),
});

type FormData = z.infer<typeof schema>;

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: championships } = useQuery({
    queryKey: ['championships'],
    queryFn: () => api.get('/championships').then((r) => r.data),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/teams', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      navigate('/teams');
    },
  });

  return (
    <div>
      <AppPageHeader title="Novo Time" description="Cadastre um novo time no campeonato." />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          <FigmaFormField label="Nome do time" error={errors.name?.message}>
            <FigmaInput placeholder="Nome completo do time" {...register('name')} />
          </FigmaFormField>
          <FigmaFormField label="Sigla" error={errors.shortName?.message}>
            <FigmaInput placeholder="ABC" maxLength={5} {...register('shortName')} />
          </FigmaFormField>
          <FigmaFormField label="Campeonato" error={errors.championshipId?.message}>
            <FigmaSelect {...register('championshipId')}>
              <option value="">Selecione o campeonato...</option>
              {championships?.map((c: { id: string; name: string }) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </FigmaSelect>
          </FigmaFormField>
          <FigmaFormActions onCancel={() => navigate(-1)} submitLabel="Salvar time" loading={mutation.isPending} />
        </form>
      </FigmaPanel>
    </div>
  );
}
