import { Mail, MessageCircle, Send } from 'lucide-react';

export function HomeContactSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-liga-blue to-liga-blue-dark px-6 py-20 lg:px-12 lg:py-28">
      <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border-[20px] border-white/10 opacity-40" />
      <div className="pointer-events-none absolute right-10 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-white/5" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <p className="font-display text-2xl font-bold text-white sm:text-3xl">Está com dúvidas?</p>
          <h2 className="mt-2 font-display text-3xl font-black text-white sm:text-5xl lg:text-6xl">
            Fale com a nossa equipe!
          </h2>
          <p className="mt-4 font-display text-lg font-bold text-white/90 sm:text-2xl">
            Vamos responder o mais rápido possível.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 font-display text-lg font-bold text-liga-blue shadow-lg transition hover:bg-white/90"
          >
            <MessageCircle className="h-6 w-6" />
            Conversar pelo whatsapp
          </a>
          <div className="flex gap-3">
            <a
              href="mailto:suporte@ligacerta.com"
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="E-mail"
            >
              <Mail className="h-6 w-6" />
            </a>
            <a
              href="https://t.me/ligacerta"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Telegram"
            >
              <Send className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
