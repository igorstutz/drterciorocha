import Image from "next/image";
import Link from "next/link";
import { IconeArea } from "@/components/IconeArea";
import type { Metadata } from "next";
import { doctor, indications, consultaFaqIds, pickFaqs } from "@/content/site";
import { Eyebrow, Breadcrumbs, Rule } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";
import { Faq } from "@/components/Faq";
import { JsonLd, graph, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  /* absolute: com o template o nome do médico sairia duas vezes. */
  title: { absolute: "Agendar consulta com o Dr. Tércio Rocha | Células-tronco" },
  description:
    "Conte seu caso e a equipe do Dr. Tércio Rocha retorna pelo WhatsApp para agendar a avaliação. Sem cobrança e sem compromisso.",
  alternates: { canonical: "/consulta" },
};

const trail = [
  { name: "Início", url: "/" },
  { name: "Agendar consulta", url: "/consulta" },
];

const perguntas = pickFaqs(consultaFaqIds);

export default function Consulta() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-900 pt-32 pb-20 md:pt-40 md:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgb(47_124_104/0.16),transparent_66%)] blur-2xl"
        />
        <div className="u-container relative">
          <Breadcrumbs trail={trail} dark />

          <div className="mt-8 grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <Eyebrow tone="muted">Primeiro passo</Eyebrow>
              <h1 className="mt-5 text-display text-bone-50">
                Agende sua avaliação com o{" "}
                <span className="u-accent text-gold-400">Dr. Tércio Rocha</span>
              </h1>
              <p className="mt-6 max-w-xl text-lead text-bone-100/72">
                O primeiro passo é entender o seu caso. Preencha o formulário e a
                equipe entra em contato pelo WhatsApp para conhecer seu histórico,
                suas queixas e seus objetivos antes de agendar a avaliação com o Dr.
                Tércio.
              </p>

              <Rule className="my-10 max-w-md" />

              <ol className="space-y-7">
                {[
                  [
                    "Você conta o seu caso",
                    "Leva menos de um minuto. Quanto mais detalhe, melhor a triagem.",
                  ],
                  [
                    "A equipe faz o retorno",
                    "Pelo WhatsApp, para entender histórico, exames e o que mais limita você hoje.",
                  ],
                  [
                    "Avaliação com o Dr. Tércio",
                    "A conduta é definida caso a caso. Não existe protocolo pronto.",
                  ],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-chip border border-gold-500/40 font-display text-[1rem] text-gold-400">
                      {i + 1}
                    </span>
                    <div>
                      <h2 className="font-display text-[1.15rem] text-bone-50">{t}</h2>
                      <p className="mt-1.5 text-[0.94rem] leading-relaxed text-bone-100/60">
                        {d}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-11 flex items-center gap-4 rounded-card border border-bone-100/12 bg-bone-100/5 p-5">
                <Image
                  src="/img/tercio-retrato.webp"
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-[0.95rem] font-medium text-bone-50">
                    {doctor.name}
                  </p>
                  <p className="mt-0.5 text-[0.8rem] text-bone-100/55">
                    {doctor.crm.join(" · ")}
                  </p>
                </div>
              </div>

              {/* Sem atalho direto para o WhatsApp: a conversa abre depois do
                  envio do formulário ao lado, com os dados já registrados. */}
              <p className="mt-8 text-[0.9rem] text-bone-100/60">
                Prefere conversar pelo WhatsApp? Depois de enviar o formulário, a
                conversa com a equipe abre com um clique.
              </p>
            </div>

            <div
              id="formulario"
              className="rounded-card bg-bone-100 p-7 shadow-[0_32px_80px_-32px_rgb(0_0_0/0.5)] md:p-10"
            >
              <h2 className="text-title">Deu o primeiro passo. A equipe cuida do resto.</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-text-body">
                Preencha com seus dados e o motivo do contato. Retornaremos para
                alinhar as próximas etapas com você.
              </p>
              <div className="mt-8">
                <LeadForm origem="consulta" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="u-container">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Áreas de indicação</Eyebrow>
            <h2 className="mt-4 text-title">
              Quais condições podem ser avaliadas com células-tronco
            </h2>
            <p className="mt-5 text-[1rem] leading-relaxed text-text-body">
              As células-tronco atuam na regeneração de tecidos e funções. Câncer
              sólido não é tratado.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {indications.map((i) => (
              <Link
                key={i.slug}
                href={`/tratamentos/${i.slug}`}
                className="group u-halo relative flex flex-col overflow-hidden rounded-card border border-ink-900/10 bg-bone-50 p-7 transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:border-gold-500/45 hover:shadow-lift-hover"
              >
                <div className="relative z-10 flex flex-1 flex-col">
                  <span className="grid h-11 w-11 place-items-center rounded-btn bg-ink-900 text-gold-400 transition-colors duration-500 group-hover:bg-gold-600 group-hover:text-ink-900">
                    <IconeArea slug={i.slug} className="h-[1.35rem] w-[1.35rem] stroke-current" />
                  </span>
                  <h3 className="mt-5 text-[1.15rem] leading-tight transition-colors group-hover:text-gold-700">{i.title}</h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-text-body">{i.description}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[0.82rem] font-semibold text-gold-700">
                    Ver tratamento
                    <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current transition-transform duration-500 group-hover:translate-x-1.5" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone-200/50 py-20 md:py-24">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <Eyebrow>Antes de decidir</Eyebrow>
              <h2 className="mt-4 text-title">Perguntas frequentes antes da consulta</h2>
            </div>
            <Faq items={perguntas} />
          </div>
        </div>
      </section>

      <JsonLd data={graph(breadcrumbSchema(trail), faqSchema(perguntas, "/consulta"))} />
    </>
  );
}
