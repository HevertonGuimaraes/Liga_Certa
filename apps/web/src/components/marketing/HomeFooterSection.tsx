import { Link } from 'react-router-dom';

export function HomeFooterSection() {
  return (
    <footer id="contato" className="relative overflow-hidden bg-liga-navy">
      <div className="px-6 py-16 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-liga-blue font-display text-lg font-extrabold text-white">
                LC
              </div>
              <span className="font-display text-2xl font-bold text-white">Liga Certa</span>
            </div>
            <p className="mt-4 font-display text-white/60">
              O jeito mais fácil de criar e gerenciar campeonatos esportivos.
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase text-white/50">Menu</p>
            <ul className="mt-4 space-y-2 font-display text-white/80">
              <li><a href="#inicio" className="hover:text-white">Início</a></li>
              <li><a href="#caracteristicas" className="hover:text-white">Características</a></li>
              <li><a href="#campeonatos" className="hover:text-white">Campeonatos</a></li>
              <li><a href="#planos" className="hover:text-white">Planos</a></li>
              <li><a href="#contato" className="hover:text-white">Fale conosco</a></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase text-white/50">Utilidades</p>
            <ul className="mt-4 space-y-2 font-display text-white/80">
              <li><a href="#campeonatos" className="hover:text-white">Ver competições</a></li>
              <li><Link to="/register" className="hover:text-white">Criar conta</Link></li>
              <li><Link to="/login" className="hover:text-white">Acessar conta</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase text-white/50">Contatos</p>
            <ul className="mt-4 space-y-2 font-display text-white/80">
              <li>
                <a href="mailto:suporte@ligacerta.com" className="hover:text-white">suporte@ligacerta.com</a>
              </li>
              <li>
                <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Whatsapp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-center font-display text-sm text-white/50">
          © 2026 Liga Certa. Todos os direitos reservados.
        </p>
      </div>

      <div className="liga-footer-wave h-24 w-full" aria-hidden />
    </footer>
  );
}
