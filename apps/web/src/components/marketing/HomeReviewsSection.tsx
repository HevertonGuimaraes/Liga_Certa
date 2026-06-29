import { Star } from 'lucide-react';

const reviews = [
  {
    text: '"Uso o Liga Certa há mais de um ano e não consigo mais imaginar gerenciar um campeonato sem ele. Antes, eu perdia horas com tabelas e cálculos."',
    author: 'Carlos M.',
    initial: 'C',
  },
  {
    text: '"Com o Liga Certa tudo ficou muito mais prático. Crio um campeonato em poucos minutos e o sistema gera as tabelas automaticamente."',
    author: 'Juliana R',
    initial: 'J',
  },
  {
    text: '"Várias funcionalidades tornam a gestão mais eficiente: mensagens para os times, tabelas e estatísticas."',
    author: 'Marcos T.',
    initial: 'M',
  },
  {
    text: '"Ferramenta essencial para quem organiza campeonatos. Ganho tempo e tranquilidade."',
    author: 'Patrícia L',
    initial: 'P',
  },
];

function StarRating() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function HomeReviewsSection() {
  return (
    <section className="liga-hero-bg px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-liga-blue">Reviews</p>
        <h2 className="mt-4 font-display text-3xl font-extrabold uppercase text-white lg:text-5xl">
          Nossos clientes aprovam!
        </h2>
        <p className="mx-auto mt-4 max-w-3xl font-display text-lg text-white/70 sm:text-xl">
          Organizadores de campeonatos de todo o Brasil usam o Liga Certa para diversos esportes.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {reviews.map((r) => (
            <article
              key={r.author}
              className="rounded-2xl border border-liga-blue/30 bg-liga-panel/40 p-6 text-left backdrop-blur"
            >
              <StarRating />
              <p className="mt-4 font-display text-sm leading-relaxed text-white/90 sm:text-base">{r.text}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-liga-blue font-display font-bold text-white">
                  {r.initial}
                </div>
                <span className="font-display font-semibold text-white">{r.author}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
