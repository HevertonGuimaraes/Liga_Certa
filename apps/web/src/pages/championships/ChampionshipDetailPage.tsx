import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader } from '@/layouts/AppLayout';
import { FigmaErrorBanner, FigmaPanel, FigmaListCard } from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Championship, Team } from '@/types';

export default function ChampionshipDetailPage() {
  const { id } = useParams();
  const { data: championship, isLoading, isError } = useQuery({
    queryKey: ['championship', id],
    queryFn: () => api.get<Championship>(`/championships/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const { data: teams } = useQuery({
    queryKey: ['teams', id],
    queryFn: () => api.get<Team[]>('/teams', { params: { championshipId: id } }).then((r) => r.data),
    enabled: !!id,
  });

  if (isLoading) return <LoadingState message="Carregando campeonato..." className="text-white" />;

  if (isError || !championship) {
    return <FigmaErrorBanner message="Campeonato não encontrado." />;
  }

  return (
    <div>
      <AppPageHeader
        title={championship.name}
        description={`Temporada ${championship.season} • ${championship.status}`}
        actionTo={`/championships/${id}/edit`}
        actionLabel="Editar campeonato"
      />
      <FigmaPanel className="mb-8">
        <p className="font-display text-white/70">
          {championship.startDate && championship.endDate
            ? `${new Date(championship.startDate).toLocaleDateString('pt-BR')} — ${new Date(championship.endDate).toLocaleDateString('pt-BR')}`
            : 'Datas a definir'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to={`/teams/new?championshipId=${id}`} className="liga-btn-primary inline-flex text-sm">
            Novo time
          </Link>
          <Link to="/matches/new" className="rounded-xl border border-white/20 px-4 py-2 font-display text-sm text-white hover:bg-white/10">
            Nova partida
          </Link>
        </div>
      </FigmaPanel>

      <h2 className="mb-4 font-display text-xl font-semibold text-white">Times do campeonato</h2>
      {!teams?.length ? (
        <FigmaPanel>
          <p className="font-display text-white/60">Nenhum time cadastrado neste campeonato.</p>
        </FigmaPanel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {teams.map((t) => (
            <FigmaListCard
              key={t.id}
              title={t.name}
              subtitle={t.shortName}
              actionLabel="Gerenciar →"
              actionTo={`/teams/${t.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
