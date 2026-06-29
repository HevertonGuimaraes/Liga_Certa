import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Building2, MapPin, Globe2 } from 'lucide-react';

type BillingPeriod = 'mensal' | 'trimestral' | 'semestral' | 'anual';

const periods: { id: BillingPeriod; label: string }[] = [
  { id: 'mensal', label: 'Mensal' },
  { id: 'trimestral', label: 'Trimestral' },
  { id: 'semestral', label: 'Semestral' },
  { id: 'anual', label: 'Anual' },
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
    highlight: false,
  },
  {
    id: 'cidade',
    name: 'CIDADE',
    icon: MapPin,
    monthlyPrice: 32,
    features: cidadeExtras,
    highlight: true,
  },
  {
    id: 'nacao',
    name: 'NAÇÃO',
    icon: Globe2,
    monthlyPrice: 40,
    features: nacaoExtras,
    highlight: false,
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

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2 rounded-2xl bg-[#021124] p-2 sm:gap-0 sm:p-1">
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`flex-1 rounded-xl px-4 py-3 font-body text-sm font-extrabold transition sm:px-6 sm:text-lg lg:text-2xl ${
                period === p.id
                  ? 'bg-liga-blue text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`flex flex-col rounded-3xl border-2 p-8 ${
                  plan.highlight
                    ? 'border-liga-blue bg-gradient-to-b from-liga-blue/90 to-liga-blue-dark shadow-2xl shadow-liga-blue/30'
                    : 'border-liga-blue/40 bg-gradient-to-b from-liga-navy-panel to-liga-navy-deep'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-display text-3xl font-bold text-white lg:text-4xl">{plan.name}</h3>
                </div>

                <p className="mt-6 font-display text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                  {formatPrice(plan.monthlyPrice, period)}
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-display text-sm text-white sm:text-base">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" strokeWidth={3} />
                      <span className={f.includes('Ilimitados') ? 'underline' : ''}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className="mt-8 block rounded-xl bg-white py-4 text-center font-body text-lg font-bold uppercase text-liga-blue transition hover:bg-white/90"
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
