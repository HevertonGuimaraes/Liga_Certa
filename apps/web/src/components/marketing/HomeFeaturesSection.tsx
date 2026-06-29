import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function SumulaMockup() {
  return (
    <div className="rounded-xl bg-white p-4 text-left shadow-xl">
      <p className="font-display text-sm font-bold text-black">Súmula - Jogo 03</p>
      <div className="mt-3 space-y-1 font-display text-xs text-gray-600">
        <p>Time A vs Time B</p>
        <p>Placar: 2 × 1</p>
        <p>Gols: 12&apos;, 34&apos; — 55&apos;</p>
      </div>
      <div className="mt-3 h-1.5 w-full rounded bg-liga-blue/30" />
    </div>
  );
}

function StandingsMockup() {
  return (
    <div className="rounded-xl bg-white/95 p-3 text-left shadow-xl">
      <p className="font-display text-xs font-bold text-liga-accent">RVL × VVC</p>
      <p className="mt-2 font-display text-[10px] font-bold uppercase text-gray-500">Grupo A</p>
      <table className="mt-1 w-full font-display text-[10px] text-gray-700">
        <thead>
          <tr className="border-b text-gray-400">
            <th className="py-1 text-left">#</th>
            <th className="text-left">Time</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {['Alpha', 'Beta', 'Gamma'].map((t, i) => (
            <tr key={t} className="border-b border-gray-100">
              <td className="py-1">{i + 1}</td>
              <td>{t}</td>
              <td className="text-center font-bold text-liga-blue">{9 - i * 2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatsMockup() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-white/95 p-3 shadow-lg">
        <p className="font-display text-xs font-bold text-liga-navy">Resumo do jogo</p>
        <p className="mt-1 font-display text-lg font-black text-liga-blue">3 × 2</p>
      </div>
      <div className="rounded-xl bg-white/95 p-3 shadow-lg">
        <p className="font-display text-xs font-bold text-liga-navy">Artilheiros</p>
        <ul className="mt-2 space-y-1 font-display text-[10px] text-gray-700">
          <li>1. Neymar Jr — 8 gols</li>
          <li>2. Ronaldo — 6 gols</li>
          <li>3. Marta — 5 gols</li>
        </ul>
      </div>
    </div>
  );
}

function TeamAvatarsMockup() {
  const colors = ['bg-liga-blue', 'bg-liga-blue-dark', 'bg-liga-blue-light', 'bg-liga-accent', 'bg-liga-panel'];
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {colors.map((c, i) => (
        <div
          key={i}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${c} font-display text-sm font-bold text-white shadow-md sm:h-14 sm:w-14`}
        >
          {String.fromCharCode(65 + i)}
        </div>
      ))}
    </div>
  );
}

export function HomeFeaturesSection() {
  return (
    <section id="caracteristicas" className="liga-hero-bg px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-3xl font-extrabold capitalize text-white lg:text-5xl">características</h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          {/* Súmula */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-liga-panel/60 p-6 backdrop-blur lg:col-span-4"
          >
            <h3 className="font-display text-xl font-bold text-[#ebf7ff]">Súmula das partidas</h3>
            <p className="mt-2 font-display text-sm text-[#d1efff]">Imprima o relatório de cada jogo do seu torneio</p>
            <div className="mt-6"><SumulaMockup /></div>
          </motion.article>

          {/* Tudo para organizar */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-white/10 bg-liga-panel/60 p-6 backdrop-blur lg:col-span-8"
          >
            <h3 className="font-display text-2xl font-bold text-[#ebf7ff] lg:text-3xl">
              Tudo para organizar seu torneio!
            </h3>
            <p className="mt-2 max-w-2xl font-display text-sm text-[#d1efff] lg:text-base">
              Gerencie campeonatos, publique tabelas, resultados, fotos e vídeos.
            </p>
            <div className="mt-6 max-w-sm"><StandingsMockup /></div>
          </motion.article>

          {/* Gestão de equipe */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-liga-panel/60 p-6 backdrop-blur lg:col-span-4"
          >
            <h3 className="font-display text-xl font-bold text-[#ebf7ff]">Gestão de equipe</h3>
            <p className="mt-2 font-display text-sm text-[#d1efff]">Cadastre e gerencie a equipe de apoio do seu torneio.</p>
            <div className="mt-8"><TeamAvatarsMockup /></div>
          </motion.article>

          {/* Estatísticas */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl border border-white/10 bg-liga-panel/60 p-6 backdrop-blur lg:col-span-4"
          >
            <h3 className="font-display text-xl font-bold text-[#ebf7ff]">Estatísticas em tempo real</h3>
            <p className="mt-2 font-display text-sm text-[#d1efff]">Classificação, artilharia e relatórios atualizados automaticamente.</p>
            <div className="mt-6"><StatsMockup /></div>
          </motion.article>

          {/* Gerador automático */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-between rounded-3xl border border-liga-blue/30 bg-gradient-to-br from-liga-blue/20 to-liga-panel/60 p-6 backdrop-blur lg:col-span-4"
          >
            <div>
              <h3 className="font-display text-xl font-bold text-[#ebf7ff]">Gerador automático de partidas</h3>
              <p className="mt-3 font-display text-sm leading-relaxed text-[#d1efff]">
                Cadastre times, sorteie grupos e já monte as fases do seu torneio. Nossa ferramenta constrói partidas de forma inteligente, sem que você precise se preocupar com sorteios ou frequências.
              </p>
            </div>
            <Link to="/register" className="liga-btn-primary mt-6 w-full text-center text-base sm:text-lg">
              Assinar agora
            </Link>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
