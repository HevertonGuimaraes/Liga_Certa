import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Shield,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  TrendingUp,
  ClipboardList,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { AppPageBackground, MarketingHeader } from '@/components/layout/MarketingLayout';

function isNavActive(pathname: string, to: string) {
  if (to === '/dashboard') return pathname === '/dashboard';
  return pathname === to || pathname.startsWith(`${to}/`);
}

const navItems = [
  { to: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { to: '/championships', label: 'Campeonatos', icon: Trophy },
  { to: '/teams', label: 'Times', icon: Shield },
  { to: '/players', label: 'Atletas', icon: Users },
  { to: '/coaches', label: 'Técnicos', icon: ClipboardList },
  { to: '/matches', label: 'Partidas', icon: Calendar },
  { to: '/standings', label: 'Classificação', icon: BarChart3 },
  { to: '/top-scorers', label: 'Artilharia', icon: TrendingUp },
  { to: '/statistics', label: 'Estatísticas', icon: BarChart3 },
  { to: '/settings', label: 'Configurações', icon: Settings },
];

export function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('liga_certa_token');
    window.location.href = '/login';
  };

  return (
    <AppPageBackground>
      <MarketingHeader variant="solid" />
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8 lg:px-12">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-72 transform border-r border-white/10 bg-liga-navy-deep/95 p-6 backdrop-blur transition-transform lg:static lg:translate-x-0 lg:rounded-2xl lg:border lg:bg-liga-panel/60',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <span className="font-display text-lg font-bold text-white">Menu</span>
            <button type="button" onClick={() => setMobileOpen(false)} className="text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 font-display text-sm font-medium transition',
                  isNavActive(location.pathname, to)
                    ? 'bg-liga-blue text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 font-display text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg bg-liga-panel p-2 text-white">
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <Outlet />
        </div>
      </div>
    </AppPageBackground>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('liga_certa_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppPageHeader({
  title,
  description,
  actionTo,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionTo?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 font-display text-base text-white/70 sm:text-xl">{description}</p>}
      </div>
      {actionTo && actionLabel && (
        <Link to={actionTo} className="inline-flex items-center gap-2 rounded-xl bg-liga-blue px-5 py-3 font-display text-sm font-semibold text-white hover:bg-liga-blue/90">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
