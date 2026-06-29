import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { MarketingHeader, HeroBackground } from '@/components/layout/MarketingLayout';
import { HomeHeroSection } from '@/components/marketing/HomeHeroSection';
import { HomeFeaturesSection } from '@/components/marketing/HomeFeaturesSection';
import { HomePricingSection } from '@/components/marketing/HomePricingSection';
import { HomeContactSection } from '@/components/marketing/HomeContactSection';
import { HomeReviewsSection } from '@/components/marketing/HomeReviewsSection';
import { HomeFooterSection } from '@/components/marketing/HomeFooterSection';

const featuredChampionships = [
  { name: 'Campeonato', sport: 'Futsal • Grupos + Mata-mata', dates: '17/06/2026 - 20/06/2026' },
  { name: 'Torneio', sport: 'Futebol • Grupos + Mata-mata', dates: '17/06/2026 - 20/06/2026' },
  { name: 'Racha', sport: 'Terrão • Grupos + Mata-mata', dates: '17/06/2026 - 20/06/2026' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroBackground>
        <MarketingHeader />
        <HomeHeroSection />
      </HeroBackground>

      <HomeFeaturesSection />

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
          <div className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              placeholder="Digite o nome do campeonato"
              className="flex-1 rounded-xl border border-liga-muted/30 bg-white px-5 py-3 font-display text-liga-navy outline-none focus:ring-2 focus:ring-liga-blue"
            />
            <button type="button" className="rounded-xl bg-liga-blue px-8 py-3 font-display font-bold uppercase text-white">
              Encontrar
            </button>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredChampionships.map((item, i) => (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-white bg-white p-6 shadow-md"
              >
                <h3 className="font-display text-2xl font-extrabold text-liga-accent">{item.name}</h3>
                <p className="mt-2 font-display text-base font-semibold text-liga-muted">{item.sport}</p>
                <p className="mt-1 font-display text-base font-semibold text-liga-muted">{item.dates}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <HomePricingSection />
      <HomeContactSection />
      <HomeReviewsSection />
      <HomeFooterSection />
    </div>
  );
}
