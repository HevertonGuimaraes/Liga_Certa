import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AppPageHeader } from '@/layouts/AppLayout';
import { FigmaPanel, FigmaErrorBanner } from '@/components/layout/FigmaAppUI';
import { Skeleton } from '@/design-system/components';
import api from '@/api/client';

const stats = [
  { key: 'championships', label: 'Campeonatos', icon: Trophy },
  { key: 'teams', label: 'Times', icon: Users },
  { key: 'matches', label: 'Partidas', icon: Calendar },
  { key: 'goals', label: 'Gols', icon: TrendingUp },
] as const;

const quickLinks = [
  { to: '/championships/new', label: 'Criar campeonato', desc: 'Comece um novo torneio' },
  { to: '/teams/new', label: 'Cadastrar time', desc: 'Adicione equipes' },
  { to: '/matches', label: 'Ver partidas', desc: 'Agenda e resultados' },
];

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/statistics/dashboard').then((r) => r.data),
  });

  return (
    <div>
      <AppPageHeader
        title="Bem-vindo!"
        description="Tudo para organizar seu torneio em um só lugar."
      />

      {isError && (
        <FigmaErrorBanner message="Erro ao carregar dashboard. Verifique se a API está rodando." />
      )}

      <FigmaPanel className="mb-8 border border-liga-blue/20 bg-gradient-to-r from-liga-panel/80 to-liga-navy-deep/80">
        <p className="font-display text-lg text-white/80">
          Gerencie campeonatos, publique tabelas, resultados e estatísticas para atletas e torcedores.
        </p>
        <Link to="/championships/new" className="liga-btn-primary mt-6 inline-flex items-center gap-2">
          Criar um torneio <ArrowRight className="h-5 w-5" />
        </Link>
      </FigmaPanel>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ key, label, icon: Icon }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="liga-card-championship"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-sm text-white/70">{label}</p>
              <Icon className="h-5 w-5 text-liga-blue" />
            </div>
            {isLoading ? (
              <Skeleton className="mt-3 h-8 w-16 bg-white/10" />
            ) : (
              <p className="mt-2 font-display text-3xl font-bold text-white">{data?.[key] ?? 0}</p>
            )}
          </motion.div>
        ))}
      </div>

      <h2 className="mb-4 mt-10 font-display text-xl font-semibold text-white">Acesso rápido</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {quickLinks.map((link, i) => (
          <motion.div key={link.to} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
            <Link to={link.to} className="block rounded-2xl bg-liga-panel/50 p-5 transition hover:bg-liga-panel/80">
              <p className="font-display font-semibold text-white">{link.label}</p>
              <p className="mt-1 font-display text-sm text-white/60">{link.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
