import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Building2, MapPin, Globe2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type BillingPeriod = 'mensal' | 'trimestral' | 'semestral' | 'anual';

const periods: { id: BillingPeriod; label: string; shortLabel: string }[] = [
  { id: 'mensal', label: 'Mensal', shortLabel: 'Mensal' },
  { id: 'trimestral', label: 'Trimestral', shortLabel: 'Trim.' },
  { id: 'semestral', label: 'Semestral', shortLabel: 'Sem.' },
  { id: 'anual', label: 'Anual', shortLabel: 'Anual' },
];

const bairroFeatures = [
  '3 patrocinadores por campeonato',
  '300 jogadores por campeonato',
  '3 Campeonatos ativos',
  'Modelos de Súmulas',
  'Sem propagandas',
  'URL personalizada',
  'Arquivos de anexo',
  'Imprimir relatórios',
];

const cidadeExtras = [
  'Tudo do plano BAIRRO',
  '6 patrocinadores por campeonato',
  '600 jogadores por campeonato',
  '6 Campeonatos ativos',
];

const nacaoExtras = [
  'Tudo do plano CIDADE',
  '12 patrocinadores por campeonato',
  '1200 jogadores por campeonato',
  'Campeonatos Ilimitados',
];

const plans = [
  {
    id: 'bairro',
    name: 'BAIRRO',
    icon: Building2,
    monthlyPrice: 0,
    features: bairroFeatures,
    featured: false,
  },
  {
    id: 'cidade',
    name: 'CIDADE',
    icon: MapPin,
    monthlyPrice: 32,
    features: cidadeExtras,
    featured: true,
  },
  {
    id: 'nacao',
    name: 'NAÇÃO',
    icon: Globe2,
    monthlyPrice: 40,
    features: nacaoExtras,
    featured: false,
  },
];

function formatPrice(monthly: number, period: BillingPeriod) {
  const multipliers: Record<BillingPeriod, number> = {
    mensal: 1,
    trimestral: 3,
    semestral: 6,
    anual: 12,
  };
  const discounts: Record<BillingPeriod, number> = {
    mensal: 1,
    trimestral: 0.95,
    semestral: 0.9,
    anual: 0.85,
  };
  const total = monthly * multipliers[period] * discounts[period];
  const suffix = period === 'mensal' ? '/mês' : `/${period}`;
  if (monthly === 0) return 'R$ 0/mês';
  return `R$ ${Math.round(total)}${suffix}`;
}

export function HomePricingSection() {
  const [period, setPeriod] = useState<BillingPeriod>('mensal');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <section id="planos" className="bg-liga-surface px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-body text-4xl font-extrabold text-[#021124] sm:text-5xl lg:text-6xl">
            Nossos planos
          </h2>
          <p className="mt-4 font-body text-xl font-medium text-[#021124]/80 sm:text-2xl lg:text-3xl">
            Temos planos na medida certa para o seu bolso!
          </p>
        </div>

        {/* Seletor de período — grid 2x2 no mobile para não estourar o texto */}
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl bg-[#021124] p-1.5 shadow-lg sm:max-w-3xl lg:max-w-4xl">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
            {periods.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={cn(
                  'min-w-0 rounded-xl px-2 py-3 font-body text-xs font-bold leading-snug transition-all sm:px-3 sm:py-3.5 sm:text-sm md:text-base lg:px-4 lg:text-lg',
                  period === p.id
                    ? 'bg-liga-blue text-white shadow-md ring-2 ring-liga-blue-light/50'
                    : 'text-white/75 hover:bg-white/10 hover:text-white',
                )}
              >
                <span className="block truncate sm:hidden">{p.shortLabel}</span>
                <span className="hidden truncate sm:block">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const isHovered = hoveredPlan === plan.id;
            const isActive = plan.featured || isHovered;

            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={cn(
                  'flex flex-col rounded-3xl border-2 p-8 transition-all duration-300',
                  isActive
                    ? 'scale-[1.02] border-liga-blue bg-gradient-to-b from-[#0793ff] to-[#0054ff] shadow-2xl shadow-liga-blue/35'
                    : 'border-[#295fcc]/50 bg-gradient-to-b from-[#17213d] to-[#010d2c] hover:scale-[1.02] hover:border-liga-blue/80 hover:from-[#1e3a5f] hover:to-[#0a1628] hover:shadow-xl hover:shadow-liga-blue/25',
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                      isActive ? 'bg-white/20' : 'bg-liga-blue/20',
                    )}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-display text-3xl font-bold text-white lg:text-4xl">{plan.name}</h3>
                </div>

                <p className="mt-6 break-words font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {formatPrice(plan.monthlyPrice, period)}
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 font-display text-sm text-white/95 sm:text-base">
                      <Check
                        className={cn(
                          'mt-0.5 h-4 w-4 shrink-0',
                          isActive ? 'text-white' : 'text-liga-blue-light',
                        )}
                        strokeWidth={3}
                      />
                      <span className={f.includes('Ilimitados') ? 'font-semibold underline decoration-liga-blue-light' : ''}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={cn(
                    'mt-8 block rounded-xl py-4 text-center font-body text-base font-bold uppercase transition sm:text-lg',
                    isActive
                      ? 'bg-white text-liga-blue hover:bg-[#ebf7ff]'
                      : 'bg-liga-blue text-white hover:bg-liga-blue-dark',
                  )}
                >
                  Assinar plano
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
