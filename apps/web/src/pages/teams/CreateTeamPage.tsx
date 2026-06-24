import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/PageHeader';
import { Button, Input } from '@/design-system/components';
import api from '@/api/client';

const schema = z.object({
  name: z.string().min(2),
  shortName: z.string().min(2).max(5),
  championshipId: z.string().uuid(),
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
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Criar time" />
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4 rounded-lg border bg-card p-6">
        <div>
          <label className="text-sm font-medium">Nome</label>
          <Input className="mt-1" {...register('name')} />
        </div>
        <div>
          <label className="text-sm font-medium">Sigla</label>
          <Input className="mt-1" maxLength={5} {...register('shortName')} />
        </div>
        <div>
          <label className="text-sm font-medium">Campeonato</label>
          <select className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...register('championshipId')}>
            <option value="">Selecione...</option>
            {championships?.map((c: { id: string; name: string }) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <Button type="submit" loading={mutation.isPending}>Salvar</Button>
      </form>
    </div>
  );
}
