import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const badges = [
  { text: '⚽️ Torneio inicia amanhã!', className: 'left-0 top-8' },
  { text: '📋 Novo atleta inscrito', className: 'right-4 top-24' },
  { text: '🏟 Novo local de Jogo', className: 'left-8 bottom-32' },
  { text: '🏆 É Campeão!', className: 'right-0 bottom-16' },
];

export function HomeHeroSection() {
  return (
    <section id="inicio" className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-12 lg:pb-24 lg:pt-12">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl xl:leading-[1.1]">
            Organize seus torneios sem papelzinho!
          </h1>
          <p className="mt-6 font-display text-lg font-medium leading-relaxed text-white/90 sm:text-xl lg:text-2xl xl:text-3xl xl:leading-snug">
            Crie sua competição, gerencie times e atletas, registre resultados, acompanhe estatísticas e muito mais. Tudo em um só lugar!
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/register" className="liga-btn-primary text-center uppercase tracking-wide">
              Criar um torneio
            </Link>
            <a href="#caracteristicas" className="liga-btn-outline text-center uppercase tracking-wide">
              Saiba mais
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-liga-blue/20 via-liga-navy-panel/40 to-liga-navy-deep/80" />
          <div className="absolute inset-x-8 bottom-0 top-12 overflow-hidden rounded-t-[3rem] bg-gradient-to-t from-liga-blue/30 to-transparent">
            <div className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-t from-[#0a1628] via-[#1a3a5c] to-transparent" />
            <div className="absolute bottom-0 left-1/2 h-[78%] w-[55%] -translate-x-1/2">
              <div className="h-full w-full rounded-t-full bg-gradient-to-b from-liga-blue-light/40 to-liga-blue/60 shadow-2xl" />
              <div className="absolute -top-6 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full bg-liga-blue-light/50" />
              <span className="absolute left-1/2 top-[38%] -translate-x-1/2 font-display text-6xl font-black text-white/90">10</span>
            </div>
          </div>
          {badges.map((b) => (
            <div
              key={b.text}
              className={`absolute z-10 max-w-[200px] rounded-xl border border-white/10 bg-liga-panel/90 px-4 py-2.5 font-display text-xs font-bold text-[#ecf7ff] shadow-lg backdrop-blur sm:text-sm ${b.className}`}
            >
              {b.text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
