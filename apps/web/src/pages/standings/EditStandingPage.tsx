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
  FigmaFormActions,
  FigmaErrorBanner,
} from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';

const schema = z.object({
  played: z.coerce.number().int().min(0),
  wins: z.coerce.number().int().min(0),
  draws: z.coerce.number().int().min(0),
  losses: z.coerce.number().int().min(0),
  goalsFor: z.coerce.number().int().min(0),
  goalsAgainst: z.coerce.number().int().min(0),
  points: z.coerce.number().int().min(0),
});

type FormData = z.infer<typeof schema>;

export default function EditStandingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: standings, isLoading, isError } = useQuery({
    queryKey: ['standings'],
    queryFn: () => api.get('/standings').then((r) => r.data),
  });

  const standing = standings?.find((s: { id: string }) => s.id === id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (standing) {
      reset({
        played: standing.played,
        wins: standing.wins,
        draws: standing.draws,
        losses: standing.losses,
        goalsFor: standing.goalsFor,
        goalsAgainst: standing.goalsAgainst,
        points: standing.points,
      });
    }
  }, [standing, reset]);

  const mutation = useMutation({
    mutationFn: (form: FormData) => api.patch(`/standings/${id}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standings'] });
      navigate('/standings');
    },
  });

  if (isLoading) return <LoadingState message="Carregando..." />;
  if (isError || !standing) return <FigmaErrorBanner message="Classificação não encontrada." />;

  return (
    <div>
      <AppPageHeader title={`Editar — ${standing.teamName}`} />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(['played', 'wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst', 'points'] as const).map((field) => (
              <FigmaFormField key={field} label={field} error={errors[field]?.message}>
                <FigmaInput type="number" min={0} {...register(field)} />
              </FigmaFormField>
            ))}
          </div>
          <FigmaFormActions onCancel={() => navigate(-1)} submitLabel="Salvar" loading={mutation.isPending} />
        </form>
      </FigmaPanel>
    </div>
  );
}
