import { Link } from "@tanstack/react-router";
import { whatsappHref } from "@/lib/contact";

const WHATSAPP_HREF = whatsappHref("Olá, vim pelo site e quero conversar sobre um projeto");

const navLinks = [
  { to: "/solucoes", label: "Soluções" },
  { to: "/portfolio", label: "Projetos" },
  { to: "/processo", label: "Processo" },
  { to: "/sobre", label: "Sobre" },
] as const;

const exploreLinks = [
  { to: "/manifesto", label: "Manifesto" },
  { to: "/blog", label: "Blog" },
  { to: "/parceiros", label: "Parceiros" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-brand-branco/15 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] lg:gap-16">
          <div className="max-w-md">
            <p className="text-sm font-medium tracking-tight text-brand-rosa">
              Small team, big systems.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-brand-branco/80">
              Software sob medida para organizar operações, produtos e decisões.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <FooterColumn title="Navegação">
              {navLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex min-h-11 items-center text-sm text-brand-branco/75 transition-colors hover:text-brand-branco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Explorar">
              {exploreLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex min-h-11 items-center text-sm text-brand-branco/75 transition-colors hover:text-brand-branco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Legal">
              <li>
                <Link
                  to="/privacidade"
                  className="inline-flex min-h-11 items-center text-sm text-brand-branco/75 transition-colors hover:text-brand-branco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Privacidade
                </Link>
              </li>
              <li>
                <a
                  href="mailto:dpo@dreamscraftcode.com"
                  className="inline-flex min-h-11 items-center text-sm text-brand-branco/75 transition-colors hover:text-brand-branco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  DPO
                </a>
              </li>
              <li>
                {/* Âncora futura em /privacidade — conteúdo da página não alterado nesta fase. */}
                <Link
                  to="/privacidade"
                  hash="acessibilidade"
                  className="inline-flex min-h-11 items-center text-sm text-brand-branco/75 transition-colors hover:text-brand-branco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Acessibilidade
                </Link>
              </li>
            </FooterColumn>

            <FooterColumn title="Contato">
              <li>
                <a
                  href="mailto:contato@dreamscraftcode.com"
                  className="inline-flex min-h-11 items-center break-all text-sm text-brand-branco/75 transition-colors hover:text-brand-branco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  contato@dreamscraftcode.com
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-sm text-brand-branco/75 transition-colors hover:text-brand-branco focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  WhatsApp
                </a>
              </li>
            </FooterColumn>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-branco/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[11px] uppercase tracking-[0.14em] text-brand-branco/55">
            Dreamscraft.Code · Software sob medida · Automação · Produtos digitais
          </p>
          <p className="text-[11px] text-brand-branco/55">© 2026 Dreamscraft.Code</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-brand-azul">{title}</p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}
