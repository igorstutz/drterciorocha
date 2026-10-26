import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { WhatsAppGate } from "@/components/WhatsAppGate";
import { AnimacaoEmVista } from "@/components/AnimacaoEmVista";
import { MetaPixel } from "@/components/MetaPixel";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import {
  graph,
  physicianSchema,
  personSchema,
  organizationSchema,
  websiteSchema,
  JsonLd,
} from "@/lib/jsonld";

/**
 * Cabeçalho, rodapé, WhatsApp, pixels e o schema da entidade: tudo o que envolve as páginas
 * públicas. Fica fora do layout raiz para o painel (/admin) não carregar nada disso; o 404 e a
 * pré-visualização do painel usam o mesmo invólucro. `rastrear={false}` deixa de fora o pixel e
 * o Analytics (a pré-visualização não é visita).
 */
export function ChromeDoSite({
  children,
  rastrear = true,
}: {
  children: React.ReactNode;
  rastrear?: boolean;
}) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-btn focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-bone-50"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFab />
      <WhatsAppGate />
      <AnimacaoEmVista />
      {rastrear && (
        <>
          <MetaPixel />
          <GoogleAnalytics />
        </>
      )}
      <JsonLd data={graph(physicianSchema, personSchema, organizationSchema, websiteSchema)} />
    </>
  );
}
