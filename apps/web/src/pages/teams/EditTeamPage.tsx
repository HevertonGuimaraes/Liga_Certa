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
  shortName: z.string().min(2).max(5),
  championshipId: z.string().uuid(),
});

type FormData = z.infer<typeof schema>;

export default function EditTeamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['team', id],
    queryFn: () => api.get(`/teams/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const { data: championships } = useQuery({
    queryKey: ['championships'],
    queryFn: () => api.get('/championships').then((r) => r.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (data) reset({ name: data.name, shortName: data.shortName, championshipId: data.championshipId });
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (form: FormData) => api.patch(`/teams/${id}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      navigate(`/teams/${id}`);
    },
  });

  if (isLoading) return <LoadingState message="Carregando..." />;
  if (isError) return <FigmaErrorBanner message="Erro ao carregar time." />;

  return (
    <div>
      <AppPageHeader title="Editar Time" />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          <FigmaFormField label="Nome" error={errors.name?.message}>
            <FigmaInput {...register('name')} />
          </FigmaFormField>
          <FigmaFormField label="Sigla" error={errors.shortName?.message}>
            <FigmaInput {...register('shortName')} />
          </FigmaFormField>
          <FigmaFormField label="Campeonato" error={errors.championshipId?.message}>
            <FigmaSelect {...register('championshipId')}>
              {championships?.map((c: { id: string; name: string }) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </FigmaSelect>
          </FigmaFormField>
          <FigmaFormActions onCancel={() => navigate(-1)} submitLabel="Salvar" loading={mutation.isPending} />
        </form>
      </FigmaPanel>
    </div>
  );
}
