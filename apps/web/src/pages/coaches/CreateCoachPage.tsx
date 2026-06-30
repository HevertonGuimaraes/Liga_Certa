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
  name: z.string().min(2, 'Nome obrigatório'),
  teamId: z.string().uuid('Selecione um time'),
});

type FormData = z.infer<typeof schema>;

export default function CreateCoachPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: () => api.get('/teams').then((r) => r.data),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/coaches', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches'] });
      navigate('/coaches');
    },
  });

  return (
    <div>
      <AppPageHeader title="Novo Técnico" description="Cadastre o técnico vinculado a um time." />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          <FigmaFormField label="Nome do técnico" error={errors.name?.message}>
            <FigmaInput placeholder="Nome completo" {...register('name')} />
          </FigmaFormField>
          <FigmaFormField label="Time" error={errors.teamId?.message}>
            <FigmaSelect {...register('teamId')}>
              <option value="">Selecione o time...</option>
              {teams?.map((t: { id: string; name: string }) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </FigmaSelect>
          </FigmaFormField>
          <FigmaFormActions onCancel={() => navigate(-1)} submitLabel="Salvar técnico" loading={mutation.isPending} />
        </form>
      </FigmaPanel>
    </div>
  );
}
