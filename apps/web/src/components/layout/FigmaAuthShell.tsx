import { Link } from 'react-router-dom';
import { MarketingHeader, HeroBackground } from '@/components/layout/MarketingLayout';

interface FigmaAuthShellProps {
  activeTab: 'login' | 'register';
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function FigmaAuthShell({ activeTab, title, subtitle, children }: FigmaAuthShellProps) {
  return (
    <div className="min-h-screen bg-white">
      <HeroBackground>
        <MarketingHeader />
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-4 lg:px-12">
          <Link to="/" className="inline-flex items-center gap-2 font-body text-base text-white/80 transition hover:text-white">
            ← Voltar para o site
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <p className="font-display text-2xl font-semibold uppercase tracking-wide text-liga-blue sm:text-3xl">
                {activeTab === 'register' ? 'CADASTRO' : 'LOGIN'}
              </p>
              <h1 className="mt-4 font-display text-3xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-6 font-display text-xl leading-relaxed text-white/90 sm:text-3xl sm:leading-snug">
                {subtitle}
              </p>
            </div>

            <div className="rounded-3xl bg-liga-navy-deep p-6 sm:p-10">
              <div className="mb-8 flex gap-4 border-b border-white/10 pb-4">
                <Link
                  to="/register"
                  className={`font-display text-xl font-semibold sm:text-2xl ${activeTab === 'register' ? 'text-liga-blue' : 'text-white/60 hover:text-white'}`}
                >
                  Criar conta
                </Link>
                <Link
                  to="/login"
                  className={`font-display text-xl font-semibold sm:text-2xl ${activeTab === 'login' ? 'text-white' : 'text-white/60 hover:text-white'}`}
                >
                  Entrar
                </Link>
              </div>
              {children}
            </div>
          </div>
        </div>
      </HeroBackground>
    </div>
  );
}
