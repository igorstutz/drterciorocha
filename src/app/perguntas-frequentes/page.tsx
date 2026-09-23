import type { Metadata } from "next";
import { faqs, whatsappUrl, disclaimer } from "@/content/site";
import { Button, Eyebrow, Breadcrumbs } from "@/components/ui";
import { Faq } from "@/components/Faq";
import { JsonLd, graph, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Perguntas frequentes sobre células-tronco",
  description:
    "Respostas diretas sobre tratamento com células-tronco, primeira consulta, condições avaliadas e idade biológica, pelo consultório do Dr. Tércio Rocha.",
  alternates: { canonical: "/perguntas-frequentes" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "Perguntas frequentes", url: "/perguntas-frequentes" },
];

export default function PerguntasFrequentes() {
  return (
    <>
      <section className="bg-ink-900 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="u-container">
          <Breadcrumbs trail={trail} dark />
          <h1 className="mt-6 max-w-3xl text-display text-bone-50">
            Perguntas frequentes
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-bone-100/70">
            As dúvidas que mais chegam ao consultório, respondidas de forma direta.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="u-container">
          <div className="mx-auto max-w-3xl">
            <Faq items={faqs} />

            <div className="mt-16 rounded-card border border-ink-900/10 bg-bone-50 p-9 text-center md:p-12">
              <Eyebrow>Não encontrou sua dúvida?</Eyebrow>
              <h2 className="mt-4 text-title">A equipe responde pelo WhatsApp</h2>
              <p className="mx-auto mt-4 max-w-lg text-[1rem] leading-relaxed text-text-body">
                Sem cobrança e sem compromisso. Conte o seu caso e descubra se a
                medicina regenerativa se aplica a ele.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href={whatsappUrl()} variant="primary" external>
                  Falar no WhatsApp
                </Button>
                <Button href="/consulta" variant="ghost">
                  Preencher formulário
                </Button>
              </div>
            </div>

            <p className="mt-12 text-[0.82rem] leading-relaxed text-text-muted">
              {disclaimer}
            </p>
          </div>
        </div>
      </section>

      <JsonLd data={graph(faqSchema, breadcrumbSchema(trail))} />
    </>
  );
}
