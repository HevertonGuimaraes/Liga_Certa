import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HeroBackground, MarketingHeader } from '@/components/layout/MarketingLayout';
import {
  FigmaPanel,
  FigmaTable,
  FigmaTableHead,
  FigmaTableBody,
  FigmaTableRow,
  FigmaTableCell,
} from '@/components/layout/FigmaAppUI';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';

export default function PublicPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', slug],
    queryFn: () => api.get(`/public/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <HeroBackground>
        <LoadingState message="Carregando..." className="min-h-screen" />
      </HeroBackground>
    );
  }

  if (isError || !data) {
    return (
      <HeroBackground>
        <MarketingHeader />
        <div className="flex min-h-[60vh] items-center justify-center px-6">
          <FigmaPanel className="text-center">
            <p className="font-display text-xl text-white">Página pública não encontrada.</p>
            <Link to="/" className="liga-btn-primary mt-6 inline-flex">Voltar ao site</Link>
          </FigmaPanel>
        </div>
      </HeroBackground>
    );
  }

  return (
    <div className="min-h-screen bg-liga-navy">
      <HeroBackground>
        <MarketingHeader variant="solid" />
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 lg:px-12">
          <h1 className="font-display text-4xl font-bold text-white">{data.title}</h1>
          <p className="mt-2 font-display text-lg capitalize text-liga-blue">{String(data.type).toLowerCase()}</p>

          {data.standings?.length > 0 && (
            <FigmaPanel className="mt-10">
              <h2 className="mb-6 font-display text-2xl font-semibold text-white">Classificação</h2>
              <FigmaTable>
                <FigmaTableHead>
                  <FigmaTableCell header>Time</FigmaTableCell>
                  <FigmaTableCell header className="text-center">Pts</FigmaTableCell>
                  <FigmaTableCell header className="text-center">J</FigmaTableCell>
                </FigmaTableHead>
                <FigmaTableBody>
                  {data.standings.map((s: { id: string; team?: { name: string }; points: number; played: number }) => (
                    <FigmaTableRow key={s.id}>
                      <FigmaTableCell className="font-semibold">{s.team?.name ?? '-'}</FigmaTableCell>
                      <FigmaTableCell className="text-center font-bold text-liga-blue">{s.points}</FigmaTableCell>
                      <FigmaTableCell className="text-center">{s.played}</FigmaTableCell>
                    </FigmaTableRow>
                  ))}
                </FigmaTableBody>
              </FigmaTable>
            </FigmaPanel>
          )}
        </div>
      </HeroBackground>
    </div>
  );
}
