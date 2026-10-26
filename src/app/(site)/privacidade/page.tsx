import type { Metadata } from "next";
import { PRIVACIDADE_ATUALIZADA, SECOES_PRIVACIDADE } from "@/content/privacidade";
import { Button, Eyebrow } from "@/components/ui";
import { HeroPagina } from "@/components/HeroPagina";
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

/** O título vem como "1. Quem é responsável…": o número vira um selo à parte. */
function partes(titulo: string) {
  const m = /^(\d+)\.\s*(.*)$/.exec(titulo);
  return m ? { n: m[1].padStart(2, "0"), texto: m[2] } : { n: "", texto: titulo };
}

export default function Privacidade() {
  return (
    <>
      <HeroPagina
        trail={trail}
        selo="LGPD"
        titulo={
          <>
            Política de <span className="u-accent text-gold-400">privacidade</span>
          </>
        }
        chamada="O que recebemos quando você fala com a clínica, por que usamos, com quem compartilhamos e como você controla os seus dados."
        rodape={
          <span className="inline-flex items-center gap-2 rounded-full border border-bone-100/12 bg-bone-100/[0.04] px-3.5 py-1.5 text-[0.8rem] text-bone-100/65">
            Última atualização: {PRIVACIDADE_ATUALIZADA}
          </span>
        }
      />

      <section className="py-20 md:py-28">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16 xl:gap-20">
            <nav aria-label="Seções desta política" className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-card border border-ink-900/10 bg-bone-50 p-6">
                <p className="u-eyebrow text-gold-700">Nesta página</p>
                <ol className="mt-4 space-y-0.5 text-[0.88rem]">
                  {SECOES_PRIVACIDADE.map((s) => {
                    const p = partes(s.titulo);
                    return (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="flex gap-3 rounded-btn px-2.5 py-2 leading-snug text-text-body transition-colors hover:bg-bone-200/70 hover:text-gold-700"
                        >
                          <span className="font-accent italic text-gold-600">{p.n}</span>
                          <span>{p.texto}</span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </nav>

            <div className="min-w-0 max-w-3xl">
              {SECOES_PRIVACIDADE.map((s, i) => {
                const p = partes(s.titulo);
                return (
                  <section
                    key={s.id}
                    id={s.id}
                    className={`scroll-mt-28 ${i > 0 ? "mt-14 border-t border-ink-900/8 pt-14" : ""}`}
                  >
                    <div className="flex items-baseline gap-4">
                      {p.n && <span className="font-accent text-[2rem] leading-none italic text-gold-600">{p.n}</span>}
                      <h2 className="text-[1.45rem] leading-snug font-medium tracking-tight text-text-strong md:text-[1.65rem]">
                        {p.texto}
                      </h2>
                    </div>
                    <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed text-text-body">
                      {s.paragrafos.map((t) => (
                        <p key={t}>{t}</p>
                      ))}
                      {s.lista && (
                        <ul className="space-y-3">
                          {s.lista.map((item) => (
                            <li key={item} className="relative pl-6">
                              <span aria-hidden="true" className="absolute left-0.5 top-[0.62em] h-1.5 w-1.5 rotate-45 bg-gold-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {s.fecho?.map((t) => (
                        <p key={t}>{t}</p>
                      ))}
                    </div>
                  </section>
                );
              })}

              <div className="u-grain relative isolate mt-16 overflow-hidden rounded-card bg-ink-900 p-8 text-center md:p-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(77_130_220/0.28),transparent_68%)]"
                />
                <div className="relative z-10">
                  <Eyebrow tone="muted">Dúvidas sobre os seus dados?</Eyebrow>
                  <h2 className="mt-4 text-title text-bone-50">Fale com a equipe</h2>
                  <p className="mx-auto mt-4 max-w-lg text-[1rem] leading-relaxed text-bone-100/65">
                    Pedidos de acesso, correção ou exclusão são atendidos pelo WhatsApp ou pelo formulário de
                    contato. É só dizer que o assunto é privacidade.
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button href="/consulta" variant="gold">
                      Formulário de contato
                    </Button>
                    <Button whatsapp={{ local: "privacidade" }} variant="ghostDark">
                      Falar no WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(breadcrumbSchema(trail))} />
    </>
  );
}
