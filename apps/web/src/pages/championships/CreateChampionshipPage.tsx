import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/PageHeader';
import { Button, Input } from '@/design-system/components';
import api from '@/api/client';

const schema = z.object({
  name: z.string().min(2),
  season: z.string().min(4),
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
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Criar campeonato" description="Preencha os dados do novo campeonato" />
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4 rounded-lg border bg-card p-6">
        <div>
          <label className="text-sm font-medium">Nome</label>
          <Input className="mt-1" {...register('name')} state={errors.name ? 'error' : 'default'} />
        </div>
        <div>
          <label className="text-sm font-medium">Temporada</label>
          <Input className="mt-1" placeholder="2026" {...register('season')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Início</label>
            <Input className="mt-1" type="date" {...register('startDate')} />
          </div>
          <div>
            <label className="text-sm font-medium">Fim</label>
            <Input className="mt-1" type="date" {...register('endDate')} />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button type="submit" loading={mutation.isPending}>Salvar</Button>
        </div>
      </form>
    </div>
  );
}
