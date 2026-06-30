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
  name: z.string().min(2),
  number: z.coerce.number().int().min(1).max(99),
  position: z.string().min(2),
  teamId: z.string().uuid(),
});

type FormData = z.infer<typeof schema>;

export default function EditPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['player', id],
    queryFn: () => api.get(`/players/${id}`).then((r) => r.data),
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
    if (data) reset({ name: data.name, number: data.number, position: data.position, teamId: data.teamId });
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (form: FormData) => api.patch(`/players/${id}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      navigate('/players');
    },
  });

  if (isLoading) return <LoadingState message="Carregando..." />;
  if (isError) return <FigmaErrorBanner message="Erro ao carregar atleta." />;

  return (
    <div>
      <AppPageHeader title="Editar Atleta" />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          <FigmaFormField label="Nome" error={errors.name?.message}>
            <FigmaInput {...register('name')} />
          </FigmaFormField>
          <FigmaFormField label="Número" error={errors.number?.message}>
            <FigmaInput type="number" {...register('number')} />
          </FigmaFormField>
          <FigmaFormField label="Posição" error={errors.position?.message}>
            <FigmaInput {...register('position')} />
          </FigmaFormField>
          <FigmaFormField label="Time" error={errors.teamId?.message}>
            <FigmaSelect {...register('teamId')}>
              {teams?.map((t: { id: string; name: string }) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </FigmaSelect>
          </FigmaFormField>
          <FigmaFormActions onCancel={() => navigate(-1)} submitLabel="Salvar" loading={mutation.isPending} />
        </form>
      </FigmaPanel>
    </div>
  );
}
