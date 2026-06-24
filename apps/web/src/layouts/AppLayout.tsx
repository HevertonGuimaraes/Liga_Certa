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
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/design-system/components';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/championships', label: 'Campeonatos', icon: Trophy },
  { to: '/teams', label: 'Times', icon: Shield },
  { to: '/players', label: 'Atletas', icon: Users },
  { to: '/coaches', label: 'Técnicos', icon: Users },
  { to: '/matches', label: 'Partidas', icon: Calendar },
  { to: '/standings', label: 'Classificação', icon: BarChart3 },
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
    <div className="flex min-h-screen bg-muted/30">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-card transition-transform lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-primary">
            <Trophy className="h-6 w-6" />
            Liga Certa
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                location.pathname.startsWith(to)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-4 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-primary lg:flex lg:flex-col lg:justify-center lg:p-12">
        <div className="text-primary-foreground">
          <h1 className="text-4xl font-bold">Liga Certa</h1>
          <p className="mt-4 text-lg opacity-90">
            Gestão completa de campeonatos esportivos. Times, atletas, partidas e estatísticas em um só lugar.
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <Outlet />
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('liga_certa_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
