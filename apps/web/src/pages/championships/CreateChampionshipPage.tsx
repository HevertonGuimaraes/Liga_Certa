import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppPageHeader } from '@/layouts/AppLayout';
import {
  FigmaPanel,
  FigmaFormField,
  FigmaInput,
  FigmaFormActions,
} from '@/components/layout/FigmaAppUI';
import api from '@/api/client';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  season: z.string().min(4, 'Informe a temporada'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateChampionshipPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/championships', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['championships'] });
      navigate('/championships');
    },
  });

  return (
    <div>
      <AppPageHeader title="Novo Campeonato" description="Preencha os dados para criar sua competição." />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          <FigmaFormField label="Nome do campeonato" error={errors.name?.message}>
            <FigmaInput placeholder="Digite o nome do campeonato" {...register('name')} />
          </FigmaFormField>
          <FigmaFormField label="Temporada" error={errors.season?.message}>
            <FigmaInput placeholder="2026" {...register('season')} />
          </FigmaFormField>
          <div className="grid gap-6 sm:grid-cols-2">
            <FigmaFormField label="Data de início">
              <FigmaInput type="date" {...register('startDate')} />
            </FigmaFormField>
            <FigmaFormField label="Data de término">
              <FigmaInput type="date" {...register('endDate')} />
            </FigmaFormField>
          </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Testar Envio Real
          </button>
          <FigmaFormActions
            onCancel={() => navigate(-1)}
            submitLabel="Criar campeonato"
            loading={mutation.isPending}
          />
        </form>
      </FigmaPanel>
    </div>
  );
}
