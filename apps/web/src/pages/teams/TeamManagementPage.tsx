import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader } from '@/layouts/AppLayout';
import {
  FigmaPanel,
  FigmaErrorBanner,
  FigmaEmptyPanel,
  FigmaTable,
  FigmaTableHead,
  FigmaTableBody,
  FigmaTableRow,
  FigmaTableCell,
} from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';

export default function TeamManagementPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['team', id],
    queryFn: () => api.get(`/teams/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  if (isLoading) return <LoadingState message="Carregando time..." />;
  if (isError || !data) {
    return (
      <div>
        <AppPageHeader title="Gestão do time" />
        <FigmaErrorBanner message="Time não encontrado." />
      </div>
    );
  }

  return (
    <div>
      <AppPageHeader
        title={data.name}
        description={`Sigla: ${data.shortName} — Gerencie elenco e técnicos.`}
        actionTo="/players"
        actionLabel="Ver todos atletas"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <FigmaPanel>
          <h3 className="font-display text-xl font-semibold text-white">Elenco</h3>
          {!data.players?.length ? (
            <div className="mt-4">
              <FigmaEmptyPanel title="Nenhum atleta" description="Cadastre atletas para este time." />
            </div>
          ) : (
            <FigmaTable>
              <FigmaTableHead>
                <FigmaTableCell header>#</FigmaTableCell>
                <FigmaTableCell header>Nome</FigmaTableCell>
                <FigmaTableCell header>Posição</FigmaTableCell>
              </FigmaTableHead>
              <FigmaTableBody>
                {data.players.map((p: { id: string; name: string; number: number; position: string }) => (
                  <FigmaTableRow key={p.id}>
                    <FigmaTableCell>{p.number}</FigmaTableCell>
                    <FigmaTableCell className="font-semibold">{p.name}</FigmaTableCell>
                    <FigmaTableCell className="text-liga-blue">{p.position}</FigmaTableCell>
                  </FigmaTableRow>
                ))}
              </FigmaTableBody>
            </FigmaTable>
          )}
        </FigmaPanel>
        <FigmaPanel>
          <h3 className="font-display text-xl font-semibold text-white">Técnicos</h3>
          {!data.coaches?.length ? (
            <p className="mt-4 font-display text-white/60">Nenhum técnico cadastrado.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.coaches.map((c: { id: string; name: string }) => (
                <li key={c.id} className="rounded-xl bg-liga-navy-deep/60 px-4 py-3 font-display text-white">
                  {c.name}
                </li>
              ))}
            </ul>
          )}
          <Link to="/coaches" className="mt-6 inline-block font-display text-sm font-semibold text-liga-blue hover:underline">
            Gerenciar técnicos →
          </Link>
        </FigmaPanel>
      </div>
    </div>
  );
}
