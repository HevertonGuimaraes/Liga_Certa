import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';
import { LoadingState } from '@/design-system/components';
import api from '@/api/client';

export default function PublicPage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', slug],
    queryFn: () => api.get(`/public/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });

  if (isLoading) return <LoadingState className="min-h-screen" />;
  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Página pública não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-6">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <p className="text-muted-foreground">{data.type}</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 p-4">
        {data.standings && (
          <section className="rounded-lg border bg-card p-4">
            <h2 className="mb-4 text-lg font-semibold">Classificação</h2>
            <pre className="text-sm overflow-auto">{JSON.stringify(data.standings, null, 2)}</pre>
          </section>
        )}
      </main>
    </div>
  );
}
