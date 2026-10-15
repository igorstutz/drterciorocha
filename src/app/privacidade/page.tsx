import type { Metadata } from "next";
import { PRIVACIDADE_ATUALIZADA, SECOES_PRIVACIDADE } from "@/content/privacidade";
import { Breadcrumbs, Button, Eyebrow } from "@/components/ui";
import { JsonLd, graph, breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Como a Clínica Tércio Rocha trata os dados de quem entra em contato pelo site e pelo WhatsApp: o que recebemos, para que usamos, com quem compartilhamos e os seus direitos pela LGPD.",
  alternates: { canonical: "/privacidade" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "Política de privacidade", url: "/privacidade" },
];

export default function Privacidade() {
  return (
    <>
      <section className="bg-ink-900 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="u-container">
          <Breadcrumbs trail={trail} dark />
          <div className="mt-6">
            <Eyebrow tone="muted">LGPD</Eyebrow>
          </div>
          <h1 className="mt-4 max-w-3xl text-display text-bone-50">
            Política de <span className="u-accent text-gold-400">privacidade</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-bone-100/70">
            O que recebemos quando você fala com a clínica, por que usamos, com quem compartilhamos e
            como você controla os seus dados.
          </p>
          <p className="mt-4 text-[0.85rem] text-bone-100/50">Última atualização: {PRIVACIDADE_ATUALIZADA}</p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="u-container">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Seções desta política" className="rounded-card border border-ink-900/10 bg-bone-50 p-6 md:p-8">
              <p className="u-eyebrow text-gold-600">Nesta página</p>
              <ol className="mt-4 grid gap-2 text-[0.92rem] text-text-body sm:grid-cols-2">
                {SECOES_PRIVACIDADE.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="transition-colors hover:text-gold-700">
                      {s.titulo}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="prose-artigo mt-14">
              {SECOES_PRIVACIDADE.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <h2>{s.titulo}</h2>
                  {s.paragrafos.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {s.lista && (
                    <ul className="list-disc space-y-2 pl-5 marker:text-gold-600">
                      {s.lista.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {s.fecho?.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </section>
              ))}
            </div>

            <div className="mt-16 rounded-card border border-ink-900/10 bg-bone-50 p-9 text-center md:p-12">
              <Eyebrow>Dúvidas sobre os seus dados?</Eyebrow>
              <h2 className="mt-4 text-title">Fale com a equipe</h2>
              <p className="mx-auto mt-4 max-w-lg text-[1rem] leading-relaxed text-text-body">
                Pedidos de acesso, correção ou exclusão são atendidos pelo WhatsApp ou pelo formulário de
                contato. É só dizer que o assunto é privacidade.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="/consulta" variant="primary">
                  Formulário de contato
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(breadcrumbSchema(trail))} />
    </>
  );
}
