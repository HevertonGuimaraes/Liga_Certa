import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, EmptyState, LoadingState } from '@/design-system/components';
import api from '@/api/client';
import type { Championship } from '@/types';

export default function ChampionshipsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['championships'],
    queryFn: () => api.get<Championship[]>('/championships').then((r) => r.data),
  });

  if (isLoading) return <LoadingState />;
  if (isError) {
    return (
      <div className="space-y-4">
        <PageHeader title="Campeonatos" />
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm">Erro ao carregar campeonatos.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campeonatos"
        description="Gerencie seus campeonatos"
        actions={
          <Button asChild>
            <Link to="/championships/new"><Plus className="h-4 w-4" /> Novo campeonato</Link>
          </Button>
        }
      />
      {!data?.length ? (
        <EmptyState
          title="Nenhum campeonato"
          description="Crie seu primeiro campeonato para começar."
          actionLabel="Criar campeonato"
          onAction={() => (window.location.href = '/championships/new')}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-lg border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{c.name}</h3>
                <Badge variant={c.status === 'ACTIVE' ? 'success' : 'secondary'}>{c.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Temporada {c.season}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
