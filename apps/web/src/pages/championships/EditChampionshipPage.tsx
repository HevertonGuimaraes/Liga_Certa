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
  name: z.string().min(2, 'Nome obrigatório'),
  season: z.string().min(4, 'Informe a temporada'),
  status: z.enum(['DRAFT', 'ACTIVE', 'FINISHED']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditChampionshipPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['championship', id],
    queryFn: () => api.get(`/championships/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        season: data.season,
        status: data.status,
        startDate: data.startDate ? data.startDate.slice(0, 10) : '',
        endDate: data.endDate ? data.endDate.slice(0, 10) : '',
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (form: FormData) =>
      api.patch(`/championships/${id}`, {
        ...form,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['championships'] });
      queryClient.invalidateQueries({ queryKey: ['championship', id] });
      navigate(`/championships/${id}`);
    },
  });

  if (isLoading) return <LoadingState message="Carregando..." className="text-white" />;
  if (isError) return <FigmaErrorBanner message="Erro ao carregar campeonato." />;

  return (
    <div>
      <AppPageHeader title="Editar Campeonato" description="Atualize os dados da competição." />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          <FigmaFormField label="Nome" error={errors.name?.message}>
            <FigmaInput {...register('name')} />
          </FigmaFormField>
          <FigmaFormField label="Temporada" error={errors.season?.message}>
            <FigmaInput {...register('season')} />
          </FigmaFormField>
          <FigmaFormField label="Status" error={errors.status?.message}>
            <FigmaSelect {...register('status')}>
              <option value="DRAFT">Rascunho</option>
              <option value="ACTIVE">Em andamento</option>
              <option value="FINISHED">Finalizado</option>
            </FigmaSelect>
          </FigmaFormField>
          <div className="grid gap-6 sm:grid-cols-2">
            <FigmaFormField label="Início">
              <FigmaInput type="date" {...register('startDate')} />
            </FigmaFormField>
            <FigmaFormField label="Término">
              <FigmaInput type="date" {...register('endDate')} />
            </FigmaFormField>
          </div>
          <FigmaFormActions onCancel={() => navigate(-1)} submitLabel="Salvar" loading={mutation.isPending} />
        </form>
      </FigmaPanel>
    </div>
  );
}
