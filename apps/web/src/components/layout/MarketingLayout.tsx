import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';

const navLinks = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#caracteristicas', label: 'características' },
  { href: '/#campeonatos', label: 'Campeonatos' },
  { href: '/#planos', label: 'Planos' },
  { href: '/#contato', label: 'Fale conosco' },
];

interface MarketingHeaderProps {
  variant?: 'transparent' | 'solid';
}

export function MarketingHeader({ variant = 'transparent' }: MarketingHeaderProps) {
  const location = useLocation();
  const isAuth = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  return (
    <header
      className={cn(
        'relative z-20 w-full px-6 py-6 lg:px-12',
        variant === 'solid' && 'bg-liga-navy',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-liga-blue font-display text-lg font-extrabold text-white">
            LC
          </div>
          <span className="font-display text-xl font-semibold text-white">Liga Certa</span>
        </Link>

        <nav className="hidden items-center gap-8 xl:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="liga-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          to={isAuth ? '/login' : '/login'}
          className="rounded-xl bg-liga-blue px-5 py-2.5 font-body text-base font-medium text-white transition hover:bg-liga-blue/90"
        >
          Acessar conta
        </Link>
      </div>
    </header>
  );
}

export function HeroBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden liga-hero-bg">
      <div className="liga-glow-orb -right-32 top-0 h-[500px] w-[500px]" />
      <div className="liga-glow-orb -left-20 top-40 h-[300px] w-[300px] bg-liga-blue/30" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function AppPageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-liga-navy">
      <div className="liga-glow-orb -right-40 -top-20 h-[400px] w-[400px]" />
      <div className="liga-glow-orb -left-32 top-1/3 h-[250px] w-[250px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
