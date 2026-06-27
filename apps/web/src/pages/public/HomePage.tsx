import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MarketingHeader, HeroBackground } from '@/components/layout/MarketingLayout';

const featuredChampionships = [
  { name: 'Campeonato', sport: 'Futsal • Grupos + Mata-mata', dates: '17/06/2026 - 20/06/2026' },
  { name: 'Torneio', sport: 'Futebol • Grupos + Mata-mata', dates: '17/06/2026 - 20/06/2026' },
  { name: 'Racha', sport: 'Terrão • Grupos + Mata-mata', dates: '17/06/2026 - 20/06/2026' },
];

const features = [
  { title: 'Tudo para organizar seu torneio!', desc: 'Gerencie campeonatos, publique tabelas, resultados, fotos e vídeos.' },
  { title: 'Gestão de equipe', desc: 'Cadastre e gerencie a equipe de apoio do seu torneio.' },
  { title: 'Estatísticas em tempo real', desc: 'Classificação, artilharia e relatórios atualizados automaticamente.' },
  { title: 'Súmula das partidas', desc: 'Imprima o relatório de cada jogo do seu torneio.' },
];

const reviews = [
  { text: '"Uso o Liga Certa há mais de um ano e não consigo mais imaginar gerenciar um campeonato sem ele."', author: 'Carlos M.', initial: 'C' },
  { text: '"Com o Liga Certa tudo ficou muito mais prático. Crio um campeonato em poucos minutos."', author: 'Juliana R', initial: 'J' },
  { text: '"Várias funcionalidades tornam a gestão mais eficiente: mensagens para os times, tabelas e estatísticas."', author: 'Marcos T.', initial: 'M' },
  { text: '"Ferramenta essencial para quem organiza campeonatos. Ganho tempo e tranquilidade."', author: 'Patrícia L', initial: 'P' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroBackground>
        <MarketingHeader />
        <section id="inicio" className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-12 lg:pb-32 lg:pt-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <h1 className="font-heading text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl lg:leading-[1.1]">
              Organize seus torneios sem papelzinho!
            </h1>
            <p className="mt-6 font-display text-xl font-medium leading-relaxed text-white/90 sm:text-2xl lg:text-4xl lg:leading-snug">
              Crie sua competição, gerencie times e atletas, registre resultados, acompanhe estatísticas e muito mais. Tudo em um só lugar!
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/register" className="liga-btn-primary text-center">Criar um torneio</Link>
              <a href="#caracteristicas" className="liga-btn-outline text-center">Saiba mais</a>
            </div>
          </motion.div>
        </section>
      </HeroBackground>

      <section id="campeonatos" className="bg-liga-surface px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-extrabold text-liga-navy sm:text-4xl lg:text-6xl">Campeonatos em destaques</h2>
          <p className="mt-4 max-w-3xl font-display text-lg text-liga-muted sm:text-2xl">
            Confira os campeonatos criados na Liga Certa e acompanhe os resultados.
          </p>
          <div className="mt-8 flex max-w-xl gap-3">
            <input
              placeholder="Digite o nome do campeonato"
              className="flex-1 rounded-xl border border-liga-muted/30 bg-white px-5 py-3 font-display text-liga-navy outline-none focus:ring-2 focus:ring-liga-blue"
            />
            <button type="button" className="rounded-xl bg-liga-blue px-6 py-3 font-display font-bold text-white">ENCONTRAR</button>
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

      <section id="caracteristicas" className="liga-hero-bg px-6 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-extrabold text-white lg:text-5xl">características</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-liga-panel/80 p-8 backdrop-blur"
              >
                <h3 className="font-display text-2xl font-bold text-white">{f.title}</h3>
                <p className="mt-3 font-display text-lg text-white/80">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-liga-blue">Reviews</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-liga-navy lg:text-5xl">NOSSOS CLIENTES APROVAM!</h2>
          <p className="mx-auto mt-4 max-w-3xl font-display text-xl text-liga-muted">
            Organizadores de campeonatos de todo o Brasil usam o Liga Certa para diversos esportes.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {reviews.map((r) => (
              <article key={r.author} className="rounded-2xl border border-liga-surface bg-liga-surface/50 p-8 text-left">
                <p className="font-display text-lg text-liga-navy">{r.text}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-liga-blue font-display font-bold text-white">
                    {r.initial}
                  </div>
                  <span className="font-display font-semibold text-liga-navy">{r.author}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="liga-hero-bg px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-extrabold text-white lg:text-5xl">Planos</h2>
          <p className="mt-4 font-display text-xl text-white/80">O jeito mais fácil de criar e gerenciar campeonatos esportivos.</p>
          <Link to="/register" className="liga-btn-primary mt-10 inline-flex">Começar agora</Link>
        </div>
      </section>

      <footer id="contato" className="bg-liga-navy px-6 py-16 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-bold text-white">Liga Certa</p>
            <p className="mt-2 font-display text-white/60">Gestão esportiva inteligente.</p>
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase text-white/50">Menu</p>
            <ul className="mt-4 space-y-2 font-display text-white/80">
              <li><a href="#inicio">Início</a></li>
              <li><a href="#caracteristicas">Características</a></li>
              <li><a href="#campeonatos">Campeonatos</a></li>
              <li><a href="#planos">Planos</a></li>
            </ul>
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase text-white/50">Utilidades</p>
            <ul className="mt-4 space-y-2 font-display text-white/80">
              <li><Link to="/register">Criar conta</Link></li>
              <li><Link to="/login">Acessar conta</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase text-white/50">Contatos</p>
            <ul className="mt-4 space-y-2 font-display text-white/80">
              <li>suporte@ligacerta.com</li>
              <li>Whatsapp</li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-center font-display text-sm text-white/50">
          © 2026 Liga Certa. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
