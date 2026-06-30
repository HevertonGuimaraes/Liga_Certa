import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';
import type { Championship } from '@/types';

function formatDates(start?: string, end?: string) {
  if (start && end) {
    return `${new Date(start).toLocaleDateString('pt-BR')} - ${new Date(end).toLocaleDateString('pt-BR')}`;
  }
  return 'Datas a definir';
}

function statusLabel(status: Championship['status']) {
  const map = { DRAFT: 'Rascunho', ACTIVE: 'Em andamento', FINISHED: 'Finalizado' };
  return map[status] ?? status;
}

export function FeaturedChampionshipsSection() {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-championships', search],
    queryFn: () =>
      api
        .get<Championship[]>('/public/championships', { params: search ? { q: search } : {} })
        .then((r) => r.data),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(input.trim());
  };

  return (
    <section id="campeonatos" className="bg-liga-surface px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-liga-blue sm:h-10 sm:w-10" />
          <h2 className="font-display text-3xl font-extrabold text-liga-navy sm:text-4xl lg:text-5xl">
            Campeonatos em destaques
          </h2>
        </div>
        <p className="mt-4 max-w-3xl font-display text-lg text-liga-muted sm:text-xl">
          Confira os campeonatos criados na Liga Certa e acompanhe os resultados.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite o nome do campeonato"
            className="flex-1 rounded-xl border border-liga-muted/30 bg-white px-5 py-3 font-display text-liga-navy outline-none focus:ring-2 focus:ring-liga-blue"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-liga-blue px-8 py-3 font-display font-bold uppercase text-white hover:bg-liga-blue/90"
          >
            <Search className="h-4 w-4" />
            Encontrar
          </button>
        </form>

        {search && (
          <p className="mt-4 font-display text-sm text-liga-muted">
            Resultados para: <strong className="text-liga-navy">{search}</strong>
            {data && ` (${data.length} encontrado${data.length !== 1 ? 's' : ''})`}
          </p>
        )}

        {isLoading ? (
          <p className="mt-12 font-display text-liga-muted">Buscando campeonatos...</p>
        ) : isError ? (
          <p className="mt-12 rounded-xl border border-red-200 bg-red-50 p-4 font-display text-red-700">
            Não foi possível carregar os campeonatos. Verifique se a API está rodando.
          </p>
        ) : !data?.length ? (
          <p className="mt-12 rounded-xl border border-liga-muted/20 bg-white p-6 font-display text-liga-muted">
            {search
              ? 'Nenhum campeonato encontrado com esse nome.'
              : 'Ainda não há campeonatos públicos cadastrados.'}
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white bg-white p-6 shadow-md"
              >
                <h3 className="font-display text-2xl font-extrabold text-liga-accent">{item.name}</h3>
                <p className="mt-2 font-display text-base font-semibold text-liga-muted">
                  Temporada {item.season} • {statusLabel(item.status)}
                </p>
                <p className="mt-1 font-display text-base font-semibold text-liga-muted">
                  {formatDates(item.startDate, item.endDate)}
                </p>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
