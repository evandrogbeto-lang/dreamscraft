import { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentBanner } from "@/components/cookie-consent";
import { NotFoundTerminal } from "@/components/not-found-terminal";
import { PageTransitions } from "@/components/PageTransitions";
import { DreamscraftLogo } from "@/components/dreamscraft-logo";
import { supabase } from "@/integrations/supabase/client";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return <NotFoundTerminal />;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="relative z-10 w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <DreamscraftLogo variant="dark" />
        </div>
        <p className="text-xs uppercase tracking-wider text-destructive">Erro ao carregar</p>
        <h1 className="mt-4 text-xl tracking-tight text-brand-branco">Esta página não carregou</h1>
        <p className="mt-3 text-sm text-brand-branco/70">
          Algo deu errado. Tente recarregar a página ou volte para o início.
        </p>
        {error?.message && (
          <pre className="mt-4 max-h-32 overflow-auto rounded border border-brand-branco/20 bg-surface p-3 text-left text-[11px] text-brand-branco/65">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand-rosa px-4 py-2 text-sm font-medium text-brand-roxo transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-branco"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-brand-branco/25 bg-surface px-4 py-2 text-sm font-medium text-brand-branco transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rosa"
          >
            Ir para home
          </a>
        </div>
      </div>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dreamscraft Code — Software sob medida" },
      {
        name: "description",
        content:
          "Forjamos apps, sistemas web e automações com IA. Da ideia ao deploy, com design, código e manutenção.",
      },
      { name: "author", content: "Dreamscraft Code" },
      { property: "og:site_name", content: "Dreamscraft Code" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.png" },
      { property: "og:title", content: "Dreamscraft Code — Software sob medida" },
      { name: "twitter:title", content: "Dreamscraft Code — Software sob medida" },
      {
        property: "og:description",
        content:
          "Forjamos apps, sistemas web e automações com IA. Da ideia ao deploy, com design, código e manutenção.",
      },
      {
        name: "twitter:description",
        content:
          "Forjamos apps, sistemas web e automações com IA. Da ideia ao deploy, com design, código e manutenção.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icone-roxo.png" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/icone-roxo.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Dreamscraft Code",
          url: "https://dreamscraftcode.com",
          logo: "https://dreamscraftcode.com/icone-roxo.png",
          sameAs: [
            "https://www.instagram.com/dreamscraftcode",
            "https://www.linkedin.com/company/dreamscraftcode",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "contato@dreamscraftcode.com",
            areaServed: "BR",
            availableLanguage: ["Portuguese"],
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthListener />
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
          <PageTransitions>
            <Outlet />
          </PageTransitions>
        </main>
        <SiteFooter />
        <WhatsAppButton />
        <CookieConsentBanner />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

function AuthListener() {
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);
  return null;
}
